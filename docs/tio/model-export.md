---
description: Tio 模型导出指南：YOLO Open Images V7 基座导出为 ONNX、扩展分类器/检测器/嵌入模型导出、Places365 场景模型准备，以及配套 meta.json / classes.json。
---

# 模型导出

Tio 引擎只加载 `.onnx`。本页说明如何准备三类模型：**基座检测**、**扩展细化**、**场景分类**。

> 需要 Python 3.10+ 与 PyTorch（仅导出阶段使用）。

## 基座检测模型（YOLO → ONNX）

以 YOLOv8m 在 Open Images V7 上训练/微调的权重为例：

```powershell
yolo export model=yolov8m-oiv7.pt format=onnx opset=12 imgsz=640
```

导出后放入 `models/base/yolov8m-oiv7/`，并补上两个描述文件：

```
models/base/yolov8m-oiv7/
├── model.onnx
├── meta.json
└── classes.json
```

```json
// meta.json
{ "name": "yolov8m-oiv7", "type": "detector", "input_size": 640, "classes": 601 }
```

```json
// classes.json（前 N 个条目按顺序对应输出通道）
{
  "classes": [
    { "name": "person", "parent": "human" },
    { "name": "apple",  "parent": "fruit" },
    { "name": "car",    "parent": "vehicle" }
  ]
}
```

`parent` 缺省为 `"root"`，构成 is-a 继承链，供 `cnt()` 的传递计数与置信度降级使用。

> 引擎期望检测输出为 `(1, 4+nc, anchors)`，前 4 行为**已解码**的 `[x1,y1,x2,y2]`
> （letterbox 输入像素空间），第 4 行起为 sigmoid 后的类别分数。若你的导出格式不同，
> 需在导出时对检测头做相应处理（Ultralytics 的默认 ONNX 导出已包含解码）。

## 扩展细化模型

扩展模型输入为裁剪并缩放到 `input_size` 的 RGB 张量 `[1, 3, S, S]`，数值 0~1
（或按 `input_normalize: "imagenet"` 归一化）：

| 类型 | 输出 | `is_classifier` |
|------|------|-----------------|
| 分类器 | `[1, nc]` logits，对应 `children` 顺序 | `true` |
| 检测器 | `[1, 4+nc, N]`，与基座相同格式 | `false` |
| 嵌入 | `[1, D]`（D ≥ 8），用于聚类 | 配合 `capabilities.can_extract_embedding` |

```python
import torch

model.eval()
dummy = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model, dummy, "models/extensions/demo_v1/model.onnx",
    input_names=["input"], output_names=["output"],
    opset_version=12
)
```

然后在同目录写 `config.json`，并把包名加入 `registry.json` 的 `active_extensions`：

```json
{
  "name": "demo_v1",
  "parent_class": "flower",
  "children": ["petal", "stamen", "stem"],
  "model_path": "model.onnx",
  "input_size": 224,
  "conf_threshold": 0.15,
  "crop_padding": 0.1,
  "is_classifier": true,
  "input_normalize": "none"
}
```

## 场景分类模型（Places365）

准备 `models/scene/`：

```
models/scene/
├── places365_googlenet.onnx          # 输入 [1,3,224,224]，输出 365 logits
├── categories_places365.txt          # 官方 365 行，如 /b/beach 48
└── meta.json                         # { "name": "Places365-GoogLeNet", "classes": 365, "input_size": 224 }
```

预处理固定为：缩放 224 → RGB CHW → `(x/255 - mean) / std`（mean `[0.485,0.456,0.406]`，
std `[0.229,0.224,0.225]`）→ softmax(365)。前 205 类为室内。模型缺失时相关宏优雅降级。

## 验证

```powershell
build\dsl.exe --list-models
build\dsl.exe --base yolov8m-oiv7
dsl> /reload
dsl> $ : (img_scene("beach") > 0.5)
```

## 延伸阅读

- [模型系统](/tio/models) — 包格式、注册表与缓存
- [内置宏参考](/tio/macros#场景宏) — 场景与聚类宏
- [常见问题](/tio/faq) — 模型未加载、缓存未更新
