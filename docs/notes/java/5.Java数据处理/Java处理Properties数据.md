---
title: Java处理Properties数据
createTime: 2024/11/24 15:56:15
permalink: /notes/java/kj60too2/
---
将键值对写入属性文件

```java
Properties properties = new Properties();
properties.setProperty("k1", "v1");
properties.setProperty("k2", "v2");

try(OutputStream out = new FileOutputStream("a.properties");) {
    properties.store(out, "测试数据");
} catch(IOException e) {
    e.printStackTrace();
}
```

从属性文件读取键值对

```java
Properties properties = new Properties();
try(InputStream in = new FileInputStream("a.properties")) {
    properties.load(in);
    Object v1 = properties.get("k1");
    Object v2 = properties.get("k2");
    System.out.printf("k1=%s, k2=%s%n", v1, v2);
} catch(IOException e) {
    e.printStackTrace();
}
```

