export default function Layout({ children }) {
  return (
    <div style={{ border: "1px solid gray", padding: "1rem" }}>
      <p>
        <code>pages/_layout</code>
      </p>
      {children}
    </div>
  );
}

// To hide this layout component from the router / build pipeline
export const getStaticProps = async () => ({ notFound: true });
