---
title: Redis环境搭建
createTime: 2024/11/24 15:56:14
permalink: /notes/database/8rhh5i1u/
---
## 安装Redis

### Windows

Redis官方没有提供Windows安装包，可以选择以下2种方式：

1. microsoft提供的Redis的Windows版本

   项目地址：https://github.com/microsoftarchive/redis/releases

2. 使用WSL进行安装（推荐）

### Linux

安装依赖软件：`sudo apt install lsb-release curl gpg`

执行以下命令

```shell
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update
sudo apt-get install redis
```

操作redis服务

`/etc/init.d/redis-server start|stop|restart|force-reload|status`

### Docker

> docker hub地址：https://hub.docker.com/_/redis

1.拉取镜像

`docker pull redis:7.2.4`

修改标签名

`docker tag redis:7.2.4 redis:7 && docker rmi redis:7.2.4`

2.创建容器

2.1 准备redis配置文件、数据目录

`mkdir -p /docker/redis7/conf`

`touch /docker/redis7/conf/redis.conf`

```
# redis配置参考 https://redis.io/docs/management/config/
# bind 192.168.1.100 10.0.0.1     # listens on two specific IPv4 addresses
# bind 127.0.0.1 ::1              # listens on loopback IPv4 and IPv6
# bind * -::*                     # like the default, all available interfaces

# protected-mode yes
# requirepass foobared

port 6379

# dir /data
```

`mkdir /docker/redis7/data`

2.2 创建容器

`docker create --name redis7 -p 6379:6379 -v /docker/redis7/conf:/usr/local/etc/redis -v /docker/redis7/data:/data redis:7 redis-server /usr/local/etc/redis/redis.conf`

参数说明：

- `-p 6379:6379`：端口映射
- `-v /docker/redis7/conf:/usr/local/etc/redis`：挂载redis配置目录
- `-v /docker/redis7/data:/data`：挂载redis数据目录

3.启动容器

`docker start redis7`

4.进入容器

`docker exec -it redis7 redis-cli`

在Host机中连接

`redis-cli -h 127.0.0.1 -p 6379`

## 安装RedisInsight

https://redis.com/redis-enterprise/redis-insight/

## 管理Redis服务

查看Redis服务状态

`sudo systemctl status redis-server`

启动Redis服务

`sudo systemctl start redis-server`

停止Redis服务

`sudo systemctl stop redis-server`

## 连接Redis

使用redis-cli，或者使用RedisInsight图形界面工具

`redis-cli`

`redis-cli -h <hostname> -p <port> -a <password>`

### 开启远程连接

> 确保Redis所在Host服务器可以被，且防火墙放开6379端口

修改配置文件*/etc/redis.conf* ，有2种方式允许远程连接：

1. 关闭保护模式

   ```
   # bind 127.0.0.1 -::1
   protected-mode no
   ```

2. 开启保护模式，并设置密码

   ```
   # bind 127.0.0.1 -::1
   protected-mode yes
   requirepass foobared
   ```
