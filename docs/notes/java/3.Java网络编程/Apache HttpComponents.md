---
title: Apache HttpComponents
createTime: 2024/11/30 22:05:37
permalink: /notes/java/94i3jzw3/
---
Apache HttpComponents是Apache HttpClient 3.x的替代者。

官方文档：https://cwiki.apache.org/confluence/display/HttpComponents/

## 添加依赖

```java
<!-- https://mvnrepository.com/artifact/org.apache.httpcomponents.client5/httpclient5 -->
<dependency>
    <groupId>org.apache.httpcomponents.client5</groupId>
    <artifactId>httpclient5</artifactId>
    <version>5.4.1</version>
</dependency>
```

## 发送GET请求

```java
// 创建HttpClient
try (CloseableHttpClient httpClient = HttpClients.createDefault();) {
    // 定义HttpGet请求
    String url = "https://jsonplaceholder.typicode.com/posts/1";
    HttpGet httpGet = new HttpGet(url);
    // 定义Http响应处理器
    HttpClientResponseHandler<String> httpResponseHandler = new BasicHttpClientResponseHandler();
    // 执行请求,处理响应数据
    String body = httpClient.execute(httpGet, httpResponseHandler);
    System.out.println(body);
} catch (IOException e) {
    throw new RuntimeException(e);
}
```

## 发送POST请求

```java
// 创建HttpClient对象
try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
    // 定义HttpPost请求
    String url = "https://jsonplaceholder.typicode.com/posts";
    Map<String, Object> requestBodyMap = new HashMap<>() {{
        put("title", "foo");
        put("body", "bar");
        put("userId", 1);
    }};
    ObjectMapper objectMapper = new ObjectMapper();
    String requestBody = objectMapper.writeValueAsString(requestBodyMap);
    HttpPost httpPost = new HttpPost(url);
    HttpEntity httpEntity = new StringEntity(requestBody, StandardCharsets.UTF_8);
    httpPost.setEntity(httpEntity);
    // 定义Http响应处理器
    HttpClientResponseHandler<String> httpResponseHandler = new BasicHttpClientResponseHandler();
    // 执行请求,并处理响应数据
    String body = httpClient.execute(httpPost, httpResponseHandler);
    System.out.println(body);
} catch (IOException e) {
    throw new RuntimeException(e);
}
```

## 其它HTTP请求方式

Apache HttpComponents支持全部HTTP请求方式：

- HttpGet
- HttpPost
- HttpPut
- HttpPatch
- HttpDelete
- HttpHead
- HttpOption
- HttpTrace

## 创建HttpClient

使用默认方式创建

```java
CloseableHttpClient httpClient = HttpClients.createDefault();
```

使用系统属性创建，可以在JVM启动时配置系统属性

```java
CloseableHttpClient httpClient = HttpClients.createSystem();
```

自定义HttpClient

```java
Collection<Header> defaultHeaders = new ArrayList<>();
defaultHeaders.add(new BasicHeader(HttpHeaders.CONTENT_TYPE, "application/json"));
defaultHeaders.add(new BasicHeader(HttpHeaders.ACCEPT, "application/json"));
String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 QuarkPC/1.10.0.172";

CloseableHttpClient httpClient = HttpClients.custom()
        .setDefaultHeaders(defaultHeaders)
        .setUserAgent(userAgent)
        .build();
```

或者，直接通过`HttpClientBuilder`构建

```java
CloseableHttpClient httpClient = HttpClientBuilder.create()
        .setDefaultHeaders(defaultHeaders)
        .setUserAgent(userAgent)
        .build();
```

## 配置Http请求



## Http响应处理器

