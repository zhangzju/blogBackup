## JavaScript基础：利用闭包特性循环绑定事件

## 闭包

关于JavaScript的闭包特性的解释，在各种各样的书籍和博客上已经足够多了，他的概念也很清楚：var声明的具有函数作用域的变量，会在整个作用域链上还有可能被调用的情况下，完整地保存着整个作用域。

在ES 6中，JavaScript迎来了和传统的块级作用域一样的用于声明宇哥变量的关键字let，但是，这并不意味着闭包特性是要被抛弃的。恰恰相反，由于闭包在面对异步编程时具有的特性，许多其他的编程语言也开始尝试支持闭包特性。

## 经典例子

在人们谈及闭包的时候，往往会举这样一个例子：

```javascript
var myObject = (function () {
  var value = 0;
  
  return {
    increment: function (inc) {
      value += typeof inc === 'numner' ? inc :1;
	},
    getValue: function () {
  		return value;
	}
	}
}());
```

相比于使用对象字面量去初始化一个对象，上面的写法能够保证我们需要的值不会被修改，因为每一次当外部想要获取value的值的时候，他们都无法直接获取到，而是getValue()从myObject的保存下来的作用域链中获取，而这是闭包特性的一个出色之处，即使是在动态的环境中，利用闭包特性就可以实现不被外部环境干扰。

## 循环绑定

在DOM事件的处理中，很多时候需要面临一个很普遍的问题，就是有许多元素需要绑定一些类似的事件，例如一个表格中所有的单元格都需要有一个focus事件，当处于鼠标的focus状态时，就触发放大镜弹窗。对于每一个单元格来说，他们的函数的实现基本是大同小异的，所差别的仅仅是放大镜的位置以及所显示的数值的差别。这样的情境下，一般我们会采取两种办法：

1. 委托代理
2. 利用闭包实现循环复制

委托代理不是本文讨论的范围。那么，为什么需要使用到闭包呢？

假如我们不使用闭包特性，直接对DOM元素进行循环赋值，会出现什么样的结果呢？

```javascript
var hint = ["必填,长度为4-18个字符", "", "再次输入相同密码", "格式: example@github.com", ""];
    var inputIDs = ["ip-name", "ip-pwd", "ip-pwd-cfm", "ip-email", "ip-phone"];
    for (var i = 0; i<hint.length; i++) {
        document.getElementById(inputIDs[i]).addEventListener("focus", function (e) {
            var tar = e.target.parentElement.getElementsByClassName("alert")[0];
            tar.innerHTML = hint[i];
        });
    }
    
```

上述的代码是在为一系列的ID选择器选中的元素进行绑定和赋值，事件是focus。

按照预想的情况，当我们绑定ID为“ip-name”的元素的时候，focus事件应该是会有innerHTML的变化，改变为我们hint数组中存储的第一个字符串。

但是，实际的结果确实，**所有被绑定事件的元素，他们的focus事件出发后，innerHTML都会变化为hint数组中最后一个字符串。**

对于熟悉JavaScript的异步特性以及引用传递的同学来说，这很好理解，在我们对每一个列表中的元素进行事件绑定的时候，实际上我们是把hint[i]对应的字符串传递给了我们选中的元素，这里是引用传递，然而，事件的绑定和事件的触发是异步的，也就是说，当所有事件绑定结束，hint[i]早就已经指向了这个数组的最后一个字符串，所有被绑定事件的元素，他们接收到的值也变为了数组的最后一个字符串。

那么，如何利用闭包来防止引用传值和异步带来的这个问题呢？其实和之前所说的一样，只要返回一个函数，然后再函数作用域中保存住hint[i]，即可实现规避之后hint[i]的后续变化的影响，达到最初设想的方案：

```javascript
var hint = ["必填,长度为4-18个字符", "", "再次输入相同密码", "格式: example@github.com", ""];
    var inputIDs = ["ip-name", "ip-pwd", "ip-pwd-cfm", "ip-email", "ip-phone"];
    for (var i = 0; i<hint.length; i++) {
        document.getElementById(inputIDs[i]).addEventListener("focus", (function (i) {
            return function(e){
                var tar = e.target.parentElement.getElementsByClassName("alert")[0];
                tar.innerHTML = hint[i];
            };
        })(i));
    }
```

因为在return的时候，返回值作为一个函数，他的作用域中的值就已经被保存下来，此时，赋给相对应的元素的值不再是一个引用，而是保存在内存中的一个固定的值，这样的方式，是的无论此后发生了什么变化，这个return的函数的作用域保存在内存中都不会被干扰，除非我们从元素上移除了对应的事件。