import { useState, useRef, useEffect, useCallback } from 'react'
import { SIM_DATA } from '../../data/simData.ts'
import type { SimId } from '../../types/index.ts'

const TABS: { id: SimId; label: string }[] = [
  { id: 'create', label: 'Create Team' },
  { id: 'message', label: 'Message' },
  { id: 'shutdown', label: 'Shutdown' },
]

export default function TerminalSimulator() {
  const [activeTab, setActiveTab] = useState<SimId>('create')
  const [lines, setLines] = useState<string[]>([])
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const runAnimation = useCallback(
    (tabId: SimId) => {
      clearTimers()
      setLines([])
      const data = SIM_DATA[tabId]

      data.forEach((line, i) => {
        const delay = line.includes('sim-prompt') ? 600 : 250
        const totalDelay = i * delay
        const timer = setTimeout(() => {
          setLines((prev) => [...prev, line])
        }, totalDelay)
        timersRef.current.push(timer)
      })
    },
    [clearTimers],
  )

  useEffect(() => {
    runAnimation(activeTab)
    return clearTimers
  }, [activeTab, runAnimation, clearTimers])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const switchTab = (id: SimId) => {
    if (id !== activeTab) setActiveTab(id)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-bg-300/40 my-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-text-100 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex gap-1 ml-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary-100/12 border border-primary-100 text-primary-100'
                  : 'text-white/50 hover:text-white/80 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="bg-[#1d1f21] px-5 py-4 h-72 overflow-y-auto font-mono text-[13px] leading-[1.75]"
      >
        {lines.map((line, i) => (
          <div
            key={`${activeTab}-${i}`}
            className="animate-line-in"
            dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
          />
        ))}
      </div>
    </div>
  )
}
