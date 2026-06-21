import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { RoleShell } from '../../components/RoleShell'
import { useRoleLayout } from '../../hooks/useRoleLayout'
import { INVENTORY_COLOR, INVENTORY_NAV } from './config'
import { InventoryStaffDashboard } from './InventoryStaffDashboard'
import { UpdateStock } from './pages/UpdateStock'
import { MonitorInventory } from './pages/MonitorInventory'
import { RecordInOut } from './pages/RecordInOut'
import { LowStockAlerts } from './pages/LowStockAlerts'
import { InventoryForecasting } from './pages/InventoryForecasting'

export function InventoryStaffLayout() {
  const location = useLocation()
  const { currentUser, users, handleLogout, handleQuickAccess, handleNavigate } = useRoleLayout('/inventory-staff')

  const basePath = '/inventory-staff'
  const currentSegment = location.pathname.replace(basePath, '').replace(/^\//, '') || 'dashboard'

  return (
    <RoleShell
      roleTitle="Inventory Staff"
      roleSubtitle="Feed stock & warehouse records"
      accentColor={INVENTORY_COLOR}
      navItems={INVENTORY_NAV}
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
        <Route index element={<InventoryStaffDashboard />} />
        <Route path="update-stock" element={<UpdateStock />} />
        <Route path="monitor" element={<MonitorInventory />} />
        <Route path="record" element={<RecordInOut />} />
        <Route path="alerts" element={<LowStockAlerts />} />
        <Route path="forecasting" element={<InventoryForecasting />} />
        <Route path="*" element={<Navigate to={basePath} replace />} />
      </Routes>
    </RoleShell>
  )
}
