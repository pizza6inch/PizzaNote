---
title: "Webpack Tutorial: Set Up webpack.config.js from Scratch (Loaders, Babel, devServer)"
seoTitle: "Webpack Tutorial: webpack.config.js from Scratch"
description: "A Webpack 5 tutorial from npm init to a complete webpack.config.js: loaders, HtmlWebpackPlugin, Babel, images, devServer and source maps, plus Webpack vs Vite."
publishedAt: "2025-06-09T08:21:44.284Z"
updatedAt: "2026-10-04T00:00:00.000Z"
category: "bundler"
series: "Webpack"
tags: ["front-end-development"]
aliases: ["Webpack"]
---

# Webpack

**Webpack is a JavaScript bundler.** Starting from one entry file, it follows every `import` and `require` to find all the modules you use, transforms JavaScript, CSS, images and other assets, and bundles them into a few files the browser can load directly. In this tutorial we build a small project with Webpack 5 from scratch and write a complete `webpack.config.js` step by step.

> React's old official starter, create-react-app, ran on Webpack, but it was deprecated in February 2025. New React projects mostly use Vite or Next.js today, yet their configuration ideas map directly onto Webpack's, so learning Webpack makes every other tool quicker to pick up.

## Why do we need Webpack?

Modern JavaScript development often uses:

- ES Modules (`import` / `export`)
- TypeScript (`.ts`)
- SCSS / CSS Modules
- React JSX (`.jsx`, `.tsx`)
- Images, fonts and other non-JS assets
- Packages from npm (`import _ from "lodash"`)

The browser can't take all of that as is: JSX, TypeScript and SCSS need compiling, the browser can't resolve npm package paths, and hundreds of small files each costing a request is slow. That's why we use Webpack to "bundle + transpile + optimise".

## ESM vs. CJS

JavaScript has two ways to import modules: ES Modules and CommonJS.

ES Module

```javascript
import fs from "fs";
export default { functionA };
```

CommonJS

```javascript
// a.js
// import
const fs = require("fs");
// export
module.exports = { functionA };
```

| Module system | `import` / `export` (ESM) | `require` / `module.exports` (CommonJS) |
| --- | --- | --- |
| Node.js | ✅ Supported: use the `.mjs` extension, or set `"type": "module"` in package.json | ✅ `.js` files are CommonJS by default |
| Browser | ✅ Supported: load with `<script type="module">` | ❌ Not supported |

If browsers support ESM, why bundle at all? Native ESM won't compile JSX, TypeScript or SCSS, doesn't understand npm paths like `import "lodash"`, and every module is a separate network request. Webpack turns the module syntax you write (ESM or CommonJS) into files the browser can run and bundles them into one or more JavaScript files.

Before bundling:

```javascript
// src/index.js
import generateJoke from "./joke";

console.log(generateJoke());
```

```javascript
// src/joke.js
function generateJoke() {
  return "I don't trust stairs. They're always up to something.";
}

export default generateJoke;
```

After bundling (production mode minifies it):

```javascript
(()=>{"use strict";console.log("I don't trust stairs. They're always up to something.")})();
```

## Step 1: Create the project

```bash
mkdir webpack-starter && cd webpack-starter
npm init -y
npm i -D webpack webpack-cli
```

Folder structure:

```text
webpack-starter/
├── package.json
├── webpack.config.js
└── src/
    ├── index.js
    ├── joke.js
    ├── styles/main.scss
    ├── assets/laughing.svg
    └── template.html
```

Add scripts to package.json:

```json
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack serve"
  }
}
```

## Step 2: config

Webpack is configured in `webpack.config.js` at the project root:

```javascript
const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    bundle: path.resolve(__dirname, "src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name][contenthash].js",
    clean: true,
  },
};
```

- `entry`: where Webpack starts following dependencies. Here the entry is named `bundle`
- In `output.filename`, `[name]` becomes the entry's key, `bundle`
- `[contenthash]` is a hash of the file's contents, so the file name changes whenever the contents change. Browsers download the new name and keep using the cache for files that didn't change
- Because names can change on every build, pair it with `clean: true`, which empties `dist` before each build

Run `npm run build` and `dist` will contain a file like `bundle3f9a2c1e.js`.

## Step 3: Loaders (CSS / SCSS)

Webpack itself only understands JavaScript and JSON; loaders transform every other file type.

```bash
npm i -D sass style-loader css-loader sass-loader
```

`test` takes a regular expression; matching files (here `.scss`) go through the loaders in `use`, which run **right to left**: `sass-loader` compiles SCSS to CSS → `css-loader` resolves `@import` and `url()` → `style-loader` injects the styles into a `<style>` tag.

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
```

Then add `import "./styles/main.scss";` to `src/index.js`.

## Step 4: HtmlWebpackPlugin

```bash
npm i -D html-webpack-plugin
```

HtmlWebpackPlugin generates the `.html` file and adds a `<script>` pointing at the new bundle automatically, so hashed file names need no manual edits. It can use `src/template.html` as a template:

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack App",
      filename: "index.html",
      template: "src/template.html",
    }),
  ],
};
```

The template reads the plugin's options with `<%= %>`:

```html
<!-- src/template.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div class="container">
      <img id="laughImg" alt="" />
      <h3>Don't Laugh Challenge</h3>
      <div id="joke" class="joke"></div>
      <button id="jokeBtn" class="btn">Get Another Joke</button>
    </div>
  </body>
</html>
```

## Step 5: Babel

Babel is a backward-compatibility tool. Newer JavaScript syntax (ES6+, ES2022 and so on) isn't supported by every browser, and Babel rewrites it into code older browsers can run.

e.g.:

```javascript
const greet = (name = "Guest") => {
  console.log(`Hello, ${name}`);
};
```

Old browsers such as Internet Explorer:

- ❌ Don't support arrow functions `() => {}`
- ❌ Don't support template literals `` `${}` ``
- ❌ Don't support default parameters `name = "Guest"`

Babel turns it into something like this:

```javascript
"use strict";
var greet = function (name) {
  if (name === void 0) name = "Guest";
  console.log("Hello, " + name);
};
```

```bash
npm i -D babel-loader @babel/core @babel/preset-env
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
```

> To choose which browsers to support, add `"browserslist": "> 0.5%, last 2 versions, not dead"` to package.json; `@babel/preset-env` transpiles only what those browsers need. Most projects no longer support IE, so far less gets rewritten.

## Step 6: Images and other assets (asset modules)

Webpack 5 has built-in asset modules, so you no longer need `file-loader` or `url-loader`. `asset/resource` copies the image to the output folder, and the `import` gives you its URL:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

```javascript
// src/index.js
import laughing from "./assets/laughing.svg";

document.getElementById("laughImg").src = laughing;
```

## Step 7: Source maps

The browser receives a minified bundle, so when something breaks, the error locations in developer tools are unreadable and don't point to your source files. A source map maps the built file back to the originals:

```javascript
module.exports = {
  devtool: "source-map",
};
```

## Step 8: devServer

devServer runs a local web server that watches your files and reloads on changes, which you'll want for any development. It's a separate package:

```bash
npm i -D webpack-dev-server
```

```javascript
module.exports = {
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
};
```

Run `npm run dev` and the browser opens `http://localhost:3000`.

## Step 9: bundle analyzer

Shows how big the bundle is and how much each package and file contributes, as a chart:

```bash
npm i -D webpack-bundle-analyzer
```

```javascript
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
};
```

## The complete webpack.config.js

All of the above combined:

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  mode: "development", // use "production" for release builds
  entry: {
    bundle: path.resolve(__dirname, "src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name][contenthash].js",
    clean: true,
    assetModuleFilename: "[name][ext]",
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack App",
      filename: "index.html",
      template: "src/template.html",
    }),
    new BundleAnalyzerPlugin(),
  ],
};
```

## Webpack vs. Vite

| | Webpack | Vite |
| --- | --- | --- |
| Dev server | Bundles first, then starts; slower to start on large projects | Serves native ESM on demand; starts almost instantly |
| Configuration | You configure nearly everything; the most flexible | Works with the defaults; common needs take little config |
| Ecosystem | A huge number of plugins and loaders; most older projects use it | Growing fast; the default choice for new projects |
| Best for | Fine-grained control over the bundle, or maintaining an existing Webpack project | New React and Vue projects |

That's an introduction to Webpack. Today's common bundlers include Webpack, Rollup, Vite and Parcel. Webpack's configuration is the most involved, but that's exactly what gives you control over every detail of the bundle. It also has a large plugin ecosystem for optimising different aspects, and there's plenty more to dig into.

By the way,

once you've learned Webpack, the other tools follow similar ideas: Next.js configures bundling through next.config (Next.js 16 uses Turbopack by default and can switch to Webpack), and Vite through vite.config. So don't worry about relearning everything. With the basics down, a quick look at the docs will get you going~

References: [bradtraversy/webpack-starter](https://github.com/bradtraversy/webpack-starter), [Webpack documentation](https://webpack.js.org/concepts/)
