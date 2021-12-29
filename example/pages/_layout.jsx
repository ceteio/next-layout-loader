import { useState } from "react";
import NextLink from "next/link";

export default function Layout({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div style={{ backgroundColor: "#e2e8f0", padding: "1rem" }}>
      <p>
        <code>pages/_layout</code>
        <ul>
          <li>
            <NextLink href="/">/</NextLink>
          </li>
          <li>
            <NextLink href="/dashboard/user">/dashboard/user</NextLink>
          </li>
          <li>
            <NextLink href="/dashboard/user/123">/dashboard/user/123</NextLink>
          </li>
        </ul>
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      </p>
      {children}
    </div>
  );
}

// To hide this layout component from the router / build pipeline
export const getStaticProps = async () => ({ notFound: true });
