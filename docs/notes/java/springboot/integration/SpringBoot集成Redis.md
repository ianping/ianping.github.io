---
title: SpringBoot集成Redis
createTime: 2024/11/24 15:56:15
permalink: /notes/java/m48i31a4/
---
版本信息：

+ redis 7.2.4
+ java 17
+ springboot 3.2.2

## 快速开始

### 添加starter依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

+ 默认使用lettuce客户端
+ 自动配置会注入3个Bean：`RedisConnectionFactory`，`RedisTemplate`，`StringRedisTemplate`
+ 如果添加了*commons-pool2*，则自动启用连接池

### 基础配置

以下配置都是默认的，可选

```properties
# lettuce,jedis
spring.data.redis.client-type=lettuce
spring.data.redis.host=127.0.0.1
spring.data.redis.port=6379
spring.data.redis.username=
spring.data.redis.password=
spring.data.redis.database=0
```

### 使用`RedisTemplate`和`StringRedisTemplate`

使用自动注入的`StringRedisTemplate`，只能操作string键值对

```java
@Resource
private StringRedisTemplate stringRedisTemplate;

@Test
public void testStringRedisTemplate(){
    ValueOperations<String, String> valueOps = stringRedisTemplate.opsForValue();
    valueOps.set("user:alice", "0001");
    String alice = valueOps.get("user:alice");
    System.out.println(alice);
}
```

使用自动注入的`RedisTemplate`，可以操作任何类型的键值对

```java
@Resource
private RedisTemplate<Object, Object> redisTemplate;

@Test
public void testRedisTemplate(){
    // 操作string
    ValueOperations<Object, Object> valueOps = redisTemplate.opsForValue();
    valueOps.set("user:alice", "0001");
    Object alice = valueOps.get("user:alice");
    System.out.println(alice);

    // 操作list
    ListOperations<Object, Object> listOps = redisTemplate.opsForList();
    listOps.leftPushAll("animals", "dog", "cat", "snake");
    List<Object> animals = listOps.range("animals", 0, -1);
    System.out.println(animals);

    // 操作set
    SetOperations<Object, Object> setOps = redisTemplate.opsForSet();

    // 操作hash
    HashOperations<Object, Object, Object> hashOps = redisTemplate.opsForHash();

    // 操作zset
    ZSetOperations<Object, Object> zsetOps = redisTemplate.opsForZSet();
}
```

## 设置键值序列化器

> 参考`StringRedisTemplate`

自动注入的`RedisTemplate`默认使用Java原生序列化机制，支持的类型不够全面，且存在安全隐患。推荐自定义RedisTemplate，设置键值序列化器。

+ 对于key，使用`StringRedisSerializer`，默认提供了工具方法`RedisSerializer#string`
+ 对于value，使用`Jackson2JsonRedisSerializer`

```java
@Bean
public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory){
    RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
    redisTemplate.setConnectionFactory(connectionFactory);
    
    RedisSerializer<String> stringRedisSerializer = RedisSerializer.string();
    RedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<Object>(Object.class);
    // 设置键值序列化器
    redisTemplate.setKeySerializer(stringRedisSerializer);
    redisTemplate.setHashKeySerializer(stringRedisSerializer);
    redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);
    redisTemplate.setHashValueSerializer(jackson2JsonRedisSerializer);

    redisTemplate.afterPropertiesSet();
    return redisTemplate;
}
```

## 选择redis客户端

### lettuce

*spring-boot-starter-data-redis* 默认使用lettuce

```xml
<dependency>
    <groupId>io.lettuce</groupId>
    <artifactId>lettuce-core</artifactId>
</dependency>
```

### jedis

排除lettuce依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
    <exclusions>
        <exclusion>
            <groupId>io.lettuce</groupId>
            <artifactId>lettuce-core</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

添加jedis

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
</dependency>
```

在配置文件中，声明要使用的客户类型

```properties
# 默认lettuce
spring.data.redis.client-type=jedis
```

## 使用连接池

添加依赖

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```

在配置文件中开启连接池

```properties
spring.data.redis.lettuce.pool.enabled=true
# 默认配置
spring.data.redis.lettuce.pool.enabled=true
spring.data.redis.lettuce.pool.max-active=8
spring.data.redis.lettuce.pool.min-idle=0
spring.data.redis.lettuce.pool.max-idle=8
spring.data.redis.lettuce.pool.max-wait=-1ms
spring.data.redis.lettuce.pool.time-between-eviction-runs=
```

## 开启事务支持

`RedisTemplate`默认不开启事务支持，如果需要支持`@Transactional`，需要手动开启

```java
redisTemplate.setEnableTransactionSupport(false);
```

