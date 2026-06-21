import { useState } from 'react'
import { FormField, Input } from '../../../components/form'
import { PageContainer } from '../../../components/PageContainer'
import {
  ActionButton,
  ButtonGroup,
  EmptyState,
  OrderCard,
  SuccessBanner,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function ApproveRejectOrders() {
  const { orders, approveOrder, rejectOrder } = useApp()
  const pending = orders.filter((o) => o.status === 'pending')
  const [rejectReason, setRejectReason] = useState('')
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const handleApprove = (orderId: string) => {
    approveOrder(orderId)
    setMessage(`Order #${orderId} approved.`)
  }

  const handleReject = (orderId: string) => {
    rejectOrder(orderId, rejectReason || 'Order rejected by sales staff')
    setMessage(`Order #${orderId} rejected.`)
    setRejectingId(null)
    setRejectReason('')
  }

  return (
    <PageContainer title="Approve or Reject Orders" description="Make decisions on pending customer orders">
      <SuccessBanner message={message} />

      {pending.length === 0 ? (
        <EmptyState message="No pending orders to approve or reject." icon="✅" />
      ) : (
        <div className="space-y-4">
          {pending.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actions={
                <>
                  <ButtonGroup>
                    <ActionButton variant="success" size="sm" onClick={() => handleApprove(order.id)}>
                      Approve
                    </ActionButton>
                    <ActionButton variant="danger" size="sm" onClick={() => setRejectingId(order.id)}>
                      Reject
                    </ActionButton>
                  </ButtonGroup>
                  {rejectingId === order.id && (
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <FormField label="Rejection reason">
                        <Input
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Reason for rejection..."
                        />
                      </FormField>
                      <div className="flex shrink-0 flex-wrap gap-2 sm:items-end">
                        <ActionButton variant="danger" size="sm" onClick={() => handleReject(order.id)}>
                          Confirm Reject
                        </ActionButton>
                        <ActionButton variant="secondary" size="sm" onClick={() => setRejectingId(null)}>
                          Cancel
                        </ActionButton>
                      </div>
                    </div>
                  )}
                </>
              }
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
