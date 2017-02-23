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
1. 查找本地的boot2docker景象，选取最新的版本
2. 

## 编译生成最新的boot2docker 

在

## 排除网络问题

## 配置加速器