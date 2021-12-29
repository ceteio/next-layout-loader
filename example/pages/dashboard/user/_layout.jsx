export default function Layout({ greeting, children }) {
  return (
    <div style={{ backgroundColor: "#fef3c7", padding: "1rem" }}>
      <p>
        <code>pages/dashboard/user/_layout</code>
      </p>
      <h1>{greeting}</h1>
      {children}
    </div>
  );
}

// To hide this layout component from the router / build pipeline
export const getStaticProps = async () => ({ notFound: true });
