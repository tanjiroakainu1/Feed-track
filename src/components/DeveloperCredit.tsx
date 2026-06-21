import { CLOUD_SYSTEM, DEVELOPER } from '../config/app'

type CreditVariant = 'compact' | 'sidebar' | 'footer' | 'showcase' | 'minimal'

interface DeveloperCreditProps {
  variant?: CreditVariant
  className?: string
}

export function CloudSystemBadge({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-[11px] gap-1.5 sm:text-xs',
    lg: 'px-3 py-1.5 text-xs gap-2 sm:text-sm',
  }

  return (
    <span
      className={`cloud-badge inline-flex items-center rounded-full font-bold ring-1 ring-inset ${sizes[size]} bg-emerald-50 text-emerald-800 ring-emerald-200/70`}
    >
      <span className="cloud-pulse relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      {CLOUD_SYSTEM.badge}
      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-emerald-700 sm:text-[10px]">
        {CLOUD_SYSTEM.status}
      </span>
    </span>
  )
}

export function DeveloperCredit({ variant = 'compact', className = '' }: DeveloperCreditProps) {
  if (variant === 'minimal') {
    return (
      <p className={`text-[10px] font-medium text-slate-400 sm:text-xs ${className}`}>
        {CLOUD_SYSTEM.shortLabel} · Dev by{' '}
        <span className="font-bold text-emerald-600">{DEVELOPER.name}</span>
      </p>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div
        className={`developer-sidebar overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-emerald-950 to-yellow-950 p-3 ring-1 ring-white/10 ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="developer-avatar flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-yellow-500 text-xs font-black text-white shadow-lg shadow-emerald-500/40">
            {DEVELOPER.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">Developer</p>
            <p className="truncate text-xs font-extrabold text-white">{DEVELOPER.name}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-[10px]">☁️</span>
          <p className="text-[10px] font-semibold text-yellow-200/90">{CLOUD_SYSTEM.name}</p>
        </div>
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-col items-center gap-5 sm:flex-row sm:justify-between ${className}`}>
        <CloudSystemBadge size="lg" />
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="developer-avatar flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-yellow-500 to-yellow-400 text-sm font-black text-white shadow-lg shadow-emerald-500/30 sm:h-11 sm:w-11">
            {DEVELOPER.initials}
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Developed by</p>
            <p className="text-lg font-extrabold text-slate-900 sm:text-base">{DEVELOPER.name}</p>
            <p className="text-xs text-slate-500">{DEVELOPER.role}</p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'showcase') {
    return (
      <div className={`developer-showcase relative overflow-hidden rounded-3xl ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-yellow-500" />
        <div className="absolute inset-0 developer-grid opacity-30" />
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-yellow-400/20 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-10">
          <div>
            <CloudSystemBadge size="lg" />
            <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Powered by the cloud.
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-emerald-200 bg-clip-text text-transparent">
                Crafted with precision.
              </span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/90 sm:text-base">
              {CLOUD_SYSTEM.description}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {CLOUD_SYSTEM.pillars.map((pillar) => (
                <div
                  key={pillar.label}
                  className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur-sm sm:p-4"
                >
                  <span className="text-lg">{pillar.icon}</span>
                  <p className="mt-1 text-xs font-bold text-white sm:text-sm">{pillar.label}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-emerald-100/75 sm:text-xs">{pillar.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="developer-card rounded-2xl bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur-md sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="developer-avatar relative mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-white/20 to-white/5 text-2xl font-black text-white shadow-2xl ring-2 ring-white/30 sm:h-24 sm:w-24 sm:text-3xl">
                {DEVELOPER.initials}
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm shadow-lg ring-2 ring-white/50">
                  ✦
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200">Developer</p>
              <h4 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">{DEVELOPER.name}</h4>
              <p className="mt-1 text-sm font-semibold text-yellow-200">{DEVELOPER.role}</p>
              <p className="mt-4 max-w-xs text-xs leading-relaxed text-emerald-100/80 sm:text-sm">
                {DEVELOPER.tagline} — bringing Feed track&apos;s cloud-based inventory forecasting & ordering
                platform to life for feeds supply stores nationwide.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['React', 'TypeScript', 'Cloud Sync', 'Tailwind', 'Forecast AI'].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold text-white ring-1 ring-white/20 sm:text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-50 to-yellow-50 px-3 py-2 ring-1 ring-emerald-100 ${className}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-yellow-500 text-[10px] font-black text-white">
        {DEVELOPER.initials}
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Developer</p>
        <p className="text-xs font-extrabold text-slate-900">{DEVELOPER.name}</p>
      </div>
    </div>
  )
}
