# 第 365 期：我的自媒体视频制作方式

这一期用一条真实制作链路演示：先确定口播和时间轴，再让 Agent 制作 16:9 网页演示，经过多模态 review 后用音频驱动自动播放，最后录屏并与必要的软件实录混剪成片。

## 目录内容

| 路径 | 内容 | 来源映射 |
|---|---|---|
| `presentation/` | 9 章、68 个画面节拍的 Vite + React + TypeScript 网页演示 | 原制作目录的 `presentation/`，已移除依赖、构建产物和临时文件 |
| `script.md` | 录制前的最终分章节生产稿，包含画面方向、后期补充和口播正文；逐字成片以 SRT 为准 | `口播脚本-重构版-分章节录制版.md` |
| `outline.md` | 网页演示的 9 章开发计划与 SRT cue 映射 | 原制作目录的 `outline.md` |
| `audio.mp3` | 最终成片的完整音频，约 10 分 26 秒 | `完整视频/完整视频.mp3` |
| `subtitles.srt` | 与完整成片音频匹配的字幕；时轴收尾约 10 分 25 秒，文件末尾另有后追加的乱序校正 cue | `完整视频/完整视频.srt` |

`presentation/public/audio/vo-full.mp3` 是网页演示段使用的连续口播，约 5 分 21 秒。它和 `src/registry/timeline.ts` 的绝对时间点一起驱动 68 个画面节拍。根目录的 `audio.mp3` / `subtitles.srt` 则保留最终混剪成片的完整版本；后半段包含实际操作录屏，因此不由这个网页 presentation 继续播放。

## 本地启动

需要 Node.js `^20.19.0` 或 `>=22.12.0`，以及 npm。

```bash
cd presentation
npm ci
npm run dev
```

然后打开终端里 Vite 给出的本地地址。默认是 `http://localhost:5678/`；如果端口被占用，请以终端实际地址为准。

## 播放方式

### 自动播放（推荐）

打开：

```text
http://localhost:5678/?auto=1
```

进入后按空格或点击启动页。浏览器会播放 `public/audio/vo-full.mp3`，并按照 `src/registry/timeline.ts` 自动切换画面。这就是本期录制网页段时使用的音频驱动方式。

### 手动预览

直接打开不带参数的地址：

```text
http://localhost:5678/
```

- 点击画面、按空格或右方向键：下一步
- 左方向键或 Backspace：上一步
- `Home` / `End`：跳到开头 / 结尾
- 数字键 `1` 到 `9`：跳到对应章节
- `M`：依次切换 Manual / Audio / Auto

`?audio=1` 是脚手架保留的“逐 step 音频”模式，需要 `public/audio/<chapter-id>/<step>.mp3`。这一期没有保存逐 step 音频，只保留了连续口播，所以请使用 `?auto=1` 体验完整的音频驱动播放。

## 构建

```bash
cd presentation
npm run build
```

构建产物会生成到 `presentation/dist/`，该目录不纳入 Git 跟踪。

## 说明

- 主题为 `midnight-press` 暗色印刷风格。
- 网页 presentation 是最终视频中的“解释与抽象演示”部分；Skill 安装、SRT 生成、AgentTeams、多模态 review 和录屏软件等信任关键动作在成片中使用真实操作录屏补充。
- 仓库不包含 `node_modules/`、`dist/`、QA 截图、缓存或本机 Agent 配置；安装依赖后即可运行。
- 归档时只清理了 narration 提取脚本的一处无效转义，未改动成片内容。
