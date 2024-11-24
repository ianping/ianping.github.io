---
title: Java反射
createTime: 2024/11/24 15:56:15
permalink: /notes/java/1at75wn9/
---
## `Class<T>`

### 获取`Class`对象

有3种获取Class对象的方式：

1.`ClassName.class`

```java
Class<Person> personClass = Person.class;
```

另外，对于Java基础数据类型、`void`、数组，获取Class对象的方式如下：

```java
Class<Byte> byteClass = byte.class;
Class<Short> shortClass = short.class;
Class<Integer> integerClass = int.class;
Class<Long> longClass = long.class;
Class<Float> floatClass = float.class;
Class<Double> doubleClass = double.class;
Class<Character> characterClass = char.class;
Class<Boolean> booleanClass = boolean.class;

Class<Void> voidClass = void.class;

Class<int[]> arrayClass = int[].class;
```

2.`instance.getClass()`

```java
Person person = new Person();
Class<? extends Person> personClass = person.getClass();
```

3.`Class.forName(className)`

```java
try {
    Class<?> personClass = Class.forName("me.lyp.reflective.bean.Person");
} catch(ClassNotFoundException e) {
    e.printStackTrace();
}
```

### 获取类名

```java
// 类全限定名
String name = personClass.getName();
// 类名
String simpleName = personClass.getSimpleName();
```

### 获取超类

```java
Class<? super Person> superclass = personClass.getSuperclass();
```

### 获取超接口

```java
Class<?>[] interfaces = personClass.getInterfaces();
```

## `Constructor<T>`

### 获取`Constructor`对象

获取所有public构造器

```java
Class<Man> clz = Man.class;
Constructor<?>[] constructors = clz.getConstructors();
```

获取指定参数类型的public构造器

```java
try {
    Constructor<Man> constructor = clz.getConstructor(String.class, Integer.class, Integer.class);
} catch(NoSuchMethodException e) {
    e.printStackTrace();
}
```

获取所有构造器，包括非public构造器

```java
Constructor<?>[] declaredConstructors = clz.getDeclaredConstructors();
```

获取指定参数类型的构造器，包括非public构造器

```java
try {
    Constructor<Man> declaredConstructor = clz.getDeclaredConstructor();
} catch(NoSuchMethodException e) {
    e.printStackTrace();
}
```

### 使用反射创建类实例

使用public构造器创建类实例

```java
try {
    Constructor<Man> constructor = clz.getConstructor(String.class, Integer.class, Integer.class);
    Man man = constructor.newInstance("Jim", 18, 98);
} catch(NoSuchMethodException | InvocationTargetException | InstantiationException | IllegalAccessException e) {
    e.printStackTrace();
}
```

使用非public构造器创建类实例，需要先禁用Java的访问控制检查

```java
try {
    Constructor<Man> declaredConstructor = clz.getDeclaredConstructor();
    declaredConstructor.setAccessible(true);
    Man man = declaredConstructor.newInstance();
} catch(NoSuchMethodException | InvocationTargetException | InstantiationException | IllegalAccessException e) {
    e.printStackTrace();
}
```

另外，如果类存在public的空参构造器，也使用`Class#newInstance()`创建类实例。此方式已过期，不推荐使用。

```java
try {
    Class<Person> personClass = Person.class;
    Person person = personClass.newInstance();
} catch(InstantiationException | IllegalAccessException e) {
    e.printStackTrace();
}
```

## `Field`

### 获取`Field`对象

获取给定类及其超类中所有的public字段

```java
Field[] fields = clz.getFields();
```

获取给定类及其超类中特定的public字段

```java
try {
    Field nameField = clz.getField("name");
} catch(NoSuchFieldException e) {
    e.printStackTrace();
}
```

获取给定类中所有的字段，包括非public字段

```java
Field[] declaredFields = clz.getDeclaredFields();
```

获取给定类中特定的字段，包括非public字段

```java
try {
    Field powerValueField = clz.getDeclaredField("powerValue");
} catch(NoSuchFieldException e) {
    e.printStackTrace();
}
```

### 使用反射设置、获取字段值

使用`Field#set(obj, value)` 和 `Field#get(obj)` 方法设置、获取字段值。

另外，如果是非public字段，需要使用`Field#setAccessible(true)`禁用Java的访问控制检查

```java
Class<Man> clz = Man.class;

try {
    Constructor<Man> declaredConstructor = clz.getConstructor();
    Man man = declaredConstructor.newInstance();

    Field powerValueField = clz.getDeclaredField("powerValue");
    powerValueField.setAccessible(true);
    powerValueField.set(man, 100);
    Integer powerValue = (Integer) powerValueField.get(man);
    System.out.println(powerValue);
} catch(NoSuchFieldException | NoSuchMethodException | InvocationTargetException | InstantiationException | IllegalAccessException e) {
    e.printStackTrace();
}
```

## `Method`

### 获取`Method`对象 

获取给定类及其超类中所有的public方法

```java
Method[] methods = clz.getMethods();
```

获取给定类及其超类中特定的public方法

```java
try {
    Method setNameMethod = clz.getMethod("setName", String.class);
} catch(NoSuchMethodException e) {
    e.printStackTrace();
}
```

获取给定类中所有的方法，包括非public方法

```java
Method[] declaredMethods = clz.getDeclaredMethods();
```

获取给定类中特定的方法，包括非public方法

```java
try {
    Method setPowerValueMethod = clz.getDeclaredMethod("setPowerValue", Integer.class);
} catch(NoSuchMethodException e) {
    e.printStackTrace();
}
```

### 使用反射执行方法

使用`Method#invoke(obj, args)`执行方法。

另外，如果是非public方法，需要使用`Method#setAccessible(true)`禁用Java的访问控制检查

```java
Class<Man> clz = Man.class;

try {
    Constructor<Man> constructor = clz.getConstructor();
    Man man = constructor.newInstance();

    Method setNameMethod = clz.getMethod("setName", String.class);
    Method getNameMethod = clz.getMethod("getName");

    setNameMethod.invoke(man, "Jim");
    String name = (String) getNameMethod.invoke(man);
    System.out.println(name);
} catch(NoSuchMethodException | IllegalAccessException | InvocationTargetException | InstantiationException e) {
    e.printStackTrace();
}
```

## `Annotation`

### 获取`Annotation`对象

待续...
