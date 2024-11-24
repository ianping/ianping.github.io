---
title: SpringBoot核心特性-devtools
createTime: 2024/11/24 15:56:15
permalink: /notes/java/m96p0a9e/
---
参考：

- https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.devtools

devtools提供了2个类加载器: 1个类加载器用于加载不变的类文件,例如jdk自带的类, 或者第三方的jar; 另一个类加载器用于加载自己编写的类. 当监测到类文件发生变化时, 就会触发自动重启.

## 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

## 禁用devtools

添加devtools Starter后, 自动启用

```properties
spring.devtools.restart.enabled=false
```

