---
title: maven
createTime: 2024/11/24 15:56:15
permalink: /article/vcm9abjl/
---
参考：

- maven官网：https://maven.apache.org/

- Maven Repository：https://mvnrepository.com/

## 安装

### 1.下载

https://maven.apache.org/download.cgi

### 2.安装

- 解压压缩包

​	Windows: `unzip apache-maven-3.8.2-bin.zip`

​	Linux: `tar xzvf apache-maven-3.8.2-bin.tar.gz`

- 添加bin目录到PATH环境变量

- 确认安装，执行命令 `mvn --version`

## 设置

### settings.xml

*conf/settings.xml*是maven全局设置文件，最佳实践是将其复制settings.xml到*~/.m2/*目录，作为用户级别的设置文件。

Windows: `copy conf/settings.xml %USERPROFILE%\.m2\`

Linux: `cp conf/settings.xml ~/.m2/`

### 修改本地仓库目录

本地仓库默认位于*~/.m2/repository/*，可以修改为其它位置

```xml
<!-- Default: ${user.home}/.m2/repository -->
<localRepository>D:\\AppData\\.m2\\repository</localRepository>
```

### 设置仓库镜像

```xml
<mirrors>    
    <mirror>
        <id>aliyunmaven</id>
        <mirrorOf>external:*</mirrorOf>
        <name>阿里云公共仓库</name>
        <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
    <mirror>
        <id>huaweicloud</id>
        <mirrorOf>external:*</mirrorOf>
        <name>华为云公共仓库</name>
        <url>https://repo.huaweicloud.com/repository/maven/</url>
    </mirror>
    <mirror>
        <id>maven-default-http-blocker</id>
        <mirrorOf>external:http:*</mirrorOf>
        <name>Pseudo repository to mirror external repositories initially using HTTP.</name>
        <url>http://0.0.0.0/</url>
        <blocked>true</blocked>
    </mirror>
</mirrors>
```

### 设置代理

## 依赖管理

查看依赖树

`mvn dependency:tree`

### groupId, artifactId, version

坐标

### type

依赖的类型：

+ jar：默认类型
+ pom

### scope

依赖作用范围：

+ compile：默认范围，对编译、测试、运行都有效

+ test：对测试有效

+ provided：对编译和测试有效

+ runtime：对测试和运行有效

+ system：与provide范围一样，只对编译和测试有效。需要用systemPath元素指定依赖文件路径 

  ```xml
  <scope>system</scope>
  <systemPath>path/to/x.jar</systemPath>
  ```
+ import


### optional

依赖是否可选

### exclusions

排除依赖

### 依赖继承

## 仓库

### 本地仓库

### 远程仓库



## Nexus搭建Maven私服



## 插件

