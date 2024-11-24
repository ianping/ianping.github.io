---
title: Linux常用工具
createTime: 2024/11/24 15:56:14
permalink: /notes/cs/8zms6a9y/
---
## `ping`



## `telnet`



## `ssh`

`ssh username@hostname`


SSH允许root身份登录

**Ubuntu**

`vim /etc/ssh/sshd_config`

```
#PermitRootLogin prohibit-password # 禁止root身份登录
PermitRootLogin yes # 允许root身份登录
PasswordAuthentication yes # 使用密码登录
```

`service ssh restart`


## `ftp`



## `curl`

`curl http://example.com`

`curl -H 'User-Agent: php/1.0' http://example.com`

`curl -d 'username=emma' -d 'password=123' -X POST  http://example.com/login`

`curl --data-urlencode 'comment=hello world' http://example.com/login`

`curl -H 'Accept-Language: en-US' http://example.com`