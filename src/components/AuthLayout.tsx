import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PlatformBadge, DeveloperCredit } from './DeveloperCredit'
import { APP_FEATURES, APP_ICON, APP_NAME, APP_TAGLINE } from '../config/app'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
  extra?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer, extra }: AuthLayoutProps) {
  return (
    <div className="auth-shell flex min-h-screen">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMyIgY3k9IjMiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="relative">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl ring-1 ring-white/20">
            {APP_ICON}
          </div>
          <h1 className="max-w-lg text-4xl font-extrabold leading-tight tracking-tight">{APP_NAME}</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-emerald-100/90">{APP_TAGLINE}</p>
          <div className="mt-5">
            <PlatformBadge size="md" />
          </div>
        </div>
        <div className="relative grid max-w-md grid-cols-2 gap-4">
          {APP_FEATURES.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm"
            >
              <span className="text-xl">{item.icon}</span>
              <p className="mt-2 text-sm font-semibold text-white/90">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-emerald-100/70">{item.description}</p>
            </div>
          ))}
        </div>
        <DeveloperCredit variant="sidebar" className="relative mt-6" />
      </div>

      <div className="flex flex-1 flex-col justify-center px-4 py-8 safe-px safe-pb sm:px-8 sm:py-10 lg:max-w-xl lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 sm:mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">
                {APP_ICON}
              </span>
              {APP_NAME}
            </Link>
          </div>

          <div className="glass-panel rounded-2xl p-6 shadow-2xl shadow-black/20 sm:rounded-3xl sm:p-8">
            <div className="mb-6 text-center sm:mb-8 lg:text-left">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{subtitle}</p>
            </div>
            {children}
            {footer}
          </div>

          {extra && <div className="mt-8">{extra}</div>}

          <div className="mt-6 lg:hidden">
            <DeveloperCredit variant="compact" className="w-full justify-center" />
          </div>
        </div>
      </div>
    </div>
  )
}
