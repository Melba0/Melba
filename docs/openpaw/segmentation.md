---
description: OpenPaw 分割包机制：registry.json 与 config.json 格式、内置 skyseg_v1、humanseg_v1 扩展示例，以及添加自定义分割包的步骤。
---

# 分割模型包

OpenPaw 的分割完全由**扩展包**驱动：每个模型是一个自包含目录（含 `config.json` 和
`model.onnx`），启动时自动发现。增删包无需改代码，LLM 提示词与 DSL 工具也会自动更新。

## 目录结构

```
models/segmentation/
├── registry.json                 # builtin / extensions / active
├── builtin/
│   └── skyseg_v1/                # 随项目分发（天空分割）
│       ├── config.json
│       └── model.onnx            # 随仓库一起分发
└── extensions/
    └── humanseg_v1/              # 用户扩展示例
        ├── config.json
        └── model.onnx
```

## registry.json

```json
{
  "builtin": ["skyseg_v1"],
  "extensions": ["humanseg_v1"],
  "active": ["skyseg_v1", "humanseg_v1"]
}
```

只有列在 `active` 中的包才会被加载，并暴露给 DSL / LLM。

## config.json

```json
{
  "name": "skyseg_v1",
  "version": "1.0",
  "description": "Built-in sky segmentation (U^2-NetP)",
  "type": "binary_segmentation",
  "target_class": "sky",
  "model": {
    "path": "model.onnx",
    "input_size": 320,
    "input_layout": "NCHW",
    "input_mean": [0.485, 0.456, 0.406],
    "input_std": [0.229, 0.224, 0.225],
    "output_layout": "NCHW",
    "output_channels": 1,
    "output_activation": "none"
  },
  "postprocess": {
    "threshold": 0.5,
    "default_feather": 15,
    "gradient": "smooth"
  },
  "dsl": {
    "tool_name": "skyseg",
    "aliases": ["sky", "sky_mask"],
    "return_type": "Mask"
  },
  "gui": {
    "display_name": "天空分割",
    "icon": "☁️",
    "show_in_toolbar": true
  }
}
```

| 字段 | 含义 |
|------|------|
| `type` | `binary_segmentation` / `multi_class` / `matting` |
| `model.path` | 相对 `config.json` 的模型路径 |
| `model.input_size` | 网络方形输入边长 |
| `model.input_mean` / `input_std` | 逐通道归一化（默认 ImageNet） |
| `model.output_activation` | `auto`（自动检测）/ `sigmoid` / `softmax` / `none` |
| `postprocess.threshold` | 二值化提示（蒙版仍保持浮点） |
| `postprocess.default_feather` | 默认羽化半径（像素） |
| `postprocess.gradient` | 默认羽化渐变类型 |
| `dsl.tool_name` / `dsl.aliases` | DSL 中可用的工具名 |
| `gui` | 包管理器中显示的名称 / 图标 |

## 内置包

| 包 | 工具名 | 说明 |
|----|--------|------|
| `skyseg_v1` | `skyseg`（别名 `sky`、`sky_mask`） | 天空分割（U²-NetP），随仓库分发，开箱即用 |
| `humanseg_v1` | `humanseg` | 人像分割（扩展示例包） |

```dsl
sky = $ |> skyseg()
sky = feather(sky, 15, gradient="smooth")
result = $ |> apply_mask(sky, adjust(hue=15, saturation=40))
save(result, "output/blue_sky/", format="jpg", quality=95)
```

## 添加自定义分割包

1. 创建 `models/segmentation/extensions/<name>/`，放入 `config.json` 与 `model.onnx`。
2. 把 `<name>` 加入 `registry.json` 的 `extensions` 与 `active`——或使用 GUI
   （`设置 → 分割模型管理…`）或命令行 `openpaw_cli --add-seg-pack <目录>`，
   它们会自动复制文件夹并更新注册表。

```bash
openpaw_cli --list-seg-packs
openpaw_cli --add-seg-pack ./my_pack
```

## 模型缺失处理

若某个包的模型文件缺失，执行器会返回清晰的 `model_not_found` 错误，包含期望路径与
下载提示，而不会崩溃。内置天空模型 `builtin/skyseg_v1/model.onnx` 已随仓库分发。

## 支持的模型

只要符合上述输入 / 输出约定，任意 ONNX 分割模型都可作为包接入。内置包使用
U²-NetP 系列架构；你也可以把自训练的模型导出为 ONNX 后放入 `extensions/`。
