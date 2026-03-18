import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { slideVariants } from './animations'

import Slide1 from './components/slides/Slide1'
import Slide2 from './components/slides/Slide2'
import Slide3 from './components/slides/Slide3'
import Slide4 from './components/slides/Slide4'
import Slide5 from './components/slides/Slide5'

const slides = [Slide1, Slide2, Slide3, Slide4, Slide5]
const totalSlides = slides.length

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const touchStartX = useRef(0)

  const goToSlide = useCallback((index) => {
    if (index < 0 || index >= totalSlides || isAnimating) return
    setIsAnimating(true)
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }, [currentSlide, isAnimating])

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide])
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide])

  // 键盘监听
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // 触控监听
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX
    }
    const handleTouchEnd = (e) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide()
        else prevSlide()
      }
    }
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [nextSlide, prevSlide])

  const CurrentSlideComponent = slides[currentSlide]
  const progress = ((currentSlide + 1) / totalSlides) * 100

  return (
    <div className="h-screen w-screen overflow-hidden grid-bg relative" style={{ backgroundColor: 'var(--bg-100)' }}>
      {/* 顶部进度条 */}
      <div
        className="absolute top-0 left-0 h-1 z-50 transition-all duration-500"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(to right, var(--primary-100), var(--primary-200))',
        }}
      />

      {/* 顶部左侧 Logo */}
      <div className="absolute top-4 left-6 z-50 flex items-center gap-3">
        <img src="/openclaw-logo-text-dark.png" alt="OpenClaw" className="h-7 md:h-8" />
        <span className="text-[10px] tracking-[0.15em] uppercase hidden md:inline" style={{ color: 'var(--text-200)' }}>
          Presentation
        </span>
      </div>


      {/* 幻灯片容器 */}
      <AnimatePresence mode="wait" custom={direction} onExitComplete={() => setIsAnimating(false)}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 pt-14 pb-16 px-4 md:px-12 lg:px-16"
        >
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* 右下角控制栏 */}
      <div className="absolute bottom-3 right-6 z-50 flex items-center gap-2">
        {/* 左箭头 */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
          style={{
            backgroundColor: currentSlide === 0 ? 'var(--bg-300)' : 'var(--primary-100)',
            color: currentSlide === 0 ? 'var(--text-200)' : '#fff',
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronLeft size={14} />
        </button>

        {/* 圆点指示器 */}
        <div className="flex items-center gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === currentSlide ? 16 : 6,
                height: 6,
                backgroundColor: i === currentSlide ? 'var(--primary-100)' : 'var(--bg-300)',
                cursor: 'pointer',
                border: 'none',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* 右箭头 */}
        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
          style={{
            backgroundColor: currentSlide === totalSlides - 1 ? 'var(--bg-300)' : 'var(--primary-100)',
            color: currentSlide === totalSlides - 1 ? 'var(--text-200)' : '#fff',
            cursor: currentSlide === totalSlides - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
