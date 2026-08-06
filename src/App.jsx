import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'

const Demos = lazy(() => import('./pages/Demos'))
const DemoPublicMenu = lazy(() => import('./pages/DemoPublicMenuWrapper'))
const StreetBossCentral = lazy(() => import('./pages/StreetBossCentral'))
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'))

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

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/menu/:trialId" element={<DemoPublicMenu />} />

          {/* Nueva Ruta Interna Segura del CRM */}
          <Route path="/central-hq" element={<StreetBossCentral />} />

          {/* Dashboard Privado Sencillo del Cliente */}
          <Route path="/panel/:slug" element={<ClientDashboard />} />

          {/* Página 404 Oficial para Cualquier Otra Ruta */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
