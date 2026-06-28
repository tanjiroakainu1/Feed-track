import { useState } from 'react'
import { FormField, Input, Select } from '../../../components/form'
import { PageContainer } from '../../../components/PageContainer'
import {
  ActionButton,
  ButtonGroup,
  Card,
  CardHeader,
  FilterChip,
  ListRow,
  SuccessBanner,
  formatDate,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'

export function RecordInOut() {
  const { products, stockMovements, updateStock, currentUser } = useApp()
  const [form, setForm] = useState({
    productId: products[0]?.id ?? '',
    type: 'incoming' as 'incoming' | 'outgoing',
    quantity: 0,
    reason: '',
  })
  const [message, setMessage] = useState('')

  const handleRecord = () => {
    if (!form.productId || form.quantity <= 0 || !form.reason.trim()) {
      setMessage('Fill in all fields with valid values.')
      return
    }
    const product = products.find((p) => p.id === form.productId)!
    const delta = form.type === 'incoming' ? form.quantity : -form.quantity
    updateStock(form.productId, delta, form.reason, currentUser?.name ?? 'Inventory Staff')
    setMessage(`${form.type === 'incoming' ? 'Incoming' : 'Outgoing'} record saved for ${product.name}.`)
    setForm({ ...form, quantity: 0, reason: '' })
  }

  return (
    <PageContainer title="Record Incoming & Outgoing Products" description="Log stock movements and transfers">
      <SuccessBanner message={message} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="New Movement Record" />
          <div className="space-y-4">
            <FormField label="Product">
              <Select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Type">
              <ButtonGroup className="w-full">
                {(['incoming', 'outgoing'] as const).map((t) => (
                  <FilterChip
                    key={t}
                    active={form.type === t}
                    onClick={() => setForm({ ...form, type: t })}
                    className={
                      form.type === t && t === 'outgoing'
                        ? '!bg-gradient-to-r !from-rose-600 !to-red-600 !text-white !shadow-rose-500/30'
                        : form.type === t
                          ? '!bg-gradient-to-r !from-stone-600 !to-stone-700 !text-white !shadow-stone-500/30'
                          : ''
                    }
                  >
                    {t}
                  </FilterChip>
                ))}
              </ButtonGroup>
            </FormField>
            <FormField label="Quantity">
              <Input
                type="number"
                min={1}
                value={form.quantity || ''}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              />
            </FormField>
            <FormField label="Reason">
              <Input
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Supplier delivery, order fulfillment, etc."
              />
            </FormField>
              <ActionButton onClick={handleRecord} fullWidth className="sm:w-auto" size="lg">
                Save Record
              </ActionButton>
          </div>
        </Card>

        <Card>
          <CardHeader title="Movement History" />
          <div className="max-h-[28rem] space-y-2 overflow-y-auto sm:space-y-3">
            {stockMovements.length === 0 ? (
              <p className="text-sm text-slate-500">No movements recorded yet.</p>
            ) : (
              stockMovements.map((m) => (
                <ListRow key={m.id}>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">{m.productName}</p>
                    <p className="truncate text-xs text-slate-500">{m.reason}</p>
                    <p className="text-xs text-slate-400">
                      {m.recordedBy} · {formatDate(m.recordedAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-bold ${m.type === 'incoming' ? 'text-stone-600' : 'text-red-600'}`}
                  >
                    {m.type === 'incoming' ? '+' : '-'}
                    {m.quantity}
                  </span>
                </ListRow>
              ))
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
