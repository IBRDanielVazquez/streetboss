import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../supabase'
import { MENU_DEFAULT } from '../data/menu.js'

// ─── Utilidades ───────────────────────────────────────────────────────────────
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

const LS_KEY  = (s) => `sb_cache_${s}`
const readLS  = (s) => { try { const v = localStorage.getItem(LS_KEY(s)); return v ? JSON.parse(v) : null } catch { return null } }
const writeLS = (s, d) => { try { localStorage.setItem(LS_KEY(s), JSON.stringify(d)) } catch {} }

const _d = (d, h) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(h, Math.floor(Math.random() * 60), 0);
  return date.toISOString();
}

const HISTORIAL_MOCK = [
  { id: 'm1', fecha: _d(0, 14), mesa: 1, productos: [{nombre:'Taco Pastor', precio:25, cantidad:4}], subtotal: 100, total: 110, formaPago: 'efectivo', propina: {monto: 10}, mesero: 'Mesero 1', estado: 'cobrado' },
  { id: 'm2', fecha: _d(0, 15), mesa: 2, productos: [{nombre:'Gringa', precio:60, cantidad:2}], subtotal: 120, total: 132, formaPago: 'tarjeta', propina: {monto: 12}, mesero: 'Mesero 2', estado: 'cobrado' },
  { id: 'm3', fecha: _d(0, 17), mesa: 3, productos: [{nombre:'Agua', precio:20, cantidad:3}], subtotal: 60, total: 60, formaPago: 'transferencia', propina: {monto: 0}, mesero: 'Mesero 3', estado: 'cobrado' },
  { id: 'm4', fecha: _d(1, 14), mesa: 4, productos: [{nombre:'Taco Bistec', precio:30, cantidad:5}], subtotal: 150, total: 165, formaPago: 'efectivo', propina: {monto: 15}, mesero: 'Mesero 1', estado: 'cobrado' },
  { id: 'm5', fecha: _d(1, 16), mesa: 5, productos: [{nombre:'Mega Burrito', precio:120, cantidad:1}], subtotal: 120, total: 130, formaPago: 'tarjeta', propina: {monto: 10}, mesero: 'Mesero 2', estado: 'cobrado' },
  { id: 'm6', fecha: _d(1, 19), mesa: 1, productos: [{nombre:'Coca Cola', precio:25, cantidad:2}], subtotal: 50, total: 55, formaPago: 'efectivo', propina: {monto: 5}, mesero: 'Mesero 3', estado: 'cobrado' },
  { id: 'm7', fecha: _d(1, 21), mesa: 2, productos: [{nombre:'Taco Pastor', precio:25, cantidad:10}], subtotal: 250, total: 275, formaPago: 'tarjeta', propina: {monto: 25}, mesero: 'Mesero 1', estado: 'cobrado' },
  { id: 'm8', fecha: _d(2, 14), mesa: 3, productos: [{nombre:'Gringa', precio:60, cantidad:3}], subtotal: 180, total: 198, formaPago: 'transferencia', propina: {monto: 18}, mesero: 'Mesero 2', estado: 'cobrado' },
  { id: 'm9', fecha: _d(2, 15), mesa: 4, productos: [{nombre:'Agua', precio:20, cantidad:2}], subtotal: 40, total: 40, formaPago: 'efectivo', propina: {monto: 0}, mesero: 'Mesero 3', estado: 'cobrado' },
  { id: 'm10', fecha: _d(2, 18), mesa: 5, productos: [{nombre:'Mega Burrito', precio:120, cantidad:2}], subtotal: 240, total: 264, formaPago: 'tarjeta', propina: {monto: 24}, mesero: 'Mesero 1', estado: 'cobrado' },
  { id: 'm11', fecha: _d(2, 20), mesa: 1, productos: [{nombre:'Taco Bistec', precio:30, cantidad:6}], subtotal: 180, total: 198, formaPago: 'efectivo', propina: {monto: 18}, mesero: 'Mesero 2', estado: 'cobrado' },
  { id: 'm12', fecha: _d(2, 21), mesa: 2, productos: [{nombre:'Coca Cola', precio:25, cantidad:4}], subtotal: 100, total: 110, formaPago: 'transferencia', propina: {monto: 10}, mesero: 'Mesero 3', estado: 'cobrado' },
  { id: 'm13', fecha: _d(0, 19), mesa: 4, productos: [{nombre:'Gringa', precio:60, cantidad:4}], subtotal: 240, total: 264, formaPago: 'efectivo', propina: {monto: 24}, mesero: 'Mesero 1', estado: 'cobrado' },
  { id: 'm14', fecha: _d(1, 20), mesa: 3, productos: [{nombre:'Taco Pastor', precio:25, cantidad:8}], subtotal: 200, total: 220, formaPago: 'tarjeta', propina: {monto: 20}, mesero: 'Mesero 2', estado: 'cobrado' },
  { id: 'm15', fecha: _d(0, 21), mesa: 5, productos: [{nombre:'Agua', precio:20, cantidad:5}], subtotal: 100, total: 100, formaPago: 'transferencia', propina: {monto: 0}, mesero: 'Mesero 3', estado: 'cobrado' },
]

export const CONFIG_DEFAULT = {
  negocio:'StreetBoss POS', whatsapp:'9611234567', numMesas:8,
  colorMarca:'#f5b87a', logo:null, pinAdmin:'1234', pinSuperAdmin:'SBPRO-1512',
  slug: 'mi-negocio',
  cajeroHabilitado: false,
  meseros: [
    { nombre: 'Mesero 1', slug: 'mesero-1', activo: true },
    { nombre: 'Mesero 2', slug: 'mesero-2', activo: true },
    { nombre: 'Mesero 3', slug: 'mesero-3', activo: true },
  ],
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
  return merged
}

const crearMesasMock = () => {
  const base = inicializarMesas(8)
  const menuProds = MENU_DEFAULT.flatMap(c => c.productos)
  const findP = (name) => menuProds.find(p => p.nombre.toLowerCase().includes(name.toLowerCase())) || menuProds[0]

  return base.map(m => {
    if (m.numero === 2) {
      const p1 = findP('Taco Pastor'), p2 = findP('Coca Cola')
      const peds = [{ ...p1, cantidad: 2 }, { ...p2, cantidad: 1 }]
      return { ...m, estado: 'ocupada', meseroNombre: 'Mesero 1', pedidos: peds, totalParcial: peds.reduce((s,p)=>s+p.precio*p.cantidad,0), horaAbierta: new Date().toISOString() }
    }
    if (m.numero === 3) {
      const p1 = findP('Gringa'), p2 = findP('Agua'), p3 = findP('Bistec')
      const peds = [{ ...p1, id: 'mock-g1', cantidad: 1, enviadoACocina: true }, { ...p2, id: 'mock-a1', cantidad: 2, enviadoACocina: true }, { ...p3, id: 'mock-b1', cantidad: 1, enviadoACocina: true }]
      const grupoMock3 = { id: 'grupo-mock-3', horaEnvio: new Date().toISOString(), productos: peds, entregado: false, meseroNombre: 'Mesero 1' }
      return { ...m, estado: 'ocupada', enCocina: true, meseroNombre: 'Mesero 1', pedidos: peds, grupos: [grupoMock3], totalParcial: peds.reduce((s,p)=>s+p.precio*p.cantidad,0), horaAbierta: new Date().toISOString(), horaEnvioCocina: new Date().toISOString() }
    }
    if (m.numero === 4) {
      const p1 = findP('Burrito'), p2 = findP('Coca Cola')
      const peds = [{ ...p1, cantidad: 1 }, { ...p2, cantidad: 2 }]
      return { ...m, estado: 'lista', meseroNombre: 'Mesero 2', pedidos: peds, totalParcial: peds.reduce((s,p)=>s+p.precio*p.cantidad,0), horaAbierta: new Date().toISOString(), horaLista: new Date().toISOString() }
    }
    if (m.numero === 6) {
      const p1 = findP('Taco Pastor')
      const peds = [{ ...p1, cantidad: 4 }]
      return { ...m, estado: 'ocupada', meseroNombre: 'Mesero 2', pedidos: peds, totalParcial: peds.reduce((s,p)=>s+p.precio*p.cantidad,0), horaAbierta: new Date().toISOString() }
    }
    if (m.numero === 7) {
      const p1 = findP('Gringa'), p2 = findP('Coca Cola')
      const peds = [{ ...p1, id: 'mock-g2', cantidad: 2, enviadoACocina: true }, { ...p2, id: 'mock-c2', cantidad: 2, enviadoACocina: true }]
      const grupoMock7 = { id: 'grupo-mock-7', horaEnvio: new Date().toISOString(), productos: peds, entregado: false, meseroNombre: 'Mesero 3' }
      return { ...m, estado: 'ocupada', enCocina: true, meseroNombre: 'Mesero 3', pedidos: peds, grupos: [grupoMock7], totalParcial: peds.reduce((s,p)=>s+p.precio*p.cantidad,0), horaAbierta: new Date().toISOString(), horaEnvioCocina: new Date().toISOString() }
    }
    return m
  })
}

// ─── Contexto ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children, slug }) {
  const [config,      setConfig]      = useState(CONFIG_DEFAULT)
  const [menu,        setMenu]        = useState(MENU_DEFAULT)
  const [mesas,       setMesas]       = useState(() => inicializarMesas(8))
  const [historial,   setHistorial]   = useState([])
  const [turnoActivo, setTurnoActivo] = useState(null)
  const [loading,     setLoading]     = useState(true)

  const isInitialMount = useRef(true)
  const lastWriteTime = useRef(0)
  const isRemoteUpdate = useRef(false)

  // 1. Cargar datos iniciales (LocalStorage + Supabase)
  useEffect(() => {
    if (!slug) return

    // Paso 1: Cargar localStorage inmediatamente (UI instantánea)
    const cached = readLS(slug)
    if (cached) {
      isRemoteUpdate.current = true
      if (cached.config)    setConfig(mergeConfig(cached.config))
      if (cached.menu)      setMenu(cached.menu)
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
        if (d.mesas)     setMesas(d.mesas)
        if (d.historial) setHistorial(d.historial)
        setTurnoActivo(d.turnoActivo ?? null)
        writeLS(slug, d) // actualiza caché con datos frescos del servidor
        setTimeout(() => { isRemoteUpdate.current = false }, 200)
      } else if (!error && !data) {
        const initial = {
          config: CONFIG_DEFAULT, menu: MENU_DEFAULT,
          mesas: inicializarMesas(CONFIG_DEFAULT.numMesas),
          historial: [], 
          turnoActivo: null
        }
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
      await supabase
        .from('sb_operation_data')
        .update({ data: { config, menu, mesas, historial, turnoActivo }, updated_at: new Date() })
        .eq('client_slug', slug)
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

  const resetearDemo = useCallback(()=>{
    setConfig(CONFIG_DEFAULT); setMenu(MENU_DEFAULT)
    setMesas(inicializarMesas(CONFIG_DEFAULT.numMesas))
    setHistorial([])
    setTurnoActivo(null)
  },[])

  return (
    <AppContext.Provider value={{
      slug, loading, config, menu, mesas, historial, turnoActivo,
      actualizarConfig, actualizarMenu, toggleAgotado, resetearDemo,
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
