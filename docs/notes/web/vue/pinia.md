---
title: pinia
createTime: 2024/11/24 15:56:16
permalink: /notes/web/f6zba8lq/
---
pinia官方文档：https://pinia.vuejs.org/zh/introduction.html

## 安装

`yarn info pinia versions`

`yarn add pinia@2.1.7`

## 快速开始

**在vue实例中注入pinia**

*main.js*

```js
import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);
```

**创建store**

*store/index.js*

```js
import { defineStore } from "pinia"

export const useUIStore = defineStore("ui", {
    state: () => ({
        appSidebarCollapse: false,
    }),

    getters: {
        getAppSidebarCollapse: (state) => state.appSidebarCollapse,
    },

    actions: {
        toggleAppSidebar(){
            this.appSidebarCollapse = !this.appSidebarCollapse;
        }
    }
})
```

**使用store**

```vue
<script setup>
import { useUIStore } from "@/store";

const uiStore = useUIStore();

function toggleAppSidebar() {
    uiStore.toggleAppSidebar();
}
</script>
```

## 示例：保存用户信息

用户信息会在多个地方使用，并可能被更改，因此，将其存储到store中，并将更改用户信息的操作封装为一个action

*store/index.js*

```js
import { defineStore } from "pinia";
import { inject } from "vue";

export const useLoginUserStore = defineStore("loginUser", {
    state: () => {
        return {
            user: {},
            http: inject('http')
        };
    },
    getters: {
        getName(state) {
            return state.user.nickname || state.user.username;
        },
        getRole(state){
            return state.user.role;
        }
    },
    actions: {
        async updateUser(){
            this.user = await this.http.get('/api/v1/user/info').then(data => data);
        }
        
        // 重置state
        $reset(){
            this.user = {};
        }
    },
});
```

登录成功后，更新store

```vue
<script>
import { mapActions } from 'pinia'
import {useLoginUserStore} from '@/store'
import { showSuccessMessage } from '@/utils/element-plus'
    
export default {
	// ...

    inject: ["http"],

    methods: {
		// 解构action
        ...mapActions(useLoginUserStore, ['updateUser']),

        handleLogin() {
            let formRef = this.$refs.formRef;
            formRef.validate(async (valid, fields) => {
                if (valid) {
                    const loginData = await this.doLogin();
                    if (!loginData) return;

                    // 保存token
                    localStorage.setItem("accessToken", loginData.accessToken);
                    localStorage.setItem("refreshToken", loginData.refreshToken);

                    // 更新store中的用户信息
                    await this.updateUser();

                    // 跳转页面
                    this.$router.replace("/");
                    showSuccessMessage('登录成功')    
                }
            });
        },
    },
};
</script>
```

使用state或getters

```vue
<script>
import { mapState } from "pinia";
import { useLoginUserStore } from "@/store";

export default {
    // ...
    
    computed: {
        ...mapState(useLoginUserStore, {
            user: 'user',
            username: 'getName',
        }),
    },
}
```

## 解决刷新页面后store数据丢失的问题

刷新页面后，vue实例会重新创建，store状态被重置，导致状态丢失。

解决思路是将状态持久化。从概念来讲，适合使用sessionStorage，但是，当关闭浏览器后，sessionStorage数据也会丢失，所以，这里选择localStorage：

1. 页面刷新之前，将state保存到本地
2. vue实例创建后，恢复state

```vue
// 入口组件App.vue
<script>
import { mapState } from 'pinia'
import { useLoginUserStore } from '@/store'

export default {
    data(){
        return {
            store: useLoginUserStore()
        }
    },

    computed: {
        ...mapState(useLoginUserStore, ['user']),
    },

    methods: {
        saveState(){
            // 需要在刷新后恢复的状态
            const state = {
                user: this.user
            }
            localStorage.setItem('state', JSON.stringify(state));
        },

        restoreState(){
            let savedState = JSON.parse(localStorage.getItem('state'))
            if(savedState){
                // 更新状态
                this.store.$patch((state) => {
                    state.user = savedState.user;
                });
            }
        }
    },

    mounted(){
        window.addEventListener('beforeunload', this.saveState);
        this.restoreState();
    }
}
</script>
```

