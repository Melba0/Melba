# 下载

两个项目均以 **GPL-3.0** 许可证开源，源码托管在 GitHub。推荐通过 GitHub Release 获取预编译包与源码压缩包。

## Tio — 图像检索

<div class="download-actions">
  <a href="https://github.com/Melba0/tio/archive/refs/heads/master.zip">⬇ 下载源码 ZIP</a>
  <a class="alt" href="https://github.com/Melba0/tio/releases/latest">📦 GitHub Releases</a>
  <a class="alt" href="https://github.com/Melba0/tio">⭐ 仓库主页</a>
</div>

- 源码压缩包：`tio-master.zip`
- 预编译产物（如已发布）：见 Release 附件中的 `tio-*.zip`
- 引擎与 GUI 需要的运行时（ONNX Runtime、Qt 6）请参考 [Tio 快速开始](/tio/getting-started)

## OpenPaw — 智能编辑

<div class="download-actions">
  <a href="https://github.com/Melba0/Open-Paw/archive/refs/heads/main.zip">⬇ 下载源码 ZIP</a>
  <a class="alt" href="https://github.com/Melba0/Open-Paw/releases/latest">📦 GitHub Releases</a>
  <a class="alt" href="https://github.com/Melba0/Open-Paw">⭐ 仓库主页</a>
</div>

- 源码压缩包：`Open-Paw-main.zip`
- 内置的天空分割模型 `skyseg_v1` 随仓库一起分发，解压即可用
- 编译依赖见 [OpenPaw 快速开始](/openpaw/getting-started)

## 校验与解压

```powershell
# 解压后进入项目目录
Expand-Archive -LiteralPath .\tio-master.zip -DestinationPath .\tio
Expand-Archive -LiteralPath .\Open-Paw-main.zip -DestinationPath .\Open-Paw
```

> 下载链接指向 GitHub 官方归档地址，随仓库最新提交自动更新。
