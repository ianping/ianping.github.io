---
title: SpringBoot集成RestTemplate
createTime: 2024/11/24 15:56:15
permalink: /notes/java/m7vtt59f/
---

## 自定义RestTemplate

```java
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        RestTemplateBuilder builder = new RestTemplateBuilder();
        return builder.requestFactory(this::httpRequestFactory)
                      .build();
    }

    @Bean
    public ClientHttpRequestFactory httpRequestFactory() {
        HttpComponentsClientHttpRequestFactory httpRequestFactory = new HttpComponentsClientHttpRequestFactory();
        httpRequestFactory.setConnectTimeout(5000);
        httpRequestFactory.setReadTimeout(5000);
        return httpRequestFactory;
    }
}
```





## 发送数组参数

```java
Map<String,List<String>> uriVars = new LinkedMultiValueMap<>(){{
    put("ids", List.of("a","b","c"));
}};
ApiResult<List<Product>> apiResult = restTemplate.getForObject("http://localhost:8100/api/v1/products/?ids={ids}", ApiResult.class, uriVars);
```



## 请求HTTPS资源