---
description: OpenPaw 系统架构：模块划分、请求→LLM→解析→执行→保存的数据流、值类型与管道语义、参数绑定与广播、save 语义、线程模型。
---

# 系统架构

OpenPaw 是一个 C++17 / Qt 6 桌面应用，核心可拆为三个目标：静态库 `openpaw_core`、
GUI 程序 `openpaw`、控制台程序 `openpaw_cli`。

## 模块划分

| 模块 | 职责 |
|------|------|
| `parser/` | `Lexer` 词法分析 + `Parser` 递归下降解析 + `Ast.h` |
| `executor/` | `Executor` 求值、`Value.h` 动态值、`ImageSet.h`、`Context.h`、`DslError.h`、`PendingOp.h` |
| `tools/` | 全部图片处理工具 + `ToolRegistry`；`MaskImage.{h,cpp}` 蒙版算法 |
| `llm/` | `LlmClient`（OpenAI 兼容 SSE 流式客户端）、`PromptBuilder` |
| `pipeline/` | `Pipeline` 编排「请求 → LLM → 执行 → 重试」 |
| `segmentation/` | `SegPack.h`、`SegmentationRegistry`、`SegmentationRunner`（ONNX + 回退） |
| `io/` | `ImageImporter`、`WorkspaceManager`、`ProcessingHistory`、`ExifReader` |
| `gui/` | Qt Widgets 界面 |
| `cli/` | `CliRunner` + `cli_main` |
| `utils/` | `Settings`（ini）、`ImageLoader` |

> 说明：当前版本的蒙版算法位于 `src/tools/MaskImage.*`（历史 `src/mask/` 已合并）。

## 数据流

```
用户请求
  │
  ▼
gui::MainWindow ──► pipeline::Pipeline（独立 QThread）
  │                   │ PromptBuilder::systemPrompt()（注入 ToolRegistry + SegmentationRegistry）
  │                   ▼
  │              llm::LlmClient（SSE 流式，OpenAI 兼容）
  │                   │
  │                   ▼
  │              PromptBuilder::stripCodeFences() → DSL
  │                   ▼
  │              parser::Parser.parseProgram() → AST
  │                   ▼
  │              executor::Executor.execute() ──► tools::* ──► 写文件
  │                   │
  │        失败 ◄──────┘ 错误 JSON + 原始 DSL + 请求 → LLM → 修正 DSL（≤ max_retries）
  ▼
gui::CanvasView / FilmstripWidget 展示原图/结果
```

## 值类型

`Value::Type = { Null, Number, String, Bool, ImageSet, Operation }`：

- **ImageSet**：一组图片（含 `QImage` 与 meta）；管道的基本载体；
- **Operation**：延迟工具调用（`PendingOp`），用于 `apply_mask(img, mask, adjust(hue=15))`；
- **Mask 不是独立类型**：蒙版就是灰度 `ImageSet`，`255`=完全生效，`0`=不生效，中间=线性混合。

## DSL 执行语义

- `$` → 全部输入图片；`$ : (condition)` → 若设置了检索引擎回调则过滤，否则**回退为全部图片**；
- `A |> f(b, c)` ≡ `f(A, b, c)`；
- `name = expr` 变量赋值；语句顺序执行，任何 `ImageSet` 结果更新 `ctx.result`；
- 类型名：`number` / `string` / `bool` / `ImageSet` / `operation` / `null`。

## 参数绑定与广播

- 管道输入自动绑定到工具的首个 `images` 参数；
- 参数支持位置与关键字（`key=value`），未知参数名 / 过多位置参数会报错；
- 校验：必填 `missing_argument`、范围 `parameter_out_of_range`、枚举 `invalid_argument`；
- **双图工具**（`compose`、`paste`、`overlay`、`blend`、`stitch_*` 等）按 `i % size` 配对，
  实现「一张图 × 一组图」广播；
- `apply_mask` 允许蒙版数量为 1（广播）或与图片数量相等，否则 `size_mismatch`。

## `save()` 语义

```dsl
save(path, format="auto", quality=0)
```

- 路径以 `/` 或 `\` 结尾、是已存在目录、或无后缀 → 目录，批量保存；否则视为单张文件；
- 多个结果写向同一文件路径时自动追加 `_NNN`；
- 相对路径先拼到 CLI `--output`（`ctx.baseDir`），否则相对当前工作目录；
- 格式 / 质量优先级：显式参数 > `convert()` 写入的 meta > 路径后缀 > 默认值；
- 写入文件累加到 `ctx.savedFiles`；失败记入 warnings / `save_failed`。

## 线程模型

- `Pipeline` 在独立 `QThread`；删除 / 复制的 `FileOpsWorker` 也在独立线程；
- 缩略图 `ThumbnailLoader`（`QRunnable`）走 `QThreadPool`，保证大图库不卡界面。

## 项目结构

```
open paw/
├── src/{parser,executor,tools,llm,pipeline,segmentation,io,gui,cli,utils}
├── models/segmentation/{registry.json,builtin/,extensions/}
├── config/{settings.ini,workspaces.json,layout.ini,history.json}
├── presets/*.dsl                 # 处理模板
├── examples/*.dsl                # 可复现示例
├── input/  output/
└── CMakeLists.txt, CMakePresets.json
```

## 延伸阅读

- [DSL 语法参考](/openpaw/dsl-reference) · [工具清单](/openpaw/tools)
- [蒙版系统](/openpaw/masks) · [LLM 与自动纠错](/openpaw/llm)
