export default function Layout({ greeting, children }) {
  return (
    <div style={{ border: "1px solid blue", padding: "1rem" }}>
      <h1>{greeting}</h1>
      <p>
        <code>pages/dashboard/user/_layout</code>
      </p>
      {children}
    </div>
  );
}

// To hide this layout component from the router / build pipeline
export const getStaticProps = async () => ({ notFound: true });
