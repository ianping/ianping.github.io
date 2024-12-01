---
title: nginx环境搭建
createTime: 2024/11/24 15:56:16
permalink: /notes/server/42ug5cf5/
---
## 安装nginx

### 使用docker

1.拉取镜像

`docker pull nginx:1.25`

2.先创建一个不挂载任何volume的nginx容器，用于从中复制默认的配置、日志、html文件到本地主机目录：

`docker create --name nginx nginx:1.25`

`docker cp nginxx:/etc/nginx /docker/nginx/conf/`

`docker cp nginxx:/var/log/nginx /docker/nginx/log/`

`docker cp nginx:/usr/share/nginx/ /docker/nginx/html/`

`docker stop nginxx && docker rm nginxx`

3.正式创建nginx容器

`docker run -d --name nginx -p 80:80 -v /docker/nginx/html:/usr/share/nginx/ -v /docker/nginx/conf:/etc/nginx -v /docker/nginx/log:/var/log/nginx nginx:1.25`

`docker logs nginx`

4.访问：[http://localhost:80](http://localhost:80)

## Ubuntu

https://nginx.org/en/linux_packages.html#Ubuntu

````shell
apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring

curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
    
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
    
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
    | sudo tee /etc/apt/preferences.d/99nginx

sudo apt update
sudo apt install nginx
````

管理nginx服务：

`/etc/init.d/nginx start|stop|status|restart|reload|force-reload|upgrade|configtest|check-reload`

配置文件路径：*/etc/nginx/*
