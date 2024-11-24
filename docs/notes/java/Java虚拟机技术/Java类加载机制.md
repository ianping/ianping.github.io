---
title: Java类加载机制
createTime: 2024/11/24 15:56:15
permalink: /notes/java/mnv6ozul/
---
JVM类加载器有以下几种：

1. 启动类加载器（Bootstrap ClassLoader）

2. 扩展类加载器（Extension ClassLoader）

3. 应用类加载器（Application ClassLoader）
4. 自定义类加载器

ClassLoader的"双亲委派模型"，核心源代码如下：

```java
public abstract class ClassLoader {
    protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            // 首先，检查类是否已经被加载：如果已被加载，直接返回
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                // 如果类未被加载: 如果有父类ClassLoader，就委派父ClassLoader进行加载；否则，委派给启动类加载器进行加载
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }
				
                // 父类加载器或者启动类加载器加载类失败，再由当前类加载器进行加载
                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
}
```





