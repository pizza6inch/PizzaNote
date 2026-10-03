---
title: "JS Fundamentals: The this Keyword, Part 2 (Controlling this Binding)"
seoTitle: "JavaScript this, Part 2: call, apply and bind"
description: "The five ways this is bound in JavaScript: default, implicit, explicit, new and arrow function binding, with their priority rules and common pitfalls."
publishedAt: "2025-06-25T03:39:11.465Z"
updatedAt: "2025-06-25T03:39:11.465Z"
category: "javascript"
series: "The this keyword"
---

## Previously
📚 The 5 ways this gets bound

| Type         | Official name (Binding Type)   | Binding rule                                | Example                |
| ---------- | -------------------- | ------------------------------------- | ----------------- |
| 1️⃣ Default   | **Default Binding**  | Called directly → `this = window` / `global`   | `sayHi()`         |
| 2️⃣ Implicit   | **Implicit Binding** | Called on an object → `this = that object`                  | `obj.sayHi()`     |
| 3️⃣ Explicit   | **Explicit Binding** | `call` / `apply` / `bind` set `this` explicitly | `sayHi.call(obj)` |
| 4️⃣ new | **New Binding**      | Inside a constructor → `this` is the newly created object                | `new Person()`    |
| 5️⃣ Arrow   | **Lexical Binding**  | An arrow function is permanently bound to the scope where it was defined                    | `() => this.name` |

The previous article covered 1 and 2. This one covers the remaining bindings.
 
## 3️⃣ Explicit Binding
 
| Method      | Runs immediately | Arguments | Purpose               |
| ------- | ---- | ----- | ---------------- |
| `call`  | ✅    | Passed one by one  | Calls immediately, changing `this`   |
| `apply` | ✅    | Passed as an array  | Calls immediately, good when the arguments vary     |
| `bind`  | ❌    | Passed one by one  | Does not run; **returns a new function** |


 
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

// call: runs immediately, arguments passed one by one
person.greet.call(otherPerson, "Hello", "!"); 
// → Hello, I'm Bob!

// apply: runs immediately, arguments passed as an array
person.greet.apply(otherPerson, ["Hi", "!!"]); 
// → Hi, I'm Bob!!

// bind: does not run, returns a new bound function
const boundGreet = person.greet.bind(otherPerson, "Hey", "!!");
boundGreet(); 
// → Hey, I'm Bob!!


```
 
In short, `bind` defines a new function that differs from the original only in that `this` is fixed to a particular object.

`call` and `apply` both set `this` at the moment the function is called. The difference:
- `call` takes the arguments one by one
- `apply` takes an array of arguments

### A scenario for bind:

```javascript
function Button(callback) {
  // simulate a click
  callback();
  // callback is called with default binding here; without bind, this points to window
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

Button(app.clickHandler.bind(app)); // without bind, this would be undefined
setTimeout(app.sayHello.bind(app),1000); // the callback needs bind for this
```
When you **pass a function as an argument (a callback)**, you need to bind it. Even if the function was written with its owning object in front of it, once it is passed along, `this` is lost.
 
### A scenario for call and apply
 
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
}

printFullName.call(user1,"Hi"); // → Hi Ada Lovelace
printFullName.apply(user2,["Hi"]) // -> Hi Pizza 6inch
```
When calling third-party functions or tools, use `call` / `apply` when you need to change `this` according to the situation at the moment of the call.
 
 
## 4️⃣ New Binding
 
When you call a function with the `new` keyword, that function is treated as a constructor, and **`this` is bound to the newly created object itself**.
 
```javascript
function Person(name) {
  this.name = name; // with new, this is bound to user
}

const user = new Person("Ada");
console.log(user.name); // Ada

const user2 = Person("Ada"); // without new
console.log(user2);          // undefined
console.log(window.name);    // "Ada" (bound to window in non-strict mode)
```

## 5️⃣ Lexical Binding (arrow functions)

One of the biggest characteristics of arrow functions is this:

They don't have their own `this`. **Instead they inherit the `this` of the enclosing scope where they were defined (static binding).**

This is different from regular functions. **For a regular function, `this` is decided when it runs**, whereas **for an arrow function, `this` is decided when it is defined**.

> - Because of this I often get caught out when solving coding problems 😭
> - I'm so used to arrow functions that I had no idea how they differ from traditional functions 😂

```javascript
const obj = {
  name: "Alice",
  greet: function () {
    // sayHi is an arrow function
    // this is bound to obj at the point of declaration
    const sayHi = () => {
      console.log(`Hi, I'm ${this.name}`);
    };
    sayHi(); // bound to this even without obj. in front of it
  },
};

obj.greet(); // Hi, I'm Alice
```
A traditional function loses `this`:
```javascript
const obj = {
  name: "Bob",
  greet: function () {
    // traditional function
    const sayHi = function () {
      console.log(`Hi, I'm ${this.name}`);
    };
    sayHi(); // default binding here, this === window
  },
};

obj.greet(); // Hi, I'm undefined
```

### In practice
Keeping `this` consistent in event handlers:

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
If an arrow function were not used here, `this` would point to the button DOM element, causing a bug.

## Binding priority

There are five kinds of binding in total. When two or more of them conflict, the priority is:

Default < Implicit < Explicit < new ≈ Arrow (mutually exclusive, highest priority)

A constructor has to be a traditional function; in other words an arrow function can't be called with `new`, so the two never conflict.

- Using `bind`, `call` or `apply` on an arrow function or on a `new` call has no effect on `this`
- Using `bind`, `call` or `apply` on `obj.function` rebinds `this`
- With no binding at all, `this` points to `window`

## Summary

Finally, here is the summary table again:

📚 The 5 ways this gets bound

| Type         | Official name (Binding Type)   | Binding rule                                | Example                |
| ---------- | -------------------- | ------------------------------------- | ----------------- |
| 1️⃣ Default   | **Default Binding**  | Called directly → `this = window` / `global`   | `sayHi()`         |
| 2️⃣ Implicit   | **Implicit Binding** | Called on an object → `this = that object`                  | `obj.sayHi()`     |
| 3️⃣ Explicit   | **Explicit Binding** | `call` / `apply` / `bind` set `this` explicitly | `sayHi.call(obj)` |
| 4️⃣ new | **New Binding**      | Inside a constructor → `this` is the newly created object                | `new Person()`    |
| 5️⃣ Arrow   | **Lexical Binding**  | An arrow function is permanently bound to the scope where it was defined                    | `() => this.name` |

 
These notes drew on: [kuro's Blog](https://kuro.tw/posts/2017/10/12/What-is-THIS-in-JavaScript-%E4%B8%8A/), [ExplainThis](https://www.explainthis.io/zh-hans/swe/what-is-this#this-5), and ChatGPT.
