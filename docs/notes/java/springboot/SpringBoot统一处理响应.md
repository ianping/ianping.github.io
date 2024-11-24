---
title: SpringBoot统一处理响应
createTime: 2024/11/24 15:56:15
permalink: /notes/java/7zyb1vjj/
---
# SpringBoot统一处理响应

## 定义API接口响应数据结构

定义枚举类，声明常用状态码以及消息

```java
@Getter
public class ApiResponse<T> implements Serializable {
    private final int code;
    private final String message;
    private final T data;
    private final long timestamp;

    private ApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(Status.OK.code, Status.OK.message, data);
    }

    public static <T> ApiResponse<T> fail(Status status) {
        return new ApiResponse<>(status.code, status.message, null);
    }

    public static <T> ApiResponse<T> fail(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }

    public enum Status {
        OK(0, "ok"),
        BAD_REQUEST(400, "请求错误"),
        NOT_FOUND(404, "资源不存在"),
        SERVER_ERROR(500, "服务器错误"),
        OTHER(999, "未知错误");

        final int code;
        final String message;

        Status(int code, String message) {
            this.code = code;
            this.message = message;
        }
    }
}
```

## 使用`ResponseBodyAdvice`自动返回统一的响应数据结构

定义一个注解，用于标记是否开启自动返回统一响应数据格式的功能。使用时，只需要在类、方法上使用注解即可

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface EnableApiResponse {
    boolean value() default true;
}
```

定义类，实现`ResponseBodyAdvice`接口，并使用`@RestControllerAdvice`注解

```java
@RestControllerAdvice(basePackages = {"me.lyp.ecommerce"})
@SuppressWarnings("all")
public class CustomResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    private final ObjectMapper objectMapper;

    @Autowired
    public CustomResponseBodyAdvice(ObjectMapper objectMapper){
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        Method method = returnType.getMethod();
        if(method.isAnnotationPresent(EnableApiResponse.class)) {
            EnableApiResponse annotation = method.getAnnotation(EnableApiResponse.class);
            return annotation.value();
        }

        Class<?> declaringClass = returnType.getDeclaringClass();
        if(declaringClass.isAnnotationPresent(EnableApiResponse.class)) {
            EnableApiResponse annotation = declaringClass.getAnnotation(EnableApiResponse.class);
            return annotation.value();
        }
        return false;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request,
            ServerHttpResponse response) {
        // 返回值类型为void
        if("void".equalsIgnoreCase(returnType.getParameterType().getName())){
            return body;
        }

        // 返回值类型为String
        if(returnType.getParameterType().isAssignableFrom(String.class)){
            try {
                return objectMapper.writeValueAsString(ApiResponse.ok(body));
            } catch(JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }

        if(body instanceof ApiResponse){
            return body;
        }
        
        return ApiResponse.ok(body);
    }
}
```

## 统一处理异常

自定义业务异常

```java
@Getter
public class BusinessException extends RuntimeException {
    private final int code;

    public BusinessException(int code, String message){
        super(message);
        this.code = code;
    }
}
```

定义全局异常处理器，使用`@RestControllerAdvice`注解

```java
@RestControllerAdvice(basePackages = {"me.ian.blog.controller"})
public class GlobalExceptionHandlerAdvice {

    @ExceptionHandler(value = {Throwable.class})
    public ApiResponse<String> handleException(HttpServletRequest req, HttpServletResponse resp, Throwable throwable) {
        // 参数绑定、校验异常
        if(throwable instanceof MissingServletRequestParameterException ex) {
            return ApiResponse.fail(400, String.format("缺少请求参数%s", ex.getParameterName()));
        }
        if(throwable instanceof BindException ex) {
            return ApiResponse.fail(400, ex.getBindingResult().getAllErrors().get(0).getDefaultMessage());
        }
        if(throwable instanceof ValidationException ex) {
            return ApiResponse.fail(400, ex.getMessage());
        }
        // 处理自定义业务异常
        if (throwable instanceof BusinessException ex){
            return ApiResponse.fail(ex.getCode(), ex.getMessage());
        }
        // 未知错误
        return ApiResponse.fail(ApiResponse.Status.OTHER);
    }
}
```

