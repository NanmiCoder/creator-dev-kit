export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

/** Orthogonal-ish connector with rounded corners, left edge → right edge. */
export function elbowH(x1: number, y1: number, x2: number, y2: number, r = 14): string {
  if (Math.abs(y1 - y2) < 1.5) return `M ${x1} ${y1} L ${x2} ${y2}`
  const mid = x1 + (x2 - x1) / 2
  const dir = y2 > y1 ? 1 : -1
  const radius = Math.min(r, Math.abs(y2 - y1) / 2, Math.abs(mid - x1))
  return [
    `M ${x1} ${y1}`,
    `L ${mid - radius} ${y1}`,
    `Q ${mid} ${y1} ${mid} ${y1 + dir * radius}`,
    `L ${mid} ${y2 - dir * radius}`,
    `Q ${mid} ${y2} ${mid + radius} ${y2}`,
    `L ${x2} ${y2}`,
  ].join(' ')
}

/** Orthogonal-ish connector, bottom edge → top edge. */
export function elbowV(x1: number, y1: number, x2: number, y2: number, r = 14): string {
  if (Math.abs(x1 - x2) < 1.5) return `M ${x1} ${y1} L ${x2} ${y2}`
  const mid = y1 + (y2 - y1) / 2
  const dir = x2 > x1 ? 1 : -1
  const radius = Math.min(r, Math.abs(x2 - x1) / 2, Math.abs(mid - y1))
  return [
    `M ${x1} ${y1}`,
    `L ${x1} ${mid - radius}`,
    `Q ${x1} ${mid} ${x1 + dir * radius} ${mid}`,
    `L ${x2 - dir * radius} ${mid}`,
    `Q ${x2} ${mid} ${x2} ${mid + radius}`,
    `L ${x2} ${y2}`,
  ].join(' ')
}

/** Symmetric arc between two points, bulging by `lift` px perpendicular to the chord. */
export function arc(x1: number, y1: number, x2: number, y2: number, lift = 40): string {
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  return `M ${x1} ${y1} Q ${cx + nx * lift} ${cy + ny * lift} ${x2} ${y2}`
}
