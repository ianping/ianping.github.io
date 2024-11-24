---
title: SpringBoot参数校验
createTime: 2024/11/24 15:56:15
permalink: /notes/java/z4tjmiif/
---
## 快速开始

### 0.添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### 1.在实体类中需要被校验的字段上添加校验注解

```java
@Data
public class PostParams {
    private String id;

    private String categoryId;

    @NotBlank(message = "文章标题不能为空")
    private String title;
    
    @Length(max = 4096, message = "文章正文不能超过4096个字符")
    private String content;

    private Boolean draft;

    @Min(value = 0, message = "序号不能为负数")
    private Integer seq;
}
```

### 2.在Controller方法参数上使用 `@Valid` 或 `@Validated` 注解

```java
@PostMapping
public ApiResult<PostVO> addPost(@RequestBody @Valid PostParams params){
    PostVO data = postService.save(params);
    return ApiResult.success(data);
}
```

### 4.处理校验错误

可以在控制器方法中获取到参数校验结果，校验结果信息包含在`BindingResult`对象中

```java
@PostMapping
public ApiResult<PostVO> addPost(@RequestBody @Valid PostParams params, BindingResult bindingResult){
    if(bindingResult.hasErrors()){
        ObjectError error = bindingResult.getAllErrors().get(0);
        String message = error.getDefaultMessage();
        return ApiResult.fail(400, message);
    }
    PostVO data = postService.save(params);
    return ApiResult.success(data);
}
```

也可以在全局异常处理器中处理校验失败异常，校验失败会抛出`MethodArgumentNotValidException`异常，它是`BindException`异常的子类

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({Exception.class})
    public ApiResult<Object> handle(Exception ex) {
        if(ex instanceof BindException e) {
            ObjectError error = e.getAllErrors().get(0);
            String message = error.getDefaultMessage();
            return ApiResult.fail(400, message);
        } else if(ex instanceof ValidationException e) {
            String message = e.getMessage();
            return ApiResult.fail(400, message);
        } else {
            return ApiResult.fail(400, "系统错误");
        }
    }
}
```


## 分组校验

默认校验都属于*jakarta.validation.groups.Default*分组接口，可以自定义其它分组校验接口。

`@GroupSequence`注解用于定义校验分组的执行顺序。

```java
@GroupSequence({Default.class, Group.Add.class, Group.Update.class, Group.Delete.class, Group.Query.class})
public interface Group {
    interface Add {}
    interface Update {}
    interface Delete {}
    interface Query {}
}
```

在被校验的字段注解上，使用groups属性指定分组

```java
@Data
public class PostParams {
    @NotNull(message = "文章ID不能为空", groups = {Group.Update.class})
    private String id;

    private String categoryId;

    @NotBlank(message = "文章标题不能为空", groups = {Group.Add.class})
    private String title;

    @Length(max = 4096, message = "文章正文不能超过4096个字符")
    private String content;

    private Boolean draft;

    @Min(value = 0, message = "序号不能为负数")
    private Integer seq;
}
```

在方法参数上，使用 `@Validated` 注解，并指定要校验的分组

```java
@PostMapping
public ApiResult<PostVO> addPost(@RequestBody @Validated({Default.class, Group.Add.class}) PostParams params){
    PostVO data = postService.save(params);
    return ApiResult.success(data);
}
```

## 校验`@GetMapping`方法中的参数

```java
@RestController
@RequestMapping("/api/v1/borrow/records")
@Validated
public class BorrowRecordController {
    /**
     * 查看借阅记录
     */
    @GetMapping
    public ApiResponse<Pager<BorrowRecordVO>> findBorrowRecords(
            @Min(value = 1, message = "页码不能小于1") @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo,
            @Min(value = 1, message = "每页记录数不能小于1") @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "readerId", required = false) Long readerId, @RequestParam(value = "bookId", required = false) Long bookId) {
        return borrowRecordService.findListByPage(pageNo, pageSize, readerId, bookId);
    }
}
```

## 自定义校验注解 

### 1.创建自定义校验注解

在`@Constraint`注解中，指定要使用的校验器类

```java
@Documented
@Target({ElementType.FIELD,ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CustomValidator.class)
public @interface CustomValidation {
    String message() default "Invalid value";

    Class<?>[] groups() default { };

    Class<? extends Payload>[] payload() default { };
}
```

### 2.创建自定义校验器类

创建类，实现`ConstraintValidator`接口，泛型参数分别是自定义的注解类型，和要检验的值类型

```java
public class CustomValidator implements ConstraintValidator<CustomValidation, String> {
    @Override
    public void initialize(CustomValidation constraintAnnotation) {
        // 初始化
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null || value.startsWith("summary:");
    }
}
```

### 3.在实体类字段中使用自定义校验注解

```java
@CustomValidation(message = "文章摘要必须以summary:开头")
private String summary;
```

