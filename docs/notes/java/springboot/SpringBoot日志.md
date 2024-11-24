---
title: SpringBoot日志
createTime: 2024/11/24 15:56:15
permalink: /notes/java/vw8eze4h/
---
## 日志输出位置

SpringBoot日志默认输出到控制台, 可以配置其写入到文件.

可以指定具体的日志文件

```properties
spring.application.name=quickstart
logging.file.name=logs/${spring.application.name:app}.log
```

也可以通过指定日志输出目录, 日志文件名称为 *spring.log*

```properties
logging.file.path=logs
```

## 日志文件归档

日志文件的大小达到指定大小就自动归档(滚动日志), 默认为10M.

如果使用默认的Logback, 可以直接在application配置文件中进行配置

```properties
# 归档文件名: app.log.2024-01-01.0.gz
logging.logback.rollingpolicy.file-name-pattern=${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz
# 单个日志文件的最大尺寸, 达到这个大小就自动归档
logging.logback.rollingpolicy.max-file-size=10MB
# 是否在应用启动时清理归档文件
logging.logback.rollingpolicy.clean-history-on-start=false
# 要保留的日志文件数量
logging.logback.rollingpolicy.max-history=7
# 要保留的日志文件总大小(包含归档文件)
logging.logback.rollingpolicy.total-size-cap=0B
```

## 日志级别

日志输出级别支持: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL, 以及 `OFF`.

使用`logging.level.<logger-name>`设置

```java
logging.level.root=info
logging.level.org.springframework.web=debug
logging.level.me.lyp=info
```

## 日志分组

日志分组可以将多个日志记录器归为一组, 使用`logging.group.<group-name>`定义分组

```properties
logging.group.tomcat=org.apache.catalina, org.apache.coyote, org.apache.tomcat
logging.group.quickstart=me.lyp
```

SpringBoot预定义了web和sql分组

```properties
logging.group.web=org.springframework.core.codec, org.springframework.http, org.springframework.web, org.springframework.boot.actuate.endpoint.web, org.springframework.boot.web.servlet.ServletContextInitializerBeans

logging.group.sql=org.springframework.jdbc.core, org.hibernate.SQL, org.jooq.tools.LoggerListener
```

使用分组设置日志级别

```properties
logging.level.root=info
logging.level.web=warn
logging.level.sql=debug
logging.level.tomcat=trace
logging.level.quickstart=info
```

## 自定义日志配置

> 使用自定义配置文件后, application中的配置项就失效了.

在引入相关logging库依赖后, 默认会在classpath下查找相应名称的配置文件:

| 日志系统                | 配置文件                                                     |
| ----------------------- | ------------------------------------------------------------ |
| Logback                 | logback-spring.xml, logback-spring.groovy, logback.xml 或者 logback.groovy |
| Log4j2                  | log4j2-spring.xml 或者 log4j2.xml                            |
| JDK (Java Util Logging) | logging.properties                                           |

也可以手动指定日志配置文件

```properties
logging.config=classpath:logback-spring.xml
```

## Logback

SpringBoot默认使用Logback，是由 *spring-boot-starter-logging* 自动配置的。

自定义配置示例: *logback-spring.xml*

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <!-- Define log file location and name -->
    <property name="LOG_PATH" value="./logs"/>
    <property name="LOG_FILE" value="./logs/quickstart.log"/>

    <!-- Console appender -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Rolling file appender -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_FILE}</file>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz</fileNamePattern>
            <maxFileSize>10MB</maxFileSize>
            <maxHistory>7</maxHistory>
            <totalSizeCap>2GB</totalSizeCap>
        </rollingPolicy>
    </appender>

    <!-- Root logger level and appender configuration -->
    <root level="info">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

## Log4j2

添加依赖，并排除掉默认的 *spring-boot-starter-logging*

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-log4j2</artifactId>
</dependency>
```

自定义配置文件示例：*log4j2-spring.xml*

> 配置参考：https://logging.apache.org/log4j/2.x/manual/configuration.html

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Configuration name="Log4j2Configuration" status="WARN" monitorInterval="5">
    <Properties>
        <property name="LOG_PATH" value="./logs"/>
        <property name="LOG_FILE" value="./logs/quickstart.log"/>
    </Properties>

    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
    </Appenders>

    <Loggers>
        <Root level="info">
            <AppenderRef ref="Console"/>
        </Root>

        <Logger name="me.lyp" level="info">
            <AppenderRef ref="Console" />
        </Logger>
    </Loggers>
</Configuration>
```

## slf4j

slf4j(Simple Logging Facade For Java)，简单的Java日志门面框架，实现了通用的日志记录接口，可以无缝切换不同的日志实现(Java Util Logging, Logback, log4j2)。

通过桥接器，提供了统一的日志记录接口：

- `org.slf4j.LoggerFactory`
- `org.slf4j.Logger`

```java
private final Logger logger = LoggerFactory.getLogger(QuickstartApp.class);
```

支持多种日志级别：`trace`, `debug`, `info`, `warn`, `error`

```java
logger.info("hello, world !")
```

支持输出参数化日志字符串

```java
logger.info("{}, {} !", "hello", "world");
```

