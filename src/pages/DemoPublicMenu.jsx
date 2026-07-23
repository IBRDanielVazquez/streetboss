import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Minus, X, CheckCircle, Store, Bike, Clock, MapPin, Phone, AlertTriangle, Instagram, Facebook } from 'lucide-react'
import { useTrialData } from '../context/DemoTrialsContext'

// Genera folio de pedido tipo SB-PR-8291
const generarFolio = () => {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const rand4 = Array.from({ length: 4 }, () => letras[Math.floor(Math.random() * letras.length)]).join('')
  const ts = Date.now().toString().slice(-4)
  return `SB-DEMO-${rand4}-${ts}`
}

export default function DemoPublicMenu() {
  const { trialId } = useParams()
  const trial = useTrialData(trialId)
  const [carrito, setCarrito] = useState({}) // { prodId: cantidad }
  const [checkoutVis, setCheckoutVis] = useState(false)
  const [datosCliente, setDatosCliente] = useState({ nombre: '', whatsapp: '', tipo: 'recoger', direccion: '', referencias: '', km: '' })
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null)
  const [catActiva, setCatActiva] = useState('')

  if (!trial.valido) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4 p-6 text-center">
        <span className="text-5xl">🔎</span>
        <h1 className="text-gray-900 font-black text-xl">Menú no encontrado</h1>
        <p className="text-gray-500 text-sm max-w-sm">El enlace no es válido o la prueba no existe en este navegador.</p>
      </div>
    )
  }

  const { demo, negocio, menu, creado, status } = trial

  // Calcular expiración de la prueba (7 días)
  const diasTranscurridos = creado ? Math.floor((Date.now() - new Date(creado).getTime()) / (1000 * 60 * 60 * 24)) : 0
  const expirado = diasTranscurridos >= 7
  const diasRestantes = Math.max(0, 7 - diasTranscurridos)
  const paginaPausada = status === 'pausada'
  const paginaSuspendida = status === 'suspendida'

  // Filtrar categorías y productos activos
  const categoriasVisibles = useMemo(() => {
    return menu.filter(c => c.visible).map(c => ({
      ...c,
      productos: c.productos.filter(p => p.activo)
    })).filter(c => c.productos.length > 0)
  }, [menu])

  // Establecer la primera categoría activa por defecto si no se ha seleccionado ninguna
  if (!catActiva && categoriasVisibles.length > 0) {
    setCatActiva(categoriasVisibles[0].id)
  }

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

  const servicioDomicilio = negocio.servicioDomicilio !== false
  const modoEnvio = negocio.modoEnvio || 'pendiente'
  const costoEnvioVal = Number(negocio.costoEnvio) || 0
  const costoPorKm = Number(negocio.costoEnvioKm) || 0
  const kmEstimados = Math.max(0, Number(datosCliente.km) || 0)
  const costoEnvioPendiente = datosCliente.tipo === 'llevar' && servicioDomicilio && modoEnvio === 'pendiente'
  const costoEnvio = datosCliente.tipo === 'llevar' && servicioDomicilio
    ? modoEnvio === 'fijo'
      ? costoEnvioVal
      : modoEnvio === 'km'
        ? Math.ceil(kmEstimados) * costoPorKm
        : 0
    : 0
  const totalConEnvio = subtotal + costoEnvio
  const textoEnvioPublico = !servicioDomicilio
    ? 'Sin servicio a domicilio'
    : modoEnvio === 'fijo'
      ? `Envío: $${costoEnvioVal}`
      : modoEnvio === 'km'
        ? `Envío: $${costoPorKm}/km`
        : 'Subtotal pendiente de envío'
  const normalizarUrl = (url) => {
    if (!url) return ''
    return /^https?:\/\//i.test(url) ? url : `https://${url}`
  }

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
    if (!datosCliente.nombre.trim() || !datosCliente.whatsapp.trim()) {
      alert('Por favor ingresa tu nombre y WhatsApp')
      return
    }
    if (Object.keys(carrito).length === 0) return

    const productosOrdenados = []
    let subtotalCalculado = 0
    Object.entries(carrito).forEach(([id, cantidad]) => {
      for (const cat of menu) {
        const prod = cat.productos.find(p => p.id === id)
        if (prod && prod.activo && !prod.agotado) {
          productosOrdenados.push({
            id: prod.id,
            nombre: prod.nombre,
            cantidad,
            precioUnitario: prod.precio,
            subtotal: prod.precio * cantidad
          })
          subtotalCalculado += prod.precio * cantidad
          break
        }
      }
    })

    if (productosOrdenados.length === 0) {
      alert('Tu carrito está vacío o los productos no están disponibles')
      return
    }

    if (datosCliente.tipo === 'llevar' && !datosCliente.direccion.trim()) {
      alert('Por favor ingresa tu dirección de entrega')
      return
    }
    if (datosCliente.tipo === 'llevar' && modoEnvio === 'km' && !kmEstimados) {
      alert('Por favor ingresa los kilómetros aproximados para calcular el envío')
      return
    }

    const folio = generarFolio()
    const envio = datosCliente.tipo === 'llevar' ? costoEnvio : 0
    const totalCalculado = subtotalCalculado + envio

    const tipoLabel = datosCliente.tipo === 'llevar' ? 'Para llevar 🚗' : 'Recoger en sucursal 🏪'

    let msg = `🍔 *Pedido Demo — ${negocio.nombre || demo?.nombre || 'StreetBoss'}*\n`
    msg += `📋 Folio: ${folio}\n`
    msg += `⚠️ _(Mensaje de prueba - Demo en localStorage)_\n\n`
    msg += `👤 Cliente: ${datosCliente.nombre.trim()}\n`
    msg += `📱 WhatsApp: ${datosCliente.whatsapp.trim()}\n`
    msg += `🚗 Entrega: ${tipoLabel}\n`

    if (datosCliente.tipo === 'llevar') {
      msg += `🏠 Dirección: ${datosCliente.direccion.trim()}\n`
      if (modoEnvio === 'km') {
        msg += `📍 Distancia estimada: ${kmEstimados} km\n`
      }
      if (datosCliente.referencias.trim()) {
        msg += `🔍 Referencias: ${datosCliente.referencias.trim()}\n`
      }
    }

    msg += `\n📝 *Detalle del pedido:*\n`
    productosOrdenados.forEach(p => {
      msg += `• ${p.cantidad}x ${p.nombre} — $${p.subtotal}\n`
    })

    msg += `\n💰 Subtotal: $${subtotalCalculado}\n`
    if (datosCliente.tipo === 'llevar') {
      if (modoEnvio === 'pendiente') {
        msg += `🚗 Envío: *Pendiente de confirmar por el negocio*\n`
        msg += `⚠️ El subtotal NO incluye costo de envío.\n`
      } else if (modoEnvio === 'km') {
        msg += `🚗 Envío: $${envio} (${Math.ceil(kmEstimados)} km x $${costoPorKm})\n`
      } else {
        msg += `🚗 Costo de envío: $${envio}\n`
      }
    }
    msg += modoEnvio === 'pendiente' && datosCliente.tipo === 'llevar'
      ? `✅ *Subtotal: $${subtotalCalculado} · Envío pendiente*\n\n`
      : `✅ *Total: $${totalCalculado}*\n\n`
    msg += `⏱ Tiempo estimado: ${negocio.tiempoEntrega || '30-40 min'}\n`

    // Destinatario: el WhatsApp configurado en los datos del negocio (limpiando caracteres no numéricos)
    const numeroWhatsApp = (negocio.whatsapp || negocio.telefono || '9612466204').replace(/\D/g, '')
    // Si no tiene código de país, asumir 52 (México)
    const whatsappDestino = numeroWhatsApp.length === 10 ? `52${numeroWhatsApp}` : numeroWhatsApp

    window.open(`https://wa.me/${whatsappDestino}?text=${encodeURIComponent(msg)}`, '_blank')

    setCarrito({})
    setCheckoutVis(false)
    setPedidoConfirmado({
      folio,
      productos: productosOrdenados,
      totalCalculado,
      tipo: datosCliente.tipo
    })
  }

  // Pantalla de expiración
  if (expirado || paginaPausada || paginaSuspendida) {
    const tituloEstado = expirado ? 'Menú digital finalizado' : paginaSuspendida ? 'Menú Suspendido' : 'Menú Pausado'
    const textoEstado = expirado
      ? `El período inicial de 7 días para ${negocio.nombre} ha finalizado.`
      : paginaSuspendida
        ? `La página de ${negocio.nombre} fue suspendida temporalmente por StreetBoss.`
        : `La página de ${negocio.nombre} está pausada temporalmente.`
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans text-white">
        <div className="bg-slate-900 border border-red-500/20 rounded-3xl p-8 max-w-lg shadow-2xl space-y-5">
          <span className="text-6xl block">⏳</span>
          <h2 className="text-white font-black text-2xl">{tituloEstado}</h2>
          <p className="text-slate-400 text-sm">
            <strong className="text-white">{textoEstado}</strong>
          </p>
          <p className="text-slate-500 text-xs">
            Esta vista pública ha sido deshabilitada temporalmente. Para activarla, habilitar pedidos ilimitados y obtener tu propio dominio, activa la cuenta oficial de Street Boss.
          </p>
          <a
            href="https://wa.me/529612466204?text=Hola,%20el%20demo%20de%20mi%20negocio%20ha%20expirado%20y%20quiero%20contratar%20Street%20Boss"
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-xl hover:opacity-90 transition-opacity"
          >
            📞 Contactar a Soporte / Activar Cuenta
          </a>
        </div>
      </div>
    )
  }

  if (pedidoConfirmado) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 font-sans">
        <div className="mb-6 flex flex-col items-center gap-3 w-full max-w-sm text-center">
          <CheckCircle size={64} className="text-green-500" />
          <h2 className="text-gray-900 font-bold text-2xl">¡Pedido Enviado!</h2>
          <p className="text-gray-500 text-sm">Hemos abierto WhatsApp para enviar tu orden al restaurante.</p>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 w-full mt-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Folio del Pedido</p>
            <span className="font-mono font-black text-2xl text-gray-900 tracking-wider block mb-4">{pedidoConfirmado.folio}</span>
            <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">Simulación Demo ✅</span>
            
            <div className="mt-6 text-left border-t border-gray-100 pt-4 space-y-2">
              {pedidoConfirmado.productos.map(p => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{p.cantidad}x {p.nombre}</span>
                  <span className="font-semibold text-gray-900">${p.subtotal}</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-lg text-gray-900 pt-3 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span className="text-emerald-600">${pedidoConfirmado.totalCalculado}</span>
              </div>
            </div>

            <button 
              onClick={() => setPedidoConfirmado(null)} 
              className="w-full mt-6 bg-gray-900 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-transform"
            >
              Hacer otro pedido
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans relative">
      
      {/* Banner flotante de vista previa */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-700 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-1.5">
        <AlertTriangle size={14} />
        <span>Vista previa del Menú Público · Periodo inicial: Quedan {diasRestantes} días</span>
      </div>

      {/* Cabecera del restaurante */}
      <header className="bg-white px-5 py-6 shadow-sm sticky top-0 z-20 border-b border-gray-100">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            {negocio.logo ? (
              <img src={negocio.logo} alt={`Logo de ${negocio.nombre || demo?.nombre}`} className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm" />
            ) : (
              <span className="text-4xl">{demo?.emoji || '🍔'}</span>
            )}
            <div>
              <h1 className="text-2xl font-black text-gray-900">{negocio.nombre || demo?.nombre}</h1>
              <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                Abierto
              </span>
            </div>
          </div>

          <p className="text-gray-500 text-xs mt-1 leading-relaxed">{negocio.mensajeClientes}</p>

          {(negocio.redes?.instagram || negocio.redes?.facebook || negocio.redes?.tiktok) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {negocio.redes?.instagram && (
                <a href={normalizarUrl(negocio.redes.instagram)} target="_blank" rel="noreferrer" className="bg-pink-50 text-pink-700 font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1">
                  <Instagram size={12} /> Instagram
                </a>
              )}
              {negocio.redes?.facebook && (
                <a href={normalizarUrl(negocio.redes.facebook)} target="_blank" rel="noreferrer" className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1">
                  <Facebook size={12} /> Facebook
                </a>
              )}
              {negocio.redes?.tiktok && (
                <a href={normalizarUrl(negocio.redes.tiktok)} target="_blank" rel="noreferrer" className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-[11px]">
                  TikTok
                </a>
              )}
            </div>
          )}

          {/* Información del negocio */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 border-t border-gray-50 pt-3">
            {negocio.direccion && (
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{negocio.direccion}</span>
              </div>
            )}
            {negocio.horarios && (
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-gray-400 flex-shrink-0" />
                <span>{negocio.horarios}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Bike size={13} className="text-gray-400 flex-shrink-0" />
              <span>{textoEnvioPublico} · Entrega en {negocio.tiempoEntrega || '30-40 min'}</span>
            </div>
            {(negocio.whatsapp || negocio.telefono) && (
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-gray-400 flex-shrink-0" />
                <span>WhatsApp de pedido: {negocio.whatsapp || negocio.telefono}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navegador de categorías */}
      {categoriasVisibles.length > 0 ? (
        <div className="bg-white sticky top-[138px] z-10 px-4 py-3 shadow-sm border-b border-gray-100 flex overflow-x-auto gap-2 no-scrollbar">
          {categoriasVisibles.map(c => (
            <button 
              key={c.id} 
              onClick={() => { setCatActiva(c.id); document.getElementById(`cat-${c.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                catActiva === c.id ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {c.nombre}
            </button>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 text-sm">Este menú no tiene productos disponibles.</div>
      )}

      {/* Listado de Productos */}
      <div className="p-4 max-w-2xl mx-auto space-y-8">
        {categoriasVisibles.map(c => (
          <div key={c.id} id={`cat-${c.id}`} className="scroll-mt-48">
            <h2 className="text-lg font-black text-gray-900 mb-3.5 border-b border-gray-100 pb-1">{c.nombre}</h2>
            <div className="grid grid-cols-1 gap-4">
              {c.productos.map(prod => {
                const cant = carrito[prod.id] || 0
                return (
                  <div key={prod.id} className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 relative ${prod.agotado ? 'opacity-65' : ''}`}>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="font-bold text-gray-900 text-sm md:text-base">{prod.nombre}</h3>
                        <span className="font-black text-emerald-600">${prod.precio}</span>
                      </div>
                      {prod.descripcion && <p className="text-gray-500 text-xs line-clamp-2 pr-10">{prod.descripcion}</p>}
                      
                      {/* Botones de acción */}
                      <div className="pt-2 flex items-center justify-between">
                        {prod.agotado ? (
                          <span className="bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">AGOTADO</span>
                        ) : (
                          cant > 0 ? (
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full p-0.5">
                              <button onClick={() => quitarProducto(prod.id)} className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-700 active:scale-90"><Minus size={13} /></button>
                              <span className="font-bold text-gray-900 text-xs w-4 text-center">{cant}</span>
                              <button onClick={() => agregarProducto(prod)} className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-sm active:scale-90"><Plus size={13} /></button>
                            </div>
                          ) : (
                            <button onClick={() => agregarProducto(prod)} className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1 active:scale-95">
                              <Plus size={12}/> Agregar
                            </button>
                          )
                        )}
                      </div>
                    </div>
                    
                    {/* Imagen de producto */}
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-100">
                      {prod.foto ? (
                        <img src={prod.foto} className="w-full h-full object-cover" alt={prod.nombre} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">{demo?.emoji || '🌮'}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Botón flotante para ver pedido */}
      {cantidadTotal > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-30 max-w-md mx-auto">
          <button 
            onClick={() => setCheckoutVis(true)} 
            className="w-full bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">{cantidadTotal}</span>
              <span className="font-bold text-sm">Ver mi pedido</span>
            </div>
            <span className="font-black text-base">{costoEnvioPendiente ? `$${subtotal}+envío` : `$${totalConEnvio}`}</span>
          </button>
        </div>
      )}

      {/* Modal Checkout */}
      {checkoutVis && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full sm:w-[400px] max-h-[85vh] rounded-t-3xl sm:rounded-3xl flex flex-col transform transition-transform">
            
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-black text-lg">Tu Orden</h3>
              <button onClick={() => setCheckoutVis(false)} className="p-1.5 bg-gray-100 rounded-full"><X size={18} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              {/* Resumen del carrito */}
              <div className="space-y-3 pb-3 border-b border-gray-100">
                {Object.entries(carrito).map(([id, cant]) => {
                  let prodName = '', prodPrice = 0
                  for(const cat of menu) { 
                    const p = cat.productos.find(x => x.id === id)
                    if(p) { prodName = p.nombre; prodPrice = p.price || p.precio; break; } 
                  }
                  return (
                    <div key={id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600 text-xs">{cant}x</span>
                        <span className="font-medium text-gray-800">{prodName}</span>
                      </div>
                      <span className="font-semibold text-gray-900">${prodPrice * cant}</span>
                    </div>
                  )
                })}
              </div>

              {/* Formulario de envío */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tu Nombre *</label>
                  <input 
                    type="text" 
                    value={datosCliente.nombre} 
                    onChange={e=>setDatosCliente(d=>({...d, nombre: e.target.value}))} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600" 
                    placeholder="Ej. Juan Pérez" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tu WhatsApp *</label>
                  <input 
                    type="tel" 
                    value={datosCliente.whatsapp} 
                    onChange={e=>setDatosCliente(d=>({...d, whatsapp: e.target.value}))} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600" 
                    placeholder="10 dígitos" 
                    inputMode="numeric"
                  />
                </div>
                
                {/* Tipo de entrega */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tipo de Entrega</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setDatosCliente(d=>({...d, tipo: 'recoger'}))} 
                      className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        datosCliente.tipo === 'recoger' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'bg-white text-gray-500 border-gray-200'
                      }`}
                    >
                      <Store size={16}/> Recoger
                    </button>
                    <button 
                      onClick={() => setDatosCliente(d=>({...d, tipo: 'llevar'}))} 
                      disabled={!servicioDomicilio}
                      className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        !servicioDomicilio ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' : datosCliente.tipo === 'llevar' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'bg-white text-gray-500 border-gray-200'
                      }`}
                    >
                      <Bike size={16}/> A Domicilio
                    </button>
                  </div>
                  {!servicioDomicilio && (
                    <p className="text-[11px] text-gray-500 mt-2 bg-gray-50 border border-gray-100 rounded-xl p-2">
                      Este negocio no tiene servicio a domicilio activo por ahora.
                    </p>
                  )}
                </div>

                {/* Dirección para llevar */}
                {datosCliente.tipo === 'llevar' && (
                  <div className="space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">Dirección de entrega *</label>
                      <textarea 
                        rows={2} 
                        value={datosCliente.direccion} 
                        onChange={e => setDatosCliente(d => ({ ...d, direccion: e.target.value }))}
                        placeholder="Calle, número, colonia..." 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">Referencias (Ej. Portón café, cruzando OXXO)</label>
                      <input 
                        type="text" 
                        value={datosCliente.referencias} 
                        onChange={e => setDatosCliente(d => ({ ...d, referencias: e.target.value }))}
                        placeholder="Color de casa, etc..." 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-emerald-600"
                      />
                    </div>

                    {modoEnvio === 'km' && (
                      <div>
                        <label className="block font-bold text-gray-600 mb-1">Kilómetros aproximados *</label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={datosCliente.km}
                          onChange={e => setDatosCliente(d => ({ ...d, km: e.target.value }))}
                          placeholder="Ej. 3.5"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-emerald-600"
                        />
                        <p className="text-gray-500 mt-1">Se cobra por km completo: {kmEstimados ? `${Math.ceil(kmEstimados)} km x $${costoPorKm} = $${costoEnvio}` : `$${costoPorKm}/km`}.</p>
                      </div>
                    )}

                    {modoEnvio === 'pendiente' && (
                      <p className="bg-amber-50 border border-amber-100 text-amber-700 rounded-lg p-2 font-bold">
                        El subtotal no incluye costo de envío. El negocio te confirmará el envío por WhatsApp.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Total e inicio de pedido */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex justify-between items-center mb-4 text-sm font-bold">
                <span className="text-gray-500">{costoEnvioPendiente ? 'Subtotal:' : 'Total a pagar:'}</span>
                <span className="text-emerald-600 text-xl font-black">{costoEnvioPendiente ? `$${subtotal}` : `$${totalConEnvio}`}</span>
              </div>
              {costoEnvioPendiente && (
                <p className="text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-2 text-xs font-bold mb-3">
                  No incluye costo de envío. El negocio lo confirmará después de recibir tu pedido.
                </p>
              )}
              <button 
                onClick={enviarPedido} 
                disabled={!datosCliente.nombre || !datosCliente.whatsapp || (datosCliente.tipo === 'llevar' && (!datosCliente.direccion.trim() || (modoEnvio === 'km' && !kmEstimados)))} 
                className="w-full bg-emerald-600 text-white font-black py-3.5 rounded-xl disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
              >
                Confirmar y Pedir por WhatsApp ✓
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
