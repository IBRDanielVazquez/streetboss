import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, Plus, Trash2, ArrowUp, ArrowDown, Download, Upload, RotateCcw, AlertTriangle, ToggleLeft, ToggleRight, Copy, Pencil, X, Check, Eye, Share2, QrCode, Image, BookOpen, Megaphone, Sparkles, ExternalLink } from 'lucide-react'
import { useApp, CONFIG_DEFAULT } from '../context/AppContext'
import { useRol } from '../hooks/useRol'
import ModalPin from '../components/ModalPin'
import BottomNav from '../components/BottomNav'

// Sección acordeón reutilizable
function Seccion({ titulo, emoji, children, defaultOpen=false }) {
  const [abierta, setAbierta] = useState(defaultOpen)
  return (
    <div className="bg-dark2 rounded-2xl overflow-hidden">
      <button onClick={() => setAbierta(a => !a)}
        className="w-full flex items-center justify-between px-4 py-4 min-h-[56px]">
        <span className="text-white font-bold text-base">{emoji} {titulo}</span>
        {abierta ? <ChevronUp size={18} className="text-gray-500"/> : <ChevronDown size={18} className="text-gray-500"/>}
      </button>
      {abierta && <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">{children}</div>}
    </div>
  )
}

// Campo de formulario reutilizable
function Campo({ label, type='text', value, onChange, onBlur, placeholder, inputMode }) {
  return (
    <div>
      <label className="text-gray-500 text-xs font-semibold block mb-1">{label}</label>
      <input type={type} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} inputMode={inputMode}
        className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-primary min-h-[44px]"/>
    </div>
  )
}

function StatCard({ label, value, hint, tone='primary' }) {
  const tones = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    gray: 'text-gray-300 bg-white/5 border-white/10',
  }
  return (
    <div className={`rounded-3xl border p-4 ${tones[tone] || tones.primary}`}>
      <p className="text-[10px] uppercase tracking-[0.18em] font-black opacity-70">{label}</p>
      <p className="text-2xl font-black mt-2 leading-none">{value}</p>
      {hint && <p className="text-[11px] text-gray-500 font-bold mt-2 leading-tight">{hint}</p>}
    </div>
  )
}

function ActionButton({ icon: Icon, label, caption, onClick, disabled=false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[74px] rounded-3xl border p-4 text-left transition-transform active:scale-[0.98]
        ${disabled ? 'bg-dark2/60 border-white/5 text-gray-700 cursor-not-allowed' : 'bg-dark2 border-white/10 text-white'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${disabled ? 'bg-dark3 text-gray-700' : 'bg-primary text-dark'}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black leading-tight">{label}</p>
          {caption && <p className={`text-[10px] font-bold mt-1 leading-tight ${disabled ? 'text-gray-700' : 'text-gray-500'}`}>{caption}</p>}
        </div>
      </div>
    </button>
  )
}

function SectionTitle({ emoji, title, subtitle }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="text-[11px] text-gray-500 uppercase tracking-[0.22em] font-black">{emoji} {title}</p>
        {subtitle && <p className="text-gray-600 text-xs font-bold mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}

export default function Configuracion() {
  const navigate  = useNavigate()
  const { config, menu, actualizarConfig, actualizarMenu, resetearDemo, historial, slug, forzarGuardado } = useApp()
  const { basePath } = useRol()
  const [pinVis,  setPinVis]  = useState(true)   // Empieza pidiendo PIN
  const [acceso,  setAcceso]  = useState(false)
  const fileRef   = useRef(null)
  const importRef = useRef(null)
  const configCargado = useRef(false)
  const [editandoMesero, setEditandoMesero] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [guardadoOk, setGuardadoOk] = useState(false)

  // Estado local de config (se guarda al perder foco o al presionar guardar)
  const [cfg, setCfg] = useState({ 
    ...config,
    cajeroHabilitado: config.cajeroHabilitado ?? false
  })

  useEffect(() => {
    // Solo sincronizar cfg la PRIMERA VEZ que llegan datos de Supabase
    // Después de eso, el usuario manda — no sobreescribir sus ediciones
    if (!configCargado.current && config.negocio !== CONFIG_DEFAULT.negocio) {
      configCargado.current = true
      setCfg({
        ...CONFIG_DEFAULT,
        ...config,
        datosBancarios: {
          ...CONFIG_DEFAULT.datosBancarios,
          ...(config.datosBancarios || {}),
        },
        cajeroHabilitado: config.cajeroHabilitado ?? false,
      })
    }
  }, [config])

  const [menuLocal, setMenuLocal] = useState(JSON.parse(JSON.stringify(menu)))

  useEffect(() => {
    setMenuLocal(JSON.parse(JSON.stringify(menu)))
  }, [menu])

  // ─── Guardar config ───────────────────────────────────────────
  // forzarGuardado escribe INMEDIATAMENTE a Supabase (sin debounce de 1s)
  const guardarConfig = async () => {
    const resultado = await forzarGuardado(cfg)
    if (resultado.ok) {
      setGuardadoOk(true)
      setTimeout(() => setGuardadoOk(false), 2500)
    } else {
      alert(`❌ Error al guardar: ${resultado.error}\nIntenta de nuevo.`)
    }
  }

  // ─── Meseros ──────────────────────────────────────────────────
  const toSlug = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  const [nuevoMesero, setNuevoMesero] = useState('')
  const agregarMesero = () => {
    if (!nuevoMesero) return
    const slugM = toSlug(nuevoMesero)
    const m = { id: Date.now(), nombre: nuevoMesero, slug: slugM, activo: true }
    const sig = { ...cfg, meseros: [...(cfg.meseros||[]), m] }
    setCfg(sig); actualizarConfig(sig)
    setNuevoMesero('')
  }
  const eliminarMesero = (slugM) => {
    const sig = { ...cfg, meseros: cfg.meseros.filter(x => x.slug !== slugM) }
    setCfg(sig); actualizarConfig(sig)
  }
  const toggleMesero = (slugM) => {
    const sig = { ...cfg, meseros: cfg.meseros.map(x => x.slug === slugM ? { ...x, activo: !x.activo } : x) }
    setCfg(sig); actualizarConfig(sig)
  }
  const renombrarMesero = (slugActual, nuevoNombre) => {
    if (!nuevoNombre) return
    const nuevoSlug = toSlug(nuevoNombre)
    const sig = { 
      ...cfg, 
      meseros: cfg.meseros.map(x => x.slug === slugActual ? { ...x, nombre: nuevoNombre, slug: nuevoSlug } : x) 
    }
    setCfg(sig); actualizarConfig(sig)
    setEditandoMesero(null)
  }

  // ─── Logo ──────────────────────────────────────────────────────
  const cargarLogo = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const nuevo = { ...cfg, logo: ev.target.result }
      setCfg(nuevo); actualizarConfig(nuevo)
    }
    reader.readAsDataURL(file)
  }

  // ─── Menú: mover categoría ────────────────────────────────────
  const moverCat = (idx, dir) => {
    const arr = [...menuLocal]
    const swap = idx + dir
    if (swap < 0 || swap >= arr.length) return
    ;[arr[idx], arr[swap]] = [arr[swap], arr[idx]]
    setMenuLocal(arr); actualizarMenu(arr)
  }

  // ─── Menú: toggle agotado de producto ────────────────────────
  const toggleAgotado = (catId, prodId) => {
    const arr = menuLocal.map(c => c.id !== catId ? c : {
      ...c,
      productos: c.productos.map(p => p.id !== prodId ? p : { ...p, agotado: !p.agotado })
    })
    setMenuLocal(arr); actualizarMenu(arr)
  }

  // ─── Menú: toggle activo de producto ─────────────────────────
  const toggleActivo = (catId, prodId) => {
    const arr = menuLocal.map(c => c.id !== catId ? c : {
      ...c,
      productos: c.productos.map(p => p.id !== prodId ? p : { ...p, activo: !p.activo })
    })
    setMenuLocal(arr); actualizarMenu(arr)
  }

  // ─── Menú: editar precio de producto ─────────────────────────
  const editarPrecio = (catId, prodId, val) => {
    const arr = menuLocal.map(c => c.id !== catId ? c : {
      ...c,
      productos: c.productos.map(p => p.id !== prodId ? p : { ...p, precio: Number(val)||p.precio })
    })
    setMenuLocal(arr)
  }

  const guardarPrecio = () => actualizarMenu(menuLocal)

  // ─── Menú: agregar producto ───────────────────────────────────
  const [nuevoProd, setNuevoProd] = useState({ catId:'', nombre:'', precio:'' })
  const agregarProducto = () => {
    if (!nuevoProd.catId || !nuevoProd.nombre || !nuevoProd.precio) return
    const id = Date.now().toString(36)
    const arr = menuLocal.map(c => c.id !== nuevoProd.catId ? c : {
      ...c,
      productos: [...c.productos, { id, nombre: nuevoProd.nombre, precio: Number(nuevoProd.precio), activo: true, agotado: false }]
    })
    setMenuLocal(arr); actualizarMenu(arr)
    setNuevoProd({ catId: nuevoProd.catId, nombre:'', precio:'' })
  }

  // ─── Exportar datos ───────────────────────────────────────────
  const exportarDatos = () => {
    const datos = { config, menu, historial, exportado: new Date().toISOString() }
    const blob  = new Blob([JSON.stringify(datos, null, 2)], { type:'application/json' })
    const url   = URL.createObjectURL(blob)
    const a     = document.createElement('a'); a.href = url
    a.download  = `streetboss-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  // ─── Importar datos ───────────────────────────────────────────
  const importarDatos = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const datos = JSON.parse(ev.target.result)
        if (datos.config)    actualizarConfig(datos.config)
        if (datos.menu)      actualizarMenu(datos.menu)
        alert('✅ Datos importados correctamente')
        window.location.reload()
      } catch { alert('❌ Archivo inválido') }
    }
    reader.readAsText(file)
  }

  const productos = menuLocal.flatMap(cat => (cat.productos || []).map(prod => ({ ...prod, cat })))
  const publicados = productos.filter(p => p.activo).length
  const agotados = productos.filter(p => p.activo && p.agotado).length
  const ocultos = productos.filter(p => !p.activo).length
  const destacados = productos.filter(p => p.cat.esPlus || p.destacado).length
  const pedidosHoy = historial.filter(r => {
    const fecha = new Date(r.fecha)
    const hoy = new Date()
    return r.estado === 'cobrado' &&
      fecha.getFullYear() === hoy.getFullYear() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getDate() === hoy.getDate()
  })
  const vendidos = {}
  pedidosHoy.forEach(r => (r.productos || []).forEach(p => {
    vendidos[p.nombre] = (vendidos[p.nombre] || 0) + (p.cantidad || 1)
  }))
  const productoTop = Object.entries(vendidos).sort((a, b) => b[1] - a[1])[0]
  const promoActiva = menuLocal.find(cat => /promo|combo|oferta|especial/i.test(cat.nombre || '') && cat.visible !== false)
  const escaparateUrl = `${window.location.origin}/${slug}/menu`
  const ventasHoy = pedidosHoy.reduce((acc, r) => acc + (r.total || 0), 0)

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(escaparateUrl)
      alert('✅ Link del escaparate copiado')
    } catch {
      prompt('Copia el link del escaparate:', escaparateUrl)
    }
  }

  const compartirMenu = async () => {
    const shareData = {
      title: cfg.negocio || config.negocio || 'StreetBoss',
      text: `Haz tu pedido en el escaparate digital de ${cfg.negocio || config.negocio || 'este negocio'}.`,
      url: escaparateUrl,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {}
    }
    await copiarLink()
  }

  const irAMenuAdmin = () => {
    document.getElementById('mi-menu-admin')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ─── Pantalla de PIN ──────────────────────────────────────────
  if (pinVis) return (
    <ModalPin
      titulo="Configuración"
      subtitulo="Ingresa tu PIN de administrador"
      pinCorrecto={config.pinAdmin}
      onExito={() => { setAcceso(true); setPinVis(false) }}
      onCerrar={() => navigate(`${basePath}/mesas`)}
    />
  )

  if (!acceso) return null

  return (
    <div className="min-h-screen bg-dark pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-dark sticky top-0 z-20">
        <button onClick={() => navigate(`${basePath}/mesas`)} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary">←</button>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-black text-lg leading-tight truncate">Centro de Control</h2>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Escaparate digital</p>
        </div>
        <button onClick={guardarConfig}
          className={`font-black px-4 py-2 rounded-xl text-sm min-h-[40px] transition-all
            ${guardadoOk 
              ? 'bg-green-500 text-white' 
              : 'bg-primary text-dark'}`}>
          {guardadoOk ? '✅ Guardado' : 'Guardar'}
        </button>
      </div>

      <div className="p-4 space-y-6">
        <section className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-dark2 to-dark2 p-5 overflow-hidden relative">
          <div className="absolute -right-10 -top-12 w-40 h-40 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative">
            <p className="text-primary text-[10px] uppercase tracking-[0.28em] font-black">🍔 Hoy</p>
            <div className="flex items-start justify-between gap-4 mt-3">
              <div className="min-w-0">
                <h1 className="text-white text-2xl font-black leading-tight truncate">{cfg.negocio || config.negocio}</h1>
                <p className="text-gray-400 text-sm font-semibold mt-1">Administra tu escaparate como una app visual.</p>
              </div>
              {cfg.logo
                ? <img src={cfg.logo} className="w-16 h-16 rounded-3xl object-cover border border-white/10" alt="logo"/>
                : <div className="w-16 h-16 rounded-3xl bg-primary text-dark flex items-center justify-center font-black text-xl">SB</div>}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <StatCard label="Visitas" value="Pronto" hint="Pendiente analytics" tone="gray" />
              <StatCard label="Pedidos" value={pedidosHoy.length} hint={`Hoy: $${ventasHoy.toLocaleString()}`} tone="green" />
              <StatCard label="Más vendido" value={productoTop ? productoTop[0] : 'Sin ventas'} hint={productoTop ? `${productoTop[1]} vendidos hoy` : 'Aparece al cobrar'} tone="primary" />
              <StatCard label="Promoción" value={promoActiva ? promoActiva.nombre : 'Sin promo'} hint={promoActiva ? 'Categoría visible' : 'Crea una promo'} tone="yellow" />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle emoji="🍕" title="Mi Escaparate" subtitle={escaparateUrl} />
          <div className="bg-dark2 rounded-[2rem] border border-white/10 p-4">
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => window.open(escaparateUrl, '_blank')} className="bg-primary text-dark rounded-2xl py-3 font-black text-xs flex flex-col items-center gap-1 min-h-[64px]">
                <Eye size={18}/> Ver
              </button>
              <button onClick={compartirMenu} className="bg-dark3 text-white rounded-2xl py-3 font-black text-xs flex flex-col items-center gap-1 min-h-[64px] border border-white/5">
                <Share2 size={18}/> Compartir
              </button>
              <button onClick={irAMenuAdmin} className="bg-dark3 text-white rounded-2xl py-3 font-black text-xs flex flex-col items-center gap-1 min-h-[64px] border border-white/5">
                <Pencil size={18}/> Editar
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle emoji="🍔" title="Productos" subtitle={`${productos.length} productos en ${menuLocal.length} categorías`} />
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Publicados" value={publicados} hint="Visibles en el menú" tone="green" />
            <StatCard label="Agotados" value={agotados} hint="Visibles sin venta" tone="yellow" />
            <StatCard label="Ocultos" value={ocultos} hint="No aparecen público" tone="gray" />
            <StatCard label="Destacados" value={destacados} hint="Especialidades" tone="primary" />
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle emoji="⚡" title="Acciones rápidas" />
          <div className="grid grid-cols-2 gap-3">
            <ActionButton icon={Plus} label="Nuevo producto" caption="Agregar al catálogo" onClick={irAMenuAdmin} />
            <ActionButton icon={Sparkles} label="Nueva promoción" caption="Próximamente" disabled />
            <ActionButton icon={Image} label="Subir fotografía" caption="Desde productos" onClick={irAMenuAdmin} />
            <ActionButton icon={Share2} label="Compartir menú" caption="Abrir share sheet" onClick={compartirMenu} />
            <ActionButton icon={Copy} label="Copiar enlace" caption="Link público" onClick={copiarLink} />
            <ActionButton icon={QrCode} label="Descargar QR" caption="Próximamente" disabled />
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle emoji="📚" title="Biblioteca Street Boss" subtitle="Plantillas visuales para publicar rápido" />
          <div className="grid grid-cols-1 gap-3">
            <ActionButton icon={BookOpen} label="Agregar productos" caption="Próximamente: biblioteca por tipo de comida" disabled />
            <ActionButton icon={Download} label="Importar categoría" caption="Próximamente" disabled />
            <ActionButton icon={Sparkles} label="Plantillas" caption="Próximamente" disabled />
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle emoji="📢" title="Marketing" subtitle="Herramientas visuales para vender más" />
          <div className="grid grid-cols-1 gap-3">
            <ActionButton icon={Megaphone} label="Historias" caption="Próximamente" disabled />
            <ActionButton icon={Sparkles} label="Promociones" caption="Próximamente" disabled />
            <ActionButton icon={ExternalLink} label="Banner principal" caption="Próximamente" disabled />
          </div>
        </section>

        <div className="pt-1">
          <SectionTitle emoji="⚙️" title="Más" subtitle="Configuración, equipo, pagos, respaldos y accesos POS" />
        </div>

        {/* ── Mi Negocio ─────────────────────────────────────── */}
        <Seccion titulo="Mi Negocio" emoji="🏪">
          <Campo label="Nombre del negocio" type="text" value={cfg.negocio}
            onChange={e => setCfg(c=>({...c,negocio:e.target.value}))} placeholder="Ej. StreetBoss POS"/>
          <Campo 
            label="WhatsApp del negocio (sin +52)" 
            type="tel" 
            value={cfg.whatsapp} 
            inputMode="numeric"
            placeholder="10 dígitos"
            onChange={e => setCfg(c => ({ ...c, whatsapp: e.target.value }))}
          />
          <Campo 
            label="Teléfono fijo/contacto (opcional)" 
            type="tel" 
            value={cfg.telefono || ''} 
            placeholder="10 dígitos"
            onChange={e => setCfg(c => ({ ...c, telefono: e.target.value }))}
          />
          <Campo 
            label="Dirección física" 
            type="text" 
            value={cfg.direccion || ''} 
            placeholder="Calle, Número, Colonia..."
            onChange={e => setCfg(c => ({ ...c, direccion: e.target.value }))}
          />
          <Campo label="Número de mesas" type="number" value={cfg.numMesas}
            onChange={e => setCfg(c=>({...c,numMesas:Number(e.target.value)}))} placeholder="8"/>
          <div>
            <label className="text-gray-500 text-xs font-semibold block mb-1">Color de marca</label>
            <div className="flex items-center gap-3">
              <input type="color" value={cfg.colorMarca||'#f5b87a'}
                onChange={e => setCfg(c=>({...c,colorMarca:e.target.value}))}
                className="w-12 h-10 rounded-xl border border-gray-700 bg-transparent cursor-pointer"/>
              <span className="text-gray-400 text-sm">{cfg.colorMarca}</span>
            </div>
          </div>
          <div>
            <label className="text-gray-500 text-xs font-semibold block mb-2">Logo del negocio</label>
            <div className="flex items-center gap-3">
              {cfg.logo
                ? <img src={cfg.logo} className="w-16 h-16 rounded-2xl object-cover border border-gray-700" alt="logo"/>
                : <div className="w-16 h-16 rounded-2xl bg-dark3 border border-gray-700 flex items-center justify-center text-gray-500 text-xs">Sin logo</div>
              }
              <button onClick={() => fileRef.current?.click()}
                className="bg-dark3 border border-gray-700 text-gray-300 text-sm font-semibold px-4 py-2 rounded-xl min-h-[44px]">
                Cambiar logo
              </button>
              {cfg.logo && (
                <button onClick={() => { setCfg(c=>({...c,logo:''})); actualizarConfig({...cfg,logo:''}) }}
                  className="text-red-400 text-sm">Quitar</button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={cargarLogo} className="hidden"/>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Campo label="PIN Admin" value={cfg.pinAdmin} inputMode="numeric"
              onChange={e => setCfg(c=>({...c,pinAdmin:e.target.value}))} placeholder="1234"/>
          </div>

          {/* ── Se movió Formas de Pago y Envío a sus propias secciones ── */}

        </Seccion>

        {/* ── Mi Equipo ───────────────────────────────────────── */}
        <Seccion titulo="Mi Equipo" emoji="👥">
          {/* Toggle cajero arriba */}
          <div className="flex items-center justify-between bg-dark3 rounded-2xl px-4 py-3 mb-4 border border-white/5">
            <div>
              <p className="text-white font-bold text-sm">¿Tienes cajero?</p>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider">OFF: mesero cobra · ON: habilitar caja</p>
            </div>
            <button onClick={() => {
              const nuevo = { ...cfg, cajeroHabilitado: !cfg.cajeroHabilitado }
              setCfg(nuevo); actualizarConfig(nuevo)
            }}>
              {cfg.cajeroHabilitado 
                ? <ToggleRight size={32} className="text-primary"/>
                : <ToggleLeft  size={32} className="text-gray-600"/>}
            </button>
          </div>

          {/* Gestión de Meseros Individuales */}
          <div className="space-y-3">
            {(cfg.meseros||[]).map(m => {
              const link = `${window.location.origin}/${slug}/mesero/${m.slug}`
              const msgWA = `Hola ${m.nombre}! Aquí está tu link de acceso como Mesero en ${cfg.negocio}: ${link}`
              const waUrl = `https://wa.me/?text=${encodeURIComponent(msgWA)}`
              const esEditando = editandoMesero === m.slug

              return (
                <div key={m.slug} className="bg-dark3 rounded-2xl p-3 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {esEditando ? (
                        <div className="flex items-center gap-1">
                          <input 
                            autoFocus
                            type="text" 
                            value={editNombre} 
                            onChange={e => setEditNombre(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') renombrarMesero(m.slug, editNombre)
                              if (e.key === 'Escape') setEditandoMesero(null)
                            }}
                            className="flex-1 bg-dark2 border border-primary text-white text-sm px-2 py-1 rounded-lg outline-none"/>
                          <button onClick={() => renombrarMesero(m.slug, editNombre)} className="text-primary p-1">
                            <Check size={18}/>
                          </button>
                          <button onClick={() => setEditandoMesero(null)} className="text-red-400 p-1">
                            <X size={18}/>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-bold text-sm">{m.nombre}</p>
                            <button onClick={() => { setEditandoMesero(m.slug); setEditNombre(m.nombre) }} className="text-gray-500 active:text-primary">
                              <Pencil size={12}/>
                            </button>
                          </div>
                          <p className="text-gray-600 text-[10px] truncate">{link}</p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleMesero(m.slug)} className={`p-2 ${m.activo ? 'text-primary' : 'text-gray-600'}`}>
                        {m.activo ? <ToggleRight size={20}/> : <ToggleLeft size={20}/>}
                      </button>
                      <button onClick={() => { if(confirm(`¿Eliminar a ${m.nombre}?`)) eliminarMesero(m.slug) }} className="text-gray-600 active:text-red-400 p-2">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigator.clipboard.writeText(link)}
                      className="flex-1 bg-dark2 text-gray-400 text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1 border border-white/5">
                      <Copy size={12}/> Copiar Link
                    </button>
                    <a href={waUrl} target="_blank" rel="noreferrer"
                      className="flex-1 bg-green-900/20 text-green-500 text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1">
                      WhatsApp
                    </a>
                  </div>
                </div>
              )
            })}

            {/* Input agregar mesero */}
            <div className="flex gap-2 pt-2">
              <input type="text" value={nuevoMesero} onChange={e => setNuevoMesero(e.target.value)}
                placeholder="Nombre del mesero"
                className="flex-1 bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[44px]"/>
              <button onClick={agregarMesero} className="bg-primary text-dark font-black px-4 rounded-xl text-sm min-h-[44px]">
                Agregar
              </button>
            </div>
          </div>

          <div className="h-px bg-white/5 my-6" />

          {/* Otros accesos */}
          <div className="space-y-3">
            {[
              { rol: 'Cocina', ruta: 'admin/cocina', emoji: '🍳', siempre: true },
              { rol: 'Caja',   ruta: 'admin/mesas',   emoji: '💰', siempre: false, reqCaja: true },
              { rol: 'Admin',  ruta: 'admin/mesas',   emoji: '🔐', siempre: true, pin: cfg.pinAdmin },
            ]
            .filter(item => item.siempre || (item.reqCaja && cfg.cajeroHabilitado))
            .map(item => {
              const link = `${window.location.origin}/${slug}/${item.ruta}`
              const msgWA = `Hola! Aquí está el acceso a ${item.rol} en ${cfg.negocio}: ${link}`
              const waUrl = `https://wa.me/?text=${encodeURIComponent(msgWA)}`
              return (
                <div key={item.rol} className="bg-dark3/50 rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/5">
                  <span className="text-xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{item.rol}</p>
                    <p className="text-gray-600 text-[10px] truncate">{link}</p>
                    {item.pin && <p className="text-primary text-[10px] font-black">PIN: {item.pin}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => navigator.clipboard.writeText(link)}
                      className="text-gray-500 active:text-primary p-2">
                      <Copy size={16}/>
                    </button>
                    <a href={waUrl} target="_blank" rel="noreferrer"
                      className="text-green-500 active:text-green-300 p-2">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </Seccion>

        {/* ── Envío a Domicilio ────────────────────────────────── */}
        <Seccion titulo="Envío a Domicilio" emoji="🛵">
          <div className="flex items-center justify-between bg-dark3 rounded-2xl px-4 py-3 mb-4 border border-white/5">
            <div>
              <p className="text-white font-bold text-sm">¿Ofreces envío?</p>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider">Habilita entregas a domicilio</p>
            </div>
            <button onClick={() => setCfg(c => ({...c, envio: {...c.envio, activo: !c.envio?.activo}}))}>
              {cfg.envio?.activo 
                ? <ToggleRight size={32} className="text-primary"/>
                : <ToggleLeft  size={32} className="text-gray-600"/>}
            </button>
          </div>

          {cfg.envio?.activo && (
            <div className="space-y-4">
              <div className="bg-dark3 rounded-2xl p-3 border border-white/5 space-y-2">
                <p className="text-white text-sm font-bold">Ubicación del Negocio</p>
                <p className="text-gray-500 text-[10px] leading-tight mb-2">Necesaria para calcular distancias de envío (GPS). Da clic en el botón estando en tu negocio.</p>
                <div className="flex items-center gap-2">
                  <input type="text" readOnly value={cfg.envio?.ubicacion?.lat ? `${cfg.envio.ubicacion.lat.toFixed(4)}, ${cfg.envio.ubicacion.lng.toFixed(4)}` : ''} placeholder="Latitud, Longitud" className="flex-1 bg-dark2 border border-gray-700 text-gray-400 text-xs px-3 py-2.5 rounded-xl outline-none" />
                  <button onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        pos => {
                          const sig = {...cfg, envio: {...cfg.envio, ubicacion: { lat: pos.coords.latitude, lng: pos.coords.longitude }}}
                          setCfg(sig)
                          alert('✅ Ubicación guardada. Presiona "Guardar" arriba para confirmar.')
                        },
                        err => alert('No se pudo obtener la ubicación. Asegúrate de dar permisos a la página en tu navegador.')
                      )
                    } else {
                      alert('Tu navegador no soporta geolocalización')
                    }
                  }} className="bg-primary text-dark font-bold px-3 py-2 rounded-xl text-xs flex-shrink-0 active:scale-95 transition-transform">
                    📍 Usar mi GPS
                  </button>
                </div>
              </div>

              <div className="bg-dark3 rounded-2xl p-3 border border-white/5 space-y-3">
                <p className="text-white text-sm font-bold mb-1">Zonas de Envío (Tarifas)</p>
                <div className="space-y-2">
                  {(cfg.envio?.zonas || [{hasta:2,precio:20},{hasta:5,precio:35},{hasta:8,precio:50}]).map((z, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs w-8">Hasta</span>
                      <input type="number" value={z.hasta} onChange={e => setCfg(c => {
                        const zonas = [...(c.envio?.zonas || [])]; if(!zonas[i]) zonas[i]={hasta:0,precio:0}; zonas[i].hasta = Number(e.target.value);
                        return {...c, envio: {...c.envio, zonas}}
                      })} className="w-16 bg-dark2 border border-gray-700 text-white text-sm px-2 py-2 rounded-xl text-center outline-none focus:border-primary" />
                      <span className="text-gray-500 text-xs">km ➝ $</span>
                      <input type="number" value={z.precio} onChange={e => setCfg(c => {
                        const zonas = [...(c.envio?.zonas || [])]; if(!zonas[i]) zonas[i]={hasta:0,precio:0}; zonas[i].precio = Number(e.target.value);
                        return {...c, envio: {...c.envio, zonas}}
                      })} className="flex-1 bg-dark2 border border-gray-700 text-white text-sm px-2 py-2 rounded-xl text-center outline-none focus:border-primary" />
                    </div>
                  ))}
                </div>
              </div>

              <Campo label="Pedido mínimo para envío ($)" type="number" value={cfg.envio?.pedidoMinimo || 0}
                onChange={e => setCfg(c => ({...c, envio: {...c.envio, pedidoMinimo: Number(e.target.value)}}))} />
            </div>
          )}
        </Seccion>

        {/* ── Formas de Pago ───────────────────────────────────── */}
        <Seccion titulo="Formas de Pago" emoji="💳">
          <div className="space-y-3">
            {[
              { id: 'efectivo', label: 'Efectivo', desc: 'Pago al recibir' },
              { id: 'transferencia', label: 'Transferencia', desc: 'Depósito o SPEI' },
              { id: 'tarjeta', label: 'Tarjeta', desc: 'Terminal al recibir' },
            ].map(fp => (
              <div key={fp.id} className="flex items-center justify-between bg-dark3 rounded-2xl px-4 py-3 border border-white/5">
                <div>
                  <p className="text-white font-bold text-sm">{fp.label}</p>
                  <p className="text-gray-500 text-[10px] uppercase">{fp.desc}</p>
                </div>
                <button onClick={() => setCfg(c => ({...c, formasPago: {...c.formasPago, [fp.id]: !c.formasPago?.[fp.id]}}))}>
                  {cfg.formasPago?.[fp.id] !== false
                    ? <ToggleRight size={32} className="text-primary"/>
                    : <ToggleLeft  size={32} className="text-gray-600"/>}
                </button>
              </div>
            ))}
            
            {cfg.formasPago?.transferencia !== false && (
              <div className="bg-dark3 rounded-2xl p-4 mt-2 border border-blue-900/30">
                <p className="text-blue-400 text-xs font-bold mb-3 uppercase tracking-wide">Datos para Transferencia</p>
                <div className="space-y-3">
                  <Campo label="Banco" value={cfg.datosBancarios?.banco || ''} placeholder="Ej. BBVA"
                    onChange={e => setCfg(c => ({...c, datosBancarios: {...c.datosBancarios, banco: e.target.value}}))} />
                  <Campo label="Titular" value={cfg.datosBancarios?.titular || ''} placeholder="Nombre completo"
                    onChange={e => setCfg(c => ({...c, datosBancarios: {...c.datosBancarios, titular: e.target.value}}))} />
                  <Campo label="CLABE" value={cfg.datosBancarios?.clabe || ''} placeholder="18 dígitos" inputMode="numeric"
                    onChange={e => setCfg(c => ({...c, datosBancarios: {...c.datosBancarios, clabe: e.target.value}}))} />
                </div>
              </div>
            )}
          </div>
        </Seccion>

        {/* ── Mi Menú ────────────────────────────────────────── */}
        <div id="mi-menu-admin" className="scroll-mt-24">
        <Seccion titulo="Mi Menú" emoji="🍔" defaultOpen>
          {/* Buscador y Filtros */}
          <div className="bg-dark3 rounded-2xl p-3 space-y-2 mb-4">
            <input type="text" placeholder="🔍 Buscar producto..." className="w-full bg-dark2 border border-gray-700 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-primary"
              onChange={(e) => {
                const query = e.target.value.toLowerCase()
                document.querySelectorAll('.prod-item').forEach(el => {
                  el.style.display = el.getAttribute('data-name').toLowerCase().includes(query) ? 'flex' : 'none'
                })
              }}/>
          </div>

          {menuLocal.map((cat, ci) => (
            <div key={cat.id} className="bg-dark3 rounded-2xl p-3 space-y-2">
              {/* Cabecera categoría */}
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm flex-1">{cat.nombre}</span>
                <button onClick={() => moverCat(ci,-1)} className="text-gray-500 active:text-primary p-1"><ArrowUp size={14}/></button>
                <button onClick={() => moverCat(ci, 1)} className="text-gray-500 active:text-primary p-1"><ArrowDown size={14}/></button>
              </div>
              {/* Productos */}
              {cat.productos.map(prod => (
                <div key={prod.id} data-name={prod.nombre} className="prod-item flex flex-col gap-2 bg-dark2 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${prod.activo?'text-white':'text-gray-600'}`}>{prod.nombre}</p>
                    </div>
                    <span className="text-gray-500 text-xs">$</span>
                    <input type="number" value={prod.precio}
                      onChange={e => editarPrecio(cat.id, prod.id, e.target.value)}
                      onBlur={guardarPrecio}
                      className="w-16 bg-dark3 border border-gray-700 text-white text-sm px-2 py-1 rounded-lg outline-none focus:border-primary text-right"/>
                    <select
                      value={!prod.activo ? 'oculto' : (prod.agotado ? 'agotado' : 'activo')}
                      onChange={e => {
                        const val = e.target.value;
                        const arr = menuLocal.map(c => c.id !== cat.id ? c : {
                          ...c,
                          productos: c.productos.map(p => p.id !== prod.id ? p : { 
                            ...p, 
                            activo: val !== 'oculto',
                            agotado: val === 'agotado'
                          })
                        });
                        setMenuLocal(arr); actualizarMenu(arr);
                      }}
                      className={`text-xs px-2 py-1.5 rounded-lg font-bold outline-none cursor-pointer text-center appearance-none ${!prod.activo ? 'bg-gray-800 text-gray-500' : (prod.agotado ? 'bg-yellow-900/30 text-yellow-500' : 'bg-green-900/40 text-green-400')}`}
                    >
                      <option value="activo">🟢 Activo</option>
                      <option value="agotado">🟡 Agotado</option>
                      <option value="oculto">⚫ Oculto</option>
                    </select>
                  </div>
                  {/* Foto de producto */}
                  <div className="flex items-center gap-3 mt-1 pt-2 border-t border-white/5">
                    {prod.foto ? (
                      <div className="relative w-16 h-9 rounded-md overflow-hidden bg-dark3 border border-gray-700 flex-shrink-0">
                        <img src={prod.foto} className="w-full h-full object-cover" alt="foto" />
                      </div>
                    ) : (
                      <div className="w-16 h-9 rounded-md bg-dark3 border border-gray-700 flex items-center justify-center text-[10px] text-gray-500 flex-shrink-0">Sin foto</div>
                    )}
                    <label className="cursor-pointer bg-dark3 border border-gray-700 text-gray-300 text-[10px] font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1">
                      📷 {prod.foto ? 'Cambiar' : 'Foto'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files[0]; if(!file) return
                        const reader = new FileReader()
                        reader.onload = (ev) => {
                          const arr = menuLocal.map(c => c.id !== cat.id ? c : {
                            ...c,
                            productos: c.productos.map(p => p.id !== prod.id ? p : { ...p, foto: ev.target.result })
                          })
                          setMenuLocal(arr); actualizarMenu(arr)
                        }
                        reader.readAsDataURL(file)
                      }}/>
                    </label>
                    {prod.foto && (
                      <button onClick={() => {
                        const arr = menuLocal.map(c => c.id !== cat.id ? c : {
                          ...c, productos: c.productos.map(p => p.id !== prod.id ? p : { ...p, foto: null })
                        })
                        setMenuLocal(arr); actualizarMenu(arr)
                      }} className="text-red-400 text-[10px] p-1 font-bold">Quitar</button>
                    )}
                    {/* Botón eliminar producto */}
                    <div className="flex-1 flex justify-end">
                      <button onClick={() => {
                        if(confirm(`¿Eliminar ${prod.nombre}?`)){
                          const arr = menuLocal.map(c => c.id !== cat.id ? c : {
                            ...c, productos: c.productos.filter(p => p.id !== prod.id)
                          })
                          setMenuLocal(arr); actualizarMenu(arr)
                        }
                      }} className="text-red-500 bg-red-900/20 p-1.5 rounded-md active:scale-90 transition-transform">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Agregar producto */}
          <div className="bg-dark3 rounded-2xl p-3 space-y-2">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Agregar producto</p>
            <div>
              <label className="text-gray-500 text-xs block mb-1">Categoría</label>
              <select value={nuevoProd.catId} onChange={e => setNuevoProd(n=>({...n,catId:e.target.value}))}
                className="w-full bg-dark2 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[40px]">
                <option value="">Seleccionar...</option>
                {menuLocal.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-500 text-xs block mb-1">Nombre</label>
                <input type="text" value={nuevoProd.nombre} onChange={e=>setNuevoProd(n=>({...n,nombre:e.target.value}))}
                  placeholder="Nombre del producto"
                  className="w-full bg-dark2 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[40px]"/>
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1">Precio</label>
                <input type="number" value={nuevoProd.precio} onChange={e=>setNuevoProd(n=>({...n,precio:e.target.value}))}
                  placeholder="0" inputMode="numeric"
                  className="w-full bg-dark2 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[40px]"/>
              </div>
            </div>
            <button onClick={agregarProducto}
              className="w-full bg-primary text-dark font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 min-h-[44px]">
              <Plus size={16}/> Agregar al menú
            </button>
          </div>

          {/* Agregar Categoría */}
          <div className="bg-dark3 rounded-2xl p-3 space-y-2 mt-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Agregar Categoría</p>
            <div className="flex gap-2">
              <input type="text" id="nueva_cat" placeholder="Nombre (ej. 🍕 Pizzas)" className="flex-1 bg-dark2 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[40px]" />
              <button onClick={() => {
                const el = document.getElementById('nueva_cat')
                if (!el.value) return
                const id = 'cat-' + Date.now().toString(36)
                const arr = [...menuLocal, { id, nombre: el.value, esPlus: false, visible: true, productos: [] }]
                setMenuLocal(arr); actualizarMenu(arr);
                el.value = ''
              }} className="bg-primary text-dark font-bold px-4 rounded-xl flex-shrink-0 min-h-[40px]">
                <Plus size={16}/>
              </button>
            </div>
          </div>
        </Seccion>
        </div>

        {/* ── Datos y Respaldo ────────────────────────────────── */}
        <Seccion titulo="Datos y Respaldo" emoji="💾">
          <button onClick={exportarDatos}
            className="w-full bg-dark3 border border-gray-700 text-gray-300 font-bold py-3 rounded-xl flex items-center justify-center gap-2 min-h-[52px]">
            <Download size={16}/> Exportar todo (JSON)
          </button>
          <button onClick={() => importRef.current?.click()}
            className="w-full bg-dark3 border border-gray-700 text-gray-300 font-bold py-3 rounded-xl flex items-center justify-center gap-2 min-h-[52px]">
            <Upload size={16}/> Importar respaldo
          </button>
          <input ref={importRef} type="file" accept=".json" onChange={importarDatos} className="hidden"/>
          <button onClick={() => { if(confirm('¿Restaurar datos de demostración?')) resetearDemo() }}
            className="w-full bg-yellow-900/30 border border-yellow-700/40 text-yellow-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 min-h-[52px]">
            <RotateCcw size={16}/> Restaurar demo
          </button>
          <button onClick={() => {
            if(confirm('⚠️ Esto borrará TODOS los datos. ¿Continuar?')) {
              localStorage.clear(); window.location.reload()
            }
          }}
            className="w-full bg-red-900/30 border border-red-700/40 text-red-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 min-h-[52px]">
            <AlertTriangle size={16}/> Borrar todos los datos
          </button>
        </Seccion>

        <Seccion titulo="Accesos POS" emoji="🧾">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate(`${basePath}/mesas`)}
              className="bg-dark3 border border-white/5 text-white font-bold py-3 rounded-2xl min-h-[52px]">
              Mesas
            </button>
            <button onClick={() => navigate(`${basePath}/cocina`)}
              className="bg-dark3 border border-white/5 text-white font-bold py-3 rounded-2xl min-h-[52px]">
              Cocina
            </button>
            <button onClick={() => navigate(`/${slug}/caja`)}
              className="bg-dark3 border border-white/5 text-white font-bold py-3 rounded-2xl min-h-[52px]">
              Caja
            </button>
            <button onClick={() => navigate(`${basePath}/reporte`)}
              className="bg-dark3 border border-white/5 text-white font-bold py-3 rounded-2xl min-h-[52px]">
              Reportes
            </button>
          </div>
        </Seccion>

        {/* Superadmin link */}
        <button onClick={() => navigate('/superadmin')}
          className="w-full bg-dark2 border border-gray-800 text-gray-600 text-sm font-semibold py-3 rounded-2xl min-h-[48px]">
          🔐 Acceso SuperAdmin
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
