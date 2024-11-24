---
title: Java新特性总结
createTime: 2024/11/24 15:56:15
permalink: /notes/java/g96maqvk/
---
参考：[Oracle JDK Release Notes](https://www.oracle.com/java/technologies/javase/jdk-relnotes-index.html)

## 8

### 接口中的默认方法和静态方法

```java
public interface MyInterface {

    void foo();
    void bar();
    
    default void defaultMethod(){
        
    }
    
    static void staticMethod(){
        
    }
}
```

### 函数式接口

函数式接口表示有且仅有1个抽象方法的接口。

注意，`java.lang.Object`中的方法不计入数量。可以存在非抽象的default方法或static方法。

函数式接口用于接收Lambda表达式和方法引用。

定义函数式接口时，推荐用`@FunctionalInterface`注解进行标注

```java
@FunctionalInterface
public interface CustomFunctionalInterface {
    void foo();
}
```

`java.util.function`包中预定义了许多函数是接口，常见的几个如下：

| 函数式接口          | 函数签名            |
| ------------------- | ------------------- |
| `Predicate<T>`      | `T -> boolean`      |
| `BiPredicate<T, U>` | `(T, U) -> boolean` |
| `Consumer<T>`       | `T -> void`         |
| `BiConsumer<T, U>` |(T, U) -> void|
| `Supplier<T>`   |`() -> T`|
| `Function<T, R>` |`T -> R`|
| `BiFunction<T, U, R>` |`(T, U) -> R`|

还有一些老版本的API接口，在Java8中，也被声明成了函数式接口，常见的几个如下：

| 函数式接口                         | 函数签名        |
| ---------------------------------- | --------------- |
| `java.lang.Runnable`               | `() -> void`    |
| `java.util.concurrent.Callable<V>` | `() -> V`       |
| `java.util.Comparator<T>`          | `(T, T) -> int` |

### Lambda表达式

Lambda表达式有2种语法风格：

1. 表达式风格

    ```
    (parameters) -> expression
    ```

1. 块风格

    ```
    (parameters) -> { statements }
    ```

Lambda表达式可以使用函数式接口接收，有效的Lambda表达式示例：

```java
Function<String, Integer> function = (String s) -> s.length();
Predicate<Integer> predicate = (Integer i) -> i > 0;
BiConsumer<Integer, Integer> biConsumer = (Integer a, Integer b) -> System.out.println(a + b);
Supplier<Integer> supplier = () -> 1;
Comparator<Integer> comparator = (Integer a, Integer b) -> a.compareTo(b);
```

Lambda表达式中，允许使用自由变量(定义在外层作用域的变量)。但是，不允许在Lambda中修改自由局部变量，推荐将其声明为final变量。

不推荐的写法

```java
int  a = 1;
private void foo(int b){
    int c = 1;
    Consumer<Integer> function = (Integer i) -> {
        a = a + 1; // 修改实例变量(静态变量), OK
        b = b + 1; // 修改外层方法参数, 报错
        c = c + 1; // 修改外层局部变量, 报错
    };
}
```

推荐的写法，将自由局部变量声明为final

```java
int  a = 1;
private void foo(final int b){
    final int c = 1;
    Consumer<Integer> function = (Integer i) -> {
        a = a + 1; // 实例变量(静态变量), 允许修改
    };
}
```

### 方法引用和构造函数引用

#### 方法引用

方法引用是Lambda表达式的快捷写法，如果1个Lambda表达式仅仅是调用目标的某个方法，就可以使用方法引用进行替换。

方法引用主要有3类

| 方法引用                    | 等价的Lambda表达式                                  | 说明                    |
| --------------------------- | --------------------------------------------------- | ----------------------- |
| `ClassName::staticMethod`   | `(args) -> ClassName.staticMethod(args)`            | 调用静态方法            |
| `ClassName::instanceMethod` | `(instance, args) -> instance.instanceMethod(args)` | instance是ClassName类型 |
| `obj::instanceMethod`       | `(args) -> obj.instanceMethod(args)`                | obj是已存在的对象       |

#### 构造函数引用

构造函数引用语法为：`ClassName::new`。

示例：

| 构造函数签名         | 构造函数引用     | 等价的Lambda表达式                    |
| -------------------- | ---------------- | ------------------------------------- |
| `ClassName()`        | `ClassName::new` | `() -> new ClassName()`               |
| `ClassName(T, U)`    | `ClassName::new` | `(t, u) -> new ClassName(t, u)`       |
| `ClassName(T, U, V)` | `ClassName::new` | `(t, u, v) -> new ClassName(t, u, v)` |

### Stream API

#### 中间操作

- 过滤

    ```java
    List<Integer> result = nums.stream().filter(num -> num % 2 == 0).collect(Collectors.toList());
    ```

- 去重

    ```java
    List<Integer> result = nums.stream().distinct.collect(Collectors.toList());
    ```

- 限制元素个数

  ```java
  List<Integer> result = nums.stream().limit(3).collect(Collectors.toList());
  ```

- 跳过前n个元素

  ```java
  List<Integer> result = nums.stream().skip(3).collect(Collectors.toList());
  ```

- 映射

  ```java
  List<Integer> result = nums.stream().map(num -> num * 2).collect(Collectors.toList());
  ```

- 流的扁平化

  ```java
  List<String> words = Arrays.asList("hello", "world");
  List<String> result = words.stream()
      .map(word -> word.split(""))
      .flatMap(Arrays::stream)
      .collect(Collectors.toList());
  System.out.println(result); // [h, e, l, l, o, w, o, r, l, d]
  ```

#### 终端操作

- 遍历

  ```java
  nums.stream().forEach(System.out::println);
  ```

- 计数

  ```java
  long result = nums.stream().count();
  ```

- 获取第一个元素

  ```java
  Integer result = nums.stream().findFirst().orElse(null);
  ```

- 获取任意一个元素

  ```java
  Integer result = nums.stream().findAny().orElse(null);
  ```

- 匹配任意一个元素

  ```java
  boolean result = nums.stream().anyMatch(num -> num > 10);
  ```

- 匹配全部元素

  ```java
  boolean result = nums.stream().allMatch(num -> num > 10);
  ```

- 不匹配全部元素

  ```java
  boolean result = nums.stream().noneMatch(num -> num > 10);
  ```

- 归约

  ```java
  // 求和
  Integer result = nums.stream().reduce(0, Integer::sum); // 初始值0
  Optional<Integer> result = nums.stream().reduce(Integer::sum); // 无初始值
  ```

#### 数值流

- 普通流转换为数值流

  ```java
  IntStream intStream = nums.stream().mapToInt(Integer::valueOf);
  DoubleStream doubleStream = nums.stream().mapToDouble(Integer::valueOf);
  LongStream longStream = nums.stream().mapToLong(Integer::valueOf);
  ```

- 数值流转换为普通流

  ```java
  Stream<Integer> Integerstream = intStream.boxed();
  ```

- 生成数值范围流

  ```java
  IntStream intRangeStream = IntStream.range(1, 10);              // [1, 10)
  IntStream intRangeClosedStream = IntStream.rangeClosed(1, 10);  // [1, 10]
  LongStream longRangeStream = LongStream.range(1, 10);
  LongStream longRangeClosedStream = LongStream.rangeClosed(1, 10);
  ```

- 数值流常见操作

  ```java
  OptionalInt result = nums.stream().mapToInt(Integer::valueOf).min();
  OptionalInt result = nums.stream().mapToInt(Integer::valueOf).max();
  int result = nums.stream().mapToInt(Integer::valueOf).sum();
  OptionalDouble result = nums.stream().mapToInt(Integer::valueOf).average();
  int[] result = nums.stream().mapToInt(Integer::valueOf).sorted().toArray();
  ```

### `Optional`类

声明`Optional`

```java
// 值为null
Optional<Integer> optional = Optional.empty();
// 值非null
Optional<Integer> optional = Optional.of(1);
// 值可以为null
Optional<Integer> optional = Optional.ofNullable(1);
```

提取Optional中的值

```java
// 如果值为null, 抛出异常NoSuchElementException
Integer i = optional.get();
// 如果值为null, 返回默认值
Integer i = optional.orElse(null);
// 如果值为null, 抛出自定义异常
Integer i = optional.orElseThrow(() -> new RuntimeException("值为null"));
```

注意，`Optional<T>`设计的初衷，仅仅是为了支持方法返回`Optional`对象的语法，不建议在domain类中将实例变量定义为`Optional`类型，因为它不支持序列化。

### 新日期时间API

*java.time*包

### 并行数组操作API



## 9

### 模块化系统

:::tip 参考

- https://www.oracle.com/corporate/features/understanding-java-9-modules.html

:::

查看模块列表

`java --list-modules`



### JShell



### 接口中的私有默认方法和私有静态方法



## 10

### 本地变量类型推断

:::tip 参考

- https://developer.oracle.com/zh/learn/technical-articles/jdk-10-local-variable-type-inference

:::

## 11

### 新的HTTP和WebSocket客户端API




## 12



## 13





## 14


## 15


## 16


## 17


## 18


## 19


## 20


## 21

