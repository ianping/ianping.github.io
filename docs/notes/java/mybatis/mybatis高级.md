---
title: mybatis高级
createTime: 2024/11/24 15:56:15
permalink: /notes/java/w7tsyrvf/
---
参考：

- 官方文档：https://mybatis.org/mybatis-3/zh_CN/configuration.html

## 配置

mybatis配置文件中的元素，必须按照指定顺序书写：

`properties -> settings -> typeAliases -> typeHandlers -> objectFactory -> objectWrapperFactory -> reflectorFactory -> plugins -> environments -> databaseIdProvider -> mappers`

## 类型处理器

自定义Json类型处理器

```java
public class JsonTypeHandler<T> extends BaseTypeHandler<T> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException {
        try {
            String json = objectMapper.writeValueAsString(parameter);
            ps.setString(i, json);
        } catch(JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public T getNullableResult(ResultSet rs, String columnName) throws SQLException {
        try {
            String json = rs.getString(columnName);
            if(json != null){
                return objectMapper.readValue(json, getRawTypeClass());
            }
        } catch(JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public T getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        try {
            String json = rs.getString(columnIndex);
            if(json != null){
                return objectMapper.readValue(json, getRawTypeClass());
            }
        } catch(JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public T getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        try {
            String json = cs.getString(columnIndex);
            if(json != null){
                return objectMapper.readValue(json, getRawTypeClass());
            }
        } catch(JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    // 获取原始类型（T）的Class对象
    @SuppressWarnings("unchecked")
    private Class<T> getRawTypeClass() {
        return  (Class<T>)((ParameterizedType)super.getRawType()).getActualTypeArguments()[0];
    }
}
```

自定义枚举类型处理器

```java
public enum Color {
    RED("红"),ORANGE("橙"),YELLOW("黄"),GREEN("绿"),BLUE("蓝"),INDIGO("靛"),PURPLE("紫");

    private final String value;

    Color(String value){
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    /**
     * 根据value获取枚举实例
     * */
    public static Color fromValue(String value){
        Color[] instances = Color.values();
        for(Color instance : instances) {
            if(value.equals(instance.value)){
                return instance;
            }
        }
        throw new IllegalArgumentException("No enum constant " + Color.class.getName() + "." + value);
    }
}

public class EnumValueTypeHandler<E extends Enum<E>> extends BaseTypeHandler<E> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, E parameter, JdbcType jdbcType) throws SQLException {
        try {
            Class<E> clz = parameter.getDeclaringClass();
            Field field = clz.getDeclaredField("value");
            field.setAccessible(true);
            Object value = field.get(parameter);
            if(value instanceof String val) {
                ps.setString(i, val);
            } else if(value instanceof Integer val) {
                ps.setInt(i, val);
            }
        } catch(NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    @Override
    public E getNullableResult(ResultSet rs, String columnName) throws SQLException {
        try {
            Class<?> fieldType = getValueType();
            Method method = getFromValueMethod(fieldType);
            if(int.class == fieldType) {
                int value = rs.getInt(columnName);
                return (E) method.invoke(null, value);
            } else if(String.class == fieldType) {
                String value = rs.getString(columnName);
                return (E) method.invoke(null, value);
            }
        } catch(NoSuchMethodException | NoSuchFieldException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public E getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        try {
            Class<?> fieldType = getValueType();
            Method method = getFromValueMethod(fieldType);
            if(int.class == fieldType) {
                int value = rs.getInt(columnIndex);
                return (E) method.invoke(null, value);
            } else if(String.class == fieldType) {
                String value = rs.getString(columnIndex);
                return (E) method.invoke(null, value);
            }
        } catch(NoSuchMethodException | NoSuchFieldException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public E getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        try {
            Class<?> fieldType = getValueType();
            Method method = getFromValueMethod(fieldType);
            if(int.class == fieldType) {
                int value = cs.getInt(columnIndex);
                return (E) method.invoke(null, value);
            } else if(String.class == fieldType) {
                String value = cs.getString(columnIndex);
                return (E) method.invoke(null, value);
            }
        } catch(NoSuchMethodException | NoSuchFieldException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private Class<E> getRawTypeClass() {
        return (Class<E>) ((ParameterizedType) super.getRawType()).getActualTypeArguments()[0];
    }

    /**
     * 获取枚举value属性的类型
     */
    private Class<?> getValueType() throws NoSuchFieldException {
        Class<E> clz = getRawTypeClass();
        Field field = clz.getDeclaredField("value");
        return field.getType();
    }

    /**
     * 获取枚举中的fromValue方法
     */
    private Method getFromValueMethod(Class<?> valueFieldType) throws NoSuchFieldException, NoSuchMethodException {
        Class<E> clz = getRawTypeClass();
        return clz.getMethod("fromValue", valueFieldType);
    }
}
```



## 插件

自定义插件

```java
@Intercepts({@Signature(type = StatementHandler.class, method = "prepare", args = {})})
public class MyPlugin implements Interceptor {
    private Properties props = new Properties();

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        System.out.println("执行sql之前的逻辑");
        StatementHandler statementHandler = (StatementHandler) invocation.getTarget();
        BoundSql boundSql = statementHandler.getBoundSql();
        Object parameterObject = boundSql.getParameterObject();

        Object result = invocation.proceed();

        System.out.println("执行sql之后的逻辑");
        return result;
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {
        this.props = properties;
    }
}
```



## 缓存
