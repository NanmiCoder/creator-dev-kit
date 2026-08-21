import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../lib/store'
import type { Vehicle } from '../types'
import {
  IconAlert, IconBox, IconCommand, IconDownload, IconFleet, IconSearch, IconZap,
} from './Icon'

interface Item {
  key: string
  group: 'cmd' | 'vehicle' | 'order'
  icon: ReactNode
  title: string
  sub: string
  tail: string
  run: () => void
}

export function CommandPalette() {
  const store = useStore()
  const open = store.paletteOpen
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const items = useMemo<Item[]>(() => {
    const q = query.trim().toLowerCase()
    const match = (s: string) => !q || s.toLowerCase().includes(q)

    const cmds: Item[] = [
      {
        key: 'c1', group: 'cmd' as const, icon: <IconZap size={15} />, title: '只看温控风险',
        sub: '筛选风险车辆并聚焦温控事件', tail: '指令',
        run: () => {
          store.setStatusFilter('risk')
          store.setEventKindFilter('temp')
          store.setTableOpen(true)
          store.setNav('temp')
        },
      },
      {
        key: 'c2', group: 'cmd' as const, icon: <IconFleet size={15} />, title: '重置视图',
        sub: '清空筛选与选中状态', tail: '指令',
        run: () => {
          store.setSearch('')
          store.setStatusFilter('all')
          store.setEventKindFilter('all')
          store.select(null)
          store.setNav('overview')
        },
      },
      {
        key: 'c3', group: 'cmd' as const, icon: <IconDownload size={15} />, title: '导出车队报表 CSV',
        sub: '下载当前车队明细', tail: '指令',
        run: () => store.exportCsv(),
      },
      {
        key: 'c4', group: 'cmd' as const, icon: <IconCommand size={15} />, title: '夜间模式',
        sub: store.settings.nightDim ? '关闭夜间低亮度' : '开启夜间低亮度', tail: '指令',
        run: () => store.setSetting('nightDim', !store.settings.nightDim),
      },
      {
        key: 'c5', group: 'cmd' as const, icon: <IconAlert size={15} />, title: '演示 · 模拟接口错误',
        sub: '切换 Demo State 为错误态', tail: '指令',
        run: () => store.setDemo('error'),
      },
    ].filter((c) => match(c.title + c.sub))

    const vehs: Item[] = store.vehicles
      .filter((v) => match(v.plate + v.driver + v.cargo + v.routeName + v.orderId))
      .slice(0, 6)
      .map(
        (v: Vehicle): Item => ({
          key: 'v' + v.id, group: 'vehicle', icon: <IconFleet size={15} />,
          title: v.plate, sub: `${v.driver} · ${v.cargo}`, tail: v.status,
          run: () => store.select(v.id),
        }),
      )

    const seen = new Set<string>()
    const orders: Item[] = []
    for (const v of store.vehicles) {
      if (seen.has(v.orderId)) continue
      seen.add(v.orderId)
      if (!match(v.orderId + v.origin + v.dest)) continue
      orders.push({
        key: 'o' + v.orderId, group: 'order' as const, icon: <IconBox size={15} />,
        title: v.orderId, sub: `${v.origin} → ${v.dest} · ${v.cargo}`, tail: v.plate,
        run: () => store.select(v.id),
      })
      if (orders.length >= 6) break
    }

    return [...cmds, ...vehs, ...orders]
  }, [query, store])

  const grouped = useMemo(() => {
    const g: { group: Item['group']; label: string; items: Item[] }[] = []
    for (const grp of ['cmd', 'vehicle', 'order'] as const) {
      const list = items.filter((i) => i.group === grp)
      if (list.length) g.push({ group: grp, label: grp === 'cmd' ? '指令' : grp === 'vehicle' ? '车辆' : '订单', items: list })
    }
    return g
  }, [items])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const flat = items

  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const it = flat[active]
      if (it) {
        store.setPalette(false)
        it.run()
      }
    }
  }

  let idx = -1

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => store.setPalette(false)}
        >
          <motion.div
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-label="快捷指令"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="palette-input-row">
              <IconSearch size={16} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKey}
                placeholder="搜索车辆、订单或输入指令…"
                aria-label="搜索"
              />
              <span className="palette-kbd-hint">ESC</span>
            </div>

            <div className="palette-body" ref={listRef}>
              {flat.length === 0 ? (
                <div className="palette-empty">没有匹配的结果 — 试试「沪AD」「P-240821」或「温控」</div>
              ) : (
                grouped.map((g) => (
                  <div key={g.group}>
                    <div className="palette-group">{g.label}</div>
                    {g.items.map((it) => {
                      idx += 1
                      const i = idx
                      return (
                        <button
                          key={it.key}
                          className="palette-item"
                          data-idx={i}
                          data-active={i === active}
                          data-kind={it.group}
                          onMouseEnter={() => setActive(i)}
                          onClick={() => {
                            store.setPalette(false)
                            it.run()
                          }}
                        >
                          <span className="pi-ic">{it.icon}</span>
                          <span className="pi-main">
                            <b>
                              {it.group === 'vehicle' ? <span className="mono">{it.title}</span> : it.title}
                            </b>
                            <span className="pi-sub">{it.sub}</span>
                          </span>
                          <span className="pi-tail">{it.tail}</span>
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="palette-foot">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> 导航
              </span>
              <span>
                <kbd>↵</kbd> 执行
              </span>
              <span style={{ marginLeft: 'auto', color: 'var(--ink-4)' }}>
                POLARIS COMMAND
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
