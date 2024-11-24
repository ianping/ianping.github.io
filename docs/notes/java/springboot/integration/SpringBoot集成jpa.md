---
title: SpringBoot集成jpa
createTime: 2024/11/24 15:56:15
permalink: /notes/java/5sox92um/
---
版本信息：

- Spring Boot 3.2.3
- Spring Data JPA 3.2.3

参考：

- https://docs.spring.io/spring-data/jpa/reference/jpa.html

## 快速开始

1.添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

2.配置数据源

```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root
```

3.定义数据表对应的实体类

```java
@Entity
@Table(name = "t_library_publisher")
public class Publisher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
}
```

6.创建实体Repository

```java
@Repository
public interface PublisherRepository extends CrudRepository<Publisher, Long> {
}
```

7.测试：

```java
@SpringBootTest
public class JpaAppTests {
    @Autowired
    private PublisherRepository publisherRepository;

    @Test
    public void testPublisherRepository(){
        // 新增save
        Publisher publisher = new Publisher();
        publisher.setName("湖南文艺出版社");
        Publisher savedPublisher = publisherRepository.save(publisher);
        System.out.println(savedPublisher);
    }
}
```

## 定义实体类

### 定义实体类

`@Entity`注解标记实体类，`@Table`注解指定表名信息

```java
@Entity
@Table(name = "t_library_book")
public class Book {
    
}
```

### 定义主键字段

#### 普通主键

`@Id`注解标记主键字段。要求数据表列名与字段名相同，可以用`@Column`指定数据表列名

```java
@Id
@Column(name = "id")
private Long id;
```

#### 联合主键

如果数据表主键为联合主键，有2种定义联合主键的方式：`@IdClass` 和 `@EmbeddedId`

`@IdClass`方式示例：

```java
public class PKBorrowRecord implements Serializable {
    private Long bookId;
    private Long readerId;
}

@Entity
@Table(name = "t_library_borrow_record")
@IdClass(PKBorrowRecord.class)
public class BorrowRecord {
    @Id
    private Long bookId;
    @Id
    private Long readerId;
    private Date borrowAt;
    private Date returnAt;
}
```

`@EmbeddedId`方式示例：

```java
@Embeddable
public class PKBorrowRecord implements Serializable {
    private Long bookId;
    private Long readerId;
}

@Entity
@Table(name = "t_library_borrow_record")
public class BorrowRecord {
    @EmbeddedId
    private PKBorrowRecord id;

    private Date borrowAt;
    private Date returnAt;
}
```

#### 自动生成主键

使用`Id`结合`@GeneratedValue`注解，定义自动生成主键。

`@GeneratedValue`注解的`strategy`属性，指定主键生成策略，`GenerationType`枚举类中定义了以下几种策略：

- `TABLE`：使用序列表或主键表存储主键值，每次获取主键值时，从表中生成并获取
- `SEQUENCE`：使用数据库序列生成主键值
- `IDENTITY`：使用数据库自增字段生成主键值
- `UUID`：使用数据库的UUID生成器生成主键值
- `AUTO`，由JPA根据具体的数据库类型，自动选择合适的生成策略

`GenerationType.Table`示例：

首先，需要提供1张主键表

```sql
CREATE TABLE `t_library_id_generator` (
  `pk_name` varchar(30) DEFAULT NULL COMMENT '主键列名称',
  `pk_value` int DEFAULT NULL COMMENT '主键列值'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
```

然后，在`@GeneratedValue`注解中，指定主键生成策略为`TABLE`，并指定主键表生成器。

生成器使用`@TableGenerator`注解定义：指定主键表名、主键列列名、主键值列名、初始值、步进值

```java
@Id
@GeneratedValue(strategy = GenerationType.TABLE, generator = "id_generator")
@TableGenerator(name = "id_generator", table = "t_library_id_generator", pkColumnName = "pk_name", valueColumnName = "pk_value", initialValue = 0, allocationSize = 1)
private Long id;
```

### 定义关联实体

关联关系使用以下几个注解表示：

- `@OneToOne`
- `@OneToMany`
- `@ManyToOne`
- `@@ManyToMany`

定义关联关系使用以下2个注解：

- `@JoinColumn`：通过外键字段建立关联关系
- `@JoinTable`，通过关联表建立关联关系

另外，当在同一个实体中，使用`@JoinColumn`标记的字段和使用`@Column`标记的字段，引用相同的列时，不符合JPA的规定（不允许多个逻辑列指向同一个物理列），需要在其中一个注解中，设置属性`insertable = false, updatable = false`，如下：

```java
@Column(name = "publisher_id")
private Long publisherId;

@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "publisher_id", referencedColumnName = "id", insertable = false, updatable = false)
private Publisher publisher;
```

#### "一对一"

示例：图书表和图书简介表

```java
@Entity
@Table(name = "t_library_book")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String author;
    @Column(name = "publisher_id") private Long publisherId;

    @OneToOne(targetEntity = BookIntro.class, mappedBy = "book", fetch = FetchType.EAGER)
    private BookIntro intro;
}

@Entity
@Table(name = "t_library_book_intro")
public class BookIntro {
    @Id
    @Column(name = "book_id")
    private Long bookId;
    private String intro;

    @OneToOne
    @JoinColumn(name = "book_id", referencedColumnName = "id")
    private Book book;
}
```

#### "一对多" 与 "多对一"

示例：出版社表和图书表

```java
@Entity
@Table(name = "t_library_publisher")
public class Publisher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(targetEntity = Book.class, mappedBy = "publisher", fetch = FetchType.EAGER)
    private List<Book> books;
}

@Entity
@Table(name = "t_library_book")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String author;

    @Column(name = "publisher_id")
    private Long publisherId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "publisher_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Publisher publisher;
}
```

#### "多对多"

示例：图书表和读者表，使用借阅记录表作为中间表

```java
@Entity
@Table(name = "t_library_borrow_record")
@IdClass(PKBorrowRecord.class)
public class BorrowRecord {
    @Id
    @Column(name = "book_id")
    private Long bookId;
    @Id
    @Column(name = "reader_id")
    private Long readerId;

    @Column(name = "borrow_at") private Date borrowAt;
    @Column(name = "return_at") private Date returnAt;
}

@Entity
@Table(name = "t_library_book")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String author;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "t_library_borrow_record",
            joinColumns = { @JoinColumn(name = "book_id", referencedColumnName = "id") },
            inverseJoinColumns = {@JoinColumn(name = "reader_id", referencedColumnName = "id")})
    private List<Reader> readers;
}

@Entity
@Table(name = "t_library_reader")
public class Reader {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToMany(targetEntity = Book.class, mappedBy = "readers",fetch = FetchType.EAGER)
    private List<Book> books;
}
```

### 启用审计功能

使用`@EnableJpaAuditing`注解，开启审计功能，自动填充通用的审计字段

```java
@SpringBootApplication
@EnableJpaAuditing
public class AuthServiceApp {
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApp.class, args);
    }
}
```

在实体类上，使用`@EntityListeners`注解，设置审计字段监听器；

在审计字段上，使用相应的注解，例如：`@CreatedDate`、`@LastModifiedDate`

```java
@Entity
@Table(name = "t_auth_user")
@EntityListeners({AuditingEntityListener.class})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String extraInfo;
    private Integer status;

    @CreatedDate
    private LocalDateTime createTime;
    @LastModifiedDate
    private LocalDateTime updateTime;
}
```

## Repository

`Repository<T, ID>`接口是Spring Data JPA的核心接口，其子接口中预定义了用于CRUD的许多方法

![](./../_/20240308094149.png)

在定义自己的`Repository`时，只需要继承`Repository<T, ID>`接口的某一个子接口即可。

例如：

```java
@Repository
public interface PublisherRepository extends CrudRepository<Publisher, Long> {
}

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
}
```

## Repository预定义的CRUD方法

### 插入记录

预定义的用于插入或更新记录的方法如下：

- `<S extends T> S save(S)`：保存单条记录：如果主键字段为null，则执行插入操作；否则，执行更新操作。返回插入或更新后的记录
- `<S extends T> List<S> saveAll(Iterable<S>)`：保存多条记录

需要注意的是，插入或更新时，JPA生成的sql会设置所有的列。因此，需要为每一个字段设置值，否则，该列将被设置为null。

插入示例：

```java
Book book = new Book();
book.setName("太白金星有点烦");
book.setAuthor("马伯庸");
book.setPublisherId(1L);
Book savedBook = bookRepository.save(book);
```

`@PrePersist`注解可以在插入实体之前执行自定义逻辑，例如设置默认值

```java
@Data
@Entity
@Table(name = "t_book_category")
public class BookCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String description;

    private Integer seq;

    @PrePersist
    public void prePersist(){
        if(seq == null){
            seq = 0;
        }
    }
}
```

### 更新记录

更新示例：

```java
Book book = bookRepository.findById(1L).orElse(null);
book.setName("太白金星有点烦");
Book savedBook = bookRepository.save(book);
System.out.println(savedBook.getName());
```

`@PreUpdate`注解可以在更新实体前执行自定义逻辑。

在JPA中，默认行为是当更新一个实体时，如果字段的值为null，相应的数据库列也会被更新为null。如果想要在更新时不更新字段值为null的列，需要自定义更新操作。

示例：

```java
public class JpaUtils {

    /**
     * 获取Bean中值为null的属性名称
     * */
    public static <T> String[] getNullPropertyNames(T bean){
        Set<String> nullPropertyNames = new HashSet<>();

        BeanWrapper wrapper = new BeanWrapperImpl(bean);
        PropertyDescriptor[] pds = wrapper.getPropertyDescriptors();
        String propertyName;
        for(PropertyDescriptor pd : pds) {
            propertyName = pd.getName();
            if(wrapper.getPropertyValue(propertyName) == null){
                nullPropertyNames.add(propertyName);
            }
        }
        return nullPropertyNames.toArray(new String[0]);
    }
}

@Override
public ApiResponse<BookCategoryVO> update(Long id, BookCategoryDTO dto) {
    // 1.获取已存在的实体
    Optional<BookCategory> optionalCategory = bookCategoryRepository.findById(id);
    if(optionalCategory.isPresent()){
        BookCategory entity = optionalCategory.get();
        // 2.获取新实体中值为null的属性名称数组
        String[] nullPropertyNames = JpaUtils.getNullPropertyNames(dto);
        // 3.将新实体中的非空字段值复制到已存在的实体中
        BeanUtils.copyProperties(dto, entity, nullPropertyNames);
        // 4.更新已存在的实体
        entity = bookCategoryRepository.save(entity);

        BookCategoryVO vo = BeanCopyUtils.copyBean(entity, BookCategoryVO.class);
        return ApiResponse.ok(vo);
    }else{
        throw new BusinessException("图书类别不存在");
    }
}
```



### 删除记录

预定的用于删除记录的方法如下：

- `void deleteById(ID）`：根据主键删除单条记录
- `void deleteAllById(Iterable<? extends ID>)`：根据主键删除多条记录
- `void deleteAll()`：删除全部记录

`@PreRemove`注解可以在删除实体之前执行自定义逻辑。

### 查询记录

#### 查询单条记录

预定义的用于查询单条记录的方法如下：

- `Optional<T> findById(ID)`：根据主键查询单条记录，返回`Optinal<T>`对象

示例：

```java
Optional<Book> bookOptional = bookRepository.findById(2L);
Book book = bookOptional.orElse(null);
```

#### 查询多条记录

预定义的用于查询多条记录的方法如下：

- `List<T> findAll()`：查询全部记录
- `List<T> findAllById(Iterable<ID>)`：根据ID查询多条记录

示例：

```java
List<Long> ids = List.of(1L,2L,3L);
List<Book> books = bookRepository.findAllById(ids);
```

#### 排序和分页查询

JAP中，`PagingAndSortingRepository<T, ID>`接口中定义了用于排序和分页的方法：

- `Iterable<T> findAll(Sort sort)`
- `Page<T> findAll(Pageable pageable)`

排序示例：

```java
Sort sort = Sort.by(Sort.Direction.ASC, "author", "name");
List<Book> books = bookRepository.findAll(sort);
```

分页示例：

```java
int pageNo = 1;
int pageSize = 1;
Sort sort = Sort.by(Sort.Direction.ASC, "author", "name");
Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);
Page<Book> page = bookRepository.findAll(pageable);

pageNo = page.getNumber();
pageSize = page.getSize();
int totalPages = page.getTotalPages();
long totalSize = page.getTotalElements();
List<Book> books = page.getContent();
```

将默认`Page`转换为自定义的分页数据类型

```java
@Data
public class Pager<Item> {
    private int pageNo;
    private int pageSize;
    private int totalPages;
    private int totalSize;
    private List<Item> items;
}

public class JpaUtils {
    public static <Item> Pager<Item> page2Pager(Page<Item> page){
        Pager<Item> pager = new Pager<>();
        pager.setPageNo(page.getNumber());
        pager.setPageSize(page.getSize());
        pager.setTotalPages(page.getTotalPages());
        pager.setTotalSize((int) page.getTotalElements());
        pager.setItems(page.getContent());
        return pager;
    }
}
```



#### 使用`Example`查询

示例：

```java
Book probe = new Book();
probe.setName("太白金星");

ExampleMatcher matcher = ExampleMatcher.matching()
    .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
    .withIgnoreCase()
    .withIgnoreNullValues();

Example<Book> example = Example.of(probe, matcher);
List<Book> books = bookRepository.findAll(example);
```

## 使用根据方法名派生的查询

Repository方法名称构造参考：

https://docs.spring.io/spring-data/jpa/reference/repositories/query-keywords-reference.html

Repository方法返回值类型参考：

https://docs.spring.io/spring-data/jpa/reference/repositories/query-return-types-reference.html

示例：

```java
/**
 * 删除记录: publisher_id NOT IN (?)
 */
void deleteByPublisherIdNotIn(List<Long> publisherIds);

/**
 * 查询1条记录: name = ?
 */
Book findByName(String name);

/**
 * 查询多条记录: name LIKE '%?%'
 */
List<Book> findAllByNameLike(String namePattern);

/**
 * 查询多条记录: publisher_id IN (?) ORDER BY publisher_id ASC
 */
List<Book> findAllByPublisherIdInOrderByPublisherIdAsc(List<Long> publisherIds);
```

## 使用`@Query`

`@Query`注解在Repository方法上，执行给定的SQL语句。

注意：

- 当执行`INSERT`, `UPDATE`, `DELETE`, `DDL`类型的SQL时，需要同时使用`@Modifying`注解
- 当执行`UPDATE`, `DELETE`类型的SQL时，还需要使用`@Transactional`注解开启事务

### 执行原生SQL

```java
@Modifying
@Transactional
@Query(value = "update t_library_book set name = ?2 where id = ?1", nativeQuery = true)
Integer updateName(Long id, String name);
```

### 分页查询

自定义分页查询，只需要传递`Pageable`参数，并返回`Page<T>`类型即可

```java
@Query(value = """
       SELECT *
       FROM t_book
       WHERE category_id = ?1
       AND (title LIKE concat('%', ?2, '%') OR author LIKE concat('%', ?2, '%') OR isbn LIKE concat('%', ?2, '%') OR publisher LIKE concat('%', ?2, '%'))
       """, nativeQuery = true)
       Page<Book> findAll(Long categoryId, String keywords, Pageable pageable);
```

## JPA属性配置

```properties
spring.data.jpa.repositories.enabled=true
spring.jpa.show-sql=true
spring.jpa.database-platform=
spring.jpa.generate-ddl=false
spring.jpa.open-in-view=false
spring.jpa.hibernate.ddl-auto=none
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy
```

