import { PageContainer } from '../../../components/PageContainer'
import { EmptyState, OrderCard, formatDate } from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function OrderHistory() {
  const { getCustomerOrders, currentUser } = useApp()
  const myOrders = getCustomerOrders(currentUser?.email ?? '')

  return (
    <PageContainer title="Order History" description="View all your past and current orders">
      {myOrders.length === 0 ? (
        <EmptyState message="You haven't placed any orders yet." icon="cart" />
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={{
                ...order,
                notes: order.notes
                  ? `${order.notes} · Updated ${formatDate(order.updatedAt)}`
                  : `Updated ${formatDate(order.updatedAt)}`,
              }}
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
