---
title: mybatis基础
createTime: 2024/11/24 15:56:15
permalink: /notes/java/rk910ukx/
---
参考：

- 官方文档：https://mybatis.org/mybatis-3/zh_CN/index.html

## 快速开始



## 插入

### 插入单条记录

```xml
<insert id="insert" parameterType="post">
    INSERT INTO t_blog_post(id, category_id, author_id, title, content, seq, enabled)
    VALUES ROW(#{id}, #{categoryId}, #{authorId}, #{title}, #{content}, #{seq}, #{enabled})
</insert>
```

### 插入多条记录

使用动态SQL元素foreach可批量插入

```xml
<insert id="insertList" parameterType="list">
    INSERT INTO t_blog_post(id, category_id, author_id, title, content, seq, enabled)
    <foreach collection="list" item="post" open="VALUES" separator="," close="">
        ROW(#{post.id}, #{post.categoryId}, #{post.authorId}, #{post.title}, #{post.content}, #{post.seq}, #{post.enabled})
    </foreach>
</insert>
```

### 插入部分列

使用动态SQL元素trim可以只插入满足条件的列

```xml
    <insert id="insert" parameterType="post">
        INSERT INTO t_blog_post
        <trim prefix="(" suffix=")" suffixOverrides=",">
            id,
            <if test="categoryId != null and categoryId != ''">category_id,</if>
            <if test="authorId != null and anthorId != ''">author_id,</if>
            <if test="title != null and title != ''">title,</if>
            <if test="content != null and content != ''">content,</if>
            <if test="seq != null">seq,</if>
            <if test="enabled != null">enabled,</if>
        </trim>
        <trim prefix="VALUES ROW(" suffix=")" suffixOverrides=",">
            #{id},
            <if test="categoryId != null and categoryId != ''">#{categoryId},</if>
            <if test="authorId != null and anthorId != ''">#{authorId},</if>
            <if test="title != null and title != ''">#{title},</if>
            <if test="content != null and content != ''">#{content},</if>
            <if test="seq != null">#{seq},</if>
            <if test="enabled != null">#{enabled},</if>
        </trim>
    </insert>
```

### 获取主键值

如果主键字段的值是在SQL语句中生成的，mybatis支持获取主键值，并将其赋值给主键字段属性。

**获取自动生成的主键值**

使用useGeneratedKeys属性，表示主键由数据库自增列自动生成

```xml
<insert id="insert" parameterType="Log" useGeneratedKeys="true" keyColumn="id" keyProperty="id">
    INSERT INTO t_blog_log(content)
    VALUES (#{content})
</insert>
```

**获取非自动生成的主键值**

使用selectKey元素，定义生成主键值的SQL语句，其order属性可选BEFORE或AFTER，表示生成主键语句是在插入语句之前还是之后执行。

```xml
<insert id="insert" parameterType="post">
    <selectKey keyColumn="id" keyProperty="id" resultType="string" order="BEFORE">
        SELECT replace(uuid(), '-', '') FROM dual;
    </selectKey>

    INSERT INTO t_blog_post(id, category_id, author_id, title, content, seq, enabled)
    VALUES ROW(#{id}, #{categoryId}, #{authorId}, #{title}, #{content}, #{seq}, #{enabled})
</insert>
```

### 批量插入



## 更新

### 更新列出的全部列

不管字段值是否为null，只要列在了update语句中，都更新到数据库中

```xml
<update id="update" parameterType="post">
    UPDATE t_blog_post
    SET category_id = #{categoryId},
    author_id = #{authorId},
    title = #{title},
    content = #{content},
    seq = #{seq},
    enabled = #{enabled}
    WHERE id = #{id}
</update>
```

### 更新部分列

使用动态SQL元素set可以只更新满足条件的列。

```xml
<update id="update" parameterType="post">
    UPDATE t_blog_post
    <set>
        <if test="categoryId != null and categoryId != ''">category_id = #{categoryId},</if>
        <if test="authorId != null and authorId != ''">author_id = #{authorId},</if>
        <if test="title != null and title != ''">title = #{title},</if>
        <if test="content != null and content != ''">content = #{content},</if>
        <if test="seq != null">seq = #{seq},</if>
        <if test="enabled != null">enabled = #{enabled}</if>
    </set>
    WHERE id = #{id}
</update>
```

## 删除

### 删除1条记录

```xml
<delete id="deleteByKey" parameterType="string">
    DELETE FROM t_blog_post WHERE id = #{key}
</delete>
```

### 删除多条记录

删除多条记录的时候，需要注意避免没有WHERE的删除语句

```xml
<delete id="deleteList" parameterType="list">
    DELETE FROM t_blog_post
    <where>
        1 <![CDATA[<>]]> 1
        <foreach collection="list" item="key" open="OR id IN(" separator="," close=")">#{key}</foreach>
    </where>
</delete>
```

## 查询

### 使用resultType接收查询结果

resultType适合查询结果是简单数据类型的语句，对于复杂类型，如果列名和对象属性名不匹配，就不能获取到对应列的数据

```xml
<select id="selectByKey" parameterType="string" resultType="post">
    SELECT *
    FROM t_blog_post
    WHERE id = #{key}
</select>
```

可以通过在SQL中设置列别名的方式处理列名和对象属性名无法匹配的情况

```xml
<select id="selectByKey" parameterType="string" resultType="post">
    SELECT id,
    category_id    AS "categoryId",
    author_id      AS "authorId",
    title,
    content,
    seq,
    enabled,
    create_time    AS "createTime",
    update_time    AS "updateTime"
    FROM t_blog_post
    WHERE id = #{key}
</select>
```

### 使用resultMap接收查询结果

resultMap可以定义列名和Java对象属性名的对应关系

```xml
<resultMap id="postResultMap" type="post">
    <id column="id" property="id"/>
    <result column="category_id" property="categoryId"/>
    <result column="author_id" property="authorId"/>
    <result column="create_time" property="createTime"/>
    <result column="update_time" property="updateTime"/>
</resultMap>
```

通过将mybatis设置选项 *mapUnderscoreToCamelCase* 设置为true，并将reseultMap中的 *autoMapping* 属性设置为true，上面的resultMap可简化为

```xml
<resultMap id="postResultMap" type="post" autoMapping="true">
    <id column="id" property="id"/>
</resultMap>
```

### 关联查询：有一个关联对象

mybatis在结果集中使用association元素表示"有一个"的关系。

**嵌套select**

使用property表示属性名，javaType表示属性代表的实体类型，column表示关联列名，会作为参数传递给select指定的映射语句。

下面的代码用于查询文章以及其作者信息。先执行查询文章SQL的SQL语句，然后将author_id列的值作为参数，执行查询作者的SQL语句：

```xml
<resultMap id="postResultMap" type="post" autoMapping="true">
    <id column="id" property="id"/>

    <association property="author" javaType="author" column="author_id" select="selectAuthorByKey" />
</resultMap>


<select id="selectByKey" parameterType="string" resultMap="postResultMap">
    SELECT * FROM t_blog_post WHERE id = #{key}
</select>

<select id="selectAuthorByKey" parameterType="string" resultMap="me.lyp.crud.mapper.AuthorMapper.authorResultMap">
    SELECT * FROM t_blog_author WHERE id = #{key}
</select>
```

**嵌套resultMap**

使用association的resultMap属性，可以将关联查询的嵌套结果集映射为嵌套的Java实体类

```xml
<resultMap id="postResultMap" type="post" autoMapping="true">
    <id column="id" property="id"/>

    <association property="author" javaType="author" resultMap="me.lyp.crud.mapper.AuthorMapper.authorResultMap" columnPrefix="a_"/>
</resultMap>


<select id="selectByKey" parameterType="string" resultMap="postResultMap">
    SELECT t1.*,
    t2.id   AS a_id,
    t2.name AS a_name
    FROM t_blog_post AS t1 LEFT JOIN t_blog_author AS t2 ON t1.author_id = t2.id
    WHERE t1.id = #{key}
</select>
```

### 关联查询：有多个关联对象

mybatis在结果集中使用collection元素表示"有多个"的关系。

**嵌套select**

与association元素类似，只是多了一个ofType属性，表示集合中Java实体的类型

```xml
<resultMap id="postResultMap" type="post" autoMapping="true">
    <id column="id" property="id"/>

    <association property="author" javaType="author" column="author_id" select="selectAuthorByKey" />
    <collection property="tags" javaType="list" ofType="tag" column="id" select="selectTagListByPostKey"/>
</resultMap>


<select id="selectByKey" parameterType="string" resultMap="postResultMap">
    SELECT * FROM t_blog_post WHERE id = #{key}
</select>

<select id="selectAuthorByKey" parameterType="string" resultMap="me.lyp.crud.mapper.AuthorMapper.authorResultMap">
    SELECT * FROM t_blog_author WHERE id = #{key}
</select>

<select id="selectTagListByPostKey" parameterType="string" resultMap="me.lyp.crud.mapper.TagMapper.tagResultMap">
    SELECT *
    FROM t_blog_tag
    WHERE id IN (SELECT tag_id FROM t_blog_post_tag WHERE post_id = #{key})
</select>
```

**嵌套resultMap**

与association元素类似

```xml
<resultMap id="postResultMap" type="post" autoMapping="true">
    <id column="id" property="id"/>

    <association property="author" javaType="author" resultMap="me.lyp.crud.mapper.AuthorMapper.authorResultMap" columnPrefix="a_"/>
    <association property="category" javaType="category" resultMap="me.lyp.crud.mapper.CategoryMapper.categoryResultMap" columnPrefix="c_"/>
    <collection property="tags" javaType="list" ofType="tag" resultMap="me.lyp.crud.mapper.TagMapper.tagResultMap" columnPrefix="t_"/>
</resultMap>


<select id="selectByKey" parameterType="string" resultMap="postResultMap">
    SELECT t1.*,
    t2.id   AS a_id,
    t2.name AS a_name,
    t3.id   AS c_id,
    t3.name AS c_name,
    t3.seq  AS c_seq,
    t5.id   AS t_id,
    t5.name AS t_name
    FROM t_blog_post AS t1 LEFT JOIN t_blog_author   AS t2 ON t1.author_id = t2.id
    LEFT JOIN t_blog_category AS t3 ON t1.category_id = t3.id
    LEFT JOIN t_blog_post_tag AS t4 ON t1.id = t4.post_id
    LEFT JOIN t_blog_tag      AS t5 ON t4.tag_id = t5.id
    WHERE t1.id = #{key}
</select>
```

### 多层嵌套的resultMap

resultMap支持多层嵌套结构。

如果在association或collection元素上指定了columnPrefix列名前缀，那么在SQL的select语句中，必须给相应列加上其所有外层的前缀。

例如：

任务resultMap中嵌套了广告系列collection

![](_/20240123124211.png)

广告系列resultMap中嵌套了广告组

![](_/20240123124212.png)

广告组resultMap中嵌套了广告投放地区association、广告受众细分定位association、广告collection

![](_/20240123124213.png)

在SQL中，需要按照嵌套层次，给相应列加上所有外层前缀

![](_/20240123124214.png)

### 分页查询

```java
// 分页查询条件
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

// 排序字段与顺序
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

// 分页请求参数
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

// 封装分页结果数据
@Getter
public class Pager<Item> {
    private static final int DEFAULT_PAGE_NO = 1;
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int DEFAULT_TOTAL_SIZE = 0;

    private final int pageNo;
    private final int pageSize;
    private final int total;
    private final int pages;
    private List<Item> items;

    public Pager(Integer pageNo, Integer pageSize, Integer total) {
        this.pageNo = (pageNo == null || pageNo < 1) ? DEFAULT_PAGE_NO : pageNo;
        this.pageSize = (pageSize == null || pageSize < 1) ? DEFAULT_PAGE_SIZE : pageSize;
        this.total = (total == null || total < 0) ? DEFAULT_TOTAL_SIZE : total;

        int pages = this.total / this.pageSize;
        this.pages = (this.total % this.pageSize != 0) ? pages + 1 : pages;
        this.items = new ArrayList<>(0);
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }
}
```

## 动态sql
