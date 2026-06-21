import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { FormField, Input } from '../components/form'
import { QuickRoleAccess } from '../components/QuickRoleAccess'
import { ActionButton, AlertBanner } from '../components/ui'
import { getRolePath, useApp } from '../context/AppContext'
import type { UserRole } from '../types'

export function Login() {
  const navigate = useNavigate()
  const { login, quickLoginAsRole, isAuthenticated, currentUser, users } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && currentUser) {
    return <Navigate to={getRolePath(currentUser.role)} replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(email, password)
    setLoading(false)

    if (result.success && result.user) {
      navigate(getRolePath(result.user.role))
    } else {
      setError(result.error ?? 'Login failed.')
    }
  }

  const handleQuickAccess = (role: UserRole) => {
    setError('')
    const result = quickLoginAsRole(role)
    if (result.success) {
      navigate(getRolePath(role))
    } else {
      setError(result.error ?? 'Quick access failed.')
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage feed inventory, forecasting, and store orders."
      footer={
        <div className="mt-6 space-y-3 text-center text-sm text-slate-600">
          <p>
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700">
              Create one
            </Link>
          </p>
          <p>
            <Link to="/" className="font-semibold text-slate-500 hover:text-slate-700">
              ← Back to home
            </Link>
          </p>
        </div>
      }
      extra={<QuickRoleAccess variant="login" users={users} onSelectRole={handleQuickAccess} />}
    >
      {error && <AlertBanner message={error} variant="error" />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />
        </FormField>
        <FormField label="Password">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </FormField>
        <ActionButton type="submit" variant="primary" disabled={loading} fullWidth size="lg">
          {loading ? 'Signing in...' : 'Sign In'}
        </ActionButton>
      </form>
    </AuthLayout>
  )
}
