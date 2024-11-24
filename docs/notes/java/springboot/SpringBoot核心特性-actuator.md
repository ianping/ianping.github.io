---
title: SpringBoot核心特性-actuator
createTime: 2024/11/24 15:56:15
permalink: /notes/java/g841tz2w/
---
参考：

- https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html

Actuator可以通过HTTP或JMX来管理和监控应用程序的运行状态.

添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

## 启用端点

默认情况下, 除了`shutdown`以外, 其它所有端点默认启用.

启用所有端点

```properties
management.endpoints.enabled-by-default=true

management.endpoint.shutdown.enabled=true
```

禁用所有端点, 并启用特定的端点

```properties
management.endpoints.enabled-by-default=false

management.endpoint.health.enabled=true
management.endpoint.info.enabled=true
```

## 暴露端点

启用端点后, 还需要暴露出去, 才能使用. 默认情况下, 只暴露 `health` 端点.

暴露端点使用`include` 和 `exclude`

暴露JMX端点

```properties
management.endpoints.enabled-by-default=true

management.endpoints.jmx.exposure.include=health,info
management.endpoints.jmx.exposure.exclude=info
```

暴露HTTP端点

```properties
management.endpoints.enabled-by-default=true

management.endpoints.web.exposure.include=health,info,beans
management.endpoints.web.exposure.exclude=info
```

暴露所有端点, 然后排除指定端点

> 注意: 如果使用yaml配置文件, 星号必须用引号包裹起来

```properties
management.endpoints.enabled-by-default=true
management.endpoint.shutdown.enabled=true

management.endpoints.web.exposure.include=*
management.endpoints.web.exposure.exclude=beans,loggers
```

## 缓存端点信息

使用`management.endpoint.<endpoint>.cache.time-to-live`配置端点的缓存时长

```java
management.endpoint.info.cache.time-to-live=10s
management.endpoint.beans.cache.time-to-live=10s
```
