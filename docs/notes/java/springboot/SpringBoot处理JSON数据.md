---
title: SpringBoot处理JSON数据
createTime: 2024/11/24 15:56:15
permalink: /notes/java/ebwwnv4q/
---
SpringBoot提供了与3个库的集成:

- Jackson
- Gson
- JSON-B

集成JSON使用依赖`spring-boot-starter-json`, 它作为 `spring-boot-starter-web` 的一部分, 已自动添加.

## Jackson

### 使用默认的`ObjectMapper`

Jackson是SpringBoot默认的JSON库, 自动注入了1个 `ObjectMapper` Bean.

```java
@Resource
private ObjectMapper objectMapper;

@Test
public void jacksonTest() throws JsonProcessingException {
    Person tom = new Person("tom", 20, new Date());
    String json = objectMapper.writeValueAsString(tom);
    System.out.println(json);
}

@Data
@AllArgsConstructor
private class Person{
    private String name;
    private Integer age;
    private Date birthday;
}
```

支持通过application配置文件进行自定义

```properties
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
spring.jackson.time-zone=Asia/Shanghai
```

### 自定义序列化和反序列化器格式化

> 注意：对于非`@RequestBody`请求参数，SpringBoot不会自动序列化与反序列化，因此，对于GET请求时的参数，需要自定义`Converter`，或者，在字段上使用`@DateTimeFormat`注解指定格式化字符串

自定义`ObjectMapper`，添加time模块中几个时间类型的序列化器。

可以继承`JsonSerializer<T>` 和 `JsonDeserializer<T>` 抽象类进行自定义。

也可以直接使用Jackson默认的序列化和反序列化器，修改格式字符串即可

```java
@Configuration
public class JsonConfig {
    private static final String DATE_FORMAT_STRING= "yyyy-MM-dd";
    private static final String TIME_FORMAT_STRING= "HH:mm:ss";
    private static final String DATETIME_FORMAT_STRING= "yyyy-MM-dd HH:mm:ss";

    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(DATE_FORMAT_STRING);
    private static final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern(TIME_FORMAT_STRING);
    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(DATETIME_FORMAT_STRING);

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        SimpleModule module = new SimpleModule();
        module.addSerializer(LocalDate.class, new LocalDateSerializer(dateFormatter));
        module.addSerializer(LocalTime.class, new LocalTimeSerializer(timeFormatter));
        module.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(dateTimeFormatter));
        module.addDeserializer(LocalDate.class, new LocalDateDeserializer(dateFormatter));
        module.addDeserializer(LocalTime.class, new LocalTimeDeserializer(timeFormatter));
        module.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(dateTimeFormatter));
        objectMapper.registerModule(module);
        return objectMapper;
    }
}
```

## Gson



## JSON-B

