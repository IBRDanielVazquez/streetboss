import { useState, useMemo, useCallback } from 'react'
import masterProspectsData from '../../data/master_prospects.json'
import ProspectDetailModal from './ProspectDetailModal'
import PagosTab from './PagosTab'
import { getProspectCommercialData, saveProspectCommercialData } from '../../services/crmV3Service'
import { Search, MapPin, ChevronRight, SlidersHorizontal, X, Star } from 'lucide-react'

export default function MobileProspectingDashboard({ onConvertProspectToBusiness }) {
  const [prospects, setProspects] = useState(() => {
    const saved = localStorage.getItem('sb_v3_master_prospects_override')
    if (saved) {
      try {
        const parsedSaved = JSON.parse(saved)
        const overrideMap = new Map(parsedSaved.map(p => [p.id, p]))
        return masterProspectsData.map(p => ({ ...p, ...overrideMap.get(p.id) }))
      } catch (e) {
        return masterProspectsData
      }
    }
    return masterProspectsData
  })

  const [selectedProspect, setSelectedProspect] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCity, setSelectedCity] = useState('Todas')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [onlyWhatsapp, setOnlyWhatsapp] = useState(false)
  const [onlyFacebook, setOnlyFacebook] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [activeTab, setActiveTab] = useState('PROSPECTOS')
  const [displayLimit, setDisplayLimit] = useState(40)
  
  const cities = useMemo(() => {
    const set = new Set(prospects.map(p => p.city || p.ciudad).filter(Boolean))
    return ['Todas', ...Array.from(set).sort()]
  }, [prospects])

  const categories = useMemo(() => {
    const set = new Set(prospects.map(p => p.category || p.giro).filter(Boolean))
    return ['Todas', ...Array.from(set).sort()]
  }, [prospects])

  const handleUpdateProspect = useCallback((updatedProspect) => {
    setProspects(prev => {
      const next = prev.map(p => p.id === updatedProspect.id ? { ...p, ...updatedProspect } : p)
      const overrides = next.filter(p => {
        const c = getProspectCommercialData(p.id)
        return c.status !== 'NUEVO' || c.notes
      })
      localStorage.setItem('sb_v3_master_prospects_override', JSON.stringify(overrides))
      return next
    })
    setSelectedProspect(updatedProspect)
  }, [])

  const handleQuickContactado = (prospect, e) => {
    e.stopPropagation()
    const now = new Date().toISOString().split('T')[0]
    saveProspectCommercialData(prospect.id, {
      status: 'CONTACTADO',
      contact_date: now,
      last_contact: now
    })
    handleUpdateProspect({ ...prospect, __updateTrigger: Date.now() })
  }

  const getRatingStars = (score) => {
    const s = score || 0
    if (s >= 85) return 5
    if (s >= 70) return 4
    if (s >= 55) return 3
    if (s >= 40) return 2
    return 1
  }

  const renderStars = (stars) => {
    return (
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={11} className={i <= stars ? "fill-amber-400 text-amber-400" : "fill-white/10 text-transparent"} />
        ))}
      </div>
    )
  }

  const prospectosConEstado = useMemo(() => {
    return prospects.map(p => {
      const comm = getProspectCommercialData(p.id)
      let cStatus = comm?.status || p.status || 'NUEVO'
      
      const validStates = ['CONTACTADO', 'INTERESADO', 'PRODUCCION', 'CLIENTE', 'NO_INTERESADO']
      if (!validStates.includes(cStatus)) {
        cStatus = 'NUEVO'
      }

      return { ...p, currentStatus: cStatus }
    })
  }, [prospects])

  const tabsCounts = useMemo(() => {
    let counts = { PROSPECTOS: 0, CONTACTADOS: 0, INTERESADOS: 0, PRODUCCIÓN: 0, CLIENTES: 0, 'NO INTERESADOS': 0 }
    prospectosConEstado.forEach(p => {
      if (p.currentStatus === 'NUEVO') counts.PROSPECTOS++
      else if (p.currentStatus === 'CONTACTADO') counts.CONTACTADOS++
      else if (p.currentStatus === 'INTERESADO') counts.INTERESADOS++
      else if (p.currentStatus === 'PRODUCCION') counts.PRODUCCIÓN++
      else if (p.currentStatus === 'CLIENTE') counts.CLIENTES++
      else if (p.currentStatus === 'NO_INTERESADO') counts['NO INTERESADOS']++
    })
    return counts
  }, [prospectosConEstado])

  const filteredProspects = useMemo(() => {
    const query = search.toLowerCase().trim()
    let mappedStatus = 'NUEVO'
    if (activeTab === 'CONTACTADOS') mappedStatus = 'CONTACTADO'
    if (activeTab === 'INTERESADOS') mappedStatus = 'INTERESADO'
    if (activeTab === 'PRODUCCIÓN') mappedStatus = 'PRODUCCION'
    if (activeTab === 'CLIENTES') mappedStatus = 'CLIENTE'
    if (activeTab === 'NO INTERESADOS') mappedStatus = 'NO_INTERESADO'

    return prospectosConEstado.filter(p => {
      if (p.currentStatus !== mappedStatus) return false

      const name = p.nombre || p.business_name || p.name || ''
      const phone = p.whatsapp || p.telefono || p.phone || ''

      if (query) {
        const matchesName = name.toLowerCase().includes(query)
        const matchesPhone = phone.includes(query)
        const matchesAddress = p.address?.toLowerCase().includes(query) || p.direccion?.toLowerCase().includes(query)
        if (!matchesName && !matchesPhone && !matchesAddress) return false
      }

      const pCity = p.city || p.ciudad
      if (selectedCity !== 'Todas' && pCity !== selectedCity) return false

      const pCat = p.category || p.giro
      if (selectedCategory !== 'Todas' && pCat !== selectedCategory) return false

      if (onlyWhatsapp && !phone) return false
      if (onlyFacebook && !p.facebook) return false

      return true
    })
  }, [prospectosConEstado, activeTab, search, selectedCity, selectedCategory, onlyWhatsapp, onlyFacebook])

  const renderTabs = () => {
    const TABS = ['PROSPECTOS', 'CONTACTADOS', 'INTERESADOS', 'PRODUCCIÓN', 'CLIENTES', 'NO INTERESADOS', 'PAGOS']
    
    return (
      <div className="bg-[#14161F] p-2 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex overflow-x-auto gap-2 p-1 no-scrollbar">
          {TABS.map(tab => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setDisplayLimit(40) }}
                className={`flex flex-col items-center justify-center min-w-[90px] px-3 py-2 rounded-xl transition-all font-black text-[10px] sm:text-xs whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#FF4B00] text-white shadow-lg' 
                    : 'bg-[#0D0E12] text-gray-400 hover:bg-white/5 hover:text-white border border-white/5'
                }`}
              >
                <span>{tab}</span>
                {tab !== 'PAGOS' && (
                  <span className={`text-[10px] mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                    {tabsCounts[tab]}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {renderTabs()}

      {activeTab === 'PAGOS' ? (
        <PagosTab prospects={prospectosConEstado} />
      ) : (
        <>
          <div className="bg-[#14161F] p-3 rounded-2xl border border-white/5 shadow-lg space-y-2.5">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value)
                  setDisplayLimit(40)
                }}
                placeholder="Buscar restaurante, teléfono, dirección..."
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4B00]"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button onClick={() => setShowFiltersModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 whitespace-nowrap">
                <SlidersHorizontal size={12} /> Filtros
              </button>
              <button onClick={() => setOnlyWhatsapp(!onlyWhatsapp)} className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${onlyWhatsapp ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400' : 'bg-[#0D0E12] border-white/10 text-gray-400'}`}>
                💬 WhatsApp
              </button>
              <button onClick={() => setOnlyFacebook(!onlyFacebook)} className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${onlyFacebook ? 'bg-blue-600/20 border-blue-500/40 text-blue-400' : 'bg-[#0D0E12] border-white/10 text-gray-400'}`}>
                📘 Facebook
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProspects.slice(0, displayLimit).map(prospect => {
              const pName = prospect.nombre || prospect.business_name || prospect.name || 'Restaurante'
              const pPhone = prospect.whatsapp || prospect.telefono || prospect.phone || ''
              const pCat = prospect.category || prospect.giro || 'Restaurante'
              const pCity = prospect.city || prospect.ciudad || 'Tuxtla Gutiérrez'
              const pPriority = prospect.prioridad_prospeccion || 'D'
              const pScore = prospect.score_oportunidad || 0
              const stars = getRatingStars(pScore)
              
              return (
                <div
                  key={prospect.id}
                  onClick={() => setSelectedProspect(prospect)}
                  className="bg-[#14161F] border border-white/5 hover:border-white/20 rounded-2xl p-4 space-y-3 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] flex flex-col justify-between group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-sm font-black text-white group-hover:text-[#FF6A1A] transition-colors leading-tight line-clamp-1">
                        {pName}
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                        {pCat} • {pCity}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                        pPriority === 'A+' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        pPriority === 'A' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        pPriority === 'B' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        pPriority === 'C' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {pPriority}
                      </span>
                      {renderStars(stars)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {pPhone && <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold">WA</span>}
                      {prospect.facebook && <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-bold">FB</span>}
                      {prospect.instagram && <span className="bg-pink-500/10 text-pink-400 px-1.5 py-0.5 rounded text-[10px] font-bold">IG</span>}
                    </div>

                    {activeTab === 'PROSPECTOS' && (
                      <button 
                        onClick={(e) => handleQuickContactado(prospect, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1D29] hover:bg-[#FF4B00] hover:text-white text-gray-400 font-bold rounded-lg text-[10px] transition-colors border border-white/5 shadow"
                      >
                        <div className="w-3 h-3 border border-current rounded-sm"></div>
                        Contactado
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProspects.length > displayLimit && (
            <div className="text-center pt-3 pb-6">
              <button
                onClick={() => setDisplayLimit(prev => prev + 40)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 text-xs shadow-lg transition-all"
              >
                Cargar 40 más (Mostrando {displayLimit} de {filteredProspects.length})
              </button>
            </div>
          )}
        </>
      )}

      {selectedProspect && (
        <ProspectDetailModal
          prospect={selectedProspect}
          onClose={() => setSelectedProspect(null)}
          onUpdateProspect={handleUpdateProspect}
          onConvertProspectToBusiness={onConvertProspectToBusiness}
        />
      )}

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
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-2.5 text-white">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 font-bold mb-1">Ciudad / Municipio</label>
                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-2.5 text-white">
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="pt-3 flex justify-end gap-2">
              <button onClick={() => setShowFiltersModal(false)} className="w-full py-2.5 bg-[#FF4B00] text-white font-black rounded-xl text-xs shadow-lg">
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
