import { DEVELOPER, PLATFORM } from '../config/app'

type CreditVariant = 'compact' | 'sidebar' | 'showcase'

interface DeveloperCreditProps {
  variant?: CreditVariant
  className?: string
}

export function PlatformBadge({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-[11px] gap-1.5 sm:text-xs',
    lg: 'px-3 py-1.5 text-xs gap-2 sm:text-sm',
  }

  return (
    <span
      className={`cloud-badge inline-flex items-center rounded-full font-bold ring-1 ring-inset ${sizes[size]} bg-stone-50 text-stone-800 ring-stone-200/70`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-stone-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-stone-500" />
      </span>
      {PLATFORM.badge}
      <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-stone-700 sm:text-[10px]">
        {PLATFORM.status}
      </span>
    </span>
  )
}

/** @deprecated Use PlatformBadge */
export const CloudSystemBadge = PlatformBadge

export function DeveloperCredit({ variant = 'compact', className = '' }: DeveloperCreditProps) {
  if (variant === 'sidebar') {
    return (
      <div
        className={`developer-sidebar overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-stone-950 to-stone-950 p-3 ring-1 ring-white/10 ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="developer-avatar flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-stone-400 to-stone-400 text-xs font-black text-white shadow-lg shadow-stone-500/40">
            {DEVELOPER.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-stone-300/80">
              Developer
            </p>
            <p className="truncate text-xs font-extrabold text-white">{DEVELOPER.name}</p>
          </div>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-stone-100/70">{DEVELOPER.role}</p>
      </div>
    )
  }

  if (variant === 'showcase') {
    return (
      <div className={`developer-showcase relative overflow-hidden rounded-3xl ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-stone-600 via-stone-500 to-stone-400" />
        <div className="absolute inset-0 developer-grid opacity-30" />
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-stone-400/20 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-10">
          <div>
            <PlatformBadge size="lg" />
            <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Built for feed stores.
              <br />
              <span className="bg-gradient-to-r from-stone-300 to-stone-200 bg-clip-text text-transparent">
                Designed with precision.
              </span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-stone-100/90 sm:text-base">
              {PLATFORM.description}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {PLATFORM.pillars.map((pillar) => (
                <div
                  key={pillar.label}
                  className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur-sm sm:p-4"
                >
                  <span className="text-lg">{pillar.icon}</span>
                  <p className="mt-1 text-xs font-bold text-white sm:text-sm">{pillar.label}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-stone-100/75 sm:text-xs">{pillar.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="developer-card rounded-2xl bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur-md sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="developer-avatar relative mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-white/20 to-white/5 text-2xl font-black text-white shadow-2xl ring-2 ring-white/30 sm:h-24 sm:w-24 sm:text-3xl">
                {DEVELOPER.initials}
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-stone-400 text-sm text-stone-950 shadow-lg ring-2 ring-white/50">
                  ✦
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-200">Developer</p>
              <h4 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">{DEVELOPER.name}</h4>
              <p className="mt-1 text-sm font-semibold text-stone-200">{DEVELOPER.role}</p>
              <p className="mt-4 max-w-xs text-xs leading-relaxed text-stone-100/80 sm:text-sm">
                {DEVELOPER.tagline} — bringing Feed track&apos;s inventory forecasting and ordering platform
                to life for feeds supply stores nationwide.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['React', 'TypeScript', 'Real-time Sync', 'Tailwind', 'Forecast Engine'].map((tech) => (
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
      className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-stone-50 to-stone-100 px-3 py-2 ring-1 ring-stone-100 ${className}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-stone-500 to-stone-400 text-[10px] font-black text-white">
        {DEVELOPER.initials}
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Developer</p>
        <p className="text-xs font-extrabold text-slate-900">{DEVELOPER.name}</p>
      </div>
    </div>
  )
}
