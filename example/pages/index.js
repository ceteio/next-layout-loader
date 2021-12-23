import NextLink from "next/link";
const filename = preval`module.exports = __filename`;
const Layout = codegen.require("@ceteio/next-layout-loader", filename);

export default function Home() {
  return (
    <Layout>
      <h1>Welcome to Next.js!</h1>
      <NextLink href="/dashboard/user">User Dashboard</NextLink>
    </Layout>
  );
}
