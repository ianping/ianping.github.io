---
title: MinIO JavaScript SDK
createTime: 2024/11/24 15:56:15
permalink: /notes/middleware/w3eemr9b/
---
官方文档：https://min.io/docs/minio/linux/developers/javascript/API.html

## 安装minio库

`yarn add minio@7.1.3`

## 使用

### 上传对象

```js
var Minio = require("minio");

// 创建客户端
var mc = new Minio.Client({
    endPoint: "127.0.0.1",
    port: 9000,
    accessKey: "admin",
    secretKey: "admin123",
    useSSL: false,
});

// 获取或创建桶
mc.bucketExists("demo").then((bucketExists) => {
    if (!bucketExists) {
        console.log("demo桶不存在, 创建");
        mc.makeBucket("demo");
    }

    // 上传对象
    var metaData = {};
    mc.fPutObject("demo", "images/1.jpg", "./files/1.jpg", metaData, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(result);
    });
});
```

