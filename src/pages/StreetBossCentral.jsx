import { useState, useEffect } from 'react'
import {
  getHqAdminSession,
  authenticateHqAdmin,
  setHqAdminPassword,
  logoutHqAdmin,
  subscribeCentralSync,
  clearSystemData,
  syncClientsFromSupabase,
  syncAllOrdersFromSupabase,
  subscribeToAllOrdersRealtime
} from '../services/crmV3Service'
import DemosTab from '../components/crm/DemosTab'
import CrearNegocioTab from '../components/crm/CrearNegocioTab'
import ClientesTab from '../components/crm/ClientesTab'
import ProspectosTab from '../components/crm/ProspectosTab'
import PedidosCRMTab from '../components/crm/PedidosCRMTab'
import AnalyticsHQTab from '../components/crm/AnalyticsHQTab'
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
  ExternalLink,
  Lock,
  Key,
  LogOut,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Trash2,
  BarChart3
} from 'lucide-react'

export default function StreetBossCentral() {
  const [activeTab, setActiveTab] = useState('inicio')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedDemoId, setSelectedDemoId] = useState('')
  const [prospectToConvert, setProspectToConvert] = useState(null)

  // Autenticación Administrativa HQ
  const [adminSession, setAdminSession] = useState(() => getHqAdminSession())
  const [loginUser, setLoginUser] = useState('superadmin_hq')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showLoginPass, setShowLoginPass] = useState(false)

  // Modal Cambiar Contraseña HQ
  const [showResetPassModal, setShowResetPassModal] = useState(false)
  const [newHqPass, setNewHqPass] = useState('')
  const [confirmHqPass, setConfirmHqPass] = useState('')
  const [resetPassError, setResetPassError] = useState('')
  const [resetPassSuccess, setResetPassSuccess] = useState('')

  // Preferencia de Tamaño de Letra (Accesibilidad HQ)
  const [fontSizePreference, setFontSizePreference] = useState(() => localStorage.getItem('sb_hq_font_size') || 'normal')

  const toggleFontSize = () => {
    const nextSize = fontSizePreference === 'normal' ? 'large' : 'normal'
    setFontSizePreference(nextSize)
    localStorage.setItem('sb_hq_font_size', nextSize)
  }

  useEffect(() => {
    document.title = 'StreetBoss Central HQ'
    let metaRobots = document.querySelector('meta[name="robots"]')
    let created = false
    if (!metaRobots) {
      metaRobots = document.createElement('meta')
      metaRobots.name = 'robots'
      document.head.appendChild(metaRobots)
      created = true
    }
    metaRobots.content = 'noindex, nofollow'

    // Recupera y publica altas históricas aun antes del acceso HQ; los datos
    // viven en el navegador y deben migrarse apenas se abre esta ruta.
    syncClientsFromSupabase()

    // Sincronización en tiempo real entre pestañas/sesiones
    const unsubscribe = subscribeCentralSync((eventData) => {
      if (eventData.type === 'HQ_LOGOUT') {
        setAdminSession(null)
      } else if (eventData.type === 'HQ_LOGIN_SUCCESS') {
        setAdminSession(getHqAdminSession())
      }
    })

    return () => {
      unsubscribe()
      if (created && metaRobots.parentNode) {
        metaRobots.parentNode.removeChild(metaRobots)
      }
    }
  }, [])

  // Sincronización y monitoreo de TODOS los pedidos en tiempo real en Central HQ
  useEffect(() => {
    if (!adminSession) return

    // Sincronizar inicialmente todos los pedidos
    syncAllOrdersFromSupabase()

    // Suscribirse a cambios en tiempo real
    const unsubscribeAllRealtime = subscribeToAllOrdersRealtime((newOrder, eventType) => {
      window.dispatchEvent(new CustomEvent('sb_orders_updated', { detail: { order: newOrder, eventType } }))
    })

    return () => {
      unsubscribeAllRealtime()
    }
  }, [adminSession])

  const handleHqLogin = (e) => {
    e.preventDefault()
    setLoginError('')
    const result = authenticateHqAdmin(loginUser, loginPass)
    if (result.success) {
      setAdminSession(result.session)
      setLoginPass('')
    } else {
      setLoginError(result.error)
    }
  }

  const handleHqLogout = () => {
    logoutHqAdmin()
    setAdminSession(null)
  }

  const handleWipeData = async () => {
    const confirmWipe = window.confirm(
      '🚨 ATENCIÓN: ¿Estás seguro de que deseas eliminar TODOS los clientes B2B, B2C y comandas existentes para empezar de cero?\\n\\nEsto borrará permanentemente todos los restaurantes creados, sus categorías, productos, clientes y órdenes, conservando únicamente las plantillas demo oficiales y este panel HQ.'
    )
    if (!confirmWipe) return

    try {
      const result = await clearSystemData()
      if (result.success) {
        alert('✅ Entorno restaurado correctamente. Se han conservado únicamente los demos oficiales de clonación.')
        window.location.reload()
      }
    } catch (err) {
      alert('❌ Error al restaurar el entorno: ' + err.message)
    }
  }

  const handleConfirmResetHqPass = (e) => {
    e.preventDefault()
    setResetPassError('')
    setResetPassSuccess('')
    if (newHqPass !== confirmHqPass) {
      setResetPassError('Las contraseñas no coinciden.')
      return
    }
    const res = setHqAdminPassword(newHqPass)
    if (res.success) {
      setResetPassSuccess('Contraseña administrativa actualizada correctamente.')
      setNewHqPass('')
      setConfirmHqPass('')
      setTimeout(() => {
        setShowResetPassModal(false)
        setResetPassSuccess('')
      }, 2000)
    } else {
      setResetPassError(res.error)
    }
  }

  const handleSelectDemoForBusiness = (demoId) => {
    setSelectedDemoId(demoId)
    setActiveTab('crear')
  }

  const handleConvertProspectToBusiness = (prospect) => {
    setProspectToConvert(prospect)
    setActiveTab('crear')
  }

  // PANTALLA DE ACCESO AL DASHBOARD PRINCIPAL (HQ ADMIN LOGIN)
  if (!adminSession) {
    return (
      <div className="min-h-screen bg-[#0D0E12] text-white flex items-center justify-center p-4 selection:bg-[#FF4B00] selection:text-white font-sans">
        <div className="bg-[#14161F] border border-white/10 rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FF4B00]/10 rounded-full blur-3xl" />
          
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-[#FF4B00]/10 border border-[#FF4B00]/20 text-[#FF4B00] mb-1">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl font-black text-white">StreetBoss Central HQ</h1>
            <p className="text-xs text-gray-400">Acceso restringido para el equipo administrativo.</p>
          </div>

          <form onSubmit={handleHqLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase">Usuario Administrador</label>
              <input
                type="text"
                value={loginUser}
                onChange={e => setLoginUser(e.target.value)}
                placeholder="superadmin_hq"
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4B00] font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase">Contraseña</label>
              <div className="relative">
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4B00] font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                >
                  {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black py-3.5 rounded-xl text-sm shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Lock size={16} /> Entrar al Hub Central
            </button>
          </form>

        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[radial-gradient(circle_at_top_right,_#3A1B13_0%,_#151722_38%,_#090A0E_78%)] text-white font-sans flex flex-col selection:bg-[#FF4B00] selection:text-white dashboard-accessibility-fonts ${fontSizePreference === 'large' ? 'font-size-large' : ''}`}>
      {/* Barra superior única tipo iOS */}
      <header className="bg-[#11131A]/70 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-7 py-3 flex items-center justify-between sticky top-0 z-50">
        <button type="button" onClick={() => setActiveTab('inicio')} className="flex items-center gap-2 active:scale-95">
          <img
            src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp"
            alt="StreetBoss"
            className="h-7 sm:h-8 w-auto mix-blend-screen"
          />
          <span className="hidden sm:inline text-[10px] font-black uppercase text-[#FF6A1A] bg-[#FF4B00]/10 px-2 py-1 rounded-full">Central HQ</span>
        </button>

        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleFontSize} className={`min-h-10 rounded-full border px-3 text-[11px] font-black ${fontSizePreference === 'large' ? 'border-[#FF4B00]/40 bg-[#FF4B00]/15 text-[#FF6A1A]' : 'border-white/10 bg-white/5 text-white/70'}`}>
            A{fontSizePreference === 'large' ? '++' : '+'}
          </button>
          <button type="button" onClick={() => setShowResetPassModal(true)} className="min-h-10 rounded-full border border-white/10 bg-white/5 px-3 text-white/65 hover:text-white" title="Cambiar clave">
            <Key size={16} />
          </button>
          <button type="button" onClick={handleHqLogout} className="min-h-10 rounded-full border border-red-500/15 bg-red-500/10 px-3 text-red-400" title="Salir">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Navegación histórica retirada de la interfaz; se conserva el código durante la transición */}
      <aside
        className={`hidden fixed top-0 left-0 z-40 h-screen w-64 bg-[#11131A]/88 backdrop-blur-2xl border-r border-white/10 flex-col justify-between transition-transform duration-300 ${
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

          {/* Selector de Tamaño de Letra (Accesibilidad B2B Central) */}
          <button
            type="button"
            onClick={toggleFontSize}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl border text-xs font-black transition-all active:scale-98 ${
              fontSizePreference === 'large'
                ? 'bg-[#FF4B00]/10 text-[#FF6A1A] border-[#FF4B00]/30 shadow-inner'
                : 'bg-[#0D0E12] text-gray-400 border-white/5 hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-tighter">A{fontSizePreference === 'large' ? '++' : '+'}</span>
              <span>Tamaño de Texto</span>
            </span>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-white/5 text-gray-300">
              {fontSizePreference === 'large' ? 'Grande' : 'Normal'}
            </span>
          </button>

          {/* Menú de Navegación del Hub */}
          <nav className="space-y-2 text-sm sm:text-base font-bold">
            <div className="text-xs uppercase font-black tracking-wider text-gray-500 px-3 pt-2 pb-1">
              Módulos Principales
            </div>

            <button
              onClick={() => { setActiveTab('inicio'); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'inicio' ? 'bg-[#FF4B00] text-white shadow-lg font-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Home size={20} /> Inicio / Resumen
            </button>

            <button
              onClick={() => { setActiveTab('prospectos'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'prospectos' ? 'bg-[#FF4B00] text-white shadow-lg font-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <UserPlus size={20} /> Prospectos
              </div>
              <ChevronRight size={16} opacity={0.6} />
            </button>

            <button
              onClick={() => { setActiveTab('demos'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'demos' ? 'bg-[#FF4B00] text-white shadow-lg font-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Store size={20} /> Demos Oficiales
              </div>
              <ChevronRight size={16} opacity={0.6} />
            </button>

            <button
              onClick={() => { setActiveTab('clientes'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'clientes' ? 'bg-[#FF4B00] text-white shadow-lg font-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Users size={20} /> CLIENTES
              </div>
              <ChevronRight size={16} opacity={0.6} />
            </button>

            <button
              onClick={() => { setActiveTab('pedidos'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'pedidos' ? 'bg-[#FF4B00] text-white shadow-lg font-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <ShoppingBag size={20} /> Registro de Pedidos
              </div>
              <ChevronRight size={16} opacity={0.6} />
            </button>

            <button
              onClick={() => { setActiveTab('analitica'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'analitica' ? 'bg-[#FF4B00] text-white shadow-lg font-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5"><BarChart3 size={20} /> Analítica HQ</div>
              <ChevronRight size={16} opacity={0.6} />
            </button>

            <button
              onClick={() => { setActiveTab('crear'); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'crear' ? 'bg-[#FF4B00] text-white shadow-lg font-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Sparkles size={20} /> + Crear Negocio
            </button>

            {/* Módulos Futuros Proximamente */}
            <div className="text-[10px] uppercase font-black tracking-wider text-gray-500 px-3 pt-4 pb-1">
              Operación y Expansión
            </div>

            <button
              onClick={() => { setActiveTab('operacion'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'operacion' ? 'bg-white/10 text-white font-bold' : 'text-gray-500 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Activity size={20} /> Operaciones
              </div>
              <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-lg font-bold">Próximamente</span>
            </button>

            <button
              onClick={() => { setActiveTab('configuracion'); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'configuracion' ? 'bg-white/10 text-white font-bold' : 'text-gray-500 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Settings size={20} /> Configuración
              </div>
              <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-lg font-bold">Próximamente</span>
            </button>
          </nav>
        </div>

        {/* Footer del Sidebar con Acciones de Seguridad Administrativa */}
        <div className="p-5 border-t border-white/5 bg-[#0D0E12]/60 text-xs sm:text-sm space-y-3">
          <div className="flex items-center justify-between text-gray-300 font-bold text-sm">
            <span className="truncate">👤 {adminSession?.user || 'admin_hq'}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-lg uppercase font-black">HQ</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setShowResetPassModal(true)}
              className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Key size={14} /> Cambiar Clave
            </button>
            <button
              onClick={handleHqLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>

          <button
            onClick={handleWipeData}
            className="w-full mt-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 px-3 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Trash2 size={14} /> Empezar de cero (Wipe)
          </button>
        </div>
      </aside>

      {/* ÁREA DE TRABAJO PRINCIPAL */}
      <main className="w-full flex-1 p-4 pb-32 sm:p-8 sm:pb-36 min-h-screen overflow-y-auto">
        {/* INICIO / RESUMEN */}
        {activeTab === 'inicio' && (
          <div className="space-y-7 max-w-6xl mx-auto pt-2 sm:pt-4">
            <div className="px-1 sm:px-2 pt-2">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FF6A1A]">StreetBoss Central</p>
              <h2 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight text-white">Hola, Boss.</h2>
              <p className="mt-1 text-sm text-white/45">Elige una app para comenzar.</p>
            </div>

            {/* iOS Springboard Icon Layout */}
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8 justify-items-center bg-white/[0.045] backdrop-blur-xl p-5 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
              {/* App 1: Demos */}
              <button
                onClick={() => setActiveTab('demos')}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div className="w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-[1.65rem] bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-white shadow-xl border border-white/20 transition-transform group-hover:scale-105 active:scale-95 shadow-orange-950/40">
                  <Store size={36} className="text-white" />
                </div>
                <span className="text-sm sm:text-base font-black text-white text-center mt-3 group-hover:text-[#FF6A1A] transition-colors">
                  Demos
                </span>
                <span className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase">Carpeta</span>
              </button>

              {/* App 2: Prospectos */}
              <button
                onClick={() => setActiveTab('prospectos')}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div className="w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-[1.65rem] bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl border border-white/20 transition-transform group-hover:scale-105 active:scale-95 shadow-blue-950/40">
                  <UserPlus size={36} className="text-white" />
                </div>
                <span className="text-sm sm:text-base font-black text-white text-center mt-3 group-hover:text-blue-400 transition-colors">
                  Prospectos
                </span>
                <span className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase">Módulo</span>
              </button>

              {/* App 3: Clientes */}
              <button
                onClick={() => setActiveTab('clientes')}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div className="w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-[1.65rem] bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl border border-white/20 transition-transform group-hover:scale-105 active:scale-95 shadow-emerald-950/40">
                  <Users size={36} className="text-white" />
                </div>
                <span className="text-sm sm:text-base font-black text-white text-center mt-3 group-hover:text-emerald-400 transition-colors">
                  Clientes
                </span>
                <span className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase">Módulo</span>
              </button>

              {/* App 4: Crear Negocio */}
              <button
                onClick={() => setActiveTab('crear')}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div className="w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-[1.65rem] bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-xl border border-white/20 transition-transform group-hover:scale-105 active:scale-95 shadow-purple-950/40">
                  <Sparkles size={36} className="text-white" />
                </div>
                <span className="text-sm sm:text-base font-black text-white text-center mt-3 group-hover:text-pink-400 transition-colors">
                  Crear Negocio
                </span>
                <span className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase">Acción</span>
              </button>

              {/* App 5: Pedidos */}
              <button
                onClick={() => setActiveTab('pedidos')}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div className="w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-[1.65rem] bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-xl border border-white/20 transition-transform group-hover:scale-105 active:scale-95 shadow-amber-950/40">
                  <ShoppingBag size={36} className="text-white" />
                </div>
                <span className="text-sm sm:text-base font-black text-white text-center mt-3 group-hover:text-yellow-400 transition-colors">
                  Pedidos
                </span>
                <span className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase">Registro</span>
              </button>

              {/* App 6: Configuración */}
              <button onClick={() => setActiveTab('analitica')} className="group flex flex-col items-center focus:outline-none">
                <div className="w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-[1.65rem] bg-gradient-to-tr from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-xl border border-white/20 transition-transform group-hover:scale-105 active:scale-95 shadow-blue-950/40">
                  <BarChart3 size={36} />
                </div>
                <span className="text-sm sm:text-base font-black text-white text-center mt-3 group-hover:text-cyan-400 transition-colors">Analítica</span>
                <span className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase">Métricas</span>
              </button>

              {/* App 7: Configuración */}
              <button
                onClick={() => setActiveTab('configuracion')}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div className="w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-[1.65rem] bg-gradient-to-tr from-slate-500 to-slate-800 flex items-center justify-center text-white shadow-xl border border-white/20 transition-transform group-hover:scale-105 active:scale-95 shadow-black/40">
                  <Settings size={36} className="text-white" />
                </div>
                <span className="text-sm sm:text-base font-black text-white text-center mt-3 group-hover:text-slate-300 transition-colors">
                  Ajustes
                </span>
                <span className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase">Sistema</span>
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

        {activeTab === 'analitica' && (
          <AnalyticsHQTab />
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

        {/* Modal para Establecer/Cambiar Contraseña Administrativa HQ */}
        {showResetPassModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowResetPassModal(false)}>
            <div className="bg-[#14161F] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Key size={18} className="text-[#FF4B00]" /> Cambiar Contraseña HQ
                </h3>
                <button onClick={() => setShowResetPassModal(false)} className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConfirmResetHqPass} className="space-y-3 text-xs">
                {resetPassError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl font-bold">
                    {resetPassError}
                  </div>
                )}
                {resetPassSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl font-bold flex items-center gap-2">
                    <Check size={16} /> {resetPassSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Nueva Contraseña HQ (mínimo 8 caracteres)</label>
                  <input
                    type="password"
                    value={newHqPass}
                    onChange={e => setNewHqPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono focus:border-[#FF4B00] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    value={confirmHqPass}
                    onChange={e => setConfirmHqPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono focus:border-[#FF4B00] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetPassModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black"
                  >
                    Actualizar Clave HQ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Dock inferior tipo iOS */}
      <nav className="fixed bottom-3 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[min(720px,calc(100%-32px))] z-50 rounded-[1.6rem] border border-white/15 bg-[#161821]/88 px-2 py-2 shadow-2xl backdrop-blur-2xl flex items-center justify-around pb-[calc(8px+env(safe-area-inset-bottom))]">
        {[
          { id: 'inicio', label: 'Inicio', icon: Home },
          { id: 'demos', label: 'Demos', icon: Store },
          { id: 'prospectos', label: 'Prospectos', icon: UserPlus },
          { id: 'crear', label: 'Crear', icon: PlusCircle },
          { id: 'clientes', label: 'Clientes', icon: Users },
          { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
        ].map(item => {
          const DockIcon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`min-w-12 sm:min-w-20 rounded-2xl px-1.5 sm:px-3 py-1.5 flex flex-col items-center gap-1 text-[8px] sm:text-[9px] font-black transition-all ${activeTab === item.id ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-white/55 hover:text-white'}`}
            >
              <DockIcon size={19} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
