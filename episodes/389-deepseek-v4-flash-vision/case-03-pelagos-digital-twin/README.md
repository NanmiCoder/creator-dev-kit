# Case 03 · PELAGOS 3D 海上风电数字孪生控制台

本期最重的一个 case：让模型做一个真 WebGL 的海上风场数字孪生控制台。24 台程序化风机、Gerstner 波海面、镜头叙事、告警定位、维护工单、时间轴回放，外加 WebGL 失败时的 2D 降级方案。

- 提示词：[`prompt.md`](./prompt.md)
- 产出代码：[`app/`](./app/)

## 视频里的结论

每台风机都能点开定位、看功率、创建维护任务；告警能定位到具体机组；还有自动巡航的电影模式（跑起来风扇会响）。这个是四个 case 里主观完成度最高的。


## 实现说明（PELAGOS · FIELD 07 海上风电数字孪生控制台）

Case 03 的实现：基于 React + TypeScript + React Three Fiber 的 PELAGOS 海上风场数字孪生产品。

## 运行

```bash
cd app
npm ci
npm run dev      # 开发服务器（默认端口 5173，若被占用可加 --port）
npm run build    # tsc 类型检查 + 生产构建
npm run preview  # 预览生产构建
```

## 实现要点

- **真实 WebGL 场景**：24 台程序化风机（塔筒/机舱/轮毂合并几何 + 72 叶轮实例 + 航标灯），Gerstner 波海面（自定义 shader，含菲涅尔、余晖反射、白浪、距离雾）、天空穹顶（渐变 + 地平线余晖 + 低云 + 星）、远处风场剪影层。全部程序化生成，不依赖 GLB / 外部资源。
- **状态联动**：每台风机独立转速（随风速/状态）、偏航漂移、航标灯闪烁；时间轴回放驱动风速/浪高/天空明暗/转速/总功率/告警一致性更新。
- **镜头叙事**：开场 4.8s 可跳过序列（高空 → 掠海 → 穿第一排 → 运维总览）、点击机组平滑飞近 + 玻璃铭牌、Esc 返回总览、电影模式巡航（任意交互退出）。
- **操作层**：顶部导航（动态岛告警形变）、资产树（搜索/折叠/状态过滤，与 3D 双向同步）、上下文面板（shared layout 变形）、12 小时时间轴回放、现场/功率热力/维护风险三视图（含图例）、告警中心（定位机组并切换视图）、维护任务流（按钮 morph 成表单，提交中/成功/错误三态）、快捷键（F / M / Esc）。
- **降级与健壮性**：WebGL 初始化失败时切换到设计完整的 2D 平面总览；SCADA 断链的内联错误态与重连恢复；空态（无匹配/无工单）、表单校验错误态、toast 通知。
- **性能**：InstancedMesh + 合并几何（全场约 7 draw calls）、DPR 限制、移动端降采样、标签页隐藏暂停渲染循环、prefers-reduced-motion 支持。
- **移动端**：资产树/详情/告警收进底部玻璃抽屉，保留时间轴与视图切换，min-h-[100dvh]，无横向滚动。

## 技术栈

React 19 · TypeScript · Vite · Three.js 0.185 · React Three Fiber 9 · drei 10 · Zustand · Motion · Phosphor Icons · Geist / JetBrains Mono（自托管）

> 说明：玻璃材质为 Web 版 Liquid Glass 近似实现（backdrop-filter + 分层高光/内阴影），非 Apple 平台官方材质。
