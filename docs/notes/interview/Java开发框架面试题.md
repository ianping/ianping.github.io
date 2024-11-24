---
title: Java开发框架面试题
createTime: 2024/11/24 15:56:15
permalink: /article/1u98nkxz/
---
## JavaWeb

### JavaWeb 3大核心组件

Servlet、Filter、Listener

## MyBatis

### mybatis的优缺点

优点：

- sql语句与代码解耦
- 自动映射结果集
- 支持动态sql

缺点：

- 数据库移植性不好

### `#{}` 和 `${}`的区别

`#{}`是预编译sql，`${}`是字符串拼接sql

### MyBatis插件原理

```java
@Intercepts({@Signature(type = StatementHandler.class, method = "prepare", args = {})})
public class MyPlugin implements Interceptor {
    private Properties props = new Properties();

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        System.out.println("执行sql之前的逻辑");
        StatementHandler statementHandler = (StatementHandler) invocation.getTarget();
        BoundSql boundSql = statementHandler.getBoundSql();
        Object parameterObject = boundSql.getParameterObject();

        Object result = invocation.proceed();

        System.out.println("执行sql之后的逻辑");
        return result;
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {
        this.props = properties;
    }
}
```

## JPA



## Spring、SpringBoot

### 对Spring核心IOC和AOP的理解

IOC，控制反转

AOP，面向切面编程

### SpringMVC工作流程

关键类：`DispatcherServlet`，前端控制器

在接收到客户端请求后，执行以下步骤：

1. 在前端控制器接收到请求之前，执行`Filter`，对数据进行过滤和处理
2. 前端控制器调用处理器映射器，根据请求找到对应的处理器，以及相关的处理器拦截器，封装为`HandlerExecutionChain`，返回给前端控制器
3. 前端控制器调用处理器适配器，找到对应的控制器并执行
4. 执行Handler，返回ModelAndView
5. 调用ViewResolver解析视图，将ModelAndView中的数据填充到视图中
6. 返回视图给客户端

### SpringMVC的9大组件

1. `HandlerMapping`：处理器映射器，根据HTTP请求（请求方法、URL、参数等）匹配处理器，并将其与相关的拦截器封装为`HandlerExecutionChain`。

2. `HandlerAdapter`：处理器适配器
3. `HandlerExceptionResolver`：处理器异常解析器
4. `ViewResolver`：视图解析器
5. `RequestToViewNameTranslator`：在控制器方法中没有返回视图逻辑名称的时候，从请求对象中解析出一个逻辑视图名称。
6. `LocaleResolver`：用于国际化，根据请求头中的`Accept-Language`参数，返回不同的视图
7. `ThemeResolver`：主题解析器
8. `MultipartResolver`：解析*multipart/form-data*类型的请求参数
9. `FlashMapManager`

### Spring中的Bean的作用域和生命周期

作用域：默认为单例的，包括singleton、prototype、Session、Request、ServletContext、webSocket。

生命周期：

1. 解析配置，创建`BeanDefinition`
2. Bean实例化，`BeanFactory`的实现类会根据`BeanDefinition`创建Bean实例
3. 属性赋值
4. Bean初始化，通过`InitializingBean#afterPropertiesSet()`方法，或者`@PostConstruct`注解的方法，或者`@Bean`的`init-method`属性设置
5. Bean使用
6. Bean销毁，通过`DisposableBean#destroy()`方法，或者`@PreDestroy`注解的方法，或者`@Bean`的`destroy-method`属性设置

### Spring Bean的3级缓存机制以及循环依赖问题

```java
public class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry {
	/** Cache of singleton objects: bean name to bean instance. */
	private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

    /** Cache of early singleton objects: bean name to bean instance. */
	private final Map<String, Object> earlySingletonObjects = new ConcurrentHashMap<>(16);
    
	/** Cache of singleton factories: bean name to ObjectFactory. */
	private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);
}
```

- singletonObjects：一级缓存，存放已经完成初始化的Bean实例
- earlySingletonObjects：二级缓存，存放已创建、还未完全初始化的Bean实例。由于Bean依赖其它Bean而无法完成初始化时，会存放到二级缓存中
- singletonFactories：三级缓存，存放Bean工厂对象。

循环依赖问题的解决流程：

1. A依赖B，B也依赖A，Spring容器会首先尝试创建A
2. 创建A的过程中，会将其ObjectFactory放到三级缓存中
3. 发现A依赖B，容器会在缓存中查找B，发现B未创建，会开始创建B
4. **在创建B的过程中，发现B依赖A，Spring会从三级缓存中获取A的ObjectFactory实例，创建一个尚未完全初始化的A实例，将其放到二级缓存中。同时，从三级缓存中移除A的ObjectFactory实例**
5. B完成初始化，放到一级缓存中，至此，B创建完毕
6. 回到初始化A的流程，从二级缓存中获取未完全初始化的A实例，从一级缓存中获取初始化完成的B，一起完成A的初始化，将A放到一级缓存中。至此A也创建完毕

**循环依赖解决的关键是，先创建对象，然后初始化赋值。因此，不能使用构造器注入，而要使用Setter方法注入。**

### Spring中单例Bean是线程安全的吗？

### Spring事务传播机制

```java
public enum Propagation {

	REQUIRED(TransactionDefinition.PROPAGATION_REQUIRED),

	SUPPORTS(TransactionDefinition.PROPAGATION_SUPPORTS),

	MANDATORY(TransactionDefinition.PROPAGATION_MANDATORY),

	REQUIRES_NEW(TransactionDefinition.PROPAGATION_REQUIRES_NEW),

	NOT_SUPPORTED(TransactionDefinition.PROPAGATION_NOT_SUPPORTED),

	NEVER(TransactionDefinition.PROPAGATION_NEVER),

	NESTED(TransactionDefinition.PROPAGATION_NESTED);
}
```

### Spring事务隔离级别

```java
public enum Isolation {

	DEFAULT(TransactionDefinition.ISOLATION_DEFAULT),

	READ_UNCOMMITTED(TransactionDefinition.ISOLATION_READ_UNCOMMITTED),

	READ_COMMITTED(TransactionDefinition.ISOLATION_READ_COMMITTED),

	REPEATABLE_READ(TransactionDefinition.ISOLATION_REPEATABLE_READ),

	SERIALIZABLE(TransactionDefinition.ISOLATION_SERIALIZABLE);
}
```

### Spring编程式事务

3个核心接口：`TransactionManager`、`TransactionDefinition`、`TransactionStatus`

```java
// 创建TransactionDefinition
DefaultTransactionDefinition txDef = new DefaultTransactionDefinition();
txDef.setName("myTx");
txDef.setIsolationLevel(TransactionDefinition.ISOLATION_DEFAULT);
txDef.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
txDef.setTimeout(TransactionDefinition.TIMEOUT_DEFAULT);
txDef.setReadOnly(false);

// 开始事务
TransactionStatus txStatus = txManager.getTransaction(txDef);
try {
    // ...
    txManager.commit(txStatus);
} catch(Exception ex) {
    txManager.rollback(txStatus);
    throw ex;
}
```

### Spring事务实现原理

编程式事务手动控制事务的开启、提交、回滚。

声明式事务基于AOP实现，在执行业务逻辑前关闭事务自动提交功能，执行成功就提交，失败就回滚。

### Spring事务失效的情况

- 不被Spring容器管理的Bean
- `@Transactional`注解的方法访问修饰符必须是public
- 数据库本身不支持的事务隔离级别
- 异常被忽略（被捕获，或者不在rollbackFor参数列表中，或者在noRollbackFor参数列表中，事务不会回滚）

### Spring中使用了哪些设计模式

单例模式：单例Bean

工厂模式：BeanFactory、WebServerFactory

模板方法模式：RestTemplate、JdbcTemplate

动态代理模式：AOP

适配器模式：HandlerAdapter

装饰器模式：BeanWrapper

观察者模式：Spring中的事件监听机制

建造者模式：Builder

### Spring、SpringMVC和SpringBoot的关系

SpringBoot是一个脚手架，在Spring IOC容器和AOP的基础上，实现了自动配置。通过特定场景的starter，自动管理依赖，并自动配置。

### 对SpringBoot的核心特性的理解

包括嵌入式Web服务器、自动配置、starter启动器、外部化配置、devtools、actuator、cli等。

### SpringBoot核心注解

- `@SpringBootApplication`：是一个组合注解，包括`@SpringBootConfiguration`、`@EnableAutoConfiguration`、`@ComponentScan`
- `@Conditional`：条件化配置注解，需要一个`Condition`参数。SpringBoot预定义了一些条件化注解，例如：`@ConditionalOnClass`、`@ConditionalOnBean`等

### SpringBoot自动配置的实现原理

1.`@SpringBootApplication`包含了`@EnableAutoConfiguration`注解，启用自动配置功能；

2.`@EnableAutoConfiguration`包含了`@Import(AutoConfigurationImportSelector.class)`注解，通过`ImportSelector`动态选择要导入Spring容器的配置类

3.读取*META-INF*下的配置信息

4.读取`@AutoConfiguration`配置类

5.使用条件化装配注入Bean

## SpringSecurity



## 微服务

### CAP理论和BASE理论

CAP：Consistency（一致性）、Availability（可用性）和 Partition tolerance（分区容错性）。

BASE：基本可用（Basically Available）、软状态（Soft State）和最终一致性（Eventual Consistency）。

### RPC和RMI

### 分布式架构中的Session共享方案

### 分布式ID实现方法

### 分布式锁解决方案

### 分布式事务解决方案
