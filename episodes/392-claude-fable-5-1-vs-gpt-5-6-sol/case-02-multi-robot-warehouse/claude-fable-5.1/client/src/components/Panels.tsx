import { useEffect, useRef, useState } from 'react';
import type { Job, SimState } from '../../../shared/types';
import { JOB_STATUS_LABEL, PHASE_LABEL, ROBOT_STATUS_LABEL } from '../labels';
import { api } from '../store';

// ---------------------------------------------------------------- job form

interface JobFormProps {
  state: SimState;
  shelfId: string;
  workstationId: string;
  onChange: (f: { shelfId?: string; workstationId?: string }) => void;
  onError: (msg: string) => void;
}

export function JobForm({ state, shelfId, workstationId, onChange, onError }: JobFormProps) {
  const [priority, setPriority] = useState(3);
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!shelfId || !workstationId) {
      onError('请先选择货架和工作站');
      return;
    }
    setBusy(true);
    try {
      await api('/api/jobs', { shelfId, workstationId, priority });
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="panel">
      <h2>新建搬运任务</h2>
      <div className="form-row">
        <label>
          货架
          <select value={shelfId} onChange={(e) => onChange({ shelfId: e.target.value })}>
            <option value="">— 请选择 —</option>
            {state.map.shelves.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} ({s.x},{s.y})
              </option>
            ))}
          </select>
        </label>
        <label>
          目的工作站
          <select value={workstationId} onChange={(e) => onChange({ workstationId: e.target.value })}>
            <option value="">— 请选择 —</option>
            {state.map.workstations.map((w) => (
              <option key={w.id} value={w.id}>
                {w.id} ({w.x},{w.y})
              </option>
            ))}
          </select>
        </label>
        <label>
          优先级
          <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
            <option value={1}>1 · 低</option>
            <option value={2}>2 · 较低</option>
            <option value={3}>3 · 普通</option>
            <option value={4}>4 · 较高</option>
            <option value={5}>5 · 紧急</option>
          </select>
        </label>
      </div>
      <div className="btn-row">
        <button className="primary" onClick={submit} disabled={busy}>
          创建任务
        </button>
        <button onClick={() => api('/api/jobs/demo').catch((e) => onError((e as Error).message))} title="创建 3 个穿越窄巷的演示任务（优先级 5 / 3 / 1）">
          +3 个演示任务
        </button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- job queue

const JOB_ORDER: Record<Job['status'], number> = { pending: 0, assigned: 1, picking: 1, delivering: 1, done: 2, cancelled: 3 };

export function JobQueue({ state, onError }: { state: SimState; onError: (m: string) => void }) {
  const jobs = [...state.jobs].sort((a, b) => JOB_ORDER[a.status] - JOB_ORDER[b.status] || b.priority - a.priority || a.createdTick - b.createdTick);
  return (
    <section className="panel">
      <h2>
        任务队列 <span className="muted">{state.jobs.filter((j) => JOB_ORDER[j.status] < 2).length} 个进行中 · {state.stats.jobsCompleted} 个已完成</span>
      </h2>
      {jobs.length === 0 && <div className="empty">还没有任务。在上方创建一个，或点击地图上的货架。</div>}
      <table className="tbl">
        <thead>
          <tr>
            <th>任务</th>
            <th>路线</th>
            <th>优先</th>
            <th>状态</th>
            <th>机器人</th>
            <th title="自创建以来经过的时间步">时长</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} className={`job-${j.status}`}>
              <td className="mono">{j.id}</td>
              <td className="mono">
                {j.shelfId} → {j.workstationId}
              </td>
              <td>
                <span className={`prio p${j.priority}`}>{j.priority}</span>
              </td>
              <td>
                <span className={`badge s-${j.status}`}>{JOB_STATUS_LABEL[j.status]}</span>
                {j.note && <div className="note">{j.note}</div>}
              </td>
              <td className="mono">{j.robotId ?? '—'}</td>
              <td className="mono">{(j.completedTick ?? state.tick) - j.createdTick}</td>
              <td>
                {JOB_ORDER[j.status] < 2 && (
                  <button className="tiny" title="取消任务" onClick={() => api(`/api/jobs/${j.id}`, undefined, 'DELETE').catch((e) => onError((e as Error).message))}>
                    ✕
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// ---------------------------------------------------------------- robots

export function RobotList({ state, selected, onSelect }: { state: SimState; selected: string | null; onSelect: (id: string | null) => void }) {
  return (
    <section className="panel">
      <h2>
        机器人 <span className="muted">{state.robots.filter((r) => r.status === 'moving').length} 台移动中 · {state.robots.filter((r) => r.status === 'waiting').length} 台等待中</span>
      </h2>
      <div className="robot-list">
        {state.robots.map((r) => {
          const job = r.jobId ? state.jobs.find((j) => j.id === r.jobId) : undefined;
          return (
            <div key={r.id} className={`robot-row ${selected === r.id ? 'selected' : ''}`} onClick={() => onSelect(selected === r.id ? null : r.id)} title="点击在地图上高亮该机器人的规划路径">
              <div className="robot-head">
                <span className="dot" style={{ background: r.color }} />
                <span className="mono id">{r.id}</span>
                <span className={`badge s-${r.status}`}>{ROBOT_STATUS_LABEL[r.status]}</span>
                <span className="mono muted">
                  ({r.x},{r.y})
                </span>
                <span className="muted right">{PHASE_LABEL[r.phase]}</span>
              </div>
              <div className="robot-sub">
                {job ? (
                  <span className="mono">
                    {job.id} {job.shelfId}→{job.workstationId} P{job.priority}
                  </span>
                ) : (
                  <span className="muted">无任务</span>
                )}
                {r.carrying && <span className="carry">载有 {r.carrying}</span>}
                {r.path.length > 1 && <span className="muted">剩余 {r.path.length - 1} 步</span>}
                {r.waitTicks > 0 && <span className="muted">已等待 {r.waitTicks} 步</span>}
              </div>
              {r.waitReason && <div className={`reason ${r.planFailed ? 'bad' : ''}`}>{r.waitReason}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- log

export function EventLog({ state }: { state: SimState }) {
  const ref = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  useEffect(() => {
    const el = ref.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [state.log]);
  return (
    <section className="panel log-panel">
      <h2>
        事件日志 <span className="muted">{state.log.length} 条</span>
      </h2>
      <div
        className="log"
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
        }}
      >
        {state.log.map((e) => (
          <div key={e.id} className={`log-line ${e.level}`}>
            <span className="mono t">t{e.tick}</span>
            <span>{e.message}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
