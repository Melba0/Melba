---
description: OpenPaw 的 LLM 集成：settings.ini 配置项与默认值、base_url 规范化、SSE 流式与超时、提示词与工具注册表注入、结构化错误 JSON 与自动重试机制。
---

# LLM 与自动纠错

OpenPaw 用任意**兼容 OpenAI 协议**的 LLM 把自然语言翻译成 DSL。LLM 是可选的：
不配置亦可手写 DSL 或使用内置模板。

## 配置

编辑 `config/settings.ini` 的 `[LLM]` 段（或 `Settings → Preferences`）：

```ini
[LLM]
base_url    = https://api.openai.com/v1/chat/completions
api_key     =
model       = gpt-4o-mini
max_retries = 3
stream      = true
temperature = 0.2
```

| 键 | 默认 | 说明 |
|----|------|------|
| `base_url` | `https://api.openai.com/v1/chat/completions` | 端点，自动规范化 |
| `api_key` | 空 | Bearer Token；为空时 `--nl` 不可用 |
| `model` | `gpt-4o-mini` | 模型名 |
| `max_retries` | `3` | 自动纠错最大次数 |
| `stream` | `true` | SSE 流式输出 |
| `temperature` | `0.2` | 采样温度 |

> **安全**：不要把含真实 `api_key` 的 `settings.ini` 提交到仓库；请将其加入 `.gitignore`。

### base_url 规范化

`LlmClient::chatEndpoint` 会去除首尾空白与结尾 `/`；若结尾不是 `/chat/completions`
则自动追加。因此下列写法都有效：

```
https://api.deepseek.com
https://api.deepseek.com/v1
https://api.openai.com/v1/chat/completions
```

## 请求、流式与超时

- 请求体：`{ model, messages, temperature, stream }`；
- 头：`Content-Type: application/json`、`Authorization: Bearer <key>`、`Accept: text/event-stream`；
- 传输超时 **120s**，停滞（无数据）超时 **60s**；
- SSE 逐行解析 `data:`，`data: [DONE]` 完成；分片通过 `delta(piece)` 实时显示在思考面板；
- 错误描述：`HTTP <status> <errorString> - <error.message>`，`401/403` 提示检查 API Key，
  `404` 提示检查 base URL / 模型名。

## 提示词构建

`PromptBuilder::systemPrompt()` 由静态指令 + 动态注入组成：

- `ToolRegistry::promptSummary()`：按类别列出**当前注册的全部工具签名**、参数类型、默认值、枚举与范围；
- `SegmentationRegistry::promptSummary()`：当前激活分割包的工具名 / 别名 / 说明。

因此新增工具或分割包后，提示词**自动同步**，无需改提示词。

`stripCodeFences(text)` 会去掉模型输出首尾的 ` ```lang ... ``` ` 代码围栏。

## 自动纠错

```
请求 ─► LLM ─► DSL ─► 解析 ─► 执行
                          │
                失败 ◄────┘
                  │
                  ▼
   错误 JSON + 原始 DSL + 用户请求 ─► LLM ─► 修正后的 DSL ─► 重试（≤ max_retries）
```

- 解析错误（`stage = parse`）回传原始解析器错误文本；
- 其它错误回传紧凑 JSON；
- 手工执行（`executeDsl`）默认**不**触发修复；`--nl` / Generate & Run 才会。

错误 JSON schema（`DslError::toJson`）：

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

## 错误阶段与常见类型

`stage`：`lex`、`parse`、`validate`、`execute`。

| 类别 | 示例 `error_type` |
|------|-------------------|
| 变量 / 属性 | `unknown_variable`、`unknown_property` |
| 工具 / 参数 | `unknown_tool`、`unknown_argument`、`missing_argument`、`too_many_arguments`、`type_error`、`parameter_out_of_range`、`invalid_argument` |
| 运行 | `division_by_zero`、`empty_input`、`size_mismatch`、`execution_error` |
| 加载 / 保存 | `load_failed`、`save_failed`、`index_out_of_range`、`lut_not_found` |
| 分割 | `unknown_segmentation_pack`、`model_not_found`、`model_load_failed`、`inference_failed` |

## 延伸阅读

- [快速开始](/openpaw/getting-started) · [CLI 参考](/openpaw/cli)
- [系统架构](/openpaw/architecture) · [常见问题](/openpaw/faq)
