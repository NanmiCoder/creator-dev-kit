import { useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from './icons'

const COMMANDS: Record<'quick' | 'source', string> = {
  quick: 'npx @deepseek-ai/dsh web',
  source: 'git clone https://github.com/deepseek-ai/deepseek-harness',
}

/** Command-palette style terminal card with switchable tabs and copy feedback. */
export default function TerminalCard() {
  const [tab, setTab] = useState<'quick' | 'source'>('quick')
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(0)

  const copy = async () => {
    const text = COMMANDS[tab]
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="term">
      <div className="term-tabs" role="tablist" aria-label="Setup method">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'quick'}
          className={`term-tab${tab === 'quick' ? ' term-tab--active' : ''}`}
          onClick={() => setTab('quick')}
        >
          Quick start
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'source'}
          className={`term-tab${tab === 'source' ? ' term-tab--active' : ''}`}
          onClick={() => setTab('source')}
        >
          Install from source
        </button>
      </div>

      <div className="term-window">
        <div className="term-header">
          <div className="term-lights" aria-hidden="true">
            <span className="term-light term-light--r" />
            <span className="term-light term-light--y" />
            <span className="term-light term-light--g" />
          </div>
          <button type="button" className={`term-copy${copied ? ' term-copy--ok' : ''}`} onClick={copy}>
            {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="term-body" key={tab}>
          <span className="term-prompt">$</span>
          <span className="term-cmd">{COMMANDS[tab]}</span>
        </div>
      </div>
    </div>
  )
}
