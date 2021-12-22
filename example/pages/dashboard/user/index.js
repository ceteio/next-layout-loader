import NextLink from "next/link";
const Layout = codegen.require("../../../../src/layouts", __filename);

export default function User() {
  return (
    <Layout greeting="hello">
      <NextLink href="/">home</NextLink>
    </Layout>
  );
}
