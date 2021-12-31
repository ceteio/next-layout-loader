export default function Layout({ children }) {
  return (
    <div style={{ backgroundColor: "#e9d5ff", padding: "1rem" }}>
      <p>
        <code>pages/dashboard/_layout</code>
      </p>
      {children}
    </div>
  );
}

// To hide this layout component from the router / build pipeline
export const getStaticProps = async () => ({ notFound: true });
