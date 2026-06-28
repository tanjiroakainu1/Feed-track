import { PageContainer } from '../../../components/PageContainer'
import { ActionButton, Card, CardHeader, EmptyState, ListRow, formatDate } from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function LowStockNotifications() {
  const { getLowStockProducts, getUserNotifications, markNotificationRead } = useApp()
  const lowStock = getLowStockProducts()
  const alerts = getUserNotifications().filter((n) => n.type === 'warning')

  return (
    <PageContainer
      title="Low Stock Notifications"
      description="Monitor and respond to inventory alerts"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Products Below Threshold" />
          {lowStock.length === 0 ? (
            <EmptyState message="No low stock items at this time." icon="check" />
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <ListRow key={p.id} className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/50">
                  <div>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">Threshold: {p.lowStockThreshold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-amber-700 sm:text-2xl">{p.stock}</p>
                    <p className="text-xs font-semibold text-amber-600">units left</p>
                  </div>
                </ListRow>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Notification History" />
          {alerts.length === 0 ? (
            <EmptyState message="No alerts recorded." icon="bell" />
          ) : (
            <div className="space-y-3">
              {alerts.map((n) => (
                <ListRow
                  key={n.id}
                  className={n.read ? '' : 'border-amber-300 bg-amber-50'}
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">{n.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDate(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <ActionButton size="sm" variant="secondary" onClick={() => markNotificationRead(n.id)}>
                      Mark Read
                    </ActionButton>
                  )}
                </ListRow>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  )
}
