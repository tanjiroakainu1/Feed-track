import { useState } from 'react'
import { FilterBar, Input } from '../../../components/form'
import { PageContainer } from '../../../components/PageContainer'
import { Card, FilterChip, formatCurrency } from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function MonitorInventory() {
  const { products } = useApp()
  const [filter, setFilter] = useState<'all' | 'low' | 'healthy'>('all')
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const isLow = p.stock <= p.lowStockThreshold
    if (filter === 'low') return matchesSearch && isLow
    if (filter === 'healthy') return matchesSearch && !isLow
    return matchesSearch
  })

  return (
    <PageContainer title="Monitor Inventory Levels" description="Track stock status across all products">
      <FilterBar>
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:min-w-[220px] sm:flex-1"
        />
        <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          {(['all', 'low', 'healthy'] as const).map((f) => (
            <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All Items' : f === 'low' ? 'Low Stock' : 'Healthy'}
            </FilterChip>
          ))}
        </div>
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const pct = Math.min(100, (p.stock / (p.lowStockThreshold * 3)) * 100)
          const isLow = p.stock <= p.lowStockThreshold
          return (
            <Card key={p.id} padding="compact" hover>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500">{p.category}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isLow ? 'Low' : 'OK'}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Stock: <strong>{p.stock}</strong>
                  </span>
                  <span className="text-slate-500">Threshold: {p.lowStockThreshold}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full transition-all ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700">{formatCurrency(p.price)}</p>
            </Card>
          )
        })}
      </div>
    </PageContainer>
  )
}
