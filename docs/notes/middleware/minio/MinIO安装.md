---
title: MinIO安装
createTime: 2024/11/24 15:56:15
permalink: /notes/middleware/8vrlrj1m/
---
## Docker单节点单磁盘部署

运行minio docker容器

`docker run -d -p 9000:9000 -p 9001:9001 -v D:\dev\minio\data:/data --name minio -e "MINIO_ROOT_USER=admin" -e "MINIO_ROOT_PASSWORD=admin123" quay.io/minio/minio server /data --console-address ":9001"`

MinIO控制台URL：http://127.0.0.1:9001

MinIO API URL: http://127.0.0.1:9000

## Docker单节点多磁盘部署



## Dcoker多节点多磁盘部署

## 安装客户端

可以选择在Docker Host上单独安装MinIO客户端工具mc。

`mc --help`

