---
title: sql增删改
createTime: 2024/11/24 15:56:14
permalink: /notes/database/6jownszu/
---
## 插入记录

### 全列插入

使用`INSERT INTO`语句插入记录。

示例：向图书表中插入1条记录

```sql
INSERT INTO t_book(id, title, author, price, publisher, publish_date, create_at, update_at)
VALUES('9787020002207', '红楼梦', '曹雪芹', 120, '人民文学出版社', '1996-12-01', '2023-03-09', '2023-03-09');
```

进行全列插入时，可以省略列清单

```sql
INSERT INTO t_book
VALUES('9787020002207', '红楼梦', '曹雪芹', 120, '人民文学出版社', '1996-12-01', '2023-03-09', '2023-03-09');
```

### 部分列插入

只插入部分列，列清单只列出部分列

```sql
INSERT INTO t_book(id, title, author, price)
VALUES('9787530210291', '1984', '乔治·奥威尔', 50)
```

### 插入NULL值

插入NULL值，在值清单中，使用`NULL`值

```sql
INSERT INTO t_book(id, title, author, price, publisher, publish_date, create_at, update_at)
VALUES('9787506365437', '活着', '余华', 88, NULL, NULL, '2023-03-09', '2023-03-09')
```

### 插入默认值

插入默认值，可以在值清单中使用`DEFAULT`关键字，也可以在列清单中不列出该列

```sql
-- 使用DEFAULT关键字
INSERT INTO t_book(id, title, author, price)
VALUES('9787020096695', '哈利波特', 'J.K.罗琳', DEFAULT)

-- 省略默认值列
INSERT INTO t_book(id, title, author)
VALUES('9787020096695', '哈利波特', 'J.K.罗琳')
```

### `INSERT...SELECT`语句

`INSERT...SELECT`语句可以将`SELECT`的结果作为值，插入到表中。

示例：复制t_book表中的所有记录到t_book_copy表中

```sql
INSERT INTO t_book_copy
SELECT * FROM t_book 
```

`SELECT`子句后可以有其它子句，例如`WHERE`, `GROUP BY`, `ORDER BY`, `LIMIT`等，只要表结构与`SELECT`结果集兼容即可。

## 更新记录

使用`UPDATE`语句更新表中的数据。

示例：将图书表中价格为0的所有图书，更新其价格为9.9

```sql
UPDATE t_book
SET price = 9.9
WHERE price = 0
```

示例：更新图书表中书名为"活着"的图书，更新其出版社和出版日期

```sql
UPDATE t_book
SET publisher = '作家出版社',
    publish_date= '2012-8-1'
WHERE title= '活着'
```

## 删除记录

使用`DELETE FROM`语句删除表中的记录。

示例：删除读者表中的全部记录

```sql
DELETE FROM t_reader;
```

示例：删除读者表中身份证号为null的记录

```sql
DELETE FROM t_reader WHERE id_card IS NULL;
```

