import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'

const Demos = lazy(() => import('./pages/Demos'))
const InstalarStreetBoss = lazy(() => import('./pages/InstalarStreetBoss'))
const DemoPublicMenu = lazy(() => import('./pages/DemoPublicMenuWrapper'))
const LaVitolaPublicMenu = lazy(() => import('./pages/LaVitolaPublicMenu'))



function RouteLoader() {
  return (
    <div className="min-h-screen bg-[#0D0E12] text-white flex items-center justify-center px-6 font-sans">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto mb-4 rounded-2xl bg-[#FF4B00] animate-pulse" />
        <p className="text-sm font-bold text-gray-300">Cargando StreetBoss...</p>
      </div>
    </div>
  )
}

// Temporary fail-closed containment. The legacy dashboards must not be mounted
// until Auth, server authorization and tenant isolation pass integration tests.
function AdminSecurityMaintenance() {
  return (
    <main className="min-h-screen bg-[#0D0E12] text-white flex items-center justify-center p-6">
      <section className="max-w-sm text-center space-y-3" role="status">
        <h1 className="text-xl font-bold">Acceso administrativo en mantenimiento</h1>
        <p className="text-sm text-gray-300">El acceso se restablecerá cuando se complete la actualización de seguridad.</p>
      </section>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/instalar" element={<InstalarStreetBoss />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/menu/la-vitola" element={<LaVitolaPublicMenu />} />
          <Route path="/menu/:trialId" element={<DemoPublicMenu />} />
          <Route path="/demo/:trialId" element={<DemoPublicMenu />} />

          {/* Nueva Ruta Interna Segura del CRM */}
          <Route path="/central-hq" element={<AdminSecurityMaintenance />} />

          {/* Dashboard Privado Sencillo del Cliente */}
          <Route path="/panel/la-vitola" element={<Navigate to="/menu/la-vitola/acceso" replace />} />
          <Route path="/panel/:slug" element={<AdminSecurityMaintenance />} />

          {/* Página 404 Oficial para Cualquier Otra Ruta */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
