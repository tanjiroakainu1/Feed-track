import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getRolePath } from '../config/roles'
import type { UserRole } from '../types'
import { Home } from '../pages/Home'

interface ProtectedRouteProps {
  role: UserRole
  children: React.ReactNode
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { currentUser, isAuthenticated } = useApp()

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />
  }

  if (currentUser.role !== role) {
    return <Navigate to={getRolePath(currentUser.role)} replace />
  }

  if (!currentUser.active) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function HomeRedirect() {
  const { currentUser, isAuthenticated } = useApp()

  if (isAuthenticated && currentUser) {
    return <Navigate to={getRolePath(currentUser.role)} replace />
  }

  return <Home />
}
