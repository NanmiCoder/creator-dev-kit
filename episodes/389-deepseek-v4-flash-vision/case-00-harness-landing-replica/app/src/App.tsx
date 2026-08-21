import { useEffect } from 'react'
import CanvasBackdrop from './CanvasBackdrop'
import Nav from './Nav'
import { DesignSection, Ecosystem, Footer, GetStarted, HarnessCards, HarnessNarrative, Hero } from './sections'

export default function App() {
  // dev convenience: ?scroll=N jumps to a pixel offset on load (verification only)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('scroll')
    if (p) {
      const n = Number(p)
      if (Number.isFinite(n)) window.scrollTo({ top: n, behavior: 'instant' as ScrollBehavior })
    }
  }, [])

  return (
    <>
      <CanvasBackdrop />
      <Nav />
      <main>
        <Hero />
        <HarnessNarrative />
        <HarnessCards />
        <DesignSection />
        <GetStarted />
        <Ecosystem />
      </main>
      <Footer />
    </>
  )
}
