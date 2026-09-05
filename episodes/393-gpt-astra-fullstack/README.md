# 第 393 期：GPT-ASTRA 全栈实测

本期分享两道全栈题的**完整英文提示词**、**GPT-ASTRA 案例代码**和**自动化测试**，可以下载后在本机运行，也可以把提示词交给其他模型复测。目录沿用[第 392 期](../392-claude-fable-5-1-vs-gpt-5-6-sol/README.md)按题目、模型归档的结构。

这里保存的是本期提供的两个实验目录的最终版本，包含实验过程中的后续完善；提示词中的 15 / 25 分钟是挑战要求，不代表归档代码仅包含限时内的第一版产出。GPT-ASTRA 沿用实验目录中的模型名称。

## 两个案例

| # | 案例 | 主要内容 | 完整提示词 | 代码与英文说明 |
| --- | --- | --- | --- | --- |
| 01 | Folio 响应式电子表格 | 手写公式引擎、依赖图、增量重算、循环检测、撤销重做、后端保存 | [prompt.md](./case-01-reactive-spreadsheet/prompt.md) | [gpt-astra/](./case-01-reactive-spreadsheet/gpt-astra/) |
| 02 | Relay 多机器人仓库 | 时空 A*、路径预约、碰撞保护、动态封路、SSE 状态同步、断线恢复 | [prompt.md](./case-02-multi-robot-warehouse/prompt.md) | [gpt-astra/](./case-02-multi-robot-warehouse/gpt-astra/) |

提示词按原文件逐字保留。表格题的挑战时间为 15 分钟，仓库题为 25 分钟。各项目的 `tests/` 随代码一起公开，归档验证的范围和结果见 [VALIDATION.md](./VALIDATION.md)。

## 安装与启动

需要 **Node.js 22.12+ 和 npm**，建议使用 Node.js 22 或 24。两个项目独立安装和运行，**无需 API Key、数据库服务或 `.env` 文件**。首次启动会从源码内的默认示例生成运行状态，不需要复制录制时的存档。

以下命令从 `creator-dev-kit` 仓库根目录执行；也可以直接在对应的 `gpt-astra/` 文件夹打开终端。

### Case 01：电子表格

```bash
cd episodes/393-gpt-astra-fullstack/case-01-reactive-spreadsheet/gpt-astra
npm ci
npm run dev
```

打开 [http://localhost:5173](http://localhost:5173)。此命令同时启动 Vite 前端和 3001 端口的后端，前端自动代理 `/api`。

### Case 02：多机器人仓库

在另一个从仓库根目录打开的终端执行：

```bash
cd episodes/393-gpt-astra-fullstack/case-02-multi-robot-warehouse/gpt-astra
npm ci
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。前端、后端和 SSE 共用此端口。首次打开处于暂停状态，包含 8 台机器人、96 个货架、4 个工作站和 4 个示例任务，点击“运行仿真”或“单步执行”即可观察。

两个案例使用的默认端口互不冲突，可以同时运行。若已启动第 392 期或其他项目，请先停止占用 3000、3001 或 5173 的服务。每个终端用 `Ctrl+C` 停止服务。

### 测试与生产运行

在任意案例的 `gpt-astra/` 目录中执行：

```bash
npm test
npm run build
npm start
```

先停止同一案例的开发服务，再启动生产服务。`npm start` 需要事先完成 `npm run build`。

| 案例 | 开发页面 | 生产页面 | 运行时存档 |
| --- | --- | --- | --- |
| Folio | [localhost:5173](http://localhost:5173) | [127.0.0.1:3001](http://127.0.0.1:3001) | `data/workbook.json` |
| Relay | [localhost:3000](http://localhost:3000) | [localhost:3000](http://localhost:3000) | `data/simulation.json` |

生产模式由 Express 同时提供静态页面和 API；上述 npm 命令不依赖 Unix shell 的环境变量赋值写法，Windows、macOS 和 Linux 可使用相同命令；本次实际验证平台见验证记录。可选的 `PORT`、`DATA_FILE` 等环境变量及设置方式见项目各自的 README；Folio 的开发代理默认固定为后端 3001，调整后端端口时需同步修改 `vite.config.ts`。

## 跟着视频复现

### 表格：依赖、循环与持久化

1. 在空白的 J 列从 J1 开始粘贴下面四行，J4 应为 `7`：

   ```text
   2
   =J1+1
   =J2*2
   =J3+1
   ```

2. 将 J1 改为 `5`，J2、J3、J4 应依次变为 `6`、`12`、`13`。选择 J2，查看引用和依赖高亮。
3. 将 J1 改为 `=J3`，J1:J3 形成循环，J4 也应传播 `#CYCLE!`。
4. 使用工具栏撤销、重做，再撤销一次恢复数值。
5. 等待“所有更改已保存”后刷新页面，确认原始公式和计算结果仍然正确。

该表格支持 `SUM`、`AVG`、`ROUND`、`IF` 等公式，但不实现完整 Excel 兼容性。复制公式保留原始引用，不会自动平移相对引用；撤销历史只在当前会话保留。默认示例中的错误单元格用于展示错误传播。

### 仓库：并发任务、封路与重连

1. 点击“创建任务”，连续创建至少三个货架到工作站的任务，再启动模拟。
2. 选择机器人卡片或右键地图中的机器人，查看位置、任务和路径；暂停后可以单步检查移动。
3. 左键点击机器人前方的可通行格子封路，观察路径重算，再次点击解除；不要点击货架或墙。
4. 刷新或关闭后重新打开页面，核对任务、位置和底部的状态序号。页面关闭时，运行中的后端会继续推进模拟。
5. “重置仿真”经确认后恢复固定地图和四个示例任务；也可测试地图全屏、速度切换和任务筛选。

此实现使用有限规划窗口的优先级调度。封死目的地、通道或机器人归位点会使任务等待，并不保证任意地图都能完成所有任务。具体算法和边界见 [Relay README](./case-02-multi-robot-warehouse/gpt-astra/README.md)。

## 归档来源与调整

| 源实验目录 | 分享目录 |
| --- | --- |
| `GPT-ASTRA-fullstack-exp-01/` | `case-01-reactive-spreadsheet/gpt-astra/` |
| `GPT-ASTRA-fullstack-exp-02/` | `case-02-multi-robot-warehouse/gpt-astra/` |

原目录的 `PROMPT.md` 分别移到各 case 下的 `prompt.md`。保留前后端源码、默认示例、测试、配置、锁文件和项目说明；本次为便于分享做了这些调整：

- 增加中文运行入口、复现步骤和验证记录，安装命令统一为 `npm ci`。
- 在 `package.json` 和锁文件声明统一的 Node.js 22.12+ 要求。
- 将锁文件的镜像下载地址换成公开的 npm 官方 registry，包版本和 integrity 校验值保持一致。
- Relay 的生产命令改为 `node dist/server/index.js --production`，后端识别该标志并保留 `NODE_ENV=production` 支持，消除默认启动命令对 Unix shell 写法的依赖。
- 增加本期 `.gitignore`，排除依赖、构建产物、运行存档、环境变量、密钥文件、浏览器和 Agent 本机状态。

未复制 `node_modules/`、`dist/`、`dist-server/`、录制时的 `data/`、日志、截图、录屏或视频制作素材。`data/` 由后端自动建立；要恢复首次运行状态，先停止服务，备份后删除对应存档，再重新启动即可。两个项目都按单机、单进程示例使用，同一状态文件只由一个后端访问。

```text
393-gpt-astra-fullstack/
  README.md
  VALIDATION.md
  .gitignore
  case-01-reactive-spreadsheet/
    prompt.md
    gpt-astra/
  case-02-multi-robot-warehouse/
    prompt.md
    gpt-astra/
```
