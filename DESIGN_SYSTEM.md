# 智能体管理学 · 设计规范 / Design System

> 站点的设计语言唯一来源。新增页面、调整样式、新增组件时**严格执行**本规范；如需偏离，先更新本文件再写代码。

**版本** v1.0 · 2026-05-20
**适用** `qiuyiwu.com/ams/` 全部页面（含 framework / skills / knowledge-map / patterns / resources）

---

## 1. 设计原则

1. **温和而专业**——配色不刺眼、留白克制、信息密度可控；学术质感优先于工具感。
2. **双读者并行**——人和 Agent 同时是读者。视觉上服务人，结构上服务 Agent（语义化 HTML / JSON-LD / `.md` 镜像）。
3. **模块即颜色**——六个重写模块各有专属色，构成跨页一致的视觉锚点。
4. **复用 > 新建**——优先复用已有组件类（详见 §6），新增前先找现成的。
5. **响应式无妥协**——所有组件至少做到 1100 / 720 / 480px 三档断点。

---

## 2. 颜色 Tokens

颜色统一通过 CSS 变量定义在 `assets/ams.css` 的 `:root[data-theme="dark"]` 和 `:root[data-theme="light"]` 里。**禁止在组件中硬编码十六进制**，特殊场景需要新色时先加 token。

### 2.1 基础 token（与主题相关）

| Token | Dark | Light | 用途 |
|---|---|---|---|
| `--bg` | `#0A0A0C` | `#FFFFFF` | 页面背景 |
| `--bg-1` | `#16161A` | `#FAFAFA` | 卡片背景 / 区块底色 |
| `--bg-2` | `#1C1C22` | `#F4F4F5` | hover 态 / 输入框 |
| `--bg-3` | `#22222B` | `#E9E9EC` | 嵌套层 |
| `--line` | `#2A2A35` | `#E5E5EA` | 默认边框 |
| `--line-2` | `#393948` | `#D4D4D8` | 强调边框 / hover 边框 |
| `--fg` | `#FFFFFF` | `#0A0A0C` | 主文字 / 标题 |
| `--fg-dim` | `#A1A1AA` | `#52525B` | 正文 / 描述 |
| `--fg-dim2` | `#71717A` | `#71717A` | 次要文字 / 标签 |
| `--fg-dim3` | `#52525B` | `#A1A1AA` | 占位 / 弱化 |
| `--accent` | `#8B5CFF` | `#6102FF` | 主品牌色（紫）|
| `--accent-hi` | `#A78BFF` | `#4E02CC` | accent hover / 加亮 |
| `--accent-soft` | `rgba(139,92,255,0.14)` | `rgba(97,2,255,0.08)` | accent 软背景 |
| `--accent-fg` | `#FFFFFF` | `#FFFFFF` | accent 上的文字 |

### 2.2 模块色 · 6 大重写专属

按编号顺序固定，跨页一致（首页 #system / 知识图谱 / 蓝图模块标签均沿用）。**新增模块色需更新本表 + 所有引用点。**

| 模块 | 编号 | Token / Hex | 名称 |
|---|---|---|---|
| ① 竞争重写 | F01–F06 | `#8B5CFF` | 紫 · accent |
| ② 组织重写 | F07–F12 | `#5BE5A0` | 薄荷绿 |
| ③ 产品重写 | F13–F19 | `#FFB85B` | 暖橙 |
| ④ 系统重写 | F20–F26 | `#5BB5FF` | 天蓝 |
| ⑤ 价值重写 | F27–F32 | `#FF6B8A` | 珊瑚粉 |
| ⑥ 人类重写 | F33–F36 | `#FFD45B` | 金黄 |

使用方式：在组件外层 `style="--mod-c: #XXXXXX;"`，组件内部用 `var(--mod-c, var(--accent))` 引用。

### 2.3 阶段色 · L1-L5（蓝图专属）

仅用于蓝图（#blueprint）的五阶段视觉。与模块色协调，不要在其它语境复用。

| 阶段 | Token | Hex | 含义 |
|---|---|---|---|
| L1 工具辅助 | `--bp-c1` | `#94A3B8` | slate-gray · 中性起点 |
| L2 流程嵌入 | `--bp-c2` | `#FFB85B` | 暖橙 · 同模块三 |
| L3 系统协同 | `--bp-c3` | `#5BB5FF` | 天蓝 · 同模块四 |
| L4 能力网络 | `--bp-c4` | `#5BE5A0` | 薄荷绿 · 同模块二 |
| L5 自进化 | `--bp-c5` | `#8B5CFF` | 紫 · accent |

**色彩刻意复用模块色**，让用户在不同视图间建立无意识的颜色记忆。

### 2.4 色彩使用规则

- 任意"色块"的饱和度不要超过 30%（用 `color-mix(in srgb, var(--xxx) 30%, var(--bg))` 调淡）
- 单一页面同时出现的"主色"不要超过 3 种（accent + 1-2 个辅助色）
- 治理神经 G01-G03 统一用 `--accent`（紫），不要分色
- 切勿用纯色饱和块作为大面积背景，会破坏整体温和感

---

## 3. 字体 Typography

通过 Google Fonts 加载（在每个页面的 `<head>` 中）：

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
```

### 3.1 字体栈

| 用途 | Family | Tailwind class |
|---|---|---|
| 正文 / UI | `Inter` | `font-sans`（默认）|
| 大标题 / Display | `Space Grotesk` | `font-display` / `.display` |
| 编号 / 标签 / 代码 | `JetBrains Mono` | `font-mono` / `.mono` |

### 3.2 标题字号阶梯（响应式）

| 用途 | class |
|---|---|
| Hero H1（首页主题）| `display text-[clamp(44px,8vw,124px)]` |
| Skill 库 / 蓝图 H1 | `display text-[clamp(36px,6vw,84px)]` |
| Section H2 | `display text-[clamp(28px,3.8vw,46px)]` |
| 卡片标题 | `display text-base` ~ `text-lg` |

### 3.3 正文字号

| 场景 | 字号 |
|---|---|
| Hero 描述 | `text-lg`（18px）|
| Section 引导段 | `text-[16.5px]` `leading-[1.8]` |
| 卡片描述 | `13.5-14.5px` `line-height: 1.65-1.75` |
| 标签 / 元数据 | `text-[11-13px]`，常配 `mono` + `letter-spacing: 0.05-0.18em` |

### 3.4 字重

- 标题：500-700（Space Grotesk）
- 正文：400（Inter）
- 强调：500（不要用 700）—— `<strong>` 默认重置为 `font-weight: 500; color: var(--fg);`

---

## 4. 间距 Spacing

遵循 Tailwind 8 倍数体系，本站常用：

| 场景 | 数值 |
|---|---|
| Section 上下 padding | `py-24` (96px) |
| 容器最大宽 | Tailwind `container`（自动响应）|
| 卡片 padding | `16-22px` |
| 卡片间 gap | `12-16px` |
| 列表项垂直 padding | `12-14px` |
| Hero 顶部 padding | `pt-36` (144px，避让 fixed header) |

Section 之间统一用 `border-t border-line` 作分隔，不用大空白。

---

## 5. 页面骨架

每个页面**严格按此结构**：

```html
<!doctype html>
<html lang="zh-CN" data-theme="dark">
<head>
  <!-- meta + 字体 preconnect + ams.css + theme init script + tailwind cdn + tailwind config -->
</head>
<body class="bg-bg text-fg">

  <!-- 1. 固定头 -->
  <header class="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-line nav-bar">
    <div class="container h-16 flex items-center justify-between">
      <a href="../index.html"> Logo（agentic.mgmt_ + 智能体管理学）</a>
      <nav> 主导航（7 个链接，详见 §5.1）</nav>
      <div> 右侧（邱懿武 / 返回首页 / 主题切换）</div>
    </div>
  </header>

  <!-- 2. Hero（必含）-->
  <section class="relative pt-36 pb-24 overflow-hidden noise">
    <div class="absolute inset-0 grid-bg pointer-events-none"></div>
    <div class="absolute inset-0 accent-glow pointer-events-none"></div>
    <div class="relative container">
      <div class="kicker mb-6"><span class="accent">▌</span> 分类标签</div>
      <h1 class="display text-[...]">主标题</h1>
      <div class="mt-5 mono ...">英文副标题 · ABBR（可选）</div>
      <p class="mt-8 text-fg-dim text-lg">描述</p>
      <div class="mt-10 flex gap-3"><CTA 按钮></div>
    </div>
  </section>

  <!-- 3. N 个内容 section（每个用 border-t 分隔）-->
  <section id="..." class="py-24 border-t border-line">
    <div class="container">
      <div class="mb-12 max-w-4xl" data-reveal>
        <div class="sec-label mb-5"><span class="num">0N_</span>// section · 中文标题</div>
        <h2 class="display text-[clamp(28px,3.8vw,46px)] leading-[1.1]">章节标题</h2>
        <p class="mt-5 text-fg-dim text-[16.5px] leading-[1.8]">引导段</p>
      </div>
      <!-- section 内容 -->
    </div>
  </section>

  <!-- 4. Footer -->
  <footer class="border-t border-line py-12">
    <div class="container">
      <div class="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div class="mono text-xs text-fg-dim2">© 2026 浙江大学 · 造物云 · 智能体管理学 v1.0</div>
        <div class="flex gap-4 text-xs text-fg-dim2 mono"><邱懿武 / 返回首页 / 其它链接></div>
      </div>
    </div>
  </footer>

  <script src="../assets/ams.js"></script>
</body>
</html>
```

### 5.1 主导航固定 7 项

| 链接 | href（根页）| href（framework 子页）|
|---|---|---|
| 体系全景 | `index.html#system` | `../index.html#system` |
| 40 框架索引 | `index.html#index` | `../index.html#index` |
| F00 总序 | `framework/F00.html` | `F00.html` |
| 知识图谱 | `knowledge-map.html` | `../knowledge-map.html` |
| Skill 库 | `skills/index.html` | `../skills/index.html` |
| 资源 | `resources.html` | `../resources.html` |
| 模式库 | `patterns.html` | `../patterns.html` |

当前页对应的链接用 `text-accent`，其余用 `text-fg-dim hover:text-fg`。

---

## 6. 组件清单

按用途分组，类名前缀对应文件/上下文。**新组件命名跟随此约定**。

### 6.1 通用导航 / 标签

- `.kicker` — section 顶部小标签（▌+ 中英混排）
- `.sec-label` — section 编号 + 类型 (`02_ // system`)
- `.mono` — 等宽字体快捷类
- `.display` — 大标题字体快捷类
- `.accent` — 紫色色块（小方块装饰用）

### 6.2 按钮

- `.btn-primary` — 紫底白字主按钮
- `.btn-bracket` — `[ 文字 → ]` 方括号风格次要按钮
- `.text-cta` — 文本式 CTA（带 `→` / `↓` 箭头）
- `.link-arrow` — 行内文字链接 + 箭头
- `.toggle` — 主题切换按钮（圆角 svg 容器）

### 6.3 卡片矩阵（按用法）

| 类 | 用途 | 关键特征 |
|---|---|---|
| `.module-card` | 首页六模块卡片（旧版，已被 km-grid 替代） | 大色块 + 编号 + 标题 + 描述 |
| `.sysmap-cell` | 七模块小标签条 | 横排小块 |
| `.km-col` + `.km-node` | 六模块列 + 框架节点（首页 + 知识图谱） | 顶部 3px 模块色 + 节点左 2px 模块色 |
| `.km-stream-row` | 模块流程单行 | "模块N · 名称 · 流程箭头" |
| `.km-cross-nodes` + `.km-cross-label` | 治理神经横切层 | 紫色虚线包裹 + 3 列节点 |
| `.bp-stage-card` | 蓝图 5 阶段说明卡 | 左侧 4px 阶段色 |
| `.bpf-cell` | 蓝图矩阵单元格 | 3% 阶段色背景 + 右下角 F-chip |
| `.bpf-gov-card` | 蓝图治理神经卡 | ◎◇◆ 符号 + 缩写 + 3 点 |
| `.side-card` | 框架页右侧栏卡片 | 灰底 + 标题 + 列表 |
| `.sk-card` | Skill 库卡片 | F-id + 类型 + 中英双标题 + 描述 + 3 按钮 |
| `.cit-item` | 框架页"理论"Tab 引文卡 | 作者 + 著作 + 概念 |
| `.usage-card` | 使用说明 3 步卡 | 编号 + 标题 + 描述 |
| `.glance-cell` | 框架页 hero 下 3 格"一目了然" | 单元格分割 |

### 6.4 视图组件

- `.fw-tabs` + `.fw-tab` + `.tab-panel` — 框架页三视图 Tab（长文 / 方法论 / 理论）
- `.md-modal` + `.md-modal-card` + `.markdown-body` — Skill 在线预览模态框
- `.fw-viz` + `.viz-canvas` — 框架页可视化 SVG 容器

### 6.5 列表 / 元素

- `.method-steps` `.method-caveats` `.method-checks` — 框架页方法论 tab 三种列表
- `.theory-citations` `.theory-shifts` `.theory-rels` `.theory-reading` — 框架页理论 tab 列表
- `.trig-chip` — Skill 卡触发词小 chip
- `.inline-code` — 行内代码

### 6.6 视觉效果

- `.noise` — 网格 + 噪点背景层
- `.grid-bg` — 网格背景
- `.accent-glow` — 紫色光晕
- `.orb` + `.orb-accent` + `.orb-drift` — 漂浮光球装饰

---

## 7. 动画 Animation

只用 4 种动画原语：

1. **`data-reveal`** — 进入视图时淡入 + 轻微上移（IntersectionObserver 驱动，定义在 `assets/ams.js`）
2. **`transition: all .18s ease`** — 悬停 / 点击的瞬时状态变化
3. **`transform: translateX(2px)`** — 节点悬停的微位移（在 `.km-node` 等用）
4. **`tab-fade-in` keyframes** — Tab 切换的淡入

**不要新增 spring / scale / rotate 动画**，会破坏整体性冷静感。

---

## 8. 响应式断点

```
> 1100px   桌面完整版（多列网格，最大特性）
720-1100px 平板版（列数减半，部分横向→纵向）
480-720px  小平板 / 手机横屏（简化导航 + 单列卡片）
< 480px    手机纵屏（最简版，部分元素隐藏）
```

特定常用断点（写在媒体查询里）：

```css
@media (max-width: 1100px) { /* 大平板 */ }
@media (max-width: 900px)  { /* 矩阵紧凑 */ }
@media (max-width: 768px)  { /* iPad 纵向 */ }
@media (max-width: 720px)  { /* 中等 */ }
@media (max-width: 640px)  { /* sm 边界（Tailwind 同）*/ }
@media (max-width: 480px)  { /* 手机 */ }
```

---

## 9. 主题切换

- 主题状态保存在 `localStorage` 的 `zwy-theme`（值 `dark` / `light`）
- 切换按钮 `#theme-toggle`，逻辑在 `assets/ams.js`
- 所有颜色必须用 token，自动适配深浅模式

---

## 10. 命名约定

| 前缀 | 范围 |
|---|---|
| `km-` | knowledge-map 风格组件（共用于首页 #system）|
| `sk-` | Skill 库相关 |
| `bp-`, `bpf-` | blueprint 蓝图相关（hero 缩略 + 完整矩阵）|
| `fw-` | framework 详情页相关 |
| `md-modal-`, `markdown-` | Markdown 预览模态 |
| `usage-`, `sec-`, `mod-`, `sm-`, `sysmap-`, `cit-`, `gov-`, `viz-`, `op-` | 各 section 内组件 |

新增组件遵循"前缀 + 用途"命名，避免与现有冲突。

---

## 11. 无障碍 Accessibility

- 颜色对比度：正文 ≥ AA（4.5:1）
- Tab 切换：用 `<button role="tab" aria-selected>` + `<div role="tabpanel" aria-labelledby>`
- 模态：`role="dialog" aria-modal="true" aria-labelledby`，Esc 关闭
- 链接：可点击区域 ≥ 32×32px
- 图标按钮：必含 `aria-label`
- 装饰性图形：`aria-hidden="true"`
- 焦点环：所有可交互元素必须有 `:focus-visible` 样式

---

## 12. 新增页面 Checklist

新建一个 .html 页面，必做：

- [ ] 文件头：`<!doctype html>` + `<html lang="zh-CN" data-theme="dark">`
- [ ] meta：title / description / viewport
- [ ] 引入字体 preconnect + Google Fonts link
- [ ] 引入 `assets/ams.css`（根页 `assets/...`；子目录 `../assets/...`）
- [ ] 主题初始化 script（读 localStorage）
- [ ] Tailwind CDN + config
- [ ] `<body class="bg-bg text-fg">`
- [ ] 固定 header（按 §5 模板）
- [ ] Hero section（按 §5 模板）
- [ ] 内容 sections（每个 `border-t border-line`，每个含 sec-label + display H2）
- [ ] footer（按 §5 模板）
- [ ] 引入 `assets/ams.js`
- [ ] 桌面 / 平板 / 手机三档 viewport 自测
- [ ] dark / light 双主题自测
- [ ] 加 `data-reveal` 让区块进入动画
- [ ] 主导航对应入口加 `text-accent`，其它页同步加链接

---

## 13. Agent 友好 / 机器可读

新页面如果包含数据（如 Skill 库、框架列表），同时输出：

- 内嵌 `<script type="application/ld+json">`（Schema.org）
- 配套 `manifest.json` / `llms.txt`（如适用）
- 用 `<link rel="alternate" type="..." href="...">` 在 `<head>` 显式声明
- HTML 结构语义化：`<article>`, `<section>`, `<nav>`, `<header>`, `<footer>` 各司其职

---

## 14. 资源清单（关键文件位置）

```
/agentic-management-science/
├── index.html               首页（hero + #blueprint + #why + #system + #index）
├── knowledge-map.html       知识图谱（含 km-* 共享 + 引用链路 + 可视化模式）
├── patterns.html            模式库
├── resources.html           资源（提示词模板等）
├── DESIGN_SYSTEM.md         ← 本文件
├── README.md                项目介绍
├── assets/
│   ├── ams.css              全部组件样式（单一来源）
│   └── ams.js               全部交互逻辑（单一来源）
├── framework/
│   ├── F00.html             总序（含 3-Tab 长文/方法论/理论）
│   ├── F01–F36.html         核心框架
│   └── G01–G03.html         治理神经
└── skills/
    ├── index.html           Skill 库门户（MD 预览 + 筛选 + JSON-LD）
    ├── F01–F36.md           36 个可执行 Skill
    ├── _STANDARD.md         统一 IO 标准
    ├── manifest.json        机器可读元数据
    └── llms.txt             LLM 友好索引
```

---

## 15. 反模式（不要做）

- ❌ 在组件里硬编码颜色（必须用 CSS var）
- ❌ 大块用纯紫色渐变背景（视觉过于"游戏感"）
- ❌ 给同一段文字混用 3 种以上字号
- ❌ 在 hero 区超过 6 个 CTA
- ❌ Tab 数量超过 4 个
- ❌ 卡片网格列数 > 6（除非小尺寸 chip）
- ❌ 新建独立 `<style>` 块（除非真的页面专属且不超过 30 行）
- ❌ Section 内嵌 Section（保持扁平）
- ❌ 浮动 / fixed 元素堆叠超过 3 层

---

**修改本文件的纪律**：新增 / 改动设计规则**先动文档，再动代码**。每次修改在文件头部更新版本号 + 日期，并在 git commit 中说明改动点。
