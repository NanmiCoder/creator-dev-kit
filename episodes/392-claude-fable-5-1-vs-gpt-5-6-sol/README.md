# 第 392 期：Claude Fable 5.1 vs GPT-5.6-SOL 全栈实测

这一期让 Claude Fable 5.1 和 GPT-5.6-SOL 从空目录出发，分别完成两道相同的限时全栈题。本目录公开归档两份**原始英文提示词**、四份**模型产出源码**和最终的[逐项测试报告](./REPORT.md)，方便其他人使用同一套题复测不同模型。

## 两道题与四份实现

| # | 测试 | 主要考察 | 原始提示词 | GPT-5.6-SOL | Claude Fable 5.1 |
| --- | --- | --- | --- | --- | --- |
| 01 | Reactive Spreadsheet Engine | 手写公式解析、依赖图、增量重算、循环与错误传播、持久化 | [prompt](./case-01-reactive-spreadsheet/prompt.md) | [源码](./case-01-reactive-spreadsheet/gpt-5.6-sol/) | [源码](./case-01-reactive-spreadsheet/claude-fable-5.1/) |
| 02 | Multi-Robot Warehouse Scheduling | 时空寻路、碰撞与对穿保护、动态封路、实时流、恢复与压力稳定性 | [prompt](./case-02-multi-robot-warehouse/prompt.md) | [源码](./case-02-multi-robot-warehouse/gpt-5.6-sol/) | [源码](./case-02-multi-robot-warehouse/claude-fable-5.1/) |

两边收到的题目内容一致，且两题互不继承代码和上下文。题目 01 的硬时限是 15 分钟，题目 02 是 25 分钟。

## 实测结论

| 题目 | GPT-5.6-SOL | Claude Fable 5.1 | 完成度更高 |
| --- | ---: | ---: | --- |
| Reactive Spreadsheet | 91/100 | 96/100 | Claude Fable 5.1 |
| Multi-Robot Warehouse | 78/100 | 97/100 | Claude Fable 5.1 |

- 表格题的硬性功能两边都完成了。GPT-5.6-SOL 的视觉更突出；Claude Fable 5.1 的公式覆盖、默认数据和测试深度更完整。
- 仓库题的标准三任务路径两边都通过。额外压力测试中，Claude Fable 5.1 完成 8/8 和 40/40；GPT-5.6-SOL 在工作站被复用后停在 4/8，出现永久等待。

测试矩阵、复现数据、死锁根因和详细评分见 [`REPORT.md`](./REPORT.md)。报告中的分数是本期实测口径，不是官方 benchmark 分数。

## 直接运行

环境要求：Node.js 20+ 和 npm。进入任意实现目录后执行：

```bash
npm ci
npm run dev
```

| 实现目录 | 开发页面 | 后端 |
| --- | --- | --- |
| `case-01-reactive-spreadsheet/gpt-5.6-sol/` | `http://localhost:5173` | `http://localhost:3001` |
| `case-01-reactive-spreadsheet/claude-fable-5.1/` | `http://127.0.0.1:4021` | `http://localhost:3001` |
| `case-02-multi-robot-warehouse/gpt-5.6-sol/` | `http://localhost:5173` | `http://localhost:3001` |
| `case-02-multi-robot-warehouse/claude-fable-5.1/` | `http://localhost:4821` | `http://localhost:4022` |

各实现保留了模型原始端口设置，因此默认应一次运行一个项目。更完整的操作方法、测试命令和生产启动方式见各实现自己的 README。

统一验证方式：

```bash
npm run build
```

表格项目和 GPT-5.6-SOL 仓库项目还提供 `npm test`；Claude Fable 5.1 仓库项目使用 `npm run selftest`。所有四份归档均重新使用锁文件安装依赖并完成生产构建。

## 归档边界

本目录保留：

- 两道题原封不动的英文提示词
- 四份实现的前端、后端、测试和配置源码
- `package-lock.json` 与模型生成的项目 README
- 本期额外黑盒测试和压力测试报告

未收录：

- `node_modules/`、`dist/`、`dist-server/`、`.vite/` 等可重新生成的依赖和构建产物
- `data/workbook.json`、`data/state.json`、`server/data/state.json` 等运行时状态
- 日志、QA 截图、临时文件、本机浏览器状态和本机绝对路径

运行时数据会在首次编辑、创建任务或保存状态时自动生成；需要重新测试时删除对应状态文件即可回到空白或确定性初始状态。

## 目录结构

```text
case-01-reactive-spreadsheet/
  prompt.md
  gpt-5.6-sol/
  claude-fable-5.1/
case-02-multi-robot-warehouse/
  prompt.md
  gpt-5.6-sol/
  claude-fable-5.1/
REPORT.md
```
