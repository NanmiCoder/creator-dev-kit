# 交互式教程网站生成 Prompt（模板版）

> 把这个 Prompt 交给 AI，替换 `[占位符]` 即可生成一个完整的交互式教程单页应用。

---

## 你的任务

用 **React 19 + TypeScript + Tailwind CSS v4 + Zustand + Vite** 创建一个关于 **[你的教程主题]** 的交互式教程网站。

本质上这是一个**交互式 PPT**：左侧是步骤导航栏（类似 PPT 幻灯片缩略图），右侧是当前步骤的内容展示区，支持键盘左右切换、点击导航、前进后退按钮三种方式在步骤之间切换。

---

## 技术栈

```bash
npm create vite@latest my-tutorial -- --template react-ts
cd my-tutorial
npm install zustand lucide-react react18-json-view tailwindcss @tailwindcss/vite
```

**vite.config.ts** 只需要两个插件：`@vitejs/plugin-react` + `@tailwindcss/vite`。

---

## 页面布局

```
┌─────────────────────────────────────────────────┐
│  Header：[Logo] 教程标题          进度 3/7 ━━━━○ │
├───────────┬─────────────────────────────────────┤
│ Sidebar   │  MainContent                        │
│ 260px     │                                     │
│           │  [标签] 概念                         │
│ Step 1 ●  │  步骤标题                            │
│ Step 2 ○  │  ───────────                        │
│ Step 3 ○  │                                     │
│ ...       │  课程内容（各种交互组件自由组合）      │
│           │                                     │
│           │  [← 上一步]            [下一步 →]    │
└───────────┴─────────────────────────────────────┘
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
  --color-primary-100: #ff6600;   /* 主色-橙：按钮、高亮、进度条 */
  --color-primary-200: #ff983f;   /* 辅助橙：渐变、已完成 */
  --color-accent-200: #929292;    /* 中灰：次要文字、禁用 */
  --color-text-100: #1d1f21;      /* 深色：标题 */
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

**设计要点**：
- 整体亮色，仅代码块和终端模拟器用深色背景
- 橙色是唯一强调色
- 圆角统一 `rounded-xl`，边框 `border-bg-300/40`

---

## 状态管理

用 Zustand 管理两个核心状态：

```typescript
// useTutorialStore.ts
interface TutorialState {
  currentStep: number              // 当前步骤
  completedSteps: Set<number>      // 已完成步骤
  quizAnswers: Record<string, string>  // 测验答案
  goStep: (i: number) => void      // 跳转（离开时自动标记完成）
  answerQuiz: (id: string, chosen: string) => void
}
```

导航方式三种：侧边栏点击 / 前进后退按钮 / `Cmd+左右箭头` 键盘快捷键。

---

## 步骤数据

```typescript
// data/steps.ts — 替换为你的教程内容
export const STEPS = [
  { id: '[step-id]', title: '[步骤标题]', subtitle: '[副标题]', tag: 'concept',  tagLabel: '概念' },
  { id: '[step-id]', title: '[步骤标题]', subtitle: '[副标题]', tag: 'practice', tagLabel: '实操' },
  { id: '[step-id]', title: '[步骤标题]', subtitle: '[副标题]', tag: 'advanced', tagLabel: '进阶' },
  { id: '[step-id]', title: '[步骤标题]', subtitle: '[副标题]', tag: 'tips',     tagLabel: '技巧' },
  // ... 建议 5-9 步
]
```

tag 类型对应不同颜色的小标签（胶囊形），显示在步骤标题上方。

---

## 可复用 UI 组件

每个步骤的课程内容（Lesson 组件）通过自由组合以下 UI 组件来构建：

### 1. CodeBlock — 代码展示

仿 macOS 终端窗口，顶部深灰标题栏有红黄绿三个圆点 + 标题 + Copy 按钮。

```tsx
<CodeBlock title="文件名或语言">
  {`代码内容`}
</CodeBlock>
```

### 2. InfoBox — 信息提示框

左侧 4px 彩色竖条 + 浅色背景 + 图标 + 标题 + 内容。三种类型：
- `tip`：灯泡图标，橙色调
- `warning`：警告三角，灰色调
- `note`：信息圈，深橙色调

```tsx
<InfoBox type="tip" title="提示标题">内容</InfoBox>
```

### 3. CompareTable — 对比表格

表头灰色背景，行悬停高亮，圆角边框。

```tsx
<CompareTable
  headers={['维度', '方案A', '方案B']}
  rows={[
    ['特点1', '...', '...'],
    ['特点2', '...', '...'],
  ]}
/>
```

### 4. Quiz — 交互式测验

选择题，点击即判定，正确绿色/错误红色，答案存入 Zustand 防止重复答题。

```tsx
<Quiz
  id="q1"
  question="问题文本？"
  options={[
    { value: 'a', label: '选项A' },
    { value: 'b', label: '选项B' },
  ]}
  correct="a"
  feedbackCorrect="答对了！..."
  feedbackWrong="再想想..."
/>
```

### 5. FlowSteps — 竖向时间轴

左侧彩色圆形图标 + 竖线连接 + 右侧标题和描述。

```tsx
<FlowSteps steps={[
  { icon: '1', color: 'blue',  title: '标题', description: '描述' },
  { icon: '2', color: 'green', title: '标题', description: '描述', isLast: true },
]} />
```

### 6. TerminalSimulator — 终端模拟器

深色背景，支持多标签页切换，内容逐行动画显示（命令行 600ms/行，输出 250ms/行）。

### 7. Diagram — SVG 架构图（可选）

节点用绝对定位的 div，连线用 SVG，支持 hover 显示 Tooltip。

### 8. JsonPreview — JSON 预览（可选）

使用 `react18-json-view`，可折叠，macOS 风格标题栏。

---

## 课程编排建议

每个 Lesson 组件的编排模式：

```tsx
export default function LessonXxx() {
  return (
    <div className="space-y-8">
      {/* 文字说明段 */}
      <section>
        <h3>小节标题</h3>
        <p>说明文字，<code>关键术语</code> 用橙色背景高亮</p>
      </section>

      {/* 交互组件段 —— 按需组合 */}
      <CompareTable ... />
      <CodeBlock ...>...</CodeBlock>
      <InfoBox ...>...</InfoBox>
      <Quiz ... />
      <FlowSteps ... />
    </div>
  )
}
```

**推荐组合**（每步选 2-4 个组件）：

| 步骤类型 | 推荐组件 |
|---------|---------|
| 概念介绍 | Diagram + FlowSteps + InfoBox |
| 对比学习 | CompareTable + InfoBox + Quiz |
| 环境配置 | CodeBlock + CompareTable + InfoBox |
| 动手实操 | CodeBlock + TerminalSimulator + FlowSteps |
| 深入原理 | CompareTable + JsonPreview + CodeBlock |
| 实战用例 | CodeBlock + InfoBox + Quiz |
| 最佳实践 | FlowSteps + CompareTable + InfoBox |

---

## 文件结构

```
src/
├── App.tsx                  # Grid 布局
├── main.tsx                 # 入口
├── index.css                # @theme + 动画
├── types/index.ts           # 类型定义
├── hooks/
│   ├── useTutorialStore.ts  # Zustand 状态
│   └── useKeyboardNav.ts    # 键盘导航
├── data/
│   ├── steps.ts             # 步骤元数据
│   └── simData.ts           # 终端模拟数据（如有）
├── components/
│   ├── Header.tsx           # 顶栏 + 进度
│   ├── Sidebar.tsx          # 侧边栏
│   ├── StepButton.tsx       # 步骤按钮（三种状态：当前/完成/未访问）
│   ├── MainContent.tsx      # 主内容区
│   ├── NavigationButtons.tsx # 前进后退
│   └── ui/                  # 可复用 UI 组件
│       ├── CodeBlock.tsx
│       ├── InfoBox.tsx
│       ├── CompareTable.tsx
│       ├── Quiz.tsx
│       ├── FlowSteps.tsx
│       └── TerminalSimulator.tsx
└── lessons/                 # 各步骤课程内容
    ├── index.ts             # 统一导出
    ├── Lesson1.tsx
    ├── Lesson2.tsx
    └── ...
```

---

## Sidebar 步骤按钮的三种视觉状态

| 状态 | 圆形徽章 | 文字 | 特殊效果 |
|------|---------|------|---------|
| 当前 | 橙底白字 | 橙色 | 左侧 3px 橙色竖条 + 数字发光阴影 |
| 已完成 | 橙底 + ✓ 图标 | 浅橙 | 无 |
| 未访问 | 灰底灰字 | 灰色 | 无 |

---

## 一句话风格描述

> 亮色主题、橙色品牌色的交互式 PPT 教程，左侧边栏导航 + 右侧内容展示，包含 macOS 风格代码块、逐行打字终端模拟器、即时反馈测验、对比表格、时间轴流程图等交互组件，支持键盘/点击/按钮三种导航方式，React 19 + Tailwind CSS v4 + Zustand 构建。
