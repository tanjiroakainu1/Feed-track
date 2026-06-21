import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { RoleShell } from '../../components/RoleShell'
import { useRoleLayout } from '../../hooks/useRoleLayout'
import { CUSTOMER_COLOR, CUSTOMER_NAV } from './config'
import { CustomerDashboard } from './CustomerDashboard'
import { BrowseProducts } from './pages/BrowseProducts'
import { PlaceOrder } from './pages/PlaceOrder'
import { TrackOrder } from './pages/TrackOrder'
import { OrderHistory } from './pages/OrderHistory'
import { OrderUpdates } from './pages/OrderUpdates'

export function CustomerLayout() {
  const location = useLocation()
  const { currentUser, users, handleLogout, handleQuickAccess, handleNavigate } = useRoleLayout('/customer')

  const basePath = '/customer'
  const currentSegment = location.pathname.replace(basePath, '').replace(/^\//, '') || 'dashboard'

  return (
    <RoleShell
      roleTitle="Customer"
      roleSubtitle="Feed supply ordering portal"
      accentColor={CUSTOMER_COLOR}
      navItems={CUSTOMER_NAV}
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
        <Route index element={<CustomerDashboard />} />
        <Route path="browse" element={<BrowseProducts />} />
        <Route path="place-order" element={<PlaceOrder />} />
        <Route path="track" element={<TrackOrder />} />
        <Route path="history" element={<OrderHistory />} />
        <Route path="updates" element={<OrderUpdates />} />
        <Route path="*" element={<Navigate to={basePath} replace />} />
      </Routes>
    </RoleShell>
  )
}
