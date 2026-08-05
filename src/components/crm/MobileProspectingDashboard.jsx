import { useState, useMemo, useEffect } from 'react'
import masterProspectsData from '../../data/master_prospects.json'
import ProspectDetailModal from './ProspectDetailModal'
import {
  Search,
  Filter,
  MapPin,
  Phone,
  MessageCircle,
  Facebook,
  Star,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  Building2,
  CheckCircle2,
  RefreshCw,
  Eye,
  Send,
  X
} from 'lucide-react'

export default function MobileProspectingDashboard({ onConvertProspectToBusiness }) {
  // Load prospects from localStorage fallback or initial master json
  const [prospects, setProspects] = useState(() => {
    const saved = localStorage.getItem('sb_v3_master_prospects_override')
    if (saved) {
      try {
        const parsedSaved = JSON.parse(saved)
        // Merge saved overrides with master json
        const overrideMap = new Map(parsedSaved.map(p => [p.id, p]))
        return masterProspectsData.map(p => overrideMap.get(p.id) || p)
      } catch (e) {
        return masterProspectsData
      }
    }
    return masterProspectsData
  })

  // Selected Prospect for Modal
  const [selectedProspect, setSelectedProspect] = useState(null)

  // Filters State
  const [search, setSearch] = useState('')
  const [selectedCity, setSelectedCity] = useState('Todas')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [selectedStatus, setSelectedStatus] = useState('Todos')
  const [onlyWhatsapp, setOnlyWhatsapp] = useState(false)
  const [onlyFacebook, setOnlyFacebook] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)

  // Pagination state for high performance
  const [displayLimit, setDisplayLimit] = useState(40)

  // Extract unique cities and categories
  const cities = useMemo(() => {
    const set = new Set(prospects.map(p => p.city).filter(Boolean))
    return ['Todas', ...Array.from(set).sort()]
  }, [prospects])

  const categories = useMemo(() => {
    const set = new Set(prospects.map(p => p.category).filter(Boolean))
    return ['Todas', ...Array.from(set).sort()]
  }, [prospects])

  // Save changes to override localStorage
  const handleUpdateProspect = (updatedProspect) => {
    const newProspects = prospects.map(p => p.id === updatedProspect.id ? updatedProspect : p)
    setProspects(newProspects)
    
    // Save overrides
    const overrides = newProspects.filter(p => p.status !== 'Nuevo' || p.assigned_demo || p.notes)
    localStorage.setItem('sb_v3_master_prospects_override', JSON.stringify(overrides))
    setSelectedProspect(updatedProspect)
  }

  // Filter Engine
  const filteredProspects = useMemo(() => {
    const query = search.toLowerCase().trim()
    return prospects.filter(p => {
      // Search text
      if (query) {
        const matchesName = p.business_name?.toLowerCase().includes(query)
        const matchesContact = p.contact_name?.toLowerCase().includes(query)
        const matchesPhone = p.phone?.includes(query) || p.whatsapp?.includes(query)
        const matchesAddress = p.address?.toLowerCase().includes(query) || p.colonia?.toLowerCase().includes(query)
        if (!matchesName && !matchesContact && !matchesPhone && !matchesAddress) return false
      }

      // City filter
      if (selectedCity !== 'Todas' && p.city !== selectedCity) return false

      // Category filter
      if (selectedCategory !== 'Todas' && p.category !== selectedCategory) return false

      // Status filter
      if (selectedStatus !== 'Todos' && (p.status || 'Nuevo') !== selectedStatus) return false

      // Only Whatsapp
      if (onlyWhatsapp && !p.whatsapp && !p.phone) return false

      // Only Facebook
      if (onlyFacebook && !p.facebook) return false

      return true
    })
  }, [prospects, search, selectedCity, selectedCategory, selectedStatus, onlyWhatsapp, onlyFacebook])

  // Key Metrics
  const metrics = useMemo(() => {
    let contactados = 0
    let demosEnviadas = 0
    let interesados = 0
    let cerrados = 0

    prospects.forEach(p => {
      const st = p.status || 'Nuevo'
      if (st === 'Contactado') contactados++
      if (st === 'Demo Enviada') demosEnviadas++
      if (st === 'Interesado') interesados++
      if (st === 'Cerrado') cerrados++
    })

    return {
      total: prospects.length,
      contactados,
      demosEnviadas,
      interesados,
      cerrados,
    }
  }, [prospects])

  const getStatusBadge = (st) => {
    const status = st || 'Nuevo'
    switch (status) {
      case 'Contactado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">🟡 Contactado</span>
      case 'Demo Enviada':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">🟣 Demo Enviada</span>
      case 'Interesado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">🟠 Interesado</span>
      case 'Cerrado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">🟢 Cliente Cerrado</span>
      case 'Descartado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">🔴 Descartado</span>
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">🔵 Nuevo</span>
    }
  }

  return (
    <div className="space-y-5">
      {/* Top Banner & Quick Metrics Bar */}
      <div className="bg-[#14161F] p-4 sm:p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#FF4B00]/10 text-[#FF6A1A] border border-[#FF4B00]/20 font-black text-[10px] uppercase">
                Base Oficial StreetBoss
              </span>
              <span className="text-xs text-gray-400 font-bold">{prospects.length} Restaurantes Validados</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Dashboard Móvil de Prospección
            </h2>
          </div>

          <button
            onClick={() => setShowFiltersModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black rounded-xl text-xs shadow-lg transition-all"
          >
            <SlidersHorizontal size={15} /> Filtros Avanzados
          </button>
        </div>

        {/* Realtime KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/5">
          <div className="bg-[#0D0E12]/80 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-black uppercase text-gray-500">Contactados</span>
            <p className="text-lg font-black text-amber-400 mt-0.5">{metrics.contactados}</p>
          </div>
          <div className="bg-[#0D0E12]/80 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-black uppercase text-gray-500">Demos Enviadas</span>
            <p className="text-lg font-black text-purple-400 mt-0.5">{metrics.demosEnviadas}</p>
          </div>
          <div className="bg-[#0D0E12]/80 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-black uppercase text-gray-500">Interesados</span>
            <p className="text-lg font-black text-orange-400 mt-0.5">{metrics.interesados}</p>
          </div>
          <div className="bg-[#0D0E12]/80 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-black uppercase text-gray-500">Clientes Cerrados</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">{metrics.cerrados}</p>
          </div>
        </div>
      </div>

      {/* Search and Quick Filters Bar */}
      <div className="bg-[#14161F] p-3 sm:p-4 rounded-2xl border border-white/5 shadow-lg space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setDisplayLimit(40)
            }}
            placeholder="Buscar por restaurante, contacto, teléfono, colonia..."
            className="w-full bg-[#0D0E12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4B00]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Quick Filter Chips Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <select
            value={selectedCity}
            onChange={e => { setSelectedCity(e.target.value); setDisplayLimit(40) }}
            className="bg-[#0D0E12] border border-white/10 text-gray-300 font-bold px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-[#FF4B00]"
          >
            {cities.map(c => <option key={c} value={c}>{c === 'Todas' ? '🏙️ Todas las Ciudades' : `📍 ${c}`}</option>)}
          </select>

          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setDisplayLimit(40) }}
            className="bg-[#0D0E12] border border-white/10 text-gray-300 font-bold px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-[#FF4B00]"
          >
            <option value="Todos">🏷️ Todos los Estados</option>
            <option value="Nuevo">🔵 Nuevo</option>
            <option value="Contactado">🟡 Contactado</option>
            <option value="Demo Enviada">🟣 Demo Enviada</option>
            <option value="Interesado">🟠 Interesado</option>
            <option value="Cerrado">🟢 Cerrado</option>
            <option value="Descartado">🔴 Descartado</option>
          </select>

          <button
            onClick={() => setOnlyWhatsapp(!onlyWhatsapp)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              onlyWhatsapp ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400' : 'bg-[#0D0E12] border-white/10 text-gray-400'
            }`}
          >
            💬 Con WhatsApp
          </button>

          <button
            onClick={() => setOnlyFacebook(!onlyFacebook)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              onlyFacebook ? 'bg-blue-600/20 border-blue-500/40 text-blue-400' : 'bg-[#0D0E12] border-white/10 text-gray-400'
            }`}
          >
            📘 Con Facebook
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-400 px-1 pt-1">
          <span>Mostrando <strong className="text-white">{filteredProspects.length}</strong> restaurantes</span>
          {(selectedCity !== 'Todas' || selectedStatus !== 'Todos' || search || onlyWhatsapp || onlyFacebook) && (
            <button
              onClick={() => {
                setSearch('')
                setSelectedCity('Todas')
                setSelectedCategory('Todas')
                setSelectedStatus('Todos')
                setOnlyWhatsapp(false)
                setOnlyFacebook(false)
              }}
              className="text-[#FF6A1A] hover:underline font-bold"
            >
              Restablecer Filtros
            </button>
          )}
        </div>
      </div>

      {/* Prospect Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProspects.slice(0, displayLimit).map(prospect => (
          <div
            key={prospect.id}
            onClick={() => setSelectedProspect(prospect)}
            className="bg-[#14161F] border border-white/5 hover:border-white/20 rounded-2xl p-4 space-y-3 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-[#FF6A1A] transition-colors leading-tight">
                    {prospect.business_name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                    <span className="font-medium">{prospect.category || 'Restaurante'}</span>
                    <span>•</span>
                    <span className="text-gray-300 font-bold">{prospect.city || 'Tuxtla Gutiérrez'}</span>
                  </p>
                </div>
                {getStatusBadge(prospect.status)}
              </div>

              {/* Direct Address & Phone info */}
              <p className="text-xs text-gray-400 line-clamp-1">
                📍 {prospect.address || prospect.colonia || 'Sin dirección exacta'}
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-300 font-bold pt-1">
                {prospect.phone && (
                  <span>📞 {prospect.phone}</span>
                )}
                {prospect.contact_name && (
                  <span className="text-gray-400 font-normal">👤 {prospect.contact_name}</span>
                )}
              </div>
            </div>

            {/* Bottom Actions & Completeness */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {prospect.completeness_score || 50}% calidad
                </span>

                {prospect.facebook && (
                  <span className="text-blue-400 font-bold text-[10px]">FB ✓</span>
                )}
                {prospect.rating && (
                  <span className="text-amber-400 font-bold text-[10px] flex items-center gap-0.5">
                    ★ {prospect.rating}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[#FF6A1A] font-bold group-hover:translate-x-1 transition-transform">
                Ver Ficha <ChevronRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button if results exceed displayLimit */}
      {filteredProspects.length > displayLimit && (
        <div className="text-center pt-4 pb-8">
          <button
            onClick={() => setDisplayLimit(prev => prev + 40)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 text-xs shadow-lg transition-all"
          >
            Cargar 40 restaurantes más (Mostrando {displayLimit} de {filteredProspects.length})
          </button>
        </div>
      )}

      {/* Prospect Detail Modal Drawer */}
      {selectedProspect && (
        <ProspectDetailModal
          prospect={selectedProspect}
          onClose={() => setSelectedProspect(null)}
          onUpdateProspect={handleUpdateProspect}
          onConvertProspectToBusiness={onConvertProspectToBusiness}
        />
      )}

      {/* Advanced Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-[#14161F] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#FF4B00]" /> Filtros Avanzados
              </h3>
              <button onClick={() => setShowFiltersModal(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Giro / Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-2.5 text-white"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Ciudad / Municipio</label>
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-2.5 text-white"
                >
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setShowFiltersModal(false)}
                className="w-full py-2.5 bg-[#FF4B00] text-white font-black rounded-xl text-xs shadow-lg"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
