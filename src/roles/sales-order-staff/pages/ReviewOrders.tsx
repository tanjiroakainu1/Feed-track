import { useState } from 'react'
import { PageContainer } from '../../../components/PageContainer'
import {
  Card,
  CardHeader,
  EmptyState,
  StatusBadge,
  formatCurrency,
  formatDate,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function ReviewOrders() {
  const { orders } = useApp()
  const [selectedId, setSelectedId] = useState<string | null>(orders[0]?.id ?? null)
  const selected = orders.find((o) => o.id === selectedId)

  return (
    <PageContainer title="Review Customer Orders" description="Inspect order details before approval">
      {orders.length === 0 ? (
        <EmptyState message="No orders to review." icon="📋" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2 sm:space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedId(order.id)}
                className={`w-full min-h-[4.5rem] rounded-xl border p-4 text-left transition active:scale-[0.99] ${
                  selectedId === order.id
                    ? 'border-amber-400 bg-amber-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-amber-200 hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">#{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-600">{order.customerName}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900 sm:text-base">{formatCurrency(order.total)}</p>
                </div>
              </button>
            ))}
          </div>

          <Card className="lg:sticky lg:top-20">
            {selected ? (
              <>
                <CardHeader title={`Order #${selected.id}`} subtitle={formatDate(selected.createdAt)} />
                <div className="space-y-3 text-sm">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-slate-700">Customer:</span>{' '}
                      {selected.customerName}
                    </p>
                    <p className="break-all">
                      <span className="font-semibold text-slate-700">Email:</span>{' '}
                      {selected.customerEmail}
                    </p>
                  </div>
                  <p>
                    <span className="font-semibold text-slate-700">Status:</span>{' '}
                    <StatusBadge status={selected.status} />
                  </p>
                  <div className="border-t border-slate-100 pt-3">
                    <p className="mb-2 font-semibold text-slate-700">Items</p>
                    <ul className="space-y-1">
                      {selected.items.map((item, i) => (
                        <li key={i} className="flex justify-between gap-2 text-slate-600">
                          <span>
                            {item.quantity}x {item.productName}
                          </span>
                          <span className="font-medium">{formatCurrency(item.unitPrice * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="border-t border-slate-100 pt-3 text-lg font-bold">
                    Total: {formatCurrency(selected.total)}
                  </p>
                  {selected.notes && <p className="text-slate-500">Notes: {selected.notes}</p>}
                </div>
              </>
            ) : (
              <EmptyState message="Select an order to view details." icon="👆" />
            )}
          </Card>
        </div>
      )}
    </PageContainer>
  )
}
