---
description: OpenPaw DSL 语法参考：管道操作符 |>、变量、来源选择 $、分割工具、蒙版工具、图像工具、合成工具与 save() 保存语法。
---

# DSL 语法参考

OpenPaw DSL 结合了**可选检索语法**（`$ : (...)`）与**处理管道**，两者可混用。
一句话：选择来源 → 用 `|>` 串联工具 → `save()` 保存。

## 1. 基本结构

```dsl
# 1. 选择来源
src = $ : (any(class == "person"))   # $ = 所有输入图片

# 2. 用管道操作符串联工具
result = src
    |> crop(0.1, 0.1, 0.8, 0.8)
    |> adjust(brightness=1.2, contrast=1.1)
    |> sharpen(1.5)
    |> save("output/portraits/")
```

- `$` —— 全部输入图片；`$ : (condition)` —— 可选检索过滤
  （如 `any(class == "person")`、`img_scene("sky") > 0.5`）；无视觉引擎时回退为全部图片。
- `name = expr` —— 变量赋值。
- `|>` —— 将 `ImageSet` 传入工具。
- `save(path)` —— 持久化。目录路径（以 `/` 结尾）批量保存；文件路径保存单张。
- 参数支持位置参数与关键字参数（`key=value`），标量参数支持算术
  （`crop(0.1, 0.1, 1-0.2, 1-0.2)`）。
- 坐标统一归一化到 `0..1`。

## 2. 管道操作符 `|>`

`|>` 把左侧的 `ImageSet` 作为第一个参数传给右侧工具，返回值继续向后传递：

```dsl
result = $ |> grayscale() |> crop(0.1, 0.1, 0.8, 0.8) |> save("out/")
```

嵌套调用与管道等价：

```dsl
# 等价写法
a = save(crop(grayscale($), 0.1, 0.1, 0.8, 0.8), "out/")
```

双图工具支持**广播**（一张图对一组图），一次调用即可让 10 张图与同一背景合成。

## 3. 来源与加载

| 语法 | 说明 |
|------|------|
| `$` | 全部输入图片 |
| `$ : (cond)` | 过滤输入图片（`any(...)`、`img_scene(...) > 0.5`） |
| `load("input/beach.jpg")` | 从路径加载图片 |
| `[a, b, c]` | 列表字面量（用于拼接 / 批量） |
| `first` / `last` / `nth(2)` / `all` / `count` | 加载选择 |

## 4. 分割工具

分割工具由 [分割包](/openpaw/segmentation) **动态生成**：每个激活的包按其 `dsl.tool_name`
暴露一个工具，返回 `Mask`。

```dsl
sky = $ |> skyseg()               # 主名
sky = $ |> sky()                  # 别名
sky = $ |> sky_mask()             # 别名

mask = $ |> segment(pack="humanseg_v1")   # 通用调用
```

内置包 `skyseg_v1` 的别名是 `sky`、`sky_mask`。模型缺失时执行器返回清晰的
`model_not_found` 错误（含期望路径与下载提示）。

## 5. 蒙版工具

蒙版是单通道**浮点**（0~1），全程不二值化，因此羽化边缘得以保留；形状 / 渐变蒙版使用归一化坐标。

| 工具 | 说明 |
|------|------|
| `mask_rect(x, y, w, h)` | 矩形蒙版 |
| `mask_circle(cx, cy, r)` | 圆形蒙版 |
| `mask_ellipse(cx, cy, rx, ry)` | 椭圆蒙版 |
| `mask_polygon([[x,y], ...])` | 多边形蒙版 |
| `mask_triangle(...)` | 三角蒙版 |
| `mask_linear_gradient(angle, ...)` | 线性渐变蒙版 |
| `mask_radial_gradient(cx, cy, r)` | 径向渐变蒙版 |
| `mask_cone(...)` | 锥形渐变蒙版 |
| `mask_union(a, b)` / `mask_intersect(a, b)` / `mask_subtract(a, b)` | 并 / 交 / 差 |
| `mask_invert(m)` | 反相 |
| `feather(m, radius, gradient="smooth")` | 羽化 |

`feather` 的 `gradient` 支持 `linear`、`smooth`、`ease_in`、`ease_out`。

```dsl
m = mask_rect(0.1, 0.1, 0.5, 0.5)
m = feather(m, 20, gradient="ease_out")
m2 = mask_intersect(m, mask_circle(0.5, 0.5, 0.3))
```

## 6. 图像工具

工具按类别分组，完整签名见 [工具清单](/openpaw/tools)。

- **几何变换**：`crop`、`resize`、`rotate`、`flip`、`trim`、`perspective`
- **颜色调整**：`adjust`、`grayscale`、`sepia`、`invert`、`temperature`、`color_balance`、`auto_white_balance`、`curves`、`levels`、`gradient_map`、`split_toning`、`selective_color`、`apply_lut`
- **滤镜效果**：`blur`、`sharpen`、`denoise`、`vignette`、`glow`、`oil_paint`、`sketch`、`edge_detect`
- **艺术效果**：`posterize`、`threshold`、`mosaic`、`pixelate`、`halftone`、`motion_blur`、`radial_blur`、`chromatic_aberration`、`glitch`、`film_grain`、`old_photo`、`watercolor`、`cartoon`
- **变换**：`warp`、`skew`、`stretch`、`distort`、`perspective_correct`

```dsl
result = $ |> adjust(saturation=1.6, contrast=1.12) |> vignette(0.4)
result = $ |> film_grain(0.25) |> old_photo()
result = $ |> cartoon(0.7)
```

## 7. 合成工具

| 工具 | 说明 |
|------|------|
| `compose` | 带缩放 / 旋转的粘贴 |
| `paste(bg, fg, mask, x, y, scale=...)` | 蒙版抠图合成 |
| `overlay` / `overlay_at` | 叠加 |
| `blend(a, b, mode=...)` | 16 种 Photoshop 混合模式 |
| `merge` / `apply_mask(img, mask, tool)` | 把工具结果限制在蒙版内应用 |
| `watermark` / `watermark_image` | 水印 |
| `stitch_h` / `stitch_v` / `stitch_grid` / `stitch` | 拼接 |
| `collage(template="2x2")` | 拼贴 |
| `panorama` | 重叠检测 + 缝隙融合 |

`blend` 的 16 种模式：`normal`、`multiply`、`screen`、`overlay`、`darken`、`lighten`、
`color_dodge`、`color_burn`、`soft_light`、`hard_light`、`difference`、`exclusion`、
`hue`、`saturation`、`color`、`luminosity`。

尺寸不一致时按最大单元对齐并用 `bg_color` 填充空白；`gap` 控制间距。

## 8. 保存语法 `save()` {#save-语义}

```dsl
save(result, "output/dir/")                      # 目录：批量保存，文件名自动继承
save(result, "out.jpg")                          # 文件：保存单张
save(result, "output/", format="jpg", quality=95)
```

| 参数 | 说明 |
|------|------|
| `path` | 目录（以 `/` 结尾）或文件路径 |
| `format` | 输出格式（`jpg` / `png` / `webp` …） |
| `quality` | 有损格式质量（1~100） |

## 9. 多图操作示例

加载外部图片并组合：

```dsl
bg = load("input/beach.jpg")
fg = load("input/person.jpg")
mask = fg |> humanseg()
mask = feather(mask, 10, gradient="smooth")
result = paste(bg, fg, mask, x=0.4, y=0.6, scale=0.5)
save(result, "output/composite/", format="jpg")
```

横向拼接：

```dsl
a = load("docs/images/before.jpg")
b = load("docs/images/before_b.jpg")
result = stitch_h([a, b], gap=10, bg_color="#ffffff")
save(result, "after_stitch.jpg", format="jpg", quality=92)
```

## 10. 完整示例：把天空调蓝

```dsl
src = $ : (img_scene("sky") > 0.5)
sky = src |> skyseg()
sky = feather(sky, 15, gradient="smooth")
result = src |> apply_mask(sky, adjust(hue=15, saturation=40))
save(result, "output/blue_sky/", format="jpg", quality=95)
```

## 11. 说明

- 工具具备确定性 / 幂等性：同一张图片多次处理结果一致。
- 工具签名由工具注册表自动生成并注入 LLM 提示词，因此文档与实现保持一致。
- 所有位置坐标使用归一化值（0~1）。
