## docker管理员必备技能

最近公司开始采用docker来分发开发环境了，我成为了docker仓库的管理人员和所有docker分发前的试用人员。比起一般的对docker仅仅有分发需求的开发者来说，这个角色需要掌握更多的技巧，不过贵在积累，下面是我整理的在docker部署过程中的技巧小合集



## 基本操作

关于基本操作，例如docker ps这些其实都是不用提及的，因为使用过于频繁所以一般不会忘记，主要有如下几个操作需要记忆：

1. 目录挂载

   ```shell
   docker run -it -v /home/volume:/home alpine /bin/bash
   ```

这里要注意的就是顺序不能颠倒，先是宿主机，后是容器。然后要注意全部要使用绝对路径，由于很多时候我们并不希望主机和容器之间有什么我们察觉不到的关联，换句话说，如果容器能够不可控的改变我们文件系统中的文件，那么是非常不合适的，所以应该为容器挂在建立一个单独的，专属的路径。

2. 删除容器

有时候，我们在测试docker容器的可用性的时候，只需要有一个符合我们需求的即可，但是在这个过程中，我们会尝试许多其他的image，在获取到我们需要的image的时候，我们需要删除其余的并不符合我们需要的image，此时，我们就需要用到golang的字符模版以及awk脚本，如下：
```shell
docker rm $(docker ps -a -q)
```

删除所有未打 tag 的镜像:

```shell
docker rmi $(docker images -q | awk '/^<none>/ { print $3 }')
```
这里用到了awk脚本，所以这个命令也仅限于linux环境下使用，或者是boot2docker。

删除所有镜像：

```shell
docker rmi $(docker images -q)
```

这样的删除往往是遇到了什么好无头绪的问题，子啊一般情况下，我们需要按照容器的状态按需删除一些容器即可：

```shell
docker rm $(docker ps -qf status=exited)
```