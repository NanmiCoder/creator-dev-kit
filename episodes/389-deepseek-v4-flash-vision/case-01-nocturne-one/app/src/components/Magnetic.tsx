import { forwardRef, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
} & Omit<React.ComponentProps<typeof motion.button>, "ref">;

/**
 * Magnetic CTA. The button pulls toward the pointer with a spring,
 * the label drifts slightly further for depth. All continuous values
 * are motion values; no React state, no per-frame re-render.
 */
export const Magnetic = forwardRef<HTMLButtonElement, MagneticProps>(
  function Magnetic({ children, className = "", strength = 9, ...rest }, forwardedRef) {
    const rectRef = useRef<HTMLButtonElement | null>(null);
    const reduced = useReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.7 });
    const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.7 });
    const labelX = useTransform(sx, (v) => v * 1.7);
    const labelY = useTransform(sy, (v) => v * 1.7);

    const setRefs = (el: HTMLButtonElement | null) => {
      rectRef.current = el;
      if (typeof forwardedRef === "function") forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    };

    const onMove = (e: React.PointerEvent) => {
      if (reduced || !rectRef.current) return;
      const r = rectRef.current.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.22;
      const dy = (e.clientY - r.top - r.height / 2) * 0.32;
      x.set(Math.max(-strength, Math.min(strength, dx)));
      y.set(Math.max(-strength * 0.7, Math.min(strength * 0.7, dy)));
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.button
        ref={setRefs}
        style={{ x: sx, y: sy }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={className}
        {...rest}
      >
        <motion.span
          style={{ x: labelX, y: labelY }}
          className="contents"
          aria-hidden="true"
        >
          {children}
        </motion.span>
      </motion.button>
    );
  },
);
