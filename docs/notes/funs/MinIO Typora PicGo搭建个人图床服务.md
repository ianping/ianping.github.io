---
title: MinIO Typora PicGo搭建个人图床服务
createTime: 2024/11/24 15:56:16
permalink: /article/4xysnlwp/
---
## 部署MinIO

使用Docker容器部署

`docker run -d -p 9000:9000 -p 9001:9001 -v D:\dev\minio\data:/data --name minio -e "MINIO_ROOT_USER=admin" -e "MINIO_ROOT_PASSWORD=admin123" quay.io/minio/minio server /data --console-address ":9001"`

访问MinIO控制台：http://127.0.0.1:9001/，创建一个存储桶test，自定义访问策略，给Annoymous用户只读权限

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::test/*"
            ]
        }
    ]
}
```

## PicGo中安装minio插件

picgo官网：https://picgo.github.io/PicGo-Doc/

+ 打开picgo

+ 在插件设置中搜索minio，安装

+ 在图床设置中，找到minio，配置，并将minio设置为默认图床

![](http://127.0.0.1:9000/test/images/20240117122747.png)

+ 测试一下，如果没问题，进行下一步

## 配置Typora图片上传服务

在Typora插入本地图片时，自动使用PicGo上传图片到MinIO服务器；上传成功后，PicGo可以获取到图片URL；Typora会自动用URL替换本地图片路径。

![](_/20240117124211.png)

