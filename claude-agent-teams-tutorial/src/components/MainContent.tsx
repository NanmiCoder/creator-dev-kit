import { useEffect, useRef } from 'react'
import { useTutorialStore } from '../hooks/useTutorialStore.ts'
import { STEPS } from '../data/steps.ts'
import LESSONS from '../lessons/index.ts'
import NavigationButtons from './NavigationButtons.tsx'

const TAG_STYLES: Record<string, string> = {
  concept: 'bg-primary-100/12 text-primary-100 border border-primary-100/20',
  practice: 'bg-primary-200/10 text-primary-200 border border-primary-200/20',
  advanced: 'bg-primary-300/10 text-text-200 border border-primary-300/20',
  tips: 'bg-accent-200/10 text-accent-200 border border-accent-200/20',
}

export default function MainContent() {
  const { currentStep } = useTutorialStore()
  const step = STEPS[currentStep]
  const LessonComponent = LESSONS[currentStep]
  const scrollRef = useRef<HTMLElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [currentStep])

  return (
    <main ref={scrollRef} className="overflow-y-auto px-4 py-6 md:px-8 md:py-7 bg-gradient-to-b from-bg-200 to-bg-200/80">
      <div
        key={currentStep}
        className="max-w-3xl mx-auto animate-slide-up"
      >
        {/* lesson header */}
        <div className="mb-9 pb-7 border-b border-[#ddd]">
          <span
            className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-4 ${TAG_STYLES[step.tag] ?? 'bg-bg-200 text-text-200'}`}
          >
            {step.tagLabel}
          </span>
          <h2 className="text-[28px] font-bold text-text-100 mb-2 tracking-tight leading-tight">{step.title}</h2>
          <p className="text-[15px] text-text-200 leading-relaxed">{step.subtitle}</p>
        </div>

        {/* lesson body */}
        <LessonComponent />

        {/* navigation */}
        <NavigationButtons />
      </div>
    </main>
  )
}
