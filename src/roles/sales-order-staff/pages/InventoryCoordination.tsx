import { useState } from 'react'
import { PageContainer } from '../../../components/PageContainer'
import {
  ActionButton,
  Card,
  CardHeader,
  EmptyState,
  ListRow,
  SuccessBanner,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function InventoryCoordination() {
  const { orders, products, getLowStockProducts, addNotification, currentUser } = useApp()
  const [message, setMessage] = useState('')
  const activeOrders = orders.filter((o) => ['pending', 'approved', 'processing'].includes(o.status))
  const lowStock = getLowStockProducts()

  const stockChecks = activeOrders.flatMap((order) =>
    order.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)
      const available = product?.stock ?? 0
      const sufficient = available >= item.quantity
      return {
        orderId: order.id,
        productName: item.productName,
        required: item.quantity,
        available,
        sufficient,
      }
    }),
  )

  const handleNotifyInventory = (productName: string) => {
    addNotification({
      title: 'Restock Request',
      message: `${currentUser?.name ?? 'Sales Staff'} requested restock for ${productName}`,
      type: 'warning',
      targetRole: 'inventory-staff',
    })
    setMessage(`Inventory staff notified about ${productName}.`)
  }

  return (
    <PageContainer title="Inventory Coordination" description="Coordinate with inventory staff on stock availability">
      <SuccessBanner message={message} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Stock Availability for Active Orders" />
          {stockChecks.length === 0 ? (
            <EmptyState message="No active orders require stock checks." icon="check" />
          ) : (
            <div className="space-y-3">
              {stockChecks.map((check, i) => (
                <ListRow
                  key={i}
                  className={check.sufficient ? 'border-stone-200 bg-stone-50/80' : 'border-red-200 bg-red-50/80'}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold">Order #{check.orderId}</span>
                      <span
                        className={`text-xs font-bold ${check.sufficient ? 'text-stone-700' : 'text-red-700'}`}
                      >
                        {check.sufficient ? 'Stock OK' : 'Insufficient'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700">{check.productName}</p>
                    <p className="text-xs text-slate-500">
                      Need: {check.required} · Available: {check.available}
                    </p>
                  </div>
                </ListRow>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Low Stock Items Affecting Orders" />
          {lowStock.length === 0 ? (
            <EmptyState message="No low stock concerns." icon="check" />
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <ListRow key={p.id} className="border-amber-200 bg-amber-50/80">
                  <div>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-sm text-amber-700">{p.stock} units available</p>
                  </div>
                  <ActionButton size="sm" variant="warning" onClick={() => handleNotifyInventory(p.name)}>
                    Notify Staff
                  </ActionButton>
                </ListRow>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  )
}
