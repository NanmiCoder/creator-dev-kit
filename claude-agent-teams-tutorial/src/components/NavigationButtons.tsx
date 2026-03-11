import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTutorialStore } from '../hooks/useTutorialStore.ts'
import { STEPS } from '../data/steps.ts'

export default function NavigationButtons() {
  const { currentStep, goStep } = useTutorialStore()
  const isFirst = currentStep === 0
  const isLast = currentStep === STEPS.length - 1

  return (
    <div className="flex justify-between items-center pt-6 mt-6 border-t border-bg-300/40">
      <button
        disabled={isFirst}
        onClick={() => goStep(currentStep - 1)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-text-200 hover:bg-bg-200 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
      >
        <ChevronLeft size={16} />
        上一步
      </button>

      <button
        disabled={isLast}
        onClick={() => goStep(currentStep + 1)}
        className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-white bg-primary-100 hover:bg-primary-100/90 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
      >
        下一步
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
