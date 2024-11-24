---
title: SpringCloud Gateway
createTime: 2024/11/24 15:56:15
permalink: /notes/java/wsug24lt/
---
## 参考

- 官方文档：https://docs.spring.io/spring-cloud-gateway/reference/

## 快速开始

### 1.创建Gateway服务器应用

1.添加依赖

gateway基于webflux实现，不需要添加web依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

2.创建启动引导类

```java
@SpringBootApplication
public class GatewayServerApp {
    public static void main(String[] args) {
        SpringApplication.run(GatewayServerApp.class, args);
    }
}
```

3.application配置文件

```properties
server.port=8888
spring.application.name=gateway-server

spring.cloud.gateway.enabled=true
```

### 2.定义路由

在Gateway服务器应用配置文件中，定义2个路由，分别将Gateway应用收到的请求，路由到2个网关客户端应用。使用了Path路由断言工厂。

```properties
spring.cloud.gateway.routes[0].id=gateway-client-a
spring.cloud.gateway.routes[0].uri=http://localhost:9001
spring.cloud.gateway.routes[0].predicates[0].name=Path
spring.cloud.gateway.routes[0].predicates[0].args.patterns=/gateway-client-a/**

spring.cloud.gateway.routes[1].id=gateway-client-b
spring.cloud.gateway.routes[1].uri=http://localhost:9002
spring.cloud.gateway.routes[1].predicates[0].name=Path
spring.cloud.gateway.routes[1].predicates[0].args.patterns=/gateway-client-b/**
```

### 3.验证

在2个网关客户端应用中，都定义了1个Controller方法，返回其应用名和端口号

```java
@RestController
@RequestMapping("/gateway-client-a")
public class TestController {

    @Value("${spring.application.name}") private String appName;

    @Value("${server.port}") private Integer port;

    @GetMapping("/info")
    public Map<String, Object> info() {
        return new HashMap<>() {{
            put("appName", appName);
            put("port", port);
        }};
    }
}
```

1.启动2个网关客户端应用，启动网关服务器应用

2.通过网关服务器，请求2个客户端应用的API接口

- 请求 http://localhost:8888/gateway-client-a/info

  ```json
  {
      "port": 9001,
      "appName": "gateway-client-a"
  }
  ```

- 请求 http://localhost:8888/gateway-client-b/info

  ```json
  {
      "port": 9002,
      "appName": "gateway-client-b"
  }
  ```

## 定义路由的2种方式

### 使用配置文件定义路由

在配置文件中定义路由，通过指定id和uri，以及断言工厂和过滤器集合。

指定路由断言工厂和过滤器时，可以选择使用完整参数(name和args)的形式

```properties
spring.cloud.gateway.routes[0].id=gateway-client-a
spring.cloud.gateway.routes[0].uri=http://localhost:9001

spring.cloud.gateway.routes[0].predicates[0].name=Path
spring.cloud.gateway.routes[0].predicates[0].args.patterns=/gateway-client-a/**

spring.cloud.gateway.routes[0].filters[0].name=AddRequestHeader
spring.cloud.gateway.routes[0].filters[0].args.name=X-Custom-Header
spring.cloud.gateway.routes[0].filters[0].args.value=abc
```

也可以使用简写形式

```properties
spring.cloud.gateway.routes[0].id=gateway-client-a
spring.cloud.gateway.routes[0].uri=http://localhost:9001

spring.cloud.gateway.routes[0].predicates[0]=Path=/gateway-client-a/**

spring.cloud.gateway.routes[0].filters[0]=AddRequestHeader=X-Custom-Header, abc
```

### 使用注入 `RouteLocator` Bean定义路由

通过`RouteLocatorBuilder`构建`RouteLocator`

```java
@Configuration
public class GatewayRouteConfig {

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        Function<PredicateSpec, Buildable<Route>> gatewayClientARoute = predicateSpec -> predicateSpec.path("/gateway-client-a/**")
                                                                                                      .filters(filterSpec -> filterSpec.addRequestHeader(
                                                                                                              "X-Custom-Header", "abc"))
                                                                                                      .uri("http://localhost:9001");

        Function<PredicateSpec, Buildable<Route>> gatewayClientBRoute = predicateSpec -> predicateSpec.path("/gateway-client-b/**")
                                                                                                      .uri("http://localhost:9002");
        return builder.routes()
                      .route("gateway-client-a", gatewayClientARoute)
                      .route("gateway-client-b", gatewayClientBRoute)
                      .build();
    }
}
```

## 基于服务发现的路由

Spring Cloud Gateway可以结合服务发现，实现动态路由功能。

### 1.将Gateway服务器和客户端应用，都注册到注册中心

> 以Nacos注册中心为例，Netflix Eureka, Consul, or Zookeeper同理

添加依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

配置Nacos服务发现

```properties
# nacos
spring.cloud.nacos.server-addr=127.0.0.1:8848
spring.cloud.nacos.username=nacos
spring.cloud.nacos.password=nacos

spring.cloud.nacos.discovery.server-addr=${spring.cloud.nacos.server-addr}
spring.cloud.nacos.discovery.username=${spring.cloud.nacos.username}
spring.cloud.nacos.discovery.password=${spring.cloud.nacos.password}
```

启用服务发现

```java
@SpringBootApplication
@EnableDiscoveryClient
public class GatewayServerApp {
    public static void main(String[] args) {
        SpringApplication.run(GatewayServerApp.class, args);
    }
}
```

另外，在Gateway服务器应用中，启用客户端负载均衡

*pom.xml*

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

*application.properties*

```properties
spring.cloud.loadbalancer.enabled=true
spring.cloud.loadbalancer.nacos.enabled=true
```

![](./_/20240212155154.png)

### 2.启用Gateway基于服务发现的自动路由

使用`spring.cloud.gateway.discovery.locator.enabled=true`启用自动路由，自动使用`DiscoveryClient`对每个微服务创建路由

```properties
spring.cloud.gateway.discovery.locator.enabled=true
spring.cloud.gateway.discovery.locator.lower-case-service-id=true
```

自动创建的路由，默认添加了1个Path断言和1个RewritePath过滤器：

- Path断言的*patterns*为：/serviceId/**
- RewritePath过滤器匹配 /serviceId开头的URL，然后重写URL，将开头的/serviceId去掉

以gateway-client-a为例，自动添加如下配置：

```properties
spring.cloud.gateway.discovery.locator.predicates[0].name=Path
spring.cloud.gateway.discovery.locator.predicates[0].args.patterns="'/' + serviceId + '/**'"

spring.cloud.gateway.discovery.locator.filters[0].name=RewritePath
spring.cloud.gateway.discovery.locator.filters[0].args.regexp="'/' + serviceId + '/?(?<remaining>.*)'"
spring.cloud.gateway.discovery.locator.filters[0].args.replacement="'/${remaining}'"
```

例如：

```properties
spring.cloud.gateway.routes[0].id=goods-service
spring.cloud.gateway.routes[0].order=1
spring.cloud.gateway.routes[0].uri=http://localhost:18081
spring.cloud.gateway.routes[0].predicates[0]=Path=/goods-service/**
spring.cloud.gateway.routes[0].filters[0]=RewritePath=/goods-service(?<remaining>.*), ${remaining}
```

### 3.验证

> 因为自动添加的RewritePath过滤器会去掉开头的 /serviceId，所以，请求的时候，需要多加一层 /serviceId

请求 http://localhost:8888/gateway-client-a/gateway-client-a/info

```
{
    "port": 9001,
    "appName": "gateway-client-a"
}
```

请求 http://localhost:8888/gateway-client-b/gateway-client-b/info

```
{
    "port": 9002,
    "appName": "gateway-client-b"
}
```

### 4.启用Gateway基于服务发现的自定义路由

不需要启用自动路由

```properties
spring.cloud.gateway.discovery.locator.enabled=false
```

定义路由，使用 *lb://serviceId* 作为uri的值，将对serviceId启用客户端负载均衡

```properties
spring.cloud.gateway.routes[0].id=gateway-client-a
spring.cloud.gateway.routes[0].uri=lb://gateway-client-a
spring.cloud.gateway.routes[0].predicates[0]=Path=/gateway-client-a/**

spring.cloud.gateway.routes[1].id=gateway-client-b
spring.cloud.gateway.routes[1].uri=lb://gateway-client-b
spring.cloud.gateway.routes[1].predicates[0]=Path=/gateway-client-b/**
```

## 内置路由断言工厂

路由断言用于匹配HTTP请求属性，1个路由可以有多个断言，必须同时满足。

### After

After断言接收1个参数，*datetime*（`java.time.ZonedDateTime`），匹配在给定时间之后发送的请求

```properties
spring.cloud.gateway.routes[0].predicates[1]=After=2023-01-01T23:59:59.00+08:00
```

### Before

Before断言接收1个参数，*datetime*（`java.time.ZonedDateTime`），匹配在给定时间之前发送的请求

```properties
spring.cloud.gateway.routes[0].predicates[2]=Before=2025-01-01T23:59:59.00+08:00
```

### Between

Before断言接收2个参数，*datetime1*和*datetime2*（`java.time.ZonedDateTime`），匹配在给定2个时间之间发送的请求

```properties
spring.cloud.gateway.routes[0].predicates[3]=Between=2023-01-01T23:59:59.00+08:00, 2025-01-01T23:59:59.00+08:00
```

### Cookie

Cookie断言接收2个参数，*name* 和 *regexp*，匹配Cookie包含给定名称，且值匹配给定正则表达式的请求

```properties
spring.cloud.gateway.routes[0].predicates[4]=Cookie=tag, t_\\d+
```

### Header

Header断言接收2个参数，*header* 和 *regexp*，匹配具有给定请求头，且其值匹配给定正则表达式的请求

```properties
spring.cloud.gateway.routes[0].predicates[5]=Header=X-Request-ID, \\d+
```

### Host

Host断言接收1个参数，*patterns*，匹配主机名在给定模式列表中的请求

```properties
spring.cloud.gateway.routes[0].predicates[6]=Host=localhost, **.example.com
```

### Method

Method断言接收1个参数，*methods*，匹配HTTP请求方法在给定列表中的请求

```properties
spring.cloud.gateway.routes[0].predicates[7]=Method=GET,POST,DELETE
```

### Path

Path断言接收2个参数，*patterns* 和 可选的 *matchTrailingSlash*，匹配URL路径，可以有多个，用逗号分割。如果matchTrailingSlash设置为true，表示匹配末尾的斜线

```properties
spring.cloud.gateway.routes[0].predicates[0]=Path=/gateway-client-a/**
```

### Query

Query断言接收2个参数，*param* 和可选的 *regexp*，匹配包含指定URL参数名称的请求

```properties
spring.cloud.gateway.routes[0].predicates[8]=Query=id
```

### RemoteAddr

RemoteAddr断言接收1个参数，*sources*，匹配远程地址在给定列表中的请求

```properties
spring.cloud.gateway.routes[0].predicates[9]=RemoteAddr=168.251.135.41
```

### Weight

Weight断言接收2个参数，*group* 和 *weight*。

### XForwardedRemoteAddr

## 内置路由过滤器工厂

路由过滤器可以在网关服务将HTTP请求转发到下游服务之前或之后，对请求和响应进行处理。

### AddRequestHeader

AddRequestHeader过滤器接收2个参数，*name* 和 *value*，给HTTP请求添加请求头

```properties
spring.cloud.gateway.routes[0].filters[0]=AddRequestHeader=X-Custom-Header, abc
```

### AddRequestHeadersIfNotPresent

AddRequestHeadersIfNotPresent过滤器接收多个用逗号分割的 *name:value* 参数，添加多个请求头

```properties
spring.cloud.gateway.routes[0].filters[1]=AddRequestHeadersIfNotPresent=X-Custom-Header-A:a,X-Custom-Header-B:b
```

### AddRequestParameter

AddRequestParameter过滤器接收2个参数，*name* 和 *value*，给HTTP请求添加URL参数

```properties
spring.cloud.gateway.routes[0].filters[3]=AddRequestParameter=foo,bar
```

### AddResponseHeader



### DedupeResponseHeader



### CircuitBreaker



### FallbackHeaders



### CacheRequestBody



## 内置路由全局过滤器



## 配置路由元数据



## 配置超时

### 全局超时配置

- connect-timeout，连接超时，单位ms
- response-timeout，响应超时，`java.time.Duration`类型

```properties
spring.cloud.gateway.httpclient.connect-timeout=1000
spring.cloud.gateway.httpclient.response-timeout=5s
```

### 特定路由超时配置

特定路由超时通过路由元数据配置：

- metadata.connect-timeout，连接超时，单位ms
- metadata.response-timeout，响应超时，单位ms

```properties
spring.cloud.gateway.routes[0].metadata.connect-timeout=1000
spring.cloud.gateway.routes[0].metadata.response-timeout=5000
```

## 自定义路由断言工厂

路由断言工厂都是`RoutePredicateFactory`接口的实现类，一般通过继承其抽象子类`AbstractRoutePredicateFactory`实现自定义。

### 1.定义`RoutePredicateFactory`的子类

自定义路由断言工厂类名必须以*RoutePredicateFactory*结尾。

重写`RoutePredicateFactory#apply`抽象方法：

- 获取`ServerHttpRequest`对象，在其中获取需要的请求信息
- 获取Config对象，获取配置信息
- 匹配请求信息和配置信息，返回`Predicate`，true表示匹配，false表示不匹配

```java
public class CustomRoutePredicateFactory extends AbstractRoutePredicateFactory<CustomRoutePredicateFactory.Config> {

    public CustomRoutePredicateFactory() {
        super(Config.class);
    }

    @Override
    public Predicate<ServerWebExchange> apply(Config config) {
        System.out.println("run CustomRoutePredicateFactory");
        return exchange -> {
            // 获取请求
            ServerHttpRequest request = exchange.getRequest();

            // 从请求中获取信息

            // 从Config中获取配置信息
            String attr1 = config.attr1;
            String attr2 = config.attr2;
            System.out.printf("attr1=%s, attr2=%s%n", attr1, attr2);

            // 匹配
            return true;
        };
    }

    /**
     * 配置信息
     * */
    public static class Config{
        private String attr1;
        private String attr2;

        public String getAttr1() {
            return attr1;
        }

        public Config setAttr1(String attr1) {
            this.attr1 = attr1;
            return this;
        }

        public String getAttr2() {
            return attr2;
        }

        public Config setAttr2(String attr2) {
            this.attr2 = attr2;
            return this;
        }
    }
}
```

### 2.注入自定义路由断言工厂Bean

```java
@Configuration
public class GatewayRouteConfig {

    @Bean
    public CustomRoutePredicateFactory customRoutePredicateFactory(){
        return new CustomRoutePredicateFactory();
    }
}
```

### 3.使用自定义路由断言工厂

```properties
# 使用自定义RoutePredicateFactory
spring.cloud.gateway.routes[0].predicates[1].name=Custom
spring.cloud.gateway.routes[0].predicates[1].args.attr1=foo
spring.cloud.gateway.routes[0].predicates[1].args.attr2=bar
```

## 自定义路由过滤器

路由过滤器都是`GatewayFilterFactory`接口的实现类，一般通过继承其抽线子类`AbstractGatewayFilterFactory`实现自定义。

### 1.定义`AbstractGatewayFilterFactory`的子类

自定义路由过滤器类名必须以*GatewayFilterFactory*结尾。

路由前置过滤器，处理HTTP请求

```java
public class CustomPreGatewayFilterFactory extends AbstractGatewayFilterFactory<CustomPreGatewayFilterFactory.Config> {

    public CustomPreGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        // 从Config中获取配置信息

        return (exchange, chain) -> {
            // 操作HTTP请求
            ServerHttpRequest.Builder builder = exchange.getRequest().mutate();

            return chain.filter(exchange.mutate().request(builder.build()).build());
        };
    }
    
    public static class Config{
        private String attr1;
        private String attr2;

        public String getAttr1() {
            return attr1;
        }

        public CustomPreGatewayFilterFactory.Config setAttr1(String attr1) {
            this.attr1 = attr1;
            return this;
        }

        public String getAttr2() {
            return attr2;
        }

        public CustomPreGatewayFilterFactory.Config setAttr2(String attr2) {
            this.attr2 = attr2;
            return this;
        }
    }
}
```

路由后置过滤器，处理HTTP响应

```java
public class CustomPostGatewayFilterFactory extends AbstractGatewayFilterFactory<CustomPostGatewayFilterFactory.Config> {

    public CustomPostGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        // 从Config中获取配置信息

        return (exchange, chain) -> {
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                ServerHttpResponse response = exchange.getResponse();
                // 操作HTTP响应
            }));
        };
    }

    public static class Config{
        private String attr1;
        private String attr2;

        public String getAttr1() {
            return attr1;
        }

        public CustomPreGatewayFilterFactory.Config setAttr1(String attr1) {
            this.attr1 = attr1;
            return this;
        }

        public String getAttr2() {
            return attr2;
        }

        public CustomPreGatewayFilterFactory.Config setAttr2(String attr2) {
            this.attr2 = attr2;
            return this;
        }
    }
}
```

### 2.注入自定义路由过滤器Bean

```java
@Configuration
public class GatewayRouteConfig {

    @Bean
    public CustomPreGatewayFilterFactory customPreGatewayFilterFactory(){
        return new CustomPreGatewayFilterFactory();
    }

    @Bean
    public CustomPostGatewayFilterFactory customPostGatewayFilterFactory(){
        return new CustomPostGatewayFilterFactory();
    }
}
```

### 3.使用自定义路由过滤器

```properties
# 使用自定义GatewayFilterFactory
spring.cloud.gateway.routes[0].filters[0].name=CustomPre
spring.cloud.gateway.routes[0].filters[0].args.attr1=foo
spring.cloud.gateway.routes[0].filters[0].args.attr2=bar
```

## 自定义路由全局过滤器

全局过滤器都是`GlobaFilter`接口的实现类。

```java
public class CustomGlobalFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            ServerHttpResponse response = exchange.getResponse();
        }));
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
```

## 动态路由



## 利用网关进行权限校验

