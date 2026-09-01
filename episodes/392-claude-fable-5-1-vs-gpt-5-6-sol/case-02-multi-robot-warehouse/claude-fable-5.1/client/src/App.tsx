import { useEffect, useState } from 'react';
import MapCanvas from './components/MapCanvas';
import { EventLog, JobForm, JobQueue, RobotList } from './components/Panels';
import { CONN_LABEL } from './labels';
import { api, store, useSim } from './store';

export default function App() {
  const view = useSim();
  const { state, conn } = view;
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null);
  const [form, setForm] = useState({ shelfId: '', workstationId: '' });
  const [seedInput, setSeedInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 4000);
    return () => clearTimeout(t);
  }, [error]);

  const run = (path: string, body?: unknown) => api(path, body).catch((e) => setError((e as Error).message));

  const onCellClick = (x: number, y: number, ch: string) => {
    if (!state) return;
    if (ch === 'S') {
      const s = state.map.shelves.find((s) => s.x === x && s.y === y);
      if (s) setForm((f) => ({ ...f, shelfId: s.id }));
    } else if (ch === 'W') {
      const w = state.map.workstations.find((w) => w.x === x && w.y === y);
      if (w) setForm((f) => ({ ...f, workstationId: w.id }));
    } else if (ch === '.') {
      const blocked = state.blocked.some((b) => b.x === x && b.y === y);
      void run('/api/cells', { x, y, blocked: !blocked });
    }
  };

  if (!state) {
    return (
      <div className="loading">
        <div className="spinner" />
        <div>{conn === 'offline' ? '已离线（手动断开）' : '正在连接仿真服务器…'}</div>
        {conn === 'offline' && <button onClick={() => store.setOffline(false)}>重新连接</button>}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="logo">▣</span>
          <div>
            <div className="title">仓库多机器人调度仿真</div>
            <div className="sub mono">
              种子 {state.seed} · {state.map.width}×{state.map.height} · {state.robots.length} 台机器人 · {state.map.shelves.length} 个货架 · {state.map.workstations.length} 个工作站
            </div>
          </div>
        </div>

        <div className="controls">
          <div className="stat mono">
            <span className="k">时间步</span>
            <span className="v">{state.tick}</span>
          </div>
          <div className="stat mono" title="事件序列号（单调递增）">
            <span className="k">序号</span>
            <span className="v">{view.lastSeq}</span>
          </div>
          <div className="stat mono" title="上一时间步的协同规划耗时">
            <span className="k">规划耗时</span>
            <span className="v">{state.stats.planTimeMs}ms</span>
          </div>
          <div className="stat mono" title="执行层碰撞守卫取消的移动次数">
            <span className="k">守卫拦停</span>
            <span className="v">{state.stats.conflictsResolved}</span>
          </div>
          <span className={`pill ${state.running ? 'run' : 'pause'}`}>{state.running ? '运行中' : '已暂停'}</span>
          {state.running ? <button onClick={() => run('/api/sim/pause')}>⏸ 暂停</button> : <button className="primary" onClick={() => run('/api/sim/resume')}>▶ 继续</button>}
          <button onClick={() => run('/api/sim/step')} title="推进一个固定时间步（会暂停运行）">
            ⏭ 单步
          </button>
          <select
            value={state.tickMs}
            onChange={(e) => run('/api/sim/speed', { tickMs: Number(e.target.value) })}
            title="每个时间步的真实时长（不影响仿真结果）"
          >
            <option value={800}>0.5× 速度</option>
            <option value={400}>1× 速度</option>
            <option value={200}>2× 速度</option>
            <option value={100}>4× 速度</option>
          </select>
          <span className="reset-group">
            <input className="mono" placeholder={`种子 ${state.seed}`} value={seedInput} onChange={(e) => setSeedInput(e.target.value)} size={8} />
            <button className="danger" onClick={() => run('/api/sim/reset', { seed: seedInput === '' ? undefined : Number(seedInput) })} title="按种子重新生成仓库并重新开始确定性运行">
              ↺ 重置
            </button>
          </span>
          <span className={`pill conn ${conn}`} title={`快照 ${view.snapshots} 次 · 已应用事件 ${view.eventsApplied} · 丢弃过期事件 ${view.stale} · 序列缺口 ${view.gaps}`}>
            ● {CONN_LABEL[conn]}
          </span>
          {conn === 'offline' ? (
            <button onClick={() => store.setOffline(false)}>重新连接</button>
          ) : (
            <button onClick={() => store.setOffline(true)} title="关闭 WebSocket，用于测试快照 + 事件序列恢复">
              断开连接
            </button>
          )}
        </div>
      </header>

      <main className="main">
        <div className="map-area">
          <MapCanvas state={state} selectedRobot={selectedRobot} onSelectRobot={setSelectedRobot} onCellClick={onCellClick} />
        </div>
        <EventLog state={state} />
      </main>

      <aside className="side">
        <JobForm state={state} shelfId={form.shelfId} workstationId={form.workstationId} onChange={(f) => setForm((p) => ({ ...p, ...f }))} onError={setError} />
        <RobotList state={state} selected={selectedRobot} onSelect={setSelectedRobot} />
        <JobQueue state={state} onError={setError} />
      </aside>

      {error && <div className="toast">{error}</div>}
      {conn !== 'open' && (
        <div className={`banner ${conn}`}>
          {conn === 'offline' ? '已手动断开，服务器仍在继续仿真。重新连接后会先收到完整快照，再继续接收后续事件。' : '连接已断开，正在重连…（当前显示的是最后一次权威快照）'}
        </div>
      )}
    </div>
  );
}
