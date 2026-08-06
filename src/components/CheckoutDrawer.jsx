import { useState, useMemo, useEffect } from 'react'
import { X, CheckCircle, Store, Bike, Search, Send, Clock, AlertCircle, Copy, Check } from 'lucide-react'
import { buscarPorCP, verificarCobertura } from '../data/sepomexTuxtla'
import { recordPublicOrder, updateOrderStatus, normalizeMexicanPhone } from '../services/crmV3Service'

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
  const [paso, setPaso] = useState(1) // 1: Entrega, 2: Datos, 3: Pago y Resumen
  const [datosCliente, setDatosCliente] = useState({ 
    nombre: '', 
    whatsapp: '', 
    tipo: 'recoger', 
    formaPago: 'efectivo', 
    necesitaCambio: 'no', // 'no' | 'si'
    pagaraCon: '',
    cp: '',
    estado: 'Chiapas',
    municipio: 'Tuxtla Gutiérrez',
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedClabe, setCopiedClabe] = useState(false)
  // SEPOMEX & Zonas
  const [coloniasDisponibles, setColoniasDisponibles] = useState([])
  const [cobertura, setCobertura] = useState({ cubierto: true, precioEnvio: 0 })

  // Zonas configuradas por el propietario
  const zonasConfiguradas = useMemo(() => {
    return (config.envio?.zonas || []).filter(z => z.is_active !== false)
  }, [config.envio?.zonas])

  // Métodos de pago del negocio
  const paymentMethodsConfig = useMemo(() => {
    return config.payment_methods || {
      efectivo: { activo: config.formasPago?.efectivo !== false, preguntar_cambio: true },
      transferencia: { activo: !!config.formasPago?.transferencia, titular: '', banco: '', clabe: '', numero_cuenta: '' },
      tarjeta: { activo: !!config.formasPago?.tarjeta, instrucciones: 'Llevamos terminal física al momento de la entrega.' }
    }
  }, [config.payment_methods, config.formasPago])

  // Cargar colonias disponibles (sin exigir CP inicial)
  useEffect(() => {
    if (zonasConfiguradas.length > 0) {
      // Usar estrictamente las colonias configuradas por el restaurante
      const coloniasZonas = Array.from(new Set(zonasConfiguradas.map(z => z.settlement_name || z.colonia).filter(Boolean)))
      setColoniasDisponibles(coloniasZonas)

      if (coloniasZonas.length > 0 && (!datosCliente.colonia || !coloniasZonas.includes(datosCliente.colonia))) {
        const colInicial = coloniasZonas[0]
        const zMatch = zonasConfiguradas.find(z => (z.settlement_name || z.colonia) === colInicial)
        setDatosCliente(d => ({
          ...d,
          colonia: colInicial,
          cp: zMatch?.postal_code || zMatch?.cp || d.cp,
          estado: 'Chiapas',
          municipio: 'Tuxtla Gutiérrez'
        }))
      }
    }
  }, [zonasConfiguradas])

  // Revalidar cobertura al cambiar colonia
  useEffect(() => {
    const zonas = config.envio?.zonas || []
    if (datosCliente.colonia || zonas.length > 0) {
      const cob = verificarCobertura(datosCliente.cp, datosCliente.colonia, zonas)
      setCobertura(cob)
    } else {
      setCobertura({ cubierto: true, precioEnvio: 0 })
    }
  }, [datosCliente.colonia, datosCliente.cp])

  // Ajustar formaPago por defecto si la seleccionada no está activa
  useEffect(() => {
    if (datosCliente.formaPago === 'efectivo' && paymentMethodsConfig.efectivo?.activo === false) {
      if (paymentMethodsConfig.transferencia?.activo) setDatosCliente(d => ({ ...d, formaPago: 'transferencia' }))
      else if (paymentMethodsConfig.tarjeta?.activo) setDatosCliente(d => ({ ...d, formaPago: 'tarjeta' }))
    }
  }, [paymentMethodsConfig, datosCliente.formaPago])

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

  const costoEnvio = datosCliente.tipo === 'llevar'
    ? (cobertura.precioEnvio || config.envio?.costoEnvio || 0)
    : 0
  const total = subtotal + costoEnvio

  const handleCopyClabe = (clabeText) => {
    if (!clabeText) return
    navigator.clipboard.writeText(clabeText)
    setCopiedClabe(true)
    setTimeout(() => setCopiedClabe(false), 2500)
  }

  const enviarPedido = async () => {
    if (isSubmitting) return
    if (!datosCliente.nombre.trim() || !datosCliente.whatsapp.trim()) return alert('Nombre y WhatsApp son obligatorios.')
    if (itemsCarrito.length === 0) return alert('El carrito está vacío.')

    if (datosCliente.tipo === 'llevar') {
      if (!datosCliente.calle.trim() || !datosCliente.numero.trim() || !datosCliente.colonia.trim()) {
        return alert('Por favor ingresa tu colonia, calle y número para la entrega.')
      }
    }

    setIsSubmitting(true)
    const folio = generarFolio()
    const esLlevar = datosCliente.tipo === 'llevar'
    const nowFormatted = new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })

    let msg = `🍔 *NUEVO PEDIDO: ${config.negocio || 'StreetBoss'}*\n`
    msg += `📋 *Folio:* ${folio}\n`
    msg += `📅 *Fecha:* ${nowFormatted}\n\n`
    msg += `*CLIENTE:*\n👤 ${datosCliente.nombre.trim()}\n📱 ${datosCliente.whatsapp.trim()}\n\n`
    
    if (esLlevar) {
      msg += `*ENTREGA:* 🛵 Envío a Domicilio\n`
      msg += `📍 Colonia ${datosCliente.colonia.trim()}, ${datosCliente.calle.trim()} #${datosCliente.numero.trim()}`
      if (datosCliente.interior) msg += `, Int ${datosCliente.interior.trim()}`
      msg += `.\n`
      if (datosCliente.entreCalles) msg += `🛣 *Entre:* ${datosCliente.entreCalles.trim()}\n`
      if (datosCliente.referencias) msg += `🔍 *Referencia:* ${datosCliente.referencias.trim()}\n`
    } else {
      msg += `*ENTREGA:* 🏪 Pasar a Recoger en Local\n`
    }

    msg += `\n*PEDIDO:*\n`
    itemsCarrito.forEach(p => {
      msg += `${p.cant}x ${p.nombre} — $${p.subtotal}\n`
    })

    if (datosCliente.observaciones) msg += `📝 *Nota:* ${datosCliente.observaciones.trim()}\n`

    msg += `\n*RESUMEN:*\n💰 Subtotal: $${subtotal}\n`
    if (esLlevar) msg += `🛵 Envío: $${costoEnvio === 0 ? 'GRATIS' : `$${costoEnvio}`}\n`
    msg += `✅ *TOTAL: $${total}*\n\n`
    
    if (datosCliente.formaPago === 'efectivo') {
      msg += `💵 *MÉTODOS DE PAGO:* Efectivo\n`
      if (datosCliente.necesitaCambio === 'si' && datosCliente.pagaraCon) {
        const pagaraMonto = Number(datosCliente.pagaraCon)
        const cambioCalculado = pagaraMonto > total ? (pagaraMonto - total) : 0
        msg += `💵 *Pagaré con:* $${pagaraMonto} (Cambio estimado: $${cambioCalculado})\n`
      } else {
        msg += `💵 *Pago:* Cantidad exacta (Sin cambio)\n`
      }
    } else if (datosCliente.formaPago === 'transferencia') {
      const bankInfo = paymentMethodsConfig.transferencia
      msg += `📲 *MÉTODOS DE PAGO:* Transferencia bancaria\n`
      if (bankInfo?.banco || bankInfo?.clabe) {
        msg += `🏦 Banco: ${bankInfo.banco || 'N/A'} | CLABE: ${bankInfo.clabe || 'N/A'}\n`
      }
      msg += `📌 *Comprobante:* El cliente adjuntará el comprobante de transferencia en WhatsApp.\n`
    } else if (datosCliente.formaPago === 'tarjeta') {
      msg += `💳 *MÉTODOS DE PAGO:* Tarjeta al recibir\n`
      msg += `💳 *Llevar terminal:* Sí\n`
    }

    if (datosCliente.formaPago === 'transferencia') {
      msg += `\n📎 Adjunto comprobante de transferencia.`
    }

    // 1. GUARDAR PEDIDO Y CLIENTE EN BD ANTES DE ABRIR WHATSAPP
    let savedOrderResult = null
    try {
      savedOrderResult = recordPublicOrder({
        business_id: config.business_id || config.id || config.trialId || 'tacos-el-guero',
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
        payment_method: datosCliente.formaPago,
        cash_needs_change: datosCliente.necesitaCambio === 'si',
        cash_pay_with: datosCliente.pagaraCon,
        has_terminal: datosCliente.formaPago === 'tarjeta',
        promo_consent: promoConsent,
        whatsapp_message: msg,
        status: 'pendiente_envio',
        whatsapp_status: 'pendiente_envio'
      })
    } catch (err) {
      console.warn('Error guardando pedido público:', err)
    }

    // 2. CONSTRUIR ENLACE INTERNACIONAL WHATSAPP FORMATO MÉXICO (52 + 10 DÍGITOS)
    const targetWhatsAppClean = normalizeMexicanPhone(config.whatsapp || config.telefono || '9612466204')
    const whatsappUrl = `https://wa.me/52${targetWhatsAppClean}?text=${encodeURIComponent(msg)}`

    // 3. ABRIR WHATSAPP Y ACTUALIZAR ESTADO A ENVIADO_WA
    let openSuccess = false
    try {
      const win = window.open(whatsappUrl, '_blank')
      if (win) {
        openSuccess = true
        if (savedOrderResult?.order?.id) {
          updateOrderStatus(savedOrderResult.order.id, 'enviado_wa', { whatsapp_status: 'enviado_wa' })
        }
      }
    } catch (e) {
      console.warn('No se pudo abrir automáticamente el popup de WhatsApp:', e)
    }

    // 4. BLOQUEAR MODIFICACIONES DEL PEDIDO, VACIAR CARRITO Y MOSTRAR CONFIRMACIÓN
    onClearCarrito()
    setPedidoConfirmado({ 
      folio: savedOrderResult?.order?.order_number || folio, 
      subtotal, 
      costoEnvio, 
      total, 
      itemsCarrito, 
      cliente: datosCliente,
      status: openSuccess ? 'enviado_wa' : 'pendiente_envio',
      whatsappUrl
    })
    setIsSubmitting(false)
  }

  if (!isOpen && !pedidoConfirmado) return null

  if (pedidoConfirmado) {
    const { folio, subtotal, costoEnvio, total, itemsCarrito, cliente, status, whatsappUrl } = pedidoConfirmado
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 max-w-sm w-full text-center space-y-4 animate-in zoom-in-95 duration-200">
          <CheckCircle size={64} className="text-emerald-500 mx-auto" />
          
          <div>
            <h2 className="text-gray-900 font-black text-xl">¡Pedido Registrado con Éxito!</h2>
            <p className="text-xs text-gray-500 mt-1">El pedido quedó guardado de forma segura en nuestro sistema.</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Folio Oficial</span>
              <span className="font-mono font-black text-sm text-gray-900">{folio}</span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-gray-200">
              <span className="text-xs text-gray-600 font-medium">Estado del Envío:</span>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                status === 'enviado_wa' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {status === 'enviado_wa' ? 'Enviado por WhatsApp ✅' : 'Pendiente de envío ⏳'}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 space-y-1.5 text-xs">
            <span className="font-bold text-gray-900 block mb-1">Resumen del consumo:</span>
            {itemsCarrito.map(p => (
              <div key={p.id} className="flex justify-between text-gray-600">
                <span>{p.cant}x {p.nombre}</span>
                <span className="font-bold text-gray-900">${p.subtotal}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2 font-black text-sm text-gray-900">
              <span>Total</span>
              <span style={{ color: config.colorMarca || '#ff4b16' }}>${total}</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition-all active:scale-95"
              >
                <Send size={14} /> Abrir / Reenviar en WhatsApp
              </a>
            )}

            <button 
              onClick={() => { 
                setPedidoConfirmado(null); 
                setPaso(1);
                setDatosCliente({ 
                  nombre: '', whatsapp: '', tipo: 'recoger', formaPago: 'efectivo', 
                  necesitaCambio: 'no', pagaraCon: '', cp: '', estado: 'Chiapas', municipio: 'Tuxtla Gutiérrez', 
                  colonia: '', calle: '', numero: '', interior: '', entreCalles: '', referencias: '', observaciones: '' 
                });
                onClose(); 
              }} 
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl text-xs active:scale-95 transition-transform"
            >
              Volver al Menú Principal
            </button>
          </div>
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
          
          {/* PASO 1: TIPO DE ENTREGA Y SELECCIÓN DE COLONIA */}
          {paso === 1 && (
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
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl text-xs text-blue-800 flex items-start gap-2.5">
                      <span className="mt-0.5">ℹ️</span>
                      <p className="leading-relaxed">Selecciona tu colonia para calcular automáticamente la cobertura y costo de envío.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Colonia de entrega *</label>
                      {coloniasDisponibles.length > 0 ? (
                        <select
                          value={datosCliente.colonia}
                          onChange={e => {
                            const colSel = e.target.value
                            const zFound = zonasConfiguradas.find(z => (z.settlement_name || z.colonia) === colSel)
                            setDatosCliente(d => ({
                              ...d,
                              colonia: colSel,
                              cp: zFound?.postal_code || zFound?.cp || d.cp
                            }))
                          }}
                          className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 shadow-sm"
                        >
                          <option value="">-- Selecciona tu colonia --</option>
                          {coloniasDisponibles.map(col => (
                            <option key={col} value={col} className="bg-white text-gray-900 font-medium">{col}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={datosCliente.colonia}
                          onChange={e => setDatosCliente(d => ({ ...d, colonia: e.target.value }))}
                          className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 shadow-sm"
                          placeholder="Tu colonia"
                        />
                      )}
                    </div>

                    {/* Mensaje de cobertura y tarifa */}
                    {datosCliente.colonia && config.envio?.zonas?.length > 0 && (
                      <div className={`rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 ${
                        cobertura.cubierto
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {cobertura.cubierto ? (
                          <><span>✅</span> Cobertura disponible · <span className="font-black">${cobertura.precioEnvio === 0 ? 'GRATIS' : `$${cobertura.precioEnvio} de envío`}</span></>
                        ) : (
                          <><span>❌</span> Este negocio todavía no tiene reparto disponible en tu colonia.</>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Calle *</label>
                        <input type="text" value={datosCliente.calle} onChange={e=>setDatosCliente(d=>({...d, calle: e.target.value}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm" placeholder="Ej. Av. Central Norte" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">No. Ext *</label>
                        <input type="text" value={datosCliente.numero} onChange={e=>setDatosCliente(d=>({...d, numero: e.target.value}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm" placeholder="Ej. 123" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Interior (Opcional)</label>
                        <input type="text" value={datosCliente.interior} onChange={e=>setDatosCliente(d=>({...d, interior: e.target.value}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm" placeholder="Depto / Int 2" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Código Postal (Opcional)</label>
                        <input type="text" maxLength={5} value={datosCliente.cp} onChange={e=>setDatosCliente(d=>({...d, cp: e.target.value.replace(/\D/g,'')}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm" placeholder="Ej. 29000" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Entre calles y Referencias (Opcional)</label>
                      <textarea rows={2} value={datosCliente.referencias} onChange={e=>setDatosCliente(d=>({...d, referencias: e.target.value}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm resize-none" placeholder="Ej. Entre 1ra y 2da Norte. Portón azul junto a la farmacia." />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 2: DATOS DEL CLIENTE */}
          {paso === 2 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Tus datos de contacto</h4>
                <p className="text-sm text-gray-500 mb-4">Ingresa quién recibe el pedido</p>
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
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Número de WhatsApp (10 dígitos) *</label>
                    <input 
                      type="tel" 
                      maxLength={10}
                      value={datosCliente.whatsapp} 
                      onChange={e=>setDatosCliente(d=>({...d, whatsapp: e.target.value.replace(/\D/g,'')}))} 
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm font-mono" 
                      placeholder="Ej. 9611234567" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: MÉTODOS DE PAGO & RESUMEN & DETALLES */}
          {paso === 3 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Método de pago</h4>
                <p className="text-sm text-gray-500 mb-4">Selecciona cómo vas a pagar</p>

                <div className="grid grid-cols-1 gap-2 mb-6">
                  {/* Opción 1: EFECTIVO */}
                  {paymentMethodsConfig.efectivo?.activo !== false && (
                    <div className="space-y-2">
                      <label className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${datosCliente.formaPago === 'efectivo' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                        <input type="radio" name="pago" checked={datosCliente.formaPago === 'efectivo'} onChange={() => setDatosCliente(d=>({...d, formaPago: 'efectivo'}))} className="w-4 h-4 text-gray-900 focus:ring-gray-900" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">💵 Efectivo</p>
                          <p className="text-xs text-gray-500">Pagas al recibir o recoger tu pedido</p>
                        </div>
                      </label>

                      {datosCliente.formaPago === 'efectivo' && paymentMethodsConfig.efectivo?.preguntar_cambio !== false && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 text-xs animate-in fade-in">
                          <label className="block font-bold text-gray-800">¿Necesitas cambio?</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="cambio"
                                checked={datosCliente.necesitaCambio === 'no'}
                                onChange={() => setDatosCliente(d => ({ ...d, necesitaCambio: 'no', pagaraCon: '' }))}
                                className="text-orange-600"
                              />
                              <span className="text-gray-700 font-medium">No, pago exacto</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="cambio"
                                checked={datosCliente.necesitaCambio === 'si'}
                                onChange={() => setDatosCliente(d => ({ ...d, necesitaCambio: 'si' }))}
                                className="text-orange-600"
                              />
                              <span className="text-gray-700 font-medium">Sí, necesito cambio</span>
                            </label>
                          </div>

                          {datosCliente.necesitaCambio === 'si' && (
                            <div>
                              <label className="block text-gray-600 font-bold mb-1">¿Con cuánto vas a pagar? ($ MXN)</label>
                              <input
                                type="number"
                                placeholder={`Ej. ${Math.ceil(total / 100) * 100 || 500}`}
                                value={datosCliente.pagaraCon}
                                onChange={e => setDatosCliente(d => ({ ...d, pagaraCon: e.target.value }))}
                                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm font-bold font-mono text-emerald-600"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Opción 2: TRANSFERENCIA BANCARIA */}
                  {paymentMethodsConfig.transferencia?.activo && (
                    <div className="space-y-2">
                      <label className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${datosCliente.formaPago === 'transferencia' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                        <input type="radio" name="pago" checked={datosCliente.formaPago === 'transferencia'} onChange={() => setDatosCliente(d=>({...d, formaPago: 'transferencia'}))} className="w-4 h-4 text-gray-900 focus:ring-gray-900" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">📲 Transferencia Bancaria</p>
                          <p className="text-xs text-gray-500">Datos bancarios listos para copiar</p>
                        </div>
                      </label>

                      {datosCliente.formaPago === 'transferencia' && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 text-xs animate-in fade-in">
                          <p className="font-bold text-gray-800">Datos para transferencia:</p>
                          
                          {paymentMethodsConfig.transferencia.banco && (
                            <p className="text-gray-600">Banco: <span className="font-bold text-gray-900">{paymentMethodsConfig.transferencia.banco}</span></p>
                          )}
                          {paymentMethodsConfig.transferencia.titular && (
                            <p className="text-gray-600">Titular: <span className="font-bold text-gray-900">{paymentMethodsConfig.transferencia.titular}</span></p>
                          )}

                          {paymentMethodsConfig.transferencia.clabe && (
                            <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-mono">
                              <div>
                                <span className="text-[10px] text-gray-400 block uppercase font-sans font-bold">CLABE Interbancaria</span>
                                <span className="font-bold text-gray-900 text-xs">{paymentMethodsConfig.transferencia.clabe}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyClabe(paymentMethodsConfig.transferencia.clabe)}
                                className="flex items-center gap-1 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white px-3 py-1.5 rounded-lg font-sans font-bold text-xs shadow-sm"
                              >
                                {copiedClabe ? <Check size={14} /> : <Copy size={14} />} {copiedClabe ? '¡Copiada!' : 'COPIAR'}
                              </button>
                            </div>
                          )}

                          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-800 text-[11px]">
                            <p className="font-bold">⚠️ Aviso Importante:</p>
                            <p className="mt-0.5">{paymentMethodsConfig.transferencia.texto_solicitar_comprobante || 'Realiza tu transferencia y adjunta el comprobante cuando envíes tu pedido por WhatsApp.'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Opción 3: TARJETA AL RECIBIR */}
                  {paymentMethodsConfig.tarjeta?.activo && (
                    <div className="space-y-2">
                      <label className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${datosCliente.formaPago === 'tarjeta' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                        <input type="radio" name="pago" checked={datosCliente.formaPago === 'tarjeta'} onChange={() => setDatosCliente(d=>({...d, formaPago: 'tarjeta'}))} className="w-4 h-4 text-gray-900 focus:ring-gray-900" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">💳 Tarjeta / Terminal al recibir</p>
                          <p className="text-xs text-gray-500">El repartidor o cajero llevará terminal física</p>
                        </div>
                      </label>

                      {datosCliente.formaPago === 'tarjeta' && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1.5 text-xs text-gray-700 animate-in fade-in">
                          <p className="font-bold text-gray-900">💳 Pago con tarjeta al recibir:</p>
                          <p className="text-gray-600">{paymentMethodsConfig.tarjeta.instrucciones || 'Se aceptan tarjetas de crédito y débito. El pago se realiza al momento de la entrega.'}</p>
                        </div>
                      )}
                    </div>
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

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Observaciones o Instrucciones Especiales (Opcional)</label>
                  <textarea rows={2} value={datosCliente.observaciones} onChange={e=>setDatosCliente(d=>({...d, observaciones: e.target.value}))} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder-gray-400 focus:border-orange-500 shadow-sm resize-none" placeholder="Ej. Sin cebolla, extra picante, timbre no funciona..." />
                </div>

                {/* Resumen Final de Productos */}
                <h5 className="font-bold text-gray-900 text-sm mb-2">Resumen final del pedido</h5>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4 mb-6 shadow-sm">
                  <div className="space-y-2">
                    {itemsCarrito.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{item.cant}x</span>
                          <span className="text-gray-700">{item.nombre}</span>
                        </div>
                        <span className="font-bold text-gray-900">${item.subtotal}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs font-medium">
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
                      <span>Total a pagar</span>
                      <span style={{ color: config.colorMarca || '#ff4b16' }}>${total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.03)] shrink-0 flex gap-3">
          {paso > 1 && (
            <button onClick={() => setPaso(p => p - 1)} disabled={isSubmitting} className="px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50">
              Atrás
            </button>
          )}
          
          {paso < 3 ? (
            <button 
              onClick={() => {
                if(paso === 1 && datosCliente.tipo === 'llevar') {
                  if (!datosCliente.colonia.trim() || !datosCliente.calle.trim() || !datosCliente.numero.trim()) {
                    return alert('Por favor completa tu Colonia, Calle y Número de casa.')
                  }
                  if (config.envio?.zonas?.length > 0 && !cobertura.cubierto) {
                    return alert('Este negocio todavía no tiene reparto disponible en tu colonia.')
                  }
                }
                if(paso === 2 && (!datosCliente.nombre.trim() || datosCliente.whatsapp.length < 10)) {
                  return alert('Revisa que tu nombre y WhatsApp (10 dígitos) estén completos.')
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
              disabled={isSubmitting}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl active:scale-95 transition-transform shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Guardando Pedido...' : 'Confirmar Pedido ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
