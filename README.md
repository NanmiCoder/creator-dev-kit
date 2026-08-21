# creator-dev-kit

这里公开归档视频中实际使用过的网页演示、口播脚本、音频和 SRT 字幕，以及模型实测用的完整提示词与产出代码。大多数期数是独立网页 PPT：进入对应目录安装依赖，就能查看手动模式或音频驱动模式；第 368 期只保留视频中的 Three.js demo，第 389 期是模型实测归档（提示词 + 产出代码 + 原始评测数据）。

## 近期视频制作素材

| 期数 | 视频主题 | 可运行项目 | 音频驱动 |
| --- | --- | --- | --- |
| 364 | [GPT-5.6 发布](./episodes/364-gpt-5-6-release/) | 8 章、36 步 React 演示 | 连续音轨 + SRT 绝对时间轴 |
| 365 | [我的自媒体视频制作方式](./episodes/365-self-media-video-workflow/) | 9 章、68 步 React 演示 | 连续音轨 + SRT 绝对时间轴 |
| 366 | [开源项目免费获得 6 个月 Codex](./episodes/366-open-source-six-months-codex/) | 7 章、137 个视觉节点 React 演示 | 连续音轨 + SRT 绝对时间轴 |
| 367 | [Vibe Coding 的后遗症](./episodes/367-vibe-coding-aftereffects/) | 6 章、39 步 React 演示 | 逐步音频自动播放 |
| 368 | [GPT-5.6 Sol 实测](./episodes/368-gpt-5-6-sol-review/) | 视频中的 Three.js 帆船 demo | 源工作区未找到整期音频驱动 PPT |
| 369 | [cc-haha 开源项目被误会](./episodes/369-cc-haha-misunderstanding/) | 6 章、102 步 React 演示 | 连续音轨 + SRT 绝对时间轴 |
| 370 | [Grok 4.5 实测](./episodes/370-grok-4-5-review/) | 8 章、64 个视觉节点 React 演示 | 连续音轨 + SRT 绝对时间轴 |
| 371 | [Kimi K3 实测](./episodes/371-kimi-k3-review/) | 8 章、48 个视觉节点 React 演示 | 连续音轨 + SRT 绝对时间轴 |
| 385 | [DeepSeek Harness Agent Teams 协作原理](./episodes/385-deepseek-harness-agent-teams/) | 交互式讲解页：13 步可播放全过程 + 流程图 / 时序图 / 数据结构 | 无音轨（手动 + 快捷键推进，供录屏口播） |
| 389 | [DeepSeek 首个多模态模型实测](./episodes/389-deepseek-v4-flash-vision/) | 4 个 case 的完整提示词与可运行代码 + PerceptionBench 3000 题原始数据 | 无音轨（实测归档，非网页 PPT） |

点进每一期可以看到：

- `presentation/`：可运行的网页演示源码；第 368 期只有视频中实际展示的 `demo/`。
- `script.md`：最终录制脚本或按成片整理的口播稿。
- `outline.md`：章节、画面节拍和音画关系。
- `audio.mp3`：从该期制作目录抽出的完整音频。
- `subtitles.srt`：与完整音频匹配的字幕。
- `README.md`：该期的来源映射、差异说明和精确运行方式。

第 389 期是实测归档而非网页 PPT，目录按 case 拆分：每个 case 一份 `prompt.md`（原封不动的提示词）加一份可运行的 `app/`，另有 PerceptionBench 3,000 题的原始逐题数据。

## 快速运行

环境要求：Node.js `^20.19.0` 或 `>=22.12.0`，以及 npm。

大多数期数可以这样启动：

```bash
cd episodes/<episode>/presentation
npm ci
npm run dev
```

直接打开 Vite 输出的地址是手动模式；支持连续真人口播的项目可在地址后加 `?auto=1`，再点击启动遮罩或按空格，由完整音频和 SRT 时间轴自动驱动画面。第 367 期使用逐步音频，同样支持 `?auto=1`。各期的端口、快捷键和音频差异以目录内 README 为准。

构建检查：

```bash
npm run build
```

仓库不跟踪 `node_modules/`、`dist/`、QA 截图、Agent 本机配置、缓存和原始视频工程。音频与 SRT 是公开制作素材；每期收录前都单独检查过凭据、私人联系方式和本机绝对路径。

## 其它演示站点

| 项目 | 说明 | 技术栈 | 运行 |
| --- | --- | --- | --- |
| [claude-agent-teams-tutorial/](./claude-agent-teams-tutorial/) | Claude Agent Teams 互动教程 | React + TS + Tailwind | `npm i && npm run dev` |
| [ipad-rescue-presentation/](./ipad-rescue-presentation/) | iPad 龙虾救活视频配套 · 7 页 | React + Framer Motion | `npm i && npm run dev` |
| [ai-vibe-working-slides/](./ai-vibe-working-slides/) | AI 效率工具推荐视频配套 · 10 页 | React + Framer Motion | `npm i && npm run dev` |
| [openclaw-lobster-presentation/](./openclaw-lobster-presentation/) | OpenClaw 龙虾玩法视频配套 | React + Framer Motion | `npm i && npm run dev` |

## 可复用 Skills

| Skill | 说明 |
| --- | --- |
| [web-video-presentation](./skills/web-video-presentation/) | 把口播稿或文章制作成可录屏的 16:9 网页演示，包含脚手架、主题、时间轴生成和校验工具 |
| [voice-clone-tts](./skills/voice-clone-tts/) | 把口播文案分段合成为配音音频，可选输出与音频精确对齐的 SRT 字幕 |

## 提示词、配置与数据

| 项目 | 说明 |
| --- | --- |
| [prompts/](./prompts/) | AI 生成提示词存档 |
| [opencode-config/](./opencode-config/) | OpenCode + Oh-My-OpenCode 多 Agent 协作配置 |
| [social-following-exports/](./social-following-exports/) | X / GitHub 关注列表导出与 AI 方向筛选 |
