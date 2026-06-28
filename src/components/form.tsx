import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

const fieldClass =
  'w-full min-h-[2.75rem] rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-base sm:text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-stone-500 focus:outline-none focus:ring-4 focus:ring-stone-500/10'

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </label>
  )
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClass} ${className}`} {...props} />
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${fieldClass} capitalize ${className}`} {...props}>
      {children}
    </select>
  )
}

export function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-4">
      {children}
    </div>
  )
}
