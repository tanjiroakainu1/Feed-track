import type { ReactNode } from 'react'

interface PageContainerProps {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}

export function PageContainer({ title, description, children, actions }: PageContainerProps) {
  return (
    <div className="page-enter mx-auto w-full max-w-7xl px-3 py-4 safe-px sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
        <div className="relative min-w-0 flex-1 pl-3 sm:pl-4">
          <div className="absolute left-0 top-0.5 h-[calc(100%-2px)] w-1 rounded-full bg-gradient-to-b from-stone-500 to-stone-400" />
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900 xs:text-xl sm:text-2xl md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mt-2">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto sm:justify-end [&_.btn-base]:min-h-[2.75rem]">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
