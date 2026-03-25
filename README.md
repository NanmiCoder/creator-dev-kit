# creator-dev-kit
存放一些自媒体视频演示用的东西（演示站点、配置等）

## 目录

### [opencode-config/](./opencode-config/)
OpenCode + Oh-My-OpenCode 多 Agent 协作配置方案，通过 JieKou.AI 中转站统一管理 Claude、GPT、Gemini 等主流 AI 模型。

- [opencode.json](./opencode-config/opencode.json) - OpenCode 全局配置
- [oh-my-opencode.json](./opencode-config/oh-my-opencode.json) - Oh-My-OpenCode Agent 配置
- [Oh-My-OpenCode多Agent协作机制.md](./opencode-config/Oh-My-OpenCode多Agent协作机制.md) - 多 Agent 协作原理与实战

### [claude-agent-teams-tutorial/](./claude-agent-teams-tutorial/)
Claude Agent Teams 互动教程演示网站，基于 React + TypeScript + Tailwind CSS 构建，包含架构解析、使用场景、实战演练等交互式课程内容。

- `npm install && npm run dev` 即可本地运行

### [ipad-rescue-presentation/](./ipad-rescue-presentation/)
「吃灰两年的 iPad 被一只龙虾救活了」视频配套演示网站，展示 OpenClaw 龙虾 + WPS for Pad 的内容创作工作流。7 页互动幻灯片，React + Framer Motion + Tailwind CSS。

- `npm install && npm run dev` 即可本地运行

### [ai-vibe-working-slides/](./ai-vibe-working-slides/)
「AI 效率工具推荐」视频配套演示幻灯片，讲解 Vibe Working 工作方式——随时随地麦克风 + AI 语音输入法 + 各种 AI 工具的高效组合。10 页互动幻灯片，React + Framer Motion + Tailwind CSS。

- `npm install && npm run dev` 即可本地运行

### [prompts/](./prompts/)
视频中使用的 AI 生成提示词存档，方便复用和参考。

- [interactive-slides-generation.md](./prompts/interactive-slides-generation.md) - 交互式演示网站生成提示词（技术栈、设计规范、配色方案、文案模板）

### [social-following-exports/](./social-following-exports/)
社交平台关注列表导出与 AI 方向筛选数据，包含 X 和 GitHub 的 following 全量数据及 AI 领域过滤结果。

### [openclaw-lobster-presentation/](./openclaw-lobster-presentation/)
「OpenClaw 龙虾玩法」视频配套演示幻灯片，讲解养龙虾的三个层次（L1能用 → L2有用 → L3离不开）、四个量化指标，以及 3 个 Bot + 十几个 Skill 的实战展示。React + Framer Motion + Tailwind CSS。

- `npm install && npm run dev` 即可本地运行