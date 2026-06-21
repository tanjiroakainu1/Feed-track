import { useState } from 'react'
import { FormField, Input, Select } from '../../../components/form'
import { PageContainer } from '../../../components/PageContainer'
import {
  ActionButton,
  Card,
  CardHeader,
  DataTable,
  StatusBadge,
  SuccessBanner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  formatCurrency,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'
import type { OrderStatus } from '../../../types'

const statuses: OrderStatus[] = ['pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled']

export function UpdateOrderStatus() {
  const { orders, updateOrderStatus } = useApp()
  const [selectedId, setSelectedId] = useState('')
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')

  const handleUpdate = () => {
    if (!selectedId) {
      setMessage('Select an order first.')
      return
    }
    updateOrderStatus(selectedId, newStatus, notes)
    setMessage(`Order #${selectedId} status updated to ${newStatus}.`)
    setNotes('')
  }

  return (
    <PageContainer title="Update Order Status" description="Change the status of any order">
      <SuccessBanner message={message} />

      <Card className="mb-6 max-w-xl">
        <CardHeader title="Update Status" />
        <div className="space-y-4">
          <FormField label="Select Order">
            <Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              <option value="">Choose order...</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.id} — {o.customerName} ({o.status})
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="New Status">
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Notes (optional)">
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes..." />
          </FormField>
          <ActionButton onClick={handleUpdate} fullWidth className="sm:w-auto">
            Update Status
          </ActionButton>
        </div>
      </Card>

      <DataTable>
        <Table>
          <TableHead>
            <tr>
              {['Order ID', 'Customer', 'Total', 'Status'].map((h) => (
                <TableHeaderCell key={h}>{h}</TableHeaderCell>
              ))}
            </tr>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-bold">{o.id}</TableCell>
                <TableCell>{o.customerName}</TableCell>
                <TableCell>{formatCurrency(o.total)}</TableCell>
                <TableCell>
                  <StatusBadge status={o.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </PageContainer>
  )
}
