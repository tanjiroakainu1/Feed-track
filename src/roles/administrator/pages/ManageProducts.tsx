import { useState } from 'react'
import { FormField, Input } from '../../../components/form'
import { PageContainer } from '../../../components/PageContainer'
import {
  ActionButton,
  ButtonGroup,
  Card,
  CardHeader,
  DataTable,
  EmptyState,
  SuccessBanner,
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  formatCurrency,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'
import type { Product } from '../../../types'

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  category: '',
  price: 0,
  stock: 0,
  lowStockThreshold: 5,
  description: '',
}

export function ManageProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp()
  const [form, setForm] = useState(emptyProduct)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setMessage('Product name is required.')
      return
    }
    if (editingId) {
      updateProduct(editingId, form)
      setMessage('Product updated successfully.')
    } else {
      addProduct(form)
      setMessage('Product added successfully.')
    }
    setForm(emptyProduct)
    setEditingId(null)
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      description: product.description,
    })
    setMessage('')
  }

  const handleDelete = (id: string) => {
    deleteProduct(id)
    setMessage('Product deleted.')
    if (editingId === id) {
      setEditingId(null)
      setForm(emptyProduct)
    }
  }

  return (
    <PageContainer
      title="Manage Feed Products & Inventory"
      description="Add, edit, and remove feed products from your store catalog."
    >
      <SuccessBanner message={message} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title={editingId ? 'Edit Product' : 'Add Product'} />
          <div className="space-y-4">
            <FormField label="Name">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormField>
            <FormField label="Category">
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </FormField>
            <FormField label="Price">
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </FormField>
            <FormField label="Stock">
              <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            </FormField>
            <FormField label="Low Stock Threshold">
              <Input type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })} />
            </FormField>
            <FormField label="Description">
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </FormField>
            <ButtonGroup className="pt-2">
              <ActionButton onClick={handleSubmit} fullWidth className="sm:w-auto">{editingId ? 'Update' : 'Add Product'}</ActionButton>
              {editingId && (
                <ActionButton variant="secondary" fullWidth className="sm:w-auto" onClick={() => { setEditingId(null); setForm(emptyProduct) }}>
                  Cancel
                </ActionButton>
              )}
            </ButtonGroup>
          </div>
        </Card>

        <div className="lg:col-span-2">
          {products.length === 0 ? (
            <EmptyState message="No products yet. Add your first product." icon="📦" />
          ) : (
            <DataTable>
              <Table>
                <TableHead>
                  <tr>
                    {['Product', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                      <TableHeaderCell key={h}>{h}</TableHeaderCell>
                    ))}
                  </tr>
                </TableHead>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-bold text-slate-900">{p.name}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>{formatCurrency(p.price)}</TableCell>
                      <TableCell>
                        <span className={p.stock <= p.lowStockThreshold ? 'font-bold text-amber-600' : ''}>
                          {p.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <TableActions>
                          <ActionButton size="sm" variant="secondary" fullWidth className="sm:w-auto" onClick={() => handleEdit(p)}>Edit</ActionButton>
                          <ActionButton size="sm" variant="danger" fullWidth className="sm:w-auto" onClick={() => handleDelete(p.id)}>Delete</ActionButton>
                        </TableActions>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DataTable>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
