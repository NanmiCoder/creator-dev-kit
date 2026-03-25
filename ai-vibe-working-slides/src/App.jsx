import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { slideTransition, slideVariants } from "./animations";
import Slide1 from "./components/slides/Slide1";
import Slide2 from "./components/slides/Slide2";
import Slide3 from "./components/slides/Slide3";
import Slide4 from "./components/slides/Slide4";
import Slide5 from "./components/slides/Slide5";
import Slide6 from "./components/slides/Slide6";
import Slide7 from "./components/slides/Slide7";
import Slide8 from "./components/slides/Slide8";
import Slide9 from "./components/slides/Slide9";
import Slide10 from "./components/slides/Slide10";

const slides = [
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
  Slide9,
  Slide10,
];

function formatIndex(value) {
  return String(value + 1).padStart(2, "0");
}

function App() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const slideCount = slides.length;
  const ActiveSlide = slides[page];

  const goTo = (nextPage) => {
    if (nextPage === page || nextPage < 0 || nextPage >= slideCount) {
      return;
    }

    setDirection(nextPage > page ? 1 : -1);
    setPage(nextPage);
  };

  const paginate = (nextDirection) => {
    const nextPage = page + nextDirection;
    if (nextPage < 0 || nextPage >= slideCount) {
      return;
    }

    setDirection(nextDirection);
    setPage(nextPage);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)
      ) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        paginate(1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        paginate(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX;
    touchEndX.current = event.changedTouches[0].clientX;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) {
      return;
    }

    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) > 50) {
      paginate(distance > 0 ? 1 : -1);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="deck-shell"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-1.5 bg-white/40">
        <motion.div
          className="h-full bg-[linear-gradient(90deg,var(--primary-100),var(--accent-100))]"
          animate={{ width: `${((page + 1) / slideCount) * 100}%` }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
        />
      </div>

      <div className="pointer-events-none absolute right-8 top-6 z-40 rounded-full border border-white/60 bg-white/68 px-4 py-2 text-sm font-semibold tracking-[0.28em] text-[var(--text-200)] backdrop-blur-md md:right-10">
        {formatIndex(page)} / {String(slideCount).padStart(2, "0")}
      </div>

      <div className="stage">
        <div className="slide-frame">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={shouldReduceMotion ? { duration: 0 } : slideTransition}
              className="absolute inset-0"
            >
              <ActiveSlide />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-5 right-5 z-40">
        <div className="glass-card flex items-center gap-3 rounded-full px-3 py-2">
          <button
            type="button"
            className="nav-button"
            onClick={() => paginate(-1)}
            disabled={page === 0}
            aria-label="上一页"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5 px-0.5">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className="dot-button"
                data-active={index === page}
                onClick={() => goTo(index)}
                aria-label={`跳转到第 ${index + 1} 页`}
              />
            ))}
          </div>

          <button
            type="button"
            className="nav-button"
            onClick={() => paginate(1)}
            disabled={page === slideCount - 1}
            aria-label="下一页"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
