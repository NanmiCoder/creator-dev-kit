import { useId } from "react";

/**
 * NOCTURNE ONE product sculpture, front view.
 * Built entirely in SVG: metallic shell, translucent acoustic chamber,
 * layered driver, machined yokes, floor reflection, depth copy and an
 * animated light sweep. Finish colors resolve through CSS variables
 * (--fin-*) so the FinishSwitcher can crossfade materials with CSS
 * transitions instead of re-rendering.
 */
export function ProductArt({
  className = "",
  floating = true,
}: {
  className?: string;
  floating?: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");
  const bandGrad = `bg-${uid}`;
  const cupGrad = `cg-${uid}`;
  const rimGrad = `rg-${uid}`;
  const yokeGrad = `yg-${uid}`;
  const pivotGrad = `pg-${uid}`;
  const cushionGrad = `cu-${uid}`;
  const driverGrad = `dg-${uid}`;
  const glassGrad = `gl-${uid}`;
  const streakGrad = `st-${uid}`;
  const sweepGrad = `sw-${uid}`;
  const chamClip = `cc-${uid}`;
  const silClip = `sc-${uid}`;
  const blurBack = `bb-${uid}`;
  const blurGlow = `bg2-${uid}`;
  const reflMask = `rm-${uid}`;

  return (
    <div
      className={`product-art ${floating ? "anim-float-a" : ""} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 560 620"
        fill="none"
        className="h-full w-full"
        role="img"
        aria-label="NOCTURNE ONE 头戴式耳机，透明声学腔体"
      >
        <defs>
          <linearGradient id={bandGrad} x1="280" y1="112" x2="280" y2="216" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--fin-1)" />
            <stop offset="0.5" stopColor="var(--fin-2)" />
            <stop offset="1" stopColor="var(--fin-3)" />
          </linearGradient>
          <linearGradient id={cupGrad} x1="66" y1="248" x2="246" y2="466" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--fin-1)" />
            <stop offset="0.42" stopColor="var(--fin-2)" />
            <stop offset="1" stopColor="var(--fin-3)" />
          </linearGradient>
          <linearGradient id={rimGrad} x1="280" y1="112" x2="280" y2="214" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="0.6" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.22)" />
          </linearGradient>
          <linearGradient id={yokeGrad} x1="104" y1="238" x2="154" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--fin-1)" />
            <stop offset="0.6" stopColor="var(--fin-2)" />
            <stop offset="1" stopColor="var(--fin-3)" />
          </linearGradient>
          <linearGradient id={pivotGrad} x1="143" y1="246" x2="167" y2="270" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--fin-1)" />
            <stop offset="1" stopColor="var(--fin-3)" />
          </linearGradient>
          <linearGradient id={cushionGrad} x1="76" y1="258" x2="234" y2="456" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1b1d21" />
            <stop offset="1" stopColor="#0b0c0e" />
          </linearGradient>
          <radialGradient id={driverGrad} cx="0.5" cy="0.36" r="0.75">
            <stop offset="0" stopColor="#31353b" />
            <stop offset="0.55" stopColor="#191b1f" />
            <stop offset="1" stopColor="#0e0f12" />
          </radialGradient>
          <linearGradient id={glassGrad} x1="90" y1="272" x2="220" y2="438" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="0.45" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
          <linearGradient id={streakGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(255,255,255,0)" />
            <stop offset="0.5" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id={sweepGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(255,255,255,0)" />
            <stop offset="0.5" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id={blurBack} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id={blurGlow} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <mask id={reflMask}>
            <rect x="0" y="318" width="560" height="154" fill={`url(#${uid}-reflGrad)`} />
          </mask>
          <linearGradient id={`${uid}-reflGrad`} x1="0" y1="472" x2="0" y2="318" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>

          <clipPath id={chamClip}>
            <rect x="90" y="272" width="130" height="166" rx="42" />
          </clipPath>
          <clipPath id={silClip}>
            <path d="M 108 210 A 210 210 0 0 1 452 210 L 420 210 A 180 180 0 0 0 140 210 Z" />
            <path d="M 131 210 A 177 177 0 0 1 429 210 L 413 210 A 159 159 0 0 0 147 210 Z" />
            <rect x="66" y="250" width="178" height="214" rx="60" transform="rotate(-4 155 357)" />
            <rect x="316" y="250" width="178" height="214" rx="60" transform="rotate(4 405 357)" />
          </clipPath>
        </defs>

        {/* ambient light pool */}
        <ellipse
          cx="280"
          cy="512"
          rx="212"
          ry="34"
          fill="var(--fin-glow)"
          filter={`url(#${blurGlow})`}
          className="anim-breathe"
        />

        {/* depth copy behind the sculpture */}
        <use
          href={`#${uid}-P`}
          filter={`url(#${blurBack})`}
          opacity="0.3"
          transform="translate(6 18) scale(1.02)"
        />

        {/* floor reflection */}
        <g transform="translate(0 940) scale(1 -1)" opacity="0.09">
          <g filter={`url(#${blurBack})`} mask={`url(#${reflMask})`}>
            <use href={`#${uid}-P`} />
          </g>
        </g>

        {/* the sculpture */}
        <g id={`${uid}-P`}>
          {/* headband (shallow arc, like a machined band) */}
          <path
            d="M 108 210 A 210 210 0 0 1 452 210 L 420 210 A 180 180 0 0 0 140 210 Z"
            fill={`url(#${bandGrad})`}
          />
          <path
            d="M 108 210 A 210 210 0 0 1 452 210"
            stroke={`url(#${rimGrad})`}
            strokeWidth="1.6"
          />
          {/* padded inner cushion */}
          <path
            d="M 152 210 A 168 168 0 0 1 408 210"
            stroke="#0d0e11"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M 154 202 A 166 166 0 0 1 406 202"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="2"
          />
          {/* band rivets */}
          <circle cx="108" cy="210" r="3.4" fill="#14161a" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx="452" cy="210" r="3.4" fill="#14161a" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* sliders */}
          <rect x="96" y="192" width="24" height="78" rx="11" fill={`url(#${bandGrad})`} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <rect x="440" y="192" width="24" height="78" rx="11" fill={`url(#${bandGrad})`} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="108" x2="108" y1="210" y2="258" stroke="rgba(0,0,0,0.55)" strokeWidth="3" strokeLinecap="round" />
          <line x1="452" x2="452" y1="210" y2="258" stroke="rgba(0,0,0,0.55)" strokeWidth="3" strokeLinecap="round" />

          {/* left cup (mirrored for the right side) */}
          <g id={`${uid}-cup`} transform="rotate(-4 155 357)">
            <rect x="66" y="250" width="178" height="214" rx="60" fill={`url(#${cupGrad})`} stroke="var(--fin-rim)" strokeWidth="1.2" />
            <rect x="71" y="255" width="168" height="204" rx="56" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
            {/* cushion */}
            <rect x="76" y="258" width="158" height="198" rx="50" fill={`url(#${cushionGrad})`} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <rect x="84" y="266" width="142" height="182" rx="44" stroke="rgba(0,0,0,0.5)" strokeWidth="4" />
            {/* glass chamber */}
            <rect x="90" y="272" width="130" height="166" rx="42" fill={`url(#${glassGrad})`} stroke="rgba(255,255,255,0.26)" strokeWidth="1" />
            <g clipPath={`url(#${chamClip})`}>
              <rect x="90" y="272" width="130" height="166" fill="rgba(8,9,11,0.5)" />
              {/* driver assembly */}
              <circle cx="155" cy="355" r="50" fill="#0d0e11" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <circle cx="155" cy="355" r="43" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <circle cx="155" cy="355" r="35" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              <circle cx="155" cy="355" r="27" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <circle cx="155" cy="355" r="20" fill={`url(#${driverGrad})`} stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
              <circle cx="155" cy="355" r="7.5" stroke="var(--accent)" strokeWidth="1.4" opacity="0.75" />
              <circle cx="155" cy="355" r="3" fill="#060708" />
              <path d="M 118 333 A 43 43 0 0 1 192 333" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
              {/* glass streaks */}
              <rect x="118" y="290" width="24" height="220" fill={`url(#${streakGrad})`} opacity="0.4" transform="rotate(26 155 355)" />
              <rect x="168" y="290" width="9" height="220" fill={`url(#${streakGrad})`} opacity="0.22" transform="rotate(26 155 355)" />
            </g>
            {/* chamber rim light */}
            <path d="M 97 300 A 46 46 0 0 1 148 275" stroke="rgba(255,255,255,0.42)" strokeWidth="1.4" strokeLinecap="round" />
            {/* vent dots */}
            <g fill="rgba(255,255,255,0.15)">
              <circle cx="104" cy="450" r="2.2" />
              <circle cx="124" cy="454" r="2.2" />
              <circle cx="144" cy="456" r="2.2" />
              <circle cx="164" cy="454" r="2.2" />
            </g>
            {/* yoke arm + pivot, drawn over the shell so the connection reads */}
            <path
              d="M 107 262 C 108 296, 128 296, 148 276"
              stroke={`url(#${yokeGrad})`}
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 107 262 C 108 296, 128 296, 148 276"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              transform="translate(-1.5 -3.5)"
            />
            <circle cx="150" cy="274" r="13" fill={`url(#${pivotGrad})`} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <circle cx="150" cy="274" r="3.6" fill="#0e0f12" />
          </g>
          <use href={`#${uid}-cup`} transform="translate(560 0) scale(-1 1)" />
        </g>

        {/* light sweep across the silhouette */}
        <g clipPath={`url(#${silClip})`} opacity="0.28" className="anim-sweep">
          <rect x="-230" y="-40" width="200" height="760" fill={`url(#${sweepGrad})`} transform="skewX(-16)" />
        </g>
      </svg>
    </div>
  );
}
