---
title: ELK环境搭建
createTime: 2024/11/24 15:56:15
permalink: /notes/middleware/zd95wqzr/
---
## 使用Docker搭建ElasticSearch单节点

> 参考：https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html

1.下载镜像

`docker pull elasticsearch:8.12.2`

2.创建并运行容器

`docker run --name es8 -p 9200:9200 -it elasticsearch:8.12.2`

参数说明：

- `-p 9200:9200`：REST API访问端口
- `-p 9300:9300`：ES节点之间通信端口(单节点可以不公开)
- `-e "discovery.type=single-node"`：单节点
- `-e "xpack.security.enabled=true"`：支持HTTPs
- `-e "xpack.security.enrollment.enabled=true"`

3.查看es信息

第一次启动es的时候，会在控制台输出密码以及kibana token等信息

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Elasticsearch security features have been automatically configured!
✅ Authentication is enabled and cluster connections are encrypted.

ℹ️  Password for the elastic user (reset with `bin/elasticsearch-reset-password -u elastic`):
 M*OvmQUu4W8wjqfq_JvL

ℹ️  HTTP CA certificate SHA-256 fingerprint:
  f32c06bc6f1fe6b682cfa0a363eb31d1eba1bf567bd236c52226184fe911a6e5

ℹ️  Configure Kibana to use this cluster:
• Run Kibana and click the configuration link in the terminal when Kibana starts.
• Copy the following enrollment token and paste it into Kibana in your browser (valid for the next 30 minutes):
  eyJ2ZXIiOiI4LjEyLjIiLCJhZHIiOlsiMTcyLjE3LjAuMjo5MjAwIl0sImZnciI6ImYzMmMwNmJjNmYxZmU2YjY4MmNmYTBhMzYzZWIzMWQxZWJhMWJmNTY3YmQyMzZjNTIyMjYxODRmZTkxMWE2ZTUiLCJrZXkiOiJjY0FHVzQ0QnZhN2s2ZEVhdkNzWjpKd2xvM2Yyc1NRT01aanV5Zl9MVmdBIn0=

ℹ️ Configure other nodes to join this cluster:
• Copy the following enrollment token and start new Elasticsearch nodes with `bin/elasticsearch --enrollment-token <token>` (valid for the next 30 minutes):
  eyJ2ZXIiOiI4LjEyLjIiLCJhZHIiOlsiMTcyLjE3LjAuMjo5MjAwIl0sImZnciI6ImYzMmMwNmJjNmYxZmU2YjY4MmNmYTBhMzYzZWIzMWQxZWJhMWJmNTY3YmQyMzZjNTIyMjYxODRmZTkxMWE2ZTUiLCJrZXkiOiJjc0FHVzQ0QnZhN2s2ZEVhdkNzWjpHN3ZhOTVOMVM2S05aZTZuRDZOQXJ3In0=

  If you're running in Docker, copy the enrollment token and run:
  `docker run -e "ENROLLMENT_TOKEN=<token>" docker.elastic.co/elasticsearch/elasticsearch:8.12.2`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4.验证

访问：https://172.30.149.49:9200/，输入用户和密码（elastic/M*OvmQUu4W8wjqfq_JvL）

```json
{
    "name": "457a6c648133",
    "cluster_name": "docker-cluster",
    "cluster_uuid": "mwpE7ruXTYeOTyK9XcAPsQ",
    "version": {
        "number": "8.12.2",
        "build_flavor": "default",
        "build_type": "docker",
        "build_hash": "48a287ab9497e852de30327444b0809e55d46466",
        "build_date": "2024-02-19T10:04:32.774273190Z",
        "build_snapshot": false,
        "lucene_version": "9.9.2",
        "minimum_wire_compatibility_version": "7.17.0",
        "minimum_index_compatibility_version": "7.0.0"
    },
    "tagline": "You Know, for Search"
}
```

## 使用Docker安装Kibana

1.下载镜像

`docker pull kibana:8.12.2`

2.创建容器

`docker create --name kibana -p 5601:5601 kibana:8.12.2`

3.启动容器

`docker start kibana`

4.验证

访问kibana面板：http://172.30.149.49:5601/

1. 输入第一次启动es时输出的kibana token

2. 在kibana控制台中查看6位数字验证码：`docker logs -f kibana`
3. 输入es的用户名和密码

![](../_/20240320165456.png)

## Logstash

## Beats
