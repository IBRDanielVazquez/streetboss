import { useState, useEffect } from 'react'
import { getDemos, updateDemoStatus, deleteDemo } from '../../services/crmV3Service'
import { ExternalLink, Copy, Edit, Trash2, Archive, CheckCircle, Store, Layers, Package, AlertTriangle, ArrowRight } from 'lucide-react'

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
  }

  const handleArchive = (demoId) => {
    updateDemoStatus(demoId, 'Archivado')
    reloadDemos()
  }

  const handleDelete = (demoId) => {
    deleteDemo(demoId)
    setShowDeleteModal(null)
    reloadDemos()
  }

  const filteredDemos = demos.filter(d => {
    const matchesStatus = filterStatus === 'todos' || d.demo_status?.toLowerCase() === filterStatus.toLowerCase()
    const matchesSearch = d.name?.toLowerCase().includes(search.toLowerCase()) || d.business_type?.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-[#0D0E12] space-y-6">
      {/* Header & Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14161F] p-4 sm:p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Store className="text-[#FF4B00]" size={24} /> Catálogo de Demos Oficiales
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Plantillas maetras activas para demostración y clonación directa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar demo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF4B00]"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF4B00]"
          >
            <option value="todos">Todos los estados</option>
            <option value="Activo">Activos</option>
            <option value="Inactivo">Inactivos</option>
            <option value="Archivado">Archivados</option>
          </select>
        </div>
      </div>

      {/* Grid de Demos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDemos.map(demo => (
          <div
            key={demo.id}
            className="group relative bg-[#14161F] border border-white/5 hover:border-[#FF4B00]/40 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            {/* Banner e Imagen */}
            <div className="relative h-40 w-full overflow-hidden bg-slate-900">
              <img
                src={demo.banner_url || `/demos/${demo.slug || demo.id}/cover.jpg`}
                alt={demo.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14161F] via-transparent to-black/40" />

              {/* Status Badge */}
              <span
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  demo.demo_status === 'Activo'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : demo.demo_status === 'Archivado'
                    ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {demo.demo_status}
              </span>

              {/* Tag Giro */}
              <span className="absolute top-3 left-3 bg-[#0D0E12]/80 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-gray-300">
                {demo.business_type}
              </span>

              {/* Logo / Foto de Perfil */}
              <div className="absolute -bottom-3 right-4 h-12 w-12 overflow-hidden rounded-full border-2 border-[#14161F] bg-[#0D0E12] shadow-xl">
                <img
                  src={demo.logo_url || demo.logoUrl || `/demos/${demo.slug || demo.id}/profile.png`}
                  alt={`Perfil ${demo.name}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Contenido Card */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-white group-hover:text-[#FF6A1A] transition-colors">
                  {demo.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                  {demo.description || `Plantilla demostrativa para negocios del giro ${demo.business_type}.`}
                </p>
              </div>

              {/* Métricas del Demo */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs text-gray-300">
                <div className="flex items-center gap-1.5 bg-[#0D0E12] p-2 rounded-lg">
                  <Layers size={14} className="text-[#FF4B00]" />
                  <span>{demo.categories_count} Categorías</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0D0E12] p-2 rounded-lg">
                  <Package size={14} className="text-[#FF4B00]" />
                  <span>{demo.products_count} Productos</span>
                </div>
              </div>

              {/* ID Técnico Interno */}
              <div className="text-[11px] font-mono text-gray-500 flex items-center justify-between">
                <span>ID: {demo.business_id}</span>
                <span>v{demo.template_version || '3.0'}</span>
              </div>

              {/* Acciones */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onSelectDemoForBusiness && onSelectDemoForBusiness(demo.id)}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-lg transition-all duration-200"
                >
                  <Copy size={14} /> Usar como plantilla
                </button>

                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  <a
                    href={`/menu/${demo.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-gray-300 py-2 rounded-xl border border-white/5"
                  >
                    <ExternalLink size={12} /> Menú
                  </a>

                  <button
                    onClick={() => handleToggleStatus(demo.id, demo.demo_status)}
                    className="flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-gray-300 py-2 rounded-xl border border-white/5"
                  >
                    <Edit size={12} /> {demo.demo_status === 'Activo' ? 'Pausar' : 'Activar'}
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(demo)}
                    className="flex items-center justify-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-xl border border-red-500/10"
                  >
                    <Trash2 size={12} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmación Eliminar Demo Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14161F] border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={28} />
              <h3 className="text-lg font-black text-white">Confirmar eliminación de Demo</h3>
            </div>
            <p className="text-sm text-gray-300">
              ¿Estás seguro de eliminar el demo <strong>"{showDeleteModal.name}"</strong>?
            </p>
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300 space-y-1">
              <p>⚠️ Advertencia: Si existen clientes activos creados con esta plantilla, el demo permanecerá como plantilla histórica aislada.</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal.id)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg"
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
