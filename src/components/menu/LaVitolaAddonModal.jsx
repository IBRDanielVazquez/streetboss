import { useEffect, useMemo, useState } from 'react'
import { Check, Plus, X } from 'lucide-react'

// Personalización asociada a una hamburguesa, nunca como producto independiente.
export default function LaVitolaAddonModal({ burger, options = [], onClose, onAdd }) {
  const [selected, setSelected] = useState([])

  useEffect(() => { setSelected([]) }, [burger?.id])
  const chosen = useMemo(() => options.filter(option => selected.includes(option.id)), [options, selected])
  const additions = chosen.reduce((sum, option) => sum + Number(option.precio), 0)
  const subtotal = Number(burger?.precio || 0) + additions

  if (!burger) return null

  const toggle = id => setSelected(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])

  return (
    <div className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Personaliza tu hamburguesa">
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#F8F9FA] shadow-2xl max-h-[94dvh] overflow-y-auto text-gray-900">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#FF4B00]">Personaliza tu hamburguesa</p>
            <h2 className="text-xl font-black">{burger.nombre}</h2>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center" aria-label="Cerrar"><X size={22}/></button>
        </div>

        {burger.foto && <img className="h-40 w-full object-cover" src={burger.foto} alt={burger.nombre} />}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold">Hamburguesa original</span>
            <span className="text-base font-black">MXN $ {Number(burger.precio).toFixed(2)}</span>
          </div>
          <h3 className="text-lg font-black">¿Quieres agregar extras?</h3>
          <p className="text-sm text-gray-500 mb-4">Son opcionales y se suman al precio de esta hamburguesa.</p>
          <div className="space-y-2">
            {options.map(option => {
              const active = selected.includes(option.id)
              return (
                <button key={option.id} type="button" onClick={() => toggle(option.id)} aria-pressed={active}
                  className={'w-full min-h-[56px] p-3 flex items-center gap-3 text-left border-2 rounded-2xl transition-colors ' + (active ? 'border-[#FF4B00] bg-orange-50' : 'border-gray-200 bg-white')}>
                  <span className={'w-7 h-7 flex-none rounded-lg border-2 flex items-center justify-center ' + (active ? 'bg-[#FF4B00] border-[#FF4B00] text-white' : 'border-gray-300')}>
                    {active && <Check size={17}/>}
                  </span>
                  <span className="flex-1 text-sm font-bold">{option.nombre}</span>
                  <span className="text-sm font-black whitespace-nowrap">+ $ {Number(option.precio).toFixed(2)}</span>
                </button>
              )
            })}
          </div>
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-4 flex justify-between items-center">
            <span className="text-sm font-bold">Total de esta hamburguesa</span>
            <span className="text-lg font-black">MXN $ {subtotal.toFixed(2)}</span>
          </div>
          <button type="button" onClick={() => onAdd(burger, chosen)}
            className="w-full min-h-[54px] bg-[#FF4B00] text-white rounded-2xl mt-4 font-black flex justify-center items-center gap-2 active:scale-[.98]">
            <Plus size={19}/> Agregar hamburguesa
          </button>
        </div>
      </div>
    </div>
  )
}
