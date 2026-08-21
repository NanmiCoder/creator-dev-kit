import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BellRinging, FilmSlate, Lightning, Waveform, Wind } from '@phosphor-icons/react';
import { useStore } from '../store';
import { activeAlerts } from '../data/ops';
import { connAt, farmPowerAt, waveAt, windAt } from '../data/weather';
import { fmtDate, fmtMW, fmtTime, hourOf } from '../lib/util';
import { AnimatedNumber, IconBtn } from './Glass';

/* 顶部导航：品牌 / 时间 / 气象 / 并网功率 / 连接质量 / 动态岛 */

export function TopBar({ compact }: { compact: boolean }) {
  const t = useStore((s) => s.t);
  const alertOpen = useStore((s) => s.alertOpen);
  const setAlertOpen = useStore((s) => s.setAlertOpen);
  const cinema = useStore((s) => s.cinema);
  const setCinema = useStore((s) => s.setCinema);
  useStore((s) => s.twinVersion);
  const alerts = activeAlerts(t);

  const wind = windAt(t);
  const power = farmPowerAt(t);
  const conn = connAt(t);

  return (
    <header className={`topbar glass ${compact ? 'topbar-compact' : ''}`}>
      {/* 品牌 */}
      <div className="brand">
        <span className="rotor-mark" aria-hidden>
          <i /><i /><i />
        </span>
        <span className="brand-name">
          PELAGOS <span className="brand-slash">/</span> <span className="brand-field">FIELD 07</span>
        </span>
        {!compact && (
          <span className="brand-date mono">
            {fmtDate(t)} · {fmtTime(t, true)}
          </span>
        )}
      </div>

      {/* 气象与功率 */}
      <div className={`topbar-metrics ${compact ? 'topbar-metrics-compact' : ''}`}>
        <MetricChip icon={<Wind size={15} weight="duotone" />} label="风速" value={<AnimatedNumber value={wind} format={(v) => `${v.toFixed(1)} m/s`} />} hide={compact} />
        <MetricChip icon={<Waveform size={15} weight="duotone" />} label="浪高" value={<AnimatedNumber value={waveAt(t)} format={(v) => `${v.toFixed(1)} m`} />} hide={compact} />
        <MetricChip icon={<Lightning size={15} weight="duotone" />} label="并网" value={<AnimatedNumber value={power} format={(v) => `${fmtMW(v)} MW`} />} />
      </div>

      {/* 右侧：连接质量 + 动态岛 + 操作 */}
      <div className="topbar-right">
        {!compact && (
          <span className={`conn ${conn < 97 ? 'conn-warn' : ''}`}>
            <span className="dot breath" style={{ background: conn < 97 ? 'var(--warn)' : 'var(--ok)' }} />
            <span className="mono">{conn.toFixed(1)}%</span>
            <span className="conn-label">链路</span>
          </span>
        )}

        <DynamicIsland alertCount={alerts.length} onOpen={() => setAlertOpen(!alertOpen)} />

        <IconBtn title="告警中心" active={alertOpen} onClick={() => setAlertOpen(!alertOpen)}>
          <BellRinging size={18} weight={alertOpen ? 'fill' : 'duotone'} />
          {alerts.length > 0 && <span className="badge">{alerts.length}</span>}
        </IconBtn>
        {!compact && (
          <IconBtn title="电影模式 (M)" active={cinema} onClick={() => setCinema(!cinema)}>
            <FilmSlate size={18} weight={cinema ? 'fill' : 'duotone'} />
          </IconBtn>
        )}
      </div>
    </header>
  );
}

function MetricChip({ icon, label, value, hide, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; hide?: boolean; accent?: boolean }) {
  if (hide) return null;
  return (
    <span className={`metric-chip ${accent ? 'metric-accent' : ''}`}>
      <span className="metric-icon">{icon}</span>
      <span className="metric-label">{label}</span>
      <span className="mono metric-value">{value}</span>
    </span>
  );
}

/** 动态岛：状态时窄，告警出现时形变展开，循环显示最新告警 */
function DynamicIsland({ alertCount, onOpen }: { alertCount: number; onOpen: () => void }) {
  const t = useStore((s) => s.t);
  const [idx, setIdx] = useState(0);
  const alerts = activeAlerts(t);
  const active = alertCount > 0;

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setIdx((i) => i + 1), 4200);
    return () => clearInterval(timer);
  }, [active]);

  const latest = alerts.length > 0 ? alerts[idx % alerts.length] : null;

  return (
    <motion.button
      type="button"
      layout
      onClick={onOpen}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`island ${active ? 'island-alert' : ''}`}
      aria-label="告警动态"
    >
      <span className={`dot ${active ? 'dot-st-maintenance breath' : ''}`} style={!active ? { background: 'var(--ok)' } : undefined} />
      <AnimatePresence mode="wait" initial={false}>
        {active && latest ? (
          <motion.span
            key={`${latest.id}-${idx}`}
            className="island-text mono"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {latest.title}
          </motion.span>
        ) : (
          <motion.span
            key="ok"
            className="island-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            链路稳定
          </motion.span>
        )}
      </AnimatePresence>
      <span className={`island-count mono ${active ? '' : 'hidden'}`}>{active ? alertCount : ''}</span>
    </motion.button>
  );
}
