import { useTutorialStore } from '../hooks/useTutorialStore.ts'
import { STEPS } from '../data/steps.ts'

export default function ProgressBar() {
  const { currentStep, completedSteps } = useTutorialStore()
  const total = STEPS.length
  const pct = ((currentStep + 1) / total) * 100

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-text-200 whitespace-nowrap tabular-nums">
        {currentStep + 1} / {total}
      </span>

      {/* progress bar */}
      <div className="relative w-28 h-1.5 rounded-full bg-bg-300/40 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-100 to-primary-200 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* dots */}
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => {
          const isActive = i === currentStep
          const isDone = completedSteps.has(i)
          return (
            <span
              key={i}
              className={[
                'block w-2 h-2 rounded-full transition-all duration-200',
                isActive
                  ? 'bg-primary-100 shadow-[0_0_6px_rgba(255,102,0,0.5)]'
                  : isDone
                    ? 'bg-primary-200'
                    : 'bg-bg-300',
              ].join(' ')}
            />
          )
        })}
      </div>
    </div>
  )
}
