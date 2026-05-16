import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useRol } from '../hooks/useRol'
import { useSound } from '../hooks/useSound'
import TicketResumen from '../components/TicketResumen'

const PROPINAS = [0, 10, 15, 20]
const METODOS  = [
  { id:'efectivo',      icon:'💵', label:'Efectivo' },
  { id:'transferencia', icon:'📲', label:'Transferencia' },
  { id:'tarjeta',       icon:'💳', label:'Tarjeta' },
]

export default function Cobro() {
  const { mesa } = useParams()
  const numMesa  = Number(mesa)
  const navigate = useNavigate()
  const { mesas, config, cobrarMesa, slug } = useApp()
  const { rol, basePath } = useRol()
  const { playSuccess } = useSound()

  const irAtras = () => {
    if (rol === 'caja') navigate(`${basePath}`)
    else if (rol === 'admin') navigate(`${basePath}/mesas`)
    else navigate(`${basePath}`)
  }

  const mesaInfo  = mesas.find(m => m.numero === numMesa) || {}
  const pedidos   = mesaInfo.pedidos || []
  const descuento = mesaInfo.descuento || { tipo: null, valor: 0 }

  const [propina,    setPropina]    = useState(null) // null | 0 | 10 | 15 | 20
  const [metodo,     setMetodo]     = useState(null)
  const [efectivo,   setEfectivo]   = useState('')
  const [exito,      setExito]      = useState(false)
  const [totalFinal, setTotalFinal] = useState(0)

  const subtotal  = pedidos.reduce((s,p) => s + p.precio*p.cantidad, 0)
  const descMonto = descuento.tipo === 'porcentaje' ? Math.round(subtotal*descuento.valor/100) : descuento.tipo === 'monto' ? descuento.valor : 0
  const netDesc   = subtotal - descMonto
  const propMonto = propina ? Math.round(netDesc * propina / 100) : 0
  const total     = netDesc + propMonto
  const montoEf   = efectivo ? parseFloat(efectivo) : 0
  const cambio    = Math.max(0, montoEf - total)
  const efValido  = !efectivo || montoEf >= total

  if (!pedidos.length) return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6 gap-4">
      <span className="text-5xl">🧾</span>
      <p className="text-gray-400 text-center">Esta mesa no tiene pedido activo.</p>
      <button onClick={irAtras} className="text-primary font-bold underline min-h-[48px]">← Volver a mesas</button>
    </div>
  )

  const confirmar = () => {
    cobrarMesa(numMesa, metodo, propina||0, montoEf)
    setTotalFinal(total)
    playSuccess()
    setExito(true)
  }

  const formatTicketWA = () => {
    const lineas = pedidos.map(p => `${p.cantidad}× ${p.nombre} — $${p.precio*p.cantidad}`).join('\n')
    return encodeURIComponent(`🍔 *${config.negocio}*\n\n${lineas}\n\nSubtotal: $${subtotal}${descMonto?`\nDescuento: -$${descMonto}`:''}${propMonto?`\nPropina: +$${propMonto}`:''}\n\n*TOTAL: $${total}*\nPago: ${metodo}`)
  }

  if (exito) return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6 text-center gap-5">
      <div className="text-7xl">🎉</div>
      <div>
        <p className="text-white font-black text-2xl">¡Cobrado!</p>
        <p className="text-primary font-black text-4xl mt-1">${totalFinal.toLocaleString()}</p>
        {metodo==='efectivo' && cambio>0 && <p className="text-green-400 font-bold mt-2">Cambio: ${cambio.toLocaleString()}</p>}
      </div>
      <a href={`https://wa.me/${config.whatsapp}?text=${formatTicketWA()}`} target="_blank" rel="noreferrer"
        className="w-full max-w-xs bg-green-600 text-white font-bold py-4 rounded-2xl text-base min-h-[56px] flex items-center justify-center gap-2">
        📱 Enviar ticket por WhatsApp
      </a>
      <button onClick={irAtras}
        className="w-full max-w-xs bg-primary text-dark font-black py-4 rounded-2xl text-lg min-h-[56px]">
        Nueva mesa
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-dark sticky top-0 z-20">
        <button onClick={irAtras} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary">←</button>
        <div><h2 className="text-white font-black text-lg">Cuenta Mesa {numMesa}</h2><p className="text-gray-500 text-xs">Revisa y cobra</p></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-6">
        {/* Ticket visual */}
        <TicketResumen productos={pedidos} subtotal={subtotal} descuento={descuento} propinaMonto={propMonto} total={total}/>

        {/* Propina */}
        <div className="bg-dark2 rounded-2xl p-4">
          <p className="text-white font-semibold text-sm mb-1">¿Desea agregar propina?</p>
          <p className="text-gray-600 text-xs mb-3">La propina es completamente voluntaria 🙏</p>
          <div className="grid grid-cols-4 gap-2">
            {PROPINAS.map(p => {
              const monto = Math.round(netDesc * p / 100)
              const act   = propina === p
              return (
                <button key={p} onClick={() => setPropina(act && p!==0 ? null : p)}
                  className={`flex flex-col items-center py-3 rounded-2xl border-2 min-h-[64px] transition-colors
                    ${act ? 'bg-primary border-primary text-dark' : 'bg-dark3 border-gray-700 text-white'}`}>
                  <span className="font-black text-base">{p===0?'Sin':p+'%'}</span>
                  {p>0&&<span className={`text-xs ${act?'text-dark/70':'text-gray-500'}`}>${monto}</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Total */}
        <div className="bg-primary rounded-2xl px-5 py-4 flex justify-between items-center">
          <span className="text-dark font-black text-xl">TOTAL</span>
          <span className="text-dark font-black text-4xl">${total.toLocaleString()}</span>
        </div>

        {/* Forma de pago */}
        <div className="bg-dark2 rounded-2xl p-4 space-y-3">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Forma de pago</p>
          <div className="grid grid-cols-3 gap-2">
            {METODOS.map(m => (
              <button key={m.id} onClick={() => { setMetodo(m.id); setEfectivo('') }}
                className={`flex flex-col items-center py-3 rounded-2xl border-2 min-h-[68px] transition-colors
                  ${metodo===m.id?'bg-primary border-primary text-dark':'bg-dark3 border-gray-700 text-white'}`}>
                <span className="text-2xl">{m.icon}</span>
                <span className={`text-xs font-bold mt-1 ${metodo===m.id?'text-dark':'text-gray-400'}`}>{m.label}</span>
              </button>
            ))}
          </div>

          {metodo==='efectivo' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-gray-500 text-xs font-semibold block mb-1">¿Cuánto entrega el cliente?</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input type="number" inputMode="numeric" value={efectivo} onChange={e=>setEfectivo(e.target.value)}
                    placeholder="0" className="w-full bg-dark3 border border-gray-600 text-white text-xl font-black pl-7 pr-4 py-3 rounded-xl outline-none focus:border-primary min-h-[52px]"/>
                </div>
              </div>
              {efectivo && (
                <div className={`rounded-xl px-4 py-3 flex justify-between items-center ${efValido?'bg-green-900/40 border border-green-700':'bg-red-900/40 border border-red-700'}`}>
                  <span className={`font-semibold text-sm ${efValido?'text-green-300':'text-red-300'}`}>{efValido?'💰 Cambio':'⚠️ Falta'}</span>
                  <span className={`font-black text-2xl ${efValido?'text-green-400':'text-red-400'}`}>${efValido?cambio.toLocaleString():(total-montoEf).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirmar */}
        {metodo && propina!==null && (metodo!=='efectivo'||efValido) && (
          <button onClick={confirmar}
            className="w-full bg-green-600 text-white font-black py-5 rounded-2xl text-xl min-h-[64px] active:bg-green-700">
            ✅ Confirmar cobro
          </button>
        )}
        {metodo==='efectivo'&&!efValido&&efectivo&&(
          <p className="text-center text-red-400 text-sm font-semibold">El monto es menor al total.</p>
        )}
        {!metodo&&<p className="text-center text-gray-600 text-sm">Selecciona la forma de pago</p>}
        {metodo&&propina===null&&<p className="text-center text-gray-600 text-sm">Selecciona propina (o "Sin")</p>}
      </div>
    </div>
  )
}
