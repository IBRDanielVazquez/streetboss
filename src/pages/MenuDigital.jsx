import { useState, useMemo } from 'react'
import { Plus, Minus, X, CheckCircle, Store, Bike, Share } from 'lucide-react'
import { useApp } from '../context/AppContext'

// Genera folio único tipo SB-AXKF-7821
const generarFolio = () => {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const rand4 = Array.from({ length: 4 }, () => letras[Math.floor(Math.random() * letras.length)]).join('')
  const ts = Date.now().toString().slice(-4)
  return `SB-${rand4}-${ts}`
}

function haversine(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180,
    a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function MenuDigital({ modo: propModo }) {
  const modo = propModo || (window.location.pathname.includes('/carta') ? 'carta' : 'pedir')
  const { menu, config } = useApp()
  const [catActiva, setCatActiva] = useState(menu[0]?.id || '')

  // Estado del carrito: { prodId: cantidad }
  const [carrito, setCarrito] = useState({})
  const [checkoutVis, setCheckoutVis] = useState(false)
  const [datosCliente, setDatosCliente] = useState({ nombre: '', whatsapp: '', tipo: 'recoger', formaPago: 'efectivo', direccion: '', referencias: '', urlMapa: '' })
  const [zonaEnvio, setZonaEnvio] = useState({ activa: false, precio: 0, msj: '', error: false, lat: null, lng: null })
  const [pidiendoGps, setPidiendoGps] = useState(false)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null)

  const catVisible = menu.filter(c => c.visible)
  const catsPlus = menu.filter(c => c.esPlus && c.visible)

  const { subtotal, cantidadTotal } = useMemo(() => {
    let t = 0, c = 0
    Object.entries(carrito).forEach(([id, cant]) => {
      for (const cat of menu) {
        const prod = cat.productos.find(p => p.id === id)
        if (prod) {
          t += prod.precio * cant
          c += cant
          break
        }
      }
    })
    return { subtotal: t, cantidadTotal: c }
  }, [carrito, menu])

  const costoEnvio = datosCliente.tipo === 'llevar' ? zonaEnvio.precio : 0
  const totalConEnvio = subtotal + costoEnvio

  const agregarProducto = (prod) => {
    if (prod.agotado) return
    setCarrito(prev => ({ ...prev, [prod.id]: (prev[prod.id] || 0) + 1 }))
  }

  const quitarProducto = (prodId) => {
    setCarrito(prev => {
      const n = { ...prev }
      if (n[prodId] > 1) n[prodId]--
      else delete n[prodId]
      return n
    })
  }

  const enviarPedido = () => {
    if (!datosCliente.nombre.trim() || !datosCliente.whatsapp.trim()) return alert('Por favor completa tu nombre y WhatsApp')
    if (Object.keys(carrito).length === 0) return

    const productosAuditados = []
    let subtotalCalculado = 0
    Object.entries(carrito).forEach(([id, cantidad]) => {
      for (const cat of menu) {
        const prod = cat.productos.find(p => p.id === id)
        if (prod && prod.activo && !prod.agotado) {
          productosAuditados.push({ id: prod.id, nombre: prod.nombre, cantidad, precioUnitario: prod.precio, subtotal: prod.precio * cantidad })
          subtotalCalculado += prod.precio * cantidad
          break
        }
      }
    })

    if (productosAuditados.length === 0) return alert('Tu carrito está vacío o los productos no están disponibles')
    if (datosCliente.tipo === 'llevar') {
      if (!config.envio?.activo) return alert('El envío a domicilio no está disponible.')
      if (!datosCliente.direccion?.trim()) return alert('Por favor ingresa tu dirección de entrega.')
      if (config.envio.pedidoMinimo > 0 && subtotalCalculado < config.envio.pedidoMinimo) {
        return alert(`Pedido mínimo para envío: $${config.envio.pedidoMinimo}`)
      }
    }

    const folio = generarFolio()
    const envio = datosCliente.tipo === 'llevar' ? (zonaEnvio.activa && !zonaEnvio.error ? zonaEnvio.precio : 0) : 0
    const totalCalculado = subtotalCalculado + envio

    const tipoLabel = datosCliente.tipo === 'llevar' ? 'Para llevar' : 'Recoger'
    const pagoLabel = datosCliente.formaPago === 'efectivo' ? 'Efectivo' : datosCliente.formaPago === 'transferencia' ? 'Transferencia' : 'Tarjeta'

    let msg = `🍔 *Nuevo pedido — ${config.negocio || 'StreetBoss'}*\n`
    msg += `📋 Folio: ${folio}\n\n👤 Cliente: ${datosCliente.nombre.trim()}\n📱 WhatsApp: ${datosCliente.whatsapp.trim()}\n🚗 Tipo: ${tipoLabel}\n`

    if (datosCliente.tipo === 'llevar') {
      msg += `🏠 Dirección: ${datosCliente.direccion.trim()}\n`
      if (datosCliente.referencias?.trim()) {
        msg += `🔍 Referencias: ${datosCliente.referencias.trim()}\n`
      }
      
      let mapsUrl = datosCliente.urlMapa?.trim()
      if (!mapsUrl && zonaEnvio.activa && zonaEnvio.lat && zonaEnvio.lng) {
        mapsUrl = `https://www.google.com/maps?q=${zonaEnvio.lat},${zonaEnvio.lng}`
      }
      if (mapsUrl) {
        msg += `📍 Ubicación de Google Maps: ${mapsUrl}\n`
      }
      
      const envioTexto = (zonaEnvio.activa && !zonaEnvio.error) ? `$${envio}` : 'Pendiente de confirmar'
      msg += `🚗 Envío: ${envioTexto}\n`
    }

    msg += `\n📝 *Pedido:*\n`
    productosAuditados.forEach(p => msg += `${p.cantidad}x ${p.nombre} — $${p.subtotal}\n`)
    msg += `\n💰 Subtotal: $${subtotalCalculado}\n`
    
    if (datosCliente.tipo === 'llevar') {
      const envioTexto = (zonaEnvio.activa && !zonaEnvio.error) ? `$${envio}` : 'Pendiente de confirmar'
      msg += `🚗 Envío: ${envioTexto}\n`
    }
    
    msg += `💵 Pago: ${pagoLabel}\n\n✅ *Total: $${totalCalculado}*`
    if (datosCliente.tipo === 'llevar' && (!zonaEnvio.activa || zonaEnvio.error)) {
      msg += ` *(Costo de envío pendiente de confirmar)*`
    }

    if (datosCliente.formaPago === 'transferencia') msg += `\n\n📎 Adjunto comprobante de pago`
    msg += `\n\nDudas al ${config.whatsapp || '9612466204'} 🔥`

    window.open(`https://wa.me/52${config.whatsapp || '9612466204'}?text=${encodeURIComponent(msg)}`, '_blank')

    setCarrito({})
    setCheckoutVis(false)
    setPedidoConfirmado({ folio, cliente: datosCliente, productos: productosAuditados, subtotalCalculado, costoEnvio: envio, totalCalculado, tipo: datosCliente.tipo, formaPago: datosCliente.formaPago })
  }

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) return alert('Tu navegador no soporta geolocalización')
    setPidiendoGps(true)
    setZonaEnvio({ activa: false, precio: 0, msj: 'Obteniendo...', error: false, lat: null, lng: null })
    navigator.geolocation.getCurrentPosition(pos => {
      setPidiendoGps(false)
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      const d = haversine(config.envio?.ubicacion?.lat, config.envio?.ubicacion?.lng, lat, lng)
      const zonas = [...(config.envio?.zonas || [])].sort((a,b)=>a.hasta-b.hasta)
      const zona = zonas.find(z => d <= z.hasta)
      if (zona) {
        setZonaEnvio({ activa: true, precio: zona.precio, msj: `Zona (A ${d.toFixed(1)} km)`, error: false, lat, lng })
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setDatosCliente(prev => ({ ...prev, direccion: data.display_name }))
            }
          }).catch(err => console.log('Error de geolocalización inversa:', err))
      } else {
        setZonaEnvio({ activa: true, precio: 0, msj: 'Fuera de cobertura', error: true, lat, lng })
      }
    }, (error) => {
      setPidiendoGps(false)
      let reason = 'Error de ubicación'
      if (error && error.code === 1) reason = 'Permiso bloqueado'
      if (error && error.code === 2) reason = 'GPS no disponible'
      if (error && error.code === 3) reason = 'Tiempo de espera agotado'
      setZonaEnvio({ activa: false, precio: 0, msj: reason, error: true, lat: null, lng: null })
    }, { enableHighAccuracy: true, timeout: 10000 })
  }

  if (pedidoConfirmado) {
    const { folio, productos, subtotalCalculado, costoEnvio, totalCalculado } = pedidoConfirmado
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 font-sans">
        <div className="mb-6 flex flex-col items-center gap-3">
          <CheckCircle size={64} className="text-green-500" />
          <span className="text-gray-900 font-bold text-2xl">¡Pedido confirmado!</span>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full max-w-sm text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Folio</p>
            <span className="font-black text-3xl text-gray-900 tracking-widest block mb-4" onClick={() => navigator.clipboard?.writeText(folio)}>{folio}</span>
            <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">Estado: Recibido ✅</span>
            <div className="mt-6 text-left border-t border-gray-100 pt-4">
              {productos.map(p => (
                <div key={p.id} className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{p.cantidad}x {p.nombre}</span>
                  <span className="font-semibold text-gray-900">${p.subtotal}</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-lg text-gray-900 pt-2 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span style={{ color: config.colorMarca || '#f5b87a' }}>${totalCalculado}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">📱 Te avisamos por WhatsApp cuando esté listo<br/>⏱ Tiempo estimado: 15-25 min</p>
            <button onClick={() => setPedidoConfirmado(null)} className="w-full mt-6 bg-black text-white font-bold py-4 rounded-xl active:scale-95 transition-transform">Hacer otro pedido</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans relative">
      <header className="bg-white px-4 py-6 shadow-sm sticky top-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {config.logo && <img src={config.logo} alt="Logo" className="w-12 h-12 rounded-full object-cover" />}
          <div>
            <h1 className="text-2xl font-black text-gray-900">{config.negocio}</h1>
            <p className="text-gray-500 text-sm">{modo === 'pedir' ? 'Menú digital' : 'Nuestra carta'}</p>
          </div>
        </div>
      </header>

      {catsPlus.length > 0 && (
        <div className="p-4" style={{ background: `linear-gradient(135deg, ${config.colorMarca || '#f5b87a'}33 0%, transparent 100%)` }}>
          <h2 className="font-black text-lg mb-3">Especialidades</h2>
          <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
            {catsPlus.flatMap(c => c.productos).filter(p => p.activo).map(prod => (
              <div key={prod.id} className="bg-white min-w-[200px] p-3 rounded-2xl shadow-sm border border-white flex flex-col gap-2">
                <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden relative">
                  {prod.foto ? <img src={prod.foto} className="w-full h-full object-cover" alt={prod.nombre} /> : <div className="w-full h-full flex items-center justify-center text-4xl">🌮</div>}
                </div>
                <h3 className="font-bold text-sm leading-tight">{prod.nombre}</h3>
                <span className="font-black" style={{ color: config.colorMarca || '#f5b87a' }}>${prod.precio}</span>
                {modo === 'pedir' && (
                  <button onClick={() => agregarProducto(prod)} className="bg-gray-100 text-sm font-bold py-1.5 rounded-lg active:scale-95 flex justify-center items-center gap-1"><Plus size={14}/> Agregar</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#FAFAFA] sticky top-[92px] z-10 px-4 py-3 shadow-sm flex overflow-x-auto gap-2 no-scrollbar">
        {catVisible.map(c => (
          <button key={c.id} onClick={() => { setCatActiva(c.id); document.getElementById(`cat-${c.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${catActiva === c.id ? 'bg-black text-white' : 'bg-white text-gray-600 shadow-sm'}`}
            style={catActiva === c.id ? { backgroundColor: config.colorMarca || '#000', color: '#fff' } : {}}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-8">
        {catVisible.map(c => (
          <div key={c.id} id={`cat-${c.id}`} className="scroll-mt-36">
            <h2 className="text-xl font-black text-gray-900 mb-4">{c.nombre}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c.productos.filter(p => p.activo).map(prod => {
                const cant = carrito[prod.id] || 0
                return (
                  <div key={prod.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${prod.agotado ? 'opacity-50' : ''}`}>
                    <div className="w-full aspect-[16/9] bg-gray-100 relative">
                      {prod.foto ? <img src={prod.foto} className="w-full h-full object-cover" alt={prod.nombre} /> : <div className="w-full h-full flex items-center justify-center text-4xl">🌮</div>}
                      {prod.agotado && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs">AGOTADO</span></div>}
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-gray-900">{prod.nombre}</h3>
                        <span className="font-black text-lg flex-shrink-0" style={{ color: config.colorMarca || '#f5b87a' }}>${prod.precio}</span>
                      </div>
                      {prod.descripcion && <p className="text-gray-500 text-xs line-clamp-2">{prod.descripcion}</p>}
                      <div className="mt-auto pt-3 flex justify-end">
                        {modo === 'pedir' && !prod.agotado && (
                          cant > 0 ? (
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1 shadow-inner">
                              <button onClick={() => quitarProducto(prod.id)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-700 active:scale-90"><Minus size={16} /></button>
                              <span className="font-bold text-gray-900 w-4 text-center">{cant}</span>
                              <button onClick={() => agregarProducto(prod)} className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-white active:scale-90" style={{ backgroundColor: config.colorMarca || '#000' }}><Plus size={16} /></button>
                            </div>
                          ) : (
                            <button onClick={() => agregarProducto(prod)} className="bg-gray-100 text-gray-900 font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2 active:scale-95"><Plus size={16}/> Agregar</button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {modo === 'pedir' && cantidadTotal > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-30">
          <button onClick={() => setCheckoutVis(true)} className="w-full bg-black text-white p-4 rounded-2xl shadow-xl flex items-center justify-between active:scale-95 transition-transform" style={{ backgroundColor: config.colorMarca || '#000' }}>
            <div className="flex items-center gap-3">
              <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{cantidadTotal}</span>
              <span className="font-bold">Ver pedido</span>
            </div>
            <span className="font-black text-lg">${totalConEnvio}</span>
          </button>
        </div>
      )}

      {modo === 'carta' && (
        <div className="pb-12 text-center text-gray-500 text-sm">😊 Tu mesero te atenderá en un momento</div>
      )}

      {checkoutVis && modo === 'pedir' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity">
          <div className="bg-white w-full sm:w-[400px] max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col transform transition-transform">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-black text-xl">Tu Pedido</h3>
              <button onClick={() => setCheckoutVis(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="space-y-3 pb-4 border-b border-gray-100">
                {Object.entries(carrito).map(([id, cant]) => {
                  let prodName = '', prodPrice = 0
                  for(const cat of menu) { const p = cat.productos.find(x => x.id === id); if(p) { prodName = p.nombre; prodPrice = p.precio; break; } }
                  return (
                    <div key={id} className="flex justify-between items-center text-sm">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                          <button onClick={() => quitarProducto(id)} className="text-gray-500"><Minus size={12}/></button>
                          <span className="font-bold w-4 text-center text-xs">{cant}</span>
                          <button onClick={() => agregarProducto({id})} className="text-gray-500"><Plus size={12}/></button>
                        </div>
                        <span className="font-medium">{prodName}</span>
                      </div>
                      <span className="font-semibold">${prodPrice * cant}</span>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-4">
                <input type="text" value={datosCliente.nombre} onChange={e=>setDatosCliente(d=>({...d, nombre: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black" placeholder="Tu nombre" />
                <input type="tel" value={datosCliente.whatsapp} onChange={e=>setDatosCliente(d=>({...d, whatsapp: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black" placeholder="Tu WhatsApp" />
                
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setDatosCliente(d=>({...d, tipo: 'recoger'}))} className={`p-3 rounded-xl border font-bold text-sm flex flex-col items-center gap-1 ${datosCliente.tipo === 'recoger' ? 'border-black bg-black text-white' : 'bg-white text-gray-500'}`}><Store size={20}/> Recoger</button>
                  {config.envio?.activo && (
                    <button onClick={() => { setDatosCliente(d=>({...d, tipo: 'llevar'})); if(!zonaEnvio.activa) obtenerUbicacion(); }} className={`p-3 rounded-xl border font-bold text-sm flex flex-col items-center gap-1 ${datosCliente.tipo === 'llevar' ? 'border-black bg-black text-white' : 'bg-white text-gray-500'}`}><Bike size={20}/> Llevar</button>
                  )}
                </div>

                {datosCliente.tipo === 'llevar' && (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-gray-700">📍 Ubicación y Entrega</span>
                      
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={obtenerUbicacion} 
                          disabled={pidiendoGps}
                          className="flex-1 bg-black text-white py-2.5 px-3 rounded-lg text-xs font-bold active:scale-95 transition-transform disabled:opacity-50"
                        >
                          {pidiendoGps ? 'Solicitando GPS...' : '📍 Usar ubicación GPS'}
                        </button>
                        
                        <a 
                          href="https://www.google.com/maps/search/?api=1&query=Mi%20ubicación" 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 px-3 rounded-lg text-xs font-bold text-center flex items-center justify-center active:scale-95 transition-transform"
                        >
                          🗺️ Abrir Google Maps
                        </a>
                      </div>

                      {/* Estado del GPS */}
                      {(pidiendoGps || zonaEnvio.activa || zonaEnvio.msj) && (
                        <p className={`text-xs font-medium ${zonaEnvio.error ? 'text-red-500' : 'text-green-600'}`}>
                          {pidiendoGps ? '⌛ Buscando coordenadas...' : 
                           (zonaEnvio.error ? `⚠️ ${zonaEnvio.msj}` : `✅ ${zonaEnvio.msj} (Envío: $${zonaEnvio.precio})`)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Dirección exacta (requerido)</label>
                        <textarea 
                          rows={2} 
                          value={datosCliente.direccion} 
                          onChange={e => setDatosCliente(d => ({ ...d, direccion: e.target.value }))}
                          placeholder="Calle, número exterior/interior, colonia..." 
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-black"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Referencias de entrega (opcional)</label>
                        <input 
                          type="text" 
                          value={datosCliente.referencias} 
                          onChange={e => setDatosCliente(d => ({ ...d, referencias: e.target.value }))}
                          placeholder="Color de reja, local, entre calles..." 
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Enlace de Google Maps (opcional)</label>
                        <input 
                          type="url" 
                          value={datosCliente.urlMapa} 
                          onChange={e => setDatosCliente(d => ({ ...d, urlMapa: e.target.value }))}
                          placeholder="Pega el link de Google Maps si el GPS falla" 
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2">
                  {config.formasPago?.efectivo && <button onClick={()=>setDatosCliente(d=>({...d, formaPago: 'efectivo'}))} className={`p-3 rounded-xl border text-sm font-bold text-left ${datosCliente.formaPago === 'efectivo' ? 'border-black bg-black text-white' : 'bg-white text-gray-500'}`}>💵 Efectivo (Paga al recibir)</button>}
                  {config.formasPago?.transferencia && <button onClick={()=>setDatosCliente(d=>({...d, formaPago: 'transferencia'}))} className={`p-3 rounded-xl border text-sm font-bold text-left flex flex-col ${datosCliente.formaPago === 'transferencia' ? 'border-black bg-black text-white' : 'bg-white text-gray-500'}`}>
                    <span>📲 Transferencia</span>
                    {datosCliente.formaPago === 'transferencia' && config.datosBancarios?.banco && (
                      <span className="text-xs font-normal opacity-80 mt-1">Banco: {config.datosBancarios.banco} | CLABE: {config.datosBancarios.clabe}<br/>📎 Adjunta comprobante en el WhatsApp</span>
                    )}
                  </button>}
                  {config.formasPago?.tarjeta && <button onClick={()=>setDatosCliente(d=>({...d, formaPago: 'tarjeta'}))} className={`p-3 rounded-xl border text-sm font-bold text-left ${datosCliente.formaPago === 'tarjeta' ? 'border-black bg-black text-white' : 'bg-white text-gray-500'}`}>💳 Tarjeta (Paga con terminal al recibir)</button>}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-bold">Total</span>
                <span className="font-black text-2xl">${totalConEnvio}</span>
              </div>
              <button onClick={enviarPedido} disabled={!datosCliente.nombre || !datosCliente.whatsapp || (datosCliente.tipo === 'llevar' && (!datosCliente.direccion?.trim() || (config.envio?.pedidoMinimo > 0 && subtotal < config.envio.pedidoMinimo)))} className="w-full bg-green-500 text-white font-black py-4 rounded-xl disabled:bg-gray-300 disabled:text-gray-500">Confirmar pedido ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
