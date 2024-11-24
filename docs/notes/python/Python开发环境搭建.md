---
title: Python开发环境搭建
createTime: 2024/11/24 15:56:15
permalink: /notes/python/3xdslzb9/
---
## Python

1.下载安装包

https://www.python.org/downloads/

2.安装或解压

3.配置环境变量

在PATH环境变量中，添加以下2个路径：

- path/to/python3.xx
- path/to/python3.xx/Scripts

## pip

## virtualenv

官网：https://virtualenv.pypa.io/en/latest/

安装

`python -m pip install virtualenv`

## venv

## Anaconda

## Miniconda

Anaconda的精简版本

https://docs.anaconda.com/miniconda/

安装后，需要在PATH环境变量中添加下面2个路径：

- path/to/miniconda3
- path/to/miniconda3/Scripts

初始化conda Shell环境：`conda init`

查看env列表：`conda info --envs`

创建env：`conda create -n env_name`

创建指定Python版本的env：`conda create -n python2.7 python=2.7`

删除env：`conda remove --name env_name --all`

激活base env：`conda activate`

激活指定env：`conda activate env_name`

取消激活env：`conda deactivate`

安装lib：`conda install lib_name`

更新lib：`conda update lib_name`

查看lib列表：`conda list`