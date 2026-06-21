import { PageContainer } from '../../../components/PageContainer'
import { ActionButton, EmptyState, ListRow, formatDate } from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function OrderUpdates() {
  const { getUserNotifications, markNotificationRead } = useApp()
  const updates = getUserNotifications()

  const typeStyles: Record<string, string> = {
    info: 'border-yellow-200 bg-yellow-50',
    success: 'border-emerald-200 bg-emerald-50',
    warning: 'border-amber-200 bg-amber-50',
    error: 'border-red-200 bg-red-50',
  }

  return (
    <PageContainer title="Order Updates" description="Notifications about your orders">
      {updates.length === 0 ? (
        <EmptyState message="No order updates at this time." icon="🔔" />
      ) : (
        <div className="space-y-3">
          {updates.map((n) => (
            <ListRow
              key={n.id}
              className={`${typeStyles[n.type]} ${n.read ? 'opacity-70' : ''}`}
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
    </PageContainer>
  )
}
