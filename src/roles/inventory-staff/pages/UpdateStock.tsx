import { useState } from 'react'
import { FormField, Input, Select } from '../../../components/form'
import { PageContainer } from '../../../components/PageContainer'
import {
  ActionButton,
  ButtonGroup,
  Card,
  CardHeader,
  ListRow,
  SuccessBanner,
  formatCurrency,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function UpdateStock() {
  const { products, updateStock, currentUser } = useApp()
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [quantity, setQuantity] = useState(0)
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')

  const selected = products.find((p) => p.id === productId)

  const handleUpdate = (direction: 'add' | 'remove') => {
    if (!productId || quantity <= 0) {
      setMessage('Select a product and enter a valid quantity.')
      return
    }
    const delta = direction === 'add' ? quantity : -quantity
    updateStock(
      productId,
      delta,
      reason || `${direction === 'add' ? 'Stock added' : 'Stock removed'}`,
      currentUser?.name ?? 'Inventory Staff',
    )
    setMessage(`Stock ${direction === 'add' ? 'increased' : 'decreased'} by ${quantity} units.`)
    setQuantity(0)
    setReason('')
  }

  return (
    <PageContainer title="Update Stock Quantities" description="Adjust product stock levels">
      <SuccessBanner message={message} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Stock Adjustment" />
          <div className="space-y-4">
            <FormField label="Product">
              <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Current: {p.stock})
                  </option>
                ))}
              </Select>
            </FormField>
            {selected && (
              <div className="rounded-xl bg-slate-50 p-4 text-sm">
                <p>
                  <strong>Current Stock:</strong> {selected.stock}
                </p>
                <p>
                  <strong>Threshold:</strong> {selected.lowStockThreshold}
                </p>
                <p>
                  <strong>Price:</strong> {formatCurrency(selected.price)}
                </p>
              </div>
            )}
            <FormField label="Quantity">
              <Input
                type="number"
                min={1}
                value={quantity || ''}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </FormField>
            <FormField label="Reason">
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Supplier delivery"
              />
            </FormField>
            <ButtonGroup>
              <ActionButton variant="success" onClick={() => handleUpdate('add')}>
                Add Stock
              </ActionButton>
              <ActionButton variant="danger" onClick={() => handleUpdate('remove')}>
                Remove Stock
              </ActionButton>
            </ButtonGroup>
          </div>
        </Card>

        <Card>
          <CardHeader title="All Products" />
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {products.map((p) => (
              <ListRow key={p.id} stackOnMobile={false}>
                <span className="truncate text-sm font-bold">{p.name}</span>
                <span
                  className={`shrink-0 text-sm font-bold ${p.stock <= p.lowStockThreshold ? 'text-amber-600' : 'text-slate-700'}`}
                >
                  {p.stock} units
                </span>
              </ListRow>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
