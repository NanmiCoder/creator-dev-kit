import type { Narration } from "../../registry/types";

export const narrations: Narration[] = [
  "第二步，准备两个 Skill。先建立两个职责位：一个管审美，一个管网页视频结构。",
  "一个是 leonxlnx/taste-skill 这个开源仓库。这期实际会用它里面的 design-taste-frontend。",
  "它主要负责提升前端页面的设计品味，避免 Agent 做出来的东西太像普通模板。",
  "另一个是花园老师开源的 ConardLi/garden-skills，我们会用到它里面的 web-video-presentation。",
  "在 MiniMax Code 里，你直接把这两个开源 Skill 地址给它，然后用自然语言说：帮我安装这两个 Skill。",
  "安装完成之后，斜杠命令里能看到，就说明已经装好了。这一步不用记复杂命令。",
  "你真正需要理解的是：design-taste-frontend 管审美，web-video-presentation 管网页视频结构，MiniMax Code 负责把本地文件、音频、SRT、网页项目和 review 串起来。",
];
