---
title: SpringCloudNetflix Eureka
createTime: 2024/11/24 15:56:15
permalink: /notes/java/c5p09650/
---
## 参考

官方文档：https://docs.spring.io/spring-cloud-netflix/reference/spring-cloud-netflix.html

## 版本信息

- Java 17
- SpringBoot 3.3.4
- SpringCloud 2023.0.3

## Eureka服务器

### 依赖

```xml
<properties>
    <java.version>17</java.version>
    <spring-boot.version>3.3.4</spring-boot.version>
    <spring-cloud.version>2023.0.3</spring-cloud.version>
</properties>
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
    </dependency>
</dependencies>
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 配置

*bootstrap.properties*

```properties
server.port=8761
spring.application.name=eureka-server
# 主机名
eureka.instance.hostname=localhost
# 自身不注册到Eureka服务器
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
# Eureka服务Url
eureka.client.service-url.defaultZone=http://${eureka.instance.hostname}:${server.port}/eureka/
# eureka服务器启动后,接受请求之前等待的时长,单位秒,默认5分钟
eureka.server.wait-time-in-ms-when-sync-empty=5
```

### 启用Eureka服务器

使用`@EnableEurekaServer`注解启用Eureka服务器

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

启动应用，访问Eureka控制台面板：http://localhost:8761/

## Eureka客户端

### 依赖

```xml
<properties>
    <java.version>17</java.version>
    <spring-boot.version>3.3.4</spring-boot.version>
    <spring-cloud.version>2023.0.3</spring-cloud.version>
</properties>
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 配置

```properties
server.port=8010
spring.application.name=eureka-client-a
# 服务注册到Eureka服务器时,使用ip,而不是hostname
eureka.instance.prefer-ip-address=true
# 注册到Eureka服务器
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

## Eureka集群

