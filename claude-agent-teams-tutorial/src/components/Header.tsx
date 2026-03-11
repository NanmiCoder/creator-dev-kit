import ProgressBar from './ProgressBar.tsx'

export default function Header() {
  return (
    <header className="col-span-full flex items-center justify-between px-6 py-3 bg-bg-100 relative">
      {/* left: logo + title */}
      <div className="flex items-center gap-3">
        <img src="/claude-logo.svg" alt="Claude logo" className="w-8 h-8" />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-text-100">
            Claude Code Agent Teams
          </span>
          <span className="text-xs text-text-200">交互式教程</span>
        </div>
      </div>

      {/* right: progress */}
      <ProgressBar />

      {/* bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary-100/0 via-primary-100/40 to-primary-100/0" />
    </header>
  )
}
