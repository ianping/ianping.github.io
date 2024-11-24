---
title: Java代理
createTime: 2024/11/24 15:56:15
permalink: /notes/java/xkhnx2a4/
---
## 静态代理设计模式

示例：

```java
/**
 * 主题接口
 */
public interface Subject {
    void foo();
}

/**
 * 真实对象类
 */
public class RealSubject implements Subject{
    @Override
    public void foo() {
        System.out.println("Request Real Subject");
    }
}

/**
 * 代理对象类
 */
public class ProxySubject implements Subject {
    private final Subject realSubject;

    public ProxySubject(Subject realSubject){
        this.realSubject = realSubject;
    }

    @Override
    public void foo() {
        System.out.println("Before Request Real Subject");
        realSubject.foo();
        System.out.println("After Request Real Subject");
    }
}
```

## JDK动态代理

JDK动态代理是Java实现动态代理的一种方式，是基于接口的代理模式。

JDK动态代理通过`ava.lang.reflect.Proxy`和`java.lang.reflect.InvocationHandler`这2个接口实现。

示例：

```java
/**
 * 主题接口
 */
public interface Subject {
    void foo();
}

/**
 * 真实对象类
 */
public class RealSubject implements Subject{
    @Override
    public void foo() {
        System.out.println("Request Real Subject");
    }
}

/**
 * InvocationHandler，在invoke方法中调用真实对象的方法，并根据需要在方法执行前后添加附加功能
 */
public class MyInvocationHandler implements InvocationHandler {
    private final Subject realSubject;

    public MyInvocationHandler(Subject realSubject) {
        this.realSubject = realSubject;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // 调用真实对象的方法之前执行的附加操作
        System.out.println("Before Request Real Subject");

        // 调用真实对象的方法
        Object result = method.invoke(realSubject, args);

        // 调用真实对象的方法之后执行的附加操作
        System.out.println("After Request Real Subject");

        // 返回方法返回值
        return result;
    }
}

/**
 * 测试类: 调用Proxy.newProxyInstance()方法，动态创建代理对象
 */
public class Main {
    public static void main(String[] args) {
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
    }
}
```

## CGLIB动态代理

CGLIB(Code Generation Library)是一个高性能的代码生成库，它扩展了Java语言，为Java类提供了动态生成字节码的功能。

CGLIB动态代理是基于继承的代理模式，与JDK动态代理不同，CGLIB通过生成目标类的子类来实现代理，因此可以代理没有实现接口的类。

CGLIB动态代理是通过`net.sf.cglib.proxy.Enhancer`类和`net.sf.cglib.proxy.MethodInterceptor`接口实现的。

示例：

添加cglib依赖

```xml
<!-- https://mvnrepository.com/artifact/cglib/cglib -->
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.3.0</version>
</dependency>
```

编写代码

:::tip 提示

如果使用Java9以上版本的JDK，由于模块化的限制，运行测试类时，需要添加以下JVM参数：

```
--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.lang.reflect=ALL-UNNAMED
```

:::

```java
/**
 * 真实对象类
 */
public class RealSubject {
    public void foo(){
        System.out.println("Request Real Subject");
    }
}

/**
 * MethodInterceptor: 在intercept方法中，调用真实对象(父类对象)的方法，并在调用真实对象方法前后添加附加操作
 */
public class MyMethodInterceptor implements MethodInterceptor {
    @Override
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        // 调用真实对象的方法之前执行的附加操作
        System.out.println("Before Request Real Subject");

        // 调用真实对象(父类对象)的方法
        Object result = methodProxy.invokeSuper(obj, args);

        // 调用真实对象的方法之后执行的附加操作
        System.out.println("After Request Real Subject");
        return result;
    }
}

/**
 * 测试类: 
 * 1.创建Enhancer对象
 * 2.设置要代理的真实对象类(父类)
 * 3.设置方法拦截器
 * 4.调用create方法创建代理对象
 * 5.使用代理对象调用方法
 */
public class Main {
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(RealSubject.class);
        enhancer.setCallback(new MyMethodInterceptor());
        RealSubject proxy = (RealSubject) enhancer.create();
        proxy.foo();
    }
}
```