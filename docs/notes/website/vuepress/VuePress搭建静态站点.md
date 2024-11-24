---
title: VuePress搭建静态站点
createTime: 2024/11/24 15:56:16
permalink: /article/krbtnlsf/
---
官方文档：https://v2.vuepress.vuejs.org/zh/guide/

主题库：https://www.npmjs.com/search?q=keywords:vuepress-theme

插件库：https://www.npmjs.com/search?q=keywords:vuepress-plugin

官方插件库：https://www.npmjs.com/search?q=@vuepress%20keywords:plugin


## 生成右侧边栏

github: https://github.com/dingshaohua-cn/vuepress-theme-sidebar

安装插件

`yarn config set strict-ssl false`

`yarn add vuepress-theme-sidebar --dev`


## 添加algolia搜索

algolia后台:

- https://dashboard.algolia.com/
- https://crawler.algolia.com/admin/crawler

如果搜索不到任何内容，到crawer后台检查爬虫代码，主要检查其中的url和css选择器，是否与自己的网站匹配。

## 添加百度统计功能

1. 在百度统计中添加网站

2. 复制百度统计js代码，添加到每个页面的head标签中

​	在config.js中配置

```
// 百度统计js代码
const baidu_tj = `var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?67c8f19b27fc99be208ca3ef56c999ef";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();`


export default defineUserConfig({
    head: [
        ["link", { rel: "icon", href: "/favicon.ico" }],
        ["script", { type: "text/javascript" }, baidu_tj],
    ],
    // ...
})
```

## SEO

### 添加robots.txt

```
User-agent: *
Sitemap: https://bitbitpulse.github.io/sitemap.xml

Allow: /
# Disallow: 
```

### sitemap.xml

使用sitemap插件

https://ecosystem.vuejs.press/zh/plugins/sitemap/


### Google收录

https://search.google.com/search-console/

### Bing收录

https://www.bing.com/webmasters/about

### 百度收录

https://ziyuan.baidu.com/site/

### 搜狗

https://zhanzhang.sogou.com/index.php/site/index

### 360收录

https://zhanzhang.so.com/

### 神马站长平台

https://zhanzhang.sm.cn/

## 部署

### Github Pages

源代码和构建文件使用同一个仓库的不同分支：源代码使用main分支，构建文件使用gh-pages分支。

部署脚本：

```sh
# deploy.sh
npm run docs:build

cd docs/.vuepress/dist/

git init
git add --all
git commit -m "deploy"
git branch -M gh-pages
git push -f git@github.com:ianping/ianping.github.io.git gh-pages

# 脚本执行完毕后，不自动退出
cmd /k dir
```

