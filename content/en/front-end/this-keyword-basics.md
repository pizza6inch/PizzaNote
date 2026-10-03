---
title: "JS Fundamentals: The this Keyword, Part 1 (Definition & Basic Examples)"
seoTitle: "JavaScript this, Part 1: What this Refers To"
description: "Understand JavaScript's this keyword with clear examples: what it is, default binding, implicit binding, and the most common pitfalls."
publishedAt: "2025-06-24T06:57:07.835Z"
updatedAt: "2025-06-24T06:57:07.835Z"
category: "javascript"
series: "The this keyword"
---

## 🔍 What is this?
- `this` is a keyword in JavaScript.
- It is an internal object that is created automatically when a function runs.
- The value of `this` changes depending on how the function is called.
- In most cases, `this` refers to "the object that called the function".



## 📦 A basic example
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
console.log(getAge());         // 15 (or undefined) ❗

```

When you call `people1.getAge()`, `this` is `people1`.

When you call `getAge()` directly, `this` is `window` (in a browser) or `global` (in Node.js on the server).

So the last line returns `window.age`, which is 15. In `"use strict"` mode, however, it becomes `undefined`.

If a function is not called through any object (there is no `obj.` in front of it), `this` points to `window` by default. This is called **Default Binding**.

> ## What is `window` in the browser?
> `window` is the browser's global object. It holds:
> - document
> - localStorage
> - console
> - ...and other global APIs

## 🎯 Worked exercises

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

`this.count++` operates on `window.count`, not on `foo.count`, so the result is still 0.

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
This prints `undefined`.
Inside `foo`, `this` is `window`, so `this.bar()` calls `window.bar()`. Inside `bar`, `this` is again `window`, and `window.a` is not defined.
```javascript
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
## 🧭 this in nested scopes
```javascript
var a = 1

var obj = {
  a: 2,
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
`fn2` is called directly, so `this` points to `window` and it prints 1.



## 🎯 How to tell what this is, quickly
✅ Check whether the call has a `.` in front of it:

- `obj.fn()` → `this` = `obj` (implicit binding)
- `fn()` → `this` = `window` (default binding)


## 📚 The 5 ways this gets bound

| Type         | Official name (Binding Type)   | Binding rule                                | Example                |
| ---------- | -------------------- | ------------------------------------- | ----------------- |
| 1️⃣ Default   | **Default Binding**  | Called directly → `this = window` / `global`   | `sayHi()`         |
| 2️⃣ Implicit   | **Implicit Binding** | Called on an object → `this = that object`                  | `obj.sayHi()`     |
| 3️⃣ Explicit   | **Explicit Binding** | `call` / `apply` / `bind` set `this` explicitly | `sayHi.call(obj)` |
| 4️⃣ new | **New Binding**      | Inside a constructor → `this` is the newly created object                | `new Person()`    |
| 5️⃣ Arrow   | **Lexical Binding**  | An arrow function is permanently bound to the scope where it was defined                    | `() => this.name` |


## ✅ Summary
The value of `this` is not fixed. It is decided by *how* the function is called.

The two cases people get wrong most often are default binding and implicit binding, and this article has covered both.

**To predict `this`, ask yourself one question: who is calling this function?**


## 🔜 Coming up next

How to use `call` / `apply` / `bind` (explicit binding)

How the `new` keyword changes `this`

Why arrow functions don't have their own `this`
