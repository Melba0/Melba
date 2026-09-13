---
description: OpenPaw 常见问题：LLM 配置与 base_url、自动纠错重试、API Key 安全、模型缺失、ONNX 回退、分割包管理、蒙版边缘、工作区与模板。
---

# 常见问题

## 必须配置 LLM 才能用吗？

不必须。未配置时仍可手写 DSL、使用 **Examples** 下拉或 `--file script.dsl` 执行，无需 API Key。

## 如何配置任意兼容 OpenAI 的端点？

编辑 `config/settings.ini` 的 `[LLM]` 段：

```ini
[LLM]
base_url    = https://your-endpoint/v1
api_key     = sk-...
model       = your-model
max_retries = 3
stream      = true
temperature = 0.2
```

`base_url` 支持裸主机名、`/v1` 或完整 `/v1/chat/completions`，都会被自动规范化。

> **安全提示**：不要提交含真实 `api_key` 的 `settings.ini`，请将其加入 `.gitignore`。

## 执行报错会自动修正吗？

会。错误以结构化 JSON（`error_type` / `message` / `tool` / `line` / `stage` / `original_dsl`）
回传 LLM，重新生成 DSL，最多 `max_retries`（默认 3）次。仅 `--nl` / Generate & Run 会触发，
手工执行 `executeDsl` 默认不修复。

## 提示 `model_not_found` 怎么办？

该分割包的 `model.onnx` 缺失。把模型放到对应包目录，或用
`Settings → Segmentation Packs...` / `openpaw_cli --add-seg-pack <dir>` 重新安装。
内置 `skyseg_v1` 随仓库分发。

## 没有安装 ONNX Runtime 能构建吗？

可以。ONNX Runtime 是可选依赖，构建时自动探测（`ONNXRUNTIME_ROOT` 或 `CMAKE_PREFIX_PATH`）；
未找到时分割工具回退到经典算法，程序仍可构建运行。

> 若 CMake 缓存里残留了他人机器的 `ONNXRUNTIME_ROOT`，请显式传
> `-DONNXRUNTIME_ROOT=<你的路径>` 覆盖。

## 分割包怎么启用 / 禁用？

编辑 `models/segmentation/registry.json` 的 `active`，或使用 GUI 分割包管理器 / CLI。
只有 `active` 中的包出现在 DSL 与 LLM 提示词里。

## 蒙版边缘很硬怎么办？

蒙版是软蒙版（浮点计算，不做硬二值化）。用羽化并选择合适的曲线：

```dsl
sky = feather(sky, 15, gradient="smooth")   # linear / smooth / ease_in / ease_out
```

## 批量处理整个文件夹？

```bash
openpaw_cli --input ./photos --output ./results --file script.dsl
openpaw_cli --input ./photos --nl "把所有图片调成复古胶片风"
```

## 结果保存到哪里？

由 `save(path, ...)` 指定：目录路径（以 `/` 结尾或无后缀）批量保存并继承文件名；
文件路径保存单张。默认目录见 `config/settings.ini` 的 `[Processing]`。

## AI 工具用的是 ONNX 模型吗？

当前 `AiTools` 走**确定性经典算法回退**，ONNX 推理用于分割包。调用 AI 工具时会通过
warnings 提示使用了 fallback。

## 工具是确定性的吗？

是。除 LLM 生成 DSL 外，所有工具确定 / 幂等：同一张图多次处理结果一致。

## 工作区与模板是什么？

- **工作区**：独立的 `input/` 与 `output/`，配置在 `config/workspaces.json`；
- **模板**：`Process → Save as Template` 保存当前 DSL，`presets/` 内置 10 个可复用。

## 延伸阅读

- [LLM 与自动纠错](/openpaw/llm) · [CLI 参考](/openpaw/cli)
- [分割模型包](/openpaw/segmentation) · [蒙版系统](/openpaw/masks)
