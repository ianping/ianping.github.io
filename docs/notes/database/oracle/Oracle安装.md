---
title: Oracle安装
createTime: 2024/11/24 15:56:14
permalink: /notes/database/j80kyty0/
---
## 使用Docker安装Oracle Exp 12c

1.拉取镜像

> 也许需要挂VPN访问外网

`docker pull truevoly/oracle-12c`

2.创建容器

`docker create --name oracle12c -p 1521:1521 truevoly/oracle-12c`

3.启动容器

`docker start oracle12c`

4.验证

进入容器

`docker exec -it oracle12c bash`

默认是以root用户登录的，设置一下root密码

`passwd`

登录oracle，用户名/密码为：sys/oracle

`sqlplus /nolog`

```
root@f08ef4931416:/# sqlplus

SQL*Plus: Release 12.1.0.2.0 Production on Sat May 18 08:02:53 2024

Copyright (c) 1982, 2014, Oracle.  All rights reserved.

Enter user-name: sys as sysdba
Enter password:

Connected to:
Oracle Database 12c Standard Edition Release 12.1.0.2.0 - 64bit Production

SQL> select instance_name, version from v$instance;

INSTANCE_NAME    VERSION
---------------- -----------------
xe               12.1.0.2.0

SQL> show parameter sevice_name;
SQL>
```

5.使用Navicat连接Oracle数据库

注意：使用 *sys/oracle* 连接Oracle时，需要在【高级】选项卡中，设置角色为sysdba。

## 使用Docker安装Oracle 11g

1.拉取镜像

`docker pull registry.cn-hangzhou.aliyuncs.com/helowin/oracle_11g`

## 本地安装Oracle Express Edition

下载：https://www.oracle.com/database/technologies/xe-downloads.html

