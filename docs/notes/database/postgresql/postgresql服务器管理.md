---
title: postgresql服务器管理
createTime: 2024/11/24 15:56:14
permalink: /notes/database/n5c21y7u/
---
## 服务管理

`systemctl status|start|stop|restart postgresql`

开机自启动：`systemctl enable postgresql`

## 开启远程连接

1.确保PG宿主机可以被ping通，确保PG宿主机的5432端口没有被防火墙ban掉

2.修改PG配置文件

`vim /etc/postgresql/16/main/postgresql.conf`

```
#listen_addresses = 'localhost'
listen_addresses = '*'
```

`vim /etc/postgresql/16/main/pg_hba.conf`

```
# Database administrative login by Unix domain socket
local   all             postgres                                peer

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256
# 新增配置
host    all             all             0.0.0.0/0               trust
```

3.重启PG服务

`systemctl restart postgresql`

