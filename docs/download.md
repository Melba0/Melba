# 下载

两个项目均以 **GPL-3.0** 许可证开源。下面的按钮直接下载 **GitHub 最新 Release 的附件**
（`/releases/latest/download/...`，发布新版本后自动指向最新包）。

## Tio — 图像检索

<div class="download-actions">
  <a href="https://github.com/Melba0/TIO-Image-Manager/releases/latest/download/tio.zip">⬇ 下载 tio.zip（最新版）</a>
  <a class="alt" href="https://github.com/Melba0/TIO-Image-Manager/releases/latest">📦 查看 Release 说明</a>
  <a class="alt" href="https://github.com/Melba0/TIO-Image-Manager">⭐ 仓库主页</a>
</div>

| 项目 | 值 |
|------|----|
| 最新版本 | **v1.2.0**（2026-08-31） |
| 附件 | `tio.zip`（约 157 MB，内含编译好的可执行文件） |
| 直链 | `https://github.com/Melba0/TIO-Image-Manager/releases/latest/download/tio.zip` |
| SHA-256 | `3f3ed9566db106e916b4b0e675213d4afced994df48f59bc2ade3b012503223a` |

> 仓库 `Melba0/tio` 已更名为 `Melba0/TIO-Image-Manager`，旧链接会自动跳转。

## OpenPaw — 智能编辑

<div class="download-actions">
  <a href="https://github.com/Melba0/Open-Paw/releases/latest/download/open.paw.zip">⬇ 下载 open.paw.zip（最新版）</a>
  <a class="alt" href="https://github.com/Melba0/Open-Paw/releases/latest">📦 查看 Release 说明</a>
  <a class="alt" href="https://github.com/Melba0/Open-Paw">⭐ 仓库主页</a>
</div>

| 项目 | 值 |
|------|----|
| 最新版本 | **v1.0.1**（2026-09-12） |
| 附件 | `open.paw.zip`（约 235 MB，可执行文件在 `build/` 目录） |
| 直链 | `https://github.com/Melba0/Open-Paw/releases/latest/download/open.paw.zip` |
| SHA-256 | `575457a703af0dfa30572c10f981178c724a5bf4af118d90ae0fb6a0482a2a18` |

内置的天空分割模型 `skyseg_v1` 随仓库一起分发，解压即可用。

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
