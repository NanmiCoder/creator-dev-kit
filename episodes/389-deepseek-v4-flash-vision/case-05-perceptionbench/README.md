# Case 05 · PerceptionBench 3000 题全量实测

前面四个 case 看的是「视觉 + 前端」的综合产出，这一个只看纯视觉理解：把 `deepseek-v4-flash-vision-exp` 放进 Kimi 开源的 [PerceptionBench](https://github.com/MoonshotAI/PerceptionBench) 跑完全部 3,000 道题。

**结果：34.93%（1048 / 3000）**，插进该仓库 README 的榜单做近似比较约为第 15 / 17。完整分项、口径说明和对比表见 [`benchmark_report.md`](./benchmark_report.md)。

> 口径提醒：榜单里其他模型用 `gpt-oss-120b` 做裁判，DeepSeek API 不提供该模型，本次裁判换成了该端点内最强的 `deepseek-v4-pro`。所以这个名次是近似对比，不是官方同口径排名。

## 这个目录里有什么

| 路径 | 内容 |
| --- | --- |
| [`benchmark_report.md`](./benchmark_report.md) | 评测报告：总分、10 个分项、17 模型对比表、运行参数与完整性检查 |
| [`results/*.jsonl`](./results/) | 3,000 行原始逐题记录：模型作答、裁判 0/1 判分、判分理由 |
| [`results/*_scores.json`](./results/) | 脚本直接产出的总分与分项得分 |
| [`results/full_run.log`](./results/full_run.log) | 完整跑批日志，末尾含 `real 8180.86` 秒的实际耗时 |
| [`eval/resume-and-checkpoint.patch`](./eval/resume-and-checkpoint.patch) | 我对官方 `eval/eval.py` 的唯一改动 |
| [`web/`](./web/) | 结果展示页：雷达图 + 可排序的 17 模型对比表 |

题目、作答提示词、裁判提示词和 0/1 计分方法全部保持官方原样，没有改。

## 那个 patch 改了什么

官方 `eval.py` 把 3,000 道题的结果攒在内存里，跑完才一次性写盘。一轮完整评测是 6,000 次 API 调用、两个多小时，中途被限流或断掉就得从头再花一遍钱。patch 做了三件事：

1. 每完成一题就 append 进 `results/*.jsonl` 并 flush；
2. 启动时读回已完成的 `index`，只跑还没跑的题，可以断点续传；
3. 跑完按数据集原顺序重排，并原子替换掉上一轮可能留下的重复行。

计分逻辑一行没动。

## 复现

官方仓库和数据集都是第三方资产，这里没有内联，按下面步骤拉取：

```bash
git clone https://github.com/MoonshotAI/PerceptionBench.git
cd PerceptionBench
git checkout ba032c06e9b6ee3679171ff6ba643b7a0cfebe2e   # 本次实测所用提交

# 数据集（Git LFS）
git clone https://huggingface.co/datasets/moonshotai/PerceptionBench ../PerceptionBench-dataset
ln -s ../PerceptionBench-dataset/PerceptionBench.jsonl PerceptionBench.jsonl

# 应用断点续传补丁
git apply /path/to/eval/resume-and-checkpoint.patch

python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # 填 OPENAI_API_KEY / OPENAI_BASE_URL / MODEL / JUDGE_MODEL
python eval/eval.py
```

本次实测的参数：

| 项 | 值 |
| --- | --- |
| 目标模型 | `deepseek-v4-flash-vision-exp` |
| 裁判模型 | `deepseek-v4-pro` |
| API | `https://api.deepseek.com/v1` |
| 数据集 SHA-256 | `f84afb46c3c150b572481ca34b351d6afb1c31b98fef0c0c46d7659333573c47` |
| 并发 / 上限 / 重试 | `CONCURRENCY=16`、`MAX_TOKENS=65536`、`MAX_RETRIES=5` |
| 耗时 | 8,180.86 秒（约 2 小时 16 分） |
| 完整性 | 3,000 行、3,000 个唯一 index、0 个模型请求错误、0 个裁判错误 |

API Key 当时只注入了当次 shell 进程，没有写进 `.env`、源码、日志或报告，本目录里也不含任何凭据。

## 结果展示页

```bash
cd web
npm install
npm run dev
```

> 这里用 `npm install` 而不是本仓库其它项目的 `npm ci`：devDependency `oxlint@1.79.0` 声明的一批跨平台可选依赖在 registry 上并未全部发布，`npm ci` 的 lock 一致性校验会直接失败。`oxlint` 只服务于 `npm run lint`，不影响 `dev` 和 `build`。

页面内容：总分与近似排名摘要、10 项感知能力雷达图、17 个模型完整对比表（可按能力重排、按模型搜索，DeepSeek 实测行持续高亮）。预览见 `web/preview-hero.png` 和 `web/preview-leaderboard.png`。
