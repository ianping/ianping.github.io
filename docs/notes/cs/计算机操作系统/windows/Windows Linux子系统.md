---
title: Windows Linux子系统
createTime: 2024/11/24 15:56:14
permalink: /notes/cs/ju3l8nxy/
---
参考资料：

+ https://learn.microsoft.com/en-us/windows/wsl/install

## 安装

查看支持的Linux分发版本

`wsl --list --online`

安装指定的Linux分发版本

`wsl --install -d Ubuntu-22.04`

查看已安装的Linux子系统

`wsl --list --all --verbose`

卸载已安装的Linux子系统

`wsl --unregister Ubuntu-22.04`

设置Linux子系统root密码

`sudo passwd root`

查看Linux子系统IP

`ifconfig` 中的 *eth0* 网卡地址

## 改变WSL安装位置

使用wsl --export和wsl --import命令

1. 首先，查看本机已安装的所有WSL系统，使用命令`wsl -l --all -v`。
2. 选择你想要移动的系统，例如Ubuntu-22.04，然后使用`wsl --export Ubuntu-22.04 D:\dev\wsl\Ubuntu-22.04.tar`将其导出到指定的位置。
3. 接下来，注销这个WSL系统，使用命令`wsl --unregister Ubuntu-22.04`。
4. 确认WSL系统已成功注销，再次使用`wsl -l --all -v`查看。
5. 创建一个新的目录作为新的WSL安装位置，如`D:\dev\wsl\Ubuntu-22.04`。
6. 使用`wsl --import Ubuntu-22.04 D:\dev\wsl\Ubuntu-22.04 D:\dev\wsl\Ubuntu-22.04.tar --version 2`命令将之前导出的WSL系统重新导入到新位置。
7. 最后，再次使用`wsl -l --all -v`确认WSL系统已成功导入到新位置。