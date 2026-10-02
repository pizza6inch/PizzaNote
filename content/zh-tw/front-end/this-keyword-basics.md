---
title: "JS 底層觀念 - this 物件 上(定義&基礎例子)"
description: "透過清楚的範例與逐步說明，帶你認識 JavaScript 中的 this 關鍵字。了解 this 的定義、預設綁定、隱式綁定與常見錯誤，建立堅實的 JS 底層觀念基礎。"
publishedAt: "2025-06-24T06:57:07.835Z"
updatedAt: "2025-06-24T06:57:07.835Z"
category: "javascript"
series: "this 物件"
---

## 🔍 this 是什麼？
- this 是 JavaScript 的一個關鍵字。
- 它是 function 執行時自動產生的一個內部物件。
- this 的值會依據 函式的執行方式 而改變。
- 大多數情況下，this 代表「呼叫該函式的物件」。



## 📦 基礎範例
```javascript
var age = 15;

function getAge() {
  return this.age;
}

const people1 = {
  age: 25,
  getAge: getAge
};

const people2 = {
  age: 18,
  getAge: getAge
};

console.log(people1.getAge()); // 25 ✅
console.log(people2.getAge()); // 18 ✅
console.log(getAge());         // 15 (或 undefined) ❗

```

people1.getAge() 時，this 是 people1。

getAge() 直接呼叫時 → this 是 window（瀏覽器環境）或 global（Node.js server環境）。

所以最後一行會回傳 window.age = 15，但若在 "use strict" 模式下，會變成 undefined。

若函式沒有被任何物件呼叫(前面沒有 `obj.` )，this 預設就會指向 window。這種綁定方式叫做「預設綁定（Default Binding）」。

> ## 瀏覽器中的 window 是什麼？
> window 是瀏覽器的全域物件，擁有：
> - document
> - localStoarge
> - console
> - ...等全域API

## 🎯 練習範例解析

```javascript
var foo = function() {
  this.count++;
};

foo.count = 0;

for( var i = 0; i < 5; i++ ) {
  foo();
}

console.log(foo.count)
```

this.count++ 操作的是 `window.count`，並不影響 `foo.count`。所以結果仍為 0。

```javascript
var bar = function() {
  console.log( this.a );
};

var foo = function() {
  var a = 123;
  this.bar();
};

foo();
```
輸出 `undefined`。
`foo` 內 `this` 為 `window`，呼叫 `window.bar()` `bar`內`this`為`window`，`window.a`未定義
```javascript=
var foo = 'foo';
var obj = {
  foo: 'foo in Object'
};

var sayFoo = function() {
  console.log( this.foo );
};

obj.sayFoo = sayFoo;

obj.sayFoo();   // foo in Object
sayFoo();       // foo
```
## 🧭 巢狀作用域中的 this : 
```javascript
var a = 1

var obj = {
  var a = 2
  fn1: function(){
    console.log(this.a); // 2 ✅

    var fn2 = function(){
      var a = 3
      console.log(this.a); // 1 ❗
    };

    fn2();
  }
};

obj.fn1()

```
fn2 是直接呼叫的，`this` 指向 `window`，所以印出 1。



## 🎯 如何快速判斷 this？
✅ 判斷是否有 . 呼叫：

- obj.fn() → this = obj（隱式綁定）
- fn() → this = window（預設綁定）


## 📚 this 的 5 種綁定方式

| 類型         | 專有名詞（Binding Type）   | 綁定邏輯說明                                | 範例                |
| ---------- | -------------------- | ------------------------------------- | ----------------- |
| 1️⃣ 預設綁定   | **Default Binding**  | 函式直接呼叫 → `this = window` / `global`   | `sayHi()`         |
| 2️⃣ 隱式綁定   | **Implicit Binding** | 被物件呼叫 → `this = 該物件`                  | `obj.sayHi()`     |
| 3️⃣ 顯式綁定   | **Explicit Binding** | `call` / `apply` / `bind` 明確設定 `this` | `sayHi.call(obj)` |
| 4️⃣ new 綁定 | **New Binding**      | 建構函式內 → `this` 是新創建的物件                | `new Person()`    |
| 5️⃣ 箭頭綁定   | **Lexical Binding**  | 箭頭函式固定綁定「定義當下」的作用域                    | `() => this.name` |


## ✅ 小結
this 的值不是固定的，而是根據函式被「如何呼叫」來決定的。

最容易搞錯的是 預設綁定 和 隱式綁定，本篇已完整介紹。

**要預測 this，只需要問自己：是誰在呼叫這個函式？**


## 🔜 下一篇將介紹：

call / apply / bind 的使用方式（顯式綁定）

new 關鍵字如何改變 this

為什麼箭頭函式不會有自己的 this？
