---
title: Java基础面试题
createTime: 2024/11/24 15:56:15
permalink: /notes/interview/zytg44kc/
---

## 概念

### JavaSE、JavaEE、JavaME

### JDK、JRE、JVM

### JIT、AOT

## 关键字

### `goto`和`const`保留字

### `strictfp`

修饰在类、接口、方法。

`strictfp`表示执行严格的浮点运算，保证在不同平台得到相同的运算结果。

### `transient`

修饰字段。

当一个字段被标记为 `transient` 时，它表示该字段不会被序列化：

- 在对象被序列化时，这个字段的值不会被保存。
- 当对象被反序列化时，被标记为 `transient` 的字段会被赋予默认值。

### `volatile`

修饰字段。

主要由2个作用：

- 保证可见性
- 禁止指令重排序优化

### `native`

修饰方法。

`native`方法通过JNI调用本地代码。

## 运算符

### 自增、自减

分为前缀和后缀2种形式：

- 前缀：先自增、自减，再参与运算
- 后缀：先参与运算，再自增、自减

### 移位

2进制移位运算：

- `<<`：左移，低位补0
- `>>`：右移，高位用原有符号位补齐
- `>>>`：无符号右移，高位补0

## 数据类型

### 4类8种基本数据类型

- 整型：`byte` `short` `int` `long`
- 浮点型：`float` `double`
- 字符：`char`
- 布尔：`boolean`

### 包装类型、自动装箱和自动拆箱

包装类型包括8种基本数据类型的包装类和`Void`。

其中，`boolean`, `byte`, 0-127之间的`char`, -128-127之间的`short`与`int`，被包装到固定的对象中。

### `BigInteger`和`BigDecimal`

## 面向对象

### 面向对象3大特性

封装、继承、多态。

### 类中包括哪些成员

- 成员变量：实例成员变量和静态(类)成员变量
- 成员方法：实例成员方法和静态(类)成员方法
- 构造器：无参、有参
- 构造代码块
- 静态代码块
- 内部类：实例内部类和静态内部类

### 访问修饰符

4种：

- `private`
- default，默认访问级别，包访问级别
- `protected`，相同包、子类可见
- `public`

### 方法重载和重写

#### 方法重载

同一个类中，具有相同方法名、不同参数列表（参数数量、类型、顺序）的方法。

#### 方法重写

子类中重新定义与父类中方法签名（方法名称、参数列表、返回值类型）相同的方法。

注意：

- 子类方法的访问修饰符不能比父类更严格（更小）
- 子类方法中不能抛出比父类方法更多的异常，或者不兼容的异常
- 子类方法不能是`static`方法
- 子类方法推荐使用`@Override`注解

### `final`关键字

- final类，不能被继承
- final方法，不能被子类重写
- final变量，表示常量，使用前必须进行显式赋值
- final引用，被赋值后，不能再指向其它对象，但是对象本身的属性可以修改
- final参数，只读参数

### 内部类

- 成员内部类
- 静态内部类
- 局部内部类
- 匿名内部类

### 接口

Java接口使用`interface`定义，遵循以下规则：

- 接口中的变量都是静态成员变量，自动使用`public static final`修饰
- 接口中的方法自动使用`public abstract`修饰
- 类只能“单继承”类，但可以“多实现”接口
- 接口可以继承多个其它接口

另外，Java8支持在接口中定义默认方法和静态方法

```java
public interface MyInterface extends Serializable, Closeable {
    // public static final int a = 1;
    int a = 1;

    // public abstract void foo();
    void foo();

    // public static void bar(){}
    static void bar(){}

    // public default void baz(){}
    default void baz(){}
}
```

### 可变数量参数

方法可以接收可变数量的参数，用于接收0或多个相同类型的值。其本质是一个数组。

语法是在数据类型后用3个点表示，必须放到参数列表的末尾：

```java
public PrintStream printf(String format, Object ... args) {
    return format(format, args);
}
```

### `==` 与 `equals()`的区别

`==`和`equals()`都用于比较对象之间的相等性：

- 对于基本数据类型，`==`比较值是否相等
- 对于引用数据类型，`==`比较引用（对象地址）是否相等，`equals`比较对象的内容是否相等

`equals()`是`Object`中定义的方法，默认比较对象引用是否相等（与`==`一样），一般子类都需要重写`equals()`方法

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

### 浅拷贝与深拷贝

浅拷贝：只会拷贝对象本身，对于对象内部的引用类型属性，只会拷贝其引用的地址。

深拷贝：拷贝对象及其内部的全部属性的值。

Java中，通过重写`Object#clone()`方法实现拷贝，一般也会实现`Cloneable`标记接口。

`Object`中的`clone()`是一个用`protected`修饰的`native`方法，默认进行浅拷贝。

```java
protected native Object clone() throws CloneNotSupportedException;
```

重写`clone()`方法时，一般会将其声明为`public`方法。下面是一个深拷贝的例子

```java
public class Prototype implements Cloneable {
    // 省略其它代码...
    
    @Override
    public Prototype clone() {
        try(ByteArrayOutputStream out = new ByteArrayOutputStream();
            ObjectOutputStream objectOut = new ObjectOutputStream(out);)
        {
            objectOut.writeObject(this);

            try(ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
                ObjectInputStream objectIn = new ObjectInputStream(in);)
            {
                return (Prototype) objectIn.readObject();
            }
        } catch(IOException | ClassNotFoundException e) {
            return null;
        }
    }
}
```

### `hashCode()`方法

`hashCode()`是`Object`类中定义的方法，用户计算并返回对象的哈希值。

`HashSet`、`HashMap`等数据结构的实现中，用于计算2个对象是否相等时：

- 先调用`hashCode()`，比较其哈希值
- 如果哈希值相等，再调用`equals()`，比较其内容是否相等

哈希值相等，`equals()`不一定返回true。

一般会同时重写`hashCode()`和`equals()`方法。

## 字符串

### `String`的不可变性

`String`是不可变的，保证不可变的2个手段，见源码

```java
// 1.类使用final修饰
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence,Constable, ConstantDesc {
    
    // 2.保存内容的字节数组使用private final修饰
    @Stable
    private final byte[] value;
}
```

### `StringBuilder`和`StringBuffer`的区别

`StringBuilder`是线程不安全的，性能较好；

`StringBuiifer`是线程安全的，其写操作方法都是`synchronized`方法。

### 字符串常量池

字符串常量池是位于Java堆中的一块内存区域，用于缓存字符串对象。

`String#intern()`方法用于将字符串对象添加到常量池中：

- 如果常量池中已有相同的字符串对象，直接返回已有字符串对象的引用；
- 否则，在常量池中创建字符串对象，并返回新的字符串对象的引用

```java
String a = "Hello";
String b = "Hello";
String c = new String("Hello");
String d = c.intern();
System.out.println(a == b);  // true, 直接引用常量池中的"Hello",引用相同
System.out.println(a == c);  // false, c是新创建的对象,引用不同
System.out.println(a == d);  // true, c.intern()将c添加到常量池,已存在相同的字符串对象,返回已存在的对象引用,因此与a的引用相同
```

## 异常

### 异常体系

`Throwable`接口

- `Error`
- `Exception`
  - `RuntimeException`，非检查异常
  - 其它异常都是检查异常

### 异常处理

- try...catch...finally
- try-with-resource，可用于任何实现了`java.lang.AutoCloseable`接口的资源

## 泛型

### 定义泛型类和泛型方法

### 使用`extends`限定类型参数

泛型可以使用`extends`关键字指定限定类型：

- 可以指定多个限定类型参数，使用`&`分割
- 多个限定类型中，最多只能包含一个类类型，且必须是限定类型列表中的第一个

### `?`通配符类型

- `<?>`
- `<? extends Type>`，子类型限定通配符
- `<? super Type>`，超类型限定通配符

### 类型擦除

在编译期间，泛型类型会被擦除：

- 如果泛型没有限定类型，类型擦除后为`Object`
- 如果有限定类型，类型擦除后为第一个限定类型

## 反射

核心API：

- `Class<T>`
- `Constructor<T>`
- `Field`
- `Method`
- `Annotation`

## 代理

### 静态代理

是一种设计模式，代理类和目标类实现相同的接口，代理类中定义一个共同接口类型的成员变量，用于接收目标类对象，在内部调用目标类方法。客户端通过代理类间接执行目标类的方法。

### 动态代理

分为JDK动态代理和CGLIB动态代理。

JDK动态代理是基于接口的代理模式，核心API包括：`Proxy`和`InvocationHandler`；

```java
// 类加载器
ClassLoader classLoader = Main.class.getClassLoader();
// 目标对象类和代理对象类要实现的接口数组
Class<?>[] interfaces = {Subject.class};
// 目标对象
Subject realSubject = new RealSubject();
// InvocationHandler
InvocationHandler invocationHandler = new MyInvocationHandler(realSubject);

// 动态创建代理对象
Subject proxy = (Subject) Proxy.newProxyInstance(classLoader, interfaces, invocationHandler);
proxy.foo();
```

CGLIB动态代理是基于类的代理模式，通过动态生成字节码的方式，动态创建目标类的子类。核心API包括：`Enhancer`和`MethodInterceptor`

```java
Enhancer enhancer = new Enhancer();
enhancer.setSuperclass(RealSubject.class);
enhancer.setCallback(new MyMethodInterceptor());
RealSubject proxy = (RealSubject) enhancer.create();
proxy.foo();
```

## 注解

### 元注解

- `@Documented`，注解是否会被javadoc工具记录到文档中

- `@Inherited`，注解是否可以被子类继承，当一个类使用了被`@Inherited`标注的注解时，如果这个类被继承，那么子类将自动继承父类的注解

- `@Retention`，指定注解的生命周期

  ```java
  public enum RetentionPolicy {
      // 编译时
      SOURCE,
      // 类加载时
      CLASS,
  	// 运行时
      RUNTIME
  }
  ```

- `@Target`，注解可使用到的位置（类、构造器、字段、方法、参数...）

- `@Repeatable`，注解是否可以被重复使用

### 自定义注解

```java
@Documented
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.TYPE, ElementType.METHOD })
public @interface MyAnnotation {
    String value() default "";
}
```

## I/O

输入、输出流

字节流、字符流

## 集合框架

`Collection<E>`：

- `List<E>`
  - `ArrayList<E>`
  - `LinkedList<E>`
- `Set<E>`
  - `HashSet<E>`
  - `LinkedHashSet<E>`
  - `TreeSet<E>`

`Map<K,V>`：

- `HashMap<K,V>`
- `LinkedHashMap<K,V>`
- `TreeMap<K,V>`

#### `ArrayList`的实现原理

Object数组

#### `LinkedList`的实现原理

双向链表

#### `HashMap`的实现原理

数组+链表、红黑树

#### `TreeMap`的实现原理

红黑树

## 并发编程

### 线程基础操作

线程名称、线程分组

守护线程

线程优先级

线程休眠、中断、让步、合并

线程生命周期

```java
public enum State {
    NEW,
    RUNNABLE,
    BLOCKED,
    WAITING,
    TIMED_WAITING,
    TERMINATED;
}
```

### 创建线程的方式

- `Thread`
- `Thread` + `Runnable`
- `Thread` + `FutureTask<V>` +  `Callable<V>`
- 线程池
- `CompletableFuture<T>`

### 线程池



### 锁

内置锁

可重入锁

读写锁

线程间通信

死锁

### 并发编程工具

#### juc原子类

#### juc容器类

#### `ThreadLocal`

#### `CountdownLatch`

#### `LockSupport`

#### `volatile`关键字

## JVM

### JVM内存模型

线程私有内存：

- 程序计数器：记录当前线程字节码执行的位置，字节码解释器通过程序计数器选取下一条要执行的指令
- 虚拟机栈：方法调用栈，包含局部变量、操作数栈、动态链接、方法返回地址
- 本地方法栈：Native方法栈

共享内存：

- 堆：存放对象实例，是GC管理的主要区域，也称为GC堆
- 字符串常量池

本地内存：

- 直接内存

### Java对象的创建过程

主要包括以下几个步骤：

1. 加载类：通过ClassLoader将class文件加载到内存中，生成Class对象。类只会加载一次
2. 链接
   1. 验证：确保字节码格式符合Java虚拟机规范
   2. 准备：为静态变量分配空间，并设置默认值(0, false, null)
   3. 解析：将类、接口、字段和方法的符号引用转换为直接引用
3. 初始化：执行静态变量赋值、静态代码块初始化操作，只会执行一次
4. 创建对象：为对象分配内存空间，给实例变量设置默认值(0, false, null)，显式赋值、执行构造代码块和构造函数

### Java对象的定位方式

根据虚拟机的不同，有2种定位对象的方式：

- 句柄：在堆中存储句柄，句柄中保存对象地址信息，栈上的引用。通过句柄定位堆中的对象
- 直接指针：栈中的引用存储的就是堆中的对象地址。

HotSpot虚拟机使用直接指针的方式定位对象。

### 垃圾回收机制

Java自动内存管理的核心功能是管理堆中的对象的分配与回收。

引用技术法

可达性分析算法

### 类加载机制

3个内置的ClassLoader：

- `BootstrapClassLoader`：启动类加载器，加载Java核心类库
- `ExtensionClassLoader`：扩展类加载器，加载扩展功能的类库
- `AppClassLoader`：应用类加载器，加载应用自身的类库

双亲委派模型：除了启动类加载器，其它类加载器都有1个父类加载器。在加载类时：

1. 自底向上，逐层判断该类是否已被加载：是，直接返回；否，向上查找
2. 如果到顶层类加载器，发现该类没有被加载过，则自顶向下，逐层尝试加载该类：成功，直接返回，失败，向下委托
3. 如果到了开始的类加载器，依然没有加载成功，则抛出`ClassNotFoundException`异常

## Java新特性

### Java8

#### 函数式接口

#### lambda表达式

#### Stream流

#### `Optional` API

#### `java.time`日期时间API

### Java9

#### 模块化系统

### Java10

### `var`局部变量类型推断

