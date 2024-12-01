---
title: postgresql安装
createTime: 2024/11/24 15:56:14
permalink: /notes/database/ngio4cr2/
---
下载地址：https://www.postgresql.org/download/

版本：postgresql-16.1

## Docker

1.拉取镜像

`docker pull postgres:16`

2.获取默认配置文件

`docker run -i --rm postgres:16 cat /usr/share/postgresql/postgresql.conf.sample > /docker/postgres16/conf/postgres.conf`

3.创建容器

`docker create --name postgres16 -p 5432:5432 -v /docker/postgres16/data:/var/lib/postgresql/data -v /docker/postgres16/conf/postgres.conf:/etc/postgresql/postgresql.conf -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres postgres:16 -c 'config_file=/etc/postgresql/postgresql.conf'`

4.启动容器

`docker start postgres16`

4.验证

`docker exec -it postgres16 psql -U postgres -W`

![](./../_/20240319150419.png)

远程连接报错:

```
FATAL:  no pg_hba.conf entry for host "x.x.x.x", user "postgres", database "postgres", no encryption
```

解决：在 data/pg_hba.conf 文件中，添加以下配置

```
host all all all trust
```



## Linux

**Ubuntu**

https://www.postgresql.org/download/linux/ubuntu/

```shell
# Import the repository signing key:
sudo apt install curl ca-certificates
sudo install -d /usr/share/postgresql-common/pgdg
sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc

# Create the repository configuration file:
sudo sh -c 'echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Update the package lists:
sudo apt update

# Install the latest version of PostgreSQL:
# If you want a specific version, use 'postgresql-16' or similar instead of 'postgresql'
sudo apt -y install postgresql
```

启动PG服务

`systemctl start postgresql`

psql登录

`su postgres`

`psql`

## Windows

下载exe安装程序进行安装即可。

Navicat连接PG数据库报错：

```
错误：字段"datlastsysoid"不存在
```

解决：升级Navicat版本到15.0.29+，需要重新激活许可证。

## MacOS

