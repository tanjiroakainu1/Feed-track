import { PageContainer } from '../../../components/PageContainer'
import { ActionButton, Card, CardHeader, EmptyState, ListRow } from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function LowStockAlerts() {
  const { getLowStockProducts, getUserNotifications, markNotificationRead, updateStock, currentUser } =
    useApp()
  const lowStock = getLowStockProducts()
  const alerts = getUserNotifications().filter((n) => n.type === 'warning')

  const handleRestock = (productId: string, productName: string) => {
    updateStock(productId, 20, `Emergency restock for ${productName}`, currentUser?.name ?? 'Inventory Staff')
  }

  return (
    <PageContainer title="Low Stock Alerts" description="Respond to inventory alerts and restock items">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <CardHeader title="Active Alerts" />
          {lowStock.length === 0 ? (
            <EmptyState message="No active low stock alerts." icon="check" />
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <ListRow key={p.id} className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/50">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-sm text-amber-700">
                      {p.stock} units remaining (threshold: {p.lowStockThreshold})
                    </p>
                  </div>
                  <ActionButton variant="success" size="sm" onClick={() => handleRestock(p.id, p.name)}>
                    Restock +20
                  </ActionButton>
                </ListRow>
              ))}
            </div>
          )}
        </div>

        <div>
          <CardHeader title="Alert Notifications" />
          {alerts.length === 0 ? (
            <EmptyState message="No notifications." icon="bell" />
          ) : (
            <div className="space-y-3">
              {alerts.map((n) => (
                <Card
                  key={n.id}
                  padding="compact"
                  className={n.read ? '' : 'border-amber-300 bg-amber-50'}
                >
                  <p className="font-bold text-slate-900">{n.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                  {!n.read && (
                    <div className="mt-3">
                      <ActionButton size="sm" variant="secondary" onClick={() => markNotificationRead(n.id)}>
                        Dismiss
                      </ActionButton>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
