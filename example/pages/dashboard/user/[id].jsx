import NextLink from "next/link";

export default function User({ userId }) {
  return (
    <div style={{ backgroundColor: "#ffffff", padding: "1rem" }}>
      [User {userId}'s profile]
    </div>
  );
}

export async function getStaticProps({ params }) {
  return {
    props: {
      userId: params.id,
      greeting: `Hello ${params.id}`
    }
  };
}

export async function getStaticPaths() {
  return {
    fallback: true,
    paths: []
  };
}
