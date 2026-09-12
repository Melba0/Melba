# Tio & OpenPaw 官方网站

DSL 驱动的图像检索与编辑工作站的官方主页与文档中心，基于 **VitePress** 构建。

- **Tio** — 自然语言 / DSL 驱动的语义图像检索系统（YOLOv8m + ONNX Runtime + Qt 6）
- **OpenPaw** — 自然语言驱动的图片编辑处理一体化工作站（分割 + 蒙版 + 合成）

## 本地开发

```bash
npm install
npm run docs:dev      # http://localhost:5173
npm run docs:build    # 输出到 docs/.vitepress/dist
npm run docs:preview  # 预览构建产物
```

## 部署到 Netlify

1. 将本仓库推送到 GitHub。
2. 登录 Netlify → **Add new site** → **Import an existing project**。
3. 选择仓库，Netlify 会自动读取 `netlify.toml`（构建命令与发布目录已配置）。
4. 点击 **Deploy site**，即可获得 `xxx.netlify.app` 域名。

## 目录结构

```
docs/
├── .vitepress/
│   ├── config.mts          # 站点配置
│   └── theme/              # 自定义主题 + 暗色样式
├── index.md                # 首页
├── tio/                    # Tio 文档
├── openpaw/                # OpenPaw 文档
├── showcase/               # 案例展示
├── about.md                # 关于
└── public/                 # 静态资源（logo / 截图）
```

## 相关仓库

- Tio: <https://github.com/Melba0/tio>
- OpenPaw: <https://github.com/Melba0/Open-Paw>

## 许可证

GPL-3.0
