---
description: Tio 系统架构：引擎与 Qt GUI 的进程模型、解析/求值/缓存/推理组件、数据流与关键数据结构、模糊求值语义与增量缓存算法。
---

# 系统架构

Tio 由两个可独立运行的部分组成：C++17 **引擎**（`dsl/`，产物 `dsl.exe`）与
Qt 6 **桌面端**（`gui/`，产物 `tio.exe`）。两者通过进程 + JSON 通信，互不耦合。

## 总体数据流

```
用户输入 ──► tio.exe (Qt GUI) ──LLM──► DSL 代码 ──QProcess──► dsl.exe
                                                                    │
                                          ┌─────────────────────────┤
                                          ▼                         ▼
                              cache/<model>/cache_index.json   models/base/*/model.onnx
                                                              + models/registry.json
```

1. GUI 把自然语言交给 LLM（OpenAI 兼容接口），得到 DSL；
2. GUI 通过 `QProcess` 启动引擎，参数为 `--json --photo <dir>... [--tag-filter ...]`；
3. DSL 从 **stdin** 写入，结果以 **JSON 从 stdout** 返回；引擎日志走 **stderr**，转发到 GUI 日志面板。

## 目录结构

```
tio/
├── photo/                      # 图库（示例 128 张 .jpg）
├── dsl/                        # C++17 引擎
│   ├── src/
│   │   ├── main.cpp            # 入口 + CLI + --json + REPL + /reload
│   │   ├── BuiltinMacros.cpp   # 内置宏注册
│   │   ├── ExtensionManager.cpp
│   │   ├── ModelRegistry.cpp
│   │   ├── parser/             # Lexer / Parser / AST（手写递归下降）
│   │   ├── executor/           # Context / Evaluator
│   │   ├── cache/              # CacheIndex / CacheManager / YoloInference
│   │   ├── scene/              # SceneInference（Places365）
│   │   ├── cluster/            # Clustering（DBSCAN）
│   │   ├── engine/             # OnnxInference（ONNX Runtime CPU）
│   │   └── utils/              # filesystem_utils / exif_reader
│   ├── models/
│   │   ├── registry.json
│   │   ├── base/yolov8m-oiv7/  # model.onnx + meta.json + classes.json
│   │   ├── extensions/face_recognition_v1/
│   │   └── scene/              # places365_googlenet.onnx + categories + meta
│   ├── cache/<model>/cache_index.json
│   └── config/settings.ini
└── gui/                        # Qt 6 桌面端
    ├── MainWindow / SettingsPage / 四个对话框
    └── managers/               # Settings / Model / Extension / Library /
                                # Collection / SmartCollection / ClusterNameMapping
```

## 组件职责

| 组件 | 职责 |
|------|------|
| `parser/`（Lexer / Parser / AST） | 手写递归下降解析器，支持 UTF-8 标识符，无 parser generator |
| `executor/`（Evaluator / Context） | AST 模糊求值、变量与宏作用域、集合运算、`del` |
| `cache/`（CacheManager / CacheIndex） | 增量缓存、mtime/size diff、置信度降级、触发场景与聚类 |
| `cache/YoloInference` | YOLOv8m 目标检测（letterbox → un-letterbox） |
| `engine/OnnxInference` | ONNX Runtime CPU 后端，统一驱动基座/扩展/场景模型 |
| `ModelRegistry` | 扫描 `models/base/*`，`registry.json`，`classes.json` 的 is-a 继承 |
| `ExtensionManager` | 扫描扩展包，`>>` 细化推理，嵌入提取与聚类包 |
| `SceneInference` | Places365-GoogLeNet 场景分类（365 类） |
| `Clustering` | DBSCAN（余弦相似度），产生 `cluster_ids` |
| `LlmClient` / `LanguageManager` | GUI 侧 LLM 调用与中英文界面 |
| `managers/*` | 设置、模型、扩展、图库、相簿、智能相簿、聚类命名映射 |

## 关键数据结构

- **`DetectedObject`**：`image_path`、`class_name`、`x/y/w/h/area`、`confidence`、`score`（瞬态模糊分）、
  `attr`、`original_class`、`super_class`、`is_fallback`、`parent_id`、`obj_id`、`img_id`、`embeddings`、`cluster_ids`。
- **`Attr`**（对象区域）：`h/s/v`、`h_std/s_std/v_std`、`color_temperature`、`dominant_color_name`、
  `hue_hist[32]`、`lbp`、`local_blur_score`。
- **`ImageAttrs`**（整图）：颜色、曝光（`luma_hist[64]` / `over/under/exposure_goodness`）、
  清晰度、EXIF、`user_tags`、场景（`scene_vector[365]` / `dominant_scene` / `indoor_score`）、`cluster_groups`。
- **`Value`**：`IMAGE_SET / OBJECT_SET / OBJECT / ATTR / HIST_VEC / NUM / SCORE / BOOL / STRING / NONE`。

## 模糊求值语义

Tio 的条件不是布尔，而是 **0~1 的相关度分数**：

| 运算 | 语义 |
|------|------|
| `any(cond)` | 当前图片所有对象中的 **max** |
| `all(cond)` | **min**（空图为真） |
| `&&` / `\|\|` | `min` / `max` |
| `!` | `1 - score` |
| 集合 `&` / `\|` | ImageSet 交集取 `min`、并集取 `max` |
| `cnt(cls) > n` | `sigmoid(cnt - (n + 0.5))` 的连续映射 |

`--hard` 会把阈值设为 `0.5`，退化为布尔过滤；否则按分数排序返回。

> `any(cls)` 仅匹配 `class_name == cls` 或直接 `super_class == cls`；而 `cnt(cls)` 使用
> `classes.json` 的**传递** is-a 链，能统计子类。

## 增量缓存

`CacheManager::applyIncrementalUpdate` 对每个文件取 `mtime`/`size` 与索引 diff：

- 新增 / 修改 → 加入 `to_infer`（修改保留原 `img_id`）；
- 缺失 → 加入 `to_remove`；
- 无变化 → 直接 `rebuildPhotoCache()`，秒级加载，**不加载模型**；
- 推理完成后按需 `runClustering()`。

缓存按模型名隔离（`cache/<model>/`），切换基座后自动重建。详见 [模型系统](/tio/models#缓存格式)。

## 进程与线程

- GUI 用 `QProcess` 管理引擎生命周期（析构时 kill）；启动 200ms 后异步 `--warmup` 预热缓存，
  用户查询到来则中止预热。
- 缩略图分批加载（每 tick 8 张），避免卡顿。
- 语言 / 主题 / 阈值 / 标签筛选均持久化到 `config/settings.ini`。

## 延伸阅读

- [模型系统](/tio/models) — 基座 / 扩展 / 场景包与缓存
- [DSL 语法参考](/tio/dsl-reference) · [内置宏参考](/tio/macros)
- [CLI 与 REPL](/tio/cli) · [桌面 GUI](/tio/gui)
