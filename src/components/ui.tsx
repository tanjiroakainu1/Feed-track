import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { THEME } from '../config/theme'
import type { OrderStatus } from '../types'
import type { Order } from '../types'
import { formatCurrency as formatCurrencyValue, formatCurrencyPlain } from '../utils/currency'

export { formatCurrencyValue as formatCurrency, formatCurrencyPlain }

export function StatusBadge({ status }: { status: OrderStatus | string }) {
  const styles: Record<string, { bg: string; dot: string }> = {
    pending: { bg: 'bg-amber-50 text-amber-800 ring-amber-200/60', dot: 'bg-amber-500' },
    approved: { bg: 'bg-stone-50 text-stone-800 ring-stone-200/60', dot: 'bg-stone-500' },
    rejected: { bg: 'bg-rose-50 text-rose-800 ring-rose-200/60', dot: 'bg-rose-500' },
    processing: { bg: 'bg-stone-100 text-stone-800 ring-stone-200/60', dot: 'bg-stone-500' },
    completed: { bg: 'bg-stone-50 text-stone-800 ring-stone-200/60', dot: 'bg-stone-500' },
    cancelled: { bg: 'bg-slate-100 text-slate-700 ring-slate-200/60', dot: 'bg-slate-400' },
    active: { bg: 'bg-stone-50 text-stone-800 ring-stone-200/60', dot: 'bg-stone-500' },
    inactive: { bg: 'bg-slate-100 text-slate-600 ring-slate-200/60', dot: 'bg-slate-400' },
    critical: { bg: 'bg-rose-50 text-rose-800 ring-rose-200/60', dot: 'bg-rose-500' },
    warning: { bg: 'bg-amber-50 text-amber-800 ring-amber-200/60', dot: 'bg-amber-500' },
    good: { bg: 'bg-stone-50 text-stone-800 ring-stone-200/60', dot: 'bg-stone-500' },
  }

  const style = styles[status] ?? { bg: 'bg-slate-100 text-slate-700 ring-slate-200/60', dot: 'bg-slate-400' }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset sm:text-xs ${style.bg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  )
}

export function ActionButton({
  children,
  onClick,
  variant = 'primary',
  disabled,
  size = 'md',
  type = 'button',
  fullWidth,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'light' | 'outlineOnDark' | 'danger' | 'success' | 'warning' | 'ghost' | 'ghostOnDark' | 'outline'
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  className?: string
}) {
  const base =
    'btn-base relative inline-flex items-center justify-center gap-2 overflow-hidden font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 disabled:before:hidden'

  const variants: Record<string, { button: string; label: string }> = {
    primary: {
      button:
        'bg-gradient-to-r from-stone-600 via-stone-500 to-stone-400 bg-[length:200%_100%] shadow-lg shadow-stone-500/30 hover:bg-[position:100%_0] hover:shadow-xl hover:shadow-stone-500/35 active:scale-[0.97] focus-visible:ring-stone-500/40 btn-shine',
      label: 'text-white',
    },
    secondary: {
      button:
        'border border-slate-200/90 bg-white shadow-sm shadow-slate-200/50 hover:border-stone-200 hover:bg-stone-50/50 active:scale-[0.97] focus-visible:ring-stone-500/25',
      label: 'text-slate-700 group-hover:text-stone-700',
    },
    light: {
      button:
        'border-0 bg-white shadow-lg shadow-stone-900/20 hover:bg-stone-50 active:scale-[0.97] focus-visible:ring-white/40',
      label: 'text-stone-800',
    },
    outlineOnDark: {
      button:
        'border-2 border-white/40 bg-white/10 hover:border-white/60 hover:bg-white/20 active:scale-[0.97] focus-visible:ring-white/30',
      label: 'text-white',
    },
    outline: {
      button:
        'border-2 border-stone-200 bg-transparent hover:border-stone-400 hover:bg-stone-50 active:scale-[0.97] focus-visible:ring-stone-500/30',
      label: 'text-stone-700',
    },
    ghost: {
      button: 'bg-transparent hover:bg-slate-100 active:scale-[0.97] focus-visible:ring-slate-400/30',
      label: 'text-slate-600 hover:text-slate-900',
    },
    ghostOnDark: {
      button: 'bg-transparent hover:bg-white/10 active:scale-[0.97] focus-visible:ring-white/25',
      label: 'text-white',
    },
    danger: {
      button:
        'bg-gradient-to-r from-rose-600 to-red-600 shadow-lg shadow-rose-500/30 hover:from-rose-500 hover:to-red-500 hover:shadow-xl hover:shadow-rose-500/35 active:scale-[0.97] focus-visible:ring-rose-500/40 btn-shine',
      label: 'text-white',
    },
    success: {
      button:
        'bg-gradient-to-r from-stone-600 to-stone-700 shadow-lg shadow-stone-500/30 hover:from-stone-500 hover:to-stone-600 hover:shadow-xl hover:shadow-stone-500/35 active:scale-[0.97] focus-visible:ring-stone-500/40 btn-shine',
      label: 'text-white',
    },
    warning: {
      button:
        'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30 hover:from-amber-400 hover:to-orange-400 hover:shadow-xl hover:shadow-amber-500/35 active:scale-[0.97] focus-visible:ring-amber-500/40 btn-shine',
      label: 'text-white',
    },
  }

  const sizes = {
    xs: 'min-h-[2.75rem] px-2.5 py-1 text-[11px] rounded-lg sm:min-h-[2.125rem] sm:px-3 sm:text-xs',
    sm: 'min-h-[2.75rem] px-3.5 py-2 text-xs rounded-xl sm:min-h-[2.875rem] sm:px-4 sm:text-sm',
    md: 'min-h-[2.875rem] px-5 py-2.5 text-sm rounded-xl sm:min-h-[3rem] sm:px-6',
    lg: 'min-h-[3.125rem] px-6 py-3 text-sm rounded-2xl sm:min-h-[3.25rem] sm:px-8 sm:text-base',
  }

  const style = variants[variant] ?? variants.primary

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group ${base} ${style.button} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <span className={`relative z-[1] inline-flex items-center justify-center gap-2 ${style.label}`}>{children}</span>
    </button>
  )
}

export function FilterChip({
  active,
  children,
  onClick,
  className = '',
}: {
  active?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-base min-h-[2.75rem] flex-1 rounded-xl px-3 py-2 text-xs font-semibold capitalize transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-500/25 sm:min-h-[2.875rem] sm:flex-none sm:px-4 sm:text-sm ${
        active
          ? 'bg-gradient-to-r from-stone-600 to-stone-400 text-white shadow-lg shadow-stone-500/30'
          : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-stone-200 hover:bg-stone-50/40 hover:text-stone-700'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function IconButton({
  children,
  onClick,
  label,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`btn-base touch-target inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-500/25 ${className}`}
    >
      {children}
    </button>
  )
}

export function ButtonGroup({ children, className = '', stackOnMobile = true }: { children: React.ReactNode; className?: string; stackOnMobile?: boolean }) {
  return (
    <div
      className={`flex gap-2 ${stackOnMobile ? 'flex-col xs:flex-row xs:flex-wrap' : 'flex-col sm:flex-row flex-wrap'} ${className}`}
    >
      {children}
    </div>
  )
}

export function TableActions({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-[8rem] flex-col gap-2 sm:min-w-0 sm:flex-row sm:flex-wrap ${className}`}>
      {children}
    </div>
  )
}

export function Card({
  children,
  className = '',
  hover = false,
  padding = 'default',
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'default' | 'compact' | 'none'
}) {
  const paddingClass =
    padding === 'compact' ? 'p-4 sm:p-5' : padding === 'none' ? 'p-0' : 'p-4 sm:p-6'

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50 ${paddingClass} ${hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  action,
  subtitle,
}: {
  title: string
  action?: React.ReactNode
  subtitle?: string
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function EmptyState({ message, icon = '📭' }: { message: string; icon?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center sm:px-6 sm:py-14">
      <span className="mb-3 text-2xl sm:text-3xl">{icon}</span>
      <p className="max-w-xs text-sm font-medium text-slate-500">{message}</p>
    </div>
  )
}

export function AlertBanner({
  message,
  variant = 'error',
}: {
  message: string
  variant?: 'error' | 'success' | 'info'
}) {
  const styles = {
    error: 'border-rose-200 bg-rose-50 text-rose-800',
    success: 'border-stone-200 bg-stone-50 text-stone-800',
    info: 'border-stone-200 bg-stone-50 text-stone-800',
  }

  return (
    <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium sm:mb-5 ${styles[variant]}`}>
      {message}
    </div>
  )
}

export function SuccessBanner({ message }: { message: string }) {
  if (!message) return null
  return <AlertBanner message={message} variant="success" />
}

export function PageLink({
  to,
  children,
  accent = 'stone',
}: {
  to: string
  children: React.ReactNode
  accent?: 'stone' | 'amber' | 'slate'
}) {
  const colors = {
    stone: 'text-stone-600 hover:text-stone-700',
    amber: 'text-amber-600 hover:text-amber-700',
    slate: 'text-slate-600 hover:text-slate-700',
  }

  return (
    <Link to={to} className={`text-xs font-semibold transition sm:text-sm ${colors[accent]}`}>
      {children}
    </Link>
  )
}

export function ListRow({
  children,
  className = '',
  stackOnMobile = true,
}: {
  children: React.ReactNode
  className?: string
  stackOnMobile?: boolean
}) {
  return (
    <div
      className={`rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition hover:border-slate-200 hover:bg-white sm:p-4 ${
        stackOnMobile
          ? 'flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between'
          : 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function QuickActionCard({
  to,
  label,
  desc,
  icon,
  accent = THEME.primary,
}: {
  to: string
  label: string
  desc: string
  icon?: string
  accent?: string
}) {
  return (
    <Link
      to={to}
      className="group block rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 sm:p-5"
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base sm:h-11 sm:w-11 sm:text-lg"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-slate-900 group-hover:text-stone-700">{label}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
        </div>
      </div>
    </Link>
  )
}

export function OrderCard({
  order,
  actions,
}: {
  order: Order
  actions?: React.ReactNode
}) {
  return (
    <Card hover padding="compact">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h3 className="font-bold text-slate-900">Order #{order.id}</h3>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 break-words text-sm text-slate-600">
            {order.customerName} · {order.customerEmail}
          </p>
          <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
        </div>
        <p className="shrink-0 text-lg font-bold text-slate-900 sm:text-right">{formatCurrencyValue(order.total)}</p>
      </div>
      <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3">
        {order.items.map((item, i) => (
          <li key={i} className="flex flex-wrap justify-between gap-x-2 text-sm text-slate-600">
            <span>
              {item.quantity}x {item.productName}
            </span>
            <span className="font-medium">{formatCurrencyValue(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>
      {order.notes && <p className="mt-2 text-xs text-slate-400">Note: {order.notes}</p>}
      {actions && <div className="mt-4 border-t border-slate-100 pt-4">{actions}</div>}
    </Card>
  )
}

export function DataTable({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const check = () => {
      setScrollable(el.scrollWidth > el.clientWidth + 2)
    }

    check()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null
    observer?.observe(el)
    window.addEventListener('resize', check)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', check)
    }
  }, [children])

  return (
    <div
      className={`data-table-wrap overflow-hidden rounded-none border-y border-slate-200/80 bg-white shadow-sm sm:mx-0 sm:rounded-2xl sm:border sm:shadow-slate-200/50 ${scrollable ? 'is-scrollable' : ''}`}
    >
      <div ref={scrollRef} className="data-table-scroll">
        {children}
      </div>
      <p className="data-table-hint">Swipe horizontally to see more columns</p>
    </div>
  )
}

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full min-w-[34rem] table-auto divide-y divide-slate-100 sm:min-w-full">{children}</table>
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-slate-50/80">{children}</thead>
}

export function TableHeaderCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:px-5 sm:py-3.5 sm:text-[11px] ${className}`}
    >
      {children}
    </th>
  )
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-slate-50 bg-white">{children}</tbody>
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="transition hover:bg-slate-50/80">{children}</tr>
}

export function TableCell({ children, className = '', nowrap = false }: { children: React.ReactNode; className?: string; nowrap?: boolean }) {
  return (
    <td
      className={`px-3 py-3 text-xs text-slate-700 sm:px-5 sm:py-4 sm:text-sm ${
        nowrap ? 'whitespace-nowrap' : 'break-words align-top'
      } ${className}`}
    >
      {children}
    </td>
  )
}

export function QtyControl({
  value,
  onDecrease,
  onIncrease,
}: {
  value: number
  onDecrease: () => void
  onIncrease: () => void
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <IconButton label="Decrease quantity" onClick={onDecrease} className="h-11 w-11 text-xl">
        −
      </IconButton>
      <span className="min-w-[2.5rem] text-center text-base font-bold tabular-nums sm:text-lg">{value}</span>
      <IconButton label="Increase quantity" onClick={onIncrease} className="h-11 w-11 text-xl">
        +
      </IconButton>
    </div>
  )
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
