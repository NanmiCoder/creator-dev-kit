import { useTutorialStore } from '../hooks/useTutorialStore.ts'
import { STEPS } from '../data/steps.ts'
import StepButton from './StepButton.tsx'

export default function Sidebar() {
  const { currentStep, completedSteps, goStep } = useTutorialStore()

  return (
    <aside className="relative flex flex-row gap-1 py-1.5 px-2 overflow-x-auto overflow-y-hidden bg-bg-100 border-b border-[#ddd] md:flex-col md:py-2 md:px-2 md:overflow-y-auto md:overflow-x-hidden md:border-b-0 md:border-r md:border-[#ddd]">
      {STEPS.map((step, i) => (
        <StepButton
          key={step.id}
          step={step}
          index={i}
          isActive={i === currentStep}
          isCompleted={completedSteps.has(i)}
          onClick={() => goStep(i)}
        />
      ))}
    </aside>
  )
}
