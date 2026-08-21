import { motion } from 'motion/react';
import { Broadcast, Lightning, ShieldWarning } from '@phosphor-icons/react';
import { useStore } from '../store';
import { ARRAYS, TURBINES, statusOf } from '../data/world';
import { powerAt, riskAt } from '../data/weather';
import { STATUS_LABEL } from '../data/ops';

/* WebGL 初始化失败时的降级总览：2D 平面图 + 完整数据联动（非白屏） */

export function DegradedMap() {
  const selected = useStore((s) => s.selected);
  const viewMode = useStore((s) => s.viewMode);
  const select = useStore((s) => s.select);
  const t = useStore((s) => s.t);

  const xs = TURBINES.map((x) => x.x);
  const zs = TURBINES.map((x) => x.z);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minZ = Math.min(...zs), maxZ = Math.max(...zs);
  const nx = (x: number) => ((x - minX) / (maxX - minX)) * 100;
  const nz = (z: number) => ((z - minZ) / (maxZ - minZ)) * 100;

  return (
    <div className="degraded glass">
      <div className="degraded-head">
        <span className="label" style={{ color: 'var(--accent)' }}>降级模式</span>
        <span className="degraded-title">WebGL 渲染不可用，已切换至平面总览</span>
        <span className="degraded-desc">数据链路正常，可继续选中机组、回放时间轴与创建任务</span>
      </div>
      <div className="degraded-map">
        <div className="degraded-grid" />
        {ARRAYS.map((arr) => (
          <span key={arr} className="mono degraded-array-label" style={{ top: `${nz(TURBINES.find((x) => x.array === arr)!.z)}%` }}>
            {arr}
          </span>
        ))}
        {TURBINES.map((tb) => {
          const st = statusOf(tb.id);
          const heat = viewMode === 'heat' ? powerAt(t, tb.id) / 6.2 : viewMode === 'risk' ? riskAt(t, tb.id) / 100 : null;
          return (
            <motion.button
              key={tb.id}
              className={`degraded-dot ${selected === tb.id ? 'is-selected' : ''}`}
              style={{
                left: `${nx(tb.x)}%`,
                top: `${nz(tb.z)}%`,
                background: heat !== null
                  ? `rgb(${Math.round(58 + heat * 164)}, ${Math.round(74 + heat * 52)}, ${Math.round(96 + heat * (viewMode === 'heat' ? 20 : -30))})`
                  : `var(--st-${st})`,
              }}
              onClick={() => select(tb.id, { focus: false })}
              title={`${tb.code} · ${STATUS_LABEL[st]}`}
            >
              <span className="mono degraded-code">{tb.code}</span>
            </motion.button>
          );
        })}
        <div className="degraded-legend">
          {viewMode === 'live' && (
            <span className="degraded-legend-row">
              {['normal', 'derated', 'offline', 'maintenance'].map((st) => (
                <span key={st} className="chip"><span className={`dot dot-st-${st}`} />{STATUS_LABEL[st]}</span>
              ))}
            </span>
          )}
          {viewMode === 'heat' && (
            <span className="degraded-legend-row">
              <span className="mono" style={{ fontSize: 11 }}>0 MW</span>
              <span className="legend-ramp ramp-heat" style={{ width: 90 }} />
              <span className="mono" style={{ fontSize: 11 }}>6.2 MW</span>
            </span>
          )}
          {viewMode === 'risk' && (
            <span className="degraded-legend-row">
              <span className="mono" style={{ fontSize: 11 }}>低风险</span>
              <span className="legend-ramp ramp-risk" style={{ width: 90 }} />
              <span className="mono" style={{ fontSize: 11 }}>高风险</span>
            </span>
          )}
        </div>
        <span className="degraded-hint">
          {viewMode === 'live' ? <Broadcast size={13} /> : viewMode === 'heat' ? <Lightning size={13} /> : <ShieldWarning size={13} />}
          视图模式与时间轴数据联动保持可用
        </span>
      </div>
    </div>
  );
}
