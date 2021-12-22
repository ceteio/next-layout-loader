<div align="center">
  <h1>Next Layout Loader</h1>
  <br>
  <br>
  <br>
  <p>
    Automatic next.js layout component loader
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
yarn add @ceteio/next-layout-loader babel-plugin-codegen babel-plugin-preval
```

## Usage

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

## Required Config

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

## Parameters

```
codegen.require("@ceteio/next-layout-loader", <filename>[, options])
```

### `<filename>`

Absolute path to the current page file.

Ideally, we could pass in `__filename`, however it appears `codegen.require`
will fail when attempting to pass that in directly. The alternative is using
`preval` to convert `__filename` into a string which is passed in:

```javascript
const filename = preval`module.exports = __filename`;
const Layout = codegen.require("@ceteio/next-layout-loader", filename);
```

A further limitation of `preval` prevents inlining the `codegen.require` &
`preval` calls into a single line, requiring the above 2-line format. If you
know how to minimise this boilerplate, please see
[#2](https://github.com/ceteio/next-layout-loader/issues/2).

### `options`

An object of further options to affect how the library loads layout files.

```javascript
codegen.require("@ceteio/next-layout-loader", filename, {
  layoutsDir,
  layoutFilenames,
});
```

#### `options.layoutsDir`

_Default_: `pages`

By default, layout files will be searched within the `pages` directory, however
for some codebases it may be preferrable to keep layout files in a separate
folder.

The folder structure must match that of the `pages/` directory exactly or else
the correct layout files will not be discovered.

For example, use `layoutsDir: 'layouts'`, when working with the following folder
directory:

```
.
├── layouts
│   ├── _layout.tsx
│   └── dashboard
│       ├── _layout.tsx
│       └── user
│           └── _layout.tsx
└── pages
    ├── index.tsx
    └── dashboard
        └── user
            └── index.tsx
```

#### `options.layoutFilenames`

_Default_: `['_layout.tsx', '_layout.ts', '_layout.jsx', '_layout.js']`

The possible variations of layout file names within the `layoutsDir`. Can be
overridden to use any name or extension you like.

## How it works

Given a `pages/` directory like so:

```
pages
├── dashboard
│   ├── _layout.tsx
│   └── user
│       ├── index.tsx
│       └── _layout.tsx
├── index.tsx
└── _layout.tsx
```

And a page `pages/dashboard/user/index.tsx`:

```javascript
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

`next-layout-loader` will transform the above code into (approximately):

```javascript
import dynamic from 'next/dynamic';

const LayoutComp0 = dynamic(() => import('./layout.tsx'));
const LayoutComp1 = dynamic(() => import('../layout.tsx'));
const LayoutComp2 = dynamic(() => import('../../layout.tsx'));

const Layout = ({ children, ...props }) => (
  <LayoutComp2 {...props>
    <LayoutComp1 {...props>
      <LayoutComp0 {...props>
        {children}
      </LayoutComp0>
    </LayoutComp1>
  </LayoutComp2>
);

export default function User() {
  return (
    <Layout>
      <h1>Hello world</h1>
    </Layout>
  );
}
```

## Frequently Asked Questions

### Why does this exist?

This library started as Proof Of Concept based on [a
discussion](https://github.com/vercel/next.js/discussions/26389#discussioncomment-922493)
in the Next.js repo, but it turned out to work quite well and match my mental
model of how nested layouts should work. So I turned it into a library that
anyone can use.
