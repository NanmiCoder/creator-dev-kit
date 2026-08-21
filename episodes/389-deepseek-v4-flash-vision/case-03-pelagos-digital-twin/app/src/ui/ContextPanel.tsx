import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CaretRight, CheckCircle, Gauge, ListChecks, Thermometer, Waveform, Wrench, X, WarningCircle,
} from '@phosphor-icons/react';
import { useStore } from '../store';
import { ARRAYS, TURBINES, setStatusOverride, statusOf } from '../data/world';
import { farmPowerAt, genTodayKWh, powerAt, rpmOf, tempAt, utilizationOf, vibrationAt, windAtTurbine, yawErrorAt } from '../data/weather';
import { ordersOf, SEVERITY_META, STATUS_DESC, STATUS_LABEL, TECHNICIANS, type Severity } from '../data/ops';
import { fmtMW } from '../lib/util';
import { AnimatedNumber, GlassButton, Magnetic } from './Glass';
/* 右侧上下文面板：风场总览 ⇄ 机组详情（shared layout 平滑变形） */

export function ContextPanel({ compact }: { compact: boolean }) {
  const selected = useStore((s) => s.selected);
  const alertOpen = useStore((s) => s.alertOpen);
  useStore((s) => s.twinVersion);

  if (alertOpen) return null;

  return (
    <motion.aside
      layout
      className="panel glass panel-ctx"
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
    >
      <div className="panel-head">
        <AnimatePresence mode="wait" initial={false}>
          {selected === null ? (
            <motion.div key="ov-head" className="ctx-head" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}>
              <Gauge size={16} weight="duotone" style={{ color: 'var(--ink-2)' }} />
              <span className="label" style={{ color: 'var(--ink-2)' }}>风场总览</span>
            </motion.div>
          ) : (
            <motion.div key={`h-${selected}`} className="ctx-head" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}>
              <span className="mono ctx-title">{TURBINES[selected].code}</span>
              <span className={`chip st-${statusOf(selected)}`}>
                <span className={`dot dot-st-${statusOf(selected)}`} />
                {STATUS_LABEL[statusOf(selected)]}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <span style={{ flex: 1 }} />
        <span className="label ctx-hint">PELAGOS OPS</span>
      </div>
      <div className="panel-body ctx-body">
        <AnimatePresence mode="popLayout" initial={false}>
          {selected === null ? (
            <motion.div key="overview" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <Overview />
            </motion.div>
          ) : (
            <motion.div key={`detail-${selected}`} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <TurbineDetail id={selected} compact={compact} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {selected !== null && <TaskFormAnchor id={selected} />}
    </motion.aside>
  );
}

/* ---------------- 风场总览 ---------------- */

function Overview() {
  const t = useStore((s) => s.t);
  useStore((s) => s.twinVersion);
  const select = useStore((s) => s.select);
  const power = farmPowerAt(t);
  const gen = genTodayKWh(t);
  const util = utilizationOf(t);

  return (
    <div className="ov">
      <div className="ov-hero">
        <span className="label">并网功率</span>
        <span className="ov-big mono">
          <AnimatedNumber value={power} format={(v) => fmtMW(v)} /> <span className="ov-unit">MW</span>
        </span>
        <span className="ov-sub mono">装机 148.8 MW · 在线 {TURBINES.filter((tb) => statusOf(tb.id) !== 'offline').length}/24</span>
      </div>
      <div className="ov-grid">
        <div className="ov-cell">
          <span className="label">今日发电量</span>
          <span className="mono ov-num">{gen >= 1_000_000 ? (gen / 1_000_000).toFixed(2) : (gen / 1000).toFixed(1)} <span className="ov-unit">{gen >= 1_000_000 ? 'GWh' : 'MWh'}</span></span>
        </div>
        <div className="ov-cell">
          <span className="label">容量系数</span>
          <span className="mono ov-num"><AnimatedNumber value={util} format={(v) => `${v.toFixed(1)}%`} /></span>
        </div>
      </div>

      <div className="ov-sec">
        <span className="label">阵列输出</span>
        {ARRAYS.map((arr) => {
          const ids = TURBINES.filter((tb) => tb.array === arr).map((tb) => tb.id);
          const sum = ids.reduce((s, i) => s + powerAt(t, i), 0);
          const pct = sum / (ids.length * 6.2);
          return (
            <div key={arr} className="ov-bar-row">
              <span className="mono ov-bar-label">{arr}</span>
              <div className="ov-bar">
                <motion.div
                  className="ov-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(3, pct * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 24 }}
                  style={{ opacity: 0.35 + pct * 0.65 }}
                />
              </div>
              <span className="mono ov-bar-val">{sum.toFixed(1)} MW</span>
            </div>
          );
        })}
      </div>

      <div className="ov-sec">
        <span className="label">状态分布</span>
        <div className="ov-status">
          {(['normal', 'derated', 'offline', 'maintenance'] as const).map((st) => {
            const n = TURBINES.filter((tb) => statusOf(tb.id) === st).length;
            if (n === 0) return null;
            return (
              <span key={st} className="chip st-chip">
                <span className={`dot dot-st-${st}`} />
                {STATUS_LABEL[st]} <b className="mono">{n}</b>
              </span>
            );
          })}
        </div>
      </div>

      <div className="ov-sec">
        <span className="label">活动告警</span>
        <AlertMinis />
      </div>

      <div className="ov-tip">
        <Waveform size={14} />
        <span>点击左侧资产或场景中的风机查看详情</span>
      </div>
    </div>
  );
}

function AlertMinis() {
  const select = useStore((s) => s.select);
  const setAlertOpen = useStore((s) => s.setAlertOpen);
  return (
    <div className="ov-alerts">
      {[
        { id: 'AL-2471', label: 'T-18 · 齿轮箱振动 8.7 mm/s', sev: 'high' as Severity, turbine: 17, view: 'risk' as const },
        { id: 'AL-2472', label: 'T-22 · SCADA 信号中断', sev: 'high' as Severity, turbine: 21, view: 'live' as const },
        { id: 'AL-2473', label: 'T-07 · 偏航误差 11.4°', sev: 'medium' as Severity, turbine: 6, view: 'risk' as const },
      ].map((a) => (
        <button key={a.id} className="ov-alert" onClick={() => { select(a.turbine, { focus: true, view: a.view }); setAlertOpen(false); }}>
          <span className={`dot ${a.sev === 'high' ? 'dot-st-maintenance' : 'dot-st-derated'}`} />
          <span className="mono ov-alert-label">{a.label}</span>
          <CaretRight size={12} style={{ color: 'var(--ink-3)' }} />
        </button>
      ))}
    </div>
  );
}

/* ---------------- 机组详情 ---------------- */

function TurbineDetail({ id, compact }: { id: number; compact: boolean }) {
  const t = useStore((s) => s.t);
  useStore((s) => s.twinVersion);
  const select = useStore((s) => s.select);
  const tasks = useStore((s) => s.tasks);
  const tb = TURBINES[id];
  const status = statusOf(id);
  const wind = windAtTurbine(t, id);
  const vib = vibrationAt(t, id);
  const temp = tempAt(t, id, wind);
  const yawErr = yawErrorAt(t, id);
  const rpm = rpmOf(wind, status);
  const scadaDown = id === 21 && status === 'offline';

  return (
    <div className="dt">
      <div className="dt-metrics">
        <MetricCard label="实时功率" value={<AnimatedNumber value={powerAt(t, id)} format={(v) => `${v.toFixed(2)}`} />} unit="MW" />
        <MetricCard label="机舱温度" value={<AnimatedNumber value={temp} format={(v) => `${v.toFixed(1)}`} />} unit="°C" tone={temp > 52 ? 'warn' : undefined} />
        <MetricCard label="振动" value={<AnimatedNumber value={vib} format={(v) => `${v.toFixed(1)}`} />} unit="mm/s" tone={vib > 4.5 ? 'danger' : undefined} />
        <MetricCard label="偏航角" value={<AnimatedNumber value={(tb.baseYaw + yawErr) % 360} format={(v) => `${v.toFixed(1)}`} />} unit="°" sub={Math.abs(yawErr) > 3 ? `误差 ${yawErr.toFixed(1)}°` : undefined} tone={Math.abs(yawErr) > 3 ? 'warn' : undefined} />
      </div>
      <div className="dt-sub">
        <span className="mono dt-sub-item">风速 <b>{wind.toFixed(1)} m/s</b></span>
        <span className="mono dt-sub-item">叶轮 <b>{(rpm * 9.5493).toFixed(1)} rpm</b></span>
        <span className="mono dt-sub-item">阵列 <b>{tb.array}</b></span>
      </div>

      {scadaDown && <ScadaErrorCard id={id} />}

      <div className="dt-status">
        <span className={`chip st-chip st-${status}`}><span className={`dot dot-st-${status}`} />{STATUS_LABEL[status]}</span>
        <span className="dt-status-desc">{STATUS_DESC[status]}</span>
      </div>

      <div className="dt-sec">
        <span className="label">最近工单</span>
        <WorkOrderList id={id} tasks={tasks.filter((tk) => tk.turbine === id)} />
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, tone, sub }: { label: string; value: React.ReactNode; unit: string; tone?: 'warn' | 'danger'; sub?: string }) {
  return (
    <div className={`metric-card ${tone === 'warn' ? 'is-warn' : tone === 'danger' ? 'is-danger' : ''}`}>
      <span className="label">{label}</span>
      <span className="mono metric-num">{value}<span className="metric-unit">{unit}</span></span>
      {sub ? <span className="mono metric-sub">{sub}</span> : null}
    </div>
  );
}

function WorkOrderList({ id, tasks }: { id: number; tasks: Array<{ id: string; title: string; severity: string; tech: string; when: string }> }) {
  const base = ordersOf(id);
  const list = [
    ...tasks.map((tk) => ({
      id: tk.id,
      title: `维护任务 · ${tk.title}`,
      assignee: tk.tech,
      status: 'assigned' as const,
      due: tk.when,
    })),
    ...base,
  ];
  if (list.length === 0) {
    return (
      <div className="dt-empty">
        <ListChecks size={20} style={{ color: 'var(--ink-3)' }} />
        <span>暂无工单</span>
        <span className="dt-empty-hint">可创建维护任务安排检修窗口</span>
      </div>
    );
  }
  return (
    <div className="wo-list">
      {list.slice(0, 4).map((wo) => (
        <div key={wo.id} className="wo-item">
          <span className="mono wo-id">{wo.id}</span>
          <span className="wo-title">{wo.title}</span>
          <span className="wo-meta">
            <span className="mono">{wo.assignee}</span>
            <span className={`chip wo-status ${wo.status === 'done' ? 'wo-done' : 'wo-open'}`}>{wo.status === 'done' ? '已闭环' : '计划中'}</span>
          </span>
          <span className="mono wo-due">{wo.due}</span>
        </div>
      ))}
    </div>
  );
}

function ScadaErrorCard({ id }: { id: number }) {
  const [state, setState] = useState<'idle' | 'loading' | 'fail'>('idle');
  const attempt = useRef(0);
  const toast = useStore((s) => s.toast);
  const bumpTwin = useStore((s) => s.bumpTwin);
  const retry = () => {
    setState('loading');
    attempt.current += 1;
    setTimeout(() => {
      if (attempt.current >= 2) {
        // 第二次重连成功 → 恢复数据流
        setStatusOverride(id, 'normal');
        bumpTwin();
        toast('T-22 SCADA 链路已恢复', 'success');
        setState('idle');
      } else {
        setState('fail');
        toast('重连超时，稍后重试', 'error');
      }
    }, 1600);
  };
  return (
    <div className={`scada-card ${state === 'fail' ? 'is-fail' : ''}`}>
      <WarningCircle size={16} weight="duotone" style={{ color: state === 'fail' ? 'var(--danger)' : 'var(--amber)' }} />
      <div style={{ flex: 1 }}>
        <div className="scada-title">SCADA 链路中断</div>
        <div className="scada-desc">
          {state === 'loading' ? '正在尝试重连…' : state === 'fail' ? '连接超时，链路仍无响应' : '当前显示本地缓存数据，实时值不可用'}
        </div>
      </div>
      <button className="btn btn-ghost" style={{ height: 30, fontSize: 12 }} disabled={state === 'loading'} onClick={retry}>
        {state === 'loading' ? <span className="spinner" /> : '重试连接'}
      </button>
    </div>
  );
}

/* ---------------- 维护任务：按钮 morph 成玻璃面板 ---------------- */

function TaskFormAnchor({ id }: { id: number }) {
  const open = useStore((s) => s.taskFormOpen);
  const setOpen = useStore((s) => s.setTaskFormOpen);
  const tb = TURBINES[id];

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div
            key="cta"
            className="dt-cta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
          >
            <Magnetic>
              <motion.div layoutId="task-morph" transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
                <GlassButton variant="accent" style={{ height: 42, padding: '0 18px' }} onClick={() => setOpen(true)}>
                  <Wrench size={16} weight="fill" />
                  创建维护任务
                </GlassButton>
              </motion.div>
            </Magnetic>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && <MaintenanceForm key="form" id={id} code={tb.code} />}
      </AnimatePresence>
    </>
  );
}

function MaintenanceForm({ id, code }: { id: number; code: string }) {
  const setOpen = useStore((s) => s.setTaskFormOpen);
  const addTask = useStore((s) => s.addTask);
  const toast = useStore((s) => s.toast);
  const [when, setWhen] = useState('今日 22:00');
  const [sev, setSev] = useState<Severity>('medium');
  const [techId, setTechId] = useState('');
  const [note, setNote] = useState('');
  const [phase, setPhase] = useState<'form' | 'submitting' | 'success' | 'error'>('form');
  const [err, setErr] = useState('');
  const [taskId, setTaskId] = useState('');

  const submit = () => {
    const tech = TECHNICIANS.find((x) => x.id === techId);
    if (!tech) { setErr('请选择执行技师'); return; }
    if (sev === 'high' && !tech.highAlt) { setErr('该机组为高塔作业，所选技师缺少高空资质'); return; }
    setErr('');
    setPhase('submitting');
    setTimeout(() => {
      if (Math.random() < 0.16) {
        setPhase('error');
        setErr('调度服务暂时不可用，请重试');
        return;
      }
      const tid = `MT-${String(2400 + Math.floor(Math.random() * 300))}`;
      setTaskId(tid);
      addTask({ id: tid, turbine: id, title: `${sev === 'high' ? '紧急' : sev === 'medium' ? '计划' : '例行'}维护 · ${when}`, when, severity: SEVERITY_META[sev].label, tech: tech.name, createdAt: Date.now() });
      setPhase('success');
      toast(`${code} 维护任务已创建`, 'success');
    }, 1100);
  };

  return (
    <motion.div
      layoutId="task-morph"
      className="task-form glass glass-deep"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
    >
      <div className="task-head">
        <Wrench size={15} weight="duotone" style={{ color: 'var(--accent)' }} />
        <span className="mono task-title">创建维护任务 · {code}</span>
        <span style={{ flex: 1 }} />
        <button className="btn icon-btn btn-ghost" style={{ width: 26, height: 26 }} aria-label="关闭" onClick={() => setOpen(false)}>
          <X size={13} />
        </button>
      </div>

      {phase === 'success' ? (
        <div className="task-success">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
            <CheckCircle size={34} weight="fill" style={{ color: 'var(--ok)' }} />
          </motion.div>
          <span className="mono task-success-id">{taskId}</span>
          <span className="task-success-text">已加入维护计划</span>
          <GlassButton variant="accent" style={{ marginTop: 6 }} onClick={() => { setOpen(false); }}>
            完成
          </GlassButton>
        </div>
      ) : (
        <div className="task-body">
          <div className="field">
            <label className="field-label">维护时间</label>
            <div className="task-chips">
              {['现在', '今日 22:00', '明日 08:00', '明日 14:00'].map((w) => (
                <button key={w} className={`task-chip ${when === w ? 'is-active' : ''}`} onClick={() => setWhen(w)}>{w}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">严重级别</label>
            <div className="task-chips">
              {(['low', 'medium', 'high'] as Severity[]).map((sv) => (
                <button key={sv} className={`task-chip sev-${sv} ${sev === sv ? 'is-active' : ''}`} onClick={() => setSev(sv)}>
                  <span className={`dot ${sv === 'high' ? 'dot-st-maintenance' : sv === 'medium' ? 'dot-st-derated' : 'dot-st-normal'}`} />
                  {SEVERITY_META[sv].label}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">执行技师</label>
            <select className="input" value={techId} onChange={(e) => setTechId(e.target.value)}>
              <option value="">选择技师</option>
              {TECHNICIANS.filter((x) => x.available).map((x) => (
                <option key={x.id} value={x.id}>{x.name} · {x.role}{x.highAlt ? ' · 高空' : ''}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">备注 <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>可选</span></label>
            <input className="input" placeholder="例如：需要运维船 S-03 接送" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          {err && (
            <motion.div className="task-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              <WarningCircle size={13} weight="fill" />
              {err}
            </motion.div>
          )}
          <div className="task-actions">
            <GlassButton variant="ghost" onClick={() => setOpen(false)}>取消</GlassButton>
            <GlassButton variant="accent" disabled={phase === 'submitting'} onClick={submit}>
              {phase === 'submitting' ? <span className="spinner spinner-light" /> : null}
              {phase === 'submitting' ? '提交中…' : '提交任务'}
            </GlassButton>
          </div>
        </div>
      )}
    </motion.div>
  );
}
