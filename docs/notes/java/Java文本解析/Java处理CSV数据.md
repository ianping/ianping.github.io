---
title: Java处理CSV数据
createTime: 2024/11/24 15:56:15
permalink: /notes/java/g5f9xjwr/
tags: ["Java", "CSV"]
---

## 手动解析csv文件

使用`java.util.Scanner`读取csv文件中的内容

```java
try(InputStream in = new FileInputStream("salary.csv");) {
    Scanner scanner = new Scanner(in);
    while (scanner.hasNextLine()){
        String line = scanner.nextLine();
        String[] values = line.split(",");
        for (String value : values) {
            System.out.printf("%s ", value);
        }
        System.out.println();
    }
} catch (IOException e) {
    throw new RuntimeException(e);
}
```

## 使用opencsv库解析和生成csv文件

引入依赖

```xml
<!-- https://mvnrepository.com/artifact/com.opencsv/opencsv -->
<dependency>
    <groupId>com.opencsv</groupId>
    <artifactId>opencsv</artifactId>
    <version>5.7.1</version>
</dependency>
```

示例

```java
String inputFile = "salary.csv";
String outputFile = "salary2.csv";
// 创建CSVReader和CSVWriter
try (CSVReader csvReader = new CSVReader(new FileReader(inputFile));
     CSVWriter csvWriter = new CSVWriter(new FileWriter(outputFile))) {
    // 读取每一行
    List<String[]> lines = csvReader.readAll();
    for (String[] line : lines) {
        System.out.println(String.join(",", line));
        // 写入新的csv文件
        csvWriter.writeNext(line);
    }
} catch (IOException | CsvException e) {
    throw new RuntimeException(e);
}
```

## 使用Apache Commons CSV库解析和生成csv文件

引入依赖

```xml
<!-- https://mvnrepository.com/artifact/org.apache.commons/commons-csv -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-csv</artifactId>
    <version>1.10.0</version>
</dependency>
```

示例

```java
String inputFile = "salary.csv";
String outputFile = "salary2.csv";

// CSVParser解析csv文件
CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
        .setSkipHeaderRecord(true) // 跳过Header行
        .build();
try(FileReader reader = new FileReader(inputFile);
    FileWriter writer = new FileWriter(outputFile);
    CSVParser csvParser = new CSVParser(reader, csvFormat);
    CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.EXCEL)){
    for (CSVRecord record : csvParser) {
         String[] values = record.values();
        System.out.println(Arrays.toString(values));

        // CSVPrinter生成csv文件
        csvPrinter.printRecord(record);
    }
} catch (IOException e) {
    throw new RuntimeException(e);
}
```

## 使用Jackson库解析和生成csv文件

引入依赖

```xml
<!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.dataformat/jackson-dataformat-csv -->
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-csv</artifactId>
    <version>2.17.2</version>
</dependency>
```

示例

```java
```

