<div align="center">
  <h1>Next Layout Loader</h1>
  <br>
  <br>
  <br>
  <p>
    File-system based nested layouts for next.js
  </p>
  <p>
    <sup>
      <a href="https://githubbox.com/ceteio/next-layout-loader/tree/main/example" target="_blank">Try it on Codesandbox</a>
    </sup>
  </p>
    <br>
  <br>
  <br>
</div>

```
yarn add @ceteio/next-layout-loader
```

## Usage

Add `_layout.tsx`* files in your `pages/` directory:

```
pages
├── _app.tsx
├── _layout.tsx
├── index.tsx
└── dashboard
    ├── _layout.tsx
    └── user
        ├── _layout.tsx
        └── index.tsx
```

_<sup>* (Supports `.tsx`, `.ts`, `.jsx`, `.js`, or [any
custom filename with the `layoutFilenames` option](#optionslayoutfilenames))</sup>_

For example:

```javascript
// pages/_layout.tsx
import { useState } from "react";

// children is the file-system based component as rendered by next.js
export default function Layout({ children }) {
  // State is maintained between client-side route changes!
  const [count, setCount] = useState(0);
  return (
    <div style={{ border: "1px solid gray", padding: "1rem" }}>
      <p>
        <code>pages/_layout</code>
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      </p>
      {children}
    </div>
  );
}

// To hide this layout component from the router / build pipeline
export const getStaticProps = async () => ({ notFound: true });
```

Next, add some one-time boilerplate to `_app` (_powered by
[`preval`](https://github.com/kentcdodds/babel-plugin-preval) &
[`codegen`](https://github.com/kentcdodds/babel-plugin-codegen)_):

<!-- prettier-ignore -->
```javascript
// pages/_app.jsx
const filename = preval`module.exports = __filename`;
const withLayoutLoader = codegen.require("@ceteio/next-layout-loader", filename);

// Automatically renders _layout files appropriate for the current route
export default withLayoutLoader(({ Component, pageProps }) => (
  <Component {...pageProps} />
));
```

Now load your pages to see the layouts automatically applied!

## Setup

Install all the dependencies:

```
yarn add @ceteio/next-layout-loader
yarn add babel-plugin-codegen@4.1.5 babel-plugin-preval
yarn add patch-package postinstall-postinstall
```

The usage of [`preval`](https://github.com/kentcdodds/babel-plugin-preval) &
[`codegen`](https://github.com/kentcdodds/babel-plugin-codegen) necessitates
using `babel`, and hence opting-out of `swc` _(if you know how to do codegen in
`swc`, please let me know in
[#1](https://github.com/ceteio/next-layout-loader/issues/1)!)_. To ensure the
layout files are loaded correctly, you must include the `codegen` and `preval`
plugins:

`.babelrc`

```json
{
  "presets": ["next/babel"],
  "plugins": ["codegen", "preval"]
}
```

A patch is necessary for `babel-plugin-codegen` to correctly import the
`@ceteio/next-layout-loader` module:

`package.json`

```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

And create a new file `patches/babel-plugin-codegen+4.1.5.patch`:

```
diff --git a/node_modules/babel-plugin-codegen/dist/helpers.js b/node_modules/babel-plugin-codegen/dist/helpers.js
index e292c8a..472d128 100644
--- a/node_modules/babel-plugin-codegen/dist/helpers.js
+++ b/node_modules/babel-plugin-codegen/dist/helpers.js
@@ -99,9 +99,8 @@ function resolveModuleContents({
   filename,
   module
 }) {
-  const resolvedPath = _path.default.resolve(_path.default.dirname(filename), module);
-
-  const code = _fs.default.readFileSync(require.resolve(resolvedPath));
+  const resolvedPath = require.resolve(module, { paths: [_path.default.dirname(filename)] })
+  const code = _fs.default.readFileSync(resolvedPath);

   return {
     code,
```

Then re-run `yarn`.

## Configuration

```
codegen.require("@ceteio/next-layout-loader", <filename>[, options])
```

### `<filename>`

Absolute path to the current page file.

In the simplest case, this can be hard-coded, but wouldn't work on a different
computer, or if you were to move your source files around. Instead, we use
`preval` & `__filename` to automatically generate the correct path for us:

<!-- prettier-ignore -->
```javascript
const filename = preval`module.exports = __filename`;
const withLayoutLoader = codegen.require("@ceteio/next-layout-loader", filename);
```

_(NOTE: This must remain as 2 separate lines. If you know how to minimise this
boilerplate, please see
[#2](https://github.com/ceteio/next-layout-loader/issues/2)_).

### `options`

An object of further options to affect how the library loads layout files.

```javascript
codegen.require("@ceteio/next-layout-loader", filename, {
  layoutFilenames
});
```

#### `options.layoutFilenames`

_Default_: `['_layout.tsx', '_layout.ts', '_layout.jsx', '_layout.js']`

The possible variations of layout file names within `pages/`. Can be overridden
to use any name or extension you like.

## How it works

The easiest way to understand with an example:

```
pages
├── index.tsx
├── _app.tsx
├── _layout.tsx
└── dashboard
    ├── _layout.tsx
    └── user
        ├── index.tsx
        └── _layout.tsx
```

`pages/_app.tsx`:

```javascript
const filename = preval`module.exports = __filename`;
const withLayoutLoader = codegen.require(
  "@ceteio/next-layout-loader",
  filename
);

// Automatically renders _layout files appropriate for the current route
export default withLayoutLoader(({ Component, pageProps }) => (
  <Component {...pageProps} />
));
```

`pages/dashboard/user/index.tsx`:

```javascript
export default function User() {
  return <h1>Hello world</h1>;
}
```

`next-layout-loader` will transform the `pages/app.tsx` into:

```javascript
import dynamic from "next/dynamic";
import { Fragment } from "react";

// A map of directories to their layout components (if they exist)
const layoutMap = {
  "/": __dynamic(() => import("./_layout.jsx")),
  dashboard: __dynamic(() => import("./dashboard/_layout.jsx")),
  "dashboard/user": __dynamic(() => import("./dashboard/user/_layout.jsx"))
};

const withLayoutLoader = wrappedFn => context => {
  const { pageProps, router } = context;

  const renderedComponent = wrappedFn(context);

  return ({ Component, pageProps, router }) => {
    const Layout1 = layoutMap["/"];
    const Layout2 = layoutMap["dashboard"];
    const Layout3 = layoutMap["dashboard/user"];

    return (
      <Layout1 {...pageProps}>
        <Layout2 {...pageProps}>
          <Layout3 {...pageProps}>
            {renderedComponent}
          </Layout3>
        </Layout2>
      </Layout1>
    );
  };
})();

export default withLayoutLoader(({ Component, pageProps }) => (
  <Component {...pageProps} />
));
```

_<sup>(Note: The above is a simplification; the real code has some extra logic to
handle all routes and their layouts)</sup>_

## Frequently Asked Questions

### Why does this exist?

This library started as Proof Of Concept based on [a
discussion](https://github.com/vercel/next.js/discussions/26389#discussioncomment-922493)
in the Next.js repo, but it turned out to work quite well and match my mental
model of how nested layouts should work. So I turned it into a library that
anyone can use.

### Why is an extra layout being applied?

An extra layout component can be unexpectedly rendered when you have the
following situation:

```
pages
├── _layout.tsx
├── user.tsx
└── user
    └── _layout.tsx
```

Visiting `/user` may will render both `pages/_layout.tsx` _and_
`pages/user/_layout.tsx`. This may not be expected (the later is in a child
directory after all!), and is due to a difference in the way Next.js handles
rendering pages vs how `@ceteio/next-layout-loader` loads layouts.

To work around this, move `pages/user.tsx` to `pages/user/index.tsx`:

```diff
 pages
 ├── _layout.tsx
-├── user.tsx
 └── user
+    ├── index.tsx
     └── _layout.tsx
```
