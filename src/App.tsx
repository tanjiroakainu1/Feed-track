import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { APP_DOCUMENT_TITLE } from './config/app'
import { FloatingChatbot } from './components/FloatingChatbot'
import { FloatingParticles } from './components/FloatingParticles'
import { HomeRedirect, ProtectedRoute } from './components/ProtectedRoute'
import { AppProvider } from './context/AppContext'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AdministratorLayout } from './roles/administrator/AdministratorLayout'
import { InventoryStaffLayout } from './roles/inventory-staff/InventoryStaffLayout'
import { SalesOrderStaffLayout } from './roles/sales-order-staff/SalesOrderStaffLayout'
import { CustomerLayout } from './roles/customer/CustomerLayout'

export default function App() {
  useEffect(() => {
    document.title = APP_DOCUMENT_TITLE
  }, [])

  return (
    <AppProvider>
      <div className="app-root relative isolate min-h-dvh">
        <FloatingParticles />
        <div className="relative z-[1]">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/administrator/*"
                element={
                  <ProtectedRoute role="administrator">
                    <AdministratorLayout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory-staff/*"
                element={
                  <ProtectedRoute role="inventory-staff">
                    <InventoryStaffLayout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales-order-staff/*"
                element={
                  <ProtectedRoute role="sales-order-staff">
                    <SalesOrderStaffLayout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/*"
                element={
                  <ProtectedRoute role="customer">
                    <CustomerLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <FloatingChatbot />
          </BrowserRouter>
        </div>
      </div>
    </AppProvider>
  )
}
