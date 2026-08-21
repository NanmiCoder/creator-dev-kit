import { useEffect, useState } from 'react'
import { GitHubIcon, WhaleLogo } from './icons'

/**
 * Fixed header that morphs on scroll: at the top of the page it is a bare
 * transparent bar over the hero art; once scrolled it contracts into a
 * floating dark pill with backdrop blur, and the “Developer preview” badge
 * and GitHub action slide in.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav-bar">
        <a className="nav-brand" href="#top" aria-label="DeepSeek Harness home">
          <WhaleLogo size={26} />
          <span className="nav-wordmark">deepseek</span>
        </a>

        <span className="nav-badge nav-badge--harness">Harness</span>
        <span className="nav-badge nav-badge--dev">Developer preview</span>

        <div className="nav-right">
          <div className="nav-lang" role="group" aria-label="Language">
            <button type="button" className="nav-lang-item" lang="zh-Hans">
              中文
            </button>
            <button type="button" className="nav-lang-item nav-lang-item--active" aria-pressed="true">
              EN
            </button>
          </div>
          <a className="nav-github" href="https://github.com/deepseek-ai/deepseek-harness" target="_blank" rel="noreferrer">
            <GitHubIcon size={15} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  )
}
