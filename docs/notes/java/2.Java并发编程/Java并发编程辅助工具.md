---
title: Java并发编程辅助工具
createTime: 2024/11/24 15:56:15
permalink: /notes/java/wrbied1q/
---
## `ThreadLocal<T>`

### 使用

`ThreadLocal<T>`，线程本地变量，常用于需要线程隔离的场景。

提供了下面几个API：

- `ThreadLocal()`，构造器，返回默认值为null的`ThreadLocal`实例
- `static <S> ThreadLocal<S> withInitial(Supplier<? extends S> supplier)`，静态方法，返回`ThreadLocal`实例，需要传递1个返回默认值的`Supplier`
- `T get()`，获取值
- `void set(T value)`，设置值
- `void remove()`，移除值

使用示例：

```java
private final ThreadLocal<Integer> threadNum = ThreadLocal.withInitial(() -> 0);

private void foo(){
    Thread t1 = new Thread(() -> {
        System.out.printf("%s: %d%n", Thread.currentThread().getName(), threadNum.get());
        threadNum.set(1);
        System.out.printf("%s: %d%n", Thread.currentThread().getName(), threadNum.get());

        threadNum.remove();
    });

    Thread t2 = new Thread(() -> {
        System.out.printf("%s: %d%n", Thread.currentThread().getName(), threadNum.get());
        threadNum.set(2);
        System.out.printf("%s: %d%n", Thread.currentThread().getName(), threadNum.get());

        threadNum.remove();
    });

    t1.start();
    t2.start();
}
```

### 实现原理

- `ThreadLocal<T>`定义了静态内部类`ThreadLocalMap`，用于存储线程本地变量，key为`ThreadLocal`本身，value为变量值。
- 在`Thread`类中，定义了一个`ThreadLocalMap`类型的变量`threadLocals`，也就是说，每个线程都拥有自己的`ThreadLocalMap`对象
- set值时，先获取当前线程内部的`threadLocals`变量，将`ThreadLocal`本身作为key，值为value添加到`threadLocals`中
- get值时，先获取当前线程内部的`threadLocals`变量，将`ThreadLocal`本身作为key，获取value

## `CountDownLatch`

`CountDownLatch`倒数闩，用于线程等待。提供了以下API：

- `CountDownLatch(int count)`，构造器
- `void countDown()`，计数器减1
- `void await()`，阻塞当前线程，直到计数器为0
- `boolean await(long timeout, TimeUnit unit)`，阻塞当前线程，直到计数器为0，返回true；或者超时，返回false

使用示例：

```java
public static void main(String[] args) {
    System.out.println(Thread.currentThread().getName() + " start");

    final int THREAD_COUNT = 5;
    // 创建CountDownLatch
    CountDownLatch latch = new CountDownLatch(THREAD_COUNT);
    Thread[] ts = new Thread[5];

    Runnable task = ()->{
        System.out.println(Thread.currentThread().getName());
        // 倒数闩计数器减1
        latch.countDown();
    };

    for (int i = 0; i < 5; i++) {
        ts[i] = new Thread(task);
    }

    for (int i = 0; i < 5; i++) {
        ts[i].start();
    }

    // 主线程等待子线程的执行，直到计数器为0
    try {
        latch.await();
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    System.out.println(Thread.currentThread().getName() + " end");
}
```

## `LockSupport`

`LockSupport`提供了一系列的方法，用来暂停和恢复线程：

- `park`，暂停线程
- `unpark`，恢复指定的线程

示例：

```java
/**
 * 喊一声"和尚",念一句"阿弥陀佛"
 */
public static void main(String[] args) {
    Monk monk = new Monk();
    monk.start();

    Scanner scanner = new Scanner(System.in);
    while(scanner.hasNextLine()){
        String line = scanner.nextLine();
        if("和尚".equals(line)){
            LockSupport.unpark(monk);
        }
    }
}

private static class Monk extends Thread{
    @Override
    public void run() {
        while(true){
            LockSupport.park();
            System.out.println("阿弥陀佛");
        }
    }
}
```

## 使用`volatile`保证共享变量的可见性

`volatile`可以保证共享变量的可见性，但无法保证其原子性和有序性。

```java
public class Person {
    public long id;
    public volatile String name;
    public volatile int age;
}
```

## JUC原子类

在JDK的 *java.util.concurrent.atomic* 包下，提供了一些基于CAS自旋实现的轻量级原子操作类。

### 基本类型原子类

包括：

- `AtomicBoolean`
- `AtomicInteger`
- `AtomicLong`

使用示例：

```java
/**
 * 基本类型原子类示例:
 * 开启10个线程，每个线程执行100次加1操作
 */
private static void atomicIntegerTest() {
    final int threadCount = 10;
    CountDownLatch latch = new CountDownLatch(threadCount);
    // 创建原子类对象
    AtomicInteger atomicInteger = new AtomicInteger(0);

    Thread[] ts = new Thread[threadCount];
    for(int i = 0; i < threadCount; i++) {
        Thread t = new Thread(() -> {
            for(int j = 0; j < 100; j++) {
                // 原子类进行加1操作
                atomicInteger.incrementAndGet();
            }
            latch.countDown();
        });
        ts[i] = t;
    }

    for(Thread t : ts) {
        t.start();
    }

    try {
        latch.await();
    } catch(InterruptedException e) {
        e.printStackTrace();
    }

    int expectValue = threadCount * 100;
    // 获取原子类值
    int actualValue = atomicInteger.get();
    System.out.printf("预期值: %d, 实际值: %d", expectValue, actualValue);
}
```

### 数组类型原子类

包括：

- `AtomicIntegerArray`
- `AtomicLongArray`
- `AtomicReferenceArray<E>`

使用示例：

```java
int[] array = new int[10];
AtomicIntegerArray nums = new AtomicIntegerArray(array);
nums.getAndAdd(0, 10);
System.out.println(nums.get(0));
```

### 引用类型原子类

包括：

- `AtomicReference<V>`
- `AtomicMarkableReference<V>`
- `AtomicStampedReference<V>`

使用示例：

```java
Person person = new Person(1L, "tim", 18);
AtomicReference<Person> personRef = new AtomicReference<>();
personRef.set(person);

Person newPerson = new Person(1L, "tom", 20);
personRef.compareAndSet(person, newPerson);

System.out.println(personRef.get());
```

### 字段更新原子类

包括：

- `AtomicIntegerFieldUpdater<T>`
- `AtomicLongFieldUpdater<T>`
- `AtomicReferenceFieldUpdater<T,V>`

使用示例：

1.使用`volatile`关键字修饰要更新的字段

```java
public class Person {
    public long id;
    public volatile String name;
    public volatile int age;
}
```

2.使用`newUpdater()`方法，创建更新器对象

```java
AtomicReferenceFieldUpdater<Person,String> nameUpdater = AtomicReferenceFieldUpdater.newUpdater(Person.class, String.class, "name");
AtomicIntegerFieldUpdater<Person> ageUpdater = AtomicIntegerFieldUpdater.newUpdater(Person.class, "age");

Person person = new Person(1L, "tim", 18);
nameUpdater.getAndSet(person, "tom");
ageUpdater.getAndSet(person, 20);

System.out.println(person);
```

## JUC容器类

### `List`

包括：

- `CopyOnWriteArrayList<E>`

### `Set`

包括：

- `CopyOnWriteArraySet<E>`
- `ConcurrentSkipListSet<E>`

### `Map`

包括：

- `ConcurrentHashMap<K,V>`
- `ConcurrentSkipListMap<K,V>`

### `Queue`

包括：

- `ConcurrentLinkedQueue<E>`，单向队列
- `ConcurrentLinkedDeque<E>`，双向队列
- `ArrayBlockingQueue<E>`
- `LinkedBlockingQueue<E>`
- `PriorityBlockingQueue<E>`
- `DelayQueue<E extends Delayed>`
- `SynchronousQueue<E>`
