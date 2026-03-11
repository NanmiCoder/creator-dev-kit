import { useEffect } from 'react'
import { useTutorialStore } from './useTutorialStore.ts'
import { STEPS } from '../data/steps.ts'

export function useKeyboardNav() {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return
      const { currentStep, goStep } = useTutorialStore.getState()
      if (e.key === 'ArrowRight' && currentStep < STEPS.length - 1) {
        e.preventDefault()
        goStep(currentStep + 1)
      }
      if (e.key === 'ArrowLeft' && currentStep > 0) {
        e.preventDefault()
        goStep(currentStep - 1)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])
}
