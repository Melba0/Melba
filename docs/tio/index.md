---
description: Tio 是一个 DSL 驱动的语义图像检索系统，使用 YOLOv8m + ONNX Runtime 对本地图库建立增量缓存，并用一句话或 DSL 精确筛选图片。
---

# Tio — 图像检索 DSL 工具

> **自然语言图片检索：输入一句话 → 翻译成 DSL → 引擎模糊检索并排序返回。**
> *Natural-language image retrieval: describe → DSL → ranked results.*

Tio 是一款**语义图片检索工具**。你不需要输入关键词，而是用一句话描述想要的画面
（例如"一只猫在狗左边"），引擎会基于 DSL 模糊求值对图库图片进行排序。

## 核心能力

- **自然语言 → DSL**：GUI 调用 LLM 把一句话翻译成 DSL 查询，也可手写 DSL。
- **手写递归下降解析器**：无代码生成器，支持 UTF-8 标识符与中文类别名。
- **YOLOv8m 目标检测**：通过 ONNX Runtime（CPU）推理，无需 GPU / LibTorch。
- **新式筛选语法**：`$ : (条件)` 配合 `any(...)` / `all(...)`，表达力强且易读。
- **集合代数**：`%` 提取对象、`^` 上溯图片、`| & -` 集合运算、`>>` 扩展细化。
- **继承计数与置信度降级**：`cnt(fruit)` 同时统计 `apple`/`banana` 等子类。
- **多维属性**：曝光、清晰度、32 维颜色直方图、内置 EXIF、用户标签。
- **增量缓存**：只对新增 / 修改的图片重新推理，其余秒级加载。
- **中英双语 GUI + 深浅主题**：Qt 6 桌面端，结果缩略图网格。

## 架构

```
一句话描述 ──► tio.exe (Qt GUI) ──LLM──► DSL 代码 ──QProcess──► dsl.exe (C++ 引擎)
                                                                    │
                                    ┌───────────────────────────────┤
                                    ▼                               ▼
                    cache/<model>/cache_index.json     models/base/yolov8m/model.onnx
                    (增量缓存 / incremental cache)      + models/registry.json
```

- GUI 通过 `QProcess` 以 `--json` 模式与引擎通信：DSL 从 **stdin** 输入，结果以 **JSON 从 stdout** 返回。
- 引擎启动时加载 / 增量更新缓存，然后求值 DSL。

| 层 | 目录 | 职责 |
|----|------|------|
| GUI | `gui/`（Qt 6） | 自然语言输入、DSL 编辑、结果网格、标签筛选、资产管理 |
| Parser | `dsl/src/parser/` | 词法分析 + 递归下降解析 → AST |
| Executor | `dsl/src/executor/` | AST 求值、宏系统、上下文 |
| Cache | `dsl/src/cache/` | 增量缓存索引 + YOLO 推理 |
| Engine | `dsl/src/engine/` | ONNX Runtime 后端 |

## 界面截图

### 主界面

![Tio 主界面：左侧检索面板，右侧结果缩略图网格](/screenshots/tio/main-window.png)

### 自然语言搜索

用一句话描述画面，LLM 翻译为 DSL 并执行：

![自然语言搜索：输入一句话翻译为 DSL](/screenshots/tio/nl-search.png)

### 结果网格

按模糊匹配分数降序排列，支持多选、删除与标签筛选：

![结果缩略图网格](/screenshots/tio/results-grid.png)

### 图片详情

查看检测对象、曝光 / 清晰度 / EXIF 元数据，编辑用户标记：

![图片详情对话框](/screenshots/tio/detail-dialog.png)

### 标签筛选

用 key→value 条件在查询前预筛选图库：

![标签筛选对话框](/screenshots/tio/tag-filter.png)

### 设置

模型、扩展包、图库、API 与日志等设置：

![设置页面](/screenshots/tio/settings.png)

### 命令行 REPL

无 GUI 的交互式引擎，支持脚本与 JSON 模式：

![命令行 REPL](/screenshots/tio/repl.png)

## 快速链接

- [快速开始](/tio/getting-started) — 编译引擎与 GUI，跑通第一个查询
- [DSL 语法参考](/tio/dsl-reference) — 数据类型、运算符、宏与 20+ 示例
- [功能列表](/tio/features) — 检测、场景、直方图、EXIF、标签、相簿
- [常见问题](/tio/faq) — 缓存、模型切换、扩展包错误排查
- [下载 Tio](/download) — 源码 ZIP 与 Release

## 与 OpenPaw 的关系

Tio 负责**检索**（找到哪些图片），OpenPaw 负责**编辑**（把找到的图片改成你想要的样子）。
OpenPaw 的 DSL 直接复用了 Tio 的选择语法（`$ : (...)`、`any(...)`），两者可以组成
"先检索、再批量处理"的完整工作流。详见 [OpenPaw 介绍](/openpaw/)。
