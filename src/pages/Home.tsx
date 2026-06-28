import { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PublicFooter, PublicHeader } from '../components/PublicShell'
import { DeveloperCredit, PlatformBadge } from '../components/DeveloperCredit'
import { ActionButton, Card } from '../components/ui'
import {
  APP_DESCRIPTION,
  APP_HOME_TITLE,
  APP_NAME,
  APP_TAGLINE,
  APP_FEATURES,
  HOME_HIGHLIGHTS,
  SYSTEM_FLOW,
} from '../config/app'
import { ROLE_CONFIG, getRoleInitials } from '../config/roles'
import { getRolePath, useApp } from '../context/AppContext'

export function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, currentUser } = useApp()

  useEffect(() => {
    document.title = APP_HOME_TITLE
    return () => {
      document.title = `${APP_NAME} — Feed Supply Management`
    }
  }, [])

  if (isAuthenticated && currentUser) {
    return <Navigate to={getRolePath(currentUser.role)} replace />
  }

  return (
    <div className="landing-shell min-h-screen">
      <PublicHeader transparent />

      <section className="landing-hero relative overflow-hidden safe-px">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMyIgY3k9IjMiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-3 py-16 sm:px-6 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <PlatformBadge size="lg" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {APP_NAME}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-emerald-100/90 sm:text-lg lg:text-xl">
              {APP_TAGLINE}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {APP_DESCRIPTION}
            </p>
            <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <ActionButton variant="primary" size="lg" fullWidth className="sm:min-w-[200px] sm:w-auto" onClick={() => navigate('/register')}>
                Create Free Account
              </ActionButton>
              <ActionButton
                variant="outlineOnDark"
                size="lg"
                fullWidth
                className="sm:min-w-[160px] sm:w-auto"
                onClick={() => navigate('/login')}
              >
                Sign In
              </ActionButton>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {HOME_HIGHLIGHTS.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-white/5 p-4 text-center ring-1 ring-white/10 backdrop-blur-sm sm:p-5"
              >
                <p className="text-xl font-extrabold text-white sm:text-2xl">{item.value}</p>
                <p className="mt-1 text-[11px] font-semibold text-emerald-100/80 sm:text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="page-enter border-b border-slate-200/80 bg-white safe-px">
        <div className="mx-auto max-w-7xl px-3 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 sm:text-sm">System flow</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              How Feed track works
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Orders move through your feed supply store in a clear pipeline. Each role has a dedicated dashboard
              with the tools they need — data stays synced across the entire system.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-200 to-yellow-200 sm:left-1/2 sm:block sm:-translate-x-1/2" />

            <div className="space-y-6 sm:space-y-10">
              {SYSTEM_FLOW.map((step, index) => (
                <div
                  key={step.step}
                  className={`relative flex flex-col gap-4 sm:flex-row sm:items-center ${
                    index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                    <Card hover padding="compact" className="relative overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full w-1 sm:hidden"
                        style={{ backgroundColor: step.accent }}
                      />
                      <div className="flex items-start gap-3 sm:block">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg sm:mx-auto sm:mb-3"
                          style={{ backgroundColor: `${step.accent}18`, color: step.accent }}
                        >
                          {step.icon}
                        </span>
                        <div className={index % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Step {step.step} · {step.role}
                          </p>
                          <h3 className="mt-1 text-lg font-bold text-slate-900">{step.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="absolute left-4 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-emerald-500 shadow-md sm:left-1/2 sm:block" />

                  <div className="hidden flex-1 sm:block" />
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50 p-5 ring-1 ring-slate-200/80 sm:p-6">
            <p className="text-center text-sm leading-relaxed text-slate-700 sm:text-base">
              <strong className="text-slate-900">End-to-end visibility:</strong> When a customer places an order,
              sales staff get notified. Upon approval, inventory deducts stock automatically. Forecasting runs
              continuously in the background — alerting teams before shelves run empty. All amounts tracked in{' '}
              <strong className="text-slate-900">Philippine Peso (₱)</strong>.
            </p>
          </div>
        </div>
      </section>

      <section id="roles" className="app-shell border-b border-slate-200/80 safe-px">
        <div className="mx-auto max-w-7xl px-3 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 sm:text-sm">Role access</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Four dashboards, one platform
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Register with a role or sign in to access your workspace. Administrators can create accounts for
              staff and customers.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLE_CONFIG.map((role) => (
              <Card key={role.role} hover padding="compact" className="flex h-full flex-col">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-extrabold"
                  style={{ backgroundColor: `${role.color}15`, color: role.color }}
                >
                  {getRoleInitials(role.title)}
                </div>
                <h3 className="font-bold text-slate-900">{role.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{role.description}</p>
                <Link
                  to="/login"
                  className="mt-4 inline-flex text-sm font-bold transition hover:opacity-80"
                  style={{ color: role.color }}
                >
                  Sign in as {role.title.split(' ')[0]} →
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-white safe-px">
        <div className="mx-auto max-w-7xl px-3 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 sm:text-sm">Capabilities</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Built for feed supply operations
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {APP_FEATURES.map((feature) => (
              <Card key={feature.label} hover padding="compact">
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                    {feature.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{feature.label}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="developer" className="border-b border-slate-200/80 bg-slate-50 safe-px">
        <div className="mx-auto max-w-7xl px-3 py-14 sm:px-6 sm:py-20">
          <DeveloperCredit variant="showcase" />
        </div>
      </section>

      <section className="landing-cta safe-px">
        <div className="mx-auto max-w-7xl px-3 py-14 sm:px-6 sm:py-16">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 p-8 text-center shadow-2xl shadow-emerald-500/30 sm:p-12">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Ready to manage your feed store?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-emerald-100 sm:text-base">
              Create an account or sign in to access your role dashboard. Inventory, orders, and forecasting —
              all in one place.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ActionButton
                variant="light"
                size="lg"
                className="min-w-[160px]"
                onClick={() => navigate('/register')}
              >
                Get Started
              </ActionButton>
              <ActionButton
                variant="outlineOnDark"
                size="lg"
                className="min-w-[140px]"
                onClick={() => navigate('/login')}
              >
                Sign In
              </ActionButton>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
