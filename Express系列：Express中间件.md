

## 广义的中间件

下面是一个简单的node.js文件上传的例子，使用了busboy模块：

```javascript
var http = require('http'),
    path = require('path'),
    fs = require('fs');
 
var Busboy = require('busboy');
 
http.createServer(function(req, res) {
  if (req.method === 'POST') {
    	//数据校验
      if(!/multipart\/form-data/i.test(req.headers['content-type'])){
          return res.end('wrong');
      }
       
      var busboy = new Busboy({ headers: req.headers });
    	//调用busboy模块
      busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        //这里是设置下载后目录的
        var saveTo = path.join(__dirname,'upload', path.basename(filename));
        file.pipe(fs.createWriteStream(saveTo));
      });
      busboy.on('finish', function() {
        res.writeHead(200);
        res.end('upload OK!');
      });
      return req.pipe(busboy);
  }else{
      //响应
      fs.readFile('upload.html', function(err, data) {
          res.writeHead(200);
          res.end(data);
      });
  }
}).listen(8000, function() {
  console.log('Listening for requests');
});
```

在上面这点代码中，不发现，实际上整个请求的处理是经过了数据校验，busboy模块处理，最终的响应三个步骤。web请求就像stream一样经过了这三个部分，除了最终的响应，我们可以在这个stream中添加任意的模块，就像busboy一样。

类似于busboy这样，只在web请求达到和返回的整个处理过程中，负责一部分功能，即插即用的模块，就是所谓的中间件。中间件这个概念在很多地方都存在着，从Flask这样的后端，到Redux这样的数据管理，中间件都是他们用于扩展自身的功能的重要手段。

## Express的中间件

对于Express来说，所有的中间件都是通过app.use()来调用，一个中间件必备的条件有：
1. 必须是一个函数，接受三个参数，即请求参数，相应参数以及next().
2. 如果有错误处理中间件，那么还应该接受err对象作为第四个参数.
3. 所有的请求都会经过中间件，因此要如果仅仅是对某一部分路由的功能，需要处理好污染问题.

简单来说，任何一个符合上面前两个条件的函数都可以是中间件，最简单的中间件莫过于如下类型：
```javascript
app.use(function(req, res, next) {
  next();
});
```
当然这个中间件是没什么意义的。

这里需要注意的一点是，一些js基础不是很扎实的同学容易在中间件中直接修改req，res的值，要知道，js的对象全都是引用传递的，这样直接更换引用的赋值修改实际上对于全局来说是什么也没修改。

## Middleware的顺序

js擅长处理异步的场景，对于http请求来说，某些中间件，例如上传文件的中间件中，一个文件上传完毕需要花费一定的时间，通常这个时候js不会堵塞而是去执行下一段代码，等到文件上传完毕之后再通过回调函数来回到之前停止的地方。

但是Express却并没有采取这样的设计，所有的中间件都是按照在词法编译中引用的顺序来串行执行，遇到异步会阻塞。这是为什么呢？隐隐也很简答吗，因为中间件之间也有可能有依赖关系，串行执行让我们能够控制好执行的顺序，这样就不会出现因为模块依赖没有提前加载而出Reference Error。

例如如下代码：
```javascript
app.use(function(req, res, next) {
  console.log('first log');
  next();
});

app.use(function(req, res, next) {
  console.log('second log')
  next();
});
```