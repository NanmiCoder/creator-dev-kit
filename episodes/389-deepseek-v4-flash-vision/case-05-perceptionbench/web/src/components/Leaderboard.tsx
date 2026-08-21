import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, MagnifyingGlass, X } from '@phosphor-icons/react'
import type { MetricKey, ModelScore } from '../data'
import { metrics } from '../data'

export function Leaderboard({ models }: { models: ModelScore[] }) {
  const [query, setQuery] = useState('')
  const [metric, setMetric] = useState<MetricKey>('overall')

  const visibleModels = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return models.filter((model) => model.name.toLowerCase().includes(normalized)).sort((a, b) => (b[metric] as number) - (a[metric] as number))
  }, [metric, models, query])

  const selected = metrics.find((item) => item.key === metric) ?? metrics[0]

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 gap-7 border-y border-line py-6 lg:grid-cols-[minmax(260px,0.55fr)_1.45fr] lg:items-end">
        <label className="grid gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">搜索模型</span>
          <span className="flex items-center gap-3 border-b border-line pb-2 focus-within:border-accent">
            <MagnifyingGlass size={17} weight="regular" className="text-muted" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="在 17 个模型中搜索" className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/60" />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="rounded-full p-1 text-muted transition-colors hover:bg-line/60 hover:text-ink active:scale-95">
                <X size={15} weight="regular" />
              </button>
            )}
          </span>
          <span className="text-xs text-muted">输入后结果会立即更新。</span>
        </label>

        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">按能力排序</p>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {metrics.map((item) => (
              <button key={item.key} type="button" onClick={() => setMetric(item.key)} className={`relative shrink-0 rounded-full px-3.5 py-2 font-mono text-[11px] transition-colors duration-300 active:scale-[0.98] ${metric === item.key ? 'text-paper' : 'bg-line/45 text-muted hover:bg-line hover:text-ink'}`} aria-pressed={metric === item.key}>
                {metric === item.key && <motion.span layoutId="metric-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 100, damping: 20 }} />}
                <span className="relative">{item.short}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        <span>已显示 {visibleModels.length} 个模型</span>
        <span className="flex items-center gap-1.5">{selected.label}<ArrowDown size={13} weight="regular" /></span>
      </div>

      {visibleModels.length === 0 ? (
        <div className="mt-6 grid min-h-72 place-items-center border-y border-line px-6 text-center">
          <div>
            <MagnifyingGlass size={28} weight="regular" className="mx-auto text-muted" />
            <h3 className="mt-4 text-xl font-semibold tracking-tight">没有匹配“{query}”的模型。</h3>
            <p className="mt-2 text-sm text-muted">可以尝试 GPT、Kimi、Gemini、GLM 或 DeepSeek。</p>
            <button type="button" onClick={() => setQuery('')} className="mt-5 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-ink active:scale-[0.98]">清除搜索</button>
          </div>
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto border-y border-line bg-paper/45">
          <table className="w-full min-w-[1240px] border-collapse text-left">
            <thead className="sticky top-0 bg-canvas/95 backdrop-blur-md">
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                <th className="w-14 px-4 py-4 text-center font-normal">排名</th>
                <th className="min-w-64 px-4 py-4 font-normal">模型</th>
                {metrics.map((item) => (
                  <th key={item.key} className="px-3 py-4 text-right font-normal">
                    <button type="button" onClick={() => setMetric(item.key)} className={`transition-colors hover:text-ink ${metric === item.key ? 'text-accent' : ''}`}>{item.short}</button>
                  </th>
                ))}
              </tr>
            </thead>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.tbody layout>
                {visibleModels.map((model, index) => (
                  <motion.tr layout key={model.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className={`border-b border-line/75 last:border-0 ${model.highlighted ? 'bg-accent-soft/85' : 'transition-colors hover:bg-paper'}`}>
                    <td className="px-4 py-4 text-center font-mono text-xs text-muted">{String(index + 1).padStart(2, '0')}</td>
                    <th scope="row" className="px-4 py-4 text-sm font-medium">
                      <span className="flex items-center gap-3">
                        {model.highlighted && <span className="h-7 w-1 rounded-full bg-accent" />}
                        <span>{model.name}{model.highlighted && <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.12em] text-accent">实测</span>}</span>
                      </span>
                    </th>
                    {metrics.map((item) => <td key={item.key} className={`px-3 py-4 text-right font-mono text-xs ${metric === item.key ? 'font-semibold text-accent' : 'text-ink/75'}`}>{(model[item.key] as number).toFixed(1)}</td>)}
                  </motion.tr>
                ))}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </div>
      )}
    </div>
  )
}
