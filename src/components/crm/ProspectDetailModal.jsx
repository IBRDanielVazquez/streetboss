import { useState, useEffect } from 'react'
import { DEMOS_OFICIALES } from '../../data/demoShowcase'
import {
  X,
  Phone,
  MessageSquare,
  Facebook,
  Instagram,
  Globe,
  MapPin,
  Star,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Send,
  Building2,
  Calendar,
  Share2,
  Copy,
  Clock
} from 'lucide-react' // Note: imports from lucide-react

import {
  Phone as PhoneIcon,
  MessageCircle,
  Share,
  FileText,
  Tag
} from 'lucide-react'

export default function ProspectDetailModal({ prospect, onClose, onUpdateProspect, onConvertProspectToBusiness }) {
  if (!prospect) return null

  const [status, setStatus] = useState(prospect.status || 'Nuevo')
  const [assignedDemo, setAssignedDemo] = useState(prospect.assigned_demo || DEMOS_OFICIALES[0]?.id || 'demo_taqueria')
  const [notes, setNotes] = useState(prospect.notes || '')
  const [copied, setCopied] = useState(false)
  const [activeMessageTemplate, setActiveMessageTemplate] = useState('demo_intro')

  const selectedDemoObj = DEMOS_OFICIALES.find(d => d.id === assignedDemo) || DEMOS_OFICIALES[0]
  const demoUrl = `https://streetboss.com.mx/menu/${selectedDemoObj.id}`

  // Generador de Mensaje Personalizado de WhatsApp
  const generateWhatsAppMessage = () => {
    const name = prospect.business_name || 'Negocio'
    const contact = prospect.contact_name ? ` ${prospect.contact_name}` : ''

    if (activeMessageTemplate === 'demo_intro') {
      return `Hola${contact}! 👋 Te saluda el equipo de StreetBoss.

Estuve revisando la presencia de *${name}* y preparé una demostración exclusiva de Menú Digital Interactivo para WhatsApp con la plantilla de *${selectedDemoObj.nombre}*.

📱 Ver demo interactiva aquí:
${demoUrl}

Con StreetBoss tus clientes piden directo por WhatsApp sin pagar comisiones por pedido.

¿Te gustaría probar una demo personalizada con tu propio menú?`
    } else if (activeMessageTemplate === 'seguimiento') {
      return `Hola${contact}! Espero que estés teniendo un excelente día.

¿Pudiste ver la demo interactiva de StreetBoss que te compartí para *${name}*?

👉 Link de la demo: ${demoUrl}

Quedo atento por si tienes alguna duda para activar tu versión sin comisiones.`
    } else {
      return `Hola${contact}! Te comparto la propuesta directa de StreetBoss para *${name}*.

Olvídate de las comisiones abusivas de las apps de delivery. Con tu propio menú digital en WhatsApp vendes más y el 100% de la venta es tuya.

Demo oficial: ${demoUrl}`
    }
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

  const cleanPhone = (prospect.whatsapp || prospect.phone || '').replace(/\D/g, '')
  const whatsappNumber = cleanPhone.length === 10 ? `52${cleanPhone}` : cleanPhone
  const waUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(generateWhatsAppMessage())}`
    : '#'

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161F] border border-white/10 w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0D0E12] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4B00]/10 border border-[#FF4B00]/30 flex items-center justify-center text-[#FF4B00] font-black text-lg">
              {prospect.business_name?.[0] || 'R'}
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">{prospect.business_name}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span>{prospect.category || 'Restaurante'}</span>
                <span>•</span>
                <span className="text-gray-300 font-medium">{prospect.city || 'Tuxtla Gutiérrez'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick Metrics & Ratings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0D0E12]/60 p-3.5 rounded-2xl border border-white/5">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black">Calidad de Datos</span>
              <p className="text-sm font-black text-emerald-400 mt-0.5">{prospect.completeness_score || 50}% completitud</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black">Calificación Google</span>
              <p className="text-sm font-black text-amber-400 mt-0.5 flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {prospect.rating || 'N/A'} <span className="text-[10px] text-gray-400">({prospect.reviews_count || 0})</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black">Contacto</span>
              <p className="text-xs font-bold text-white mt-0.5 truncate">{prospect.contact_name || 'No registrado'}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black">Fuente</span>
              <p className="text-xs font-bold text-gray-300 mt-0.5 truncate">{prospect.source || 'Base Maestra'}</p>
            </div>
          </div>

          {/* Direct Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {prospect.phone ? (
              <a
                href={`tel:${prospect.phone}`}
                className="flex items-center justify-center gap-2 py-3 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white transition-all text-xs"
              >
                <PhoneIcon size={14} className="text-emerald-400" /> Llamar
              </a>
            ) : (
              <button disabled className="opacity-40 flex items-center justify-center gap-2 py-3 px-3 bg-white/5 border border-white/10 rounded-xl font-bold text-gray-500 text-xs">
                <PhoneIcon size={14} /> Sin Teléfono
              </button>
            )}

            {whatsappNumber ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all shadow-lg text-xs"
              >
                <MessageCircle size={14} /> Abrir WhatsApp
              </a>
            ) : (
              <button disabled className="opacity-40 flex items-center justify-center gap-2 py-3 px-3 bg-white/5 border border-white/10 rounded-xl font-bold text-gray-500 text-xs">
                <MessageCircle size={14} /> Sin WhatsApp
              </button>
            )}

            {prospect.facebook ? (
              <a
                href={prospect.facebook.startsWith('http') ? prospect.facebook : `https://${prospect.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 font-bold rounded-xl transition-all text-xs"
              >
                <Facebook size={14} /> Facebook Directo
              </a>
            ) : (
              <a
                href={`https://www.facebook.com/search/top?q=${encodeURIComponent(prospect.business_name + ' ' + (prospect.city || ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold rounded-xl transition-all text-xs"
              >
                <Facebook size={14} /> Buscar en FB
              </a>
            )}

            {prospect.maps_url ? (
              <a
                href={prospect.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold rounded-xl transition-all text-xs"
              >
                <MapPin size={14} /> Ver en Maps
              </a>
            ) : (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prospect.business_name + ' ' + (prospect.address || prospect.city || ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold rounded-xl transition-all text-xs"
              >
                <MapPin size={14} /> Buscar Maps
              </a>
            )}
          </div>

          {/* Configuración Comercial: Estado y Demo Asignada */}
          <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-4">
            <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Tag size={14} className="text-[#FF4B00]" /> Estado Comercial y Demo Asignada
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 font-bold mb-1.5">Estado Comercial</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-[#FF4B00]"
                >
                  <option value="Nuevo">🔵 Nuevo Leads</option>
                  <option value="Contactado">🟡 Contactado</option>
                  <option value="Demo Enviada">🟣 Demo Enviada</option>
                  <option value="Interesado">🟠 Interesado / Negociación</option>
                  <option value="Cerrado">🟢 Cliente Cerrado</option>
                  <option value="Descartado">🔴 Descartado</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1.5">Demo Oficial Recomendada</label>
                <select
                  value={assignedDemo}
                  onChange={e => setAssignedDemo(e.target.value)}
                  className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-[#FF4B00]"
                >
                  {DEMOS_OFICIALES.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.nombre} ({d.giro})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* WhatsApp Outreach Message Generator */}
          <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-[#FF4B00]" /> Mensaje Personalizado de Prospección
              </h4>
              <div className="flex items-center gap-1 bg-[#14161F] p-1 rounded-lg border border-white/5 text-[10px]">
                <button
                  onClick={() => setActiveMessageTemplate('demo_intro')}
                  className={`px-2 py-1 rounded font-bold transition-all ${
                    activeMessageTemplate === 'demo_intro' ? 'bg-[#FF4B00] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Demo Intro
                </button>
                <button
                  onClick={() => setActiveMessageTemplate('seguimiento')}
                  className={`px-2 py-1 rounded font-bold transition-all ${
                    activeMessageTemplate === 'seguimiento' ? 'bg-[#FF4B00] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Seguimiento
                </button>
              </div>
            </div>

            <div className="bg-[#14161F] p-3 rounded-xl border border-white/10 font-mono text-[11px] text-gray-300 whitespace-pre-wrap leading-relaxed">
              {generateWhatsAppMessage()}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-gray-500">
                Demo vinculada: <strong className="text-gray-300">{selectedDemoObj.nombre}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMessage}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-200 font-bold rounded-lg border border-white/10 transition-all text-xs"
                >
                  <Copy size={13} /> {copied ? '¡Copiado!' : 'Copiar Texto'}
                </button>

                {whatsappNumber && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg shadow-md transition-all text-xs"
                  >
                    <Send size={13} /> Enviar WA
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Ubicación y Dirección Completa */}
          <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-2">
            <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <MapPin size={14} className="text-[#FF4B00]" /> Dirección Completa
            </h4>
            <p className="text-gray-300 font-medium leading-relaxed">
              {prospect.address || 'Sin dirección registrada'}
              {prospect.colonia ? `, Col. ${prospect.colonia}` : ''}
              {prospect.city ? `, ${prospect.city}` : ''}
              {prospect.state ? `, ${prospect.state}` : ''}
            </p>
          </div>

          {/* Notas Comerciales */}
          <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-2">
            <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} className="text-[#FF4B00]" /> Notas Comerciales y Bitácora
            </h4>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Escribe comentarios de la llamada, acuerdos o recordatorios..."
              className="w-full bg-[#14161F] border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4B00] text-xs"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-[#0D0E12] flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20">
          <button
            onClick={() => {
              if (onConvertProspectToBusiness) {
                onConvertProspectToBusiness(prospect)
                onClose()
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4B00]/10 border border-[#FF4B00]/30 hover:bg-[#FF4B00]/20 text-[#FF6A1A] font-black text-xs transition-all"
          >
            <Sparkles size={15} /> Convertir en Cliente Activo
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-xs shadow-lg transition-all"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
