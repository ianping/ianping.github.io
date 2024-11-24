---
title: Spring IoC容器
createTime: 2024/11/24 15:56:15
permalink: /notes/java/rc28m1wu/
---
版本信息
- Java 17
- Spring 6.1.4

Spring IoC(Inversion of Control，控制反转)容器，用于管理应用中的对象和它们之间的依赖关系，亦称作DI(Dependency injection，依赖注入)。

IoC容器根据预先定义的对象依赖关系创建对象，而不是由开发人员通过创建对象构建其依赖关系，因此称作"控制反转"。

使用IoC容器，一般包括下面3个步骤：

1. 配置元数据
2. 实例化容器：`ApplicationContext`的实现类
3. 获取Bean：调用`ApplicationContext#getBean(String name, Class<T> requiredType)`

## 配置元数据

IoC容器根据配置元数据实例化、配置和组装对象，支持3种配置方式：

- 使用xml配置元数据
- 基于注解的配置
- 使用Java配置元数据

### 基于xml的配置

1.创建xml配置文件，在其中定义Spring配置信息

*spring.xml*

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="jack" class="me.lyp.springframework.config.Person">
        <property name="name" value="jack"/>
        <property name="age" value="18"/>
     </bean>
</beans>
```

2.加载xml配置文件

Spring支持从类路径和文件系统中加载xml配置文件，分别使用以下2个`ApplicationContext`：

- `ClassPathXmlApplicationContext`
- `FileSystemXmlApplicationContext`

```java
ApplicationContext ctx = new ClassPathXmlApplicationContext("spring.xml");
Person jack = ctx.getBean("jack", Person.class);
System.out.printf("name=%s, age=%d%n", jack.getName(), jack.getAge());
```

### 基于注解的配置

#### 在xml配置中开启基于注解的配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>
</beans>
```

#### 使用`@Autowired`注解装配Bean

`@Autowired`注解用于自动装配Bean。

可以作用于字段

```java
@Autowired private PersonDao personDao;
```

也可以作用于构造函数

```java
private final PersonDao personDao;

@Autowired
public PersonService(PersonDao personDao){
    this.personDao = personDao;
}
```

也可以作用于方法

```java
private PersonDao personDao;

@Autowired
public void setPersonDao(PersonDao personDao){
    this.personDao = personDao;
}
```

还可以作用于方法参数

```java
private PersonDao personDao;

@Autowired
public void setPersonDao(@Autowired PersonDao personDao){
    this.personDao = personDao;
}
```

#### 其它有用的注解

- `@Primary`，当有多个候选项Bean时，指定其中1个为默认的
- `@Qualifier`
- `@Resource`，JSR-250中规定的注解
- `@PostConstruct` `@PreDestroy`，JSR-250中规定的注解
- `@Value`，注入外部化的配置属性

### 基于Java的配置

1.定义配置类

Spring使用`@Component`注解或其派生注解（例如：`@Configuration`，`@Controller`，`@Repository`，`@Service`）表示一个配置类，在配置类中使用`@Bean`注解一个方法，表示实例化Bean。

```java
@Configuration
public class AppConfig {

    @Bean
    public Person tom(){
        return new Person("tom", 12);
    }
}
```

2.加载配置类信息

使用`AnnotationConfigApplicationContext`可以加载一个或多个配置类

```java
ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
Person tom = ctx.getBean("tom", Person.class);
System.out.printf("name=%s, age=%d%n", tom.getName(), tom.getAge());
```

## `BeanDefinition`

Spring IoC容器根据提供的配置元数据实例化Bean，Bean在容器中表示为`BeanDefinition`接口类型的对象，它包括以下信息：

- Bean名称、类全限定名称、Class对象
- scope作用域、是否懒初始化
- 生命周期回调函数，例如：Bean初始化方法，销毁方法
- 依赖的其它Bean
- 其它信息，例如：pool大小

## Bean的名称

Spring IoC容器中，Bean的名称必须是唯一的，1个Bean可以有多个名称。

如果是在xml配置文件中，使用`id`属性指定Bean名称，还可以使用`name`属性指定多个用逗号隔开的别名。例如：

```xml
<bean id="person" name="p,jack" class="me.lyp.springframework.bean.Person">
    <property name="name" value="jack"/>
    <property name="age" value="18"/>
</bean>
```

支持给已存在的Bean设置别名

```xml
<alias name="person" alias="man"/>
```

如果是在Java配置文件中，`@Bean`注解默认使用方法名作为Bean的名称。例如：

```java
@Bean
public Person person(){
    return new Person("jack", 18);
}
```

也可以使用`name`属性指定1个或多个名称

```java
@Bean(name = {"person", "p", "jack"})
public Person person(){
    return new Person("jack", 18);
}
```

## Bean的实例化

### 使用构造函数

如果实在xml中

```xml
<bean id="person" class="me.lyp.springframework.bean.Person">
    <property name="name" value="jack"/>
    <property name="age" value="18"/>
</bean>
```

如果是在Java代码中

```java
@Bean
public Person person(){
    return new Person("jack", 18);
}
```

### 使用静态工厂方法

在xml中，使用`class`属性指定静态工厂方法类，使用`factory-method`属性指定静态工厂方法名称

```xml
<bean id="personInstance" class="me.lyp.springframework.bean.PersonFactory" factory-method="getInstance">
</bean>
```

静态工厂方法所在类代码如下：

```java
public class PersonFactory {
    private static final Person person = new Person("jack", 18);

    public static Person getInstance() {
        return person;
    }
}
```

### 使用实例工厂方法

在xml中，使用`factory-bean`属性指定工厂方法所在类的Bean，使用`factory-method`属性指定工厂方法名称

```xml
<bean id="company" class="me.lyp.springframework.bean.Company"/>

<bean id="legalPerson" factory-bean="company" factory-method="getLegalPerson">

</bean>
```

工厂方法所在类代码如下：

```java
public class Company {
    private Person legalPerson = new Person("jack", 18);

    public Person getLegalPerson(){
        return legalPerson;
    }
}
```

## Bean依赖注入

### 依赖注入的方式

#### 基于构造器

基于构造器的DI，是指IoC容器调用有参构造器，或者有参的静态工厂方法实例化Bean，每个参数代表1个依赖。

#### 基于setter方法

基于setter方法的DI，是指IoC容器调用无参构造器，或者无参的静态工厂方法实例化Bean后，再调用setter方法注入依赖。

### 依赖解析与循环依赖问题

循环依赖问题：类A通过构造函数注入，需要类B的1个实例；类B通过构造函数注入，需要类A的1个实例。Spring容器会检测到这种依赖，抛出`BeanCurrentlyInCreationException`异常。

示例代码如下：

```java
public class A {
    private final B b;

    @Autowired
    public A(B b){
        this.b = b;
    }
}

public class B {
    private final A a;

    @Autowired
    public B(A a){
        this.a = a;
    }
}
```

解决循环依赖问题：使用setter方法注入代替构造器注入。

示例代码如下：

```java
public class A {
    private B b;

    @Autowired
    public void setB(B b){
        this.b = b;
    }
}

public class B {
    private A a;

    @Autowired
    public void setA(A a){
        this.a = a;
    }
}
```

### `depends-on`属性

如果1个Bean在初始化之前，依赖其它的Bean，可以使用用`depends-on`属性，列出所依赖的Bean，多个Bean用逗号或空格隔开

```xml
<bean id="a" class="me.lyp.springframework.bean.A"/>

<bean id="b" class="me.lyp.springframework.bean.B" depends-on="a"/>
```

### 懒初始化Bean

默认情况下，`ApplicationContext`会在其初始化过程中，进行Bean的实例化。可以使用`lazy-init`属性，启用懒初始化，在第一次使用实例时才初始化Bean

```xml
<bean id="company" class="me.lyp.springframework.bean.Company" lazy-init="true"/>
```

## Bean Scope

Spring Bean支持6个scope（作用范围）：

- `singleton`，默认scope，全局单例
- `prototype`，原型，每次请求都会创建1个新的实例
- `request`，单个Http请求的生命周期
- `session`，单个Http会话生命周期
- `application`，单个`ServletContext`生命周期
- `websocket`，`WebSocket`生命周期

Spring容器中，Bean默认作用域是`singleton`，可以使用`@Scope`注解指定为其它作用域：

```java
@Bean(name = {"person", "p", "jack"})
@Scope(scopeName = "singleton")
public Person person(){
    return new Person("jack", 18);
}
```

## Bean生命周期回调方法

### 初始化回调

设置Bean的初始化回调，有如下几种方式：

- 实现`org.springframework.beans.factory.InitializingBean`接口，重写其`afterPropertiesSet()`方法

  ```java
  public class A implements InitializingBean{
      // ...
      
      @Override
      public void afterPropertiesSet() throws Exception {
  
      }
  }
  ```

- 如果使用基于xml的配置，使用bean元素的`init-method`属性，指定无参、无返回值的方法的名称

  ```xml
  <bean id="a" class="me.lyp.springframework.bean.A" init-method="afterInit">
  
  </bean>
  ```

- 如果使用基于Java的配置，使用`@Bean`注解的`initMethod`属性，指定无参、无返回值的方法的名称

  ```java
  @Bean(initMethod = "afterInit")
  public A a(){
      return new A();
  }
  ```

- 使用`@PostConstruct`注解

  ```java
  @PostConstruct
  public void afterInit(){
      System.out.println("A: afterInit()");
  }
  ```

### 销毁回调

设置Bean的销毁回调，有如下几种方式：

- 实现`org.springframework.beans.factory.DisposableBean`接口，重写其`destroy()`方法

  ```java
  public class A implements InitializingBean, DisposableBean {
      // ...
      
      @Override
      public void destroy() throws Exception {
  
      }
  }
  ```

- 如果使用基于xml的配置，使用bean元素的`destroy-method`属性

  ```xml
  <bean id="a" class="me.lyp.springframework.bean.A" init-method="afterInit" destroy-method="beforeDestroy">
  
  </bean>
  ```

- 如果使用基于Java的配置，使用`@Bean`注解的`destroyMethod`属性

  ```java
  @Bean(initMethod = "afterInit", destroyMethod = "beforeDestroy")
  public A a(){
      return new A();
  }
  ```

- 使用`@PreDestroy`注解

  ```java
  @PreDestroy
  public void beforeDestroy(){
      System.out.println("A: beforeDestroy()");
  }
  ```

## 自动扫描配置

如果是基于xml配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
    
    <context:component-scan base-package="me.lyp.springframework.bean"/>
    
    <!--其它配置-->
</beans>
```

如果是基于Java的配置，在配置类上使用`@ComponentScan`注解，并使用`basePackages`属性指定要扫描的包列表

```java
@Configuration
@ComponentScan(basePackages = {"me.lyp.springframework.bean"})
public class AppConfig {
    // ...
}
```

## 使用JSR-250标准注解

JSR-250中，规定了几个注解，包括：

- `@Resource`
- `@PostConstruct`
- `@PreDestroy`

在Java9之前，由jdk自带，属于`javax.annotation`包的一部分；

从Java9开始，这个包已被整个从jdk中移除，要想使用这几个注解，需要添加`jakarta.annotaion-api`依赖

```xml
<dependency>
    <groupId>jakarta.annotation</groupId>
    <artifactId>jakarta.annotaion-api</artifactId>
    <version>2.1.1</version>
</dependency>
```

## 使用JSR-330标准注解

JSR-330中定义了几个注解，包括：

- `@Inject`
- `@Named`
- `@Qualifier`

添加`jakarta.inject-api`依赖

```xml
<dependency>
    <groupId>jakarta.inject</groupId>
    <artifactId>jakarta.inject-api</artifactId>
    <version>2.0.0</version>
</dependency>
```

