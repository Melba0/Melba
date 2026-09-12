---
description: Tio 与 OpenPaw 案例展示：把天空调蓝、人像换背景、照片拼接、复古胶片、以及 Tio 的精确检索示例（红色汽车、EXIF、场景、人物分组）。
---

# 案例展示

每个案例都给出**原图 / 结果 / DSL** 三要素。OpenPaw 结果由 CLI 无界面执行生成，
脚本位于项目的 `examples/` 目录，均可复现。Tio 案例展示检索 DSL。

## OpenPaw — 图像处理

### 1. 复古胶片效果

| 原图 | 结果 | DSL |
|:----:|:----:|-----|
| ![原图](/before.jpg) | ![复古](/after_vintage.jpg) | `$ \|> film_grain(0.25) \|> old_photo()` |

胶片颗粒叠加老照片色调，一键得到复古质感。

### 2. 电影级调色

| 原图 | 结果 | DSL |
|:----:|:----:|-----|
| ![原图](/before.jpg) | ![调色](/after_grade.jpg) | `$ \|> adjust(saturation=1.6, contrast=1.12) \|> split_toning(shadow_color="#0b1e3a", highlight_color="#ffd9a0", strength=0.55) \|> vignette(0.4)` |

提高饱和与对比，暗部压蓝、高光加暖，再加暗角，营造电影氛围。

### 3. 卡通渲染

| 原图 | 结果 | DSL |
|:----:|:----:|-----|
| ![原图](/before.jpg) | ![卡通](/after_cartoon.jpg) | `$ \|> cartoon(0.7)` |

赛璐璐风格化，适合头像与插画风封面。

### 4. 照片拼接（全景）

| 原图 | 结果 | DSL |
|:----:|:----:|-----|
| ![图A](/before.jpg) ![图B](/before_b.jpg) | ![拼接](/after_stitch.jpg) | `stitch_h([a, b], gap=10, bg_color="#ffffff")` |

横向无缝拼接两张照片，`gap` 控制间距，`bg_color` 填充空白。

### 5. 把天空调蓝

| 原图 | 结果 | DSL |
|:----:|:----:|-----|
| ![原图](/before.jpg) | 天空区域被调蓝（见[效果图库](/showcase/gallery)） | `src \|> skyseg() \|> feather(15) \|> apply_mask(...)` |

完整脚本：

```dsl
src = $ : (img_scene("sky") > 0.5)
sky = src |> skyseg()
sky = feather(sky, 15, gradient="smooth")
result = src |> apply_mask(sky, adjust(hue=15, saturation=40))
save(result, "output/blue_sky/", format="jpg", quality=95)
```

### 6. 人像抠图换背景

| 原图 | 结果 | DSL |
|:----:|:----:|-----|
| ![前景](/before.jpg) | 人像叠加到新背景（见[效果图库](/showcase/gallery)） | `paste(bg, fg, feather(mask), x=0.4, y=0.6, scale=0.5)` |

```dsl
bg = load("input/beach.jpg")
fg = load("input/person.jpg")
mask = fg |> humanseg()
mask = feather(mask, 10, gradient="smooth")
result = paste(bg, fg, mask, x=0.4, y=0.6, scale=0.5)
save(result, "output/composite/", format="jpg")
```

## Tio — 图像检索

### 7. 精确检索红色汽车

| 目标 | 匹配 | DSL |
|------|------|-----|
| 红色汽车 | 含红色汽车对象的图片 | `$ : (any(class == "car" && color(obj, "red")))` |

```dsl
red_cars = $ : (any(class == "car" && color(obj, "red")))
```

### 8. 按 EXIF 筛选单反照片

| 目标 | 匹配 | DSL |
|------|------|-----|
| 佳能 + 高感光 | 品牌含 Canon 且 ISO > 800 | `$ : (str_contains(img_camera(), "Canon") && img_iso() > 800)` |

### 9. 按场景查找日落照片

| 目标 | 匹配 | DSL |
|------|------|-----|
| 日落 | Places365 场景得分 > 0.5 | `$ : (img_scene("sunset") > 0.5)` |

### 10. 按人物分组（多人合影）

| 目标 | 匹配 | DSL |
|------|------|-----|
| 多人合影 | 图片内人物对象 ≥ 3 | `$ : (cnt(person) >= 3)` |

```dsl
group_photos = $ : (cnt(person) >= 3)      # 继承计数：含子类
```

### 11. 高质量暖色人像

| 目标 | 匹配 | DSL |
|------|------|-----|
| 暖色 + 曝光良好 + 有人 | 三个条件同时满足 | `$ : (img_warmth() > 0.6 && img_exp_good() > 0.85 && any(class == "person"))` |

### 12. 排除废片

| 目标 | 匹配 | DSL |
|------|------|-----|
| 清晰且曝光正常 | 去除模糊与过曝 | `$ : (img_blur() > 0.5 && img_over() < 0.1)` |

## 相关

- [效果图库](/showcase/gallery) — 更多处理前后对比
- [OpenPaw 工具清单](/openpaw/tools) — 全部处理工具
- [Tio DSL 参考](/tio/dsl-reference) — 全部检索语法
