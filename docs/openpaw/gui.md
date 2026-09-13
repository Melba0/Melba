---
description: OpenPaw 桌面 GUI 指南：三栏 + 底部布局、画布四种对比模式、蒙版/分割面板、调整面板、胶片条、蒙版编辑器、全尺寸查看器、工作区、模板与快捷键。
---

# 桌面 GUI

`openpaw` 是一个可停靠的三栏 + 底部布局：左侧蒙版/分割，中间大画布，右侧调整与
DSL/思考面板，底部输入/输出胶片条。面板可拖动、浮动、折叠，布局自动保存到 `config/layout.ini`。

![OpenPaw 总览](/screenshots/openpaw/overview.png)

## 画布与对比模式

`CanvasView` 支持四种处理前后对比：

| 模式 | 快捷键 | 说明 |
|------|--------|------|
| Slider | `Ctrl+1` | 滑动分割对比 |
| SideBySide | `Ctrl+2` | 并排 |
| Toggle | `Ctrl+3` | 切换 |
| ResultOnly | `Ctrl+4` | 仅结果 |

缩放：Fit（`Ctrl+0`）、100%（`Ctrl+Shift+0`）、放大 / 缩小（`Ctrl++` / `Ctrl+-`）。
可叠加显示蒙版（`Ctrl+M`）。

![对比](/screenshots/openpaw/compare.png)

## 工具面板

左侧 `Tools` dock 含：

- **MaskToolPanel**：矩形 / 椭圆 / 画笔 / 渐变 / 自动分割等蒙版工具；
- **SegPackPanel**：当前激活的分割模型包列表，点击即可插入对应 DSL 工具。

右侧 `Properties` dock 含：

- **AdjustPanel**：亮度 / 对比度 / 饱和度等滑块，**实时预览**，点 **Apply** 才写入；
- **HistoryPanel**：处理历史，可回退 / 重做；
- **DSL 编辑器** 与 **Thinking（思考）面板** 标签页。

![工具面板](/screenshots/openpaw/tools-panel.png)

![属性面板](/screenshots/openpaw/properties-panel.png)

## 胶片条

底部 `Filmstrip` dock 分输入 / 输出两条，基于 `ThumbnailGrid`：

- 异步加载缩略图、多选、拖入 / 拖出、右键菜单；
- 状态角标：✅ 成功、⏳ 处理中、❌ 失败、⚪ 未处理；
- 工具（全选 / 反选 / 删除 / 导出 / 对比）。

![胶片条](/screenshots/openpaw/filmstrip.png)

## 蒙版编辑器

全屏 `MaskEditor` + 工具栏：`Rect`、`Ellipse`、`Brush`、`Gradient`、`Auto`；
操作 `Saturation +` / `Brightness +` / `Hue Shift` / `Blur` / `Grayscale`；
支持 feather / invert / clear / save mask / apply。详见 [蒙版系统](/openpaw/masks)。

## 全尺寸查看器

`ImageViewer` 打开单张全尺寸图，支持处理前后对比。

## 工作区与模板

- **工作区**：`Workspace` 下拉切换；每个工作区有独立 `input/` 与 `output/`，
  存于 `config/workspaces.json`（默认工作区 `默认`）；
- **模板**：`Process → Save as Template` 保存当前 DSL；`presets/` 内置 10 个
  （`black_white`、`cinematic`、`collage_grid`、`dramatic_contrast`、`long_exposure`、
  `portrait_retouch`、`product_clean`、`sky_blue`、`social_square`、`vintage_film`）；
- **Examples**：工具栏下拉内置 6 个脚本，**无需 API Key** 即可执行。

## 导入与导出

- 导入：文件夹、多文件、拖拽、剪贴板（`File → Import Images/Folder`、`Paste Image`）；
- 导出：`Export Selected`（`Ctrl+E`）、打开输出目录。

## 设置

`Settings → Preferences`：Base URL、API Key、Model、Max retries、Stream；
输出目录、默认格式 / 质量、最大批量；暗色模式、语言（en / zh）。
`Settings → Segmentation Packs...` 打开分割包管理器。

![首选项](/screenshots/openpaw/preferences.png)

![分割包管理](/screenshots/openpaw/pack-manager.png)

## 主题与语言

- `View → Dark Mode` / `Theme` 切换，QSS 位于 `resources/styles/{dark,light}.qss`；
- 双语界面由 `Settings → Language` 切换。

## 快捷键（部分）

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+O` / `Ctrl+Shift+O` | 导入图片 / 文件夹 |
| `Ctrl+V` / `Ctrl+Shift+V` | 粘贴图片 |
| `Ctrl+E` | 导出选中 |
| `Ctrl+Return` | 执行 DSL |
| `Ctrl+G` | Generate & Run |
| `Ctrl+R` | 重新生成 DSL |
| `Ctrl+Z` / `Ctrl+Y` | 撤销 / 重做 |
| `Ctrl+A` / `Ctrl+Shift+I` | 全选 / 反选 |
| `Delete` | 删除选中 |
| `Esc` | 停止 |
| `F11` | 全屏 |

## 延伸阅读

- [快速开始](/openpaw/getting-started) · [CLI 参考](/openpaw/cli)
- [工具清单](/openpaw/tools) · [蒙版系统](/openpaw/masks)
