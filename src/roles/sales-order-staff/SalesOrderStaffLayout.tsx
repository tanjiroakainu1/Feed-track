import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { RoleShell } from '../../components/RoleShell'
import { useRoleLayout } from '../../hooks/useRoleLayout'
import { SALES_COLOR, SALES_NAV } from './config'
import { SalesOrderStaffDashboard } from './SalesOrderStaffDashboard'
import { ReviewOrders } from './pages/ReviewOrders'
import { ApproveRejectOrders } from './pages/ApproveRejectOrders'
import { UpdateOrderStatus } from './pages/UpdateOrderStatus'
import { ProcessOrders } from './pages/ProcessOrders'
import { InventoryCoordination } from './pages/InventoryCoordination'

export function SalesOrderStaffLayout() {
  const location = useLocation()
  const { currentUser, users, handleLogout, handleQuickAccess, handleNavigate } = useRoleLayout('/sales-order-staff')

  const basePath = '/sales-order-staff'
  const currentSegment = location.pathname.replace(basePath, '').replace(/^\//, '') || 'dashboard'

  return (
    <RoleShell
      roleTitle="Sales / Order Staff"
      roleSubtitle="Feed order processing & fulfillment"
      accentColor={SALES_COLOR}
      navItems={SALES_NAV}
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
        <Route index element={<SalesOrderStaffDashboard />} />
        <Route path="review" element={<ReviewOrders />} />
        <Route path="approve-reject" element={<ApproveRejectOrders />} />
        <Route path="update-status" element={<UpdateOrderStatus />} />
        <Route path="process" element={<ProcessOrders />} />
        <Route path="coordination" element={<InventoryCoordination />} />
        <Route path="*" element={<Navigate to={basePath} replace />} />
      </Routes>
    </RoleShell>
  )
}
