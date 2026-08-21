# 第 389 期：DeepSeek 首个多模态模型实测

DeepSeek 发布了自己的第一个多模态模型 `deepseek-v4-flash-vision-exp`（实验版）。这一期我把它接进 DeepSeek Harness 连做了 4 个项目，又跑完了 PerceptionBench 全量 3,000 道题。本目录归档的就是这 5 组测试的**完整提示词 + 完整产出代码 + 原始评测数据**。

整轮测试 6,000 多次请求、约 1.5 亿 Token、花费约 83 元。

## 一句话结论

加上视觉之后，**前端生成和交互完成度还不错**，4 个项目都跑到了「可看、可用」；但**纯视觉理解一般**——PerceptionBench 3,000 题只有 **34.93%（1048/3000）**，插进榜单近似比较约为第 15 / 17。

## 五组测试

| # | 测试 | 考什么 | 提示词 | 代码 |
| --- | --- | --- | --- | --- |
| 00 | [DeepSeek Harness 官网截图复刻](./case-00-harness-landing-replica/) | 只给 3 张截图，不许联网，按图 1:1 还原长页面 | [prompt](./case-00-harness-landing-replica/prompt.md) | [app](./case-00-harness-landing-replica/app/) |
| 01 | [NOCTURNE ONE 沉浸式产品官网](./case-01-nocturne-one/) | 无参考图，从零做发布会级别的产品页与动效编排 | [prompt](./case-01-nocturne-one/prompt.md) | [app](./case-01-nocturne-one/app/) |
| 02 | [POLARIS 实时冷链运控后台](./case-02-polaris-cold-chain/) | 无地图 API、无组件库，做高信息密度的实时后台 | [prompt](./case-02-polaris-cold-chain/prompt.md) | [app](./case-02-polaris-cold-chain/app/) |
| 03 | [PELAGOS 3D 海上风电数字孪生](./case-03-pelagos-digital-twin/) | 真 WebGL 场景 + 操作层 + 降级方案 | [prompt](./case-03-pelagos-digital-twin/prompt.md) | [app](./case-03-pelagos-digital-twin/app/) |
| 05 | [PerceptionBench 3000 题全量实测](./case-05-perceptionbench/) | 抛开前端，只测纯视觉理解 | — | [报告](./case-05-perceptionbench/benchmark_report.md) · [原始数据](./case-05-perceptionbench/results/) · [展示页](./case-05-perceptionbench/web/) |

编号沿用录制时工作目录的编号，中间的 04 没有用上，所以这里也是跳过的。

每个 case 目录的结构都一样：

- `prompt.md`：**当时原封不动发给模型的那条提示词**，没有事后润色
- `app/`：模型产出的完整可运行代码
- `README.md`：这个 case 考什么、视频里的结论、怎么跑
- `images/`：只有 case 00 有，是喂给模型的输入截图

## 运行

环境要求：Node.js `^20.19.0` 或 `>=22.12.0`，以及 npm。

```bash
cd case-01-nocturne-one/app   # 换成任意一个 case
npm ci
npm run dev
```

四个 case 的 `app/` 和 benchmark 的展示页都在归档时重新装过依赖并 `npm run build` 通过。只有 `case-05-perceptionbench/web/` 需要用 `npm install` 代替 `npm ci`，原因写在该目录的 README 里。

各 case 的默认端口不同（case 02 固定 5199，其余走 Vite 默认），以终端输出为准。

## PerceptionBench 那部分怎么看

| 想看 | 去哪 |
| --- | --- |
| 总分、10 个分项、17 模型对比表 | [`benchmark_report.md`](./case-05-perceptionbench/benchmark_report.md) |
| 3,000 道题的逐题作答与判分理由 | [`results/*.jsonl`](./case-05-perceptionbench/results/) |
| 我对官方 eval 脚本做的唯一改动 | [`eval/resume-and-checkpoint.patch`](./case-05-perceptionbench/eval/resume-and-checkpoint.patch) |
| 完整复现步骤与参数 | [`case-05-perceptionbench/README.md`](./case-05-perceptionbench/README.md) |

⚠️ 名次口径：榜单里其他模型用 `gpt-oss-120b` 做裁判，DeepSeek API 不提供该模型，本次裁判换成了 `deepseek-v4-pro`。题目、作答提示词、裁判提示词和 0/1 计分方法都保持官方原样，但**第 15 / 17 是近似对比，不是官方同口径排名**。

## 来源映射

| 本目录 | 来源 |
| --- | --- |
| `case-00-harness-landing-replica/app/` | 工作区 `deepseek-v4-flash-vision-exp-00/标准模式/` |
| `case-00-harness-landing-replica/images/` | 工作区 `deepseek-v4-flash-vision-exp-00/images/` |
| `case-01` / `case-02` / `case-03` 的 `app/` | 工作区 `deepseek-v4-flash-vision-exp-01/02/03/` 项目根 |
| 各 `prompt.md` | 工作区对应的 `提示词.md` / `01-沉浸式产品官网.md` / `02-实时运营后台.md` / `03-3D数字孪生控制台.md` |
| `case-05-perceptionbench/results/` | 工作区 `deepseek-v4-flash-vision-exp-05/PerceptionBench/results/` |
| `case-05-perceptionbench/eval/*.patch` | 对 [MoonshotAI/PerceptionBench](https://github.com/MoonshotAI/PerceptionBench) `eval/eval.py` 的本地改动 |

未收录：`node_modules/`、`dist/`、`.vite/` 等构建产物；PerceptionBench 官方仓库与 Hugging Face 数据集（第三方资产，复现步骤见 case 05 的 README）；case 00 的另一份实现。本目录不含任何 API Key、私人联系方式或本机绝对路径。

> 脚本、音频、字幕待后续补充到本目录。
