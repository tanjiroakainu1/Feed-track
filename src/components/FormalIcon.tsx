import type { ReactNode, SVGProps } from 'react'

export type IconName =
  | 'product'
  | 'users'
  | 'chart'
  | 'report'
  | 'orders'
  | 'alert'
  | 'forecast'
  | 'bell'
  | 'cart'
  | 'money'
  | 'check'
  | 'search'
  | 'clock'
  | 'refresh'
  | 'shop'
  | 'empty'
  | 'select'
  | 'truck'
  | 'settings'

interface FormalIconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

function Svg({ size = 20, className = '', children, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

const ICONS: Record<IconName, (size: number) => ReactNode> = {
  product: (size) => (
    <Svg size={size}>
      <path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z" />
      <path d="M3.3 7.7L12 12.5l8.7-4.8M12 22.1V12.5" />
    </Svg>
  ),
  users: (size) => (
    <Svg size={size}>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </Svg>
  ),
  chart: (size) => (
    <Svg size={size}>
      <path d="M3 3v18h18" />
      <path d="M7 16l4-6 4 3 5-7" />
    </Svg>
  ),
  report: (size) => (
    <Svg size={size}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </Svg>
  ),
  orders: (size) => (
    <Svg size={size}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h6" />
    </Svg>
  ),
  alert: (size) => (
    <Svg size={size}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </Svg>
  ),
  forecast: (size) => (
    <Svg size={size}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  ),
  bell: (size) => (
    <Svg size={size}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </Svg>
  ),
  cart: (size) => (
    <Svg size={size}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </Svg>
  ),
  money: (size) => (
    <Svg size={size}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 10h.01M18 14h.01" />
    </Svg>
  ),
  check: (size) => (
    <Svg size={size}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </Svg>
  ),
  search: (size) => (
    <Svg size={size}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </Svg>
  ),
  clock: (size) => (
    <Svg size={size}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  ),
  refresh: (size) => (
    <Svg size={size}>
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0115-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 01-15 6.7L3 16" />
    </Svg>
  ),
  shop: (size) => (
    <Svg size={size}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path d="M9 22V12h6v10" />
    </Svg>
  ),
  empty: (size) => (
    <Svg size={size}>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
    </Svg>
  ),
  select: (size) => (
    <Svg size={size}>
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path d="M13 13l6 6" />
    </Svg>
  ),
  truck: (size) => (
    <Svg size={size}>
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </Svg>
  ),
  settings: (size) => (
    <Svg size={size}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </Svg>
  ),
}

export function FormalIcon({ name, size = 20, className = '' }: FormalIconProps) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${className}`}>
      {ICONS[name](size)}
    </span>
  )
}

export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center font-extrabold tracking-tight ${className}`}
      aria-hidden="true"
    >
      FT
    </span>
  )
}
