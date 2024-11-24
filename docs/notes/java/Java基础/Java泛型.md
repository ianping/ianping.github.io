---
title: Java泛型
createTime: 2024/11/24 15:56:15
permalink: /notes/java/3b14v7tu/
---
## 泛型类

定义泛型类，需要在类名后，用一对尖括号`<>`声明类型参数，类型参数可以定义多个，用逗号隔开

```java
public class Company<T> {
    private T legalPerson;
    
    public T getLegalPerson() {
        return legalPerson;
    }

    public void setLegalPerson(T legalPerson) {
        this.legalPerson = legalPerson;
    }
}
```

使用泛型类时，支持使用"菱形语法"，省略尖括号中的类型参数

```java
// Company<Employee> company = new Company<Employee>();
Company<Employee> company = new Company<>();
Employee legalPerson = new Employee(1, "James", 100000.);
company.setLegalPerson(legalPerson);
System.out.println(company.getLegalPerson());
```

## 泛型方法

定义泛型方法，需要在方法的返回值类型前声明类型参数

```java
public static <T> T randomEmployee(List<T> employees){
    Random random = new Random();
    int index = random.nextInt(employees.size());
    return employees.get(index);
}
```

使用泛型方法时，在方法名前声明类型参数，可以省略

```java
List<Employee> employees = new ArrayList<>();
employees.add(new Employee(1, "James", 100000.));
employees.add(new Employee(2, "James", 300000.));
employees.add(new Employee(3, "James", 200000.));

// Employee randomEmployee = Company.<Employee>randomEmployee(employees);
Employee randomEmployee = Company.randomEmployee(employees);
System.out.println(randomEmployee);
```

## 泛型的类型限定

定义泛型时，使用关键字`extends`限定类型参数是特定类或接口的子类型

```java
public class Company<T extends Comparable<T>> {
    // ...
}
```

1个类型参数支持指定多个限定类型，使用`&`分割，并且限定类型列表中，最多只允许指定1个类类型，但可以指定多个接口类型（和Java继承规则类似，支持单继承、多实现）。

```java
public class Company<T extends Comparable<T> & Serializable> {
    // ...
}
```

## 通配符类型

**无限定通配符**：使用泛型时，可以使用通配符`?`，接收任何类型。

```java
public static double maxSalary(List<?> employees){
    // ...
}
```

**子类型限定通配符**：通配符支持使用`extends`关键字，限定类型其类型为给定类型的子类型。

例如：限定泛型为Employee及其子类型

```java
public static double maxSalary(List<? extends Employee> employees){
    double max = Double.MIN_VALUE;
    for(Employee employee : employees) {
        Double salary = employee.getSalary();
        if(max < salary){
            max = salary;
        }
    }
    return max;
}
```

**超类型限定通配符**：通配符还支持使用`super`关键字，限定其类型为给定类型的超类型，包括`Object`

```java
public class Company<T extends Comparable<? super T> & Serializable> {
    // ...
}
```

## 类型擦除

JVM在编译期间，会将泛型"擦除"，使用原始类型代替泛型。

**如果类型参数没有限定类型，则原始类型为`Object`**

```java
public class Company<T> {
    private T legalPerson;
    // ...
}
```

类型擦除后，原始类型为`Object`

```java
public class Company {
    private Object legalPerson;
    // ...
}
```

**如果类型参数有限定类型，则原始类型是其第1个限定类型**

```java
public class Company<T extends Comparable<? super T> & Serializable> {
    private T legalPerson;
	// ...
}
```

类型擦除后，原始类型为`Comparable`

```java
public class Company {
    private Comparable legalPerson;
    // ...
}
```

