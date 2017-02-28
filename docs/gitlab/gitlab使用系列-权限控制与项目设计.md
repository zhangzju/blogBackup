## 与SVN的差异

git作为版本控制系统，经过十几年的发展，目前已经成为软件开发的首选VCS，相比于之前使用的SVN，git的优势何在呢？

|  | SVN  | Git |
| :------------ |:---------------:| -----:|
| 本地操作     | 无法提交修改，无法保存版本 | 可以提交修改，保存版本 |
| 文件污染      | 每个子目录都有.svn，还有svn lock        |   子目录中的文件可选，.git文件夹可删除|
| 分支支持 | 集中受控，分支操作受限        |    分布式协作，可以自由掌控分支 |
| 冲突合并 | 不支持自动合并，冲突会被覆盖  | 强大的合并功能以及可视化代码对比，不会覆盖 |

## 项目

一个项目根据其代码的安全特性，在gitlab上分为三个等级：
1. Public：适用于对所有用户普遍开放的代码
2. Internal：适用于某一部分成员内部开放的代码
3. Private： 适用于单独开发未发布的仓库

一个项目还可以根据设置不同的可见等级，用于对不同的人群开放，等级包括：
* Disabled: 所有人不可见
* Only team members: 对于public和internal项目，这样设置可以只让项目成员可见
* Everyone with access: 所有成员可以根据项目的等级来决定是否可见

## 分支

在一个多人协作的项目中，不同的分支之间具有的开放权限也不同，根据保护的等级分为两类：保护分支与特性分支。

## 角色

不同的权限的分配的具体实施是通过区分每一个用户对每一个项目的角色而确定的。角色是用户针对某个项目的属性，因此一个用户可以针对不同的项目有
不同的角色，不同的用户在一个项目中也会担任不同的角色。所有的角色分为以下五类：

1. Guest :拥有最基本的权限，能够创建issue，提出comment，查看项目的Wiki，无法pull代码
2. Reporter :除了要上面的权限外，还能够pull代码，处理issue，查看commit信息以及环境信息（指docker），无法创建分支，提出merge request以及修改wiki
3. Developer： 除了上面的权限外，还能够提出merge request，利用CI进行build，创建分支，对除了protected分支进行push，修改wiki
4. Master：除了上面的权限以外，还可以添加project成员，修改Project信息，添加webhook，修改项目的pages，更改tags，修改CI的运行任务，Push到Portected分支
5. Owner： 除了上面的权限外，还能够移除protected分支，移除项目，移除pages

对于一个项目来说，基本的权限分配如下：

| item | Guest  | Reporter | Developer |  Master | Owner |
| :----- |:-------:| -----:|-----:|-----:|-----:|
| Create new issue　| √ | √ | √ | √ | √ |
| View wiki pages　| √ | √ | √ | √ | √ |
| Pull project code　|  | √ | √ | √ | √ |
| Manage issue tracker　|  | √ | √ | √ |  √|
| See environments　|  | √ | √ | √ |  √|
| See a list of merge requests　|  |  | √ | √ | √ |
| Create new merge request　|  |  | √ | √ | √ |
| Create new branches　|  |  | √ | √ |√  |
| Push to non-protected branches　|  |  | √ | √ | √ |
| Remove non-protected branches　|  |  | √ | √ | √ |
| Add tags　|  |  | √ | √ | √ |
| Write a wiki　|  |  | √ | √ | √ |
| Add new team members　|  |  |  | √ | √ |
| Push to protected branches　|  |  |  | √ | √ |
| Enable/disable branch protection　|  |  |  | √ | √ |
| Edit project　|  |  |  | √ | √ |
| Switch visibility level　|  |  |  |  | √ |
| Remove project　|  |  |  |  | √ |


## 组权限

group是包括多个成员的一个单位，当项目属性为Internal时，可以设置为组内可见，关于不同的角色在组相关操作上的权限，如下表：

备注：成员可以自行离开group，除非该成员是最后一个成员。

| item | Guest&Reporter | Developer |  Master | Owner |
| :----- |:-------:| -----:|-----:|-----:|
| Browse group　| √ | √ | √ | √ | 
|Edit group　|  |  |  | √ | 
| Create project in group　|  |  | √ | √ | 
| Manage group members　|  |  |  | √ | 
| Remove group　|  |  |  | √ | 


## 为项目添加成员

项目的管理员用户可以管理项目相关的组，用户以及他们的权限等级，也可以给每一个用户针对每一个项目不同的权限等级。

管理员需要是master 或者owner，才能够为项目新增用户。

添加项目成员的第一步是点击项目右侧下拉菜单中的 **Member** 选项卡：

![add_user_members_menu](imgs\add_user_members_menu.png)

然后再紧靠着 **People** 的输入框内输入用户的ID：

![add_user_search_people](imgs\add_user_search_people.png)

在Project Access下拉菜单中选择给用户分配的角色：

![add_user_give_permissions](imgs\add_user_give_permissions.png)

然后点击 **Add users to project** 即可立即添加用户到当前的项目中。

![add_user_members_menu](imgs\add_user_list_members.png)