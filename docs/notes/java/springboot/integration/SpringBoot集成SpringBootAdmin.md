---
title: SpringBoot集成SpringBootAdmin
createTime: 2024/11/24 15:56:15
permalink: /notes/java/9pmrlknv/
---
参考：

- github：https://github.com/codecentric/spring-boot-admin
- 文档：https://docs.spring-boot-admin.com/current/getting-started.html

## 搭建Admin服务端App

1.创建SpringBoot应用

2.添加依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>de.codecentric</groupId>
        <artifactId>spring-boot-admin-starter-server</artifactId>
        <version>3.0.4</version>
    </dependency>
</dependencies>
```

3.在启动引导类上使用`@EnableAdminServer`注解

```java
@SpringBootApplication
@EnableAdminServer
public class AdminServerApp {
    public static void main(String[] args) {
        SpringApplication.run(AdminServerApp.class, args);
    }
}
```

4.配置端口号

```properties
server.port=7000
spring.application.name=admin-server

spring.boot.admin.context-path=/
```

启动应用，访问控制台： http://localhost:7000

## 注册客户端App：SpringBoot

1.添加依赖

```xml
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-client</artifactId>
    <version>3.0.4</version>
</dependency>
```

2.配置

```properties
spring.boot.admin.client.url=http://localhost:7000
management.endpoints.web.exposure.include=*
management.info.env.enabled=true
management.endpoint.health.show-details=always
```

## 注册客户端App：SpringCloud

### 修改Admin服务端App

1.添加服务发现客户端依赖（以nacos为例）

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-server</artifactId>
    <version>3.0.4</version>
</dependency>
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

2.修改配置信息（注册中心信息）

```properties
server.port=7000
spring.application.name=admin-server

spring.boot.admin.context-path=/

spring.cloud.nacos.server-addr=127.0.0.1:8848
spring.cloud.nacos.username=nacos
spring.cloud.nacos.password=nacos

spring.cloud.nacos.discovery.enabled=true
spring.cloud.nacos.discovery.namespace=71bbc384-42fb-4897-aef8-aba4f9e92a79
spring.cloud.nacos.discovery.metadata.management.context-path=${spring.boot.admin.context-path}
```

### 修改Admin客户端App

1.修改依赖信息：

- 移除`spring-boot-admin-starter-client`依赖
- 添加`spring-boot-starter-actuator`依赖
- 添加`spring-cloud-starter-alibaba-nacos-discovery`依赖

```xml
<!--
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-client</artifactId>
    <version>3.0.4</version>
</dependency>
-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

2.配置注册中心信息

```properties
server.port=18000
spring.application.name=account-service

#spring.boot.admin.client.url=http://localhost:7000

management.endpoints.web.exposure.include=*
management.info.env.enabled=true
management.endpoint.health.show-details=always

spring.cloud.nacos.server-addr=127.0.0.1:8848
spring.cloud.nacos.username=nacos
spring.cloud.nacos.password=nacos

spring.cloud.nacos.discovery.enabled=true
spring.cloud.nacos.discovery.namespace=71bbc384-42fb-4897-aef8-aba4f9e92a79
```

## Admin服务端App启用SpringSecurity

1.添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

2.配置Security

```java
@Configuration
@SuppressWarnings({"all"})
public class AppSecurityConfiguration {
    private final AdminServerProperties adminServer;

    @Autowired
    public AppSecurityConfiguration(AdminServerProperties adminServerProperties) {
        this.adminServer = adminServerProperties;
    }


    @Bean
    @Primary
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
        successHandler.setTargetUrlParameter("redirectTo");
        successHandler.setDefaultTargetUrl(this.adminServer.path("/"));

        http.authorizeHttpRequests((authorizeRequests) -> authorizeRequests.requestMatchers(
                                                                                   new AntPathRequestMatcher(this.adminServer.path("/assets/**")))
                                                                           .permitAll()
                                                                           .requestMatchers(new AntPathRequestMatcher(
                                                                                   this.adminServer.path(
                                                                                           "/actuator/info")))
                                                                           .permitAll()
                                                                           .requestMatchers(new AntPathRequestMatcher(
                                                                                   adminServer.path(
                                                                                           "/actuator/health")))
                                                                           .permitAll()
                                                                           .requestMatchers(new AntPathRequestMatcher(
                                                                                   this.adminServer.path("/login")))
                                                                           .permitAll()
                                                                           .dispatcherTypeMatchers(DispatcherType.ASYNC)
                                                                           .permitAll()
                                                                           .anyRequest()
                                                                           .authenticated())
            .formLogin((formLogin) -> formLogin.loginPage(this.adminServer.path("/login"))
                                               .successHandler(successHandler))
            .logout((logout) -> logout.logoutUrl(this.adminServer.path("/logout")))
            .httpBasic(Customizer.withDefaults());

        http.csrf((csrf) -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                                .ignoringRequestMatchers(
                                        new AntPathRequestMatcher(this.adminServer.path("/instances"), POST.toString()),
                                        new AntPathRequestMatcher(this.adminServer.path("/instances/*"),
                                                DELETE.toString()),
                                        new AntPathRequestMatcher(this.adminServer.path("/actuator/**"))));

        http.rememberMe((rememberMe) -> rememberMe.key(UUID.randomUUID()
                                                           .toString())
                                                  .tokenValiditySeconds(1209600));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails admin = User.builder()
                                .username("admin")
                                .password(passwordEncoder.encode("admin"))
                                .roles("ADMIN")
                                .build();
        return new InMemoryUserDetailsManager(admin);
    }
}
```

3.在注册中心元数据中配置用户名和密码

```properties
server.port=7000
spring.application.name=admin-server

spring.security.user.name=admin
spring.security.user.password=admin

spring.boot.admin.context-path=/
spring.boot.admin.instance-auth.enabled=true
spring.boot.admin.instance-auth.default-user-name=${spring.security.user.name}
spring.boot.admin.instance-auth.default-password=${spring.security.user.password}

spring.cloud.nacos.server-addr=127.0.0.1:8848
spring.cloud.nacos.username=nacos
spring.cloud.nacos.password=nacos

spring.cloud.nacos.discovery.enabled=true
spring.cloud.nacos.discovery.namespace=71bbc384-42fb-4897-aef8-aba4f9e92a79

spring.cloud.nacos.discovery.metadata.context-path=${spring.boot.admin.context-path}
spring.cloud.nacos.discovery.metadata.user.name=${spring.security.user.name}
spring.cloud.nacos.discovery.metadata.user.password=${spring.security.user.password}
```

