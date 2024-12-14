import{_ as a,c as s,b as n,o}from"./app-DsGHT65_.js";const p={};function r(d,e){return o(),s("div",null,e[0]||(e[0]=[n(`<h2 id="下载" tabindex="-1"><a class="header-anchor" href="#下载"><span>下载</span></a></h2><p>https://zookeeper.apache.org/releases.html</p><h2 id="单机模式" tabindex="-1"><a class="header-anchor" href="#单机模式"><span>单机模式</span></a></h2><h3 id="windows" tabindex="-1"><a class="header-anchor" href="#windows"><span>Windows</span></a></h3><p>1.解压压缩包到安装目录</p><p>2.配置数据目录</p><p><code>cd path/to/apache-zookeeper-3.6.3/</code></p><p><code>mkdir data</code></p><p><code>copy conf/zoo_sample.cfg conf/zoo.cfg</code></p><p>修改conf/zoo.cfg，配置dataDir</p><div class="language- line-numbers-mode" data-ext="" data-title=""><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>tickTime=2000</span></span>
<span class="line"><span>dataDir=path/to/apache-zookeeper-3.6.3/data</span></span>
<span class="line"><span>clientPort=2181</span></span>
<span class="line"><span># Default 8080</span></span>
<span class="line"><span>admin.serverPort=8080</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3.启动ZK Server</p><p><code>cd bin</code></p><p><code>zkServer.cmd</code></p><p>4.连接到ZK Server</p><p><code>zkCli.cmd -server 127.0.0.1:2181</code></p><p>5.运行ZK Client命令</p><p><code>ls /</code></p><p><code>quit</code></p><h3 id="linux" tabindex="-1"><a class="header-anchor" href="#linux"><span>Linux</span></a></h3><p>与Windows基本一样，除了启动ZK Server使用命令 <code>./zkServer.sh start</code></p><h3 id="docker" tabindex="-1"><a class="header-anchor" href="#docker"><span>Docker</span></a></h3><p>zookeeper镜像地址：https://hub.docker.com/_/zookeeper</p><p><code>docker pull zookeeper:3.6.3</code></p><p><code>docker create --name myzk -p 2182:2181 --restart always zookeeper:3.6.3</code></p><p><code>docker exec -it myzk bash</code></p><h2 id="zookeeper集群" tabindex="-1"><a class="header-anchor" href="#zookeeper集群"><span>Zookeeper集群</span></a></h2>`,27)]))}const c=a(p,[["render",r],["__file","index.html.vue"]]),t=JSON.parse('{"path":"/notes/middleware/wx095yyh/","title":"Zookeeper安装","lang":"zh-CN","frontmatter":{"title":"Zookeeper安装","createTime":"2024/11/24 15:56:15","permalink":"/notes/middleware/wx095yyh/"},"headers":[],"readingTime":{"minutes":0.48,"words":143},"git":{"updatedTime":1732441916000,"contributors":[{"name":"ianping","email":"13520322212@163.com","commits":1,"avatar":"https://avatars.githubusercontent.com/ianping?v=4","url":"https://github.com/ianping"}]},"filePathRelative":"notes/middleware/zookeeper/Zookeeper安装.md","bulletin":false}');export{c as comp,t as data};