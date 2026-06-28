import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { APP_ICON, APP_NAME, DEVELOPER, PLATFORM } from '../config/app'
import { PlatformBadge, DeveloperCredit } from './DeveloperCredit'
import { ActionButton, IconButton } from './ui'

interface PublicHeaderProps {
  transparent?: boolean
}

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#roles', label: 'Roles' },
  { href: '#developer', label: 'Developer' },
  { href: '#features', label: 'Features' },
] as const

export function PublicHeader({ transparent = false }: PublicHeaderProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const linkClass = transparent
    ? 'text-white/85 hover:text-white'
    : 'text-slate-600 hover:text-slate-900'

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b safe-px ${
          transparent
            ? 'border-white/10 bg-slate-900/80 backdrop-blur-xl'
            : 'glass-header border-slate-200/80 shadow-sm shadow-slate-200/40'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 sm:h-16">
          <Link to="/" className="group flex min-w-0 items-center gap-2 sm:gap-3" onClick={() => setMenuOpen(false)}>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg sm:h-10 sm:w-10 ${
                transparent ? 'bg-white/10 ring-1 ring-white/20' : 'bg-emerald-50 ring-1 ring-emerald-100'
              }`}
            >
              {APP_ICON}
            </span>
            <span
              className={`truncate text-sm font-extrabold tracking-tight sm:text-base ${
                transparent ? 'text-white' : 'text-slate-900'
              }`}
            >
              {APP_NAME}
            </span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex lg:gap-6">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={`text-sm font-semibold transition ${linkClass}`}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <ActionButton
              variant={transparent ? 'ghostOnDark' : 'secondary'}
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex"
            >
              Sign In
            </ActionButton>
            <ActionButton variant="primary" size="sm" onClick={() => navigate('/register')} className="hidden sm:inline-flex">
              Get Started
            </ActionButton>
            <IconButton
              label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
              className={`md:hidden ${transparent ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : ''}`}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed inset-x-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-slate-200 bg-white p-4 shadow-xl safe-px safe-pb md:hidden">
            <nav className="space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[3rem] items-center rounded-xl px-4 text-base font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4">
              <ActionButton variant="secondary" fullWidth onClick={() => { setMenuOpen(false); navigate('/login') }}>
                Sign In
              </ActionButton>
              <ActionButton variant="primary" fullWidth onClick={() => { setMenuOpen(false); navigate('/register') }}>
                Get Started
              </ActionButton>
            </div>
            <div className="mt-4 flex justify-center">
              <PlatformBadge size="sm" />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white safe-px safe-pb">
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg ring-1 ring-emerald-100">
                {APP_ICON}
              </span>
              <span className="text-lg font-extrabold text-slate-900">{APP_NAME}</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{PLATFORM.description}</p>
            <div className="mt-4">
              <PlatformBadge size="md" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Explore</p>
              <ul className="mt-3 space-y-2 text-sm font-medium text-slate-600">
                <li><a href="#how-it-works" className="inline-flex min-h-[2rem] items-center hover:text-emerald-600">How it works</a></li>
                <li><a href="#roles" className="inline-flex min-h-[2rem] items-center hover:text-emerald-600">Roles</a></li>
                <li><a href="#developer" className="inline-flex min-h-[2rem] items-center hover:text-emerald-600">Developer</a></li>
                <li><a href="#features" className="inline-flex min-h-[2rem] items-center hover:text-emerald-600">Features</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account</p>
              <ul className="mt-3 space-y-2 text-sm font-medium text-slate-600">
                <li><Link to="/login" className="inline-flex min-h-[2rem] items-center hover:text-emerald-600">Sign in</Link></li>
                <li><Link to="/register" className="inline-flex min-h-[2rem] items-center hover:text-emerald-600">Register</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform</p>
              <ul className="mt-3 space-y-2 text-sm font-medium text-slate-600">
                {PLATFORM.pillars.map((p) => (
                  <li key={p.label}>{p.icon} {p.label}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-8">
          <DeveloperCredit variant="footer" />
          <p className="mt-6 text-center text-xs text-slate-400 sm:text-left">
            © {new Date().getFullYear()} {APP_NAME} · Feed supply management · Philippines (₱) · Dev by {DEVELOPER.name}
          </p>
        </div>
      </div>
    </footer>
  )
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
