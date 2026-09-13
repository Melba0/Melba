import { defineConfig } from 'vitepress'

const TIO_REPO = 'https://github.com/Melba0/tio'
const OPENPAW_REPO = 'https://github.com/Melba0/Open-Paw'

export default defineConfig({
  title: 'Tio & OpenPaw',
  description: 'DSL 驱动的图像检索与编辑工作站 —— Tio 精确检索，OpenPaw 智能编辑',
  lang: 'zh-CN',
  base: '/',
  appearance: 'dark',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#007acc' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Tio & OpenPaw' }],
    ['meta', { property: 'og:description', content: 'DSL 驱动的图像检索与编辑工作站' }],
    ['meta', { property: 'og:image', content: '/logo.svg' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Tio & OpenPaw',

    nav: [
      { text: '首页', link: '/' },
      { text: 'Tio', link: '/tio/', activeMatch: '/tio/' },
      { text: 'OpenPaw', link: '/openpaw/', activeMatch: '/openpaw/' },
      { text: '案例', link: '/showcase/', activeMatch: '/showcase/' },
      { text: '下载', link: '/download' },
      { text: '关于', link: '/about' }
    ],

    sidebar: {
      '/tio/': [
        {
          text: '入门',
          items: [
            { text: '项目介绍', link: '/tio/' },
            { text: '快速开始', link: '/tio/getting-started' },
            { text: '功能列表', link: '/tio/features' }
          ]
        },
        {
          text: 'DSL 语言',
          items: [
            { text: '语法参考', link: '/tio/dsl-reference' },
            { text: '内置宏参考', link: '/tio/macros' }
          ]
        },
        {
          text: '深入',
          items: [
            { text: '系统架构', link: '/tio/architecture' },
            { text: '模型系统', link: '/tio/models' },
            { text: '桌面 GUI', link: '/tio/gui' },
            { text: 'CLI 与 REPL', link: '/tio/cli' },
            { text: '模型导出', link: '/tio/model-export' },
            { text: '常见问题', link: '/tio/faq' }
          ]
        }
      ],
      '/openpaw/': [
        {
          text: '入门',
          items: [
            { text: '项目介绍', link: '/openpaw/' },
            { text: '快速开始', link: '/openpaw/getting-started' },
            { text: '桌面 GUI', link: '/openpaw/gui' }
          ]
        },
        {
          text: 'DSL 与工具',
          items: [
            { text: 'DSL 语法参考', link: '/openpaw/dsl-reference' },
            { text: '工具清单', link: '/openpaw/tools' },
            { text: '蒙版系统', link: '/openpaw/masks' },
            { text: '分割模型包', link: '/openpaw/segmentation' }
          ]
        },
        {
          text: '深入',
          items: [
            { text: 'LLM 与自动纠错', link: '/openpaw/llm' },
            { text: '系统架构', link: '/openpaw/architecture' },
            { text: 'CLI 参考', link: '/openpaw/cli' },
            { text: '常见问题', link: '/openpaw/faq' }
          ]
        }
      ],
      '/showcase/': [
        {
          text: '案例展示',
          items: [
            { text: '全部案例', link: '/showcase/' },
            { text: '效果图库', link: '/showcase/gallery' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: TIO_REPO }
    ],

    footer: {
      message: '基于 GPL-3.0 许可证开源',
      copyright: 'Copyright © 2026 Tio & OpenPaw'
    },

    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    outlineTitle: '本页目录',
    lastUpdatedText: '最后更新',
    externalLinkIcon: true,

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  },

  markdown: {
    lineNumbers: true,
    languageAlias: { dsl: 'javascript' },
    theme: { light: 'github-light', dark: 'github-dark' }
  },

  sitemap: {
    hostname: 'https://tio-openpaw.netlify.app'
  }
})
