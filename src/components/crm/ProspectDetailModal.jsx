import { useState, useEffect } from 'react'
import { DEMOS_OFICIALES } from '../../data/demoShowcase'
import {
  generatePersonalizedDemoForProspect,
  slugify,
  getProspectCommercialData,
  saveProspectCommercialData
} from '../../services/crmV3Service'
import {
  X,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  Globe,
  MapPin,
  Star,
  Sparkles,
  ExternalLink,
  Send,
  Copy,
  Gift,
  Bot,
  Tag,
  Calendar,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function ProspectDetailModal({ prospect, onClose, onUpdateProspect, onConvertProspectToBusiness }) {
  if (!prospect) return null

  const prospectName = prospect.name || prospect.business_name || 'Restaurante'
  const prospectCategory = prospect.category || prospect.giro || 'Restaurante'
  const prospectCity = prospect.city || prospect.ciudad || 'Tuxtla Gutiérrez'
  const prospectAddress = prospect.address || prospect.direccion || ''
  
  const baseSlug = slugify(prospectName)

  // Demo sugerida inicial
  const initialSuggestedDemo = DEMOS_OFICIALES.find(d =>
    d.id === prospect.assigned_demo ||
    d.giro?.toLowerCase().includes(prospectCategory.toLowerCase())
  ) || DEMOS_OFICIALES[0]

  // Cargar estados comerciales aislados del CRM (FASE 4 & 5)
  const initialCommercial = getProspectCommercialData(prospect.id)

  const [assignedDemo, setAssignedDemo] = useState(prospect.assigned_demo || initialCommercial.assigned_demo || initialSuggestedDemo.id)
  const [status, setStatus] = useState(prospect.status || initialCommercial.status || 'Nuevo')
  const [priority, setPriority] = useState(initialCommercial.priority || 'Media')
  const [assignedRep, setAssignedRep] = useState(initialCommercial.assigned_rep || '')
  const [lastContact, setLastContact] = useState(initialCommercial.last_contact || '')
  const [nextFollowup, setNextFollowup] = useState(initialCommercial.next_followup || '')
  const [demoSent, setDemoSent] = useState(initialCommercial.demo_sent || false)
  const [notes, setNotes] = useState(prospect.notes || initialCommercial.notes || '')
  
  const [demoGenerated, setDemoGenerated] = useState(false)
  const [demoUrl, setDemoUrl] = useState(`https://streetboss.mx/demo/${baseSlug}`)
  const [copied, setCopied] = useState(false)
  const [generatedSlug, setGeneratedSlug] = useState(baseSlug)

  const selectedDemoObj = DEMOS_OFICIALES.find(d => d.id === assignedDemo) || DEMOS_OFICIALES[0]

  // Mensaje IA personalizado
  const [customMessage, setCustomMessage] = useState(() => {
    return `Hola equipo de ${prospectName}. 👋\n\nEstuve revisando su página y preparé una demostración interactiva de cómo se vería su menú digital en WhatsApp usando StreetBoss.\n\n👉 Ver demo sugerida:\nhttps://streetboss.mx/demo/${selectedDemoObj.id}\n\nSi les gusta, con gusto podemos activarla para ustedes sin comisiones por pedido.`
  })

  // Generar demo personalizada
  const handleGenerateDemo = () => {
    try {
      const res = generatePersonalizedDemoForProspect({
        ...prospect,
        business_name: prospectName,
        category: prospectCategory,
        city: prospectCity,
        assigned_demo: assignedDemo,
      })

      const finalSlug = res.slug || baseSlug
      const generatedUrl = res.demoUrl || `https://streetboss.mx/demo/${finalSlug}`
      setGeneratedSlug(finalSlug)
      setDemoUrl(generatedUrl)
      setDemoGenerated(true)
      setDemoSent(true)

      const autoMsg = `Hola equipo de ${prospectName}. 👋\n\nEstuve revisando su página y preparé una demostración personalizada de cómo se vería su menú digital usando StreetBoss.\n\n👉 Ver demo\n${generatedUrl}\n\nSi les gusta, con gusto podemos activarla para ustedes.`
      setCustomMessage(autoMsg)
    } catch (e) {
      console.error(e)
    }
  }

  // Normalización de canales de contacto (Ocultamiento automático de vacíos)
  const phoneClean = (prospect.phone || '').replace(/\D/g, '')
  const waClean = (prospect.whatsapp || prospect.phone || '').replace(/\D/g, '')
  const whatsappNumber = waClean.length >= 10 ? (waClean.length === 10 ? `52${waClean}` : waClean) : ''
  const directPhone = phoneClean.length >= 10 ? phoneClean : ''
  
  // Omitir llamada directa si es exactamente idéntica al WhatsApp de 10 dígitos
  const showCallButton = directPhone && directPhone !== waClean

  const waSendUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}` : ''

  const fbClean = (prospect.facebook || '').trim()
  const fbUrl = fbClean ? (fbClean.startsWith('http') ? fbClean : `https://${fbClean}`) : ''

  const igClean = (prospect.instagram || '').trim()
  const igUrl = igClean ? (igClean.startsWith('http') ? igClean : `https://instagram.com/${igClean.replace('@', '')}`) : ''

  const webClean = (prospect.website || '').trim()
  const webUrl = webClean ? (webClean.startsWith('http') ? webClean : `https://${webClean}`) : ''

  const mapsClean = (prospect.maps_url || '').trim()
  const mapsUrl = mapsClean || (prospectAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prospectName + ' ' + prospectAddress)}` : '')

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    // Guardar comercialmente aislado (FASE 4)
    saveProspectCommercialData(prospect.id, {
      status,
      priority,
      assigned_rep: assignedRep,
      last_contact: lastContact || new Date().toISOString().split('T')[0],
      next_followup: nextFollowup,
      assigned_demo: assignedDemo,
      demo_sent: demoSent,
      notes,
    })

    if (onUpdateProspect) {
      onUpdateProspect({
        ...prospect,
        status,
        assigned_demo: assignedDemo,
        notes,
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161F] border border-white/10 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header Modal Bar */}
        <div className="px-5 py-3.5 border-b border-white/10 bg-[#0D0E12] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF4B00]/10 text-[#FF6A1A] border border-[#FF4B00]/20 font-black text-[10px] uppercase tracking-wider">
              Ficha del Negocio
            </span>
            <span className="text-gray-400 font-bold text-xs">• {prospectCity}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* BLOQUE A: IDENTIDAD (READ-ONLY) */}
          <div className="bg-[#0D0E12] p-4.5 rounded-2xl border border-white/10 space-y-2 text-center shadow-inner">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight">
              {prospectName}
            </h2>

            <div className="flex items-center justify-center gap-1 text-amber-400 pt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-bold text-gray-300 ml-1">
                {prospect.rating ? `${prospect.rating} (${prospect.reviews_count || 0})` : '5.0'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-semibold">
              <span className="text-white font-bold">{prospectCategory}</span>
              <span>•</span>
              <span>{prospectCity}</span>
              {prospect.completeness_score && (
                <>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">Score {prospect.completeness_score}%</span>
                </>
              )}
            </div>

            {prospectAddress && (
              <p className="text-[11px] text-gray-400 pt-1 leading-snug">
                📍 {prospectAddress}
              </p>
            )}
          </div>

          {/* BLOQUE B: CONTACTO (OCULTADO AUTOMÁTICO DE VACÍOS) */}
          {(whatsappNumber || showCallButton || fbUrl || igUrl || webUrl || mapsUrl) && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Canales de Contacto Directo</h4>
              <div className="grid grid-cols-2 gap-2">
                {whatsappNumber && (
                  <a
                    href={waSendUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-black rounded-xl transition-all text-xs active:scale-95 shadow"
                  >
                    <MessageCircle size={15} /> 💬 WhatsApp
                  </a>
                )}

                {showCallButton && (
                  <a
                    href={`tel:${directPhone}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#1A1D29] hover:bg-[#222636] border border-white/10 text-white font-bold rounded-xl transition-all text-xs active:scale-95 shadow"
                  >
                    <Phone size={15} className="text-emerald-400" /> 📞 Llamar
                  </a>
                )}

                {fbUrl && (
                  <a
                    href={fbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 font-bold rounded-xl transition-all text-xs active:scale-95 shadow"
                  >
                    <Facebook size={15} /> 📘 Facebook
                  </a>
                )}

                {igUrl && (
                  <a
                    href={igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-400 font-bold rounded-xl transition-all text-xs active:scale-95 shadow"
                  >
                    <Instagram size={15} /> 📸 Instagram
                  </a>
                )}

                {webUrl && (
                  <a
                    href={webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold rounded-xl transition-all text-xs active:scale-95 shadow"
                  >
                    <Globe size={15} /> 🌎 Sitio Web
                  </a>
                )}

                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold rounded-xl transition-all text-xs active:scale-95 shadow"
                  >
                    <MapPin size={15} /> 📍 Maps
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="h-px bg-white/10" />

          {/* BLOQUE C: PROSPECCIÓN Y GESTIÓN COMERCIAL (FASE 4 & 5) */}
          <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-[11px] font-black uppercase text-gray-300 flex items-center gap-1.5">
                <Tag size={15} className="text-[#FF4B00]" /> Prospección Comercial
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="bg-[#14161F] border border-white/10 rounded-lg px-2 py-1 text-white font-bold text-[10px]"
                >
                  <option value="Alta">🔴 Prioridad Alta</option>
                  <option value="Media">🟡 Prioridad Media</option>
                  <option value="Baja">🔵 Prioridad Baja</option>
                </select>

                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="bg-[#14161F] border border-white/10 rounded-lg px-2 py-1 text-white font-bold text-[10px]"
                >
                  <option value="Nuevo">🔵 Nuevo Lead</option>
                  <option value="Contactado">🟡 Contactado</option>
                  <option value="Demo Enviada">🟣 Demo Enviada</option>
                  <option value="Interesado">🟠 Interesado</option>
                  <option value="Cerrado">🟢 Cliente Cerrado</option>
                  <option value="Descartado">🔴 Descartado</option>
                </select>
              </div>
            </div>

            {/* CAMPOS COMERCIALES EXTENDIDOS (FASE 5) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1">
                  <UserCheck size={12} /> Asesor Responsable
                </label>
                <input
                  type="text"
                  value={assignedRep}
                  onChange={e => setAssignedRep(e.target.value)}
                  placeholder="Nombre de asesor..."
                  className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF4B00]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Próximo Seguimiento
                </label>
                <input
                  type="date"
                  value={nextFollowup}
                  onChange={e => setNextFollowup(e.target.value)}
                  className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF4B00]"
                />
              </div>
            </div>

            {/* DEMO PERSONALIZADA Y MENSAJE IA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between bg-[#14161F] p-3 rounded-xl border border-white/5">
                <div>
                  <p className="font-black text-white text-xs">{selectedDemoObj.nombre}</p>
                  <p className="text-[10px] text-gray-400">Plantilla sugerida ({selectedDemoObj.giro})</p>
                </div>

                <a
                  href={demoGenerated ? `/demo/${generatedSlug}` : `/menu/${selectedDemoObj.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/10 text-[11px] flex items-center gap-1"
                >
                  [ Ver Demo ] <ExternalLink size={12} />
                </a>
              </div>

              <button
                onClick={handleGenerateDemo}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#FF4B00] to-[#FF6A1A] hover:from-[#FF6A1A] hover:to-[#FF4B00] text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 uppercase tracking-wide border border-white/10"
              >
                <Gift size={18} /> 🎁 GENERAR DEMO
              </button>

              {demoGenerated && (
                <p className="text-center text-[10px] text-emerald-400 font-bold bg-emerald-500/10 py-1.5 px-3 rounded-xl border border-emerald-500/20">
                  ¡Demo creada! URL: <u>streetboss.mx/demo/{generatedSlug}</u>
                </p>
              )}

              {/* MENSAJE IA / OUTREACH */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <Bot size={13} className="text-[#FF4B00]" /> Mensaje de Venta Personalizado
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono">Autogenerado</span>
                </div>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  className="w-full bg-[#14161F] border border-white/10 rounded-xl p-3 text-gray-200 font-mono text-[10px] leading-relaxed focus:outline-none focus:border-[#FF4B00]"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleCopyMessage}
                    className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all text-xs flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Copy size={14} /> {copied ? '¡Copiado!' : 'Copiar mensaje'}
                  </button>

                  {whatsappNumber ? (
                    <a
                      href={waSendUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow transition-all text-xs flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Send size={14} /> 💬 Enviar WhatsApp
                    </a>
                  ) : (
                    <button disabled className="opacity-40 py-2.5 px-3 bg-white/5 border border-white/10 text-gray-500 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5">
                      💬 Sin WhatsApp
                    </button>
                  )}
                </div>
              </div>

              {/* OBSERVACIONES / BITÁCORA */}
              <div className="pt-2">
                <label className="block text-[10px] font-bold text-gray-400 mb-1">Observaciones / Bitácora Comercial</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Bitácora rápida, objeciones o acuerdos..."
                  className="w-full bg-[#14161F] border border-white/10 rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4B00] text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="p-3.5 border-t border-white/10 bg-[#0D0E12] flex items-center justify-between gap-2 sticky bottom-0 z-20">
          <button
            onClick={() => {
              if (onConvertProspectToBusiness) {
                onConvertProspectToBusiness(prospect)
                onClose()
              }
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FF4B00]/10 border border-[#FF4B00]/30 hover:bg-[#FF4B00]/20 text-[#FF6A1A] font-black text-xs transition-all"
          >
            <Sparkles size={14} /> Convertir Cliente
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition-all"
            >
              Cerrar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-xs shadow-lg transition-all"
            >
              Guardar Cambios
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
