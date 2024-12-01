---
title: Java线程锁
createTime: 2024/11/24 15:56:15
permalink: /notes/java/nvitrh94/
---
## 锁的分类

从不同角度，锁可以分为以下几类：

- 可重入锁和不可重入锁，同一个线程能否多次获取同一把锁。每获取一次锁，计数器加1；每释放一次锁，计数器减1。计数器为0，完全释放锁
- 悲观锁和乐观锁，线程进入临界区前，是否锁住同步资源
- 公平锁和非公平锁，公平锁保证获取锁的机会是平等的，先到先得。
- 可中断锁和不可中断锁，在抢锁的时候，是否可以中断抢锁
- 共享锁和独占锁，是否允许多个线程同时获取锁

## 内置锁

内置锁（隐式锁，对象锁），使用`synchronized`关键字提供的锁机制，任意Java对象均可作为内置锁。

### 同步代码块

同步代码块的锁可以是任意的Java对象

```java
private int num = 0;

private final Object lock = new Object();

private void incr() {
    synchronized(lock) {
        num++;
    }
}
```

### 同步方法

同步方法的锁为this对象

```java
private int num = 0;

private synchronized void incr() {
    num++;
}
```

等价于下面的同步代码块

```java
private void incr() {
    synchronized(this){
        num++;
    }
}
```

### 静态同步方法

静态同步方法的锁为Class对象

```java
private static int num = 0;

private static synchronized void incr() {
    num++;
}
```

### 内置锁的4种级别

Java内置锁中，通过偏向锁标志位(biased_lock, 1Bit)和锁标志位(lock, 2Bit)，设置锁的状态。

#### 无锁

当线程访问共享资源时，没有其它线程竞争该资源时，线程无须进行任何同步操作，可以直接访问该资源。这种状态为无锁状态。

#### 偏向锁

只有1个线程抢占锁时，内置锁状态升级为偏向锁。

#### 轻量级锁

处于偏向锁状态的锁，被另一个线程抢占时，内置锁状态升级为轻量级锁。企图强占的线程通过CAS自旋的方式获取锁。

#### 重量级锁

处于轻量级锁状态的锁，如果企图强占的线程自旋时间超过了自旋等待最大时间，依然没有获取到锁，内置锁状态就升级为重量级锁。

## 显式锁

### `Lock`接口

```java
public interface Lock {
    void lock();
    void lockInterruptibly() throws InterruptedException;
    boolean tryLock();
    boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
    void unlock();
    Condition newCondition();
}
```

使用显式锁的模板代码

```java
// 阻塞抢锁
Lock lock = ...;
lock.lock();
try {
    // do something
}finally {
    lock.unlock();
}

// 非阻塞抢锁
Lock lock = ...;
if(lock.tryLock()){
    try {
        // do something
    } finally {
        lock.unlock();
    }
}else{
    // 抢锁失败
}

// 限时阻塞抢锁
Lock lock = ...;
try {
    if(lock.tryLock(1L, TimeUnit.SECONDS)){
        try {
            // do something
        }finally {
            lock.unlock();
        }
    }else{
        // 抢锁失败
    }
} catch(InterruptedException e) {
    e.printStackTrace();
}
```

### `ReentrantLock`

`ReentrantLock`，可重入、独占锁。

#### 实现公平锁与非公平锁

`ReentrantLock`默认为非公平锁

```java
// 公平锁(默认false, 非公平锁)
Lock fairLock = new ReentrantLock(true);
```

#### 实现中断锁与不可中断锁

不可中断锁，使用`Lock#lock()`。

中断锁，使用`Lock#lockInterruptibly()`

```java
Lock lock = new ReentrantLock();
try {
    lock.lockInterruptibly();
    try {
        // ...
    }finally {
        lock.unlock();
    }
} catch(InterruptedException e) {
    e.printStackTrace();
}
```

或者，使用带超时参数的`Lock#tryLock()`

```java
try {
    if(lock.tryLock(1L, TimeUnit.SECONDS)) {
        try {
            // ...
        }finally {
            lock.unlock();
        }
    }
} catch(InterruptedException e) {
    e.printStackTrace();
}
```

### `ReadWriteLock`

`ReadWriteLock`，读写锁接口，其实现类为`ReentrantReadWriteLock`:

- `readLock()`，获取读锁，属于共享锁，允许多个线程同时获取读锁
- `writeLock()`，获取写锁，属于独占锁，同一时刻只允许1个线程获取写锁

```java
ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
ReentrantReadWriteLock.ReadLock readLock = lock.readLock();
ReentrantReadWriteLock.WriteLock writeLock = lock.writeLock();
```

### `Semaphore`

`Semaphore`，信号量。

待续...

### `StampedLock`

Java8新增的一种锁机制，支持乐观读取、悲观读取和悲观写入操作。

## 线程间通信

### 基于隐式锁实现"等待-通知"

`Object`中定义了内置锁中用于线程通信的一系列方法：

- `wait`，让当前线程进入等待状态
- `notify`，唤醒此对象监视器上的其它线程。被唤醒的线程并不一定立即执行，而是在当前线程释放锁后，再开始抢占锁。

示例：

```java
public static void main(String[] args) {
    startThreadA();
    startThreadB();
}

private void startThreadA() {
    Runnable task = () -> {
        System.out.printf("%s: start%n", Thread.currentThread().getName());
        synchronized(this) {
            try {
                // 当前线程进入等待状态
                this.wait();
            } catch(InterruptedException e) {
                e.printStackTrace();
            }
        }
        System.out.printf("%s: end%n", Thread.currentThread().getName());
    };

    new Thread(task, "A").start();
}

private void startThreadB() {
    Runnable task = () -> {
        System.out.printf("%s: start%n", Thread.currentThread().getName());
        synchronized(this) {
            // 唤醒此对象监视器上的其它线程
            this.notifyAll();
        }
        System.out.printf("%s: end%n", Thread.currentThread().getName());
    };

    new Thread(task, "B").start();
}
```

### 基于显式锁实现"等待-通知"

使用`Lock#newCondition`方法，可以获得1个与锁绑定的`Condition`实例，然后使用`Condition`实例的以下方法，实现线程的等待与通知：

- `await`，让当前线程进入等待状态
- `signal`，唤醒此`Condition`对象上的其它线程

示例：

```java
public static void main(String[] args) {
    startThreadA();
    startThreadB();
}

private final Lock lock = new ReentrantLock();
// 获取Condition
private final Condition condition = lock.newCondition();

private void startThreadA(){
    Runnable task = () -> {
        String name = Thread.currentThread().getName();
        lock.lock();
        try {
            System.out.printf("%s: before await%n", name);
            // 当前线程进入等待状态
            condition.await();
            System.out.printf("%s: after await%n", name);
        } catch(InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    };
    new Thread(task, "A").start();
}

private void startThreadB(){
    Runnable task = () -> {
        String name = Thread.currentThread().getName();
        lock.lock();
        try {
            System.out.printf("%s: before signal%n", name);
            // 唤醒其它线程
            condition.signalAll();
            System.out.printf("%s: after signal%n", name);
        }finally {
            lock.unlock();
        }
    };
    new Thread(task, "B").start();
}
```

## 死锁

多个线程持有彼此需要的锁资源而无法释放，导致彼此等待的现象。

死锁示例：

```java
public static void main(String[] args) {
    Object lock1 = new Object();
    Object lock2 = new Object();

    Thread ta = new Thread(() -> {
        System.out.println("线程A: 等待lock1");
        synchronized(lock1){
            System.out.println("线程A: 持有lock1");
            try {
                TimeUnit.SECONDS.sleep(1L);
            } catch(InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println("线程A: 等待lock2");
            synchronized(lock2){
                System.out.println("线程A: lock2...");
            }
        }
    }, "A");

    Thread tb = new Thread(() -> {
        System.out.println("线程B: 等待lock2");
        synchronized(lock2){
            System.out.println("线程B: 持有lock2");
            try {
                TimeUnit.SECONDS.sleep(2L);
            } catch(InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println("线程B: 等待lock1");
            synchronized(lock1){
                System.out.println("线程B: 持有lock1...");
            }
        }
    }, "B");

    ta.start();
    tb.start();
}
```

