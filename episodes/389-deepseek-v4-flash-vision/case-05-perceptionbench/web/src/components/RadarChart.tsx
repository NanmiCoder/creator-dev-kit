import { motion } from 'framer-motion'
import type { ModelScore } from '../data'
import { metrics } from '../data'

const size = 220
const center = size / 2
const radius = 82
const radarMetrics = metrics.filter((metric) => metric.key !== 'overall')

function pointAt(index: number, value: number) {
  const angle = (Math.PI * 2 * index) / radarMetrics.length - Math.PI / 2
  const scaled = (value / 80) * radius
  return `${center + Math.cos(angle) * scaled},${center + Math.sin(angle) * scaled}`
}

function ringPoints(scale: number) {
  return radarMetrics.map((_, index) => pointAt(index, 80 * scale)).join(' ')
}

export function RadarChart({ model }: { model: ModelScore }) {
  const values = radarMetrics.map((metric) => model[metric.key] as number)
  const points = values.map((value, index) => pointAt(index, value)).join(' ')

  return (
    <div className="relative aspect-square w-full max-w-[250px]">
      <svg viewBox={`0 0 ${size} ${size}`} className="size-full overflow-visible" role="img" aria-labelledby="radar-title radar-desc">
        <title id="radar-title">DeepSeek capability radar</title>
        <desc id="radar-desc">Ten PerceptionBench capability scores ranging from 26.2 to 43.6 percent.</desc>
        {[0.25, 0.5, 0.75, 1].map((ring) => <polygon key={ring} points={ringPoints(ring)} fill="none" stroke="var(--color-line)" strokeWidth="0.8" />)}
        {radarMetrics.map((_, index) => {
          const end = pointAt(index, 80)
          return <line key={index} x1={center} y1={center} x2={end.split(',')[0]} y2={end.split(',')[1]} stroke="var(--color-line)" strokeWidth="0.7" />
        })}
        <motion.polygon points={points} fill="rgba(47,125,98,0.16)" stroke="var(--color-accent)" strokeWidth="1.8" initial={{ opacity: 0, scale: 0.78 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} style={{ transformOrigin: 'center' }} />
        {values.map((value, index) => {
          const [cx, cy] = pointAt(index, value).split(',')
          return <circle key={index} cx={cx} cy={cy} r="2.5" fill="var(--color-accent)" />
        })}
      </svg>
    </div>
  )
}
