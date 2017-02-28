## Javascript中的函数

作为完全面向对象以及函数是一等公民的Javascript，函数在Javascript的早期担任了包括创建对象的工厂函数，限定作用于的闭包函数等许多“超纲”的功能。
随着块级作用域和类的出现，Javascript中的函数也逐渐回归到设计者的初衷。

函数继承自Function对象，使得函数能够成为构造函数；限定了函数作用域，使得JS具有有变量提升和闭包特性；支持高阶函数，使得函数式编程和链式调用能够实现。

不过函数也有一些不那么令人愉快的东西，Douglas Crockford就提出，
1. arguments对象就是其中之一，幸好现在我们有了rest参数。
2. 当然，还有令许多初学者望而却步的this，上下文原本是意见容易理解的是，但是配合上函数作用域就有些不那么利索。
3. 况且在JS中，很多情况下我们需要的函数是一个callback函数，而且是作为参数传入的，也就是说，是个匿名的函数。

综上种种需求，ES6终于推出了适合时代的新特性，箭头函数（arrow function）。

## 语法特性

基础语法：

```javascript
(param1, param2, …, paramN) => { statements }
(param1, param2, …, paramN) => expression
         // equivalent to:  => { return expression; }

// 如果只有一个参数，圆括号是可选的:
(singleParam) => { statements }
singleParam => { statements }

// 无参数的函数需要使用圆括号:
() => { statements }

// 返回对象字面量时应当用圆括号将其包起来:
params => ({foo: bar})

// 支持 Rest parameters 和 default parameters:
(param1, param2, ...rest) => { statements }
(param1 = defaultValue1, param2, …, paramN = defaultValueN) => { statements }

// 支持在参数列表中使用解构赋值
var f = ([a, b] = [1, 2], {x: c} = {x: a + b}) => a + b + c;
f();  // 6
```
可以看出，箭头函数和其他语言中的Lambda表达式实际上是一个目的，缩短了书写的长度，是代码更加优雅。

不过，与其他一些语言中Lambda表达式仅仅是一个语法糖相比，箭头函数还具备更多的特性。

## 与一般匿名函数的区别

### 不绑定this

this的本质是运行的上下文环境。在箭头函数出现之前，每个新定义的函数都有其自己的  this 值（例如，构造函数的 this 指向了一个新的对象；严格模式下的函数的 this 值为 undefined；如果函数是作为对象的方法被调用的，则其 this 指向了那个调用它的对象）。在面向对象风格的编程中，这被证明是非常恼人的事情。

```javascript 
function Person() {
  // 构造函数 Person() 定义的 `this` 就是新实例对象自己
  this.age = 0;
  setInterval(function growUp() {
    // 在非严格模式下，growUp() 函数定义了其内部的 `this`
    // 为全局对象, 不同于构造函数Person()的定义的 `this`
    this.age++; 
  }, 1000);
}

var p = new Person();
```
在 ECMAScript 3/5 中，这个问题可以通过新增一个变量来指向期望的 this 对象，然后将该变量放到闭包中来解决。

```javascript
function Person() {
  var self = this; // 也有人选择使用 `that` 而非 `self`. 
                   // 只要保证一致就好.
  self.age = 0;

  setInterval(function growUp() {
    // 回调里面的 `self` 变量就指向了期望的那个对象了
    self.age++;
  }, 1000);
}
```
除此之外，还可以使用 bind 函数，把期望的 this 值传递给 growUp() 函数。

```javascript
function Person() {
  this.age = 0;

  setInterval(function growUp() {
    this.age++;
  }.bind(this), 1000);  //this 被bind到了Person上
}
```

箭头函数则会捕获其所在上下文的  this 值，作为自己的 this 值，因此下面的代码将如期运行。

```javascript
function Person(){
  this.age = 0;

  setInterval(() => {
    this.age++; // |this| 正确地指向了 person 对象
  }, 1000);
}

var p = new Person();
```
这个特性最直观的好处就是，self或者that在以后的书写中可以不用出现了。

### 不绑定 arguments

箭头函数不会在其内部暴露出  arguments 对象： arguments.length, arguments[0], arguments[1] 等等，都不会指向箭头函数的 arguments，而是指向了箭头函数所在作用域的一个名为 arguments 的属性，当然，如果箭头函数所在的作业域并未定义这个属性，那么将会是undefined。

```javascript
var arguments = 42;
var arr = () => arguments;

arr(); // 42

function foo() {
  var f = () => arguments[0]; // foo函数内置的arguments对象传递了进来
  return f(2);
}

foo(1); // 1
```
不过上文提到过，rest参数可能是比arguments更好的解决方案：

```javascript
function foo() { 
  var f = (...args) => args[0]; 
  return f(2); 
}

foo(1); // 2
```
