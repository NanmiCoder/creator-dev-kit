# Case 00 · DeepSeek Harness 官网截图复刻

给模型三张 DeepSeek Harness 官网截图，不许联网、不许读原站源码，让它凭视觉把整个长页面还原成可运行的 React + TypeScript 项目。这是本期第一个测试，用来看「模型接上眼睛之后，照着图抄版式」这件事能做到什么程度。

- 提示词：[`prompt.md`](./prompt.md)
- 输入截图：[`images/`](./images/)（`01.png` 与 `03.png` 在原工作目录里就是同一张图，此处保持原样，方便按提示词原样复跑）
- 产出代码：[`app/`](./app/)

## 视频里的结论

整体版式、字体、卡片和终端组件复刻得还行；官网首屏那条小鲸鱼是原站的动态元素，模型只靠静态截图没还原出来。

## 运行

```bash
cd app
npm ci
npm run dev
```

`app/src/App.tsx` 里保留了模型自己加的 `?scroll=N` 参数，加在地址后面可以直接跳到指定像素位置，是它当时用来自查还原度的调试口子。

## 技术栈

React 18 · TypeScript · Vite 5 · 手写 Canvas 光带背景（`src/CanvasBackdrop.tsx`），无 UI 组件库。
