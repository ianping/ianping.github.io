import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "你好， VuePress ！",
  description: "这是我的第一个 VuePress 站点",

  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }]
  ],

  pagePatterns: ['**/*.md', '!**/README.md', '!.vuepress', '!node_modules'],

  permalinkPattern: "",

  theme: defaultTheme({}),

  plugins: [],

  alias: {
    // '@alias': path.resolve(__dirname, './path/to/some/dir'),
  },

  bundler: viteBundler(),
});
