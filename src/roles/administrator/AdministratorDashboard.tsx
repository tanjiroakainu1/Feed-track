import { PageContainer } from '../../components/PageContainer'
import { StatCard, StatGrid } from '../../components/StatCard'
import {
  Card,
  CardHeader,
  EmptyState,
  ListRow,
  PageLink,
  QuickActionCard,
  StatusBadge,
  formatCurrency,
  formatDate,
} from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { getUnreadNotificationCount } from '../../utils/notifications'
import { buildForecasts, getCriticalForecasts } from '../../utils/forecasting'

export function AdministratorDashboard() {
  const { reportSummary, orders, products, stockMovements, getLowStockProducts, notifications, currentUser } = useApp()
  const lowStock = getLowStockProducts()
  const unreadAlerts = getUnreadNotificationCount(notifications, currentUser)
  const recentOrders = orders.slice(0, 5)
  const criticalForecasts = getCriticalForecasts(buildForecasts(products, orders, stockMovements), 3)

  return (
    <PageContainer
      title="Administrator Dashboard"
      description={`Welcome${currentUser ? `, ${currentUser.name}` : ''}. Overview of feed store operations, sales, and inventory. All amounts in Philippine Peso (₱).`}
    >
      <StatGrid>
        <StatCard label="Total Sales" value={formatCurrency(reportSummary.totalSales)} icon="💰" variant="success" />
        <StatCard label="Total Orders" value={reportSummary.totalOrders} icon="📋" />
        <StatCard label="Pending Orders" value={reportSummary.pendingOrders} icon="⏳" variant="warning" />
        <StatCard label="Low Stock Items" value={reportSummary.lowStockCount} icon="⚠️" variant="warning" />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card hover>
          <CardHeader
            title="Recent Orders"
            action={<PageLink to="/administrator/orders">View all →</PageLink>}
          />
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <EmptyState message="No orders recorded yet." icon="📋" />
            ) : (
              recentOrders.map((order) => (
                <ListRow key={order.id}>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={order.status} />
                    <p className="mt-1.5 text-sm font-bold text-slate-800">{formatCurrency(order.total)}</p>
                  </div>
                </ListRow>
              ))
            )}
          </div>
        </Card>

        <Card hover>
          <CardHeader
            title="Low Stock Alerts"
            action={<PageLink to="/administrator/low-stock">Manage →</PageLink>}
          />
          {lowStock.length === 0 ? (
            <EmptyState message="All products are adequately stocked." icon="✅" />
          ) : (
            <div className="space-y-3">
              {lowStock.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/50 px-4 py-3"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900">{product.name}</span>
                  <span className="shrink-0 rounded-lg bg-amber-100 px-2.5 py-1 text-sm font-bold text-amber-800">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
          {unreadAlerts > 0 && (
            <p className="mt-4 text-xs font-semibold text-amber-700">
              {unreadAlerts} unread notification{unreadAlerts !== 1 ? 's' : ''}
            </p>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <QuickActionCard to="/administrator/products" label="Manage Products" desc="Add, edit, or remove products" icon="📦" />
        <QuickActionCard to="/administrator/users" label="Manage Users" desc="Control user accounts and roles" icon="👥" accent="#78716c" />
        <QuickActionCard to="/administrator/reports" label="Generate Reports" desc="Export sales, inventory & forecast reports (₱)" icon="📊" accent="#44403c" />
      </div>

      {criticalForecasts.length > 0 && (
        <Card hover className="mt-6 border-amber-200">
          <CardHeader title="Forecast Alerts" subtitle="Items flagged by demand forecasting engine" />
          <div className="space-y-2">
            {criticalForecasts.map((f) => (
              <ListRow key={f.productId} className="border-amber-200 bg-amber-50/50">
                <div>
                  <p className="text-sm font-bold text-slate-900">{f.productName}</p>
                  <p className="text-xs text-slate-500">
                    {f.daysRemaining} days left · {f.stockoutRisk}% stockout risk
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge status={f.status} />
                  <p className="mt-1 text-sm font-bold text-slate-800">{formatCurrency(f.estimatedReorderCost)}</p>
                </div>
              </ListRow>
            ))}
          </div>
        </Card>
      )}
    </PageContainer>
  )
}
