/* Brand & UI icons — inline SVG, currentColor-driven */
import whaleUrl from './assets/whale.png'

export function WhaleLogo({ size = 26 }: { size?: number }) {
  return (
    <img
      src={whaleUrl}
      width={size}
      height={(size * 39) / 65}
      alt=""
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  )
}

export function GitHubIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

export function BookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M3.5 2.75h7.75c.69 0 1.25.56 1.25 1.25v9.25H3.5A1.5 1.5 0 0 1 2 11.75v-7.5A1.5 1.5 0 0 1 3.5 2.75Z" />
      <path d="M12.5 13.25v-6.5" strokeLinecap="round" />
      <path d="M5 6.25h4M5 8.75h4" strokeLinecap="round" />
    </svg>
  )
}

export function BoxIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 1.6 14 4.7v6.6L8 14.4 2 11.3V4.7L8 1.6Z" />
      <path d="M2.1 4.8 8 7.8l5.9-3M8 7.8v6.4" />
    </svg>
  )
}

export function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.6" />
      <path d="M10.5 5.5v-2A1 1 0 0 0 9.5 2.5h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
    </svg>
  )
}

export function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 8.5 6 12l7.5-8" />
    </svg>
  )
}

export function WeChatIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.3 4C5.4 4 2.2 6.6 2.2 9.8c0 1.8 1 3.4 2.5 4.5l-.6 2 2.1-1.1c.7.2 1.4.3 2.1.3h.4c-.1-.4-.2-.9-.2-1.3 0-3.4 3.2-6.1 7.1-6.1h.4C15.4 5.8 12.6 4 9.3 4Zm-2.2 3.6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm4.4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
      <path d="M21.8 14.2c0-2.9-2.9-5.2-6.4-5.2s-6.4 2.3-6.4 5.2 2.9 5.2 6.4 5.2c.7 0 1.4-.1 2-.3l1.9 1-.5-1.8c1.8-.9 3-2.4 3-4.1Zm-8.5-1.4a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm4.2 0a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z" />
    </svg>
  )
}

/* --------------------------- new section icons --------------------------- */

export function AtomIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <ellipse cx="17" cy="17" rx="13.5" ry="5.6" />
      <ellipse cx="17" cy="17" rx="13.5" ry="5.6" transform="rotate(62 17 17)" />
      <ellipse cx="17" cy="17" rx="13.5" ry="5.6" transform="rotate(-62 17 17)" />
      <circle cx="17" cy="17" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function RingIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="17" cy="17" r="12" />
      <circle cx="17" cy="5" r="2" fill="currentColor" stroke="none" />
      <circle cx="27.5" cy="21.5" r="2" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="21.5" r="2" fill="currentColor" stroke="none" />
      <circle cx="22" cy="27.5" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function GridSquaresIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="6" y="6" width="10" height="10" rx="2.4" />
      <rect x="18" y="6" width="10" height="10" rx="2.4" />
      <rect x="6" y="18" width="10" height="10" rx="2.4" />
      <rect x="18" y="18" width="10" height="10" rx="2.4" />
    </svg>
  )
}

export function HistoryIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M4.5 6.5V10H8" />
      <path d="M4.8 10a7 7 0 1 1-.9 4.2" />
      <path d="M11 7.5V11l2.6 1.8" />
    </svg>
  )
}

export function SearchIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="7" cy="7" r="4.4" />
      <path d="m10.4 10.4 3.2 3.2" />
    </svg>
  )
}

export function ChevronRightIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5.5 3 5 5-5 5" />
    </svg>
  )
}

export function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" />
    </svg>
  )
}

export function GearIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 1.6v1.8M8 12.6v1.8M1.6 8h1.8M12.6 8h1.8M3.5 3.5l1.3 1.3M11.2 11.2l1.3 1.3M12.5 3.5l-1.3 1.3M4.8 11.2l-1.3 1.3" strokeLinecap="round" />
    </svg>
  )
}

export function LayersIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
      <path d="m8 2 6 3-6 3-6-3 6-3Z" />
      <path d="m2.4 8.2 5.6 2.8 5.6-2.8M2.4 11.2 8 14l5.6-2.8" />
    </svg>
  )
}

export function BugIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="8.4" r="3.4" />
      <path d="M8 5V2.6M5.6 2.2 7 4M10.4 2.2 9 4M4.6 8H2.4M13.6 8h-2.2M5 11.3 3.4 12.8M11 11.3l1.6 1.5M8 5.6c1.5 0 2.7 1.2 2.7 2.8M8 11.2c-1.5 0-2.7-1.2-2.7-2.8" />
    </svg>
  )
}
