import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { RoleShell } from '../../components/RoleShell'
import { useRoleLayout } from '../../hooks/useRoleLayout'
import { ADMIN_COLOR, ADMIN_NAV } from './config'
import { AdministratorDashboard } from './AdministratorDashboard'
import { ManageProducts } from './pages/ManageProducts'
import { SalesAnalytics } from './pages/SalesAnalytics'
import { LowStockNotifications } from './pages/LowStockNotifications'
import { UserManagement } from './pages/UserManagement'
import { OrderOversight } from './pages/OrderOversight'
import { Reports } from './pages/Reports'

export function AdministratorLayout() {
  const location = useLocation()
  const { currentUser, users, handleLogout, handleQuickAccess, handleNavigate } = useRoleLayout('/administrator')

  const basePath = '/administrator'
  const currentSegment = location.pathname.replace(basePath, '').replace(/^\//, '') || 'dashboard'

  return (
    <RoleShell
      roleTitle="Administrator"
      roleSubtitle="Feed track store management"
      accentColor={ADMIN_COLOR}
      navItems={ADMIN_NAV}
      currentPath={currentSegment}
      userName={currentUser?.name}
      userEmail={currentUser?.email}
      currentRole={currentUser?.role}
      users={users}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      onQuickAccess={handleQuickAccess}
    >
      <Routes>
        <Route index element={<AdministratorDashboard />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="analytics" element={<SalesAnalytics />} />
        <Route path="low-stock" element={<LowStockNotifications />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="orders" element={<OrderOversight />} />
        <Route path="reports" element={<Reports />} />
        <Route path="*" element={<Navigate to={basePath} replace />} />
      </Routes>
    </RoleShell>
  )
}
