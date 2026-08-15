import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getBusinessBySlug,
  updateBusinessSettings,
  saveCategory,
  deleteCategory,
  saveProduct,
  toggleProductAvailability,
  toggleProductVisibility,
  deleteProduct,
  getBusinessDeliveryZones,
  saveDeliveryZones,
  bulkUpdateZoneFees,
  authenticateBusiness,
  subscribeCentralSync,
  syncOrdersFromSupabase,
  subscribeToOrdersRealtime
} from '../services/crmV3Service'
import { buscarPorCPSync, buscarPorColoniaSync } from '../data/sepomexTuxtla'
import RestaurantCustomersTab from '../components/crm/RestaurantCustomersTab'
import RestaurantOrdersTab from '../components/crm/RestaurantOrdersTab'
import RestaurantPaymentMethodsTab from '../components/crm/RestaurantPaymentMethodsTab'
import VersionFooterBadge from '../components/VersionFooterBadge'
import {
  Store,
  Layers,
  Package,
  MapPin,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Search,
  Power,
  DollarSign,
  Image as ImageIcon,
  Upload,
  Eye,
  EyeOff,
  AlertTriangle,
  Globe,
  Share2,
  Users,
  ShoppingBag,
  CreditCard,
  ChevronRight
} from 'lucide-react'

// Helper: Convert File object to Base64 WebP Data URL for local storage persistence
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('')
    // Validation: JPG, JPEG, PNG, WEBP
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type.toLowerCase())) {
      return reject(new Error('Formato no permitido. Utiliza archivos JPG, JPEG, PNG o WEBP.'))
    }
    // Validation: Size <= 5MB
    if (file.size > 5 * 1024 * 1024) {
      return reject(new Error('La imagen pesa demasiado. El tamaño máximo permitido es 5MB.'))
    }

    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Error al leer la imagen seleccionada.'))
    reader.readAsDataURL(file)
  })
}

export default function ClientDashboard() {
  const { slug } = useParams()
  const [business, setBusiness] = useState(null)
  const [tab, setTab] = useState('inicio') // Default to 'inicio' for Mobile-First Bottom Nav
  const [menuSubTab, setMenuSubTab] = useState('productos') // Sub-tab for menu management
  const [savedSuccess, setSavedSuccess] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Information & RRSS Form
  const [infoForm, setInfoForm] = useState({})
  
  // Modal Categorías
  const [editingCategory, setEditingCategory] = useState(null)
  
  // Modal Productos
  const [editingProduct, setEditingProduct] = useState(null)

  // Zonas de Entrega
  const [zones, setZones] = useState([])
  const [cpSearch, setCpSearch] = useState('')
  const [coloniaSearch, setColoniaSearch] = useState('')
  const [selectedZoneKeys, setSelectedZoneKeys] = useState([])
  const [bulkFee, setBulkFee] = useState(30)

  const loadData = () => {
    const b = getBusinessBySlug(slug)
    if (b) {
      setBusiness(b)
      setInfoForm({
        name: b.name || '',
        description: b.description || '',
        whatsapp: b.whatsapp || '',
        phone: b.phone || '',
        address: b.address || '',
        postal_code: b.postal_code || '',
        schedule_text: b.schedule_text || '',
        is_open: b.is_open !== false,
        main_message: b.main_message || '¡Gracias por tu preferencia! Pedidos al instante por WhatsApp.',
        
        // Delivery Settings (Reparto)
        has_delivery: b.has_delivery !== false,
        free_delivery: b.free_delivery || false,
        use_general_fee: b.use_general_fee !== false,
        base_delivery_fee: b.base_delivery_fee ?? 30,

        // Images
        logo_url: b.logo_url || '',
        banner_url: b.banner_url || '',
        brand_color: b.brand_color || '#FF4B00',

        // Social Networks (RRSS)
        facebook_url: b.facebook_url || '',
        instagram_url: b.instagram_url || '',
        tiktok_url: b.tiktok_url || '',
        youtube_url: b.youtube_url || '',
        website_url: b.website_url || '',
        maps_url: b.maps_url || '',
      })

      const z = getBusinessDeliveryZones(b.business_id)
      setZones(z)
    }
  }

  useEffect(() => {
    loadData()
    const unsubscribe = subscribeCentralSync(() => {
      loadData()
    })
    return () => unsubscribe()
  }, [slug])

  // Autenticación B2B por Contraseña
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('mode') === 'admin_suplantacion' || searchParams.get('token')) return true
    return sessionStorage.getItem(`sb_b2b_session_${slug}`) === 'authenticated'
  })
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Sincronización de pedidos en tiempo real con Supabase
  useEffect(() => {
    if (!business || !isAuthenticated) return

    // Descargar historial inicial de órdenes
    syncOrdersFromSupabase(business.business_id).then(() => {
      loadData()
    })

    // Suscribirse al canal en tiempo real
    const unsubscribeRealtime = subscribeToOrdersRealtime(business.business_id, (newOrder, eventType) => {
      loadData()
      if (eventType === 'INSERT') {
        showToast(`🔔 ¡NUEVO PEDIDO RECIBIDO! ${newOrder.order_number} de ${newOrder.customer_name}`)
        // Sonido de notificación
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
          const osc = audioCtx.createOscillator()
          const gain = audioCtx.createGain()
          osc.connect(gain)
          gain.connect(audioCtx.destination)
          osc.type = 'sine'
          osc.frequency.value = 587.33 // D5
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
          osc.start()
          osc.stop(audioCtx.currentTime + 0.15)
          setTimeout(() => {
            const osc2 = audioCtx.createOscillator()
            osc2.connect(gain)
            osc2.type = 'sine'
            osc2.frequency.value = 880 // A5
            osc2.start()
            osc2.stop(audioCtx.currentTime + 0.25)
          }, 180)
        } catch (e) {
          console.log('Audio error:', e)
        }
      }
    })

    return () => {
      unsubscribeRealtime()
    }
  }, [business?.business_id, isAuthenticated])

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    const result = authenticateBusiness(slug, loginPassword)
    if (result.success) {
      sessionStorage.setItem(`sb_b2b_session_${slug}`, 'authenticated')
      setIsAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError(result.error || 'Contraseña incorrecta.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(`sb_b2b_session_${slug}`)
    setIsAuthenticated(false)
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#0D0E12] text-white flex flex-col items-center justify-center p-6 text-center">
        <Store size={48} className="text-[#FF4B00] mb-4 animate-bounce" />
        <h1 className="text-xl font-black">Restaurante no encontrado</h1>
        <p className="text-xs text-gray-400 mt-2 max-w-sm">Verifica el enlace de tu Dashboard o contacta con soporte.</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0E12] text-white flex items-center justify-center p-4 font-sans selection:bg-[#FF4B00] selection:text-white">
        <div className="bg-[#14161F] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-black overflow-hidden mx-auto border border-white/10 p-1">
              <img src={business.logo_url || '/brand/SB_FAVICON_512x512_V01.png'} alt={business.name} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#FF6A1A] uppercase tracking-wider bg-[#FF4B00]/10 px-3 py-1 rounded-full border border-[#FF4B00]/20">
                Dashboard B2B Protegido
              </span>
              <h1 className="text-xl font-black text-white mt-2">{business.name}</h1>
              <p className="text-xs text-gray-400 mt-1">Ingresa tu contraseña para acceder a la administración.</p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl flex items-center gap-2 font-bold">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-gray-300 font-bold mb-1.5">Contraseña del Restaurante</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:border-[#FF4B00] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 text-xs flex items-center justify-center gap-2"
            >
              <Power size={16} /> Iniciar Sesión en el Dashboard
            </button>
          </form>

          <div className="border-t border-white/5 pt-4 text-center text-[11px] text-gray-500 space-y-2">
            <p>StreetBoss — Vende directo. Manda tú.</p>
            <a href={`/menu/${slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#FF6A1A] font-bold hover:underline">
              <Globe size={12} /> Ver Menú Digital Público
            </a>
          </div>
        </div>
      </div>
    )
  }

  const showToast = (msg) => {
    setSavedSuccess(msg)
    setTimeout(() => setSavedSuccess(''), 3000)
  }

  const showError = (msg) => {
    setErrorMessage(msg)
    setTimeout(() => setErrorMessage(''), 4000)
  }

  // File Upload Handlers (Examinar fotos desde celular/equipo)
  const handleImageFileChange = async (e, fieldSetter) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const dataUrl = await readFileAsDataURL(file)
      fieldSetter(dataUrl)
      showToast('Imagen cargada correctamente')
    } catch (err) {
      showError(err.message)
    }
  }

  // 1. Guardar Información General y Redes Sociales
  const handleSaveInfo = (e) => {
    e.preventDefault()
    updateBusinessSettings(business.business_id, infoForm)
    loadData()
    showToast('Información y configuraciones actualizadas')
  }

  // 2. Categorías
  const handleSaveCat = (e) => {
    e.preventDefault()
    if (!editingCategory?.name) return
    saveCategory(business.business_id, editingCategory)
    setEditingCategory(null)
    loadData()
    showToast('Categoría guardada')
  }

  const handleDeleteCat = (catId) => {
    if (window.confirm('¿Eliminar esta categoría y sus productos asociados?')) {
      deleteCategory(catId)
      loadData()
      showToast('Categoría eliminada')
    }
  }

  // 3. Productos y Estados (Disponible, Agotado, Oculto)
  const handleSaveProd = (e) => {
    e.preventDefault()
    if (!editingProduct?.name || !editingProduct?.category_id) return
    saveProduct(business.business_id, editingProduct)
    setEditingProduct(null)
    loadData()
    showToast('Producto guardado')
  }

  const handleToggleAgotado = (prodId) => {
    toggleProductAvailability(prodId)
    loadData()
    showToast('Estado del producto actualizado')
  }

  const handleToggleOculto = (prodId) => {
    toggleProductVisibility(prodId)
    loadData()
    showToast('Visibilidad del producto actualizada')
  }

  const handleDeleteProd = (prodId) => {
    if (window.confirm('¿Eliminar este producto?')) {
      deleteProduct(prodId)
      loadData()
      showToast('Producto eliminado')
    }
  }

  // 4. Zonas de Entrega (Tuxtla Gutiérrez Síncrono)
  const resultsByCP = cpSearch ? buscarPorCPSync(cpSearch) : []
  const resultsByColonia = coloniaSearch ? buscarPorColoniaSync(coloniaSearch) : []

  const handleAddSettlement = (item, fee = 30) => {
    const existing = zones.find(z => z.postal_code === item.cp && z.settlement_name === item.colonia)
    if (!existing) {
      const finalFee = infoForm.free_delivery ? 0 : (infoForm.use_general_fee ? Number(infoForm.base_delivery_fee || 30) : fee)
      const newZones = [
        ...zones,
        {
          postal_code: item.cp,
          settlement_name: item.colonia,
          settlement_type: item.tipo || 'Colonia',
          delivery_fee: finalFee,
          is_active: true,
        }
      ]
      const saved = saveDeliveryZones(business.business_id, newZones)
      setZones(saved)
      showToast(`Colonia ${item.colonia} agregada`)
    }
  }

  const handleAddAllFromCP = (cpItems) => {
    const newZones = [...zones]
    const finalFee = infoForm.free_delivery ? 0 : Number(infoForm.base_delivery_fee || 30)
    cpItems.forEach(item => {
      const exists = newZones.some(z => z.postal_code === item.cp && z.settlement_name === item.colonia)
      if (!exists) {
        newZones.push({
          postal_code: item.cp,
          settlement_name: item.colonia,
          settlement_type: item.tipo || 'Colonia',
          delivery_fee: finalFee,
          is_active: true,
        })
      }
    })
    const saved = saveDeliveryZones(business.business_id, newZones)
    setZones(saved)
    showToast(`Colonias agregadas al reparto`)
  }

  const handleRemoveZone = (zoneId) => {
    const filtered = zones.filter(z => z.id !== zoneId)
    const saved = saveDeliveryZones(business.business_id, filtered)
    setZones(saved)
  }

  const handleApplyBulkFee = () => {
    if (selectedZoneKeys.length === 0) return
    bulkUpdateZoneFees(business.business_id, selectedZoneKeys, bulkFee)
    loadData()
    setSelectedZoneKeys([])
    showToast('Costo de envío masivo aplicado')
  }

  return (
    <div className="min-h-screen bg-[#0D0E12] text-white font-sans selection:bg-[#FF4B00] selection:text-white pb-24 dashboard-accessibility-fonts">
      {/* Toast Notificación */}
      {savedSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle size={16} /> {savedSuccess}
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-5 py-3 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2">
          <AlertTriangle size={16} /> {errorMessage}
        </div>
      )}

      {/* Header Superior del Dashboard Mobile First */}
      <header className="bg-[#14161F] border-b border-white/5 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF4B00]/10 border border-[#FF4B00]/30 flex items-center justify-center font-black text-[#FF4B00]">
            SB
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">{business.name}</h1>
            <p className="text-[11px] text-gray-400">Dashboard Privado del Restaurante</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 px-3.5 py-2 rounded-xl text-xs font-bold border border-white/5 transition-transform active:scale-95"
            title="Cerrar Sesión del Dashboard"
          >
            <Power size={14} className="text-red-400" /> Salir
          </button>

          <button
            onClick={() => {
              const updatedStatus = !infoForm.is_open
              setInfoForm(prev => ({ ...prev, is_open: updatedStatus }))
              updateBusinessSettings(business.business_id, { is_open: updatedStatus })
              showToast(updatedStatus ? 'Restaurante ABIERTO' : 'Restaurante CERRADO')
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all ${
              infoForm.is_open
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            <Power size={14} /> {infoForm.is_open ? 'ABIERTO' : 'CERRADO (PAUSADO)'}
          </button>

          <a
            href={`/menu/${business.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white px-4 py-2 rounded-full text-xs font-black shadow-lg"
          >
            <ExternalLink size={14} /> Ver Menú Público
          </a>
        </div>
      </header>

      {/* Navegación por Pestañas (Escritorio) */}
      <nav className="hidden md:flex bg-[#14161F]/60 backdrop-blur border-b border-white/5 px-4 sm:px-8 py-3 gap-2 overflow-x-auto">
        <button
          onClick={() => setTab('inicio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'inicio' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Home size={14} /> Inicio
        </button>

        <button
          onClick={() => setTab('info')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'info' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Store size={14} /> Información e Imágenes
        </button>

        <button
          onClick={() => setTab('rrss')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'rrss' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Share2 size={14} /> Redes Sociales
        </button>

        <button
          onClick={() => setTab('categorias')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'categorias' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Layers size={14} /> Categorías ({business.categories?.length || 0})
        </button>

        <button
          onClick={() => setTab('productos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'productos' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Package size={14} /> Productos ({business.products?.length || 0})
        </button>

        <button
          onClick={() => setTab('zonas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'zonas' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <MapPin size={14} /> Servicio a Domicilio ({zones.length})
        </button>

        <button
          onClick={() => setTab('pedidos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'pedidos' || tab === 'clientes' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <ShoppingBag size={14} /> Pedidos y Clientes
        </button>

        <button
          onClick={() => setTab('compartir')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'compartir' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Share2 size={14} /> Compartir
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
        {/* PESTAÑA 1: INFORMACIÓN GENERAL & CARGA MANUAL DE IMÁGENES */}
        {tab === 'info' && (
          <form onSubmit={handleSaveInfo} className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-white border-b border-white/5 pb-3">Información del Negocio e Imágenes</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* Carga Manual de Logotipo */}
              <div className="space-y-2 bg-[#0D0E12] p-4 rounded-2xl border border-white/5">
                <label className="block font-bold text-gray-300">Logotipo del Restaurante</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-black overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                    {infoForm.logo_url ? (
                      <img src={infoForm.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-gray-600" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="inline-flex items-center gap-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-all">
                      <Upload size={14} /> EXAMINAR FOTOS
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        onChange={e => handleImageFileChange(e, url => setInfoForm(prev => ({ ...prev, logo_url: url })))}
                      />
                    </label>
                    {infoForm.logo_url && (
                      <button
                        type="button"
                        onClick={() => setInfoForm(prev => ({ ...prev, logo_url: '' }))}
                        className="text-red-400 hover:underline text-[11px] block"
                      >
                        Eliminar logotipo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Carga Manual de Portada */}
              <div className="space-y-2 bg-[#0D0E12] p-4 rounded-2xl border border-white/5">
                <label className="block font-bold text-gray-300">Imagen de Portada (Header)</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl bg-black overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                    {infoForm.banner_url ? (
                      <img src={infoForm.banner_url} alt="Portada" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-gray-600" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="inline-flex items-center gap-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-all">
                      <Upload size={14} /> EXAMINAR FOTOS
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        onChange={e => handleImageFileChange(e, url => setInfoForm(prev => ({ ...prev, banner_url: url })))}
                      />
                    </label>
                    {infoForm.banner_url && (
                      <button
                        type="button"
                        onClick={() => setInfoForm(prev => ({ ...prev, banner_url: '' }))}
                        className="text-red-400 hover:underline text-[11px] block"
                      >
                        Eliminar portada
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  value={infoForm.name}
                  onChange={e => setInfoForm({ ...infoForm, name: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">WhatsApp para Pedidos (10 dígitos)</label>
                <input
                  type="text"
                  value={infoForm.whatsapp}
                  onChange={e => setInfoForm({ ...infoForm, whatsapp: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Dirección del Establecimiento</label>
                <input
                  type="text"
                  value={infoForm.address}
                  onChange={e => setInfoForm({ ...infoForm, address: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Horario de Atención</label>
                <input
                  type="text"
                  value={infoForm.schedule_text}
                  onChange={e => setInfoForm({ ...infoForm, schedule_text: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-300 mb-1">Descripción / Eslogan del Negocio</label>
                <textarea
                  rows={2}
                  value={infoForm.description}
                  onChange={e => setInfoForm({ ...infoForm, description: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-xs px-6 py-3 rounded-full shadow-lg"
              >
                <Save size={16} /> Guardar Cambios
              </button>
            </div>
          </form>
        )}

        {/* PESTAÑA 2: REDES SOCIALES (RRSS) */}
        {tab === 'rrss' && (
          <form onSubmit={handleSaveInfo} className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-white border-b border-white/5 pb-3">Redes Sociales y Enlaces Oficiales</h2>
            <p className="text-xs text-gray-400">
              Agrega los enlaces a tus perfiles sociales. Únicamente las redes que tengan información guardada se mostrarán en tu menú público.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Facebook (URL completa)</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/tustacos"
                  value={infoForm.facebook_url}
                  onChange={e => setInfoForm({ ...infoForm, facebook_url: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Instagram (URL completa)</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/tustacos"
                  value={infoForm.instagram_url}
                  onChange={e => setInfoForm({ ...infoForm, instagram_url: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">TikTok (URL completa)</label>
                <input
                  type="url"
                  placeholder="https://tiktok.com/@tustacos"
                  value={infoForm.tiktok_url}
                  onChange={e => setInfoForm({ ...infoForm, tiktok_url: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">YouTube (URL completa)</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@tustacos"
                  value={infoForm.youtube_url}
                  onChange={e => setInfoForm({ ...infoForm, youtube_url: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Sitio Web Oficial</label>
                <input
                  type="url"
                  placeholder="https://tustacos.com.mx"
                  value={infoForm.website_url}
                  onChange={e => setInfoForm({ ...infoForm, website_url: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Google Maps (Ubicación en mapa)</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={infoForm.maps_url}
                  onChange={e => setInfoForm({ ...infoForm, maps_url: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-xs px-6 py-3 rounded-full shadow-lg"
              >
                <Save size={16} /> Guardar Redes Sociales
              </button>
            </div>
          </form>
        )}

        {/* PESTAÑA 3: CATEGORÍAS */}
        {tab === 'categorias' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#14161F] p-4 rounded-2xl border border-white/5">
              <h2 className="text-base font-black text-white">Categorías del Menú</h2>
              <button
                onClick={() => setEditingCategory({ name: '', is_visible: true, is_plus: false })}
                className="flex items-center gap-1.5 bg-[#FF4B00] text-white px-4 py-2 rounded-xl text-xs font-black"
              >
                <Plus size={14} /> Nueva Categoría
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {business.categories?.map(cat => (
                <div key={cat.id} className="bg-[#14161F] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{cat.name}</h3>
                    <span className="text-[10px] text-gray-400">
                      {cat.is_visible ? 'Visible en menú' : 'Oculta'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCat(cat.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 4: PRODUCTOS CON ESTADOS (DISPONIBLE, AGOTADO, OCULTO) Y EXAMINAR FOTOS */}
        {tab === 'productos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#14161F] p-4 rounded-2xl border border-white/5">
              <h2 className="text-base font-black text-white">Catálogo de Productos</h2>
              <button
                onClick={() => setEditingProduct({
                  name: '',
                  price: 50,
                  description: '',
                  category_id: business.categories[0]?.id || '',
                  is_active: true,
                  is_out_of_stock: false,
                  is_hidden: false,
                  image_url: ''
                })}
                className="flex items-center gap-1.5 bg-[#FF4B00] text-white px-4 py-2 rounded-xl text-xs font-black"
              >
                <Plus size={14} /> Nuevo Producto
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {business.products?.map(prod => (
                <div key={prod.id} className="bg-[#14161F] p-4 rounded-2xl border border-white/5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-32 rounded-xl bg-black overflow-hidden relative">
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <ImageIcon size={24} />
                        </div>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/80 font-black text-emerald-400 text-xs">
                        ${prod.price}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-white">{prod.name}</h3>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{prod.description}</p>
                  </div>

                  {/* Casilla Sencilla de Estado Agotado / Disponible / Oculto */}
                  <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!prod.is_out_of_stock}
                          onChange={() => handleToggleAgotado(prod.id)}
                          className="rounded border-white/20 text-[#FF4B00] focus:ring-0"
                        />
                        <span className={`font-bold ${!prod.is_out_of_stock ? 'text-emerald-400' : 'text-amber-400 font-black'}`}>
                          {!prod.is_out_of_stock ? 'DISPONIBLE' : 'AGOTADO'}
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleToggleOculto(prod.id)}
                        className={`flex items-center gap-1 text-[11px] font-bold ${prod.is_hidden ? 'text-gray-500' : 'text-gray-300'}`}
                      >
                        {prod.is_hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                        {prod.is_hidden ? 'Oculto' : 'Visible'}
                      </button>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setEditingProduct(prod)} className="p-1.5 rounded-lg bg-white/5 text-gray-300">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteProd(prod.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 5: SERVICIO A DOMICILIO Y REPARTO POR COLONIA */}
        {tab === 'zonas' && (
          <div className="space-y-6">
            {/* Controles Principales del Servicio a Domicilio */}
            <form onSubmit={handleSaveInfo} className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl">
              <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <MapPin className="text-[#FF4B00]" size={20} /> Configuración de Servicio a Domicilio
              </h2>

              <div className="space-y-4 text-xs">
                {/* Control 1: Agregar Servicio a Domicilio */}
                <label className="flex items-center gap-3 p-3 bg-[#0D0E12] rounded-xl border border-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={infoForm.has_delivery}
                    onChange={e => setInfoForm({ ...infoForm, has_delivery: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FF4B00] focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-white text-sm block">AGREGAR SERVICIO A DOMICILIO</span>
                    <span className="text-gray-400 text-[11px]">Habilita la opción de entrega a domicilio en el carrito de tu menú público.</span>
                  </div>
                </label>

                {infoForm.has_delivery && (
                  <div className="space-y-4 pl-4 border-l-2 border-[#FF4B00]/40 animate-fade-in">
                    {/* Control 2: Envío Gratis */}
                    <label className="flex items-center gap-3 p-3 bg-[#0D0E12] rounded-xl border border-white/5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={infoForm.free_delivery}
                        onChange={e => setInfoForm({ ...infoForm, free_delivery: e.target.checked })}
                        className="w-4 h-4 rounded text-[#FF4B00] focus:ring-0"
                      />
                      <div>
                        <span className="font-bold text-emerald-400 text-sm block">SERVICIO A DOMICILIO GRATIS</span>
                        <span className="text-gray-400 text-[11px]">Todas las colonias seleccionadas tendrán costo $0 y se mostrará ENVÍO GRATIS.</span>
                      </div>
                    </label>

                    {!infoForm.free_delivery && (
                      <div className="space-y-3 p-4 bg-[#0D0E12] rounded-xl border border-white/5">
                        <label className="block font-bold text-white mb-2">¿Deseas usar el mismo costo para todas las colonias?</label>
                        
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="use_general_fee"
                              checked={infoForm.use_general_fee === true}
                              onChange={() => setInfoForm({ ...infoForm, use_general_fee: true })}
                              className="text-[#FF4B00]"
                            />
                            <span className="text-gray-300 font-bold">Sí (Costo General Único)</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="use_general_fee"
                              checked={infoForm.use_general_fee === false}
                              onChange={() => setInfoForm({ ...infoForm, use_general_fee: false })}
                              className="text-[#FF4B00]"
                            />
                            <span className="text-gray-300 font-bold">No (Costo Individual por Colonia)</span>
                          </label>
                        </div>

                        {infoForm.use_general_fee && (
                          <div className="pt-2">
                            <label className="block font-bold text-gray-300 mb-1">COSTO GENERAL DE ENVÍO ($ MXN)</label>
                            <input
                              type="number"
                              value={infoForm.base_delivery_fee}
                              onChange={e => setInfoForm({ ...infoForm, base_delivery_fee: e.target.value })}
                              className="w-48 bg-black border border-white/20 rounded-xl px-4 py-2 font-mono text-emerald-400 font-bold text-sm"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-xs px-6 py-3 rounded-full shadow-lg"
                >
                  <Save size={16} /> Guardar Configuración de Reparto
                </button>
              </div>
            </form>

            {/* Catálogo de Colonias y Reparto (Sólo si servicio a domicilio está activo) */}
            {infoForm.has_delivery && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Search className="text-[#FF4B00]" size={18} /> Buscador de Colonias Oficiales (Tuxtla Gutiérrez)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-300 mb-1">Buscar por Código Postal (CP)</label>
                      <input
                        type="text"
                        placeholder="Ej. 29000"
                        value={cpSearch}
                        onChange={e => setCpSearch(e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-300 mb-1">Buscar por Nombre de Colonia</label>
                      <input
                        type="text"
                        placeholder="Ej. Centro, Terán, Moctezuma"
                        value={coloniaSearch}
                        onChange={e => setColoniaSearch(e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  {resultsByCP.length > 0 && (
                    <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/10 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-400">{resultsByCP.length} colonias encontradas para CP {cpSearch}</span>
                        <button
                          onClick={() => handleAddAllFromCP(resultsByCP)}
                          className="bg-[#FF4B00] text-white px-3 py-1 rounded-lg font-bold"
                        >
                          + Agregar todas las colonias del CP
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                        {resultsByCP.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAddSettlement(item)}
                            className="bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg text-gray-300 text-[11px] border border-white/5"
                          >
                            + {item.colonia} ({item.tipo})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {resultsByColonia.length > 0 && (
                    <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/10 space-y-2 text-xs">
                      <span className="font-bold text-emerald-400">{resultsByColonia.length} colonias encontradas</span>
                      <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                        {resultsByColonia.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAddSettlement(item)}
                            className="bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg text-gray-300 text-[11px] border border-white/5"
                          >
                            + {item.colonia} (CP {item.cp})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Secciones Colonias Seleccionadas y Edición Masiva */}
                <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
                    <h3 className="font-black text-sm text-white">COLONIAS SELECCIONADAS Y ACTIVAS ({zones.length})</h3>

                    {selectedZoneKeys.length > 0 && !infoForm.free_delivery && (
                      <div className="flex items-center gap-2 bg-[#0D0E12] p-2 rounded-xl border border-[#FF4B00]/30 text-xs">
                        <span>{selectedZoneKeys.length} seleccionadas. Asignar costo: $</span>
                        <input
                          type="number"
                          value={bulkFee}
                          onChange={e => setBulkFee(e.target.value)}
                          className="w-16 bg-black border border-white/20 rounded px-2 py-0.5 text-emerald-400 font-bold"
                        />
                        <button onClick={handleApplyBulkFee} className="bg-[#FF4B00] text-white px-3 py-1 rounded-lg font-bold">
                          Aplicar a Seleccionadas
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {zones.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6">No has seleccionado colonias de entrega. Utiliza el buscador superior.</p>
                    ) : (
                      zones.map(z => {
                        const key = `${z.postal_code}_${z.settlement_name}`
                        const isSelected = selectedZoneKeys.includes(key)
                        return (
                          <div key={z.id} className="bg-[#0D0E12] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={e => {
                                  if (e.target.checked) setSelectedZoneKeys([...selectedZoneKeys, key])
                                  else setSelectedZoneKeys(selectedZoneKeys.filter(k => k !== key))
                                }}
                                className="rounded border-white/20"
                              />
                              <div>
                                <span className="font-bold text-white">{z.settlement_name}</span>
                                <span className="text-[10px] text-gray-400 ml-2">CP {z.postal_code} · {z.settlement_type}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-bold text-emerald-400 font-mono">
                                {infoForm.free_delivery ? 'GRATIS' : `$${z.delivery_fee}`}
                              </span>
                              <button onClick={() => handleRemoveZone(z.id)} className="text-red-400 hover:text-red-300">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN EXTRA AL FINAL: CONFIGURACIÓN MÉTODOS DE PAGO */}
            <div className="pt-8 border-t border-white/10">
              <RestaurantPaymentMethodsTab business={business} onUpdateBusiness={loadData} />
            </div>
          </div>
        )}

        {/* PESTAÑA UNIFICADA: PEDIDOS Y CLIENTES */}
        {(tab === 'pedidos' || tab === 'clientes') && (
          <div className="space-y-6">
            <div className="flex bg-[#14161F] p-1.5 rounded-2xl border border-white/5 max-w-md">
              <button
                type="button"
                onClick={() => setTab('pedidos')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  tab === 'pedidos' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <ShoppingBag size={14} /> Historial de Pedidos
              </button>
              <button
                type="button"
                onClick={() => setTab('clientes')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  tab === 'clientes' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users size={14} /> Base de Clientes
              </button>
            </div>

            {tab === 'pedidos' ? (
              <RestaurantOrdersTab businessId={business.slug || business.business_id || business.id} businessName={business.name} />
            ) : (
              <RestaurantCustomersTab businessId={business.slug || business.business_id || business.id} businessName={business.name} />
            )}
          </div>
        )}

        {/* PESTAÑA NUEVA: INICIO (Dashboard Resumen & Control) */}
        {tab === 'inicio' && (
          <div className="space-y-6 animate-fade-in">
            {/* Tarjeta de bienvenida y estado general */}
            <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FF4B00]/10 border border-[#FF4B00]/30 flex items-center justify-center font-black text-[#FF4B00] text-lg">
                    SB
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">{business.name}</h2>
                    <p className="text-xs text-gray-400">Resumen y Control Operativo</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updatedStatus = !infoForm.is_open
                    setInfoForm(prev => ({ ...prev, is_open: updatedStatus }))
                    updateBusinessSettings(business.business_id, { is_open: updatedStatus })
                    showToast(updatedStatus ? 'Restaurante ABIERTO' : 'Restaurante CERRADO')
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                    infoForm.is_open
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  <Power size={14} /> {infoForm.is_open ? 'ABIERTO AHORA' : 'CERRADO (PAUSADO)'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/5 space-y-2">
                  <span className="text-gray-400 block font-bold uppercase tracking-wider text-[10px]">Menú Digital Público</span>
                  <a
                    href={`/menu/${business.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1.5 text-sm"
                  >
                    <ExternalLink size={16} /> /menu/{business.slug}
                  </a>
                </div>

                <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/5 space-y-2">
                  <span className="text-gray-400 block font-bold uppercase tracking-wider text-[10px]">Horario de Atención</span>
                  <span className="text-white font-medium text-sm block">{infoForm.schedule_text || 'Sin horario configurado'}</span>
                </div>
              </div>
            </div>

            {/* Configuración del Mensaje Destacado */}
            <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider text-gray-300">Mensaje Destacado en Menú</h3>
              <p className="text-xs text-gray-400">
                Este mensaje aparece de manera fija en la parte superior del menú público. Límite de 80 caracteres.
              </p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={80}
                  value={infoForm.main_message}
                  onChange={e => setInfoForm({ ...infoForm, main_message: e.target.value })}
                  placeholder="Ej. 🚀 Envío gratis en tu primer pedido / 🔥 Promoción especial hoy"
                  className="flex-1 bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#FF4B00]"
                />
                <button
                  type="button"
                  onClick={() => {
                    updateBusinessSettings(business.business_id, { main_message: infoForm.main_message })
                    showToast('Mensaje destacado guardado')
                  }}
                  className="bg-[#FF4B00] hover:bg-[#FF6A1A] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all active:scale-95"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA NUEVA: COMPARTIR MENÚ (Preview & Share) */}
        {tab === 'compartir' && (
          <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Share2 size={20} className="text-[#FF4B00]" /> Compartir Menú Digital
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                Comparte el enlace de tu menú digital en tus redes sociales o directamente con tus clientes para recibir pedidos directos.
              </p>
            </div>

            {/* Vista previa simulada de tarjeta social (WhatsApp/FB) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Previsualización Social (Open Graph)</span>
              <div className="bg-[#0D0E12] border border-white/10 rounded-2xl overflow-hidden max-w-sm shadow-inner text-xs">
                {infoForm.banner_url ? (
                  <div className="h-40 bg-black overflow-hidden relative">
                    <img src={infoForm.banner_url} alt="Portada" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-40 bg-black/40 flex items-center justify-center text-gray-600">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="p-4 space-y-1">
                  <span className="text-emerald-500 font-mono text-[10px] block">streetboss.com.mx</span>
                  <strong className="text-white font-bold text-sm block">{business.name} — Menú Digital</strong>
                  <p className="text-gray-400 text-[11px] line-clamp-2">
                    {infoForm.description || `Menú digital oficial de ${business.name}. Haz tu pedido al instante por WhatsApp sin comisiones.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones de compartir */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  const url = `https://streetboss.com.mx/menu/${business.slug}`
                  navigator.clipboard.writeText(url)
                  showToast('¡Enlace copiado al portapapeles!')
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/5 text-gray-200 hover:text-white px-4 py-3 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Copy size={16} /> Copiar Enlace
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Te comparto el menú digital de *${business.name}*. Entra aquí para ver nuestros productos y haz tu pedido directo por WhatsApp sin comisiones: https://streetboss.com.mx/menu/${business.slug}`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Send size={16} /> Compartir por WhatsApp
              </a>

              <button
                type="button"
                onClick={() => {
                  const shareData = {
                    title: `${business.name} — Menú Digital`,
                    text: `Te comparto el menú digital de ${business.name}. Haz tu pedido directo por WhatsApp sin comisiones.`,
                    url: `https://streetboss.com.mx/menu/${business.slug}`
                  }
                  if (navigator.share) {
                    navigator.share(shareData).catch(() => {})
                  } else {
                    navigator.clipboard.writeText(shareData.url)
                    showToast('¡Enlace copiado al portapapeles!')
                  }
                }}
                className="bg-[#FF4B00]/10 hover:bg-[#FF4B00]/20 border border-[#FF4B00]/20 text-[#FF4B00] px-4 py-3 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Share2 size={16} /> Compartir Menú
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA NUEVA: MENÚ MÓVIL (Categorías & Productos Agrupados) */}
        {tab === 'menu' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex bg-[#14161F] p-1.5 rounded-2xl border border-white/5 max-w-xs">
              <button
                type="button"
                onClick={() => setMenuSubTab('categorias')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  menuSubTab === 'categorias' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Layers size={14} /> Categorías
              </button>
              <button
                type="button"
                onClick={() => setMenuSubTab('productos')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  menuSubTab === 'productos' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Package size={14} /> Productos
              </button>
            </div>

            {menuSubTab === 'categorias' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#14161F] p-4 rounded-2xl border border-white/5">
                  <h2 className="text-base font-black text-white">Categorías del Menú</h2>
                  <button
                    onClick={() => setEditingCategory({ name: '', is_visible: true, is_plus: false })}
                    className="flex items-center gap-1.5 bg-[#FF4B00] text-white px-4 py-2 rounded-xl text-xs font-black"
                  >
                    <Plus size={14} /> Nueva Categoría
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {business.categories?.map(cat => (
                    <div key={cat.id} className="bg-[#14161F] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-white">{cat.name}</h3>
                        <span className="text-[10px] text-gray-400">
                          {cat.is_visible ? 'Visible en menú' : 'Oculta'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCat(cat.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#14161F] p-4 rounded-2xl border border-white/5">
                  <h2 className="text-base font-black text-white">Catálogo de Productos</h2>
                  <button
                    onClick={() => setEditingProduct({
                      name: '',
                      price: 50,
                      description: '',
                      category_id: business.categories[0]?.id || '',
                      is_active: true,
                      is_out_of_stock: false,
                      is_hidden: false,
                      image_url: ''
                    })}
                    className="flex items-center gap-1.5 bg-[#FF4B00] text-white px-4 py-2 rounded-xl text-xs font-black"
                  >
                    <Plus size={14} /> Nuevo Producto
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {business.products?.map(prod => (
                    <div key={prod.id} className="bg-[#14161F] p-4 rounded-2xl border border-white/5 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-32 rounded-xl bg-black overflow-hidden relative">
                          {prod.image_url ? (
                            <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <ImageIcon size={24} />
                            </div>
                          )}
                          <span className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/80 font-black text-emerald-400 text-xs">
                            ${prod.price}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-sm text-white">{prod.name}</h3>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2">{prod.description}</p>
                      </div>

                      <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!prod.is_out_of_stock}
                              onChange={() => handleToggleAgotado(prod.id)}
                              className="rounded border-white/20 text-[#FF4B00] focus:ring-0"
                            />
                            <span className={`font-bold ${!prod.is_out_of_stock ? 'text-emerald-400' : 'text-amber-400 font-black'}`}>
                              {!prod.is_out_of_stock ? 'DISPONIBLE' : 'AGOTADO'}
                            </span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleToggleOculto(prod.id)}
                            className={`flex items-center gap-1 text-[11px] font-bold ${prod.is_hidden ? 'text-gray-500' : 'text-gray-300'}`}
                          >
                            {prod.is_hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                            {prod.is_hidden ? 'Oculto' : 'Visible'}
                          </button>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button onClick={() => setEditingProduct(prod)} className="p-1.5 rounded-lg bg-white/5 text-gray-300">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteProd(prod.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA NUEVA: MÁS (Configuración estilo iOS Settings) */}
        {tab === 'mas' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header del menú */}
            <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 shadow-xl">
              <h2 className="text-lg font-black text-white border-b border-white/5 pb-3">
                Configuración del Sistema
              </h2>
              <p className="text-xs text-gray-400 mt-2 font-normal">
                Ajustes adicionales de reparto, canales sociales, métodos de cobro y base de comensales.
              </p>
            </div>

            {/* Menú agrupado tipo iOS Settings */}
            <div className="bg-[#14161F] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
              <div className="divide-y divide-white/5">
                {/* 1. Compartir Menú */}
                <button
                  type="button"
                  onClick={() => setTab('compartir')}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 text-left transition-all active:scale-[0.99] group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
                      <Share2 size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="text-white block font-black text-sm group-hover:text-[#FF4B00] transition-colors">Compartir Menú</span>
                      <span className="text-xs text-gray-400 font-normal">Enlace público, códigos y QR para comensales</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </button>

                {/* 2. Redes Sociales */}
                <button
                  type="button"
                  onClick={() => setTab('rrss')}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 text-left transition-all active:scale-[0.99] group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center shadow-md">
                      <Globe size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="text-white block font-black text-sm group-hover:text-[#FF4B00] transition-colors">Redes Sociales</span>
                      <span className="text-xs text-gray-400 font-normal">Perfiles de Instagram, Facebook, TikTok y YouTube</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </button>

                {/* 3. Zonas de Reparto y Pagos */}
                <button
                  type="button"
                  onClick={() => setTab('zonas')}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 text-left transition-all active:scale-[0.99] group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="text-white block font-black text-sm group-hover:text-[#FF4B00] transition-colors">Zonas de Envío y Pagos</span>
                      <span className="text-xs text-gray-400 font-normal">Costos por colonia, pedidos mínimos y cuentas bancarias</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </button>

                {/* 4. Cartera de Clientes */}
                <button
                  type="button"
                  onClick={() => setTab('clientes')}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 text-left transition-all active:scale-[0.99] group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-500 flex items-center justify-center shadow-md">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="text-white block font-black text-sm group-hover:text-[#FF4B00] transition-colors">Mis Clientes (B2C)</span>
                      <span className="text-xs text-gray-400 font-normal">Directorio de clientes, consumos y consentimientos</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Discreto con Identificación de Versión */}
        <VersionFooterBadge clientId={business.slug} userId={business.owner_username || 'b2b_owner'} />
      </main>

      {/* Modal Editar Categoría */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveCat} className="bg-[#14161F] border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-white text-base">Guardar Categoría</h3>
            <input
              type="text"
              required
              placeholder="Nombre de la categoría"
              value={editingCategory.name}
              onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingCategory(null)} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 font-bold">Cancelar</button>
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#FF4B00] text-white text-xs font-black">Guardar</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Editar Producto con Carga Manual de Imagen */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveProd} className="bg-[#14161F] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs my-8">
            <h3 className="font-black text-white text-base">Editar / Crear Producto</h3>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Categoría</label>
              <select
                value={editingProduct.category_id}
                onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
              >
                {business.categories?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Nombre del Producto</label>
              <input
                type="text"
                required
                value={editingProduct.name}
                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Precio ($ MXN)</label>
              <input
                type="number"
                required
                value={editingProduct.price}
                onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Descripción</label>
              <textarea
                rows={2}
                value={editingProduct.description}
                onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            {/* Carga Manual de Imagen del Producto */}
            <div className="space-y-2 bg-[#0D0E12] p-3 rounded-xl border border-white/5">
              <label className="block text-gray-300 font-bold">Fotografía del Producto</label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-black overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                  {editingProduct.image_url ? (
                    <img src={editingProduct.image_url} alt="Producto" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={20} className="text-gray-600" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <label className="inline-flex items-center gap-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all text-xs">
                    <Upload size={12} /> EXAMINAR FOTOS
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={e => handleImageFileChange(e, url => setEditingProduct(prev => ({ ...prev, image_url: url })))}
                    />
                  </label>
                  {editingProduct.image_url && (
                    <button
                      type="button"
                      onClick={() => setEditingProduct(prev => ({ ...prev, image_url: '' }))}
                      className="text-red-400 hover:underline text-[10px] block"
                    >
                      Quitar foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Controles Disponibilidad / Oculto */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.is_out_of_stock}
                  onChange={e => setEditingProduct({ ...editingProduct, is_out_of_stock: e.target.checked })}
                  className="rounded text-[#FF4B00]"
                />
                <span className="font-bold text-amber-400">Marcar como AGOTADO</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.is_hidden}
                  onChange={e => setEditingProduct({ ...editingProduct, is_hidden: e.target.checked })}
                  className="rounded text-gray-400"
                />
                <span className="font-bold text-gray-400">OCULTAR PRODUCTO (no aparecerá en el menú)</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <button type="button" onClick={() => setEditingProduct(null)} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 font-bold">Cancelar</button>
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#FF4B00] text-white text-xs font-black">Guardar Producto</button>
            </div>
          </form>
        </div>
      )}

      {/* Barra de Navegación Inferior (Bottom Navigation) Mobile First */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#14161F] border-t border-white/5 px-2 py-2 flex justify-around items-center shadow-[0_-5px_20px_rgba(0,0,0,0.5)] pb-[calc(12px+env(safe-area-inset-bottom))]">
        <button
          onClick={() => setTab('inicio')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all py-1 px-3.5 rounded-xl ${
            tab === 'inicio' ? 'text-[#FF4B00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home size={20} />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => { setTab('menu'); if (menuSubTab === '') setMenuSubTab('productos') }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all py-1 px-3.5 rounded-xl ${
            tab === 'menu' || tab === 'categorias' || tab === 'productos' ? 'text-[#FF4B00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Package size={20} />
          <span>Menú</span>
        </button>

        <button
          onClick={() => setTab('info')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all py-1 px-3.5 rounded-xl ${
            tab === 'info' ? 'text-[#FF4B00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Store size={20} />
          <span>Negocio</span>
        </button>

        <button
          onClick={() => setTab('pedidos')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all py-1 px-3.5 rounded-xl ${
            tab === 'pedidos' ? 'text-[#FF4B00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingBag size={20} />
          <span>Pedidos</span>
        </button>

        <button
          onClick={() => setTab('mas')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all py-1 px-3.5 rounded-xl ${
            tab === 'mas' || tab === 'rrss' || tab === 'zonas' || tab === 'clientes' || tab === 'compartir' ? 'text-[#FF4B00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers size={20} />
          <span>Más</span>
        </button>
      </nav>
    </div>
  )
}
