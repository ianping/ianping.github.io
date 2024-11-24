---
title: Redis客户端
createTime: 2024/11/24 15:56:14
permalink: /notes/database/gprnv62c/
---
## Jedis

添加依赖

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>5.1.0</version>
</dependency>
```

### 获取客户端

直接创建

```java
private static final String HOST = "172.30.149.49";
private static final Integer PORT = 6379;
private static final String USER = null;
private static final String PASSWORD = null;

public static Jedis newClient() {
    JedisClientConfig config = DefaultJedisClientConfig.builder()
        .user(USER)
        .password(PASSWORD)
        .database(0)
        .timeoutMillis(2000)
        .build();
    return new Jedis(HOST, PORT, config);
}
```

使用连接池

```java
private static final String HOST = "172.30.149.49";
private static final Integer PORT = 6379;
private static final String USER = null;
private static final String PASSWORD = null;

private static final JedisPool JEDIS_POOL;

static {
    GenericObjectPoolConfig<Jedis> poolConfig = new GenericObjectPoolConfig<>();
    poolConfig.setMaxTotal(8);
    poolConfig.setMaxIdle(8);
    poolConfig.setMinIdle(0);
    JEDIS_POOL = new JedisPool(poolConfig, HOST, PORT, USER, PASSWORD);
}

public static Jedis getClient() {
    return JEDIS_POOL.getResource();
}
```

### 使用Pipeline

```java
// 连接Redis服务器
Jedis client = RedisClient.newClient();

// 创建Pipeline
Pipeline pipeline = client.pipelined();

// 打包命令
for(int i = 0; i < 10; i++) {
    pipeline.set("num:" + i, String.valueOf(i));
}

// 发送命令
// pipeline.sync(); // 同步、无返回值
List<Object> resultList = pipeline.syncAndReturnAll(); // 同步、有返回值
for(Object result : resultList) {
    System.out.println(result);
}
```

