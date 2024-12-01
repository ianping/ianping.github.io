---
title: Redis高级特性
createTime: 2024/11/24 15:56:14
permalink: /notes/database/3icssroc/
---
## Redis管道

使用Pineline，可以将多个命令打包在一起，一次性发送给Redis服务器，减少网络通信开销。管道不保证原子性。

## Redis事务与Lua脚本

Redis事务通过以下命令实现的：

- `multi`：开始事务
- `exec`：提交事务，提交命令到队列中
- `discard`：回滚事务，清空队列中的所有命令
- `watch`：监控1个或多个键，在事务执行期间被修改过，则事务执行失败
- `unwatch`：取消对所有键的监控

## Redis发布订阅模式
