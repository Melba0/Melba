---
description: OpenPaw 命令行参考：openpaw_cli 的 --nl/--dsl/--file/--input/--output/--dry-run/--list-seg-packs/--add-seg-pack 等参数与交互模式命令。
---

# CLI 参考

OpenPaw 提供独立控制台程序 `openpaw_cli`；GUI 程序 `openpaw` 在带 CLI 参数时也会走同一套逻辑。
不带头参数运行 `openpaw_cli` 会进入交互模式，避免双击一闪而过。

## 命令行参数

| 参数 | 说明 |
|------|------|
| `--nl <text>` | 自然语言 → DSL → 执行（需 `api_key`；失败自动回传重试） |
| `--dsl <code>` | 直接执行 DSL 字符串 |
| `--file <path>` | 执行 `.dsl` 脚本文件 |
| `--input <dir>` | 输入目录（默认项目 `input/`） |
| `--output <dir>` | 输出目录（默认项目 `output/`，作为工具 `baseDir`） |
| `--dry-run` | 只生成 / 打印 DSL，不执行 |
| `--list-seg-packs` | 列出分割包后退出 |
| `--add-seg-pack <dir>` | 安装分割包（复制到 `extensions/` 并启用） |
| `--help` / `-h` | 帮助 |
| `--version` / `-v` | 版本 |

```bash
openpaw_cli --file examples/vintage.dsl --output docs/images
openpaw_cli --dsl 'sky = $ |> skyseg(); result = $ |> apply_mask(sky, adjust(hue=15)); save(result, "out/")'
openpaw_cli --input ./photos --output ./results --nl "把所有有天空的照片调蓝"
openpaw_cli --dry-run --nl "把图片调成复古胶片风"
openpaw_cli --list-seg-packs
openpaw_cli --add-seg-pack ./my_pack
```

> `--nl` 需要 `config/settings.ini` 中的 API Key，否则以退出码 `2` 结束。

## 交互模式

```
openpaw> result = $ |> grayscale() |> save("bw/")
openpaw> :input docs/images
openpaw> :packs
openpaw> :quit
```

| 命令 | 说明 |
|------|------|
| `:help`（`help` / `?`） | 帮助 |
| `:packs` | 列出分割包 |
| `:dsl <code>` | 运行 DSL 字符串 |
| `:file <path>` | 运行 `.dsl` 文件 |
| `:nl <text>` | 自然语言请求 |
| `:input <dir>` / `:output <dir>` | 设置输入 / 输出目录 |
| `:quit`（`:q` / `quit` / `exit`） | 退出 |

裸行判定 `looksLikeDsl()`：含 `=` / `|>` / `save(`，或以 `$` / `load(` / `result` 开头 →
按 DSL 执行；否则按自然语言处理。

## 输出与退出码

- 输出带 ANSI 颜色（Windows 启用 VT processing）；
- `--nl` 未配置 API Key → 退出码 `2`；
- 解析 / 执行错误会打印结构化信息（可选回传 LLM）。

## 完整示例

```dsl
# 1. 选择来源并批量处理
src = $ : (any(class == "person"))
result = src
    |> crop(0.1, 0.1, 0.8, 0.8)
    |> adjust(brightness=1.2, contrast=1.1)
    |> save("output/portraits/", format="jpg", quality=95)
```

```bash
openpaw_cli --input ./photos --output ./portraits --file portrait.dsl
```

## 延伸阅读

- [DSL 语法参考](/openpaw/dsl-reference) · [工具清单](/openpaw/tools)
- [LLM 与自动纠错](/openpaw/llm) · [桌面 GUI](/openpaw/gui)
