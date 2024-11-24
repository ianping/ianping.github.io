---
title: git
createTime: 2024/11/24 15:56:14
permalink: /article/ydopdiwe/
---
参考：

- 官网：https://git-scm.com/

## 下载安装

https://git-scm.com/downloads

## 配置

### 3个配置文件

+ 系统配置文件：/etc/gitconfig，windows系统在git安装目录下

​	`git config --system`

+ 用户配置文件：~/.gitconfig

​	`git config --global`

+ 本地配置文件：.git/config

​	`git config --local`

### 查看配置信息

查看全部配置文件以及配置项

` git config --list --show-origin`

查看系统、用户、本地配置项

`git config --list`

`git config --system --list`

`git config --global --list`

`git config --local --list`

查看某一个配置项

`git config --global user.name`

### 配置用户信息

`git config --global user.name "bitbitpulse"`

`git config --global user.email bitbitpulse@gmail.com`

### 配置默认文本编辑器

`git config --global core.editor vim`

`git config --global core.editor "'D:\apps\Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"`

### 记住远程仓库账号密码

`git config --global credential.helper store`

### 删除配置

`git config --global --unset user.name`

## Git核心概念

+ Git是基于**快照**的，区别于其它基于差异的版本控制系统
+ Git文件的3种状态：**已修改(modified)、已暂存(staged)、已提交(committed)**，对应3个阶段：**工作区、暂存区、Git目录**

## Git基础操作

初始化本地仓库

`cd path/to/repo`

`git init`

查看文件状态

`git status`

跟踪新文件，更新到暂存区

`git add a.txt`

查看已暂存的文件暂存前后的变化

`git diff`

`git diff --cached`

从暂存区移除文件，恢复到工作区

`git rm --cached a.txt`

提交，从暂存区更新到Git目录

`git commit -m "initial git repo"`

修改提交，用新的提交覆盖上一次提交记录

`git commit --amend -m "new commit"`

查看提交历史

`git log`

`git log --pretty=short`

`git log --pretty=oneline`

从工作区删除文件

`git rm a.txt`

移动、重命名文件

`git mv a.txt b.txt`


## Git远程仓库

克隆远程仓库

`git clone https://github.com/bitbitpulse/my-repo.git`

查看远程仓库

`git remote`

`git remote -v`

`git remote show origin`

添加远程仓库

`git remote add origin https://github.com/bitbitpulse/my-repo.git`

重命名远程仓库名称

`git remote rename origin xxx`

移除远程仓库

`git remote remove xxx`

从远程仓库拉取数据，然后需要手动与本地分支进行合并

`git fetch origin`

如果本地分支设置了跟踪远程分支，直接使用 `git pull` ，将自动拉取并合并

推送本地提交到远程仓库

`git push origin main`

设置跟踪远程分支，同时推送本地提交到远程仓库

`git push --set-upstream origin main` 或 `git push -u origin main`

## Git分支

### 分支基础操作

查看分支

`git branch`

`git branch -v`

`git branch --merged`

`git branch --no-merged`

新建分支，并切换到新分支iss01上

`git branch iss01`

`git checkout iss01`

或者

`git checkout -b iss01`

在iss01新分支上进行修改、提交操作后，要将其合并到main分支中

`git checkout main`

`git merge iss01`

iss01分支任务完成，并已经成功合并到主分支了，可以将其删除

`git branch -d iss01`

处理合并冲突

`git status`

`git add xxx`

`git commit -m "all conflicts fixed"`

### 远程分支

查看远程仓库以及分支信息

`git remote show origin`

从远程仓库拉取数据

`git fetch origin`

合并远程分支数据到当前分支

`git merge origin/main`

从远程分支创建一个新的本地分支

`git checkout -b serverfix origin/serverfix`

推送当前分支数据到远程仓库指定分支

`git push origin main`

强制推送，覆盖远程仓库内容

`git push -f origin main`

## Git标签

列出标签

`git tag`

`git tag --list "v1.8"`

创建轻量标签

`git tag v1.0.0`

创建附注标签

`git tag -a v1.0 -m "version 1.0"`

给历史提交记录创建标签

`git log --pretty=oneline`

`git tag v0.0.1 129a25`

查看标签信息

`git show v1.0`

删除本地标签

`git tag -d v1.0.0`

推送标签到远程仓库

`git push origin v1.0.0`

`git push origin --tags`

删除远程仓库中的标签

`git push origin --delete v1.0.0`

## Git别名

设置别名

`git config --global alias.lline "log --pretty=oneline"`

使用别名

`git lline`

## 忽略文件

```
# .gitignore
*.class
```

