import { PageContainer } from '../../../components/PageContainer'
import { StatCard, StatGrid } from '../../../components/StatCard'
import { Card, CardHeader, ListRow, formatCurrency } from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function SalesAnalytics() {
  const { orders, products, reportSummary } = useApp()

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  const topProducts = products
    .map((p) => {
      const sold = orders
        .filter((o) => o.status === 'completed')
        .flatMap((o) => o.items)
        .filter((i) => i.productId === p.id)
        .reduce((sum, i) => sum + i.quantity, 0)
      return { ...p, sold }
    })
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)

  const monthlySales = orders
    .filter((o) => o.status === 'completed')
    .reduce<Record<string, number>>((acc, o) => {
      const month = new Date(o.createdAt).toLocaleString('en-PH', { month: 'short', year: 'numeric' })
      acc[month] = (acc[month] ?? 0) + o.total
      return acc
    }, {})

  return (
    <PageContainer
      title="Sales Analytics Dashboard"
      description="Monitor sales performance and business metrics. Revenue shown in Philippine Peso (₱)."
    >
      <StatGrid>
        <StatCard label="Total Revenue" value={formatCurrency(reportSummary.totalSales)} icon="money" variant="success" />
        <StatCard label="Total Orders" value={reportSummary.totalOrders} icon="orders" />
        <StatCard label="Active Users" value={reportSummary.activeUsers} icon="users" variant="info" />
        <StatCard
          label="Avg Order Value"
          value={formatCurrency(reportSummary.totalSales / (orders.filter((o) => o.status === 'completed').length || 1))}
          icon="chart"
        />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Orders by Status" />
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span className="w-24 text-sm capitalize text-slate-600">{status}</span>
                <div className="flex-1 rounded-full bg-slate-100">
                  <div
                    className="h-6 rounded-full bg-stone-500 text-right text-xs leading-6 text-white pr-2"
                    style={{ width: `${Math.max(10, (count / orders.length) * 100)}%` }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Top Selling Products" />
          <div className="space-y-2">
            {topProducts.map((p) => (
              <ListRow key={p.id}>
                <span className="text-sm font-bold text-slate-900">{p.name}</span>
                <span className="text-sm font-medium text-slate-600">{p.sold} sold</span>
              </ListRow>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Monthly Sales" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(monthlySales).map(([month, total]) => (
              <div key={month} className="rounded-lg bg-stone-50 p-4 text-center">
                <p className="text-xs text-stone-600">{month}</p>
                <p className="mt-1 text-lg font-bold text-stone-900">{formatCurrency(total)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}

