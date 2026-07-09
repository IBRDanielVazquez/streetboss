import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ToggleLeft, ToggleRight, Users, TrendingUp, AlertCircle, Copy, MessageCircle, Trash2, CheckCircle, Edit, ChevronDown, ChevronUp, Link } from 'lucide-react'
import { crearDatosInicialesCliente, useApp } from '../context/AppContext'
import ModalPin from '../components/ModalPin'
import { MENUS_DEMO } from '../data/menu'
import { supabase } from '../supabase'

const CLIENTES_MOCK = [

  { id: 'demo-2', negocio: 'Tacos Don Beto', dueno: 'Demo User', slug: 'tacos-don-beto', estado: 'activo', plan: 'Trial', mesas: 8, whatsapp: '9611234567', pinAdmin: '1234', desde: new Date().toISOString().slice(0,10), ventas: 0 },
  { id: 'demo-3', negocio: 'Pizza Rápida', dueno: 'Demo User', slug: 'pizza-rapida', estado: 'activo', plan: 'Trial', mesas: 8, whatsapp: '9611234567', pinAdmin: '1234', desde: new Date().toISOString().slice(0,10), ventas: 0 },
  { id: 'demo-4', negocio: 'Mariscos El Puerto', dueno: 'Demo User', slug: 'mariscos-elpuerto', estado: 'activo', plan: 'Trial', mesas: 8, whatsapp: '9611234567', pinAdmin: '1234', desde: new Date().toISOString().slice(0,10), ventas: 0 },
  { id: 'demo-5', negocio: 'Café La Esquina', dueno: 'Demo User', slug: 'cafe-laesquina', estado: 'activo', plan: 'Trial', mesas: 8, whatsapp: '9611234567', pinAdmin: '1234', desde: new Date().toISOString().slice(0,10), ventas: 0 },
]

const CLIENTES_STORAGE_KEY = 'sb_clientes'
const PUBLIC_BASE_URL = window.location.origin

const COLOR_ESTADO = {
  activo:  { bg:'bg-green-900/40',  text:'text-green-400',  label:'Activo'  },
  prueba:  { bg:'bg-yellow-900/40', text:'text-yellow-400', label:'Trial'  },
  moroso:  { bg:'bg-red-900/40',    text:'text-red-400',    label:'Moroso'  },
  inactivo:{ bg:'bg-gray-800',      text:'text-gray-500',   label:'Inactivo'},
}

const TABS = [
  { id:'clientes',    label:'Clientes',    emoji:'👥' },
  { id:'cobranza',    label:'Cobranza',    emoji:'💸' },
  { id:'planes',      label:'Planes',      emoji:'📦' },
  { id:'promociones', label:'Promos',      emoji:'🎟️' },
]

const PLANES_DEFAULT = [
  { id:'basico', nombre:'Básico', precio:299, mesas:4,  features:['Mesas y pedidos','Cocina','Reportes básicos'] },
  { id:'pro',    nombre:'Pro',    precio:499, mesas:12, features:['Todo lo de Básico','Multi-turno','Link de caja','Reportes avanzados','Soporte prioritario'] },
]

const PLAN_OPTIONS = [
  'Trial 14 días',
  'Mensual $299',
  'Plan Pro $499',
  'Semestral $1,500',
  'Anual $2,499',
  'Llave en mano $6,500',
]

const generarPinAdmin = () => String(Math.floor(1000 + Math.random() * 9000))

const crearNuevoClienteVacio = () => ({
  negocio: '',
  dueno: '',
  plan: 'Trial 14 días',
  mesas: 4,
  whatsapp: '',
  pinAdmin: generarPinAdmin(),
  demoSlug: '',
})

const leerClientesCache = () => {
  try {
    const raw = localStorage.getItem(CLIENTES_STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : null
    if (Array.isArray(data) && data.length > 0) return data
    localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(CLIENTES_MOCK))
    return CLIENTES_MOCK
  } catch {
    return CLIENTES_MOCK
  }
}

const escribirClientesCache = (clientes) => {
  try { localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(clientes || [])) } catch {}
}

const normalizarWhatsapp = (whatsapp) => {
  const digitos = String(whatsapp || '').replace(/\D/g, '')
  return digitos.length > 10 ? digitos.slice(-10) : digitos
}

export default function SuperAdmin() {
  const navigate = useNavigate()
  const [pinVis,   setPinVis]   = useState(true)
  const [acceso,   setAcceso]   = useState(false)
  const [clientes, setClientes] = useState(leerClientesCache)
  const [tab,      setTab]      = useState('clientes')
  const [planes,   setPlanes]   = useState(PLANES_DEFAULT)
  const [promos,   setPromos]   = useState([])
  
  const [nuevo,    setNuevo]    = useState(() => crearNuevoClienteVacio())
  const [formVis,  setFormVis]  = useState(false)
  const [formPaso, setFormPaso] = useState(1)
  const [mensajeAlta, setMensajeAlta] = useState('')
  const [errorAlta, setErrorAlta] = useState('')
  
  const [expandedClienteId, setExpandedClienteId] = useState(null)

  const activos  = clientes.filter(c => c.estado === 'activo').length
  const prueba   = clientes.filter(c => c.estado === 'prueba').length
  const morosos  = clientes.filter(c => c.estado === 'moroso').length
  const mrr      = clientes.filter(c=>c.estado==='activo').length * 299 + clientes.filter(c=>c.estado==='activo'&&c.plan==='Pro').length * 200

  const persistirClientes = (siguientes) => {
    setClientes(siguientes)
    escribirClientesCache(siguientes)
  }

  const toggleCliente = (id) => {
    const siguientes = clientes.map(c => c.id !== id ? c : { ...c, estado: c.estado === 'activo' ? 'inactivo' : 'activo' })
    persistirClientes(siguientes)
  }

  const getSlug = (negocio) => negocio.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const crearMensajeBienvenida = (cliente) => {
    const link = `${PUBLIC_BASE_URL}/${cliente.slug}`
    return `Hola ${cliente.dueno} 👋 Tu sistema StreetBoss para ${cliente.negocio} está listo 🎉\n\nAccesos:\nMenu digital: ${link}/menu\nMesero: ${link}/mesero\nCocina: ${link}/cocina\nCaja: ${link}/caja\nAdmin: ${link}/admin\n\nPIN Admin: ${cliente.pinAdmin}\n\nÁbrelo en Chrome 📲\nDudas al 9612466204 🔥`
  }

  const previewSlug = getSlug(nuevo.negocio)
  const previewWhatsapp = normalizarWhatsapp(nuevo.whatsapp)
  const previewLink = `${PUBLIC_BASE_URL}/${previewSlug || 'tu-negocio'}`
  const previewMsg = crearMensajeBienvenida({ ...nuevo, slug: previewSlug || 'tu-negocio', whatsapp: previewWhatsapp })

  const agregarCliente = () => {
    setErrorAlta('')
    setMensajeAlta('')

    const slug = getSlug(nuevo.negocio)
    const whatsapp = normalizarWhatsapp(nuevo.whatsapp)
    const mesas = Math.max(1, Number(nuevo.mesas) || 1)

    if (!slug || !nuevo.negocio || !nuevo.dueno || whatsapp.length !== 10 || String(nuevo.pinAdmin || '').length < 4) {
      setErrorAlta('Completa negocio, dueño, WhatsApp a 10 dígitos y PIN admin de al menos 4 dígitos.')
      setFormPaso(1)
      return
    }

    if (clientes.some(c => c.slug === slug)) {
      setErrorAlta(`Ya existe un cliente con la URL /${slug}. Cambia el nombre del negocio o edita el cliente existente.`)
      setFormPaso(1)
      return
    }

    const nc = {
      id: `c${Date.now()}`, negocio: nuevo.negocio.trim(), dueno: nuevo.dueno.trim(), plan: nuevo.plan, estado: 'prueba', ventas: 0, mesas, whatsapp, slug, pinAdmin: String(nuevo.pinAdmin).trim(), desde: new Date().toISOString().slice(0,10),
    }

    const datosIniciales = crearDatosInicialesCliente(nc)
    if (nuevo.demoSlug && MENUS_DEMO[nuevo.demoSlug]) {
      datosIniciales.menu = JSON.parse(JSON.stringify(MENUS_DEMO[nuevo.demoSlug]))
    } else if (MENUS_DEMO[slug]) {
      datosIniciales.menu = JSON.parse(JSON.stringify(MENUS_DEMO[slug]))
    }
    
    localStorage.setItem(`sb_cache_${slug}`, JSON.stringify(datosIniciales))
    supabase.from('sb_operation_data')
      .upsert({ client_slug: slug, data: datosIniciales, updated_at: new Date() })
      .then(({ error }) => {
        if (error) setErrorAlta(`Cliente creado localmente pero NO se guardó en Supabase: ${error.message}`)
      })
    persistirClientes([...clientes, nc])

    const mensaje = crearMensajeBienvenida(nc)
    window.open(`https://wa.me/52${whatsapp}?text=${encodeURIComponent(mensaje)}`, '_blank')
    setMensajeAlta(`${nc.negocio} quedó listo: ${PUBLIC_BASE_URL}/${slug}`)
    setNuevo(crearNuevoClienteVacio())
    setFormVis(false)
    setFormPaso(1)
  }

  const cobrarMoroso = (c) => {
    const msg = `Hola ${c.negocio}! Tu suscripción a StreetBoss está vencida. Para continuar usando el sistema realiza tu pago aquí: https://pago.streetboss.mx/${c.id}`
    window.open(`https://wa.me/52${c.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const eliminarCliente = (cliente) => {
    if (!confirm(`¿Borrar ${cliente.negocio}? Se quitará localmente.`)) return
    const siguientes = clientes.filter(c => c.id !== cliente.id)
    localStorage.removeItem(`sb_cache_${cliente.slug}`)
    persistirClientes(siguientes)
    setMensajeAlta(`${cliente.negocio} fue eliminado del SuperAdmin.`)
  }

  const [nuevaPromo, setNuevaPromo] = useState({ codigo:'', descuento:'', tipo:'%', vence:'', usos:100 })
  const crearPromo = () => {
    if(!nuevaPromo.codigo) return
    setPromos(p => [...p, { ...nuevaPromo, id: Date.now(), codigo: nuevaPromo.codigo.toUpperCase(), usosActuales: 0 }])
    setNuevaPromo({ codigo:'', descuento:'', tipo:'%', vence:'', usos:100 })
  }

  const PIN_SUPER = 'SBPRO-1512'

  if (pinVis) return (
    <ModalPin
      titulo="Super Admin"
      subtitulo="Acceso restringido — PIN maestro"
      pinCorrecto={PIN_SUPER}
      modo="texto"
      onExito={() => { setAcceso(true); setPinVis(false) }}
      onCerrar={() => navigate(-1)}
    />
  )

  if (!acceso) return null

  return (
    <div className="min-h-screen bg-dark pb-8">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-dark sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary">←</button>
        <div className="flex-1">
          <h2 className="text-white font-black text-lg">🔐 Super Admin</h2>
          <p className="text-gray-500 text-xs">Panel de control global</p>
        </div>
        {tab === 'clientes' && (
          <button onClick={() => { setFormVis(v=>!v); setFormPaso(1); }}
            className="bg-primary text-dark font-bold px-3 py-2 rounded-xl text-sm min-h-[40px] flex items-center gap-1">
            <Plus size={14}/> Cliente
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 p-2 bg-dark2 sticky top-[65px] z-10 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${tab===t.id?'bg-primary text-dark':'text-gray-500'}`}>
            <span>{t.emoji}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {tab === 'clientes' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-dark2 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2"><Users size={14} className="text-primary"/><p className="text-gray-500 text-xs">Clientes activos</p></div>
                <p className="text-primary font-black text-3xl">{activos}</p>
                <p className="text-gray-600 text-xs mt-1">{prueba} en prueba · {morosos} morosos</p>
              </div>
              <div className="bg-dark2 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2"><TrendingUp size={14} className="text-primary"/><p className="text-gray-500 text-xs">MRR estimado</p></div>
                <p className="text-primary font-black text-3xl">${mrr.toLocaleString()}</p>
                <p className="text-gray-600 text-xs mt-1">ingresos mensuales</p>
              </div>
            </div>

            {morosos > 0 && (
              <div className="bg-red-900/20 border border-red-700/30 rounded-2xl px-4 py-3 flex items-center gap-3">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0"/>
                <p className="text-red-300 text-sm"><span className="font-bold">{morosos} clientes morosos.</span> Revisa sus cuentas.</p>
              </div>
            )}

            {mensajeAlta && <div className="bg-green-900/20 border border-green-700/30 rounded-2xl px-4 py-3"><p className="text-green-300 text-sm font-semibold">{mensajeAlta}</p></div>}
            {errorAlta && <div className="bg-red-900/20 border border-red-700/30 rounded-2xl px-4 py-3"><p className="text-red-300 text-sm font-semibold">{errorAlta}</p></div>}

            {formVis && (
              <div className="bg-dark2 rounded-2xl p-4 space-y-3 border border-primary/30">
                <p className="text-white font-bold">Nuevo cliente - Paso {formPaso} de 2</p>
                {formPaso === 1 ? (
                  <>
                    <input type="text" value={nuevo.negocio} onChange={e=>setNuevo(n=>({...n,negocio:e.target.value}))} placeholder="Nombre del negocio" className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]"/>
                    <input type="text" value={nuevo.dueno} onChange={e=>setNuevo(n=>({...n,dueno:e.target.value}))} placeholder="Nombre del dueño" className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]"/>
                    <input type="tel" inputMode="numeric" value={nuevo.whatsapp} onChange={e=>setNuevo(n=>({...n,whatsapp:e.target.value}))} placeholder="WhatsApp dueño (10 dígitos)" className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]"/>
                    <input type="tel" inputMode="numeric" value={nuevo.pinAdmin} onChange={e=>setNuevo(n=>({...n,pinAdmin:e.target.value.replace(/\D/g, '').slice(0,6)}))} placeholder="PIN Admin" className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]"/>
                    <select value={nuevo.demoSlug} onChange={e=>setNuevo(n=>({...n,demoSlug:e.target.value}))} className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]">
                      <option value="">Menú vacío (sin demo)</option>
                      <option value="tacos-don-beto">🌮 Demo: Tacos Don Beto</option>
                      <option value="pizza-rapida">🍕 Demo: Pizza Rápida</option>
                      <option value="mariscos-elpuerto">🦐 Demo: Mariscos El Puerto</option>
                      <option value="cafe-laesquina">☕ Demo: Café La Esquina</option>
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <select value={nuevo.plan} onChange={e=>setNuevo(n=>({...n,plan:e.target.value}))} className="bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]">
                        {PLAN_OPTIONS.map(plan => <option key={plan} value={plan}>{plan}</option>)}
                      </select>
                      <input type="number" value={nuevo.mesas} onChange={e=>setNuevo(n=>({...n,mesas:e.target.value}))} placeholder="Mesas" inputMode="numeric" className="bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]"/>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setFormVis(false)} className="flex-1 bg-dark3 text-gray-400 font-bold py-2.5 rounded-xl min-h-[44px]">Cancelar</button>
                      <button onClick={() => { if(nuevo.negocio && nuevo.dueno && previewWhatsapp.length === 10 && String(nuevo.pinAdmin || '').length >= 4) setFormPaso(2); else alert('Completa todos los campos y el WhatsApp a 10 dígitos') }} className="flex-[2] bg-primary text-dark font-black py-2.5 rounded-xl min-h-[44px]">Siguiente →</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-dark3 rounded-xl p-3 space-y-1">
                      <p className="text-gray-400 text-xs">Resumen</p>
                      <p className="text-white text-sm font-bold">{nuevo.negocio} ({nuevo.mesas} mesas)</p>
                      <p className="text-gray-300 text-xs">{nuevo.dueno} · {previewWhatsapp}</p>
                      <p className="text-primary text-xs font-semibold">{nuevo.plan}</p>
                      <p className="text-primary text-xs font-semibold">PIN Admin: {nuevo.pinAdmin}</p>
                      <p className="text-green-400 text-[10px] mt-1 break-all">URL: {previewLink}</p>
                    </div>
                    <div className="bg-dark3 rounded-xl p-3">
                      <p className="text-gray-400 text-xs mb-1">Preview WhatsApp</p>
                      <p className="text-white text-xs italic whitespace-pre-wrap">{previewMsg}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setFormPaso(1)} className="flex-1 bg-dark3 text-gray-400 font-bold py-2.5 rounded-xl min-h-[44px]">← Volver</button>
                      <button onClick={agregarCliente} className="flex-[2] bg-green-500 text-dark font-black py-2.5 rounded-xl min-h-[44px]">✅ Crear y enviar WhatsApp</button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider px-1">Lista de Clientes ({clientes.length})</p>
              {clientes.length > 0 ? (
                clientes.map(c => {
                  const cfg = COLOR_ESTADO[c.estado] || COLOR_ESTADO.inactivo
                  const actv = c.estado === 'activo'
                  const link = `${PUBLIC_BASE_URL}/${c.slug}`
                  const isExpanded = expandedClienteId === c.id

                  return (
                    <div key={c.id} className="bg-dark2 rounded-2xl p-4 border border-white/5 transition-all">
                      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setExpandedClienteId(isExpanded ? null : c.id)}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-bold text-base truncate">{c.negocio}</p>
                            <span className={`${cfg.bg} ${cfg.text} text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0`}>{cfg.label}</span>
                          </div>
                          <p className="text-gray-400 text-xs mb-1">{c.dueno} · {c.whatsapp}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{c.plan}</span><span>·</span><span>{c.mesas} mesas</span><span>·</span><span>{c.desde}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Link size={12} className="text-gray-500" />
                            <p className="text-blue-400 text-[10px] break-all">{link}</p>
                          </div>
                          <p className="text-primary font-bold text-sm mt-1">${(c.ventas||0).toLocaleString()} en ventas</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); toggleCliente(c.id); }} className="flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
                            {actv ? <ToggleRight size={28} className="text-primary"/> : <ToggleLeft size={28} className="text-gray-600"/>}
                          </button>
                          {isExpanded ? <ChevronUp size={16} className="text-gray-500"/> : <ChevronDown size={16} className="text-gray-500"/>}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                        <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(link); alert('Link copiado'); }} className="flex-1 bg-dark3 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1"><Copy size={14}/> Copiar link</button>
                        <button onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/52${c.whatsapp}`, '_blank'); }} className="flex-1 bg-green-900/40 text-green-400 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1"><MessageCircle size={14}/> WhatsApp</button>
                        <button onClick={(e) => { e.stopPropagation(); alert('Editar en construcción'); }} className="flex-shrink-0 bg-dark3 text-gray-400 p-2 rounded-xl flex items-center justify-center"><Edit size={16}/></button>
                        <button onClick={(e) => { e.stopPropagation(); eliminarCliente(c); }} className="flex-shrink-0 bg-red-900/30 text-red-400 p-2 rounded-xl flex items-center justify-center"><Trash2 size={16}/></button>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 bg-dark3 rounded-xl p-3 space-y-2">
                          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Accesos directos por rol</p>
                          {[{ name: 'Menu', path: '/menu' }, { name: 'Mesero', path: '/mesero' }, { name: 'Cocina', path: '/cocina' }, { name: 'Caja', path: '/caja' }, { name: 'Admin', path: '/admin' }].map(rol => {
                            const rolLink = `${link}${rol.path}`
                            const msg = `Hola! Tu link de ${rol.name} para ${c.negocio} es: ${rolLink}`
                            return (
                              <div key={rol.name} className="flex items-center justify-between bg-dark border border-white/5 p-2 rounded-lg gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-xs font-semibold">{rol.name}</p>
                                  <p className="text-gray-500 text-[10px] truncate">{rolLink}</p>
                                </div>
                                <div className="flex gap-1">
                                  <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(rolLink); alert(`Copiado: ${rol.name}`); }} className="p-1.5 bg-dark3 text-gray-400 rounded-md active:text-white transition-colors"><Copy size={12}/></button>
                                  <button onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank'); }} className="p-1.5 bg-green-900/40 text-green-400 rounded-md active:text-white transition-colors"><MessageCircle size={12}/></button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="bg-dark2 rounded-2xl p-8 text-center border border-white/5 space-y-4">
                  <p className="text-gray-400 text-sm">Aún no tienes clientes. Crea el primero para empezar.</p>
                  <button onClick={() => { setFormVis(true); setFormPaso(1); }} className="bg-primary text-dark font-black px-6 py-3 rounded-xl text-sm min-h-[44px] inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-all mx-auto"><Plus size={16}/> Crear Cliente</button>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'cobranza' && (
          <div className="space-y-3">
            {morosos > 0 ? (
              clientes.filter(c => c.estado === 'moroso').map(c => (
                <div key={c.id} className="bg-dark2 border border-red-900/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-white font-bold">{c.negocio}</p>
                    <p className="text-red-400 text-xs font-bold">Vencido · {c.plan}</p>
                    <p className="text-gray-500 text-xs mt-1">Suscripción desde {c.desde}</p>
                  </div>
                  <button onClick={() => cobrarMoroso(c)} className="bg-green-600 text-white p-3 rounded-xl active:scale-95 transition-transform"><MessageCircle size={20}/></button>
                </div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                <CheckCircle size={64} className="text-green-500 mb-4"/>
                <p className="text-white font-bold">¡Todo al corriente!</p>
                <p className="text-gray-500 text-sm">No hay clientes con pagos pendientes</p>
              </div>
            )}
          </div>
        )}

        {tab === 'planes' && (
          <div className="grid grid-cols-1 gap-4">
            {planes.map(p => (
              <div key={p.id} className="bg-dark2 rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-white">{p.nombre}</h3>
                  <span className="text-primary font-black text-2xl">${p.precio}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-500 text-xs font-bold block mb-1">Precio mensual</label>
                    <input type="number" value={p.precio} onChange={e => setPlanes(prev => prev.map(x=>x.id===p.id?{...x,precio:Number(e.target.value)}:x))} className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary"/>
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-bold block mb-1">Mesas máximas</label>
                    <input type="number" value={p.mesas} onChange={e => setPlanes(prev => prev.map(x=>x.id===p.id?{...x,mesas:Number(e.target.value)}:x))} className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary"/>
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-bold block mb-1">Características (separadas por coma)</label>
                    <textarea value={p.features.join(', ')} onChange={e => setPlanes(prev => prev.map(x=>x.id===p.id?{...x,features:e.target.value.split(',').map(s=>s.trim())}:x))} className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary h-20 resize-none"/>
                  </div>
                </div>
                <button onClick={() => alert('✅ Plan actualizado')} className="w-full bg-primary text-dark font-black py-3 rounded-xl active:scale-95 transition-transform">Guardar cambios</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'promociones' && (
          <div className="space-y-4">
            <div className="bg-dark2 rounded-2xl p-4 space-y-3 border border-primary/20">
              <p className="text-white font-bold">Crear Cupón</p>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={nuevaPromo.codigo} onChange={e=>setNuevaPromo(n=>({...n,codigo:e.target.value}))} placeholder="CÓDIGO" className="bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary uppercase"/>
                <div className="flex gap-1">
                  <input type="number" value={nuevaPromo.descuento} onChange={e=>setNuevaPromo(n=>({...n,descuento:e.target.value}))} placeholder="Descuento" className="flex-1 bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary"/>
                  <select value={nuevaPromo.tipo} onChange={e=>setNuevaPromo(n=>({...n,tipo:e.target.value}))} className="bg-dark3 border border-gray-700 text-white text-sm px-2 py-2 rounded-xl outline-none">
                    <option>%</option><option>$</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={nuevaPromo.vence} onChange={e=>setNuevaPromo(n=>({...n,vence:e.target.value}))} className="bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary"/>
                <input type="number" value={nuevaPromo.usos} onChange={e=>setNuevaPromo(n=>({...n,usos:Number(e.target.value)}))} placeholder="Usos máx." className="bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary"/>
              </div>
              <button onClick={crearPromo} className="w-full bg-primary text-dark font-black py-2.5 rounded-xl">Crear promoción</button>
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 text-xs font-bold uppercase px-1">Promociones Activas</p>
              {promos.length > 0 ? (
                promos.map(p => (
                  <div key={p.id} className="bg-dark2 rounded-2xl p-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-black">{p.codigo}</span>
                        <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-full">-{p.descuento}{p.tipo}</span>
                      </div>
                      <p className="text-gray-500 text-[10px] mt-1">Expira: {p.vence || 'Nunca'} · {p.usosActuales}/{p.usos} usos</p>
                    </div>
                    <button onClick={() => setPromos(prev => prev.filter(x=>x.id!==p.id))} className="text-red-500 p-2"><Trash2 size={18}/></button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm text-center py-4">No hay cupones creados</p>
              )}
            </div>
          </div>
        )}

        <div className="text-center pt-4">
          <p className="text-gray-700 text-xs">StreetBoss v1.0 · Super Admin Panel</p>
          <p className="text-gray-800 text-xs">© 2025 IBR</p>
        </div>
      </div>
    </div>
  )
}
