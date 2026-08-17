import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { GithubLogo } from '@phosphor-icons/react'
import { cn } from '../lib/util'
import { WHALES } from '../lib/whales'

const LINKS = [
  { id: 'walkthrough', label: '全过程' },
  { id: 'channels', label: '三条链路' },
  { id: 'files', label: '数据结构' },
  { id: 'consistency', label: '一致性' },
  { id: 'tools', label: '工具集' },
]

export function Nav() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 })
  const [active, setActive] = useState('overview')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6] },
    )
    for (const section of document.querySelectorAll('section[id]')) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-6 px-6 lg:px-10">
          <a href="#overview" className="flex items-center gap-2.5">
            <img
              src={WHALES['team-lead']}
              alt=""
              className="size-6 rounded-md"
            />
            <span className="text-[13px] font-medium tracking-tight">
              AgentTeams
              <span className="ml-2 font-mono text-[10.5px] text-fg-dim">协作原理</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={cn(
                  'relative rounded-lg px-3 py-1.5 text-[12.5px] transition-colors',
                  active === link.id ? 'text-fg' : 'text-fg-dim hover:text-fg/85',
                )}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg border border-line bg-ink-800"
                    transition={{ type: 'spring', stiffness: 340, damping: 34 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            ))}
          </nav>

          <a
            href="https://github.com/NanmiCoder"
            target="_blank"
            rel="noreferrer"
            title="打开我的 GitHub 主页 · NanmiCoder"
            aria-label="打开我的 GitHub 主页"
            className="flex size-9 items-center justify-center rounded-full border border-line bg-ink-850 text-fg-dim transition-all hover:border-accent/50 hover:text-fg active:scale-[0.94]"
          >
            <GithubLogo size={18} weight="regular" />
          </a>
        </div>
      </div>
      <motion.div className="h-px origin-left bg-accent/70" style={{ scaleX: progress }} />
    </header>
  )
}
