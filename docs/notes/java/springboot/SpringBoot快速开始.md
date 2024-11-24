---
title: SpringBoot快速开始
createTime: 2024/11/24 15:56:15
permalink: /notes/java/3peratg7/
---
版本说明：

- Java 17
- SpringBoot 3.2.2

## 添加依赖

```xml

<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.2</version>
    <relativePath/>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.11.0</version>
            <configuration>
                <source>17</source>
                <target>17</target>
                <compilerVersion>17</compilerVersion>
                <encoding>utf-8</encoding>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <includeSystemScope>true</includeSystemScope>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 创建配置文件

application.properties

```properties
server.port=8080
```

## 创建Spring启动引导类

使用 `@SpringBootApplication` 注解

```java
@SpringBootApplication
public class QuickstartApp {
    public static void main(String[] args) {
        SpringApplication.run(QuickstartApp.class, args);
    }
}
```

## 添加控制器方法

在Java控制器类上使用 `@RestController` 注解，在控制器方法上使用 `@GetMapping` 注解

```java
@SpringBootApplication
@RestController
public class QuickstartApp {
    public static void main(String[] args) {
        SpringApplication.run(QuickstartApp.class, args);
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello(){
        return ResponseEntity.ok().body("Hello SpringBoot !");
    }
}
```

## 测试

启动项目，访问 http://localhost:8080/hello
