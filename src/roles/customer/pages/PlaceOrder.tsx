import { useState } from 'react'
import { PageContainer } from '../../../components/PageContainer'
import {
  ActionButton,
  AlertBanner,
  Card,
  CardHeader,
  QtyControl,
  formatCurrency,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function PlaceOrder() {
  const { products, placeOrder, currentUser } = useApp()
  const [cart, setCart] = useState<Record<string, number>>({})
  const [message, setMessage] = useState('')

  const available = products.filter((p) => p.stock > 0)

  const updateQty = (productId: string, qty: number) => {
    const product = products.find((p) => p.id === productId)!
    const clamped = Math.max(0, Math.min(qty, product.stock))
    setCart((prev) => {
      const next = { ...prev }
      if (clamped === 0) delete next[productId]
      else next[productId] = clamped
      return next
    })
  }

  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find((p) => p.id === productId)!
    return { product, quantity }
  })

  const total = cartItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)
  const itemCount = cartItems.reduce((sum, { quantity }) => sum + quantity, 0)

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      setMessage('Add at least one product to your order.')
      return
    }
    placeOrder(
      currentUser?.name ?? 'Customer',
      currentUser?.email ?? '',
      cartItems.map(({ product, quantity }) => ({ productId: product.id, quantity })),
    )
    setCart({})
    setMessage('Order placed successfully! You will receive updates on your order status.')
  }

  const isSuccess = message.includes('success')

  return (
    <PageContainer title="Place Online Order" description="Select products and submit your order">
      {message && <AlertBanner message={message} variant={isSuccess ? 'success' : 'info'} />}

      <div className={`grid gap-6 lg:grid-cols-3 lg:items-start ${cartItems.length > 0 ? 'mobile-dock' : ''}`}>
        <div className="space-y-3 lg:col-span-2">
          {available.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-500">No products available at the moment.</p>
            </Card>
          ) : (
            available.map((p) => (
              <Card key={p.id} padding="compact">
                <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900">{p.name}</h3>
                    <p className="text-sm text-slate-500">
                      {formatCurrency(p.price)} · {p.stock} in stock
                    </p>
                  </div>
                  <QtyControl
                    value={cart[p.id] ?? 0}
                    onDecrease={() => updateQty(p.id, (cart[p.id] ?? 0) - 1)}
                    onIncrease={() => updateQty(p.id, (cart[p.id] ?? 0) + 1)}
                  />
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="sticky-panel hidden lg:block">
          <Card>
            <CardHeader title="Order Summary" />
            {cartItems.length === 0 ? (
              <p className="text-sm text-slate-500">Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-2">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between gap-2 text-sm">
                      <span className="min-w-0 break-words">
                        {quantity}x {product.name}
                      </span>
                      <span className="shrink-0 font-medium">{formatCurrency(product.price * quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-base font-bold sm:text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <ActionButton onClick={handlePlaceOrder} variant="primary" fullWidth>
                    Place Order
                  </ActionButton>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="fixed-dock lg:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cart</p>
              <p className="truncate text-sm font-bold text-slate-900">
                {itemCount} item{itemCount === 1 ? '' : 's'} · {formatCurrency(total)}
              </p>
            </div>
            <ActionButton onClick={handlePlaceOrder} variant="primary" className="shrink-0">
              Place Order
            </ActionButton>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
