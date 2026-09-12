---
description: 编译 OpenPaw（Qt 6 + ONNX Runtime），配置 LLM API Key，运行第一个自然语言编辑任务与 CLI 示例。
---

# 快速开始

## 1. 环境要求

- CMake ≥ 3.18
- C++17 编译器（MSVC 2019+ 或 MinGW / GCC 11+）
- Qt 6（Core、Gui、Widgets、Network）
- *推荐：* ONNX Runtime（分割包推理，自动探测）
- *可选：* OpenCV（加速图像内核）

## 2. 编译

### Windows（MinGW + Ninja，已验证配置）

```powershell
cmake -S . -B build `
  -G Ninja `
  -DCMAKE_PREFIX_PATH="D:/Qt/6.10.1/mingw_64" `
  -DCMAKE_CXX_COMPILER="D:/Qt/Tools/mingw1310_64/bin/g++.exe" `
  -DCMAKE_MAKE_PROGRAM="D:/Qt/Tools/Ninja/ninja.exe"
cmake --build build
```

或使用内置 preset（请先按你的机器修改路径）：

```powershell
cmake --preset windows-mingw
cmake --build --preset windows-mingw
```

ONNX Runtime 会自动探测：通过 `-DONNXRUNTIME_ROOT=<解压目录>` 或环境变量
`ONNXRUNTIME_ROOT` 指定。未找到时分割工具回退到经典算法，程序仍可正常构建。

### Linux / macOS

```bash
cmake -S . -B build -DCMAKE_PREFIX_PATH=/path/to/Qt/6.x.x/gcc_64
cmake --build build -j
```

构建产物：

- `build/openpaw` — 图形界面程序（也接受 CLI 参数）
- `build/openpaw_cli` — 独立命令行程序

## 3. 准备模型

**内置天空分割** `skyseg_v1` 随仓库一起分发，解压即可用，无需额外下载：

```
models/segmentation/
├── registry.json
├── builtin/skyseg_v1/{config.json, model.onnx}   # 随项目分发
└── extensions/humanseg_v1/{config.json, model.onnx}
```

用户扩展包把 `model.onnx` 放入对应目录并在 `registry.json` 的 `active` 中启用即可。
详见 [分割模型包](/openpaw/segmentation)。

## 4. 配置 LLM

编辑 `config/settings.ini`（或使用 **设置 → 首选项**）：

```ini
[LLM]
base_url = https://api.openai.com/v1/chat/completions
api_key  =
model    = gpt-4o-mini
max_retries = 3
stream   = true
temperature = 0.2
```

`base_url` 可为任意兼容 OpenAI 的端点（`/v1`、`/v1/chat/completions` 或裸主机名都会被自动规范化）。

> 不想配置 LLM 也可以直接手写 DSL 并执行（见第 5 节），无需 API Key。

## 5. 第一个编辑任务

### GUI

1. 启动 `openpaw`，**思考过程** 标签页会显示欢迎提示。
2. 导入图片：点工具栏 **Import**，或把文件夹直接拖进窗口。
3. 顶部输入自然语言，点 **Generate & Run**（快捷键 **Ctrl+Enter**）；
   或从 **Examples** 下拉选择现成脚本，点 **Process → Execute DSL**。
4. 用 **Adjust** 滑块实时预览，点 **Apply** 才写入。
5. 结果出现在底部 **Output Results** 与画布；**双击缩略图**看全尺寸。

### "把天空调蓝"

自然语言：

```
把所有有天空的照片调蓝
```

生成的 DSL：

```dsl
src = $ : (img_scene("sky") > 0.5)
sky = src |> skyseg()
sky = feather(sky, 15, gradient="smooth")
result = src |> apply_mask(sky, adjust(hue=15, saturation=40))
save(result, "output/blue_sky/", format="jpg", quality=95)
```

### CLI

```bash
openpaw_cli --file examples/vintage.dsl --output docs/images
openpaw_cli --nl "把所有有天空的照片调蓝"          # 需要 API Key
openpaw_cli --dsl 'sky = $ |> skyseg(); result = $ |> apply_mask(sky, adjust(hue=15)); save(result, "out/")'
openpaw_cli --list-seg-packs
openpaw_cli --add-seg-pack ./my_pack
```

常用参数：

| 参数 | 说明 |
|------|------|
| `--nl "<text>"` | 自然语言 → DSL → 执行（需 API Key） |
| `--dsl '<code>'` | 直接执行 DSL 字符串 |
| `--file script.dsl` | 执行 DSL 脚本文件 |
| `--input <dir>` / `--output <dir>` | 指定输入 / 输出目录 |
| `--dry-run` | 只生成 DSL 不执行 |
| `--list-seg-packs` | 列出分割包 |
| `--add-seg-pack <dir>` | 安装分割包 |

### 交互模式

不带参数运行 `openpaw_cli`（例如双击 exe）会进入交互模式：

```
openpaw> result = $ |> grayscale() |> save("bw/")
openpaw> :input docs/images
openpaw> :packs
openpaw> :quit
```

命令：`:help`、`:packs`、`:dsl <code>`、`:file <path>`、`:nl <text>`、`:input <dir>`、`:output <dir>`、`:quit`。

## 6. 下一步

- [DSL 语法参考](/openpaw/dsl-reference) — 管道、分割、蒙版、合成
- [工具清单](/openpaw/tools) — 全部 35+ 工具签名
- [分割模型包](/openpaw/segmentation) — 添加自定义分割包
- [案例展示](/showcase/) — 真实效果与脚本
