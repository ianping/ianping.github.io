---
title: minecraft开发环境搭建
createTime: 2024/11/24 15:56:15
permalink: /notes/minecraft/vptuj4gv/
---
版本信息：

- Java 17(64位JVM)
- Gradle 8.6
- IDEA 2021.2.1
- MDK 1.20.2-48.1.0

## 配置Java

**下载**

https://www.oracle.com/java/technologies/downloads/

**安装**

解压zip文件到安装目录

**配置环境变量**

+ 新建 *JAVA_HOME* 变量，值为jdk目录
+ 修改PATH环境变量，添加 *$JAVA_HOME/bin*

**验证**

`java --version`

## 配置Gradle

**下载**

https://gradle.org/releases/

**安装**

解压zip文件到安装目录

**配置环境变量**

+ 新建 *GRADLE_HOME* 变量，值为gradle目录
+ 修改PATH环境变量，添加 *$GRADLE_HOME/bin*
+ 新建 *GRADLE_USER_PATH* 环境变量，值为gradle本地仓库目录（默认 *~/.gradle*）

**验证**

`gradle --version`

## 配置IDE

**下载IntelliJ IDEA**

https://www.jetbrains.com/idea/download/

**安装**

运行安装文件

**配置**

+ 配置编码所有为UTF-8
+ 配置JDK目录
+ 配置Gradle目录

## 配置MinecraftForge MDK

**下载**

https://files.minecraftforge.net/net/minecraftforge/forge/

MDK zip文件解压后是一个gradle构建的示例Mod项目，开发自己的Mod要基于这个项目。

## 运行示例Mod项目

1. 解压MDK zip文件，重命名为项目名称
2. 使用IDEA打开项目，设置IDEA中JDK、Gradle为本地的版本
3. 运行 `gradlew genIntellijRuns`
4. 运行 `gradlew build`，等待Gradle下载完依赖(时间会很漫长...)
5. 运行 `gradlew runServer`，启动服务器
6. 运行 `gradlew runClient，启动客户端`

