import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 16, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const IconOverview = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
    <rect x="13.5" y="3.5" width="7" height="4.5" rx="1.6" />
    <rect x="13.5" y="11" width="7" height="9.5" rx="1.6" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
  </Svg>
)

export const IconFleet = (p: P) => (
  <Svg {...p}>
    <path d="M3 7.5h10.5v9H3z" />
    <path d="M13.5 10h3.6l3 3.1v3.4h-6.6" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="16.8" cy="17.5" r="1.8" />
    <path d="M5 7.5V5h6.5v2.5" />
  </Svg>
)

export const IconOrder = (p: P) => (
  <Svg {...p}>
    <path d="M6.5 3.5h8l3.5 3.5v13.5h-11.5z" />
    <path d="M14.5 3.5V7h3.5" />
    <path d="M9 11.5h6.5M9 15h6.5M9 18.5h4" />
  </Svg>
)

export const IconTemp = (p: P) => (
  <Svg {...p}>
    <path d="M10 4.5a2 2 0 0 1 4 0v9.3a4.2 4.2 0 1 1-4 0z" />
    <path d="M12 10v7.2" />
    <circle cx="12" cy="17.4" r="1.15" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconAlert = (p: P) => (
  <Svg {...p}>
    <path d="M12 4 3.8 18.5h16.4z" />
    <path d="M12 10v4.2" />
    <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconReport = (p: P) => (
  <Svg {...p}>
    <path d="M4 4.5h16M4 4.5v15h16v-15" />
    <path d="M8 16.5v-5M12 16.5V9.5M16 16.5v-7" />
  </Svg>
)

export const IconSettings = (p: P) => (
  <Svg {...p}>
    <path d="M4 7.5h16M4 12h16M4 16.5h16" />
    <circle cx="9.5" cy="7.5" r="2" fill="var(--bg-deep)" />
    <circle cx="15" cy="12" r="2" fill="var(--bg-deep)" />
    <circle cx="8" cy="16.5" r="2" fill="var(--bg-deep)" />
  </Svg>
)

export const IconSearch = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.2" />
    <path d="m15.6 15.6 4.4 4.4" />
  </Svg>
)

export const IconCommand = (p: P) => (
  <Svg {...p}>
    <path d="M9 9V6a3 3 0 1 0-3 3zm0 0h6m-6 0v6m6-6V6a3 3 0 1 1 3 3zm0 0v6m-6 6v-6m0 0h6m-6 0v3a3 3 0 1 1-3-3m6 0a3 3 0 1 0 3 3v-3" />
  </Svg>
)

export const IconChevron = (p: P) => (
  <Svg {...p}>
    <path d="m6.5 9.5 5.5 5 5.5-5" />
  </Svg>
)

export const IconClose = (p: P) => (
  <Svg {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
)

export const IconClock = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
)

export const IconArrow = (p: P) => (
  <Svg {...p}>
    <path d="M4.5 12h14m-5.5-5.5L18.5 12 13 17.5" />
  </Svg>
)

export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
)

export const IconPhone = (p: P) => (
  <Svg {...p}>
    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L16 13l4 1.5v3a1.5 1.5 0 0 1-1.7 1.5C11.4 18.2 5.8 12.6 5 5.7A1.5 1.5 0 0 1 6.5 4z" />
  </Svg>
)

export const IconDownload = (p: P) => (
  <Svg {...p}>
    <path d="M12 4v10.5m0 0 4-4m-4 4-4-4" />
    <path d="M5 18.5h14" />
  </Svg>
)

export const IconSnow = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.5v17M4.6 7.75l14.8 8.5M4.6 16.25l14.8-8.5" />
    <path d="M12 3.5 9.8 5.7M12 3.5l2.2 2.2M12 20.5l-2.2-2.2M12 20.5l2.2-2.2" />
  </Svg>
)

export const IconPin = (p: P) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.4-6.5-10.2a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21z" />
    <circle cx="12" cy="10.5" r="2.2" />
  </Svg>
)

export const IconRetry = (p: P) => (
  <Svg {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4.5 4.5v4h4" />
  </Svg>
)

export const IconFilter = (p: P) => (
  <Svg {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Svg>
)

export const IconZap = (p: P) => (
  <Svg {...p}>
    <path d="M13 3 5 13.5h5.5L10 21l8-10.5h-5.5z" />
  </Svg>
)

export const IconBox = (p: P) => (
  <Svg {...p}>
    <path d="m4 8 8-4.5L20 8v8l-8 4.5L4 16z" />
    <path d="M4 8l8 4.5L20 8M12 12.5V20" />
  </Svg>
)
