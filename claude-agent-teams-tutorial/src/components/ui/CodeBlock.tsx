import { useRef, useState, type ReactNode } from 'react'
import { Copy, Check } from 'lucide-react'

interface Props {
  title: string
  id?: string
  children: ReactNode
}

export default function CodeBlock({ title, id, children }: Props) {
  const codeRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = codeRef.current?.textContent ?? ''
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div id={id} className="rounded-xl overflow-hidden border border-bg-300/40 my-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-text-100 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-white/60 font-mono">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Body */}
      <div
        ref={codeRef}
        className="bg-bg-200 px-5 py-4 font-mono text-[13px] leading-[1.75] whitespace-pre overflow-x-auto text-text-200"
      >
        {children}
      </div>
    </div>
  )
}
