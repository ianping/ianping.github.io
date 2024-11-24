---
title: SpringBoot核心特性-SpringApplication类
createTime: 2024/11/24 15:56:15
permalink: /notes/java/cqbxxw8h/
---
参考:

- https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.spring-application



通过 `SpringApplication` 类,直接从`main`方法启动Spring应用程序, 只需要调用`SpringApplication#run`静态方法:

```java
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
```



## 懒初始化Bean

```properties
spring.main.lazy-initialization=true
```

## 自定义Banner

```properties
spring.main.banner-mode=console
spring.banner.charset=UTF-8
spring.banner.location=classpath:banner.txt
```

## 自定义SpringApplication

可以创建`SpringApplication`对象,然后调用其方法,进行自定义

```java
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        // SpringApplication.run(SpringApplicationApp.class, args);
        
        SpringApplication app = new SpringApplication(App.class);
        app.setLazyInitialization(false);
        app.setBannerMode(Banner.Mode.CONSOLE);
        app.run(args);
    }
}
```

## Application事件和监听器

待续...