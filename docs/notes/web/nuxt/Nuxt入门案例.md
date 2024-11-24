---
title: Nuxt入门案例
createTime: 2024/11/24 15:56:16
permalink: /notes/web/jwza06dg/
---
## Nuxt创建项目

`npx nuxi@latest init <project_name>`

报错：

```
Error: Failed to download template from registry: Failed to download https://raw.githubusercontent.com/nuxt/starter/templates/templates/v3.json: TypeError: fetch failed
```

网络问题，修改hosts文件，手动配置域名对于的IP，IP可从网站 https://www.ipaddress.com/ 获取

```
185.199.111.133  raw.githubusercontent.com
```

