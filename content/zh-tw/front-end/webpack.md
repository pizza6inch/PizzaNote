---
title: "Webpack 教學：從零設定 webpack.config.js（Loader、Babel、devServer）"
seoTitle: "Webpack 教學：從零設定 webpack.config.js"
description: "Webpack 5 入門教學：從 npm init 一步步寫出完整的 webpack.config.js，包含 Loader、HtmlWebpackPlugin、Babel、圖片處理與 devServer，最後比較 Webpack 和 Vite。"
publishedAt: "2025-06-09T08:21:44.284Z"
updatedAt: "2026-10-04T00:00:00.000Z"
category: "bundler"
series: "Webpack"
tags: ["front-end-development"]
aliases: ["Webpack"]
---

# Webpack

**Webpack 是一個 JavaScript 打包工具（bundler）**：它從一個入口檔案（entry）開始，順著 `import` / `require` 找出所有用到的模組，把 JS、CSS、圖片等資源轉譯後打包成瀏覽器可以直接載入的幾個檔案。這篇用 Webpack 5 從零建立一個小專案，一步步寫出完整的 `webpack.config.js`。

> 以前 React 官方的 create-react-app 底層就是 Webpack，不過它已在 2025 年 2 月停止維護。現在新的 React 專案多半用 Vite 或 Next.js，但它們的設定觀念和 Webpack 是相通的，學會 Webpack 再看其他工具會快很多。

## 為什麼需要 Webpack？

現代 JavaScript 開發常常會使用：

- ES Module（`import` / `export`）
- TypeScript（`.ts`）
- SCSS / CSS Modules
- React JSX（`.jsx`、`.tsx`）
- 圖片、字型等非 JS 資源
- 從 npm 安裝的套件（`import _ from "lodash"`）

這些東西瀏覽器沒辦法直接全部吃下去：JSX、TypeScript、SCSS 要先轉譯，npm 套件的路徑瀏覽器找不到，幾百個小檔案各發一個請求也很慢。所以我們需要 Webpack 來幫忙「打包 + 轉譯 + 優化」。

## ESM Vs. CJS

JS 引入模組的方式分為 ES Module 跟 CommonJS。

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

| 模組系統 | `import` / `export`（ESM） | `require` / `module.exports`（CommonJS） |
| --- | --- | --- |
| Node.js | ✅ 支援：用 `.mjs` 副檔名，或在 package.json 設 `"type": "module"` | ✅ `.js` 預設就是 CommonJS |
| 瀏覽器 | ✅ 支援：用 `<script type="module">` 載入 | ❌ 不支援 |

既然瀏覽器已經支援 ESM，為什麼還要打包？因為原生 ESM 不會幫你轉譯 JSX、TypeScript、SCSS，也看不懂 `import "lodash"` 這種 npm 套件路徑，而且每個模組都是一個網路請求。Webpack 會把開發時的模組化寫法（ESM 或 CommonJS）整理成瀏覽器能直接執行的檔案，並打包成一個或多個 JavaScript 檔。

打包前：

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

打包後（production 模式會壓縮）：

```javascript
(()=>{"use strict";console.log("I don't trust stairs. They're always up to something.")})();
```

## 步驟一：建立專案

```bash
mkdir webpack-starter && cd webpack-starter
npm init -y
npm i -D webpack webpack-cli
```

資料夾結構：

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

在 package.json 加上指令：

```json
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack serve"
  }
}
```

## 步驟二：config

Webpack 的設定寫在專案根目錄的 `webpack.config.js`：

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

- `entry`：從哪個檔案開始找依賴。這裡把入口取名為 `bundle`
- `output.filename` 的 `[name]` 會換成 entry 的 key，也就是 `bundle`
- `[contenthash]` 會根據檔案內容產生 hash，內容有變動檔名就會變。瀏覽器看到新檔名就會重新下載，沒變的檔案則繼續用快取
- 因為每次 build 檔名都可能不同，要搭配 `clean: true`，build 前先刪掉 `dist` 裡的舊檔案

執行 `npm run build`，`dist` 裡就會出現像 `bundle3f9a2c1e.js` 的檔案。

## 步驟三：Loader（CSS / SCSS）

Webpack 本身只看得懂 JavaScript 和 JSON，其他類型的檔案要靠 loader 轉換。

```bash
npm i -D sass style-loader css-loader sass-loader
```

`test` 接收正規表達式，符合的檔案（這裡是 `.scss`）會交給 `use` 裡的 loader 處理，順序是**由右到左**：`sass-loader` 把 SCSS 編成 CSS → `css-loader` 解析 CSS 裡的 `@import` 和 `url()` → `style-loader` 把樣式插進頁面的 `<style>`。

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

接著在 `src/index.js` 加上 `import "./styles/main.scss";` 就會生效。

## 步驟四：HtmlWebpackPlugin

```bash
npm i -D html-webpack-plugin
```

HtmlWebpackPlugin 會幫你產生 `.html` 檔，並自動加上指向新 bundle 的 `<script>`，所以檔名有 hash 也不用手動改。可以用 `src/template.html` 當作模板：

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

模板裡用 `<%= %>` 讀取 plugin 的設定：

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

## 步驟五：Babel

Babel 是向後相容工具。JavaScript 的新語法（ES6+、ES2022 等）不一定所有瀏覽器都支援，Babel 會把它轉成舊瀏覽器也能執行的寫法。

ex:

```javascript
const greet = (name = "Guest") => {
  console.log(`Hello, ${name}`);
};
```

舊版 IE 等瀏覽器：

- ❌ 不支援箭頭函式 `() => {}`
- ❌ 不支援樣板字串 `` `${}` ``
- ❌ 不支援預設參數 `name = "Guest"`

Babel 會把它轉成像這樣的語法：

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

> 要支援哪些瀏覽器，可以在 package.json 加上 `"browserslist": "> 0.5%, last 2 versions, not dead"`，`@babel/preset-env` 會照這個設定決定要轉譯哪些語法。現在大多數專案已經不需要支援 IE，轉譯的東西會少很多。

## 步驟六：圖片等資源（asset modules）

Webpack 5 內建 asset modules，不用再另外裝 `file-loader` 或 `url-loader`。`asset/resource` 會把圖片複製到輸出資料夾，`import` 拿到的是它的網址：

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

## 步驟七：Source map

瀏覽器拿到的是壓縮過的 bundle，程式出錯時開發者工具裡的錯誤位置通常看不懂，也追不到是哪個原始檔出錯。Source map 用來對照原始檔和 build 出來的檔案：

```javascript
module.exports = {
  devtool: "source-map",
};
```

## 步驟八：devServer

devServer 會在本機架一個 web server，監聽檔案變化並自動重新整理，開發時必備。它是另外一個套件：

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

執行 `npm run dev`，瀏覽器會自動打開 `http://localhost:3000`。

## 步驟九：bundle analyzer

幫助評估 bundle 大小，以及每個套件、檔案各占多少，會以圖的方式呈現：

```bash
npm i -D webpack-bundle-analyzer
```

```javascript
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
};
```

## 完整的 webpack.config.js

把上面的設定合在一起：

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  mode: "development", // 正式 build 改成 "production"
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
| 開發伺服器 | 先打包再啟動，專案大時啟動較慢 | 用瀏覽器原生 ESM 按需載入，啟動很快 |
| 設定 | 幾乎每件事都要自己設定，彈性最大 | 預設值就能用，常見需求不太需要設定 |
| 生態系 | plugin 和 loader 非常多，老專案大多用它 | 成長很快，新專案的主流選擇 |
| 適合 | 需要細緻控制打包、或維護既有的 Webpack 專案 | 新的 React、Vue 專案 |

以上就是 Webpack 的入門介紹啦。現今的前端環境常見的打包工具有 Webpack、Rollup、Vite、Parcel 等，其中 Webpack 的設定最複雜繁瑣，但也因為這點，可以讓開發者對專案的打包細節有更多掌控。另一個優點是 plugin 很多，可以針對不同層面去優化，深入研究也有很多細節。

順帶一提，

先把 Webpack 學起來，其他工具也是套用類似的概念：例如 Next.js 透過 next.config 處理打包（Next.js 16 預設用 Turbopack，也可以改用 Webpack），Vite 透過 vite.config 處理，所以不用擔心這些都要重新學！懂了基礎概念的你，再上網查相關文件一定也可以快速上手～

參考：[bradtraversy/webpack-starter](https://github.com/bradtraversy/webpack-starter)、[Webpack 官方文件](https://webpack.js.org/concepts/)
