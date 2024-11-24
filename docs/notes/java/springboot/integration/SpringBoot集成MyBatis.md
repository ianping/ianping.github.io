---
title: SpringBoot集成MyBatis
createTime: 2024/11/24 15:56:15
permalink: /notes/java/600djiyp/
---
## 快速开始

### 1.添加依赖

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>${mybatis-spring-boot-starte.version}</version>
</dependency>
```

### 2.配置

```properties
# mysql
#spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
#spring.datasource.url=jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai
#spring.datasource.username=root
#spring.datasource.password=root

# postgresql
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://192.168.95.128:5432/postgres?currentSchema=blog
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.type=com.zaxxer.hikari.HikariDataSource

mybatis.mapper-locations=classpath:/mapper/**/*.xml
mybatis.type-aliases-package=me.ian.blog.domain.entity
mybatis.configuration.map-underscore-to-camel-case=true
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

### 3.创建实体类对应的Mapper接口和XML映射文件

实体类

```java
```

创建Mapper接口

```java
```

创建XML映射文件

```xml

```

### 4.使用Mapper操作数据库

```java

```

## 使用连接池

### hikariCP

```xml
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
    <version>4.0.3</version>
</dependency>
```

### Druid

添加依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>${druid-spring-boot-starter.version}</version>
</dependency>
```

配置

```properties
```

## 分页查询

### 自定义分页

#### 定义排序策略类

封装排序字段和排序方向

```java
public class Sort {
    private final String field;
    private final Direction direction;

    private Sort(String field, Direction direction){
        this.field = field;
        this.direction = direction;
    }

    public static Sort by(String field, Direction direction){
        return new Sort(field, direction);
    }

    public String getField() {
        return field;
    }

    public Direction getDirection() {
        return direction;
    }
    
    /**
     * 排序方向
     * */
    public static enum Direction {
        ASC,DESC
    }
}
```

#### 定义分页器

封装分页是的limit数量和offset数量，以及0或多个排序策略`Sort`，用于支持多个排序字段

```java
public class Pageable {
    private final int limit;
    private final int offset;
    private final List<Sort> sorts;

    private Pageable(int pageNo, int pageSize, List<Sort> sorts){
        this.limit = pageSize;
        this.offset = pageSize * (pageNo - 1);
        this.sorts = sorts;
    }
	
    public static Pageable of(Integer pageNo, Integer pageSize, Sort... sorts){
        pageNo = (pageNo == null || pageNo < 1) ? 1 : pageNo;
        pageSize = (pageSize == null || pageSize < 1) ? 20 : pageSize;

        return new Pageable(pageNo, pageSize, List.of(sorts));
    }

    public int getLimit() {
        return limit;
    }

    public int getOffset() {
        return offset;
    }

    public List<Sort> getSorts() {
        return sorts;
    }
}
```

#### 定义分页数据类

封装分页数据

```java
@Getter
public class Pager<Item> {
    private static final int DEFAULT_PAGE_NO = 1;
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int DEFAULT_TOTAL_SIZE = 0;

    private final int pageNo;
    private final int pageSize;
    private final int totalPages;
    private final int totalSize;
    private List<Item> items;

    public Pager(Integer pageNo, Integer pageSize, Integer totalSize) {
        this.pageNo = (pageNo == null || pageNo < 1) ? DEFAULT_PAGE_NO : pageNo;
        this.pageSize = (pageSize == null || pageSize < 1) ? DEFAULT_PAGE_SIZE : pageSize;
        this.totalSize = (totalSize == null || totalSize < 0) ? DEFAULT_TOTAL_SIZE : totalSize;

        int totalPages = this.totalSize / this.pageSize;
        this.totalPages = (this.totalSize % this.pageSize != 0) ? totalPages + 1 : totalPages;
        this.items = new ArrayList<>(0);
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }
}
```

#### 使用自定义分页

定义分页DTO类，需要分页的DTO继承它，用于在控制器方法参数中接收分页参数

```java
@Getter
@Setter
public class PageParam {
    private Integer pageNo;
    private Integer pageSize;
    private List<SortParam> sortBy;

    @Getter
    @Setter
    public static class SortParam {
        private String field;
        private Sort.Direction direction;

        // 将客户端传送的ASC, DESC转换为自定义的Sort.Direction枚举类对象
        public void setDirection(String direction) {
            this.direction = Sort.Direction.valueOf(direction);
        }
    }
}
```

需要分页的DTO类继承`PageDTO`即可

```java
@Getter
@Setter
public class SysUserDTO extends PageParam {
	// ...
}
```

在Controller中接口参数

```java
@PostMapping("/user/readers")
public ApiResult<Pager<SysUserVO>> getReaderList(@RequestBody @Validated({ Default.class, Query.class }) SysUserDTO dto){
    return userService.getReaderList(dto);
}
```

在Service中使用分页器时，从业务DTO中获取到分页信息（pageNo, pageSize, 排序策略），用于创建自定义的`Pageable`

```java
@Override
public ApiResult<Pager<SysUserVO>> getReaderList(SysUserDTO dto) {
    Integer pageNo = dto.getPageNo();
    Integer pageSize = dto.getPageSize();
    List<SortParam> sortBy = dto.getSortBy();
    
    Integer status = dto.getStatus();
    String keywords = dto.getKeywords();

    SysRole role = roleMapper.selectByName(READER.name());
    if(role == null) {
        Pager<SysUserVO> pager = new Pager<>(pageNo, pageSize, 0);
        return ApiResult.success(pager);
    }

    // 查询条件
    SysUser condition = new SysUser();
    condition.setRoleId(role.getId());
    condition.setStatus(status);
    condition.setKeywords(keywords);

    // 查询记录总数
    Integer totalSize = userMapper.selectCount(condition);

    // 排序、分页条件
    Pageable pageable = null;
    String sortByField = sortBy.get(0).getField();
    Sort.Direction sortByDirection = sortBy.get(0).getDirection();
    if(StringUtils.hasLength(sortByField) && sortByDirection != null) {
        Sort sort = Sort.by(sortByField, sortByDirection);
        pageable = Pageable.of(pageNo, pageSize, sort);
    } else {
        pageable = Pageable.of(pageNo, pageSize);
    }

    // 分页查询
    List<SysUser> userList = userMapper.selectListByPage(condition, pageable);

    List<SysUserVO> userVOList = userList.stream()
        .map(user -> {
            SysUserVO userVO = new SysUserVO();
            SysRoleVO roleVO = new SysRoleVO();
            userVO.setRole(roleVO);

            BeanUtils.copyProperties(user, userVO);
            BeanUtils.copyProperties(user.getRole(), roleVO);
            return userVO;
        })
        .collect(Collectors.toList());

    Pager<SysUserVO> pager = new Pager<>(pageNo, pageSize, totalSize);
    pager.setItems(userVOList);
    return ApiResult.success(pager);
}
```

在Mapper接口中

```java
Integer selectCount(@Param("condition") SysUser condition);

List<SysUser> selectListByPage(@Param("condition") SysUser condition, @Param("pageable") Pageable pageable);
```

在Mapper xml中，需要注意，提取排序字段和排序方向时，使用`${}`的方式

```xml
<sql id="queryListCommonCondition">
    <if test="condition.roleId != null and condition.roleId != ''">t1.role_id = #{condition.roleId}</if>
    <if test="condition.status != null">AND t1.`status` = #{condition.status}</if>
    <if test="condition.keywords != null and condition.keywords != ''">AND (t1.username LIKE concat('%', #{condition.keywords}, '%') OR t1.nickname LIKE concat('%', #{condition.keywords}, '%') OR t1.email LIKE concat('%', #{condition.keywords}, '%') OR t1.phone LIKE concat('%', #{condition.keywords}, '%'))</if>
</sql>

<select id="selectCount" resultType="int">
    SELECT count(1)
    FROM t_sys_user AS t1
    <where>
        <include refid="queryListCommonCondition"/>
    </where>
</select>

<select id="selectListByPage" resultMap="sysUserResultMap">
    SELECT     t1.*,
    t2.id      AS r_id,
    t2.`name`  AS r_name,
    t2.remark  AS r_remark
    FROM t_sys_user AS t1 LEFT JOIN t_sys_role AS t2 ON t1.role_id = t2.id
    <where>
        <include refid="queryListCommonCondition"/>
    </where>
    <choose>
        <when test="pageable.sorts != null and pageable.sorts.size() > 0">
            <foreach collection="pageable.sorts" item="sort" open="ORDER BY " separator="," close="">
                t1.${sort.field} ${sort.direction}
            </foreach>
        </when>
        <otherwise>
            ORDER BY t1.create_at ASC
        </otherwise>
    </choose>
    LIMIT #{pageable.limit} OFFSET #{pageable.offset}
</select>
```

