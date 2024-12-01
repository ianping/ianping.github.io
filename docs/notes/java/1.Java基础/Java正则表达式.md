---
title: Java正则表达式
createTime: 2024/11/24 15:56:15
permalink: /notes/java/rcbw0k9t/
---
获取`Pattern`对象

```java
Pattern pattern = Pattern.compile("(([Hh])ello).*?");
```

获取`Matcher`对象

```java
Matcher matcher = pattern.matcher("hello, world!");
```

判断是否匹配

```java
boolean matches = matcher.matches();
System.out.println(matches);
```

替换

```java
if(matcher.matches()) {
    String result = matcher.replaceFirst("Hi");
    System.out.println(result);
}
```

分组匹配

```java
if(matcher.find()) {
    int groups = matcher.groupCount();
    System.out.println(groups);

    for(int i = 0; i <= groups; i++) {
        System.out.printf("group(%s)=%s%n", i, matcher.group(i));
    }
}
```

