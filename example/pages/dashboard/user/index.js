import NextLink from "next/link";
const Layout = codegen.require("@ceteio/next-layout-loader", __filename);

export default function User() {
  return (
    <Layout greeting="hello">
      <NextLink href="/">home</NextLink>
    </Layout>
  );
}
