import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";
// import { defaultTheme } from "@vuepress/theme-default";
import { plumeTheme } from "vuepress-theme-plume";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "亦谙博客",
  description: "亦谙博客",

  head: [["link", { rel: "icon", href: "/favicon.ico" }]],

  pagePatterns: ["**/*.md", "!**/README.md", "!.vuepress", "!node_modules"],

  permalinkPattern: "",

  theme: plumeTheme({
    // 部署站点域名
    hostname: '',

    plugins: {
      markdownPower: {
        // 启用pdf阅读
        // @[pdf](https://plume.pengzhanbo.cn/files/sample.pdf)
        pdf: true,
        // Bilibili视频
        // @[bilibili p1](aid cid)
        bilibili: true,
        // Youtube视频
        // @[youtube](id)
        youtube: true,
      },
    }
  }),

  plugins: [
  ],

  alias: {
    // '@alias': path.resolve(__dirname, './path/to/some/dir'),
    "@theme/VPFooter.vue": path.resolve(__dirname, "./components/MyFooter.vue"),
  },

  bundler: viteBundler(),
});
