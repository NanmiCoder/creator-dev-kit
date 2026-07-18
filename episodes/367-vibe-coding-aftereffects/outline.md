# Video Outline — Vibe Coding 的后遗症

> **主题**:`midnight-press`(暗色印刷,暖色 espresso 暗底 + 火热橙 accent,Instrument Serif italic × Noto Serif SC,慢速电影感节奏)
> **总时长**:约 5 分 13 秒(口播 ~1268 字 ÷ 4 字/秒;实测 MP3 = 313.1s)
> **章节数**:6 章 / 36 段完整口播 / 39 个运行时音频与视觉步骤;**hook 章节内部按"每句话一个画面"细切为 6 步**(段 2 16.5s 拆 3 步,段 3 4.9s 拆 2 步)

> **Checkpoint Plan 备注**:用户已直接选定主题 `midnight-press` + 明确要求"先做我第一章"。
> 章节切分沿用 `script.md` 顶部已声明的 6 段;开发模式按默认 A(逐章确认)进行。
> 每章一次到位完整版本,不分骨架 / 精修两步。

---

## 1. `hook` — 钩子开场(6 steps · ~25s)

**信息池**(从 `source-notes.md` 抽;chapter agent 按需挂角标 / 副标 / mono cue):

- **V2EX 原帖标题**:「公司 vibe coding 的项目,团队已经无法掌控了」 —— 来源 source-notes §V2EX 主题事实
- **发布时间 / 浏览量**:2026-07-02 17:13 +08:00 · 5039 views · 92 replies · 1 like —— 来源 source-notes §V2EX 主题事实
- **团队构成**:Java + 前端(无 AI Agent 工程师) —— 来源 source-notes §V2EX 主题事实 / script §段 2
- **使用工具**:Codex 类 AI 工具 —— 来源 script §段 2
- **目标**:替代一部分在线客服和电话客服 —— 来源 script §段 2
- **时间跨度**:年初开始 → 几个月后上线 —— 来源 script §段 2、§段 3
- **关键词锚点**:V2EX · 帖子 · 上线 · 客服 Agent · Codex(铺垫后 5 章)

**开发计划**(每句话一个画面,每步独立切换):

- step 0 (~3.7s) — masthead 报头 + 居中 hero「这两天 V2EX 有个帖子 很扎心」+ V2EX 数据三宫格(5039/92/01)
- step 1 (~6.4s) — 「年初开始做客服 Agent,想替代在线/电话客服」→ 屏:大时间线 2026.Q1 + 客服 Agent hero + 替代目标(在线/电话)
- step 2 (~6.2s) — 「团队里没有专门 AI Agent 工程师,Java + 前端」→ 屏:团队 4 个角色槽(3 个虚线空缺 + Java/前端 2 个实 tag),大 mono 警告"NO AI AGENT ENGINEER"
- step 3 (~3.9s) — 「一边学,一边用 Codex 这类工具赶进度」→ 屏:Codex hero + 进度条/赶工动效 + mono 状态"// IN LEARNING MODE"
- step 4 (~2.9s) — 「几个月后,第一版上线了」→ 屏:v1 LIVE 节点 / 绿色大对勾 / 时间戳"v1.0 · SHIPPED"
- step 5 (~1.6s) — 「然后问题开始爆」→ 屏:hero「问题开始爆」+ alert pulse 红色闪烁 + 状态条切红

口播节选:
> 这两天 V2EX 有个帖子很扎心。 / 一家公司年初开始做客服 Agent,想替代一部分在线客服和电话客服。 / 团队里没有专门的 AI Agent 工程师,主要是 Java 和前端同学。 / 于是大家一边学,一边用 Codex 这类工具赶进度。 / 几个月后,第一版上线了。 / 然后问题开始爆。

---

## 2. `shock` — 最吓人的那一句(5 steps · ~38s)

**信息池**:

- **症状 1**:电话线路并发一高就崩 —— 来源 script §段 4
- **症状 2**:在线客服 / 语音客服沉默、超时、丢上下文 —— 来源 script §段 4
- **症状 3**:人工客服反过来救火 —— 来源 script §段 4
- **核心钩句**:「现在这个项目脱离 AI,已经没人能看懂,没人能改了」 —— 来源 script §段 6(原帖 OP)
- **判断**:**不是 AI 写不出代码,而是代码写出来以后,团队失去了理解、验证、维护它的能力** —— 来源 script §段 8
- **本期主线定义**:**vibe coding 最大的后遗症** —— 来源 script §段 7

**开发计划**:

- step 4 (~12.4s) — 三栏症状并列(电话崩 / 沉默超时 / 人工救火),每栏一行症状 + mono 数据角标
- step 5 (~3.6s) — 反差短屏:「但这个帖子真正吓人的,不是 bug 多」(留白 + 小字)
- step 6 (~8.6s) — pull-quote 引述 OP 原话(脱离 AI 没人能看懂),左红条 accent
- step 7 (~3.5s) — 金句落点:大字「这就是 vibe coding 最大的后遗症」
- step 8 (~8.1s) — 重新框定:「不是 AI 写不出代码,而是团队失去了理解、验证、维护的能力」—— 三动词逐个揭示

---

## 3. `perspective` — 评论区三派 + 我自己的实践(8 steps · ~76s)

**信息池**:

- **派别 1**:AI 大跃进 / KPI 产物 —— 来源 script §段 9
- **派别 2**:不能全怪 AI,客服 Agent 本来不是 100% 确定性,怎能不灰度?—— 来源 script §段 9
- **派别 3**:AI 可以大量写代码(甚至 100%),但前提是先把单测 / Lint / 规范 / 架构边界搭好 —— 来源 script §段 10
- **第一人称痛点**:开源项目初期觉得 AI 写得快(UI / 重复代码 / 测试脚本 / 迁移脚本) —— 来源 script §段 12
- **真正消耗时间的**:确认它没埋雷 —— 来源 script §段 13
- **我的工作流**:单测 + 覆盖率 + 自动化测试;前端浏览器 E2E;桌面端 Computer Use;关键路径人工过 —— 来源 script §段 14
- **结论**:就算做到这些,还会有意想不到的 bug —— 来源 script §段 15
- **金句**:**测试不是银弹,但没有测试就是裸奔** —— 来源 script §段 16

**开发计划**:

- step 9 (~15.4s) — 三派并列卡片,每派一行主张 + 一条 mono 角标(发言楼层编号 1~92)
- step 10 (~12.3s) — 锁定第三派(搭好规范 / 边界后,100% AI 写也能做),放大 hero 数字
- step 11 (~2.6s) — 转折短屏:「这一点我自己也很有感触」(签名感)
- step 12 (~11.2s) — 第一人称时间线:开源项目初期 → AI 真快(列出 4 类能堆的产物)
- step 13 (~7.3s) — 真正的消耗:大字「确认它没有埋雷」+ 旁边 mono 数据角标(debug 时间占比)
- step 14 (~14.2s) — 我的工作流矩阵:4 个圈(单测 / 覆盖率 / 前端 E2E / 桌面 Computer Use),逐个揭示
- step 15 (~4.0s) — 妥协短屏:「就算做到这些,还是会有意想不到的 bug」
- step 16 (~9.4s) — 金句收束:**测试不是银弹,但没有测试就是裸奔** —— 双行大字 + accent 横条

---

## 4. `bigco` — 大厂最新实践对照(7 steps · ~83s)

**信息池**:

- **共识**:不是要不要用 AI 写代码,而是默认 AI 参与;差距在「有没有放进工程流水线」 —— 来源 script §段 19
- **微软 .NET runtime**:复盘 10 个月 Copilot Coding Agent;每个 PR 都收到 AI review(无论谁写的)—— 来源 script §段 20 / source-notes §微软
- **GitHub Copilot cloud agent**:从 issue / Actions / IDE / Slack / Jira 启动 → 后台干活 → 开 PR;medium-depth review 把复杂 PR 路由给更强模型 —— 来源 script §段 21 / source-notes §GitHub
- **OpenAI Codex 官方建议**:AGENTS.md + 测试命令 + PR 预期 + code_review markdown;不只是生成代码,要补测试、跑检查、review diff;OpenAI 自己 Codex review 100% PR —— 来源 script §段 22 / source-notes §OpenAI Codex
- **Cloudflare vinext**:几乎每行代码 AI 写,但 1700+ Vitest + 380 Playwright E2E + TypeScript + lint + CI,每个 PR 都跑 —— 来源 script §段 23 / source-notes §Cloudflare

**开发计划**:

- step 17 (~2.0s) — 短屏转场:「这里要更新一个认知」
- step 18 (~3.6s) — 反共识大字:「现在已经不是要不要用 AI 写代码的时代了」
- step 19 (~11.5s) — 大厂共识总览:4 行平行排版(微软 / GitHub / OpenAI / Cloudflare)+ 一句主线
- step 20 (~16.2s) — 微软深度解读:10 个月复盘;每个 PR 都有 AI review
- step 21 (~21.1s) — GitHub 集成矩阵:从 5 个入口启动 Copilot cloud agent + medium-depth review
- step 22 (~22.7s) — OpenAI Codex 工作流:AGENTS.md / 测试 / review diff / 100% PR review
- step 23 (~15.1s) — Cloudflare vinext 极端样本:几乎每行 AI 写 + 1700 Vitest + 380 Playwright

---

## 5. `harness` — harness coding 概念(5 steps · ~35s)

**信息池**:

- **核心定义**:harness = 给 AI 装轨道 —— 来源 script §段 25
- **三不是**:
  - 不是「帮我做个客服 Agent,然后让它自由发挥」,而是先把业务流程 / 性能指标 / 失败兜底 / 模块边界写清楚 —— 来源 script §段 26
  - 不是让 AI 直接碰主干和生产,而是在分支 / worktree / sandbox / 预览环境里改 —— 来源 script §段 27
  - 不是能跑就合,而是每个改动都要有测试 / diff review / 灰度 / 回滚 —— 来源 script §段 28
- **口号**:从 vibe coding 走向 harness coding —— 来源 script §段 24

**开发计划**:

- step 24 (~5.6s) — 总命题:从 vibe coding 走向 harness coding(大字 + accent 横条)
- step 25 (~4.1s) — 定义句:「harness = 给 AI 装轨道」—— 大字 + 简短副标
- step 26 (~10.8s) — 三不是第一栏:不是一句需求让 AI 自由发挥,而是先写清业务流程 / 性能 / 兜底 / 边界
- step 27 (~7.2s) — 三不是第二栏:不是让 AI 直接碰主干,而是在分支 / worktree / sandbox / 预览环境改
- step 28 (~6.8s) — 三不是第三栏:不是能跑就合,而是每个改动都有测试 / diff review / 灰度 / 回滚

---

## 6. `take` — 结论 + 互动(8 steps · ~57s)

**信息池**:

- **结论起**:不是不要用 AI 写代码;恰恰相反,我现在很多代码也让它写 —— 来源 script §段 29
- **结论转**:越来越不敢只看它快不快 —— 来源 script §段 30
- **真正关心**:能不能被测试、被 review、被回滚、被下一个人看懂 —— 来源 script §段 30
- **金句**:**AI 让代码变便宜了,但让理解、验证、架构和责任变贵了** —— 来源 script §段 31
- **回扣主题**:**这才是 vibe coding 最大的后遗症** —— 来源 script §段 32
- **互动 1**:Accept All 派 / Review All 派?—— 来源 script §段 34
- **互动 2**:把最崩溃的经历打在评论区 —— 来源 script §段 35
- **签名**:阿江,我们下期见,拜拜 —— 来源 script §段 36

**开发计划**:

- step 29 (~8.7s) — 转折:不是不要用 AI,而是恰恰相反,我也用它写代码
- step 30 (~9.0s) — 转变:越来越不敢只看快不快;放大 4 个动词(测试 / review / 回滚 / 看得懂)
- step 31 (~6.2s) — 主金句:**AI 让代码变便宜了,但让理解、验证、架构和责任变贵了** —— 双行排版
- step 32 (~2.9s) — 回扣:「这才是 vibe coding 最大的后遗症」(与 Chapter 2 step 7 形成闭环)
- step 33 (~3.3s) — 互动引子:评论区问一个问题
- step 34 (~6.1s) — 二选一互动:Accept All 派 vs Review All 派
- step 35 (~5.8s) — 二次互动:把最崩溃的经历打在评论区
- step 36 (~6.6s) — 签名屏:阿江 / 我们下期见 / 拜拜

---

## 素材清单

### 1. `hook`(本视频第 1 章,本期实现范围)
- ✓ 主题:`midnight-press`(已就位 `presentation/src/styles/tokens.css`)
- ✓ 字体:Instrument Serif + Noto Serif SC + Manrope + JetBrains Mono(`presentation/src/styles/fonts.css` 已加载)
- ✓ 6 段音频:`presentation/public/audio/hook/{1~6}.mp3`(`segments_audio/seg_01~03.mp3` 用 ffmpeg 按 STT 时间戳切分,精度 ±0.01s)
- ⚠️ V2EX 帖子 mockup 图(暂不需要 — 用 mono cue + 卡片结构代替)
- ⚠️ 客服 Agent / 团队构成的具体 logo 图(暂不需要 — 用 mono badge + 文字标签)

### 2-6 章
- ✓ 对应分段音频已收录在 `presentation/public/audio/{shock,perspective,bigco,harness,take}/`。
- ✓ 大厂标识使用 mono badge + 文字 label，不引入第三方 logo。
- ✓ 工程流水线使用网页内 SVG / CSS 自绘，不引入第三方图片。

---

## 自检(写完 outline **强制**执行)

- [x] 每个 step 都是单一句屏幕内容描述,没有"动画"行 / "手段"行
- [x] 没有任何 step 写了具体毫秒 / 秒数(除 `(~Ts)` 口播估时)
- [x] 每章首段都有「信息池」block,至少 3 条 article 抽取项,每条必带来源标注
- [x] 所有 step `(~Ts)` 累加 ≈ 顶部声明的总时长(hook 章现 3.7+6.4+6.2+3.9+2.9+1.6 = 24.7s,实测 MP3 总长 24.68s,误差 < 0.1%)
- [x] 章节切分符合"每章 3~8 步 / 30~60s 一聚焦主题"经验(Chapter 1 拆 6 步因每句一屏,平均 4.1s/步)
- [x] 末尾「素材清单」分章节列出,✓ / ⚠️ 标注清楚
- [x] 脚本不得包含标题、序号等非口播内容,仅包含人类正常可读的内容(全部从 `script.md` 复制,语义一致)
