import { useState } from 'react'
import { PageContainer } from '../../../components/PageContainer'
import {
  ActionButton,
  ButtonGroup,
  EmptyState,
  OrderCard,
  SuccessBanner,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function ProcessOrders() {
  const { orders, processOrder, completeOrder } = useApp()
  const processable = orders.filter((o) => o.status === 'approved' || o.status === 'processing')
  const [message, setMessage] = useState('')

  return (
    <PageContainer title="Process Completed Orders" description="Fulfill approved orders and mark as complete">
      <SuccessBanner message={message} />

      {processable.length === 0 ? (
        <EmptyState message="No orders ready for processing." icon="product" />
      ) : (
        <div className="space-y-4">
          {processable.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actions={
                <ButtonGroup>
                  {order.status === 'approved' && (
                    <ActionButton
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        processOrder(order.id)
                        setMessage(`Order #${order.id} is now processing. Stock deducted.`)
                      }}
                    >
                      Start Processing
                    </ActionButton>
                  )}
                  {order.status === 'processing' && (
                    <ActionButton
                      variant="success"
                      size="sm"
                      onClick={() => {
                        completeOrder(order.id)
                        setMessage(`Order #${order.id} marked as completed.`)
                      }}
                    >
                      Mark Complete
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
