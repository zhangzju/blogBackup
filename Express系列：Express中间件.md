## Web请求的反序列化

在Express以及许多以中间件为处理方式的框架，例如Koa，PHP的Slim框架等等，对于Web请求，都是采取一种将请求与响应分治的方式进行业务处理。

不同于Rails的一开始就通过路由分发请求，对不同的请求进行单独的处理的设计思想，Node.js诞生之初就继承了JavaScript的许多原生的特点，包括“流”式的处理。这就意味着，每一个来到Express的请求，实际上无论做不做处理，都会经历一遍一个完整的Express的处理过程，而这个处理过程是单一的流，通过对不同的请求对象的判断来进行不同的处理，而中间件正是这个基础下诞生的处理方式。

## 普通的请求处理

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

在上面这点代码中，不发现，实际上整个请求的处理是经过了数据校验，busboy模块处理，最终的响应三个步骤。

