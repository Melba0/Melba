---
description: Tio 命令行与 REPL 参考：--base/--photo/--tag-filter/--json/--warmup/--hard 等参数、JSON 输出协议、REPL 指令与脚本模式。
---

# CLI 与 REPL

引擎 `dsl.exe` 可独立运行，提供命令行、JSON 管道与交互式 REPL 三种模式。

## 命令行参数

| 参数 | 说明 |
|------|------|
| `--base <name>` | 本次运行覆盖 `registry.json` 的 `active_base`（优先于配置） |
| `--photo <dir>` | 追加图库目录，**可重复**；缺省为项目同级 `photo/` |
| `--tag-filter <key=v1\|v2>` | 标签预筛选：多条件 **AND**、同 key 多值 **OR**、`key=` 表示任意值 |
| `--dsl <code>` | 内联 DSL 代码（配合 `--json`） |
| `--json` | 结果以 JSON 输出到 stdout；DSL 来自 `--dsl` / 脚本文件 / stdin |
| `--warmup` | 只构建 / 刷新推理缓存后退出（隐含 `--json`，进度走 stderr） |
| `--hard` | 布尔过滤：分数阈值 0.5，而非软排序 |
| `--list-models` | 列出所有注册基座模型后退出 |
| `-h` / `--help` | 打印帮助 |
| `<script.dsl>` | 位置参数：执行脚本文件 |
| 无参数 | 进入交互式 REPL |

```powershell
build\dsl.exe                          # REPL
build\dsl.exe --list-models            # 列出模型
build\dsl.exe --base yolov8m-oiv7      # 临时切换基座
build\dsl.exe --json --photo .\photo --tag-filter "city=sh" < query.dsl
```

> `--json` 模式下引擎把 stdout 重定向到 stderr 以保证 stdout 纯 JSON；启动时自动设置
> UTF-8 控制台（`chcp 65001`）。Windows 参数经 `CommandLineToArgvW` 转为 UTF-8。

## JSON 输出协议

GUI 与引擎约定四类消息：

```json
{ "type": "images", "photo_dir": "...", "photo_roots": [{ "prefix": "", "dir": "..." }],
  "results": [{ "path": "000000000049.jpg", "score": 0.91 }] }
```

```json
{ "type": "scalar", "value": 12 }
{ "type": "error", "message": "..." }
{ "type": "warmup", "photo_dir": "...", "images": 128 }
```

- `results` 引擎按 score **升序**输出，GUI 再降序展示并过滤 `< 0.05`。

## 脚本模式

执行 `.dsl` 文件时：若存在变量 `out` 则打印 `out`，否则打印最后一个表达式的结果。

```dsl
cat_pics = $ : (any(class == "cat"))
dog_pics = $ : (any(class == "dog"))
out = cat_pics & dog_pics
```

## 交互式 REPL

```
DSL Interpreter v5.0 (active base: yolov8m-oiv7)  type '/reload' ... 'exit' to quit
```

| 指令 | 作用 |
|------|------|
| `exit` / `quit` | 退出 |
| `/reload` | 重读 `models/registry.json`；若基座变化则作废缓存并重建，下次查询自动重建 |
| 其它输入 | 作为 DSL 表达式 / 赋值 / `del` 执行 |

```dsl
dsl> $ : (any(class == "person"))
dsl> % $ : (any(class == "person"))
dsl> $ : (cnt(fruit) > 2 && img_warmth() > 0.7)
dsl> parts = (% $ : (any(class == "person"))) >> face_recognition_v1
dsl> /reload
```

## 标签预筛选

在求值**之前**把 `$` 限制到 `user_tags` 匹配的图片；匹配 0 张返回**空结果**，绝不回退全库。

```powershell
dsl.exe --json --photo .\photo --tag-filter "city=sh|bj" --tag-filter "level=3"
dsl.exe --json --photo .\photo --tag-filter "location="     # 存在该 key，值不限
```

## 退出与编码

- 脚本文件请保存为 **UTF-8（无 BOM）**；类别名支持中文。
- 若 REPL 中文无法匹配，执行 `chcp 65001`。

## 延伸阅读

- [DSL 语法参考](/tio/dsl-reference) · [内置宏参考](/tio/macros)
- [桌面 GUI](/tio/gui) · [系统架构](/tio/architecture)
