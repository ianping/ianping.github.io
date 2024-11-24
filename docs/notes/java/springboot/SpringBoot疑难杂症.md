---
siebar: auto
title: SpringBoot疑难杂症
createTime: 2024/11/24 15:56:15
permalink: /notes/java/nmzuz02y/
---

# SpringBoot疑难杂症

**升级springboot3后，无法识别参数名称**

报错：

```
java.lang.IllegalArgumentException: Name for argument of type [java.lang.Long] not specified, and parameter name information not available via reflection. Ensure that the compiler uses the '-parameters' flag.]
```

解决：

显式指定参数名：

- `@RequestParam("ids") List<Long> ids`
- `@PathVariable("id") Long id`

