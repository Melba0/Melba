---
description: OpenPaw 常见问题：LLM 配置与 base_url、自动纠错与重试次数、模型缺失、无 API Key 使用、构建失败、分割包管理。
---

# 常见问题

## 必须配置 LLM 才能用吗？

不必须。配置 LLM 后可以用自然语言生成 DSL；未配置时仍可直接手写 DSL、使用
`Examples` 下拉或 `--file script.dsl` 执行，无需 API Key。

## 如何配置任意兼容 OpenAI 的端点？

编辑 `config/settings.ini` 的 `[LLM]` 段：

```ini
[LLM]
base_url = https://your-endpoint/v1
api_key  = sk-...
model    = your-model
max_retries = 3
stream   = true
temperature = 0.2
```

`base_url` 支持 `/v1`、`/v1/chat/completions` 或裸主机名，都会被自动规范化。

## 执行报错会自动修正吗？

会。错误以结构化 JSON 形式（`error_type` / `message` / `tool` / `line` / `stage` /
`original_dsl`）回传 LLM，模型据此重新生成 DSL，最多重试 `max_retries`（默认 3）次。

```json
{
  "error_type": "parameter_out_of_range",
  "message": "brightness value 3.5 is out of range [0.5, 2.0]",
  "tool": "adjust",
  "line": 4,
  "stage": "validate",
  "original_dsl": "..."
}
```

## 提示 `model_not_found` 怎么办？

该分割包的 `model.onnx` 缺失。把模型文件放到对应包目录，或在
`设置 → 分割模型管理…` / `openpaw_cli --add-seg-pack <目录>` 重新安装。
内置 `skyseg_v1` 随仓库分发，通常不需要额外下载。

## 没有安装 ONNX Runtime 能构建吗？

可以。ONNX Runtime 是**推荐**依赖，构建时自动探测；未找到时分割工具回退到经典算法，
程序仍可正常构建与运行。需要时用 `-DONNXRUNTIME_ROOT=<解压目录>` 指定。

## 分割包怎么启用 / 禁用？

编辑 `models/segmentation/registry.json` 的 `active` 数组，或使用 GUI 的分割模型管理器。
只有 `active` 中的包会出现在 DSL 与 LLM 提示词里。

## 蒙版边缘很硬怎么办？

蒙版全程是浮点（不二值化）。用 `feather(m, radius, gradient="smooth")` 羽化，
或选择 `linear` / `ease_in` / `ease_out` 渐变。

```dsl
sky = feather(sky, 15, gradient="smooth")
```

## 批量处理整个文件夹？

CLI：

```bash
openpaw_cli --input ./photos --output ./results --file script.dsl
```

`--nl` 模式下同样会批量处理整个输入文件夹。

## 结果保存到哪里？

由 `save(path, ...)` 指定。目录路径（以 `/` 结尾）批量保存并自动继承文件名；
文件路径保存单张。默认输出目录可在 `config/settings.ini` 的 `[Processing]` 中配置。

## 工具是确定性的吗？

是。工具具备确定性 / 幂等性：同一张图片多次处理结果一致。
