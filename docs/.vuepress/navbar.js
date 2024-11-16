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
      { text: "数学", link: "math/" },
      { text: "人工智能", link: "ai/" },
      { text: "Python", link: "python/3x58m14j/" },
      { text: "Java", link: "java/eozur0be/" },
      { text: "Web", link: "web/d9n2f1bx/" },
    ],
  },
]);
