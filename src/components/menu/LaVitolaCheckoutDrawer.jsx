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
  const [references, setReferences] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [totalConfirmado, setTotalConfirmado] = useState(false)
  const pagoTransferencia = config.pagos?.transferencia || {}
  const pagoTarjeta = config.pagos?.tarjeta || {}
  const pagosDisponibles = pagoTransferencia.activo || pagoTarjeta.activo

  const items = useMemo(() => Object.entries(carrito)
    .map(([id, qty]) => ({ product: productosPorId[id], qty }))
    .filter(item => item.product && item.qty > 0), [carrito, productosPorId])
  const total = items.reduce((sum, item) => sum + Number(item.product.precio) * item.qty, 0)

  if (!isOpen) return null

  const submit = event => {
    event.preventDefault()
    const cleanPhone = phone.replace(/\D/g, '')
    const whatsapp = (config.whatsapp || '').replace(/\D/g, '')
    if (!name.trim() || cleanPhone.length !== 10) {
      setError('Escribe tu nombre y WhatsApp de 10 dígitos.')
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
    })

    // El pedido va directamente al WhatsApp del restaurante, sin intermediarios.
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
    setError('')
    window.location.assign(url)
    // Conservamos el carrito: solo el restaurante puede confirmar el pedido.
    // No marcamos un pedido como registrado en una base de datos inexistente.
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
            {delivery && <p className="mt-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3">El costo de envío se cotiza con La Vitola por WhatsApp. No está incluido en el subtotal.</p>}
          </section>

          <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-black mb-3">Datos de contacto</h3>
            <label className="block text-xs font-bold mb-1">Nombre *</label>
            <input className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-4 text-sm" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required placeholder="Tu nombre" />
            <label className="block text-xs font-bold mb-1">Tu WhatsApp (10 dígitos) *</label>
            <input className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-4 text-sm" type="tel" inputMode="tel" autoComplete="tel-national" maxLength={10} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} required placeholder="9611234567" />
            {delivery && <>
              <label className="block text-xs font-bold mb-1">Dirección y colonia *</label>
              <textarea className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-4 text-sm" rows={2} value={address} onChange={e=>setAddress(e.target.value)} required placeholder="Calle, número, colonia y CP" />
              <label className="block text-xs font-bold mb-1">Referencias (opcional)</label>
              <input className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-4 text-sm" value={references} onChange={e=>setReferences(e.target.value)} placeholder="Entre calles, color de fachada…" />
            </>}
            <label className="block text-xs font-bold mb-1">Indicaciones especiales (opcional)</label>
            <textarea className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" rows={2} value={note} onChange={e=>setNote(e.target.value)} placeholder="Salsa, ingredientes, aclaraciones…" />
          </section>

          {error && <div role="alert" className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3 text-sm font-bold">{error}</div>}
          <button type="submit" className="bg-[#FF4B00] text-white w-full rounded-2xl font-black py-4 flex items-center justify-center gap-2 shadow-lg active:scale-95">
            <Send size={18} /> Solicitar confirmación por WhatsApp
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
