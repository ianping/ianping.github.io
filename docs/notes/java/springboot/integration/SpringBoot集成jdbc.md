---
title: SpringBoot集成jdbc
createTime: 2024/11/24 15:56:15
permalink: /notes/java/h9t8pk3h/
---
## 1.添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.27</version>
</dependency>
```

## 2.配置数据源

```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root
```

## 3.获取`JdbcTemplate`

```java
@Resource
private JdbcTemplate jdbcTemplate;
```

## 4.CRUD

### 插入

```java
String sql = """
    INSERT INTO t_person(id, name, age) VALUES(?, ?, ?)
    """;
Object[] args = {1, "jack", 20};
int insertRows = jdbcTemplate.update(sql, args);
System.out.println(insertRows);
```

### 更新

```java
String sql = """
    UPDATE t_person SET name = ?, age = ? WHERE id = ?
    """;
Object[] args = {"james", 30, 1};
int updateRows = jdbcTemplate.update(sql, args);
System.out.println(updateRows);
```

### 删除

```java
String sql = """
    DELETE FROM t_person WHERE id = ?
    """;
Object[] args = {1};
int deleteRows = jdbcTemplate.update(sql, args);
System.out.println(deleteRows);
```

### 查询

查询单个值，并将其转换为Java数据类型

```java
String sql = """
    SELECT count(1) FROM t_person;
""";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
System.out.println(count);
```

查询单条记录，并将其封装为Java对象

```java
String sql = """
    SELECT * FROM t_person WHERE id = ?
    """;
Object[] args = {1};

RowMapper<Person> rowMapper = new BeanPropertyRowMapper<>(Person.class);
Person person = jdbcTemplate.queryForObject(sql, rowMapper, args);
System.out.println(person);
```

查询多条记录，并将其封装为Java对象列表

```java
String sql = """
    SELECT * FROM t_person
    """;
    List<Person> persons = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Person.class));
System.out.println(persons);
```
