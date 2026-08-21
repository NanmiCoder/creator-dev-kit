import { useRef, type ReactNode, type CSSProperties } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';

/* 共享控件：玻璃按钮 / 磁吸 CTA / 分段控件 / 数字滚动 */

export function GlassButton({
  children,
  onClick,
  variant = 'default',
  className = '',
  style,
  disabled,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'accent' | 'ghost' | 'danger';
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={`btn ${variant === 'accent' ? 'btn-accent' : variant === 'ghost' ? 'btn-ghost' : variant === 'danger' ? 'btn-danger' : ''} ${className}`}
    >
      <span className="sheen" aria-hidden />
      {children}
    </button>
  );
}

/** 磁吸微物理：motionValue 驱动 transform，无 state 连续渲染 */
export function Magnetic({ children, strength = 0.22 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 220, damping: 16, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * strength);
    my.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div ref={ref} className="magnetic" style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </motion.div>
  );
}

/** 分段控件：活动项共享 layoutId 背景（shared element） */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  id,
  compact,
}: {
  options: Array<{ value: T; label: string; icon?: ReactNode }>;
  value: T;
  onChange: (v: T) => void;
  id: string;
  compact?: boolean;
}) {
  return (
    <div className={`seg ${compact ? 'seg-compact' : ''}`} role="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            className={`seg-item ${active ? 'is-active' : ''}`}
            onClick={() => onChange(o.value)}
          >
            {active && <motion.span layoutId={`seg-${id}`} className="seg-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            {o.icon}
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** 数字滚动（spring 驱动，MotionValue 直渲染） */
export function AnimatedNumber({
  value,
  format = (v) => v.toFixed(1),
  className,
}: {
  value: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 160, damping: 24 });
  const text: MotionValue<string> = useTransform(spring, format);
  const prev = useRef(value);
  if (prev.current !== value) {
    prev.current = value;
    mv.set(value);
  }
  return <motion.span className={className}>{text}</motion.span>;
}

export function IconBtn({
  children,
  onClick,
  title,
  active,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`btn icon-btn ${active ? 'is-active' : ''} ${className}`}
    >
      <span className="sheen" aria-hidden />
      {children}
    </button>
  );
}
