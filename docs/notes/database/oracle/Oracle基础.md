---
title: Oracle基础
createTime: 2024/11/24 15:56:14
permalink: /notes/database/irxnl9ai/
---
学习资料：

- [Oracle官网](https://docs.oracle.com/en/database/oracle/oracle-database/)

## Oracle逻辑架构

**数据库**：数据库是物理上存储数据的仓库，由一组相关的数据文件、控制文件、日志文件、参数文件等物理文件组成。

**实例**：实例是Oracle数据库系统的一个运行环境，是在物理服务器上运行的一个进程，例如orcl。

**表空间**：表空间（模式）是一组逻辑结构或对象的集合，这些对象包括表、视图、索引、序列、存储过程、函数等。

一个数据库可以拥有多个实例、一个实例可以拥有多个表空间。

## Oracle管理员需要掌握的相关操作

### 服务管理

查看实例监听器状态

`lsnrclt status`

### sqlplus

sqlplus登录Oracle服务器

`sqlplus <username>/<password>`

以管理员身份登录

```
root@f08ef4931416:/# sqlplus /nolog

SQL*Plus: Release 12.1.0.2.0 Production on Sun May 19 11:38:49 2024

Copyright (c) 1982, 2014, Oracle.  All rights reserved.

SQL> connect sys as sysdba
Enter password:
Connected.
SQL>
```

### 数据库实例管理



### 表空间管理

查看所有表空间

```sql
SELECT * FROM DBA_TABLESPACES;
```

创建临时表空间

```sql
CREATE TEMPORARY TABLESPACE temp_default
TEMPFILE '/u01/app/oracle/oradata/xe/temp_default.dbf' -- 数据文件路径
SIZE 10M -- 初始大小
AUTOEXTEND ON NEXT 10M MAXSIZE UNLIMITED; -- 开启自动扩展大小, 每次扩展10M, 最大大小无限制
```

创建物理表空间

```sql
CREATE TABLESPACE "default"  
DATAFILE '/u01/app/oracle/oradata/xe/default.dbf'
SIZE 100M  
AUTOEXTEND ON NEXT 10M MAXSIZE UNLIMITED  
LOGGING  -- 对表空间中所有段的更改都将被记录在重做日志中
EXTENT MANAGEMENT LOCAL  -- 表空间使用本地扩展管理
SEGMENT SPACE MANAGEMENT AUTO; -- 启用自动段空间管理
```

创建用户，并设置默认表空间和默认临时表空间

```sql
CREATE USER test IDENTIFIED BY test
DEFAULT TABLESPACE "test"
TEMPORARY TABLESPACE temp_default;
```

给用户授权

```sql
GRANT CONNECT,RESOURCE,DBA TO test;
```

删除表空间

```sql
DROP TABLESPACE "test" INCLUDING CONTENTS AND DATAFILES CASCADE CONSTRAINTS;
```

### 用户权限管理

查看所有用户

```sql
SELECT * FROM dba_users;
```

新建用户

```sql
CREATE USER test IDENTIFIED BY test;
```

删除用户

```sql
DROP USER test CASCADE;
```

给用户设置角色，Oracle用户分为3种角色：

- CONNECT，连接
- RESOURCE，资源
- DBA，管理员

```sql
GRANT CONNECT,RESOURCE,DBA TO test;
```



## Oracle数据类型

参考Oracle官方文档：[Oracle Data Types](https://docs.oracle.com/en/database/oracle/oracle-database/12.2/cncpt/tables-and-table-clusters.html#GUID-A8F3420D-093C-449F-87E4-6C3DDFA8BCFF)

- 字符类型：`CHAR`、`VARCHAR2`、`NCHAR`、`NVARCHAR2`

- 数字类型：`NUMBER`、`BINARY_FLOAT`、`BINARY_DOUBLE`

- 日期类型：`DATE`、`TIMESTAMP`

- `ROWID`

## Oracle内置函数

### 类型转换函数

`TO_CHAR`

```sql
SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH:MI:SS') FROM DUAL;
```

`TO_DATE`

```sql
SELECT TO_DATE('2024-05-25 04:10:38', 'YYYY-MM-DD HH:MI:SS') NOW FROM DUAL; 
```

