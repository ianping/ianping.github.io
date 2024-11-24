---
title: MongoDB安装
createTime: 2024/11/24 15:56:14
permalink: /notes/database/cphjfra6/
---
## 使用docker安装MongoDB

1.拉取镜像

`docker pull mongodb/mongodb-community-server:latest`

2.创建容器

`docker create --name mongodb -p 27017:27017 mongodb/mongodb-community-server:latest`

3.启动容器

`docker start mongodb`

4.验证

进入容器

`docker exec -it mongodb bash`

查看MongoDB版本(v7.0.11)

`mongod --version`

连接mongodb服务器

`mongosh --port 27017`

执行命令

```javascript
db.runCommand(
   {
      hello: 1
   }
)
```

输出

```json
{
  isWritablePrimary: true,
  topologyVersion: {
    processId: ObjectId('6650af927ff3e49425bcb09b'),
    counter: Long('0')
  },
  maxBsonObjectSize: 16777216,
  maxMessageSizeBytes: 48000000,
  maxWriteBatchSize: 100000,
  localTime: ISODate('2024-05-24T15:20:24.010Z'),
  logicalSessionTimeoutMinutes: 30,
  connectionId: 3,
  minWireVersion: 0,
  maxWireVersion: 21,
  readOnly: false,
  ok: 1
}
```

