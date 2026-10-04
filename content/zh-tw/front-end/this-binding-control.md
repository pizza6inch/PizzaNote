---
title: "call、apply、bind 差別：JavaScript this 的顯式、new 與箭頭函式綁定（下）"
seoTitle: "call、apply、bind 差別與 this 綁定優先順序（下）"
description: "call、apply、bind 有什麼差別？用範例整理 JavaScript this 的顯式綁定、new 綁定與箭頭函式，以及五種綁定同時出現時的優先順序與常見陷阱。"
publishedAt: "2025-06-25T03:39:11.465Z"
updatedAt: "2026-10-04T00:00:00.000Z"
category: "javascript"
series: "this 物件"
---

**call、apply、bind 都是用來指定函式的 this**：`call` 和 `apply` 會立刻執行函式，差別只在參數是逐一傳入還是用陣列傳入；`bind` 不會執行，而是回傳一個 this 已經固定好的新函式。

[上篇](/zh-tw/front-end/this-keyword-basics/)介紹了 this 的定義，以及五種綁定裡的預設綁定和隱式綁定。這篇介紹剩下的三種：顯式綁定、new 綁定、箭頭函式，最後整理它們的優先順序。

## 3️⃣ 顯式綁定（Explicit Binding）：call、apply、bind 差別

| 方法 | 立即執行 | 參數傳法 | 用途 |
| --- | --- | --- | --- |
| `call` | ✅ | 逐一傳入 | 立即呼叫，同時指定 `this` |
| `apply` | ✅ | 用陣列傳入 | 立即呼叫，適合參數本來就是陣列 |
| `bind` | ❌ | 逐一傳入（可先綁一部分） | 不會立即執行，**回傳新函式** |

```javascript
const person = {
  name: "Alice",
  greet: function (greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
  },
};

const otherPerson = {
  name: "Bob",
};

// call：立即執行，參數逐個傳入
person.greet.call(otherPerson, "Hello", "!");
// → Hello, I'm Bob!

// apply：立即執行，參數用陣列傳入
person.greet.apply(otherPerson, ["Hi", "!!"]);
// → Hi, I'm Bob!!

// bind：不會執行，回傳一個綁定後的新函式
const boundGreet = person.greet.bind(otherPerson, "Hey", "!!");
boundGreet();
// → Hey, I'm Bob!!
```

簡單來說，`bind` 是建立一個新函式，和原本的函式差別在於 this 已經固定成某個物件。

`call` 和 `apply` 都是在呼叫函式的當下指定 this，差別在於：

- `call` 接收逐個參數
- `apply` 接收參數陣列

### bind 的使用情境：把方法當成 callback 傳出去

```javascript
function Button(callback) {
  // 模擬點擊
  callback();
  // callback() 是直接呼叫（預設綁定），沒有 bind 的話 this 不會是 app
}

const app = {
  name: "MyApp",
  clickHandler() {
    console.log(`${this.name} was clicked`);
  },
  sayHello() {
    console.log(`hello ${this.name}!`);
  },
};

Button(app.clickHandler.bind(app)); // MyApp was clicked
setTimeout(app.sayHello.bind(app), 1000); // hello MyApp!
```

**把函式當成參數傳入（callback）時就需要綁定**。傳進去的只是函式本身，`app.` 這個「呼叫者」不會跟著過去，所以就算傳入時寫的是 `app.clickHandler`，被呼叫時 this 還是會丟失：非嚴格模式下變成 `window`（`this.name` 拿到的是 `window.name`），嚴格模式下是 `undefined`，直接報錯。

### call、apply 的使用情境

```javascript
function printFullName(preMessage) {
  console.log(`${preMessage} ${this.firstName} ${this.lastName}`);
}

const user1 = {
  firstName: "Ada",
  lastName: "Lovelace",
};

const user2 = {
  firstName: "Pizza",
  lastName: "6inch",
};

printFullName.call(user1, "Hi");    // → Hi Ada Lovelace
printFullName.apply(user2, ["Hi"]); // → Hi Pizza 6inch
```

同一個函式要套用在不同物件上，或是呼叫第三方函式時需要指定 this，就可以用 call / apply。

## 4️⃣ new 綁定（New Binding）

當你用 `new` 呼叫一個函式時，這個函式就會被當作建構函式（constructor function），**this 會綁定到新建立的物件本身**。

```javascript
function Person(name) {
  this.name = name; // 用 new 呼叫時，this 是新建立的物件
}

const user = new Person("Ada");
console.log(user.name); // Ada

const user2 = Person("Ada"); // 如果沒有 new，就只是普通的函式呼叫（預設綁定）
console.log(user2);          // undefined（函式沒有 return）
console.log(window.name);    // "Ada"（非嚴格模式下 this 是 window）
```

用 `new` 呼叫時，JavaScript 會做這幾件事：

1. 建立一個新的空物件
2. 把這個物件的原型設成 `Person.prototype`
3. 把 this 綁定到這個新物件，執行函式內容
4. 如果函式沒有回傳其他物件，就回傳這個新物件

## 5️⃣ 箭頭函式（Lexical Binding）

箭頭函式最大的特性之一就是：

它沒有自己的 this，**而是沿用定義時外層作用域的 this（靜態綁定）**。

這跟一般函式不同：**一般函式的 this 是執行時決定的**，而**箭頭函式的 this 在定義時就決定好了**。

> - 因為這個特性，我刷題時常常中招 QQ
> - 箭頭函式我已經習慣用到完全忘記它跟傳統 function 差在哪裡 XD

```javascript
const obj = {
  name: "Alice",
  greet: function () {
    // sayHi 是箭頭函式，沿用 greet 執行時的 this，也就是 obj
    const sayHi = () => {
      console.log(`Hi, I'm ${this.name}`);
    };
    sayHi(); // 就算前面沒有 obj.，this 仍然是 obj
  },
};

obj.greet(); // Hi, I'm Alice
```

換成傳統函式，this 就會丟失：

```javascript
const obj = {
  name: "Bob",
  greet: function () {
    // 傳統 function
    const sayHi = function () {
      console.log(`Hi, I'm ${this.name}`);
    };
    sayHi(); // 直接呼叫，預設綁定：this 是 window
  },
};

obj.greet(); // Hi, I'm （window.name 通常是空字串）
```

### 實務場景：事件處理時保持 this

```javascript
class Button {
  constructor(label) {
    this.label = label;
    this.handleClick = () => {
      console.log(`Button: ${this.label}`);
    };
  }
}

const btn = new Button("Submit");
document.querySelector("button").addEventListener("click", btn.handleClick);
```

如果 `handleClick` 是一般的方法，瀏覽器呼叫事件處理函式時會把 this 設成觸發事件的 DOM 元素（`<button>`），`this.label` 就會是 `undefined`。用箭頭函式（或在 constructor 裡 `this.handleClick = this.handleClick.bind(this)`）就能讓 this 一直是這個 Button 實例。

## 綁定優先順序

五種綁定同時出現時，誰說了算？

**new 綁定 > 顯式綁定（call / apply / bind）> 隱式綁定 > 預設綁定**

箭頭函式不參與這個比較：它根本沒有自己的 this，所以 call、apply、bind 都改不了它的 this，也不能被 `new` 呼叫（會丟出 `TypeError`）。

```javascript
function Person(name) {
  this.name = name;
}

const objA = {};

// 顯式 > 隱式：call 指定的 this 蓋過 obj.
const obj = { name: "obj", whoAmI() { return this.name; } };
console.log(obj.whoAmI.call({ name: "call" })); // call

// new > bind：用 new 呼叫 bind 過的函式，this 是新物件，不是 objA
const BoundPerson = Person.bind(objA);
const p = new BoundPerson("Ada");
console.log(p.name);    // Ada
console.log(objA.name); // undefined

// 箭頭函式：call 改不了 this
const arrow = () => this;
console.log(arrow.call(objA) === objA); // false
```

- 對箭頭函式使用 bind、call、apply 指定 this 沒有效果
- 已經 bind 過的函式再 bind 一次也沒用，第一次 bind 的 this 會保留
- 對 `obj.method` 使用 call / apply / bind 會重新指定 this
- 完全沒有綁定時，this 是全域物件（嚴格模式下是 `undefined`）

## 總結

| 類型 | 專有名詞（Binding Type） | 綁定邏輯說明 | 範例 |
| --- | --- | --- | --- |
| 1️⃣ 預設綁定 | **Default Binding** | 函式直接呼叫 → `this = window` / `globalThis`（嚴格模式為 `undefined`） | `sayHi()` |
| 2️⃣ 隱式綁定 | **Implicit Binding** | 被物件呼叫 → `this = 該物件` | `obj.sayHi()` |
| 3️⃣ 顯式綁定 | **Explicit Binding** | `call` / `apply` / `bind` 明確設定 `this` | `sayHi.call(obj)` |
| 4️⃣ new 綁定 | **New Binding** | 建構函式內 → `this` 是新建立的物件 | `new Person()` |
| 5️⃣ 箭頭函式 | **Lexical Binding** | 箭頭函式沒有自己的 this，沿用「定義當下」外層的 this | `() => this.name` |

參考資料：[MDN：this](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)、[MDN：Function.prototype.bind()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)、[kuro's Blog](https://kuro.tw/posts/2017/10/12/What-is-THIS-in-JavaScript-%E4%B8%8A/)、[ExplainThis](https://www.explainthis.io/zh-hans/swe/what-is-this#this-5)
