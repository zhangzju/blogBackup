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

```Javascript
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





