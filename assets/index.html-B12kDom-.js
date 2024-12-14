import{_ as e,c as n,b as h,o as s}from"./app-DsGHT65_.js";const i={};function t(r,a){return s(),n("div",null,a[0]||(a[0]=[h('<h2 id="设计模式" tabindex="-1"><a class="header-anchor" href="#设计模式"><span>设计模式</span></a></h2><h2 id="数据结构" tabindex="-1"><a class="header-anchor" href="#数据结构"><span>数据结构</span></a></h2><h2 id="算法" tabindex="-1"><a class="header-anchor" href="#算法"><span>算法</span></a></h2><h2 id="网络" tabindex="-1"><a class="header-anchor" href="#网络"><span>网络</span></a></h2><h3 id="osi分层模型-tcp-ip分层模型" tabindex="-1"><a class="header-anchor" href="#osi分层模型-tcp-ip分层模型"><span>OSI分层模型/TCP-IP分层模型</span></a></h3><p>OSI7层模型：应用层、表示层、会话层、传输层、网络层、数据链路层、物理层</p><p>TCP/IP5层模型：应用层、传输层、网络层、网络接口层</p><h3 id="常见的网络协议" tabindex="-1"><a class="header-anchor" href="#常见的网络协议"><span>常见的网络协议</span></a></h3><p>应用层协议：HTTP、DNS、FTP、SSH、Telnet、SMTP、POP3/IMAP</p><p>传输层协议：TCP、UDP</p><p>网络层协议：IP、ARP、NET</p><h3 id="tcp与udp" tabindex="-1"><a class="header-anchor" href="#tcp与udp"><span>TCP与UDP</span></a></h3><h4 id="tcp建立连接3次握手" tabindex="-1"><a class="header-anchor" href="#tcp建立连接3次握手"><span>TCP建立连接3次握手</span></a></h4><ol><li>客户端发送SYN（同步）标志位的数据包，此时客户端进入SYN_SENT状态，等待服务器的确认</li><li>服务端发送ACK（确认）标志位的数据包，并发送自己的SYN，此时服务器进入SYN_RCVD状态</li><li>客户端向服务器发送一个带有ACK标志位的数据包，表示确认收到服务器的确认。</li></ol><p>经过3次握手后，客户端和服务端都进入ESTABLISHED状态，表示建立连接，可以进行数据传递了。</p><h4 id="tcp断开连接4次挥手" tabindex="-1"><a class="header-anchor" href="#tcp断开连接4次挥手"><span>TCP断开连接4次挥手</span></a></h4><ol><li>客户端发送FIN（结束）标志位的数据包，表示客户端不再发送数据（但依然可以接收数据）</li><li>服务器向客户端发送一个带有ACK标志位的数据包，表示确认收到客户端的FIN请求。此时服务器进入CLOSE_WAIT状态，表示服务器已经关闭了数据传输通道，但仍能向客户端发送数据；</li><li>当服务器确认数据都已经发送完毕后，向客户端发送一个带有FIN标志位的数据包，表示服务器也不再发送数据</li><li>客户端发送ACK，服务器确认ACK并关闭连接</li></ol><h3 id="http协议" tabindex="-1"><a class="header-anchor" href="#http协议"><span>HTTP协议</span></a></h3><h4 id="请求-响应流程" tabindex="-1"><a class="header-anchor" href="#请求-响应流程"><span>请求-响应流程</span></a></h4><h4 id="常见的http状态码" tabindex="-1"><a class="header-anchor" href="#常见的http状态码"><span>常见的HTTP状态码</span></a></h4><h2 id="操作系统" tabindex="-1"><a class="header-anchor" href="#操作系统"><span>操作系统</span></a></h2><h2 id="开发运维部署" tabindex="-1"><a class="header-anchor" href="#开发运维部署"><span>开发运维部署</span></a></h2><h3 id="git、svn" tabindex="-1"><a class="header-anchor" href="#git、svn"><span>git、svn</span></a></h3><h3 id="maven、gradle" tabindex="-1"><a class="header-anchor" href="#maven、gradle"><span>maven、gradle</span></a></h3><h3 id="docker" tabindex="-1"><a class="header-anchor" href="#docker"><span>docker</span></a></h3>',25)]))}const d=e(i,[["render",t],["__file","index.html.vue"]]),c=JSON.parse('{"path":"/notes/interview/vbkdq8qu/","title":"计算机基础面试题","lang":"zh-CN","frontmatter":{"title":"计算机基础面试题","createTime":"2024/11/24 15:56:15","permalink":"/notes/interview/vbkdq8qu/"},"headers":[],"readingTime":{"minutes":1.6,"words":479},"git":{"updatedTime":1733057441000,"contributors":[{"name":"ianping","email":"13520322212@163.com","commits":2,"avatar":"https://avatars.githubusercontent.com/ianping?v=4","url":"https://github.com/ianping"}]},"filePathRelative":"notes/interview/计算机基础面试题.md","bulletin":false}');export{d as comp,c as data};
