---
description: OpenPaw 完整工具清单：几何变换、颜色调整、滤镜、艺术效果、变换、合成叠加、拼接、加载选择、布局装饰、格式元数据、蒙版、分割与 AI 增强工具签名与示例。
---

# 工具清单

OpenPaw 提供 **35+ 图片处理工具**，覆盖几何、颜色、滤镜、合成、格式与 AI 增强。
所有工具都可经 `|>` 管道调用，参数支持位置参数与关键字参数。坐标统一归一化到 `0..1`。

> 工具签名由工具注册表自动生成并注入 LLM 提示词，因此始终与实现保持一致。

## 几何变换

| 工具 | 签名 | 说明 |
|------|------|------|
| `crop` | `crop(x, y, w, h)` | 裁剪归一化矩形区域 |
| `resize` | `resize(width, height)` | 缩放到指定尺寸 |
| `rotate` | `rotate(angle, expand=true)` | 旋转（度） |
| `flip` | `flip(horizontal=true, vertical=false)` | 水平 / 垂直翻转 |
| `trim` | `trim(tolerance=0.1)` | 自动裁掉边缘纯色 |
| `perspective` | `perspective(tl, tr, br, bl)` | 透视变换 |

```dsl
result = $ |> crop(0.1, 0.1, 0.8, 0.8) |> resize(1080, 1080)
result = $ |> rotate(90) |> flip(horizontal=true)
```

## 颜色调整

| 工具 | 签名 | 说明 |
|------|------|------|
| `adjust` | `adjust(brightness=1.0, contrast=1.0, saturation=1.0, hue=0, exposure=0, temperature=0)` | 基础调整 |
| `grayscale` | `grayscale()` | 灰度 |
| `sepia` | `sepia(strength=1.0)` | 棕褐色 |
| `invert` | `invert()` | 反色 |
| `temperature` | `temperature(kelvin=6500)` | 色温 |
| `color_balance` | `color_balance(cyan_red=0, magenta_green=0, yellow_blue=0)` | 色彩平衡 |
| `auto_white_balance` | `auto_white_balance()` | 自动白平衡 |
| `curves` | `curves(points=...)` | 曲线调整 |
| `levels` | `levels(black=0, white=255, gamma=1.0)` | 色阶 |
| `gradient_map` | `gradient_map(colors=["#000000", "#ffffff"])` | 渐变映射 |
| `split_toning` | `split_toning(shadow_color, highlight_color, strength=0.5, balance=0.5)` | 分离色调 |
| `selective_color` | `selective_color(color="red", cyan=0, magenta=0, yellow=0, black=0)` | 可选颜色 |
| `apply_lut` | `apply_lut(path)` | 应用 LUT |

```dsl
result = $ |> adjust(saturation=1.6, contrast=1.12) |> auto_white_balance()
result = $ |> split_toning(shadow_color="#0b1e3a", highlight_color="#ffd9a0", strength=0.55)
```

## 滤镜效果

| 工具 | 签名 | 说明 |
|------|------|------|
| `blur` | `blur(radius=1.0)` | 高斯模糊 |
| `sharpen` | `sharpen(amount=1.0)` | 锐化 |
| `denoise` | `denoise(strength=1.0)` | 降噪 |
| `vignette` | `vignette(strength=0.4)` | 暗角 |
| `glow` | `glow(radius=10, strength=0.5)` | 柔光 |
| `oil_paint` | `oil_paint(radius=4, levels=20)` | 油画 |
| `sketch` | `sketch(strength=1.0)` | 素描 |
| `edge_detect` | `edge_detect(threshold=0.1)` | 边缘检测 |

```dsl
result = $ |> sharpen(1.5) |> vignette(0.4)
result = $ |> glow(radius=12, strength=0.6)
```

## 艺术效果

| 工具 | 签名 | 说明 |
|------|------|------|
| `posterize` | `posterize(levels=6)` | 色调分离 |
| `threshold` | `threshold(value=0.5)` | 二值化 |
| `mosaic` | `mosaic(size=8)` | 马赛克 |
| `pixelate` | `pixelate(size=8)` | 像素化 |
| `halftone` | `halftone(size=4)` | 半调网点 |
| `motion_blur` | `motion_blur(angle=0, distance=10)` | 动感模糊 |
| `radial_blur` | `radial_blur(amount=10)` | 径向模糊 |
| `chromatic_aberration` | `chromatic_aberration(amount=2)` | 色差 |
| `glitch` | `glitch(intensity=0.5)` | 故障风 |
| `film_grain` | `film_grain(strength=0.25)` | 胶片颗粒 |
| `old_photo` | `old_photo(strength=1.0)` | 老照片 |
| `watercolor` | `watercolor(strength=1.0)` | 水彩 |
| `cartoon` | `cartoon(strength=0.7)` | 卡通 / 赛璐璐 |

```dsl
result = $ |> film_grain(0.25) |> old_photo()
result = $ |> cartoon(0.7)
result = $ |> glitch(intensity=0.6)
```

## 变换

| 工具 | 签名 | 说明 |
|------|------|------|
| `warp` | `warp(amount=0.1)` | 扭曲 |
| `skew` | `skew(x=0, y=0)` | 倾斜 |
| `stretch` | `stretch(x=1.0, y=1.0)` | 拉伸 |
| `distort` | `distort(amount=0.2)` | 变形 |
| `perspective_correct` | `perspective_correct()` | 透视校正 |

## 合成叠加

| 工具 | 签名 | 说明 |
|------|------|------|
| `compose` | `compose(base, layer, x, y, scale=1.0, rotation=0)` | 带缩放 / 旋转的粘贴 |
| `paste` | `paste(bg, fg, mask, x, y, scale=1.0)` | 蒙版抠图合成 |
| `overlay` | `overlay(base, top)` | 叠加 |
| `overlay_at` | `overlay_at(base, top, x, y)` | 指定位置叠加 |
| `blend` | `blend(a, b, mode="normal", opacity=1.0)` | 混合（16 种模式） |
| `merge` | `merge(a, b)` | 合并 |
| `apply_mask` | `apply_mask(img, mask, tool)` | 把工具结果限制在蒙版内应用 |
| `watermark` | `watermark(text, position="br", opacity=0.5)` | 文字水印 |
| `watermark_image` | `watermark_image(logo, position="br", scale=0.2)` | 图片水印 |

`blend` 模式：`normal`、`multiply`、`screen`、`overlay`、`darken`、`lighten`、
`color_dodge`、`color_burn`、`soft_light`、`hard_light`、`difference`、`exclusion`、
`hue`、`saturation`、`color`、`luminosity`。

```dsl
result = apply_mask($, sky_mask, adjust(hue=15, saturation=40))
result = blend(a, b, mode="soft_light", opacity=0.8)
```

## 拼接

| 工具 | 签名 | 说明 |
|------|------|------|
| `stitch_h` | `stitch_h([a, b, ...], gap=0, bg_color="#ffffff")` | 横向拼接 |
| `stitch_v` | `stitch_v([a, b, ...], gap=0, bg_color="#ffffff")` | 纵向拼接 |
| `stitch_grid` | `stitch_grid([...], cols=2, gap=0, bg_color="#ffffff")` | 网格拼接 |
| `stitch` | `stitch([...], direction="h", gap=0)` | 通用拼接 |
| `collage` | `collage([...], template="2x2", gap=0)` | 拼贴 |
| `panorama` | `panorama([a, b, ...])` | 重叠检测 + 缝隙融合 |

```dsl
a = load("docs/images/before.jpg")
b = load("docs/images/before_b.jpg")
result = stitch_h([a, b], gap=10, bg_color="#ffffff")
```

## 加载选择

| 工具 | 签名 | 说明 |
|------|------|------|
| `load` | `load(path)` | 加载图片 |
| `first` | `first(set)` | 第一张 |
| `last` | `last(set)` | 最后一张 |
| `nth` | `nth(set, index)` | 第 n 张 |
| `all` | `all(set)` | 全部 |
| `count` | `count(set)` | 数量 |

## 布局装饰

| 工具 | 签名 | 说明 |
|------|------|------|
| `add_border` | `add_border(width=10, color="#ffffff")` | 边框 |
| `add_padding` | `add_padding(width=20, color="#ffffff")` | 内边距 |
| `rounded_corners` | `rounded_corners(radius=20)` | 圆角 |
| `add_shadow` | `add_shadow(radius=10, opacity=0.4)` | 阴影 |
| `add_text` | `add_text(text, x, y, size=24, color="#ffffff")` | 文字 |
| `add_shape` | `add_shape(kind="rect", ...)` | 形状 |
| `add_frame` | `add_frame(style="polaroid")` | 相框 |

## 格式元数据

| 工具 | 签名 | 说明 |
|------|------|------|
| `convert` | `convert(format="webp")` | 格式转换 |
| `strip_exif` | `strip_exif()` | 清除 EXIF |
| `set_exif` | `set_exif(key, value)` | 写入 EXIF |
| `save` | `save(path, format="jpg", quality=95)` | 保存 |

## 蒙版

| 工具 | 签名 | 说明 |
|------|------|------|
| `mask_rect` | `mask_rect(x, y, w, h)` | 矩形 |
| `mask_circle` | `mask_circle(cx, cy, r)` | 圆形 |
| `mask_ellipse` | `mask_ellipse(cx, cy, rx, ry)` | 椭圆 |
| `mask_polygon` | `mask_polygon(points)` | 多边形 |
| `mask_triangle` | `mask_triangle(p1, p2, p3)` | 三角形 |
| `mask_linear_gradient` | `mask_linear_gradient(angle, start=0, end=1)` | 线性渐变 |
| `mask_radial_gradient` | `mask_radial_gradient(cx, cy, r)` | 径向渐变 |
| `mask_cone` | `mask_cone(cx, cy, angle, spread)` | 锥形渐变 |
| `mask_union` | `mask_union(a, b)` | 并集 |
| `mask_intersect` | `mask_intersect(a, b)` | 交集 |
| `mask_subtract` | `mask_subtract(a, b)` | 差集 |
| `mask_invert` | `mask_invert(m)` | 反相 |
| `feather` | `feather(m, radius, gradient="smooth")` | 羽化 |

`feather` 的 `gradient` 支持 `linear`、`smooth`、`ease_in`、`ease_out`。

## 分割

分割工具按 [分割包](/openpaw/segmentation) 动态生成：

| 工具 | 签名 | 说明 |
|------|------|------|
| `skyseg` | `skyseg()` | 天空分割（别名 `sky`、`sky_mask`） |
| `humanseg` | `humanseg()` | 人像分割（扩展示例包） |
| `segment` | `segment(pack="name")` | 通用分割调用 |

## AI 增强

| 工具 | 签名 | 说明 |
|------|------|------|
| `upscale` | `upscale(factor=2)` | 超分辨率 |
| `remove_bg` | `remove_bg()` | 去背景 |
| `enhance_face` | `enhance_face(strength=1.0)` | 人脸增强 |
| `colorize` | `colorize()` | 上色 |
| `style_transfer` | `style_transfer(style, strength=1.0)` | 风格迁移 |
| `inpaint` | `inpaint(mask, prompt="")` | 修复 |
| `outpaint` | `outpaint(amount=0.2)` | 扩图 |
| `denoise_ai` | `denoise_ai(strength=1.0)` | AI 降噪 |

> AI 工具开箱即用（内置确定性的经典算法回退）；如需 ONNX 模型，用
> `-DONNXRUNTIME_ROOT=<sdk>` 配置并把模型放入 `models/`。

## 组合示例

```dsl
# 批量人像：裁剪 + 调亮 + 锐化 + 保存
src = $ : (any(class == "person"))
result = src
    |> crop(0.1, 0.1, 0.8, 0.8)
    |> adjust(brightness=1.2, contrast=1.1)
    |> sharpen(1.5)
    |> save("output/portraits/")
```
