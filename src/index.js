module.exports = (
  appFilename,
  {
    layoutFilenames = ["_layout.tsx", "_layout.ts", "_layout.jsx", "_layout.js"]
  } = {}
) => {
  const path = require("path");
  const fs = require("fs");

  // Figure out where the `pages/` directory is, as an absolute path
  const pagesDir = path.dirname(appFilename);

  const collectLayouts = (parentDir, filename, result) => {
    const entryPath = path.join(parentDir, filename);
    const entry = fs.lstatSync(entryPath);
    if (entry.isDirectory()) {
      fs.readdirSync(entryPath, {
        withFileTypes: true
      }).forEach(childEntry =>
        collectLayouts(entryPath, childEntry.name, result)
      );
    } else if (layoutFilenames.includes(filename)) {
      result.push(entryPath);
    }
  };

  const layoutFiles = [];
  collectLayouts(path.dirname(pagesDir), path.basename(pagesDir), layoutFiles);

  const maxLayoutDepth =
    layoutFiles.reduce(
      (maxSoFar, layoutFilePath) =>
        Math.max(layoutFilePath.split(path.sep).length, maxSoFar),
      0
    ) - 1;

  const layoutMap = layoutFiles.reduce((memo, layoutFilePath) => {
    const relativePath = path
      .relative(pagesDir, layoutFilePath)
      // Forcibly convert it to a posix-style path since that's what node
      // modules expect, and what Next.js router returns
      .split(path.sep)
      .join(path.posix.sep);
    const key = path.posix.dirname(relativePath).replace(/^\.\//, "");
    memo[key === "." ? "/" : key] = `./${relativePath}`;
    return memo;
  }, {});

  // By returning an IIFE we're able to namespace our variables, and allow the
  // callsite to dictacte the export name while keeping linters happy.
  return `(() => {
    const __dynamic = require("next/dynamic").default;
    const { Fragment } = require("react");

    // A map of directories to their layout components (if they exist)
    const layoutMap = {
      ${Object.entries(layoutMap)
        .map(
          ([key, layoutFilePath]) =>
            `"${key}": __dynamic(() => import("${layoutFilePath}")),`
        )
        .join("\n")}
    };

    return wrappedFn => context => {
      const { pageProps, router } = context;

      const renderedComponent = wrappedFn(context);

      const Layout0 = layoutMap["/"] || Fragment;
      const layout0Props = Layout0 !== Fragment ? pageProps : {};

      // Special case, because "".split('/').length === 1, which conflicts with
      // "dashboard".split('/').length === 1
      if (router.route === "/") {
        return (
          <Layout0 {...layout0Props}>
            {renderedComponent}
          </Layout0>
        );
      }

      const parts = (router.route[0] === "/"
        ? router.route.slice(1)
        : router.route
      ).split("/");

      ${Array.apply(null, Array(maxLayoutDepth))
        .map((_, index) => index + 1)
        .map(
          num => `
            const Layout${num} = (parts.length >= ${num} && layoutMap[parts.slice(0, ${num}).join("/")]) || Fragment;
            const layout${num}Props = Layout${num} !== Fragment ? pageProps : {};

          `
        )
        .join("\n")}

      return (
        ${Array.apply(null, Array(maxLayoutDepth))
          .map((_, index) => index)
          .reverse()
          .reduce(
            (memo, num) => `
              <Layout${num} {...layout${num}Props}>
                ${memo}
              </Layout${num}>
            `,
            "{renderedComponent}"
          )}
      );
    };
  })();`;

  //return `(() => {
  //  const __dynamic = require('next/dynamic').default;
  //  ${layoutFiles
  //    .map(
  //      (layoutFile, index) => `
  //        const ${generatedComponentName}${index} = __dynamic(() => import('${layoutFile}'))
  //      `
  //    )
  //    .join("\n")}
  //  return ({ children, ...props }) => (
  //    ${
  //      layoutFiles.length
  //        ? layoutFiles.reduce(
  //            (componentString, _, index) => `
  //              <${generatedComponentName}${index} {...props}>
  //                ${componentString}
  //              </${generatedComponentName}${index}>
  //            `,
  //            "{children}"
  //          )
  //        : "children"
  //    }
  //  );
  //})();`;
};
