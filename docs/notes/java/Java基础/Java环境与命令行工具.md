---
title: Java环境与命令行工具
createTime: 2024/11/24 15:56:15
permalink: /notes/java/gcent4qr/
---
## jar

编译

`javac -d classes me/lyp/HelloWorld.java`

打包

`jar cvf HelloWorld.jar -C .\classes\ .`

打包，同时设置Main-Class

`jar cvfe HelloWorld.jar me.lyp.HelloWorld -C .\classes\ .`

运行jar文件

`java -jar HelloWorld.jar`