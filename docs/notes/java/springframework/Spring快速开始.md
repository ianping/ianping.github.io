---
title: Spring快速开始
createTime: 2024/11/24 15:56:15
permalink: /notes/java/ysaj2l4x/
---
版本信息

- Java 17

- Spring 6.1.4

## Spring IoC

### 1.添加依赖

添加`spring-context`

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
</dependency>
```

`spring-context`自动收集了IoC、AOP以及Spring的其它核心依赖

![](./_/20240303110549.png)

### 2.定义bean

创建一个类，用于测试

```java
@Data
public class Person {
    private String name;
    private Integer age;
}
```

创建xml配置文件，导入beans schema，定义Bean

*spring.xml*

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="jack" class="me.lyp.springframework.quickstart.entity.Person">
        <property name="name" value="jack"/>
        <property name="age" value="18"/>
    </bean>
</beans>
```

### 3.加载Spring配置文件

使用`ClassPathXmlApplicationContext`加载xml配置文件，自动装配Bean

```java
public class QuickstartApp {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
        
        Person jack = context.getBean("jack", Person.class);
        System.out.printf("name=%s, age=%d%n", jack.getName(), jack.getAge());
    }
}
```

## Spring AOP

### 1.添加依赖

Spring AOP除了需要`spring-context`外，还需要添加`aspectjweaver`依赖

```xml
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.19</version>
</dependency>
```

### 2.定义aop切面、切点、通知

创建类，作为目标对象(被代理对象)类。如果目标对象类实现了至少1个接口，Spring AOP使用JDK动态代理，否则，使用CGLIB代理。

```java
public interface ICalculator {
    double add(double a, double b);
}

public class CalculatorImpl implements ICalculator {

    @Override
    public double add(double a, double b) {
        return a + b;
    }
}
```

创建切面类，切面类是普通的Java类

```java
public class CalculatorAspect {
    public void beforeAdd(){
        System.out.println("CalculatorAspect#beforeAdd");
    }
}
```

配置xml：导入aop schema，定义切面、切点、通知

*spring.xml*

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">
    
    <!--目标类Bean-->
    <bean id="calculator" class="me.lyp.springframework.quickstart.service.CalculatorImpl"/>
    <!--切面类Bean-->
    <bean id="calculatorAspect" class="me.lyp.springframework.quickstart.aspect.CalculatorAspect"/>
    
    <!--AOP配置: 定义切面、切点、通知-->
    <aop:config>
        <aop:aspect id="calculatorAspect" ref="calculatorAspect">
            <aop:pointcut id="calculatorAdd" expression="execution(public double me.lyp.springframework.quickstart.service.CalculatorImpl.add(double,double))"/>
            <aop:before pointcut-ref="calculatorAdd" method="beforeAdd"/>
        </aop:aspect>
    </aop:config>
</beans>
```

### 加载Spring配置文件

注意，对于实现了接口的类，因为默认使用JDK动态代理，所以在获取Bean时，需要使用其接口Class接收。

```java
public class QuickstartApp {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");

        ICalculator calculator = context.getBean("calculator", ICalculator.class);
        double add = calculator.add(1, 1);
        System.out.println(add);
    }
}
```

## Spring MVC

