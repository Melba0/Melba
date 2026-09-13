---
description: Tio 内置宏完整参考：数学、颜色、直方图、图像质量/EXIF/标签、场景、聚类、空间几何、关系、氛围宏的名称、签名与语义。
---

# 内置宏参考

Tio 的宏是具名表达式模板，内置宏与用户宏共用同一张宏表，调用语法完全一致。
共约 60+ 个内置宏，按类别列出如下。

## 调用方式

```dsl
big(obj)              # 显式传参
max(0.1, 0.2)         # 数学函数
warm & bright         # 裸调用：把当前对象广播给单参数宏
```

裸调用（如 `big`、`warm`）在量词内部自动把**当前对象**作为参数传入。

## 数学（返回 Num）

| 宏 | 说明 |
|----|------|
| `max(a,b)` `min(a,b)` | 最大 / 最小值 |
| `abs(x)` | 绝对值 |
| `sqrt(x)` | 平方根 |
| `pow(a,b)` | 幂 |
| `log(x)` `exp(x)` | 自然对数 / 指数 |

## 颜色宏 — 对象级

读取对象区域 `attr`，返回 0~1：

| 宏 | 说明 |
|----|------|
| `color(obj, "name")` | 主色匹配（red/orange/yellow/green/cyan/blue/purple/pink/brown/gray/white/black），模糊匹配 |
| `cct(obj)` | 色温 |
| `warmth(obj)` / `coolness(obj)` | 暖度 / 冷度 |
| `brightness(obj)` / `saturation(obj)` | 亮度 / 饱和度 |

## 颜色宏 — 整图级

| 宏 | 说明 |
|----|------|
| `img_temp()` | 整图色温 |
| `img_warmth()` / `img_coolness()` | 暖度 / 冷度 |
| `img_color("name")` | 整图主色判断 |
| `img_bright()` / `img_colorful()` | 亮度 / 鲜艳度 |

## 直方图宏（32 维色调）

| 宏 | 说明 |
|----|------|
| `obj_hist(obj)` | 对象区域 32 维色调直方图 |
| `img_hist()` | 整图 32 维色调直方图 |
| `hist_sim(A, B)` | 两直方图余弦相似度（0~1） |
| `hist_value(obj, idx)` | 对象直方图第 `idx` 个 bin（0~31） |
| `img_hist_value(idx)` | 整图直方图第 `idx` 个 bin |

> 颜色↔bin 参考：红 0,31 / 橙 1,2 / 黄 3-5 / 绿 9-11 / 青 14,15 / 蓝 19-21 / 紫 24-26 / 粉 27-29。

## 图像质量 / EXIF / 用户标记

| 宏 | 说明 |
|----|------|
| `img_over()` / `img_under()` | 过曝 / 欠曝分数 |
| `img_exp_good()` | 曝光质量（0~1） |
| `img_hist_val(idx)` | 亮度直方图 bin（0~63） |
| `img_blur()` / `img_blurry()` | 全局清晰度 / 1-清晰度 |
| `obj_blur(obj)` | 物体局部清晰度 |
| `img_camera()` | 相机品牌 + 型号（缺失为空串） |
| `img_iso()` / `img_shutter()` / `img_aperture()` / `img_fl()` | ISO / 快门 / 光圈 / 焦距（缺失 `-1`） |
| `img_date()` | 拍摄时间 |
| `img_tag(key)` | 用户标签值 |
| `img_has_tag(key)` | 是否存在该标签 |
| `img_tag_equals(k, v)` | 标签精确匹配 |
| `stof(s)` | 字符串→数值 |
| `str_contains(s, sub)` | 子串包含判断 |

## 场景宏（Places365）

模型缺失时返回 `0.0` / `""`：

| 宏 | 说明 |
|----|------|
| `img_scene("beach")` | 指定场景的概率（0~1，名称大小写与 `-`/`_`/空格不敏感，也接受数字索引） |
| `img_scene_top()` | 概率最高的场景名 |
| `img_scene_vec()` | 场景向量（内部） |
| `img_is_indoor()` | 室内概率（前 205 类概率和） |

```dsl
$ : (img_scene("sunset") > 0.5)
$ : (img_scene_top() == "beach")
$ : (img_is_indoor() > 0.7)
```

## 聚类宏（V2）

| 宏 | 说明 |
|----|------|
| `cluster_id(obj, "face_cluster")` | 对象所属聚类 id（未分配为空串） |
| `cluster_sim(a, b, "face_cluster")` | 同一聚类返回 1，否则 0 |

```dsl
$ : (any(cluster_sim(obj, obj, "face_cluster") == 1))   # 占位示例
```

## 空间 / 几何（单对象 → Bool）

| 宏 | 逻辑 |
|----|------|
| `big(x)` | `x.area > 0.2` |
| `small(x)` | `x.area < 0.05` |
| `left(x)` / `right(x)` | 中心 x 在左 / 右 1/3 |
| `top(x)` / `bottom(x)` | 中心 y 在上 / 下 1/3 |
| `square(x)` | `abs(w/h - 1) < 0.1` |

## 关系宏（两对象）

| 宏 | 逻辑 |
|----|------|
| `left_of(a,b)` | `a.x + a.w < b.x` |
| `above(a,b)` | `a.y + a.h < b.y` |
| `inside(a,b)` | a 的框完全在 b 内 |

也支持裸类名逐图配对：`left_of(cat, dog)`（`left_of` 用 `sigmoid(spacing, 20)`，
`inside` 用交集占比），返回模糊分。

## 氛围宏（读对象 `attr`）

| 宏 | 逻辑 |
|----|------|
| `warm(obj)` | `attr.h ∈ (5, 45)` |
| `cool(obj)` | `attr.h ∈ (180, 260)` |
| `bright(obj)` | `attr.v > 0.75` |
| `dark(obj)` | `attr.v < 0.25` |
| `smooth(obj)` | `attr.lbp < 0.2` |
| `rough(obj)` | `attr.lbp > 0.6` |

## 用户自定义宏

```
macro <名字>(<参数...>) = <表达式>
```

```dsl
macro half_area(x) = x.area / 2
macro has_big_cat(set) = set : (any(class == "cat" && big))

$ : (any(area > half_area(obj)))
```

## 延伸阅读

- [DSL 语法参考](/tio/dsl-reference) — 运算符、量词、集合、扩展
- [功能列表](/tio/features) — 场景、聚类、相簿、批量编辑
- [模型系统](/tio/models) — 场景包与扩展包
