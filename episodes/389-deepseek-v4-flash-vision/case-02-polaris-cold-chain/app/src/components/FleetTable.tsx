import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../lib/store'
import type { SortKey, StatusFilter, Vehicle, VehicleStatus } from '../types'
import { IconChevron, IconDownload, IconSearch } from './Icon'

const STATUS_KIND: Record<VehicleStatus, string> = {
  transit: 'transit',
  risk: 'risk',
  delayed: 'delay',
  loading: 'loading',
  delivered: 'done',
  idle: 'done',
}

const STATUS_LABEL: Record<VehicleStatus, string> = {
  transit: '运输中',
  risk: '温控风险',
  delayed: '延误',
  loading: '装卸中',
  delivered: '已送达',
  idle: '待命',
}

const STATUS_RANK: Record<VehicleStatus, number> = {
  risk: 0,
  delayed: 1,
  loading: 2,
  transit: 3,
  delivered: 4,
  idle: 5,
}

const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'transit', label: '运输中' },
  { id: 'risk', label: '温控风险' },
  { id: 'delayed', label: '延误' },
  { id: 'loading', label: '装卸' },
  { id: 'delivered', label: '已送达' },
]

const COLS: { key: SortKey; label: string; sortable: boolean }[] = [
  { key: 'plate', label: '车辆', sortable: true },
  { key: 'plate', label: '司机', sortable: false },
  { key: 'route', label: '路线', sortable: true },
  { key: 'plate', label: '货物', sortable: false },
  { key: 'temp', label: '温度', sortable: true },
  { key: 'eta', label: 'ETA', sortable: true },
  { key: 'status', label: '状态', sortable: true },
]

export function FleetTable() {
  const store = useStore()
  const { search, statusFilter, sortKey, sortDir, demoState } = store

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = store.vehicles.filter((v) => {
      if (statusFilter !== 'all' && v.status !== statusFilter) return false
      if (!q) return true
      return (
        v.plate.toLowerCase().includes(q) ||
        v.driver.includes(q) ||
        v.cargo.toLowerCase().includes(q) ||
        v.routeName.includes(q) ||
        v.orderId.toLowerCase().includes(q)
      )
    })
    const dir = sortDir
    list = [...list].sort((a, b) => {
      let r = 0
      switch (sortKey) {
        case 'plate':
          r = a.plate.localeCompare(b.plate, 'zh')
          break
        case 'route':
          r = a.routeName.localeCompare(b.routeName, 'zh')
          break
        case 'temp':
          r = a.temp - b.temp
          break
        case 'eta':
          r = a.eta.localeCompare(b.eta)
          break
        case 'status':
          r = STATUS_RANK[a.status] - STATUS_RANK[b.status]
          break
      }
      return r * dir
    })
    return list
  }, [store.vehicles, search, statusFilter, sortKey, sortDir])

  const counts = useMemo(() => {
    const c: Record<string, number> = { risk: 0, delayed: 0, loading: 0, transit: 0 }
    for (const v of store.vehicles) if (c[v.status] !== undefined) c[v.status]++
    return c
  }, [store.vehicles])

  const open = store.tableOpen
  const loading = demoState === 'loading'
  const emptyDemo = demoState === 'empty'
  const error = demoState === 'error'
  const noMatch = !emptyDemo && !error && !loading && rows.length === 0

  return (
    <section className="fleet" data-open={open} aria-label="车队车辆明细">
      <div
        className="fleet-head"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => store.setTableOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            store.setTableOpen(!open)
          }
        }}
      >
        <span className="fleet-chev">
          <IconChevron size={15} />
        </span>
        <span className="fleet-title">车队 · 车辆明细</span>
        <span className="fleet-sub">
          <b>{store.vehicles.length}</b> 辆 · <b>{store.vehicles.filter((v) => v.onMap).length}</b> 辆在途展示
        </span>

        <div className="fleet-tools" onClick={(e) => e.stopPropagation()}>
          <div className="fleet-search">
            <IconSearch size={13} />
            <input
              value={search}
              onChange={(e) => store.setSearch(e.target.value)}
              placeholder="搜索车牌 / 司机 / 货物…"
              aria-label="搜索车辆"
            />
          </div>
          <div className="fleet-seg" role="tablist" aria-label="状态筛选">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={statusFilter === f.id}
                data-active={statusFilter === f.id}
                onClick={() => store.setStatusFilter(f.id)}
              >
                {f.label}
                {f.id === 'risk' && counts.risk > 0 && <span className="mono"> {counts.risk}</span>}
              </button>
            ))}
          </div>
          <button className="fleet-export" onClick={() => store.exportCsv()}>
            <IconDownload size={13} />
            导出
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="fleet-body"
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {error ? (
              <div className="fleet-error">
                <span>
                  车辆列表拉取失败 — 已显示 <b className="mono">{store.vehicles.length}</b> 条缓存记录
                </span>
                <button onClick={() => store.setDemo('loading')}>重试</button>
              </div>
            ) : emptyDemo ? (
              <div className="fleet-empty">
                <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--ink-4)' }}>
                  NO VEHICLES
                </span>
                <b>当前时段没有可用的车辆数据</b>
                <span>检查调度排班或调整筛选条件</span>
              </div>
            ) : noMatch ? (
              <div className="fleet-empty">
                <b>没有匹配的车辆</b>
                <span>
                  试试「{search || '沪AD'}」或调整状态筛选
                </span>
              </div>
            ) : loading ? (
              <div className="fleet-scroll" aria-busy="true">
                <table className="fleet-table">
                  <tbody>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j}>
                            <span className="skel" style={{ width: j === 0 ? 78 : j === 3 ? 92 : 58, height: 12, display: 'inline-block' }} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="fleet-scroll">
                <table className="fleet-table">
                  <thead>
                    <tr>
                      {COLS.map((c, i) => (
                        <th
                          key={i}
                          className={c.sortable ? 'sortable' : undefined}
                          aria-sort={c.sortable && sortKey === c.key ? (sortDir === 1 ? 'ascending' : 'descending') : undefined}
                          onClick={c.sortable ? () => store.setSort(c.key) : undefined}
                        >
                          {c.label}
                          {c.sortable && sortKey === c.key && (
                            <span className="sort-arrow">{sortDir === 1 ? '▲' : '▼'}</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false} mode="popLayout">
                      {rows.map((v, i) => (
                        <Row
                          key={v.id}
                          vehicle={v}
                          index={i}
                          selected={v.id === store.selectedId}
                          onSelect={() => store.select(v.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}

            <div className="fleet-footbar">
              <span>
                筛选结果 <b className="mono">{rows.length}</b> 辆
              </span>
              <span>
                温控风险 <b className="mono">{counts.risk}</b>
              </span>
              <span>
                延误 <b className="mono">{counts.delayed}</b>
              </span>
              <span>
                装卸 <b className="mono">{counts.loading}</b>
              </span>
              <span style={{ marginLeft: 'auto', color: 'var(--ink-4)' }}>
                数据刷新于 02:17:43 · 5s
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Row({
  vehicle: v, index, selected, onSelect,
}: {
  vehicle: Vehicle
  index: number
  selected: boolean
  onSelect: () => void
}) {
  const risk = v.status === 'risk'
  const delay = v.status === 'delayed'
  const dotKind = risk ? 'risk' : delay ? 'delay' : v.status === 'loading' ? 'loading' : v.status === 'transit' ? 'transit' : 'done'
  return (
    <motion.tr
      layout
      data-selected={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect()
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.4), ease: [0.22, 1, 0.36, 1] }}
      aria-label={`选择车辆 ${v.plate}`}
    >
      <td>
        <span className="cell-plate">
          <span className="dot" data-kind={dotKind} />
          <span className="mono">{v.plate}</span>
        </span>
      </td>
      <td>
        <span className="cell-driver">
          {v.driver}
          <small>{v.driverPhone}</small>
        </span>
      </td>
      <td>
        <span className="cell-route">
          {v.origin}
          <span className="arr">→</span>
          {v.dest}
        </span>
      </td>
      <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {v.cargo}
        <span style={{ color: 'var(--ink-3)', marginLeft: 6 }} className="mono">
          {v.cargoWeight}
        </span>
      </td>
      <td>
        <span className="cell-temp mono" data-risk={risk}>
          {v.temp.toFixed(1)}°C
        </span>
      </td>
      <td>
        <span className="cell-eta">
          <span>{v.eta}</span>
          {delay && v.etaOffset !== null && <small className="late">+{v.etaOffset} min</small>}
          {v.status === 'risk' && <small>{v.riskNote.length > 14 ? v.riskNote.slice(0, 14) + '…' : v.riskNote}</small>}
        </span>
      </td>
      <td>
        <span className="chip" data-kind={STATUS_KIND[v.status]}>
          {STATUS_LABEL[v.status]}
        </span>
      </td>
    </motion.tr>
  )
}
