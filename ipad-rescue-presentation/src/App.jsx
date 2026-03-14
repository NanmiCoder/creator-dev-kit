import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutTemplate } from 'lucide-react';
import { slideVariants, springConfig } from './animations';

// 导入所有幻灯片
import Slide1 from './components/slides/Slide1';
import Slide2 from './components/slides/Slide2';
import Slide3 from './components/slides/Slide3';
import Slide4 from './components/slides/Slide4';
import Slide5 from './components/slides/Slide5';
import Slide6 from './components/slides/Slide6';
import Slide7 from './components/slides/Slide7';

const slides = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7];

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  // 触控导航
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    // 阻止默认滚动行为
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextPage();
      } else {
        prevPage();
      }
    }
  };

  const nextPage = useCallback(() => {
    if (currentPage < slides.length - 1) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const goToPage = useCallback((index) => {
    setDirection(index > currentPage ? 1 : -1);
    setCurrentPage(index);
  }, [currentPage]);

  const CurrentSlide = slides[currentPage];

  return (
    <div 
      className="w-full h-screen grid-bg relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-100)' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 顶部品牌标识 */}
      <div className="absolute top-6 left-8 flex items-center gap-3 z-20">
        <LayoutTemplate size={24} style={{ color: 'var(--primary-100)' }} />
        <span 
          className="text-sm font-semibold tracking-wider"
          style={{ color: 'var(--text-200)' }}
        >
          INTERACTIVE PRESENTATION
        </span>
      </div>

      {/* 页码显示 */}
      <div className="absolute top-6 right-8 z-20">
        <span 
          className="text-sm font-semibold"
          style={{ color: 'var(--text-200)' }}
        >
          {String(currentPage + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* 顶部进度条 */}
      <div className="absolute top-0 left-0 right-0 h-1 z-20">
        <motion.div
          className="h-full"
          style={{ backgroundColor: 'var(--primary-100)' }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentPage + 1) / slides.length) * 100}%` }}
          transition={springConfig}
        />
      </div>

      {/* 幻灯片容器 */}
      <div className="absolute inset-0 pt-16 pb-20 px-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springConfig}
            className="w-full h-full"
          >
            <CurrentSlide />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 底部控制栏 */}
      <div className="absolute bottom-0 left-0 right-0 h-20 flex items-center justify-center gap-6 z-20">
        {/* 左箭头 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`p-3 rounded-full transition-all ${
            currentPage === 0 
              ? 'opacity-30 cursor-not-allowed' 
              : 'cursor-pointer hover:bg-white/20'
          }`}
          style={{ color: 'var(--text-100)' }}
        >
          <ChevronLeft size={32} />
        </motion.button>

        {/* 圆点指示器 */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToPage(index)}
              className={`transition-all ${
                index === currentPage
                  ? 'w-8 h-3 rounded-full'
                  : 'w-3 h-3 rounded-full'
              }`}
              style={{
                backgroundColor: index === currentPage 
                  ? 'var(--primary-100)' 
                  : 'var(--bg-300)',
                opacity: index === currentPage ? 1 : 0.5
              }}
            />
          ))}
        </div>

        {/* 右箭头 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextPage}
          disabled={currentPage === slides.length - 1}
          className={`p-3 rounded-full transition-all ${
            currentPage === slides.length - 1 
              ? 'opacity-30 cursor-not-allowed' 
              : 'cursor-pointer hover:bg-white/20'
          }`}
          style={{ color: 'var(--text-100)' }}
        >
          <ChevronRight size={32} />
        </motion.button>
      </div>
    </div>
  );
}

export default App;
