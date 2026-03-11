import { useState } from 'react'
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface Props {
  title: string
  data: Record<string, unknown>
  collapsed?: number
}

export default function JsonPreview({ title, data, collapsed = 1 }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl overflow-hidden border border-bg-300/40 my-4">
      {/* Header - clickable to toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full bg-text-100 px-4 py-2.5 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-white/60 font-mono">{title}</span>
        </div>
        <span className="text-white/50">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="bg-bg-200 px-5 py-4 text-[13px] leading-[1.75] overflow-x-auto">
          <JsonView
            src={data}
            collapsed={collapsed}
            theme="default"
            style={{
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              lineHeight: '1.75',
              backgroundColor: 'transparent',
            }}
            collapseStringsAfterLength={80}
          />
        </div>
      )}
    </div>
  )
}
