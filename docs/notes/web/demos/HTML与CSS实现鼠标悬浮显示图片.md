---
title: HTML与CSS实现鼠标悬浮显示图片
createTime: 2024/11/24 15:56:16
permalink: /notes/web/rypds3ps/
---
## 思路

1. 图片容器使用`position: relative`确保内部的绝对定位元素相对于该容器进行定位
2. 图片使用`position: absolute`确保其相对于父容器进行决定定位；使用`display: none`使其默认隐藏
3. 鼠标悬浮到父容器时，使用`display: block`显示图片

## 代码实现

### HTML

```html
<div class="container">
    <img src="qq.jpg" alt="qq" class="qq">
    <img src="qrcode.jpg" alt="qrcode" class="qrcode">
</div>
```

### CSS

```css
.container {
    position: relative;
    width: 30px; /* 图片容器的宽度 */
    height: 30px; /* 图片容器的高度 */
}

.qrcode {
    position: absolute;
    top: 0;
    left: 0;
    display: none; /* 默认隐藏 */
}

.container:hover .qrcode {
    display: block; /* 鼠标悬浮时显示 */
}

```

## 效果展示

![](_/20240219220245.png)
