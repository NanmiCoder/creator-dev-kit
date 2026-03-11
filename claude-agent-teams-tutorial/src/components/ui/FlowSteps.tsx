import type { FlowStepData } from '../../types/index.ts'

interface Props {
  steps: FlowStepData[]
}

const colorMap = {
  blue: {
    badge: 'bg-primary-100/12 text-primary-100 border border-primary-100/20',
    line: 'bg-primary-100/20',
  },
  green: {
    badge: 'bg-primary-200/10 text-primary-200 border border-primary-200/20',
    line: 'bg-primary-200/20',
  },
  purple: {
    badge: 'bg-primary-300/10 text-text-200 border border-primary-300/20',
    line: 'bg-primary-300/20',
  },
  orange: {
    badge: 'bg-accent-200/10 text-accent-200 border border-accent-200/20',
    line: 'bg-accent-200/20',
  },
}

export default function FlowSteps({ steps }: Props) {
  return (
    <div className="my-4 space-y-0">
      {steps.map((step, i) => {
        const c = colorMap[step.color]
        return (
          <div key={i} className="flex gap-4">
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-sm font-semibold shrink-0 ${c.badge}`}
              >
                {step.icon}
              </div>
              {!step.isLast && (
                <div className={`w-0.5 h-5 ${c.line}`} />
              )}
            </div>

            {/* Content */}
            <div className="pb-4 pt-1">
              <div className="font-semibold text-sm text-text-100">
                {step.title}
              </div>
              <div className="text-sm text-text-200 mt-0.5">
                {step.description}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
