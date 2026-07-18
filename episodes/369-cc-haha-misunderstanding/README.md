# 第 369 期：cc-haha 开源项目被误会

这一目录归档了第 369 期视频的可运行网页演示、口播脚本、完整口播音频与字幕。网页是一个固定 1920×1080 舞台的 Vite + React + TypeScript 项目；自动模式会播放一条连续音轨，并按录制字幕反推的绝对时间轴翻页。

## 目录内容

| 文件 | 来源映射 | 用途 |
| --- | --- | --- |
| `presentation/` | 原制作目录中的成片 `presentation/` | 可直接运行的网页演示；已排除依赖、构建产物、QA 截图与本地缓存 |
| `script.md` | 原 `script-final.md` | 录制前的七章生产稿；成片随后有显著重写和删减 |
| `outline.md` | 根据成片的 `chapters.ts`、`timeline.ts` 和各章 `narrations.ts` 整理 | 快速理解成片的章节与节拍结构 |
| `audio.mp3` | 原 `素材/完整版本/完整版本.mp3` | 后期修订后的最终完整音频 |
| `subtitles.srt` | 原 `素材/完整版本/完整版本.srt` | 后期修订后的最终字幕 |

根目录的 `audio.mp3` / `subtitles.srt` 是后期“完整版本”。网页仍使用 `presentation/public/audio/vo-full.mp3` 和 `src/registry/timeline.ts` 对应的录屏音轨；两条音轨时长同为约 6 分 05 秒，但音频内容与字幕细节经过后期修订，哈希不同。这样既保留最终制作素材，也保证 presentation 开箱即用、音画时间轴不漂移。

## 本地运行

环境要求：Node.js `^20.19.0` 或 `>=22.12.0`，以及 npm。

```bash
cd presentation
npm ci
npm run dev
```

开发服务器默认使用 <http://localhost:5174/>；如果端口被占用，请以终端输出为准。

## 播放方式

### 手动浏览

打开 <http://localhost:5174/>。点击画面、按空格或右方向键进入下一步；按左方向键或退格键返回；数字键 `1` 到 `6` 跳到对应章节。

### 完整音频自动驱动

打开 <http://localhost:5174/?auto=1>，再点击启动遮罩或按空格。页面会播放 `public/audio/vo-full.mp3`，并由 `src/registry/timeline.ts` 的 102 个绝对时间点驱动画面，完整播放约 6 分 05 秒。这是本期实际用于录屏的方式。

右上角隐藏控件或快捷键 `M` 可以在手动、分段音频、自动三种模式间切换。当前归档只包含实际成片需要的连续口播音轨，没有保留 `audio/<chapter>/<step>.mp3` 形式的分段音频，因此请用 `?auto=1` 听完整口播；中间的“音频”模式不提供完整播放。

## 构建

```bash
cd presentation
npm run build
npm run preview
```

`dist/` 与 `node_modules/` 都已在 `presentation/.gitignore` 中忽略，不应提交到 Git。

## 文稿与成片的差异

`script.md` 是录制前的七章生产稿。真人录制和网页成片随后收束为六章，Skill Vetter、最终建议与收尾等部分都有显著重写或删减，不能把它当成逐字稿。需要逐字对应最终音频时，以 `subtitles.srt` 为准；需要对应每一屏时，以各章 `narrations.ts` 为准。

## 保留与排除

归档保留了运行必需的源码、静态素材、连续音轨、脚本、TTS 辅助脚本、`package.json` 和锁文件。未复制 `node_modules/`、`dist/`、`qa*` 截图目录、`.claude/`、`.mavis/`、`.vite/`、`.DS_Store` 及其它缓存；原始真人视频、最终 MP4、封面图和音频试听实验也不属于这个可运行网页项目。
