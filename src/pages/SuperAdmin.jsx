import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ToggleLeft, ToggleRight, Users, TrendingUp, AlertCircle, Copy, MessageCircle, Trash2, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ModalPin from '../components/ModalPin'

// Clientes mock para la vista de SuperAdmin
const CLIENTES_MOCK = [
  { id:'c1', negocio:'La Vitola',        plan:'Pro',   estado:'activo',  ventas:48200, mesas:8,  desde:'2024-01-15', whatsapp:'9611234567' },
  { id:'c2', negocio:'Burger Bros',      plan:'Básico',estado:'activo',  ventas:12400, mesas:4,  desde:'2024-03-02', whatsapp:'9617654321' },
  { id:'c3', negocio:'Hot Dog City',     plan:'Pro',   estado:'prueba',  ventas:3800,  mesas:6,  desde:'2024-05-01', whatsapp:'9611111111' },
  { id:'c4', negocio:'Tacos El Memo',    plan:'Básico',estado:'moroso',  ventas:8900,  mesas:3,  desde:'2023-11-20', whatsapp:'9612222222' },
  { id:'c5', negocio:'Pizzas Rápidas',   plan:'Pro',   estado:'activo',  ventas:65000, mesas:10, desde:'2023-09-05', whatsapp:'9613333333' },
  { id:'c6', negocio:'Antojitos Lupita', plan:'Básico',estado:'prueba',  ventas:1200,  mesas:4,  desde:'2024-04-28', whatsapp:'9614444444' },
  { id:'c7', negocio:'Sushi Express',    plan:'Pro',   estado:'moroso',  ventas:22000, mesas:6,  desde:'2023-12-10', whatsapp:'9615555555' },
]

const COLOR_ESTADO = {
  activo:  { bg:'bg-green-900/40',  text:'text-green-400',  label:'Activo'  },
  prueba:  { bg:'bg-yellow-900/40', text:'text-yellow-400', label:'Prueba'  },
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

export default function SuperAdmin() {
  const navigate = useNavigate()
  const { config } = useApp()
  const [pinVis,   setPinVis]   = useState(true)
  const [acceso,   setAcceso]   = useState(false)
  const [clientes, setClientes] = useState(CLIENTES_MOCK)
  const [tab,      setTab]      = useState('clientes')
  const [planes,   setPlanes]   = useState(PLANES_DEFAULT)
  const [promos,   setPromos]   = useState([])
  const [nuevo,    setNuevo]    = useState({ negocio:'', plan:'Básico', mesas:4, whatsapp:'' })
  const [formVis,  setFormVis]  = useState(false)

  const activos  = clientes.filter(c => c.estado === 'activo').length
  const prueba   = clientes.filter(c => c.estado === 'prueba').length
  const morosos  = clientes.filter(c => c.estado === 'moroso').length
  const mrr      = clientes.filter(c=>c.estado==='activo').length * 299 + clientes.filter(c=>c.estado==='activo'&&c.plan==='Pro').length * 200

  // Toggle estado del cliente
  const toggleCliente = (id) => {
    setClientes(cs => cs.map(c => c.id !== id ? c : {
      ...c,
      estado: c.estado === 'activo' ? 'inactivo' : 'activo'
    }))
  }

  // Agregar cliente y abrir WhatsApp
  const agregarCliente = () => {
    if (!nuevo.negocio || !nuevo.whatsapp) return
    const nc = {
      id: `c${Date.now()}`,
      negocio: nuevo.negocio,
      plan: nuevo.plan,
      estado: 'prueba',
      ventas: 0,
      mesas: Number(nuevo.mesas),
      whatsapp: nuevo.whatsapp,
      desde: new Date().toISOString().slice(0,10)
    }
    setClientes(cs => [...cs, nc])
    
    // Abrir WhatsApp al dueño
    const link = `${window.location.origin}/${nuevo.negocio.toLowerCase().replace(/\s+/g,'-')}/mesero`
    const msg = `Hola! Tu acceso a StreetBoss para *${nuevo.negocio}* está listo 🎉\n\n🧾 Mesero: ${link}\nTu PIN admin: 1234\n\n¡Ya puedes empezar a tomar pedidos!`
    window.open(`https://wa.me/52${nuevo.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')

    setNuevo({ negocio:'', plan:'Básico', mesas:4, whatsapp:'' })
    setFormVis(false)
  }

  // Tab de cobranza: mensaje morosos
  const cobrarMoroso = (c) => {
    const msg = `Hola ${c.negocio}! Tu suscripción a StreetBoss está vencida. Para continuar usando el sistema realiza tu pago aquí: https://pago.streetboss.mx/${c.id}`
    window.open(`https://wa.me/52${c.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // Form para promos
  const [nuevaPromo, setNuevaPromo] = useState({ codigo:'', descuento:'', tipo:'%', vence:'', usos:100 })
  const crearPromo = () => {
    if(!nuevaPromo.codigo) return
    setPromos(p => [...p, { ...nuevaPromo, id: Date.now(), codigo: nuevaPromo.codigo.toUpperCase(), usosActuales: 0 }])
    setNuevaPromo({ codigo:'', descuento:'', tipo:'%', vence:'', usos:100 })
  }

  const PIN_SUPER = import.meta.env.VITE_SUPERADMIN_PIN || 'SBPRO-1512'

  // PIN de acceso
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
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-dark sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary">←</button>
        <div className="flex-1">
          <h2 className="text-white font-black text-lg">🔐 Super Admin</h2>
          <p className="text-gray-500 text-xs">Panel de control global</p>
        </div>
        {tab === 'clientes' && (
          <button onClick={() => setFormVis(v=>!v)}
            className="bg-primary text-dark font-bold px-3 py-2 rounded-xl text-sm min-h-[40px] flex items-center gap-1">
            <Plus size={14}/> Cliente
          </button>
        )}
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 p-2 bg-dark2 sticky top-[65px] z-10 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${tab===t.id?'bg-primary text-dark':'text-gray-500'}`}>
            <span>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        
        {/* ── CONTENIDO POR TAB ──────────────────────────────── */}

        {tab === 'clientes' && (
          <>
            {/* Métricas globales */}
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

            {formVis && (
              <div className="bg-dark2 rounded-2xl p-4 space-y-3 border border-primary/30">
                <p className="text-white font-bold">Nuevo cliente</p>
                <input type="text" value={nuevo.negocio} onChange={e=>setNuevo(n=>({...n,negocio:e.target.value}))}
                  placeholder="Nombre del negocio"
                  className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]"/>
                <input type="tel" inputMode="numeric" value={nuevo.whatsapp}
                  onChange={e=>setNuevo(n=>({...n,whatsapp:e.target.value}))}
                  placeholder="WhatsApp dueño (sin +52)"
                  className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]"/>
                <div className="grid grid-cols-2 gap-2">
                  <select value={nuevo.plan} onChange={e=>setNuevo(n=>({...n,plan:e.target.value}))}
                    className="bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]">
                    <option value="Básico">Básico</option>
                    <option value="Pro">Pro</option>
                  </select>
                  <input type="number" value={nuevo.mesas} onChange={e=>setNuevo(n=>({...n,mesas:e.target.value}))}
                    placeholder="Mesas" inputMode="numeric"
                    className="bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]"/>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setFormVis(false)}
                    className="flex-1 bg-dark3 text-gray-400 font-bold py-2.5 rounded-xl min-h-[44px]">Cancelar</button>
                  <button onClick={agregarCliente}
                    className="flex-[2] bg-primary text-dark font-black py-2.5 rounded-xl min-h-[44px]">Agregar</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider px-1">Lista de Clientes ({clientes.length})</p>
              {clientes.map(c => {
                const cfg = COLOR_ESTADO[c.estado] || COLOR_ESTADO.inactivo
                const actv = c.estado === 'activo'
                return (
                  <div key={c.id} className="bg-dark2 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-bold text-base truncate">{c.negocio}</p>
                          <span className={`${cfg.bg} ${cfg.text} text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0`}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{c.plan}</span>
                          <span>·</span>
                          <span>{c.mesas} mesas</span>
                          <span>·</span>
                          <span>{c.whatsapp}</span>
                        </div>
                        <p className="text-primary font-bold text-sm mt-1">${c.ventas.toLocaleString()} en ventas</p>
                      </div>
                      <button onClick={() => toggleCliente(c.id)}
                        className="flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
                        {actv
                          ? <ToggleRight size={28} className="text-primary"/>
                          : <ToggleLeft  size={28} className="text-gray-600"/>
                        }
                      </button>
                    </div>
                  </div>
                )
              })}
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
                  <button onClick={() => cobrarMoroso(c)}
                    className="bg-green-600 text-white p-3 rounded-xl active:scale-95 transition-transform">
                    <MessageCircle size={20}/>
                  </button>
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
                    <input type="number" value={p.precio} onChange={e => setPlanes(prev => prev.map(x=>x.id===p.id?{...x,precio:Number(e.target.value)}:x))}
                      className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary"/>
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-bold block mb-1">Mesas máximas</label>
                    <input type="number" value={p.mesas} onChange={e => setPlanes(prev => prev.map(x=>x.id===p.id?{...x,mesas:Number(e.target.value)}:x))}
                      className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary"/>
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-bold block mb-1">Características (separadas por coma)</label>
                    <textarea value={p.features.join(', ')} onChange={e => setPlanes(prev => prev.map(x=>x.id===p.id?{...x,features:e.target.value.split(',').map(s=>s.trim())}:x))}
                      className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary h-20 resize-none"/>
                  </div>
                </div>
                <button onClick={() => alert('✅ Plan actualizado')}
                  className="w-full bg-primary text-dark font-black py-3 rounded-xl active:scale-95 transition-transform">
                  Guardar cambios
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'promociones' && (
          <div className="space-y-4">
            <div className="bg-dark2 rounded-2xl p-4 space-y-3 border border-primary/20">
              <p className="text-white font-bold">Crear Cupón</p>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={nuevaPromo.codigo} onChange={e=>setNuevaPromo(n=>({...n,codigo:e.target.value}))}
                  placeholder="CÓDIGO" className="bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary uppercase"/>
                <div className="flex gap-1">
                  <input type="number" value={nuevaPromo.descuento} onChange={e=>setNuevaPromo(n=>({...n,descuento:e.target.value}))}
                    placeholder="Descuento" className="flex-1 bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary"/>
                  <select value={nuevaPromo.tipo} onChange={e=>setNuevaPromo(n=>({...n,tipo:e.target.value}))}
                    className="bg-dark3 border border-gray-700 text-white text-sm px-2 py-2 rounded-xl outline-none">
                    <option>%</option>
                    <option>$</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={nuevaPromo.vence} onChange={e=>setNuevaPromo(n=>({...n,vence:e.target.value}))}
                  className="bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary"/>
                <input type="number" value={nuevaPromo.usos} onChange={e=>setNuevaPromo(n=>({...n,usos:Number(e.target.value)}))}
                  placeholder="Usos máx." className="bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary"/>
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

        {/* Versión */}
        <div className="text-center pt-4">
          <p className="text-gray-700 text-xs">StreetBoss v1.0 · Super Admin Panel</p>
          <p className="text-gray-800 text-xs">© 2025 IBR</p>
        </div>
      </div>
    </div>
  )
}
