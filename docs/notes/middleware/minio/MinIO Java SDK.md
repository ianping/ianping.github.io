---
title: MinIO Java SDK
createTime: 2024/11/24 15:56:15
permalink: /notes/middleware/s5cgh29g/
---
官方文档：https://min.io/docs/minio/linux/developers/java/API.html

## 添加依赖

```xml
<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>8.5.7</version>
</dependency>
```

## 操作桶

## 操作对象

### 上传对象

```java
public class UploadObject {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        try {
            // 创建MinIO客户端
            MinioClient mc = MinioClient.builder()
                                        .endpoint("http://127.0.0.1:9000")
                                        .credentials("admin", "admin123")
                                        .build();

            // 获取或创建存储桶
            boolean bucketExists = mc.bucketExists(BucketExistsArgs.builder()
                                                                   .bucket("test")
                                                                   .build());
            if(!bucketExists) {
                mc.makeBucket(MakeBucketArgs.builder()
                                            .bucket("test")
                                            .build());
            }

            // 上传文件
            mc.uploadObject(UploadObjectArgs.builder()
                                            .bucket("test")
                                            .object("images/2.jpg")
                                            .filename("files/2.jpg")
                                            .build());
            System.out.println("文件上传成功");
        }catch(MinioException ex){
            System.err.printf("文件上传失败: %s%n", ex.getMessage());
            System.err.println(ex.httpTrace());
        }

    }
}
```

### 批量上传对象

```java
public class UploadSnowballObjects {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        try {
            // 创建MinIO客户端
            MinioClient mc = MinioClient.builder()
                                        .endpoint("http://127.0.0.1:9000")
                                        .credentials("admin", "admin123")
                                        .build();

            // 获取或创建存储桶
            boolean bucketExists = mc.bucketExists(BucketExistsArgs.builder()
                                                                   .bucket("test")
                                                                   .build());
            if(!bucketExists) {
                mc.makeBucket(MakeBucketArgs.builder()
                                            .bucket("test")
                                            .build());
            }

            // 批量上传对象
            List<SnowballObject> objects = new ArrayList<>();
            objects.add(new SnowballObject("images/1.jpg", "files/1.jpg"));
            objects.add(new SnowballObject("images/2.jpg", "files/2.jpg"));
            mc.uploadSnowballObjects(UploadSnowballObjectsArgs.builder()
                                                              .bucket("test")
                                                              .objects(objects)
                                                              .build());
            System.out.println("批量上传对象成功");
        } catch(MinioException ex) {
            System.err.printf("批量上传对象失败: %s%n", ex.getMessage());
            System.err.println(ex.httpTrace());
        }
    }
}
```

### 查询对象列表

```java
public class ListObjects {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        try {
            // 创建MinIO客户端
            MinioClient mc = MinioClient.builder()
                                        .endpoint("http://127.0.0.1:9000")
                                        .credentials("admin", "admin123")
                                        .build();

            // 获取或创建存储桶
            boolean bucketExists = mc.bucketExists(BucketExistsArgs.builder()
                                                                   .bucket("test")
                                                                   .build());
            if(!bucketExists) {
                mc.makeBucket(MakeBucketArgs.builder()
                                            .bucket("test")
                                            .build());
            }

            // 查询对象列表
            Iterable<Result<Item>> results = mc.listObjects(ListObjectsArgs.builder()
                                                                           .bucket("test")
                                                                           .recursive(true)
                                                                           .prefix("images/")
                                                                           .maxKeys(100)
                                                                           .includeVersions(true)
                                                                           .build());
            System.out.println("查询对象列表成功");
            for(Result<Item> result : results) {
                Item item = result.get();
                System.out.printf("名称: %s, 大小: %d, 是否目录: %b, 是否删除: %b, 是否最新: %b, versionId: %s%n",
                        item.objectName(), item.size(), item.isDir(), item.isDeleteMarker(), item.isLatest(), item.versionId());
            }
        } catch(MinioException ex) {
            System.err.printf("查询对象列表失败: %s%n", ex.getMessage());
            System.err.println(ex.httpTrace());
        }
    }
}
```

### 下载对象

```java
public class DownloadObject {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        try {
            // 创建MinIO客户端
            MinioClient mc = MinioClient.builder()
                                        .endpoint("http://127.0.0.1:9000")
                                        .credentials("admin", "admin123")
                                        .build();

            // 获取或创建存储桶
            boolean bucketExists = mc.bucketExists(BucketExistsArgs.builder()
                                                                   .bucket("test")
                                                                   .build());
            if(!bucketExists) {
                mc.makeBucket(MakeBucketArgs.builder()
                                            .bucket("test")
                                            .build());
            }

            // 下载对象
            mc.downloadObject(DownloadObjectArgs.builder()
                                                .bucket("test")
                                                .object("images/1.jpg")
                                                .filename("files/1-1.jpg")
                                                .build());
            System.out.println("对象下载成功");
        } catch(MinioException ex) {
            System.err.printf("下载对象失败: %s%n", ex.getMessage());
            System.err.println(ex.httpTrace());
        }
    }
}
```

### 删除对象

```java
public class RemoveObjects {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        try {
            // 创建MinIO客户端
            MinioClient mc = MinioClient.builder()
                                        .endpoint("http://127.0.0.1:9000")
                                        .credentials("admin", "admin123")
                                        .build();

            // 获取或创建存储桶
            boolean bucketExists = mc.bucketExists(BucketExistsArgs.builder()
                                                                   .bucket("test")
                                                                   .build());
            if(!bucketExists) {
                mc.makeBucket(MakeBucketArgs.builder()
                                            .bucket("test")
                                            .build());
            }

            // 删除单个文件
            //            mc.removeObject(RemoveObjectArgs.builder()
            //                                            .bucket("test")
            //                                            .object("images/1.jpg")
            //                                            .build());
            //            System.out.println("删除文件成功");

            // 删除多个文件
            List<DeleteObject> objects = new ArrayList<>();
            objects.add(new DeleteObject("images/1.jpg"));
            objects.add(new DeleteObject("images/2.jpg"));
            Iterable<Result<DeleteError>> results = mc.removeObjects(RemoveObjectsArgs.builder()
                                                                                      .bucket("test")
                                                                                      .objects(objects)
                                                                                      .build());
            for(Result<DeleteError> result : results) {
                DeleteError error = result.get();
                System.err.printf("删除文件失败: 文件名: %s, 错误原因: %s%n", error.objectName(), error.message());
            }
        } catch(MinioException ex) {
            System.err.printf("删除文件失败: %s%n", ex.getMessage());
            System.err.println(ex.httpTrace());
        }
    }
}
```

## 使用预签名URL

### 上传文件

服务端生成上传文件预签名URL，客户端使用PUT方法请求这个URL，请求体为要上传的文件。

```java
public class PresignedObjectUrl {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        try {
            // 创建MinIO客户端
            MinioClient mc = MinioClient.builder()
                                        .endpoint("http://127.0.0.1:9000")
                                        .credentials("admin", "admin123")
                                        .build();

            // 获取或创建存储桶
            boolean bucketExists = mc.bucketExists(BucketExistsArgs.builder()
                                                                   .bucket("test")
                                                                   .build());
            if(!bucketExists) {
                mc.makeBucket(MakeBucketArgs.builder()
                                            .bucket("test")
                                            .build());
            }

            // 生成上传文件预签名URL
            Map<String, String> queryParams = new HashMap<>();
            String uploadPresignedObjectUrl = mc.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                                                                                                .method(Method.PUT)
                                                                                                .bucket("test")
                                                                                                .object("images/1.jpg")
                                                                                                .expiry(5, TimeUnit.MINUTES)
                                                                                                .extraQueryParams(queryParams)
                                                                                                .build());
            System.out.println(uploadPresignedObjectUrl);
        } catch(MinioException ex) {
            System.err.printf("获取预签名对象URL失败: %s%n", ex.getMessage());
        }
    }
}
```

### 下载文件

服务端生成下载文件预签名URL，客户端使用GET方法请求这个URL。

```java
public class PresignedObjectUrl {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        try {
            // 创建MinIO客户端
            MinioClient mc = MinioClient.builder()
                                        .endpoint("http://127.0.0.1:9000")
                                        .credentials("admin", "admin123")
                                        .build();

            // 获取或创建存储桶
            boolean bucketExists = mc.bucketExists(BucketExistsArgs.builder()
                                                                   .bucket("test")
                                                                   .build());
            if(!bucketExists) {
                mc.makeBucket(MakeBucketArgs.builder()
                                            .bucket("test")
                                            .build());
            }

            // 生成下载文件预签名URL
            String downloadPresignedObjectUrl = mc.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                                                                                                  .method(Method.GET)
                                                                                                  .bucket("test")
                                                                                                  .object("images/1.jpg")
                                                                                                  .expiry(5, TimeUnit.MINUTES)
                                                                                                  .build());
            System.out.println(downloadPresignedObjectUrl);
        } catch(MinioException ex) {
            System.err.printf("获取预签名对象URL失败: %s%n", ex.getMessage());
        }
    }
}
```

### 删除文件

服务端生成删除文件预签名URL，客户端使用DELETE方法请求这个URL

```java
public class PresignedObjectUrl {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        try {
            // 创建MinIO客户端
            MinioClient mc = MinioClient.builder()
                                        .endpoint("http://127.0.0.1:9000")
                                        .credentials("admin", "admin123")
                                        .build();

            // 获取或创建存储桶
            boolean bucketExists = mc.bucketExists(BucketExistsArgs.builder()
                                                                   .bucket("test")
                                                                   .build());
            if(!bucketExists) {
                mc.makeBucket(MakeBucketArgs.builder()
                                            .bucket("test")
                                            .build());
            }

            // 生成删除文件预签名URL
            String deletePresignedObjectUrl = mc.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                                                                            .method(Method.DELETE)
                                                                            .bucket("test")
                                                                            .object("images/1.jpg")
                                                                            .expiry(5, TimeUnit.MINUTES)
                                                                            .build());
            System.out.println(deletePresignedObjectUrl);
        } catch(MinioException ex) {
            System.err.printf("获取预签名对象URL失败: %s%n", ex.getMessage());
        }
    }
}
```

### 使用预签名表单上传文件

使用POST方法上传表单数据，可以设置PostPolicy。

服务端生成预签名Form表单数据，客户端使用Post方法请求Minio相应桶的URL，将服务端生成的Form表单数据，连同文件一起发送。

```java
public class PresignedPostFormData {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        try {
            // 创建MinIO客户端
            MinioClient mc = MinioClient.builder()
                                        .endpoint("http://127.0.0.1:9000")
                                        .credentials("admin", "admin123")
                                        .build();

            // 获取或创建存储桶
            boolean bucketExists = mc.bucketExists(BucketExistsArgs.builder()
                                                                   .bucket("test")
                                                                   .build());
            if(!bucketExists) {
                mc.makeBucket(MakeBucketArgs.builder()
                                            .bucket("test")
                                            .build());
            }
            
            // 创建预签名FormData
            PostPolicy policy = new PostPolicy("test", ZonedDateTime.now().plusDays(7L));
            policy.addEqualsCondition("key", "images/1.jpg");
            policy.addStartsWithCondition("Content-Type", "image/");
            policy.addContentLengthRangeCondition(5 * 1024, 5 * 1024 * 1024);
            Map<String, String> presignedPostFormData = mc.getPresignedPostFormData(policy);
            for(String key: presignedPostFormData.keySet()){
                System.out.printf("%s=%s%n", key, presignedPostFormData.get(key));
            }
        } catch(MinioException ex) {
            System.err.printf("获取预签名对象URL失败: %s%n", ex.getMessage());
        }
    }
}
```

客户端POST发送表单数据

![](../_/20240117110957.png)
