---
description: Tio 功能列表：YOLOv8m Open Images V7（601 类）目标检测、Places365 场景识别、模糊概率检索、颜色直方图、曝光与清晰度、EXIF、用户标签、人物聚类、相簿、扩展包、增量缓存与批量编辑。
---

# 功能列表

Tio 把“找图片”拆成可组合的维度：目标、场景、颜色、质量、元数据、标签、人物，
再用统一的模糊求值把它们合成为一个相关度分数。

## 目标检测

基于 **YOLOv8m + Open Images V7（601 类）**，经 ONNX Runtime（CPU）推理。
检测结果包含类别、归一化框、置信度与父类继承链。

```dsl
$ : (any(class == "person"))            # 含人
$ : (cnt(fruit) > 2)                    # 水果（含 apple/banana 子类）> 2
% $ : (any(class == "car"))             # 提取所有汽车对象
```

## 模糊概率检索

Tio 不是布尔过滤，而是给每张图一个 0~1 的相关度：

- `any` = max、`all` = min、`&&` = min、`||` = max、`!` = 1−score；
- 结果按分数降序返回，低分自动过滤；
- `--hard` 可把阈值设为 0.5，退化为布尔过滤。

```dsl
$ : (any(warm && bright) && img_exp_good() > 0.8)
```

## 场景识别

集成 **Places365-GoogLeNet**，识别 **365 种**场景；前 205 类为室内。

```dsl
$ : (img_scene("sunset") > 0.5)        # 日落
$ : (img_scene("beach") > 0.5)
$ : (img_is_indoor() > 0.7)            # 室内场景
$ : (img_scene_top() == "restaurant")
```

## 颜色与直方图

对象与整图都计算 **32 维归一化色调直方图**，可做颜色占比与相似度比较。

| 宏 | 说明 |
|----|------|
| `obj_hist(o)` / `img_hist()` | 对象 / 整图直方图 |
| `hist_value(o,i)` / `img_hist_value(i)` | 第 `i` 个 bin（0~31） |
| `hist_sim(A,B)` | 余弦相似度 |
| `color(o,"red")` / `img_color("blue")` | 主色判断 |
| `img_warmth()` / `img_bright()` / `img_colorful()` | 整图色调 |

```dsl
$ : (any(hist_value(obj, 0) + hist_value(obj, 31) > 0.3))   # 红色占比高
```

## 图像质量

| 宏 | 说明 |
|----|------|
| `img_over()` / `img_under()` | 过曝 / 欠曝 |
| `img_exp_good()` | 曝光质量（0~1） |
| `img_blur()` / `img_blurry()` | 清晰度 / 模糊度 |
| `obj_blur(o)` | 物体局部清晰度 |

```dsl
$ : (img_blur() > 0.5 && img_over() < 0.1)   # 清晰且不过曝
```

## EXIF 元数据

内置轻量 JPEG EXIF 解析，无需外部库：

| 宏 | 说明 |
|----|------|
| `img_camera()` | 相机品牌 + 型号 |
| `img_iso()` / `img_shutter()` / `img_aperture()` / `img_fl()` | 拍摄参数 |
| `img_date()` | 拍摄时间 |

```dsl
$ : (str_contains(img_camera(), "Canon") && img_iso() > 800)
```

## 用户标签

在 GUI 详情面板编辑 `key→value` 标签，写回缓存；支持查询前预筛选。

```dsl
$ : (img_tag_equals("city", "sh"))
$ : (img_has_tag("location"))
```

```powershell
dsl.exe --json --photo .\photo --tag-filter "city=sh|bj" --tag-filter "level=3"
```

## 人物聚类

`face_recognition_v1` 提取 128 维人脸嵌入，DBSCAN 聚类后按人分组，
侧栏显示为 👤 人物分组，支持重命名。

```dsl
# 聚类宏
cluster_id(obj, "face_cluster")
cluster_sim(a, b, "face_cluster")
```

## 相簿与智能相簿

- **虚拟相簿**：手动归组，`collection("名称")` 访问；
- **智能相簿**：保存的 DSL，随图库变化自动重算。

```dsl
collection("旅行") & $ : (img_warmth() > 0.7)
```

## 扩展包

把基座对象裁剪后交给专用模型做二次分析（分类器 / 检测器 / 嵌入），产出子类对象。

```dsl
people = % $ : (any(class == "person"))
parts = people >> face_recognition_v1
out = ^ parts
```

## 增量缓存

- 首次全库推理写入 `cache/<model>/cache_index.json`；
- 之后按 `mtime`/`size` 只处理新增 / 修改图片；
- 无变化时秒级加载，不加载模型；
- 缓存按模型隔离，切换基座自动重建；
- GUI 启动后台 `--warmup` 预热。

## 批量编辑与报告

- 多选缩略图批量删除（删磁盘 + 同步缓存）；
- `BatchEditDialog`：批量写标签、评分、按模板重命名（`{index}`/`{date}`/`{scene}`/`{object}`）；
- `ExportReportDialog`：导出 HTML / PDF 报告（EXIF、场景、对象、标签）。

## 桌面体验

- Qt 6 GUI + CLI（REPL / `--json`）双模式；
- 中英文切换、深浅主题、可折叠 DSL 编辑器；
- 彩色日志面板、相簿树、拖拽、右键菜单、缓存命中率徽章。

## 延伸阅读

- [DSL 语法参考](/tio/dsl-reference) · [内置宏参考](/tio/macros)
- [桌面 GUI](/tio/gui) · [模型系统](/tio/models) · [系统架构](/tio/architecture)
