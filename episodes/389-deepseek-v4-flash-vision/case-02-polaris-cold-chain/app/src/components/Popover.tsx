import { AnimatePresence, motion } from 'framer-motion'
import { FLEET_STATS } from '../data/fleet'
import { useStore } from '../lib/store'
import { IconDownload } from './Icon'

function Toggle({
  on, onClick, label, desc,
}: {
  on: boolean
  onClick: () => void
  label: string
  desc: string
}) {
  return (
    <button
      className="pop-row"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      style={{ width: '100%', textAlign: 'left' }}
    >
      <span className="row-label">
        {label}
        <br />
        <span className="row-desc">{desc}</span>
      </span>
      <span className="toggle" data-on={on} aria-hidden="true" />
    </button>
  )
}

export function Popover() {
  const store = useStore()
  const kind = store.popover
  const s = store.settings
  const max = Math.max(...FLEET_STATS.mileageSeries)

  return (
    <AnimatePresence>
      {kind && (
        <motion.div
          key={kind}
          className="popover"
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          role="dialog"
          aria-label={kind === 'settings' ? '设置' : '今日简报'}
        >
          {kind === 'settings' ? (
            <>
              <div className="popover-title">显示与运行</div>
              <Toggle
                on={s.motion}
                onClick={() => store.setSetting('motion', !s.motion)}
                label="车辆实时移动"
                desc="地图车辆沿路线巡游"
              />
              <Toggle
                on={s.hubPulse}
                onClick={() => store.setSetting('hubPulse', !s.hubPulse)}
                label="枢纽呼吸点"
                desc="冷库节点呼吸动效"
              />
              <Toggle
                on={s.nightDim}
                onClick={() => store.setSetting('nightDim', !s.nightDim)}
                label="夜间低亮度"
                desc="值班室微光模式"
              />
            </>
          ) : (
            <>
              <div className="popover-title">今日简报 · 截至 02:17</div>
              <div className="pop-stats">
                <div className="pop-stat">
                  <span>今日里程</span>
                  <span className="mono">{FLEET_STATS.mileageKm.toLocaleString('en-US')} km</span>
                </div>
                <div className="pop-stat">
                  <span>准点率</span>
                  <span className="mono">{FLEET_STATS.onTimeRate.toFixed(1)}%</span>
                </div>
                <div className="pop-stat">
                  <span>风险车辆</span>
                  <span className="mono" style={{ color: store.riskCount ? 'var(--amber-bright)' : 'var(--ink)' }}>
                    {store.riskCount} 辆
                  </span>
                </div>
                <div className="pop-bar">
                  <i style={{ width: `${(max / max) * 100}%` }} />
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
                  20:00 班次出车高峰已过 · 当前 128 辆在途
                </div>
              </div>
              <button
                className="btn-ghost"
                style={{ width: '100%', height: 34, fontSize: 12.5 }}
                onClick={() => store.exportCsv()}
              >
                <IconDownload size={13} />
                导出车队明细 CSV
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
