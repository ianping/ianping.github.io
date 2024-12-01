import { defineNavbarConfig } from "vuepress-theme-plume";

export default defineNavbarConfig([
  { text: "首页", link: "/" },
  { text: "博客", link: "/blog/" },
  // { text: '标签', link: '/blog/tags/' },
  // { text: '归档', link: '/blog/archives/' },
  {
    text: "笔记",
    prefix: "/notes/",
    items: [
      { text: "Java", link: "/notes/java/33t6upvz/" },
      { text: "Python", link: "/notes/python/3xdslzb9/" },
      { text: "Web前端", link: "/notes/web/rypds3ps/" },
      { text: "数据库技术", link: "/notes/database/eu1e2o1d/" },
      { text: "中间件技术", link: "/notes/middleware/s5cgh29g/" },
      { text: "AI", link: "/notes/ai/1wzp28iv/" },
      { text: "计算机基础", link: "/notes/cs/3djwb0qj/" },
      { text: "数学", link: "#" },
      { text: "Minecraft", link: "/notes/minecraft/vptuj4gv/" },
      { text: "第三方服务", link: "#" },
      { text: "建站", link: "/notes/web/rdbfieru/" },
      { text: "Fun things", link: "/notes/funs/dns3najj/" },
      { text: "开发工具", link: "/notes/devtools/2sr7xao3/" },
      { text: "常用软件", link: "/notes/software/m56cz3l8/" },
    ],
  },
]);
