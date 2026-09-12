---
description: OpenPaw 是自然语言驱动的图片编辑处理一体化工作站，LLM 将需求翻译成 OpenPaw DSL，调用分割、蒙版、合成等 35+ 工具批量处理图片。
---

# OpenPaw — 自然语言图片编辑工作站

> **自然语言驱动的图片编辑处理一体化工作站。**
> *A natural-language-driven image editing and processing workstation.*

用日常语言描述你的编辑需求即可。可配置的 LLM（兼容 OpenAI 协议）会把需求翻译成精确的
**OpenPaw DSL** 处理脚本，脚本随即在你的图片上执行并保存结果。LLM 的思考过程会实时显示；
执行报错时，结构化错误会被自动回传模型进行修正（最多 3 次）。

```
用户："把所有有人像的照片裁剪成正方形并调亮"
        │
        ▼
LLM ──► src = $ : (any(class == "person"))
        result = src
            |> crop(0.1, 0.1, 0.8, 0.8)
            |> adjust(brightness=1.3)
            |> resize(1080, 1080)
            |> save("output/square_portraits/")
        │
        ▼
执行器 ──► crop → adjust → resize → save   （批量处理 N 张图片）
```

## 核心能力

- **自然语言 → DSL → 像素结果**，无需手动调参。
- **实时思考面板**：展示理解、生成、执行、错误与重试全过程。
- **可编辑 DSL**：生成后可直接修改并再次执行。
- **自动纠错**：结构化 JSON 错误回传 LLM 重新生成，最多 `max_retries`（默认 3）次。
- **批量处理**整个输入文件夹。
- **图片库与工作区**：文件夹 / 多文件 / 拖拽 / 剪贴板导入；异步缩略图网格。
- **原图 / 结果对比预览**，外加结果缩略图网格。
- **处理模板**：一键保存当前 DSL，下次复用。
- **35+ 图片处理工具**，覆盖几何、颜色、滤镜、合成、格式与 AI 增强。
- **中英双语**界面 / 文档。

## 修改前后对比

下列结果均由 CLI 无界面执行生成（`openpaw_cli --file <script.dsl>`），示例脚本位于 `examples/`。

| 原图 | 处理后（复古胶片） |
|:----:|:------:|
| ![原图](/before.jpg) | ![复古](/after_vintage.jpg) |
| *原图* | `$ \|> film_grain(0.25) \|> old_photo()` |

| 原图 | 处理后（电影级调色） |
|:----:|:------:|
| ![原图](/before.jpg) | ![调色](/after_grade.jpg) |
| *原图* | `$ \|> adjust(saturation=1.6, contrast=1.12) \|> split_toning(...) \|> vignette(0.4)` |

| 原图 | 处理后（卡通渲染） |
|:----:|:------:|
| ![原图](/before.jpg) | ![卡通](/after_cartoon.jpg) |
| *原图* | `$ \|> cartoon(0.7)` |

横向拼接 —— `stitch_h([a, b], gap=10, bg_color="#ffffff")`：

| 图 A | 图 B | 结果 |
|:----:|:----:|:----:|
| ![a](/before.jpg) | ![b](/before_b.jpg) | ![拼接](/after_stitch.jpg) |

## 界面

![OpenPaw 三栏布局：左侧蒙版与分割模型，中间对比画布，右侧调整与 DSL 编辑器，底部胶片条](/openpaw-screenshot.svg)

界面为专业的三栏 + 底部布局，面板可停靠（Photoshop 风格）+ 大画布（剪映风格）：

- **中间**：主画布，支持 4 种对比模式（**滑动 / 并排 / 切换 / 仅结果**）、缩放平移；右侧为带实时预览的**调整**面板。
- **左栏**：蒙版工具 + 分割模型列表。
- **右栏**：调整、历史记录，以及「DSL 编辑器 / 思考过程」标签页。
- **底部**：输入 / 输出胶片条（大缩略图，带 ✅/⏳/❌/⚪ 状态角标与全选 / 反选 / 删除 / 导出 / 对比）。
- 面板可**拖动、浮动、折叠**，布局自动保存到 `config/layout.ini`。

## 与 Tio 的关系

OpenPaw 复用了 [Tio](/tio/) 的选择语法与缓存体系：

- `$` 表示全部输入图片；`$ : (condition)` 为可选检索过滤（`any(class == "person")`、`img_scene("sky") > 0.5`）。
- 有 Tio 视觉引擎时按检测结果筛选；无引擎时回退为全部图片。

一句话概括：**Tio 找到图片，OpenPaw 改好图片。**

## 快速链接

- [快速开始](/openpaw/getting-started) — 编译、配置 LLM、第一个编辑任务
- [DSL 语法参考](/openpaw/dsl-reference) — 管道、分割、蒙版、合成、保存
- [工具清单](/openpaw/tools) — 35+ 工具的完整签名与示例
- [分割模型包](/openpaw/segmentation) — 包机制与自定义分割包
- [常见问题](/openpaw/faq) — LLM 配置、重试、模型缺失排查
- [下载 OpenPaw](/download) — 源码 ZIP 与 Release
