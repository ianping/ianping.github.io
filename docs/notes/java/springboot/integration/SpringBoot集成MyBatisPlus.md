---
title: SpringBoot集成MyBatisPlus
createTime: 2024/11/24 15:56:15
permalink: /notes/java/mc4lv2e8/
---
## 参考资料

官方文档：https://baomidou.com/introduce/

## 快速开始

### 1.添加依赖

SpringBoot 2.x

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.5</version>
</dependency>
```

SpringBoot 3.x

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    <version>3.5.5</version>
</dependency>
```

### 2.配置

```properties
# Datasource
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/atguigu_oa?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.type=com.zaxxer.hikari.HikariDataSource

# MyBatis-Plus
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
mybatis-plus.mapper-locations=classpath*:/mapper/**/*.xml
mybatis-plus.configuration.map-underscore-to-camel-case=true
mybatis-plus.type-aliases-package=me.lyp.oa.domain.entity
```

### 3.定义实体

```java
@Data
@TableName(value = "t_sys_role")
public class SysRole {

    @TableId(type = IdType.NONE)
    private String id;
    
    @TableField("name")
    private String name;

    private String description;

    @TableLogic(value = "0", delval = "1")
    private Integer deleted;
}
```

### 4.使用通用的Mapper API

```java
@Mapper
public interface SysRoleMapper extends BaseMapper<SysRole> {
    // 自定义Mapper方法
}
```

### 5.使用通用的Service API

```java
public interface ISysRoleService extends IService<SysRole> {
    // 自定义Service方法
}

@Service
public class SysRoleServiceImpl extends ServiceImpl<SysRoleMapper, SysRole> implements ISysRoleService {
}
```

