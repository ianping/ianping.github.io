---
title: vue-router4
createTime: 2024/11/24 15:56:16
permalink: /notes/web/qw1hv7dx/
---
vue-router4官方文档：https://router.vuejs.org/zh/guide/

> vue-router4 适用于 vue3

## 安装

`yarn info vue-router versions`

`yarn add vue-router@4.2.5`

## 快速开始

创建router/index.js文件，并在其中编写模块导入语句、vue组件导入语句、路由规则定义语句、创建路由对象等

```js
import { createRouter, createWebHistory, } from 'vue-router';


const loginView = () => import('@/view/sys/Login.vue');

const routes = [
    {
        path: "/login",
        component: loginView,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


export default router;
```

在App.vue中声明一个路由出口，路由规则匹配到的vue组件，将被渲染到这里

```vue
<template>
  <router-view></router-view>
</template>
```

最后在main.js中，导入路由对象，并注册到vue实例中

```vue
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


const app = createApp(App);
app.use(router);
app.mount('#app');
```

## 导航守卫

### 全局前置守卫

```js
router.beforeEach(async (to, from) => {
    const canAccess = await canUserAccess(to);
    if (!canAccess) {
        return { name: "login", replace: true, query: { redirect: to.fullPath } };
    }
});

async function canUserAccess(to) {
    if (to.name === "login" || !to.meta.requiresAuth) {
        return true;
    }

    let accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        return true;
    }

    return false;
}
```

