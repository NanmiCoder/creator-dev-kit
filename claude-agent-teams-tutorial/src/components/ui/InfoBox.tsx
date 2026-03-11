import type { ReactNode } from 'react'
import { Lightbulb, AlertTriangle, Info } from 'lucide-react'

interface Props {
  type: 'tip' | 'warning' | 'note'
  title: string
  children: ReactNode
}

const variants = {
  tip: {
    border: 'border-l-primary-200',
    bg: 'bg-primary-200/5',
    icon: Lightbulb,
    iconColor: 'text-primary-200',
  },
  warning: {
    border: 'border-l-accent-200',
    bg: 'bg-accent-200/5',
    icon: AlertTriangle,
    iconColor: 'text-accent-200',
  },
  note: {
    border: 'border-l-primary-100',
    bg: 'bg-primary-100/5',
    icon: Info,
    iconColor: 'text-primary-100',
  },
}

export default function InfoBox({ type, title, children }: Props) {
  const v = variants[type]
  const Icon = v.icon

  return (
    <div
      className={`${v.bg} ${v.border} border-l-4 border border-bg-300/30 rounded-lg px-5 py-4 my-4`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={v.iconColor} />
        <span className="font-semibold text-sm text-text-100">{title}</span>
      </div>
      <div className="text-sm text-text-200 leading-relaxed">{children}</div>
    </div>
  )
}
