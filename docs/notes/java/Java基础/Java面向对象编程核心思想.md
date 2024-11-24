---
title: Java面向对象编程核心思想
createTime: 2024/11/24 15:56:15
permalink: /notes/java/8qsldi0x/
---
封装、继承、多态、组合、聚合

## 方法重载与重写



## Java对象初始化过程

当使用`new`关键字创建1个对象的时候，Java对象初始化过程需要经过：类加载、实例化、构造3个阶段：

### 1.类加载过程

JVM加载类文件（1个类只会加载1次）：

- 初始化静态成员变量
- 按照定义顺序，依次执行静态代码块

如果存在父类，会先加载父类，然后再加载子类。

### 2.实例化过程

在堆内存中为该对象分配内存空间，然后：

- 初始化实例成员变量

如果存在父类，会先初始化父类中的实例成员变量，然后再初始化子类成员变量。

### 3.构造过程

执行构造函数：

- 按照定义顺序，依次执行初始化代码块

- 执行构造函数

如果存在父类，会先执行父类中的初始化代码块和构造函数，然后再执行子类中的初始化代码块和构造函数。

另外，如果子类构造函数中没有显式的调用父类构造函数，默认调用父类的无参构造函数，示例：

```java
public MyClass(){
    super();
    // ...
}
```

## Java访问修饰符

访问修饰符用于限定类、变量、方法、构造器的可见范围，包括：

- `public`，公共访问修饰符
- `protected`，保护访问修饰符，可以被同一个包内的类，以及其子类（无论是否在同一个包内）访问
- `default`，默认访问修饰符，只能被同一个包内的类访问，因此也称"包访问修饰符"
- `private`，私有访问修饰符，只能在类内部访问。

## `static`修饰符

`static`修饰符用于创建类级别的成员：

- 静态变量
- 静态方法
- 静态代码块
- 静态内部类

## `final`修饰符

- `final`修饰类，则该类不能被继承
- `final`修饰方法，则该方法不能被重写
- `final`修饰变量，则该变量只能被赋值1次。

`final`变量在使用前必须先赋值：

- 对于成员变量，可以在静态代码块、初始化代码块、构造器中进行赋值
- 对于局部变量，在使用变量前赋值即可

## `==`与`equals()`的区别

`==` 和 `equals()` 是用于比较对象的两种不同方式：

- `==`运算符比较2个对象的内存地址是否相等，即是否引用同一个对象实例。

- `equals()`方法比较2个对象的内容是否相同。

默认情况下，`equals()`比较2个对象的内存地址是否相等，等价于`==`，`Object`中的`equals()`源码如下：

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

一般情况下，子类需要重写`equals()`，自定义对象相等性比较规则。

示例：

```java
public class Employee implements Cloneable, Serializable {
    private String name;
    private double salary;
    private LocalDate hireDay;
    
    // getters/setters
    
    @Override
    public boolean equals(Object o) {
        if(this == o) {
            return true;
        }
        if(o == null || getClass() != o.getClass()) // 或者使用instanceof进行判断
        {
            return false;
        }
        Employee employee = (Employee) o;
        return Objects.equals(name, employee.name)
                && Double.compare(employee.salary, salary) == 0
                && Objects.equals(hireDay, employee.hireDay);
    }
}
```

