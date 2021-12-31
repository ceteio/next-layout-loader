# @ceteio/next-layout-loader

## 2.0.0

### Major Changes

- 3a7005b:
  - Only require magic in `pages/_app`, not in every route file.
  - Removed `options.layoutsDir`. `_layout` files must now always be in `pages/`.

## 1.0.0

### Major Changes

- Initial release.

  Add `_layout.tsx` files with default exports in your `pages/` directory:

  ```
  pages
  ├── dashboard
  │   ├── _layout.tsx
  │   └── user
  │       ├── _layout.tsx
  │       └── index.tsx
  ├── _layout.tsx
  └── index.tsx
  ```

  For example:

  ```javascript
  // pages/_layout.tsx
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
  ```

  Next, load the layout component with
  [`preval`](https://github.com/kentcdodds/babel-plugin-preval) &
  [`codegen`](https://github.com/kentcdodds/babel-plugin-codegen):

  ```javascript
  // pages/dashboard/user/index.tsx
  const filename = preval`module.exports = __filename`;
  const Layout = codegen.require("@ceteio/next-layout-loader", filename);

  export default function User() {
    return (
      <Layout>
        <h1>Hello world</h1>
      </Layout>
    );
  }
  ```

  Now, `<Layout>` is a composition of all `_layout.tsx` files found in the
  `pages/` directory from the current file, up to the root (ie;
  `pages/dashboard/user/_layout.tsx`, `pages/dashboard/_layout.tsx`, and
  `pages/_layout.tsx`).
