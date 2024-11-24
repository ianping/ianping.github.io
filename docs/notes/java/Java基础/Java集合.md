---
title: Java集合
createTime: 2024/11/24 15:56:15
permalink: /notes/java/1kv0bi2k/
---
## `Iterable<T>`



## `Collection<E>`

### `List<E>`

#### `ArrayList<E>`

#### `LinkedList<E>`

### `Set<E>`

#### `HashSet<E>`



#### `LinkedHashSet<E>`



#### `TreeSet<E>`



### `Queue<E>`



#### `PriorityQueue<E>`



### `Deque<E>`

#### `ArrayDeque<E>`



## `Map<K,V>`

### `HashMap<K,V>`



### `LinkedHashMap<K,V>`



### `TreeMap<K,V>`



## 历史遗留的集合

### `Vector<E>`



### `Stack<E>`



### `Properties`

用于处理属性(.properties)文件的类, 继承自`Hashtable`.

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



### `Hashtable<K,V>`



## `Collections`和`Arrays`工具类

### `Collections`



### `Arrays`