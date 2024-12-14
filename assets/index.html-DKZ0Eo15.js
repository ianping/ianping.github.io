import{_ as a,c as s,b as n,o as i}from"./app-DsGHT65_.js";const t={};function l(d,e){return i(),s("div",null,e[0]||(e[0]=[n(`<h3 id="慢查询日志" tabindex="-1"><a class="header-anchor" href="#慢查询日志"><span>慢查询日志</span></a></h3><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h3><div class="language- line-numbers-mode" data-ext="" data-title=""><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes github-light material-theme-darker vp-code"><code><span class="line"><span># 慢查询的时长(微妙):默认10000,即10ms; 0表示记录所有命令; 负数表示禁用慢查询日志</span></span>
<span class="line"><span>slowlog-log-slower-than 10000</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 慢查询日志最大数量: 默认128, 超出设置的数量时, 删除最早的1条</span></span>
<span class="line"><span>slowlog-max-len 128</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用" tabindex="-1"><a class="header-anchor" href="#使用"><span>使用</span></a></h3><p><code>slowlog len</code>：查看日志数量</p><p><code>slowlog get [n]</code>：查看日志内容，默认查看所有，可以指定数量</p><p><code>slowlog reset</code>：重置日志</p><h2 id="bigkey" tabindex="-1"><a class="header-anchor" href="#bigkey"><span>BigKey</span></a></h2><p>识别BigKey</p><p><code>redis-cli --bigkeys</code></p>`,10)]))}const p=a(t,[["render",l],["__file","index.html.vue"]]),r=JSON.parse('{"path":"/notes/database/alsp7lbh/","title":"Redis补充","lang":"zh-CN","frontmatter":{"title":"Redis补充","createTime":"2024/11/24 15:56:14","permalink":"/notes/database/alsp7lbh/"},"headers":[],"readingTime":{"minutes":0.44,"words":131},"git":{"updatedTime":1733057441000,"contributors":[{"name":"ianping","email":"13520322212@163.com","commits":2,"avatar":"https://avatars.githubusercontent.com/ianping?v=4","url":"https://github.com/ianping"}]},"filePathRelative":"notes/database/6.redis/Redis补充.md","bulletin":false}');export{p as comp,r as data};
