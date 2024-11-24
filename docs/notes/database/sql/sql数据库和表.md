---
title: sql数据库和表
createTime: 2024/11/24 15:56:14
permalink: /notes/database/pqmd808e/
---
# sql数据库和表

:::tip

数据库：PostgreSQL 16.1

:::

## 数据库

### 创建数据库

```sql
CREATE DATABASE library;
```

### 删除数据库

```sql
DROP DATABASE library;
```

## 数据表

### 创建表

使用`CREATE TABLE`语句创建表，语法如下：

```sql
CREATE TABLE <表名>(
	<列名1> <数据类型> <列约束>,
    <列名1> <数据类型> <列约束>,
    ...
    <表约束1>,
    <表约束2>,
    ...
);
```

以图书馆管理系统为例（简化版）：

图书表

```sql
CREATE TABLE "t_book" (
  "id" char(13)  NOT NULL,
  "title" varchar(100)  NOT NULL,
  "author" varchar(50) ,
  "price" numeric(10,2) DEFAULT 0,
  "publisher" varchar(50) ,
  "publish_date" date,
  "create_at" date DEFAULT CURRENT_DATE,
  "update_at" date DEFAULT CURRENT_DATE,
  CONSTRAINT "t_book_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "title_ukey" UNIQUE ("title")
)
```

读者表

```sql
CREATE TABLE "t_reader" (
  "id" char(10)  NOT NULL,
  "id_card" char(18) ,
  "name" varchar(50)  NOT NULL,
  "gender" varchar(6) ,
  "address_id" int4,
  "create_at" date DEFAULT CURRENT_DATE,
  "update_at" date DEFAULT CURRENT_DATE,
  CONSTRAINT "t_reader_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "t_address" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "address_id_ukey" UNIQUE ("address_id")
)
```

地址表

```sql
CREATE TABLE "t_address" (
  "id" int4 NOT NULL,
  "address" varchar(150) NOT NULL,
  CONSTRAINT "t_address_pkey" PRIMARY KEY ("id")
)
```

借阅记录表

```sql
CREATE TABLE "t_borrow_record" (
  "reader_id" char(10) NOT NULL,
  "book_id" char(13) NOT NULL,
  "borrow_at" date DEFAULT CURRENT_DATE,
  "return_at" date,
  CONSTRAINT "t_borrow_record_pkey" PRIMARY KEY ("reader_id", "book_id")
)
```

### 更新表

使用`ALTER TABLE`语句更新表。

#### 增加列

更新读者表，增加1列，表示最大可借图书数量

```sql
ALTER TABLE t_reader ADD COLUMN max_borrowable int2;

/*增加列，同时添加列约束*/
ALTER TABLE t_reader ADD COLUMN max_borrowable int2 DEFAULT 0;
```

#### 删除列

```sql
ALTER TABLE t_reader DROP COLUMN max_borrowable;
```

#### 添加约束

给读者表的address_id列添加外键约束，引用地址表的id列，级联删除，级联更新

```sql
ALTER TABLE t_reader
ADD CONSTRAINT "address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "t_address" ("id")
ON DELETE CASCADE ON UPDATE CASCADE;
```

### 删除表

使用`DROP TABLE`语句删除表

```sql
DROP TABLE t_address;
```

如果表中存在被引用的列（被其它表外键引用），需要添加`CASCADE`关键字，会将其它表中的引用删除

```sql
DROP TABLE t_address CASCADE;
```

## 约束

### 主键约束

使用`PRIMARY KEY`指定主键，需要在定义表的时候设置主键。

主键约束名通常为：*表名_pkey*

```sql
CREATE TABLE <表名> (
  	"id" <数据类型>  NOT NULL,
	...
    CONSTRAINT <主键约束名> PRIMARY KEY (<id>)
)
```

### 外键约束

使用`FOREIGN KEY`指定外键约束。

外键既可以在定义表时设置，也可使用`ALTER TABLE`语句设置。

外键约束名通常为：*列名_fkey*

定义表时设置外键约束

```sql
CREATE TABLE <表名> (
    <外键列名> <数据类型>,
	...
    CONSTRAINT <外键约束名> FOREIGN KEY (<外键列名>) REFERENCES <关联表名> (<关联表ID>) ON DELETE CASCADE ON UPDATE CASCADE,
);
```

使用`ALTER TABLE`语句设置外键

```sql
ALTER TABLE <表名>
ADD CONSTRAINT <外键约束名> FOREIGN KEY (<外键列名>) REFERENCES <关联表名> (<关联表ID>)
ON DELETE CASCADE ON UPDATE CASCADE;
```

### 唯一键约束

使用`UNIQU`设置唯一键约束。

唯一键约束既可以在定义表的时候设置，也可以使用`ALTER TABLE`语句设置。

唯一键约束名通常为：*列名_ukey*

```sql
ALTER TABLE <表名>
ADD CONSTRAINT <唯一键约束名> UNIQUE (列名);
```

### Null约束

使用`NULL`或`NOT NULL`设置Null约束。列默认具有NULL约束

```sql
CREATE TABLE <表名> (
  <列名1> <数据类型> NULL,
  <列名2> <数据类型> NOT NULL,
  ...
)
```

### 默认值约束

使用`DEFAULT`设置默认值约束

```sql
CREATE TABLE <表名> (
	<列名> <数据类型> DEFAULT <默认值>,
    ...
)
```

### 检查约束

使用`CHECK(条件表达式)`设置检查约束，限制某一列必须满足给定的条件。

例如：对读者表中的max_borrowable列添加约束，限制值范围为0-10

```sql
ALTER TABLE "t_reader"
ADD CONSTRAINT "max_borrowable_check" CHECK (max_borrowable BETWEEN 0 AND 10);
```

