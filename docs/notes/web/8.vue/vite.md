---
title: vite
createTime: 2024/11/24 15:56:16
permalink: /notes/web/iha5c27g/
---
vite官方文档：https://cn.vitejs.dev/guide/

## 基础使用

### 创建vite项目

`yarn create vite`

`npm create vite@latest`

创建Vite项目，同时指定vue模板

`yarn create vite my-vue-app --template vue`

`npm create vite@latest my-vue-app -- --template vue`

### 启动dev服务器

`cd  my-vue-app`

`yarn`

`yarn dev`

默认端口是5173，支持的选项：

+ --host 指定主机名称
+ --port 指定端口
+ --open 启动时打开浏览器
+ --core 启用跨域
+ --mode 设置环境模式

启动dev服务后，还支持以下快捷方式:

+ h + Enter 查看帮助
+ r + Enter 重启服务器
+ u + Enter 查看URL
+ o + Enter 在浏览器打开
+ q + Enter 停止服务器

### 构建

`yarn build`

支持的选项：

+ --outDir 设置输出目录，默认dist
+ --assetsDir 设置在输出目录下放置资源的目录，默认assets
+ --base 设置公共基础路径，默认 /
+ --mode 设置环境模式

### 本地预览

`yarn preview --port 8000`

## 静态资源处理

**public目录**



## 环境变量与模式

支持dotenv文件：

+ 在JS中使用 `import.meta.env` 对象获取.env文件中的环境变量
+ 在HTML中使用 *%ENV_NAME%* 语法获取.env文件中的环境变量

.env中定义的环境变量名，只能以 VITE_ 开头。

*.env*

```
VITE_APP_TITLE=博客后台管理系统
```

*.env.development*

```
NODE_ENV=development
```

*.env.production*

```
NODE_ENV=production
```

## 配置

> vite.config.js

### resolve.alias

配置根路径(*/src*)别名，这样可以像vue-cli一样，使用@符号

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],

    resolve: {
        alias: { "@": path.join(__dirname, "./src") },
    },
});
```

### server.proxy

配置开发服务器代理，参考 https://cn.vitejs.dev/config/server-options.html#server-proxy

```js
export default defineConfig({    
	server: {
        proxy: {
            "^/api/.*": {
                target: "http://127.0.0.1:8080",
                changeOrigin: true,
                rewrite: (path) => { path.replace(/^\/api/, "/api") },
            }
        }
    }
}
```

