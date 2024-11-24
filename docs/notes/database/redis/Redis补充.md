---
title: Redis补充
createTime: 2024/11/24 15:56:14
permalink: /notes/database/alsp7lbh/
---
### 慢查询日志

### 配置

```
# 慢查询的时长(微妙):默认10000,即10ms; 0表示记录所有命令; 负数表示禁用慢查询日志
slowlog-log-slower-than 10000

# 慢查询日志最大数量: 默认128, 超出设置的数量时, 删除最早的1条
slowlog-max-len 128
```

### 使用

`slowlog len`：查看日志数量

`slowlog get [n]`：查看日志内容，默认查看所有，可以指定数量

`slowlog reset`：重置日志

## BigKey

识别BigKey

`redis-cli --bigkeys`