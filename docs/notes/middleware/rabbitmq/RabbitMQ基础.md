---
title: RabbitMQ基础
createTime: 2024/11/24 15:56:15
permalink: /notes/middleware/4f8bqp4n/
---
## RabbitMQ命令

查看帮助信息

`rabbitmqctl help set_permissions`

查看RabbitMQ服务状态

`rabbitmqctl status`

`rabbitmqctl cluster_status`

查看队列和消息

`rabbitmqctl list_queues`

`rabbitmqctl list_queues name messages messages_ready messages_unacknowledged`

查看Exchange

` rabbitmqctl list_exchanges`

查看Binding

`rabbitmqctl list_bindings`

添加用户

`rabbitmqctl add_user root root`

给用户设置权限

`rabbitmqctl set_permissions -p / root ".*" ".*" ".*"`

给用户设置标签

`rabbitmqctl set_user_tags root administrator`

## RabbitMQ模型架构及核心概念

参考：

+ https://rabbitmq.com/tutorials/amqp-concepts.html

RabbitMQ作为一个消息代理(Message Broker)，负责接收、存储、转发消息。

**核心概念**

- Connection，客户端与RabbitMQ建立TCP长连接。同一时刻，推荐一个客户端不要打开多个连接，使用完毕需要断开

- Channel，信道，共享单个TCP连接的“轻量级连接”

- Virtual Hosts，虚拟主机，提供隔离环境

- Publisher，消息发布者、消息生产者，发布消息到RabbitMQ中

- Consumer，消息订阅者、消息消费者，从RabbitMQ接收、拉取消息

- Queue，消息队列，存储消息

- Exchange，交换器，负责将消息发布者发布的消息路由到消息队列中

- Binding，绑定Exchange与Queue，Exchange根据路由规则将消息路由到目标Queue中。路由规则取决于Exchange类型、routingKey

- RoutingKey，绑定Exchange与Queue时，指定routingKey；消息发布者发布消息时，指定Exchange和routingKey；2个routingKey进行匹配，其结果用于确定Exchange将消息路由到哪个消息队列

## RabbitMQ快速开始

参考：

+ https://rabbitmq.com/tutorials/tutorial-one-java.html

**添加依赖库**

```xml
<dependency>
    <groupId>com.rabbitmq</groupId>
    <artifactId>amqp-client</artifactId>
    <version>5.20.0</version>
</dependency>
```

**消息发布者示例**

```java
public class Publisher {
    public static void main(String[] args) {
        Publisher publisher = new Publisher();
        publisher.send("Hello");
        publisher.send("RabbitMQ");
    }

    private static final String EXCHANGE_NAME_TEST = "x_test";
    private static final String QUEUE_NAME_TEST = "q_test";
    private static final String ROUTING_KEY_TEST = "r_test";

    public void send(String message) {
        // 创建ConnectionFactory
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("127.0.0.1");
        factory.setPort(5672);
        factory.setVirtualHost("/");
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setConnectionTimeout(60000);

        // 创建Connection, Channel
        try(Connection conn = factory.newConnection();
            Channel channel = conn.createChannel();
        ) {
            // 声明Exchange
            Map<String, Object> xArgs = new HashMap<>();
            channel.exchangeDeclare(
                    EXCHANGE_NAME_TEST,  // 交换器名称
                    BuiltinExchangeType.DIRECT, // 交换器类型: direct
                    false, // 持久化?
                    true,  // 自动删除?
                    xArgs);

            // 声明Queue
            Map<String, Object> qAgs = new HashMap<>();
            channel.queueDeclare(
                    QUEUE_NAME_TEST, // 队列名称
                    false,           // 持久化队列?
                    false,           // 独占队列?
                    true,            // 自动删除队列?
                    qAgs);

            // 绑定Exchange和Queue
            channel.queueBind(QUEUE_NAME_TEST, EXCHANGE_NAME_TEST, ROUTING_KEY_TEST);

            // 发布消息
            AMQP.BasicProperties props = MessageProperties.TEXT_PLAIN;
            channel.basicPublish(EXCHANGE_NAME_TEST, ROUTING_KEY_TEST, props, message.getBytes(StandardCharsets.UTF_8));
        } catch(IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }
}
```

**消息消费者示例**

```java
public class Consumer {
    public static void main(String[] args) {
        recv();
    }

    private static final String QUEUE_NAME_TEST = "q_test";

    private static void recv() {
        // 创建ConnectionFactory
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("");
        factory.setPort(5672);
        factory.setVirtualHost("/");
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setConnectionTimeout(60000);

        try {
            // 创建Connection, Channel
            Connection conn = factory.newConnection();
            Channel channel = conn.createChannel();

            System.out.println("Consumer: Waiting for messages...");

            // 接收消息
            DeliverCallback deliverCallback = (String consumerTag, Delivery message) -> {
                String msg = new String(message.getBody(), StandardCharsets.UTF_8);
                System.out.println("Received message: " + msg);
            };
            CancelCallback cancelCallback = (String consumerTag) -> {};
            channel.basicConsume(
                    QUEUE_NAME_TEST,  // 队列名称
                    true,             // 自动确认消息
                    deliverCallback,  // 消息送达回调
                    cancelCallback);  // 取消消费消息回调
        } catch(IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }
}
```

**测试**

1. 启动消息发布者应用
2. 启动消息消费者应用

消息消费者输出：

```
Consumer: Waiting for messages...
Received message: Hello
Received message: RabbitMQ
```

## Connection与Channel

参考：

- https://www.rabbitmq.com/uri-spec.html

`Connection`是客户端与RabbitMQ之间建立TCP连接，`Channel`是共享同一个`Connection`的“轻量级连接”。

通过`ConnectionFactory`设置连接参数，使用API方法的方式

```java
ConnectionFactory factory = new ConnectionFactory();
factory.setHost("127.0.0.1");
factory.setPort(5672);
factory.setVirtualHost("/");
factory.setUsername("guest");
factory.setPassword("guest");
factory.setConnectionTimeout(60000);
```

也可以使用URI的方式

> 注意：vhost如果包含/，需要用%2f代替

```java
String uri = "amqp://guest:guest@127.0.0.1:5672/%2f";
ConnectionFactory factory = new ConnectionFactory();
factory.setUri(uri);
factory.setConnectionTimeout(60000);
```

打开连接和信道

```java
try(Connection conn = factory.newConnection(); 
    Channel channel = conn.createChannel();) {
    // ...
} catch(IOException | TimeoutException e) {
    e.printStackTrace();
}
```

## 交换机

### 声明Exchange

```java
Exchange.DeclareOk exchangeDeclare(String exchange,
                                   String type,
                                   boolean durable,
                                   boolean autoDelete,
                                   boolean internal,
                                   Map<String, Object> arguments) throws IOException;
```

参数：

- exchange，交换器名称

- type，交换器类型: direct, fanout, topic, headers
- durable，是否持久化
- autoDelete，是否自动删除。与当前交换器绑定的全部交换器和队列都解绑后，自动删除
- internal，是否属于内置交换器。客户端不能直接发布消息到内置交换器，可以与非内置交换器绑定，客户端发送消息到非内置交换器，间接发送消息到内置交换器。
- arguments，其它参数

### 删除Exchange

```java
Exchange.DeleteOk exchangeDelete(String exchange, 
                                 boolean ifUnused) throws IOException;
```

参数：

- exchange，交换器名称
- ifUnused，交换器在没有使用时才允许删除？

### Exchange类型

参考：

- https://rabbitmq.com/tutorials/tutorial-five-java.html

**direct**

Queue与当前Exchange绑定时使用的routingKey，与消息发布者发布消息时使用的routingKey完全一样时，Exchange才将消息路由到到Queue。

**topic**

topic类型的Exchange，在绑定Queue时，routingKey模式规则如下:

+ 使用句点.分割多个单词，例如：`a.b.c`
+ 使用星号*表示单个单词，例如：`a.*.*`
+ 使用井号#表示0或多个用句点分割的单词，例如：`a.#`

消息发布者发布消息时，使用完整的routingKey，如果与绑定Queue时指定的routingKey模式匹配，Exchange就路由消息到该Queue中。

例如，消息发布者发布消息时，指定的routingKey如下

```java
channel.basicPublish(EXCHANGE_NAME_TEST, "test.x", null, ("x: " + msg).getBytes(StandardCharsets.UTF_8));
channel.basicPublish(EXCHANGE_NAME_TEST, "test.x.y", null, ("x.y: " + msg).getBytes(StandardCharsets.UTF_8));
```

绑定Queue时，routingKey模式如下

```java
String routingKey1 = "test.*";
channel.queueBind(QUEUE_NAME_TEST, EXCHANGE_NAME_TEST, routingKey1);
String routingKey2 = "test.#";
channel.queueBind(QUEUE_NAME_TEST_2, EXCHANGE_NAME_TEST, routingKey2);
```

那么：

- QUEUE_NAME_TEST队列，只能收到Exchange转发的routingKey是test.x的消息
- QUEUE_NAME_TEST_2队列，可以收到Exchange转发的routingKey是test.x和test.x.y的消息

在消息消费者程序中，消费这2个队列中的消息

```java
channel.queueDeclare(QUEUE_NAME_TEST, false, false, true, null);
channel.queueDeclare(QUEUE_NAME_TEST_2, false, false, true, null);

DeliverCallback deliverCallback = (String consumerTag, Delivery message) -> {
    String msg = new String(message.getBody(), StandardCharsets.UTF_8);
    System.out.println("q_test Received message: " + msg);
};
channel.basicConsume(QUEUE_NAME_TEST, true, deliverCallback, (String consumerTag) -> {});

DeliverCallback deliverCallback2 = (String consumerTag, Delivery message) -> {
    String msg = new String(message.getBody(), StandardCharsets.UTF_8);
    System.out.println("q_test_2 Received message: " + msg);
};
channel.basicConsume(QUEUE_NAME_TEST_2, true, deliverCallback2, (String consumerTag) -> {});
```

输出：

```
q_test Received message: x: 1
q_test_2 Received message: x: 1
q_test_2 Received message: x.y: 1
q_test_2 Received message: x: 2
q_test Received message: x: 2
q_test_2 Received message: x.y: 2
q_test Received message: x: 3
q_test_2 Received message: x: 3
q_test_2 Received message: x.y: 3
```

**fanout**

广播模式，与当前Exchange绑定的任何Queue，都能收到消息。与routingKey无关。

例如，消息发布者发布消息，routingKey指定为x

```java
channel.exchangeDeclare(EXCHANGE_NAME_TEST, "fanout");
channel.basicPublish(EXCHANGE_NAME_TEST, "x", null, message.getBytes(StandardCharsets.UTF_8));
```

绑定Queue时，routingKey是y

```java
// 声明Exchange
channel.exchangeDeclare(EXCHANGE_NAME_TEST, "fanout");
// 声明一个随机名称队列: 非持久化, 独占, 自动删除
String queueName = channel.queueDeclare().getQueue();
// 绑定Exchange和队列
channel.queueBind(queueName, EXCHANGE_NAME_TEST, "y");
```

运行消息消费者和消息发布者，虽然routingKey不一致，消费者一样可以收到消息

**headers**

不根据routingKey匹配，而是使用headers参数匹配。

### Exchange其它属性

```java
Map<String,Object> arguments = new HashMap<>();
arguments.put("alternate-exchange", "x.ae"); // 备用交换器
channel.exchangeDeclare("x.normal", BuiltinExchangeType.DIRECT, false, false, arguments);
```

 ## 消息队列

参考：

- https://rabbitmq.com/queues.html

### 声明Queue

```java
Queue.DeclareOk queueDeclare(String queue, 
                             boolean durable, 
                             boolean exclusive, 
                             boolean autoDelete,
                             Map<String, Object> arguments) throws IOException;
```

参数：

- queue，队列名
- durable，持久？
- exclusive，独占？仅对当前连接可用，连接断开自动删除
- autoDelete，自动删除？与该队列连接的消费者都断开时，自动删除
- arguments，其它参数

### 删除Queue

```java
Queue.DeleteOk queueDelete(String queue,
                           boolean ifUnused,
                           boolean ifEmpty) throws IOException;
```

参数：

- queue，队列名称
- ifUnused，队列无客户端在使用时才允许删除？
- ifEmpty，队列为空时才允许删除？

### Queue其它属性

```java
Map<String,Object> arguments = new HashMap<>();
arguments.put("x-expires", 1000 * 60 * 60); // 队列过期时间: 1h
arguments.put("x-message-ttl", 1000 * 60);  // 队列中的消息的过期时间, 1min
arguments.put("x-max-priority", 10);        // 队列中的消息的最大优先级
arguments.put("x-dead-letter-exchange", "x.dlx");    // 死信DLX
arguments.put("x-dead-letter-routing-key", "k.dlx"); // 死信路由键
channel.queueDeclare("queue", false, false, true, arguments);
```

## 绑定Queue和Exchange

**绑定Queue和Exchange**

```java
Queue.BindOk queueBind(String queue, 
                       String exchange, 
                       String routingKey, 
                       Map<String, Object> arguments) throws IOException;
```

**解绑Queue和Exchange**

```java
Queue.UnbindOk queueUnbind(String queue, 
                           String exchange, 
                           String routingKey,
                           Map<String, Object> arguments) throws IOException;
```

**绑定Exchange和Exchange**

```java
Exchange.BindOk exchangeBind(String destination, 
                             String source, 
                             String routingKey, 
                             Map<String, Object> arguments) throws IOException;
```

下面的示例代码中，消息发布者发布消息到source交换器，source交换器将消息转发到destination交换器，destination交换器与队列绑定，最终将消息路由到队列queue

```java
// 交换器source和destination绑定
channel.exchangeDeclare("source", BuiltinExchangeType.DIRECT);
channel.exchangeDeclare("destination", BuiltinExchangeType.DIRECT);
channel.exchangeBind("destination", "source", "routingKey");

// 交换器destination和队列queue绑定
channel.queueDeclare("queue", false, false, true, null);
channel.queueBind("queue", "destination", "");

// 发布消息到交换器source
channel.basicPublish("source", "routingKey", null, "hello".getBytes(StandardCharsets.UTF_8));
```

**解绑Exchange和Exchange**

```java
Exchange.UnbindOk exchangeUnbind(String destination, 
                                 String source, 
                                 String routingKey, 
                                 Map<String, Object> arguments) throws IOException;
```

## 发布消息

```java
 void basicPublish(String exchange, 
                   String routingKey, 
                   boolean mandatory,
                   boolean immediate, 
                   BasicProperties props,
                   byte[] body) throws IOException;
```

参数：

- exchange，交换器名
- routingKey，路由键
- mandatory，true，消息无法被路由到任何队列时，RabbitMQ将消息返回给发布者；false，直接丢弃。
- immediate，true，消息被路由到的队列上没有任何消费者订阅时，RabbitMQ将消息返回给发布者；false，直接丢弃。(**RabbitMQ3.0后不再支持此参数**)
- props，消息额外属性，共有14个，例如contentType, headers, deliveryMode, priority, expiration等
- body，消息体

### mandatory

示例

```java
public class Publisher {
    public static void main(String[] args) {
        send("1");
    }

    private static final String EXCHANGE_NAME_TEST = "x_test";

    private static void send(String msg){
        try {
            ConnectionFactory factory = new ConnectionFactory();
            factory.setUri("amqp://guest:guest@127.0.0.1:5672/%2f");
            try(Connection conn = factory.newConnection();
                Channel channel = conn.createChannel();
            ) {
                channel.exchangeDeclare(EXCHANGE_NAME_TEST, "direct");
                boolean mandatory = true;
                boolean immediate = false;
                channel.basicPublish(EXCHANGE_NAME_TEST, "routingKey", mandatory, immediate, null, msg.getBytes(StandardCharsets.UTF_8));
                
                // 监听返回值
                ReturnListener returnListener = new ReturnListener() {
                    @Override
                    public void handleReturn(int replyCode, String replyText, String exchange, String routingKey, 
                            AMQP.BasicProperties properties, byte[] body) throws IOException {
                        System.out.println("Return message: " + new String(body, StandardCharsets.UTF_8));
                    }
                };
                channel.addReturnListener(returnListener);

                TimeUnit.SECONDS.sleep(5L);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}

```

### 消息其它属性

props参数类型为`AMQP.BasicProperties`。

可以使用工具类`MessageProperties`中的方法获取常见属性组合的实例：

- MINIMAL_BASIC，所有属性都为null
- MINIMAL_PERSISTENT_BASIC，deliveryMode为2，即持久化消息
- BASIC，contentType为application/octet-stream
- PERSISTENT_BASIC，contentType为application/octet-stream，deliveryMode为2，即持久化消息
- TEXT_PLAIN，contentType为text/plain，deliveryMode为1，priority为0
- PERSISTENT_TEXT_PLAIN，contentType为text/plain，deliveryMode为2，priority为0

也可以使用`AMQP.BasicProperties.Builder`自己构建：

```java
Map<String, Object> headers = new HashMap<>();
headers.put("date", "2023");
AMQP.BasicProperties props = new AMQP.BasicProperties.Builder()
    .contentType("text/plain")
    .headers(headers)
    .deliveryMode(2) // 持久化消息
    .priority(0)
    .expiration("60000") // 过期时间: 1min
    .replyTo("callbackQueueName")  // 用于RPC,通常设置为回调队列名
    .correlationId(UUID.randomUUID().toString()) // 用于RPC, 用于关联请求与响应
    .build();
```

## 消费消息

### Push模式

Push(推)模式，消息代理主动推送消息给消费者，消费者订阅队列，并提供回调函数处理接收到的消息。

这种模式适用于需要实时处理消息的场景。

```java
String basicConsume(String queue, 
                    boolean autoAck, 
                    String consumerTag, 
                    boolean noLocal,
                    boolean exclusive,
                    Map<String, Object> arguments, 
                    DeliverCallback deliverCallback, 
                    CancelCallback cancelCallback,
                    ConsumerShutdownSignalCallback shutdownSignalCallback) throws IOException;
```

参数：

- queue，订阅的队列名
- autoAck，自动确认？
- consumerTag，消费者标记
- noLocal，不接收同一Connection的消息发布者发布的消息？
- exclusive，独占？
- arguments，其它参数
- deliverCallback，分发消息回调
- cancelCallback，取消分发消息回调
- shutdownSignalCallback，Channel或Connection断开时回调

示例：

```java
DeliverCallback deliverCallback = (String consumerTag, Delivery message) -> {
    String body = new String(message.getBody(), StandardCharsets.UTF_8);
    System.out.println("Received message: " + body);
};
CancelCallback cancelCallback = (String consumerTag) -> {};
channel.basicConsume("queue", true, "consumerTag", deliverCallback, cancelCallback);
```

### Pull模式

Pull(拉)模式，消费者主动拉取消息。

示例：

```java
GetResponse response = channel.basicGet("queue", true);
String body = new String(response.getBody(), StandardCharsets.UTF_8);
System.out.println("Received message: " + body);
```

## 消息分发策略

### 轮询分发

轮询分发(Round-robin-dispatching)，RabbitMQ默认消息分发策略。

多个消费者订阅同一个队列时，按照轮询的方式，依次将消息分发给不同的消费者。1个消息只会被分发给1个消费者。

### 公平分发

公平分发(Fair-dispatching)，消费方通过调用`Channel#basicQos`方法，表示其最多只能接收固定个数的未确认消息。这样，RabbitMQ就可以在轮询分发的基础上，根据消费方的工作负载来分配消息。

```java
channel.basicQos(1);
```

## 队列和消息TTL

TTL(Time-to-live)，存活时间。

设置队列过期时间

```java
Map<String,Object> arguments = new HashMap<>();
arguments.put("x-expires", 1000 * 60 * 60); // 队列TTL: 1h
channel.queueDeclare("queue", false, false, true, arguments);
```

设置消息过期时间，可以在声明队列的时候统一设置，也可在发布消息时设置单个消息的过期时间

```java
Map<String,Object> arguments = new HashMap<>();
arguments.put("x-message-ttl", 1000 * 60);  // 队列中的消息TTL: 1min
channel.queueDeclare("queue", false, false, true, arguments);

AMQP.BasicProperties props = new AMQP.BasicProperties.Builder()
    .expiration("60000") // 消息TTL: 1min
    .build();
channel.basicPublish("source", "routingKey", props, "hello".getBytes(StandardCharsets.UTF_8));
```

## 几种特殊的队列

### 死信队列

死信(Dead-letter)产生的几种情况：

- 消息过期
- 消息队列已满
- 消息被拒绝：`channel#basicReject`和`channel#basicNack`，且消息没有重新入队

在声明一个消息队列时，可以通过参数设置1个**死信交换机**(DLX, Dead-letter-exchange)，这个交换器绑定1个队列，即**死信队列**。RabbitMQ会自动将消息队列中的死信重新发布到DLX，进而被路由到死信队列中。

示例：

```java
try {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setUri("amqp://guest:guest@127.0.0.1:5672/%2f");
    try(Connection conn = factory.newConnection();
        Channel channel = conn.createChannel();
       ) {
        // 声明DLX和死信队列,并绑定
        channel.exchangeDeclare("x.dlx", BuiltinExchangeType.DIRECT, false);
        channel.queueDeclare("q.dlx", false, false, true, null);
        channel.queueBind("q.dlx", "x.dlx", "k.dlx", null);

        // 声明普通交换机和队列,通过参数指定队列的DLX,并绑定
        channel.exchangeDeclare("x.normal", BuiltinExchangeType.DIRECT, false);
        Map<String,Object> arguments = new HashMap<>();
        arguments.put("x-message-ttl", 1000 * 5); // 消息5s后过期,成为死信
        arguments.put("x-dead-letter-exchange", "x.dlx");
        arguments.put("x-dead-letter-routing-key", "k.dlx");
        channel.queueDeclare("q.normal", false, false, true, arguments);
        channel.queueBind("q.normal", "x.normal", "k.normal", null);

        // 发布消息到普通交换机,消息过期后成为死信,RabbitMQ自动将其发送到DLX,进而被路由到死信队列
        channel.basicPublish("x.normal", "k.normal", null, msg.getBytes(StandardCharsets.UTF_8));

        TimeUnit.SECONDS.sleep(1200L);
    }
} catch(Exception e) {
    e.printStackTrace();
}
```

### 延迟队列

通过TTL和DLX结合，可以实现延迟队列。

上面的示例中的死信队列就是一个延迟队列：

- 声明DLX和死信队列，并绑定

- 给普通队列中的消息设置TTL
- 给普通队列设置DLX
- 消息发布到普通队列中，到了过期时间后，成为死信，RabbitMQ自动将死信分发到DLX，进而路由到死信队列
- 消费者消费死信队列中的消息

### 优先级队列 

声明队列的时候，设置队列中消息允许的最大优先级

```java
Map<String, Object> arguments = new HashMap<>();
arguments.put("x-max-priority", 10);
channel.queueDeclare("q", false, false, true, arguments);
```

发布消息时，设置单条消息的优先级

```java
AMQP.BasicProperties props = new AMQP.BasicProperties().builder()
    .priority(5)
    .build();
channel.basicPublish("x", "k", props, msg.getBytes(StandardCharsets.UTF_8));
```

## RPC

远程过程调用(RPC, Remote-procedure-call)。

参考：

- https://rabbitmq.com/tutorials/tutorial-six-java.html

RabbitMQ实现RPC的思路：

1. 定义RPC请求和响应的消息格式
2. 声明2个队列：接收RPC请求的请求队列、发送RPC响应的响应队列
3. 客户端发送RPC请求：发送RPC请求到请求队列，监听响应队列中的消息
4. 服务端处理RPC请求：监听RPC请求队列中的消息，收到请求后执行具体的过程调用逻辑，将响应数据发送到响应队列中

## RabbitMQ消息可靠性机制

### 发布方确认机制

消息发布方确认机制是确保发布方将消息成功发送到RabbitMQ交换机的机制。

RabbitMQ提供了2种发布方确认机制：事务机制(Transaction)和发布确认机制(Publisher-confirm)。

**事务机制**

示例：

```java
ConnectionFactory factory = new ConnectionFactory();
factory.setHost("127.0.0.1");
try (Connection conn = factory.newConnection();
     Channel channel = conn.createChannel();
    ){
    channel.basicQos(1);
    channel.queueDeclare("queue", false, false, false, null);

    // 开启事务
    channel.txSelect();
    try {
        // 发布消息
        for(int i = 1; i <= 5; i++) {
            byte[] body = String.valueOf(i).getBytes(StandardCharsets.UTF_8);
            channel.basicPublish("", "routingKey", null, body);
        }
        // 提交事务
        channel.txCommit();
        System.out.println("Messages send successfully!");
    }catch(Exception e){
        // 异常,回滚事务
        channel.txRollback();
        e.printStackTrace();
    }
}catch(Exception e){
    e.printStackTrace();
}
```

**发布确认机制**

发布确认是一种异步的确认机制，启用发布确认模式后，注册确认回调接口，在其中处理确认和未确认的消息。

示例：

```java
ConnectionFactory factory = new ConnectionFactory();
factory.setHost("127.0.0.1");

try(Connection conn = factory.newConnection();
    Channel channel = conn.createChannel();
   ) {
    channel.queueDeclare("queue", false, false, false, null);

    // 启用发布确认模式
    channel.confirmSelect();

    // 注册确认回调接口
    ConfirmCallback ackCallback = (long deliveryTag, boolean multiple) -> {
        if(multiple){
            // 多条消息被确认
            System.out.println("Multiple messages confirmed up to delivery tag: " + deliveryTag);
        }else{
            // 单条消息被确认
            System.out.println("Message confirmed with delivery tag: " + deliveryTag);
        }
    };
    ConfirmCallback nackCallback = (long deliveryTag, boolean multiple) -> {
        // 消息未被确认
        System.out.println("Message not confirmed with delivery tag: " + deliveryTag);
    };
    channel.addConfirmListener(ackCallback, nackCallback);

    try {
        // 发布消息
        for(int i = 1; i <= 5; i++) {
            byte[] body = String.valueOf(i).getBytes(StandardCharsets.UTF_8);
            channel.basicPublish("", "routingKey", null, body);
            // 等待确认
            if(channel.waitForConfirms()) {
                System.out.println("Message confirmed");
            } else {
                System.out.println("Message not confirmed");
            }
        }
    } catch(InterruptedException e) {
        e.printStackTrace();
    }
} catch(IOException | TimeoutException e) {
    e.printStackTrace();
}
```

### 消费方确认/拒绝机制

消息消费方确认机制，可以确保消息被完全处理后，才会消息队列中删除。

**消息消费方确认机制**

消费者成功处理一条消息后，向RabbitMQ发送一个确认信号，RabbitMQ将该消息标记为可清除。分为自动确认和手动确认。

自动确认：消费者收到消息后，自动发送确认信号。

示例：

```java
boolean autoAck = true;

// Push模式
channel.basicConsume("queue", autoAck, "consumerTag", deliverCallback, cancelCallback);

// Pull模式
GetResponse response = channel.basicGet("queue", autoAck);
```

手动确认：消费者收到消息并处理完毕后，手动调用`Channel#basicAck`方法

示例：

```java
boolean autoAck = false;

// Push模式
DeliverCallback deliverCallback = (String consumerTag, Delivery message) -> {
    Envelope envelope = message.getEnvelope();
    String body = new String(message.getBody(), StandardCharsets.UTF_8);
    try {
        System.out.println("Received message: " + body);
    } finally {
        channel.basicAck(envelope.getDeliveryTag(), false);
    }
};
CancelCallback cancelCallback = (String consumerTag) -> {
};
channel.basicConsume("queue", autoAck, "consumerTag", deliverCallback, cancelCallback);

// Pull模式
GetResponse response = channel.basicGet("queue", autoAck);
Envelope envelope = response.getEnvelope();
String body = new String(response.getBody(), StandardCharsets.UTF_8);
try {
    System.out.println("Received message: " + body);
}finally {
    channel.basicAck(envelope.getDeliveryTag(), false);
}
```

**消息消费方拒绝机制**

`Channel#basicReject`：1次只能拒绝1条消息，并可以选择将消息丢弃还是重新入队

```java
void basicReject(long deliveryTag, 
                 boolean requeue) throws IOException;
```

`Channel#basicNack`：1次可以拒绝1条或多条消息，并可以选择将消息丢弃还是重新入队

```java
void basicNack(long deliveryTag,
               boolean multiple, 
               boolean requeue) throws IOException;
```

参数：

- deliveryTag：消息唯一标记
- multiple：true，表示拒绝所有比deliveryTag小的多条消息；false，表示只拒绝1条消息
- requeue：true，重新入队；false，直接丢弃

### 持久化机制

持久化机制确保RabbitMQ服务器重启后，消息不会丢失。

**持久化Exchange**

```java
boolean durable = true;
channel.exchangeDeclare("x", "topic", durable);
```

**持久化Queue**

```java
boolean durable = true;
channel.queueDeclare("queue", durable, false, true, null);
```

**持久化消息**

发布消息时，设置deliveryMode属性为2，表示启用持久化

```java
AMQP.BasicProperties props = new AMQP.BasicProperties.Builder()
    .deliveryMode(2)
    .build();
channel.basicPublish("x", "routingKey", props, "hello".getBytes(StandardCharsets.UTF_8));
```

### 备用交换机

备用交换机（AE, Altemate Exchange），是在消息无法被路由到任何队列时的一种备用机制。

声明交换机时设置*alternate-exchange*属性，将未被路由的消息发送到备用交换机。

示例：

```java
ConnectionFactory factory = new ConnectionFactory();
factory.setHost("127.0.0.1");

try(Connection conn = factory.newConnection();
    Channel channel = conn.createChannel();
   ) {
    // 声明AE,并绑定一个消息队列
    channel.exchangeDeclare("x.ae", BuiltinExchangeType.FANOUT, false, false, null);
    channel.queueDeclare("q.ae", false, false, false, null);
    channel.queueBind("q.ae", "x.ae", "k.ae");

    // 声明普通交换器, 通过alternate-exchange属性指定AE, 并绑定一个消息队列
    Map<String,Object> arguments = new HashMap<>();
    arguments.put("alternate-exchange", "x.ae");
    channel.exchangeDeclare("x.normal", BuiltinExchangeType.DIRECT, false, false, arguments);
    channel.queueDeclare("q.normal", false, false, false, null);
    channel.queueBind("q.normal", "x.normal", "k.normal");

    // 发布消息到普通交换器,路由正确
    channel.basicPublish("x.normal", "k.normal", null, "hello".getBytes(StandardCharsets.UTF_8));
    // 发布消息到普通交换器,路由错误,消息将被发送到AE,进而路由到AE绑定的队列
    channel.basicPublish("x.normal", "k.bad", null, "hi".getBytes(StandardCharsets.UTF_8));
} catch(IOException | TimeoutException e) {
    e.printStackTrace();
}
```



