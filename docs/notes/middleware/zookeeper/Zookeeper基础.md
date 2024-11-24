---
title: Zookeeper基础
createTime: 2024/11/24 15:56:15
permalink: /notes/middleware/fnt8tcwm/
---
参考：

- https://zookeeper.apache.org/index.html
- https://cwiki.apache.org/confluence/display/ZOOKEEPER/Index

## ZK命令

### zkServer

启动

`zkServer.sh start`

停止

`zkServer.sh stop`

重启

`zkServer.sh restart`

查看状态

`zkServer.sh status`

### zkCli

连接zk server

`zkCli.sh -server 127.0.0.1:2181`

查看帮助

`help`

查看节点列表

`ls /`

查看节点数据

`get /`

断开连接

`close`

退出zkCli

`quit`

## ZK数据模型

Zookeeper数据模型类似于文件系统的目录结构，是一个层次化的树状结构。

每个节点称为znode，可以包含数据和子节点。数据默认限制不超过1M。

有4种节点类型：

- 持久节点
- 临时节点
- 持久顺序节点
- 临时顺序节点
