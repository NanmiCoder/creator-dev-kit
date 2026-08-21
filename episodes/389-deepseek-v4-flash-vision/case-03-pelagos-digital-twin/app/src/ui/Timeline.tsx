import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowClockwise, Broadcast, Lightning, ShieldWarning } from '@phosphor-icons/react';
import { useStore } from '../store';
import { farmPowerAt, farmSeries, skyPhaseLabel, waveAt, windAt } from '../data/weather';
import { fmtTime, hourOf, WIN_START, WIN_MS } from '../lib/util';
import { AnimatedNumber, Segmented } from './Glass';

/* 底部时间轴：最近 12 小时回放 + 视图模式 + 气象读数 + 迷你图 */

export function Timeline({ compact }: { compact: boolean }) {
  const t = useStore((s) => s.t);
  const live = useStore((s) => s.live);
  const setTime = useStore((s) => s.setTime);
  const goLive = useStore((s) => s.goLive);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);

  const scrubbedMs = Math.round(t - WIN_START);
  const pos = Math.max(0, Math.min(1439, scrubbedMs / 60_000));

  return (
    <div className={`timeline glass ${compact ? 'timeline-compact' : ''}`}>
      <div className="tl-left">
        <Segmented
          id="view"
          compact
          value={viewMode}
          onChange={setViewMode}
          options={[
            { value: 'live', label: '现场', icon: <Broadcast size={14} weight="duotone" /> },
            { value: 'heat', label: '功率热力', icon: <Lightning size={14} weight="duotone" /> },
            { value: 'risk', label: '维护风险', icon: <ShieldWarning size={14} weight="duotone" /> },
          ]}
        />
        <ViewLegend mode={viewMode} />
      </div>

      <div className="tl-mid">
        <Sparkline pos={pos} />
        <div className="tl-scrub-row">
          <input
            className="scrub"
            type="range"
            min={0}
            max={1439}
            step={1}
            value={pos}
            aria-label="回放时间轴"
            onChange={(e) => setTime(WIN_START + Number(e.target.value) * 60_000, false)}
          />
          <span className="mono tl-hour">{fmtTime(WIN_START)}</span>
          <span className="mono tl-hour tl-hour-now">{fmtTime(WIN_START + WIN_MS)}</span>
        </div>
      </div>

      <div className="tl-right">
        {!live && (
          <button className="btn btn-accent tl-live-btn" onClick={goLive}>
            <ArrowClockwise size={14} weight="bold" />
            回到实时
          </button>
        )}
        <div className="tl-readouts">
          <Readout label="风速" value={<AnimatedNumber value={windAt(t)} format={(v) => `${v.toFixed(1)} m/s`} />} />
          {!compact && <Readout label="浪高" value={<AnimatedNumber value={waveAt(t)} format={(v) => `${v.toFixed(1)} m`} />} />}
          <Readout label="总功率" value={<AnimatedNumber value={farmPowerAt(t)} format={(v) => `${v.toFixed(1)} MW`} />} accent />
          <Readout label="天空" value={skyPhaseLabel(t)} />
        </div>
        {!compact && (
          <div className="tl-time mono">
            <span className="tl-time-val">{fmtTime(t, true)}</span>
            <span className="label">{hourOf(t) >= 18 ? '夜间作业窗口' : '日间作业窗口'}</span>
          </div>
        )}
        {!compact && (
          <div className="tl-keys">
            <span><kbd>F</kbd>聚焦</span>
            <span><kbd>M</kbd>电影</span>
            <span><kbd>Esc</kbd>总览</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Readout({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <span className="readout">
      <span className="label">{label}</span>
      <span className={`mono readout-val ${accent ? 'is-accent' : ''}`}>{value}</span>
    </span>
  );
}

/* 迷你功率曲线 */
function Sparkline({ pos }: { pos: number }) {
  const d = useMemo(() => {
    const n = farmSeries.length;
    const max = Math.max(...farmSeries) * 1.06;
    let path = '';
    farmSeries.forEach((v, i) => {
      const x = (i / (n - 1)) * 100;
      const y = 30 - (v / max) * 26;
      path += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    });
    return { path, max };
  }, []);
  const markerX = (pos / 1439) * 100;

  return (
    <div className="spark">
      <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="spark-svg" aria-hidden>
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(222,128,74,0.34)" />
            <stop offset="1" stopColor="rgba(222,128,74,0)" />
          </linearGradient>
        </defs>
        <path d={`${d.path} L100,32 L0,32 Z`} fill="url(#sparkFill)" />
        <path d={d.path} fill="none" stroke="rgba(222,128,74,0.85)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {[0, 1, 2, 3].map((i) => {
          const x = ((i + 1) / 4) * 100;
          return <line key={i} x1={x} y1={0} x2={x} y2={32} stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />;
        })}
      </svg>
      <motion.div className="spark-marker" animate={{ left: `${markerX}%` }} transition={{ type: 'tween', duration: 0.08 }} />
    </div>
  );
}

/* 视图图例 */
function ViewLegend({ mode }: { mode: string }) {
  if (mode === 'heat') {
    return (
      <div className="legend">
        <span className="mono legend-txt">0 MW</span>
        <span className="legend-ramp ramp-heat" />
        <span className="mono legend-txt">6.2 MW</span>
        <span className="label legend-label">单机功率</span>
      </div>
    );
  }
  if (mode === 'risk') {
    return (
      <div className="legend">
        <span className="mono legend-txt">低</span>
        <span className="legend-ramp ramp-risk" />
        <span className="mono legend-txt">高</span>
        <span className="label legend-label">维护风险</span>
      </div>
    );
  }
  return null;
}
