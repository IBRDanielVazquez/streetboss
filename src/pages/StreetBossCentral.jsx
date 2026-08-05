import { useState, useEffect } from 'react'
import DemosTab from '../components/crm/DemosTab'
import CrearNegocioTab from '../components/crm/CrearNegocioTab'
import ClientesTab from '../components/crm/ClientesTab'
import ProspectosTab from '../components/crm/ProspectosTab'
import PedidosCRMTab from '../components/crm/PedidosCRMTab'
import {
  Home,
  Store,
  Sparkles,
  Users,
  UserPlus,
  ShoppingBag,
  Shield,
  Activity,
  Settings,
  ChevronRight,
  Menu,
  X,
  PlusCircle,
  Folder,
  Clock,
  ExternalLink
} from 'lucide-react'

export default function StreetBossCentral() {
  const [activeTab, setActiveTab] = useState('demos') // 'inicio', 'prospectos', 'demos', 'clientes', 'crear', 'operacion', 'configuracion'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedDemoId, setSelectedDemoId] = useState('')
  const [prospectToConvert, setProspectToConvert] = useState(null)

  useEffect(() => {
    document.title = 'StreetBoss Central HQ'
  }, [])

  const handleSelectDemoForBusiness = (demoId) => {
    setSelectedDemoId(demoId)
    setActiveTab('crear')
  }

  const handleConvertProspectToBusiness = (prospect) => {
    setProspectToConvert(prospect)
    setActiveTab('crear')
  }

  return (
    <div className="min-h-screen bg-[#0D0E12] text-white font-sans flex flex-col md:flex-row selection:bg-[#FF4B00] selection:text-white">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#14161F] border-b border-white/5 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img
            src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp"
            alt="StreetBoss"
            className="h-8 w-auto mix-blend-screen"
          />
          <span className="text-[10px] font-black uppercase text-[#FF6A1A] bg-[#FF4B00]/10 px-2 py-0.5 rounded-md">HQ Hub</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-300 hover:text-white bg-white/5 rounded-lg"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* LEFT SIDEBAR HUB (Navegación Lateral Izquierda inspirada en HighLevel) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#14161F] border-r border-white/5 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Logo & Marca Central */}
          <div className="flex items-center justify-between">
            <a href="/" className="inline-block">
              <img
                src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp"
                alt="StreetBoss Central"
                className="h-10 w-auto mix-blend-screen"
              />
            </a>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#0D0E12] border border-white/5 flex items-center gap-2 text-xs text-gray-400">
            <Shield size={14} className="text-[#FF4B00]" />
            <span className="font-bold text-gray-200">Hub Operativo V3</span>
          </div>

          {/* Menú de Navegación del Hub */}
          <nav className="space-y-1 text-xs font-bold">
            <div className="text-[10px] uppercase font-black tracking-wider text-gray-500 px-3 pt-2 pb-1">
              Módulos Principales
            </div>

            <button
              onClick={() => { setActiveTab('inicio'); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'inicio' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Home size={16} /> Inicio / Resumen
            </button>

            <button
              onClick={() => { setActiveTab('prospectos'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'prospectos' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserPlus size={16} /> Prospectos
              </div>
              <ChevronRight size={14} opacity={0.6} />
            </button>

            <button
              onClick={() => { setActiveTab('demos'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'demos' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Store size={16} /> Demos Oficiales
              </div>
              <ChevronRight size={14} opacity={0.6} />
            </button>

            <button
              onClick={() => { setActiveTab('clientes'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'clientes' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={16} /> Clientes Activos
              </div>
              <ChevronRight size={14} opacity={0.6} />
            </button>

            <button
              onClick={() => { setActiveTab('pedidos'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'pedidos' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} /> Registro de Pedidos
              </div>
              <ChevronRight size={14} opacity={0.6} />
            </button>

            <button
              onClick={() => { setActiveTab('crear'); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'crear' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Sparkles size={16} /> + Crear Negocio
            </button>

            {/* Módulos Futuros Proximamente */}
            <div className="text-[10px] uppercase font-black tracking-wider text-gray-500 px-3 pt-4 pb-1">
              Operación y Expansión
            </div>

            <button
              onClick={() => { setActiveTab('operacion'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'operacion' ? 'bg-white/10 text-white' : 'text-gray-500 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity size={16} /> Operaciones
              </div>
              <span className="text-[9px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded font-bold">Próximamente</span>
            </button>

            <button
              onClick={() => { setActiveTab('configuracion'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'configuracion' ? 'bg-white/10 text-white' : 'text-gray-500 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings size={16} /> Configuración
              </div>
              <span className="text-[9px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded font-bold">Próximamente</span>
            </button>
          </nav>
        </div>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-white/5 bg-[#0D0E12]/40 text-[11px] text-gray-400">
          <p className="font-bold text-white">StreetBoss CRM V3</p>
          <p>Vende directo. Manda tú.</p>
        </div>
      </aside>

      {/* ÁREA DE TRABAJO PRINCIPAL */}
      <main className="flex-1 p-4 sm:p-8 min-h-screen overflow-y-auto">
        {/* INICIO / RESUMEN */}
        {activeTab === 'inicio' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-2 shadow-xl">
              <h2 className="text-2xl font-black text-white">Bienvenido al Hub Central de StreetBoss</h2>
              <p className="text-xs text-gray-400">
                Administra tus demos maetras, prospectos comerciales, clientes activos y accesos directos desde un solo lugar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('demos')}
                className="bg-[#14161F] p-5 rounded-2xl border border-white/5 hover:border-[#FF4B00]/40 text-left space-y-2 transition-all shadow-lg group"
              >
                <Store size={24} className="text-[#FF4B00]" />
                <h3 className="font-black text-white group-hover:text-[#FF6A1A]">10 Demos Oficiales</h3>
                <p className="text-xs text-gray-400">Ver plantillas activas para demostración y clonación.</p>
              </button>

              <button
                onClick={() => setActiveTab('prospectos')}
                className="bg-[#14161F] p-5 rounded-2xl border border-white/5 hover:border-[#FF4B00]/40 text-left space-y-2 transition-all shadow-lg group"
              >
                <UserPlus size={24} className="text-[#FF4B00]" />
                <h3 className="font-black text-white group-hover:text-[#FF6A1A]">Gestión de Prospectos</h3>
                <p className="text-xs text-gray-400">Captura manual e importación de bases de datos.</p>
              </button>

              <button
                onClick={() => setActiveTab('clientes')}
                className="bg-[#14161F] p-5 rounded-2xl border border-white/5 hover:border-[#FF4B00]/40 text-left space-y-2 transition-all shadow-lg group"
              >
                <Users size={24} className="text-[#FF4B00]" />
                <h3 className="font-black text-white group-hover:text-[#FF6A1A]">Clientes Activos</h3>
                <p className="text-xs text-gray-400">Acceso administrativo a Dashboards y Menús digitales.</p>
              </button>
            </div>
          </div>
        )}

        {/* DEMOS */}
        {activeTab === 'demos' && (
          <DemosTab onSelectDemoForBusiness={handleSelectDemoForBusiness} />
        )}

        {/* CREAR NEGOCIO */}
        {activeTab === 'crear' && (
          <CrearNegocioTab
            selectedDemoId={selectedDemoId}
            onBusinessCreated={() => setActiveTab('clientes')}
          />
        )}

        {/* CLIENTES */}
        {activeTab === 'clientes' && (
          <ClientesTab />
        )}

        {/* PROSPECTOS */}
        {activeTab === 'prospectos' && (
          <ProspectosTab onConvertProspectToBusiness={handleConvertProspectToBusiness} />
        )}

        {/* PEDIDOS */}
        {activeTab === 'pedidos' && (
          <PedidosCRMTab />
        )}

        {/* OPERACIÓN (PRÓXIMAMENTE) */}
        {activeTab === 'operacion' && (
          <div className="bg-[#14161F] p-12 text-center rounded-2xl border border-white/5 max-w-xl mx-auto space-y-4 shadow-xl">
            <Activity size={48} className="mx-auto text-gray-600" />
            <h2 className="text-xl font-black text-white">Módulo de Operaciones</h2>
            <p className="text-xs text-gray-400">
              Seguimientos comerciales, auditoría y tareas programadas.
            </p>
            <span className="inline-block px-4 py-1.5 bg-[#FF4B00]/10 text-[#FF6A1A] border border-[#FF4B00]/20 rounded-full font-bold text-xs">
              PRÓXIMAMENTE
            </span>
          </div>
        )}

        {/* CONFIGURACIÓN (PRÓXIMAMENTE) */}
        {activeTab === 'configuracion' && (
          <div className="bg-[#14161F] p-12 text-center rounded-2xl border border-white/5 max-w-xl mx-auto space-y-4 shadow-xl">
            <Settings size={48} className="mx-auto text-gray-600" />
            <h2 className="text-xl font-black text-white">Configuración del Hub</h2>
            <p className="text-xs text-gray-400">
              Administración de usuarios internos, roles, plantillas y automatizaciones.
            </p>
            <span className="inline-block px-4 py-1.5 bg-[#FF4B00]/10 text-[#FF6A1A] border border-[#FF4B00]/20 rounded-full font-bold text-xs">
              PRÓXIMAMENTE
            </span>
          </div>
        )}
      </main>
    </div>
  )
}
