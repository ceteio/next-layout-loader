const filename = preval`module.exports = __filename`;
const withLayoutLoader = codegen.require(
  "@ceteio/next-layout-loader",
  filename
);

export default withLayoutLoader(({ Component, pageProps }) => (
  <Component {...pageProps} />
));
