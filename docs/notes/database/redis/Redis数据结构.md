---
title: Redis数据结构
createTime: 2024/11/24 15:56:14
permalink: /notes/database/2uo5tz81/
---
参考：https://redis.io/docs/data-types/

## string



## list



## set



## hash



## zset



## Bitmaps

Bitmaps是一种特殊的字符串，只能存储二进制的0和1。可以将其理解为存储0和1的数组。

以用户访问记录为例：

设置值

```sh
# setbit key offset value
setbit user:visit:2023-01-01 0 1
setbit user:visit:2023-01-01 2 1
setbit user:visit:2023-01-01 4 1
setbit user:visit:2023-01-01 6 1

setbit user:visit:2023-01-02 0 1
setbit user:visit:2023-01-02 1 1
setbit user:visit:2023-01-02 3 1
```

获取值

```sh
# getbit key offset
getbit user:visit:2023-01-01 0
getbit user:visit:2023-01-01 100
```

获取值为1的位个数

```sh
# bitcount key [start end [BYTE|BIT]]
bitcount user:visit:2023-01-01
bitcount user:visit:2023-01-01 10
bitcount user:visit:2023-01-01 10 20
```

获取特定位的偏移量

```sh
# bitpos key bit [start [end [BYTE|BIT]]]
bitpos user:visit:2023-01-01 0
bitpos user:visit:2023-01-01 1
bitpos user:visit:2023-01-01 1 0 100
```

按位操作

```sh
# bitop AND|OR|XOR|NOT destkey key [key ...]
# AND
bitop and user:visit:2023-01-01:2023-01-02 user:visit:2023-01-01 user:visit:2023-01-02
bitcount user:visit:2023-01-01:2023-01-02
```

## HyperLogLog

HyperLogLog是一种特殊的字符串，使用基数估计算法，用于统计一个集合中不重复元素的数量。

添加元素

```sh
# pfadd key [element [element ...]]
pfadd visitors:2023-01-01 1 3 3 4 5 7
pfadd visitors:2023-01-02 1 2 3 6 7
```

获取基数：获取多个key的基数时，会将多个key合并为1个临时的HyperLogLog，返回临时HyperLogLog的基数

```sh
# pfcount key [key ...]
pfcount visitors:2023-01-01
pfcount visitors:2023-01-02
pfcount visitors:2023-01-01 visitors:2023-01-02
```

合并HyperLogLog

```sh
# pfmerge destkey [sourcekey [sourcekey ...]]
pfmerge visitors:2023-01 visitors:2023-01-01 visitors:2023-01-02
pfcount visitors:2023-01
```

## 地理空间

添加成员

```sh
# 默认返回添加的元素数量，CH参数表示返回更改的元素数量
geoadd key [NX|XX] [CH] longitude latitude member [longitude latitude member ...]
```

获取指定成员的坐标

```sh
geopos key [member [member ...]]
```

获取指定成员的坐标，以geo hash字符串形式返回

```sh
geohash key [member [member ...]]
```

获取2个成员之间的距离

```sh
geodist key member1 member2 [M|KM|FT|MI]
# [M|KM|FT|MI]单位，默认M
```

获取以指定坐标为圆心、指定半径内的元素

```sh
georadius key longitude latitude radius M|KM|FT|MI [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]] [ASC|DESC] [STORE key|STOREDIST key]
# longitude: 经度 
# latitude: 纬度
# radius M|KM|FT|MI: 半径 单位
```

获取以指定成员为圆心、指定半径内的元素

```sh
georadiusbymember key member radius M|KM|FT|MI [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]] [ASC|DESC] [STORE key|STOREDIST key]
```

搜索指定范围内的成员：支持圆形范围和矩形范围

```sh
geosearch key 
FROMMEMBER member|FROMLONLAT longitude latitude 
BYRADIUS radius M|KM|FT|MI|BYBOX width height M|KM|FT|MI [ASC|DESC] [COUNT count [ANY]] [WITHCOORD] [WITHDIST]
# FROMMEMBER member|FROMLONLAT longitude latitude: 搜索中心,可以使用成员或坐标
# BYRADIUS radius M|KM|FT|MI|BYBOX width height M|KM|FT|MI: 搜索范围,可以使用圆形或矩形
```

