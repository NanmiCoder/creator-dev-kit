# 章节开发一页通（每章 agent 唯一必读）

你在做**视频**，不是 PPT：观众在听一条连续口播，画面负责把每个节拍演出来。
输入 = 本章 `BRIEF.md`（step 表 + 时间戳 + 口播原文 + CSS 前缀）+ 主题 `tokens.css`。
章节组件是 step 的纯函数：`if (step === N) return <场景N />`，每步独占整屏。
过程自由发挥 —— 下面锁的是**结果红线**，`npm run check` + 真机截图会兜底验证。

## ① 一屏铁律

| # | 红线 | rationale |
|---|---|---|
| 1 | 每章 ≥1~2 处 CSS / SVG / Canvas 视觉演示，禁纯文字章 | 观众要**看见**被讲的东西在演；纯文字 = PPT |
| 2 | 清单 / 列表逐个揭示：**1 项 = 1 step**；讲到后项时前项灰化保留 | 口播一个一个念，画面就一个一个亮 |
| 3 | 每步只放该节拍最值得放大的 1~3 个元素；hero 文字 ≥80px、留白大 | 塞满 = 论文阅读；录屏观众离屏远，小字看不清 |
| 4 | 屏幕文案 = 口播**子集 / 提炼**；口播没说的不上屏；细节可回 article / 信息池挂，但不编造 | 观众在听原声；画面密度可以 > 口播，事实不能跑 |
| 5 | 无页眉 / 页脚 / 页码 / 品牌条 | 视频没有 chrome，突出主视觉 |
| 6 | 颜色 / 字体家族只用 token；禁 vw / vh；无 setTimeout / setInterval；无 emoji | check 自动抓。舞台是固定 1920×1080 + transform scale，vw 按真实视口算必错；动画用 CSS keyframes |
| 7 | 物理隔离：只写本章目录三件（`<Comp>.tsx` / `<Comp>.css` / `narrations.ts` 微调）；CSS 类全用 BRIEF 分配的前缀；不跨章 import；不改 chapters.ts | 并行开发不打架；check 自动抓 |
| 8 | `narrations.ts` 已由 gen 生成：文字可微调（断句 / 标点，语义与关键短语不得丢），**长度不许变**；无音频过场步用空串 `""` | 长度 = 全片对齐契约，变了整条时间轴错位。要变 → 回 plan.md 改了重 gen |
| 9 | 每步动画收尾 ≤ 步长的 90% | auto 模式严格按音频推进，超长动画当场被切 |
| 10 | 上屏数字 / 名称 / 排名与 plan.md 事实核实表一致；标了「推断」的项不得当确定事实渲染 | 上屏错一个数 = 全片返工（375 期教训） |

## ② token 与自由度

**必须 token**（换主题不破的底线）：
- 颜色：`--shell` `--surface` `--surface-2` `--surface-3` `--text` `--text-2`
  `--text-mute` `--text-faint` `--rule` `--accent` `--accent-soft` `--accent-glow`
- 字体家族：`--font-display-cn` `--font-display-en` `--font-body` `--font-mono`
- 主题性格 primitive（**勿在章节 CSS 里重定义**）：`.hero-num`（hero 数字）
  `.rule`（分割线）`.card`（卡片）`.stage-frame`（舞台底色 / 装饰，章节零处理）

**自由发挥**（固定 px 硬编码随意）：字号 / 间距 / 动画时长 / 缓动 / 边框 / gap。
节奏气质参考 theme.json 的 `mood`（慢主题别写 200ms 快动画）。
spacing token 只用主题**已定义**的档 —— 未定义的 var 塌成 0，gap 挤成一团。

## ③ 视觉演示工具箱

先找内容的**内在动作**（增长 / 对比 / 流程 / 交换 / 变形），找不到才用入场动画兜底；
持续微动（呼吸 / 闪烁）慎用。可组合的现成手法：

数字递增 · 横条生长 · 排名交换 · 流程节点依次点亮 / 连线自绘 · 对比一刀切开 /
聚光扫过 · 粒子聚拢成形 · 字符雨 · 模拟终端 / AI 对话窗 / 文件树 · git 分支图 · 榜单条群。

- 可交互元素（按钮等）加 `data-no-advance`，否则点击会被舞台误翻页
- 缺素材用 placeholder 卡（"image · 16:9 描述"按真实比例占位）——
  不用 emoji 凑、不编数字、不找无关图。**没有就承认没有，比 fake 强一百倍**

## ④ 反 AI 味（出现任意一条 = 回去改）

紫粉 / 蓝紫对角渐变背景 · 圆角卡片 + 彩色左边框 · 渐变药丸按钮 · emoji 当图标 ·
假数据 / 假 logo / 假"X 万用户" · 整章一种入场动画（全场 fade / 全场 blur）·
每步都挂 ken burns / 光晕呼吸 / 持续闪烁 · 每屏右下角 mono 角标。

## ⑤ 节拍：动画钉在口播时刻上

BRIEF.md 给了每步的绝对起点与时长。步内每个揭示元素：

```
animationDelay(ms) = (该句 cue.start − step.start) × 1000
```

- 步内多条 cue（vo 里以 ` / ` 分隔）的相对时刻：回 SRT 查精确值，或按各段字数
  占比 × 步长估算（中文 ~4 字/秒，误差远小于观感阈值）
- 揭示**铺满整步**，别全堆在前 3 秒；最后一拍（max(delay + 动画时长)）落步长 **75%–90%**
- 长步（10s+）把揭示拉开；短步（<5s）动画克制
- 动画装不下的三选一：调快动画 / 精简元素 / 拆 step（拆 = 回 plan.md 改，重跑 gen）

## ⑥ 布局：「满屏不偏」几何

- 眉标（kicker）**绝对定位**到顶部，不占文档流 —— 否则 flex 主内容整体被顶到
  上半部、底部空一大块（历史项目每章都犯过这条）
- 主内容在安全区（约 1600×860）垂直 + 水平居中、占据大部分；内容距边约 100–160px
- 单列内容水平居中；两栏整体居中、左右对称填满约 80–88% 宽 —— 别一栏挤左、右边空
- 短内容步（3~6s 的钩子 / 签名）靠**大字**撑满，别一小行飘着
- 强调色文字别压同色填充（绿字压绿柱 = 糊）；数值抬到色块之上、落深色底

**安全区几何判据**（App.tsx 配置了才生效，BRIEF 会注明；开发态画虚线提示层，
`?auto=1` 录制态自动隐藏）：

- 头像角 `AVATAR_CORNER`：该角 **432×432**（圆 ⌀320 + 四周 56px 呼吸）内不放关键内容。
  精确判据：1920×1080 下，关键元素最近角点到头像圆心的距离 > 半径 160 + buffer ~40
  （top-right 圆心 ≈ (1704, 216)，其余角对称换算）
- 字幕带 `SUBTITLE_SAFE`：**y ≥ 915 全宽**不放关键内容（成片烧录字幕实测 y ≈ 930–1005）

## ⑦ 完工 = 两件实事，然后汇报

1. **`npm run check` 全绿**（tsc / 对齐计数 / 红线扫描 / 前缀唯一）。
2. **agent-browser 在 1920×1080 真机截 2~3 张关键帧**自查：满屏不偏 / 无截断 /
   安全区无侵入。预览类截图偏小、有缓存，不算数。
   合成 keydown 到不了 window 监听器 —— 翻页用 localStorage 游标 + reload：

```bash
SESS=<本章 id>; U=http://localhost:5173/     # 端口以实际 dev server 为准
agent-browser --session $SESS open "$U"
agent-browser --session $SESS eval "localStorage.setItem('<STORAGE_KEY 值，见 src/hooks/useStepper.ts>', JSON.stringify({chapter:<C>, step:<S>}))"
agent-browser --session $SESS open "$U"      # reload 应用游标，画面冻在该步
agent-browser --session $SESS wait <该步最后一拍 delay+时长 ms，单条勿超 30s>
agent-browser --session $SESS screenshot /tmp/qa/<C>-<S>.png
```

- 判断以**舞台矩形**为参照系（四周黑边是 letterbox，不是设计 padding）
- 截图要 Read 出来真看，别凭文件大小猜；不等够动画时长会拍到半截
- 并行时一章一个 `--session`，localStorage 互不串
- **别把声音放出来**：上面的游标 + reload 走的是 manual 模式，本来就不发声。
  但凡你要切 auto 排查节拍（`?auto=1`），**一律带 `&mute=1`** —— 静音下音频照常
  解码、`currentTime` 照常推进，翻页与有声时逐帧一致。用户机器上突然响起整段
  口播、还找不到是哪个窗口在放，是真实发生过的事故
- **收工关浏览器**：`agent-browser close --all`。留着的 session 会一直占着音频输出

两件都过 → 汇报：改了哪些文件 + check 结果 + 截图路径 + 本章还缺哪些素材。
