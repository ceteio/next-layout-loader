export default function Home() {
  return (
    <div style={{ backgroundColor: "#ffffff", padding: "1rem" }}>
      <h1>
        <code>@ceteio/next-layout-loader</code> Example
      </h1>
      <p>
        This example shows{" "}
        <code>
          <a href="https://github.com/ceteio/next-layout-loader">
            @ceteio/next-layout-loader
          </a>
        </code>{" "}
        automatically loading <code>_layout</code> files from within the{" "}
        <code>pages/</code> directory.
      </p>
      <p>
        Use the nav at the top (rendered in <code>pages/_layout.jsx</code>) to
        browser around. Each layout file specifies its own background color.
      </p>
      <p>
        Layouts also maintain their state across client-side navigations. Click
        the "count" button, then navigate to a new URL using one of the links to
        see it in action.
      </p>
    </div>
  );
}
