# 下载

两个项目均以 **GPL-3.0** 许可证开源。下载地址使用本站的 `/releases/latest/` 路径，
由本站 `netlify.toml` 中的重定向规则代理到 GitHub 最新 Release 附件（见下方“镜像规则”）；
地址相对于本站域名，部署到任意 Netlify 域名或自定义域名都可用，并始终跟随最新版本。

## Tio — 图像检索

<div class="download-actions">
  <a href="/releases/latest/tio.zip">⬇ 下载 tio.zip（最新版）</a>
  <a class="alt" href="https://github.com/Melba0/TIO-Image-Manager/releases/latest">📦 Release 说明</a>
  <a class="alt" href="https://github.com/Melba0/TIO-Image-Manager">⭐ 仓库主页</a>
</div>

| 项目 | 值 |
|------|----|
| 最新版本 | **v1.2.0**（2026-08-31） |
| 下载路径 | `/releases/latest/tio.zip`（本站域名下） |
| 源附件 | GitHub `tio.zip`（约 157 MB，内含编译好的可执行文件） |
| SHA-256 | `3f3ed9566db106e916b4b0e675213d4afced994df48f59bc2ade3b012503223a` |

> 仓库 `Melba0/tio` 已更名为 `Melba0/TIO-Image-Manager`，旧链接会自动跳转。

## OpenPaw — 智能编辑

<div class="download-actions">
  <a href="/releases/latest/open.paw.zip">⬇ 下载 open.paw.zip（最新版）</a>
  <a class="alt" href="https://github.com/Melba0/Open-Paw/releases/latest">📦 Release 说明</a>
  <a class="alt" href="https://github.com/Melba0/Open-Paw">⭐ 仓库主页</a>
</div>

| 项目 | 值 |
|------|----|
| 最新版本 | **v1.0.1**（2026-09-12） |
| 下载路径 | `/releases/latest/open.paw.zip`（本站域名下） |
| 源附件 | GitHub `open.paw.zip`（约 235 MB，可执行文件在 `build/` 目录） |
| SHA-256 | `575457a703af0dfa30572c10f981178c724a5bf4af118d90ae0fb6a0482a2a18` |

内置的天空分割模型 `skyseg_v1` 随仓库一起分发，解压即可用。

## 镜像规则 {#镜像规则}

下载路径由 `netlify.toml` 中的重定向规则实现（`<本站域名>/releases/latest/<file>`）：

| 访问路径 | 代理目标（始终为最新版） |
|----------|--------------------------|
| `/releases/latest/tio.zip` | `github.com/Melba0/TIO-Image-Manager/releases/latest/download/tio.zip` |
| `/releases/latest/open.paw.zip` | `github.com/Melba0/Open-Paw/releases/latest/download/open.paw.zip` |

- 默认 `status = 200`：反向代理，浏览器地址保持本站域名，内容由 Netlify 转发并缓存。
- 若大文件反代不稳定，把 `netlify.toml` 中对应规则的 `status` 改为 `302` 即可跳转到 GitHub。
- 本地开发（`localhost`）下该路径不会生效，请直接点击上面的 “Release 说明” 或 clone 仓库。

## 校验与解压

```powershell
# 校验 SHA-256（可选）
Get-FileHash .\tio.zip -Algorithm SHA256
Get-FileHash .\open.paw.zip -Algorithm SHA256

# 解压
Expand-Archive -LiteralPath .\tio.zip -DestinationPath .\tio
Expand-Archive -LiteralPath .\open.paw.zip -DestinationPath .\Open-Paw
```

## 只想获取源码？

在 Release 页面的 “Source code” 区域下载 `zip` / `tar.gz`，或直接克隆仓库：

```powershell
git clone https://github.com/Melba0/TIO-Image-Manager.git
git clone https://github.com/Melba0/Open-Paw.git
```

编译步骤见 [Tio 快速开始](/tio/getting-started) 与 [OpenPaw 快速开始](/openpaw/getting-started)。
