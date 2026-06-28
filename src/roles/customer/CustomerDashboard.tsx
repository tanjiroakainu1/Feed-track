import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer'
import { StatCard, StatGrid } from '../../components/StatCard'
import {
  ActionButton,
  ButtonGroup,
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

export function CustomerDashboard() {
  const navigate = useNavigate()
  const { products, getCustomerOrders, currentUser, notifications } = useApp()
  const myOrders = getCustomerOrders(currentUser?.email ?? '')
  const activeOrders = myOrders.filter(
    (o) => !['completed', 'rejected', 'cancelled'].includes(o.status),
  )
  const unread = getUnreadNotificationCount(notifications, currentUser)

  return (
    <PageContainer
      title="Customer Dashboard"
      description={`Welcome back${currentUser ? `, ${currentUser.name}` : ''}! Browse feed products and manage your orders. Prices in Philippine Peso (₱).`}
    >
      <StatGrid>
        <StatCard label="Available Products" value={products.length} icon="🛍️" variant="info" />
        <StatCard label="My Orders" value={myOrders.length} icon="📦" />
        <StatCard label="Active Orders" value={activeOrders.length} icon="🚚" variant="info" />
        <StatCard label="Notifications" value={unread} icon="🔔" variant={unread > 0 ? 'warning' : 'default'} />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card hover>
          <CardHeader
            title="Recent Orders"
            action={<PageLink to="/customer/history" accent="slate">View history →</PageLink>}
          />
          {myOrders.length === 0 ? (
            <EmptyState message="No orders yet. Start shopping!" icon="🛒" />
          ) : (
            <div className="space-y-3">
              {myOrders.slice(0, 4).map((o) => (
                <ListRow key={o.id}>
                  <div>
                    <p className="text-sm font-bold text-slate-900">#{o.id}</p>
                    <p className="text-xs text-slate-400">{formatDate(o.createdAt)}</p>
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
            title="Featured Products"
            action={<PageLink to="/customer/browse" accent="slate">Browse all →</PageLink>}
          />
          <div className="space-y-3">
            {products.slice(0, 4).map((p) => (
              <ListRow key={p.id}>
                <div>
                  <p className="text-sm font-bold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.category}</p>
                </div>
                <p className="text-sm font-bold text-amber-700">{formatCurrency(p.price)}</p>
              </ListRow>
            ))}
          </div>
        </Card>
      </div>

      <ButtonGroup className="mt-6 sm:mt-8">
        <ActionButton variant="primary" onClick={() => navigate('/customer/browse')}>
          Browse Products
        </ActionButton>
        <ActionButton variant="secondary" onClick={() => navigate('/customer/place-order')}>
          Place New Order
        </ActionButton>
      </ButtonGroup>
    </PageContainer>
  )
}
