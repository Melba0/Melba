---
description: 关于 Tio 与 OpenPaw：项目定位、开源许可（GPL-3.0）、技术栈、路线图与联系方式。
---

# 关于项目

**Tio** 与 **OpenPaw** 是一对相辅相成的桌面图像工具：一个负责**检索**，一个负责**编辑**，
共享同一套 DSL 选择语法与本地优先的设计理念。

| | Tio | OpenPaw |
|---|-----|---------|
| 定位 | DSL 驱动的语义图像检索 | 自然语言驱动的图片编辑工作站 |
| 输入 | 一句话 / DSL 查询 | 一句话 / OpenPaw DSL 脚本 |
| 核心 | YOLOv8m 目标检测 + 增量缓存 | 分割 + 蒙版 + 合成 + 35+ 处理工具 |
| GUI | Qt 6（结果网格、标签、详情） | Qt 6（画布、蒙版、DSL 编辑器、胶片条） |
| 仓库 | <https://github.com/Melba0/tio> | <https://github.com/Melba0/Open-Paw> |

## 设计理念

- **本地优先**：除可选的 LLM 翻译外，检测、分割与处理均在本地完成，图片不上传云端。
- **DSL 是一等公民**：自然语言只是入口，生成的 DSL 可读、可编辑、可复用、可保存为模板。
- **模型即插件**：分割包与扩展包是自包含目录，增删无需改代码，提示词自动同步。
- **确定性**：同一张图片多次处理结果一致，便于脚本化与批处理。

## 技术栈

- **C++17** / 手写递归下降解析器
- **ONNX Runtime**（CPU）推理
- **Qt 6**（Widgets / Network）桌面界面
- **YOLOv8m** 目标检测、**Places365** 场景识别、**U²-NetP** 天空分割
- **兼容 OpenAI 协议**的流式 LLM 客户端

## 开源许可

两个项目均基于 **GNU General Public License v3.0** 发布。

- Tio：[LICENSE](https://github.com/Melba0/tio/blob/master/LICENSE)
- OpenPaw：[LICENSE](https://github.com/Melba0/Open-Paw/blob/main/LICENSE)

## 路线图

- [ ] 扩展包演示与 `>>` 细化文档
- [ ] Linux / macOS 引擎构建（ONNX Runtime 跨平台）
- [ ] 开放词汇基座模型（YOLO-World 风格，动态类别）
- [ ] GPU 推理选项
- [ ] 站点多语言（中 / 英切换）与版本切换

## 链接

- [Tio 仓库](https://github.com/Melba0/tio)
- [OpenPaw 仓库](https://github.com/Melba0/Open-Paw)
- [下载页面](/download)
- [案例展示](/showcase/)

## 反馈

欢迎提交 Issue 与 PR。本网站自身的源码也可自由取用与二次修改。
