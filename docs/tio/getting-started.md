---
description: 从零编译 Tio 引擎（dsl.exe）与 Qt 6 GUI（tio.exe），下载模型，建立缓存并执行第一个 DSL 查询。
---

# 快速开始

本页带你从零把 Tio 跑起来：准备依赖 → 编译引擎与 GUI → 下载模型 → 建立缓存 → 执行第一个查询。

## 1. 环境要求

| 依赖 | 说明 |
|------|------|
| C++17 编译器 | MSVC 19.5x+（Visual Studio 2022） |
| CMake ≥ 3.18 | 配合 Ninja 或 VS 生成器 |
| [ONNX Runtime](https://github.com/microsoft/onnxruntime/releases) | CPU 版 `onnxruntime-win-x64-<ver>.zip` |
| nlohmann/json | 头文件库，用 `-DNLOHMANN_INCLUDE_DIR` 指定 |
| GDI+ / WindowsCodecs | Windows 系统库，用于图片解码 |
| Qt 6（GUI） | 6.10.x MinGW，配合 `windeployqt` 部署 |
| Python 3.10+（可选） | 仅用于模型导出 `.pt → .onnx` |

## 2. 编译引擎（Engine）

在 **vcvars64 开发者命令行**中执行：

```powershell
cd dsl
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release `
      -DONNXRUNTIME_ROOT="D:/path/to/onnxruntime-win-x64-1.29.0" `
      -DNLOHMANN_INCLUDE_DIR="D:/path/to/your-nlohmann-json-include"
cmake --build build
# onnxruntime.dll 由 POST_BUILD 自动复制到 build/ 下
```

产物：`dsl/build/dsl.exe`。

## 3. 编译 GUI（Qt 6）

```powershell
cmake -S gui -B gui/build -G Ninja -DCMAKE_PREFIX_PATH=D:/Qt/6.10.1/mingw_64
cmake --build gui/build
# POST_BUILD 自动复制 dsl.exe + onnxruntime.dll，并运行 windeployqt 部署 Qt 运行时
```

运行：双击 `gui/build/tio.exe`。

## 4. 准备模型

引擎只加载 `.onnx`。用一个 YOLOv8 checkpoint 导出：

```powershell
python export_yolov8.py yolov8m.pt models/base/yolov8m/model.onnx
# 等价： yolo export model=yolov8m.pt format=onnx opset=12 imgsz=640
```

一个注册的基座模型需要在 `models/base/<name>/` 下包含三个文件：

```
models/base/yolov8m/
├── model.onnx     # ONNX 模型
├── meta.json      # { "name": "yolov8m", "type": "detector", "input_size": 640, "classes": 80 }
└── classes.json   # 输出类别 + 父类继承链
```

`models/registry.json` 决定当前激活的模型：

```json
{ "active_base": "yolov8m", "active_extensions": [] }
```

> 关于 `classes.json` 的继承映射与置信度降级，见 [DSL 参考 · 继承计数](/tio/dsl-reference#_4-计数函数-cnt-类别名)。

## 5. 首次运行

把图片放进 `photo/`，然后：

```powershell
build\dsl.exe
```

启动日志示例：

```
[Main] active base model: yolov8m (C:\...\dsl\models\base\yolov8m\model.onnx)
[Main] photo dir: C:\...\tio\photo
[Cache] Loaded 128 images from cache index.
[Cache] Cache is up to date (128 images).
```

- **首次运行**（无缓存）：对每张图执行 YOLO 推理（CPU 下约数分钟），写入 `cache/yolov8m/cache_index.json`。
- **再次运行**：对比 `mtime`/`size`，只对新增 / 修改的图片重新推理；无变化时秒级加载。

## 6. 第一个查询

### REPL

```dsl
dsl> $ : (any(class == "person"))              # 所有含人的图片
dsl> % $ : (any(class == "person"))            # 提取所有 person 对象
dsl> $ : (cnt(fruit) > 2)                      # 水果（含子类）> 2 的图片
dsl> $ : (img_warmth() > 0.7 && any(class == "cat"))   # 暖色且含猫
```

### 命令行（JSON 模式）

```powershell
build\dsl.exe --list-models                    # 查看注册模型
build\dsl.exe --base yolov8m                   # 临时切换基座模型
build\dsl.exe --json --photo .\photo --tag-filter "city=sh" < query.dsl
```

### 标签预筛选

```powershell
# 多条件 AND，同一 key 的多个值 OR
dsl.exe --json --photo .\photo --tag-filter "city=sh|bj" --tag-filter "level=3"
dsl.exe --json --photo .\photo --tag-filter "location="   # 该 key 任意值
```

## 7. 下一步

- [DSL 语法参考](/tio/dsl-reference) — 完整语法、宏、示例集
- [功能列表](/tio/features) — 目标检测、场景识别、直方图、EXIF
- [使用教程（扩展包与资产管理）](/tio/features#扩展包)
