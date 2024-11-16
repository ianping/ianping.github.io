import { defineNoteConfig, defineNotesConfig } from "vuepress-theme-plume";


// 数学
const math = defineNoteConfig({
  dir: 'math',
  link: 'math',
  text: '数学',
  sidebar: 'auto'
});

// 人工智能
const ai = defineNoteConfig({
  dir: 'ai',
  link: 'ai',
  text: '人工智能',
  sidebar: 'auto'
});

//  Python
const python = defineNoteConfig({
  dir: 'python',
  link: 'python',
  text: 'Python',
  sidebar: 'auto'
});

// Java
const java = defineNoteConfig({
  dir: 'java',
  link: 'java',
  text: 'Java',
  sidebar: 'auto'
});

// Web
const web = defineNoteConfig({
  dir: 'web',
  link: 'web',
  text: 'Web',
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

// 服务器
const server = defineNoteConfig({
  dir: 'server',
  link: 'server',
  text: '服务器',
  sidebar: 'auto'
});

// 计算机科学
const cs = defineNoteConfig({
  dir: 'cs',
  link: 'cs',
  text: '计算机科学',
  sidebar: 'auto'
});

// 其它
const other = defineNoteConfig({
  dir: 'other',
  link: 'other',
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
    database,
    middleware,
    server,
    cs,
    other,
  ]
});