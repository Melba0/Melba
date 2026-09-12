---
description: Tio 与 OpenPaw 效果图库：OpenPaw 处理前后的完整对比图，以及界面截图。
---

# 效果图库

## 处理前后对比

以下图片均由 OpenPaw CLI 无界面执行（`openpaw_cli --file <script.dsl>`）生成，
脚本见案例页与项目 `examples/` 目录。

### 复古胶片

| 原图 | 结果 |
|:----:|:----:|
| ![原图](/before.jpg) | ![复古](/after_vintage.jpg) |

```dsl
img = load("docs/images/before.jpg")
result = img |> film_grain(0.25) |> old_photo()
save(result, "after_vintage.jpg", format="jpg", quality=92)
```

### 电影级调色

| 原图 | 结果 |
|:----:|:----:|
| ![原图](/before.jpg) | ![调色](/after_grade.jpg) |

```dsl
img = load("docs/images/before.jpg")
result = img
    |> adjust(saturation=1.6, contrast=1.12)
    |> split_toning(shadow_color="#0b1e3a", highlight_color="#ffd9a0", strength=0.55, balance=0.5)
    |> vignette(0.4)
save(result, "after_grade.jpg", format="jpg", quality=92)
```

### 卡通渲染

| 原图 | 结果 |
|:----:|:----:|
| ![原图](/before.jpg) | ![卡通](/after_cartoon.jpg) |

```dsl
img = load("docs/images/before.jpg")
result = img |> cartoon(0.7)
save(result, "after_cartoon.jpg", format="jpg", quality=92)
```

### 照片拼接

| 图 A | 图 B | 结果 |
|:----:|:----:|:----:|
| ![图A](/before.jpg) | ![图B](/before_b.jpg) | ![拼接](/after_stitch.jpg) |

```dsl
a = load("docs/images/before.jpg")
b = load("docs/images/before_b.jpg")
result = stitch_h([a, b], gap=10, bg_color="#ffffff")
save(result, "after_stitch.jpg", format="jpg", quality=92)
```

## 界面截图

### Tio — 图像检索

![Tio 主界面](/screenshots/tio/main-window.png)

![Tio 结果网格](/screenshots/tio/results-grid.png)

### OpenPaw — 图像处理

![OpenPaw 总览](/screenshots/openpaw/overview.png)

![OpenPaw 处理前后对比](/screenshots/openpaw/compare.png)
