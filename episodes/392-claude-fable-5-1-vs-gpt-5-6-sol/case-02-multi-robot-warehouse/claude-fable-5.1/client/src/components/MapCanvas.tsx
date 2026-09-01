import { useEffect, useRef, useState } from 'react';
import type { SimState } from '../../../shared/types';
import { ROBOT_STATUS_LABEL } from '../labels';

export const CELL = 24;

interface Props {
  state: SimState;
  selectedRobot: string | null;
  onSelectRobot: (id: string | null) => void;
  onCellClick: (x: number, y: number, ch: string) => void;
}

const COLORS = {
  bg: '#0b0f14',
  floor: '#141b24',
  gridLine: '#1c2530',
  wall: '#2b3442',
  shelf: '#a7702f',
  shelfEdge: '#d9a054',
  ws: '#1f6feb',
  dock: '#3b4656',
  blocked: '#d64545',
  narrow: '#1b2a36',
};

export default function MapCanvas({ state, selectedRobot, onSelectRobot, onCellClick }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const { map } = state;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = map.width * CELL;
    const h = map.height * CELL;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, state, selectedRobot, hover);
  }, [state, selectedRobot, hover, map.width, map.height]);

  const cellFromEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (map.width * CELL) / rect.width;
    const sy = (e.clientY - rect.top) * (map.height * CELL) / rect.height;
    const x = Math.floor(sx / CELL);
    const y = Math.floor(sy / CELL);
    if (x < 0 || y < 0 || x >= map.width || y >= map.height) return null;
    return { x, y };
  };

  const hoverCh = hover ? map.cells[hover.y * map.width + hover.x] : null;
  const hoverRobot = hover ? state.robots.find((r) => r.x === hover.x && r.y === hover.y) : undefined;
  const hoverBlocked = hover ? state.blocked.some((b) => b.x === hover.x && b.y === hover.y) : false;
  const hint = !hover
    ? '点击货架 / 工作站可填入任务表单；点击地板格可封锁或解除封锁；点击机器人可高亮其路径。'
    : hoverRobot
      ? `${hoverRobot.id} 位于 (${hover.x},${hover.y})，${ROBOT_STATUS_LABEL[hoverRobot.status]}${hoverRobot.waitReason ? `：${hoverRobot.waitReason}` : ''}`
      : hoverCh === 'S'
        ? `货架 ${map.shelves.find((s) => s.x === hover.x && s.y === hover.y)?.id}，点击设为取货点`
        : hoverCh === 'W'
          ? `工作站 ${map.workstations.find((s) => s.x === hover.x && s.y === hover.y)?.id}，点击设为目的地`
          : hoverCh === '.'
            ? `地板 (${hover.x},${hover.y})，点击${hoverBlocked ? '解除封锁' : '封锁'}`
            : hoverCh === 'D'
              ? `泊位 (${hover.x},${hover.y})`
              : `墙 (${hover.x},${hover.y})`;

  return (
    <div className="map-wrap">
      <canvas
        ref={ref}
        className="map-canvas"
        style={{ aspectRatio: `${map.width} / ${map.height}`, maxWidth: map.width * CELL }}
        onMouseMove={(e) => setHover(cellFromEvent(e))}
        onMouseLeave={() => setHover(null)}
        onClick={(e) => {
          const c = cellFromEvent(e);
          if (!c) return;
          const robot = state.robots.find((r) => r.x === c.x && r.y === c.y);
          if (robot) {
            onSelectRobot(selectedRobot === robot.id ? null : robot.id);
            return;
          }
          onCellClick(c.x, c.y, map.cells[c.y * map.width + c.x]);
        }}
      />
      <div className="map-hint mono">{hint}</div>
      <div className="legend">
        <span><i style={{ background: COLORS.shelf }} /> 货架</span>
        <span><i style={{ background: COLORS.ws }} /> 工作站</span>
        <span><i style={{ background: COLORS.dock }} /> 泊位</span>
        <span><i style={{ background: COLORS.blocked }} /> 封锁格</span>
        <span><i style={{ background: COLORS.narrow, border: '1px solid #3b5468' }} /> 窄巷</span>
        <span><i className="legend-line" /> 规划路径</span>
        <span><i className="legend-ring" /> 等待中</span>
      </div>
    </div>
  );
}

function draw(ctx: CanvasRenderingContext2D, state: SimState, selected: string | null, hover: { x: number; y: number } | null) {
  const { map, robots, blocked } = state;
  const W = map.width;
  const H = map.height;
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, W * CELL, H * CELL);

  const narrow = new Set(map.narrowAisles.map((p) => p.y * W + p.x));
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const ch = map.cells[y * W + x];
      const px = x * CELL;
      const py = y * CELL;
      if (ch === '#') {
        ctx.fillStyle = COLORS.wall;
        ctx.fillRect(px, py, CELL, CELL);
      } else {
        ctx.fillStyle = narrow.has(y * W + x) ? COLORS.narrow : COLORS.floor;
        ctx.fillRect(px, py, CELL, CELL);
        ctx.strokeStyle = COLORS.gridLine;
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 0.5, py + 0.5, CELL - 1, CELL - 1);
      }
      if (ch === 'S') {
        ctx.fillStyle = COLORS.shelf;
        ctx.fillRect(px + 2, py + 2, CELL - 4, CELL - 4);
        ctx.strokeStyle = COLORS.shelfEdge;
        ctx.strokeRect(px + 2.5, py + 2.5, CELL - 5, CELL - 5);
      } else if (ch === 'W') {
        ctx.fillStyle = COLORS.ws;
        ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
      } else if (ch === 'D') {
        ctx.fillStyle = COLORS.dock;
        ctx.fillRect(px + 3, py + 3, CELL - 6, CELL - 6);
      }
    }
  }
  // labels
  ctx.font = `${Math.floor(CELL * 0.42)}px ui-monospace, Menlo, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#3a2a14';
  for (const s of map.shelves) ctx.fillText(s.id, s.x * CELL + CELL / 2, s.y * CELL + CELL / 2);
  ctx.fillStyle = '#ffffff';
  for (const w of map.workstations) ctx.fillText(w.id, w.x * CELL + CELL / 2, w.y * CELL + CELL / 2);
  ctx.fillStyle = '#93a1b5';
  map.docks.forEach((d, i) => ctx.fillText(`D${i + 1}`, d.x * CELL + CELL / 2, d.y * CELL + CELL / 2));

  // blocked cells
  for (const b of blocked) {
    const px = b.x * CELL;
    const py = b.y * CELL;
    ctx.fillStyle = 'rgba(214,69,69,0.35)';
    ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
    ctx.strokeStyle = COLORS.blocked;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px + 5, py + 5);
    ctx.lineTo(px + CELL - 5, py + CELL - 5);
    ctx.moveTo(px + CELL - 5, py + 5);
    ctx.lineTo(px + 5, py + CELL - 5);
    ctx.stroke();
  }

  // planned paths (unselected first, selected on top)
  const ordered = [...robots].sort((a, b) => (a.id === selected ? 1 : 0) - (b.id === selected ? 1 : 0));
  for (const r of ordered) {
    if (r.path.length < 2) continue;
    const isSel = r.id === selected;
    ctx.strokeStyle = r.color;
    ctx.globalAlpha = isSel ? 1 : selected ? 0.25 : 0.6;
    ctx.lineWidth = isSel ? 4 : 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.setLineDash(r.status === 'waiting' ? [4, 4] : []);
    ctx.beginPath();
    ctx.moveTo(r.path[0].x * CELL + CELL / 2, r.path[0].y * CELL + CELL / 2);
    for (let i = 1; i < r.path.length; i++) ctx.lineTo(r.path[i].x * CELL + CELL / 2, r.path[i].y * CELL + CELL / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    const g = r.path[r.path.length - 1];
    ctx.strokeRect(g.x * CELL + 5, g.y * CELL + 5, CELL - 10, CELL - 10);
    ctx.globalAlpha = 1;
  }

  // robots
  for (const r of robots) {
    const cx = r.x * CELL + CELL / 2;
    const cy = r.y * CELL + CELL / 2;
    const rad = CELL * 0.36;
    if (r.status === 'waiting') {
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(cx, cy, rad + 3.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = r.color;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
    if (r.id === selected) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else if (r.status === 'idle') {
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (r.carrying) {
      ctx.fillStyle = '#3a2a14';
      ctx.fillRect(cx - 4, cy - rad - 1, 8, 6);
      ctx.strokeStyle = COLORS.shelfEdge;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 4, cy - rad - 1, 8, 6);
    }
    ctx.fillStyle = '#0b0f14';
    ctx.font = `bold ${Math.floor(CELL * 0.45)}px ui-monospace, Menlo, monospace`;
    ctx.fillText(String(r.index + 1), cx, cy + 0.5);
    if (r.status === 'loading' || r.status === 'unloading') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, rad + 3, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - r.dwellRemaining / 2));
      ctx.stroke();
    }
  }

  if (hover) {
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(hover.x * CELL + 1, hover.y * CELL + 1, CELL - 2, CELL - 2);
  }
}
