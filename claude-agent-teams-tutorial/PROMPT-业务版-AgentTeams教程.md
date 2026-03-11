# 交互式教程网站生成 Prompt（Claude Agent Teams 教程）

> 把这个 Prompt 直接交给 AI，即可生成一个关于 Claude Code Agent Teams 的交互式教程网站。

---

## 你的任务

用 **React 19 + TypeScript + Tailwind CSS v4 + Zustand + Vite** 创建一个关于 **Claude Code Agent Teams** 的交互式教程网站，包含 **7 个学习步骤**。

本质上这是一个**交互式 PPT**：左侧是步骤导航栏（类似 PPT 幻灯片缩略图），右侧是当前步骤的内容展示区，支持键盘左右切换、点击导航、前进后退按钮三种方式在步骤之间切换。

---

## 技术栈

```bash
npm create vite@latest claude-agent-teams-tutorial -- --template react-ts
cd claude-agent-teams-tutorial
npm install zustand lucide-react react18-json-view tailwindcss @tailwindcss/vite
```

**vite.config.ts** 只需要两个插件：`@vitejs/plugin-react` + `@tailwindcss/vite`。

---

## 页面布局

```
┌──────────────────────────────────────────────────────┐
│  Header：[Claude Logo] Claude Code Agent Teams / 交互式教程    3/7 ━━━━○ │
├───────────┬──────────────────────────────────────────┤
│ Sidebar   │  MainContent                             │
│ 260px     │                                          │
│           │  [概念]                                   │
│ Step 1 ●  │  什么是 Claude Code Agent Teams           │
│ Step 2 ○  │  了解核心概念                             │
│ Step 3 ○  │  ─────────────                           │
│ Step 4 ○  │                                          │
│ Step 5 ○  │  课程内容...                              │
│ Step 6 ○  │                                          │
│ Step 7 ○  │  [← 上一步]              [下一步 →]      │
└───────────┴──────────────────────────────────────────┘
```

- **App.tsx**：`grid grid-cols-1 md:grid-cols-[260px_1fr] h-screen`
- 移动端：Sidebar 变成顶部横向滚动标签栏
- 桌面端：左侧 260px 固定侧边栏 + 右侧内容区
- 内容区限宽 `max-w-3xl mx-auto`，步骤切换时播放 `animate-slide-up` 进入动画

---

## 配色方案（亮色主题）

在 `index.css` 中用 Tailwind v4 的 `@theme` 定义：

```css
@import "tailwindcss";

@theme {
  --color-primary-100: #ff6600;   /* 主色-橙 */
  --color-primary-200: #ff983f;   /* 辅助橙 */
  --color-accent-200: #929292;    /* 中灰 */
  --color-text-100: #1d1f21;      /* 深色标题 */
  --color-text-200: #444648;      /* 正文色 */
  --color-bg-100: #ffffff;        /* 白色背景 */
  --color-bg-200: #f5f5f5;        /* 浅灰背景 */
  --color-bg-300: #cccccc;        /* 边框/未激活 */
  --color-danger: #e05353;        /* 错误 */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC', sans-serif;
  --font-mono: 'SF Mono', 'JetBrains Mono', 'Fira Code', monospace;
  --animate-slide-up: slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
}
```

整体亮色，仅代码块和终端模拟器用深色背景。橙色是唯一强调色。

---

## 状态管理

```typescript
// Zustand store
interface TutorialState {
  currentStep: number
  completedSteps: Set<number>
  quizAnswers: Record<string, string>
  goStep: (i: number) => void          // 离开时自动标记完成
  answerQuiz: (id: string, chosen: string) => void  // 防止重复答题
}
```

导航三种方式：侧边栏点击 / 前进后退按钮 / `Cmd+左右箭头`。

---

## 7 个步骤定义

```typescript
export const STEPS = [
  { id: 'overview',       title: '什么是 Claude Code Agent Teams', subtitle: '了解核心概念',         tag: 'concept',  tagLabel: '概念' },
  { id: 'vs-subagents',   title: 'Agent Teams vs Subagents',       subtitle: '选择正确的工具',       tag: 'concept',  tagLabel: '概念' },
  { id: 'enable',         title: '启用 Agent Teams',               subtitle: '配置与设置',           tag: 'practice', tagLabel: '实操' },
  { id: 'first-team',     title: '创建第一个团队',                  subtitle: '动手实践',             tag: 'practice', tagLabel: '实操' },
  { id: 'architecture',   title: '架构与通信',                      subtitle: '深入理解工作原理',     tag: 'advanced', tagLabel: '进阶' },
  { id: 'usecases',       title: '实战用例',                        subtitle: '代码审查、调试、开发', tag: 'advanced', tagLabel: '进阶' },
  { id: 'bestpractices',  title: '最佳实践与排障',                  subtitle: '技巧与常见问题',       tag: 'tips',     tagLabel: '技巧' },
]
```

---

## 可复用 UI 组件

- **CodeBlock**：仿 macOS 终端窗口（红黄绿三点 + 标题栏 + Copy 按钮）
- **InfoBox**：左侧彩色竖条提示框，三种类型 `tip` / `warning` / `note`
- **CompareTable**：对比表格，表头灰色，行悬停高亮
- **Quiz**：选择题，点击即判定，正确绿/错误红，答案持久化
- **FlowSteps**：竖向时间轴，彩色圆形图标 + 连线 + 标题描述
- **TerminalSimulator**：深色背景终端，支持多标签页，内容逐行动画显示
- **Diagram**：SVG 交互式架构图，节点 hover 显示 Tooltip
- **JsonPreview**：可折叠 JSON 预览（使用 react18-json-view）

---

## 各步骤课程内容

### 步骤 1：什么是 Claude Code Agent Teams

**使用组件**：Diagram + FlowSteps + InfoBox

**内容**：

1. **核心概念**：Agent Teams 允许多个 Claude Code 实例协同工作。一个 Team Lead 负责协调，多个 Teammates 独立执行任务，每个 Teammate 有独立的上下文窗口。与 Subagents 不同，Teammates 可以直接互相通信。

2. **架构总览**（Diagram 组件）：展示 User ↔ Team Lead ↔ Teammates 的架构关系图，包含 TaskList 和 Mailbox 节点，用橙色虚线连接表示通信。

3. **最佳使用场景**（FlowSteps）：
   - 🔍 研究与审查：多个 Teammates 同时调查问题的不同方面
   - 💻 新模块开发：Teammates 各自负责独立的功能模块
   - 🐛 竞争假说调试：并行测试不同假说，更快收敛到正确答案
   - 🛠 跨层协调：前端/后端/测试由不同 Teammate 负责

4. **警告**（InfoBox warning）：Agent Teams 是实验性功能，默认禁用，消耗 Token 远多于单个会话。

---

### 步骤 2：Agent Teams vs Subagents

**使用组件**：CompareTable + InfoBox + Quiz

**内容**：

1. **核心差异对比**（CompareTable）：

| 维度 | Subagents | Agent Teams |
|------|-----------|-------------|
| 上下文 | 独立窗口，结果返回给调用者 | 独立窗口，完全独立运作 |
| 通信 | 只能向主 Agent 报告 | Teammates 可直接互相发消息 |
| 协调 | 主 Agent 管理所有工作 | 共享任务列表 + 自主协调 |
| 适用场景 | 只需结果的专注任务 | 需要讨论与协作的复杂任务 |
| Token 成本 | 较低 | 较高：每个 Teammate 是独立实例 |

2. **选择规则**（InfoBox tip）：需要快速专注工作者 → Subagent；需要分享发现、互相质疑 → Agent Teams。

3. **测验 1**（Quiz）：场景 —— 在 5 个目录中搜索特定模式的文件，应选择？答案：Subagents。
4. **测验 2**（Quiz）：场景 —— PR 审查，希望多个审查者互相质疑发现，应选择？答案：Agent Teams。

---

### 步骤 3：启用 Agent Teams

**使用组件**：CodeBlock + CompareTable + InfoBox

**内容**：

1. **启用方式**：设置环境变量 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`，可通过 `~/.claude/settings.json` 配置或 Shell 环境变量。（展示两种方式的 CodeBlock）

2. **显示模式**（CompareTable）：

| 模式 | 说明 |
|------|------|
| In-process | 所有 Teammates 在主终端内，Shift+Up/Down 切换 |
| Split panes | 每个 Teammate 独立终端面板，需要 tmux 或 iTerm2 |

3. **配置方式**（CodeBlock）：`"teammateMode": "in-process"` 或命令行 `claude --teammate-mode in-process`

4. **默认行为**（InfoBox note）：默认 "auto"，tmux 中自动 split panes，否则 in-process。

5. **Split panes 安装**（CompareTable）：tmux 通过包管理器安装，iTerm2 需要启用 Python API。

6. **警告**（InfoBox warning）：Split panes 不支持 VS Code 终端、Windows Terminal 和 Ghostty。

---

### 步骤 4：创建第一个团队

**使用组件**：CodeBlock + TerminalSimulator + FlowSteps + InfoBox

**内容**：

1. **创建方式**：用自然语言告诉 Claude 创建团队。展示两个 CodeBlock 示例：
   - 示例 1（多角度探索）：创建团队从 UX、技术架构、魔鬼代言人三个角度探索
   - 示例 2（并行审查）：创建团队审查 PR，三位审查者分别关注安全、性能、测试覆盖率

2. **模拟终端**（TerminalSimulator）：三个标签页，逐行动画展示：
   - Create Team：`$ claude` → 创建团队 → 生成 3 个 Teammates → 创建任务列表
   - Message：Lead 查看任务状态 → 收到 Teammate 消息 → 分配新任务
   - Shutdown：发送关闭请求 → 各 Teammate 批准 → 清理资源

3. **启动方式**（FlowSteps 4 步）：你请求创建 → Claude 提议创建 → Lead 分解分配 → 并行执行

4. **控制权**（InfoBox note）：Claude 不会在未经批准的情况下创建团队。

---

### 步骤 5：架构与通信

**使用组件**：CompareTable + CodeBlock + JsonPreview + InfoBox

**内容**：

1. **架构组件**（CompareTable）：Team Lead / Teammates / Task List / Mailbox 四个组件及其职责

2. **存储结构**（CodeBlock）：`~/.claude/teams/<name>/config.json` 和 `~/.claude/tasks/<name>/`

3. **团队配置示例**（JsonPreview）：展示一个真实的 config.json，包含 members 数组，每个成员有 name、agentType、model、prompt、color 等字段

4. **上下文与通信**（CompareTable）：自动消息投递 / 空闲通知 / 共享 Task List / message / broadcast 五种通信机制

5. **重要提示**（InfoBox warning）：Lead 的对话历史不会传递给 Teammates，spawn prompt 要提供足够上下文

6. **权限、任务依赖、Token 使用**：简要说明规则和性价比建议

---

### 步骤 6：实战用例

**使用组件**：CodeBlock + InfoBox + Quiz

**内容**：

1. **用例 1 —— 并行代码审查**（CodeBlock）：创建团队审查 PR，三位审查者分别关注安全、性能、测试。说明：每位审查者用不同过滤器，Lead 汇总所有发现。

2. **用例 2 —— 竞争假说调试**（CodeBlock）：生成 5 个 Teammates 调查不同假说，让他们互相交流、尝试推翻对方理论。（InfoBox tip）解释为什么有效 —— 避免锚定效应。

3. **用例 3 —— 跨层协调开发**（CodeBlock）：前端/后端/测试三个 Teammate，各自职责明确，通过消息协调。

4. **测验**（Quiz）：以下哪个场景最不适合 Agent Teams？答案：在单个文件中修复简单拼写错误。

---

### 步骤 7：最佳实践与排障

**使用组件**：FlowSteps + CodeBlock + CompareTable + InfoBox

**内容**：

1. **最佳实践**（FlowSteps 6 步）：
   - 给 Teammates 足够上下文
   - 合理划分任务粒度
   - 等待 Teammates 完成
   - 从研究和审查任务入手
   - 避免文件冲突
   - 监控并调整

2. **任务数量建议**（InfoBox tip）：每个 Teammate 5-6 个任务可保持高效

3. **充足上下文示例**（CodeBlock）：展示一个详细的安全审查 spawn prompt

4. **常见问题排查**（CompareTable）：6 个常见问题及解决方案（Teammates 不出现、权限提示过多、遇错停止、Lead 提前退出、孤立 tmux 会话、任务状态滞后）

5. **已知限制**（InfoBox warning）：不支持会话恢复、每个会话一个团队、不支持嵌套团队等 8 条

6. **入门建议**（InfoBox tip）：从 2-3 个 Teammates 的小团队开始，选不需要写代码的任务

---

## 终端模拟器数据

```typescript
// data/simData.ts
export const SIM_DATA = {
  create: [
    '$ claude',
    'Claude Code v1.x.x',
    '',
    '> 创建一个 Agent 团队来审查 PR #42，生成三位审查者...',
    '',
    '⚙ 正在创建团队 "pr-review-42"...',
    '✓ 团队已创建',
    '⚙ 正在生成 Teammate "security-reviewer"...',
    '✓ security-reviewer 已加入',
    '⚙ 正在生成 Teammate "perf-reviewer"...',
    '✓ perf-reviewer 已加入',
    '⚙ 正在生成 Teammate "test-reviewer"...',
    '✓ test-reviewer 已加入',
    '📋 已创建 6 个任务的任务列表',
    '💬 正在分配任务给 Teammates...',
    '团队已启动。使用 Shift+Up/Down 选择 Teammate。',
  ],
  message: [
    '[Lead] 正在查看任务状态...',
    '📋 任务列表：',
    '  [✓] #1 审查认证模块 (security-reviewer)',
    '  [▶] #2 检查数据库查询 (perf-reviewer)',
    '  [▶] #3 验证单元测试 (test-reviewer)',
    '  [ ] #4 审查 API 端点 (未分配)',
    '',
    '💬 来自 security-reviewer 的消息：',
    '"在 src/api/users.js:42 发现潜在的 SQL 注入。"',
    '',
    '[Lead] 正在将 #4 分配给 security-reviewer...',
    '✓ 任务 #4 已分配',
  ],
  shutdown: [
    '[Lead] 所有任务已完成。正在发起关闭...',
    '💬 向 security-reviewer 发送关闭请求...',
    '✓ security-reviewer 已批准关闭',
    '💬 向 perf-reviewer 发送关闭请求...',
    '✓ perf-reviewer 已批准关闭',
    '💬 向 test-reviewer 发送关闭请求...',
    '✓ test-reviewer 已批准关闭',
    '⚙ 正在清理团队资源...',
    '✓ 团队 "pr-review-42" 已清理',
    '✔ 完成！',
  ],
}
```

终端模拟器中用 CSS 类区分文字颜色：`sim-prompt`（提示符，橙色粗体）、`sim-output`（输出，灰色）、`sim-success`（成功 ✓，浅橙）、`sim-warn`（进行中 ▶，灰色）、`sim-highlight`（高亮，橙色）。

---

## Sidebar 步骤按钮三种状态

| 状态 | 圆形徽章 | 文字 | 特殊效果 |
|------|---------|------|---------|
| 当前 | 橙底白字 | 橙色 | 左侧 3px 橙色竖条 + 数字发光阴影 |
| 已完成 | 橙底 + ✓ 图标 | 浅橙 | 无 |
| 未访问 | 灰底灰字 | 灰色 | 无 |

---

## 文件结构

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── types/index.ts
├── hooks/
│   ├── useTutorialStore.ts
│   └── useKeyboardNav.ts
├── data/
│   ├── steps.ts
│   └── simData.ts
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── StepButton.tsx
│   ├── MainContent.tsx
│   ├── NavigationButtons.tsx
│   ├── ProgressBar.tsx
│   └── ui/
│       ├── CodeBlock.tsx
│       ├── InfoBox.tsx
│       ├── CompareTable.tsx
│       ├── Quiz.tsx
│       ├── FlowSteps.tsx
│       ├── TerminalSimulator.tsx
│       ├── Diagram.tsx
│       └── JsonPreview.tsx
└── lessons/
    ├── index.ts
    ├── LessonOverview.tsx
    ├── LessonVsSubagents.tsx
    ├── LessonEnable.tsx
    ├── LessonFirstTeam.tsx
    ├── LessonArchitecture.tsx
    ├── LessonUsecases.tsx
    └── LessonBestPractices.tsx
```

---

## 一句话风格描述

> 亮色主题、橙色品牌色的交互式 PPT 教程，左侧边栏导航 + 右侧内容展示，包含 macOS 风格代码块、逐行打字终端模拟器、即时反馈测验、对比表格、时间轴流程图等交互组件，支持键盘/点击/按钮三种导航方式，React 19 + Tailwind CSS v4 + Zustand 构建。
