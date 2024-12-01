---
title: echarts
createTime: 2024/11/30 20:45:10
permalink: /notes/web/75s65rf7/
---
## 原生js使用echarts

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script src="echarts.js"></script>
  </head>
</html>
```

## vue使用echarts

### 引入echarts库

`yarn info echarts versions`

`yarn add echarts@5.5.1`

### 示例

```vue
<template>
  <div id="barChart" ref="barChartRef" style="width: 100%; height: 300px"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import * as echarts from "echarts";

let barChart;
const barChartRef = ref();

onMounted(() => {
  initBarChart();
});

/**
 * 初始化柱状图
 * */
function initBarChart() {
  // 基于准备好的dom，初始化echarts实例
  barChart = echarts.init(barChartRef.value);
  // 绘制图表
  barChart.setOption({
    title: {
      text: "ECharts 入门示例",
    },
    tooltip: {},
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  });

  // 自适应大小
  window.addEventListener('resize', () => {
    barChart.resize();
  });
}
</script>

```

