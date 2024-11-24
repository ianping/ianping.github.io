---
title: Zookeeper安装
createTime: 2024/11/24 15:56:15
permalink: /notes/middleware/wx095yyh/
---
## 下载

https://zookeeper.apache.org/releases.html

## 单机模式

### Windows

1.解压压缩包到安装目录

2.配置数据目录

`cd path/to/apache-zookeeper-3.6.3/`

`mkdir data`

`copy conf/zoo_sample.cfg conf/zoo.cfg`

修改conf/zoo.cfg，配置dataDir

```
tickTime=2000
dataDir=path/to/apache-zookeeper-3.6.3/data
clientPort=2181
# Default 8080
admin.serverPort=8080
```

3.启动ZK Server

`cd bin`

`zkServer.cmd`

4.连接到ZK Server

`zkCli.cmd -server 127.0.0.1:2181`

5.运行ZK Client命令

`ls /`

`quit`

### Linux

与Windows基本一样，除了启动ZK Server使用命令 `./zkServer.sh start`

### Docker

zookeeper镜像地址：https://hub.docker.com/_/zookeeper

`docker pull zookeeper:3.6.3`

`docker create --name myzk -p 2182:2181 --restart always zookeeper:3.6.3`

`docker exec -it myzk bash`

## Zookeeper集群

