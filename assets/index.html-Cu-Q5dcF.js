import{_ as p,c as o,b as a,o as t}from"./app-DsGHT65_.js";const c={};function d(l,e){return t(),o("div",null,e[0]||(e[0]=[a('<h2 id="yum" tabindex="-1"><a class="header-anchor" href="#yum"><span>yum</span></a></h2><blockquote><p>基于RPM的Linux发行版（如 CentOS、Fedora、RHEL 等）的包管理工具</p></blockquote><p>安装软件包</p><p><code>yum install &lt;package_name&gt;</code>：安装指定的软件包。</p><p><code>yum localinstall &lt;rpm_file&gt;</code>：从本地 RPM 文件安装软件包。</p><p>更新软件包</p><p><code>yum update &lt;package_name&gt;</code>：更新指定的软件包到最新版本。</p><p><code>yum update</code>：更新系统中所有已安装的软件包到最新版本（但不会安装新的软件包或删除已安装的软件包）。</p><p><code>yum upgrade</code>：更新系统中所有已安装的软件包到最新版本，并可能安装新的软件包或删除不再需要的软件包。</p><p>删除软件包</p><p><code>yum remove &lt;package_name&gt;</code>：删除指定的软件包。</p><p>查询软件包</p><p><code>yum list</code>：列出所有可用的软件包。</p><p><code>yum list installed</code>：列出所有已安装的软件包。</p><p><code>yum list updates</code>：列出所有可以更新的软件包。</p><p><code>yum info &lt;package_name&gt;</code>：显示指定软件包的信息。</p><p>搜索软件包</p><p><code>yum search &lt;keyword&gt;</code>：搜索包含指定关键字的软件包。</p><p>清理缓存</p><p><code>yum clean all</code>：清理所有缓存的文件。</p><p><code>yum clean packages</code>：仅清理缓存的软件包文件。</p><p><code>yum clean headers</code>：仅清理缓存的头文件。</p><p>解决依赖关系</p><p><code>yum deplist &lt;package_name&gt;</code>：列出指定软件包的依赖关系。</p><p>历史记录</p><p><code>yum histor</code>y：显示 yum 的操作历史记录。</p><p><code>yum history info &lt;transaction_id&gt;</code>：显示指定事务的详细信息。</p><p><code>yum history undo &lt;transaction_id&gt;</code>：撤销指定的事务（如果可能）。</p><p>组管理</p><p><code>yum groupinstall &lt;group_name&gt;</code>：安装指定的软件包组。</p><p><code>yum groupremove &lt;group_name&gt;</code>：删除指定的软件包组。</p><p><code>yum grouplist</code>：列出所有可用的软件包组。</p><p><code>yum groupinfo &lt;group_name&gt;</code>：显示指定软件包组的信息。</p><p>配置管理</p><p><code>yum-config-manager --add-repo=&lt;repo_file&gt;</code>：添加新的仓库。</p><p><code>yum-config-manager --disable &lt;repo_id&gt;</code>：禁用指定的仓库。</p><p><code>yum-config-manager --enable &lt;repo_id&gt;</code>：启用指定的仓库。</p><p>其他</p><p><code>yum makecache</code>：构建仓库的缓存，以加快后续的软件包查询和安装速度。</p><p><code>yum reinstall &lt;package_name&gt;</code>：重新安装指定的软件包。</p><p><code>yum downgrade &lt;package_name&gt;</code>：将指定的软件包降级到旧版本（需要指定旧版本的包或版本号）。</p><h2 id="apt" tabindex="-1"><a class="header-anchor" href="#apt"><span>apt</span></a></h2><blockquote><p>Debian及其衍生版（如Ubuntu）的包管理工具</p></blockquote><p>更新软件包列表</p><p><code>apt update</code>：从配置的软件源中下载最新的软件包列表信息，但不会安装或升级任何软件包。这是在进行安装、升级之前建议执行的命令，以确保获取到最新的软件包信息。</p><p>安装软件包</p><p><code>apt install &lt;package_name&gt;</code>：安装指定的软件包及其依赖项。如果软件包已经安装，则会尝试升级到最新版本。</p><p>升级软件包</p><p><code>apt upgrade</code>：升级系统中所有已安装的软件包到最新版本。它会检查所有已安装的软件包，并将其升级到最新版本，同时处理依赖关系。</p><p>删除软件包</p><p><code>apt remove &lt;package_name&gt;</code>：卸载指定的软件包，但保留其配置文件和数据。</p><p><code>apt purge &lt;package_name&gt;</code>：完全卸载指定的软件包，包括其配置文件和数据。</p><p>搜索软件包</p><p><code>apt search &lt;keyword&gt;</code>：在软件仓库中搜索包含指定关键字的软件包。</p><p>显示软件包信息</p><p><code>apt show &lt;package_name&gt;</code>：显示指定软件包的详细信息，包括版本号、大小、依赖关系、描述等。</p><p>列出已安装的软件包</p><p><code>apt list --installed</code>：列出所有已安装的软件包及其版本号。</p><p>清理不再需要的软件包</p><p><code>apt autoremove</code>：自动删除那些作为其他软件包依赖项而被安装但现在不再需要的软件包。</p><p>清理下载的软件包文件</p><p><code>apt clean</code>：清除已下载的软件包文件，释放磁盘空间。这些文件通常保存在本地的缓存目录中。</p><p>编辑软件源列表</p><p>虽然apt本身没有直接编辑软件源列表的命令，但可以使用<code>apt edit-sources</code>或手动编辑/etc/apt/sources.list文件来添加、删除或修改软件源。</p><p>其他高级功能</p><p><code>apt full-upgrade</code>：与apt upgrade类似，但会进行更彻底的升级，可能会删除一些软件包以解决依赖关系问题。</p><p><code>apt install --reinstall &lt;package_name&gt;</code>：重新安装已安装的软件包，有时用于修复损坏的安装。</p><p><code>apt install --only-source &lt;package_name&gt;</code>：仅从源代码安装软件包（需要相应的源代码仓库支持）。</p><p><code>apt install --download-only &lt;package_name&gt;</code>：仅下载软件包而不进行安装。</p>',69)]))}const m=p(c,[["render",d],["__file","index.html.vue"]]),u=JSON.parse('{"path":"/notes/cs/kwbth3vv/","title":"Linux软件管理","lang":"zh-CN","frontmatter":{"title":"Linux软件管理","createTime":"2024/12/01 22:51:34","permalink":"/notes/cs/kwbth3vv/"},"headers":[],"readingTime":{"minutes":3.73,"words":1119},"git":{},"filePathRelative":"notes/cs/计算机操作系统/linux/Linux软件管理.md","bulletin":false}');export{m as comp,u as data};
