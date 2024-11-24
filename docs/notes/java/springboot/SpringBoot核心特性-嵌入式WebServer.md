---
sidebar: auto
title: SpringBoot核心特性-嵌入式WebServer
createTime: 2024/11/24 15:56:15
permalink: /notes/java/rna89tr9/
---

# SpringBoot核心特性-嵌入式WebServer

SpringBoot将Servlet容器抽象为WebServer

## 源码分析

### WebServer

`WebServer`接口

```java
public interface WebServer {
	void start() throws WebServerException;
	void stop() throws WebServerException;
	int getPort();
	default void shutDownGracefully(GracefulShutdownCallback callback) {
		callback.shutdownComplete(GracefulShutdownResult.IMMEDIATE);
	}
}
```

由具体的Servlet容器实现：

- `TomcatWebServer`
- `UndertowWebServer`
- `JettyWebServer`
- `NettyWebServer`

### WebServerFactory

`WebServerFactory`接口及其子接口`ServletWebServerFactory`和`ReactiveWebServerFactory`

```java
public interface WebServerFactory {

}

@FunctionalInterface
public interface ServletWebServerFactory extends WebServerFactory {
	WebServer getWebServer(ServletContextInitializer... initializers);
}

@FunctionalInterface
public interface ReactiveWebServerFactory extends WebServerFactory {
	WebServer getWebServer(HttpHandler httpHandler);
}
```

`ServletWebServerFactory`由具体的Servlet容器实现：

- `TomcatServletWebServerFactory`
- `UndertowServletWebServerFactory`
- `JettyServletWebServerFactory`

`ReactiveWebServerFactory`由具体的Reactive容器实现：

- `TomcatReactiveWebServerFactory`
- `UndertowReactiveWebServerFactory`
- `JettyReactiveWebServerFactory`
- `NettyReactiveWebServerFactory`

在具体的Servlet或Reactive容器工厂中，实现`getWebServer`方法，创建具体的`WebServer`实例。

## 使用其它Servlet容器



## 使用Servlet



## 使用Filter



## 使用Listener

