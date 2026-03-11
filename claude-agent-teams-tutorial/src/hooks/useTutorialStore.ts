import { create } from 'zustand'

interface TutorialState {
  currentStep: number
  completedSteps: Set<number>
  quizAnswers: Record<string, string>
  goStep: (i: number) => void
  answerQuiz: (id: string, chosen: string) => void
}

export const useTutorialStore = create<TutorialState>((set, get) => ({
  currentStep: 0,
  completedSteps: new Set<number>(),
  quizAnswers: {},

  goStep: (i: number) => {
    const { currentStep, completedSteps } = get()
    if (currentStep !== i) {
      const next = new Set(completedSteps)
      next.add(currentStep)
      set({ currentStep: i, completedSteps: next })
    }
  },

  answerQuiz: (id: string, chosen: string) => {
    const { quizAnswers } = get()
    if (quizAnswers[id] !== undefined) return
    set({ quizAnswers: { ...quizAnswers, [id]: chosen } })
  },
}))
