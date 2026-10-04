---
title: "call vs apply vs bind: Explicit, new and Arrow Function Binding of this (Part 2)"
seoTitle: "call vs apply vs bind and this Binding Priority"
description: "The difference between call, apply and bind, with examples of explicit binding, new binding and arrow functions, and which binding of this wins when several apply."
publishedAt: "2025-06-25T03:39:11.465Z"
updatedAt: "2026-10-04T00:00:00.000Z"
category: "javascript"
series: "The this keyword"
---

**call, apply and bind all set a function's `this`.** `call` and `apply` run the function immediately and differ only in how arguments are passed (one by one, or as an array); `bind` doesn't run it but returns a new function with `this` fixed.

[Part 1](/en/front-end/this-keyword-basics/) covered what `this` is and two of the five bindings: default and implicit. This post covers the other three, explicit binding, new binding and arrow functions, and then which one wins when they compete.

## 3️⃣ Explicit binding: call vs apply vs bind

| Method | Runs immediately | Arguments | Use |
| --- | --- | --- | --- |
| `call` | ✅ | One by one | Call now and set `this` |
| `apply` | ✅ | As an array | Call now; handy when the arguments are already an array |
| `bind` | ❌ | One by one (some can be fixed up front) | Doesn't run; **returns a new function** |

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

// bind: doesn't run; returns a new function with this bound
const boundGreet = person.greet.bind(otherPerson, "Hey", "!!");
boundGreet();
// → Hey, I'm Bob!!
```

In short, `bind` creates a new function that differs from the original only in that `this` is fixed to a given object.

`call` and `apply` set `this` at the moment you call the function. The difference:

- `call` takes the arguments one by one
- `apply` takes an array of arguments

### When to use bind: passing a method as a callback

```javascript
function Button(callback) {
  // simulate a click
  callback();
  // callback() is a direct call (default binding): without bind, this isn't app
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

**When you pass a function as an argument (a callback), you need to bind it.** Only the function itself is passed; the `app.` caller doesn't travel with it, so even though you wrote `app.clickHandler`, `this` is lost when it's called: `window` in sloppy mode (`this.name` reads `window.name`), `undefined` in strict mode, which throws.

### When to use call and apply

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

Use call / apply to run one function against different objects, or to set `this` when calling third-party functions.

## 4️⃣ New binding

When you call a function with `new`, it's treated as a constructor function, and **`this` is bound to the newly created object**.

```javascript
function Person(name) {
  this.name = name; // with new, this is the new object
}

const user = new Person("Ada");
console.log(user.name); // Ada

const user2 = Person("Ada"); // without new it's an ordinary call (default binding)
console.log(user2);          // undefined (the function returns nothing)
console.log(window.name);    // "Ada" (this is window in sloppy mode)
```

A `new` call does the following:

1. Creates a new empty object
2. Sets its prototype to `Person.prototype`
3. Binds `this` to that object and runs the function body
4. Returns the new object, unless the function returns a different object

## 5️⃣ Arrow functions (lexical binding)

One of the defining traits of arrow functions:

they have no `this` of their own, **and use the `this` of the scope they were defined in (static binding)**.

That's different from regular functions: **a regular function's `this` is decided when it runs**, while **an arrow function's `this` is fixed when it's defined**.

> - This trips me up all the time when doing coding exercises QQ
> - I use arrow functions so habitually that I'd forgotten how they differ from regular functions XD

```javascript
const obj = {
  name: "Alice",
  greet: function () {
    // sayHi is an arrow function: it uses greet's this, which is obj
    const sayHi = () => {
      console.log(`Hi, I'm ${this.name}`);
    };
    sayHi(); // no obj. in front, but this is still obj
  },
};

obj.greet(); // Hi, I'm Alice
```

With a regular function, `this` gets lost:

```javascript
const obj = {
  name: "Bob",
  greet: function () {
    // regular function
    const sayHi = function () {
      console.log(`Hi, I'm ${this.name}`);
    };
    sayHi(); // direct call, default binding: this is window
  },
};

obj.greet(); // Hi, I'm  (window.name is usually an empty string)
```

### In practice: keeping this in event handlers

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

If `handleClick` were a regular method, the browser would call the handler with `this` set to the DOM element that fired the event (the `<button>`), and `this.label` would be `undefined`. An arrow function (or `this.handleClick = this.handleClick.bind(this)` in the constructor) keeps `this` pointing at the Button instance.

## Binding priority

When several bindings apply at once, which one wins?

**new binding > explicit binding (call / apply / bind) > implicit binding > default binding**

Arrow functions sit outside this ranking: they have no `this` of their own, so call, apply and bind can't change it, and they can't be called with `new` (that throws a `TypeError`).

```javascript
function Person(name) {
  this.name = name;
}

const objA = {};

// explicit > implicit: call's this overrides obj.
const obj = { name: "obj", whoAmI() { return this.name; } };
console.log(obj.whoAmI.call({ name: "call" })); // call

// new > bind: calling a bound function with new gives the new object, not objA
const BoundPerson = Person.bind(objA);
const p = new BoundPerson("Ada");
console.log(p.name);    // Ada
console.log(objA.name); // undefined

// arrow functions: call can't change this
const arrow = () => this;
console.log(arrow.call(objA) === objA); // false
```

- bind, call and apply have no effect on an arrow function's `this`
- Binding an already-bound function again does nothing; the first bind wins
- call / apply / bind on `obj.method` set a new `this`
- With no binding at all, `this` is the global object (`undefined` in strict mode)

## Summary

| Type | Binding | How it works | Example |
| --- | --- | --- | --- |
| 1️⃣ Default | **Default Binding** | Direct call → `this = window` / `globalThis` (`undefined` in strict mode) | `sayHi()` |
| 2️⃣ Implicit | **Implicit Binding** | Called on an object → `this = that object` | `obj.sayHi()` |
| 3️⃣ Explicit | **Explicit Binding** | `call` / `apply` / `bind` set `this` explicitly | `sayHi.call(obj)` |
| 4️⃣ new | **New Binding** | Inside a constructor → `this` is the newly created object | `new Person()` |
| 5️⃣ Arrow | **Lexical Binding** | Arrow functions have no `this` of their own and use the `this` of the scope they were defined in | `() => this.name` |

References: [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), [kuro's Blog](https://kuro.tw/posts/2017/10/12/What-is-THIS-in-JavaScript-%E4%B8%8A/), [ExplainThis](https://www.explainthis.io/zh-hans/swe/what-is-this#this-5)
