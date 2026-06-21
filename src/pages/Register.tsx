import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { FormField, Input, Select } from '../components/form'
import { ActionButton, AlertBanner } from '../components/ui'
import { ROLE_CONFIG } from '../config/roles'
import { getRolePath, useApp } from '../context/AppContext'
import type { UserRole } from '../types'

export function Register() {
  const navigate = useNavigate()
  const { register, isAuthenticated, currentUser } = useApp()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as UserRole,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && currentUser) {
    return <Navigate to={getRolePath(currentUser.role)} replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const result = register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    })
    setLoading(false)

    if (result.success && result.user) {
      navigate(getRolePath(result.user.role))
    } else {
      setError(result.error ?? 'Registration failed.')
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Feed track and access your role-based feed supply dashboard."
      footer={
        <div className="mt-6 space-y-3 text-center text-sm text-slate-600">
          <p>
            Already registered?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
              Sign in
            </Link>
          </p>
          <p>
            <Link to="/" className="font-semibold text-slate-500 hover:text-slate-700">
              ← Back to home
            </Link>
          </p>
        </div>
      }
    >
      {error && <AlertBanner message={error} variant="error" />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Full Name">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </FormField>
        <FormField label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@company.com"
            required
          />
        </FormField>
        <FormField label="Role">
          <Select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
          >
            {ROLE_CONFIG.map((r) => (
              <option key={r.role} value={r.role}>
                {r.title}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Password">
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Minimum 6 characters"
            required
            minLength={6}
          />
        </FormField>
        <FormField label="Confirm Password">
          <Input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Re-enter password"
            required
          />
        </FormField>
        <ActionButton type="submit" variant="primary" disabled={loading} fullWidth size="lg">
          {loading ? 'Creating account...' : 'Create Account'}
        </ActionButton>
      </form>
    </AuthLayout>
  )
}
