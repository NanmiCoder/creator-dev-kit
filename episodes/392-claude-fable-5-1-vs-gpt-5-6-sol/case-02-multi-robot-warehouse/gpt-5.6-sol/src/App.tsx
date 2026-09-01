import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Job, MapCell, Position, Priority, Robot, Snapshot } from "./types";

type ConnectionStatus = "connecting" | "live" | "reconnecting" | "offline";
type Notice = { tone: "error" | "success"; message: string } | null;

const positionKey = (position: Position) => `${position.x},${position.y}`;
const priorityRank: Record<Priority, number> = { high: 3, normal: 2, low: 1 };

async function mutate(path: string, options: RequestInit): Promise<unknown> {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  const payload = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(payload.error ?? `请求失败（${response.status}）`);
  return payload;
}

function phaseLabel(robot: Robot): string {
  if (robot.phase === "to_shelf") return "前往取货位";
  if (robot.phase === "to_station") return "前往工作站";
  return "可用";
}

function connectionLabel(status: ConnectionStatus): string {
  if (status === "live") return "实时连接";
  if (status === "reconnecting") return "正在重连";
  if (status === "offline") return "已离线";
  return "正在同步";
}

const priorityLabel: Record<Priority, string> = { low: "低", normal: "普通", high: "高" };
const statusLabel: Record<Job["status"], string> = { queued: "排队中", active: "执行中", completed: "已完成" };
const robotStatusLabel: Record<Robot["status"], string> = { idle: "空闲", moving: "移动中", waiting: "等待中" };
const eventTypeLabel: Record<Snapshot["eventLog"][number]["type"], string> = {
  system: "系统",
  job: "任务",
  route: "路径",
  map: "地图",
  safety: "安全",
};

function localizeOperationalMessage(message: string): string {
  return message
    .replace("Target access is blocked; awaiting map change", "目标入口已封锁，等待地图变更")
    .replace(/Reservation conflict with (.+)/, "与 $1 的时空预留发生冲突")
    .replace("No safe route inside planning horizon", "规划地平线内暂无安全路径")
    .replace(/Yielding reserved aisle to (.+)/, "正在向 $1 让出已预留通道")
    .replace("Timed hold for collision-free passage", "为无碰撞通行进行计时停留");
}

function localizeLegacyLog(message: string): string {
  return localizeOperationalMessage(message
    .replace(/Restored deterministic run at tick (\d+)\./, "已恢复确定性运行，当前为第 $1 步。")
    .replace(/Simulation initialized with seed ([^.]+)\./, "仿真已初始化，种子为 $1。")
    .replace(/Automatic clock resumed\./, "自动时钟已恢复。")
    .replace(/Simulation paused by operator\./, "仿真已由操作员暂停。")
    .replace(/Run reset to deterministic seed ([^;]+); clock is paused\./, "已按确定性种子 $1 重置；时钟已暂停。")
    .replace(/(J-\d+) queued: (S-\d+) → (WS-\d+) \((low|normal|high)\)\./, (_match, job, shelf, station, priority: Priority) => `${job} 已排队：${shelf} → ${station}（${priorityLabel[priority]}优先级）。`)
    .replace(/(J-\d+) assigned to (R-\d+); effective priority (\d+)\./, "$1 已分配给 $2；当前有效优先级为 $3。")
    .replace(/(R-\d+) collected (J-\d+) from (S-\d+)\./, "$1 已从 $3 取得 $2 货物。")
    .replace(/(J-\d+) delivered to (WS-\d+) by (R-\d+)\./, "$3 已将 $1 送达 $2。")
    .replace(/Cell \[(\d+),(\d+)\] blocked(?:; replanned (.+))?\./, (_match, x, y, robots) => `网格 [${x},${y}] 已封锁${robots ? `；已为 ${robots} 重新规划` : ""}。`)
    .replace(/Cell \[(\d+),(\d+)\] reopened(?:; replanned (.+))?\./, (_match, x, y, robots) => `网格 [${x},${y}] 已重新开放${robots ? `；已为 ${robots} 重新规划` : ""}。`)
    .replace(/(R-\d+) waiting: (.+)/, "$1 正在等待：$2"));
}

function Icon({ name }: { name: "play" | "pause" | "step" | "reset" | "plus" | "lock" }) {
  const paths = {
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: <><path d="M7 5h4v14H7z" /><path d="M14 5h4v14h-4z" /></>,
    step: <><path d="m6 5 9 7-9 7Z" /><path d="M17 5h2v14h-2z" /></>,
    reset: <><path d="M5.4 6.5A8 8 0 1 1 4 14" /><path d="M4 4v5h5" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  };
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function App() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [connection, setConnection] = useState<ConnectionStatus>("connecting");
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const latestSequence = useRef(-1);

  useEffect(() => {
    let disposed = false;
    const stream = new EventSource("/api/events");
    const applySnapshot = (event: MessageEvent<string>) => {
      if (disposed) return;
      const incoming = JSON.parse(event.data) as Snapshot;
      if (incoming.sequence < latestSequence.current) return;
      latestSequence.current = incoming.sequence;
      setSnapshot(incoming);
      setConnection("live");
    };
    const applyNewerState = (event: MessageEvent<string>) => {
      if (disposed) return;
      const incoming = JSON.parse(event.data) as Snapshot;
      if (incoming.sequence <= latestSequence.current) return;
      latestSequence.current = incoming.sequence;
      setSnapshot(incoming);
      setConnection("live");
    };
    stream.addEventListener("snapshot", applySnapshot as EventListener);
    stream.addEventListener("state", applyNewerState as EventListener);
    stream.onopen = () => setConnection("live");
    stream.onerror = () => setConnection((status) => (status === "connecting" ? "offline" : "reconnecting"));
    return () => {
      disposed = true;
      stream.close();
    };
  }, []);

  const perform = async (operation: () => Promise<unknown>, success?: string) => {
    setBusy(true);
    setNotice(null);
    try {
      await operation();
      if (success) setNotice({ tone: "success", message: success });
    } catch (error) {
      setNotice({ tone: "error", message: error instanceof Error ? error.message : "操作失败。" });
    } finally {
      setBusy(false);
    }
  };

  if (!snapshot) {
    return (
      <main className="boot-screen">
        <div className="boot-mark" aria-hidden="true"><span /><span /><span /></div>
        <p className="eyebrow">航点 / 调度控制系统</p>
        <h1>正在建立权威状态…</h1>
        <p className="boot-detail">正在等待仓库事件流。</p>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <Header snapshot={snapshot} connection={connection} busy={busy} perform={perform} />
      {notice && (
        <div className={`notice notice--${notice.tone}`} role="status">
          <span>{notice.message}</span>
          <button onClick={() => setNotice(null)} aria-label="关闭通知">×</button>
        </div>
      )}

      <main className="operations-grid">
        <WarehouseMap snapshot={snapshot} busy={busy} perform={perform} />
        <DispatchPanel snapshot={snapshot} busy={busy} perform={perform} />
        <RobotPanel snapshot={snapshot} />
        <EventPanel snapshot={snapshot} />
      </main>
      <footer className="footer-strip">
        <span>仿真种子 / {snapshot.seed}</span>
        <span>固定步长 / {snapshot.stepMs}毫秒</span>
        <span>协同 A* / 规划地平线 88</span>
        <span>状态持久化 / 已启用</span>
      </footer>
    </div>
  );
}

function Header({
  snapshot,
  connection,
  busy,
  perform,
}: {
  snapshot: Snapshot;
  connection: ConnectionStatus;
  busy: boolean;
  perform: (operation: () => Promise<unknown>, success?: string) => Promise<void>;
}) {
  const control = (action: "pause" | "resume" | "step" | "reset") =>
    perform(
      () => mutate("/api/control", { method: "POST", body: JSON.stringify({ action }) }),
      action === "reset" ? "已重置为确定性初始状态。" : undefined,
    );

  return (
    <header className="command-bar">
      <div className="brand-lockup">
        <div className="brand-glyph" aria-hidden="true"><span /><span /><span /></div>
        <div>
          <p className="eyebrow">仓储履约控制 / 05</p>
          <h1>航点调度</h1>
        </div>
      </div>

      <div className="system-readouts" aria-label="系统状态">
        <div><span>步数</span><strong>{String(snapshot.tick).padStart(5, "0")}</strong></div>
        <div><span>序列</span><strong>{String(snapshot.sequence).padStart(5, "0")}</strong></div>
        <div><span>移动中</span><strong>{snapshot.metrics.moving}/8</strong></div>
        <div><span>预留</span><strong>{snapshot.metrics.reservations}</strong></div>
      </div>

      <div className="command-actions">
        <div className={`connection-pill connection-pill--${connection}`}>
          <span className="connection-dot" />{connectionLabel(connection)}
        </div>
        <div className="control-group" aria-label="仿真控制">
          <button
            className="icon-button"
            onClick={() => control(snapshot.running ? "pause" : "resume")}
            disabled={busy}
            title={snapshot.running ? "暂停仿真" : "继续仿真"}
          >
            <Icon name={snapshot.running ? "pause" : "play"} />
            <span>{snapshot.running ? "暂停" : "运行"}</span>
          </button>
          <button className="icon-button" onClick={() => control("step")} disabled={busy || snapshot.running} title="前进一个时间步">
            <Icon name="step" /><span>单步</span>
          </button>
          <button
            className="icon-button icon-button--quiet"
            onClick={() => window.confirm("确定重置所有任务、地图变更和机器人位置吗？") && control("reset")}
            disabled={busy}
            title="重置确定性运行"
          >
            <Icon name="reset" /><span>重置</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function WarehouseMap({
  snapshot,
  busy,
  perform,
}: {
  snapshot: Snapshot;
  busy: boolean;
  perform: (operation: () => Promise<unknown>, success?: string) => Promise<void>;
}) {
  const blocked = useMemo(() => new Set(snapshot.map.blocked), [snapshot.map.blocked]);
  const robotByPosition = useMemo(
    () => new Map(snapshot.robots.map((robot) => [positionKey(robot.position), robot])),
    [snapshot.robots],
  );

  const toggleCell = (cell: MapCell) => {
    if (!(["floor", "workstation"] as string[]).includes(cell.type) || robotByPosition.has(cell.key)) return;
    const shouldBlock = !blocked.has(cell.key);
    void perform(
      () => mutate(`/api/cells/${cell.x}/${cell.y}`, { method: "PUT", body: JSON.stringify({ blocked: shouldBlock }) }),
      `网格 [${cell.x},${cell.y}] ${shouldBlock ? "已封锁并重新规划路径" : "已重新开放"}。`,
    );
  };

  return (
    <section className="panel map-panel" aria-labelledby="map-title">
      <div className="panel-heading map-heading">
        <div>
          <p className="eyebrow">实时仓面 / A 区</p>
          <h2 id="map-title">路径调度中心</h2>
        </div>
        <div className="map-instruction"><Icon name="lock" /><span>点击空闲网格可封锁</span></div>
      </div>

      <div className="map-viewport">
        <div
          className="warehouse-map"
          style={{
            aspectRatio: `${snapshot.map.width} / ${snapshot.map.height}`,
            gridTemplateColumns: `repeat(${snapshot.map.width}, 1fr)`,
            gridTemplateRows: `repeat(${snapshot.map.height}, 1fr)`,
          }}
        >
          {snapshot.map.cells.map((cell) => {
            const isBlocked = blocked.has(cell.key);
            const isOccupied = robotByPosition.has(cell.key);
            const traversable = cell.type === "floor" || cell.type === "workstation";
            const label = cell.type === "shelf"
              ? `${cell.id}，货架，不可通行`
              : cell.type === "workstation"
                ? `${cell.label}工作站，位于 ${cell.x}, ${cell.y}`
                : `${cell.type === "wall" ? "墙体" : "地面"}网格，位于 ${cell.x}, ${cell.y}${isBlocked ? "，已封锁" : ""}`;
            return (
              <button
                key={cell.key}
                className={`map-cell map-cell--${cell.type}${isBlocked ? " is-blocked" : ""}${cell.bottleneck ? " is-choke" : ""}`}
                onClick={() => toggleCell(cell)}
                disabled={busy || !traversable || isOccupied}
                aria-label={label}
                title={traversable ? `${label}。点击${isBlocked ? "解除封锁" : "封锁"}。` : label}
              >
                {cell.type === "shelf" && <span>{cell.id?.slice(2)}</span>}
                {cell.type === "workstation" && <span>W{cell.id?.slice(-1)}</span>}
                {cell.bottleneck && cell.y === 8 && <small>{cell.bottleneck?.slice(-2)}</small>}
                {isBlocked && <span className="block-cross" aria-hidden="true" />}
              </button>
            );
          })}

          <svg className="route-layer" viewBox={`0 0 ${snapshot.map.width} ${snapshot.map.height}`} preserveAspectRatio="none" aria-hidden="true">
            {snapshot.robots.filter((robot) => robot.path.length > 1).map((robot) => (
              <g key={robot.id}>
                <polyline
                  className="route-halo"
                  points={robot.path.map((step) => `${step.x + 0.5},${step.y + 0.5}`).join(" ")}
                />
                <polyline
                  className="route-line"
                  style={{ stroke: robot.color }}
                  points={robot.path.map((step) => `${step.x + 0.5},${step.y + 0.5}`).join(" ")}
                />
              </g>
            ))}
          </svg>

          {snapshot.robots.map((robot) => (
            <div
              key={robot.id}
              className={`robot-marker robot-marker--${robot.status}`}
              style={{
                left: `${((robot.position.x + 0.5) / snapshot.map.width) * 100}%`,
                top: `${((robot.position.y + 0.5) / snapshot.map.height) * 100}%`,
                "--robot-color": robot.color,
              } as React.CSSProperties}
              title={`${robot.id}: ${phaseLabel(robot)}${robot.waitReason ? ` — ${robot.waitReason}` : ""}`}
            >
              <span>{robot.id.slice(-2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="map-legend" aria-label="地图图例">
        <span><i className="legend-swatch legend-swatch--robot" />机器人</span>
        <span><i className="legend-swatch legend-swatch--route" />规划路径</span>
        <span><i className="legend-swatch legend-swatch--shelf" />货架</span>
        <span><i className="legend-swatch legend-swatch--station" />工作站</span>
        <span><i className="legend-swatch legend-swatch--choke" />瓶颈通道</span>
        <span><i className="legend-swatch legend-swatch--blocked" />手动封锁</span>
      </div>
    </section>
  );
}

function DispatchPanel({
  snapshot,
  busy,
  perform,
}: {
  snapshot: Snapshot;
  busy: boolean;
  perform: (operation: () => Promise<unknown>, success?: string) => Promise<void>;
}) {
  const shelves = snapshot.map.cells.filter((cell) => cell.type === "shelf");
  const stations = snapshot.map.cells.filter((cell) => cell.type === "workstation");
  const [shelfId, setShelfId] = useState(shelves[0]?.id ?? "");
  const [stationId, setStationId] = useState(stations[0]?.id ?? "");
  const [priority, setPriority] = useState<Priority>("normal");
  const jobs = [...snapshot.jobs]
    .filter((job) => job.status !== "completed")
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "active" ? -1 : 1;
      return priorityRank[b.priority] - priorityRank[a.priority] || a.createdTick - b.createdTick;
    });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void perform(
      () => mutate("/api/jobs", { method: "POST", body: JSON.stringify({ shelfId, stationId, priority }) }),
      "运输任务已由调度器接收。",
    );
  };

  return (
    <aside className="panel dispatch-panel" aria-labelledby="dispatch-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">调度器输入</p>
          <h2 id="dispatch-title">新建运输任务</h2>
        </div>
        <span className="panel-count">{snapshot.metrics.queued} 个排队中</span>
      </div>

      <form className="job-form" onSubmit={submit}>
        <label>
          <span>01 / 取货库位</span>
          <select value={shelfId} onChange={(event) => setShelfId(event.target.value)} disabled={busy}>
            {shelves.map((shelf) => <option key={shelf.id} value={shelf.id}>{shelf.id} · {shelf.label}</option>)}
          </select>
        </label>
        <label>
          <span>02 / 目标工作站</span>
          <select value={stationId} onChange={(event) => setStationId(event.target.value)} disabled={busy}>
            {stations.map((station) => <option key={station.id} value={station.id}>{station.id} · {station.label}</option>)}
          </select>
        </label>
        <fieldset>
          <legend>03 / 优先级</legend>
          <div className="priority-switch">
            {(["low", "normal", "high"] as Priority[]).map((value) => (
              <label key={value} className={priority === value ? "is-selected" : ""}>
                <input type="radio" name="priority" value={value} checked={priority === value} onChange={() => setPriority(value)} />
                <span>{priorityLabel[value]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button className="dispatch-button" type="submit" disabled={busy || !shelfId || !stationId}>
          <Icon name="plus" /><span>下发任务</span><small>自动分配</small>
        </button>
      </form>

      <div className="queue-heading">
        <span>执行中清单</span>
        <span>{jobs.length} 个未完成</span>
      </div>
      <div className="job-list">
        {jobs.length === 0 ? (
          <div className="empty-state"><span>暂无未完成任务</span><p>请在上方创建运输单。</p></div>
        ) : jobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
    </aside>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <article className={`job-card job-card--${job.priority}`}>
      <div className="job-card-top">
        <strong>{job.id}</strong>
        <span className={`status-chip status-chip--${job.status}`}>{statusLabel[job.status]}</span>
      </div>
      <div className="job-route"><span>{job.shelfId}</span><i /> <span>{job.stationId}</span></div>
      <div className="job-meta">
        <span>{priorityLabel[job.priority]}优先级</span>
        <span>{job.assignedRobotId ?? `已等待 ${job.ageTicks} 步`}</span>
      </div>
    </article>
  );
}

function RobotPanel({ snapshot }: { snapshot: Snapshot }) {
  const jobsById = new Map(snapshot.jobs.map((job) => [job.id, job]));
  return (
    <section className="panel robot-panel" aria-labelledby="fleet-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">机器人集群遥测</p>
          <h2 id="fleet-title">机器人状态</h2>
        </div>
        <div className="fleet-summary">
          <span><b>{snapshot.metrics.moving}</b> 移动中</span>
          <span><b>{snapshot.metrics.waiting}</b> 等待中</span>
        </div>
      </div>
      <div className="robot-table" role="table" aria-label="机器人状态表">
        <div className="robot-table-head" role="row">
          <span>编号</span><span>状态 / 阶段</span><span>任务</span><span>位置</span><span>下一步动作</span>
        </div>
        {snapshot.robots.map((robot) => {
          const job = robot.jobId ? jobsById.get(robot.jobId) : undefined;
          return (
            <div className="robot-row" role="row" key={robot.id}>
              <div className="robot-identity"><i style={{ background: robot.color }} /><strong>{robot.id}</strong></div>
              <div><span className={`state-label state-label--${robot.status}`}>{robotStatusLabel[robot.status]}</span><small>{phaseLabel(robot)}</small></div>
              <div><strong>{robot.jobId ?? "—"}</strong><small>{job ? `${job.shelfId} → ${job.stationId}` : `已完成 ${robot.completedJobs} 单`}</small></div>
              <div><strong>[{robot.position.x},{robot.position.y}]</strong><small>已规划 {Math.max(0, robot.path.length - 1)} 步</small></div>
              <div className={robot.waitReason ? "wait-copy" : ""}>
                <strong>{robot.waitReason ? localizeOperationalMessage(robot.waitReason) : robot.jobId ? "路径畅通" : "就绪"}</strong>
                <small>{robot.waitReason ? `已等待 ${robot.waitTicks} 步` : robot.jobId ? "时空预留已确认" : "可接受任务分配"}</small>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EventPanel({ snapshot }: { snapshot: Snapshot }) {
  const entries = [...snapshot.eventLog].reverse();
  return (
    <section className="panel event-panel" aria-labelledby="event-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">序列化事件流</p>
          <h2 id="event-title">运行日志</h2>
        </div>
        <span className="panel-count">最新 #{snapshot.sequence}</span>
      </div>
      <div className="event-list" aria-live="polite">
        {entries.length === 0 ? <div className="empty-state">暂无事件记录</div> : entries.map((entry) => (
          <article className={`event-entry event-entry--${entry.tone}`} key={entry.id}>
            <time>#{String(entry.sequence).padStart(4, "0")} / T{String(entry.tick).padStart(4, "0")}</time>
            <div><span>{eventTypeLabel[entry.type]}</span><p>{localizeLegacyLog(entry.message)}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default App;
