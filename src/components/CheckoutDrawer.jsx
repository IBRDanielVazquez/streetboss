import { useState, useMemo, useEffect } from 'react'
import { X, CheckCircle, Store, Bike, Search } from 'lucide-react'
import { buscarPorCP, verificarCobertura } from '../data/sepomexTuxtla'
import { recordPublicOrder } from '../services/crmV3Service'

// Genera folio único tipo SB-AXKF-7821
const generarFolio = () => {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const rand4 = Array.from({ length: 4 }, () => letras[Math.floor(Math.random() * letras.length)]).join('')
  const ts = Date.now().toString().slice(-4)
  return `SB-${rand4}-${ts}`
}

export default function CheckoutDrawer({ 
  isOpen, 
  onClose, 
  carrito, 
  productosPorId,
  config, 
  onClearCarrito,
  onUpdateCartItem 
}) {
  const [paso, setPaso] = useState(1) // 1: Datos, 2: Entrega, 3: Resumen/Pago
  const [datosCliente, setDatosCliente] = useState({ 
    nombre: '', 
    whatsapp: '', 
    tipo: 'recoger', 
    formaPago: 'efectivo', 
    cp: '',
    estado: '',
    municipio: '',
    colonia: '',
    calle: '',
    numero: '',
    interior: '',
    entreCalles: '',
    referencias: '',
    observaciones: ''
  })
  const [promoConsent, setPromoConsent] = useState(false)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null)
  // SEPOMEX
  const [coloniasDisponibles, setColoniasDisponibles] = useState([])
  const [buscandoCP, setBuscandoCP] = useState(false)
  const [cobertura, setCobertura] = useState({ cubierto: true, precioEnvio: 0 })

  // Autocompletar con SEPOMEX cuando el CP tiene 5 dígitos
  useEffect(() => {
    if (datosCliente.cp.length !== 5) {
      setColoniasDisponibles([])
      setDatosCliente(d => ({ ...d, estado: '', municipio: '', colonia: '' }))
      setCobertura({ cubierto: true, precioEnvio: 0 })
      return
    }
    setBuscandoCP(true)
    buscarPorCP(datosCliente.cp).then(resultado => {
      if (resultado && resultado.length > 0) {
        const coloniasFiltradas = resultado.map(item => item.colonia)
        setColoniasDisponibles(coloniasFiltradas)
        const colInicial = coloniasFiltradas[0] || ''
        setDatosCliente(d => ({ ...d, estado: resultado[0]?.estado || 'Chiapas', municipio: resultado[0]?.municipio || 'Tuxtla Gutiérrez', colonia: colInicial }))
        
        const zonas = config.envio?.zonas || []
        const cob = verificarCobertura(datosCliente.cp, colInicial, zonas)
        setCobertura(cob)
      } else {
        setColoniasDisponibles([])
        setDatosCliente(d => ({ ...d, estado: 'CP no encontrado', municipio: '', colonia: '' }))
      }
      setBuscandoCP(false)
    })
  }, [datosCliente.cp])

  // Revalidar cobertura al cambiar colonia
  useEffect(() => {
    const zonas = config.envio?.zonas || []
    if (datosCliente.cp.length === 5) {
      const cob = verificarCobertura(datosCliente.cp, datosCliente.colonia, zonas)
      setCobertura(cob)
    } else {
      setCobertura({ cubierto: true, precioEnvio: 0 })
    }
  }, [datosCliente.colonia, datosCliente.cp])

  // Cálculos O(1) usando el diccionario memoizado
  const { subtotal, itemsCarrito } = useMemo(() => {
    let sub = 0
    const items = []
    Object.entries(carrito).forEach(([id, cant]) => {
      const p = productosPorId[id]
      if (p && p.activo && !p.agotado && !p.is_out_of_stock) {
        sub += p.precio * cant
        items.push({ ...p, cant, subtotal: p.precio * cant })
      }
    })
    return { subtotal: sub, itemsCarrito: items }
  }, [carrito, productosPorId])

  // Si hay zonas configuradas, usar el precio de cobertura; si no, usar el costo fijo del config
  const costoEnvio = datosCliente.tipo === 'llevar'
    ? (cobertura.precioEnvio || config.envio?.costoEnvio || 0)
    : 0
  const total = subtotal + costoEnvio

  const enviarPedido = () => {
    if (!datosCliente.nombre.trim() || !datosCliente.whatsapp.trim()) return alert('Nombre y WhatsApp son obligatorios.')
    if (itemsCarrito.length === 0) return alert('El carrito está vacío.')

    if (datosCliente.tipo === 'llevar') {
      if (!datosCliente.calle.trim() || !datosCliente.numero.trim()) {
        return alert('Por favor ingresa tu calle y número para la entrega.')
      }
    }

    const folio = generarFolio()
    const esLlevar = datosCliente.tipo === 'llevar'

    let msg = `🍔 *NUEVO PEDIDO: ${config.negocio || 'StreetBoss'}*\n`
    msg += `📋 *Folio:* ${folio}\n\n`
    msg += `*CLIENTE:*\n👤 ${datosCliente.nombre.trim()}\n📱 ${datosCliente.whatsapp.trim()}\n\n`
    
    if (esLlevar) {
      msg += `*ENTREGA:* 🛵 Envío a Domicilio\n`
      msg += `📍 ${datosCliente.calle.trim()} #${datosCliente.numero.trim()}`
      if (datosCliente.interior) msg += `, Int ${datosCliente.interior.trim()}`
      msg += `.\n`
      if (datosCliente.colonia) msg += `Colonia ${datosCliente.colonia.trim()}`
      if (datosCliente.cp) msg += `, CP ${datosCliente.cp}`
      msg += `.\n`
      
      if (datosCliente.entreCalles) msg += `🛣 *Entre:* ${datosCliente.entreCalles.trim()}\n`
      if (datosCliente.referencias) msg += `🔍 *Referencia:* ${datosCliente.referencias.trim()}\n`
    } else {
      msg += `*ENTREGA:* 🏪 Pasar a Recoger\n`
    }

    msg += `\n*PEDIDO:*\n`
    itemsCarrito.forEach(p => {
      msg += `${p.cant}x ${p.nombre} — $${p.subtotal}\n`
    })

    if (datosCliente.observaciones) msg += `📝 *Nota:* ${datosCliente.observaciones.trim()}\n`

    msg += `\n*RESUMEN:*\n💰 Subtotal: $${subtotal}\n`
    if (esLlevar) msg += `🛵 Envío: $${costoEnvio === 0 ? 'GRATIS' : `$${costoEnvio}`}\n`
    msg += `✅ *TOTAL: $${total}*\n`
    
    const pagoL = datosCliente.formaPago === 'efectivo' ? 'Efectivo (Paga al recibir)' : 
                 datosCliente.formaPago === 'tarjeta' ? 'Tarjeta (Paga con terminal)' : 'Transferencia'
    msg += `💵 Pago: ${pagoL}\n`
    
    if (datosCliente.formaPago === 'transferencia') msg += `\n📎 Adjunto comprobante de pago.`

    // REGISTRAR PEDIDO Y CLIENTE EN LA BASE CENTRAL ANTES DE ABRIR WHATSAPP
    try {
      recordPublicOrder({
        business_id: config.business_id || config.id || 'tacos-el-guero',
        business_name: config.negocio || config.nombre || 'Restaurante',
        customer_name: datosCliente.nombre.trim(),
        phone: datosCliente.whatsapp.trim(),
        whatsapp: datosCliente.whatsapp.trim(),
        colonia: datosCliente.colonia,
        postal_code: datosCliente.cp,
        address: `${datosCliente.calle} #${datosCliente.numero}`,
        items: itemsCarrito.map(i => ({ id: i.id, name: i.nombre, price: i.precio, qty: i.cant, subtotal: i.subtotal })),
        subtotal,
        delivery_fee: costoEnvio,
        total,
        delivery_type: datosCliente.tipo,
        promo_consent: promoConsent,
        whatsapp_message: msg,
      })
    } catch (err) {
      console.warn('Error guardando pedido público:', err)
    }

    window.open(`https://wa.me/52${config.whatsapp || '9612466204'}?text=${encodeURIComponent(msg)}`, '_blank')

    setPedidoConfirmado({ folio, subtotal, costoEnvio, total, itemsCarrito, cliente: datosCliente })
    onClearCarrito()
  }

  if (!isOpen && !pedidoConfirmado) return null

  if (pedidoConfirmado) {
    const { folio, subtotal, costoEnvio, total, itemsCarrito, cliente } = pedidoConfirmado
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAFAFA] p-6 font-sans">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm w-full">
          <CheckCircle size={72} className="text-green-500" />
          <h2 className="text-gray-900 font-black text-2xl">¡Pedido Confirmado!</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 w-full text-left">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Folio del Pedido</p>
            <span className="font-black text-3xl text-gray-900 tracking-widest block mb-4">{folio}</span>
            <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold inline-block mb-4">
              Estado: Recibido ✅
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-2">
              {itemsCarrito.map(p => (
                <div key={p.id} className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">{p.cant}x {p.nombre}</span>
                  <span className="font-bold text-gray-900">${p.subtotal}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                <span className="font-black text-lg">Total</span>
                <span className="font-black text-2xl" style={{ color: config.colorMarca || '#ff4b16' }}>${total}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">Te avisaremos por WhatsApp cuando esté listo.</p>
          <button 
            onClick={() => { setPedidoConfirmado(null); onClose(); }} 
            className="w-full mt-4 bg-gray-900 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform"
          >
            Volver al Menú
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white z-10 shrink-0">
          <div>
            <h3 className="font-black text-xl text-gray-900">Tu Pedido</h3>
            <p className="text-xs text-gray-500 font-medium">Paso {paso} de 3</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-100 h-1 shrink-0">
          <div className="bg-gray-900 h-full transition-all duration-300" style={{ width: `${(paso/3)*100}%`, backgroundColor: config.colorMarca || '#111' }} />
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          
          {paso === 1 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Tus datos</h4>
                <p className="text-sm text-gray-500 mb-4">Ingresa tu información de contacto</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Nombre Completo *</label>
                    <input 
                      type="text" 
                      value={datosCliente.nombre} 
                      onChange={e=>setDatosCliente(d=>({...d, nombre: e.target.value}))} 
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm" 
                      placeholder="Ej. Juan Pérez" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">WhatsApp (10 dígitos) *</label>
                    <input 
                      type="tel" 
                      maxLength={10}
                      value={datosCliente.whatsapp} 
                      onChange={e=>setDatosCliente(d=>({...d, whatsapp: e.target.value.replace(/\D/g,'')}))} 
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm" 
                      placeholder="Ej. 9611234567" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Método de entrega</h4>
                <p className="text-sm text-gray-500 mb-4">¿Cómo deseas recibir tu pedido?</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button onClick={() => setDatosCliente(d=>({...d, tipo: 'recoger'}))} className={`p-4 rounded-2xl border-2 font-bold text-sm flex flex-col items-center gap-2 transition-all ${datosCliente.tipo === 'recoger' ? 'border-gray-900 bg-gray-900 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <Store size={24} />
                    Recoger local
                  </button>
                  {config.envio?.activo && (
                    <button onClick={() => setDatosCliente(d=>({...d, tipo: 'llevar'}))} className={`p-4 rounded-2xl border-2 font-bold text-sm flex flex-col items-center gap-2 transition-all ${datosCliente.tipo === 'llevar' ? 'border-gray-900 bg-gray-900 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <Bike size={24} />
                      A domicilio
                    </button>
                  )}
                </div>

                {datosCliente.tipo === 'llevar' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl text-sm text-blue-800 flex items-start gap-3">
                      <span className="mt-0.5">ℹ️</span>
                      <p className="leading-relaxed">Ingresa tu Código Postal para autocompletar tu ubicación y agilizar la entrega.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Código Postal *</label>
                        <div className="relative">
                          <input type="text" maxLength={5} value={datosCliente.cp} onChange={e=>setDatosCliente(d=>({...d, cp: e.target.value.replace(/\D/g,'')}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm" placeholder="Ej. 29000" />
                          <Search size={16} className={`absolute left-3.5 top-3.5 ${buscandoCP ? 'text-orange-500 animate-spin' : 'text-gray-400'}`} />
                        </div>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Estado</label>
                        <input type="text" value={datosCliente.estado} readOnly className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 outline-none" placeholder="Automático" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Municipio</label>
                        <input type="text" value={datosCliente.municipio} readOnly className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 outline-none" placeholder="Automático" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Colonia *</label>
                        {coloniasDisponibles.length > 0 ? (
                          <select
                            value={datosCliente.colonia}
                            onChange={e => setDatosCliente(d => ({ ...d, colonia: e.target.value }))}
                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 shadow-sm"
                          >
                            {coloniasDisponibles.map(col => (
                              <option key={col} value={col} className="bg-white text-gray-900 font-medium">{col}</option>
                            ))}
                          </select>
                        ) : (
                          <input type="text" value={datosCliente.colonia} onChange={e=>setDatosCliente(d=>({...d, colonia: e.target.value}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm" placeholder="Tu colonia" />
                        )}
                      </div>
                    </div>

                    {/* Mensaje de cobertura */}
                    {datosCliente.cp.length === 5 && config.envio?.zonas?.length > 0 && (
                      <div className={`rounded-xl px-4 py-3 text-sm font-bold flex items-center gap-2 ${
                        cobertura.cubierto
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {cobertura.cubierto ? (
                          <><span>✅</span> Entregamos en tu zona · <span className="font-black">${cobertura.precioEnvio} de envío</span></>
                        ) : (
                          <><span>❌</span> Este negocio todavía no tiene reparto disponible en tu colonia.</>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-3 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Calle *</label>
                        <input type="text" value={datosCliente.calle} onChange={e=>setDatosCliente(d=>({...d, calle: e.target.value}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm" placeholder="Nombre de calle" />
                      </div>
                      <div className="col-span-1 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">No. Ext *</label>
                        <input type="text" value={datosCliente.numero} onChange={e=>setDatosCliente(d=>({...d, numero: e.target.value}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm" placeholder="Ej. 123" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Interior (Opc)</label>
                        <input type="text" value={datosCliente.interior} onChange={e=>setDatosCliente(d=>({...d, interior: e.target.value}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm" placeholder="Depto / Local" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Entre calles y Referencias visuales (Opcional)</label>
                      <textarea rows={2} value={datosCliente.referencias} onChange={e=>setDatosCliente(d=>({...d, referencias: e.target.value}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm resize-none" placeholder="Ej. Entre Av. Central y 1ra Sur. Portón negro frente al parque." />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-4">Resumen y Pago</h4>
                
                {/* Lista de productos minimizada */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                  <div className="space-y-3">
                    {itemsCarrito.map(p => (
                      <div key={p.id} className="flex justify-between items-center text-sm">
                        <div className="flex gap-3 items-center flex-1">
                          <span className="font-bold bg-gray-100 text-gray-600 w-6 h-6 rounded flex items-center justify-center text-xs">{p.cant}</span>
                          <span className="font-medium text-gray-900 truncate pr-2">{p.nombre}</span>
                        </div>
                        <span className="font-bold text-gray-900">${p.subtotal}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>${subtotal}</span>
                    </div>
                    {datosCliente.tipo === 'llevar' && (
                      <div className="flex justify-between text-gray-500">
                        <span>Envío estimado</span>
                        <span>${costoEnvio}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-lg text-gray-900 pt-2">
                      <span>Total</span>
                      <span style={{ color: config.colorMarca || '#ff4b16' }}>${total}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Observaciones (Opcional)</label>
                  <textarea rows={2} value={datosCliente.observaciones} onChange={e=>setDatosCliente(d=>({...d, observaciones: e.target.value}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm resize-none" placeholder="Ej. Sin cebolla, extra picante..." />
                </div>

                <h5 className="font-bold text-gray-900 text-sm mb-3">Método de pago</h5>
                <div className="grid grid-cols-1 gap-2">
                  {config.formasPago?.efectivo !== false && (
                    <label className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${datosCliente.formaPago === 'efectivo' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <input type="radio" name="pago" checked={datosCliente.formaPago === 'efectivo'} onChange={() => setDatosCliente(d=>({...d, formaPago: 'efectivo'}))} className="w-4 h-4 text-gray-900 focus:ring-gray-900" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">💵 Efectivo</p>
                        <p className="text-xs text-gray-500">Pagas al recibir tu pedido</p>
                      </div>
                    </label>
                  )}
                  {config.formasPago?.transferencia && (
                    <label className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${datosCliente.formaPago === 'transferencia' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <input type="radio" name="pago" checked={datosCliente.formaPago === 'transferencia'} onChange={() => setDatosCliente(d=>({...d, formaPago: 'transferencia'}))} className="w-4 h-4 text-gray-900 focus:ring-gray-900" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">📲 Transferencia</p>
                        <p className="text-xs text-gray-500">Se te enviarán los datos por WhatsApp</p>
                      </div>
                    </label>
                  )}
                  {config.formasPago?.tarjeta && (
                    <label className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${datosCliente.formaPago === 'tarjeta' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <input type="radio" name="pago" checked={datosCliente.formaPago === 'tarjeta'} onChange={() => setDatosCliente(d=>({...d, formaPago: 'tarjeta'}))} className="w-4 h-4 text-gray-900 focus:ring-gray-900" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">💳 Tarjeta / Terminal</p>
                        <p className="text-xs text-gray-500">El repartidor llevará terminal</p>
                      </div>
                    </label>
                  )}

                {/* Casilla de Consentimiento Promocional Opcional */}
                <div className="mt-4 p-3 bg-[#FAFAFA] border border-gray-200 rounded-xl">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-700 font-medium">
                    <input
                      type="checkbox"
                      checked={promoConsent}
                      onChange={e => setPromoConsent(e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-orange-600 focus:ring-0"
                    />
                    <span>Quiero recibir promociones y novedades de este negocio por WhatsApp.</span>
                  </label>
                </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.03)] shrink-0 flex gap-3">
          {paso > 1 && (
            <button onClick={() => setPaso(p => p - 1)} className="px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform">
              Atrás
            </button>
          )}
          
          {paso < 3 ? (
            <button 
              onClick={() => {
                if(paso === 1 && (!datosCliente.nombre.trim() || datosCliente.whatsapp.length < 10)) {
                  return alert('Revisa que tu nombre y WhatsApp (10 dígitos) estén completos.')
                }
                if(paso === 2 && datosCliente.tipo === 'llevar') {
                  if (!datosCliente.calle.trim() || !datosCliente.numero.trim() || !datosCliente.colonia.trim() || datosCliente.cp.length < 5) {
                    return alert('Revisa que el Código Postal, Colonia, Calle y Número estén completos para poder enviar tu pedido.')
                  }
                  if (config.envio?.zonas?.length > 0 && !cobertura.cubierto) {
                    return alert('Este negocio todavía no tiene reparto disponible en tu colonia.')
                  }
                }
                setPaso(p => p + 1)
              }} 
              className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform"
              style={{ backgroundColor: config.colorMarca || '#111' }}
            >
              Continuar
            </button>
          ) : (
            <button 
              onClick={enviarPedido} 
              className="flex-1 bg-green-500 text-white font-black py-4 rounded-xl active:scale-95 transition-transform shadow-lg shadow-green-500/20"
            >
              Confirmar Pedido ✓
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
