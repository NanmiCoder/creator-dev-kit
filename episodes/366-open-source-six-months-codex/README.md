# 第 366 期：开源项目免费获得 6 个月 Codex

这是一份可独立运行的网页视频工程。最终成片采用 `midnight-press` 暗色印刷版本，真人口播使用一条连续音轨，页面按最终 SRT 提取的绝对时间轴自动翻页。

## 内容

- `presentation/`：成片使用的 7 章、137 个视觉节点前端工程。
- `script.md`：按最终口播整理的录制脚本。
- `outline.md`：章节、内容与时间轴计划，并补充最终实现的节点数。
- `audio.mp3`：完整口播音轨，时长约 355.291 秒。
- `subtitles.srt`：与完整口播匹配的最终字幕。

## 来源映射

| 本目录 | 原始第 366 期工作区中的来源 |
| --- | --- |
| `presentation/` | `presentation-midnight-demo/`（与最终 `PPT版本.mp4` 画面一致的完整版本） |
| `script.md` | `script.md` |
| `outline.md` | `outline.md` |
| `audio.mp3` | `视频素材/视频素材.mp3` |
| `subtitles.srt` | `视频素材/视频素材.srt` |

原工作区中的旧 `presentation/` 是早期 `creator-dark` 版本，缺少第 06/07 章实现，未收录。`audio.mp3` 与 `presentation/public/audio/vo-full.mp3` 内容相同：前者方便直接查看和二次创作，后者是网页运行时实际加载的文件。

## 启动

需要 Node.js `^20.19.0` 或 `>=22.12.0`，以及 npm：

```bash
cd presentation
npm ci
npm run dev
```

默认打开 <http://localhost:5174/> 可手动浏览；如果端口被占用，请以终端输出为准。点击画面、按 `Space` 或 `→` 前进，按 `←` 或 `Backspace` 后退；`Home` / `End` 跳到首尾，数字键 `1`–`7` 跳到对应章节。

## 音频驱动与自动播放

打开 <http://localhost:5174/?auto=1>，再按一次 `Space` 或点击启动遮罩。网页会连续播放 `public/audio/vo-full.mp3`，并依据 `src/registry/timeline.ts` 中来自最终 SRT 的绝对时间点自动切换全部 137 个画面节点。

这是 VO-First 连续音轨工程，没有逐节点音频文件。因此 `?audio=1` 的分段音频模式不适用于这份成片；请使用 `?auto=1` 获得完整音画同步效果。

生产构建：

```bash
npm run build
```

归档时仅修正了一处时间轴注释，未改动章节、视觉节点、音频或实际时间点。
