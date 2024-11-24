---
title: VMware
createTime: 2024/11/24 15:56:15
permalink: /article/hjch40kw/
---
## VMWare Workstation虚拟机配置固定IP

1.网络配置模式

网络适配器中选择"NAT"模式。

2.配置静态IP,网关IP,DNS服务器

查看IP范围：`ifconfig`

查看网关信息：`route -n`

Ubuntu: 

`vim /etc/netplan/00-installer-config.yaml`

```
network:
  ethernets:
    ens33:
      dhcp4: false # 禁用动态IP
      addresses: [192.168.95.128/24] # 静态IP
      routes:
        - to: default
          via: 192.168.95.2 # 网关IP
      nameservers:
        addresses: [8.8.8.8,114.114.114.114] # DNS服务器
  version: 2
```

`netplan apply`

CentOS: 

`vim /etc/sysconfig/network-scripts/ifcfg-ens33`

```
TYPE=Ethernet    # 网络类型为以太网
BOOTPROTO=none   #ip获取方式，DHCP为自动获取，静态IP为none和static
NAME=ens33             #网卡名称
DEVICE=ens33           # 网卡设备名，设备名一定要跟文件名一致 
ONBOOT=yes             # 该网卡是否随网络服务启动
IPADDR=192.168.95.128     # 静态ip地址 
NETMASK=255.255.255.0     # 子网掩码
GATEWAY=192.168.95.2      # 网关
DNS1=8.8.8.8                  # 8.8.8.8为Google提供的免费DNS服务器的IP地址   
DNS2=114.114.114.114          # 8.8.4.4为Google提供的免费DNS服务器的IP地址
```

`service network restart`



