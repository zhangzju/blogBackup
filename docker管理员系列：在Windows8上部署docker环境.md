## docker的环境选择

docker原生仅支持Linux各家发行版，因为docker最初是基于LXC(Linux Container)容器技术发展而来，最初也是和CoreOS结合使用，对Linux内核的依赖显而易见。在Mac和Windows上，Docker均是以虚拟机的方式实现支持。
对于Windows来说，由于Win10开始，Windows内置了Hyper-v虚拟机，可以运行ubuntu子系统，因此能够“原生”支持docker。因此，具体的支持情况如下：
1. Mac：boot2docker虚拟机支持
2. Linux： 原生支持
3. Win10： 借助Hyper-v进行原生支持
4. Win8&&Win7: 使用docker toolbox来虚拟支持

## Windows低版本的docker部署

在Windows7和Window8上，部署docker的方式是使用官方提供的docker toolbox工具集来启动和通过ssh来连接操作基于boot2docker 的虚拟机。

docker toolbox包含了三个基本的软件：负责安装虚拟机的virtualbox，负责管理集群的kitematic,负责提供交互输入窗口的docker quiskctart terminal。
在Windows上，先要实现模拟linux内核的操作来支持docker，只能通过虚拟机来实现，在win7和win8中，docker toolbox自带了virtualbox这款开源虚拟机软件，
用于虚拟机的镜像则是boot2docker。

在Windows8上部署docker环境，首先需要准备的就是docker toolbox软件，为了部署方便，docker toolbox对virtualbox进行了封装，因此安装较为方便，一键按到底即可。

上面一步完成后，可以发现桌面上出现了三个新的图标，使用管理员权限点击docker quick start之后，docker变开始部署他的本地运行环境，具体的流程是：
1. 查找本地的boot2docker镜像，选取最新的版本
2. 如果本地没有镜像，则向github下载最新的stable版本
3. 在virtualbox中创建名为default的虚拟机
4. 在虚拟机中启动boot2docker
5. 为虚拟机default设置ssh和ip

以上五步完成之后，即可在windows低版本上使用docker 的基本命令了。

## 编译生成最新的boot2docker 

在docker toolbox的初始化过程中，需要有boot2docker镜像来创建虚拟机，但是由于github的网络原因，这样的方式往往会有很长的时延，因此我们需要采取一些方式来加速
这个过程。由于docker toolbox能够自动识别，所以我们只需要将提前准备好的boot2docker镜像，由于AWS的网络是个很大的问题，因此我们可以采取本地编译的方式生成较新的
用于虚拟机的镜像则是boot2docker。

首先，我们从dockerhub中获取镜像：
```shell
sudo docker pull boot2docker/boot2docker  
```

然后再当前路径下建立一个dockerfile文件，用于从boot2docker中读取相关的配置：

```shell
echo "FROM boot2docker/boot2docker" > Dockerfile
```
上面的命令制定了是从本地的boot2docker来构建我们的ISO文件。

然后输入下面的命令开始转移
```shell
echo 'CMD ["cat", "boot2docker.iso"]' >> Dockerfile 
```

dockerfile完成后，我们开始build这个镜像：
```shell
sudo docker build -t my-boot2docker-img .  
```

最后，将我们的镜像生成：
```shell
sudo docker run --rm my-boot2docker-img > boot2docker.iso 
```

## 排除网络问题

在开发过程中，由于时常需要使用不同的操作系统，因此很多人的PC上已经存在了vmware，由于docker toolbox需要virtualbox软件，这就导致有可能出现某一方的虚拟机出现异常，
而网络模块是其中最有可能出现异常的。

由于docker toolbox是根据ssh进行连接的，因此能否在网络出现冲突的时候排除网络问题，是启动docker的关键。为了保证能够在docker使用中的正常，可以遵照下面的步骤来解决问题：

1. 关闭docker terminal，打开virtualbox，删除名为default的虚拟机。
2. 关闭VMware进程，这里可以不关闭相关的服务，只需要VMware没有虚拟机在运行即可。
3. 打开网络设备管理中心，禁用掉VMware的虚拟网卡。
4. 重新启动计算机，打开docker terminal，进入初始化。

一般经过上面的步骤，即可解决网络问题。


## 其他环境

1. 在win10环境中，使用官方提供的基于Hyper-v虚拟机实现的安装包Docker for Windows即可，需要注意的是，Docker原生版本仅支持build10520以上的版本。
2. 在Ubuntu环境中，12.04版本和14.04版本需要对内核进行升级或者添加补丁，使其支持LXC技术，因此推荐使用Xenial版本，即Ubuntu 16.04或者以上。目前
我们公司的Ubuntu Xenial镜像源已经支持最新版本的docker环境，具体的操作如下：

首先在虚拟机中安装好Ubuntu 16.04的虚拟机，配置好网络环境使其可以连接内网，然后下载配置好的内网源文件：
```shell
wget http://rdsource.tp-link.net/help/Ubuntu/xenial/sources.list
```

然后备份原有的Repo文件：
```shell
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

使用新的Repo文件来替换之前的Repo文件：
```shell
sudo cp sources.list /etc/apt/
```
更新镜像源信息：

```shell
sudo apt update&& sudo apt upgrade 
```

更新完毕没有报错，则可以安装docker环境：

```shell
sudo apt install docker.io
```

安装完成后，docker环境就已经配置完成，但是首先要重新启动一遍docker确保能够正确连接到docker 的daemon进程：
```shell
sudo systemctl restart docker.service
```
现在就可以使用Docker了:
```shell
sudo docker info
```

需要注意的是，docker的所有操作都需要在管理员权限下进行操作，切换到root用户是必须的。