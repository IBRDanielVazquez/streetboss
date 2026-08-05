import { useState, useEffect } from 'react'
import DemosTab from '../components/crm/DemosTab'
import CrearNegocioTab from '../components/crm/CrearNegocioTab'
import ClientesTab from '../components/crm/ClientesTab'
import ProspectosTab from '../components/crm/ProspectosTab'
import { Store, Sparkles, Users, UserPlus, Shield, Activity, Lock } from 'lucide-react'

export default function StreetBossCentral() {
  const [activeTab, setActiveTab] = useState('demos') // 'demos', 'crear', 'clientes', 'prospectos'
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
    <div className="min-h-screen bg-[#0D0E12] text-white font-sans selection:bg-[#FF4B00] selection:text-white pb-24">
      {/* Top Bar Header de la Navegación Interna */}
      <header className="bg-[#14161F] border-b border-white/5 px-4 sm:px-8 py-4 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <a href="/" className="inline-block transition-transform hover:scale-105">
              <img
                src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp"
                alt="StreetBoss Central"
                width="600"
                height="337"
                className="h-10 sm:h-12 w-auto object-contain mix-blend-screen"
              />
            </a>
            <span className="bg-[#FF4B00]/10 text-[#FF6A1A] border border-[#FF4B00]/30 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
              <Shield size={12} /> Central HQ V3
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-gray-300">Sistema Operativo Conectado</span>
          </div>
        </div>
      </header>

      {/* Menú Principal de las 4 Pestañas */}
      <div className="bg-[#14161F]/80 backdrop-blur border-b border-white/5 sticky top-[73px] z-30 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('demos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'demos'
                ? 'bg-[#FF4B00] text-white shadow-[0_0_20px_rgba(255,75,0,0.4)]'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <Store size={16} /> 1. Demos
          </button>

          <button
            onClick={() => setActiveTab('crear')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'crear'
                ? 'bg-[#FF4B00] text-white shadow-[0_0_20px_rgba(255,75,0,0.4)]'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <Sparkles size={16} /> 2. Crear negocio
          </button>

          <button
            onClick={() => setActiveTab('clientes')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'clientes'
                ? 'bg-[#FF4B00] text-white shadow-[0_0_20px_rgba(255,75,0,0.4)]'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <Users size={16} /> 3. Clientes
          </button>

          <button
            onClick={() => setActiveTab('prospectos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'prospectos'
                ? 'bg-[#FF4B00] text-white shadow-[0_0_20px_rgba(255,75,0,0.4)]'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <UserPlus size={16} /> 4. Prospectos
          </button>
        </div>
      </div>

      {/* Área de Trabajo por Pestaña */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        {activeTab === 'demos' && (
          <DemosTab onSelectDemoForBusiness={handleSelectDemoForBusiness} />
        )}

        {activeTab === 'crear' && (
          <CrearNegocioTab
            selectedDemoId={selectedDemoId}
            onBusinessCreated={() => setActiveTab('clientes')}
          />
        )}

        {activeTab === 'clientes' && (
          <ClientesTab />
        )}

        {activeTab === 'prospectos' && (
          <ProspectosTab onConvertProspectToBusiness={handleConvertProspectToBusiness} />
        )}
      </main>
    </div>
  )
}
