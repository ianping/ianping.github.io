---
title: docker
createTime: 2024/11/24 15:56:14
permalink: /article/m8zzuxj2/
---
## Docker镜像

**查看本地镜像**

`docker images`

**搜索镜像**

`docker search ubuntu`

**下载镜像**

下载默认镜像

`docker pull ubuntu ` 或 `docker pull ubuntu:latest`

下载指定Tag的镜像

`docker pull ubuntu:22.04`

下载指定摘要的镜像

`docker pull ubuntu@sha256:6042500cf4b44023ea1894effe7890666b0c5c7871ed83a97c36c76ae560bb9b`

下载其它Registry中的镜像

`docker image pull myregistry.local:5000/username/image-name`

**删除镜像**

`docker rmi ubuntu`

**保存/加载本地镜像文件**

保存1个或多个镜像到tar文件

`docker save redis:7 -o redis7.tar`

从本地tar文件中加载镜像

`docker load -i redis7.tar`

**构建镜像**

基于已有容器构建镜像

`docker commit 70a278c1a081 username/ubuntu:tag`

基于Dockerfile构建镜像，使用当前目录下的Dockerfile文件，无镜像名和Tag

`docker build .`

指定Dockerfile文件路径

`docker build --file E:\coding\docker\Dockerfile .`

指定镜像名和Tag

`docker build --file E:\coding\docker\Dockerfile --tag ubuntu:vim .`

查看镜像构建历史

`docker history ubuntu:vim`

**镜像Tag**

创建Tag

`docker tag ubuntu:22.04 ubuntu:22`

删除Tag，只能通过name:tag删除

`docker rmi ubuntu:22`

## Docker容器

**列出容器**

`docker ps`

`docker ps -a`

`docker ps -a --filter status=exited`

`docker ps -a --filter status=running`

**查看容器详细信息**

`docker inspect myubuntu`

**运行容器**

`docker run ubuntu:22.04`

指定容器名称

`docker run --name myubuntu ubuntu:22.04`

在后台运行

`docker run -d --name myubuntu ubuntu:22.04`

自动重启

`docker run -d --restart=always --name myhttpd httpd`

restart参数：

- `no`：不开启自动重启

- `always`：总是自动重启
- `on-failure:3`：尝试自动重启n次

**查看容器运行日志**

`docker logs myhttpd`

`docker logs -f myhttpd`

**进入容器**

使用启动容器时的终端

`docker attach c1078a27225d `

使用新的终端

`docker exec -it c1078a27225d /bin/sh`

**创建/更新/启动/停止/重启/暂停/恢复容器**

创建

> 类似`docker run -d`，只是不会马上启动，还需要执行 `docker start` 命令

`docker create --name myhttpd httpd`

更新

`docker update myhttpd --restart=always`

启动

`docker start myhttpd`

停止

`docker stop myhttpd`

重启

`docker restart myhttpd`

暂停

`docker pause myhttpd`

恢复

`docker unpause myhttpd `

**重命名容器**

`docker rename myhttpd httpd-x`

**删除容器**

`docker rm myhttpd`

## Docker网络

容器加入自定义网络后，可以通过容器名代替IP连接同一网络下的其它容器。

**列出网络**

> docker默认创建3种网络：none, host, bridge

`docker network ls`

**创建网络**

`docker network create --driver bridge my-bridge-network`

查看网络详细信息

`docker network inspect my-bridge-network`

**删除网络**

删除一个或多个自定义网络

`docker network rm my-bridge-network`

删除全部未使用的自定义网络

`docker network prune`

**启动容器时设置网络**

`docker run -itd --network=my-bridge-network busybox`

**给正在运行的容器设置网络**

`docker network connect my-bridge-network c1078a27225d`

**断开容器与网络**

`docker network disconnect my-bridge-network c1078a27225d`

**端口映射**

-p host_port:container_port

`docker run -d -p 8080:80 httpd`

## Docker存储

docker有2类数据：

+ 镜像和容器数据，默认存储在 */var/lib/docker/* 目录下
+ volume数据，host文件系统中的目录和文件，被挂载到容器的文件系统中

**挂载host中指定的目录或文件到容器文件系统**

使用-v选项，指定host挂载源和container挂载点

`docker run -d -p 80:80 -v E:\coding\docker\htdocs:/usr/local/apache2/htdocs --name myhttpd httpd`

**挂载host中默认目录到容器文件系统**

使用-v选项，只需要指定container挂载点

`docker run -d -p 80:80 -v /usr/local/apache2/htdocs --name myhttpd httpd`

查看默认挂载源，Mounts设置中，默认挂载源为host文件系统中 */var/lib/docker/volumes/容器ID/_data/*

`docker inspect myhttpd`

**列出volume**

`docker volume ls`

**查看volume详细信息**

`docker volume inspect 5b37dfb391b5ca6d11f00882d0ec7e9373cb2bf1cda9b8d4e2ab8abab1ca7f54`

**创建volume**

`docker volume create`

**删除volume**

删除一个或多个

`docker volume rm 0c94ba01fa39b718703d785b323a473cbd47c841554519e3644d605767101a4a`

删除所有未使用的volume

`docker volume prune`

**复制镜像中的文件到本地主机**

`docker cp myhttpd:/usr/local/apache2/htdocs /docker/httpd/htdocs`

## Dockerfile文件

**部署jar应用**

```dockerfile
FROM openjdk:17

SHELL ["/bin/bash", "-c"]

WORKDIR /app

COPY HelloWorld.jar /app/

# RUN chmod +x /app/HelloWorld.jar

# EXPOSE 8080

CMD ["java", "-jar", "/app/HelloWorld.jar"]
```

构建镜像

`docker build --file ./Dockerfile --tag helloworld:1.0 .`

运行容器

`docker run --name helloworld helloworld:1.0`

**部署前端web应用**

直接使用nginx镜像即可

## DockerCompose

*docker-compose.yml*

```yaml
```

