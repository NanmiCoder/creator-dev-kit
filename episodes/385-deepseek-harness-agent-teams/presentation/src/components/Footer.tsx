import { GithubLogo, ArrowUp } from '@phosphor-icons/react'
import { WHALES } from '../lib/whales'

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-[1500px] px-6 py-12 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-[44ch]">
            <div className="flex items-center gap-2.5">
              <img
                src={WHALES['team-lead']}
                alt=""
                className="size-7 rounded-lg"
              />
              <span className="text-[15px] font-semibold tracking-tight">dsh-agent-teams</span>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-fg-dim">
              把当前 DeepSeek Harness 会话变成一支真正协作的多智能体团队。
              无需 workflow 引擎 —— 一切状态都在工作区的几个文件里。
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-widest text-fg-dim/50">源码</span>
            <a
              href="https://github.com/NanmiCoder/dsh-agent-teams"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[12.5px] text-fg-dim transition-colors hover:text-fg active:translate-y-px"
            >
              <GithubLogo size={14} weight="regular" />
              NanmiCoder/dsh-agent-teams
            </a>
            <a
              href="https://github.com/deepseek-ai/deepseek-harness"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[12.5px] text-fg-dim transition-colors hover:text-fg active:translate-y-px"
            >
              <GithubLogo size={14} weight="regular" />
              deepseek-ai/deepseek-harness
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-widest text-fg-dim/50">安装</span>
            <code className="rounded-lg border border-line bg-ink-900/70 px-3 py-2 font-mono text-[11px] text-accent-soft">
              dsh plugin --profile web add @nanmicoder/dsh-agent-teams
            </code>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
          <span className="font-mono text-[10.5px] text-fg-dim/50">
            MIT License · 本页为协作原理的可视化讲解
          </span>
          <a
            href="#overview"
            className="group flex items-center gap-2 font-mono text-[10.5px] text-fg-dim transition-colors hover:text-fg"
          >
            回到顶部
            <span className="flex size-6 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-accent/45">
              <ArrowUp size={11} weight="bold" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
