# 第 364 期：GPT-5.6 发布

这一期围绕 GPT-5.6 Sol、Terra、Luna 的受限发布、跑分、第三方评估和开发者选型展开。网页演示采用 React + Vite，使用一条完整真人口播音频和 SRT 派生的绝对时间轴驱动 8 章 36 步画面。

## 素材

- `presentation/`：可独立运行的网页演示项目。
- `audio.mp3`：最终连续口播音频，约 5 分 03 秒。
- `subtitles.srt`：与该口播音频匹配的逐字字幕。
- `script.md`：按最终网页演示章节归一化的成片口播稿。
- `outline.md`：按最终 8 章 36 步整理的成片结构和音画关系。

## 运行

需要 Node.js `^20.19.0` 或 `>=22.12.0`，以及 npm。

```bash
cd presentation
npm ci
npm run dev
```

终端会输出本地访问地址，默认是 `http://localhost:5174/`；如果端口被占用，请以终端输出为准。

默认进入手动模式，可点击画面或使用方向键推进。按 `M` 可在 Manual、Audio、Auto 三种模式间循环。

### 用完整音频自动驱动

打开：

```text
http://localhost:5174/?auto=1
```

页面出现启动遮罩后，按空格或点击遮罩开始。浏览器会播放 `public/audio/vo-full.mp3`，并按 `src/registry/timeline.ts` 中的绝对时间自动翻页。

本期只提供完整连续口播和 Auto 时间轴；`?audio=1` 的逐步音频预览模式需要额外生成 `public/audio/<chapter>/<step>.mp3`，因此不是本期的推荐播放方式。

生产构建：

```bash
npm run build
```

## 来源文件映射

| 仓库文件 | 原始来源 | 选择依据 |
|---|---|---|
| `presentation/` | `364 - GPT5.6发布/presentation/` | 源码明确标注“GPT-5.6 发布 · 8 章 / 36 步”，并实际引用连续口播和绝对时间轴 |
| `audio.mp3` | `presentation/public/audio/vo-full.mp3` | 与网页运行时加载的音频完全相同 |
| `subtitles.srt` | `音频字幕版本/音频字幕版本.srt` | 包含完整收尾字幕，与网页口播和 302.733 秒音频匹配 |
| `script.md` | `presentation/src/chapters/*/narrations.ts` | 这些文件是最终画面 step 与口播正文的真相源 |
| `outline.md` | `presentation/src/registry/chapters.ts`、`timeline.ts` | 以最终章节注册表和 SRT 派生的绝对时间轴为准 |

源目录中的 `skill-explainer-video/` 讲的是 `web-video-presentation` skill 本身，内容为 7 章 44 步、主题尚未确定，也没有对应成片前端；它不是本期 GPT-5.6 成片素材，因此未收入。

## 已排除内容

未复制 `node_modules/`、`dist/`、QA 截图/报告、`.claude/`、`.mavis/`、日志、缓存和 macOS 临时文件。`presentation/audio-src/vo-full.mp3` 是 365 秒的旧原始录音，和最终 302.733 秒音频不一致，也未收入。

归档时仅做了 React Hooks / ESLint 兼容修复和 narration 提取正则清理；章节、画面、时间轴与音频内容没有重写。
