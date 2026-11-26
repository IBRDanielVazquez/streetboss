import { useMemo, useState } from 'react'
import { Bike, Store, X, Send } from 'lucide-react'
import { formatLaVitolaOrder } from '../../utils/formatLaVitolaOrder'

// Checkout específico: el restaurante confirma por WhatsApp el costo de reparto.
// No se inventan tarifas de entrega ni formas de pago.
export default function LaVitolaCheckoutDrawer({
  isOpen, onClose, carrito, productosPorId, config, onClearCarrito,
}) {
  const [delivery, setDelivery] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [selectedColonia, setSelectedColonia] = useState('')
  const [references, setReferences] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [savingRequest, setSavingRequest] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [totalConfirmado, setTotalConfirmado] = useState(false)
  const pagoTransferencia = config.pagos?.transferencia || {}
  const pagoTarjeta = config.pagos?.tarjeta || {}
  const pagosDisponibles = pagoTransferencia.activo || pagoTarjeta.activo

  const items = useMemo(() => Object.entries(carrito)
    .map(([id, qty]) => ({ product: productosPorId[id], qty }))
    .filter(item => item.product && item.qty > 0), [carrito, productosPorId])
  const total = items.reduce((sum, item) => sum + Number(item.product.precio) * item.qty, 0)
  const zonas = (config.envio?.zonas || []).filter(zone => zone && zone.nombre).map(zone => ({ nombre: zone.nombre, costo: zone.costo == null || zone.costo === '' ? null : Number(zone.costo) }))
  const zonaActual = zonas.find(zone => zone.nombre === selectedColonia)
  const deliveryFee = delivery && zonaActual && Number.isFinite(zonaActual.costo) && zonaActual.costo >= 0 ? zonaActual.costo : null
  const totalConEnvio = delivery && deliveryFee !== null ? total + deliveryFee : total

  if (!isOpen) return null

  const submit = async event => {
    event.preventDefault()
    if (savingRequest) return
    const cleanPhone = phone.replace(/\D/g, '')
    const whatsapp = (config.whatsapp || '').replace(/\D/g, '')
    if (!name.trim() || cleanPhone.length !== 10) {
      setError('Escribe tu nombre y WhatsApp de 10 dígitos.')
      return
    }
    if (delivery && zonas.length && !zonaActual) {
      setError('Selecciona una colonia de la lista para calcular el envío.')
      return
    }
    if (delivery && !address.trim()) {
      setError('Escribe tu dirección para el envío.')
      return
    }
    if (!/^\d{12,13}$/.test(whatsapp)) {
      setError('El WhatsApp del restaurante no está disponible.')
      return
    }

    const message = formatLaVitolaOrder({
      items, subtotal: total, delivery, name, phone: cleanPhone, address, references, note,
      colonia: delivery ? selectedColonia : '', deliveryFee,
    })

    // Registra una solicitud, nunca una venta confirmada: WhatsApp no confirma si se envió.
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
    setError('')
    setSavingRequest(true)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    try {
      const response = await fetch('https://uszhdesbewkjvphipudw.supabase.co/functions/v1/la-vitola-registrar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          externalId: crypto.randomUUID(),
          name: name.trim(),
          phone: cleanPhone,
          delivery,
          colonia: delivery ? selectedColonia : '',
          marketingConsent,
          items: items.map(({ product, qty }) => ({
            id: product.idOriginal || product.id,
            qty,
            addons: (product.adicionales || []).map(a => a.id),
          })),
        }),
      })
      if (response.status === 409) {
        setError('El menú cambió. Actualiza la página y revisa los productos antes de pedir.')
        return
      }
      // Aunque el historial no esté disponible, no bloqueamos el pedido directo por WhatsApp.
    } catch {
      // Sin red para el registro: el cliente conserva la salida a WhatsApp.
    } finally {
      clearTimeout(timeout)
      setSavingRequest(false)
    }
    window.location.assign(url)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center font-sans" role="dialog" aria-modal="true" aria-label="Finalizar pedido">
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92dvh] overflow-y-auto bg-[#F8F9FA] text-gray-900 shadow-2xl">
        <header className="sticky top-0 bg-white/95 backdrop-blur-lg z-10 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">Finalizar pedido</h2>
            <p className="text-xs text-gray-500">Lo enviamos directo a WhatsApp</p>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center" aria-label="Cerrar">
            <X size={21} />
          </button>
        </header>
        <form onSubmit={submit} className="p-4 sm:p-6 space-y-5">
          <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-black mb-3">Tu pedido</h3>
            <div className="space-y-3">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-start justify-between gap-3 text-sm border-b border-gray-100 pb-2">
                  <div><b>{qty} × {product.nombre}</b>{product.adicionales?.length > 0 && <p className="text-xs mt-1 text-gray-500">+ {product.adicionales.map(a => a.nombre).join(', ')}</p>}</div>
                  <b className="whitespace-nowrap">$ {(qty * Number(product.precio)).toFixed(2)}</b>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-black mt-4"><span>Subtotal</span><span>MXN $ {total.toFixed(2)}</span></div>
          </section>

          <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-black mb-3">¿Cómo recibirás el pedido?</h3>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setDelivery(false)} className={`rounded-2xl p-4 border-2 font-extrabold text-sm flex items-center flex-col gap-2 ${!delivery ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 bg-white text-gray-700'}`}><Store size={24} /> Recoger</button>
              {config.envio?.activo && <button type="button" onClick={() => setDelivery(true)} className={`rounded-2xl p-4 border-2 font-extrabold text-sm flex items-center flex-col gap-2 ${delivery ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 bg-white text-gray-700'}`}><Bike size={24} /> A domicilio</button>}
            </div>
            {delivery && deliveryFee === null && <p className="mt-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3">El envío de esta colonia se cotiza directamente con La Vitola.</p>}
            {delivery && deliveryFee !== null && <div className="mt-3 rounded-xl bg-orange-50 border border-orange-200 text-sm p-3"><div className="flex justify-between"><span>Envío a {selectedColonia}</span><b>MXN $ {deliveryFee.toFixed(2)}</b></div><div className="flex justify-between border-t border-orange-200 mt-2 pt-2 font-black"><span>Total con envío</span><span>MXN $ {totalConEnvio.toFixed(2)}</span></div></div>}
          </section>

          <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-black mb-3">Datos de contacto</h3>
            <label className="block text-xs font-bold mb-1">Nombre *</label>
            <input className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-4 text-sm" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required placeholder="Tu nombre" />
            <label className="block text-xs font-bold mb-1">Tu WhatsApp (10 dígitos) *</label>
            <input className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-4 text-sm" type="tel" inputMode="tel" autoComplete="tel-national" maxLength={10} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} required placeholder="9611234567" />
            {delivery && <>
              {zonas.length > 0 && <>
                <label className="block text-xs font-bold mb-1" htmlFor="colonia-vitola">Selecciona tu colonia *</label>
                <select id="colonia-vitola" value={selectedColonia} onChange={e => setSelectedColonia(e.target.value)} required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 mb-4 text-base">
                  <option value="">Elige tu colonia</option>
                  {zonas.map(zona => <option key={zona.nombre} value={zona.nombre}>{zona.nombre} — {zona.costo == null ? 'Por cotizar' : '
              <label className="block text-xs font-bold mb-1">Referencias (opcional)</label>
              <input className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-4 text-sm" value={references} onChange={e=>setReferences(e.target.value)} placeholder="Entre calles, color de fachada…" />
            </>}
            <label className="block text-xs font-bold mb-1">Indicaciones especiales (opcional)</label>
            <textarea className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" rows={2} value={note} onChange={e=>setNote(e.target.value)} placeholder="Salsa, ingredientes, aclaraciones…" />
          </section>

          <div className="rounded-xl bg-white border border-gray-200 p-3 text-xs text-gray-600">
            Tus datos se utilizarán para atender tu solicitud. El restaurante podrá consultar el historial de solicitudes desde su panel.
            <label className="flex items-start gap-2 mt-3 text-gray-800 leading-relaxed cursor-pointer">
              <input type="checkbox" checked={marketingConsent} onChange={e => setMarketingConsent(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#FF4B00] flex-none" />
              <span>Acepto recibir promociones de La Vitola por WhatsApp. <strong>Opcional.</strong></span>
            </label>
          </div>

          {error && <div role="alert" className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3 text-sm font-bold">{error}</div>}
          <button type="submit" disabled={savingRequest} className="bg-[#FF4B00] text-white w-full rounded-2xl font-black py-4 flex items-center justify-center gap-2 shadow-lg active:scale-95">
            <Send size={18} /> {savingRequest ? "Preparando pedido…" : "Solicitar confirmación por WhatsApp"}
          </button>

          <p className="text-center text-xs text-gray-500">{delivery && deliveryFee === null ? "La Vitola informará el costo del envío antes del pago." : "Verifica tu pedido y acuerda el pago directamente con La Vitola."}</p>
        </form>

        {pagosDisponibles && (
          <section className="mx-4 mb-5 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <h3 className="font-black text-gray-900 text-base mb-2">Pagar después de confirmar</h3>
            <p className="text-xs text-gray-600 mb-3">Primero solicita tu pedido por WhatsApp y espera la confirmación del restaurante con el importe final, incluido el envío si aplica.</p>
            <label className="flex items-start gap-3 text-sm font-bold text-gray-800">
              <input type="checkbox" checked={totalConfirmado} onChange={e => setTotalConfirmado(e.target.checked)} className="mt-1 w-5 h-5 accent-[#FF4B00]" />
              La Vitola ya confirmó mi pedido y el total que debo pagar.
            </label>
            {totalConfirmado && <div className="mt-4 space-y-3">
              {pagoTransferencia.activo && <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-black text-sm mb-2">🏦 Transferencia</h4>
                <p className="text-sm text-gray-700">Banco: <b>{pagoTransferencia.banco}</b></p>
                <p className="text-sm text-gray-700">Titular: <b>{pagoTransferencia.titular}</b></p>
                <p className="text-sm text-gray-700 break-all">CLABE: <b>{pagoTransferencia.clabe}</b></p>
                <button type="button" className="mt-3 bg-gray-900 text-white text-xs font-bold rounded-lg px-4 py-2" onClick={() => navigator.clipboard?.writeText(pagoTransferencia.clabe || '')}>Copiar CLABE</button>
              </div>}
              {pagoTarjeta.activo && pagoTarjeta.enlace?.startsWith('https://') && <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-black text-sm mb-2">💳 Tarjeta</h4>
                <p className="text-xs text-gray-600 mb-3">La página de cobro es externa. Comprueba el importe con La Vitola antes de pagar.</p>
                <a className="block text-center bg-[#FF4B00] text-white rounded-xl py-3 font-black text-sm" href={pagoTarjeta.enlace} target="_blank" rel="noopener noreferrer">Abrir enlace del proveedor ↗</a>
              </div>}
              <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-lg">No envíes datos de tarjeta por WhatsApp. Confirma el importe antes de pagar.</p>
            </div>}
          </section>
        )}

      </div>
    </div>
  )
}
 + zona.costo.toFixed(2) + ' MXN'}</option>)}
                </select>
              </>}
              <label className="block text-xs font-bold mb-1">{zonas.length ? 'Calle, número y CP *' : 'Dirección completa y colonia *'}</label>
              <textarea className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-4 text-base" rows={2} value={address} onChange={e=>setAddress(e.target.value)} required placeholder={zonas.length ? 'Calle, número, código postal' : 'Calle, número, colonia y CP'} />
              <label className="block text-xs font-bold mb-1">Referencias (opcional)</label>
              <input className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-4 text-sm" value={references} onChange={e=>setReferences(e.target.value)} placeholder="Entre calles, color de fachada…" />
            </>}
            <label className="block text-xs font-bold mb-1">Indicaciones especiales (opcional)</label>
            <textarea className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" rows={2} value={note} onChange={e=>setNote(e.target.value)} placeholder="Salsa, ingredientes, aclaraciones…" />
          </section>

          <div className="rounded-xl bg-white border border-gray-200 p-3 text-xs text-gray-600">
            Tus datos se utilizarán para atender tu solicitud. El restaurante podrá consultar el historial de solicitudes desde su panel.
            <label className="flex items-start gap-2 mt-3 text-gray-800 leading-relaxed cursor-pointer">
              <input type="checkbox" checked={marketingConsent} onChange={e => setMarketingConsent(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#FF4B00] flex-none" />
              <span>Acepto recibir promociones de La Vitola por WhatsApp. <strong>Opcional.</strong></span>
            </label>
          </div>

          {error && <div role="alert" className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3 text-sm font-bold">{error}</div>}
          <button type="submit" disabled={savingRequest} className="bg-[#FF4B00] text-white w-full rounded-2xl font-black py-4 flex items-center justify-center gap-2 shadow-lg active:scale-95">
            <Send size={18} /> {savingRequest ? "Preparando pedido…" : "Solicitar confirmación por WhatsApp"}
          </button>

          <p className="text-center text-xs text-gray-500">La Vitola cotizará el envío, si aplica, y confirmará el total antes del pago.</p>
        </form>

        {pagosDisponibles && (
          <section className="mx-4 mb-5 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <h3 className="font-black text-gray-900 text-base mb-2">Pagar después de confirmar</h3>
            <p className="text-xs text-gray-600 mb-3">Primero solicita tu pedido por WhatsApp y espera la confirmación del restaurante con el importe final, incluido el envío si aplica.</p>
            <label className="flex items-start gap-3 text-sm font-bold text-gray-800">
              <input type="checkbox" checked={totalConfirmado} onChange={e => setTotalConfirmado(e.target.checked)} className="mt-1 w-5 h-5 accent-[#FF4B00]" />
              La Vitola ya confirmó mi pedido y el total que debo pagar.
            </label>
            {totalConfirmado && <div className="mt-4 space-y-3">
              {pagoTransferencia.activo && <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-black text-sm mb-2">🏦 Transferencia</h4>
                <p className="text-sm text-gray-700">Banco: <b>{pagoTransferencia.banco}</b></p>
                <p className="text-sm text-gray-700">Titular: <b>{pagoTransferencia.titular}</b></p>
                <p className="text-sm text-gray-700 break-all">CLABE: <b>{pagoTransferencia.clabe}</b></p>
                <button type="button" className="mt-3 bg-gray-900 text-white text-xs font-bold rounded-lg px-4 py-2" onClick={() => navigator.clipboard?.writeText(pagoTransferencia.clabe || '')}>Copiar CLABE</button>
              </div>}
              {pagoTarjeta.activo && pagoTarjeta.enlace?.startsWith('https://') && <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-black text-sm mb-2">💳 Tarjeta</h4>
                <p className="text-xs text-gray-600 mb-3">La página de cobro es externa. Comprueba el importe con La Vitola antes de pagar.</p>
                <a className="block text-center bg-[#FF4B00] text-white rounded-xl py-3 font-black text-sm" href={pagoTarjeta.enlace} target="_blank" rel="noopener noreferrer">Abrir enlace del proveedor ↗</a>
              </div>}
              <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-lg">No envíes datos de tarjeta por WhatsApp. Confirma el importe antes de pagar.</p>
            </div>}
          </section>
        )}

      </div>
    </div>
  )
}
