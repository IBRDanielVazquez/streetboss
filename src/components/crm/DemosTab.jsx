import { useState, useEffect } from 'react'
import { getDemos, updateDemoStatus, deleteDemo } from '../../services/crmV3Service'
import { ExternalLink, Copy, Edit, Trash2, CheckCircle, Store, Layers, Package, AlertTriangle } from 'lucide-react'

// Helper to provide colorful iOS-style gradients based on business type
function getFolderGradient(type) {
  const t = String(type || '').toLowerCase()
  if (t.includes('taco') || t.includes('mexic')) return 'from-orange-500 to-red-600'
  if (t.includes('burger') || t.includes('hamburg')) return 'from-amber-400 to-orange-500'
  if (t.includes('pizza')) return 'from-red-500 to-amber-600'
  if (t.includes('cafe') || t.includes('brunch')) return 'from-amber-700 to-yellow-800'
  if (t.includes('pollo')) return 'from-yellow-500 to-orange-600'
  if (t.includes('parrilla') || t.includes('carne')) return 'from-red-700 to-rose-900'
  if (t.includes('torta')) return 'from-amber-500 to-rose-600'
  if (t.includes('birria')) return 'from-yellow-600 to-red-700'
  if (t.includes('marisco') || t.includes('pesca')) return 'from-blue-500 to-teal-600'
  if (t.includes('china') || t.includes('express')) return 'from-red-600 to-amber-500'
  return 'from-purple-500 to-indigo-600'
}

function getDemoEmojis(type) {
  const t = String(type || '').toLowerCase()
  if (t.includes('taco') || t.includes('mexic')) return ['🌮', '🌯', '🥤', '🥑']
  if (t.includes('burger') || t.includes('hamburg')) return ['🍔', '🍟', '🥤', '🥓']
  if (t.includes('pizza')) return ['🍕', '🥤', '🥗', '🥖']
  if (t.includes('cafe') || t.includes('brunch')) return ['☕', '🍰', '🥪', '🥐']
  if (t.includes('pollo')) return ['🍗', '🥔', '🥤', '🥗']
  if (t.includes('parrilla') || t.includes('carne')) return ['🥩', '🔥', '🍺', '🍟']
  if (t.includes('torta')) return ['🥪', '🥤', '🥔', '🌶️']
  if (t.includes('birria')) return ['🍲', '🌮', '🥤', '🍋']
  if (t.includes('marisco') || t.includes('pesca')) return ['🍤', '🐟', '🍺', '🍋']
  if (t.includes('china') || t.includes('express')) return ['🍜', '🍚', '🥤', '🍤']
  return ['🍽️', '🥤', '🍰', '🥗']
}

export default function DemosTab({ onSelectDemoForBusiness }) {
  const [demos, setDemos] = useState([])
  const [filterStatus, setFilterStatus] = useState('todos')
  const [search, setSearch] = useState('')
  const [selectedDemo, setSelectedDemo] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(null)

  const reloadDemos = () => {
    setDemos(getDemos())
  }

  useEffect(() => {
    reloadDemos()
  }, [])

  const handleToggleStatus = (demoId, currentStatus) => {
    const nextStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo'
    updateDemoStatus(demoId, nextStatus)
    reloadDemos()
    // Refresh modal info if opened
    if (selectedDemo && selectedDemo.id === demoId) {
      setSelectedDemo(prev => ({ ...prev, demo_status: nextStatus }))
    }
  }

  const handleDelete = (demoId) => {
    deleteDemo(demoId)
    setShowDeleteModal(null)
    setSelectedDemo(null)
    reloadDemos()
  }

  const filteredDemos = demos.filter(d => {
    const matchesStatus = filterStatus === 'todos' || d.demo_status?.toLowerCase() === filterStatus.toLowerCase()
    const matchesSearch = d.name?.toLowerCase().includes(search.toLowerCase()) || d.business_type?.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Header & Filtros - Font size scaled up */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#14161F] p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Store className="text-[#FF4B00]" size={28} /> Demos Oficiales
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Plantillas maestras en modelo carpeta iOS para demostración y clonación.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <input
            type="text"
            placeholder="Buscar demo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#0D0E12] border border-white/10 rounded-2xl px-5 py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#FF4B00] w-full sm:w-60"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#0D0E12] border border-white/10 rounded-2xl px-4 py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#FF4B00]"
          >
            <option value="todos">Todos los estados</option>
            <option value="Activo">Activos</option>
            <option value="Inactivo">Inactivos</option>
            <option value="Archivado">Archivados</option>
          </select>
        </div>
      </div>

      {/* Grid de Demos - Estilo iOS Springboard Folder */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {filteredDemos.map(demo => {
          const emojis = getDemoEmojis(demo.business_type)
          const grad = getFolderGradient(demo.business_type)

          return (
            <div
              key={demo.id}
              onClick={() => setSelectedDemo(demo)}
              className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              {/* Contenedor de la Carpeta iOS */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/5 border border-white/10 backdrop-blur-md rounded-[2rem] p-3.5 flex flex-col items-center justify-center relative shadow-lg group-hover:border-[#FF4B00]/40 group-hover:bg-[#FF4B00]/5 transition-all">
                {/* Mini-grid interno de Apps de iOS */}
                <div className="w-full h-full bg-[#1b1c28]/80 rounded-2xl p-2 grid grid-cols-2 gap-1.5 shadow-inner border border-white/5 relative overflow-hidden">
                  {emojis.map((emoji, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-sm sm:text-base shadow-xs"
                    >
                      {emoji}
                    </div>
                  ))}
                  
                  {/* Pequeño logo circular superpuesto en el centro del folder */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/20 overflow-hidden shadow-md bg-black">
                    <img
                      src={demo.logo_url || demo.logoUrl || `/demos/${demo.slug || demo.id}/profile.png`}
                      alt="Logo Mini"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Status Badge Mini */}
                <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-[#0D0E12] ${
                  demo.demo_status === 'Activo' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} title={demo.demo_status} />
              </div>

              {/* Nombre del Demo (Debajo del Folder, estilo iOS app name) */}
              <span className="mt-3 text-sm sm:text-base font-black text-white text-center line-clamp-1 max-w-[110px] group-hover:text-[#FF6A1A] transition-colors">
                {demo.name}
              </span>
              <span className="text-[11px] font-bold text-gray-500 mt-0.5 line-clamp-1">
                {demo.business_type}
              </span>
            </div>
          )
        })}
      </div>

      {/* MODAL: Carpeta Expandida estilo iOS */}
      {selectedDemo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-[#14161F] border border-white/10 rounded-[2.5rem] max-w-lg w-full overflow-hidden shadow-2xl relative">
            {/* Botón de cierre superior */}
            <button
              onClick={() => setSelectedDemo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center text-lg font-black transition-all"
            >
              ✕
            </button>

            {/* Banner e Imagen de Portada */}
            <div className="relative h-48 w-full bg-slate-900">
              <img
                src={selectedDemo.banner_url || `/demos/${selectedDemo.slug || selectedDemo.id}/cover.jpg`}
                alt={selectedDemo.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14161F] via-transparent to-black/30" />

              {/* Tag Giro */}
              <span className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-gray-200 border border-white/5">
                {selectedDemo.business_type}
              </span>

              {/* Logo Flotante */}
              <div className="absolute -bottom-8 left-6 h-20 w-20 overflow-hidden rounded-2xl border-4 border-[#14161F] bg-[#0D0E12] shadow-xl">
                <img
                  src={selectedDemo.logo_url || selectedDemo.logoUrl || `/demos/${selectedDemo.slug || selectedDemo.id}/profile.png`}
                  alt={`Perfil ${selectedDemo.name}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Contenido Detallado de la Carpeta */}
            <div className="p-6 pt-12 space-y-6 text-sm sm:text-base text-gray-300">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                  {selectedDemo.name}
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    selectedDemo.demo_status === 'Activo'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {selectedDemo.demo_status}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
                  {selectedDemo.description || `Plantilla demostrativa para negocios del giro ${selectedDemo.business_type}.`}
                </p>
              </div>

              {/* Contadores y Métricas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-[#0D0E12] p-3 rounded-2xl border border-white/5">
                  <Layers size={18} className="text-[#FF4B00]" />
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Categorías</span>
                    <strong className="text-white text-sm sm:text-base">{selectedDemo.categories_count}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[#0D0E12] p-3 rounded-2xl border border-white/5">
                  <Package size={18} className="text-[#FF4B00]" />
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Productos</span>
                    <strong className="text-white text-sm sm:text-base">{selectedDemo.products_count}</strong>
                  </div>
                </div>
              </div>

              {/* ID Técnico */}
              <div className="flex justify-between items-center text-xs text-gray-500 font-mono bg-[#0D0E12]/50 p-2.5 rounded-xl border border-white/5">
                <span>ID: {selectedDemo.business_id}</span>
                <span>v{selectedDemo.template_version || '3.0'}</span>
              </div>

              {/* Acciones principales */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    if (onSelectDemoForBusiness) {
                      onSelectDemoForBusiness(selectedDemo.id)
                      setSelectedDemo(null)
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-sm py-3 px-6 rounded-2xl shadow-lg transition-transform active:scale-98"
                >
                  <Copy size={16} /> Usar como plantilla para clonar cliente
                </button>

                <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm font-bold">
                  <a
                    href={`/menu/${selectedDemo.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 py-3 rounded-2xl border border-white/5 transition-colors"
                  >
                    <ExternalLink size={14} /> Ver Menú
                  </a>

                  <button
                    onClick={() => handleToggleStatus(selectedDemo.id, selectedDemo.demo_status)}
                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 py-3 rounded-2xl border border-white/5 transition-colors"
                  >
                    <Edit size={14} /> {selectedDemo.demo_status === 'Activo' ? 'Desactivar' : 'Activar'}
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(selectedDemo)}
                    className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-2xl border border-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación Eliminar Demo Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14161F] border border-red-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={32} />
              <h3 className="text-lg sm:text-xl font-black text-white">Confirmar eliminación</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-300">
              ¿Estás seguro de eliminar permanentemente la plantilla de demostración <strong>"{showDeleteModal.name}"</strong>?
            </p>
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs sm:text-sm text-red-300">
              ⚠️ Nota: Si existen clientes activos creados con esta plantilla, el demo permanecerá como plantilla histórica aislada.
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs sm:text-sm font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal.id)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-black shadow-lg"
              >
                Sí, eliminar demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

