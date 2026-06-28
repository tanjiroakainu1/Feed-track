import { useState } from 'react'
import { FilterBar, Input, Select } from '../../../components/form'
import { PageContainer } from '../../../components/PageContainer'
import { Card, EmptyState, formatCurrency } from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function BrowseProducts() {
  const { products } = useApp()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const categories = ['all', ...new Set(products.map((p) => p.category))]

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'all' || p.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <PageContainer title="Browse Feed Products" description="Explore our feeds supply catalog.">
      <FilterBar>
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:min-w-[220px] sm:flex-1"
        />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:min-w-[180px] sm:w-auto"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'All Categories' : c}
            </option>
          ))}
        </Select>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState message="No products match your search." icon="🔍" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} hover padding="compact">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">{p.name}</h3>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {p.category}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset sm:text-xs ${
                    p.stock > 0
                      ? 'bg-stone-50 text-stone-700 ring-stone-200/60'
                      : 'bg-rose-50 text-rose-700 ring-rose-200/60'
                  }`}
                >
                  {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{p.description}</p>
              <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4 sm:mt-5">
                <span className="text-xl font-extrabold tracking-tight text-amber-700 sm:text-2xl">
                  {formatCurrency(p.price)}
                </span>
                <span className="text-xs font-semibold text-slate-500">{p.stock} available</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
