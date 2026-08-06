import { useState, useEffect } from 'react'
import { updateBusinessSettings } from '../../services/crmV3Service'
import { CreditCard, DollarSign, Send, Save, CheckCircle, HelpCircle, ShieldCheck } from 'lucide-react'

export default function RestaurantPaymentMethodsTab({ business = {}, onUpdateBusiness }) {
  const defaultMethods = {
    efectivo: { activo: true, preguntar_cambio: true, limite_cambio_activo: false, max_cambio_monto: 500 },
    transferencia: {
      activo: false,
      titular: '',
      banco: '',
      clabe: '',
      numero_cuenta: '',
      instrucciones: '',
      texto_solicitar_comprobante: 'Realiza tu transferencia y adjunta el comprobante cuando envíes tu pedido por WhatsApp.'
    },
    tarjeta: {
      activo: false,
      instrucciones: 'Se aceptan tarjetas de crédito y débito. El pago se realiza al momento de la entrega.',
      compra_minima: 0
    }
  }

  const [paymentMethods, setPaymentMethods] = useState(() => ({
    ...defaultMethods,
    ...(business.payment_methods || {}),
    efectivo: { ...defaultMethods.efectivo, ...(business.payment_methods?.efectivo || {}) },
    transferencia: { ...defaultMethods.transferencia, ...(business.payment_methods?.transferencia || {}) },
    tarjeta: { ...defaultMethods.tarjeta, ...(business.payment_methods?.tarjeta || {}) },
  }))

  useEffect(() => {
    if (business.payment_methods) {
      setPaymentMethods({
        ...defaultMethods,
        ...business.payment_methods,
        efectivo: { ...defaultMethods.efectivo, ...(business.payment_methods?.efectivo || {}) },
        transferencia: { ...defaultMethods.transferencia, ...(business.payment_methods?.transferencia || {}) },
        tarjeta: { ...defaultMethods.tarjeta, ...(business.payment_methods?.tarjeta || {}) },
      })
    }
  }, [business.payment_methods, business.business_id, business.slug])

  const [toastMsg, setToastMsg] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    const targetId = business.slug || business.business_id || business.id
    updateBusinessSettings(targetId, {
      payment_methods: paymentMethods
    })
    if (onUpdateBusiness) onUpdateBusiness()
    setToastMsg('Configuración de Métodos de Pago guardada con éxito.')
    setTimeout(() => setToastMsg(''), 3000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 text-xs text-white max-w-4xl mx-auto">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle size={16} /> {toastMsg}
        </div>
      )}

      {/* Header Sección Métodos de Pago */}
      <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-2 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <CreditCard className="text-[#FF4B00]" size={20} /> Configuración B2B de Métodos de Pago
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Activa los métodos de pago que acepta {business.name}. Los cambios se reflejarán instantáneamente en tu menú digital público.
            </p>
          </div>
          <button type="submit" className="bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-transform active:scale-95">
            <Save size={14} /> Guardar Cambios
          </button>
        </div>
      </div>

      {/* MÉTODOS DE PAGO B2B */}
      <div className="grid grid-cols-1 gap-6">

        {/* 1. PAGO EN EFECTIVO */}
        <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                💵
              </div>
              <div>
                <h3 className="font-black text-white text-sm">Pago en Efectivo</h3>
                <p className="text-gray-400 text-xs">Pago directo al recibir la entrega o al recoger en sucursal.</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-[#0D0E12] px-3 py-1.5 rounded-xl border border-white/10">
              <input
                type="checkbox"
                checked={paymentMethods.efectivo.activo}
                onChange={e => setPaymentMethods({
                  ...paymentMethods,
                  efectivo: { ...paymentMethods.efectivo, activo: e.target.checked }
                })}
                className="rounded border-gray-600 text-[#FF4B00] focus:ring-0"
              />
              <span className="font-bold text-xs">{paymentMethods.efectivo.activo ? 'Activo ✅' : 'Inactivo ❌'}</span>
            </label>
          </div>

          {paymentMethods.efectivo.activo && (
            <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/5 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentMethods.efectivo.preguntar_cambio}
                  onChange={e => setPaymentMethods({
                    ...paymentMethods,
                    efectivo: { ...paymentMethods.efectivo, preguntar_cambio: e.target.checked }
                  })}
                  className="rounded border-gray-600 text-[#FF4B00] focus:ring-0"
                />
                <div>
                  <span className="font-bold text-white block">Preguntar al cliente si necesita cambio en el checkout</span>
                  <span className="text-gray-400 text-[11px] block">Muestra el campo: "¿Necesitas cambio? No / Sí, pagaré con $___" y envía el monto desglosado en WhatsApp.</span>
                </div>
              </label>

              {/* LÍMITE MÁXIMO DE CAMBIO PARA REPARTO */}
              <div className="pt-3 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-xs">LÍMITE MÁXIMO DE CAMBIO PARA REPARTO</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentMethods.efectivo.limite_cambio_activo !== false}
                      onChange={e => setPaymentMethods({
                        ...paymentMethods,
                        efectivo: { ...paymentMethods.efectivo, limite_cambio_activo: e.target.checked }
                      })}
                      className="rounded border-gray-600 text-[#FF4B00] focus:ring-0"
                    />
                    <span className="text-gray-300 font-bold text-xs">Activar restricción</span>
                  </label>
                </div>

                {paymentMethods.efectivo.limite_cambio_activo !== false && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Máximo de cambio disponible ($ MXN) *</label>
                      <input
                        type="number"
                        value={paymentMethods.efectivo.max_cambio_monto || 500}
                        onChange={e => setPaymentMethods({
                          ...paymentMethods,
                          efectivo: { ...paymentMethods.efectivo, max_cambio_monto: Number(e.target.value) }
                        })}
                        placeholder="Ej. 500"
                        className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Mensaje de seguridad personalizado</label>
                      <input
                        type="text"
                        value={paymentMethods.efectivo.mensaje_limite_cambio || ''}
                        onChange={e => setPaymentMethods({
                          ...paymentMethods,
                          efectivo: { ...paymentMethods.efectivo, mensaje_limite_cambio: e.target.value }
                        })}
                        placeholder="Por seguridad, nuestros repartidores no llevan cambio para cantidades mayores a $500."
                        className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. PAGO POR TRANSFERENCIA BANCARIA */}
        <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                📲
              </div>
              <div>
                <h3 className="font-black text-white text-sm">Pago por Transferencia Bancaria</h3>
                <p className="text-gray-400 text-xs">Muestra CLABE y datos bancarios para transferencias SPEI directas.</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-[#0D0E12] px-3 py-1.5 rounded-xl border border-white/10">
              <input
                type="checkbox"
                checked={paymentMethods.transferencia.activo}
                onChange={e => setPaymentMethods({
                  ...paymentMethods,
                  transferencia: { ...paymentMethods.transferencia, activo: e.target.checked }
                })}
                className="rounded border-gray-600 text-[#FF4B00] focus:ring-0"
              />
              <span className="font-bold text-xs">{paymentMethods.transferencia.activo ? 'Activo ✅' : 'Inactivo ❌'}</span>
            </label>
          </div>

          {paymentMethods.transferencia.activo && (
            <div className="space-y-4 bg-[#0D0E12] p-4 rounded-xl border border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Nombre del Titular de la Cuenta *</label>
                  <input
                    type="text"
                    value={paymentMethods.transferencia.titular || ''}
                    onChange={e => setPaymentMethods({
                      ...paymentMethods,
                      transferencia: { ...paymentMethods.transferencia, titular: e.target.value }
                    })}
                    placeholder="Ej. Tacos El Güero S.A. de C.V."
                    className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Banco Receptores *</label>
                  <input
                    type="text"
                    value={paymentMethods.transferencia.banco || ''}
                    onChange={e => setPaymentMethods({
                      ...paymentMethods,
                      transferencia: { ...paymentMethods.transferencia, banco: e.target.value }
                    })}
                    placeholder="Ej. BBVA Bancomer / Banorte"
                    className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">CLABE Interbancaria (18 dígitos) *</label>
                  <input
                    type="text"
                    maxLength={18}
                    value={paymentMethods.transferencia.clabe || ''}
                    onChange={e => setPaymentMethods({
                      ...paymentMethods,
                      transferencia: { ...paymentMethods.transferencia, clabe: e.target.value.replace(/\D/g, '') }
                    })}
                    placeholder="Ej. 012180000123456789"
                    className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Número de Tarjeta / Cuenta (Opcional)</label>
                  <input
                    type="text"
                    value={paymentMethods.transferencia.numero_cuenta || ''}
                    onChange={e => setPaymentMethods({
                      ...paymentMethods,
                      transferencia: { ...paymentMethods.transferencia, numero_cuenta: e.target.value }
                    })}
                    placeholder="Ej. 4152 3130 0000 0000"
                    className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Texto para Solicitar Comprobante en el Checkout</label>
                <textarea
                  rows={2}
                  value={paymentMethods.transferencia.texto_solicitar_comprobante || ''}
                  onChange={e => setPaymentMethods({
                    ...paymentMethods,
                    transferencia: { ...paymentMethods.transferencia, texto_solicitar_comprobante: e.target.value }
                  })}
                  placeholder="Ej. Realiza tu transferencia y adjunta el comprobante cuando envíes tu pedido por WhatsApp."
                  className="w-full bg-[#14161F] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. PAGO CON TARJETA AL RECIBIR */}
        <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                💳
              </div>
              <div>
                <h3 className="font-black text-white text-sm">Pago con Tarjeta al Recibir</h3>
                <p className="text-gray-400 text-xs">El repartidor o mesero lleva terminal física al momento de la entrega.</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-[#0D0E12] px-3 py-1.5 rounded-xl border border-white/10">
              <input
                type="checkbox"
                checked={paymentMethods.tarjeta.activo}
                onChange={e => setPaymentMethods({
                  ...paymentMethods,
                  tarjeta: { ...paymentMethods.tarjeta, activo: e.target.checked }
                })}
                className="rounded border-gray-600 text-[#FF4B00] focus:ring-0"
              />
              <span className="font-bold text-xs">{paymentMethods.tarjeta.activo ? 'Activo ✅' : 'Inactivo ❌'}</span>
            </label>
          </div>

          {paymentMethods.tarjeta.activo && (
            <div className="space-y-4 bg-[#0D0E12] p-4 rounded-xl border border-white/5">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Instrucciones o Mensaje Visible en el Checkout</label>
                <textarea
                  rows={2}
                  value={paymentMethods.tarjeta.instrucciones || ''}
                  onChange={e => setPaymentMethods({
                    ...paymentMethods,
                    tarjeta: { ...paymentMethods.tarjeta, instrucciones: e.target.value }
                  })}
                  placeholder="Ej. Se aceptan tarjetas de crédito y débito Visa, MasterCard y Amex. El pago se realiza al momento de la entrega."
                  className="w-full bg-[#14161F] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Compra Mínima para Pago con Tarjeta ($ MXN - Opcional)</label>
                <input
                  type="number"
                  value={paymentMethods.tarjeta.compra_minima || 0}
                  onChange={e => setPaymentMethods({
                    ...paymentMethods,
                    tarjeta: { ...paymentMethods.tarjeta, compra_minima: Number(e.target.value) }
                  })}
                  placeholder="Ej. 150"
                  className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" className="bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-xl text-sm transition-transform active:scale-95">
          <Save size={16} /> Guardar Configuración de Métodos de Pago
        </button>
      </div>
    </form>
  )
}
