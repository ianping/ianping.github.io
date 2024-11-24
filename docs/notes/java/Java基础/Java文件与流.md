---
title: Java文件与流
createTime: 2024/11/24 15:56:15
permalink: /notes/java/cdfgau4e/
---
## 文件

### `File`

创建文件

```java
File file = new File("a.txt");
try {
    if(!file.exists()) {
        boolean success = file.createNewFile();
        if(!success){
            return;
        }
    }
} catch(IOException e) {
    e.printStackTrace();
}
```

列出文件列表

```java
File file = new File("E:/books");
if(file.isDirectory()){
    File[] files = file.listFiles(new FileFilter() {
        @Override
        public boolean accept(File pathname) {
            return true;
        }
    });

    for(File f : files) {
        if(f.isFile()){
            System.out.println(f.getName());
        }else if(f.isDirectory()){
            System.out.println(f.getName() + "/");
        }
    }
}
```

`FileFilter`是个函数式接口, 可以用lambda表达式

```java
File[] files = file.listFiles(f -> true);
```

另外, 如果只需要通过文件名过滤文件列表, 可以使用`FileFilter`的子接口`FilenameFilter`

```java
File[] files = file.listFiles(new FilenameFilter() {
    @Override
    public boolean accept(File dir, String name) {
        return true;
    }
});
```

### `Path` 和 `Paths`

获取`Path`对象

```java
Path path = Paths.get("a", "b", "c.txt");

Path path = Path.of("a", "b", "c.txt");
```

### `Files`

创建目录或文件

```java
Path path = Paths.get("a", "b", "c.txt");
try {
    if(!Files.exists(path)) {
        Path parent = path.getParent();
        if(!Files.exists(parent)){
            Files.createDirectories(parent);
        }
        Files.createFile(path);
    }
} catch(IOException e) {
    e.printStackTrace();
}
```

列出文件列表, 使用`Files#list`静态方法, 列出当前目录下的文件列表

```java
Stream<Path> stream = Files.list(path);
```

如果要递归遍历文件树, 需要使用`Files#walk`静态方法, 列出指定目录下, 指定递归深度的所有目录和文件的`Path`列表

```java
Stream<Path> stream = Files.walk(path, 3);
stream.forEach(p -> System.out.println(p.getFileName()));
```

如果需要手动处理遍历过程中的各种事件, 使用`Files.walkFileTree`静态方法

```java
FileVisitor<Path> visitor = new SimpleFileVisitor<>(){
    @Override
    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
        System.out.println(dir.getFileName());
        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
        System.out.println(file.getFileName());
        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {
        return super.visitFileFailed(file, exc);
    }

    @Override
    public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
        return super.postVisitDirectory(dir, exc);
    }
};

Files.walkFileTree(path, EnumSet.noneOf(FileVisitOption.class), 2, visitor);
```

删除目录或文件

```java
Path path = Paths.get("a", "b", "c.txt");
try {
    // Files.delete(path);
    Files.deleteIfExists(path);
} catch(IOException e) {
    e.printStackTrace();
}
```

复制文件

```java
Path source = Paths.get("a", "b", "c.txt");
Path target = Paths.get("a", "b", "c2.txt");
try {
    Files.copy(source, target);
} catch(IOException e) {
    e.printStackTrace();
}
```

移动文件

```java
Path source = Paths.get("a", "b", "c.txt");
Path target = Paths.get("a", "c.txt");
try {
    Files.move(source, target);
} catch(IOException e) {
    e.printStackTrace();
}
```

读取文件内容

```java
Path path = Paths.get("a", "b", "c.txt");
try {
    // 读取全部byte
    byte[] bytes = Files.readAllBytes(path);
    // 读取全部字符串
    String s = Files.readString(path, StandardCharsets.UTF_8);
    // 按行读取, 返回字符串列表
    List<String> lines = Files.readAllLines(path);
    // 按行读取, 返回Stream
    Stream<String> stream = Files.lines(path, StandardCharsets.UTF_8);
} catch(IOException e) {
    e.printStackTrace();
}
```

## 流

### 字节流

所有字节输入流都是`InputStream`抽象类的子类

```java
public abstract class InputStream implements Closeable {
    // 读取下一个字节,值以int类型返回,范围0-255
    // 如果已到末尾,返回-1
    public abstract int read() throws IOException;
    
    // 读取一定数量的字节,将其存储到缓冲数组b中
    // 返回读取的字节数量, 最多读取b.length个字节, 如果已到流末尾,返回-1
    public int read(byte b[]) throws IOException {
        // ...
    }
    
    // 读取最多len个字节，将其存储到缓冲数组b中
    // 读到的第1个字节存储到b[off],第2个字节存储到b[off+1],以此类推
    // 返回读取的字节数量,如果已到流末尾,返回空字节数组
    public int read(byte b[], int off, int len) throws IOException {
        // ...
    }
    
    // 读取剩余的全部字节
    // 返回读取的字节数组,如果已到末尾,返回空字节数组
    public byte[] readAllBytes() throws IOException {
        // ...
    }
    
    // 读取最多len个字节
    // 返回读取到的字节数组,如果已到流末尾,返回空字节数组
    public byte[] readNBytes(int len) throws IOException {
        // ...
    }
    
    // 读取最多len个字节, 将其存储到缓冲数组b中
    // 读到的第1个字节存储到b[off],第2个字节存储到b[off+1],以此类推
    // 返回读取的字节数量,如果已到流末尾,返回空字节数组
    public int readNBytes(byte[] b, int off, int len) throws IOException {
        // ...
    }
    
    // 跳过并丢弃最多n个字节,如果n为负数,跳过0个字节
    // 返回实际跳过的字节数
    public long skip(long n) throws IOException {
        // ...
    }
    
    // 跳过并丢弃最多n个字节
    public void skipNBytes(long n) throws IOException {
        // ...
    }
    
    // 读取并返回可以从此字节流读取而不阻塞的字节数
    // 是个估计值, 不一定准确
    public int available() throws IOException {
        // ...
    }
    
    // 关闭流
    public void close() throws IOException {}
    
    // 检查此输入流是否支持标记
    public boolean markSupported() {
        // ...
    }
    
    // 标记此输入流的当前读取位置
    // readlimit限定打标记后,最多允许继续读取的字节数,超出此限制,则标记失效
    public synchronized void mark(int readlimit) {}
    
    // 重置读取位置到上次在此输入流上打标记的位置
    public synchronized void reset() throws IOException {
        // ...
    }
    
    // 从输入流中读取全部字节, 写到out输出流
    public long transferTo(OutputStream out) throws IOException {
        // ...
    }
}
```

所有字节输出流都是`OutputStream`抽象类的子类

```java
public abstract class OutputStream implements Closeable, Flushable {
    // 将1个字节写入到此输出流
    public abstract void write(int b) throws IOException;
    
    // 将字节数组b中的所有字节写入到此输出流
    public void write(byte b[]) throws IOException {
        // ...
    }
    
    // 将字节数组b中, 从b[off]到b[off+len-1]的字节写入到此输出流
    public void write(byte b[], int off, int len) throws IOException {
        // ...
    }
    
    // 刷新输出流缓冲区
    public void flush() throws IOException {
        // ...
    }
    
    // 关闭输出流
    public void close() throws IOException {
        // ...
    }
}
```

#### `FileInputStream`与`FileOutputStream`

文件输入/输出流，从文件系统的文件中读取/写入字节流。

示例：复制图片

```java
FileInputStream in = null;
FileOutputStream out = null;
try {
    try {
        in = new FileInputStream("a.jpg");
        out = new FileOutputStream("a2.jpg");
        byte[] buff = new byte[1024];
        while(in.read(buff) != -1) {
            out.write(buff);
        }
    } finally {
        if(in != null) {
            in.close();
        }
        if(out != null) {
            out.close();
        }
    }
} catch(IOException e) {
    e.printStackTrace();
}
```

因为输入/输出流都实现了`Closeable`接口，因此，可以使用 *try-with-resource* 语法，自动关闭流

```java
try(FileInputStream in = new FileInputStream("a.jpg");
    FileOutputStream out = new FileOutputStream("a2.jpg");)
{
    byte[] buff = new byte[1024];
    while(in.read(buff) != -1) {
        out.write(buff);
    }
} catch(IOException e) {
    e.printStackTrace();
}
```

#### `BufferedInputStream`与`BufferedOutputStream`

为底层输入/输出流添加内部缓冲功能，并且支持`mark`和`reset`。

示例：

```java
try(BufferedInputStream bin = new BufferedInputStream(new FileInputStream("a.jpg"));
    BufferedOutputStream bout = new BufferedOutputStream(new FileOutputStream("a2.jpg")))
{
    byte[] buff = new byte[1024];
    while(bin.read(buff) != -1) {
        bout.write(buff);
    }
} catch(IOException e) {
    e.printStackTrace();
}
```

#### `DataInputStream`与`DataOutputStream`

数据输入/输出流，是一个包装流，可以从底层流中读取/写入Java基础数据类型和字符串数据。

注意, 从输入流中读取的顺序, 要和写入的顺序一致.

示例:

```java
try(DataOutputStream out = new DataOutputStream(new FileOutputStream("data.bin"));
    DataInputStream in = new DataInputStream(new FileInputStream("data.bin"));)
{
    out.writeInt(1);
    out.writeDouble(1.0);
    out.writeBoolean(true);
    out.writeUTF("hello");

    int a = in.readInt();
    double b = in.readDouble();
    boolean c = in.readBoolean();
    String d = in.readUTF();

    System.out.println(a);
    System.out.println(b);
    System.out.println(c);
    System.out.println(d);
} catch(IOException e) {
    e.printStackTrace();
}
```

#### `ByteArrayInputStream`与`ByteArrayOutputStream`

字节数组输入/输出流 主要用于在内存中临时读取/保存数据.

示例:

```java
try(ByteArrayOutputStream out = new ByteArrayOutputStream();)
{
    out.write("hello world".getBytes(StandardCharsets.UTF_8));
    byte[] bytes = out.toByteArray();

    try(ByteArrayInputStream in = new ByteArrayInputStream(bytes);) {
        String s = new String(in.readAllBytes(), StandardCharsets.UTF_8);
        System.out.println(s);
    }
} catch(IOException e) {
    e.printStackTrace();
}
```

#### `ObjectInputStream`与`ObjectOutputStream`

对象输入/输出流，用于序列化与反序列化Java对象。

要被序列化的Java对象所属类必须实现`ava.io.Serializable`接口。

另外，如果不想序列化对象的某个字段，使用关键字`transient`修饰，表示临时变量。

示例：使用序列化与反序列化实现clone方法

```java
public class Person implements Cloneable, Serializable {
    // ...

    @Override
    public Person clone() {
        try(ByteArrayOutputStream out = new ByteArrayOutputStream();
            ObjectOutputStream objectOut = new ObjectOutputStream(out);)
        {
            objectOut.writeObject(this);
            
            try(ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
                ObjectInputStream objectIn = new ObjectInputStream(in);)
            {
                return (Person) objectIn.readObject();
            }
        } catch(IOException | ClassNotFoundException e) {
            return null;
        }
    }
}
```

### 字符流

所有字符输入流都是`Reader`抽象类的子类

```java
public abstract class Reader implements Readable, Closeable {
    public abstract int read(char[] cbuf, int off, int len) throws IOException;
    
    public int read(CharBuffer target) throws IOException {
        // ...
    }
    
    public int read() throws IOException {
        // ...
    }
    
    public int read(char[] cbuf) throws IOException {
        // ...
    }
    
    public long skip(long n) throws IOException {
        // ...
    }
    
    public boolean ready() throws IOException {
        // ...
    }
    
    public boolean markSupported() {
        // ...
    }
    
    public void mark(int readAheadLimit) throws IOException {
        // ...
    }
    
    public void reset() throws IOException {
        // ...
    }
    
    public abstract void close() throws IOException;
    
    public long transferTo(Writer out) throws IOException {
        // ...
    }
}
```

所有字符输出流都是`Writer`抽象类的子类

```java
public abstract class Writer implements Appendable, Closeable, Flushable {
    public abstract void write(char cbuf[], int off, int len) throws IOException;
    
    public void write(int c) throws IOException {
        // ...
    }
    
    public void write(char cbuf[]) throws IOException {
        // ...
    }
    
    public void write(String str) throws IOException {
        // ...
    }
    
    public void write(String str, int off, int len) throws IOException {
        // ...
    }
    
    public Writer append(CharSequence csq) throws IOException {
        // ...
    }
    
    public Writer append(CharSequence csq, int start, int end) throws IOException {
        // ...
    }
    
    public Writer append(char c) throws IOException {
        // ...
    }
    
    public abstract void flush() throws IOException;
    
    public abstract void close() throws IOException;
}
```

#### `FileReader`与`FileWriter`

从文件中读取/写入字符流。

示例：

```java
try(FileReader reader = new FileReader("a.txt", StandardCharsets.UTF_8);
    FileWriter writer = new FileWriter("a2.txt", StandardCharsets.UTF_8))
{
    char[] buff = new char[8];
    while(reader.read(buff) != -1) {
        writer.write(buff);
    }
} catch(IOException e) {
    e.printStackTrace();
}
```

#### `BufferedReader`与`BufferedWriter`

为底层输入/输出字符流提供内部缓冲功能。

示例：

```java
try(BufferedReader reader = new BufferedReader(new FileReader("a.txt"), 512);
    BufferedWriter writer = new BufferedWriter(new FileWriter("a2.txt"), 512))
{
    char[] buff = new char[8];
    while(reader.read(buff) != -1) {
        writer.write(buff);
    }
} catch(IOException e) {
    e.printStackTrace();
}
```

#### `InputStreamReader`与`OutputStreamWriter`

将字节流转换为字符流

示例：

```java
InputStream in = new FileInputStream("a.txt");
Reader reader = new InputStreamReader(in);

OutputStream out = new FileOutputStream("a2.txt");
Writer writer = new OutputStreamWriter(out);
```

#### `PrintWriter`

打印Java对象到文本输出流

示例：

```java
try(PrintWriter printWriter = new PrintWriter(new FileWriter("a.txt"));){
    printWriter.print(9999);
    printWriter.print('\n');
    printWriter.println("hello");
    printWriter.printf("9 * 9 = %d%n", 9 * 9);
    printWriter.println(new Object());
} catch(IOException e) {
    e.printStackTrace();
}
```

