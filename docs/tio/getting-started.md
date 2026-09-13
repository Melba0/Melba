---
description: 从零编译 Tio 引擎（dsl.exe）与 Qt 6 GUI（tio.exe），准备 YOLOv8m-OIV7 基座、Places365 场景与扩展模型，建立缓存并执行第一个 DSL 查询。
---

# 快速开始

本页带你从零把 Tio 跑起来：准备依赖 → 编译引擎与 GUI → 准备模型 → 建立缓存 → 第一个查询。

## 1. 环境要求

| 依赖 | 说明 |
|------|------|
| C++17 编译器 | MSVC 19.5x+（Visual Studio 2022 工具链） |
| CMake ≥ 3.18 | 配合 Ninja 或 VS 生成器 |
| [ONNX Runtime](https://github.com/microsoft/onnxruntime/releases) | CPU 版 `onnxruntime-win-x64-<ver>.zip`（实测 1.29.0） |
| nlohmann/json | 头文件库，用 `-DNLOHMANN_INCLUDE_DIR` 指定 |
| GDI+ / WindowsCodecs | Windows 系统库，图片解码 |
| Qt 6 | 6.10.1 MinGW（Widgets / Network / Concurrent / PrintSupport） |
| Python 3.10+（可选） | 仅模型导出 `.pt → .onnx` |

## 2. 编译引擎（Engine）

在 **vcvars64 开发者命令行**中执行：

```powershell
cd dsl
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release `
      -DONNXRUNTIME_ROOT="D:/path/to/onnxruntime-win-x64-1.29.0" `
      -DNLOHMANN_INCLUDE_DIR="D:/path/to/nlohmann-json-include"
cmake --build build
# POST_BUILD 自动复制 onnxruntime.dll / onnxruntime_providers_shared.dll 到 build/
```

产物：`dsl/build/dsl.exe`。

## 3. 编译 GUI（Qt 6）

```powershell
cmake -S gui -B gui/build -G Ninja -DCMAKE_PREFIX_PATH=D:/Qt/6.10.1/mingw_64
cmake --build gui/build
# POST_BUILD 自动复制 dsl.exe + onnxruntime*.dll，并运行 windeployqt
```

运行：双击 `gui/build/tio.exe`。

## 4. 准备模型

引擎只加载 `.onnx`。至少准备一个基座模型：

```
models/base/yolov8m-oiv7/
├── model.onnx
├── meta.json      # { "name": "yolov8m-oiv7", "type": "detector", "input_size": 640, "classes": 601 }
└── classes.json   # is-a 继承链
```

```powershell
yolo export model=yolov8m-oiv7.pt format=onnx opset=12 imgsz=640
```

可选：

- **场景**：`models/scene/places365_googlenet.onnx` + `categories_places365.txt` + `meta.json`；
- **扩展 / 聚类**：`models/extensions/<name>/config.json` + `model.onnx`。

`models/registry.json` 决定激活项：

```json
{ "active_base": "yolov8m-oiv7", "active_extensions": ["face_recognition_v1"] }
```

详见 [模型系统](/tio/models) 与 [模型导出](/tio/model-export)。

## 5. 首次运行与缓存

把图片放进 `photo/`，然后：

```powershell
build\dsl.exe
```

```
[Main] active base model: yolov8m-oiv7 (...model.onnx)
[Cache] Loaded 128 images from cache index.
[Cache] Cache is up to date (128 images).
```

- **首次运行**：全库 YOLO 推理（CPU 下约数分钟），写入 `cache/<model>/cache_index.json`；
- **再次运行**：按 `mtime`/`size` 增量更新，只重推理新增 / 修改图片。

## 6. 第一个查询

### REPL

```dsl
dsl> $ : (any(class == "person"))                       # 所有含人的图片
dsl> % $ : (any(class == "person"))                     # 提取 person 对象
dsl> $ : (cnt(fruit) > 2)                               # 水果（含子类）> 2
dsl> $ : (img_scene("sunset") > 0.5 && img_warmth() > 0.6)
```

### 命令行（JSON 模式）

```powershell
build\dsl.exe --list-models
build\dsl.exe --base yolov8m-oiv7
build\dsl.exe --json --photo .\photo --tag-filter "city=sh" < query.dsl
build\dsl.exe --warmup                       # 只预热缓存
```

### GUI

双击 `tio.exe`：输入自然语言 → `Translate to DSL` → `Search`。
启动后桌面端会后台预热缓存。详见 [桌面 GUI](/tio/gui)。

## 7. 下一步

- [DSL 语法参考](/tio/dsl-reference) · [内置宏参考](/tio/macros)
- [功能列表](/tio/features) · [模型系统](/tio/models)
- [系统架构](/tio/architecture) · [CLI 与 REPL](/tio/cli)
