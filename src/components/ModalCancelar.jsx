import { useState } from 'react'
import ModalPin from './ModalPin'

const RAZONES = ['Error en pedido','Cliente se fue','Producto agotado','Otro']

export default function ModalCancelar({ pinAdmin, onConfirmar, onCerrar }) {
  const [paso,  setPaso]  = useState('pin')
  const [razon, setRazon] = useState(RAZONES[0])
  const [nota,  setNota]  = useState('')

  if (paso==='pin') return <ModalPin titulo="PIN Admin — Cancelar" pinCorrecto={pinAdmin} onSuccess={()=>setPaso('razon')} onCancel={onCerrar}/>

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-6">
      <div className="bg-dark2 rounded-3xl p-6 w-full max-w-xs space-y-4">
        <div className="text-center"><p className="text-3xl mb-2">🚫</p><h3 className="text-white font-black text-xl">Cancelar pedido</h3></div>
        <div className="space-y-2">
          {RAZONES.map(r=>(
            <button key={r} onClick={()=>setRazon(r)}
              className={`w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm min-h-[48px] ${razon===r?'bg-red-600 text-white':'bg-dark3 text-gray-300'}`}>
              {r}
            </button>
          ))}
        </div>
        {razon==='Otro'&&<input value={nota} onChange={e=>setNota(e.target.value)} placeholder="Describe el motivo..." className="w-full bg-dark3 border border-gray-600 text-white px-4 py-3 rounded-xl outline-none focus:border-primary min-h-[48px] text-sm"/>}
        <div className="flex gap-3">
          <button onClick={onCerrar} className="flex-1 bg-gray-800 text-gray-400 font-bold py-3 rounded-2xl min-h-[52px]">Volver</button>
          <button onClick={()=>onConfirmar(razon==='Otro'?nota||'Otro':razon)} className="flex-[2] bg-red-600 text-white font-black py-3 rounded-2xl min-h-[52px]">Confirmar</button>
        </div>
      </div>
    </div>
  )
}
