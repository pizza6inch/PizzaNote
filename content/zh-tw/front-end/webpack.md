---
title: "搞懂 Webpack：JS模組轉譯、圖片處理、瀏覽器支援一把抓"
description: "針對React常見的打包工具進行一個深入淺出的介紹!"
publishedAt: "2025-06-09T08:21:44.284Z"
updatedAt: "2025-06-09T08:21:44.284Z"
category: "bundler"
series: "Webpack"
tags: ["front-end-development"]
aliases: ["Webpack"]
---

# WebPack

打包工具，
通常用於前端，react(creat-react-app)

## 為什麼需要 Webpack？
現代 JavaScript 開發常常會使用：

ES Module（import/export）

TypeScript（.ts）

SCSS / CSS Modules

React JSX（.jsx, .tsx）

圖片、字型等非 JS 資源

多個檔案（模組化）

這些原始的模組或語法瀏覽器無法直接執行，所以我們需要 Webpack 來幫忙「打包 + 轉譯 +優化」。


## ESM Vs. CJS

JS的引入模組方式分為 ES Module 跟 CommonJS

ES module

```javascript!
import fs from 'fs';
export default {functionA};
```


CommonJS
```javascript!
// a.js
// import 
const fs = require('fs');
// export
module.exports = {functionA};


```


| 模組系統 | import/export（ESM） | require/module.exports（CommonJS） |
| -------- | -------- | -------- |
| Node.js 預設     | ❌ 不支援（需設定package.json）    | ✅ 預設支援     |		
|瀏覽器 html	|❌ 不支援（需設定 <script type="module">）|	❌ 不支援
    

而webpack 可以將開發時使用的模組化語法（如 ES Module 或 CommonJS）轉換成瀏覽器可以理解的格式，並打包成一個或多個 JavaScript 檔案。

打包前:
```javascript!
// index.js
import generateJoke from "./joke";

console.log(generateJoke());
```

```javascript!
// joke.js
function generateJoke() {
  return "I don't trust stairs. They're always up to something.";
}

export default generateJoke;
```


打包後:
```javascript!
(()=>{"use strict";console.log("I don't trust stairs. They're always up to something.")})();
```

## config

webpack設定
webpack.config.js
    
```javascript!
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

file:"[name]" 表示最終產出的js file(壓縮過後的檔),名子會符合entry object的key也就是"bundle"
而至於"[contenthash]"則會在每次build時根據檔案內容來產生hash來更新檔名，也又是當你的檔案內容有變動時改變，這樣一來就可以讓瀏覽器去判斷新舊檔案來決定要不要使用快取，當有變動時瀏覽器會去強制重新下載新的js檔，這個設定須配合使用output clean:true，保證build時會刪掉舊的bundle js


### Loader

用來把css、scss、image load進去js bundle裡面
```bash!
npm i -D sass style-loader css-loader sass-loader
```

test接收regular expression 偵測目錄底下所有包含scss副檔名的file

```javascript!
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
```bash!
npm i -D HtmlWebpackPlugin
```

HtmlWebpackPlugin可以幫助產生.html檔，可以透過src/template.html來決定template
並且自動對應script src至新產生的js檔

```javascript!

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

使用 <% %>來抓取plugin設定
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
瀏覽器因為拿取壓縮後的bundleJS，因此程式出錯時，在開發者工具所帶出的錯誤訊息通常會看不懂也無法追蹤錯誤從哪裡發生，Source map檔就是用來幫助對照原先檔案和build檔案之間的關聯

```javascript!
module.exports = {
    devtool: "source-map",
}
```

### devServer
幫助開發者在本地架web sever，監聽檔案變化來直接看修改結果，現代開發者必備功能

```javascript!
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

向後兼容工具，JavaScript（可能包含最新的 ES6+、ES2022 語法）不一定所有瀏覽器都支援，這時候就需要 Babel。
ex:
```javascript!
const greet = (name = "Guest") => {
  console.log(`Hello, ${name}`);
};
```
舊版 IE 或某些瀏覽器會：

❌ 不支援箭頭函式 () => {}

❌ 不支援字串模板 ${}

❌ 不支援預設參數 name = "Guest"

🛠️ Babel 就會把它轉成像這樣的語法（可在舊瀏覽器執行）：
```javascript!
"use strict";
var greet = function(name) {
  if (name === void 0) name = "Guest";
  console.log("Hello, " + name);
};
```

```bash!
npm i -D babel-loader @babel/core @babel/preset-env
```

```javascript!
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
將圖片加入build file裡面，使得瀏覽器能抓到圖片資源

```javascript!
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
幫助開發者評估bundle size，以及套件、程式碼的占比，會以圖的方式呈現


```javascript!
plugins: [
    new BundleAnalyzerPlugin(),
  ],
```


以上就是針對webpack有一個淺層的介紹啦。先今2025的前端環境中主要有4種打包工具webpack、rollup、vite、parcel，其中webpack的設定最複雜繁瑣但也因為這點，可以讓開發者針對專案的打包細節能更有掌控，還有立一個優點是plugin還蠻多的可以針對不同層面去優化，深入研究應該也有蠻多細節。

順帶一提

先webpack學起來後其他工具也會是套用類似的概念，例如nextJS使用parcel透過next.config處理打包，vite透過vite.config處理，所以不用擔心這些都要重新學! 懂了基礎概念的你再透過上網查相關文檔一定也可以快速上手~

src:https://github.com/bradtraversy/webpack-starter
