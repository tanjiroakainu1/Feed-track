import { useNavigate } from 'react-router-dom'
import { getRolePath, useApp } from '../context/AppContext'
import type { UserRole } from '../types'

export function useRoleLayout(basePath: string) {
  const navigate = useNavigate()
  const { currentUser, logout, quickLoginAsRole, users } = useApp()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleQuickAccess = (role: UserRole) => {
    const result = quickLoginAsRole(role)
    if (result.success) {
      navigate(getRolePath(role))
    }
  }

  const handleNavigate = (path: string) => {
    navigate(path === 'dashboard' ? basePath : `${basePath}/${path}`)
  }

  return {
    currentUser,
    users,
    handleLogout,
    handleQuickAccess,
    handleNavigate,
  }
}
