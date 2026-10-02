---
title: "JS 底層觀念 - this 物件 下(this 綁定控制)"
description: "深入探討 JavaScript 中 this 的五種綁定方式（預設綁定、隱式綁定、顯式綁定、new 綁定、箭頭函式綁定），透過範例說明它們的綁定邏輯與優先順序，幫助你理解在不同情境中 this 的指向，並掌握常見陷阱與實務應用技巧。"
publishedAt: "2025-06-25T03:39:11.465Z"
updatedAt: "2025-06-25T03:39:11.465Z"
category: "javascript"
series: "this 物件"
---

## 前情提要
📚 this 的 5 種綁定方式

| 類型         | 專有名詞（Binding Type）   | 綁定邏輯說明                                | 範例                |
| ---------- | -------------------- | ------------------------------------- | ----------------- |
| 1️⃣ 預設綁定   | **Default Binding**  | 函式直接呼叫 → `this = window` / `global`   | `sayHi()`         |
| 2️⃣ 隱式綁定   | **Implicit Binding** | 被物件呼叫 → `this = 該物件`                  | `obj.sayHi()`     |
| 3️⃣ 顯式綁定   | **Explicit Binding** | `call` / `apply` / `bind` 明確設定 `this` | `sayHi.call(obj)` |
| 4️⃣ new 綁定 | **New Binding**      | 建構函式內 → `this` 是新創建的物件                | `new Person()`    |
| 5️⃣ 箭頭綁定   | **Lexical Binding**  | 箭頭函式固定綁定「定義當下」的作用域                    | `() => this.name` |

上篇提到了1、2，這篇要來介紹剩下的this綁定
 
 ## 3️⃣顯式綁定(Explicit Binding)
 
 | 方法      | 立即執行 | 可傳入參數 | 用途               |
| ------- | ---- | ----- | ---------------- |
| `call`  | ✅    | 逐一傳入  | 立即調用，改變 `this`   |
| `apply` | ✅    | 陣列傳入  | 立即調用，適合參數不固定     |
| `bind`  | ❌    | 逐一傳入  | 不會立即執行，**回傳新函式** |


 
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
 
簡單來說bind使用時是定義一個新function，與原來function不同的地方在於指定了this為某個物件。

call & apply都是使用function時指定this，差別在於
- call 接收逐個參數
- apply 接收參數陣列

### bind綁定this範例情境:

```javascript=
function Button(callback) {
  // 模擬點擊
  callback();
  // 這裡callback為預設綁定若沒有bind，this指向window
}

const app = {
  name: "MyApp",
  clickHandler() {
    console.log(`${this.name} was clicked`);
  },
  sayHello() {
      console.log(`hello ${this.name}!`)
  }
};

Button(app.clickHandler.bind(app)); // 如果不 bind，this 是 undefined
setTimeout(app.sayHello.bind(app),1000); // callback需bind this
```
在需要**將function作為參數傳入時(callback)**，就會需要綁定，否則你就算傳入時前面有所屬物件，再傳入後this仍然會丟失。
 
### call、apply綁定this範例情境
 
```javascript!
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
}

printFullName.call(user1,"Hi"); // → Hi Ada Lovelace
printFullName.apply(user2,["Hi"]) // -> Hi Pizza 6inch
```
呼叫第三方函式或工具時，需要在call function時，根據情境改變不同this時可使用call/apply。
 
 
## 4️⃣new 綁定(New Binding)
 
 當你使用 new 關鍵字來呼叫一個函式時，該函式就會被當作建構函式（constructor function），**此時this綁定就會是建立出來的「新物件」本身**
 
```javascript!
function Person(name) {
  this.name = name; // 如果有new，此時this綁定至user
}

const user = new Person("Ada");
console.log(user.name); // Ada

const user = Person("Ada"); // 如果沒有 new
console.log(user);          // undefined
console.log(window.name);   // "Ada"（非嚴格模式下被綁到 window）
```

## 5️⃣ 箭頭函式綁定(Lexical Binding)

箭頭函式的最大特性之一就是：

它不會擁有自己的 this，**而是繼承定義時外層作用域的 this 值（靜態綁定）**。

這跟一般的函式不同。**一般函式的 this 是執行時決定的**；而**箭頭函式的 this 是定義時就決定好了**。

> - 因為這個特性所以我在刷題常常中招時QQ
> - 箭頭函式我已經習慣使用到完全不知道跟傳統function差在哪裡XD

```javascript=
const obj = {
  name: "Alice",
  greet: function () {
    // sayHi 為 arrow function
    // 宣告時綁定this為obj
    const sayHi = () => {
      console.log(`Hi, I'm ${this.name}`);
    };
    sayHi(); // 即使沒有obj.在前，也綁定到this
  },
};

obj.greet(); // Hi, I'm Alice
```
傳統函式會導致 this 丟失
```javascript=
const obj = {
  name: "Bob",
  greet: function () {
    // 傳統function
    const sayHi = function () {
      console.log(`Hi, I'm ${this.name}`);
    };
    sayHi(); // 這裡為預設綁定 this===window
  },
};

obj.greet(); // Hi, I'm undefined
```

### 實務場景
事件處理時保持 this 一致

```javascript!
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
若這裡不用箭頭函式，this 就會指向 button DOM 元素，導致錯誤。

## 綁定優先級

總共五種綁定方式，當同時兩種以上綁定方式衝突時，優先級如下

Default < Implicit < Explicit < new ≈ Arrow（互斥，優先級最高）

由於建構函式必須是傳統function，換句話說arrow function不能被new調用，所以不會發生bind衝突的情況。

- 對arrow function、new fcuntion使用bind、call、apply綁定this無效
- 對obj.function使用bind、call、apply會重新綁定this
- 無任何綁定則this指向window

## 總結

最後總結將表格放在下面

📚 this 的 5 種綁定方式

| 類型         | 專有名詞（Binding Type）   | 綁定邏輯說明                                | 範例                |
| ---------- | -------------------- | ------------------------------------- | ----------------- |
| 1️⃣ 預設綁定   | **Default Binding**  | 函式直接呼叫 → `this = window` / `global`   | `sayHi()`         |
| 2️⃣ 隱式綁定   | **Implicit Binding** | 被物件呼叫 → `this = 該物件`                  | `obj.sayHi()`     |
| 3️⃣ 顯式綁定   | **Explicit Binding** | `call` / `apply` / `bind` 明確設定 `this` | `sayHi.call(obj)` |
| 4️⃣ new 綁定 | **New Binding**      | 建構函式內 → `this` 是新創建的物件                | `new Person()`    |
| 5️⃣ 箭頭綁定   | **Lexical Binding**  | 箭頭函式固定綁定「定義當下」的作用域                    | `() => this.name` |

 
 此筆記參考了:[kuro's Blog](https://kuro.tw/posts/2017/10/12/What-is-THIS-in-JavaScript-%E4%B8%8A/) 、[ExplainThis](https://www.explainthis.io/zh-hans/swe/what-is-this#this-5)、ChatGPT
