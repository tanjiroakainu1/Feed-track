interface StatCardProps {
  label: string
  value: string | number
  icon?: string
  trend?: string
  variant?: 'default' | 'warning' | 'success' | 'info'
}

const variantStyles = {
  default: {
    card: 'border-slate-200/80 bg-white',
    icon: 'bg-slate-100 text-slate-600',
    value: 'text-slate-900',
  },
  warning: {
    card: 'border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50',
    icon: 'bg-amber-100 text-amber-700',
    value: 'text-amber-800',
  },
  success: {
    card: 'border-stone-200/80 bg-gradient-to-br from-stone-50 to-stone-100/50',
    icon: 'bg-stone-100 text-stone-700',
    value: 'text-stone-800',
  },
  info: {
    card: 'border-stone-200/80 bg-gradient-to-br from-stone-50 to-stone-100/50',
    icon: 'bg-stone-100 text-stone-700',
    value: 'text-stone-800',
  },
}

export function StatCard({ label, value, icon, trend, variant = 'default' }: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <div
      className={`group rounded-2xl border p-4 shadow-sm shadow-slate-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60 sm:p-5 ${styles.card}`}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">{label}</p>
          <p
            className={`mt-1.5 truncate text-xl font-extrabold tracking-tight sm:mt-2 sm:text-2xl md:text-3xl ${styles.value}`}
          >
            {value}
          </p>
          {trend && <p className="mt-1 text-[11px] font-medium text-slate-500 sm:text-xs">{trend}</p>}
        </div>
        {icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-transform duration-200 group-hover:scale-110 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl ${styles.icon}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:mb-8 sm:gap-4 lg:grid-cols-4">
      {children}
    </div>
  )
}
