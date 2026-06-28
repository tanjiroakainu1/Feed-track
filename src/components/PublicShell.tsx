import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PLATFORM } from '../config/app'
import { HeaderBrand } from './HeaderBrand'
import { PlatformBadge } from './DeveloperCredit'
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

  const navLinkClass = transparent ? 'header-nav-link header-nav-link-dark' : 'header-nav-link header-nav-link-light'

  return (
    <>
      <header className={`app-header safe-px safe-pt ${transparent ? 'app-header-dark' : ''}`}>
        <div className="app-header-inner mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 sm:px-6 lg:px-8">
          <HeaderBrand tone={transparent ? 'dark' : 'light'} />

          <nav className="hidden items-center justify-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-2.5">
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
              className={`md:hidden ${
                transparent ? 'border-white/15 bg-white/10 text-white hover:border-white/25 hover:bg-white/15' : 'border-stone-200/90 bg-white/90'
              }`}
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
            className="fixed inset-0 z-40 bg-stone-950/50 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="header-mobile-sheet fixed inset-x-0 top-[calc(3.75rem+env(safe-area-inset-top))] z-50 max-h-[calc(100dvh-3.75rem-env(safe-area-inset-top))] overflow-y-auto p-4 safe-px safe-pb sm:top-[calc(4.25rem+env(safe-area-inset-top))] sm:max-h-[calc(100dvh-4.25rem-env(safe-area-inset-top))] md:hidden">
            <nav className="space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="header-nav-link header-nav-link-light flex min-h-[3rem] w-full px-4 text-base"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 grid gap-2 border-t border-stone-200/80 pt-4">
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
    <footer className="border-t border-stone-200/80 bg-white/90 safe-px safe-pb backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <HeaderBrand subtitle="" />
            <p className="mt-3 text-sm leading-relaxed text-stone-600">{PLATFORM.description}</p>
            <div className="mt-4">
              <PlatformBadge size="md" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Explore</p>
              <ul className="mt-3 space-y-2 text-sm font-medium text-stone-600">
                <li><a href="#how-it-works" className="inline-flex min-h-[2.75rem] items-center hover:text-stone-800">How it works</a></li>
                <li><a href="#roles" className="inline-flex min-h-[2.75rem] items-center hover:text-stone-800">Roles</a></li>
                <li><a href="#developer" className="inline-flex min-h-[2.75rem] items-center hover:text-stone-800">Developer</a></li>
                <li><a href="#features" className="inline-flex min-h-[2.75rem] items-center hover:text-stone-800">Features</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Account</p>
              <ul className="mt-3 space-y-2 text-sm font-medium text-stone-600">
                <li><Link to="/login" className="inline-flex min-h-[2.75rem] items-center hover:text-stone-800">Sign in</Link></li>
                <li><Link to="/register" className="inline-flex min-h-[2.75rem] items-center hover:text-stone-800">Register</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Platform</p>
              <ul className="mt-3 space-y-2 text-sm font-medium text-stone-600">
                {PLATFORM.pillars.map((p) => (
                  <li key={p.label}>{p.icon} {p.label}</li>
                ))}
              </ul>
            </div>
          </div>
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
