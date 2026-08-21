import { useId } from "react";
import type { MotionStyle } from "motion/react";
import { motion } from "motion/react";

/**
 * Exploded diagram of the three structural layers.
 * Each layer receives opacity/scale motion styles from the parent
 * so scroll progress highlights them in sequence.
 */
export function StructureDiagram({
  band,
  chamber,
  cushion,
}: {
  band: MotionStyle;
  chamber: MotionStyle;
  cushion: MotionStyle;
}) {
  const uid = useId().replace(/[:]/g, "");
  const metal = `m-${uid}`;
  const cup = `c-${uid}`;
  const glass = `g-${uid}`;
  const driver = `d-${uid}`;
  const streak = `s-${uid}`;
  const bandRim = `r-${uid}`;
  const cush = `cu-${uid}`;
  const clip = `cl-${uid}`;

  return (
    <svg viewBox="0 0 460 600" fill="none" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={metal} x1="230" y1="42" x2="230" y2="152" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--fin-1)" />
          <stop offset="0.55" stopColor="var(--fin-2)" />
          <stop offset="1" stopColor="var(--fin-3)" />
        </linearGradient>
        <linearGradient id={cup} x1="140" y1="236" x2="320" y2="386" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--fin-1)" />
          <stop offset="0.45" stopColor="var(--fin-2)" />
          <stop offset="1" stopColor="var(--fin-3)" />
        </linearGradient>
        <linearGradient id={glass} x1="152" y1="250" x2="308" y2="372" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.03)" />
        </linearGradient>
        <radialGradient id={driver} cx="0.5" cy="0.36" r="0.8">
          <stop offset="0" stopColor="#2e3238" />
          <stop offset="1" stopColor="#0e0f12" />
        </radialGradient>
        <linearGradient id={streak} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id={bandRim} x1="230" y1="44" x2="230" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="0.7" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.2)" />
        </linearGradient>
        <linearGradient id={cush} x1="140" y1="442" x2="320" y2="534" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1c1e23" />
          <stop offset="1" stopColor="#0b0c0e" />
        </linearGradient>
        <clipPath id={clip}>
          <rect x="152" y="250" width="156" height="122" rx="36" />
        </clipPath>
      </defs>

      {/* central assembly guide */}
      <line x1="230" y1="40" x2="230" y2="560" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 7" />
      <line x1="230" y1="186" x2="230" y2="238" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 5" />
      <line x1="230" y1="386" x2="230" y2="440" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 5" />

      {/* 3: headband */}
      <motion.g style={band}>
        <path d="M 128 150 A 105 105 0 0 1 332 150" stroke={`url(#${metal})`} strokeWidth="21" strokeLinecap="round" />
        <path d="M 128 150 A 105 105 0 0 1 332 150" stroke={`url(#${bandRim})`} strokeWidth="1.6" />
        <path d="M 138 152 A 95 95 0 0 1 322 152" stroke="#0d0e11" strokeWidth="12" strokeLinecap="round" />
        <rect x="114" y="138" width="20" height="34" rx="9" fill={`url(#${metal})`} stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
        <rect x="326" y="138" width="20" height="34" rx="9" fill={`url(#${metal})`} stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
        <line x1="124" x2="124" y1="146" y2="168" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="336" x2="336" y1="146" y2="168" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>

      {/* 2: acoustic chamber */}
      <motion.g style={chamber}>
        <rect x="140" y="238" width="180" height="146" rx="44" fill={`url(#${cup})`} stroke="var(--fin-rim)" strokeWidth="1.2" />
        <rect x="152" y="250" width="156" height="122" rx="36" fill={`url(#${glass})`} stroke="rgba(255,255,255,0.26)" strokeWidth="1" />
        <g clipPath={`url(#${clip})`}>
          <rect x="152" y="250" width="156" height="122" fill="rgba(8,9,11,0.5)" />
          <circle cx="230" cy="311" r="38" fill="#0d0e11" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <circle cx="230" cy="311" r="30" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <circle cx="230" cy="311" r="15" fill={`url(#${driver})`} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <circle cx="230" cy="311" r="6" stroke="var(--accent)" strokeWidth="1.3" opacity="0.8" />
          <circle cx="230" cy="311" r="2" fill="#060708" />
          <rect x="192" y="284" width="20" height="150" fill={`url(#${streak})`} opacity="0.35" transform="rotate(24 230 311)" />
        </g>
        <path d="M 160 266 A 36 36 0 0 1 198 253" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round" />
      </motion.g>

      {/* 1: ear cushion */}
      <motion.g style={cushion}>
        <rect x="140" y="442" width="180" height="92" rx="38" fill={`url(#${cush})`} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <rect x="146" y="448" width="168" height="80" rx="34" stroke="rgba(0,0,0,0.5)" strokeWidth="3" />
        <rect x="150" y="450" width="160" height="76" rx="32" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <g stroke="rgba(255,255,255,0.09)" strokeWidth="1.4">
          <line x1="174" y1="456" x2="174" y2="520" />
          <line x1="202" y1="454" x2="202" y2="522" />
          <line x1="230" y1="453" x2="230" y2="523" />
          <line x1="258" y1="454" x2="258" y2="522" />
          <line x1="286" y1="456" x2="286" y2="520" />
        </g>
        <path d="M 146 470 A 34 34 0 0 1 196 445" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
      </motion.g>
    </svg>
  );
}
