---
title: SpringCloud Bus
createTime: 2024/11/24 15:56:15
permalink: /notes/java/k33pupug/
---
参考：

- Spring官网 https://docs.spring.io/spring-cloud-bus/docs/4.0.3/reference/html/

## 快速开始

Spring Cloud Bus会自动声明1个名称为 *springCloudBus* 的交换机，类型是topic。调用Bus端点的时候，会向该交换器发布消息，所有Bus消费者应用都能接收到消息，然后自动进行配置刷新、配置更新操作。

### 1.添加依赖

AMQP消息中间件(RabbitMQ)

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
```

Kafka消息中间件

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-kafka</artifactId>
</dependency>
```

### 2.配置

- 向外暴露busrefresh,busenv端点
- 配置RabbitMQ连接信息

```properties
server.port=9001
spring.application.name=bus-publisher

# Actuator
management.endpoints.web.exposure.include=busrefresh,busenv

# RabbitMQ
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
spring.rabbitmq.virtual-host=/
```

## 使用 /actuator/busrefresh 端点刷新配置

- 刷新全部实例

  POST http://localhost:9001/actuator/busrefresh

- 刷新单个微服务的全部实例

  POST http://localhost:9001/actuator/busrefresh/[destination]

  destination值为 `${spring.application.name}`

- 刷新单个实例

  POST http://localhost:9001/actuator/busrefresh/[destination]

  destination值为 `${spring.application.name}:${server.port}`

## 使用 /actuator/busenv 端点更新配置

- 更新全部实例

	POST http://localhost:9001/actuator/busenv

    ```json
    {
        "name":"k",
        "value":"v"
    }
    ```

- 更新单个微服务的全部实例

  POST http://localhost:9001/actuator/busenv/[destination]

  destination值为 `${spring.application.name}`

- 更新单个实例

  POST http://localhost:9001/actuator/busenv/[destination]

  destination值为 `${spring.application.name}:${server.port}`

