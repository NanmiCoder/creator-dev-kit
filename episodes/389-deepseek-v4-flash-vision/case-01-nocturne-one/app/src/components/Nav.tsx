import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useBooking } from "./booking/booking";

/** Crescent mark: nocturne + one star. */
export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M 16.2 3.6 A 9.4 9.4 0 1 0 20.4 16.2 A 7.6 7.6 0 0 1 16.2 3.6 Z"
        fill="currentColor"
      />
      <circle cx="18.6" cy="5.4" r="1.6" fill="var(--accent)" />
    </svg>
  );
}

const LINKS = [
  { label: "声音", href: "#sound" },
  { label: "结构", href: "#structure" },
  { label: "规格", href: "#specs" },
  { label: "购买", href: "#specs" },
];

export function Nav() {
  const { open } = useBooking();
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const pad = useSpring(
    useTransform(scrollY, [0, 90], [14, 8]),
    { stiffness: 160, damping: 26 },
  );
  const scrim = useTransform(scrollY, [0, 90], [0, 0.72]);
  const scrimBg = useMotionTemplate`linear-gradient(135deg, rgba(255,255,255,${useTransform(
    scrim,
    (v) => 0.1 + v * 0.05,
  )}), rgba(255,255,255,${useTransform(scrim, (v) => 0.02 + v * 0.02)})), rgba(13,15,19,${scrim})`;
  const edge = useTransform(scrollY, [0, 90], [0.14, 0.34]);
  const edgeCss = useMotionTemplate`linear-gradient(135deg, rgba(255,255,255,${useTransform(
    edge,
    (v) => v * 3,
  )}), rgba(255,255,255,${useTransform(edge, (v) => v * 0.4)}) 38%, rgba(255,255,255,${useTransform(edge, (v) => v * 0.12)}) 62%, rgba(255,255,255,${edge}))`;

  return (
    <motion.header
      ref={ref}
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5"
    >
      <motion.nav
        style={{ paddingTop: pad, paddingBottom: pad }}
        className="relative w-full max-w-[1200px] rounded-full border border-white/14 bg-white/[0.05] backdrop-blur-xl"
        aria-label="主导航"
      >
        {/* scroll scrim + variable edge, driven by scroll motion values */}
        <motion.div
          aria-hidden="true"
          style={{ background: scrimBg }}
          className="absolute inset-0 -z-10 rounded-full"
        />
        <motion.div
          aria-hidden="true"
          style={{
            background: edgeCss,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            padding: "1px",
          }}
          className="absolute inset-0 -z-10 rounded-full"
        />

        <div className="flex items-center justify-between gap-4 px-5 sm:px-7">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.18em] text-ink sm:text-[15px] sm:tracking-[0.22em]"
            aria-label="NOCTURNE ONE 首页"
          >
            <span className="text-ink-2">
              <Mark />
            </span>
            <span>NOCTURNE</span>
            <span className="text-accent">ONE</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-full px-4 py-2 text-[14px] tracking-[0.08em] text-ink-2 transition-colors duration-200 hover:bg-white/[0.06] hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => open(e.currentTarget)}
            className="btn btn-primary btn-sm"
          >
            预约试听
          </button>
        </div>
      </motion.nav>
    </motion.header>
  );
}
