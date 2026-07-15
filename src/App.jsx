import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Mesas from './pages/Mesas'
import Pedido from './pages/Pedido'
import Cocina from './pages/Cocina'
import Cobro from './pages/Cobro'
import Reporte from './pages/Reporte'
import Configuracion from './pages/Configuracion'
import SuperAdmin from './pages/SuperAdmin'
import Caja from './pages/Caja'
import MenuDigital from './pages/MenuDigital'
import Landing from './pages/Landing'
import DemoAdmin from './pages/DemoAdmin'
import DemoTrialDashboard from './pages/DemoTrialDashboard'

function NegocioApp() {
  const { slug } = useParams()
  return (
    <AppProvider slug={slug}>
      <Routes>
        <Route path="mesero" element={<Mesas />} />
        <Route path="mesero/:meseroSlug" element={<Mesas />} />
        <Route path="mesero/:meseroSlug/pedido/:mesa" element={<Pedido />} />
        <Route path="mesero/:meseroSlug/cobro/:mesa" element={<Cobro />} />
        <Route path="mesero/pedido/:mesa" element={<Pedido />} />
        <Route path="mesero/cobro/:mesa" element={<Cobro />} />
        <Route path="cocina" element={<Cocina />} />
        <Route path="caja" element={<Caja />} />
        <Route path="caja/:mesa" element={<Cobro />} />
        <Route path="menu" element={<MenuDigital modo="pedir" />} />
        <Route path="carta" element={<MenuDigital modo="carta" />} />
        <Route path="admin" element={<Configuracion />} />
        <Route path="admin/config" element={<Configuracion />} />
        <Route path="admin/mesas" element={<Mesas />} />
        <Route path="admin/cocina" element={<Cocina />} />
        <Route path="admin/pedido/:mesa" element={<Pedido />} />
        <Route path="admin/cobro/:mesa" element={<Cobro />} />
        <Route path="admin/reporte" element={<Reporte />} />
        <Route path="*" element={<Navigate to="mesero" replace />} />
      </Routes>
    </AppProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Sistema de pruebas demo: 100% local, sin AppProvider ni Supabase */}
        <Route path="/demo/admin" element={<DemoAdmin />} />
        <Route path="/demo/prueba/:trialId" element={<DemoTrialDashboard />} />
        <Route path="/superadmin" element={<AppProvider slug={null}><SuperAdmin /></AppProvider>} />
        <Route path="/:slug/*" element={<NegocioApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
