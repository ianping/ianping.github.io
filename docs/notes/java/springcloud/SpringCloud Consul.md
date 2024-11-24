---
title: SpringCloud Consul
createTime: 2024/11/24 15:56:15
permalink: /notes/java/4rxckznl/
---
## 参考



## 持久化kv数据

Windows中，使用以下命令启动agent

`consul.exe agent -server -ui -bind=127.0.0.1 -data-dir=data`

或者，使用bat脚本，创建后台服务

```bat
@echo.服务启动......  
@echo off  
@sc create Consul binpath="D:\\dev\\springcloud\\consul\\consul.exe agent -server -ui -bind=127.0.0.1 -client=0.0.0.0 -bootstrap-expect 1 -data-dir=D:\\dev\\springcloud\\consul\\data"  
@net start Consul  
@sc config Consul start= AUTO  
@echo.Consul start is OK......success  
@pause
```

