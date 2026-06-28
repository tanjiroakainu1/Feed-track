import { PageContainer } from '../../components/PageContainer'
import { StatCard, StatGrid } from '../../components/StatCard'
import {
  Card,
  CardHeader,
  EmptyState,
  ListRow,
  PageLink,
  StatusBadge,
  formatCurrency,
  formatDate,
} from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { buildForecasts, getCriticalForecasts } from '../../utils/forecasting'

export function InventoryStaffDashboard() {
  const { products, orders, stockMovements, getLowStockProducts, currentUser } = useApp()
  const lowStock = getLowStockProducts()
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const recentMovements = stockMovements.slice(0, 5)
  const forecasts = buildForecasts(products, orders, stockMovements)
  const criticalForecasts = getCriticalForecasts(forecasts, 4)

  return (
    <PageContainer
      title="Inventory Staff Dashboard"
      description={`Welcome${currentUser ? `, ${currentUser.name}` : ''}. Overview of feed stock levels, forecasting, and warehouse activity. All amounts in Philippine Peso (₱).`}
    >
      <StatGrid>
        <StatCard label="Total Products" value={products.length} icon="📦" />
        <StatCard label="Total Stock Units" value={totalStock} icon="📊" variant="info" />
        <StatCard label="Low Stock Items" value={lowStock.length} icon="⚠️" variant="warning" />
        <StatCard
          label="Forecast Alerts"
          value={forecasts.filter((f) => f.status !== 'good').length}
          icon="🔮"
          variant={criticalForecasts.length > 0 ? 'warning' : 'default'}
        />
      </StatGrid>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card hover>
          <CardHeader
            title="Forecast Priority"
            action={<PageLink to="/inventory-staff/forecasting" accent="stone">Full forecast →</PageLink>}
          />
          {criticalForecasts.length === 0 ? (
            <EmptyState message="No urgent reorder forecasts at this time." icon="✅" />
          ) : (
            <div className="space-y-2">
              {criticalForecasts.map((f) => (
                <ListRow key={f.productId} className={f.status === 'critical' ? 'border-rose-200 bg-rose-50/50' : 'border-amber-200 bg-amber-50/50'}>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{f.productName}</p>
                      <StatusBadge status={f.status} />
                    </div>
                    <p className="text-xs text-slate-500">
                      {f.daysRemaining}d left · Reorder {f.suggestedReorderQty} units
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-slate-800">{formatCurrency(f.estimatedReorderCost)}</p>
                </ListRow>
              ))}
            </div>
          )}
        </Card>

        <Card hover>
          <CardHeader
            title="Items Needing Attention"
            action={<PageLink to="/inventory-staff/alerts" accent="stone">View alerts →</PageLink>}
          />
          {lowStock.length === 0 ? (
            <EmptyState message="All stock levels are healthy." icon="✅" />
          ) : (
            <div className="space-y-2">
              {lowStock.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/50 px-4 py-3"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900">{p.name}</span>
                  <span className="shrink-0 text-sm font-bold text-amber-800">
                    {p.stock} / {p.lowStockThreshold}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card hover>
        <CardHeader
          title="Recent Movements"
          action={<PageLink to="/inventory-staff/record" accent="stone">Record →</PageLink>}
        />
        <div className="space-y-2">
          {recentMovements.length === 0 ? (
            <EmptyState message="No stock movements recorded yet." icon="🔄" />
          ) : (
            recentMovements.map((m) => (
              <ListRow key={m.id}>
                <div>
                  <p className="text-sm font-bold text-slate-900">{m.productName}</p>
                  <p className="text-xs text-slate-500">{m.reason}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-bold ${m.type === 'incoming' ? 'text-stone-600' : 'text-rose-600'}`}
                  >
                    {m.type === 'incoming' ? '+' : '-'}
                    {m.quantity}
                  </span>
                  <p className="text-xs text-slate-400">{formatDate(m.recordedAt)}</p>
                </div>
              </ListRow>
            ))
          )}
        </div>
      </Card>
    </PageContainer>
  )
}
