---
title: SpringCloudAlibaba Nacos
createTime: 2024/11/24 15:56:15
permalink: /notes/java/xgvwqrlg/
---
参考：

- https://nacos.io/docs/latest/what-is-nacos/
- https://github.com/alibaba/nacos

版本信息：

- nacos 2.2.3

## 下载

https://github.com/alibaba/nacos/releases

## 单机模式

**安装**

解压到安装目录即可。

**启动**

`cd path/to/nacos/bin/`

`startup.cmd -m standalone`

访问 http://localhost:8848/nacos/

**停止**

`shutdown.cmd`

## 使用mysql数据库存储数据

1.创建数据库nacos

2.初始化数据库，执行初始化sql文件 *nacos/config/mysql-schema.sql*

3.修改 *nacos/config/application.properties*

```properties
### If use MySQL as datasource:
### Deprecated configuration property, it is recommended to use `spring.sql.init.platform` replaced.
#spring.datasource.platform=mysql
spring.sql.init.platform=mysql

### Count of DB:
db.num=1

### Connect URL of DB:
db.url.0=jdbc:mysql://172.30.149.49:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai
db.user.0=root
db.password.0=root
```

4.重启nacos

## 开启用户鉴权

修改 *nacos/config/application.properties*

```properties
### The auth system to use, currently only 'nacos' and 'ldap' is supported:
nacos.core.auth.system.type=nacos

### 开启鉴权
nacos.core.auth.enabled=true

### Turn on/off caching of auth information. By turning on this switch, the update of auth information would have a 15 seconds delay.
nacos.core.auth.caching.enabled=true

### Since 1.4.1, Turn on/off white auth for user-agent: nacos-server, only for upgrade from old version.
nacos.core.auth.enable.userAgentAuthWhite=false

### Since 1.4.1, worked when nacos.core.auth.enabled=true and nacos.core.auth.enable.userAgentAuthWhite=false.
### 用户名/密码
nacos.core.auth.server.identity.key=nacos
nacos.core.auth.server.identity.value=nacos

### worked when nacos.core.auth.system.type=nacos
### The token expiration in seconds:
nacos.core.auth.plugin.nacos.token.cache.enable=false
nacos.core.auth.plugin.nacos.token.expire.seconds=18000
### JWT Token密钥(推荐使用原始密钥的Base64，原始密钥不能小于32个字符)
nacos.core.auth.plugin.nacos.token.secret.key=MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MA==
```

## 集群模式

3台以上的Nacos服务器 + Nginx负载均衡。

这里使用单机多端口方案；

1.下载并上传nacos安装包到每一台服务器，并解压

2.配置外部数据源、开启鉴权

3.在每个nacos的conf目录下，创建 *cluster.conf* 文件，配置集群地址(IP:PORT)

```
169.254.135.41:8845
169.254.135.41:8846
169.254.135.41:8847
```

4.修改每个nacos的 *conf/application.properties* 配置文件，设置其端口号分别为8845, 8846, 8847

5.分别启动每个nacos，默认启动模式是cluster

`startup.cmd` 或 `startup.sh`

6.配置nginx负载均衡，nginx监听8848端口，转发到nacos集群

```
upstream nacos-cluster {
    server 169.254.135.41:8847;
    server 169.254.135.41:8846;
    server 169.254.135.41:8845;
}

server {
    listen       8848;
    server_name  localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location /nacos {
    	proxy_pass http://nacos-cluster;
    }
}
```

7.验证

nacos客户端应用中，配置nacos地址为nginx8848

```properties
spring.cloud.nacos.server-addr=127.0.0.1:8848
spring.cloud.nacos.username=nacos
spring.cloud.nacos.password=nacos
```

启动应用，成功注册到nacos注册中心。

如果启动报错：*did not find the Leader node;caused: The Raft Group [naming_persistent_service_v2] did not find the Leader node;*，是因为nacos安装文件是直接复制的，包含了自动生成的 *data/protocol/raft* 文件，将其删除，重启nacos即可。

## 多集群模式

