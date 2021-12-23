import NextLink from "next/link";
const filename = preval`module.exports = __filename`;
const Layout = codegen.require("@ceteio/next-layout-loader", filename);

export default function User() {
  return (
    <Layout greeting="hello">
      <NextLink href="/">home</NextLink>
    </Layout>
  );
}
