---
title: "JavaScript this 是什麼？this 的指向與預設、隱式綁定（上）"
seoTitle: "JavaScript this 是什麼？預設與隱式綁定（上）"
description: "用範例搞懂 JavaScript 的 this：this 是什麼、為什麼同一個函式的 this 會不一樣，以及預設綁定、隱式綁定與嚴格模式下的差異和常見錯誤。"
publishedAt: "2025-06-24T06:57:07.835Z"
updatedAt: "2026-10-04T00:00:00.000Z"
category: "javascript"
series: "this 物件"
---

**this 是 JavaScript 函式執行時才決定的一個值**：同一個函式，用不同方式呼叫，this 就會指向不同的東西。大多數情況下，this 就是「呼叫這個函式的物件」，也就是 `obj.fn()` 裡點前面的 `obj`。

## this 是什麼？

- this 是 JavaScript 的一個關鍵字
- 每次函式被呼叫時，JavaScript 會為這次執行決定 this 要指向什麼（通常是一個物件，嚴格模式下也可能是 `undefined`）
- this 的值看的是函式**怎麼被呼叫**，而不是函式寫在哪裡（箭頭函式例外，下篇會講）
- 大多數情況下，this 代表「呼叫該函式的物件」

## 基礎範例

```javascript
var age = 15;

function getAge() {
  return this.age;
}

const people1 = {
  age: 25,
  getAge: getAge,
};

const people2 = {
  age: 18,
  getAge: getAge,
};

console.log(people1.getAge()); // 25 ✅
console.log(people2.getAge()); // 18 ✅
console.log(getAge());         // 15 ❗（嚴格模式下會直接報錯）
```

`people1.getAge()` 時，this 是 `people1`。

`getAge()` 直接呼叫時，this 是全域物件：瀏覽器裡是 `window`，Node.js 裡是 `globalThis`。

所以最後一行會回傳 `window.age`，也就是 15。但在嚴格模式（`"use strict"`、`class` 內部、`<script type="module">`）下，直接呼叫時 this 是 `undefined`，`this.age` 會丟出 `TypeError`。

若函式沒有被任何物件呼叫（前面沒有 `obj.`），this 預設就會指向全域物件。這種綁定方式叫做「預設綁定（Default Binding）」。

> ### 瀏覽器中的 window 是什麼？
> window 是瀏覽器的全域物件，擁有：
> - document
> - localStorage
> - console
> - ……等全域 API
>
> 用 `var` 在最外層宣告的變數也會變成 window 的屬性，所以上面的 `var age = 15` 才能用 `window.age` 讀到。`let`、`const` 則不會。

## 練習範例解析

```javascript
var foo = function () {
  this.count++;
};

foo.count = 0;

for (var i = 0; i < 5; i++) {
  foo();
}

console.log(foo.count);
```

`foo()` 是直接呼叫，所以 `this.count++` 操作的是 `window.count`，並不影響 `foo.count`。結果仍為 0。

```javascript
var bar = function () {
  console.log(this.a);
};

var foo = function () {
  var a = 123;
  this.bar();
};

foo();
```

輸出 `undefined`。
`foo` 內的 `this` 是 `window`，`this.bar()` 就是 `window.bar()`，`bar` 內的 `this` 也是 `window`。`a` 是 `foo` 裡的區域變數，`window.a` 沒有定義。

```javascript
var foo = "foo";
var obj = {
  foo: "foo in Object",
};

var sayFoo = function () {
  console.log(this.foo);
};

obj.sayFoo = sayFoo;

obj.sayFoo(); // foo in Object
sayFoo();     // foo
```

同一個函式，被 `obj` 呼叫時 this 是 `obj`（隱式綁定，Implicit Binding），直接呼叫時 this 是 `window`（預設綁定）。

## 巢狀函式中的 this

```javascript
var a = 1;

var obj = {
  a: 2,
  fn1: function () {
    console.log(this.a); // 2 ✅

    var fn2 = function () {
      var a = 3;
      console.log(this.a); // 1 ❗
    };

    fn2();
  },
};

obj.fn1();
```

`fn2` 寫在 `fn1` 裡面，但它是直接呼叫的，`this` 指向 `window`，所以印出 1。this 不會因為函式寫在物件的方法裡就跟著變成那個物件。

## 如何快速判斷 this？

判斷呼叫時前面有沒有「.」：

- `obj.fn()` → this = `obj`（隱式綁定）
- `fn()` → this = `window`，嚴格模式下是 `undefined`（預設綁定）

## this 的 5 種綁定方式

| 類型 | 專有名詞（Binding Type） | 綁定邏輯說明 | 範例 |
| --- | --- | --- | --- |
| 1️⃣ 預設綁定 | **Default Binding** | 函式直接呼叫 → `this = window` / `globalThis`（嚴格模式為 `undefined`） | `sayHi()` |
| 2️⃣ 隱式綁定 | **Implicit Binding** | 被物件呼叫 → `this = 該物件` | `obj.sayHi()` |
| 3️⃣ 顯式綁定 | **Explicit Binding** | `call` / `apply` / `bind` 明確設定 `this` | `sayHi.call(obj)` |
| 4️⃣ new 綁定 | **New Binding** | 建構函式內 → `this` 是新建立的物件 | `new Person()` |
| 5️⃣ 箭頭函式 | **Lexical Binding** | 箭頭函式沒有自己的 this，沿用「定義當下」外層的 this | `() => this.name` |

## 小結

this 的值不是固定的，而是根據函式「如何被呼叫」來決定的。

最容易搞錯的是預設綁定和隱式綁定，本篇已完整介紹。

**要預測 this，只需要問自己：是誰在呼叫這個函式？**

## 下一篇

[下篇](/zh-tw/front-end/this-binding-control/)會介紹：

- call、apply、bind 的差別與使用時機（顯式綁定）
- new 關鍵字如何決定 this
- 為什麼箭頭函式沒有自己的 this
- 五種綁定同時出現時的優先順序

參考資料：[MDN：this](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)、[kuro's Blog](https://kuro.tw/posts/2017/10/12/What-is-THIS-in-JavaScript-%E4%B8%8A/)
