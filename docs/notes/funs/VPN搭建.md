---
title: VPN搭建
createTime: 2024/11/24 15:56:15
permalink: /notes/funs/mpkq5rxa/
---

前提：

+ 购买海外云服务器
+ SSH远程客户端工具

参考：

+ https://vkuajing.net/vultr-vpn/

**关键步骤：**

安装shadowsocks-docker镜像

```sh
docker pull imhang/shadowsocks-docker

docker run -d --restart=always -e "SS_PORT=10086" -e "SS_PASSWORD=密码" -e "SS_METHOD=aes-256-gcm" -e "SS_TIMEOUT=600" -p 10086:10086 -p 10086:10086/udp --name ssserver imhang/shadowsocks-docker
```

bbr加速

```sh
wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh && chmod +x bbr.sh && ./bbr.sh
```

下载shadowsocks软件

https://github.com/shadowsocks

**配置：**

服务器ip，端口，密码，加密方式，以及本地代理端口。

**问题：**

*1.启用系统代理PAC模式后，可以访问外网，但是不能访问内网*

是因为之前使用的clash，代理默认监听7890端口，与shandowsocks监听的端口不一致。

打开设置 --> 网络和Internet --> 代理，修改手动设置代理，将监听的端口改为shandowsocks监听的端口。