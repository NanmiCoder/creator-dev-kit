import type { ShortcutItem } from '../../types/index.ts'

interface Props {
  items: ShortcutItem[]
}

export default function ShortcutGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
      {items.map((item) => (
        <div
          key={item.key}
          className="flex items-center gap-3 px-4 py-3 rounded-lg border border-bg-300/30 bg-bg-200/30"
        >
          <kbd className="bg-bg-200 border border-[#ddd] rounded-md px-2.5 py-0.5 font-mono text-[11px] text-text-200 shrink-0">
            {item.key}
          </kbd>
          <span className="text-sm text-text-200">{item.desc}</span>
        </div>
      ))}
    </div>
  )
}
