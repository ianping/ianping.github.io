import{_ as i,c as a,b as n,o as l}from"./app-DsGHT65_.js";const t={};function h(k,s){return l(),a("div",null,s[0]||(s[0]=[n(`<p>vue3文档：https://cn.vuejs.org/guide/introduction.html</p><h2 id="同时使用-v-if-和-v-for" tabindex="-1"><a class="header-anchor" href="#同时使用-v-if-和-v-for"><span>同时使用 v-if 和 v-for</span></a></h2><p>当 <code>v-if</code> 和 <code>v-for</code> 在同一个HTML元素上时，前者拥有更高的优先级，导致 <code>v-if</code> 中无法访问 <code>v-for</code> 作用域中的变量。</p><p>推荐的用法</p><div class="language-vue line-numbers-mode" data-ext="vue" data-title="vue"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes github-light material-theme-darker vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C792EA;"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-light-font-style:inherit;--shiki-dark:#89DDFF;--shiki-dark-font-style:italic;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;"> {</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">ref</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">}</span><span style="--shiki-light:#D73A49;--shiki-light-font-style:inherit;--shiki-dark:#89DDFF;--shiki-dark-font-style:italic;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#C3E88D;">vue</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C792EA;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#EEFFFF;"> todos</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#82AAFF;"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">([</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">  {</span><span style="--shiki-light:#24292E;--shiki-dark:#F07178;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#C3E88D;">A</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span><span style="--shiki-light:#24292E;--shiki-dark:#F07178;"> isComplete</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9CAC;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">},</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">  {</span><span style="--shiki-light:#24292E;--shiki-dark:#F07178;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#C3E88D;">B</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span><span style="--shiki-light:#24292E;--shiki-dark:#F07178;"> isComplete</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9CAC;"> false</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">},</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">  {</span><span style="--shiki-light:#24292E;--shiki-dark:#F07178;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#C3E88D;">C</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span><span style="--shiki-light:#24292E;--shiki-dark:#F07178;"> isComplete</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9CAC;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">},</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">])</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">template</span><span style="--shiki-light:#D73A49;--shiki-light-font-style:inherit;--shiki-dark:#89DDFF;--shiki-dark-font-style:italic;"> v-for</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">todo </span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;">of</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;"> todos</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C792EA;">key</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">todo</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">name</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">      &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">li</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C792EA;"> v-if</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#C3E88D;">todo.isComplete</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">{{ todo.name }}</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">    &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用ref获取dom元素" tabindex="-1"><a class="header-anchor" href="#使用ref获取dom元素"><span>使用ref获取dom元素</span></a></h2><p>在dom元素中使用ref属性声明变量名，在setup方法中定义一个同名的ref变量，使用这个ref的value即可。</p><div class="language-vue line-numbers-mode" data-ext="vue" data-title="vue"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes github-light material-theme-darker vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">el-form</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C792EA;"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#C3E88D;">loginFormRef</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">el-form</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C792EA;"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-light-font-style:inherit;--shiki-dark:#89DDFF;--shiki-dark-font-style:italic;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;"> {</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;"> reactive</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;"> }</span><span style="--shiki-light:#D73A49;--shiki-light-font-style:inherit;--shiki-dark:#89DDFF;--shiki-dark-font-style:italic;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#C3E88D;">vue</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">    </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C792EA;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#EEFFFF;"> loginFormRef</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#82AAFF;"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">console</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#82AAFF;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">(loginFormRef</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#EEFFFF;">value)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F07178;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8)]))}const p=i(t,[["render",h],["__file","index.html.vue"]]),F=JSON.parse('{"path":"/notes/web/y00r5326/","title":"vue3","lang":"zh-CN","frontmatter":{"title":"vue3","createTime":"2024/11/24 15:56:16","permalink":"/notes/web/y00r5326/"},"headers":[],"readingTime":{"minutes":0.61,"words":182},"git":{},"filePathRelative":"notes/web/8.vue/6.vue3.md","bulletin":false}');export{p as comp,F as data};
