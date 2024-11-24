---
title: MybatisPlus基础
createTime: 2024/11/24 15:56:15
permalink: /notes/java/h0q63qjk/
---
参考：

- 官方文档：https://baomidou.com/
- github：https://github.com/baomidou/mybatis-plus

## 快速开始

添加依赖

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    <version>3.5.5</version>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>
```

配置数据源，以及基础配置

```properties
spring.datasource.url=jdbc:mysql://172.30.149.49:3306/test?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=root

mybatis-plus.mapper-locations=classpath:/mapper/**/*.xml
mybatis-plus.type-aliases-package=me.lyp.mp.entity
mybatis-plus.configuration.map-underscore-to-camel-case=true
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

定义实体类和Mapper接口，Mapper接口继承`BaseMapper<T>`接口，默认实现了单表增删改查方法

```java
@Data
@TableName("t_user")
public class User {
    @TableId(type = IdType.NONE)
    private Long id;
    private String name;
    private Integer age;
    private String email;
}

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
```

增删改查

```java
@SpringBootTest
public class MPAppTests {

    @Resource private UserMapper userMapper;

    @Test
    public void testUserMapper(){
        List<User> users = userMapper.selectList(null);
        System.out.println(users);
    }
}
```

## 使用Service层的默认方法

定义Service接口

```java
public interface IUserService {
}
```

定义Service接口的实现类，同时继承`ServiceImpl<M extends BaseMapper<T>, T>`

```java
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {
}
```

使用Service层的默认方法

```java
@RestController
public class UserController {

    @Resource private IUserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUserList(){
        List<User> userList = userService.list();
        return ResponseEntity.ok(userList);
    }
}
```

## 常用注解

- `@TableName`

- `TableId`

- `TableField`

- `TableLogic`

## 常用配置

```properties
mybatis-plus.mapper-locations=classpath:/mapper/**/*.xml
mybatis-plus.type-aliases-package=me.lyp.mp.entity

mybatis-plus.configuration.map-underscore-to-camel-case=true
mybatis-plus.configuration.default-enum-type-handler=com.baomidou.mybatisplus.core.handlers.MybatisEnumTypeHandler
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl

mybatis-plus.global-config.db-config.table-prefix=t_
mybatis-plus.global-config.db-config.logic-delete-field=deleted
mybatis-plus.global-config.db-config.logic-delete-value=1
mybatis-plus.global-config.db-config.logic-not-delete-value=0
```

## 使用Wrapper条件构造器

- `QueryWrapper<T>`

- `LambdaQueryWrapper<T>`

- `UpdateWrapper<T>`

- `LambdaUpdateWrapper<T>`

## 逻辑删除

```properties
mybatis-plus.global-config.db-config.logic-delete-field=deleted
mybatis-plus.global-config.db-config.logic-delete-value=1
mybatis-plus.global-config.db-config.logic-not-delete-value=0
```

## 分页插件

