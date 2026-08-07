import { useState } from 'react'
import { DEMOS_OFICIALES } from '../../data/demoShowcase'
import { getProspectCommercialData, saveProspectCommercialData } from '../../services/crmV3Service'
import { X, Phone, MessageCircle, Facebook, Instagram, MapPin, Sparkles, Copy, Star, CheckSquare, Rocket, Send, Link, Key, User, ClipboardList, Globe } from 'lucide-react'

// Utilidad para asignar el demo correcto basado en la categoría
const getRecommendedDemo = (category = '') => {
  const cat = category.toLowerCase()
  if (cat.includes('taco') || cat.includes('taqueria')) return DEMOS_OFICIALES.find(d => d.id === 'tacos-el-guero')
  if (cat.includes('pizza') || cat.includes('pizzeria')) return DEMOS_OFICIALES.find(d => d.id === 'pizza-house')
  if (cat.includes('hamburguesa') || cat.includes('burger')) return DEMOS_OFICIALES.find(d => d.id === 'burger-house')
  if (cat.includes('marisco') || cat.includes('pescado')) return DEMOS_OFICIALES.find(d => d.id === 'mariscos-el-puerto')
  if (cat.includes('cafe') || cat.includes('postre') || cat.includes('pan')) return DEMOS_OFICIALES.find(d => d.id === 'cafe-central')
  if (cat.includes('pollo') || cat.includes('alita')) return DEMOS_OFICIALES.find(d => d.id === 'pollos-el-rey')
  if (cat.includes('carne') || cat.includes('parrilla')) return DEMOS_OFICIALES.find(d => d.id === 'parrilla-el-carbon')
  if (cat.includes('torta') || cat.includes('baguette')) return DEMOS_OFICIALES.find(d => d.id === 'tortas-el-barrio')
  if (cat.includes('birria') || cat.includes('barbacoa')) return DEMOS_OFICIALES.find(d => d.id === 'birrieria-jalisco')
  if (cat.includes('sushi') || cat.includes('china') || cat.includes('oriental')) return DEMOS_OFICIALES.find(d => d.id === 'china-express')
  
  return DEMOS_OFICIALES.find(d => d.id === 'burger-house') || DEMOS_OFICIALES[0]
}

export default function ProspectDetailModal({ prospect, onClose, onUpdateProspect, onConvertProspectToBusiness }) {
  if (!prospect) return null

  // Identidad
  const pName = prospect.name || prospect.nombre || prospect.business_name || 'Restaurante'
  const pCat = prospect.category || prospect.giro || 'Restaurante'
  const pCity = prospect.city || prospect.ciudad || 'Tuxtla Gutiérrez'
  const pPriority = prospect.prioridad_prospeccion || 'D'
  const pScore = prospect.score_oportunidad || 0
  
  // Ubicación
  const pAddress = prospect.address || prospect.direccion || ''
  let pMaps = (prospect.maps_url || prospect.maps || '').trim()
  if (!pMaps && pAddress) {
    pMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pName + ' ' + pAddress + ' ' + pCity)}`
  }

  // Contacto Base
  const pWaRaw = (prospect.whatsapp || prospect.phone || prospect.telefono || '').replace(/\D/g, '')
  const whatsappNumber = pWaRaw.length >= 10 ? (pWaRaw.length === 10 ? `52${pWaRaw}` : pWaRaw) : ''
  const waSendUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : ''

  const pPhoneRaw = (prospect.phone || prospect.telefono || '').replace(/\D/g, '')
  const directPhone = pPhoneRaw.length >= 10 ? pPhoneRaw : (whatsappNumber ? pWaRaw : '')
  const showCallButton = !!directPhone

  const fbClean = (prospect.facebook || '').trim()
  const fbUrl = fbClean ? (fbClean.startsWith('http') ? fbClean : `https://${fbClean}`) : ''
  
  // Generar Messenger si hay FB (y extraer el username si es posible)
  let msgrUrl = ''
  if (fbClean) {
    if (fbClean.includes('facebook.com/profile.php?id=')) {
      const id = fbClean.split('id=')[1].split('&')[0]
      msgrUrl = `https://m.me/${id}`
    } else if (fbClean.includes('facebook.com/')) {
      let username = fbClean.split('facebook.com/')[1].split('/')[0].split('?')[0]
      msgrUrl = `https://m.me/${username}`
    }
  }

  const igClean = (prospect.instagram || '').trim()
  const igUrl = igClean ? (igClean.startsWith('http') ? igClean : `https://instagram.com/${igClean.replace('@', '')}`) : ''

  const webClean = (prospect.website || prospect.sitio_web || '').trim()
  const webUrl = webClean ? (webClean.startsWith('http') ? webClean : `https://${webClean}`) : ''

  const initialCommercial = getProspectCommercialData(prospect.id)
  const selectedDemoObj = getRecommendedDemo(pCat)
  const demoLinkEspecifico = `https://streetboss.mx/menu/${selectedDemoObj.id}-${selectedDemoObj.clave}-2026`
  const linkGeneralDemos = 'https://streetboss.mx/#demos'

  // Estados Base
  const [status, setStatus] = useState(initialCommercial.status || 'NUEVO')
  const [notes, setNotes] = useState(prospect.notes || initialCommercial.notes || '')
  const [copied, setCopied] = useState(false)
  const [copiedProd, setCopiedProd] = useState(false)

  // Datos INTERESADOS
  const [confName, setConfName] = useState(initialCommercial.confName || pName)
  const [confCat, setConfCat] = useState(initialCommercial.confCat || pCat)
  const [confPhone, setConfPhone] = useState(initialCommercial.confPhone || (prospect.whatsapp || prospect.telefono || prospect.phone || ''))
  const [confDemo, setConfDemo] = useState(initialCommercial.confDemo || selectedDemoObj.id)

  // Datos PRODUCCION
  const [prodMenuLink, setProdMenuLink] = useState(initialCommercial.prodMenuLink || '')
  const [prodDashLink, setProdDashLink] = useState(initialCommercial.prodDashLink || '')
  const [prodUser, setProdUser] = useState(initialCommercial.prodUser || '')
  const [prodPass, setProdPass] = useState(initialCommercial.prodPass || '')
  const [prodStatus, setProdStatus] = useState(initialCommercial.prodStatus || 'PENDIENTE')

  const customMessage = `Hola, equipo de ${pName}.

Estuve revisando su perfil y preparé una demostración de cómo podría verse su negocio utilizando StreetBoss.

Por el giro de su negocio seleccioné este ejemplo:

👉 ${demoLinkEspecifico}

También pueden conocer otras opciones y estilos disponibles aquí:

👉 ${linkGeneralDemos}

StreetBoss les permite tener un escaparate digital optimizado para celular y recibir los pedidos directamente por WhatsApp.

Si les interesa, podemos preparar una versión personalizada para su negocio.

Saludos,
StreetBoss`

  const deliveryMessage = `Hola, ${confName}.

Ya quedó listo su StreetBoss.

🍽️ Menú:
${prodMenuLink}

⚙️ Panel de administración:
${prodDashLink}

Usuario:
${prodUser}

Contraseña temporal:
${prodPass}

Desde su panel podrá configurar y actualizar la información de su negocio.

Si necesita apoyo con cualquier ajuste, estamos pendientes.

StreetBoss
Vende directo. Manda tú.`

  const waSendMsgUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}` : ''
  const waDeliveryUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(deliveryMessage)}` : ''

  const getRatingStars = (score) => {
    if (score >= 85) return 5
    if (score >= 70) return 4
    if (score >= 55) return 3
    if (score >= 40) return 2
    return 1
  }
  const stars = getRatingStars(pScore)

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyDeliveryMessage = () => {
    navigator.clipboard.writeText(deliveryMessage)
    setCopiedProd(true)
    setTimeout(() => setCopiedProd(false), 2000)
  }

  const handleCopyCredentials = () => {
    const credText = `Usuario: ${prodUser}\nContraseña: ${prodPass}`
    navigator.clipboard.writeText(credText)
    setCopiedProd(true)
    setTimeout(() => setCopiedProd(false), 2000)
  }

  const changeStatus = (newStatus) => {
    const now = new Date().toISOString().split('T')[0]
    setStatus(newStatus)
    
    const extraData = {}
    if (newStatus === 'CONTACTADO') { extraData.contact_date = now; extraData.last_contact = now; }
    if (newStatus === 'INTERESADO') extraData.fecha_interes = now;
    if (newStatus === 'PRODUCCION') extraData.fecha_inicio_produccion = now;
    if (newStatus === 'CLIENTE') extraData.fecha_alta_cliente = now;
    if (newStatus === 'NO_INTERESADO') extraData.fecha_no_interes = now;

    saveProspectCommercialData(prospect.id, {
      status: newStatus,
      last_contact: now,
      ...extraData
    })
    
    if (onUpdateProspect) {
      onUpdateProspect({
        ...prospect,
        __updateTrigger: Date.now()
      })
    }
  }

  const handleSave = () => {
    saveProspectCommercialData(prospect.id, { 
      notes,
      confName, confCat, confPhone, confDemo,
      prodMenuLink, prodDashLink, prodUser, prodPass, prodStatus
    })
    if (onUpdateProspect) {
      onUpdateProspect({ ...prospect, __updateTrigger: Date.now() })
    }
    onClose()
  }

  const renderProspectoCard = () => (
    <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-2 text-center shadow-inner">
      <h2 className="text-xl font-black text-white uppercase tracking-tight leading-tight">{pName}</h2>
      
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-semibold pt-1">
        <span>{pCat}</span>
        <span>•</span>
        <span>{pCity}</span>
      </div>

      <div className="flex items-center justify-center gap-2 pt-1">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={14} className={i <= stars ? "fill-amber-400 text-amber-400" : "fill-white/10 text-transparent"} />
          ))}
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
          pPriority === 'A+' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
          pPriority === 'A' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          pPriority === 'B' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
          pPriority === 'C' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
          'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }`}>
          {pPriority}
        </span>
      </div>
    </div>
  )

  const renderContactMatrix = () => (
    <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-3">
      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Matriz de Contacto</h4>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {waSendUrl && (
          <a href={waSendUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-black rounded-xl transition-all text-[10px] uppercase tracking-wider active:scale-95 shadow">
            <MessageCircle size={18} /> WhatsApp
          </a>
        )}
        {msgrUrl && (
          <a href={msgrUrl} target="_blank" rel="noopener noreferrer" onClick={handleCopyMessage} className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 font-black rounded-xl transition-all text-[10px] uppercase tracking-wider active:scale-95 shadow" title="Copia el mensaje primero">
            <MessageCircle size={18} /> Messenger
          </a>
        )}
        {fbUrl && (
          <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 bg-blue-800/20 hover:bg-blue-800/30 border border-blue-700/40 text-blue-500 font-black rounded-xl transition-all text-[10px] uppercase tracking-wider active:scale-95 shadow">
            <Facebook size={18} /> Facebook
          </a>
        )}
        {showCallButton && (
          <a href={`tel:${directPhone}`} className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 bg-[#1A1D29] hover:bg-[#222636] border border-white/10 text-white font-black rounded-xl transition-all text-[10px] uppercase tracking-wider active:scale-95 shadow">
            <Phone size={18} className="text-emerald-400" /> Llamar
          </a>
        )}
        {igUrl && (
          <a href={igUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-400 font-black rounded-xl transition-all text-[10px] uppercase tracking-wider active:scale-95 shadow">
            <Instagram size={18} /> Instagram
          </a>
        )}
        {pMaps && (
          <a href={pMaps} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-400 font-black rounded-xl transition-all text-[10px] uppercase tracking-wider active:scale-95 shadow">
            <MapPin size={18} /> Maps
          </a>
        )}
        {webUrl && (
          <a href={webUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-400 font-black rounded-xl transition-all text-[10px] uppercase tracking-wider active:scale-95 shadow">
            <Globe size={18} /> Sitio Web
          </a>
        )}
      </div>

      {pAddress && (
        <div className="pt-2 border-t border-white/10 mt-2">
          <p className="text-[11px] text-gray-400 leading-snug">📍 {pAddress}</p>
        </div>
      )}
    </div>
  )

  const renderDemoRecomendado = () => (
    <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Demo Recomendado</h4>
        <span className="text-purple-400 font-bold px-2 py-0.5 bg-purple-500/10 rounded border border-purple-500/20 text-[10px]">
          {selectedDemoObj.nombre}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <a href={demoLinkEspecifico} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all text-xs">
          Ver demo recomendado
        </a>
        <a href={linkGeneralDemos} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all text-xs">
          Ver todos los demos
        </a>
      </div>
    </div>
  )

  const renderMensajeComercial = () => (
    <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-3">
      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Mensaje Comercial</h4>
      <textarea
        readOnly
        rows={6}
        value={customMessage}
        className="w-full bg-[#14161F] border border-white/10 rounded-xl p-3 text-gray-300 font-mono text-[10px] focus:outline-none"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button onClick={handleCopyMessage} className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all text-xs active:scale-95 shadow">
          <Copy size={14} /> {copied ? '¡Copiado!' : 'Copiar Mensaje'}
        </button>
        {msgrUrl && (
          <a href={msgrUrl} target="_blank" rel="noopener noreferrer" onClick={handleCopyMessage} className="flex items-center justify-center gap-2 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 font-bold rounded-xl transition-all text-xs active:scale-95 shadow" title="Copia el mensaje primero">
            <MessageCircle size={14} /> Abrir Messenger
          </a>
        )}
        {waSendMsgUrl && (
          <a href={waSendMsgUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl transition-all text-xs active:scale-95 shadow">
            <MessageCircle size={14} /> Abrir WhatsApp
          </a>
        )}
      </div>
    </div>
  )

  const renderContactActions = () => (
    <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-3">
      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Acciones Comerciales</h4>
      
      {status === 'NUEVO' && (
        <button 
          onClick={() => changeStatus('CONTACTADO')} 
          className="w-full py-3 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <CheckSquare size={16} /> ☑ CONTACTADO
        </button>
      )}

      {status === 'CONTACTADO' && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => changeStatus('INTERESADO')} 
              className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <Sparkles size={16} /> ✅ LE INTERESÓ
            </button>
            <button 
              onClick={() => changeStatus('NO_INTERESADO')} 
              className="py-3 bg-red-600/80 hover:bg-red-600 text-white font-black rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <X size={16} /> ❌ NO LE INTERESÓ
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderInteresadoForm = () => (
    <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-3">
      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1">
        <ClipboardList size={14} /> Ficha de Interesado
      </h4>
      <div className="space-y-2">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-1">Nombre Comercial</label>
          <input type="text" value={confName} onChange={e=>setConfName(e.target.value)} placeholder="Nombre comercial" className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-1">Giro / Categoría</label>
          <input type="text" value={confCat} onChange={e=>setConfCat(e.target.value)} placeholder="Categoría" className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-1">Teléfono Principal / WhatsApp Definitivo</label>
          <input type="text" value={confPhone} onChange={e=>setConfPhone(e.target.value)} placeholder="WhatsApp de pedidos" className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-1">Demo / Base Visual</label>
          <select value={confDemo} onChange={e=>setConfDemo(e.target.value)} className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs">
            {DEMOS_OFICIALES.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
        </div>
      </div>
      <button 
        onClick={() => changeStatus('PRODUCCION')} 
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg mt-2"
      >
        <Rocket size={16} /> 🚀 ENVIAR A PRODUCCIÓN
      </button>
    </div>
  )

  const renderProduccionForm = () => (
    <div className="bg-[#0D0E12] p-4 rounded-2xl border border-white/10 space-y-4">
      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1">
        <Rocket size={14} /> Ficha de Producción
      </h4>

      <div>
        <label className="block text-[10px] font-bold text-gray-400 mb-1">Estado de Producción</label>
        <select value={prodStatus} onChange={e=>setProdStatus(e.target.value)} className="w-full bg-[#1A1D29] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-bold">
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="EN PROCESO">EN PROCESO</option>
          <option value="LISTO PARA ENTREGA">LISTO PARA ENTREGA</option>
          <option value="ENTREGADO">ENTREGADO</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setProdMenuLink(`https://streetboss.com.mx/menu/${confName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)} className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white transition-all">GENERAR LINK MENÚ</button>
        <button onClick={() => setProdDashLink(`https://streetboss.com.mx/panel/${confName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)} className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white transition-all">GENERAR DASHBOARD</button>
        <button onClick={() => { setProdUser(confPhone || confName.toLowerCase().replace(/[^a-z0-9]+/g, '')); setProdPass(Math.random().toString(36).slice(-6).toUpperCase()); }} className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white transition-all col-span-2">GENERAR CREDENCIALES</button>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <Link size={14} className="text-gray-400 shrink-0" />
          <input type="text" value={prodMenuLink} onChange={e=>setProdMenuLink(e.target.value)} placeholder="Link Público del Menú" className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
        </div>
        <div className="flex gap-2 items-center">
          <Link size={14} className="text-gray-400 shrink-0" />
          <input type="text" value={prodDashLink} onChange={e=>setProdDashLink(e.target.value)} placeholder="Link Dashboard del Cliente" className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
        </div>
        <div className="flex gap-2 items-center">
          <User size={14} className="text-gray-400 shrink-0" />
          <input type="text" value={prodUser} onChange={e=>setProdUser(e.target.value)} placeholder="Usuario" className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
        </div>
        <div className="flex gap-2 items-center">
          <Key size={14} className="text-gray-400 shrink-0" />
          <input type="text" value={prodPass} onChange={e=>setProdPass(e.target.value)} placeholder="Contraseña Temporal" className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleCopyCredentials} className="flex-1 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white flex items-center justify-center gap-1">
          <Copy size={12}/> COPIAR CREDENCIALES
        </button>
      </div>

      {(prodStatus === 'LISTO PARA ENTREGA' || prodStatus === 'ENTREGADO') && (
        <div className="space-y-2 pt-2 border-t border-white/10">
          <textarea
            readOnly
            rows={8}
            value={deliveryMessage}
            className="w-full bg-[#14161F] border border-white/10 rounded-xl p-3 text-emerald-300 font-mono text-[10px] focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleCopyDeliveryMessage} className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white flex items-center justify-center gap-1">
              <Copy size={12}/> {copiedProd ? '¡Copiado!' : 'COPIAR MENSAJE DE ENTREGA'}
            </button>
            <a href={waDeliveryUrl} target="_blank" rel="noopener noreferrer" className="py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-[10px] font-bold text-white flex items-center justify-center gap-1 shadow">
              <Send size={12}/> ENVIAR MENSAJE
            </a>
          </div>
        </div>
      )}

      <button 
        onClick={() => changeStatus('CLIENTE')} 
        className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg mt-4"
      >
        <Sparkles size={16} /> ✅ CONVERTIR EN CLIENTE
      </button>
    </div>
  )

  const renderClienteCard = () => (
    <div className="bg-[#0D0E12] p-4 rounded-2xl border border-emerald-500/30 space-y-3">
      <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1">
        <Sparkles size={14} /> Cliente Activo
      </h4>
      <div className="space-y-1 text-xs text-gray-300">
        <p><strong className="text-white">Nombre:</strong> {confName}</p>
        <p><strong className="text-white">WhatsApp:</strong> {confPhone}</p>
        <p><strong className="text-white">Menú:</strong> <a href={prodMenuLink} target="_blank" rel="noopener noreferrer" className="text-blue-400">{prodMenuLink}</a></p>
        <p><strong className="text-white">Dashboard:</strong> <a href={prodDashLink} target="_blank" rel="noopener noreferrer" className="text-blue-400">{prodDashLink}</a></p>
        <p><strong className="text-white">Usuario:</strong> {prodUser}</p>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161F] border border-white/10 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        <div className="px-5 py-3.5 border-b border-white/10 bg-[#0D0E12] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider border ${
              status === 'CLIENTE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
              status === 'PRODUCCION' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
              'bg-[#FF4B00]/10 text-[#FF6A1A] border-[#FF4B00]/20'
            }`}>
              {status === 'CLIENTE' ? 'Cliente Activo' : status === 'PRODUCCION' ? 'Producción' : 'Ficha Comercial'}
            </span>
            <span className="text-gray-400 font-bold text-xs">• {pCity}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {renderProspectoCard()}

          {renderContactMatrix()}

          {renderDemoRecomendado()}

          {status === 'NUEVO' && (
            <>
              {renderMensajeComercial()}
              {renderContactActions()}
            </>
          )}

          {status === 'CONTACTADO' && (
            <>
              {renderMensajeComercial()}
              {renderContactActions()}
            </>
          )}

          {status === 'INTERESADO' && renderInteresadoForm()}

          {status === 'PRODUCCION' && renderProduccionForm()}

          {status === 'CLIENTE' && renderClienteCard()}

          {/* OBSERVACIONES GENERALES */}
          <div className="pt-2">
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notas y bitácora comercial..."
              className="w-full bg-[#14161F] border border-white/10 rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4B00] text-xs"
            />
          </div>
        </div>

        <div className="p-3.5 border-t border-white/10 bg-[#0D0E12] flex justify-end gap-2 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition-all">
            Cerrar
          </button>
          <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-xs shadow-lg transition-all">
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
