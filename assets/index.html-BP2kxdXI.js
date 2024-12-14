import{_ as i,c as e,b as a,o as n}from"./app-DsGHT65_.js";const t={};function l(r,s){return n(),e("div",null,s[0]||(s[0]=[a(`<h1 id="springboot核心特性-嵌入式webserver" tabindex="-1"><a class="header-anchor" href="#springboot核心特性-嵌入式webserver"><span>SpringBoot核心特性-嵌入式WebServer</span></a></h1><p>SpringBoot将Servlet容器抽象为WebServer</p><h2 id="源码分析" tabindex="-1"><a class="header-anchor" href="#源码分析"><span>源码分析</span></a></h2><h3 id="webserver" tabindex="-1"><a class="header-anchor" href="#webserver"><span>WebServer</span></a></h3><p><code>WebServer</code>接口</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">public</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> interface</span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;"> WebServer</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">	void</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> start</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">()</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> throws</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> WebServerException</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span></span>
<span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">	void</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> stop</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">()</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> throws</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> WebServerException</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">;</span></span>
<span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">	int</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> getPort</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">();</span></span>
<span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">	default</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> void</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> shutDownGracefully</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">GracefulShutdownCallback </span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">callback</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">		callback</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">shutdownComplete</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">GracefulShutdownResult</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">IMMEDIATE</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">);</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">	}</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由具体的Servlet容器实现：</p><ul><li><code>TomcatWebServer</code></li><li><code>UndertowWebServer</code></li><li><code>JettyWebServer</code></li><li><code>NettyWebServer</code></li></ul><h3 id="webserverfactory" tabindex="-1"><a class="header-anchor" href="#webserverfactory"><span>WebServerFactory</span></a></h3><p><code>WebServerFactory</code>接口及其子接口<code>ServletWebServerFactory</code>和<code>ReactiveWebServerFactory</code></p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">public</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> interface</span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;"> WebServerFactory</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">@</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">FunctionalInterface</span></span>
<span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">public</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> interface</span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;"> ServletWebServerFactory</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> extends</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> WebServerFactory</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">	WebServer </span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">getWebServer</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">ServletContextInitializer</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">...</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> initializers</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">);</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">@</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">FunctionalInterface</span></span>
<span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">public</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> interface</span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;"> ReactiveWebServerFactory</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> extends</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> WebServerFactory</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">	WebServer </span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">getWebServer</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">HttpHandler </span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">httpHandler</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">);</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>ServletWebServerFactory</code>由具体的Servlet容器实现：</p><ul><li><code>TomcatServletWebServerFactory</code></li><li><code>UndertowServletWebServerFactory</code></li><li><code>JettyServletWebServerFactory</code></li></ul><p><code>ReactiveWebServerFactory</code>由具体的Reactive容器实现：</p><ul><li><code>TomcatReactiveWebServerFactory</code></li><li><code>UndertowReactiveWebServerFactory</code></li><li><code>JettyReactiveWebServerFactory</code></li><li><code>NettyReactiveWebServerFactory</code></li></ul><p>在具体的Servlet或Reactive容器工厂中，实现<code>getWebServer</code>方法，创建具体的<code>WebServer</code>实例。</p><h2 id="使用其它servlet容器" tabindex="-1"><a class="header-anchor" href="#使用其它servlet容器"><span>使用其它Servlet容器</span></a></h2><h2 id="使用servlet" tabindex="-1"><a class="header-anchor" href="#使用servlet"><span>使用Servlet</span></a></h2><h2 id="使用filter" tabindex="-1"><a class="header-anchor" href="#使用filter"><span>使用Filter</span></a></h2><h2 id="使用listener" tabindex="-1"><a class="header-anchor" href="#使用listener"><span>使用Listener</span></a></h2>`,20)]))}const p=i(t,[["render",l],["__file","index.html.vue"]]),d=JSON.parse('{"path":"/notes/java/rna89tr9/","title":"SpringBoot核心特性-嵌入式WebServer","lang":"zh-CN","frontmatter":{"sidebar":"auto","title":"SpringBoot核心特性-嵌入式WebServer","createTime":"2024/11/24 15:56:15","permalink":"/notes/java/rna89tr9/"},"headers":[],"readingTime":{"minutes":0.61,"words":183},"git":{"updatedTime":1732441916000,"contributors":[{"name":"ianping","email":"13520322212@163.com","commits":1,"avatar":"https://avatars.githubusercontent.com/ianping?v=4","url":"https://github.com/ianping"}]},"filePathRelative":"notes/java/springboot/SpringBoot核心特性-嵌入式WebServer.md","bulletin":false}');export{p as comp,d as data};
