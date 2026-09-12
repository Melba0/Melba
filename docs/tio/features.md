---
description: Tio 功能列表：YOLO 目标检测（600+ 类）、Places365 场景识别（365 种）、32 维颜色直方图、曝光与模糊检测、EXIF、用户标签、智能相簿与批量编辑。
---

# 功能列表

## 物体检测

基于 **YOLOv8m** 目标检测（经 ONNX Runtime CPU 推理），支持 COCO 80 类以及
Open Images V7 等扩展数据集提供的 **600+ 类别**。检测结果包含类别、归一化框坐标、
置信度与父类继承链。

```dsl
$ : (any(class == "person"))            # 含人
$ : (cnt(fruit) > 2)                    # 水果（含 apple/banana 子类）> 2
% $ : (any(class == "car"))             # 提取所有汽车对象
```

## 场景识别

集成 **Places365** 场景分类模型，识别 **365 种**场景（天空、日落、海滩、山脉、
室内、街道……）。

```dsl
$ : (img_scene("sunset") > 0.5)         # 日落照片
$ : (img_scene("sky") > 0.5)            # 含天空的照片
```

> 场景识别需要将 Places365 导出为 ONNX 并在 `models/registry.json` 中注册；
> 未注册时相关宏返回 0，其余功能不受影响。

## 颜色直方图

每个对象与整图都计算 **32 维归一化色调直方图**，可做颜色占比筛选与相似度比较。

| 宏 | 说明 |
|----|------|
| `obj_hist(o)` / `img_hist()` | 对象 / 整图 32 维直方图 |
| `hist_value(o, i)` / `img_hist_value(i)` | 第 `i` 个 bin（0~31） |
| `hist_sim(A, B)` | 两个直方图余弦相似度（0~1） |
| `img_color("blue")` | 整图主色判断 |

```dsl
$ : (any(hist_value(obj, 0) + hist_value(obj, 31) > 0.3))   # 红色占比高
```

> 颜色↔bin：红 0,31 / 橙 1,2 / 黄 3-5 / 绿 9-11 / 青 14,15 / 蓝 19-21 / 紫 24-26 / 粉 27-29。

## 图像质量

自动评估曝光与清晰度，用于筛掉废片或找出艺术模糊。

| 宏 | 说明 |
|----|------|
| `img_over()` / `img_under()` | 过曝 / 欠曝分数 |
| `img_exp_good()` | 曝光质量（0~1，越高越好） |
| `img_blur()` / `img_blurry()` | 全局清晰度 / 模糊度 |
| `obj_blur(o)` | 物体局部清晰度 |

```dsl
$ : (img_exp_good() > 0.9 && any(class == "person"))   # 曝光良好且含人
$ : (img_blur() < 0.35)                                 # 模糊照片
```

## EXIF 元数据

内置轻量 EXIF 读取器（无需外部库），支持按拍摄设备、参数与时间检索。

| 宏 | 说明 |
|----|------|
| `img_camera()` | 相机品牌 / 型号 |
| `img_iso()` | ISO 感光度 |
| `img_shutter()` | 快门速度 |
| `img_aperture()` | 光圈 |
| `img_fl()` | 焦距 |
| `img_date()` | 拍摄时间 |

```dsl
$ : (str_contains(img_camera(), "Canon"))   # 佳能拍摄
$ : (img_iso() > 800)                        # 高感光
$ : (img_fl() > 100)                         # 长焦
```

## 用户标签

在 GUI 详情面板为图片编辑 key→value 标签，写回缓存索引；支持标签预筛选，查询前先缩小范围。

```dsl
$ : (img_tag_equals("city", "sh"))      # city=sh
$ : (img_has_tag("location"))           # 存在该 key
```

命令行预筛选（多条件 AND，同 key 多值 OR）：

```powershell
dsl.exe --json --photo .\photo --tag-filter "city=sh|bj" --tag-filter "level=3"
```

## 智能相簿

把 DSL 查询保存为相簿：每次打开自动用最新缓存重新求值，图库变化时结果自动更新。
适合"我的人像""上海旅行""高画质风景"等动态集合。

## 批量编辑

- 在结果网格中 Ctrl / Shift 多选缩略图，一键删除。
- DSL `del` 语句删除图片并同步缓存索引。
- 与 [OpenPaw](/openpaw/) 配合：Tio 检出图片集，OpenPaw 批量处理保存。

## 扩展包

把基座模型检测到的对象裁剪出来，交给专用小模型做二次精细化分析，
产出子类对象（如 `person` → `head/torso/arm/leg`）。模型即插件，增删无需改代码。

```dsl
people = % $ : (any(class == "person"))
parts = people >> person_parts_v1
out = ^ parts
```

详见 [扩展包格式](/tio/dsl-reference#扩展操作符) 与 [DSL 参考](/tio/dsl-reference)。

## 增量缓存

- 首次运行对全库推理并写入 `cache/<model>/cache_index.json`。
- 之后按 `mtime` / `size` 增量更新：只处理新增 / 修改的图片，删除的自动剔除。
- 缓存按模型名隔离，切换基座模型自动重建。

## 桌面体验

- Qt 6 GUI + CLI（REPL / `--json`）双模式。
- 中英文界面切换、深浅主题。
- 结果缩略图网格、图片详情对话框（元数据 / 标签）、标签筛选对话框。
- 可停靠面板与实时日志。
