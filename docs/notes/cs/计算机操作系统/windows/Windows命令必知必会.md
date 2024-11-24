---
title: Windows命令必知必会
createTime: 2024/11/24 15:56:14
permalink: /notes/cs/pgpj65ao/
---
参考: 

- https://learn.microsoft.com/zh-cn/windows-server/administration/windows-commands/windows-commands

**以管理员身份打开cmd**

快捷方式：Win+R打开运行窗口，输入cmd，同时按下Ctrl+Shift+Enter

**删除目录**

`rmdir /s /q`

参数：

- /s，删除目录树（包括子目录以及文件）
- /q，安静模式

**查看IP路由表信息**

`netstat -r`

**根据端口号查看进程ID**

`netstat -aon | findstr 3306`

**根据进程ID查看可执行文件**

`tasklist | findstr 3016`

**kill进程**

`taskkill /F /PID 2016`

**重置winsock**

解决同一网络下，其它设备正常，本电脑无法连接某些网站的问题

`netsh winsock reset`