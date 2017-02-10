# 使用apache2和nginx进行端口转发代理

## 使用场景

许多开源软件，包括gitlab，redmine以及jenkins，在安装完成之后，出于系统的权限和安全考虑，不会占据1024 以下的系统保留端口。

但是这些软件安装包开箱即用的特性，确实带来了很大的便捷。

这个情况下，一般采取的做法是两种：

1. 使用uwsgi或者passenger这样的插件来实现用nginx接收请求，用application来处理。
2. 直接使用apache2或者nginx的端口映射，做一个proxy的代理。

这里就来记录一下第二种方法的操作和踩坑过程。

## Apache2

以jenkins为例，jenkins安装完成之后会暴露8080，现在使用apache2来讲80 端口的所有请求转发到8080，实现反向代理。

首先需要安装apache2：

```shell
 sudo aptitude install apache2
```

然后使用apache2提供的a2enmod工具来开启proxy模块，a2enmod是apache2开启模块的入口，除了proxy之外，rewrite等常见的功能也可以受用a2enmod来开启：

首先打开proxy：
```shell
 sudo a2enmod proxy
```

然后打开针对http的proxy:

```shell
 sudo a2enmod proxy_http
```
到了这一步还有一个问题，那就是apache2安装完成之后会有一个default site，就是我门熟知的那个写着“It works”的页面，现在我们要更改配置，先关闭这个站点。

这里需要使用到apache2关闭站点的命令a2dissite，首先我们要查看默认站点的名字，一般是default或者000-default，可以在

```shell
  ls /etc/apache2/sites-enabled/
```
打印出的信息中看到现在已经有的site的根路径。

然后我们关闭掉默认站点：

```shell
 sudo a2dissite 000-default
```

现在我们可以设置端口转发了，在 __/etc/apache2/sites-available__ 路径下建立一个配置文件jenkins.conf， 里面是经典的apache格式的类xml配置写法。

```xml
<VirtualHost *:80>
	ServerAdmin webmaster@localhost
	ServerName ci.company.com
	ServerAlias ci
	ProxyRequests Off
	<Proxy *>
		Order deny,allow
		Allow from all
	</Proxy>
	ProxyPreserveHost on
	ProxyPass / http://localhost:8080/ nocanon
	AllowEncodedSlashes NoDecode
</VirtualHost>
```
然后我们启用我们的配置文件：

```shell
 sudo a2ensite jenkins
```
现在重启apache2服务，即可实现端口转发。

```shell
sudo apache2ctl restart
```

## nginx

nginx并没有提供那么多的操作命令来帮助我们进行设置，毕竟nginx是基于配置的高性能，轻量级的宗旨。

首先我们还是要移除默认的配置，这里要说明以下，干这种事，千万要记得备份，血与泪的教训，不多说了。

```shell
 cd /etc/nginx/sites-available
 sudo rm default ../sites-enabled/default
```
然后我们添加我们新的设置，实际上如果你是删除了原有的配置的话，那么我们现在的配置就是唯一的配置：

在配置路径下新建jenkins，然后写入以下内容：

```xml
upstream app_server {
    server 127.0.0.1:8080 fail_timeout=0;
}

server {
    listen 80;
    listen [::]:80 default ipv6only=on;
    server_name ci.yourcompany.com;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_redirect off;

        if (!-f $request_filename) {
            proxy_pass http://app_server;
            break;
        }
    }
}
```

注意替换掉配置文件中的'ci.yourcompany.com'，这应该是你知道的域名。

接下来把我们在available路径下的配置文件软连接到enabled，实现能够被启用：

```shell
 sudo ln -s /etc/nginx/sites-available/jenkins /etc/nginx/sites-enabled/
```

然后重新启动nginx 的服务即可实现了。

```shell
 sudo service nginx restart
```

## conclusion

实现同样的功能，仅从操作上说，apache2似乎更加方便，而nginx更适合那些比较熟练的用户，这也体现了两家服务器设计理念的差异。

不过对于我们用户来说，完成任务就好！