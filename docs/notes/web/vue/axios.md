---
title: axios
createTime: 2024/11/24 15:56:16
permalink: /notes/web/bkftgxxv/
---


## Axios安装

`yarn info axios versions`

`yarn add axios@1.6.8`

顺便安装一下qs库，用于序列化请求参数

`yarn add qs`

## 创建axios实例

简单封装一下

```js
import axios from "axios";
import qs from "qs";

// 创建axios实例
const http = axios.create({
    baseURL: "localhost:8080",
    timeout: 10000,
    headers: {},
    paramsSerializer: (params) => qs.stringify(params, { 
        arrayFormat: "comma", // 数组参数分隔符: 逗号
        allowDots: true   // 允许点符号, 用于支持GEt请求中的嵌套对象参数
    }),
});

export default http;
```

## 使用vue插件的方式提供全局axios实例

创建vue插件

```js
// plugins/axios/index.js

import axios from "axios";
import qs from "qs";

const http = axios.create({
    baseURL: "",
    timeout: 2000,
    headers: {},
    paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
    },
});

export default{
    install: (app, options) => {
        app.provide('http', http);
    }
};
```

注册到全局Vue App

```js
// main.js
import axiosPlugin from "./plugins/axios";
app.use(axiosPlugin)
```

使用

```js
<script setup>
import { inject } from "vue";

const http = inject("http");

function handleLogin() {
    let data = {
        username: "admin",
        password: "admin",
    };

    http.post('/api/v1/login', data).then(response => {
        console.log(response.data)
    })
}
</script>
```

## 使用拦截器实现JWT认证

首先，给VueRouter添加全局前置守卫，初步判断用户是否已登陆(本地是否存在访问令牌)，如果未登录，则跳转到登录页面

```js
const ignoreAuthRoutes = ['Login', 'Register', 'NotFound']

const isAuthenticated = () => localStorage.getItem('accessToken') != null;

router.beforeEach((to, from) => {
    if(!ignoreAuthRoutes.includes(to.name) && !isAuthenticated()){
        return {name: 'Login'}
    }
    return true;
})
```

在axios请求拦截器中，设置`Authorization`请求头

```js
import { ElMessage } from 'element-plus'

const showErrorMessage = (message) => {
    ElMessage({message, type: 'error'});
}

const ignoreAuthUrls = ['/api/v1/login', '/api/v1/register', '/api/v1/token']

http.interceptors.request.use(
    function (config) {
        let accessToken = localStorage.getItem('accessToken');
        if(!ignoreAuthUrls.includes(config.url) && !accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    function (error) {
        showErrorMessage('请求出错');
        return Promise.reject(error);
    }
);
```

在axios响应拦截器中，根据响应状态码再次判断用户是否已登陆：

- 如果已登陆，返回响应数据
- 如果未登录，跳转到登录页
- 其它错误，显式错误提示消息

```js
const [SUCCESS_CODE, UNAUTHORIZED_CODE] = [0, 1401];

http.interceptors.response.use(
    function (response) {
        let { config, data } = response;
        let { code, message } = data;
        let realData = data.data;
        
        return new Promise((resolve, reject) => {
            if(code === SUCCESS_CODE){
                resolve(realData);
            }else if(code === UNAUTHORIZED_CODE){
                router.push({ name: 'Login' });
                resolve();
            }else{
                showErrorMessage(message);
                resolve();
            }
        })
    },
    function (error) {
        showErrorMessage('服务器错误');
        return Promise.reject(error);
    }
);
```

登录成功后，将令牌信息缓存到本地

```js
<script>
import { showSuccessMessage } from '@/utils/element-plus'

export default {
	// ...
    inject: ["http"],

    methods: {
        handleLogin() {
            let formRef = this.$refs.formRef;
            formRef.validate(async (valid, fields) => {
                if (valid) {
                    const loginData = await this.doLogin();
                    if (!loginData) return;

                    // 保存token
                    localStorage.setItem("accessToken", loginData.accessToken);
                    localStorage.setItem("refreshToken", loginData.refreshToken);

                    // 跳转页面
                    this.$router.replace("/");
                    showSuccessMessage('登录成功')    
                }
            });
        },

        async doLogin() {
            let data = {
                username: this.formData.username,
                password: this.formData.password,
            };
            return await this.http.post("/api/v1/login", data).then((data) => data);
        },
    },
};
</script>
```



## 使用拦截器实现双Token认证机制

访问令牌+刷新令牌：当访问令牌失效后，自动使用刷新令牌刷新2个令牌，并自动重发访问令牌失效之前的请求。

在axios响应拦截器中，当响应为认证失败时：

1. 移除失效的访问令牌
2. 缓存当前请求
3. 调用接口，刷新2个令牌
4. 刷新成功，重发缓存的请求；刷新失败，跳转到登录页

```js
const [SUCCESS_CODE, UNAUTHORIZED_CODE] = [0, 1401];

http.interceptors.response.use(
    function (response) {
        let { config, data } = response;
        let { code, message } = data;
        let realData = data.data;
        
        // console.log(config, data);
        // console.log(code, message, realData);

        return new Promise(async (resolve, reject) => {
            if (code === SUCCESS_CODE) {
                resolve(realData);
            } else if (code === UNAUTHORIZED_CODE && config.url !== "/api/v1/login") {
                // 移除失效的访问令牌
                localStorage.removeItem("accessToken");
                let refreshToken = localStorage.getItem("refreshToken");
                if(refreshToken){
                    // 缓存当前请求
                    addRequest(() => resolve(http(config)));
                    // 刷新令牌
                    let success = await doRefreshToken(refreshToken);
                    if (success) {
                        // 刷新令牌成功, 重新发送缓存的请求
                        retryRequests();
                    } else {
                        // 刷新令牌失败, 跳转到登录页面
                        localStorage.removeItem('refreshToken')
                        router.push({ name: "Login" });
                    }
                    resolve();
                }
            } else {
                showErrorMessage(message)
                resolve();
            }
        });
    },
    function (error) {
        showErrorMessage("服务器错误")
        return Promise.reject(error);
    }
);

// 请求缓存
const requests = [];

// 添加请求到缓存中
const addRequest = (request) => requests.push(request);

// 重发缓存的请求
const retryRequests = () => {
    requests.forEach((request) => request());
    requests = [];
};

// 正在刷新token?
let refreshing = false;

// 刷新token
const doRefreshToken = async (refreshToken) => {
    if (refreshing) return;

    refreshing = true;
    let data = {
        refreshToken,
    };
    await http.post("/api/v1/token", data).then((data) => {
        let result;
        if (data) {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            result = true;
        } else {
            result = false;
        }
        refreshing = false;
        return result;
    });
};

export default {
    install: (app, options) => {
        app.provide("http", http);
    },
};
```

