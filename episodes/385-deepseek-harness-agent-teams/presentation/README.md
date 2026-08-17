# DeepSeek Harness Agent Teams 协作原理 · 交互演示

把当前 DeepSeek Harness 会话变成一支协作多智能体团队的 [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) 插件，这一页用来可视化讲清它的协作原理。内容严格对齐插件源码（`tools.ts` / `state.ts` / `scheduler.ts` / `members.ts`）。

## 快速开始

需要 Node.js `^20.19.0` 或 `>=22.12.0` 和 npm：

```bash
npm ci
npm run dev
```

打开 <http://localhost:5185/>。

操作：`Space` 播放/暂停 · `→` / `←` 切步 · `R` 重播。

## 构建

```bash
npm run build         # 普通构建
npm run build:single  # 自包含单文件 dist/index.html（双击离线打开，录屏用）
```
