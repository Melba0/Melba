---
description: OpenPaw 蒙版系统：灰度软蒙版语义、矩形/圆形/椭圆/多边形/三角/线性渐变/径向渐变/锥形蒙版、羽化渐变曲线、布尔运算与蒙版编辑器。
---

# 蒙版系统

蒙版决定了处理「作用在哪里、作用多强」。OpenPaw 的蒙版是**软蒙版**：
中间值保留，不做硬二值化，因此羽化边缘自然。

## 语义

蒙版就是灰度图：`255`（白）= 完全生效，`0`（黑）= 不生效，中间值 = 线性混合。
内部计算用浮点，存储为 8-bit 灰度。任意图片都可用作蒙版（自动转灰度）。

合成公式（`blendWithMaskImage`）：

```
out = a × (1 − t) + b × t      # t = mask / 255
```

## 形状蒙版

所有坐标为归一化 `0..1`；未指定尺寸时使用首图尺寸，否则默认 1920×1080。

| 工具 | 参数 | 说明 |
|------|------|------|
| `mask_rect` | `x, y, w, h`，`feather=0`，`gradient=linear` | 矩形 |
| `mask_circle` | `cx, cy, r`，`feather`，`gradient` | 圆形 |
| `mask_ellipse` | `cx, cy, rx, ry`，`feather`，`gradient` | 椭圆 |
| `mask_polygon` | `points`（射线法），`feather`，`gradient` | 多边形 |
| `mask_triangle` | `points`（6 个数字），`feather`，`gradient` | 三角形 |
| `mask_cone` | `cx, cy, angle`, `spread`，`feather` | 扇形 / 锥形 |

## 渐变蒙版

| 工具 | 参数 | 说明 |
|------|------|------|
| `mask_linear_gradient` | `x1, y1, x2, y2` | 沿线段黑→白 |
| `mask_radial_gradient` | `cx, cy, r_inner, r_outer` | 径向，`span<0` 自动反向 |

## 羽化

```dsl
feather(images, radius=15, gradient="smooth")   # radius 0..200
```

- 实现：可分离高斯卷积，`sigma = max(0.5, r/3)`；
- `gradient` 曲线：

| 值 | 曲线 |
|----|------|
| `linear` | `t` |
| `smooth` | `t²(3−2t)`（smoothstep，默认） |
| `ease_in` | `t²` |
| `ease_out` | `1−(1−t)²` |

## 布尔运算

| 工具 | 运算 |
|------|------|
| `mask_union(m1, m2)` | 逐像素 `max` |
| `mask_intersect(m1, m2)` | `min` |
| `mask_subtract(m1, m2)` | `max(0, a−b)` |
| `mask_invert(m)` | `255 − v` |

```dsl
m = mask_rect(0.1, 0.1, 0.5, 0.5)
m = feather(m, 20, gradient="ease_out")
m2 = mask_intersect(m, mask_circle(0.5, 0.5, 0.3))
```

## 与工具组合

`apply_mask(images, masks, operation)` 只在白色区域应用操作：

```dsl
sky = src |> skyseg()
sky = feather(sky, 15, gradient="smooth")
result = apply_mask(src, sky, adjust(hue=15, saturation=40))
save(result, "output/blue_sky/")
```

`paste(bg, fg, mask, x, y, scale, rotation, feather)` 用蒙版做前景抠图合成：

```dsl
bg = load("input/beach.jpg")
fg = load("input/person.jpg")
mask = fg |> humanseg()
mask = feather(mask, 10, gradient="smooth")
result = paste(bg, fg, mask, x=0.4, y=0.6, scale=0.5)
save(result, "output/composite/", format="jpg")
```

## 蒙版编辑器

GUI 左侧 `MaskToolPanel` + 全屏 `MaskEditor` 提供可视化蒙版：

- 工具：`Rect`、`Ellipse`、`Brush`、`Gradient`、`Auto`（分割）；
- 操作下拉：`Saturation +`、`Brightness +`、`Hue Shift`、`Blur`、`Grayscale`；
- 支持 feather / invert / clear / save mask / apply；
- 画布可叠加显示蒙版（`View → Show Mask Overlay`，`Ctrl+M`）。

## 延伸阅读

- [工具清单 · 蒙版](/openpaw/tools#蒙版) · [分割模型包](/openpaw/segmentation)
- [DSL 语法参考](/openpaw/dsl-reference) · [桌面 GUI](/openpaw/gui)
