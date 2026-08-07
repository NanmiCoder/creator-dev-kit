---
name: web-video-presentation
description: 把口播稿或文章做成"看起来像视频"的点击驱动 16:9 网页演示（Vite + React + TS），录屏即成片。主路径 VO-First：真人口播已录好 → 核实事实 → SRT 时间戳写进 plan.md（唯一中间文档）→ npm run gen 自动生成时间轴 + 各章任务卡 → 章节全并行开发 → npm run check 红线校验 + 关键帧截图 → ?auto=1 整段原声零漂移录屏。次路径 TTS：只有文章 → 先写口播稿再合成音频。适用：用网页做视频（动态 PPT 但不像 PPT）、B 站 / YouTube / 视频号口播视频、出镜视频的补拍画面、有电影感的产品 / talk demo。本 Skill 沉淀方法论 + 流程，不绑定任何样式 / 字体 / 颜色，可复用到任意主题与美学。
---

# Web Video Presentation

把口播稿 / 文章变成可录屏的"伪装成视频的网页"。核心认知：**SRT 和音频对齐之后，
每个小节拍的画面非常好确定 —— 本质是一些前端页面，应该很快。**
所以本 skill 只锁**结果红线**（对齐 / 安全区 / token / 事实真实性 / 术语），
锁法是「脚本校验 + 真机截图」两件实事；过程交给模型自由发挥。

## 流程总览（4 步，同规模视频目标 ~1.5h）

```
① 规划（主线程 ~30min）→ plan.md（唯一中间文档）→ 用户一次确认
② 搭台（主线程 ~10min）→ scaffold.sh → npm run gen → 主题就位
③ 章节开发（默认全并行，一章一个 subagent）
④ 终检 + 交付（主线程 ~15min）→ npm run check 全量 + ?auto=1 过片 → 录制指引
```

各阶段读什么（只有 3 份）：

| 阶段 | 读 |
|---|---|
| ① 规划 | [`references/PLAN-FORMAT.md`](references/PLAN-FORMAT.md)（plan.md 规格 + 事实核实协议） |
| ③ 每章开发 | [`references/CRAFT.md`](references/CRAFT.md)（铁律 / 节拍公式 / 安全区几何 / 完工两件事） |
| ④ 录制 | [`references/RECORDING.md`](references/RECORDING.md)（录制 + 后期装配 + 硬化清单） |

工作目录约定（agent 在用户当前目录下创建 / 编辑）：

```
my-video/
├── article.md      # TTS 路径才有（用户原文，不删 —— 画面细节源）
├── script.md       # TTS 路径才有（平台化口播稿）
├── plan.md         # ★ 唯一中间文档（gen 默认读 ../plan.md，即与 presentation/ 同级）
└── presentation/   # 脚手架产出的 Vite + React + TS 项目
```

## ① 规划 → plan.md

两条路径，按用户手上有什么定：

**VO-First（主路径）**：用户已录好口播，有整段音频 + SRT。节奏是物理事实，
一切从 SRT 反推（真人口播必须**先录后做** —— 先做动画再录音必返工）：

1. 读 SRT + 素材，**核实所有要上屏的事实** —— 协议见 PLAN-FORMAT.md，
   核心一句：**推断 ≠ 核实**，表格数字必须连表头一起看到
2. 按 PLAN-FORMAT.md 写 `plan.md`：` ```timeline ` 块（章 / 步 / 绝对时间戳 /
   口播原文 / 一句话画面创意）+ 各章画面备注 + 术语锁定表 + 事实核实记录

**TTS（次路径）**：用户只有文章。先按 [`references/SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md)
写 `script.md`（保留 `article.md` 不删），再写 plan.md（`at` / `audio` / `duration` 省略）。
音频在 ③ 完成后顺手合成（见下方「TTS 补充」），不设单独停点。
用户啥都没给、只说"帮我做个 X 主题的视频" → **反问**要素材，skill 不替用户构思内容。

**唯一 checkpoint（硬节点）**：plan.md 写完停下来，用户一次确认 4 件事：

1. **章节切分 / 每步画面方向 / 素材缺口** OK 吗（plan.md 是 markdown，可直接编辑）
2. **主题**选哪个 —— 动态读 `themes/*/theme.json`（`nameZh` / `descriptionZh` / `bestFor`），
   按内容匹配主动推荐 2~3 套；用户说"你选" → 取推荐第 1 个并说明理由，给反悔机会；
   想要新主题 → 按 [`references/THEMES.md`](references/THEMES.md) 造一个
3. **并行度** —— 默认全并行，问一句一次开几章
4. **要不要 anchor 章** —— 可选项：第 1 章先做完给用户看一眼定基调，其余再并行；
   赶时间就全并行（主题 token 兜底视觉统一）

另外：事实核实表里标「推断」的项在这里单独列出，请用户裁决。
主题必须明确才进 ②。

## ② 搭台

```bash
bash <path-to-skill>/scripts/scaffold.sh ./presentation --theme=<主题 id>
bash <path-to-skill>/scripts/scaffold.sh --list-themes      # 看可选主题
rm -rf presentation/src/chapters/01-example                  # 删 demo 章
# 并把 src/registry/chapters.ts 里 EXAMPLE_CHAPTER 的 import 和数组项移除
# VO-First：整段口播拷进 public/（原件先在别处另存备份，任何工具不碰原件）
mkdir -p presentation/public/audio
cp <整段口播>.mp3 presentation/public/audio/vo-full.mp3
cd presentation && npm run gen                               # 读 ../plan.md
```

`npm run gen`（plan.md → 代码骨架，幂等可重跑）产出：

- `src/registry/timeline.ts`：TIMELINE（全部 at 展平升序）+ VO_FULL_SRC /
  VO_FULL_DURATION + PARTS（firstStep / lastStep 自动算）+ readPart()
- 每章 `src/chapters/<NN>-<id>/narrations.ts`：vo 原样成数组（**已存在则跳过**，
  不冲掉章节 agent 的手工微调）
- 每章 `src/chapters/<NN>-<id>/BRIEF.md`：任务卡（**每次覆写**）—— step 表 +
  绝对时间戳 + CSS 前缀分配 + 铁律摘要
- `chapters.ts` 缺注册的章打印提醒（注册由主线程手工做，gen 不自动改手工代码）。
  **注册代码等 ③ 各章组件建好再贴** —— import 指向还不存在的组件 tsc 会挂；
  ② 的完成态以 `npm run check` 为准（未开发章记 SKIP 不误报，check 不依赖注册）

gen 写文件前硬校验：at 全局严格升序、TIMELINE 长度 = Σ steps、parts 边界落在
某步 at 上 —— 不过就报错退出。**章节结构变更后 bump `src/hooks/useStepper.ts`
的 STORAGE_KEY**（gen 跑完会提醒），否则旧 localStorage 游标落到不存在的 step。

出镜视频在此时定 `src/App.tsx` 的两个常量：`AVATAR_CORNER`（头像角，null = 不出镜）
和 `SUBTITLE_SAFE`（成片是否烧字幕）—— 章节 agent 靠它们避让安全区。

## ③ 章节开发（默认全并行）

一章一个 subagent，prompt 只需要三个指向：

1. 本章任务卡 `src/chapters/<NN>-<id>/BRIEF.md`（gen 已生成）
2. [`references/CRAFT.md`](references/CRAFT.md) —— 先读它再动工，结果红线全在里面
3. 当前主题 `src/styles/tokens.css`（颜色 / 字体 token；气质参考 theme.json 的 `mood`）

章节 agent 只写本章目录三件文件（`<Comp>.tsx` / `<Comp>.css` / `narrations.ts` 微调）。
完工自验 = `npm run check` 全绿 + agent-browser 截 2~3 张关键帧自查布局（方法在 CRAFT.md ⑦）。

> **`narrations.ts` 是 step 数与口播文本的唯一真相源**：章节代码 `step === N` 的
> 最大 N + 1 必须等于 `narrations.length`（check 校验）。文字可微调，**长度不许变**
> —— 要变节拍就回 plan.md 改，重跑 `npm run gen`。

选了 anchor 章：第 1 章先做完 → 用户看一眼定基调（视觉气质 / 节奏 / 信息密度）→
其余全并行。没选就直接全并行。章节间风格差异是预期 —— 主题 token 兜底统一，
多 voice = 人手写视频的呼吸感。用户反馈某章要改 → 只改该章最小切片，不重做整章。

## ④ 终检 + 交付

1. `npm run check` 全量：tsc / TIMELINE 升序 / Σ narrations === TIMELINE 长度 /
   每章 narrations 数 = 代码 max step + 1 / 红线扫描 / CSS 前缀唯一
2. **`?auto=1&mute=1`** 端到端播一遍（VO-First 多区间时逐 part 过），抽 2~3 张关键帧看：
   > **agent 自动化验证一律带 `&mute=1`** —— 音频照常解码、`currentTime` 照常推进，
   > 翻页行为与有声时完全一致，只是不会从用户音箱里突然放出整段口播。
   > 交给用户录制的指引里**不带**这个参数（起播蒙层会显示「静音验证」防止误录）。
   满屏不偏 / 安全区无侵入 / 翻页跟声音
3. 事实抽查：上屏数字随机抽几个对 plan.md 事实核实表
4. 给用户录制指引：路径选择 / 硬化清单 / 后期装配，见 [`references/RECORDING.md`](references/RECORDING.md)

## TTS 补充：音频合成

③ 完成后顺手做，合成前把 `audio-segments.json` 给用户扫一眼即可：

```bash
cd presentation
npm run extract-narrations       # 扫所有 narrations.ts → audio-segments.json
npm run synthesize-audio         # 默认 minimax provider（mmx-cli），增量
PRESENTATION_TTS=openai npm run synthesize-audio   # 或内置 openai（OPENAI_API_KEY）
```

其它 provider（ElevenLabs / edge-tts / macOS say / Azure / Google）与故障排查见
[`references/AUDIO.md`](references/AUDIO.md) +
`presentation/scripts/tts-providers/README.md`。合成完报告哪些段时长异常
（太长 = 该拆 step；太短 = 文案薄），给用户最后一次校准机会，然后进 ④。

## 结果红线一览（check 管代码，截图管布局，人管事实）

| 红线 | 谁兜底 |
|---|---|
| TIMELINE 严格升序；Σ narrations === TIMELINE 长度；每章 narrations 数 = 代码 max step + 1；tsc | `npm run check` |
| 无硬编码颜色 / 字体名、无 vw / vh、无定时器、无 emoji、不跨章 import、CSS 前缀唯一 | `npm run check` |
| 安全区无侵入（头像角 432×432 / 字幕带 y ≥ 915）、满屏不偏、无截断 | agent-browser 关键帧截图（几何判据见 CRAFT.md） |
| 上屏事实带值 + 来源 + 核实方式；推断显式标注；术语全片统一 | plan.md 核实表 + ④ 抽查（协议见 PLAN-FORMAT.md） |

## 相关资源

| 文件 | 何时读 |
|---|---|
| [`references/PLAN-FORMAT.md`](references/PLAN-FORMAT.md) | ① 规划：plan.md 规格 + 事实核实协议 + 切章经验 |
| [`references/CRAFT.md`](references/CRAFT.md) | ③ 每章开发唯一必读 |
| [`references/RECORDING.md`](references/RECORDING.md) | ④ 录制 + 后期装配 |
| [`references/SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md) | 仅 TTS 路径：文章 → 口播稿规则 |
| [`references/AUDIO.md`](references/AUDIO.md) | 仅 TTS 路径：合成流程 + 换 provider |
| [`references/THEMES.md`](references/THEMES.md) | 选 / 造 / 换主题（完整 token 契约 + 创作流程） |
| [`references/EXAMPLES/`](references/EXAMPLES/) | 可选，卡壳翻结构示意（不是抄袭模板） |
| [`themes/`](themes) | 内置主题（每个含 theme.json + tokens.css） |
| [`scripts/scaffold.sh`](scripts/scaffold.sh) | ② 搭台跑一次 |
