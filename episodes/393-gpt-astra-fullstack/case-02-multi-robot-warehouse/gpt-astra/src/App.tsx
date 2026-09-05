import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { Activity, ArrowDownLeft, ArrowRight, ArrowUpRight, BatteryCharging, Box, Check, CheckCheck, ChevronDown, ChevronRight, CircleHelp, Crosshair, Expand, Grid2X2, Layers, Maximize2, Minimize2, Minus, MoreHorizontal, MousePointer2, Package, Pause, Play, Plus, Radio, RotateCcw, Route, ShieldCheck, SkipForward, SlidersHorizontal, Square, Terminal, Truck, Unplug, Warehouse, X, Zap } from 'lucide-react';
import type { Cell, Job, Priority, Robot, SimulationState } from '../shared/types';
import { cellKey, sameCell } from '../shared/types';
import { useSimulation } from './useSimulation';
import { useMapFullscreen } from './useMapFullscreen';
import { priorityLabels, translateMessage } from './locale';

type Command = (url: string, body?: unknown, method?: string) => Promise<unknown>;
const fmt = (n: number) => String(n).padStart(2, '0');
function Logo() { return <div className="logo"><span className="logo-mark"><Route size={23} strokeWidth={2.6} /></span>relay<span className="logo-period">.</span></div>; }
function Status({ status }: { status: Robot['status'] }) { return <span className={`status ${status}`}><i />{status === 'moving' ? '移动中' : status === 'returning' ? '返航中' : status === 'waiting' ? '等待中' : '空闲'}</span>; }
function App() {
  const { state, connection, error, setError, pending, command } = useSimulation();
  const [selected, setSelected] = useState<string | null>(null);
  const [showJob, setShowJob] = useState(false);
  const [shelf, setShelf] = useState('S01');
  const [showHelp, setShowHelp] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const { panelRef, expanded, toggle: toggleFullscreen } = useMapFullscreen();
  const obstacleQueue = useRef(Promise.resolve());
  const [mapFeedback, setMapFeedback] = useState('');
  const [paths, setPaths] = useState(true);
  const [grid, setGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [jobTab, setJobTab] = useState<'active' | 'completed' | 'all'>('active');
  const [logFilter, setLogFilter] = useState(false);
  const fleetRef = useRef<HTMLElement>(null);
  const act = (url: string, body?: unknown, method?: string) => { void command(url, body, method).catch(() => {}); };
  const toggleObstacle = (cell: Cell) => {
    if (connection !== 'live') return;
    setPaths(true);
    setMapFeedback(`正在更新格子 [${cell.x}, ${cell.y}]…`);
    // Preserve rapid clicks in order. The server toggles against its latest state,
    // rather than guessing a boolean from a potentially delayed SSE snapshot.
    obstacleQueue.current = obstacleQueue.current.then(async () => {
      try {
        const result = await command('/api/obstacles/toggle', cell);
        setMapFeedback(`格子 [${cell.x}, ${cell.y}] 已${result.blocked ? '禁用' : '恢复'} · 路线已重新规划 · 序号 ${result.seq}`);
      } catch (error) { setMapFeedback((error as Error).message); }
    });
  };
  if (!state) return <div className="loading"><Logo /><div className="loading-line" /><p>正在连接仓库调度系统…</p>{error && <p className="error-text">{error}</p>}<small>仿真状态由服务器统一维护。</small></div>;
  const busy = pending || connection !== 'live';
  const active = state.jobs.filter(j => ['queued', 'assigned', 'in_transit'].includes(j.status));
  const completed = state.jobs.filter(j => j.status === 'completed');
  const available = state.robots.filter(r => r.status === 'idle').length;
  const working = state.robots.length - available;
  const robot = state.robots.find(r => r.id === selected);
  const visibleJobs = state.jobs.filter(j => jobTab === 'active' ? ['queued', 'assigned', 'in_transit'].includes(j.status) : jobTab === 'completed' ? j.status === 'completed' : true);
  const logs = state.events.filter(e => !logFilter || ['warning', 'route'].includes(e.type));
  return <div className="app-shell">
    <header className="topbar"><Logo /><div className="header-divider" /><button className="site-select" onClick={() => setShowHelp(true)}><Warehouse size={17} /><span>北区中心</span><ChevronRight size={13} /><strong>01 号仓库</strong><ChevronDown size={13} /></button><div className="topbar-right"><span className={`connection ${connection}`}><i />{connection === 'live' ? '系统已连接' : '正在重连…'}</span><span className="header-divider" /><button className="icon-button help-button" aria-label="打开帮助" onClick={() => setShowHelp(true)}><CircleHelp size={18} /></button><span className="avatar" title="本地操作员">值班</span></div></header>
    <aside className="rail"><button className="rail-button current" aria-label="调度概览" title="调度概览" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Grid2X2 size={21} /></button><button className="rail-button" aria-label="查看机器人" title="机器人车队" onClick={() => fleetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}><Truck size={21} /></button><button className="rail-button" aria-label="创建运输任务" title="创建运输任务" onClick={() => setShowJob(true)}><Package size={21} /></button><button className="rail-button" aria-label="定位仓库地图" title="点击可通行格子，禁用或恢复通行" onClick={() => { panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); panelRef.current?.querySelector<SVGSVGElement>('.warehouse-svg')?.focus({ preventScroll: true }); }}><Layers size={21} /></button><div className="rail-bottom"><button className="rail-button" aria-label="仿真使用指南" onClick={() => setShowHelp(true)}><CircleHelp size={21} /></button><span className="rail-live" title="本地仿真服务" /></div></aside>
    <main>
      <div className="page-heading"><div><div className="eyebrow"><span />仓库调度中心</div><h1>调度有序，运转不息。</h1><p>让每台机器人协同运行，让每一步运输都有迹可循。</p></div><div className="heading-actions"><button className="button secondary" onClick={() => setShowHelp(true)}><CircleHelp size={15} />快速指南</button><button className="button primary" onClick={() => setShowJob(true)} disabled={busy}><Plus size={17} />创建任务</button></div></div>
      {connection !== 'live' && <div className="notice"><Unplug size={16} />连接已中断，正在保留最后确认的状态，重连后将自动同步最新数据。</div>}
      {error && <div className="notice error" role="alert"><span>{error}</span><button className="icon-button" aria-label="关闭错误提示" onClick={() => setError('')}><X size={16} /></button></div>}
      <section className="metrics" aria-label="仓库运行指标">
        <div className="metric"><div className="metric-label">车队利用率<Truck size={16} /></div><div className="metric-bottom"><div className="metric-value">{Math.round(working / 8 * 100)}<span>%</span></div><div className="fleet-bars">{state.robots.map(r => <i key={r.id} className={r.status !== 'idle' ? 'used' : ''} />)}</div></div><div className="metric-caption"><span className="green-dot" />{working} 台运行中 <span className="muted">/ 8 台在线</span></div></div>
        <div className="metric"><div className="metric-label">进行中任务<Package size={16} /></div><div className="metric-bottom"><div className="metric-value">{fmt(active.length)}</div><span className="metric-chip">{active.filter(j => j.status === 'queued').length} 个排队中</span></div><div className="metric-caption"><span className="orange-dot" />{active.filter(j => j.priority === 'high').length} 个高优先级 <span className="muted">· 等待自动提权</span></div></div>
        <div className="metric"><div className="metric-label">已完成任务<CheckCheck size={17} /></div><div className="metric-bottom"><div className="metric-value">{fmt(state.metrics.completed)}</div><svg className="sparkline" viewBox="0 0 105 35" aria-label="任务完成趋势"><path d={completed.length ? `M0 30 ${Array.from({ length: 10 }, (_, i) => `L${i * 11 + 5} ${30 - Math.min(25, completed.filter(j => (j.completedTick ?? 0) <= state.tick * (i + 1) / 10).length * 5)}`).join(' ')}` : 'M0 29 H105'} fill="none" stroke="#648b6d" strokeWidth="2" /></svg></div><div className="metric-caption"><Check size={13} />{state.metrics.moves} 格行驶距离 <span className="muted">本次仿真</span></div></div>
        <div className="metric health"><div className="metric-label">通行安全<ShieldCheck size={17} /></div><div className="metric-bottom"><div className="health-value">防碰撞保护中<span className="health-pulse" /></div><span className="shield-icon"><ShieldCheck size={23} /></span></div><div className="metric-caption">{state.metrics.conflictsAvoided} 步预约等待 <span className="muted">· 防碰撞已启用</span></div></div>
      </section>
      <div className="workspace">
        <div className="primary-column">
          <section ref={panelRef} className={`panel map-panel ${expanded ? 'is-expanded' : ''}`} role={expanded ? 'dialog' : undefined} aria-modal={expanded || undefined} aria-label={expanded ? '仓库全屏视图' : undefined}>
            <div className="panel-header"><div className="panel-title"><span className="title-icon"><Warehouse size={18} /></span><h2>仓库实时地图</h2><span className={`live-tag ${state.paused ? 'paused' : ''}`}><i />{state.paused ? '已暂停' : '运行中'}</span></div><div className="map-actions"><button className={`icon-button ${paths ? 'is-active' : ''}`} title="显示或隐藏规划路线" aria-label="显示或隐藏规划路线" aria-pressed={paths} onClick={() => setPaths(!paths)}><Route size={17} /></button><button className={`icon-button ${grid ? 'is-active' : ''}`} title="显示或隐藏网格" aria-label="显示或隐藏网格" aria-pressed={grid} onClick={() => setGrid(!grid)}><Grid2X2 size={16} /></button><span className="mini-divider" /><span className="direct-edit-label"><MousePointer2 size={14} />左键禁用格子</span></div></div>
            <div className="map-subhead"><span><i className="green-dot" />{state.map.width} × {state.map.height} 网格 <b>·</b> {state.map.shelves.length} 个货架 <b>·</b> 4 个工作站</span><span className="mono">种子 {state.map.seed}</span></div>
            <div className="warehouse-canvas"><WarehouseMap state={state} selected={selected} onSelect={setSelected} paths={paths} grid={grid} zoom={zoom} expanded={expanded} busy={connection !== 'live'} onCell={toggleObstacle} onFeedback={setMapFeedback} onShelf={id => { setShelf(id); setShowJob(true); }} /><div className="map-label top-left"><span />北区中心 / 一层仓库</div><div className="map-zoom"><button aria-label="放大" disabled={zoom >= 1.5} onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}><Plus size={15} /></button><span>{Math.round(zoom * 100)}%</span><button aria-label="缩小" disabled={zoom <= 1} onClick={() => setZoom(Math.max(1, zoom - 0.1))}><Minus size={15} /></button><button aria-label="恢复默认缩放" title="重置缩放" onClick={() => setZoom(1)}><Crosshair size={14} /></button><button aria-label={expanded ? '退出地图全屏' : '地图全屏'} title={expanded ? '退出全屏（Esc）' : '全屏查看地图'} aria-pressed={expanded} onClick={toggleFullscreen}>{expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button></div><div className="edit-hint"><MousePointer2 size={14} />左键禁用或恢复格子，右键查看机器人。</div></div>
            <div className="map-feedback" role="status" aria-live="polite"><span className="green-dot" />{connection !== 'live' ? '正在重连，数据同步后可继续编辑地图' : mapFeedback || '动态规划已就绪，左键点击可通行格子即可模拟封路'}{expanded && <span className="fullscreen-escape">按 Esc 退出全屏</span>}</div>
            {expanded && robot && <div className="fullscreen-robot-inspector"><span className="detail-dot" style={{ background: robot.color }} /><strong>{robot.id}</strong><Status status={robot.status} /><span>{translateMessage(robot.reason)}</span><span className="mono">[{robot.position.x}, {robot.position.y}] · {robot.route.length} 步已预约</span><button className="icon-button" aria-label="关闭全屏机器人详情" onClick={() => setSelected(null)}><X size={14} /></button></div>}
            <div className="map-legend"><div><span className="legend-swatch shelf" />货架<span className="legend-swatch station" />工作站<span className="legend-swatch robot" />机器人<span className="legend-swatch planned" />规划路线<span className="legend-swatch blocked" />已禁用</div><span className="map-hint"><MousePointer2 size={12} />右键查看机器人详情</span></div>
            <div className="simulation-controls"><div className="control-group"><button className={`button ${state.paused ? 'primary' : 'dark'} run-button`} onClick={() => act('/api/control', { action: state.paused ? 'resume' : 'pause' })} disabled={busy}>{state.paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}{state.paused ? '运行仿真' : '暂停仿真'}</button><button className="button secondary step-button" onClick={() => act('/api/control', { action: 'step' })} disabled={busy || !state.paused}><SkipForward size={14} />单步执行</button><button className="icon-button" aria-label="重置仿真" title="重置仿真" onClick={() => setShowReset(true)} disabled={busy}><RotateCcw size={16} /></button><span className="mini-divider" /><label className="speed-control" title="播放速度"><Zap size={14} /><select aria-label="仿真速度" value={state.speed} onChange={e => act('/api/control', { action: 'speed', value: Number(e.target.value) })} disabled={busy}><option value="0.5">0.5 倍速</option><option value="1">1 倍速</option><option value="2">2 倍速</option><option value="4">4 倍速</option></select></label></div><div className="tick-display"><span>仿真步数</span><strong>{String(state.tick).padStart(5, '0')}</strong><i /></div></div>
          </section>
          <section className="panel fleet-panel" ref={fleetRef}><div className="panel-header"><div className="panel-title"><Truck size={18} /><h2>机器人车队</h2><span className="count-badge">8</span></div><span className="small-muted"><i className="green-dot" />全部机器人在线</span></div>
            <div className="robot-grid">{state.robots.map(r => <button className={`robot-card ${selected === r.id ? 'selected' : ''}`} style={{ '--robot-color': r.color } as React.CSSProperties} key={r.id} onClick={() => setSelected(selected === r.id ? null : r.id)} aria-label={`查看 ${r.id}`} aria-pressed={selected === r.id}><div className="robot-card-top"><span className="robot-glyph"><Truck size={17} /></span><strong>{r.id}</strong><Status status={r.status} /></div><div className="robot-assignment"><span>{r.jobId ?? '等待分配任务'}</span><span className="mono">{r.position.x},{r.position.y}</span></div><div className="robot-reason" title={translateMessage(r.reason)}>{translateMessage(r.reason)}</div></button>)}</div>
            {robot && <div className="robot-detail"><div><span className="detail-dot" style={{ background: robot.color }} /><strong>{robot.id}</strong><span>{translateMessage(robot.reason)}</span></div><div><span>{robot.route.length} 步已预约</span><b>·</b><span>{robot.distance} 格行驶距离</span><b>·</b><span>{robot.replans} 次重新规划</span><button className="icon-button" aria-label="关闭机器人详情" onClick={() => setSelected(null)}><X size={13} /></button></div></div>}
          </section>
        </div>
        <aside className="secondary-column">
          <section className="panel jobs-panel"><div className="panel-header"><div className="panel-title"><Package size={18} /><h2>任务队列</h2><span className="count-badge">{active.length}</span></div><button className="icon-button" aria-label="添加任务" onClick={() => setShowJob(true)}><Plus size={18} /></button></div><div className="job-tabs">{(['active', 'completed', 'all'] as const).map(tab => <button key={tab} className={jobTab === tab ? 'active' : ''} onClick={() => setJobTab(tab)}>{tab === 'active' ? '进行中' : tab === 'completed' ? '已完成' : '全部任务'}{tab === 'active' && <span>{active.length}</span>}</button>)}</div><div className="job-list">{visibleJobs.length ? visibleJobs.map(job => <JobCard key={job.id} job={job} state={state} selected={selected} onSelect={setSelected} cancel={() => act(`/api/jobs/${job.id}`, undefined, 'DELETE')} />) : <div className="empty-state"><CheckCheck size={27} /><strong>{jobTab === 'completed' ? '等待首个任务完成' : '当前没有待处理任务'}</strong><p>{jobTab === 'completed' ? '已完成的运输任务将显示在这里。' : '创建运输任务，系统会自动分配机器人。'}</p><button className="button secondary" onClick={() => setShowJob(true)}><Plus size={14} />创建任务</button></div>}</div><div className="queue-footer"><ShieldCheck size={14} /><span>按优先级调度，等待越久优先级越高</span></div></section>
          <section className="panel events-panel"><div className="panel-header"><div className="panel-title"><Activity size={18} /><h2>事件日志</h2><span className="live-mini" /></div><button className={`icon-button ${logFilter ? 'is-active' : ''}`} title="筛选路线与障碍事件" aria-label="筛选路线与障碍事件" aria-pressed={logFilter} onClick={() => setLogFilter(!logFilter)}><SlidersHorizontal size={16} /></button></div><div className="event-list" aria-label="仿真事件日志">{logs.slice(0, 40).map(event => <div className={`event ${event.type}`} key={event.id}><span className="event-icon">{event.type === 'success' ? <Check size={12} /> : event.type === 'warning' ? <Square size={10} /> : event.type === 'route' ? <Route size={12} /> : <Plus size={12} />}</span><div><p>{translateMessage(event.message)}</p><span>步数 {String(event.tick).padStart(5, '0')}</span></div></div>)}{!logs.length && <div className="empty-state">暂无符合条件的事件。</div>}</div><div className="event-footer"><span className="green-dot" />{connection === 'live' ? '正在接收实时事件' : '等待连接'}<span className="mono">序号 {state.seq}</span></div></section>
        </aside>
      </div>
      <footer className="page-footer"><span><ShieldCheck size={13} />每一步都有预约，每台机器人都在掌握之中。</span><span>本地仿真<span className="footer-dot">·</span>引擎 v1.0<span className="footer-dot">·</span><span className="mono">每步 600 毫秒</span></span></footer>
    </main>
    {showJob && <JobDialog state={state} initialShelf={shelf} busy={busy} command={command} onClose={() => setShowJob(false)} />}
    {showReset && <Modal title="确定重新开始仿真？" onClose={() => setShowReset(false)}><p className="modal-description">这将清空当前任务与临时障碍，并重置机器人位置。系统使用相同种子和四个初始任务复现原场景，事件序号会继续递增。</p><div className="modal-actions"><button className="button secondary" onClick={() => setShowReset(false)}>保留当前仿真</button><button className="button primary" disabled={busy} onClick={() => { act('/api/control', { action: 'reset' }); setShowReset(false); }}><RotateCcw size={15} />重置仿真</button></div></Modal>}
    {showHelp && <Modal title="欢迎使用仓库调度系统" onClose={() => setShowHelp(false)}><p className="modal-description">八台机器人在同一仓库协同运行，每台机器人出发前都会预约完整的安全行程。</p><ol className="guide"><li><span>01</span><div><strong>开始运输任务</strong><p>可以运行四个初始任务，也可以自行创建从货架到工作站的运输任务。高优先级任务优先调度，等待中的任务会逐步提升优先级。</p></div></li><li><span>02</span><div><strong>模拟封路与动态重规划</strong><p>左键点击机器人前方的可通行格子即可禁用，再次点击恢复通行。运行中或全屏状态下，系统都会在下一步移动前重新规划路线。货架和墙壁属于固定障碍。</p></div></li><li><span>03</span><div><strong>查看机器人与单步调试</strong><p>右键点击机器人，或点击对应车队卡片，可查看它的路线与状态。点击全屏按钮展开地图，按 Esc 退出。暂停后点击“单步执行”可逐步观察；按住 Shift 点击货架可创建运输任务。</p></div></li><li><span>04</span><div><strong>随时恢复当前进度</strong><p>服务器会保存每次状态变化。刷新页面或断线重连后，将加载完整快照，并且只接收更新的数据，避免回退到旧状态。</p></div></li></ol><button className="button primary full-width" onClick={() => setShowHelp(false)}>开始调度<ArrowRight size={16} /></button></Modal>}
  </div>;
}

function WarehouseMap({ state, selected, onSelect, paths, grid, zoom, expanded, busy, onCell, onShelf, onFeedback }: { state: SimulationState; selected: string | null; onSelect: (id: string | null) => void; paths: boolean; grid: boolean; zoom: number; expanded: boolean; busy: boolean; onCell: (cell: Cell) => void; onShelf: (id: string) => void; onFeedback: (message: string) => void }) {
  const walls = new Set(state.map.walls.map(cellKey));
  const shelves = new Set(state.map.shelves.map(cellKey));
  const blocked = new Set(state.blocked.map(cellKey));
  const [cursor, setCursor] = useState<Cell>({ x: 2, y: 2 });
  const [showCursor, setShowCursor] = useState(false);
  const w = 29 / zoom, h = 20.7 / zoom;
  const atPointer = (svg: SVGSVGElement, clientX: number, clientY: number): Cell | null => {
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
    const cell = { x: Math.floor(point.x), y: Math.floor(point.y) };
    return cell.x >= 0 && cell.y >= 0 && cell.x < state.map.width && cell.y < state.map.height ? cell : null;
  };
  const activate = (cell: Cell, shift = false) => {
    if (busy) return;
    const shelf = state.map.shelves.find(s => sameCell(s, cell));
    if (shelf && shift) { onShelf(shelf.id); return; }
    if (walls.has(cellKey(cell)) || shelves.has(cellKey(cell))) {
      onFeedback('货架和墙壁是固定障碍，请左键点击可通行格子来禁用或恢复通行。'); return;
    }
    onCell(cell);
  };
  const point = (event: ReactPointerEvent<SVGSVGElement>) => {
    const cell = atPointer(event.currentTarget, event.clientX, event.clientY);
    if (!cell) { setShowCursor(false); return null; }
    setCursor(previous => sameCell(previous, cell) ? previous : cell); setShowCursor(true); return cell;
  };
  return <svg className={`warehouse-svg direct-edit ${busy ? 'is-offline' : ''}`} viewBox={`${12.5 - w / 2} ${9 - h / 2} ${w} ${h}`} preserveAspectRatio={expanded ? 'xMidYMid meet' : 'none'} aria-label="交互式仓库地图：左键禁用或恢复格子；方向键选择格子，回车键切换通行状态。" role="group" tabIndex={0}
    onPointerMove={point} onPointerLeave={() => setShowCursor(false)}
    onPointerDown={event => {
      if (event.button !== 0) return;
      event.preventDefault();
      // Focus only the root SVG, never a tiny transformed SVG child. Its outline
      // is measured in screen pixels and cannot expand across the warehouse.
      event.currentTarget.focus({ preventScroll: true });
      const cell = point(event); if (cell) activate(cell, event.shiftKey);
    }}
    onContextMenu={event => {
      event.preventDefault(); const cell = atPointer(event.currentTarget, event.clientX, event.clientY);
      const robot = cell && state.robots.find(r => sameCell(r.position, cell));
      if (robot) onSelect(selected === robot.id ? null : robot.id);
    }}
    onKeyDown={event => {
      const direction: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      if (direction[event.key]) {
        event.preventDefault(); const [dx, dy] = direction[event.key];
        setCursor(previous => ({ x: Math.max(0, Math.min(state.map.width - 1, previous.x + dx)), y: Math.max(0, Math.min(state.map.height - 1, previous.y + dy)) })); setShowCursor(true);
      } else if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) { event.preventDefault(); activate(cursor, event.shiftKey); }
    }}>
    <defs><pattern id="floor-grid" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M1 0H0V1" fill="none" stroke="#dde1da" strokeWidth="0.027" /></pattern><pattern id="blocked-hatch" width="0.25" height="0.25" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="0.25" height="0.25" fill="#ffebe3" /><rect width="0.08" height="0.25" fill="#e8a084" /></pattern></defs>
    <rect x="0" y="0" width="27" height="19" rx=".35" fill="#f8f9f5" stroke="#dfe3da" strokeWidth=".06" />
    <rect x="3.2" y="1" width="20.6" height="17" fill="#f2f4ef" />
    {grid && <rect x="1" y="1" width="25" height="17" fill="url(#floor-grid)" />}
    <rect x=".6" y="1.2" width="2.1" height="16.6" rx=".3" fill="#e9eee6" />
    <path d="M3.2 2.7H23.9M3.2 9H23.9M3.2 15.6H23.9" stroke="#e4e8df" strokeWidth=".06" strokeDasharray=".22 .22" />
    <text x="1.65" y=".66" className="map-area-label" textAnchor="middle">充电泊位</text><text x="25.05" y=".66" className="map-area-label" textAnchor="middle">工作站</text>
    {Array.from({ length: 6 }, (_, i) => <g key={i}><text x={6 + i * 3} y="2.17" className="map-zone" textAnchor="middle">{String.fromCharCode(65 + i)} 区</text><rect x={4.85 + i * 3} y="3.84" width="2.3" height="4.32" rx=".1" fill="#e3e7dc" /><rect x={4.85 + i * 3} y="9.84" width="2.3" height="4.32" rx=".1" fill="#e3e7dc" /></g>)}
    {Array.from({ length: state.map.width * state.map.height }, (_, i) => { const c = { x: i % state.map.width, y: Math.floor(i / state.map.width) }; if (walls.has(cellKey(c)) || shelves.has(cellKey(c))) return null; return <rect key={i} className="floor-cell" data-cell={cellKey(c)} x={c.x + .025} y={c.y + .025} width=".95" height=".95" rx=".1" fill="transparent" />; })}
    {state.map.homes.map((home, i) => <g key={i} pointerEvents="none"><rect x={home.x + .03} y={home.y + .03} width=".94" height=".94" rx=".17" fill="#f6f8f3" stroke="#bbc8b2" strokeWidth=".045" strokeDasharray=".1 .08" /><text x={home.x + 1.15} y={home.y + .61} className="bay-label">{fmt(i + 1)}</text></g>)}
    {state.map.shelves.map(s => <g key={s.id} className="shelf-cell" data-shelf={s.id}><rect x={s.x + .07} y={s.y + .07} width=".86" height=".86" rx=".075" fill="#d1d9c7" stroke="#afbea3" strokeWidth=".025" /><path d={`M${s.x + .16} ${s.y + .27}h.68M${s.x + .16} ${s.y + .73}h.68`} stroke="#aebd9f" strokeWidth=".035" /><text x={s.x + .5} y={s.y + .59} className="shelf-label" textAnchor="middle">{s.id}</text><title>{s.id} · {s.zone} 区 · 取货点 [{s.pickup.x}, {s.pickup.y}]</title></g>)}
    {paths && state.robots.filter(r => r.route.length).map(r => <g key={r.id} pointerEvents="none" opacity={selected && r.id !== selected ? .12 : selected ? .9 : .65}><polyline points={[r.position, ...r.route].map(p => `${p.x + .5},${p.y + .5}`).join(' ')} fill="none" stroke={r.color} strokeWidth={selected === r.id ? '.13' : '.08'} strokeDasharray=".17 .14" strokeLinecap="round" strokeLinejoin="round" />{r.route.filter(p => p.action === 'pickup').map((p, i) => <circle key={i} cx={p.x + .5} cy={p.y + .5} r=".17" fill="white" stroke={r.color} strokeWidth=".07" />)}</g>)}
    {state.map.stations.map((s, i) => <g key={s.id} pointerEvents="none"><rect x={23.6} y={s.y - .13} width="2.08" height="1.3" rx=".2" fill="#e3ece9" stroke="#b9d0c6" strokeWidth=".04" /><rect x={s.x + .12} y={s.y + .15} width=".7" height=".7" rx=".12" fill="#5f8d7c" /><path d={`M${s.x + .29} ${s.y + .36}h.36v.3h-.36z`} fill="none" stroke="white" strokeWidth=".045" /><text x="24.25" y={s.y + .43} className="station-label" textAnchor="middle">W{fmt(i + 1)}</text><text x="24.25" y={s.y + .8} className="station-name" textAnchor="middle">{translateMessage(s.name)}</text></g>)}
    {state.blocked.map(c => <g key={cellKey(c)} pointerEvents="none"><rect x={c.x + .035} y={c.y + .035} width=".93" height=".93" rx=".08" fill="url(#blocked-hatch)" stroke="#ca6e4a" strokeWidth=".045" /><path d={`M${c.x + .35} ${c.y + .35}l.3 .3m0 -.3l-.3 .3`} stroke="#a34b2e" strokeWidth=".08" strokeLinecap="round" /></g>)}
    {state.robots.map(r => <g key={r.id} className={`map-robot ${selected === r.id ? 'selected' : ''}`} data-robot={r.id} transform={`translate(${r.position.x + .5} ${r.position.y + .5})`}>

      <circle r={selected === r.id ? '.7' : '.55'} fill={r.color} opacity=".11" /><rect x="-.36" y="-.36" width=".72" height=".72" rx=".2" fill={r.color} stroke="white" strokeWidth=".065" /><rect x="-.2" y="-.19" width=".4" height=".3" rx=".07" fill="white" opacity=".9" /><circle cx="-.15" cy=".23" r=".045" fill="white" /><circle cx=".15" cy=".23" r=".045" fill="white" />{r.phase === 'delivery' && <rect x="-.17" y="-.17" width=".34" height=".25" rx=".04" fill="#705535" />}<title>{r.id} · {translateMessage(r.reason)}</title>
    </g>)}
    {Array.from({ length: 13 }, (_, i) => <text key={i} x={i * 2 + 1.5} y="18.65" textAnchor="middle" className="axis-label">{fmt(i * 2 + 1)}</text>)}
    {Array.from({ length: 8 }, (_, i) => <text key={i} x=".35" y={i * 2 + 2.58} textAnchor="middle" className="axis-label">{fmt(i * 2 + 2)}</text>)}
    <g transform="translate(23.9 16.65)" pointerEvents="none"><path d="M0 .3V-.4M-.14 -.18L0 -.4l.14 .22" stroke="#8a9384" strokeWidth=".06" fill="none" /><text x=".4" y="-.06" className="map-area-label">北</text></g>
    {showCursor && <rect className="cell-highlight" x={cursor.x + .035} y={cursor.y + .035} width=".93" height=".93" rx=".08" fill={blocked.has(cellKey(cursor)) ? '#6c946928' : '#d7704428'} stroke={blocked.has(cellKey(cursor)) ? '#668260' : '#ca754d'} strokeWidth=".06" pointerEvents="none" />}
  </svg>;
}

function JobCard({ job, state, selected, onSelect, cancel }: { job: Job; state: SimulationState; selected: string | null; onSelect: (id: string | null) => void; cancel: () => void }) {
  const robot = state.robots.find(r => r.id === job.robotId);
  const isCurrent = robot?.jobId === job.id;
  const label = job.status === 'queued' ? '等待机器人或安全路线' : job.status === 'assigned' ? '前往取货' : job.status === 'in_transit' ? '运送中' : job.status === 'completed' ? '已送达' : '已取消';
  return <article className={`job-card ${job.robotId === selected ? 'selected' : ''}`}><div className="job-card-heading"><span className="job-id">{job.id}</span><span className={`priority ${job.priority}`}><i />{job.priority === 'high' ? '高优先级' : job.priority === 'normal' ? '普通' : '低'}</span></div><div className="job-route"><span><Box size={14} />{job.shelfId}</span><span className="route-line"><i /><ArrowRight size={13} /></span><span><Warehouse size={14} />{job.stationId}</span></div><div className="job-card-bottom"><button className="assigned-robot" disabled={!robot} onClick={() => onSelect(job.robotId)}>{robot ? <><i style={{ background: robot.color }} />{robot.id}</> : <><span className="queued-dot" />未分配</>}</button><span className={`job-state ${job.status}`}><i />{label}</span>{job.status === 'queued' && <button className="icon-button cancel-job" onClick={cancel} aria-label={`取消 ${job.id}`}><X size={12} /></button>}</div>{isCurrent && robot.status === 'waiting' && <p className="job-wait">{translateMessage(robot.reason)}</p>}</article>;
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const old = document.body.style.overflow; document.body.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLElement>('button, select, input')?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const elements = ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex="0"]');
        if (!elements?.length) return;
        const first = elements[0], last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', key); previous?.focus(); };
  }, []);
  return createPortal(<div className="modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={ref}><div className="modal-heading"><span className="modal-icon"><Package size={23} /></span><button className="icon-button" aria-label="关闭弹窗" onClick={onClose}><X size={20} /></button></div><h2 id="modal-title">{title}</h2>{children}</div></div>, document.fullscreenElement ?? document.body);
}
function JobDialog({ state, initialShelf, busy, command, onClose }: { state: SimulationState; initialShelf: string; busy: boolean; command: Command; onClose: () => void }) {
  const [shelf, setShelf] = useState(initialShelf);
  const [station, setStation] = useState('WS-01');
  const [priority, setPriority] = useState<Priority>('normal');
  const [error, setError] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError('');
    try { await command('/api/jobs', { shelfId: shelf, stationId: station, priority }); onClose(); }
    catch (err) { setError((err as Error).message); }
  };
  return <Modal title="创建下一项运输任务" onClose={onClose}><p className="modal-description">选择取货货架与目标工作站，系统将自动分配机器人并预约安全路线。</p><form onSubmit={submit}><label className="field-label" htmlFor="shelf-select">取货货架</label><div className="select-wrapper"><Box size={17} /><select id="shelf-select" value={shelf} onChange={e => setShelf(e.target.value)}>{state.map.shelves.map(s => <option key={s.id} value={s.id}>{s.id} — {s.zone} 区 · [{s.x}, {s.y}]</option>)}</select></div><label className="field-label" htmlFor="station-select">目标工作站</label><div className="select-wrapper"><Warehouse size={17} /><select id="station-select" value={station} onChange={e => setStation(e.target.value)}>{state.map.stations.map(s => <option key={s.id} value={s.id}>{s.id} — {translateMessage(s.name)}</option>)}</select></div><span className="field-label">任务优先级</span><div className="priority-picker" role="group" aria-label="任务优先级">{(['low', 'normal', 'high'] as const).map(p => <button key={p} type="button" className={priority === p ? `chosen ${p}` : ''} aria-pressed={priority === p} onClick={() => setPriority(p)}><span className={`priority-marker ${p}`} />{priorityLabels[p]}{priority === p && <Check size={13} />}</button>)}</div><div className="form-note"><ShieldCheck size={16} /><span>自动分配机器人 · 预约完整行程<br /><small>{state.robots.filter(r => r.status === 'idle').length} 台机器人可用。车队忙碌时，任务会自动进入队列。</small></span></div>{error && <p className="error-text" role="alert">{error}</p>}<div className="modal-actions"><button className="button secondary" type="button" onClick={onClose}>取消</button><button className="button primary" type="submit" disabled={busy}><Plus size={16} />{busy ? '正在创建…' : '创建运输任务'}</button></div></form></Modal>;
}
export default App;
