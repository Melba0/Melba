---
description: Tio 常见问题：首次构建慢、切换模型后结果没变、扩展包 not active、标签筛选不生效、中文类别名匹配等。
---

# 常见问题

## 切换模型后查询结果没变？

请确认 `models/registry.json` 的 `active_base` 已修改并重启程序（或在 REPL 中执行 `/reload`）。
缓存按模型名隔离，切换后会在下一次查询时重建。

## `>> xxx` 报错 "not active in registry"？

该扩展包未出现在 `registry.json` 的 `active_extensions` 中。请检查拼写，或把它加入数组后
执行 `/reload`。

## 标签筛选似乎没生效？

- 确认图片存在对应的 `user_tags`（在 GUI 详情面板编辑并已写回 `cache_index.json`）。
- `--tag-filter "key="`（无值）表示"key 任意值"，`key=val` 为精确匹配。
- 匹配 0 张会得到**空结果**，而不是回退到全库。

## 首次构建很慢？

CPU 推理的正常现象。缓存生成后再次运行极快；减少 `photo/` 中的图片数可缩短首建时间。
若已有别处生成的缓存，可直接复用 `cache/<model>/cache_index.json`。

## 中文类别名无法匹配？

- 脚本文件请保存为 **UTF-8（无 BOM）**。
- Windows 控制台请切换到 UTF-8：`chcp 65001`（程序启动时也会自动设置）。
- 字符串字面量 `"猫"` 与裸标识符 `猫` 在类别名语境中等价。

## 找不到 `model.onnx` / 引擎只加载 `.onnx`？

Tio 引擎不直接加载 `.pt`。请用 `export_yolov8.py` 或官方 `yolo export` 转换：

```powershell
python export_yolov8.py yolov8m.pt models/base/yolov8m/model.onnx
```

并确保同目录存在 `meta.json` 与 `classes.json`。

## `%`、`^` 分别返回什么？

- `%` 把 `ImageSet` 转成 `ObjectSet`（提取检测框）。
- `^` 把 `ObjectSet` 转回 `ImageSet`（去重后的图片来源图）。

```dsl
people_objs = % $ : (any(class == "person"))
people_imgs = ^ people_objs
```

## 删除了图片还能恢复吗？

不能。`del` 与 GUI 删除都会直接删除磁盘文件并更新缓存索引，操作不可逆。

## 支持 Linux / macOS 吗？

引擎基于 ONNX Runtime，理论跨平台；当前构建脚本与 GUI 以 Windows 为主。
社区 PR 欢迎补齐其他平台。
