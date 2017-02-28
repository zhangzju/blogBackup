## gitlab flow的意义

Version management with git makes branching and merging much easier than older versioning systems such as SVN. This allows a wide variety of branching strategies and workflows. Almost all of these are an improvement over the methods used before git. But many organizations end up with a workflow that is not clearly defined, overly complex or not integrated with issue tracking systems. Therefore we propose the GitLab flow as clearly defined set of best practices. It combines feature driven development and feature branches with issue tracking.

使用git进行版本控制使得分支和合并相比于在SVN上来说更加容易了。git允许众多分支并行开发，以及支持工作流，这些都是git相比于之前使用的那些版本控制系统的优势，不过很多用户在使用git的时候却没有一个清晰的工作流，在协同工作时要么非常的复杂，要么没有能够结合issue tracking系统。因此在使用gitlab时，官方推荐采用Gitlab flow，它包含一些列最佳实践，有效的结合了issue tracking，利用了分支和功能驱动的特性。

When converting to git you have to get used to the fact that there are three steps before a commit is shared with colleagues. Most version control systems have only one step, committing from the working copy to a shared server. In git you add files from the working copy to the staging area. After that you commit them to the local repo. The third step is pushing to a shared remote repository. After getting used to these three steps the branching model becomes the challenge.

在转向使用git之际，我们必须了解到，一个提交的commit，或者说一个成果在被分享给同事们之前需要经过三个步骤，但是大部分的版本控制系统只需要一个步骤，即从本地提交到服务器上。在git之中，你需要首先将文件从working copy添加到staging area，这是手动的。然后将你的修改提交到本地的Repo，最后将其Push到你的远程仓库，在熟悉这三步之后，就可以开始学习如何利用分支功能了。

Since many organizations new to git have no conventions how to work with it, it can quickly become a mess. The biggest problem they run into is that many long running branches that each contain part of the changes are around. People have a hard time figuring out which branch they should develop on or deploy to production. Frequently the reaction to this problem is to adopt a standardized pattern such as git flow and GitHub flow. We think there is still room for improvement and will detail a set of practices we call GitLab flow.

很多组织一开始迁移到git的时候，并不是非常明白如何使用git来协作，这很快会带来一些问题。这其中最大的问题莫过于会出现大量的分支，各个分支之间各自为政，相互无法合并的糟糕状况。人们会花费很多时间去搞清楚那些分支是有用的，应该被开发的或者是可以被发布的。这个问题很快就在社区之中得到了新的解决方案，git flow和github flow。不过实际上我们觉得r鞥然后更好的解决方案，即gitlab flow。不过实际上我们觉得r鞥然后更好的解决方案，即gitlab

## Git flow 存在的问题

![gitdashflow](./imgs/gitdashflow.png)

Git flow was one of the first proposals to use git branches and it has gotten a lot of attention. It advocates a master branch and a separate develop branch as well as supporting branches for features, releases and hotfixes. The development happens on the develop branch, moves to a release branch and is finally merged into the master branch. Git flow is a well defined standard but its complexity introduces two problems. The first problem is that developers must use the develop branch and not master, master is reserved for code that is released to production. It is a convention to call your default branch master and to mostly branch from and merge to this. Since most tools automatically make the master branch the default one and display that one by default it is annoying to have to switch to another one. The second problem of git flow is the complexity introduced by the hotfix and release branches. These branches can be a good idea for some organizations but are overkill for the vast majority of them. Nowadays most organizations practice continuous delivery which means that your default branch can be deployed. This means that hotfix and release branches can be prevented including all the ceremony they introduce. An example of this ceremony is the merging back of release branches. Though specialized tools do exist to solve this, they require documentation and add complexity. Frequently developers make a mistake and for example changes are only merged into master and not into the develop branch. The root cause of these errors is that git flow is too complex for most of the use cases. And doing releases doesn't automatically mean also doing hotfixes.

git flow是第一个采用分支来进行工作流管理的方案，也引起了很大的关注。它提倡一个master分支和一个独立的develop分支，以及一些用于支持功能的分支例如features，releases和hotfixes。开发的工作在develop分支上进行，然后会被释出到release分支，最终会被合并到master分支。git flow是一个非常棒的标准，但是有两个问题处理的很复杂：
1. 开发者必须使用develop而不是master分支，因为master被预留到最终的production发布，master作为默认分支，master很适合用于合并或者赋值，很多自动化的工具都会使用master分支作为默认的分支，如果我们每次都要从默认分支切换到其他的分支，这会非常低效。
2. hotfix和release分支的体系过于复杂了，对于某些组织来说，这些分支是不错的注意，但是对于绝大部分的开发者来说，这样的设计过于严谨。

现在有许多组织在开发中尝试着持续交付，这就意味着他们的默认分支理应可以被直接部署，那么默认分支master和release分支其实完全可以合二为一，一个典型的操作就是从将release分支合并回去。尽管有一些工具可以帮助我们遵循git flow，但是仍然需要文档说明以及提高了复杂性。常常会有开发者会犯一些类似于只合并到master、
却没有合并到develop分支这样的错误，根本的原因还是git flow的整个流程过于复杂，同时发布一个版本并不意味着需要hotfixes，很多情况下热修复也不是那么有需要。

## GitHub flow :轻量级的一个选择

![githubflow](./imgs/github_flow.png)

In reaction to git flow a simpler alternative was detailed, GitHub flow. This flow has only feature branches and a master branch. This is very simple and clean, many organizations have adopted it with great success. Atlassian recommends a similar strategy although they rebase feature branches. Merging everything into the master branch and deploying often means you minimize the amount of code in 'inventory' which is in line with the lean and continuous delivery best practices. But this flow still leaves a lot of questions unanswered regarding deployments, environments, releases and integrations with issues. With GitLab flow we offer additional guidance for these questions.

为了解决git flow的复杂性，githab flow应运而生，更加简单和轻量级。githab flow只有master分支和feature分支，非常简单和整洁，很多组织使用github flow取得了成功。Atlassian公司也推荐了一种与此类似的策略，不过他们会将feature分支rebase掉。将所有的成果合并到master中去并且部署的话也就意味着我们需要将代码的更改量降到最低，这符合持续交付的最佳实践。但是这个工作流依然有一些无法解决的问题例如如何部署，如何处理环境依赖，发布版本以及和issues的集成等等，而在gitlab flow中就额外增加了这些。

## 配置Production分支的GitLab flow 

![production_branch](./imgs/production_branch.png)

GitHub flow does assume you are able to deploy to production every time you merge a feature branch. This is possible for SaaS applications but are many cases where this is not possible. One would be a situation where you are not in control of the exact release moment, for example an iOS application that needs to pass App Store validation. Another example is when you have deployment windows (workdays from 10am to 4pm when the operations team is at full capacity) but you also merge code at other times. In these cases you can make a production branch that reflects the deployed code. You can deploy a new version by merging in master to the production branch. If you need to know what code is in production you can just checkout the production branch to see. The approximate time of deployment is easily visible as the merge commit in the version control system. This time is pretty accurate if you automatically deploy your production branch. If you need a more exact time you can have your deployment script create a tag on each deployment. This flow prevents the overhead of releasing, tagging and merging that is common to git flow.

github_flow基于一个前提：每一次你合并到master分支，就会立刻进行deploy部署，对于需要部署到paas上的应用来说，这是比较适合的，然而对于其余的大部分场景，也许并不是特别适用。例如在开发人员无法控制什么版本发布的情况下，就像是iOS的应用，能否发布实际上还需要经过苹果的控制。在这样的情况下，我们可以通过新建一个production分支来解决这个问题，每当需要进行部署的时候，我们将当前的master分支merge到production分支上来，这样我们就可以查看每次发布的版本的代码。每次发布的时间也就和poduction分支的merge的时间非常接近，这样的做法避免了对release的过多的操作。

## 配置Environment的 GitLab flow 

![Environment_branche](./imgs/environment_branches.png)

It might be a good idea to have an environment that is automatically updated to the master branch. Only in this case, the name of this environment might differ from the branch name. Suppose you have a staging environment, a pre-production environment and a production environment. In this case the master branch is deployed on staging. When someone wants to deploy to pre-production they create a merge request from the master branch to the pre-production branch. And going live with code happens by merging the pre-production branch into the production branch. This workflow where commits only flow downstream ensures that everything has been tested on all environments. If you need to cherry-pick a commit with a hotfix it is common to develop it on a feature branch and merge it into master with a merge request, do not delete the feature branch. If master is good to go (it should be if you are practicing continuous delivery) you then merge it to the other branches. If this is not possible because more manual testing is required you can send merge requests from the feature branch to the downstream branches. An 'extreme' version of environment branches are setting up an environment for each feature branch as done by Teatro.

