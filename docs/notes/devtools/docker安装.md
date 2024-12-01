---
title: docker安装
createTime: 2024/11/24 15:56:14
permalink: /notes/devtools/hhxnlumo/
---

## Windows安装docker

参考：

- https://docs.docker.com/desktop/install/windows-install/

- https://docs.docker.com/get-docker/

## Linux安装docker

### Ubuntu

参考：

- https://docs.docker.com/engine/install/ubuntu/

1.卸载docker旧版本

```sh
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

2.配置docker repository

```sh
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

3.安装docker

```sh
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

4.验证

`docker --version`

## 修改镜像存储位置

### Windows

默认存储位置：C:\Users\username\AppData\Local\Docker\wsl\

打开Docker Desktop，依次选择Settings -> Resources -> Advanced，设置Disk image location为新的目录，docker会自动进行设置，并将原有镜像移动到新的目录。

### Linux

默认存储位置： /var/lib/docker/image/
