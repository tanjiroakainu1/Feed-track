import { Link } from 'react-router-dom'
import { ROLE_CONFIG, getRoleInitials } from '../config/roles'
import type { User, UserRole } from '../types'
import { getRoleAccountSummaries } from '../utils/notifications'

interface QuickRoleAccessProps {
  users: User[]
  currentRole?: UserRole
  onSelectRole: (role: UserRole) => void
  variant?: 'login' | 'header'
}

export function QuickRoleAccess({
  users,
  currentRole,
  onSelectRole,
  variant = 'header',
}: QuickRoleAccessProps) {
  const roleAccounts = getRoleAccountSummaries(users)

  if (variant === 'login') {
    return (
      <div>
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
          Quick access by role
        </p>
        <p className="mb-4 text-center text-xs text-slate-500">
          New here?{' '}
          <Link to="/" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Learn how the system works
          </Link>
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {roleAccounts.map(({ role, title, color, account }) => (
            <button
              key={role}
              type="button"
              onClick={() => onSelectRole(role)}
              disabled={!account}
              className="btn-base group flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-left shadow-sm shadow-slate-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition group-hover:scale-105"
                style={{ backgroundColor: `${color}18`, color, boxShadow: `inset 0 0 0 1px ${color}25` }}
              >
                {getRoleInitials(title)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{title}</p>
                <p className="truncate text-xs text-slate-500">
                  {account ? `${account.name}` : 'No active account'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-slate-200/60 bg-slate-50/80 px-4 py-2.5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Switch role
        </span>
        {ROLE_CONFIG.map((config) => {
          const account = roleAccounts.find((entry) => entry.role === config.role)?.account
          const isActive = currentRole === config.role
          return (
            <button
              key={config.role}
              type="button"
              onClick={() => onSelectRole(config.role)}
              disabled={isActive || !account}
              title={account ? `${account.name} (${account.email})` : 'No active account'}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'cursor-default text-white shadow-md'
                  : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-white hover:shadow disabled:cursor-not-allowed disabled:opacity-50'
              }`}
              style={
                isActive
                  ? { backgroundColor: config.color, boxShadow: `${config.color}35 0 4px 12px` }
                  : undefined
              }
            >
              {config.shortLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
