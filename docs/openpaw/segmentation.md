---
description: OpenPaw 分割包机制：registry.json 与 config.json 全字段、内置 skyseg_v1 与人像 humanseg_v1、ONNX 推理与回退、添加/管理分割包的步骤。
---

# 分割模型包

OpenPaw 的分割由**扩展包**驱动：每个模型是自包含目录（`config.json` + `model.onnx`），
启动时自动发现。增删包无需改代码，LLM 提示词与 DSL 工具自动更新。

## 目录结构

```
models/segmentation/
├── registry.json
├── builtin/
│   └── skyseg_v1/{config.json, model.onnx}
└── extensions/
    └── humanseg_v1/{config.json, model.onnx}
```

## registry.json

```json
{
  "builtin": ["skyseg_v1"],
  "extensions": ["humanseg_v1"],
  "active": ["skyseg_v1", "humanseg_v1"]
}
```

只有 `active` 中的包会被加载并暴露给 DSL / LLM。`builtin` 包不可删除。

## config.json 全字段

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
    "gradient": "smooth",
    "invert": true,
    "normalize": true
  },
  "dsl": { "tool_name": "skyseg", "aliases": ["sky", "sky_mask"], "return_type": "Mask" },
  "gui": { "display_name": "天空分割", "icon": "☁️", "show_in_toolbar": true }
}
```

| 字段 | 默认 | 说明 |
|------|------|------|
| `type` | `binary_segmentation` | `binary_segmentation` / `multi_class` / `matting` |
| `target_class` | — | 目标类别名（提示用） |
| `model.path` | `model.onnx` | 相对 `config.json` |
| `model.input_size` | `320` | 网络方形输入边长 |
| `model.input_mean/std` | ImageNet | 逐通道归一化 |
| `model.output_activation` | `auto` | `auto` / `sigmoid` / `softmax` / `none` |
| `postprocess.threshold` | `0.5` | 二值化提示（蒙版仍为软） |
| `postprocess.default_feather` | `15` | 默认羽化半径 |
| `postprocess.gradient` | `smooth` | 默认羽化曲线 |
| `postprocess.invert` | `false` | 输出取反（显著性模型常用） |
| `postprocess.normalize` | `true` | min-max 拉伸 |
| `dsl.tool_name` | `name` | DSL 工具名 |
| `dsl.aliases` | `[]` | 别名 |
| `gui.*` | — | 管理器中显示名 / 图标 / 是否显示在工具栏 |

## 内置包

| 包 | 工具名 | 说明 |
|----|--------|------|
| `skyseg_v1` | `skyseg`（别名 `sky`、`sky_mask`） | 天空分割（U²-NetP），`invert=true`，随仓库分发 |
| `humanseg_v1` | `humanseg`（别名 `personseg`、`people`） | 人像分割，`output_activation=auto`，`default_feather=12` |

```dsl
sky = $ |> skyseg()
sky = feather(sky, 15, gradient="smooth")
result = $ |> apply_mask(sky, adjust(hue=15, saturation=40))
save(result, "output/blue_sky/", format="jpg", quality=95)
```

## 推理与回退

`SegmentationRunner`：

1. 按包名缓存 ONNX `Ort::Session`；
2. 转 RGB888 → 缩放到 `input_size` → 归一化 → NCHW float32；
3. 输出按 `output_activation` 激活 → 可选 `normalize` → 可选 `invert` → 缩放回原尺寸 → 可选 `feather`；
4. **无 ONNX 时回退**为确定性的竖直渐变蒙版，保证管道可用。

错误：模型缺失 → `model_not_found`（含期望路径与放置提示）；加载失败 → `model_load_failed`；
推理异常 → `inference_failed`。

## 管理分割包

- **GUI**：`Settings → Segmentation Packs...` 启用 / 禁用 / 添加 / 删除；
- **CLI**：

```bash
openpaw_cli --list-seg-packs
openpaw_cli --add-seg-pack ./my_pack
```

`--add-seg-pack` 会把目录复制到 `models/segmentation/extensions/` 并加入 `active`。

## 添加自定义包

1. 建 `models/segmentation/extensions/<name>/`，放入 `config.json` 与 `model.onnx`；
2. 把 `<name>` 加入 `registry.json` 的 `extensions` 与 `active`（或用上面的 GUI / CLI）；
3. 重启后，DSL 会出现对应工具（`<tool_name>` 与别名）。

## 延伸阅读

- [蒙版系统](/openpaw/masks) · [工具清单 · 分割](/openpaw/tools#分割)
- [DSL 语法参考](/openpaw/dsl-reference) · [常见问题](/openpaw/faq)
