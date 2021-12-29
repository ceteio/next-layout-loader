import NextLink from "next/link";

export default function User() {
  return (
    <div style={{ backgroundColor: "#ffffff", padding: "1rem" }}>
      [List of user profiles]
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      greeting: "hello user/index.jsx"
    } // will be passed to the page component as props
  };
}
