const filename = preval`module.exports = __filename`;
const withLayoutLoader = codegen.require("../../src/index.js", filename);

//const renderWithLayout = (() => {
//  const __dynamic = require("next/dynamic").default;
//  const { Fragment } = require("react");
//
//  // A map of directories to their layout components (if they exist)
//  const layoutMap = {
//    "/": __dynamic(() => import("./_layout.jsx")),
//    dashboard: __dynamic(() => import("./dashboard/_layout.jsx")),
//    "dashboard/user": __dynamic(() => import("./dashboard/user/_layout.jsx"))
//  };
//
//  return ({ Component, pageProps, router }) => {
//    const Layout1 = layoutMap["/"] || Fragment;
//    const layout1Props = Layout1 !== Fragment ? pageProps : {};
//
//    // Special case, because "".split('/').length === 1, which conflicts with
//    // "dashboard".split('/').length === 1
//    if (router.route === "/") {
//      return (
//        <Layout1 {...layout1Props}>
//          <Component {...pageProps} />
//        </Layout1>
//      );
//    }
//
//    const parts = (router.route[0] === "/"
//      ? router.route.slice(1)
//      : router.route
//    ).split("/");
//
//    const Layout2 =
//      (parts.length >= 1 && layoutMap[parts.slice(0, 1).join("/")]) || Fragment;
//    const layout2Props = Layout2 !== Fragment ? pageProps : {};
//
//    const Layout3 =
//      (parts.length >= 2 && layoutMap[parts.slice(0, 2).join("/")]) || Fragment;
//    const layout3Props = Layout3 !== Fragment ? pageProps : {};
//
//    const Layout4 =
//      (parts.length >= 3 && layoutMap[parts.slice(0, 3).join("/")]) || Fragment;
//    const layout4Props = Layout4 !== Fragment ? pageProps : {};
//
//    return (
//      <Layout1 {...layout1Props}>
//        <Layout2 {...layout2Props}>
//          <Layout3 {...layout3Props}>
//            <Layout4 {...layout4Props}>
//              <Component {...pageProps} />
//            </Layout4>
//          </Layout3>
//        </Layout2>
//      </Layout1>
//    );
//  };
//})();

export default withLayoutLoader(({ Component, pageProps }) => (
  <Component {...pageProps} />
));
