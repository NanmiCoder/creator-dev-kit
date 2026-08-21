import { useEffect, useState } from 'react'
import { ArrowDown, ChartPolar, Database, GithubLogo, Info } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Leaderboard } from './components/Leaderboard'
import { MagneticLink } from './components/MagneticLink'
import { RadarChart } from './components/RadarChart'
import { PageSkeleton } from './components/Skeleton'
import { SignalPulse } from './components/SignalPulse'
import { deepseek, metrics, models } from './data'

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 520)
    return () => window.clearTimeout(timer)
  }, [])

  if (isLoading) return <PageSkeleton />

  if (models.length !== 17 || !models.some((model) => model.highlighted)) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-canvas px-4 text-ink">
        <section className="max-w-xl border-t border-danger/40 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-danger">Data validation failed</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">榜单数据不完整。</h1>
          <p className="mt-3 max-w-[58ch] text-base leading-relaxed text-muted">
            页面应包含 17 个模型与 1 条 DeepSeek 实测结果，请在发布前检查本地数据。
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-canvas text-ink selection:bg-accent/20">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(29,33,31,0.035)_1px,transparent_1px)] bg-[size:72px_100%]" />

      <header className="relative mx-auto flex max-w-[1400px] items-center justify-between px-4 py-5 md:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-3 text-sm font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-full border border-line bg-paper">
            <ChartPolar size={18} weight="regular" />
          </span>
          <span>PerceptionBench / 05</span>
        </a>
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <SignalPulse />
          <span className="hidden sm:inline">数据已校验</span>
          <span>2026.08.21</span>
        </div>
      </header>

      <section id="top" className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-4 pb-20 pt-14 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:px-12 lg:pb-28 lg:pt-24">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }} className="max-w-3xl">
          <motion.div variants={reveal} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="mb-8 flex items-center gap-3">
            <span className="h-px w-14 bg-accent" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">原子视觉感知评测</span>
          </motion.div>
          <motion.h1 variants={reveal} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="text-4xl font-semibold leading-[0.96] tracking-[-0.055em] md:text-6xl">
            DeepSeek V4 Flash Vision，
            <span className="block text-muted">跑完 3,000 题以后。</span>
          </motion.h1>
          <motion.p variants={reveal} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="mt-8 max-w-[62ch] text-base leading-relaxed text-muted md:text-lg">
            10 项原子能力，3,000 道人工校验试题。这个实验版视觉模型的总分介于 GLM-5V-Turbo 与 Minimax-M3 之间。
          </motion.p>
          <motion.div variants={reveal} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="mt-10 flex flex-wrap items-center gap-5">
            <MagneticLink href="#leaderboard">
              查看完整榜单
              <ArrowDown size={17} weight="regular" />
            </MagneticLink>
            <a href="https://github.com/MoonshotAI/PerceptionBench" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-b border-ink/25 py-2 text-sm font-medium transition-colors duration-300 hover:border-ink active:-translate-y-px">
              <GithubLogo size={17} weight="regular" />
              查看源仓库
            </a>
          </motion.div>
        </motion.div>

        <motion.aside initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }} className="relative border-l border-line pl-6 md:pl-10 lg:mt-16">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[clamp(5rem,12vw,9.5rem)] font-medium leading-none tracking-[-0.09em] text-ink">34.93</span>
            <span className="font-mono text-xl text-accent">%</span>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-7">
            <Metric label="近似排名" value="15 / 17" />
            <Metric label="答对" value="1,048" />
            <Metric label="题目" value="3,000" />
            <Metric label="接口错误" value="0" />
          </div>
          <div className="mt-8 flex items-start gap-3 rounded-[1.25rem] border border-accent/20 bg-accent-soft/60 p-4 text-sm leading-relaxed text-accent-ink">
            <Info className="mt-0.5 shrink-0" size={17} weight="regular" />
            <p>本次由 DeepSeek V4 Pro 裁判，README 中其他模型使用 GPT-oss-120B。因此这个插入排名用于方向性对比，不是官方排名。</p>
          </div>
        </motion.aside>
      </section>

      <section className="relative border-y border-line bg-paper/70">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 lg:px-12 lg:py-24">
          <div>
            <SectionLabel number="01" label="能力画像" />
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">关系判断尚可，细节识别吃力。</h2>
            <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-muted">
              视觉关系是最强项，属性与 OCR 均为 40%。细粒度识别、计数和定位是拉低总分的主要原因。
            </p>
            <div className="mt-10 grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
              <RadarChart model={deepseek} />
              <div className="space-y-6 border-l border-line pl-5">
                <Metric label="最强项" value="VRel 43.6" />
                <Metric label="最弱项" value="FGR 26.2" />
                <Metric label="极差" value="17.4 pts" />
              </div>
            </div>
          </div>

          <div className="self-end">
            <div className="divide-y divide-line border-y border-line">
              {metrics.filter((metric) => metric.key !== 'overall').map((metric, index) => {
                const value = deepseek[metric.key] as number
                return (
                  <motion.div key={metric.key} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.035 }} className="grid grid-cols-[44px_1fr_54px] items-center gap-4 py-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{metric.short}</span>
                    <div className="h-1.5 overflow-hidden rounded-full bg-line/70">
                      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: value / 100 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.15 + index * 0.035 }} className="h-full origin-left rounded-full bg-accent" />
                    </div>
                    <span className="text-right font-mono text-sm font-medium text-ink">{value.toFixed(1)}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="leaderboard" className="relative mx-auto max-w-[1400px] px-4 py-20 md:px-8 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <SectionLabel number="02" label="完整对比" />
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">17 个模型，一张表看清。</h2>
          </div>
          <p className="max-w-[64ch] text-base leading-relaxed text-muted lg:justify-self-end">
            点击任一能力即可重新排名，搜索可快速缩小模型范围。无论排名如何变化，DeepSeek 实测行始终保持标记。
          </p>
        </div>
        <Leaderboard models={models} />
      </section>

      <section className="relative border-t border-line bg-ink text-paper">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-20">
          <div>
            <SectionLabel number="03" label="运行完整性" inverted />
            <h2 className="mt-6 max-w-xl text-3xl font-semibold tracking-[-0.035em]">结果完整、可复现，并已在本地归档。</h2>
          </div>
          <dl className="grid grid-cols-1 gap-0 border-y border-paper/15 sm:grid-cols-2">
            <IntegrityItem icon={<Database size={17} weight="regular" />} label="唯一数据行" value="3,000 / 3,000" />
            <IntegrityItem icon={<ChartPolar size={17} weight="regular" />} label="运行时长" value="2h 16m 21s" />
            <IntegrityItem label="模型请求错误" value="0" />
            <IntegrityItem label="裁判错误" value="0" />
          </dl>
        </div>
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 border-t border-paper/15 px-4 py-6 font-mono text-[10px] uppercase tracking-[0.15em] text-paper/50 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
          <span>PerceptionBench commit ba032c0</span>
          <span>DeepSeek V4 Flash Vision Exp / Judge: DeepSeek V4 Pro</span>
        </div>
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</dt>
      <dd className="mt-1 font-mono text-lg font-medium tracking-tight text-ink">{value}</dd>
    </div>
  )
}

function SectionLabel({ number, label, inverted = false }: { number: string; label: string; inverted?: boolean }) {
  return (
    <div className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] ${inverted ? 'text-paper/50' : 'text-muted'}`}>
      <span className={inverted ? 'text-paper' : 'text-accent'}>{number}</span>
      <span className={`h-px w-8 ${inverted ? 'bg-paper/30' : 'bg-line'}`} />
      <span>{label}</span>
    </div>
  )
}

function IntegrityItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border-b border-paper/15 py-5 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6">
      <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-paper/45">{icon}{label}</dt>
      <dd className="mt-2 font-mono text-lg text-paper">{value}</dd>
    </div>
  )
}

export default App
