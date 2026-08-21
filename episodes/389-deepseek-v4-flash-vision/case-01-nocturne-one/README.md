# Case 01 · NOCTURNE ONE 沉浸式产品官网

一条长提示词，从零生成一个高端头戴耳机的产品发布页：Liquid Glass 材质、可交互声场可视化、sticky 结构分解、配色切换和一整套预约表单状态机。没有给参考图，全部由模型自己做设计决策。

- 提示词：[`prompt.md`](./prompt.md)
- 产出代码：[`app/`](./app/)

## 视频里的结论

本期完成度最好的几个之一。设计感、动效层次和交互闭环都到位了，声场章节的鼠标响应也做出来了。

## 运行

```bash
cd app
npm ci
npm run dev
```

## 实现要点

- 首屏非对称分屏，右侧耳机由 SVG / CSS 程序化绘制，不依赖外部图片
- `components/SoundField.tsx` 环形声场随指针位置改变空间方位
- `components/Structure.tsx` + `StructureDiagram.tsx` 用 sticky scroll 逐层分解耳罩 / 声学腔体 / 头梁
- `components/Magnetic.tsx` 给主 CTA 做磁吸跟随，不走 React state 逐帧更新
- `components/BookingPanel.tsx` 预约面板由按钮自然扩展而来，含默认 / 提交中 / 成功 / 校验错误四态
- 全程支持 `prefers-reduced-motion` 与键盘操作

## 技术栈

React 19 · TypeScript · Vite · Framer Motion · 自绘 SVG 图标
