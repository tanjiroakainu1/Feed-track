import { useState } from 'react'
import { FormField, Select } from '../../../components/form'
import { PageContainer } from '../../../components/PageContainer'
import {
  AlertBanner,
  Card,
  CardHeader,
  EmptyState,
  StatusBadge,
  formatCurrency,
  formatDate,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

const statusSteps = ['pending', 'approved', 'processing', 'completed']

export function TrackOrder() {
  const { getCustomerOrders, currentUser } = useApp()
  const myOrders = getCustomerOrders(currentUser?.email ?? '')
  const [trackingId, setTrackingId] = useState(myOrders[0]?.id ?? '')

  const order = myOrders.find((o) => o.id === trackingId)
  const currentStep = order
    ? statusSteps.indexOf(
        order.status === 'rejected' || order.status === 'cancelled' ? 'pending' : order.status,
      )
    : -1

  return (
    <PageContainer title="Track Order Status" description="Follow your order through each stage">
      {myOrders.length === 0 ? (
        <EmptyState message="No orders to track." icon="product" />
      ) : (
        <>
          <div className="mb-6 max-w-md">
            <FormField label="Select Order">
              <Select value={trackingId} onChange={(e) => setTrackingId(e.target.value)}>
                {myOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    #{o.id} — {o.status}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          {order && (
            <Card>
              <CardHeader
                title={`Order #${order.id}`}
                subtitle={`Placed ${formatDate(order.createdAt)}`}
                action={<StatusBadge status={order.status} />}
              />

              {order.status === 'rejected' || order.status === 'cancelled' ? (
                <AlertBanner
                  message={`This order was ${order.status}.${order.notes ? ` Reason: ${order.notes}` : ''}`}
                  variant="error"
                />
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:pb-0">
                  {statusSteps.map((step, i) => (
                    <div key={step} className="flex min-w-[4.5rem] shrink-0 flex-col items-center text-center sm:min-w-0">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold sm:h-12 sm:w-12 ${
                          i <= currentStep ? 'bg-stone-600 text-white shadow-md shadow-stone-500/30' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <p
                        className={`mt-2 text-[11px] capitalize sm:text-xs ${
                          i <= currentStep ? 'font-semibold text-amber-700' : 'text-slate-400'
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 border-t border-slate-100 pt-4">
                <p className="mb-2 text-sm font-semibold text-slate-700">Items</p>
                <ul className="space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex justify-between gap-2 text-sm text-slate-600">
                      <span>
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-medium">{formatCurrency(item.unitPrice * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-base font-bold sm:text-lg">Total: {formatCurrency(order.total)}</p>
              </div>
            </Card>
          )}
        </>
      )}
    </PageContainer>
  )
}
