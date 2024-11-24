---
title: SpringBoot使用事务
createTime: 2024/11/24 15:56:15
permalink: /notes/java/qgejxsiy/
---
## 快速开始

### 1.添加依赖

使用Spring事务需要添加`spring-tx`，一般只需要引入jdbc相关的依赖，就会自动包含它。

这里使用`spring-boot-starter-data-jpa`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

### 2.启用事务支持

SpringBoot检测到`spring-tx`相关依赖时，默认自动启用事务支持。

也可显式的开启，在配置类上使用`@EnableTransactionManagement`注解

```java
@SpringBootApplication
@EnableTransactionManagement
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class,args);
    }
}
```

### 3.开启事务

在涉及数据库操作的业务方法上，使用`@Transactional`注解

```java
/**
 * 钱包充值
 * */
@Transactional
public Wallet recharge(RechargeVO vo){
    // 创建钱包交易记录...
    
    // 更新钱包余额...
}
```

## Spring事务抽象模型

### `TransactionManager`

Spring事务的核心是事务策略，是通过事务管理器`TransactionManager`接口定义的，它的2个子接口：`PlatformTransactionManager` 和 `ReactiveTransactionManager`，分别用于传统的命令式编程和新的响应式编程中。

以`PlatformTransactionManager`为例，接口定义如下：

```java
public interface PlatformTransactionManager extends TransactionManager {
    /**
     * 获取事务状态
     */
    TransactionStatus getTransaction(@Nullable TransactionDefinition definition) throws TransactionException;
    
    /**
     * 提交事务
     */
	void commit(TransactionStatus status) throws TransactionException;
    
    /**
     * 回滚事务
     */
    void rollback(TransactionStatus status) throws TransactionException;
}
```

### `TransactionDefinition`

`TransactionDefinition`接口用于定义事务：

- 事务传播行为
- 事务隔离级别
- 事务超时
- 是否为只读事务

### `TransactionStatus`

`TransactionStatus`接口用于定义事务的状态。

## 声明式事务管理

Spring声明式事务是基于AOP实现的。

使用`@Transactional`注解声明（也支持在基于xml的配置中，使用`tx`命名空间的相关标签进行声明）。

这个注解可用在类或方法上，必须是`public`方法。默认属性如下：

- `propagation`，事务传播行为，默认`Propagation.REQUIRED`
- `isolation`，事务隔离级别，默认为基础数据库的默认隔离级别
- `readOnly`，是否为只读事务，默认false，读写
- `timeout`，事务超时时间，默认为-1，表示不设置超时
- `rollbackFor`，导致回滚的异常，默认回滚`RuntimeException`和`Error`

### Spring事务管理器

一般情况下，Spring应用只需要使用默认的事务管理器。

`@Transactional`注解的`transactionManager`属性指定具体事务管理器

```java
@Transactional(transactionManager = "txManager")
public Wallet recharge(RechargeVO vo){

}
```

### Spring事务传播行为

Spring中的事务传播行为是指一个事务方法被另一个事务方法调用时，如何处理事务的传播行为。

`@Transactional`注解的`propagation`属性指定事务传播行为，其值在`Propagation`枚举类中定义，包括：

- `REQUIRED`，默认行为。如果当前存在事务，就在该事务中执行；否则，新建事务
- `SUPPORTS`，如果当前存在事务，就在该事务中执行；否则，不使用事务
- `MANDATORY`，如果当前存在事务，就在该事务中执行；否则，抛出异常
- `REQUIRES_NEW`，始终开启新的事务；如果当前已存在事务，将其挂起
- `NOT_SUPPORTED`，始终以非事务方式执行；如果当前已存在事务，将其挂起
- `NEVER`，始终以非事务方式执行；如果当前已存在事务，抛出异常
- `NESTED`，如果当前存在事务，则新建1个嵌套事务，它是当前事务的一部分；否则，新建1个事务

```java
@Transactional(propagation = Propagation.REQUIRED)
public Wallet recharge(RechargeVO vo){

}
```

### Spring事务隔离级别

Spring支持标准数据库事务隔离级别。

`@Transactional`注解的`isolation`属性指定事务隔离级别，其值在`Isolation`枚举类中定义，包括：

- `DEFAULT`，默认值。数据库默认隔离级别，通常是`READ_COMMITTED`，MySQL是`REPEATABLE_READ`
- `READ_UNCOMMITTED`，读未提交
- `READ_COMMITTED`，读已提交
- `REPEATABLE_READ`，可重复读
- `SERIALIZABLE`，串行化

```java
@Transactional(isolation = Isolation.DEFAULT)
public Wallet recharge(RechargeVO vo){

}
```

### Spring事务超时

`@Transactional` 注解的 `timeout` 属性用于指定事务的超时时间，即事务允许执行的最长时间。如果事务在指定的时间内未能完成，则会被自动回滚。

单位秒，默认为-1，表示不设置超时，直到方法执行完毕或者手动回滚。

```java
@Transactional(timeout = -1)
public Wallet recharge(RechargeVO vo){

}
```

### Spring事务回滚

`@Transactional`注解的`rollbackFor`和`noRollbackFor`属性指定方法抛出特定异常时的回滚规则。

默认`RuntimeException`和`Error`异常，或者事务超时会导致事务回滚。

```java
@Transactional(rollbackFor = {RuntimeException.class, Error.class}, noRollbackFor = {})
public Wallet recharge(RechargeVO vo) {
    
}
```

### Spring只读事务

`@Transactional`注解的`readOnly`属性用于指定事务是否为只读。默认false

```java
@Transactional(readOnly = false)
public Wallet recharge(RechargeVO vo) {
    
}
```

## 编程式事务管理

### 直接使用`TransactionManager`

```java
// 获取TransactionManager    
private final PlatformTransactionManager txManager;

@Autowired
public WalletService(PlatformTransactionManager txManager) {
    this.txManager = txManager;
}

public Wallet recharge(RechargeVO vo) {
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
        
        // 提交事务
        txManager.commit(txStatus);
    } catch(Exception ex){
        // 回滚事务
        txManager.rollback(txStatus);
        throw ex;
    }
}
```

### 使用`TransactionTemplate`

```java
// 获取TransactionTemplate对象
private final TransactionTemplate txTemplate;

@Autowired
public WalletService(PlatformTransactionManager txManager) {
    this.txTemplate = new TransactionTemplate(txManager);
    
    this.txTemplate.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
    this.txTemplate.setIsolationLevel(TransactionDefinition.ISOLATION_DEFAULT);
    this.txTemplate.setTimeout(TransactionDefinition.TIMEOUT_DEFAULT);
    this.txTemplate.setReadOnly(false);
}

public Wallet recharge(RechargeVO vo) {
    // 有返回值时，创建TransactionCallback接口的对象
    Wallet wallet = this.txTemplate.execute(new TransactionCallback<Wallet>() {
        @Override
        public Wallet doInTransaction(TransactionStatus status) {
            try {
                // ...
            }catch(Throwable ex){
                status.setRollbackOnly();
            }
            return null;
        }
    });
    return wallet;
	
    // 无返回值时，创建TransactionCallbackWithoutResult接口的对象
    /*
    this.txTemplate.execute(new TransactionCallbackWithoutResult() {
        @Override
        protected void doInTransactionWithoutResult(TransactionStatus status) {
            try {
                // ...
            }catch(Throwable ex){
                status.setRollbackOnly();
            }
        }
    });
    */
}
```

## Spring事务失效

Spring事务失效的几种情况：

- `@Transactional`注解所在类的对象不是Spring容器管理的Bean
- `@Transactional`注解的方法不是public修饰的
- 抛出的异常不在`rollbackFor`属性声明的异常列表中，或者在`noRollbackFor`属性的声明列表中，则事务不会自动回滚
- 底层数据库不支持事务
