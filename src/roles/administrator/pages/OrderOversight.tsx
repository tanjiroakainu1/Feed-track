import { PageContainer } from '../../../components/PageContainer'
import {
  ActionButton,
  ButtonGroup,
  EmptyState,
  OrderCard,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function OrderOversight() {
  const { orders, approveOrder, rejectOrder, processOrder, completeOrder } = useApp()

  return (
    <PageContainer title="Order Oversight" description="Approve and oversee all customer orders">
      {orders.length === 0 ? (
        <EmptyState message="No orders to display." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actions={
                <ButtonGroup>
                  {order.status === 'pending' && (
                    <>
                      <ActionButton variant="success" size="sm" onClick={() => approveOrder(order.id)}>
                        Approve
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        size="sm"
                        onClick={() => rejectOrder(order.id, 'Insufficient stock')}
                      >
                        Reject
                      </ActionButton>
                    </>
                  )}
                  {order.status === 'approved' && (
                    <ActionButton variant="primary" size="sm" onClick={() => processOrder(order.id)}>
                      Process
                    </ActionButton>
                  )}
                  {order.status === 'processing' && (
                    <ActionButton variant="success" size="sm" onClick={() => completeOrder(order.id)}>
                      Complete
                    </ActionButton>
                  )}
                </ButtonGroup>
              }
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
