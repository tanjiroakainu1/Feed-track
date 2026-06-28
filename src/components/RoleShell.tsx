import { useEffect, useState, type ReactNode } from 'react'
import { ROLE_CONFIG } from '../config/roles'
import { PLATFORM } from '../config/app'
import type { NavItem } from '../types/nav'
import type { User, UserRole } from '../types'
import { getRoleAccountSummaries } from '../utils/notifications'
import { PlatformBadge } from './DeveloperCredit'
import { ActionButton, IconButton } from './ui'

interface RoleShellProps {
  roleTitle: string
  roleSubtitle: string
  accentColor: string
  navItems: NavItem[]
  currentPath: string
  users: User[]
  userName?: string
  userEmail?: string
  currentRole?: UserRole
  onNavigate: (path: string) => void
  onLogout: () => void
  onQuickAccess?: (role: UserRole) => void
  children: ReactNode
}

export function RoleShell({
  roleTitle,
  roleSubtitle,
  accentColor,
  navItems,
  currentPath,
  users,
  userName,
  userEmail,
  currentRole,
  onNavigate,
  onLogout,
  onQuickAccess,
  children,
}: RoleShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : roleTitle.charAt(0)

  const roleAccounts = getRoleAccountSummaries(users)

  useEffect(() => {
    setSidebarOpen(false)
  }, [currentPath])

  useEffect(() => {
    if (!sidebarOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [sidebarOpen])

  const handleNav = (path: string) => {
    onNavigate(path)
    setSidebarOpen(false)
  }

  const isActive = (path: string) =>
    currentPath === path || (path === 'dashboard' && currentPath === '')

  return (
    <div className="app-shell min-h-screen">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-stone-200/80 bg-white/95 shadow-xl shadow-stone-300/20 backdrop-blur-md transition-transform duration-300 ease-in-out safe-px safe-pb safe-pt lg:w-72 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-stone-100 p-5">
          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className="group flex w-full items-center gap-3 text-left"
          >
            <div
              className="header-brand-mark text-sm font-bold text-white shadow-lg transition group-hover:scale-105"
              style={{ backgroundColor: accentColor, boxShadow: `${accentColor}40 0 8px 24px`, borderColor: 'transparent' }}
            >
              {roleTitle.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-stone-900">{roleTitle}</p>
              <p className="truncate text-xs font-medium text-stone-500">{roleSubtitle}</p>
            </div>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Navigation
          </p>
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                className={`relative flex w-full min-h-[2.75rem] items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'pl-4 text-white shadow-md'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
                style={
                  active
                    ? { backgroundColor: accentColor, boxShadow: `${accentColor}35 0 4px 14px` }
                    : undefined
                }
              >
                {active && (
                  <span className="absolute left-1.5 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-white/90" />
                )}
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {onQuickAccess && (
          <div className="border-t border-stone-100 p-4">
            <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Switch Role
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_CONFIG.map((config) => {
                const account = roleAccounts.find((entry) => entry.role === config.role)?.account
                const active = currentRole === config.role
                return (
                  <button
                    key={config.role}
                    type="button"
                    onClick={() => {
                      onQuickAccess(config.role)
                      setSidebarOpen(false)
                    }}
                    disabled={active || !account}
                    title={account ? account.name : 'No active account'}
                    className={`min-h-[2.75rem] rounded-lg px-2.5 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      active
                        ? 'text-white shadow-sm'
                        : 'border border-stone-200 bg-stone-50 text-stone-600 hover:bg-white hover:shadow-sm'
                    }`}
                    style={active ? { backgroundColor: config.color } : undefined}
                  >
                    {config.shortLabel}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="border-t border-stone-100 p-4">
          {userName && (
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-stone-50 p-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-900">{userName}</p>
                <p className="truncate text-xs text-stone-500">{userEmail}</p>
              </div>
            </div>
          )}
          <ActionButton type="button" onClick={onLogout} variant="secondary" fullWidth>
            Logout
          </ActionButton>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-72">
        <header
          className="app-header safe-px safe-pt"
          style={{ ['--header-accent' as string]: accentColor }}
        >
          <div className="header-accent-bar" aria-hidden="true" />
          <div className="app-header-inner w-full px-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <IconButton
                label={sidebarOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setSidebarOpen((open) => !open)}
                className="border-stone-200/90 bg-white/90 lg:hidden"
              >
                {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>

              <div className="header-page-context min-w-0 lg:border-l-0 lg:pl-0">
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-stone-500 lg:hidden">
                  {roleTitle}
                </p>
                <p className="truncate text-sm font-bold text-stone-900 sm:text-base">
                  {navItems.find((item) => isActive(item.path))?.label ?? 'Dashboard'}
                </p>
                <p className="hidden truncate text-xs text-stone-500 lg:block">{roleSubtitle}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {userName && (
                <div className="header-user-chip hidden sm:inline-flex">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {initials}
                  </div>
                  <div className="hidden min-w-0 text-left md:block">
                    <p className="truncate text-sm font-semibold text-stone-900">{userName}</p>
                    <p className="max-w-[10rem] truncate text-[11px] text-stone-500">{userEmail}</p>
                  </div>
                </div>
              )}
              <ActionButton type="button" onClick={onLogout} variant="secondary" size="sm" className="hidden xs:inline-flex">
                Logout
              </ActionButton>
              <IconButton
                label="Log out"
                onClick={onLogout}
                className="xs:hidden border-stone-200/90 bg-white/90 text-stone-700"
              >
                <LogoutIcon />
              </IconButton>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col">
          <div className="flex-1">{children}</div>
          <div className="role-footer-bar flex border-t border-stone-200/60 safe-px safe-pb items-center justify-between gap-2 py-2.5 lg:px-6">
            <PlatformBadge size="sm" />
            <p className="truncate text-[10px] font-medium text-stone-400 sm:text-xs">{PLATFORM.name}</p>
          </div>
        </main>
      </div>
    </div>
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

function LogoutIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}
