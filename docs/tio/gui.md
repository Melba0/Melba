---
description: Tio 桌面 GUI 使用指南：搜索栏与 DSL 编辑器、结果网格、相簿与智能相簿、聚类分组、图片详情、标签筛选、批量编辑、导出报告、设置页与快捷键。
---

# 桌面 GUI

`tio.exe`（Qt 6）是 Tio 的图形前端：输入一句话 → LLM 译为 DSL → 引擎检索 → 缩略图网格。
界面支持中英文切换与深浅主题，布局可停靠。

![Tio 主界面](/screenshots/tio/main-window.png)

## 主窗口布局

- **顶部搜索栏**：自然语言输入框、`Translate to DSL (→)`、`Search (▶)`、加载指示器、
  🏷️ 标签筛选、🗑 删除选中、语言下拉。
- **可折叠 DSL 编辑器**：`View → Show DSL Editor`。生成后的 DSL 可直接修改并重新执行。
- **左侧相簿树**：📁 Albums（虚拟相簿）、🔍 Smart Albums（智能相簿）、以及聚类分组（如 👤 人物）。
- **结果网格**：缩略图 + 分数 + 文件名；多选（Ctrl/Shift）、拖拽、右键菜单、双击查看详情。
- **工具栏 / 统计徽章**：⭐ 保存为智能相簿、📄 导出报告、✏️ 批量编辑；图库 / 模型 / 扩展 / 缓存命中率。
- **状态栏**：当前模型、扩展数、图片数、运行结果。

## 搜索与 DSL

1. 在搜索框输入自然语言（如"一只猫在狗左边"），回车或点 `Translate to DSL`；
2. 点击 `Search` 执行；也可在 DSL 编辑器手写查询后执行。
3. GUI 启动后会在后台以 `--warmup` 预热缓存，用户查询到来时立即切换。

![自然语言搜索](/screenshots/tio/nl-search.png)

## 结果网格

结果按模糊分数降序排列，低于 `0.05` 的自动过滤。

![结果网格](/screenshots/tio/results-grid.png)

- Ctrl / Shift 多选；右键可「加入相簿 / 从相簿移除 / Details」；
- 选中后可批量删除（删除磁盘文件并同步缓存）；
- 执行含 `del` 的 DSL 前会弹出确认框。

## 相簿与智能相簿

- **Albums（虚拟相簿）**：`CollectionManager` 维护，拖入图片即可加入；单击执行
  `collection("名称")` 打开；右键新建 / 重命名 / 删除。
- **Smart Albums（智能相簿）**：保存的是**可重新执行的 DSL**（存于 `config/smart_collections.json`），
  图库变化后双击即按最新缓存重新求值。
- **聚类分组**：如 👤 人物，基于 `face_recognition_v1` 的嵌入 + DBSCAN；
  按照片数降序，双击可重命名（映射存 `config/cluster_name_mappings.json`）。

## 图片详情

![图片详情对话框](/screenshots/tio/detail-dialog.png)

展示缩略图与元数据：尺寸、Top-5 场景与 `indoor_score`、曝光三分数、清晰度、
相机 / ISO / 快门 / 光圈 / 焦距 / 日期；并可编辑 `user_tags` 键值（写回 `cache_index.json`）。

## 标签筛选

![标签筛选对话框](/screenshots/tio/tag-filter.png)

多行 `(key, values)` 条件：同一 key 多值为 OR，条件之间为 AND；`key=` 表示值不限。
条件会持久化并自动回填；匹配 0 张返回空结果。

## 批量编辑

`BatchEditDialog` 对多选图片：

| 操作 | 说明 |
|------|------|
| Add / Update Tag | 批量写标签 |
| Remove Tag | 下拉现有键删除 |
| Set Rating | 1~5 ★ 评分 |
| 文件重命名 | 模板占位符 `{index}` `{date}` `{scene}` `{object}`，带冲突检测预览 |

应用重命名会同步磁盘文件名、`cache_index.json` 键，以及相簿中的路径引用。

## 导出报告

`ExportReportDialog` 支持 **HTML**（自包含，缩略图内嵌 base64）或 **PDF**（A4）；
范围可选全部结果或仅选中。每张卡片包含缩略图、路径、尺寸、修改时间、分数、EXIF、
曝光 / 清晰度、Top-3 场景、对象与标签。

## 设置页

`Settings` 左侧导航 7 项：

| 页 | 内容 |
|----|------|
| General | 语言（English / 简体中文）、启动时自动载入上次搜索 |
| API Config | Base URL、API Key（掩码显示）、模型名、Test Connection |
| Library | 图库路径列表、Add / Remove、Reindex |
| Models | 列出 `models/base/*`，双击切换 `active_base`，Add / Remove |
| Inference | Base Confidence（0.25）、IoU NMS（0.45）、Fallback Threshold（0） |
| Extensions | 扩展包启用 / 禁用（父类缺失时 ⚠ 警告） |
| Logs | 彩色日志、按级别/关键词过滤、导出 |

![设置页面](/screenshots/tio/settings.png)

## 主题、语言与日志

- `View → Dark Mode` 切换主题，偏好存 `ui/dark_mode`；
- 语言切换即时重建界面文本，写 `General/language`；
- `Logger` 捕获日志到 `logs/app-YYYYMMDD.log`，`LogPanel` 环形缓冲 1000 条。

## 快捷键（部分）

| 快捷键 | 功能 |
|--------|------|
| `Enter` | 翻译自然语言为 DSL |
| `Ctrl+O` / `Ctrl+Shift+O` | 导入图片 / 文件夹 |
| `Ctrl+E` | 导出选中 |
| `Ctrl+1..4` | 结果视图 / 对比模式 |
| `Delete` | 删除选中 |
| `F11` | 全屏 |

## 延伸阅读

- [快速开始](/tio/getting-started) · [CLI 与 REPL](/tio/cli)
- [功能列表](/tio/features) · [模型系统](/tio/models)
