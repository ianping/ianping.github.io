---
title: SpringCloud Config
createTime: 2024/11/24 15:56:15
permalink: /notes/java/0erfufk8/
---
## 参考

Spring官网：https://spring.io/projects/spring-cloud-config

## 版本信息

- Java 17
- SpringBoot 3.3.4
- SpringCloud 2023.0.3

## 配置服务器

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
        <artifactId>spring-cloud-config-server</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
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

### 启动引导类

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

### 使用本地存储库

*bootstrap.properties*

```properties
server.port=8888
spring.application.name=config-server
# SpringCloud Config Server
spring.profiles.active=native
spring.cloud.config.server.native.search-locations=classpath:/config-repo
#spring.cloud.config.server.native.search-locations=file://E:\\MyProjects\\JavaProjects\\springcloud\\config-server\\config-repo
```

### 创建客户端配置文件

配置文件命名规则：

- *${spring.application.name}*
- *${spring.application.name}-${spring.profiles.active}*

例如：

- *config-client.properties*
- *config-client-dev.properties*

客户端访问配置文件Rest端点：

- http://localhost:8888/config-client/default
- http://localhost:8888/config-client/dev

### 使用Git仓库

注意：使用本地Git仓库时，配置文件需要commit，才能生效。

```properties
server.port=8888
spring.application.name=config-server

# 使用git仓库
spring.profiles.active=git
# 本地git仓库
spring.cloud.config.server.git.uri=file:/E:\\MyProjects\\JavaProjects\\springcloud\\config-repo
```

其它可选配置

```properties
#spring.cloud.config.server.git.username=
#spring.cloud.config.server.git.password=
#spring.cloud.config.server.git.skip-ssl-validation=true
#spring.cloud.config.server.git.default-label=
#spring.cloud.config.server.git.try-master-branch=true
#spring.cloud.config.server.git.timeout=5
```

## 客户端

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
        <artifactId>spring-cloud-starter-config</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
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

### 添加配置服务器信息

*bootstrap.properties*

```properties
spring.application.name=config-client
# SpringCloud Config
spring.profiles.active=dev
spring.cloud.config.uri=http://localhost:8888
```

## 加密和解密配置属性

在配置服务器中，配置对称密钥

```properties
#加密对称密钥
spring.cloud.config.server.encrypt.enabled=true
encrypt.key=ian
```

提供了2个端点：/encrypt 和 /decrypt

```
### 加密
POST http://localhost:8888/encrypt
Content-Type: text/plain;charset=UTF-8

bar

### 解密
POST http://localhost:8888/decrypt
Content-Type: text/plain;charset=UTF-8

83dff8892e644db447103e29cb09a72e55660f54c76b284526ec031d1f0d9d77
```

只需要调用 /encrypt 端点加密要保护的属性值，使用加密值替换原值即可。例如：

原值

```properties
foo=bar
```

替换为

```properties
foo={cipher}83dff8892e644db447103e29cb09a72e55660f54c76b284526ec031d1f0d9d77
```

