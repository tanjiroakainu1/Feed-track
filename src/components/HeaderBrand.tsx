import { Link } from 'react-router-dom'
import { APP_ICON, APP_NAME } from '../config/app'

interface HeaderBrandProps {
  tone?: 'light' | 'dark'
  onClick?: () => void
  subtitle?: string
}

export function HeaderBrand({ tone = 'light', onClick, subtitle = 'Feed supply platform' }: HeaderBrandProps) {
  const content = (
    <>
      <span className={`header-brand-mark ${tone === 'dark' ? 'header-brand-mark-dark' : ''}`}>{APP_ICON}</span>
      <div className="min-w-0">
        <span
          className={`block truncate text-sm font-extrabold tracking-tight sm:text-base ${
            tone === 'dark' ? 'text-white' : 'text-stone-900'
          }`}
        >
          {APP_NAME}
        </span>
        {subtitle && (
          <span
            className={`hidden truncate text-[10px] font-semibold uppercase tracking-[0.14em] sm:block ${
              tone === 'dark' ? 'text-stone-300/90' : 'text-stone-500'
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </>
  )

  const className = 'group flex min-w-0 items-center gap-2.5 sm:gap-3'

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${className} text-left`}>
        {content}
      </button>
    )
  }

  return (
    <Link to="/" className={className}>
      {content}
    </Link>
  )
}
