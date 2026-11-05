import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getBusinessBySlug,
  updateBusinessSettings,
  saveBusinessSettings,
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
  subscribeToOrdersRealtime,
  resolveBusinessBySlug,
  syncBusinessToSupabase
} from '../services/crmV3Service'
import { buscarPorCPSync, buscarPorColoniaSync } from '../data/sepomexTuxtla'
import RestaurantCustomersTab from '../components/crm/RestaurantCustomersTab'
import RestaurantOrdersTab from '../components/crm/RestaurantOrdersTab'
import RestaurantPaymentMethodsTab from '../components/crm/RestaurantPaymentMethodsTab'
import RestaurantInsightsTab from '../components/crm/RestaurantInsightsTab'
import TutorialLibrary from '../components/TutorialLibrary'
import RestaurantSetupHome from '../components/RestaurantSetupHome'
import MenuDigital from './MenuDigital'
import {
  Home,
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
  ChevronRight,
  Copy,
  Send,
  UtensilsCrossed,
  Truck,
  Settings,
  BarChart3,
  MapPinned,
  Video
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
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingStatus, setSavingStatus] = useState(false)
  const profileDirty = useRef(false)

  // Information & RRSS Form
  const [infoForm, setInfoForm] = useState({})
  
  // Modal Categorías
  const [editingCategory, setEditingCategory] = useState(null)
  
  // Modal Productos
  const [editingProduct, setEditingProduct] = useState(null)

  // Preferencia de Tamaño de Letra (Accesibilidad)
  const [fontSizePreference, setFontSizePreference] = useState(() => localStorage.getItem('sb_b2b_font_size') || 'normal')

  const toggleFontSize = () => {
    const nextSize = fontSizePreference === 'normal' ? 'large' : 'normal'
    setFontSizePreference(nextSize)
    localStorage.setItem('sb_b2b_font_size', nextSize)
    showToast(nextSize === 'large' ? 'Fuentes Grandes Activadas' : 'Tamaño Estándar Activado')
  }

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
      if (!profileDirty.current) setInfoForm({
        name: b.name || '',
        description: b.description || '',
        whatsapp: b.whatsapp || '',
        phone: b.phone || '',
        address: b.address || '',
        colonia: b.colonia || '',
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
    profileDirty.current = false
    const resolveBusiness = () => {
      if (document.visibilityState === 'hidden') return
      resolveBusinessBySlug(slug).then(() => loadData())
    }

    resolveBusiness()
    const unsubscribe = subscribeCentralSync(() => {
      resolveBusiness()
    })

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') resolveBusiness()
    }
    window.addEventListener('online', resolveBusiness)
    window.addEventListener('pageshow', resolveBusiness)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      unsubscribe()
      window.removeEventListener('online', resolveBusiness)
      window.removeEventListener('pageshow', resolveBusiness)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
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

    let refreshInFlight = null
    const refreshCloudData = () => {
      if (document.visibilityState === 'hidden' || refreshInFlight) return refreshInFlight
      refreshInFlight = syncOrdersFromSupabase(business.business_id)
        .then(() => loadData())
        .finally(() => { refreshInFlight = null })
      return refreshInFlight
    }

    // Descargar historial inicial y volver a sincronizar cuando el móvil despierta.
    refreshCloudData()

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

    const handleResume = () => refreshCloudData()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshCloudData()
    }
    window.addEventListener('focus', handleResume)
    window.addEventListener('online', handleResume)
    window.addEventListener('pageshow', handleResume)
    document.addEventListener('visibilitychange', handleVisibility)
    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') refreshCloudData()
    }, 45000)

    return () => {
      unsubscribeRealtime()
      window.removeEventListener('focus', handleResume)
      window.removeEventListener('online', handleResume)
      window.removeEventListener('pageshow', handleResume)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.clearInterval(refreshTimer)
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
                Tu espacio privado
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
  const handleSaveInfo = async (e) => {
    e.preventDefault()
    if (savingProfile) return
    setSavingProfile(true)
    const previousProfile = Object.fromEntries(Object.keys(infoForm).map(key => [key, business[key]]))
    try {
      await saveBusinessSettings(business.business_id, infoForm)
      profileDirty.current = false
      loadData()
      showToast('Tu perfil quedó guardado')
    } catch {
      updateBusinessSettings(business.business_id, previousProfile, { sync: false, notify: false })
      showError('No se pudo guardar el perfil. Revisa tu conexión e inténtalo de nuevo.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleToggleOpen = async () => {
    if (savingStatus) return
    setSavingStatus(true)
    const next = !infoForm.is_open
    try {
      await saveBusinessSettings(business.business_id, { is_open: next })
      setInfoForm(previous => ({ ...previous, is_open: next }))
      loadData()
      showToast(next ? 'Tu negocio está abierto' : 'Tu negocio está pausado')
    } catch {
      updateBusinessSettings(business.business_id, { is_open: business.is_open }, { sync: false, notify: false })
      showError('No se pudo cambiar el estado. Revisa tu conexión.')
    } finally {
      setSavingStatus(false)
    }
  }

  // 2. Categorías
  const handleSaveCat = async (e) => {
    e.preventDefault()
    if (!editingCategory?.name) return
    try {
      await saveCategory(business.business_id, editingCategory)
      setEditingCategory(null)
      loadData()
      showToast('Categoría guardada en línea')
    } catch (error) {
      loadData()
      showError('No se pudo guardar la categoría en línea. Inténtalo nuevamente.')
    }
  }

  const handleDeleteCat = (catId) => {
    if (window.confirm('¿Eliminar esta categoría y sus productos asociados?')) {
      deleteCategory(catId)
      loadData()
      showToast('Categoría eliminada')
    }
  }

  // 3. Productos y Estados (Disponible, Agotado, Oculto)
  const handleSaveProd = async (e) => {
    e.preventDefault()
    if (!editingProduct?.name || !editingProduct?.category_id) return
    try {
      await saveProduct(business.business_id, editingProduct)
      setEditingProduct(null)
      loadData()
      showToast('Producto guardado en línea')
    } catch (error) {
      showError('No se pudo guardar el producto en línea. Inténtalo nuevamente.')
    }
  }

  const handleToggleAgotado = async (prodId) => {
    try {
      await toggleProductAvailability(prodId)
      loadData()
      showToast('Disponibilidad actualizada en línea')
    } catch (error) {
      loadData()
      showError('No se pudo actualizar la disponibilidad en línea.')
    }
  }

  const handleToggleOculto = async (prodId) => {
    try {
      await toggleProductVisibility(prodId)
      loadData()
      showToast('Visibilidad actualizada en línea')
    } catch (error) {
      loadData()
      showError('No se pudo actualizar la visibilidad en línea.')
    }
  }

  const handleDeleteProd = (prodId) => {
    if (window.confirm('¿Eliminar este producto?')) {
      deleteProduct(prodId)
      loadData()
      showToast('Producto eliminado')
    }
  }

  const handleMenuImageFile = async (file, field) => {
    if (!file) return
    try {
      const dataUrl = await readFileAsDataURL(file)
      updateBusinessSettings(business.business_id, { [field]: dataUrl })
      setInfoForm(prev => ({ ...prev, [field]: dataUrl }))
      loadData()
      showToast(field === 'banner_url' ? 'Portada actualizada' : 'Logo actualizado')
    } catch (err) {
      showError(err.message)
    }
  }

  const editableMenu = (business.categories || []).map(cat => ({
    ...cat,
    nombre: cat.name,
    tipo: cat.category_type || 'normal',
    esPlus: cat.is_plus || false,
    visible: cat.is_visible !== false,
    productos: (business.products || [])
      .filter(prod => prod.category_id === cat.id)
      .map(prod => ({
        ...prod,
        nombre: prod.name,
        precio: Number(prod.price || 0),
        descripcion: prod.description || '',
        foto: prod.image_url || '',
        agotado: prod.is_out_of_stock || false,
        activo: prod.is_active !== false,
        oculto: prod.is_hidden || false,
      }))
  }))

  const editableMenuConfig = {
    negocio: business.name,
    description: infoForm.description || '',
    logo: infoForm.logo_url,
    banner: infoForm.banner_url,
    colorMarca: infoForm.brand_color || '#FF4B00',
    whatsapp: infoForm.whatsapp || infoForm.phone,
    telefono: infoForm.phone,
    mensajeClientes: infoForm.main_message,
    orderCtaText: infoForm.schedule_daily?.order_cta_text || business.schedule_daily?.order_cta_text || '',
    foodType: business.business_type || business.description,
    is_open: infoForm.is_open,
    direccion: infoForm.address,
    horarios: infoForm.schedule_text,
    urlMaps: infoForm.maps_url,
    redes: {
      facebook: infoForm.facebook_url,
      instagram: infoForm.instagram_url,
      tiktok: infoForm.tiktok_url,
      youtube: infoForm.youtube_url,
      website: infoForm.website_url,
    },
  }

  // 4. Zonas de Entrega (Tuxtla Gutiérrez Síncrono)
  const resultsByCP = cpSearch ? buscarPorCPSync(cpSearch) : []
  const resultsByColonia = coloniaSearch ? buscarPorColoniaSync(coloniaSearch) : []
  const suggestedSettlements = (() => {
    const byPostalCode = buscarPorCPSync(infoForm.postal_code || '')
    if (byPostalCode.length) return byPostalCode.slice(0, 12)

    const addressColonia = infoForm.colonia || String(infoForm.address || '')
      .split(',')
      .map(part => part.replace(/\b(col\.?|colonia)\b/gi, '').trim())
      .find(part => buscarPorColoniaSync(part).length > 0)
    return addressColonia ? buscarPorColoniaSync(addressColonia).slice(0, 12) : []
  })()

  const handleAddSettlement = async (item, fee = 30) => {
    const existing = zones.find(z => z.postal_code === item.cp && z.settlement_name === item.colonia)
    if (!existing) {
      const finalFee = infoForm.free_delivery ? 0 : (infoForm.use_general_fee ? Number(infoForm.base_delivery_fee ?? 30) : fee)
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
      try {
        const saved = await saveDeliveryZones(business.business_id, newZones)
        setZones(saved)
        showToast(`Colonia ${item.colonia} agregada en línea`)
      } catch (error) {
        showError('No se pudo guardar la colonia en línea.')
      }
    }
  }

  const handleAddAllFromCP = async (cpItems) => {
    const newZones = [...zones]
    const finalFee = infoForm.free_delivery ? 0 : Number(infoForm.base_delivery_fee ?? 30)
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
    try {
      const saved = await saveDeliveryZones(business.business_id, newZones)
      setZones(saved)
      showToast('Colonias agregadas al reparto en línea')
    } catch (error) {
      showError('No se pudieron guardar las colonias en línea.')
    }
  }

  const handleRemoveZone = async (zoneId) => {
    const filtered = zones.filter(z => z.id !== zoneId)
    try {
      const saved = await saveDeliveryZones(business.business_id, filtered)
      setZones(saved)
      showToast('Colonia retirada del reparto')
    } catch (error) {
      showError('No se pudo retirar la colonia en línea.')
    }
  }

  const handleApplyBulkFee = async () => {
    if (selectedZoneKeys.length === 0) return
    try {
      const saved = await bulkUpdateZoneFees(business.business_id, selectedZoneKeys, bulkFee)
      setZones(saved)
      setSelectedZoneKeys([])
      showToast('Costo de envío masivo aplicado en línea')
    } catch (error) {
      showError('No se pudo guardar el costo en línea.')
    }
  }

  const handleZoneFeeChange = (zoneId, value) => {
    const fee = Math.max(0, Number(value || 0))
    setZones(current => current.map(zone =>
      zone.id === zoneId ? { ...zone, delivery_fee: fee } : zone
    ))
  }

  const handleZoneFeeSave = async () => {
    try {
      const saved = await saveDeliveryZones(business.business_id, zones)
      setZones(saved)
      showToast('Costo individual guardado en línea')
    } catch (error) {
      showError('No se pudo guardar el costo individual en línea.')
    }
  }

  return (
    <div className={`min-h-screen bg-[#0D0E12] text-white font-sans selection:bg-[#FF4B00] selection:text-white pb-24 dashboard-accessibility-fonts ${fontSizePreference === 'large' ? 'font-size-large' : ''}`}>
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
      <header className="bg-[#14161F] border-b border-white/5 px-4 sm:px-8 py-4 flex flex-row justify-between items-center gap-3 relative z-40">
        <div className="flex min-w-0 items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF4B00]/10 border border-[#FF4B00]/30 flex items-center justify-center font-black text-[#FF4B00]">
            SB
          </div>
          <div>
            <h1 className="break-words text-base sm:text-lg font-black text-white">{business.name}</h1>
            <p className="text-[11px] text-gray-400">Mi restaurante</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 px-3.5 py-2 rounded-xl text-xs font-bold border border-white/5 transition-transform active:scale-95"
            title="Cerrar Sesión del Dashboard"
          >
            <Power size={14} className="text-red-400" /> Salir
          </button>

          <button
            onClick={handleToggleOpen}
            disabled={savingStatus}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all ${
              infoForm.is_open
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            <Power size={14} /> {infoForm.is_open ? 'ABIERTO' : 'CERRADO (PAUSADO)'}
          </button>

          {/* Selector de Tamaño de Letra (Accesibilidad B2B) */}
          <button
            type="button"
            onClick={toggleFontSize}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black border transition-transform active:scale-95 ${
              fontSizePreference === 'large'
                ? 'bg-[#FF4B00]/10 text-[#FF6A1A] border-[#FF4B00]/30 shadow-inner'
                : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
            }`}
            title={fontSizePreference === 'large' ? 'Volver al tamaño de letra normal' : 'Agrandar tamaño de letra para mejor lectura'}
          >
            <span className="font-mono font-black tracking-tighter text-xs">A{fontSizePreference === 'large' ? '++' : '+'}</span>
            <span className="hidden md:inline text-[10px] uppercase tracking-wider">Texto {fontSizePreference === 'large' ? 'Grande' : 'Normal'}</span>
          </button>

          <a
            href={`/menu/${business.slug}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white px-4 py-2 rounded-full text-xs font-black shadow-lg"
          >
            <ExternalLink size={14} /> Ver Menú Público
          </a>
        </div>
      </header>

      {/* Navegación por Pestañas (Escritorio) */}
      <nav className="hidden bg-[#14161F]/60 backdrop-blur border-b border-white/5 px-4 sm:px-8 py-3 gap-2 overflow-x-auto">
        <button
          onClick={() => setTab('inicio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'inicio' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Home size={14} /> Inicio
        </button>

        <button
          onClick={() => setTab('menu-editor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'menu-editor' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <UtensilsCrossed size={14} /> Configurar menú
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
          <MapPin size={14} /> Colonias de reparto ({zones.length})
        </button>

        <button
          onClick={() => setTab('pedidos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'pedidos' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <ShoppingBag size={14} /> Pedidos
        </button>

        <button
          onClick={() => setTab('clientes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'clientes' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Users size={14} /> Mis clientes
        </button>

        <button
          onClick={() => setTab('platillos-top')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'platillos-top' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <BarChart3 size={14} /> Platillos más pedidos
        </button>

        <button
          onClick={() => setTab('colonias-top')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'colonias-top' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <MapPinned size={14} /> Colonias que más piden
        </button>

        <button
          onClick={() => setTab('pagos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'pagos' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <CreditCard size={14} /> Formas de pago
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
                <label className="block font-bold text-gray-300 mb-1">Colonia del negocio</label>
                <input
                  type="text"
                  value={infoForm.colonia}
                  onChange={e => setInfoForm({ ...infoForm, colonia: e.target.value })}
                  placeholder="Ej. Centro"
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Código postal del negocio</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={infoForm.postal_code}
                  onChange={e => setInfoForm({ ...infoForm, postal_code: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                  placeholder="Ej. 29000"
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
                <MapPin className="text-[#FF4B00]" size={20} /> Colonias y costos de reparto
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

                  <p className="text-xs leading-relaxed text-gray-400">
                    Aquí seleccionas únicamente las colonias y sus costos. Los métodos de cobro están separados en <strong className="text-white">Formas de pago</strong>.
                  </p>

                  {suggestedSettlements.length > 0 && (
                    <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-xs">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-black text-amber-300">Sugerencias según la dirección del negocio</p>
                          <p className="mt-1 text-white/55">Verifica tu alcance real antes de agregarlas.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddAllFromCP(suggestedSettlements)}
                          className="shrink-0 rounded-lg bg-amber-400 px-3 py-2 font-black text-black"
                        >
                          Agregar sugeridas
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {suggestedSettlements.map(item => (
                          <button
                            type="button"
                            key={`${item.cp}-${item.colonia}`}
                            onClick={() => handleAddSettlement(item)}
                            className="rounded-lg border border-white/10 bg-black/20 px-2.5 py-1 text-white/80"
                          >
                            + {item.colonia} · CP {item.cp}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                              {infoForm.free_delivery ? (
                                <span className="font-bold text-emerald-400 font-mono">GRATIS</span>
                              ) : infoForm.use_general_fee ? (
                                <span className="font-bold text-emerald-400 font-mono">${z.delivery_fee}</span>
                              ) : (
                                <label className="flex items-center gap-1 text-emerald-400 font-bold">
                                  <span>$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={z.delivery_fee}
                                    onChange={event => handleZoneFeeChange(z.id, event.target.value)}
                                    onBlur={handleZoneFeeSave}
                                    className="w-20 bg-black border border-white/20 rounded-lg px-2 py-1 text-emerald-400 font-mono font-bold"
                                    aria-label={`Costo de envío para ${z.settlement_name}`}
                                  />
                                </label>
                              )}
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

          </div>
        )}

        {/* PANTALLAS INDEPENDIENTES: PEDIDOS, CLIENTES Y PAGOS */}
        {tab === 'pedidos' && (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-emerald-500/15 to-[#14161F] p-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2"><ShoppingBag size={22} className="text-emerald-400" /> Mis pedidos</h2>
              <p className="mt-1 text-xs text-white/55">Consulta y atiende las órdenes recibidas desde tu menú.</p>
            </div>
            <RestaurantOrdersTab businessId={business.business_id || business.id || business.slug} businessName={business.name} />
          </div>
        )}

        {tab === 'clientes' && (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-blue-500/15 to-[#14161F] p-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2"><Users size={22} className="text-blue-400" /> Mis clientes</h2>
              <p className="mt-1 text-xs text-white/55">Tu directorio de clientes y su historial de pedidos.</p>
            </div>
            <RestaurantCustomersTab businessId={business.business_id || business.id || business.slug} businessName={business.name} />
          </div>
        )}

        {tab === 'platillos-top' && (
          <RestaurantInsightsTab businessId={business.business_id || business.id || business.slug} view="platillos" />
        )}

        {tab === 'colonias-top' && (
          <RestaurantInsightsTab businessId={business.business_id || business.id || business.slug} view="colonias" />
        )}

        {tab === 'pagos' && (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-violet-500/15 to-[#14161F] p-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2"><CreditCard size={22} className="text-violet-400" /> Formas de pago</h2>
              <p className="mt-1 text-xs text-white/55">Configura cómo pueden pagar tus clientes.</p>
            </div>
            <RestaurantPaymentMethodsTab business={business} onUpdateBusiness={loadData} />
          </div>
        )}

        {tab === 'tutoriales' && <TutorialLibrary />}

        {/* PESTAÑA NUEVA: INICIO (Dashboard Resumen & Control) */}
        {tab === 'inicio' && <RestaurantSetupHome business={business} form={infoForm} setForm={update => { profileDirty.current = true; setInfoForm(update) }} onSave={handleSaveInfo} onImage={handleImageFileChange} saving={savingProfile} onToggleOpen={handleToggleOpen} savingStatus={savingStatus} navigate={target => { setTab(target); window.scrollTo({ top: 0, behavior: 'smooth' }) }} zones={zones} />}

        {/* CONFIGURAR MENÚ: el mismo menú público con controles de edición contextuales */}
        {tab === 'menu-editor' && (
          <section className="animate-fade-in overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl">
            <div className="flex flex-col gap-3 bg-[#14161F] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6A1A]">Configurar menú</p>
                <h2 className="text-base font-black text-white">Así lo verán tus clientes</h2>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setTab('inicio')} className="min-h-11 rounded-full bg-white/5 px-4 text-xs font-black text-white">Volver</button>
                <a href={`/menu/${business.slug}`} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 rounded-full bg-[#FF4B00] px-4 text-xs font-black text-white">
                  <ExternalLink size={15} /> Ver público
                </a>
              </div>
            </div>

            <MenuDigital
              modo="editar"
              demoMenu={editableMenu}
              demoConfig={editableMenuConfig}
              isDemo={false}
              editMode
              onBannerFile={file => handleMenuImageFile(file, 'banner_url')}
              onLogoFile={file => handleMenuImageFile(file, 'logo_url')}
              onMessageSave={async message => {
                const scheduleDaily = {
                  ...(business.schedule_daily || {}),
                  ...(infoForm.schedule_daily || {}),
                  order_cta_text: message,
                }
                const updatedBusiness = updateBusinessSettings(business.business_id, { schedule_daily: scheduleDaily })
                setInfoForm(prev => ({ ...prev, schedule_daily: scheduleDaily }))
                await syncBusinessToSupabase(updatedBusiness)
                await resolveBusinessBySlug(business.slug)
                loadData()
                showToast('Mensaje de pedidos actualizado')
              }}
              onAddCategory={() => setEditingCategory({ name: '', is_visible: true, is_plus: false })}
              onEditCategory={cat => setEditingCategory({ ...cat, name: cat.name || cat.nombre })}
              onDeleteCategory={handleDeleteCat}
              onAddProduct={categoryId => setEditingProduct({
                name: '',
                price: 50,
                description: '',
                category_id: categoryId,
                is_active: true,
                is_out_of_stock: false,
                is_hidden: false,
                image_url: ''
              })}
              onEditProduct={prod => setEditingProduct({
                ...prod,
                name: prod.name || prod.nombre,
                price: prod.price ?? prod.precio,
                description: prod.description || prod.descripcion || '',
                image_url: prod.image_url || prod.foto || ''
              })}
              onDeleteProduct={handleDeleteProd}
            />
          </section>
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
                {infoForm.logo_url ? (
                  <div className="h-52 bg-black overflow-hidden relative flex items-center justify-center">
                    <img src={infoForm.logo_url} alt={`Foto de perfil de ${business.name}`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-52 bg-black/40 flex items-center justify-center text-gray-600">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="p-4 space-y-1">
                  <span className="text-emerald-500 font-mono text-[10px] block">streetboss.com.mx</span>
                  <strong className="text-white font-bold text-sm block">{business.name} — Menú Digital</strong>
                  <p className="text-gray-400 text-[11px] line-clamp-2">
                    {infoForm.description || ''}
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
                href={`https://wa.me/?text=${encodeURIComponent(`${business.name}\n${infoForm.description || ''}\nhttps://streetboss.com.mx/menu/${business.slug}`)}`}
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
                    text: infoForm.description || business.name,
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
      <nav className="fixed bottom-0 left-0 right-0 md:left-1/2 md:right-auto md:w-[620px] md:-translate-x-1/2 md:rounded-t-3xl z-50 bg-[#14161F] border-t border-white/5 px-2 py-2 flex justify-around items-center shadow-[0_-5px_20px_rgba(0,0,0,0.5)] pb-[calc(12px+env(safe-area-inset-bottom))]">
        <button
          onClick={() => { setTab('inicio'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all py-1 px-3.5 rounded-xl ${
            tab === 'inicio' ? 'text-[#FF4B00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home size={20} />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => { setTab('menu-editor'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all py-1 px-3.5 rounded-xl ${
            tab === 'menu-editor' || tab === 'menu' || tab === 'categorias' || tab === 'productos' ? 'text-[#FF4B00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <UtensilsCrossed size={20} />
          <span>Menú</span>
        </button>

        <button
          onClick={() => { setTab('info'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all py-1 px-3.5 rounded-xl ${
            tab === 'info' ? 'text-[#FF4B00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Store size={20} />
          <span>Negocio</span>
        </button>

        <button
          onClick={() => { setTab('pedidos'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all py-1 px-3.5 rounded-xl ${
            tab === 'pedidos' ? 'text-[#FF4B00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingBag size={20} />
          <span>Pedidos</span>
        </button>

        <button
          onClick={() => { setTab('clientes'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all py-1 px-3.5 rounded-xl ${
            tab === 'clientes' ? 'text-[#FF4B00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users size={20} />
          <span>Clientes</span>
        </button>
      </nav>
    </div>
  )
}
