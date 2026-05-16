import { useApp } from '../context/AppContext'

export default function TicketResumen({ productos, subtotal, descuento, propinaMonto, total }) {
  const { config } = useApp()
  const dM = descuento?.monto||(descuento?.tipo==='porcentaje'?Math.round(subtotal*descuento.valor/100):descuento?.tipo==='monto'?descuento.valor:0)
  return (
    <div className="bg-dark2 rounded-2xl overflow-hidden">
      <div className="text-center py-4 px-4 border-b border-dashed border-gray-700">
        {config.logo?<img src={config.logo} className="w-14 h-14 rounded-xl object-cover mx-auto mb-2" alt="logo"/>
          :<div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mx-auto mb-2"><span className="text-dark font-black text-xl">SB</span></div>}
        <p className="text-white font-black text-lg">{config.negocio}</p>
        <p className="text-gray-500 text-xs">{new Date().toLocaleDateString('es-MX',{dateStyle:'long'})}</p>
      </div>
      <div className="px-4 py-3 space-y-3 border-b border-dashed border-gray-700">
        {productos.map((p,i)=>(
          <div key={i}>
            <div className="flex justify-between items-start">
              <span className="text-white text-sm font-semibold flex-1 pr-2">{p.cantidad}× {p.nombre}</span>
              <span className="text-white font-bold text-sm">${(p.precio*p.cantidad).toLocaleString()}</span>
            </div>
            {p.nota&&<p className="text-gray-500 text-xs mt-0.5 pl-4">→ {p.nota}</p>}
          </div>
        ))}
      </div>
      <div className="px-4 py-3 space-y-1.5">
        <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span className="text-gray-300">${subtotal.toLocaleString()}</span></div>
        {dM>0&&<div className="flex justify-between text-sm"><span className="text-red-400">Descuento{descuento?.tipo==='porcentaje'?` (${descuento.valor}%)`:''}</span><span className="text-red-400">−${dM.toLocaleString()}</span></div>}
        {propinaMonto>0&&<div className="flex justify-between text-sm"><span className="text-gray-400">Propina</span><span className="text-gray-300">+${propinaMonto.toLocaleString()}</span></div>}
      </div>
      <div className="border-t border-dashed border-gray-700 mx-4"/>
      <div className="px-4 py-3 flex justify-between items-center">
        <span className="text-white font-black text-lg">TOTAL</span>
        <span className="text-primary font-black text-3xl">${total.toLocaleString()}</span>
      </div>
    </div>
  )
}
