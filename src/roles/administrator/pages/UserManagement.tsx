import { useState } from 'react'
import { FormField, Input, Select } from '../../../components/form'
import { PageContainer } from '../../../components/PageContainer'
import {
  ActionButton,
  Card,
  CardHeader,
  DataTable,
  EmptyState,
  StatusBadge,
  SuccessBanner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../../components/ui'
import { useApp } from '../../../context/AppContext'
import type { User, UserRole } from '../../../types'

const roles: UserRole[] = ['administrator', 'inventory-staff', 'sales-order-staff', 'customer']

export function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useApp()
  const [form, setForm] = useState({ name: '', email: '', password: 'password123', role: 'customer' as UserRole })
  const [message, setMessage] = useState('')

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setMessage('Name, email, and password are required.')
      return
    }
    addUser({ ...form, email: form.email.trim().toLowerCase(), active: true })
    setForm({ name: '', email: '', password: 'password123', role: 'customer' })
    setMessage('User account created.')
  }

  const toggleActive = (user: User) => {
    updateUser(user.id, { active: !user.active })
    setMessage(`User ${user.active ? 'deactivated' : 'activated'}.`)
  }

  return (
    <PageContainer title="User Management" description="Manage user accounts and role assignments.">
      <SuccessBanner message={message} />

      <Card className="mb-6">
        <CardHeader title="Create User Account" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <FormField label="Full Name">
            <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Email">
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Password">
            <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </FormField>
          <FormField label="Role">
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}>
              {roles.map((r) => (
                <option key={r} value={r}>{r.replace(/-/g, ' ')}</option>
              ))}
            </Select>
          </FormField>
          <div className="flex items-end">
            <ActionButton onClick={handleAdd} fullWidth>Add User</ActionButton>
          </div>
        </div>
      </Card>

      {users.length === 0 ? (
        <EmptyState message="No users found." icon="👥" />
      ) : (
        <DataTable>
          <Table>
            <TableHead>
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                  <TableHeaderCell key={h}>{h}</TableHeaderCell>
                ))}
              </tr>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-bold text-slate-900">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="capitalize">{u.role.replace(/-/g, ' ')}</TableCell>
                  <TableCell><StatusBadge status={u.active ? 'active' : 'inactive'} /></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <ActionButton size="sm" variant="secondary" onClick={() => toggleActive(u)}>
                        {u.active ? 'Deactivate' : 'Activate'}
                      </ActionButton>
                      <ActionButton size="sm" variant="danger" onClick={() => { deleteUser(u.id); setMessage('User deleted.') }}>
                        Delete
                      </ActionButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTable>
      )}
    </PageContainer>
  )
}
