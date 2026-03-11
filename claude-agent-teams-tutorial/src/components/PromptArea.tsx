import { useState } from 'react'
import { ChevronUp, ChevronDown, Copy, ClipboardCheck } from 'lucide-react'
import { useTutorialStore } from '../hooks/useTutorialStore.ts'
import { STEPS } from '../data/steps.ts'
import { PROMPTS } from '../data/prompts.ts'

export default function PromptArea() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [copied, setCopied] = useState(false)
  const { currentStep } = useTutorialStore()

  const stepId = STEPS[currentStep].id
  const prompt = PROMPTS[stepId] ?? ''

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="col-span-full border-t border-bg-300/40 bg-bg-100">
      {/* toggle bar */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between w-full px-6 py-2.5 text-sm font-medium text-text-200 hover:text-text-100 transition-colors cursor-pointer"
      >
        <span>Prompt 参考</span>
        {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* content */}
      {!isCollapsed && (
        <div className="px-6 pb-4 animate-slide-up">
          <div className="relative bg-bg-200 rounded-xl p-4 font-mono text-xs leading-relaxed text-text-200 max-h-40 overflow-y-auto">
            {prompt}

            {/* copy button */}
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-bg-100 text-text-200 hover:text-text-100 border border-bg-300/50 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <ClipboardCheck size={12} />
                  已复制
                </>
              ) : (
                <>
                  <Copy size={12} />
                  复制
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
