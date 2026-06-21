import { useEffect, useState, type ReactNode } from 'react'
import { ROLE_CONFIG } from '../config/roles'
import { CLOUD_SYSTEM } from '../config/app'
import type { NavItem } from '../types/nav'
import type { User, UserRole } from '../types'
import { getRoleAccountSummaries } from '../utils/notifications'
import { CloudSystemBadge, DeveloperCredit } from './DeveloperCredit'
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
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-slate-200/80 bg-white shadow-xl shadow-slate-300/20 transition-transform duration-300 ease-in-out safe-px safe-pb lg:w-72 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-slate-100 p-5">
          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className="group flex w-full items-center gap-3 text-left"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-lg transition group-hover:scale-105"
              style={{ backgroundColor: accentColor, boxShadow: `${accentColor}40 0 8px 24px` }}
            >
              {roleTitle.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{roleTitle}</p>
              <p className="truncate text-xs font-medium text-slate-500">{roleSubtitle}</p>
            </div>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                className={`flex w-full min-h-[2.75rem] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                style={
                  active
                    ? { backgroundColor: accentColor, boxShadow: `${accentColor}35 0 4px 14px` }
                    : undefined
                }
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {onQuickAccess && (
          <div className="border-t border-slate-100 p-4">
            <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                    className={`rounded-lg px-2 py-2 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      active
                        ? 'text-white shadow-sm'
                        : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:shadow-sm'
                    }`}
                    style={active ? { backgroundColor: config.color } : undefined}
                  >
                    {config.icon} {config.title.split(' ')[0]}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 hidden lg:block">
            <DeveloperCredit variant="sidebar" />
          </div>
          {userName && (
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
                <p className="truncate text-xs text-slate-500">{userEmail}</p>
              </div>
            </div>
          )}
          <ActionButton type="button" onClick={onLogout} variant="secondary" fullWidth>
            Logout
          </ActionButton>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="glass-header sticky top-0 z-30 border-b border-slate-200/80 shadow-sm shadow-slate-200/40 safe-px">
          <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
            <div className="flex min-w-0 items-center gap-3">
              <IconButton
                label={sidebarOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setSidebarOpen((open) => !open)}
                className="lg:hidden"
              >
                {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>

              <button
                type="button"
                onClick={() => handleNav('dashboard')}
                className="min-w-0 text-left lg:hidden"
              >
                <p className="truncate text-sm font-bold text-slate-900">{roleTitle}</p>
                <p className="truncate text-xs text-slate-500">
                  {navItems.find((item) => isActive(item.path))?.label ?? 'Dashboard'}
                </p>
              </button>

              <div className="hidden lg:block">
                <p className="text-sm font-bold text-slate-900">
                  {navItems.find((item) => isActive(item.path))?.label ?? 'Dashboard'}
                </p>
                <p className="text-xs text-slate-500">{roleSubtitle}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {userName && (
                <div className="hidden items-center gap-2 sm:flex">
                  <div className="hidden text-right md:block">
                    <p className="text-sm font-semibold text-slate-900">{userName}</p>
                    <p className="max-w-[160px] truncate text-xs text-slate-500">{userEmail}</p>
                  </div>
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {initials}
                  </div>
                </div>
              )}
              <ActionButton type="button" onClick={onLogout} variant="secondary" size="sm" className="hidden sm:inline-flex">
                Logout
              </ActionButton>
            </div>
          </div>

          <nav className="hidden border-t border-slate-100 py-2 lg:block xl:hidden safe-px">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {navItems.map((item) => {
                const active = isActive(item.path)
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNav(item.path)}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      active ? 'text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    style={active ? { backgroundColor: accentColor } : undefined}
                  >
                    {item.icon} {item.label}
                  </button>
                )
              })}
            </div>
          </nav>
        </header>

        <main className="flex flex-1 flex-col">
          <div className="flex-1">{children}</div>
          <div className="role-footer-bar flex border-t border-slate-200/60 safe-px safe-pb flex-col items-center gap-1 py-2 sm:flex-row sm:justify-between lg:px-6">
            <CloudSystemBadge size="sm" />
            <DeveloperCredit variant="minimal" />
            <p className="hidden text-[10px] font-medium text-slate-400 sm:block">{CLOUD_SYSTEM.name}</p>
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
