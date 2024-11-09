import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { getDirname, path } from 'vuepress/utils';

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
  bundler: viteBundler(),

  base: "/",
  lang: "zh-CN",
  title: "你好， VuePress ！",
  description: "这是我的第一个 VuePress 站点",
  theme: defaultTheme({

  }),
  alias: {
    // '@alias': path.resolve(__dirname, './path/to/some/dir'),
  },
});
