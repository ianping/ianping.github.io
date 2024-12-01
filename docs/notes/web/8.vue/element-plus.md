---
title: element-plus
createTime: 2024/11/24 15:56:16
permalink: /notes/web/sj7366wf/
---
element-plus官方文档：https://element-plus.org/zh-CN/

> 适用于vue v3

## 安装

`yarn info element-plus versions`

`yarn add element-plus@2.5.0 `

## 引入组件库

### 完整引入

引入组件

```js
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus);
```

### 按需手动引入

按需引入组件及其样式文件

```vue
<script setup>
import { ElButton } from "element-plus";
import "element-plus/theme-chalk/base.css"
import "element-plus/theme-chalk/el-button.css"
</script>

<template>
    <el-button>按钮</el-button>
</template>
```

### 自动引入

自动引入组件，需要安装`unplugin-element-plus`插件

`yarn add unplugin-element-plus --dev`

然后，在vite.config.js中配置插件

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        ElementPlus(),
    ],
});

```

使用

```js
<script setup>
import { ElButton } from "element-plus";
</script>

<template>
    <el-button>按钮</el-button>
</template>

<style scoped></style>
```

### 自定义vue插件全局引入部分插件

在自动引入Element组件的基础上，定义插件，全局引入需要的组件，避免在每个vue中重复import相同的组件。

```js
// plugins/element-plus/index.js
import { ElContainer, ElHeader, ElMain, ElButton } from "element-plus";

const components = [
    ElContainer, 
    ElHeader, 
    ElMain, 
    ElButton
];

export default {
    install: (app, options) => {
        components.forEach(component => {
            app.component(component.name, component);
        })
    },
};
```

使用插件

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'

import elementPlusPlugin from "./plugins/element-plus"

const app = createApp(App)
app.use(elementPlusPlugin)
app.mount('#app')
```

## 使用图标库

### 安装

`yarn add @element-plus/icons-vue`

### 完整引入

```js
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
```

### 按需引入

```vue
<script setup>
import { ref } from "vue";
import { Edit } from "@element-plus/icons-vue";

const size = ref("small");
const color = ref("red");
</script>

<template>
    <div>
        <el-icon :size="size" :color="color">
            <Edit />
        </el-icon>
    </div>
</template>
```

### 自动引入

自动引入图标库，需要安装2个插件

`yarn add unplugin-icons unplugin-auto-import --dev`

然后在vite.config.js中配置插件

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

// import ElementPlus from "unplugin-element-plus/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [
                // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
                ElementPlusResolver(),
                // 自动导入图标组件
                IconsResolver({
                    prefix: "Icon",
                }),
            ],
        }),
        Components({
            resolvers: [
                // 自动导入 Element Plus 组件
                ElementPlusResolver(),
                // 自动注册图标组件
                IconsResolver({
                    enabledCollections: ["ep"],
                }),
            ],
        }),

        Icons({
            autoInstall: true,
        }),
    ],

    resolve: {
        alias: { "@": path.join(__dirname, "./src") },
    },
});
```

使用

```vue
<i-ep-house />
```

### 自定义vue插件全局引入部分图标组件

与element-plus组件一样，使用vue插件全局注册图标组件

```js
// plugins/element-plus/index.js
import {
    Edit,
    Delete,
    ArrowDown,
} from '@element-plus/icons-vue';

const icons = [
    Edit,
    Delete,
    ArrowDown,
]

export default {
    install: (app, options) => {
        components.forEach(component => {
            app.component(component.name, component);
        })

        icons.forEach(icon => {
            app.component(icon.name, icon);
        })
    },
};
```



## 使用组件

### 图标组件

**动态图标组件**

```vue
<script setup>
const menus = [
    {
        name: "仪表盘",
        icon: "HomeFilled", // 图标组件名称
        route: { name: "DashboardHome", path: "/dashboard" },
    },
    // ...
]
</script>

<template>
    <el-menu mode="vertical">
        <el-scrollbar height="calc(100vh - 70px)">
            <template v-for="(menu, outterIndex) in menus">
                <el-menu-item v-if="menu.route && !menu.children" :key="menu.route.name" :index="menu.route.path">
                    <el-icon>
                        <!-- 动态图标组件 -->
                        <component v-if="menu.icon" :is="menu.icon" />
                        <Grid v-else />
                    </el-icon>

                    <span>{{ menu.name }}</span>
                </el-menu-item>
            </template>
		</el-scrollbar>
    </el-menu>
</template>
```

### Menu菜单

**在菜单中使用router**

1. 设置`el-menu`标签的`router`属性为true

2. 设置`el-menu-item`标签的`index`属性为路由path

3. `el-menu`标签的`default-active`属性表示默认激活的菜单项index

```vue
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";

const appTitle = import.meta.env.VITE_APP_TITLE;
const route = useRoute();

const menuData = [
    { path: "/books", text: "图书管理" },
    { path: "/readers", text: "读者管理" },
    { path: "/borrowRecords", text: "借阅管理" },
];

const defaultActiveMenuIndex = ref("/");

onMounted(() => {
    defaultActiveMenuIndex.value = route.path;
})


</script>

<template>
    <el-menu mode="horizontal" router :default-active="defaultActiveMenuIndex" :ellipsis="false">
        <el-menu-item index="/">
            <div class="brand">
                <img src="/vite.svg" alt="">
                <span>{{ appTitle }}</span>
            </div>
        </el-menu-item>
        
        <el-menu-item v-for="item in menuData" :key="item.path" :index="item.path">{{ item.text }}</el-menu-item>
        
        <div class="flex-grow" />
    </el-menu>
</template>

<style lang="less" scoped>
.brand {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 1.4em;

    img {
        margin-right: 5px;
        width: 25px;
    }
}

.flex-grow {
    flex-grow: 1;
}
</style>

```



**垂直菜单，el-menu下同时存在el-menu-item和el-sub-menu标签，并设置了图标，折叠状态下，el-sub-menu的文字标题没有全部消失。**

解决办法：设置折叠状态下的样式

```vue
<template>
    <el-menu
        mode="vertical"
        :default-active="defaultActiveMenuIndex"
        :collapse="uiStore.getAppSidebarCollapse"
        :collapse-transition="true"
        router>
        <div class="header">
            <img class="logo" src="/vite.svg" alt="" />
            <h1>{{ appTitle }}</h1>
        </div>

        <el-scrollbar height="calc(100vh - 70px)">
            <template v-for="(menu, outterIndex) in menus">
                <el-menu-item v-if="menu.route && !menu.children" :key="menu.route.name" :index="menu.route.path">
                    <template #title>
                        <span>{{ menu.name }}</span>
                    </template>
                    <el-icon>
                        <component v-if="menu.icon" :is="menu.icon" />
                        <Grid v-else />
                    </el-icon>
                </el-menu-item>

                <el-sub-menu v-else :key="menu.name" :index="`${outterIndex}`">
                    <template #title>
                        <el-icon>
                            <component v-if="menu.icon" :is="menu.icon" />
                            <Grid v-else />
                        </el-icon>
                        <span>{{ menu.name }}</span>
                    </template>

                    <template v-if="menu.children && menu.children.length">
                        <el-menu-item v-for="subMenu in menu.children" :key="subMenu.route.name" :index="subMenu.route.path">
                            <template #title>
                                <span>{{ subMenu.name }}</span>
                            </template>
                            <el-icon>
                                <component v-if="subMenu.icon" :is="subMenu.icon" />
                            </el-icon>
                        </el-menu-item>
                    </template>
                </el-sub-menu>
            </template>
        </el-scrollbar>
    </el-menu>
</template>

<style lang="less" scoped>
/* 展开时 */
.el-menu--vertical:not(.el-menu--collapse) {
    width: 250px;
    /* min-height: 400px; */
}

/* 折叠时 */
.el-menu--vertical:is(.el-menu--collapse) {
    img {
        margin-right: 0;
    }

    h1,
    .el-sub-menu__title > span {
        display: none;
    }
}

.header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    padding: 10px 0;

    .logo {
        object-fit: contain;
        margin-right: 10px;
    }
}
</style>
```

### Table表格

#### 给表格行动态设置class

使用`row-class-name`属性指定返回类名的方法，这个方法有一个参数，包括当前行数据与索引

```vue
<template>
    <el-table :data="settings" max-height="85vh" empty-text="无数据" :row-class-name="settingsTableRowClassName">
    </el-table>
</tempalte>

<script>
export default {
    
    methods: {
       settingsTableRowClassName(value){
            let {row, rowIndex} = value; // 注意：需要解引用获取row和rowIndex
            if(row.required){
                return 'warning';
            }
            return '';
        },
    }
}
</script>

<style lang="less" scoped>
    // 注意：使用/deep/深度选择器
    .el-table {
        /deep/ .warning {
            background-color: var(--el-color-warning-light-9);
        }
    }
</style>
```

### 文件上传组件

上传图片

```vue
<template>
    <el-upload
               ref="elUploadRef"
               auto-upload
               accept=".png,.jpg,.jpeg"
               :show-file-list="false"
               :before-upload="handlebeforeUploadFile"
               :http-request="handleUploadFile">
        <template #trigger>
            <div class="upload">
                <img v-if="book.cover" :src="baseUrl + book.cover" :alt="book.title" />
                <div class="btns">
                    <el-icon :size="25" color="#fff"><UploadFilled /></el-icon>
                    <el-icon v-if="book.cover" :size="25" color="#fff" @click.stop="handleDeleteBookCover"><Delete /></el-icon>
                </div>
            </div>
        </template>
        <template #tip>
    		<div class="upload-tip">支持1M以内的jpg/png格式图片</div>
        </template>
    </el-upload>
</template>

<script>
    methods: {
        // 上传前检查
        handlebeforeUploadFile(rawFile) {
            let size = rawFile.size;
            if (size / 1024 / 1024 > 1) {
                this.$msg({
                    message: "图片大小超出限制",
                    type: "info",
                });
                return false;
            }
            return true;
        },
		
        // 上传
        async handleUploadFile(options) {
            let formData = {
                code: "BOOK_COVER",
                file: options.file,
            };
            let data = await this.doUploadFile(formData);
            if (data) {
                let url = data.url;
                this.book.cover = url;
            }
        },
		
        // 删除图片(更新图片字段值为null)
        async handleDeleteBookCover() {
            let id = this.book.id;
            if(!id){
                this.book.cover = null;
            }else{
                let data = await this.doDeleteBookCover(id);
                if (data) {
                    this.book.cover = null;
                }
            }
        },
        
        // 使用axios发起HTTP请求, 发送多表单数据
        async doUploadFile(formData) {
            return await this.http.postForm("/files/upload", formData).then((data) => data);
        },
    }
</script>

<style lang="less" scoped>
    .upload {
        position: relative;
        width: 150px;
        height: 150px;
        background-color: var(--c-gray-light);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .btns {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background-color: #333;
            opacity: 0.5;

            * + * {
                margin-left: 20px;
            }
        }

        .btns:hover {
            opacity: 0.6;
        }
    }

    .upload-tip {
        font-size: 0.6em;
        color: #666;
    }
</style>
```

