import { useTutorialStore } from '../../hooks/useTutorialStore.ts'

interface Props {
  id: string
  question: string
  options: { value: string; label: string }[]
  correct: string
  feedbackCorrect: string
  feedbackWrong: string
}

export default function Quiz({
  id,
  question,
  options,
  correct,
  feedbackCorrect,
  feedbackWrong,
}: Props) {
  const { quizAnswers, answerQuiz } = useTutorialStore()
  const chosen = quizAnswers[id]
  const answered = chosen !== undefined
  const isCorrect = chosen === correct

  const letters = ['A', 'B', 'C', 'D']

  return (
    <div className="my-4 rounded-xl border border-bg-300/40 p-5">
      <p className="font-semibold text-text-100 mb-3">{question}</p>

      <div className="space-y-2">
        {options.map((opt, i) => {
          const isChosen = chosen === opt.value
          const isCorrectOption = opt.value === correct

          let borderClass = 'border-bg-300/40 hover:border-primary-100/40'
          if (answered) {
            if (isCorrectOption) borderClass = 'border-primary-200'
            else if (isChosen) borderClass = 'border-danger'
            else borderClass = 'border-bg-300/40 opacity-60'
          }

          return (
            <button
              key={opt.value}
              disabled={answered}
              onClick={() => answerQuiz(id, opt.value)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-left text-sm transition-colors cursor-pointer disabled:cursor-default ${borderClass}`}
            >
              <span className="w-7 h-7 rounded-md bg-bg-200 border border-bg-300/40 flex items-center justify-center text-xs font-mono font-semibold text-text-200 shrink-0">
                {letters[i]}
              </span>
              <span className="text-text-200">{opt.label}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div
          className={`mt-3 px-4 py-2.5 rounded-lg text-sm ${
            isCorrect
              ? 'bg-primary-200/10 text-primary-200'
              : 'bg-danger/10 text-danger'
          }`}
        >
          {isCorrect ? feedbackCorrect : feedbackWrong}
        </div>
      )}
    </div>
  )
}
