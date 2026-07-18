# 第 367 期：Vibe Coding 的后遗症

这是一份可独立运行的网页视频工程。画面由 Vite + React 驱动，自动播放使用按口播节拍切好的逐步骤音频。

## 内容

- `presentation/`：成片使用的 6 章、39 个视觉与音频步骤前端工程。
- `script.md`：36 段完整口播稿，并标注运行时的开场细分方式。
- `outline.md`：章节、画面和音频步骤计划。
- `audio.mp3`：1× 语速完整口播音轨，时长约 313.101 秒。
- `subtitles.srt`：与完整 1× 音轨匹配的最终字幕。

## 来源映射

| 本目录 | 原始第 367 期工作区中的来源 |
| --- | --- |
| `presentation/` | `presentation/` |
| `script.md` | `script.md` |
| `outline.md` | `outline.md` |
| `audio.mp3` | `vibe_coding_tts_1x.mp3` |
| `subtitles.srt` | `vibe_coding_tts_1x.srt` |

根目录完整音轨用于直接查看和二次创作；网页运行时实际加载 `presentation/public/audio/<chapter>/<step>.mp3` 下的 39 个分段音轨。原工作区中另有 1.25× 加速版，本目录选择与 outline 标注的 313.1 秒时长一致的 1× 最终版。

## 启动

需要 Node.js `^20.19.0` 或 `>=22.12.0`，以及 npm：

```bash
cd presentation
npm ci
npm run dev
```

默认打开 <http://localhost:5174/> 可手动浏览；如果端口被占用，请以终端输出为准。点击画面、按 `Space` 或 `→` 前进，按 `←` 或 `Backspace` 后退；`Home` / `End` 跳到首尾，数字键 `1`–`6` 跳到对应章节。

## 音频驱动与自动播放

- <http://localhost:5174/?audio=1>：播放当前步骤音频，但仍由你手动翻页。
- <http://localhost:5174/?auto=1>：按一次 `Space` 或点击启动遮罩后，逐段播放音频，并在每段结束后自动进入下一画面。

生产构建：

```bash
npm run build
```

归档时仅清理了 narration 提取正则和一处过期代码注释，未改动章节、画面或音频内容。
