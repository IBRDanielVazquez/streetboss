import { useState, useEffect } from 'react'
import { getProspects, createProspect, checkProspectDuplicates, importProspects } from '../../services/crmV3Service'
import MobileProspectingDashboard from './MobileProspectingDashboard'
import { UserPlus, Upload, Sparkles, FileSpreadsheet, ShieldAlert, Smartphone, ListFilter } from 'lucide-react'

export default function ProspectosTab({ onConvertProspectToBusiness }) {
  const [prospects, setProspects] = useState([])
  const [mode, setMode] = useState('mobile_dashboard') // 'mobile_dashboard', 'list', 'manual', 'import'
  const [search, setSearch] = useState('')

  // Formulario manual
  const [manualForm, setManualForm] = useState({
    business_name: '',
    category: 'Restaurante',
    contact_name: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    colonia: '',
    city: 'Tuxtla Gutiérrez',
    state: 'Chiapas',
    facebook: '',
    instagram: '',
    tiktok: '',
    website: '',
    source: 'Manual',
    notes: '',
    status: 'Nuevo',
  })

  const [duplicatesWarning, setDuplicatesWarning] = useState([])

  // Importación CSV/XLSX
  const [rawFileContent, setRawFileContent] = useState('')
  const [parsedRows, setParsedRows] = useState([])
  const [columnMapping, setColumnMapping] = useState({
    business_name: 0,
    phone: 1,
    contact_name: 2,
    email: 3,
  })

  const reloadProspects = () => {
    setProspects(getProspects())
  }

  useEffect(() => {
    reloadProspects()
  }, [])

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (!manualForm.business_name) return

    const dupes = checkProspectDuplicates(manualForm)
    setDuplicatesWarning(dupes)

    const res = createProspect(manualForm)
    reloadProspects()

    if (dupes.length === 0) {
      setMode('mobile_dashboard')
      setManualForm({
        business_name: '', category: 'Restaurante', contact_name: '', phone: '', whatsapp: '',
        email: '', address: '', colonia: '', city: 'Tuxtla Gutiérrez', state: 'Chiapas',
        facebook: '', instagram: '', tiktok: '', website: '', source: 'Manual', notes: '', status: 'Nuevo',
      })
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      setRawFileContent(text)
      
      const lines = text.split(/\r?\n/).filter(line => line.trim())
      const rows = lines.map(line => line.split(/[,;\t]/).map(cell => cell.trim().replace(/^["']|["']$/g, '')))
      
      setParsedRows(rows)
    }
    reader.readAsText(file)
  }

  const handleConfirmImport = () => {
    if (parsedRows.length < 2) return

    const dataRows = parsedRows.slice(1)
    const formattedProspects = dataRows.map(row => ({
      business_name: row[columnMapping.business_name] || 'Negocio Importado',
      phone: row[columnMapping.phone] || '',
      contact_name: row[columnMapping.contact_name] || '',
      email: row[columnMapping.email] || '',
    })).filter(p => p.business_name)

    const importedCount = importProspects(formattedProspects)
    reloadProspects()
    setMode('mobile_dashboard')
    setParsedRows([])
    setRawFileContent('')
    alert(`¡${importedCount} prospectos importados correctamente!`)
  }

  const filteredProspects = prospects.filter(p => 
    p.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  )

  return (
    <div className="space-y-6">
      {/* Header & Submenú de Navegación de Prospección */}
      <div className="bg-[#14161F] p-4 sm:p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <UserPlus className="text-[#FF4B00]" size={24} /> Prospección Comercial StreetBoss
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Gestión comercial de la Base Maestra Oficial de Restaurantes (1,901 registros validados).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMode('mobile_dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'mobile_dashboard' ? 'bg-[#FF4B00] text-white shadow-lg' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Smartphone size={15} /> Dashboard Móvil 1,901
          </button>

          <button
            onClick={() => setMode('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'list' ? 'bg-[#FF4B00] text-white shadow-lg' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <ListFilter size={15} /> Capturas Locales ({prospects.length})
          </button>

          <button
            onClick={() => setMode('manual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'manual' ? 'bg-[#FF4B00] text-white shadow-lg' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            + Captura Manual
          </button>

          <button
            onClick={() => setMode('import')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'import' ? 'bg-[#FF4B00] text-white shadow-lg' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Upload size={14} className="inline mr-1" /> Importar CSV
          </button>
        </div>
      </div>

      {/* MODO DASHBOARD MÓVIL PRINCIPAL (1,901 RESTAURANTES) */}
      {mode === 'mobile_dashboard' && (
        <MobileProspectingDashboard onConvertProspectToBusiness={onConvertProspectToBusiness} />
      )}

      {/* MODO LISTA LOCAL DE CAPTURAS */}
      {mode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 bg-[#14161F] p-4 rounded-xl border border-white/5">
            <input
              type="text"
              placeholder="Filtrar por negocio, contacto o teléfono..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF4B00]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProspects.map(p => (
              <div
                key={p.id}
                className="bg-[#14161F] border border-white/5 hover:border-white/15 rounded-2xl p-5 space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-black text-white">{p.business_name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF4B00]/10 text-[#FF6A1A] border border-[#FF4B00]/20">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Contacto: <span className="text-white font-bold">{p.contact_name || 'N/A'}</span> · {p.phone || 'Sin teléfono'}
                  </p>
                  {p.email && <p className="text-xs text-gray-400">Email: {p.email}</p>}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-gray-500 text-[10px]">Origen: {p.source}</span>
                  <button
                    onClick={() => onConvertProspectToBusiness && onConvertProspectToBusiness(p)}
                    className="flex items-center gap-1.5 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black px-4 py-2 rounded-xl text-xs shadow-md transition-all transform hover:scale-105"
                  >
                    <Sparkles size={14} /> Convertir en cliente
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODO CAPTURA MANUAL */}
      {mode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-6 max-w-3xl mx-auto shadow-2xl">
          <h3 className="text-lg font-black text-white border-b border-white/5 pb-3">Captura Manual de Prospecto</h3>

          {duplicatesWarning.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2 text-xs text-amber-300">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                <ShieldAlert size={18} /> Posibles Duplicados Detectados
              </div>
              <ul className="list-disc list-inside space-y-1">
                {duplicatesWarning.map((d, i) => (
                  <li key={i}>{d.type}: <strong>{d.match}</strong></li>
                ))}
              </ul>
              <p className="text-[11px] text-amber-400/80">Puedes revisar los registros existentes o confirmar la captura si corresponde a otra sucursal.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-300 mb-1">Nombre Comercial *</label>
              <input
                type="text"
                required
                placeholder="Nombre del restaurante"
                value={manualForm.business_name}
                onChange={e => setManualForm({ ...manualForm, business_name: e.target.value })}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-1">Contacto Propietario</label>
              <input
                type="text"
                placeholder="Nombre de la persona"
                value={manualForm.contact_name}
                onChange={e => setManualForm({ ...manualForm, contact_name: e.target.value })}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-1">Teléfono / WhatsApp</label>
              <input
                type="text"
                placeholder="9612466204"
                value={manualForm.phone}
                onChange={e => setManualForm({ ...manualForm, phone: e.target.value, whatsapp: e.target.value })}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-1">Correo Electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={manualForm.email}
                onChange={e => setManualForm({ ...manualForm, email: e.target.value })}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setMode('mobile_dashboard')}
              className="px-4 py-2.5 rounded-xl bg-white/5 text-gray-300 font-bold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-xs shadow-lg"
            >
              Guardar Prospecto
            </button>
          </div>
        </form>
      )}

      {/* MODO IMPORTACIÓN */}
      {mode === 'import' && (
        <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-6 max-w-3xl mx-auto shadow-2xl">
          <h3 className="text-lg font-black text-white border-b border-white/5 pb-3">Importar Prospectos desde Archivo CSV / XLSX</h3>

          <div className="space-y-4 text-xs">
            <div className="border-2 border-dashed border-white/10 hover:border-[#FF4B00]/50 rounded-2xl p-8 text-center space-y-2 bg-[#0D0E12]/50">
              <FileSpreadsheet size={36} className="mx-auto text-[#FF4B00]" />
              <p className="font-bold text-white">Selecciona o arrastra tu archivo CSV / Excel</p>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="block mx-auto text-gray-400 text-xs cursor-pointer"
              />
            </div>

            {parsedRows.length > 0 && (
              <div className="space-y-3 bg-[#0D0E12] p-4 rounded-xl border border-white/10">
                <p className="font-bold text-emerald-400">Archivos procesados: {parsedRows.length - 1} filas encontradas</p>
                <div className="overflow-x-auto max-h-48">
                  <table className="w-full text-left text-gray-300 font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-white/10 text-white">
                        {parsedRows[0]?.slice(0, 4).map((col, i) => (
                          <th key={i} className="p-2">{col || `Columna ${i+1}`}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.slice(1, 6).map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-white/5">
                          {row.slice(0, 4).map((cell, cIdx) => (
                            <td key={cIdx} className="p-2 truncate">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleConfirmImport}
                  className="w-full bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black py-3 rounded-xl shadow-lg mt-2"
                >
                  Confirmar e Importar {parsedRows.length - 1} Prospectos
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
