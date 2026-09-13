---
description: OpenPaw 完整工具清单（约 170 个）：几何、变换、颜色、滤镜、艺术、预设、合成、拼接、布局、加载选择、格式、蒙版、分割、通道、实用与 AI 工具的签名、默认值与说明。
---

# 工具清单

OpenPaw 的静态注册工具约 **170 个**（README 中“35+”为早期数字），另有按激活分割包动态生成的工具。
工具签名由 `ToolRegistry` 自动生成并注入 LLM 提示词，因此与实现始终一致。

- 参数支持位置与关键字（`key=value`）；
- 坐标为归一化 `0..1`；
- 管道输入自动绑定到首个 `images` 参数；
- 括号内为默认值，`req` 表示必填。

## 几何变换

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `crop` | `x,y,w,h` | 归一化矩形裁剪 |
| `resize` | `w,h` | 缩放到精确像素 |
| `rotate` | `angle` | 顺时针旋转（度） |
| `flip` | `mode`(h) | `h`/`v`/`both` |
| `trim` | — | 自动裁掉均匀边框 |
| `perspective` | `points` | 四边形校正到整幅（8 个坐标 TL,TR,BR,BL） |
| `straighten` | `angle` | 旋转校正水平 |
| `lens_correct` | `k1`(0),`k2`(0) | 径向畸变校正 |
| `pinch` | `cx`(0.5),`cy`(0.5),`strength`(0.5) | 向一点收缩 |
| `bulge` | `cx`(0.5),`cy`(0.5),`strength`(0.5) | 鱼眼鼓胀 |
| `twirl` | `cx`(0.5),`cy`(0.5),`angle`(180) | 漩涡扭曲 |

## 变换

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `warp` | `points_src,points_dst` | 四点透视变形 |
| `skew` | `x_angle`(0),`y_angle`(0) | 错切 |
| `stretch` | `x_factor,y_factor` | 非等比缩放 |
| `distort` | `strength` | 波形 / 类鱼眼扭曲 |
| `perspective_correct` | `corners` | 四边形校正 |

## 颜色调整

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `adjust` | `brightness`(1.0),`contrast`(1.0),`saturation`(1.0),`hue`(0) | 基础调整 |
| `grayscale` | — | 灰度 |
| `sepia` | — | 棕褐色 |
| `invert` | — | 反相 |
| `temperature` | `k` | 色温（正暖负冷） |
| `color_balance` | `r`(1),`g`(1),`b`(1) | 逐通道增益 |
| `auto_white_balance` | — | 灰世界白平衡 |
| `curves` | `channel`(rgb),`points` | 控制点曲线 |
| `levels` | `black`(0),`white`(1),`gamma`(1) | 色阶 |
| `gradient_map` | `colors` | 亮度映射到渐变 |
| `split_toning` | `shadow_color,highlight_color,balance`(0.5),`strength`(0.5) | 分离色调 |
| `selective_color` | `color`(red),`c`,`m`,`y`,`k` | 可选颜色 |
| `apply_lut` | `lut_path` | 应用 `.cube` 3D LUT |
| `channel_mixer` | `r`(1),`g`(1),`b`(1) | 通道混合 |
| `desaturate` | `amount`(1.0) | 部分去饱和 |
| `auto_contrast` | `clip`(0.005) | 自动对比 |
| `auto_tone` | — | 自动对比 + 轻微饱和 |
| `equalize_histogram` | — | 直方图均衡 |
| `color_reduce` | `colors` | 颜色量化（2~256） |
| `quantize_colors` | `n` | 颜色量化（别名） |

## 滤镜效果

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `blur` | `radius` | 高斯模糊 |
| `sharpen` | `amount` | USM 锐化 |
| `denoise` | `strength` | 保边降噪 |
| `vignette` | `strength` | 暗角 |
| `glow` | `radius`(8),`intensity`(0.5) | 柔光泛光 |
| `oil_paint` | `radius`(2),`levels`(20) | 油画 |
| `sketch` | — | 铅笔素描 |
| `edge_detect` | — | Sobel 边缘 |
| `zoom_blur` | `cx,cy,strength`(0.3) | 径向模糊 |
| `lens_blur` | `radius` | 盒式模糊 |
| `bokeh` | `radius`(10),`threshold`(0.7) | 亮部散景 |
| `smart_sharpen` | `amount`(1),`radius`(1.5) | 带半径 USM |
| `high_pass` | `radius`(3) | 高通 |
| `add_noise` | `type`(gaussian),`amount` | `gaussian`/`uniform`/`salt_pepper` |
| `dust_scratches` | `intensity`(0.3) | 灰尘划痕 |
| `scan_lines` | `intensity`(0.5) | CRT 扫描线 |
| `dither` | `mode`(floyd_steinberg) | 黑白抖动 |
| `gradient_overlay` | `colors,opacity`(0.5),`angle`(0) | 渐变叠加 |
| `light_leak` | `intensity`(0.5),`color` | 漏光 |
| `lens_flare` | `x`(0.8),`y`(0.2),`intensity`(0.6) | 镜头光晕 |
| `sun_flare` | `x`(0.5),`y`(0.3),`size`(0.3) | 太阳光晕 |
| `bloom` | `threshold`(0.7),`intensity`(0.6) | 泛光 |
| `color_grade` | `shadows,midtones,highlights` | 电影调色 |

## 艺术效果

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `posterize` | `levels` | 色调分离 |
| `threshold` | `value` | 按亮度二值化 |
| `mosaic` | `size`(8) | 马赛克 |
| `pixelate` | `size`(12) | 像素化 |
| `halftone` | `size`(8) | 半调网点 |
| `motion_blur` | `angle`(0),`distance` | 定向模糊 |
| `radial_blur` | `strength` | 放射模糊 |
| `chromatic_aberration` | `offset`(4) | 色差 |
| `glitch` | `intensity` | 故障艺术 |
| `film_grain` | `intensity` | 胶片颗粒 |
| `old_photo` | — | 老照片（sepia + 暗角 + 颗粒） |
| `watercolor` | `intensity` | 水彩 |
| `cartoon` | `intensity` | 卡通 / 赛璐璐 |

## 预设滤镜（无参数）

`filter_vintage`、`filter_cinematic`、`filter_noir`、`filter_fade`、
`filter_cross_process`、`filter_lomo`、`filter_cyanotype`、`filter_platinum`、
`filter_bleach_bypass`、`filter_infrared`。

## 合成叠加

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `compose` | `bg,fg,x,y,scale`(1.0),`rotation`(0) | 前景粘贴到背景 |
| `paste` | `bg,fg,mask,x,y,scale`(1.0),`rotation`(0),`feather`(0) | 蒙版抠图合成 |
| `overlay` | `bg,fg,opacity`(0.5) | normal 叠加 |
| `overlay_at` | `image,x,y,opacity`(1.0) | 指定位置叠加 |
| `blend` | `img1,img2,mode`(normal),`opacity`(1.0) | 16 种混合模式 |
| `apply_mask` | `images,masks,operation` | 仅在蒙版白色区域应用操作 |
| `merge` | `images,layout`(horizontal) | 合并为一张 |
| `watermark` | `text,position`(bottomright),`opacity`(0.6),`font_size`(24),`color` | 文字水印 |
| `multiply` / `screen` / `overlay_blend` / `soft_light` / `hard_light` / `color_dodge` / `color_burn` / `difference` / `exclusion` | `img1,img2` | `blend` 的快捷方式 |
| `luminosity_mask` | — | 生成亮度蒙版（白=亮） |

`blend` 的 16 种模式：`normal, multiply, screen, overlay, darken, lighten,
color_dodge, color_burn, soft_light, hard_light, difference, exclusion,
hue, saturation, color, luminosity`。

## 拼接

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `stitch_h` | `images,gap`(0),`bg_color`(#FFFFFF) | 水平拼接 |
| `stitch_v` | 同上 | 垂直拼接 |
| `stitch_grid` | `images,cols,rows,gap,bg_color` | 网格拼接（0=自动） |
| `stitch` | `images,layout`(h),`gap,bg_color` | 通用拼接 |
| `collage` | `images,template`(2x2),`gap`(4),`bg_color` | 模板拼贴 |
| `panorama` | `images` | 重叠检测 + 缝隙融合 |
| `stack_focus` | `images` | 焦点堆栈（取最清晰） |
| `hdr_merge` | `images` | 曝光融合 HDR |

## 布局装饰

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `add_border` | `width,color`(#000000),`style`(solid) | 边框 |
| `add_padding` | `padding`(10),`bg_color`(#FFFFFF) | 内边距 |
| `rounded_corners` | `radius`(16) | 圆角 |
| `add_shadow` | `offset_x`(8),`offset_y`(8),`blur`(10),`opacity`(0.5) | 投影 |
| `add_text` | `text,x,y,size`(24),`color,font`(Arial),`bold`(false) | 文字 |
| `add_shape` | `shape`(rect),`x,y,w,h,color,thickness`(2),`filled`(false) | 形状 |
| `add_frame` | `frame_path` | 装饰边框图 |
| `watermark_image` | `logo,position,opacity`(0.7),`scale`(0.2) | 图片水印 |
| `add_gradient_border` | `colors,width` | 渐变边框 |
| `polaroid_frame` | `margin`(24),`color`(#ffffff) | 宝丽来白框 |
| `film_strip_frame` | `color`(#111111) | 胶片条框 |
| `contact_sheet` | `images,cols,rows,cell`(200),`bg_color` | 缩略图网格 |

## 加载与选择

| 工具 | 参数 | 说明 |
|------|------|------|
| `load` | `path` | 从磁盘加载 |
| `all` / `first` / `last` | `images` | 全部 / 首 / 末 |
| `nth` | `images,n` | 第 n 张（0 基） |
| `count` | `images` | 返回数量 |
| `print` | `value,label`("") | 打印并透传（调试） |

## 格式与元数据

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `convert` | `format`(jpg),`quality`(95) | 设置后续 `save()` 的格式 / 质量 |
| `strip_exif` | — | 移除 EXIF |
| `set_exif` | `key,value` | 写入元数据 |
| `save` | `path,format`(auto),`quality`(0) | 落盘（见 [save 语义](/openpaw/dsl-reference#save-语义)） |

## 蒙版 {#蒙版}

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `mask_rect` | `x,y,w,h,feather`(0),`gradient`(linear) | 矩形 |
| `mask_circle` | `cx,cy,r,feather,gradient` | 圆形 |
| `mask_ellipse` | `cx,cy,rx,ry,feather,gradient` | 椭圆 |
| `mask_polygon` | `points,feather,gradient` | 多边形 |
| `mask_triangle` | `points,feather,gradient` | 三角形 |
| `mask_linear_gradient` | `x1,y1,x2,y2` | 线性渐变 |
| `mask_radial_gradient` | `cx,cy,r_inner,r_outer` | 径向渐变 |
| `mask_cone` | `cx,cy,angle,spread,feather` | 锥形 |
| `mask_union` / `mask_intersect` / `mask_subtract` | `m1,m2` | 并 / 交 / 差 |
| `mask_invert` | `m` | 反相 |
| `feather` | `images,radius`(15),`gradient`(smooth) | 羽化 |

详见 [蒙版系统](/openpaw/masks)。

## 分割

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `segment` | `pack,threshold`(0.5),`feather`(15),`gradient`(smooth) | 指定包分割 |
| `skyseg`（别名 `sky`、`sky_mask`） | `threshold,feather,gradient` | 内置天空分割 |
| `humanseg`（别名 `personseg`、`people`） | `threshold,feather,gradient` | 人像分割 |

动态工具随 `models/segmentation/registry.json` 的激活包自动增减，见 [分割模型包](/openpaw/segmentation)。

## 通道

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `split_channels` | — | 拆成 R/G/B 三张灰度 |
| `merge_channels` | `r,g,b` | 合并为 RGB |
| `swap_channels` | `a`(r),`b`(b) | 交换通道 |
| `extract_channel` | `name`(r) | 提取单通道 |
| `alpha_to_mask` | — | 用 alpha 生成蒙版 |

## 实用工具

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `histogram` | `images` | 记录均值 / 直方图 |
| `compare` | `img1,img2` | 差值图 |
| `side_by_side` | `img1,img2` | 并排 |
| `before_after` | `img1,img2,split`(0.5) | 前后分割图 |
| `make_thumbnail` | `size` | 最长边缩放 |
| `make_contact_sheet` | `images,cols,rows,cell`(160) | 缩略图网格 |
| `add_metadata` / `strip_metadata` | `key,value` / — | 附加 / 清空元数据 |
| `rename` | `pattern`(image_{i}) | 重命名输出（`{i}`/`{name}`） |

## AI 增强

> 当前 `AiTools` 走**确定性经典算法回退**；ONNX 推理目前仅用于分割包。

| 工具 | 参数（默认） | 说明 |
|------|--------------|------|
| `upscale` | `factor`(2) | 超分放大（`2`/`3`/`4`） |
| `remove_bg` | `tolerance`(0.25) | 抠背景（输出 PNG） |
| `enhance_face` | — | 人脸 / 肤色增强 |
| `colorize` | — | 灰度上色（近似） |
| `style_transfer` | `style`(punch) | 调色预设（`punch`/`warm`/`cool`/`vintage`/`mono`） |
| `inpaint` | `mask` | 蒙版区域模糊填充 |
| `outpaint` | `direction`(right),`amount`(0.25) | 镜像扩展画布 |
| `denoise_ai` | `strength` | 保边降噪 |

## 组合示例

```dsl
# 批量人像：裁剪 + 调亮 + 调色 + 保存
src = $ : (any(class == "person"))
result = src
    |> crop(0.1, 0.1, 0.8, 0.8)
    |> adjust(brightness=1.2, contrast=1.1)
    |> film_grain(0.15)
    |> save("output/portraits/", format="jpg", quality=95)
```

## 延伸阅读

- [DSL 语法参考](/openpaw/dsl-reference) · [蒙版系统](/openpaw/masks)
- [分割模型包](/openpaw/segmentation) · [案例展示](/showcase/)
