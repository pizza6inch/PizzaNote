---
title: "What Is this in JavaScript? Default and Implicit Binding (Part 1)"
seoTitle: "JavaScript this: Default and Implicit Binding"
description: "Understand JavaScript's this with examples: what this is, why one function gets a different this, default and implicit binding, and what strict mode changes."
publishedAt: "2025-06-24T06:57:07.835Z"
updatedAt: "2026-10-04T00:00:00.000Z"
category: "javascript"
series: "The this keyword"
---

**`this` is a value JavaScript decides each time a function runs**: call the same function in different ways and `this` points at different things. Most of the time, `this` is "the object that called the function", the `obj` before the dot in `obj.fn()`.

## What is this?

- `this` is a JavaScript keyword
- Every time a function is called, JavaScript decides what `this` refers to for that call (usually an object; in strict mode it can also be `undefined`)
- What matters is **how the function is called**, not where it's written (arrow functions are the exception, covered in part 2)
- Most of the time, `this` is "the object that called the function"

## A basic example

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
console.log(getAge());         // 15 ❗ (throws in strict mode)
```

In `people1.getAge()`, `this` is `people1`.

When `getAge()` is called directly, `this` is the global object: `window` in a browser, `globalThis` in Node.js.

So the last line returns `window.age`, which is 15. In strict mode (`"use strict"`, inside a `class`, or in `<script type="module">`), `this` is `undefined` for a direct call, and `this.age` throws a `TypeError`.

If a function isn't called by any object (there's no `obj.` in front), `this` defaults to the global object. This is called **default binding**.

> ### What is window in the browser?
> `window` is the browser's global object. It holds:
> - document
> - localStorage
> - console
> - ...and other global APIs
>
> Variables declared with `var` at the top level also become properties of `window`, which is why `var age = 15` above can be read as `window.age`. `let` and `const` don't.

## Worked exercises

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

`foo()` is a direct call, so `this.count++` works on `window.count`, not `foo.count`. The result is still 0.

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

This prints `undefined`.
Inside `foo`, `this` is `window`, so `this.bar()` is `window.bar()`, and inside `bar`, `this` is also `window`. `a` is a local variable of `foo`; `window.a` is not defined.

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

The same function gets `this = obj` when `obj` calls it (**implicit binding**) and `this = window` when called directly (default binding).

## this in nested functions

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

`fn2` is written inside `fn1`, but it's called directly, so `this` is `window` and it prints 1. A function doesn't inherit `this` just because it sits inside an object's method.

## How to tell what this is, quickly

Check whether there's a dot in front of the call:

- `obj.fn()` → `this = obj` (implicit binding)
- `fn()` → `this = window`, or `undefined` in strict mode (default binding)

## The 5 ways this gets bound

| Type | Binding | How it works | Example |
| --- | --- | --- | --- |
| 1️⃣ Default | **Default Binding** | Direct call → `this = window` / `globalThis` (`undefined` in strict mode) | `sayHi()` |
| 2️⃣ Implicit | **Implicit Binding** | Called on an object → `this = that object` | `obj.sayHi()` |
| 3️⃣ Explicit | **Explicit Binding** | `call` / `apply` / `bind` set `this` explicitly | `sayHi.call(obj)` |
| 4️⃣ new | **New Binding** | Inside a constructor → `this` is the newly created object | `new Person()` |
| 5️⃣ Arrow | **Lexical Binding** | Arrow functions have no `this` of their own and use the `this` of the scope they were defined in | `() => this.name` |

## Summary

`this` isn't fixed; it depends on **how** the function is called.

Default and implicit binding are the easiest to get wrong, and this post has covered both.

**To predict `this`, just ask: who is calling this function?**

## Next up

[Part 2](/en/front-end/this-binding-control/) covers:

- The difference between call, apply and bind (explicit binding)
- How the `new` keyword decides `this`
- Why arrow functions have no `this` of their own
- Which binding wins when several apply at once

References: [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), [kuro's Blog](https://kuro.tw/posts/2017/10/12/What-is-THIS-in-JavaScript-%E4%B8%8A/)
