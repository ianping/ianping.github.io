---
sidebar: auto
title: SpringBoot核心特性-自动配置
createTime: 2024/11/24 15:56:15
permalink: /notes/java/ei51qgwb/
---

# SpringBoot核心特性-自动配置

自动配置是SpringBoot的一个关键特性,旨在简化Spring应用程序的开发过程.

## 约定大于配置

SpringBoot遵循约定大于配置(Convention Over Configuration)的设计原则，通过一些列默认约定来简化开发和配置工作，从而提高开发效率。

### 项目结构约定

SpringBoot应用按照约定的标准目录结构进行组织，例如：

- 应用文件整体为maven或gradle项目
- 在启动引导类位于顶层包下，使用`@SpringBootApplication`注解
- 默认配置文件为 *application.properties* 或 *application.yml*
- 默认静态资源目录为 *classpath:/META-INF/resources/*，*classpath:/resources/*，*classpath:/static/*，*classpath:/public/*
- 默认模板文件目录为 *classpath:/templates/*

### Starter约定

约定Starter的命名规则：

- Spring官方Starter：`spring-boot-starter-*`
- 非Spring官方Starter：`*-spring-boot-starter`

## 自动配置

SpringBoot的核心特性自动配置(Auto-Configuration)，是通过自动配置类来实现的。自动配置类根据应用的依赖关系和环境进行条件化装配。

### 自动配置类

自动配置类使用`@AutoConfiguration`注解，或者使用另外2个特定注解：`@AutoConfigureBefore` 和 `@AutoConfigureAfter`。并且使用`@Conditional`或者其派生注解，进行条件化装配。

`spring-boot-autoconfigure`模块中，定义了SpringBoot自带的自动配置类，例如`WebMvcAutoConfiguration`

```java
@AutoConfiguration(after = { DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class,
		ValidationAutoConfiguration.class })
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10)
@ImportRuntimeHints(WebResourcesRuntimeHints.class)
public class WebMvcAutoConfiguration {
    
}
```

也可以自定义Starter，在其中创建自动配置类。

### 启用自动配置

要启用自动配置，需要使用注解`@EnableAutoConfiguration`，这样，SpringBoot在启动时，就可以根据配置类(使用`@Configuration`注解的类)进行解析，完成自动配置。

`@SpringBootApplication`注解是一个复合注解，具备启用自动配置的能力：

```java
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
    
}
```

## 条件化装配

SpringBoot条件化装配(Conditional Configuration)，是指SpringBoot应用在启动时，根据特定条件来决定配置类是否生效。

### `@Conditional`

使用`@Conditional`注解，指定条件类。

**1.定义条件类**

自定义`OnXxxCondition`类，实现`Condition`接口，然后重写`Condition#matches`方法，返回true，表示条件满足。

这里自定义条件类，条件为类路径下是否存在`Person`类

```java
public class OnPersonClassCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        try {
            context.getClassLoader().loadClass("me.lyp.domain.Person");
            return true;
        } catch(ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }
}
```

**2.在配置类上使用`@Conditional`注解，并指定条件类**

这里的配置类中，注入1个`Person` Bean

```java
@Configuration
@Conditional(OnPersonClassCondition.class)
public class MyConfig {
    @Bean
    public Person person(){
        return new Person("jack", 50);
    }
}
```

**3.验证**

验证配置类是否生效（`Person` Bean是否注入成功）。

如果注入成功，启动SpringBoot应用时，下面的代码不会报错

```java
@Autowired private Person person;
```

### 预定义条件注解

SpringBoot预定义了一些`@Conditional`的派生注解，常用的几个如下：

- `@ConditionalOnClass`
- `@ConditionalOnMissingClass`
- `@ConditionalOnBean`
- `@ConditionalOnMissingBean`
- `@ConditionalOnProperty`
- `@ConditionalOnResource`

使用预定义条件注解

```java
@Configuration
@ConditionalOnClass(Person.class)
public class MyConfig {
    @Bean
    public Person person(){
        return new Person("jack", 50);
    }
}
```

### 自定义条件注解

模拟预定义条件注解`@ConditionalOnClass`。

**1.定义注解**

定义注解，使用`@Conditional`指定条件类

```java
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Conditional(MyOnClassCondition.class)
public @interface MyConditionalOnClass {
    Class<?>[] value() default {};
}
```

**2.定义条件类**

定义条件类，在其中获取使用自定义的条件注解时指定的Class，判断类路径下是否存在

```java
public class MyOnClassCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        if(metadata instanceof ClassMetadata classMetadata){
            try {
                // 获取被注解的类(配置类)
                String className = classMetadata.getClassName();
                Class<?> configClz = Class.forName(className);
                // 获取配置类上的 @MyConditionalOnClass
                MyConditionalOnClass annotation = configClz.getAnnotation(MyConditionalOnClass.class);
                // 获取 @MyConditionalOnClass 的value属性值
                Class<?>[] classes = annotation.value();
                // 如果没有指定任何Class, 认为条件满足
                if(classes == null || classes.length == 0){
                    return true;
                }
                // 如果指定了Class, 判断类路径下是否存在该类
                ClassLoader classLoader = context.getClassLoader();
                for(Class<?> clz : classes) {
                    classLoader.loadClass(clz.getName());
                }
                return true;
            } catch(ClassNotFoundException e) {
                return false;
            }
        }
        return false;
    }
}
```

**3.使用**

```java
@Configuration
//@Conditional(OnPersonClassCondition.class)
//@ConditionalOnClass(Person.class)
@MyConditionalOnClass(Person.class)
public class MyConfig {
    @Bean
    public Person person(){
        return new Person("jack", 50);
    }
}
```

## Starter启动器

Starter启动器封装了特定的依赖库和自动配置类，在SpringBoot应用中，通过引入Starter依赖，自定获得对特定功能的支持，无需手动添加依赖和配置代码。

## 自定义配置

SpringBoot支持通过属性文件或配置类覆盖默认配置。
