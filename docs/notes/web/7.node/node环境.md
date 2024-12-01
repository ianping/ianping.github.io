---
title: node包管理工具
createTime: 2024/11/24 15:56:16
permalink: /notes/web/uoc932m8/
---
## node

下载：https://nodejs.org/en/download/prebuilt-installer

## npm

### 配置

查看配置

`npm config list`

查看全局安装路径前缀 `npm config get prefix`

配置全局安装路径前缀

`npm config set prefix path/to/node_global`

查看全局安装位置 `npm root -g`

查看、设置下载源

`npm config get registry`

`npm config set registry xxx`

`npm cache clean --force`

常用的源：

- npm：https://registry.npmjs.org/

- yarn：https://registry.yarnpkg.com/

- cnpm： https://r.cnpmjs.org/

- 中科大：https://npmreg.proxy.ustclug.org/
- 淘宝：https://registry.npmmirror.com/

- 腾讯： https://mirrors.cloud.tencent.com/npm/

### 常用命令

安装当前项目的依赖包 `npm install`

安装到当前项目的node_modules目录 `npm install xxx`

安装到全局的node_modules目录 `npm install xxx --global`  或 `npm install xxx -g`

将包名和版本信息添加的dependencies下(默认)：`npm install xxx --save` 或 `npm install xxx -S`

将包名和版本信息添加到devDependencies下：`npm install xxx --save-dev` 或 `npm install xxx -D`

安装时指定版本号：`npm install xxx@1.2.3`

卸载包

卸载当前项目中的依赖包

`npm uninstall xxx`

`npm uninstall xxx --save`

`npm uninstall xxx --save-dev`

卸载全局依赖包

`npm uninstall -g xxx`

更新包

`npm update xxx`

查看

`npm list`

`npm list -g`

初始化项目

`npm init` 或 `npm init -y`

其它命令

运行package.json中定义的脚本命令

`npm run test`

查看包信息

`npm info xxx`

查看包版本信息

`npm view xxx versions`

在npm仓库搜索包

`npm search xxx`

清理npm缓存

`npm cache clean`

## yarn

参考：https://classic.yarnpkg.com/en/docs/

### 安装

`npm view yarn versions`

`npm install -g yarn@1.22.19`

### 配置

查看配置列表 `yarn config list`

修改配置项 `yarn config set strict-ssl false`

配置镜像源

`yarn config get registry`

`yarn config set registry https://registry.npmmirror.com/`

在Windows中，yarn全局安装目录和全局bin目录要在同一个盘符下，否则执行bin目录下的命令时会报错。

查看全局安装目录 `yarn global dir`

查看全局bin目录 `yarn global bin`

配置yarn全局安装目录：`yarn config set global-folder "D:\dev\nodejs\node_global"`

配置yarn缓存目录：`yarn config set cache-folder "D:\dev\nodejs\node_cache"`

### 常用命令

`yarn --version`

`yarn init`

`yarn install`

`yarn add webpack`

`yarn add webpack --dev`

`yarn global add webpack`

`yarn upgrade`

`yarn upgrade webpack`

`yarn upgrade --latest`

`yarn remove webpack`

`yarn list --depth 0`

`yarn info webpack`

`yarn info webpack versions`

## pnpm

启用

`corepack enable`
