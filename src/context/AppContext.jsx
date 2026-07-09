import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../supabase'
import { MENUS_DEMO } from '../data/menu.js'

// ─── Utilidades ───────────────────────────────────────────────────────────────
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

const LS_KEY  = (s) => `sb_cache_${s}`
const readLS  = (s) => { try { const v = localStorage.getItem(LS_KEY(s)); return v ? JSON.parse(v) : null } catch { return null } }
const writeLS = (s, d) => { try { localStorage.setItem(LS_KEY(s), JSON.stringify(d)) } catch {} }



export const CONFIG_DEFAULT = {
  negocio:'StreetBoss POS', whatsapp:'9612466204', numMesas:8,
  colorMarca:'#f5b87a', logo:null, pinAdmin:'1234', pinSuperAdmin:'SBPRO-1512',
  slug: 'mi-negocio',
  cajeroHabilitado: false,
  direccion: '',
  telefono: '',
  envio: {
    activo: true,
    ubicacion: { lat: 16.7521, lng: -93.1152 },
    zonas: [
      { hasta: 2, precio: 20 },
      { hasta: 5, precio: 35 },
      { hasta: 8, precio: 50 },
    ],
    pedidoMinimo: 0,
  },
  datosBancarios: { banco:'', titular:'', clabe:'' },
  formasPago: { efectivo:true, transferencia:false, tarjeta:false },
  meseros: [
    { nombre: 'Mesero 1', slug: 'mesero-1', activo: true },
    { nombre: 'Mesero 2', slug: 'mesero-2', activo: true },
    { nombre: 'Mesero 3', slug: 'mesero-3', activo: true },
  ],
}

export const getMenuForSlug = (slug) => {
  return MENUS_DEMO[slug] || []
}

const crearMesa = (numero) => ({
  numero, estado:'libre', pedidos:[], grupos:[], totalParcial:0,
  descuento:{tipo:null,valor:0}, horaAbierta:null,
  enCocina:false, horaEnvioCocina:null, horaLista:null,
  meseroNombre: null,
})

const inicializarMesas = (n, existentes=[]) =>
  Array.from({length:n},(_,i)=>existentes.find(m=>m.numero===i+1)||crearMesa(i+1))

const mergeConfig = (saved) => {
  const merged = { ...CONFIG_DEFAULT, ...saved }
  if (!merged.meseros || merged.meseros.length === 0) {
    merged.meseros = CONFIG_DEFAULT.meseros
  }
  if (!merged.datosBancarios) {
    merged.datosBancarios = CONFIG_DEFAULT.datosBancarios
  }
  if (!merged.envio) {
    merged.envio = CONFIG_DEFAULT.envio
  }
  if (!merged.formasPago) {
    merged.formasPago = CONFIG_DEFAULT.formasPago
  }
  return merged
}

export const crearDatosInicialesCliente = (cliente = {}) => {
  const numMesas = Math.max(1, Number(cliente.mesas || cliente.numMesas || CONFIG_DEFAULT.numMesas))
  const config = mergeConfig({
    negocio: cliente.negocio || CONFIG_DEFAULT.negocio,
    whatsapp: cliente.whatsapp || CONFIG_DEFAULT.whatsapp,
    numMesas,
    slug: cliente.slug || CONFIG_DEFAULT.slug,
    pinAdmin: cliente.pinAdmin || CONFIG_DEFAULT.pinAdmin,
    cajeroHabilitado: cliente.cajeroHabilitado ?? true,
  })

  return {
    config,
    menu: getMenuForSlug(config.slug),
    mesas: inicializarMesas(numMesas),
    historial: [],
    turnoActivo: null,
  }
}



// ─── Contexto ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children, slug }) {
  const [config,      setConfig]      = useState(CONFIG_DEFAULT)
  const [menu,        setMenu]        = useState(() => getMenuForSlug(slug))
  const [mesas,       setMesas]       = useState(() => inicializarMesas(8))
  const [historial,   setHistorial]   = useState([])
  const [turnoActivo, setTurnoActivo] = useState(null)
  const [loading,     setLoading]     = useState(true)

  const isInitialMount = useRef(true)
  const lastWriteTime = useRef(0)
  const isRemoteUpdate = useRef(false)

  // 1. Cargar datos iniciales (LocalStorage + Supabase)
  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    // Paso 1: Cargar localStorage inmediatamente (UI instantánea)
    const cached = readLS(slug)
    if (cached) {
      isRemoteUpdate.current = true
      if (cached.config)    setConfig(mergeConfig(cached.config))
      setMenu(cached.menu || getMenuForSlug(slug)) // Cargar menú de la caché, o fallback si es demo
      if (cached.mesas)     setMesas(cached.mesas)
      if (cached.historial) setHistorial(cached.historial)
      setTurnoActivo(cached.turnoActivo ?? null)
      setLoading(false)
      setTimeout(() => { isRemoteUpdate.current = false }, 100)
    } else {
      setLoading(true)
    }

    // Paso 2: Sincronizar desde Supabase en background
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('sb_operation_data')
        .select('data')
        .eq('client_slug', slug)
        .maybeSingle()

      if (!error && data) {
        const d = data.data
        isRemoteUpdate.current = true
        if (d.config)    setConfig(mergeConfig(d.config))
        if (d.menu)      setMenu(d.menu)
        else             setMenu(getMenuForSlug(slug))
        if (d.mesas)     setMesas(d.mesas)
        if (d.historial) setHistorial(d.historial)
        setTurnoActivo(d.turnoActivo ?? null)
        writeLS(slug, d) // actualiza caché con datos frescos del servidor
        setTimeout(() => { isRemoteUpdate.current = false }, 200)
      } else if (!error && !data) {
        const initial = crearDatosInicialesCliente({ slug })
        await supabase.from('sb_operation_data').insert([{ client_slug: slug, data: initial }])
        writeLS(slug, initial)
      }
      setLoading(false)
      isInitialMount.current = false
    }

    fetchData()

    // Paso 3: Realtime — solo acepta cambios externos (no nuestro propio echo)
    const channel = supabase
      .channel(`sync-${slug}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public',
        table: 'sb_operation_data',
        filter: `client_slug=eq.${slug}`
      }, payload => {
        // Ignorar si fue nuestro propio write (echo) — ventana de 2 segundos
        if (Date.now() - lastWriteTime.current < 2000) return
        const d = payload.new.data
        if (d.config)    setConfig(mergeConfig(d.config))
        if (d.menu)      setMenu(d.menu)
        if (d.mesas)     setMesas(d.mesas)
        if (d.historial) setHistorial(d.historial)
        setTurnoActivo(d.turnoActivo ?? null)
        writeLS(slug, d) // mantener LS sincronizado con cambios remotos
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [slug])

  // 3a. Escribir en localStorage inmediatamente (sin debounce)
  useEffect(() => {
    if (isInitialMount.current || !slug || isRemoteUpdate.current) return
    writeLS(slug, { config, menu, mesas, historial, turnoActivo })
  }, [config, menu, mesas, historial, turnoActivo, slug])

  // 3b. Escribir en Supabase con debounce (sin bloqueo por isRemoteUpdate)
  useEffect(() => {
    if (isInitialMount.current || !slug) return
    const timer = setTimeout(async () => {
      lastWriteTime.current = Date.now()
      // Debug: confirmar qué número se está guardando

      const { error } = await supabase
        .from('sb_operation_data')
        .update({ 
          data: { config, menu, mesas, historial, turnoActivo }, 
          updated_at: new Date() 
        })
        .eq('client_slug', slug)
      if (error) {
        console.error('[StreetBoss] ❌ Error al guardar en Supabase:', error.message)
      } else {

      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [config, menu, mesas, historial, turnoActivo, slug])

  // ─── Funciones de Negocio ──────────────────────────────────────────────────
  
  const actualizarConfig = useCallback((nueva)=>{
    setConfig(prev=>{ 
      const sig={...prev,...nueva}; 
      if(nueva.numMesas && nueva.numMesas !== prev.numMesas) {
        setMesas(a => inicializarMesas(nueva.numMesas, a))
      }
      return sig 
    })
  },[])

  const abrirTurno  = useCallback(() => setTurnoActivo({ inicio: new Date().toISOString(), fin: null }), [])

  // FIX 6: cerrarTurno valida que no haya mesas pendientes
  // Retorna { ok: true } si cerró, { ok: false, mensaje: '...' } si hay pendientes
  const cerrarTurno = useCallback(() => {
    return new Promise(resolve => {
      setMesas(prev => {
        const pendientes = prev.filter(m =>
          m.estado === 'ocupada' || m.estado === 'lista' || m.enCocina
        )
        if (pendientes.length > 0) {
          resolve({
            ok: false,
            mensaje: `No puedes cerrar el turno. Hay ${pendientes.length} mesa${pendientes.length > 1 ? 's' : ''} pendiente${pendientes.length > 1 ? 's' : ''} de cobrar.`
          })
          return prev // no modificar nada
        }
        setTurnoActivo(t => t ? { ...t, fin: new Date().toISOString() } : null)
        resolve({ ok: true })
        return prev
      })
    })
  }, [])

  const agregarProductoAMesa = useCallback((num, prod, nota='') => {
    setMesas(prev => prev.map(m => {
      if (m.numero !== num) return m
      const existePendiente = m.pedidos.find(p => p.id === prod.id && !p.enviadoACocina)
      let nuevos
      if (existePendiente) {
        nuevos = m.pedidos.map(p =>
          (p.id === prod.id && !p.enviadoACocina) ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      } else {
        nuevos = [...m.pedidos, {
          id: uid(), prodId: prod.id,
          nombre: prod.nombre, precio: prod.precio,
          cantidad: 1, nota, enviadoACocina: false,
        }]
      }
      return {
        ...m, pedidos: nuevos,
        totalParcial: nuevos.reduce((s, p) => s + p.precio * p.cantidad, 0),
        estado: m.estado === 'libre' ? 'ocupada' : m.estado,
        horaAbierta: m.horaAbierta || new Date().toISOString(),
      }
    }))
  }, [])

  const quitarProductoDeMesa = useCallback((num,prodId)=>{
    setMesas(prev=>prev.map(m=>{
      if(m.numero!==num) return m
      const nuevos=m.pedidos.map(p=>p.id===prodId?{...p,cantidad:p.cantidad-1}:p).filter(p=>p.cantidad>0)
      return {...m,pedidos:nuevos,totalParcial:nuevos.reduce((s,p)=>s+p.precio*p.cantidad,0)}
    }))
  },[])

  // Cancela un producto específico de la mesa (requiere PIN admin en UI).
  // Lo elimina de pedidos y de cualquier grupo en cocina.
  const cancelarProducto = useCallback((num, prodId, razon) => {
    setMesas(prev => prev.map(m => {
      if (m.numero !== num) return m
      const nuevosPedidos = m.pedidos.filter(p => p.id !== prodId)
      const nuevosGrupos = (m.grupos || []).map(g => ({
        ...g,
        productos: g.productos.filter(p => p.id !== prodId),
      })).filter(g => g.productos.length > 0)
      const nuevoTotal = nuevosPedidos.reduce((s, p) => s + p.precio * p.cantidad, 0)
      return { ...m, pedidos: nuevosPedidos, grupos: nuevosGrupos, totalParcial: nuevoTotal }
    }))
  }, [])

  const actualizarNota = useCallback((num,prodId,nota)=>{
    setMesas(prev=>prev.map(m=>m.numero!==num?m:{...m,pedidos:m.pedidos.map(p=>p.id===prodId?{...p,nota}:p)}))
  },[])

  const enviarACocina = useCallback((num, meseroNombre = null) => {
    setMesas(prev => {
      const mesa = prev.find(m => m.numero === num)
      if (!mesa || !mesa.pedidos.length) return prev

      // Solo los productos que aún no fueron enviados a cocina
      const productosNuevos = mesa.pedidos.filter(p => !p.enviadoACocina)
      if (!productosNuevos.length) return prev

      // Crear un nuevo grupo con estos productos (envío separado)
      const nuevoGrupo = {
        id: uid(),
        horaEnvio: new Date().toISOString(),
        productos: productosNuevos.map(p => ({ ...p })),
        entregado: false,
        meseroNombre: meseroNombre || mesa.meseroNombre,
      }

      // Marcar esos productos como enviados en la lista maestra
      const pedidosActualizados = mesa.pedidos.map(p =>
        p.enviadoACocina ? p : { ...p, enviadoACocina: true }
      )

      return prev.map(m => m.numero !== num ? m : {
        ...m,
        pedidos: pedidosActualizados,
        grupos: [...(m.grupos || []), nuevoGrupo],
        enCocina: true,
        horaEnvioCocina: new Date().toISOString(),
        meseroNombre: meseroNombre || m.meseroNombre,
      })
    })
  }, [])

  // Marca un grupo específico como entregado.
  // Si todos los grupos están entregados → mesa pasa a estado 'lista'.
  const marcarGrupoListo = useCallback((num, grupoId) => {
    setMesas(prev => prev.map(m => {
      if (m.numero !== num) return m
      const nuevosGrupos = m.grupos.map(g =>
        g.id === grupoId ? { ...g, entregado: true } : g
      )
      const hayActivos = nuevosGrupos.some(g => !g.entregado)
      return {
        ...m,
        grupos: nuevosGrupos,
        enCocina: hayActivos,
        estado: hayActivos ? m.estado : 'lista',
        horaLista: hayActivos ? m.horaLista : new Date().toISOString(),
      }
    }))
  }, [])

  const aplicarDescuento = useCallback((num, tipo, valor, autorizadoPor = 'Admin') => {
    setMesas(prev => prev.map(m => m.numero !== num ? m : {
      ...m,
      descuento: {
        tipo, valor: Number(valor),
        autorizadoPor,
        fechaAuth: new Date().toISOString(),
      }
    }))
  }, [])

  const cobrarMesa = useCallback((num,formaPago,porcPropina,efectivoRecibido=0)=>{
    setMesas(prev=>{
      const m=prev.find(x=>x.numero===num); if(!m) return prev
      const sub=m.pedidos.reduce((s,p)=>s+p.precio*p.cantidad,0)
      const dM=m.descuento.tipo==='porcentaje'?Math.round(sub*m.descuento.valor/100):m.descuento.tipo==='monto'?m.descuento.valor:0
      const net=sub-dM
      const propM=Math.round(net*porcPropina/100)
      const total=net+propM
      const cambio=formaPago==='efectivo'?Math.max(0,efectivoRecibido-total):0
      const tc=m.horaLista&&m.horaEnvioCocina?Math.round((new Date(m.horaLista)-new Date(m.horaEnvioCocina))/60000):0
      
      setHistorial(h=>[...h,{id:uid(),fecha:new Date().toISOString(),mesa:num,productos:[...m.pedidos],subtotal:sub,descuento:{...m.descuento,monto:dM},propina:{porcentaje:porcPropina,monto:propM},total,formaPago,efectivoRecibido,cambio,estado:'cobrado',razonCancelacion:null,tiempoCocina:tc,mesero:m.meseroNombre}])
      return prev.map(x=>x.numero===num?crearMesa(num):x)
    })
  },[])

  const cancelarPedido = useCallback((num,razon)=>{
    setMesas(prev=>{
      const m=prev.find(x=>x.numero===num); if(!m) return prev
      const sub=m.pedidos.reduce((s,p)=>s+p.precio*p.cantidad,0)
      setHistorial(h=>[...h,{id:uid(),fecha:new Date().toISOString(),mesa:num,productos:[...m.pedidos],subtotal:sub,descuento:{tipo:null,valor:0,monto:0},propina:{porcentaje:0,monto:0},total:sub,formaPago:'cancelado',efectivoRecibido:0,cambio:0,estado:'cancelado',razonCancelacion:razon,tiempoCocina:0}])
      return prev.map(x=>x.numero===num?crearMesa(num):x)
    })
  },[])

  const toggleAgotado = useCallback((prodId)=>{
    setMenu(prev=>prev.map(c=>({...c,productos:c.productos.map(p=>p.id===prodId?{...p,agotado:!p.agotado}:p)})))
  },[])

  const actualizarMenu = useCallback((m)=>setMenu(m),[])

  // Fuerza escritura INMEDIATA a Supabase (sin debounce)
  // Usar cuando el usuario presiona "Guardar" en Configuracion
  const forzarGuardado = useCallback(async (nuevaConfig) => {
    const configFinal = nuevaConfig ? { ...config, ...nuevaConfig } : config
    if (nuevaConfig) setConfig(prev => ({ ...prev, ...nuevaConfig }))
    lastWriteTime.current = Date.now()

    const { error } = await supabase
      .from('sb_operation_data')
      .update({ data: { config: configFinal, menu, mesas, historial, turnoActivo }, updated_at: new Date() })
      .eq('client_slug', slug)
    if (error) {
      console.error('[StreetBoss] ❌ forzarGuardado falló:', error.message)
      return { ok: false, error: error.message }
    }
    writeLS(slug, { config: configFinal, menu, mesas, historial, turnoActivo })

    return { ok: true }
  }, [config, menu, mesas, historial, turnoActivo, slug])

  const resetearDemo = useCallback(()=>{
    setConfig(CONFIG_DEFAULT); setMenu(getMenuForSlug(slug))
    setMesas(inicializarMesas(CONFIG_DEFAULT.numMesas))
    setHistorial([])
    setTurnoActivo(null)
  },[slug])

  return (
    <AppContext.Provider value={{
      slug, loading, config, menu, mesas, historial, turnoActivo,
      actualizarConfig, actualizarMenu, toggleAgotado, resetearDemo, forzarGuardado,
      abrirTurno, cerrarTurno,
      agregarProductoAMesa, quitarProductoDeMesa, actualizarNota, cancelarProducto,
      enviarACocina, marcarGrupoListo, aplicarDescuento,
      cobrarMesa, cancelarPedido,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
