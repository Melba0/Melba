---
description: Tio 常见问题：首次构建慢、切换模型后结果没变、扩展包 not active、标签筛选不生效、场景宏返回 0、聚类分组异常、中文类别名匹配等。
---

# 常见问题

## 首次构建很慢？

CPU 推理的正常现象。缓存生成后再次运行极快；减少 `photo/` 图片数可缩短首建时间。
也可先执行 `dsl.exe --warmup` 预热。

## 切换模型后查询结果没变？

确认 `models/registry.json` 的 `active_base` 已修改并重启，或在 REPL 执行 `/reload`。
缓存按模型名隔离，切换后会在下一次查询时重建。

## `>> xxx` 报错 "not active in registry"？

该扩展包未出现在 `registry.json` 的 `active_extensions`，或 `models/extensions/<name>/config.json`
缺失。检查后执行 `/reload`。

## 场景宏 `img_scene(...)` 总是返回 0？

`models/scene/places365_googlenet.onnx` 缺失或未正确放置。确认该目录存在、`categories_places365.txt`
为 365 行，然后重建缓存（删除 `cache/<model>/` 或 GUI 里 Reindex）。

## 聚类分组是空的？

- 确认 `face_recognition_v1` 在 `active_extensions` 中，且其 `config.json` 声明
  `capabilities.can_cluster = true`；
- 聚类需要重新推理以提取嵌入：删除缓存后重建，或等待增量更新；
- 分组按 `cluster_name` 生成（如 `face_cluster_person_001`）。

## 标签筛选似乎没生效？

- 确认图片存在对应的 `user_tags`（在 GUI 详情面板编辑并写回缓存）；
- `--tag-filter "key="`（无值）表示"key 任意值"，`key=val` 为精确匹配；
- 匹配 0 张会得到**空结果**，而不是回退全库。

## 中文类别名无法匹配？

- 脚本文件保存为 **UTF-8（无 BOM）**；
- Windows 控制台切换到 UTF-8：`chcp 65001`；
- 字符串 `"猫"` 与裸标识符 `猫` 在类别名语境中等价。

## `%`、`^` 分别返回什么？

- `%`：`ImageSet → ObjectSet`（提取检测框）；
- `^`：`ObjectSet → ImageSet`（去重后的来源图）。

```dsl
people_objs = % $ : (any(class == "person"))
people_imgs = ^ people_objs
```

## `any(cls)` 和 `cnt(cls)` 统计不一致？

`any` 只匹配 `class_name == cls` 或**直接** `super_class == cls`；
`cnt` 使用 `classes.json` 的**传递** is-a 链，能统计 `apple` 计入 `fruit` 这类子类。

## 删除了图片还能恢复吗？

不能。`del` 与 GUI 删除都会删除磁盘文件并更新缓存索引，不可逆。

## 支持 Linux / macOS 吗？

引擎基于 ONNX Runtime，理论跨平台；当前构建脚本与 GUI 以 Windows 为主。

## 引擎与 GUI 如何通信？

GUI 以 `QProcess` 运行 `dsl.exe --json`，DSL 走 stdin，JSON 走 stdout，日志走 stderr。
详见 [系统架构](/tio/architecture)。
