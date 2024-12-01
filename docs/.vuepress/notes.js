import { defineNoteConfig, defineNotesConfig } from "vuepress-theme-plume";

// Java
const java = defineNoteConfig({
  dir: 'java',
  link: 'java',
  text: 'Java',
  sidebar: 'auto'
});

//  Python
const python = defineNoteConfig({
  dir: 'python',
  link: 'python',
  text: 'Python',
  sidebar: 'auto'
});

// Web
const web = defineNoteConfig({
  dir: 'web',
  link: 'web',
  text: 'Web',
  sidebar: 'auto'
});

// Web建站
const website = defineNoteConfig({
  dir: 'website',
  link: 'website',
  text: '建站',
  sidebar: 'auto'
});


// 数据库
const database = defineNoteConfig({
  dir: 'database',
  link: 'database',
  text: '数据库',
  sidebar: 'auto'
});

// 中间件
const middleware = defineNoteConfig({
  dir: 'middleware',
  link: 'middleware',
  text: '中间件',
  sidebar: 'auto'
});

// 我的世界
const minecraft = defineNoteConfig({
  dir: 'minecraft',
  link: 'minecraft',
  text: 'Minecraft',
  sidebar: 'auto'
});

// 服务器
const server = defineNoteConfig({
  dir: 'server',
  link: 'server',
  text: '服务器',
  sidebar: 'auto'
});

// AI
const ai = defineNoteConfig({
  dir: 'ai',
  link: 'ai',
  text: 'AI',
  sidebar: 'auto'
});

// 计算机基础
const cs = defineNoteConfig({
  dir: 'cs',
  link: 'cs',
  text: '计算机基础',
  sidebar: 'auto'
});


// 数学
const math = defineNoteConfig({
  dir: 'math',
  link: 'math',
  text: '数学',
  sidebar: 'auto'
});

// 第三方服务
const thirdPartyServices = defineNoteConfig({
  dir: 'thirdPartyServices',
  link: 'thirdPartyServices',
  text: '第三方服务',
  sidebar: 'auto'
});

// 开发工具
const devtools = defineNoteConfig({
  dir: 'devtools',
  link: 'devtools',
  text: '开发工具',
  sidebar: 'auto'
});

// 常用软件
const software = defineNoteConfig({
  dir: 'software',
  link: 'software',
  text: '常用软件',
  sidebar: 'auto'
});


// Fun things
const funs = defineNoteConfig({
  dir: 'funs',
  link: 'funs',
  text: 'Fun things',
  sidebar: 'auto'
});

// 面试
const interview = defineNoteConfig({
  dir: 'interview',
  link: 'interview',
  text: '其它',
  sidebar: 'auto'
});

// 其它
const others = defineNoteConfig({
  dir: 'others',
  link: 'others',
  text: '其它',
  sidebar: 'auto'
});


export default defineNotesConfig({
  dir: '/notes/',
  link: '/notes/',
  notes: [
    math,
    ai,
    python,
    java,
    web,
    website,
    database,
    middleware,
    minecraft,
    server,
    cs,
    devtools,
    software,
    thirdPartyServices,
    funs,
    interview,
    others,
  ]
});