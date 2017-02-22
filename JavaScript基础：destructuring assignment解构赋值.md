## JavaScript任意门：destructuring assignment解构赋值

### 引用传递

对于JS的对象和数组来说，是按照传递引用来传值的，这一点在许多书上有过误导，例如《JavaScript高级程序设计》这本书中有这样一段话：*有很多开发人员错误的认为：在局部作用域中修改的对象会在全局作用域中反映出来，就说明参数是按引用传递的。*

作者引用了一段代码来证明他的观点：

```javascript
function setName(obj) {
  obj.name = "Nicholas";
  obj = new Object();
  obj.name = "Greg";    
}

var person = new Object();
setName(person);
alert(person.name); // "Nicholas"
```

实际上，上面这段代码中，person对象的name属性转变为Greg，并不是因为值传递的缘故，而是因为在使用new来构造新的对象的时候，改变了 原始的obj的引用，同样的，也可以用一段代码来说明js是引用传递的，只要去除new运算符即可：

```javascript
a
Object {value: 30}
ss
obj=>obj.value+=10
a.value
30
ss(a)
40
a.value
40
```

上面的代码是在chrome的console中运行的，我们发现作为function的ss，能够改变在函数作用域之外的对象的属性值，这说明，即使是传参数，也是按照引用传递。

### 深度复制

按照引用传递带来了一些问题，因为你永远也不会因为简单的赋值而复制一个对象或者数组，当然也包括函数，所以无可避免的会造成，加入你仅仅是通过赋值的等号来构造一个“新的”对象，那么你的很多操作都会影响到之前那个对象，这通常是一种污染。

在传统的方法中，我们通过Deep Copy操作来实现所谓的深度复制，即复制一个和之前没有联系的新的对象。一般的做法是通过先转化为字符串，在通过字符串模板来构造，例如：

```javascript
var newObject = JSON.parse(JSON.stringify(oldObject));
```

不过这样的方法缺陷也很明显，如果原有的对象的某些属性也是引用的话，这样的复制无法达到我们预想中的效果。为了能够将引用来复制进来，我们需要修改成如下的形式：

```javascript
var cloneObj = function(obj){
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ? 
            cloneObj(obj[i]) : obj[i]; 
        }
    }
    return newobj;
};
```

上面的方法递归地把引用逐个进行复制，从而完成了真正的值传递。

jQuery也实现了一个用于深度复制的方法jQuery.fn.extend()，所不同的是，这个方法通过接受第一个参数来判断是否进行深度复制，加入arguments[0]的类型是bool值，则可以根据true或者false来进行深度复制或者浅复制，算法和上面的算法类似，具体代码如下 ：

```javas
jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};
```



然而，进入了ES6时代，我们有了更加出色的方法实现这一操作，这就是[destructuring assignment](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

### **destructuring assignment**

在ES6中，JavaScript第一次引入了结构复制，使得赋值这一基本操作得到了极大地扩展。

由于传统的JavaScript并没有类的概念，即使是ES6的class实际上也只是为了适应更加函数式的语法而添加的语法糖，在JS中，我们习惯使用对象字面量来对一个对象进行赋值。对象字面量和其他编程语言中的“匿名“的写法如出一辙，新建一个没有引用的对象，方便与GC及时处理掉这个新建的对象，除非我们通过赋值给他添加一个引用。

解构赋值的目标是能够和perl语言那样一次进行多个赋值。例如现在我们要交换两个变量的值的时候，一般都需要一个临时变量来操作，或者采取下面的操作：

```javascript
let a=1;
let b=2;

a=a+b;
b=a-b;
a=a-b;

```

这当然是一种投机取巧的方法，但是假如我们需要进行上百次操作的时候，那么实际上这里需要进行三次赋值，效率上说，并没有提升，甚至还增加了运算的开销。那么，解构赋值如何操作呢？

```javascript
{a, b}={b, a}
```

一次赋值就实现了所需的功能。这种语法在多组赋值的时候显得非常实用。

在之前我们事先深度复制的时候，采用的方法是多次赋值，那么也就是说，上面的深度复制的方法，完全可以使用解构赋值来实现只用一次赋值就可以深度复制整个对象或者数组。首先应该想到是使用对象字面量进行解构赋值：

```javascript
var {a, b} = {a:1, b:2};
console.log(a); // 1
console.log(b); // 2
```

数组也是一样的形式。可以发现解构赋值只需要前后一一对应，即可实现安全的赋值。

解构赋值还可以实现赋给空值来抛弃不需要的值：

```javascript
{a, b, , d} = {a:1, b:2, c:3, d:4}  
```

更为方便的是，可以将多余的值通过”...“前缀来赋给单一的变量：

```javascript
{a, b, ...rest} = {a:1, b:2, c:3, d:4} 
```

这里有一点需要注意，以上两个语句单独存在是会报错的，因为JavaScript会把花括号默认解析为语句块，所以在进行解构赋值之前，你需要先声明。

除了对象字面量，对于一般的对象，需要包裹一个用于表示对象字面量的花括号来实现结构赋值：

```javascript
var obj = {a:1, b:2, c:3, d:4};
{a, b, , d} =  obj;
```

解构赋值也支持预定于缺省值：

```javascript
var o = {p: 42, q: true};
var {p = 32, q = false} = o;

console.log(p); // 42
console.log(q); // true 
```

这个特性在给函数传值的时候会很有帮助。由于缺省值可以是对象，那么也就可以实现对对象的嵌套的解构赋值，能够轻而易举的实现深度复制。

例如：

```javascript
var metadata = {
    title: "Scratchpad",
    translations: [
       {
        locale: "de",
        localization_tags: [ ],
        last_edit: "2014-04-14T08:43:37",
        url: "/de/docs/Tools/Scratchpad",
        title: "JavaScript-Umgebung"
       }
    ],
    url: "/en-US/docs/Tools/Scratchpad"
};

var { title: englishTitle, translations: [{ title: localeTitle }] } = metadata;

console.log(englishTitle); // "Scratchpad"
console.log(localeTitle);  // "JavaScript-Umgebung"
```

解构赋值还有很多有趣的特性和待发掘的用途，例如可以使用正则表达式进行解构，替代String.replace()等等。不过在ES6中，解构最大的贡献，还是为模块化提供了强大的支持，很多开发者即使并没有可以了解过解构赋值，但是他们一定见过这样的语句：

```javascript
const { Loader, main } = require('toolkit/loader');
```

尤其是使用vue.js和React的开发者，这样ES6风格的模块写法，正式引入了解构赋值之后应该具有的模块导入方式。很显然，相比于common.js和CMD等等原来的模块调用方式，使用了解构的import模块一次不需要写配置文件，更加灵活轻便。

