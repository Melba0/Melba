---
layout: home

hero:
  name: "Tio & OpenPaw"
  text: "DSL 驱动的图像检索与编辑工作站"
  tagline: "用自然语言描述需求，用 DSL 精确控制处理"
  image:
    src: /logo.svg
    alt: Tio & OpenPaw
  actions:
    - theme: brand
      text: 快速开始
      link: /tio/getting-started
    - theme: alt
      text: 下载
      link: /download
    - theme: alt
      text: GitHub
      link: https://github.com/Melba0/tio

features:
  - icon: 🔍
    title: Tio — 精确检索
    details: DSL 查询语法、YOLOv8m 目标检测、颜色直方图、EXIF、场景识别。按任意维度筛选图库。
  - icon: 🎨
    title: OpenPaw — 智能编辑
    details: 自然语言驱动，LLM 生成 DSL，调用分割 / 蒙版 / 合成工具，一键完成复杂处理。
  - icon: 🧩
    title: 扩展包机制
    details: 模型即插件。添加新的分割包或细化模型，无需改代码，提示词与 DSL 自动更新。
  - icon: 🖥️
    title: 专业桌面体验
    details: Qt 6 GUI + CLI 双模式，暗色主题，可停靠面板，处理前后实时对比预览。
  - icon: ⚡
    title: 极速缓存
    details: 增量更新，首次推理之后毫秒响应。百万级图库也能秒级加载。
  - icon: 🔒
    title: 本地优先
    details: 除可选的 LLM 翻译外，所有检测、分割与处理均在本地完成，图片不上传云端。
---

## 两个项目，一条工作流

<div class="case-grid">
  <div class="case-card">
    <div class="case-images">
      <img src="/screenshots/tio/main-window.png" alt="Tio 界面" style="grid-column: 1 / -1;" />
    </div>
    <div class="case-body">
      <h3>🔍 Tio — 找到它</h3>
      <p class="case-desc">用自然语言或 DSL 在本地图库中做语义检索：目标、场景、颜色、清晰度、EXIF、用户标签，任意组合。</p>
      <pre class="case-code">$ : (cnt(fruit) > 2 &amp;&amp; img_warmth() > 0.7)</pre>
      <p><a href="/tio/">了解 Tio →</a></p>
    </div>
  </div>
  <div class="case-card">
    <div class="case-images">
      <img src="/screenshots/openpaw/overview.png" alt="OpenPaw 界面" style="grid-column: 1 / -1;" />
    </div>
    <div class="case-body">
      <h3>🎨 OpenPaw — 改好它</h3>
      <p class="case-desc">用自然语言驱动 170+ 处理工具（分割 / 蒙版 / 合成 / 调色 / 拼接），LLM 自动生成可编辑的 DSL 管道。</p>
      <pre class="case-code">src |&gt; skyseg() |&gt; apply_mask(...)</pre>
      <p><a href="/openpaw/">了解 OpenPaw →</a></p>
    </div>
  </div>
</div>

<div class="tech-ticker">
  <div class="track">
    <span class="chip">C++17</span>
    <span class="chip">Qt 6</span>
    <span class="chip">ONNX Runtime</span>
    <span class="chip">YOLOv8m 检测</span>
    <span class="chip">Places365 场景识别</span>
    <span class="chip">U²-NetP 天空分割</span>
    <span class="chip">OpenAI 兼容 LLM</span>
    <span class="chip">增量缓存</span>
    <span class="chip">浮点蒙版</span>
    <span class="chip">批量合成</span>
    <span class="chip">GPL-3.0</span>
    <span class="chip">C++17</span>
    <span class="chip">Qt 6</span>
    <span class="chip">ONNX Runtime</span>
    <span class="chip">YOLOv8m 检测</span>
    <span class="chip">Places365 场景识别</span>
    <span class="chip">U²-NetP 天空分割</span>
    <span class="chip">OpenAI 兼容 LLM</span>
    <span class="chip">增量缓存</span>
    <span class="chip">浮点蒙版</span>
    <span class="chip">批量合成</span>
    <span class="chip">GPL-3.0</span>
  </div>
</div>

## 数字一览

<div class="stats">
  <div class="stat"><b>601</b><span>Open Images V7 目标类别</span></div>
  <div class="stat"><b>365</b><span>Places365 场景</span></div>
  <div class="stat"><b>170+</b><span>图像处理工具</span></div>
  <div class="stat"><b>32</b><span>维色调直方图</span></div>
  <div class="stat"><b>0</b><span>图片上传云端</span></div>
  <div class="stat"><b>3</b><span>次 LLM 自动纠错</span></div>
</div>

## 快速导航

| 我想… | 去哪里 |
|------|--------|
| 编译并跑起来 Tio | [Tio 快速开始](/tio/getting-started) |
| 学习检索 DSL | [Tio DSL 语法参考](/tio/dsl-reference) |
| 用一句话编辑图片 | [OpenPaw 快速开始](/openpaw/getting-started) |
| 查看全部处理工具 | [OpenPaw 工具清单](/openpaw/tools) |
| 下载安装包 / 源码 | [下载页面](/download) |
| 看真实效果对比 | [案例展示](/showcase/) |
