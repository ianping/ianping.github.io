---
title: vue3
createTime: 2024/11/24 15:56:16
permalink: /notes/web/y00r5326/
---
vue3官方文档：https://cn.vuejs.org/guide/introduction.html

## 使用

### 同时使用 v-if 和 v-for

当 `v-if` 和 `v-for` 在同一个HTML元素上时，前者拥有更高的优先级，导致 `v-if` 中无法访问 `v-for` 作用域中的变量。

推荐的用法

```vue
<script setup>
import {ref} from "vue";

const todos = ref([
  {name: "A", isComplete: true},
  {name: "B", isComplete: false},
  {name: "C", isComplete: true},
]);

</script>

<template>
  <ul>
    <template v-for="todo of todos" :key="todo.name">
      <li v-if="todo.isComplete">{{ todo.name }}</li>
    </template>
  </ul>
</template>
```

### 使用ref获取dom元素

在dom元素中使用ref属性声明变量名，在setup方法中定义一个同名的ref变量，使用这个ref的value即可。

```vue
<template>
<el-form ref="loginFormRef">
    
</el-form>
</template>

<script setup>
import { ref, reactive } from "vue";
    
const loginFormRef = ref();
    
console.log(loginFormRef.value)
</script>
```

