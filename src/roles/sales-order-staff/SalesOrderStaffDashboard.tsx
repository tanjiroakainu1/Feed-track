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
import { getUnreadNotificationCount } from '../../utils/notifications'

export function SalesOrderStaffDashboard() {
  const { orders, notifications, currentUser } = useApp()
  const pending = orders.filter((o) => o.status === 'pending')
  const processing = orders.filter((o) => o.status === 'processing')
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === new Date().toDateString(),
  )
  const unread = getUnreadNotificationCount(notifications, currentUser)

  return (
    <PageContainer
      title="Sales / Order Staff Dashboard"
      description={`Welcome${currentUser ? `, ${currentUser.name}` : ''}. Overview of feed supply orders requiring attention. Amounts in ₱.`}
    >
      <StatGrid>
        <StatCard label="Pending Orders" value={pending.length} icon="clock" variant="warning" />
        <StatCard label="Processing" value={processing.length} icon="refresh" variant="info" />
        <StatCard label="Today's Orders" value={todayOrders.length} icon="clock" />
        <StatCard label="New Notifications" value={unread} icon="bell" variant={unread > 0 ? 'warning' : 'default'} />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card hover>
          <CardHeader
            title="Pending Review"
            action={<PageLink to="/sales-order-staff/review" accent="amber">Review all →</PageLink>}
          />
          {pending.length === 0 ? (
            <EmptyState message="No pending orders." icon="check" />
          ) : (
            <div className="space-y-3">
              {pending.slice(0, 5).map((o) => (
                <ListRow key={o.id}>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{o.customerName}</p>
                    <p className="text-xs text-slate-500">#{o.id}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={o.status} />
                    <p className="mt-1.5 text-sm font-bold text-slate-800">{formatCurrency(o.total)}</p>
                  </div>
                </ListRow>
              ))}
            </div>
          )}
        </Card>

        <Card hover>
          <CardHeader
            title="Recent Activity"
            action={<PageLink to="/sales-order-staff/process" accent="amber">Process →</PageLink>}
          />
          <div className="space-y-3">
            {orders.length === 0 ? (
              <EmptyState message="No order activity yet." icon="orders" />
            ) : (
              orders.slice(0, 5).map((o) => (
                <ListRow key={o.id}>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{o.customerName}</p>
                    <p className="text-xs text-slate-400">{formatDate(o.updatedAt)}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </ListRow>
              ))
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
