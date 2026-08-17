# 第 385 期：DeepSeek Harness Agent Teams 协作原理

这一期讲解我们开源的 [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) 插件：它把当前的 DeepSeek Harness 会话变成一支真正协作的多智能体团队。本目录是视频中用来讲「协作原理」的那段交互式网页演示。

和其他期的「音频驱动网页 PPT」不同，这一份是**纯手动 / 交互式讲解页**：没有配音音轨，画面由你点击或按键推进，适合对着它口播录屏，也适合观众自己点着玩。

## 这一页在讲什么

- 队长（就是你正在对话的那个会话）怎么拉起成员、拆任务、派发；
- 成员与成员之间怎么绕过队长直接通信；
- 任务做完怎么落盘、怎么 steer 回队长；
- 底层数据结构：`team.json` + `inbox/*.jsonl`，以及 `attempt_id` 票据怎么保证多 Agent 并发不串。

页面里的流程、字段、状态机都严格对齐插件源码，没有占位假数据。

## 跑起来（本地查看原理）

环境要求：Node.js `^20.19.0` 或 `>=22.12.0`，以及 npm。

```bash
cd presentation
npm ci
npm run dev
```

打开终端里 Vite 输出的地址，默认是 <http://localhost:5185/>（端口被占用时以终端输出为准）。

## 怎么操作

页面分几个区块，录屏 / 自学都按这个顺序往下走：

| 区块 | 内容 |
| --- | --- |
| 首屏 | 一页总览流程图：队长 → 共享任务池/调度器 → 成员，三条链路 + 磁盘真相层 |
| 全过程 | **13 步可播放**：左边参与者 + 任务依赖图，右边同步高亮 `team.json` / 各 `inbox/*.jsonl` 这一步的真实改动 |
| 三条链路 | 三个时序图：队长派活 / 成员互聊 / 完成汇报 |
| 数据结构 | 目录树 + `TeamTask` / `TeamMessage` 逐字段 + 一条消息的生命周期 |
| 一致性 | 任务状态机 + `attempt_id` 票据如何挡住迟到写入 |
| 工具集 | 10 个 `agent_teams_*` 工具的参数、返回与边界 |

「全过程」区块的快捷键：

- `Space`：自动播放 / 暂停
- `→` / `←`：前进 / 后退一步
- `R`：回到开头重播
- 也可以点顶部 13 段进度条直接跳到任意一步

## 构建

普通构建：

```bash
npm run build
```

生成一个**自包含的单文件** `dist/index.html`（脚本、样式、字体、图片全部内联），双击就能离线打开，录屏最省事：

```bash
npm run build:single
```

## 技术栈

Vite + React 19 + Tailwind CSS v4 + Motion + Geist。白底 + 橙色主色（`#FF6600`）。成员头像复用插件自带的 DeepSeek 小鲸鱼职业形象。

## 来源映射

| 本目录 | 来源 |
| --- | --- |
| `presentation/` | 视频工作区 `385 - DeepSeek-Harness-AgentTeams插件/agent-teams-explainer/` 的完整源码 |
| 协作机制、字段、状态机 | 插件源码 `dsh-agent-teams/src/{tools,state,scheduler,members}.ts` |
| 鲸鱼头像 | 插件 `assets/agent-teams/` 里的 role 插画 |

> 脚本、音频、字幕待本期录制完成后补充到本目录。
