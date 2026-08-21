import { useEffect, useRef } from 'react'

/**
 * Full-viewport canvas behind the hero: layered silk light-bands, a parallax
 * dot matrix and drifting dust particles. Layers drift on their own, and
 * shift with pointer position and scroll (parallax). Renders one static
 * frame under `prefers-reduced-motion`.
 */

interface Band {
  x: number
  y: number
  r: number
  sx: number
  sy: number
  rot: number
  color: string
  alpha: number
  sp: number
  ph: number
  depth: number
  blend: GlobalCompositeOperation
}

interface Particle {
  x: number
  y: number
  r: number
  depth: number
  vy: number
  sway: number
  ph: number
  tw: number
}

/** Soft radial halo that trails the pointer. */
function drawGlow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.globalCompositeOperation = 'lighter'
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, 'rgba(205,222,248,0.20)')
  g.addColorStop(0.45, 'rgba(180,205,240,0.08)')
  g.addColorStop(1, 'rgba(180,205,240,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'
}

/** Small glowing goldfish that swims slowly through the hero art. */
function drawFish(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, t: number, s: number) {
  const wag = Math.sin(t * 2.6) * 6
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.scale(s, s)

  // halo
  ctx.globalCompositeOperation = 'lighter'
  const glow = ctx.createRadialGradient(0, -4, 0, 0, -4, 118)
  glow.addColorStop(0, 'rgba(255,250,238,0.42)')
  glow.addColorStop(0.45, 'rgba(255,243,215,0.13)')
  glow.addColorStop(1, 'rgba(255,243,215,0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(0, -4, 118, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'

  // tail fin — two waving lobes
  ctx.beginPath()
  ctx.moveTo(-52, -4)
  ctx.quadraticCurveTo(-78, -32 - wag, -94, -28 - wag)
  ctx.quadraticCurveTo(-76, -8, -60, -1)
  ctx.quadraticCurveTo(-78, 12, -94, 34 + wag)
  ctx.quadraticCurveTo(-78, 14, -54, 6)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,251,240,0.72)'
  ctx.fill()

  // body — nose to the right
  ctx.beginPath()
  ctx.moveTo(62, -4)
  ctx.bezierCurveTo(46, -30, 6, -40, -30, -26)
  ctx.bezierCurveTo(-46, -20, -56, -11, -58, -3)
  ctx.bezierCurveTo(-56, 8, -46, 18, -28, 26)
  ctx.bezierCurveTo(8, 40, 48, 28, 62, -4)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,253,247,0.92)'
  ctx.fill()

  // dorsal fin
  ctx.beginPath()
  ctx.moveTo(-8, -30)
  ctx.quadraticCurveTo(6, -52, 24, -28)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,251,242,0.7)'
  ctx.fill()

  // pectoral fin line
  ctx.beginPath()
  ctx.moveTo(28, 8)
  ctx.quadraticCurveTo(12, 18, -4, 12)
  ctx.strokeStyle = 'rgba(120,140,170,0.5)'
  ctx.lineWidth = 2
  ctx.stroke()

  // eye
  ctx.beginPath()
  ctx.arc(44, -12, 3.2, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(22,30,44,0.9)'
  ctx.fill()

  ctx.restore()
}

const BANDS: Band[] = [
  // main white silk streak, top-center-right
  { x: 0.58, y: 0.02, r: 0.5, sx: 1.6, sy: 0.26, rot: -0.58, color: '235,242,250', alpha: 0.62, sp: 0.05, ph: 0.4, depth: 0.5, blend: 'lighter' },
  // thin silk highlight inside the main streak
  { x: 0.72, y: 0.1, r: 0.5, sx: 1.2, sy: 0.05, rot: -0.58, color: '242,247,252', alpha: 0.5, sp: 0.055, ph: 2.1, depth: 0.55, blend: 'lighter' },
  // secondary streak at right edge
  { x: 0.92, y: 0.34, r: 0.28, sx: 1.3, sy: 0.3, rot: -0.5, color: '205,220,236', alpha: 0.38, sp: 0.045, ph: 1.9, depth: 0.7, blend: 'lighter' },
  // steel band crossing mid (behind terminal, dimmer)
  { x: 0.48, y: 0.44, r: 0.36, sx: 1.7, sy: 0.24, rot: -0.55, color: '112,140,175', alpha: 0.28, sp: 0.04, ph: 3.2, depth: 0.8, blend: 'lighter' },
  // soft mid-left band
  { x: 0.16, y: 0.55, r: 0.3, sx: 1.4, sy: 0.26, rot: -0.5, color: '78,106,146', alpha: 0.2, sp: 0.055, ph: 2.4, depth: 0.6, blend: 'lighter' },
  // deep navy lower sweep
  { x: 0.5, y: 0.9, r: 0.5, sx: 2.0, sy: 0.26, rot: -0.5, color: '26,46,76', alpha: 0.28, sp: 0.035, ph: 4.6, depth: 0.45, blend: 'lighter' },
  // faint cool band lower-right
  { x: 0.8, y: 0.72, r: 0.34, sx: 1.4, sy: 0.24, rot: -0.58, color: '48,72,110', alpha: 0.16, sp: 0.03, ph: 5.4, depth: 0.35, blend: 'lighter' },
  // silk fold shadow under the main streak (adds edge contrast)
  { x: 0.56, y: 0.22, r: 0.4, sx: 1.7, sy: 0.16, rot: -0.55, color: '52,74,106', alpha: 0.22, sp: 0.038, ph: 1.2, depth: 0.45, blend: 'source-over' },
]

const DOT_SPACING = 26

function hash2(i: number, j: number) {
  let h = (i * 374761393 + j * 668265263) | 0
  h = (h ^ (h >> 13)) * 1274126177
  h = h ^ (h >> 16)
  return (h >>> 0) / 4294967295
}

function buildDots(w: number, h: number) {
  const dots: { x: number; y: number; a: number; hi: boolean; j: number }[] = []
  const cols = Math.ceil(w / DOT_SPACING) + 2
  const rows = Math.ceil(h / DOT_SPACING) + 2
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const h1 = hash2(i, j)
      const h2 = hash2(i + 91, j + 17)
      const h3 = hash2(i + 33, j + 57)
      if (h1 > 0.52) continue
      const hi = h2 < 0.05
      // cluster the matrix around the terminal area, fade elsewhere
      const cx = (i * DOT_SPACING) / w
      const cy = (j * DOT_SPACING) / h
      const m = Math.exp(-(((cx - 0.62) ** 2) / 0.09 + ((cy - 0.38) ** 2) / 0.16))
      const a = (hi ? 0.62 : 0.14 + h2 * 0.26) * (0.3 + 0.7 * m)
      if (a < 0.05) continue
      dots.push({
        x: i * DOT_SPACING + h3 * DOT_SPACING * 0.9,
        y: j * DOT_SPACING + hash2(i + 5, j + 71) * DOT_SPACING * 0.9,
        a,
        hi,
        j: j,
      })
    }
  }
  return dots
}

export default function CanvasBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let running = true
    let scrollY = 0

    const pointer = { tx: 0, ty: 0, x: 0, y: 0 }

    const particles: Particle[] = []
    let dots: ReturnType<typeof buildDots> = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = buildDots(w + DOT_SPACING, h + DOT_SPACING)
    }

    const seedParticles = () => {
      particles.length = 0
      const n = Math.min(110, Math.max(50, Math.round(w / 18)))
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.5 + Math.random() * 1.4,
          depth: 0.25 + Math.random() * 0.75,
          vy: 6 + Math.random() * 16,
          sway: 6 + Math.random() * 14,
          ph: Math.random() * Math.PI * 2,
          tw: 0.4 + Math.random() * 1.6,
        })
      }
    }

    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / w) * 2 - 1
      pointer.ty = (e.clientY / h) * 2 - 1
    }
    const onScroll = () => {
      scrollY = window.scrollY
    }

    const draw = (t: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05

      // base deep navy wash
      const base = ctx.createLinearGradient(0, 0, 0, h)
      base.addColorStop(0, '#16283f')
      base.addColorStop(0.45, '#101f33')
      base.addColorStop(1, '#0a1524')
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)

      // silk light bands
      const minDim = Math.min(w, h)
      for (const b of BANDS) {
        const driftX = Math.sin(t * b.sp + b.ph) * 0.035
        const driftY = Math.cos(t * b.sp * 0.83 + b.ph) * 0.025
        const cx = (b.x + driftX) * w + pointer.x * 26 * b.depth
        const cy = (b.y + driftY) * h + pointer.y * 18 * b.depth
        const rad = b.r * minDim
        ctx.globalCompositeOperation = b.blend
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(b.rot)
        ctx.scale(b.sx, b.sy)
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rad)
        g.addColorStop(0, `rgba(${b.color},${b.alpha})`)
        g.addColorStop(0.55, `rgba(${b.color},${b.alpha * 0.45})`)
        g.addColorStop(1, `rgba(${b.color},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(0, 0, rad, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // keep the left text column deep and dark
      const lg = ctx.createLinearGradient(0, 0, w * 0.62, 0)
      lg.addColorStop(0, 'rgba(7,13,23,0.62)')
      lg.addColorStop(0.55, 'rgba(7,13,23,0.2)')
      lg.addColorStop(1, 'rgba(7,13,23,0)')
      ctx.fillStyle = lg
      ctx.fillRect(0, 0, w * 0.62, h)

      // vignette to keep edges deep
      ctx.globalCompositeOperation = 'source-over'
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.42, minDim * 0.25, w * 0.5, h * 0.5, minDim * 0.95)
      vg.addColorStop(0, 'rgba(6,12,22,0)')
      vg.addColorStop(1, 'rgba(6,12,22,0.55)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, w, h)

      // mouse-following halo + the little goldfish
      const gx = (0.5 + pointer.x * 0.5) * w
      const gy = (0.5 + pointer.y * 0.42) * h
      if (!reduced) drawGlow(ctx, gx, gy, Math.max(240, minDim * 0.3))

      const fx = 0.57 * w + Math.sin(t * 0.16) * 46 + pointer.x * 22
      const fy = 0.4 * h + Math.cos(t * 0.12) * 34 + pointer.y * 16
      const fa = 0.32 + Math.sin(t * 0.2) * 0.14
      drawFish(ctx, fx, fy, fa, t, reduced ? 1 : 1)

      // parallax dot matrix (world-space, follows scroll a touch)
      const dotShiftX = (scrollY * 0.05 + pointer.x * 12) % DOT_SPACING
      const dotShiftY = (scrollY * 0.03 + pointer.y * 9) % DOT_SPACING
      for (const d of dots) {
        const dx = d.x - dotShiftX
        const dy = d.y - dotShiftY
        if (dx < -8 || dx > w + 8 || dy < -8 || dy > h + 8) continue
        const size = d.hi ? 2.6 : 1.6
        ctx.globalAlpha = d.a
        ctx.fillStyle = d.hi ? 'rgba(196,218,248,1)' : 'rgba(202,218,240,1)'
        ctx.fillRect(dx, dy, size, size)
      }
      ctx.globalAlpha = 1

      // dust particles
      for (const p of particles) {
        if (!reduced) {
          p.y -= p.vy * 0.016
          p.x += Math.sin(t * 0.5 + p.ph) * p.sway * 0.016
          if (p.y < -4) {
            p.y = h + 4
            p.x = Math.random() * w
          }
        }
        const px = p.x + pointer.x * 30 * p.depth
        const py = p.y + pointer.y * 20 * p.depth
        const tw = reduced ? 0.7 : 0.6 + 0.4 * Math.sin(t * p.tw + p.ph)
        ctx.globalAlpha = (0.1 + p.depth * 0.28) * tw
        ctx.fillStyle = '#dfe8f4'
        ctx.beginPath()
        ctx.arc(px, py, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (time: number) => {
      if (!running) return
      const t = time / 1000
      draw(t)
      raf = requestAnimationFrame(loop)
    }

    resize()
    seedParticles()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    if (reduced) {
      // single calm frame
      draw(0.6)
    } else {
      raf = requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        if (raf) cancelAnimationFrame(raf)
      } else if (!reduced) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="backdrop-canvas" aria-hidden="true" />
}
