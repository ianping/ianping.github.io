---
sidebar: auto
title: SpringBoot核心特性-外部化配置
createTime: 2024/11/24 15:56:15
permalink: /notes/java/b89hczb1/
---

# SpringBoot核心特性-外部化配置

## 外部化配置源

支持一下外部配置源（排在后面的配置会覆盖前面的配置）：

1. 默认配置
2. 配置类上使用`@PropertySource`指定的配置文件
3. application配置文件
4. `RandomValuePropertySource`随机值属性
5. 操作系统环境变量
6. Java系统变量(`System.getProperties()`)
7. 命令行参数

### 1.默认配置

通过`SpringApplication#defaultProperties()`方法设置的属性

```java
@SpringBootApplication
public class ConfigurationApp {
    public static void main(String[] args) {
        Properties defaultProperties = new Properties();
        defaultProperties.setProperty("server.port", "8088");

        SpringApplication app = new SpringApplication(ConfigurationApp.class);
        app.setDefaultProperties(defaultProperties);
        app.run(args);
    }
}
```

### 2.配置类上使用`@PropertySource`指定的配置文件

例如：

```java
@SpringBootApplication
@PropertySource(value = "classpath:additional.properties", ignoreResourceNotFound = true)
public class ConfigurationApp {
    
}
```

*additional.properties*

```properties
server.port=8089
```

### 3.配置文件

#### application配置文件

SpringBoot启动时，默认会加载以下位置的 *application.properties*、*application.yaml*、*application.yml* 文件，按优先级从小到大排序如下：

- classpath
- classpath:/config
- 当前目录下（运行java命令的目录）
- 当前目录下的config目录

如果同一优先级的目录下，同时存在properties和yaml文件，前者优先级较高。强烈不推荐同时使用多种配置文件格式！！

#### Profile配置文件

SpringBoot还会自动加载名称为 *application-{profile}* 的配置文件。

例如：

```properties
spring.profiles.active=prod
```

将使*application-prod.properties* 或 *application.yaml* 生效。

#### 指定配置文件的名称或查找位置

配置文件默认名称为*application*，可以通过`spring.config.name`属性指定其它名称。如下：

`java -jar myapp.jar --spring.config.name=app`

还可以使用`spring.config.location`属性，指定从其它文件或目录查找配置文件，支持多个，用逗号隔开，使用*optional:*表示其为可选的。如下：

`java -jar myapp.jar --spring.config.location=optional:classpath:default.properties,optional:classpath:conf/,optional:file:/etc/myapp/`

#### 导入其它配置

使用`spring.config.import`导入其它配置文件，使用 *optional:* 开头表示其为可选的

```properties
spring.config.import[0]=classpath:mysql.properties
spring.config.import[1]=optional:file:/etc/myapp/my.properties
```

支持导入无扩展名的文件，需要使用方括号指定其扩展名

```properties
spring.config.import[2]=optional:classpath:redis[.properties]
```

#### 在配置文件中使用属性占位符

使用 `${name}` 占位符语法，引用其它属性，也可以使用 `${name:default}` 指定默认值

```properties
spring.application.name=myapp

app.description=${spring.application.name} is a awesome! written by ${app.author:Unknown}
```

### 4.`RandomValuePropertySource`随机值属性

`RandomValuePropertySource`是SpringBoot用于生成随机值的一个特殊属性源。可以生成随机的字符串、UUID、int、long。

#### 在配置文件中使用随机值

```properties
my.random.string=${random.value}
my.random.uuid=${random.uuid}
my.random.int=${random.int}
my.random.int1to9=${random.int(10)}
my.random.int1to99=${random.int[1,100)}
my.random.int1to100=${random.int[1,100]}
my.random.long=${random.long}
```

#### 在`@Value`中使用随机值

```java
@Value("${random.value}") private String string;
@Value("${random.uuid}") private String uuid;
@Value("${random.int}") private Integer intVal;
@Value("${random.int(10)}") private Integer int1to9;
@Value("${random.int[1,100)}") private Integer int1to99;
@Value("${random.int[1,100]}") private Integer int1to100;
@Value("${random.long}") private Long longVal;
```

### 5.操作系统环境变量

SpringBoot可以从系统环境变量中读取配置属性

```properties
@Value("${JAVA_HOME}") private String javaHome;
```

在生产环境中，SpringBoot应用中的敏感信息，推荐通过操作系统环境变量配置。例如JWT密钥。

### 6.Java系统变量(`System.getProperties()`)

SpringBoot可以从Java系统变量中读取配置属性

```properties
@Value("${java.home}") private String javaHome;
```

调用`System#setProperty`方法设置Java系统变量

```java
System.setProperty("key", "value");
```

或者，从properties文件中加载配置

```java
try {
    Properties properties = new Properties();
    properties.load(new FileInputStream("my.properties"));
    System.setProperties(properties);
} catch(IOException e) {
    e.printStackTrace();
}
```

或者，在`java`命令中，使用 *-D* 选项设置

`java -jar -Dserver.port=9000 -Dfile.encoding=UTF-8 myapp.jar`

### 7.命令行参数

SpringBoot可以使用命令行参数设置配置属性

`java -jar myapp.jar --server.port=9000`

## 访问配置属性值

### `@Value`

```java
@Value("${server.port}") private Integer port;
```

### `Environment`

获取`Environment` Bean

```java
@Autowired private Environment environment;
```

调用`Environment#getProperty`方法，获取配置属性值

```java
Integer port = Integer.parseInt(environment.getProperty("server.port"));
```

### `@ConfigurationProperties`

SpringBoot支持将配置文件中的配置项，映射为Bean。

#### 1.声明配置项

```properties
my.file.dir=/www/myapp/file
my.file.image.dir=/www/myapp/file/images
my.file.image.max-size=10
my.file.audio.dir=/www/myapp/file/audio
my.file.audio.max-size=50
```

#### 2.定义属性配置类

使用`@ConfigurationProperties`注解。

下面的属性配置类中，省略了getter/setter方法

```java
@ConfigurationProperties(prefix = "my.file")
public class FileProperties {
    private String dir;
    private ImageProperties image;
    private AudioProperties audio;
 
    public static class ImageProperties{
        private String dir;
        private Integer maxSize;
    }
    
    public static class AudioProperties{
        private String dir;
        private Integer maxSize;
    }
}
```

#### 3.启用自定义的属性配置类

在任意一个配置类上，使用`@EnableConfigurationProperties` 指定要启用的配置类即可。例如，在启动引导类上

```java
@SpringBootApplication
@EnableConfigurationProperties({FileProperties.class})
public class ConfigurationApp {

}
```

这样，SpringBoot就会将自定义的属性配置类作为Bean注入到容器中

```java
@Autowired private FileProperties fileProperties;
```

