---
title: SpringBoot集成AMQP消息中间件
createTime: 2024/11/24 15:56:15
permalink: /notes/java/nzbkt8k6/
---
版本信息：

- springboot 3.2.2
- rabbitmq 3.12.12

## 快速开始

参考：

- https://springdoc.cn/spring-boot/messaging.html#messaging.amqp

### 添加依赖

> `spring-boot-starter-amqp`默认使用RabbitMQ的Java客户端`ampq-client`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

### 配置RabbitMQ连接信息

```properties
server.port=8080

# RabbitMQ
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
spring.rabbitmq.virtual-host=/
```

### 配置交换器、消息队列，并绑定

创建配置类

```java
@Configuration
public class RabbitMQConfig {

    @Bean
    public Queue queueA(){
        return new Queue("q.a", true, false, false, null);
    }

    @Bean
    public DirectExchange exchangeA(){
        return new DirectExchange("x.a", true, false, null);
    }

    @Bean
    public Binding binding(Queue queue, DirectExchange exchangeA){
        return BindingBuilder.bind(queue).to(exchangeA).with("k.a");
    }
}
```

### 创建消息发布者

starter依赖自动注入`AmqpTemplate`Bean，用来发送和接收消息。

```java
@Component
public class AmqpPublisher {
    private final AmqpTemplate amqpTemplate;

    @Autowired
    public AmqpPublisher(AmqpTemplate amqpTemplate) {
        this.amqpTemplate = amqpTemplate;
    }

    public void send(String exchange, String routingKey, String message){
        amqpTemplate.convertAndSend(exchange, routingKey, message);
        System.out.println("[Pub]Send message: " + message);
    }
}
```

### 创建消息消费者

使用注解`@RabbitListener`将1个方法注册为RabbitMQ消息队列监听器，当队列中有消息到达时，该方法会自动调用

```java
@Component
public class AmqpConsumer {

    @RabbitListener(queues = {"q.a"})
    public void receiveMessage(String message){
        System.out.println("[Sub]Received message: " + message);
    }
}
```

### 使用消息发布者发布消息

这里作为演示，定义了1个Rest接口

```java
@RestController
@RequestMapping("/amqp")
public class TestController {

    @Resource
    private AmqpPublisher publisher;

    @GetMapping("/hello")
    public void send(@RequestParam("name") String name){
        String message = "Hello, " + name;
        publisher.send("x.a", "k.a", message);
    }
}
```

### 测试

启动应用，发送请求 http://localhost:8080/amqp/hello?name=jim，控制台输出：

```
[Pub]Send message: Hello, jim
[Sub]Received message: Hello, jim
```

## AmqpTemplate



## `@RabbitListener`

