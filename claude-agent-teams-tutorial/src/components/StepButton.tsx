import { Check } from 'lucide-react'
import type { Step } from '../types/index.ts'

interface StepButtonProps {
  step: Step
  index: number
  isActive: boolean
  isCompleted: boolean
  onClick: () => void
}

export default function StepButton({ step, index, isActive, isCompleted, onClick }: StepButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`第${index + 1}步: ${step.title}`}
      aria-current={isActive ? 'step' : undefined}
      className={[
        'relative flex items-center gap-3 shrink-0 rounded-lg text-left transition-all duration-150 cursor-pointer',
        'px-3 py-2 text-xs md:px-3.5 md:py-3 md:text-[13px] md:w-full',
        'hover:bg-bg-200',
        isActive
          ? 'bg-primary-100/8 text-primary-100'
          : isCompleted
            ? 'text-primary-200'
            : 'text-text-200',
      ].join(' ')}
    >
      {/* active indicator */}
      {isActive && (
        <span className="hidden md:block absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary-100" />
      )}

      {/* step number / check icon */}
      <span
        className={[
          'flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold shrink-0 transition-all font-mono',
          isCompleted
            ? 'bg-primary-200 text-white shadow-[0_0_8px_rgba(255,152,63,0.3)]'
            : isActive
              ? 'bg-primary-100 text-white shadow-[0_0_12px_rgba(255,102,0,0.4)]'
              : 'bg-bg-300 text-accent-200',
        ].join(' ')}
      >
        {isCompleted ? <Check size={14} strokeWidth={2.5} /> : index + 1}
      </span>

      {/* title + subtitle */}
      <div className="flex flex-col min-w-0">
        <span className="font-medium leading-tight truncate">
          {step.title}
        </span>
        <span className={[
          'text-[11px] mt-0.5 hidden md:block',
          isActive ? 'text-primary-100/60' : 'text-accent-200',
        ].join(' ')}>
          {step.subtitle}
        </span>
      </div>
    </button>
  )
}
