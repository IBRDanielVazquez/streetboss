import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBusinessBySlug, updateBusinessSettings, saveCategory, deleteCategory, saveProduct, deleteProduct, getBusinessDeliveryZones, saveDeliveryZones, bulkUpdateZoneFees } from '../services/crmV3Service'
import { buscarPorCP, buscarPorColonia } from '../data/sepomexTuxtla'
import { Store, Layers, Package, MapPin, ExternalLink, Save, Plus, Trash2, Edit2, CheckCircle, Search, Power, DollarSign, Image } from 'lucide-react'

export default function ClientDashboard() {
  const { slug } = useParams()
  const [business, setBusiness] = useState(null)
  const [tab, setTab] = useState('info') // 'info', 'categorias', 'productos', 'zonas'
  const [savedSuccess, setSavedSuccess] = useState('')

  // Form info
  const [infoForm, setInfoForm] = useState({})
  
  // Modal Categorías
  const [editingCategory, setEditingCategory] = useState(null)
  
  // Modal Productos
  const [editingProduct, setEditingProduct] = useState(null)

  // Zonas de Entrega
  const [zones, setZones] = useState([])
  const [cpSearch, setCpSearch] = useState('')
  const [coloniaSearch, setColoniaSearch] = useState('')
  const [selectedSettlements, setSelectedSettlements] = useState([])
  const [bulkFee, setBulkFee] = useState(30)
  const [selectedZoneKeys, setSelectedZoneKeys] = useState([])

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
        has_delivery: b.has_delivery !== false,
        delivery_mode: b.delivery_mode || 'fijo',
        base_delivery_fee: b.base_delivery_fee || 30,
        logo_url: b.logo_url || '',
        banner_url: b.banner_url || '',
        brand_color: b.brand_color || '#FF4B00',
        facebook_url: b.facebook_url || '',
        instagram_url: b.instagram_url || '',
        tiktok_url: b.tiktok_url || '',
      })

      const z = getBusinessDeliveryZones(b.business_id)
      setZones(z)
    }
  }

  useEffect(() => {
    loadData()
  }, [slug])

  if (!business) {
    return (
      <div className="min-h-screen bg-[#0D0E12] text-white flex flex-col items-center justify-center p-6 text-center">
        <Store size={48} className="text-[#FF4B00] mb-4 animate-bounce" />
        <h1 className="text-xl font-black">Restaurante no encontrado</h1>
        <p className="text-xs text-gray-400 mt-2 max-w-sm">Verifica el enlace de tu Dashboard o contacta con soporte.</p>
        <Link to="/" className="mt-6 px-6 py-2.5 bg-[#FF4B00] text-white font-bold rounded-full text-xs">
          Volver al Inicio
        </Link>
      </div>
    )
  }

  const showToast = (msg) => {
    setSavedSuccess(msg)
    setTimeout(() => setSavedSuccess(''), 3000)
  }

  // 1. Guardar Información General
  const handleSaveInfo = (e) => {
    e.preventDefault()
    updateBusinessSettings(business.business_id, infoForm)
    loadData()
    showToast('Información del restaurante actualizada')
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

  // 3. Productos
  const handleSaveProd = (e) => {
    e.preventDefault()
    if (!editingProduct?.name || !editingProduct?.category_id) return
    saveProduct(business.business_id, editingProduct)
    setEditingProduct(null)
    loadData()
    showToast('Producto guardado')
  }

  const handleDeleteProd = (prodId) => {
    if (window.confirm('¿Eliminar este producto?')) {
      deleteProduct(prodId)
      loadData()
      showToast('Producto eliminado')
    }
  }

  // 4. Zonas de Entrega
  const resultsByCP = cpSearch ? buscarPorCP(cpSearch) : []
  const resultsByColonia = coloniaSearch ? buscarPorColonia(coloniaSearch) : []

  const handleAddSettlement = (item, fee = 30) => {
    const key = `${item.cp}_${item.colonia}`
    const existing = zones.find(z => z.postal_code === item.cp && z.settlement_name === item.colonia)
    if (!existing) {
      const newZones = [
        ...zones,
        {
          postal_code: item.cp,
          settlement_name: item.colonia,
          settlement_type: item.tipo || 'Colonia',
          delivery_fee: fee,
          is_active: true,
        }
      ]
      const saved = saveDeliveryZones(business.business_id, newZones)
      setZones(saved)
      showToast(`Colonia ${item.colonia} agregada`)
    }
  }

  const handleAddAllFromCP = (cpItems, fee = 30) => {
    const newZones = [...zones]
    cpItems.forEach(item => {
      const exists = newZones.some(z => z.postal_code === item.cp && z.settlement_name === item.colonia)
      if (!exists) {
        newZones.push({
          postal_code: item.cp,
          settlement_name: item.colonia,
          settlement_type: item.tipo || 'Colonia',
          delivery_fee: fee,
          is_active: true,
        })
      }
    })
    const saved = saveDeliveryZones(business.business_id, newZones)
    setZones(saved)
    showToast(`Colonias del CP agregadas`)
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
    <div className="min-h-screen bg-[#0D0E12] text-white font-sans selection:bg-[#FF4B00] selection:text-white pb-24">
      {/* Toast Notificación */}
      {savedSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle size={16} /> {savedSuccess}
        </div>
      )}

      {/* Header Superior del Dashboard */}
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

      {/* Navegación por Pestañas */}
      <nav className="bg-[#14161F]/60 backdrop-blur border-b border-white/5 px-4 sm:px-8 py-3 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setTab('info')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            tab === 'info' ? 'bg-[#FF4B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Store size={14} /> Información General
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
          <MapPin size={14} /> Zonas de Entrega ({zones.length})
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
        {/* PESTAÑA 1: INFORMACIÓN GENERAL & IMÁGENES */}
        {tab === 'info' && (
          <form onSubmit={handleSaveInfo} className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-white border-b border-white/5 pb-3">Información del Negocio e Imágenes</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Nombre del Restaurante</label>
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

              <div>
                <label className="block font-bold text-gray-300 mb-1">Imagen de Portada (URL o /demos/img/...)</label>
                <input
                  type="text"
                  value={infoForm.banner_url}
                  onChange={e => setInfoForm({ ...infoForm, banner_url: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Imagen de Logotipo (URL)</label>
                <input
                  type="text"
                  value={infoForm.logo_url}
                  onChange={e => setInfoForm({ ...infoForm, logo_url: e.target.value })}
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
                <Save size={16} /> Guardar Información
              </button>
            </div>
          </form>
        )}

        {/* PESTAÑA 2: CATEGORÍAS */}
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

        {/* PESTAÑA 3: PRODUCTOS */}
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
                          <Image size={24} />
                        </div>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/80 font-black text-emerald-400 text-xs">
                        ${prod.price}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white">{prod.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2">{prod.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className={prod.is_out_of_stock ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {prod.is_out_of_stock ? 'Agotado' : 'Disponible'}
                    </span>
                    <div className="flex gap-2">
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

        {/* PESTAÑA 4: ZONAS DE ENTREGA (COLONIAS TUXTLA GUTIÉRREZ) */}
        {tab === 'zonas' && (
          <div className="space-y-6">
            <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <MapPin className="text-[#FF4B00]" size={20} /> Zonas de Entrega y Colonias Habilitadas
              </h2>
              <p className="text-xs text-gray-400">
                Selecciona las colonias oficiales de Tuxtla Gutiérrez a donde realizas envíos a domicilio y asigna el costo de entrega.
              </p>

              {/* Buscador de Colonias / CPs */}
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

              {/* Resultados de búsqueda */}
              {resultsByCP.length > 0 && (
                <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-400">{resultsByCP.length} colonias encontradas para CP {cpSearch}</span>
                    <button
                      onClick={() => handleAddAllFromCP(resultsByCP, 30)}
                      className="bg-[#FF4B00] text-white px-3 py-1 rounded-lg font-bold"
                    >
                      + Agregar todas las colonias del CP ($30)
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                    {resultsByCP.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAddSettlement(item, 30)}
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
                        onClick={() => handleAddSettlement(item, 30)}
                        className="bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg text-gray-300 text-[11px] border border-white/5"
                      >
                        + {item.colonia} (CP {item.cp})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Edición Masiva y Lista de Zonas Habilitadas */}
            <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
                <h3 className="font-black text-sm text-white">Colonias Activas ({zones.length})</h3>

                {selectedZoneKeys.length > 0 && (
                  <div className="flex items-center gap-2 bg-[#0D0E12] p-2 rounded-xl border border-[#FF4B00]/30 text-xs">
                    <span>{selectedZoneKeys.length} seleccionadas. Asignar costo: $</span>
                    <input
                      type="number"
                      value={bulkFee}
                      onChange={e => setBulkFee(e.target.value)}
                      className="w-16 bg-black border border-white/20 rounded px-2 py-0.5 text-emerald-400 font-bold"
                    />
                    <button onClick={handleApplyBulkFee} className="bg-[#FF4B00] text-white px-3 py-1 rounded-lg font-bold">
                      Aplicar
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {zones.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No has agregado colonias de entrega. Utiliza el buscador superior.</p>
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
                          <span className="font-bold text-emerald-400 font-mono">${z.delivery_fee}</span>
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

      {/* Modal Editar Producto */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveProd} className="bg-[#14161F] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="font-black text-white text-base">Guardar Producto</h3>

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

            <div>
              <label className="block text-gray-300 font-bold mb-1">Fotografía URL (/productos/...)</label>
              <input
                type="text"
                value={editingProduct.image_url}
                onChange={e => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="outOfStock"
                checked={editingProduct.is_out_of_stock}
                onChange={e => setEditingProduct({ ...editingProduct, is_out_of_stock: e.target.checked })}
              />
              <label htmlFor="outOfStock" className="text-gray-300 font-bold">Marcar como AGOTADO</label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <button type="button" onClick={() => setEditingProduct(null)} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 font-bold">Cancelar</button>
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#FF4B00] text-white text-xs font-black">Guardar Producto</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
