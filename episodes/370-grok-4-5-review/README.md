# 第 370 期：Grok 4.5 实测

这是一份可独立运行的网页视频工程。画面由 Vite + React 驱动，真人口播使用一条连续音轨，页面按最终 SRT 提取的绝对时间轴自动翻页。

## 内容

- `presentation/`：成片使用的 8 章、64 个视觉节点前端工程。
- `script.md`：按最终真人口播与成片整理的逐字稿，不是前期旧草稿。
- `outline.md`：成片章节、视觉节点和时间轴计划。
- `audio.mp3`：完整口播音轨，时长约 259.422 秒。
- `subtitles.srt`：与完整口播匹配的最终字幕。

## 来源映射

| 本目录 | 原始第 370 期工作区中的来源 |
| --- | --- |
| `presentation/` | `presentation/` |
| `script.md` | `script.md`（最终口播整理版） |
| `outline.md` | `outline.md` |
| `audio.mp3` | `视频素材/音频和字幕/音频和字幕.mp3` |
| `subtitles.srt` | `视频素材/音频和字幕/音频和字幕.srt` |

`audio.mp3` 与 `presentation/public/audio/vo-full.mp3` 内容相同：前者方便直接查看和二次创作，后者是网页运行时实际加载的文件。

## 启动

需要 Node.js `^20.19.0` 或 `>=22.12.0`，以及 npm：

```bash
cd presentation
npm ci
npm run dev
```

默认打开 <http://localhost:5174/> 可手动浏览；如果端口被占用，请以终端输出为准。点击画面、按 `Space` 或 `→` 前进，按 `←` 或 `Backspace` 后退；`Home` / `End` 跳到首尾，数字键 `1`–`8` 跳到对应章节。

## 音频驱动与自动播放

打开 <http://localhost:5174/?auto=1>，再按一次 `Space` 或点击启动遮罩。网页会连续播放 `public/audio/vo-full.mp3`，并依据 `src/registry/timeline.ts` 中来自最终 SRT 的绝对时间点自动切换全部 64 个画面节点。

这是 VO-First 连续音轨工程，没有逐节点音频文件。因此 `?audio=1` 的分段音频模式不适用于这份成片；请使用 `?auto=1` 获得完整音画同步效果。

生产构建：

```bash
npm run build
```
