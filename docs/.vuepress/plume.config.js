import { defineThemeConfig } from "vuepress-theme-plume";
import navbar from "./navbar";
import notes from "./notes";

export default defineThemeConfig({
  logo: "/favicon.ico",

  navbar,
  notes,

  // 博客配置
  blog: {
    include: ["blog/**/*.md"],
    exclude: [".vuepress/", "**/README.md"],

    // 博客文章列表页
    postList: true,
    link: "/blog/",
    pagination: 8, // 分页

    // 分类页
    categories: true,
    categoriesLink: "/blog/categories/",
    categoriesExpand: "deep",

    // 标签页
    tags: true,
    tagsLink: "/blog/tags/",
    tagsTheme: "colored", // 'colored' | 'gray' | 'brand'

    // 归档页
    archives: true,
    archivesLink: "/blog/archives/",

    // 文章封面
    postCover: {
      layout: "top", // 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'
      ratio: "16:9",
      width: 300,
      compact: true,
    },
  },

  // 加密
  encrypt: {
    global: false,
    admin: ['666'],
    rules: {}
  },
  encryptGlobalText: '本站点已加密',
  encryptButtonText: 'Go',

  // 公告板
//   bulletin: {
//     layout: 'top-right',
//     border: true,
//     lifetime: 'session',
//     id: '1',
//     title: 'title',
//     enablePage: (page) => true,
//     contentType: 'text',
//     content: '公告内容',
//     contentFile: ''
//   },

  // 文章链接前缀
  article: '/article/',

  // 自动生成Frontmatter
  autoFrontmatter: {
    permalink: true, // 是否生成永久链接
    createTime: true, // 是否生成创建时间
    title: true, // 是否生成标题
  },

  // 个人信息
  profile: {
    name: "ian",
    description: "",
    avatar: "/favicon.ico",
    location: "中国,深圳",
    organization: "",
    circle: true,
    layout: "right",
  },

  // 社交链接
  social: [{ icon: "github", link: "https://github.com/ianping" }],
});
