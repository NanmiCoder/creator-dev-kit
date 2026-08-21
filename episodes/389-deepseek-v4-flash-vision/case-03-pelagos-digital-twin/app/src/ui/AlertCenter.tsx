import { AnimatePresence, motion } from 'motion/react';
import { Broadcast, Lightning, ShieldWarning, X } from '@phosphor-icons/react';
import { useStore } from '../store';
import { ALERTS, activeAlerts, SEVERITY_META, type AlertDef } from '../data/ops';
import { fmtTime } from '../lib/util';
import { TURBINES, isRecovered } from '../data/world';

/* 告警中心：列表 + 定位机组（切换视图 + 打开上下文面板） */

export function AlertCenter({ force }: { force?: boolean }) {
  const open = useStore((s) => s.alertOpen);
  const setOpen = useStore((s) => s.setAlertOpen);
  const select = useStore((s) => s.select);
  const t = useStore((s) => s.t);
  useStore((s) => s.twinVersion);

  const sorted = [...ALERTS].sort((a, b) => (a.resolvedAt === null ? -1 : 1) - (b.resolvedAt === null ? -1 : 1) || b.time - a.time);

  const locate = (a: AlertDef) => {
    select(a.turbine, { focus: true, view: a.view });
    setOpen(false);
  };

  const visible = force || open;
  const body = (
    <>
      <div className="panel-head" style={{ padding: '14px 16px 12px' }}>
        <ShieldWarning size={16} weight="duotone" style={{ color: 'var(--accent)' }} />
        <span className="label" style={{ color: 'var(--ink-2)' }}>告警中心</span>
        <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 11 }}>{activeAlerts(t).length} 活动</span>
        {!force && (
          <>
            <span style={{ flex: 1 }} />
            <button className="btn icon-btn btn-ghost" style={{ width: 28, height: 28 }} aria-label="关闭" onClick={() => setOpen(false)}>
              <X size={13} />
            </button>
          </>
        )}
      </div>
      <div className="alert-list">
        {sorted.map((a, i) => {
          const active = a.resolvedAt === null && !(a.kind === 'scada' && isRecovered(a.turbine));
          const isNow = a.time <= t;
          return (
            <motion.button
              key={a.id}
              className={`alert-item ${active ? 'is-active' : 'is-resolved'} ${isNow ? '' : 'is-future'}`}
              onClick={() => locate(a)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 320, damping: 28 }}
            >
              <div className="alert-row1">
                <span className={`dot ${active ? 'dot-st-maintenance breath' : 'dot-st-normal'}`} />
                <span className="mono alert-id">{a.id}</span>
                <span className={`chip ${SEVERITY_META[a.severity].cls}`}>{SEVERITY_META[a.severity].label}</span>
                <span className="mono alert-time">{fmtTime(a.time)}{active ? '' : ` · 已恢复 ${fmtTime(a.resolvedAt ?? 0)}`}</span>
              </div>
              <div className="alert-title">{TURBINES[a.turbine].code} · {a.title}</div>
              <div className="alert-detail">{a.detail}</div>
              <div className="alert-actions">
                <span className="alert-view">
                  {a.view === 'risk' ? <ShieldWarning size={12} /> : a.view === 'heat' ? <Lightning size={12} /> : <Broadcast size={12} />}
                  定位机组
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="alert-foot label">点击告警定位机组并切换视图</div>
    </>
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="alert-center glass glass-deep"
          initial={{ opacity: 0, x: 24, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        >
          {body}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
