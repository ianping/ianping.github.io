---
title: sql查询
createTime: 2024/11/24 15:56:14
permalink: /notes/database/eu1e2o1d/
---
## sql查询子句语法与执行顺序

1个sql查询语句包括1个或多个子句，其语法如下：

```sql
SELECT <DISTINCT> <结果集字段列表>
FROM <表1>
[INNER|LEFT|RIGHT] JOIN <表2> ON <联结条件>
WHERE <过滤条件表达式>
GROUP BY <分组字段列表>
HAVING <分组过滤条件表达式>
ORDER BY <排序字段列表 [ASC|DESC]>
LIMIT <限制结果集记录数> OFFSET <限制开始的行号>
```

sql子句的执行顺序如下：

1. `FROM`子句：确定从哪个表中取数据。如果存在多表联结，就按照联结条件进行组合，返回结果集
2. `WHERE`子句：过滤不满足条件的记录
3. `GROUP BY`子句：将WHERE过滤后的结果集进行分组，
4. 聚合函数：执行`SELECT`中的聚合计算：求和、计数等
5. `HAVING`子句：对分组、聚合的结果集进行过滤
6. `SELECT`子句：执行完所有的过滤条件后，从结果集中选取需要的列
7. `DISTINCT`：从`SELECT`子句的结果集中，去除重复的记录
8. `ORDER BY`子句：对结果集进行排序
9. `LIMIT`子句：限制结果集返回的记录数

## `SELECT`子句

`SELECT`子句指定结果集包含的列。1个sql至少需要包含`SELECT`子句

```sql
SELECT '9787020002207', '红楼梦', 120, CURRENT_DATE;
```

可以为列设置别名

```sql
SELECT '9787020002207' AS id, '红楼梦' AS title, 120 AS price, CURRENT_DATE AS create_at;
```

如果别名为非英文字母、数字、下划线，需要用双引号括起来

```sql
SELECT '9787020002207' AS "编号", '红楼梦' AS "书名", 120 AS "价格", CURRENT_DATE AS "创建时间";
```

## `FROM`子句

`FROM`子句指定要查询的数据表。

`SELECT`子句中，使用星号*表示查询所有列

```sql
SELECT *
FROM t_book;
```

查询列出的列

```sql
SELECT id, title, author, price
FROM t_book;
```

## `WHERE子句`

`WHERE`子句用于过滤结果集。

在条件表达式中，可以使用各种运算符：

- 算术运算符：`+ - * /`
- 比较运算符：`= <> > >- < <=`
- 逻辑运算符：`NOT AND OR`

还可以使用以下谓词：

- `LIKE`：`_`表示1个任意字符，`%`表示0或多个任意字符

- `IS NULL` `IS NOT NULL`

- `BETWEEN`
- `IN` `NOT IN`
- `EXISTS` `NOT EXISTS`

需要注意的是，`NULL`与任何数进行算术或比较运算，结果都是`NULL`，也不能参与逻辑运算，结果是不确定的。

错误示例：

```sql
SELECT 0 > NULL;

SELECT 0 - NULL;

SELECT 1 <> 2 AND NULL
```

在条件表达式中使用`NULL`时，要用`IS NULL` 或 `IS NOT NULL`

正确示例：

```sql
SELECT *
FROM t_book
WHERE publisher IS NOT NULL;
```

## `DISTINCT`去重

`DISTINCT`关键词可以对`SELECT`的结果集进行去重，支持对多列的组合去重。

示例：从图书表中查询所有的作者

```sql
SELECT DISTINCT author FROM t_book;
```

## 聚合函数与`GROUP BY`、`Having`子句

### 聚合函数

5个常用的聚合函数：

- `COUNT`：统计记录数量
- `SUM`：求和
- `AVG`：求平均值
- `MIN`：求最小值
- `MAX`：求最大值

聚合函数在进行统计时，会自动去除值为NULL的记录。不过，对于`COUNT`函数，可以使用`count(*)` 或 `count(1)`的方式，使其包括NULL值记录。

示例：

```sql
SELECT count(price), count(*), count(1),
		min(price),
        max(price),
        sum(price),
        avg(price)
FROM t_book;
```

聚合函数中，支持先使用`DISTINCT`去除重复记录后，再进行统计。

示例：统计图书表中图书作者的数量

```sql
SELECT count(DISTINCT author) AS "authors" FROM t_book;
```

### `GROUP BY`子句

`GROUP BY`子句将表中的记录按照聚合键进行分组，然后进行聚合计算。

使用`GROUP BY`子句时，`SELECT`子句中只能存在以下3种元素：

- 常数
- 聚合函数
- 聚合键(GROUP BY中指定的列名)

另外，因为sql执行顺序：`GROUP BY`子句在前，`SELECT`子句在后：

- `GROUP BY`以及`HAVING`子句中，不能使用列别名，因为此时还没定义列别名

- 同样的道理，在`WHERE`子句中也不能使用聚合函数，因为此时还没进行分组、聚合

示例：统计图书表中，每个出版社图书的数量、总价、平均价、最高单价、最低单价

```sql
SELECT publisher      AS "出版社",
       count(price)   AS "数量",
       sum(price)     AS "总价",
       avg(price)     AS "均价",
       max(price)     AS "最高单价",
       min(price)     AS "最低单价"
FROM t_book
GROUP BY publisher
```

### `HAVING`子句

`HAVING`子句对分组、聚合结果进行过滤。

`HAVING`子句中可以使用常数、聚合键、聚合函数构造分组过滤条件表达式。

示例：统计图书表中，每个出版社图书的数量、总价、平均价、最高单价、最低单价，排除出版社为NULL，且总价小于100的记录

```sql
SELECT publisher      AS "出版社",
       count(price)   AS "数量",
       sum(price)     AS "总价",
	   avg(price)     AS "均价",
       max(price)     AS "最高单价",
	   min(price)     AS "最低单价"
FROM t_book
GROUP BY publisher
HAVING publisher IS NOT NULL
   AND sum(price) > 100
```

## `ORDER BY`子句

`ORDER BY`子句对结果集进行排序。

可以在排序键后使用`ASC`或`DESC`关键字，指定排序数量；另外，可以指定多个排序键。

示例：查询图书表中的所有记录，按照出版社和作者名升序排序（字典顺序）

```sql
SELECT *
FROM t_book
ORDER BY publisher ASC, author ASC
```

需要注意的是，当排序键的列包括NULL值时，NULL值记录会排在结果集的开头或末尾（取决于具体DBMS的实现）。

不过，借助一些NULL相关的方言函数，或者CASE表达式，可以明确的将NULL值记录排在结果集的开头或者末尾。

例如：查询图书表中的所有记录，按照出版社和作者名升序排序（字典顺序），出版社为NULL的排最前面

```sql
SELECT *
FROM t_book
ORDER BY (CASE WHEN publisher IS NOT NULL THEN 1 ELSE 0 END) ASC, publisher ASC, author ASC;
```

## `LIMIT`子句

`LIMIT`子句用于限制结果集的大小，结合`OFFSET`关键字，可以实现分页查询。

示例：查询图书表中，按照图书名称排序后的前3本图书

```sql
SELECT *
FROM t_book
ORDER BY title
LIMIT 3 OFFSET 0
```

示例：查询图书表中，价格最高的图书

```sql
SELECT *
FROM t_book
WHERE price IS NOT NULL
ORDER BY price DESC
LIMIT 1
```

## 视图

视图(View)是一种虚拟表，其内部存储sql查询语句，而不是数据。

### 创建视图

使用`CREATE VIEW`语句创建视图，语法如下：

```sql
CREATE VIEW <视图名>(<视图列名1>, <视图列名2>) AS (
	<SELECT语句>
)
```

创建视图需要注意以下2点：

- 不要在SELECT语句中使用`ORDER BY`子句
- 不推荐基于视图创建视图

示例：创建视图，将读者按照性别分组，统计每种性别的读者人数

```sql
CREATE VIEW v_readers_group_by_gender(gender, readers) AS (
	SELECT gender, count(1)
	FROM t_reader
	GROUP BY gender
)
```

### 使用视图

使用视图进行`SELECT`查询时，可以将其视作数据表。

示例：使用视图查询每种性别的读者人数

```sql
SELECT * FROM v_readers_group_by_gender;
```

使用视图进行更新操作(`INSERT`, `UPDATE`, `DELETE`)，有严格的限制，不推荐对视图进行更新操作。

### 删除视图

使用`DROP VIEW`语句删除视图

```sql
DROP VIEW v_readers_group_by_gender;
```

如果要删除的视图存在关联视图，需要使用`CASCADE`关键字

```sql
DROP VIEW v_readers_group_by_gender CASCADE;
```

## 子查询

### 语法

子查询可以理解为"一次性视图"。

通常将子查询语句放到一对括号`()`中，然后使用`AS`关键字指定子查询的名称，例如：

```sql
SELECT gender, readers FROM
(
	SELECT gender, count(1) AS readers
	FROM t_reader
	GROUP BY gender
) AS readers;
```

子查询可以嵌套子查询，不过不推荐编写嵌套层次太深的子查询。

### 标量子查询

标量子查询是指返回单一值的子查询（有且只有1个值）。可以用在sql中任何允许单一值的地方。

在`SELECT`子句中使用标量子查询，示例：

```sql
-- 查询图书信息，包括所有图书的平均价格
SELECT *, (SELECT avg(price) FROM t_book) AS "平均价格"
FROM t_book
```

在`WHERE`子句中使用标量子查询，示例：

```sql
-- 查询价格大于平均值的图书
SELECT *
FROM t_book
WHERE price > (SELECT avg(price) FROM t_book)
```

### 关联子查询

关联子查询涉及外部查询和内部查询之间的关联：外部查询的每一行记录传递1个值给内部查询，内部查询中使用这个值进行查询，返回相应的记录。

关联子查询常用于以下场景：

- 在细分的组内进行比较
- 与`EXISTS`或`NOT EXISTS`结合使用

在细分的组内进行比较，示例：

```sql
-- 查询每个出版社中, 价格大于各个出版社图书平均价格的图书
SELECT t1.*
FROM t_book AS t1
WHERE price > (
  	SELECT avg(price)
	FROM t_book AS t2
	WHERE t1.publisher = t2.publisher
	GROUP BY publisher
)
```

与`EXISTS`或`NOT EXISTS`结合使用，示例：

```sql
-- 查询从来没有出借过的图书
SELECT *
FROM t_book AS t1
WHERE NOT EXISTS(
	SELECT *
	FROM t_borrow_record AS t2
	WHERE t1.id = t2.book_id
)
```

## 集合操作

在sql中，数据表、视图、`SELECT`结果集等都属于集合。

在进行集合运算时，参与运算的各个集合必须满足以下要求：

- 列数一致
- 各列数据类型一致
- `ORDER BY`子句只能在最后一个`SELECT`语句中出现1次

### `UNION`：并集

`UNION`进行并集计算，自动去重重复记录，使用`UNION ALL`可以保留重复记录。

示例：

```sql
SELECT id, title, publisher FROM t_book WHERE publisher = '人民文学出版社'
UNION
SELECT id, title, publisher FROM t_book WHERE publisher = '译林出版社'
ORDER BY publisher
```

### `INTERSECT`：交集

`INTERSECT`进行交集计算，自动去重，使用`INTERSECT ALL`可以保留重复记录。

示例：

```sql
SELECT id, title, publisher, publish_date FROM t_book WHERE publisher = '人民文学出版社'
INTERSECT ALL
SELECT id, title, publisher, publish_date FROM t_book WHERE publish_date IS NULL
ORDER BY publisher
```

### `EXCEPT`：差集

`EXCEPT`进行差集计算。

示例：

```sql
SELECT id, title, author, publisher FROM t_book WHERE publisher = '人民文学出版社'
EXCEPT
SELECT id, title, author, publisher FROM t_book WHERE author = '曹雪芹'
ORDER BY publisher
```

## 联结查询

联结查询是指通过联结条件，将多个表中的数据组合起来，形成新的结果集。

### `INNER JOIN`：内联接

内联结将2张表中满足联结条件的记录组合起来，形成新的结果集。

示例：

```sql
SELECT t1.*, t2.address
FROM t_reader AS t1 INNER JOIN t_address AS t2 ON t1.address_id = t2.id
```

### `LEFT OUTER JOIN`：左外联结

以左表为主表，将主表中的所有记录与右表中满足联结条件的记录组合起来，形成新的结果集。

`LEFT OUTER JOIN`可以简写为`LEFT JOIN`。

示例：

```sql
SELECT t1.*, t2.address
FROM t_reader AS t1 LEFT JOIN t_address AS t2 ON t1.address_id = t2.id
```

### `RIGHT OUTER JOIN`：右外联结

以右表为主表，将主表中的所有记录与左表中满足联结条件的记录组合起来，形成新的结果集。

`RIGHT OUTER JOIN`可以简写为`RIGHT JOIN`。

示例：

```sql
SELECT t1.*, t2.address
FROM t_reader AS t1 RIGHT JOIN t_address AS t2 ON t1.address_id = t2.id
```

### `CROSS JOIN`：交叉联结

交叉联结不能指定联结条件，对2张表的所有记录进行交叉组合，其结果集是笛卡尔积。

示例：

```sql
SELECT t1.*, t2.address
FROM t_reader AS t1 CROSS JOIN t_address AS t2
```

## 高级查询

### `CASE`表达式

`CASE`表达式是一种条件表达式，基于不同的条件返回不同的值。

`CASE`表达式分为2种：简单`CASE`表单式和搜索`CASE`表达式

#### 简单`CASE`表单式

语法如下：

```sql
CASE <表达式>
	WHEN <值表达式> THEN <返回值表达式>
	WHEN <值表达式> THEN <返回值表达式>
	...
	ELSE <默认返回值表达式>
END
```

示例：

```sql
-- 查询读者的性别, male展示为"男", female展示为"女"
SELECT name AS "姓名",
       (CASE gender WHEN 'male' THEN '男' WHEN 'female' THEN '女' ELSE NULL END) AS "性别"
FROM t_reader
```

#### 搜索`CASE`表达式

语法如下：

```sql
CASE
  	WHEN <条件表达式> THEN <返回值表达式>
	WHEN <条件表达式> THEN <返回值表达式>
	...
	ELSE <默认返回值表达式>
END
```

示例：

```sql
-- 按照出版年份将图书分类为: 新书, 旧书, 未知
SELECT title,
       (CASE WHEN extract(YEAR FROM publish_date) >= 2000 THEN '新书' WHEN extract(YEAR FROM publish_date) < 2000 THEN '旧书' ELSE '未知' END) "新旧类别"
FROM t_book
```

### CTE表达式

CTE(Common Table Expressions，公用表表达式)，用于在查询中定义临时性的结果集。

CTE语法如下：

```sql
WITH <CTE名称> [<列1>, <列2>, ...] AS(
	-- CTE查询定义语句
)

-- 使用CTE
SELECT * FROM <CTE名称>
```

示例：

```sql
WITH cte(book, reader, borrow_at, return_at) AS(
  SELECT t2.title, t3.name, t1.borrow_at, t1.return_at
  FROM t_borrow_record AS t1 LEFT JOIN t_book   AS t2 ON t1.book_id = t2.id
							 LEFT JOIN t_reader AS t3 ON t1.reader_id = t3.id
)

SELECT * FROM cte WHERE book = '红楼梦';
```

### `EXISTS`谓词

### 窗口函数

窗口函数，也叫做OLAP函数(Online Analytical Procession，实时分析处理)。只能用在`SELECT`子句中。

窗口函数包括：

- 5个聚合函数：`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
- OLAP专用函数：`RANK`, `DENSE_RANK`, `ROW_NUMBER`等

窗口函数语法：

```sql
<窗口函数> OVER ([PARTITION BY <分区列清单>] ORDER BY <排序列清单>)
```

示例：使用`RANK()`窗口函数计算排名

```sql
-- 获取每个出版社中图书按照价格从低到高排序的序号
SELECT id, title, publisher, price, RANK() OVER (PARTITION BY publisher ORDER BY price ASC) AS ranking
FROM t_book
```

![](./../_/20240310165412.png)

`PARTITION BY`不是必须的，如果不写，表示将整张表视为1个分区。示例：

```sql
SELECT id, title, publisher, price, RANK() OVER (/*PARTITION BY publisher*/ ORDER BY price ASC) AS ranking
FROM t_book
```

![](./../_/20240310165708.png)

`RANK`, `DENSE_RANK` 和 `ROW_NUMBER` 窗口函数的区别，示例：

```sql
SELECT id, title, publisher, price, 
       RANK() OVER (/*PARTITION BY publisher*/ ORDER BY price ASC) AS ranking,
	   DENSE_RANK() OVER (/*PARTITION BY publisher*/ ORDER BY price ASC) AS dense_ranking,
	   ROW_NUMBER() OVER (/*PARTITION BY publisher*/ ORDER BY price ASC) AS row_num
FROM t_book
```

![](./../_/20240310170608.png)

将聚合函数作为窗口函数使用，示例：

```sql
SELECT title, publisher, price,
       count(1)   OVER (PARTITION BY publisher ORDER BY publisher) AS "图书数量",
       sum(price) OVER (PARTITION BY publisher ORDER BY publisher) AS "图书总价",
	   avg(price) OVER (PARTITION BY publisher ORDER BY publisher) AS "平均价格",
	   min(price) OVER (PARTITION BY publisher ORDER BY publisher) AS "最低价格",
	   max(price) OVER (PARTITION BY publisher ORDER BY publisher) AS "最高价格"
FROM t_book
```

![](./../_/20240310172150.png)
