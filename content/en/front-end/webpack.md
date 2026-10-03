---
title: "Understanding Webpack: Transpiling JS Modules, Handling Images and Browser Support"
seoTitle: "Understanding Webpack: A Beginner's Guide"
description: "A beginner-friendly introduction to Webpack, the bundler behind many React projects: modules, loaders, plugins, Babel, source maps and the dev server."
publishedAt: "2025-06-09T08:21:44.284Z"
updatedAt: "2025-06-09T08:21:44.284Z"
category: "bundler"
series: "Webpack"
tags: ["front-end-development"]
aliases: ["Webpack"]
---

# Webpack

A bundler,
usually used for front-end projects, for example React (create-react-app).

## Why do we need Webpack?
Modern JavaScript development often uses:

ES Modules (import/export)

TypeScript (.ts)

SCSS / CSS Modules

React JSX (.jsx, .tsx)

Images, fonts and other non-JS assets

Many files (modularity)

Browsers can't run these source modules and syntaxes directly, so we need Webpack to help with "bundling + transpiling + optimising".


## ESM vs. CJS

JavaScript has two ways of importing modules: ES Modules and CommonJS.

ES module

```javascript
import fs from 'fs';
export default {functionA};
```


CommonJS
```javascript
// a.js
// import 
const fs = require('fs');
// export
module.exports = {functionA};


```


| Module system | import/export (ESM) | require/module.exports (CommonJS) |
| -------- | -------- | -------- |
| Node.js default     | ❌ Not supported (needs configuration in package.json)    | ✅ Supported by default     |
| Browser HTML	| ❌ Not supported (needs `<script type="module">`) |	❌ Not supported
    

Webpack can convert the modular syntax you use during development (ES Modules or CommonJS) into a format browsers understand, and bundle it into one or more JavaScript files.

Before bundling:
```javascript
// index.js
import generateJoke from "./joke";

console.log(generateJoke());
```

```javascript
// joke.js
function generateJoke() {
  return "I don't trust stairs. They're always up to something.";
}

export default generateJoke;
```


After bundling:
```javascript
(()=>{"use strict";console.log("I don't trust stairs. They're always up to something.")})();
```

## config

Webpack configuration lives in
webpack.config.js
    
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

`filename: "[name]"` means the final (minified) JS file is named after the key of the `entry` object, which here is "bundle".
`[contenthash]` generates a hash from the file's contents on every build and puts it in the file name, so the name changes whenever the content changes. That lets the browser tell old files from new ones and decide whether to use its cache: when something changes, the browser is forced to download the new JS file. This setting should be used together with `output.clean: true`, which guarantees old bundles are deleted at build time.


### Loader

Loaders load CSS, SCSS and images into the JS bundle.
```bash
npm i -D sass style-loader css-loader sass-loader
```

`test` takes a regular expression and matches every file in the directory that has the scss extension.

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

### HtmlWebpackPlugin
```bash
npm i -D html-webpack-plugin
```

HtmlWebpackPlugin generates the `.html` file. You choose the template with `src/template.html`,
and it automatically points the script `src` at the newly generated JS file.

```javascript

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

Use `<% %>` to read the plugin options.
src/template.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
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

### Source map
The browser receives the minified bundle, so when something goes wrong the error shown in the developer tools is usually unreadable and you can't trace where it came from. A source map file maps the original files to the built files.

```javascript
module.exports = {
    devtool: "source-map",
}
```

### devServer
Runs a local web server and watches your files so you can see changes right away. It's an essential feature for modern development.

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
}
```

### babel

A backward-compatibility tool. Not every browser supports the latest JavaScript (ES6+, ES2022 syntax), and that's where Babel comes in.
e.g.:
```javascript
const greet = (name = "Guest") => {
  console.log(`Hello, ${name}`);
};
```
Old versions of IE and some other browsers:

❌ don't support arrow functions `() => {}`

❌ don't support template strings `${}`

❌ don't support default parameters `name = "Guest"`

🛠️ Babel turns it into syntax like this, which runs in old browsers:
```javascript
"use strict";
var greet = function(name) {
  if (name === void 0) name = "Guest";
  console.log("Hello, " + name);
};
```

```bash
npm i -D babel-loader @babel/core @babel/preset-env
```

```javascript
module.exports = {
    module:{
        rules:[
            {
            ...
            },
            {
                test: /\.js$/,
                exclude:/node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
          },
        ]
    }
}
```

### assets loader
Adds images to the build output so the browser can fetch them.

```javascript
module.exports = {
  module: {
    rules: [
      {
       ...
      },
      {
        ...
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
}
```

### bundle analyzer
Helps you evaluate bundle size and how much each package and piece of code contributes, shown as a chart.


```javascript
plugins: [
    new BundleAnalyzerPlugin(),
  ],
```


That's a shallow introduction to Webpack. In the front-end landscape of 2025 there are four main bundlers: Webpack, Rollup, Vite and Parcel. Webpack has the most complex and tedious configuration, but that is also what gives developers finer control over how a project is bundled. Another advantage is its large plugin ecosystem, which lets you optimise at many levels; there are probably plenty of details worth digging into.

By the way:

Once you've learned Webpack, the other tools apply similar concepts. For example, Next.js has its own bundler (Turbopack, or Webpack) which you configure through `next.config`, and Vite is configured through `vite.config`, so there's no need to worry about relearning everything. With the basics down, reading the relevant documentation will get you up to speed quickly.

src: https://github.com/bradtraversy/webpack-starter
