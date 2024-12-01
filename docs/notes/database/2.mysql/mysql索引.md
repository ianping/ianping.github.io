---
title: mysql索引
createTime: 2024/11/24 15:56:14
permalink: /notes/database/6ixixr0m/
---
## 索引DDL语句

### 创建索引

```sql
-- 创建唯一索引
CREATE UNIQUE INDEX uk_employee_id ON t_salary(employee_id);

-- 创建单列索引
CREATE INDEX idx_employee_id ON t_salary(employee_id);

-- 创建复合索引
CREATE INDEX idx_username ON t_salary(firstname, lastname);

-- 创建索引，并指定索引算法
CREATE INDEX idx_employee_id ON t_salary(employee_id) USING BTREE;
```

### 删除索引

```sql
DROP INDEX idx_username ON t_salary;
```

