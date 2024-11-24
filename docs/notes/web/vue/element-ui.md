---
title: element-ui
createTime: 2024/11/24 15:56:16
permalink: /notes/web/chnyk7nf/
---
element-ui官网：https://element.eleme.cn/#/zh-CN/component/installation

> 适用于vue v2

## 安装

`npm i element-ui -S` 或 `yarn add element-ui`

## vue中引入

### 完整引入

```js
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
```

### 按需引入

安装babel-plugin-component

`yarn add babel-plugin-component --dev`

在 .babelrc (vue项目是babel.config.js)配置文件中，添加配置

```js
module.exports = {
    presets: [
      "@vue/cli-plugin-babel/preset", 
      ["es2015", { modules: false }]
    ],
    plugins: [
        [
            "component",
            {
                libraryName: "element-ui",
                styleLibraryName: "theme-chalk",
            },
        ],
    ],
};
```

启动服务, 报错: *Error: Cannot find module 'babel-preset-es2015'*。

需要修改 es2015 为 @babel/preset-env

按需引入组件

```js
// plugins/element-ui/index.js

import Vue from 'vue';

import {
    Button
}from 'element-ui';

const components = [
    Button
];

components.forEach(component => Vue.use(component))
```

## 使用组件

**布局容器**



**导航菜单**



**表单**



**表格**