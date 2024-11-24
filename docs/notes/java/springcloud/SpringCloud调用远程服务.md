---
title: SpringCloud调用远程服务
createTime: 2024/11/24 15:56:15
permalink: /notes/java/o2iu7utx/
---
## 参考

- https://spring.io/projects/spring-cloud-openfeign
- https://docs.spring.io/spring-cloud-commons/reference/spring-cloud-commons/loadbalancer.html
- https://cloud.spring.io/spring-cloud-netflix/multi/multi_spring-cloud-ribbon.html

## 通过DiscoveryClient发现服务, 通过普通的RestTemplate调用远程服务

启用服务发现客户端

```java
@SpringBootApplication
@EnableDiscoveryClient
public class EurekaClientAApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaClientAApplication.class, args);
    }
}
```

使用普通RestTemplate调用远程服务

```java
private final String EUREKA_CLIENT_B = "eureka-client-b";

@Resource
private DiscoveryClient discoveryClient;
private final RestTemplate restTemplate = new RestTemplate();

@GetMapping("/foo")
public String foo(){
    List<ServiceInstance> instances = discoveryClient.getInstances(EUREKA_CLIENT_B);
    if (!CollectionUtils.isEmpty(instances)){
        ServiceInstance serviceInstance = instances.get(0);
        String url = String.format("%s%s", serviceInstance.getUri().toString() ,"/foo");
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
        if (response.getStatusCode() == HttpStatus.OK){
            return response.getBody();
        }
    }
    return "调用远程服务失败";
}
```

## 使用启用了客户端负载均衡的RestTemplate调用远程服务

添加依赖（可选，*spring-cloud-starter-netflix-eureka-client* 默认引入了这个依赖）

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

创建使用 `@LoadBalanced` 注解的 `RestTemplate` Bean

```java
@Configuration
public class RestTemplateConfiguration {

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

使用远程服务ID代替物理地址，调用远程服务

```java
private final String EUREKA_CLIENT_B = "eureka-client-b";

@Resource
private RestTemplate restTemplate;

@GetMapping("/foo")
public String foo(){
    String url = "http://{serviceId}/foo";
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class, EUREKA_CLIENT_B);
    if (response.getStatusCode() == HttpStatus.OK){
        return response.getBody();
    }
    return "调用远程服务失败";
}
```

## 使用SpringCloud OpenFeign调用远程服务

### 快速开始

1.添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

2.使用注解`@EnableFeignClients`，启用OpenFeign

```java
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class EurekaConsumerCApp {
    public static void main(String[] args) {
        SpringApplication.run(EurekaConsumerCApp.class, args);
    }
}
```

3.定义Feign客户端接口，使用注解`@FeignClient`

`@FeignClient`注解的接口，将被动态创建其Bean实例。注意，Feign客户端接口上，不支持类级别的`@RequestMapping`注解。

```java
@FeignClient(name = "eureka-provider-a")
public interface TestClient {

    @GetMapping("/provider-a/hello")
    String hello(@RequestParam("name") String name);
}
```

4.调用远程服务

```java
@RestController
@RequestMapping("/consumer-c")
public class TestController {

    @Resource
    private TestClient testClient;

    @GetMapping("/hello")
    public String hello(@RequestParam(required = false) String name){
        return testClient.hello(name);
    }
}
```

### 创建Feign客户端Bean的时机

默认情况下，被`@FeignClient`标记的接口，在Spring容器启动的时候，饥饿加载，也支持懒加载。使用下面的配置开启

```properties
spring.cloud.openfeign.lazy-attributes-resolution=true
```

### 对请求和响应进行压缩

```properties
spring.cloud.openfeign.compression.request.enabled=true
spring.cloud.openfeign.compression.request.mime-types=text/xml, application/xml, application/json
spring.cloud.openfeign.compression.request.min-request-size=2048

spring.cloud.openfeign.compression.response.enabled=true
```

### 配置OpenFeign

配置OpenFeign有2种方式：

- Java配置类
- 以 *spring.cloud.openfeign.client.config* 开头的配置项

**使用Java配置类**

1.定义配置类

注意，不要使用`@Configuration`注解

```
public class DefaultFeignClientConfig {

    @Bean
    public Logger.Level defaultLoggerLevel(){
        return Logger.Level.BASIC;
    }
}
```

2.在`@EnableFeignClients`注解中，使用`defaultConfiguration`属性将其指定为全局默认配置

```java
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(defaultConfiguration = DefaultFeignClientConfig.class)
public class EurekaConsumerCApp {
    public static void main(String[] args) {
        SpringApplication.run(EurekaConsumerCApp.class, args);
    }
}
```

或者在`@FeignClient`注解中，使用`configuration`属性将其指定为单个Feign客户端的配置

```java
@FeignClient(name = "eureka-provider-a", configuration = EurekaProviderAFeignClientConfig.class)
public interface TestClient {
    
}
```

**使用spring.cloud.openfeign.client.config开头的配置项**

```properties
# 默认配置
spring.cloud.openfeign.client.default-config=default
spring.cloud.openfeign.client.config.default.logger-level=basic
# 单个Feign客户端的配置
spring.cloud.openfeign.client.config.eureka-provider-a.logger-level=full
```

### 配置请求超时控制

配置默认超时

```properties
spring.cloud.openfeign.client.default-config=default
spring.cloud.openfeign.client.config.default.connect-timeout=1000
spring.cloud.openfeign.client.config.default.read-timeout=2000
```

配置单个Feign客户端超时

```properties
spring.cloud.openfeign.client.config.eureka-provider-a.connect-timeout=5000
spring.cloud.openfeign.client.config.eureka-provider-a.read-timeout=5000
```

### 配置Feign日志

Feign日志只有在 *DEBUG* 级别才会输出

```properties
logging.group.oepn-feign=me.lyp.sc.eureka.consumer.c.clients
logging.level.oepn-feign=debug
```

然后，配置`Logger.Level`对象，OpenFeign支持4种Level：

- none，不输出任何信息，默认值
- basic，输出请求方法、URL，响应状态码，执行时间
- headers，输出basic级别的日志，以及请求头和响应头信息
- full，输出headers级别的日志，以及请求体和响应体信息

配置默认日志输出级别

```properties
spring.cloud.openfeign.client.config.default.logger-level=basic
```

配置特定服务提供者日志输出级别

```properties
spring.cloud.openfeign.client.config.eureka-provider-a.logger-level=full
```

### 支持Spring Cloud LoadBalancer

略

### 与断路器结合实现后备模式

1.开启断路器支持

Spring Cloud CircuitBreaker

```properties
spring.cloud.openfeign.circuitbreaker.enabled=true
spring.cloud.openfeign.circuitbreaker.alphanumeric-ids.enabled=true
```

Netflix Hystrix

```properties
feign.hystrix.enabled=true
```

Alibaba Sentinel

```properties
feign.sentinel.enabled=true
```

2.使用`fallback`属性指定后备处理器类

```java
@FeignClient(name = "eureka-provider-a", fallback = TestClientFallback.class)
public interface TestClient {

    @GetMapping("/provider-a/hello")
    String hello(@RequestParam("name") String name);
}
```

后备处理器类必须实现Feign客户端接口，并且注入到Spring容器中

```java
@Component
public class TestClientFallback implements TestClient{
    @Override
    public String hello(String name) {
        return "Fallback";
    }
}
```

3.使用`fallbackFactory`属性指定后被处理器工厂类

使用`fallbackFactory`属性的方式，可以获取到导致Fallback的异常

```java
@FeignClient(name = "eureka-provider-a", fallbackFactory = TestClientFallbackFactory.class)
public interface TestClient {

    @GetMapping("/provider-a/hello")
    String hello(@RequestParam("name") String name);
}
```

后备处理器工厂类实现`FallbackFactory<T>`接口，接收泛型参数类型为后备处理器类。

```java
@Component
public class TestClientFallbackFactory implements FallbackFactory<TestClientFallback> {
    @Override
    public TestClientFallback create(Throwable cause) {
        return new TestClientFallback(cause);
    }
}

public class TestClientFallback implements TestClient{
    private Throwable cause;

    public TestClientFallback(Throwable cause) {
        this.cause = cause;
    }

    @Override
    public String hello(String name) {
        return cause.toString();
    }
}
```

### 自定义OpenFeign，使用HTTP连接池



## 使用Spring Cloud LoadBalancer进行客户端负载均衡

### 快速开始

1.添加依赖

当使用以下服务发现客户端时，自动包含了*spring-cloud-starter-loadbalancer*，无需手动添加依赖：

- spring-cloud-starter-netflix-eureka-client
- spring-cloud-starter-consul-discovery
- spring-cloud-starter-zookeeper-discovery

当使用nacos服务发现客户端 *spring-cloud-starter-alibaba-nacos-discovery* 时，为包含负载均衡库，需要手动添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

2.开启负载均衡

如果使用`RestTemplate`调用服务，需要用`@LoadBalanced`注解，然后使用服务ID进行服务调用。默认使用轮询策略进行负载均衡。

```java
@Bean
@LoadBalanced
public RestTemplate restTemplate(){
    return new RestTemplate();
}
```

如果使用OpenFeign，默认开启负载均衡

### 负载均衡策略

LoadBalancer负载均衡策略类都是`org.springframework.cloud.client.loadbalancer.reactive.ReactiveLoadBalancer`的实现类，内置下面几种负载均衡策略类：

- `RoundRobinLoadBalancer`，轮询策略，默认
- `RandomLoadBalancer，随机策略`

另外，如果使用`spring-cloud-starter-alibaba-nacos-discovery`进行服务发现，其提供了一个`NacosLoadBalancer`，使用下面的配置启用

```properties
spring.cloud.loadbalancer.nacos.enabled=true
```

消费者可以针对特定的服务提供者设置负载均衡策略。

首先，定义类，注入负载均衡策略类Bean对象。

注意，不要添加`@Configuration`，否则，LoadBalancer会将其作为所有服务提供者的负载均衡策略。

```java
package me.lyp.sc.eureka.consumer.a.loadbalancer;

public class EurekaProviderALoadBalancer {
    @Bean
    public ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(Environment environment, 
                                                                   LoadBalancerClientFactory loadBalancerClientFactory) {
        String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
        return new RandomLoadBalancer(loadBalancerClientFactory.getLazyProvider(name, ServiceInstanceListSupplier.class), name);
    }
}
```

然后，使用`@LoadBalancerClients`或`@LoadBalancerClient`定义针对特定服务提供者的负载均衡策略配置类

```java
package me.lyp.sc.eureka.consumer.a;

@SpringBootApplication
@EnableDiscoveryClient
@LoadBalancerClients({@LoadBalancerClient(name = "eureka-provider-a", configuration = EurekaProviderALoadBalancer.class)})
public class EurekaConsumerAApp {

    public static void main(String[] args) {
        SpringApplication.run(EurekaConsumerAApp.class, args);
    }
}
```

## 使用Netflix Ribbon进行客户端负载均衡

在新版的SpringCloud中，Ribbon已被移除，被LoadBalancer替代。Ribbon只在老版本的项目中使用。

### 快速开始

版本信息

```xml
<properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>

    <spring-boot.version>2.3.12.RELEASE</spring-boot.version>
    <spring-cloud.version>Hoxton.SR12</spring-cloud.version>
</properties>
```

1.添加依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
    </dependency>
</dependencies>
```

2.开启负载均衡

在`RestTemplate`Bean上使用`@LoadBalanced`注解开启负载均衡，然后使用服务ID调用远程服务。

### 负载均衡策略

Ribbon负载均衡策略都是`com.netflix.loadbalancer.IRule`接口的实现类，内置了下面几种负载均衡策略类：

- `RoundRobinRule`，轮询策略，默认
- `WeightedResponseTimeRule`，基于响应时间动态分配权重策略，平均响应时间越小，权重越高
- `ResponseTimeWeightedRule`
- `RandomRule`，随机策略
- `RetryRule`，重试策略，请求失败会自动进行重试，最多重试预定义的此时（默认3次）
- `BestAvailableRule`，最小并发请求数策略
- `ZoneAvoidanceRule`，区域策略，优先选择处于同区域的实例
- `AvailabilityFilteringRule`，可用性过滤策略，先过滤掉非健康的实例，再选择并发连接数较小的实例

消费者可以针对特定的服务提供者设置负载均衡策略，有2种方式：

1. 在配置文件中设置

   ```properties
   eureka-provider-a.ribbon.NFLoadBalancerRuleClassName=com.netflix.loadbalancer.RandomRule
   eureka-provider-b.ribbon.NFLoadBalancerRuleClassName=com.netflix.loadbalancer.BestAvailableRule
   ```

2. 使用注解`@RibbonClient`或`@RibbonClients`

   首先定义类，创建`IRule`对象。

   注意，必须使用`@Configuration`，但是，不能在`@ComponentScan`扫描路径下，否则，Ribbon会将其作为所有服务提供者的负载均衡策略。
   
   ```java
   package me.lyp.sc.eureka.consumer.loadbalancer;
   
   @Configuration
   public class EurekaProviderARule {
   
       @Bean
       public IRule randomRule(){
           return new RandomRule();
       }
   }
   ```
   
   然后，使用注解`@RibbonClient`或`@RibbonClients`，定义针对特定服务提供者的负载均衡策略
   
   ```java
   package me.lyp.sc.eureka.consumer.b;
   
   @SpringBootApplication
   @EnableDiscoveryClient
   @RibbonClients({@RibbonClient(name = "eureka-provider-a", configuration = EurekaProviderARule.class)})
   public class EurekaConsumerBApp {
       public static void main(String[] args) {
           SpringApplication.run(EurekaConsumerBApp.class, args);
       }
   }
   ```
   
   

