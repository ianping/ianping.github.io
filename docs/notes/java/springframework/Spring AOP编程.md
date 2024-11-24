---
title: Spring AOP编程
createTime: 2024/11/24 15:56:15
permalink: /notes/java/yplewc1j/
---
版本信息
- Java 17
- Spring 6.1.4


## AOP核心概念

Spring AOP（Aspect-Oriented Programming，面向切面编程），是Spring的一个核心功能。

AOP核心概念：

- Aspect，切面，在Spring中，用1个Java类表示，在其中定义1个或多个通知方法
- Join point，连接点
- Advice，通知，在切点上执行的代码，在Spring中，用切面类中的方法表示
- Pointcut，切点，在Spring中，代表要增强的方法
- Introduction，增强
- Target object，目标对象
- AOP proxy，代理对象
- Weaving，织入

## AOP代理

Spring AOP默认使用基于接口的JDK动态代理实现AOP代理，如果要为非接口方法提供AOP增强，需要使用CGLIB。

如果目标对象至少实现了1个接口，就会使用JDK动态代理；如果目标对象没有实现任何接口，就会使用CGLIB代理。

也可以强制使用CGLIB代理。

## 依赖

使用Spring AOP，至少需要2个依赖：

- `spring-aop`，提供aop支持
- `aspectjweaver`，用于在运行时提供AspectJ的织入功能

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
</dependency>
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
</dependency>
```

## 基于XML的AOP

假如，现有目标对象类`CalculatorServiceImple`，其中定义了1个用于计算2数之和的方法，如下：

```java
public interface ICalculatorService {
    double add(double a, double b);
}

public class CalculatorServiceImpl implements ICalculatorService {
    @Override
    public double add(double a, double b) {
        if(a > 999 || b > 999){
            throw new IllegalArgumentException("不支持大于999的数值计算");
        }
        System.out.println("CalculatorServiceImpl#add");
        return a + b;
    }
}
```

### 1.导入aop命名空间

*aop*命名空间提供了定义切面的相关标签

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">

</beans>
```

### 2.定义Aspect类和Advice方法

要使用AOP，首先需要定义Aspect类，在其中定义Advice方法。

```java
public class CalculatorServiceAspect {

    /**
     * Before Advice: 在目标方法之前执行
     * */
    public void beforeAdd(JoinPoint joinPoint){
        Object[] args = joinPoint.getArgs();
        double a = Double.parseDouble(args[0].toString());
        double b = Double.parseDouble(args[1].toString());
        System.out.printf("CalculatorServiceAspect#add.before: args(%s, %s)%n",a, b);
    }

    /**
     * Around Advice: 环绕方法执行(Before Advice之后、After Advice之前)
     * */
    public Object aroundAdd(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        System.out.println("CalculatorServiceAspect#add.around start");
        Object returnVal = proceedingJoinPoint.proceed();
        System.out.println("CalculatorServiceAspect#add.around end");
        return returnVal;
    }

    /**
     * After Advice: 在After Returning Advice或 After Throwing Advice之前执行
     * */
    public void afterAdd(){
        System.out.println("CalculatorServiceAspect#add.after");
    }

    /**
     * After Returning Advice: 在目标方法执行完毕后执行
     * */
    public void afterReturningAdd(double returnVal){
        System.out.println("CalculatorServiceAspect#add.afterReturning: return " + returnVal);
    }

    /**
     * After Throwing Advice: 在目标方法抛出异常时执行
     * */
    public void afterThrowingAdd(IllegalArgumentException ex){
        System.out.println("CalculatorServiceAspect#add.afterThrowing: " + ex.getMessage());
    }
}
```

### 3.配置AOP

在`<aop:config>`标签中：

- 使用`<aop:aspect>`标签定义切面
- 使用`<aop:pointcut>`标签定义切点
- 使用`<aop:advice-name>`标签定义Advice通知

Advice通知包括5种标签：

- `<aop:before>`
- `<aop:around>`
- `<aop:after>`
- `<aop:after-returning>`
- `<aop:after-throwing>`

```xml
<!--注入目标对象Bean-->
<bean id="calculatorService" class="me.lyp.springframework.aop.service.CalculatorServiceImpl"/>
<!--注入切面对象Bean-->
<bean id="calculatorServiceAspect" class="me.lyp.springframework.aop.xml.aspect.CalculatorServiceAspect"/>

<aop:config>
    <!--定义切面: 引用切面Bean-->
    <aop:aspect id="calculatorServiceAspect" ref="calculatorServiceAspect">
        <!--定义切点: 目标对象的方法-->
        <aop:pointcut id="add" expression="execution(* me.lyp.springframework.aop.service.CalculatorServiceImpl.add(double,double))"/>

        <!--Before Advice-->
        <aop:before method="beforeAdd" pointcut-ref="add"/>
        <!--Around Advice-->
        <aop:around method="aroundAdd" pointcut-ref="add"/>
        <!--After Advice-->
        <aop:after method="afterAdd" pointcut-ref="add"/>
        <!--After Returning Advice-->
        <aop:after-returning method="afterReturningAdd" returning="returnVal" pointcut-ref="add"/>
        <!--After Throwing Advice-->
        <aop:after-throwing method="afterThrowingAdd" throwing="ex" pointcut-ref="add"/>
    </aop:aspect>
</aop:config>
```

### 4.加载xml配置文件

加载xml配置文件，调用目标方法

```java
public class App {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
        ICalculatorService calculatorService = context.getBean("calculatorService", ICalculatorService.class);

        double add = calculatorService.add(1, 999);
        System.out.println(add);
    }
}
```

目标方法正常时，运行结果

```
CalculatorServiceAspect#add.before: args(1.0, 999.0)
CalculatorServiceAspect#add.around start
CalculatorServiceImpl#add
CalculatorServiceAspect#add.around end
CalculatorServiceAspect#add.after
CalculatorServiceAspect#add.afterReturning: return 1000.0
1000.0
```

目标方法抛出异常时，运行结果

```
CalculatorServiceAspect#add.before: args(1.0, 1000.0)
CalculatorServiceAspect#add.around start
CalculatorServiceAspect#add.after
CalculatorServiceAspect#add.afterThrowing: 不支持大于999的数值计算
```

## 基于注解的AOP

### 1.在Spring中启用AspectJ

如果使用基于xml的配置

```xml
<aop:aspectj-autoproxy/>
```

如果使用基于Java的配置，使用`@EnableAspectJAutoProxy`注解

```java
@Configuration
@ComponentScan(basePackages = {"me.lyp.springframework.aop"})
@EnableAspectJAutoProxy
public class AppConfig {
}
```

### 2.定义Aspect类和Advice方法

2.1 使用`@Aspect`注解声明切面类

2.2 在其中定义通知方法，5种通知类型对应5个注解：

- `@Before`
- `@Around`
- `@After`
- `@AfterReturning`
- `@AfterThrowing`

2.3 切点既可以在具体的Advice注解中定义，也可以在1个无返回值的空方法上使用`@Pointcut`注解定义

```java
@Component
@Aspect
public class CalculatorServiceAspect {

    /**
     * 定义切点
     * */
    @Pointcut("execution(* me.lyp.springframework.aop.service.CalculatorServiceImpl.add(..))")
    public void calculatorAddPointcut(){}

    /**
     * 定义切点, 可传递方法参数
     * */
    @Pointcut(value = "execution(* me.lyp.springframework.aop.service.CalculatorServiceImpl.add(..)) && args(a,b)", argNames = "a,b")
    public void calculatorAddWithArgsPointcut(double a, double b){}

    /**
     * Before Advice: 在目标方法之前执行
     * */
    // @Before(value = "execution(* me.lyp.springframework.aop.service.CalculatorServiceImpl.add(..)) && args(a,b)", argNames = "a,b")
    @Before(value = "calculatorAddWithArgsPointcut(a,b)", argNames = "a,b")
    public void beforeAdd(double a, double b){
        System.out.printf("CalculatorServiceAspect#add.before: args(%s, %s)%n",a, b);
    }

    /**
     * Around Advice: 环绕方法执行(Before Advice之后、After Advice之前)
     * */
    @Around(value = "calculatorAddPointcut()")
    public Object aroundAdd(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        System.out.println("CalculatorServiceAspect#add.around start");
        Object returnVal = proceedingJoinPoint.proceed();
        System.out.println("CalculatorServiceAspect#add.around end");
        return returnVal;
    }

    /**
     * After Advice: 在After Returning Advice或 After Throwing Advice之前执行
     * */
    @After(value = "calculatorAddPointcut()")
    public void afterAdd(){
        System.out.println("CalculatorServiceAspect#add.after");
    }

    /**
     * After Returning Advice: 在目标方法执行完毕后执行
     * */
    @AfterReturning(value = "calculatorAddPointcut()", returning = "returnVal")
    public void afterReturningAdd(double returnVal){
        System.out.println("CalculatorServiceAspect#add.afterReturning: return " + returnVal);
    }

    /**
     * After Throwing Advice: 在目标方法抛出异常时执行
     * */
    @AfterThrowing(value = "calculatorAddPointcut()", throwing = "ex")
    public void afterThrowingAdd(IllegalArgumentException ex){
        System.out.println("CalculatorServiceAspect#add.afterThrowing: " + ex.getMessage());
    }
}
```

### 3.加载Java配置类

加载Java配置类，调用目标方法

```java
public class App {
    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        ICalculatorService calculatorService = context.getBean(ICalculatorService.class);

        double add = calculatorService.add(1, 999);
        System.out.println(add);
    }
}
```

## Pointcut切点

Spring AOP只支持方法，Pointcut表达式用来匹配Bean的方法。

### 定义Pointcut

在xml中，使用`<aop:pointcut>`定义切点

```xml
<aop:pointcut id="fooPointcut" expression=""/>
```

在Java中，使用`@Pointcut`注解定义切点

```java
@Pointcut(value = "")
public void fooPointcut(){}
```

然后，可以在其它的Pointcunt表达式中，或者Advice通知中，使用名称引用切点表达式

```java
@Before(value="fooPointcut()")
public void beforeFoo(){
    // ...
}
```

### Pointcut表达式

Pointcut支持以下的AspectJ PCD(pointcut designators，切点设计器)：

- `execution`，匹配目标类中的方法，例如：

  ```java
  @Pointcut("execution(* me.lyp.springframework.aop.service.CalculatorServiceImpl.add(..))")
  public void calculatorAddPointcut(){}
  ```

- `within`，匹配目标类中的所有方法，例如：

  ```java
  @Pointcut(value = "within(me.lyp.springframework.aop.service.CalculatorServiceImpl)")
  public void calculatorPointcut(){}
  ```

- `this`，匹配当前代理对象的类中的所有方法，例如：

  ```java
  @Pointcut(value = "this(me.lyp.springframework.aop.service.ICalculatorService)")
  public void calculatorPointcut(){}
  ```

- `target`，匹配当前目标对象的类中的所有方法，例如：

  ```java
  @Pointcut(value = "target(me.lyp.springframework.aop.service.ICalculatorService)")
  public void calculatorPointcut(){}
  ```

- `args`，匹配目标方法参数，，例如：

  ```java
  @Pointcut(value = "args(a, b)", argNames = "a,b")
  public void calculatorPointcut(double a, double b){}
  ```

- `@within`

- `@target`

- `@args`

- `@annotation`

PCD可以进行组合：

- 在Java中，使用 `&&` `||` `!`
- 在xml中，使用 `and` `or` `not`

例如：

```java
@Pointcut(value = "within(me.lyp.springframework.aop.service.CalculatorServiceImpl) && args(a, b)", argNames = "a,b")
public void calculatorPointcut(double a, double b){}
```

### Pointcut最佳实践

1个好的Pointcut表达式，应该总是可以精确定位到1个目标方法。

## Advice方法参数

### 传递目标方法参数到Advice方法

任何Advice都可以获取到目标方法的参数。

1.定义Pointcut时：

- 使用`args`切点设计器指定参数数量
- 用`argNames`属性指定参数名称

在Pointcunt方法参数列表中，声明参数，参数名称必须与之前指定的的名称保持一致

```java
@Pointcut(value = "execution(* me.lyp.springframework.aop.service.CalculatorServiceImpl.add(..)) && args(a,b)", argNames = "a,b")
public void calculatorAddWithArgsPointcut(double a, double b){}
```

2.在Advice方法中

```java
@Before(value = "calculatorAddWithArgsPointcut(a,b)", argNames = "a,b")
public void beforeAdd(double a, double b){
    System.out.printf("CalculatorServiceAspect#add.before: args(%s, %s)%n",a, b);
}
```

### 传递目标方法返回值到Advice方法

只有 *After Returning Advice* 方法才可以获取到目标方法的返回值。

首先使用`returning`属性指定返回值名称，然后在Advice方法中声明同名的参数。例如：

```java
@AfterReturning(value = "calculatorAddPointcut()", returning = "returnVal")
public void afterReturningAdd(double returnVal){
    System.out.println("CalculatorServiceAspect#add.afterReturning: return " + returnVal);
}
```

### 传递目标方法抛出的异常对象到Advice方法

只有 *After Throwing Advice* 方法才可以获取到目标方法抛出的异常对象。

首先使用`throwing`属性指定异常对象名称，然后在Advice方法中声明同名的参数。例如：

```java
@AfterThrowing(value = "calculatorAddPointcut()", throwing = "ex")
public void afterThrowingAdd(IllegalArgumentException ex){
    System.out.println("CalculatorServiceAspect#add.afterThrowing: " + ex.getMessage());
}
```

