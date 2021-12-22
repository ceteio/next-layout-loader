module.exports = (
  filename,
  {
    layoutsDir: layoutsDirName = "pages",
    layoutFilenames = [
      "_layout.tsx",
      "_layout.ts",
      "_layout.jsx",
      "_layout.js",
    ],
  } = {}
) => {
  const path = require("path");
  const fs = require("fs");

  const generatedComponentName = "LayoutComponent__Codegen";

  // Figure out where the `pages/` directory is, as an absolute path
  const pagesDir = (() => {
    let dir = path.dirname(filename);
    let base = path.basename(dir);

    while (base && base !== "pages") {
      dir = path.dirname(dir);
      base = path.basename(dir);
    }
    return dir;
  })();

  // Figure out where the `layouts/` directory is, as an absolute path
  const layoutsDir = path.resolve(path.dirname(pagesDir), layoutsDirName);

  // The current page's relative path from `pages/`.
  // Eg; converts
  // `/dev/my-site/pages/dashboard/users/index.js`
  // to
  // `dashboard/users/`
  const pageFileRelativeToPages = path.relative(pagesDir, filename);

  // The ordered list of matching layout files, as absolute paths
  // NOTE: Order here is inner-most first
  const layoutFiles = (() => {
    const result = [];

    let dir = pageFileRelativeToPages;

    // Walk up the layouts directory looking for layout files
    // Eg; when:
    // - filename = `/dev/my-site/pages/dashboard/users/index.js`
    // - layoutsDir = `/dev/my-site/pages/layouts`
    // it will look in each of the following directories:
    // - `/dev/my-site/pages/layouts/dashboard/users`
    // - `/dev/my-site/pages/layouts/dashboard`
    // - `/dev/my-site/pages/layouts`
    do {
      dir = path.dirname(dir);
      const layoutDir = path.resolve(layoutsDir, dir);
      const layoutFilepath = layoutFilenames
        .map((name) => path.join(layoutDir, name))
        .find((filepath) => fs.existsSync(filepath));
      if (layoutFilepath !== undefined) {
        result.push(layoutFilepath);
      }
    } while (dir && dir !== ".");

    return result.map((filepath) => {
      const relativeFilepath = path.relative(path.dirname(filename), filepath);
      // path.relative will strip leading `./`, so we need to put it back
      if (!relativeFilepath.startsWith(".")) {
        return `./${relativeFilepath}`;
      }
      return relativeFilepath;
    });
  })();

  // By returning an IIFE we're able to namespace our variables, and allow the
  // callsite to dictacte the export name while keeping linters happy.
  return `(() => {
    const __dynamic = require('next/dynamic').default;
    ${layoutFiles
      .map(
        (layoutFile, index) => `
          const ${generatedComponentName}${index} = __dynamic(() => import('${layoutFile}'))
        `
      )
      .join("\n")}
    return ({ children, ...props }) => (
      ${
        layoutFiles.length
          ? layoutFiles.reduce(
              (componentString, _, index) => `
                <${generatedComponentName}${index} {...props}>
                  ${componentString}
                </${generatedComponentName}${index}>
              `,
              "{children}"
            )
          : "children"
      }
    );
  })()`;
};
