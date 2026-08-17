import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { addedLines } from '../lib/diff'
import { cn } from '../lib/util'
import { CAPTAIN, mailboxText, teamJsonText, TEAM_ID, type World } from '../data/story'

interface FileTab {
  key: string
  label: string
  text: string
}

function tabsFor(world: World): FileTab[] {
  const tabs: FileTab[] = [{ key: 'team.json', label: 'team.json', text: teamJsonText(world) }]
  tabs.push({
    key: 'inbox/captain.jsonl',
    label: 'inbox/captain.jsonl',
    text: mailboxText(world, CAPTAIN),
  })
  for (const member of world.members) {
    tabs.push({
      key: `inbox/${member.name}.jsonl`,
      label: `inbox/${member.name}.jsonl`,
      text: mailboxText(world, member.name),
    })
  }
  return tabs
}

/** Minimal JSON tokenizer — enough for keys, strings, numbers and literals. */
function highlight(line: string): ReactNode {
  const parts: ReactNode[] = []
  const pattern = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)/g
  let last = 0
  let match: RegExpExecArray | null
  let index = 0
  while ((match = pattern.exec(line)) !== null) {
    if (match.index > last) parts.push(line.slice(last, match.index))
    index += 1
    if (match[1] !== undefined) {
      parts.push(
        <span key={index} className={match[2] ? 'text-accent-soft' : 'text-done'}>
          {match[1]}
        </span>,
      )
      if (match[2]) parts.push(match[2])
    } else if (match[3] !== undefined) {
      parts.push(
        <span key={index} className="text-wait">
          {match[3]}
        </span>,
      )
    } else {
      parts.push(
        <span key={index} className="text-fail/85">
          {match[4]}
        </span>,
      )
    }
    last = pattern.lastIndex
  }
  if (last < line.length) parts.push(line.slice(last))
  return parts
}

interface Props {
  world: World
  previous: World | null
  activeKey: string
  onSelect: (key: string) => void
  archived: boolean
}

export function FileViewer({ world, previous, activeKey, onSelect, archived }: Props) {
  const tabs = useMemo(() => tabsFor(world), [world])
  const previousTabs = useMemo(() => (previous ? tabsFor(previous) : []), [previous])
  const active = tabs.find((tab) => tab.key === activeKey) ?? tabs[0]
  const before = previousTabs.find((tab) => tab.key === active.key)?.text ?? ''

  const lines = active.text === '' ? [] : active.text.split('\n')
  const wraps = active.key.endsWith('.jsonl')
  const changed = useMemo(
    () => addedLines(before === '' ? [] : before.split('\n'), lines),
    [before, active.text],
  )

  const bodyRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const first = [...changed].sort((a, b) => a - b)[0]
    const body = bodyRef.current
    if (first === undefined || !body) return
    const row = body.querySelector<HTMLElement>(`[data-line="${first}"]`)
    if (!row) return
    const target = row.offsetTop - body.clientHeight / 2 + row.clientHeight
    body.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
  }, [changed, active.key])

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-line bg-ink-900/70">
      <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[10.5px] text-fg-dim">
          <span className="text-fg-dim/60">.agent-teams/</span>
          <motion.span
            key={archived ? 'archived' : 'live'}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={archived ? 'text-wait' : 'text-fg/80'}
          >
            {archived ? `archive/${TEAM_ID}/` : `${TEAM_ID}/`}
          </motion.span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-fg-dim/70">
          <span
            className={cn(
              'size-1.5 rounded-full',
              changed.size > 0 ? 'bg-done [animation:breathe_1.4s_ease-in-out_infinite]' : 'bg-ink-600',
            )}
          />
          {changed.size > 0 ? `+${changed.size} 行` : '未变更'}
        </span>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-line px-2 py-2">
        {tabs.map((tab) => {
          const isActive = tab.key === active.key
          const hasContent = tab.text !== ''
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelect(tab.key)}
              className={cn(
                'relative shrink-0 rounded-lg px-2.5 py-1.5 font-mono text-[10.5px] whitespace-nowrap transition-colors active:scale-[0.98]',
                isActive ? 'text-fg' : hasContent ? 'text-fg-dim hover:text-fg/90' : 'text-fg-dim/40',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="file-tab"
                  className="absolute inset-0 rounded-lg border border-line-strong bg-ink-800"
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                />
              )}
              <span className="relative">{tab.label.replace('inbox/', '')}</span>
            </button>
          )
        })}
      </div>

      <div ref={bodyRef} className="min-h-0 flex-1 overflow-auto px-1 py-2.5">
        {lines.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="font-mono text-[11px] text-fg-dim/60">文件还不存在</div>
            <p className="max-w-[26ch] text-[11.5px] leading-relaxed text-fg-dim/50">
              工具没有跑到这一步之前，磁盘上什么都没有 —— 状态不在内存里等着。
            </p>
          </div>
        ) : (
          <div
            className={cn(
              'font-mono text-[11px] leading-[1.65]',
              wraps ? 'w-full' : 'w-max min-w-full',
            )}
          >
            {lines.map((line, index) => {
              const isNew = changed.has(index)
              return (
                <div
                  key={`${index}-${line.slice(0, 24)}`}
                  data-line={index}
                  className={cn(
                    'flex gap-3 px-2.5 transition-colors duration-500',
                    isNew && 'bg-done/10',
                    wraps && 'border-b border-line-soft py-1.5 last:border-b-0',
                  )}
                >
                  <span
                    className={cn(
                      'w-6 shrink-0 text-right tabular-nums select-none',
                      isNew ? 'text-done/80' : 'text-fg-dim/30',
                    )}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      wraps ? 'min-w-0 break-all whitespace-pre-wrap' : 'whitespace-pre',
                      isNew ? 'text-fg' : 'text-fg-dim/85',
                    )}
                  >
                    {highlight(line)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
