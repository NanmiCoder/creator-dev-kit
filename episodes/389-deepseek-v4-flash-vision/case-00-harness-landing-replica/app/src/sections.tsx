import { useRef, useState } from 'react'
import TerminalCard from './TerminalCard'
import {
  AtomIcon,
  BookIcon,
  BoxIcon,
  BugIcon,
  ChevronRightIcon,
  CheckIcon,
  CopyIcon,
  GearIcon,
  GitHubIcon,
  GridSquaresIcon,
  HistoryIcon,
  LayersIcon,
  RingIcon,
  SearchIcon,
  WeChatIcon,
  XIcon,
} from './icons'
import { useReveal, useScrollProgress, useReducedMotion } from './hooks'

/* ---------------------------------- hero --------------------------------- */

export function Hero() {
  const reveal = useReveal<HTMLDivElement>(0.15)

  return (
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-fade" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy reveal" ref={reveal}>
          <p className="hero-eyebrow">DeepSeek Harness developer preview</p>
          <h1 className="hero-title">Everything is a plugin</h1>
          <p className="hero-sub">
            DeepSeek Harness is now in developer preview for agent harness developers worldwide — source code included.
          </p>
          <p className="hero-sub hero-sub--dim">
            Every capability is a plugin that can be swapped or recomposed: models, tools, skills, sessions, sandboxes,
            storage, loops, scheduling, and the UI.
          </p>
          <div className="hero-actions">
            <a className="btn btn--primary" href="https://github.com/deepseek-ai/deepseek-harness" target="_blank" rel="noreferrer">
              <GitHubIcon size={17} />
              View on GitHub
            </a>
            <a className="btn" href="#get-started">
              <BookIcon size={16} />
              Developer docs
            </a>
            <a className="btn" href="#ecosystem">
              <BoxIcon size={16} />
              Community plugins
            </a>
            <a className="btn" href="#ecosystem">
              <BookIcon size={16} />
              Cordis paper
            </a>
          </div>
        </div>
        <div className="hero-terminal">
          <TerminalCard />
        </div>
      </div>
    </section>
  )
}

/* --------------------------- harness narrative --------------------------- */

const STAGES: [string, string | null][] = [
  ['AGENT', '='],
  ['MODEL', '+'],
  ['HARNESS', null],
]

export function HarnessNarrative() {
  const reduced = useReducedMotion()
  const { ref, progress } = useScrollProgress<HTMLDivElement>('element', reduced)

  // stage boundaries within the pinned run
  const stage = (p: number): number => {
    if (p < 0.3) return 0
    if (p < 0.55) return 1
    return 2
  }
  const lit = stage(progress)

  // final entrance: heading + subs fade in from ~70%
  const tail = Math.min(1, Math.max(0, (progress - 0.62) / 0.3))
  const lift = reduced ? 0 : Math.min(1, Math.max(0, progress - 0.55)) * 26

  return (
    <div className="harness" id="harness" ref={ref}>
      <div className="harness-sticky">
        <div className="harness-glow" aria-hidden="true" />
        <div className="harness-block" style={reduced ? undefined : { transform: `translateY(${26 - lift}px)` }}>
          <p className="harness-pill">
            {STAGES.map(([s, sep], i) => (
              <span key={s} className="harness-seg-wrap">
                <span className={`harness-seg${i <= lit ? ' harness-seg--lit' : ''}`}>{s}</span>
                {sep && <span className="harness-sep">{sep}</span>}
              </span>
            ))}
          </p>

          <h2
            className="harness-title"
            style={reduced ? undefined : { opacity: tail, transform: `translateY(${(1 - tail) * 22}px)` }}
          >
            <span className="harness-title-en">HARNESS</span>
            <span className="harness-title-cn">让 Agent 在真实场景中持续工作</span>
          </h2>
          <div className="harness-subs" style={reduced ? undefined : { opacity: tail, transform: `translateY(${(1 - tail) * 22}px)` }}>
            <p>模型是 Agent 的灵魂。</p>
            <p>Harness 给予 Agent 理解环境、使用工具，并在真实场景中持续工作的能力。</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------- harness feature cards ------------------------ */

const HARNESS_CARDS = [
  {
    icon: AtomIcon,
    title: 'Cordis 内核',
    en: 'CORDIS KERNEL',
    desc: 'Cordis 内核只负责插件的加载、卸载和依赖关系，不承载 Agent 的具体能力。',
  },
  {
    icon: RingIcon,
    title: '插件提供能力',
    en: 'CAPABILITIES AS PLUGINS',
    desc: '模型、工具、技能、会话、沙箱、存储、循环、调度、UI 等所有 Agent 能力均由插件提供，并通过 Cordis 服务与事件彼此协作。',
  },
  {
    icon: GridSquaresIcon,
    title: '配置层自由组合',
    en: 'COMPOSE IN CONFIGURATION',
    desc: '开发者无需改动源码，即可在配置层选择、替换或扩展任一能力。',
  },
]

export function HarnessCards() {
  const reveal = useReveal<HTMLDivElement>(0.15)
  return (
    <section className="sec harness-cards">
      <div className="container">
        <div className="hcards reveal" ref={reveal}>
          {HARNESS_CARDS.map((c) => (
            <article className="hcard" key={c.title}>
              <div className="hcard-icon">
                <c.icon />
              </div>
              <h3 className="hcard-title">{c.title}</h3>
              <span className="hcard-en">{c.en}</span>
              <p className="hcard-desc">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ design thinking --------------------------- */

const PLUGINS: [string, boolean][] = [
  ['include', true],
  ['timer', true],
  ['fsr', false],
  ['fsm', true],
  ['session', true],
  ['hyper-locator', true],
  ['session-file', true],
  ['hyper-registry', true],
  ['sql-gateway', true],
  ['session-db', true],
  ['session-0th-fsm.mjs', true],
]

function PluginPanel() {
  return (
    <div className="dpanel" aria-hidden="true">
      <aside className="dpanel-side">
        <div className="dpanel-side-title">设置</div>
        <div className="dpanel-menu">
          <div className="dpanel-item">
            <GearIcon size={15} />
            通用设置
          </div>
          <div className="dpanel-item">
            <LayersIcon size={15} />
            模型
          </div>
          <div className="dpanel-item dpanel-item--active">
            <BoxIcon size={15} />
            插件
          </div>
          <div className="dpanel-item">
            <BugIcon size={15} />
            Agent 调试
          </div>
        </div>
      </aside>
      <div className="dpanel-main">
        <div className="dpanel-head">
          <span className="dpanel-head-title">插件</span>
          <div className="dpanel-head-actions">
            <button type="button" className="dpanel-open" tabIndex={-1}>
              打开配置文件
            </button>
            <button type="button" className="dpanel-close" tabIndex={-1}>
              <XIcon size={13} />
            </button>
          </div>
        </div>
        <p className="dpanel-desc">插件配置用于加载已安装的插件。</p>
        <p className="dpanel-sub">插件配置：插件列表</p>
        <div className="dpanel-search">
          <SearchIcon size={13} />
          <span>搜索插件</span>
        </div>
        <div className="dpanel-list">
          {PLUGINS.map(([name, on]) => (
            <div className="dpanel-row" key={name}>
              <span className="dpanel-name">{name}</span>
              <span className={`dpanel-status${on ? ' dpanel-status--on' : ''}`}>{on ? '已启用' : '已禁用'}</span>
              <ChevronRightIcon size={12} />
            </div>
          ))}
        </div>
        <div className="dpanel-foot">插件列表 1/2</div>
      </div>
    </div>
  )
}

export function DesignSection() {
  const reveal = useReveal<HTMLDivElement>(0.15)

  return (
    <section className="sec sec--design" id="design">
      <div className="container">
        <div className="reveal" ref={reveal}>
          <p className="eyebrow-pill">设计思路</p>
          <h2 className="sec-title sec-title--lg">一切皆插件，运行有迹可循</h2>

          <div className="design-grid">
            <div className="design-copy">
              <div className="design-point">
                <BoxIcon size={22} />
                <h3>一切皆插件</h3>
                <p>
                  DeepSeek Harness 基于 Cordis 插件系统构建。模型、工具、技能、会话、沙箱、存储、循环、调度、UI
                  等所有 Agent 能力均由插件提供，并通过 Cordis 服务与事件彼此协作。开发者无需改动 DeepSeek
                  Harness 源码，即可在配置层选择、替换或扩展任一能力。
                </p>
              </div>
            </div>
            <div className="design-visual">
              <PluginPanel />
            </div>
          </div>

          <div className="design-point design-point--trace">
            <HistoryIcon size={22} />
            <h3>每一次运行都有迹可循</h3>
            <p>
              模型在意识里的一切都会写入可追溯的会话日志，包括系统提示词、思维链、工具调用与结果、每个 Agent
              调度，以及每次上下文注入。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ get started ------------------------------ */

function CommandBox({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(0)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = command
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="cmd">
      <span className="cmd-prompt">$</span>
      <span className="cmd-text">{command}</span>
      <button type="button" className={`cmd-copy${copied ? ' cmd-copy--ok' : ''}`} onClick={copy}>
        {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

export function GetStarted() {
  const head = useReveal<HTMLDivElement>(0.25)
  const cards = useReveal<HTMLDivElement>(0.12)

  return (
    <section className="sec sec--getstarted" id="get-started">
      <div className="container">
        <div className="reveal" ref={head}>
          <p className="eyebrow-pill">GET STARTED</p>
          <h2 className="sec-title">Try it now or install from source</h2>
        </div>

        <div className="cards reveal" ref={cards}>
          <article className="card">
            <h3>Quick start</h3>
            <p>Install Node.js, then launch the Web UI with npx.</p>
            <CommandBox command="npx @deepseek-ai/dsh web" />
          </article>
          <article className="card">
            <h3>Install from source</h3>
            <p>Clone the full source and follow the setup instructions in the repository.</p>
            <CommandBox command="git clone https://github.com/deepseek-ai/deepseek-harness" />
          </article>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- ecosystem ------------------------------- */

export function Ecosystem() {
  const reveal = useReveal<HTMLDivElement>(0.22)

  return (
    <section className="sec sec--eco" id="ecosystem">
      <div className="eco-dots" aria-hidden="true" />
      <div className="eco-glows" aria-hidden="true" />
      <div className="container">
        <div className="eco-inner reveal" ref={reveal}>
          <h2 className="sec-title">Join the DSH plugin ecosystem</h2>
          <p className="eco-copy">
            DeepSeek Harness remains in developer preview and is still being tested by developers building agent
            harnesses. Its core plugins and APIs will continue to evolve. We look forward to exploring the limits of
            intelligence with developers worldwide using open-source infrastructure that is reusable and composable.
          </p>
          <div className="eco-actions">
            <a className="btn btn--primary" href="https://github.com/deepseek-ai/deepseek-harness" target="_blank" rel="noreferrer">
              <GitHubIcon size={17} />
              View on GitHub
            </a>
            <a className="btn" href="#get-started">
              <BookIcon size={16} />
              Developer docs
            </a>
            <a className="btn" href="#ecosystem">
              <BoxIcon size={16} />
              Community plugins
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- footer -------------------------------- */

export function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer-inner">
        <a className="footer-left" href="#top">
          <WeChatIcon size={17} />
          <span>Official WeChat account</span>
        </a>
        <p className="footer-center">Open source · MIT © 2026 DeepSeek. All rights reserved.</p>
        <nav className="footer-right" aria-label="Legal">
          <a href="#top">Safe Use Policy</a>
          <a href="#top">Data Processing Statement</a>
        </nav>
      </div>
    </footer>
  )
}
