import { useState } from 'react'
import { DEMOS_OFICIALES } from '../../data/demoShowcase'
import { generatePersonalizedDemoForProspect, slugify } from '../../services/crmV3Service'
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
  Share2,
  MessageSquare
} from 'lucide-react'

export default function ProspectDetailModal({ prospect, onClose, onUpdateProspect, onConvertProspectToBusiness }) {
  if (!prospect) return null

  const businessNameUpper = (prospect.business_name || 'RESTAURANTE').toUpperCase()
  const baseSlug = slugify(prospect.business_name || 'restaurante-demo')

  // Find suggested demo base according to category or assigned demo
  const initialSuggestedDemo = DEMOS_OFICIALES.find(d => 
    d.id === prospect.assigned_demo || 
    d.giro?.toLowerCase().includes((prospect.category || '').toLowerCase())
  ) || DEMOS_OFICIALES[0]

  const [assignedDemo, setAssignedDemo] = useState(initialSuggestedDemo.id)
  const [status, setStatus] = useState(prospect.status || 'Nuevo')
  const [notes, setNotes] = useState(prospect.notes || '')
  const [demoGenerated, setDemoGenerated] = useState(false)
  const [demoUrl, setDemoUrl] = useState(`https://streetboss.mx/demo/${baseSlug}`)
  const [copied, setCopied] = useState(false)

  const selectedDemoObj = DEMOS_OFICIALES.find(d => d.id === assignedDemo) || DEMOS_OFICIALES[0]

  // Default IA Outreach Message
  const [customMessage, setCustomMessage] = useState(() => {
    return `Hola equipo de ${prospect.business_name || 'Negocio'}. 👋

Estuve revisando su página y preparé una demostración interactiva de cómo se vería su menú digital en WhatsApp usando StreetBoss.

👉 Ver demo sugerida:
https://streetboss.mx/demo/${selectedDemoObj.id}

Si les gusta, con gusto podemos activarla para ustedes sin comisiones por pedido.`
  })

  // Handle "🎁 GENERAR DEMO"
  const handleGenerateDemo = () => {
    try {
      const res = generatePersonalizedDemoForProspect({
        ...prospect,
        assigned_demo: assignedDemo,
      })

      const generatedUrl = res.demoUrl || `https://streetboss.mx/demo/${baseSlug}`
      setDemoUrl(generatedUrl)
      setDemoGenerated(true)

      const autoMsg = `Hola equipo de ${prospect.business_name || 'Negocio'}. 👋

Estuve revisando su página y preparé una demostración personalizada de cómo se vería su restaurante usando StreetBoss.

👉 Ver demo
${generatedUrl}

Si les gusta, con gusto podemos activarla para ustedes.`

      setCustomMessage(autoMsg)
    } catch (e) {
      console.error(e)
      alert('Demo personalizada generada en /demo/' + baseSlug)
    }
  }

  // Action links
  const cleanPhone = (prospect.whatsapp || prospect.phone || '').replace(/\D/g, '')
  const whatsappNumber = cleanPhone.length === 10 ? `52${cleanPhone}` : cleanPhone
  const waSendUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`
    : '#'

  const fbClean = prospect.facebook?.trim() || ''
  const fbUrl = fbClean
    ? (fbClean.startsWith('http') ? fbClean : `https://${fbClean}`)
    : `https://www.facebook.com/search/top?q=${encodeURIComponent(prospect.business_name + ' ' + (prospect.city || ''))}`

  const igClean = prospect.instagram?.trim() || ''
  const igUrl = igClean
    ? (igClean.startsWith('http') ? igClean : `https://instagram.com/${igClean.replace('@', '')}`)
    : `https://www.instagram.com/explore/tags/${encodeURIComponent(slugify(prospect.business_name))}`

  const webClean = prospect.website?.trim() || ''
  const webUrl = webClean ? (webClean.startsWith('http') ? webClean : `https://${webClean}`) : null

  const mapsClean = prospect.maps_url?.trim() || ''
  const mapsUrl = mapsClean || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prospect.business_name + ' ' + (prospect.address || prospect.city || ''))}`

  // Extract FB handle for Messenger if possible
  let messengerUrl = '#'
  if (fbClean) {
    const handleMatch = fbClean.match(/facebook\.com\/([^/?#]+)/i)
    if (handleMatch && handleMatch[1] && !['search', 'groups', 'pages'].includes(handleMatch[1])) {
      messengerUrl = `https://m.me/${handleMatch[1]}`
    } else {
      messengerUrl = fbUrl
    }
  }

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    onUpdateProspect({
      ...prospect,
      status,
      assigned_demo: assignedDemo,
      notes,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161F] border border-white/10 w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Modal Top Header Bar */}
        <div className="px-5 py-4 border-b border-white/10 bg-[#0D0E12] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF4B00]/10 text-[#FF6A1A] border border-[#FF4B00]/20 font-black text-[10px]">
              Ficha del Negocio
            </span>
            <span className="text-gray-400 font-bold">• {prospect.city || 'Tuxtla'}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* SECTION 1: HEADER COMERCIAL */}
          <div className="text-center bg-[#0D0E12] p-5 rounded-2xl border border-white/10 space-y-2 shadow-inner">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none uppercase">
              {businessNameUpper}
            </h2>

            {/* Stars & Rating */}
            <div className="flex items-center justify-center gap-1 text-amber-400 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-bold text-gray-300 ml-1.5">
                {prospect.rating ? `${prospect.rating} (${prospect.reviews_count || 0} opiniones)` : '⭐⭐⭐⭐⭐'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1 font-semibold">
              <span className="text-white font-bold">{prospect.category || 'Restaurante'}</span>
              <span>•</span>
              <span>{prospect.city || 'Tuxtla Gutiérrez'}</span>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* SECTION 2: BOTONES DE ACCIÓN RÁPIDA (PULGAR FRIENDLY) */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Canales de Contacto Directo</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {prospect.phone ? (
                <a
                  href={`tel:${prospect.phone}`}
                  className="flex items-center justify-center gap-2 py-3 px-3 bg-[#1A1D29] hover:bg-[#222636] border border-white/10 rounded-xl text-white font-bold transition-all text-xs active:scale-95 shadow"
                >
                  <Phone size={16} className="text-emerald-400" /> 📞 Llamar
                </a>
              ) : (
                <button disabled className="opacity-40 flex items-center justify-center gap-2 py-3 px-3 bg-white/5 border border-white/5 rounded-xl font-bold text-gray-500 text-xs">
                  📞 Sin Teléfono
                </button>
              )}

              {whatsappNumber ? (
                <a
                  href={waSendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-black rounded-xl transition-all text-xs active:scale-95 shadow"
                >
                  <MessageCircle size={16} /> 💬 WhatsApp
                </a>
              ) : (
                <button disabled className="opacity-40 flex items-center justify-center gap-2 py-3 px-3 bg-white/5 border border-white/5 rounded-xl font-bold text-gray-500 text-xs">
                  💬 Sin WhatsApp
                </button>
              )}

              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 font-bold rounded-xl transition-all text-xs active:scale-95 shadow"
              >
                <Facebook size={16} /> 📘 Facebook
              </a>

              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-400 font-bold rounded-xl transition-all text-xs active:scale-95 shadow"
              >
                <Instagram size={16} /> 📸 Instagram
              </a>

              {webUrl ? (
                <a
                  href={webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold rounded-xl transition-all text-xs active:scale-95 shadow"
                >
                  <Globe size={16} /> 🌎 Sitio Web
                </a>
              ) : (
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(prospect.business_name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-3 bg-[#1A1D29] hover:bg-[#222636] border border-white/10 text-gray-300 font-bold rounded-xl transition-all text-xs active:scale-95 shadow"
                >
                  <Globe size={16} /> 🌎 Buscar Sitio
                </a>
              )}

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold rounded-xl transition-all text-xs active:scale-95 shadow"
              >
                <MapPin size={16} /> 📍 Maps
              </a>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* SECTION 3: DEMO SUGERIDO */}
          <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-gray-400 flex items-center gap-1.5">
                🎯 Demo Sugerido
              </span>
              <select
                value={assignedDemo}
                onChange={e => setAssignedDemo(e.target.value)}
                className="bg-[#14161F] border border-white/10 rounded-lg px-2.5 py-1 text-white font-bold text-[11px] focus:outline-none focus:border-[#FF4B00]"
              >
                {DEMOS_OFICIALES.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between bg-[#14161F] p-3 rounded-xl border border-white/5">
              <div>
                <p className="font-black text-white text-sm">{selectedDemoObj.nombre}</p>
                <p className="text-[11px] text-gray-400">Giro: {selectedDemoObj.giro}</p>
              </div>

              <a
                href={demoGenerated ? `/demo/${baseSlug}` : `/menu/${selectedDemoObj.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/10 text-xs flex items-center gap-1"
              >
                [ Ver Demo ] <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* SECTION 4: BOTÓN HUUUUUGE "🎁 GENERAR DEMO" */}
          <div className="space-y-2">
            <button
              onClick={handleGenerateDemo}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#FF4B00] to-[#FF6A1A] hover:from-[#FF6A1A] hover:to-[#FF4B00] text-white font-black text-base sm:text-lg rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-wide border border-white/20"
            >
              <Gift size={24} className="animate-bounce" /> 🎁 GENERAR DEMO
            </button>

            {demoGenerated && (
              <p className="text-center text-[11px] text-emerald-400 font-bold bg-emerald-500/10 py-1.5 px-3 rounded-xl border border-emerald-500/20">
                ¡Demo creada exitosamente en <u>streetboss.mx/demo/{baseSlug}</u>!
              </p>
            )}
          </div>

          <div className="h-px bg-white/10" />

          {/* SECTION 5: MENSAJE IA Y HERRAMIENTAS DE PROSPECCIÓN */}
          <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-gray-400 flex items-center gap-1.5">
                <Bot size={15} className="text-[#FF4B00]" /> 🤖 Mensaje IA / Outreach
              </span>

              <span className="text-[10px] text-gray-500 font-bold">Editable</span>
            </div>

            <textarea
              rows={5}
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              className="w-full bg-[#14161F] border border-white/10 rounded-xl p-3 text-gray-200 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-[#FF4B00]"
            />

            {/* BOTONES DE COPIAR Y ENVIAR WHATSAPP */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyMessage}
                className="py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all text-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <Copy size={15} /> 📋 {copied ? '¡Copiado!' : 'Copiar mensaje'}
              </button>

              {whatsappNumber ? (
                <a
                  href={waSendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send size={15} /> 💬 Enviar WhatsApp
                </a>
              ) : (
                <button disabled className="opacity-40 py-3 px-4 bg-white/5 border border-white/10 text-gray-500 font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                  💬 Sin WhatsApp
                </button>
              )}
            </div>
          </div>

          {/* SECTION 6: ESTADO COMERCIAL & NOTAS */}
          <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-gray-400 flex items-center gap-1.5">
                <Tag size={14} className="text-[#FF4B00]" /> Estado Comercial
              </span>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="bg-[#14161F] border border-white/10 rounded-lg px-2.5 py-1 text-white font-bold text-[11px] focus:outline-none focus:border-[#FF4B00]"
              >
                <option value="Nuevo">🔵 Nuevo Leads</option>
                <option value="Contactado">🟡 Contactado</option>
                <option value="Demo Enviada">🟣 Demo Enviada</option>
                <option value="Interesado">🟠 Interesado / Negociación</option>
                <option value="Cerrado">🟢 Cliente Cerrado</option>
                <option value="Descartado">🔴 Descartado</option>
              </select>
            </div>

            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Bitácora rápida o acuerdos..."
              className="w-full bg-[#14161F] border border-white/10 rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4B00] text-xs"
            />
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-white/10 bg-[#0D0E12] flex items-center justify-between gap-3 sticky bottom-0 z-20">
          <button
            onClick={() => {
              if (onConvertProspectToBusiness) {
                onConvertProspectToBusiness(prospect)
                onClose()
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF4B00]/10 border border-[#FF4B00]/30 hover:bg-[#FF4B00]/20 text-[#FF6A1A] font-black text-xs transition-all"
          >
            <Sparkles size={14} /> Convertir Cliente
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition-all"
            >
              Cerrar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-xs shadow-lg transition-all"
            >
              Guardar Cambios
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
