# DeepSeek V4 Flash Vision / PerceptionBench

PerceptionBench 3,000 题完整实测结果的交互式展示页。

## 本地运行

```bash
npm install
npm run dev
```

默认地址为 `http://localhost:5173`。

## 生产构建

```bash
npm run build
npm run preview
```

## 主要功能

- DeepSeek 总分、近似排名与运行完整性摘要
- 10 项感知能力雷达图与分项分布
- 17 个模型的完整对比表
- 按能力重排、模型搜索、DeepSeek 实测行持续高亮
- 桌面端、平板和手机端响应式布局

## 数据口径

DeepSeek 实测由 `deepseek-v4-pro` 裁判；PerceptionBench README 中的其他模型使用 `gpt-oss-120b` 裁判。页面已显著标注该口径差异。
