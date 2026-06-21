import type { ReactNode } from 'react'

interface PageContainerProps {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}

export function PageContainer({ title, description, children, actions }: PageContainerProps) {
  return (
    <div className="page-enter mx-auto w-full max-w-7xl px-3 py-5 safe-px sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
        <div className="relative min-w-0 pl-3 sm:pl-4">
          <div className="absolute left-0 top-0.5 h-[calc(100%-2px)] w-1 rounded-full bg-gradient-to-b from-emerald-500 to-yellow-500" />
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mt-2">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto sm:justify-end">{actions}</div>
        )}
      </div>
      {children}
    </div>
  )
}
