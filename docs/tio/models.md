---
description: Tio 模型系统：registry.json、基座模型包（model.onnx/meta.json/classes.json）、扩展包与嵌入聚类、Places365 场景包、增量缓存格式与新增模型步骤。
---

# 模型系统

Tio 的模型全部以“自包含目录 + JSON 描述”的方式组织，扫描即注册。所有推理走 ONNX Runtime（仅 CPU）。

## registry.json

`models/registry.json` 是全局开关：

```json
{
  "active_base": "yolov8m-oiv7",
  "active_extensions": ["face_recognition_v1"]
}
```

| 字段 | 说明 |
|------|------|
| `active_base` | 当前基座模型目录名（必须存在于 `models/base/`）；不存在则告警并回退到第一个可用包 |
| `active_extensions` | 允许被 `>>` 使用的扩展包；聚类包也只有在其中才会提取 embedding |

修改后重启，或在 REPL 执行 `/reload`。

## 基座模型包

`models/base/<name>/` 需要三个文件：

| 文件 | 说明 |
|------|------|
| `model.onnx` | **必需**，缺失则不注册 |
| `meta.json` | `{ "name", "type": "detector", "input_size": 640, "classes": 601 }` |
| `classes.json` | `{ "classes": [{ "name", "parent" }] }` |

- 前 `classes` 个条目按数组顺序对应输出通道的类别；
- `parent` 缺省为 `"root"`（通用祖先），构成 is-a 继承链；
- 当前基座 `yolov8m-oiv7`：Open Images V7，**601 类**，`input_size = 640`。
  `fruit` / `food` / `animal` / `vehicle` 等父类本身即输出类别。

### ONNX 输出格式

```
(1, 4 + nc, total_anchors)
```

- 第 0–3 行：`[x1, y1, x2, y2]`，**已解码到 letterbox 输入像素空间**；
- 第 4 行起：sigmoid 后的类别分数；
- 引擎只做 un-letterbox 映射回原图。

## 扩展包（Extension Pack）

扩展包对基座检测到的对象做二次精细化分析（如 `person` → `head/torso/arm/leg`）。
目录 `models/extensions/<name>/`：

| 文件 | 说明 |
|------|------|
| `config.json` | **必需**，缺失则不注册 |
| `model.onnx` | 分类器 `[1,nc]` / 检测器 `[1,4+nc,N]` / 嵌入 `[1,D]` |

```json
{
  "name": "face_recognition_v1",
  "parent_class": "person",
  "children": ["face"],
  "model_path": "model.onnx",
  "input_size": 112,
  "conf_threshold": 0.3,
  "crop_padding": 0.1,
  "is_classifier": false,
  "input_normalize": "imagenet",
  "capabilities": {
    "can_extract_embedding": true,
    "embedding_name": "face",
    "can_cluster": true,
    "cluster_name": "face_cluster",
    "cluster_threshold": 0.55
  },
  "gui": { "group_label": "人物", "show_in_sidebar": true, "icon": "👤" }
}
```

| 字段 | 默认 | 说明 |
|------|------|------|
| `parent_class` | — | 触发细化的父类 |
| `children` | — | 可输出的子类名 |
| `model_path` | — | **相对包目录**；为空则跳过 |
| `input_size` | `224` | 裁剪缩放到该边长 |
| `conf_threshold` | `0.3` | 子对象置信度下限 |
| `crop_padding` | `0.1` | 父包围盒外扩比例 |
| `is_classifier` | `false` | `true`=分类器，`false`=检测器 |
| `input_normalize` | `""` | `""`/`none` 原值 0~1；`imagenet` 按 ImageNet 均值方差 |
| `capabilities.*` | — | 嵌入提取与聚类（V2） |
| `gui.*` | — | 侧栏分组名 / 图标 / 是否显示 |

引擎同时扫描 `models/extensions/` 与项目根 `extensions/`（同名时首个目录优先）。
当前内置 `face_recognition_v1`（MobileFaceNet，112×112，128 维，`cluster_name = face_cluster`）。

## 场景模型包

`models/scene/` 提供 Places365 场景识别：

```
models/scene/
├── places365_googlenet.onnx          # 输入 [1,3,224,224]，输出 365 logits
├── categories_places365.txt          # 官方 365 行，如 /b/beach 48
├── deploy_googlenet_places365.prototxt
└── meta.json                         # { "name": "Places365-GoogLeNet", "classes": 365, "input_size": 224 }
```

预处理：缩放 224 → RGB CHW → `(x/255 - mean) / std`（ImageNet）→ softmax(365)。
前 205 类为室内，`indoor_score` = 前 205 类概率之和；`dominant_scene` = argmax 名称。
模型缺失时优雅降级：宏返回 `0.0` / `""`，缓存写全零。

## 缓存格式

`cache/<model>/cache_index.json`（当前版本 `1.2`）：

```json
{
  "version": "1.2",
  "model_name": "yolov8m-oiv7",
  "photo_dirs": ["..."],
  "next_obj_id": 225,
  "next_img_id": 128,
  "collections": { "旅行": ["000000000049.jpg"] },
  "entries": {
    "000000000049.jpg": {
      "mtime": 1661439700,
      "size": 158392,
      "img_id": 6,
      "objects": [
        { "class": "human", "x": 0.32, "y": 0.64, "w": 0.22, "h": 0.27,
          "area": 0.062, "confidence": 0.361, "original_class": "person",
          "super_class": "human", "is_fallback": true, "parent_id": -1,
          "obj_id": 0, "img_id": 6, "attr": { "...": 0 },
          "embeddings": {}, "cluster_ids": {} }
      ],
      "img_attrs": {
        "color_temperature": 5200, "dominant_color": "orange",
        "global_hue_hist": [], "luma_hist": [],
        "overexposure_score": 0.02, "underexposure_score": 0.05,
        "exposure_goodness": 0.965, "global_blur_score": 0.71,
        "camera_model": "...", "iso": 100, "aperture": 2.8, "focal_length": 50,
        "user_tags": { "city": "sh" },
        "scene_vector": [], "dominant_scene": "beach", "indoor_score": 0.12,
        "cluster_groups": {}
      }
    }
  }
}
```

版本演进：`1.1` 引入曝光 / 清晰度 / EXIF / 标签；`1.2` 引入 Places365 场景向量。
旧的 `metadata.json` 会被 `CacheIndex::loadLegacyFromFile` 自动迁移。

## 置信度降级

`CacheManager::applyFallback`：当检测置信度低于 `fallback_threshold` 且存在非 root 父类时，
把 `class_name` 改写为父类名，`original_class` 保留原类，`is_fallback = true`。
`super_class` 始终记录直接父类。当前默认 `fallback_threshold = 0`（禁用）。

## 添加模型

1. 导出 `.onnx`（见 [模型导出](/tio/model-export)）；
2. 放入 `models/base/<name>/` 并写好 `meta.json` 与 `classes.json`；
3. 改 `registry.json` 的 `active_base`（或用 `--base <name>` 临时切换）。

```powershell
build\dsl.exe --list-models
build\dsl.exe --base yolov8m-oiv7
```

## 延伸阅读

- [系统架构](/tio/architecture) · [内置宏参考](/tio/macros#场景宏)
- [模型导出](/tio/model-export) · [CLI 与 REPL](/tio/cli)
