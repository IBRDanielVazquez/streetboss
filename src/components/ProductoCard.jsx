import { Plus, Minus, Pencil } from 'lucide-react'

export default function ProductoCard({ producto, cantidad=0, esPlus=false, onAgregar, onQuitar, onNota }) {
  if (producto.agotado) return (
    <div className={`rounded-2xl p-4 opacity-50 flex flex-col justify-between gap-3 ${esPlus?'col-span-2 bg-amber-950/30 border border-amber-900/30':'bg-dark3'}`}>
      <div>
        {esPlus && <div className="flex items-center gap-1.5 mb-1"><span className="text-yellow-700 text-sm">⭐</span><span className="text-yellow-700/50 text-xs font-bold uppercase tracking-wide">Especialidad</span></div>}
        <p className={`font-semibold text-sm line-through leading-tight ${esPlus ? 'text-amber-700/50' : 'text-gray-400'}`}>{producto.nombre}</p>
        <p className={`text-lg font-bold mt-1 ${esPlus ? 'text-amber-800/50' : 'text-gray-600'}`}>${producto.precio}</p>
      </div>
      <button disabled className={`font-bold py-2.5 rounded-xl min-h-[44px] text-sm flex items-center justify-center gap-1 cursor-not-allowed border ${esPlus ? 'bg-amber-900/20 text-amber-800/50 border-amber-900/30' : 'bg-dark text-gray-600 border-gray-800'}`}>
        <span className="text-xs uppercase tracking-widest">Agotado</span>
      </button>
    </div>
  )

  if (esPlus) return (
    <div className="col-span-2 bg-amber-950 border border-amber-800/50 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1"><span className="text-yellow-400 text-sm">⭐</span><span className="text-yellow-400 text-xs font-bold uppercase tracking-wide">Especialidad</span></div>
          <p className="text-white font-black text-base leading-tight">{producto.nombre}</p>
          {producto.descripcion&&<p className="text-amber-300/70 text-xs mt-0.5">{producto.descripcion}</p>}
          <p className="text-primary font-black text-2xl mt-2">${producto.precio}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {cantidad>0&&<button onClick={onNota} className="bg-amber-900 text-amber-300 w-8 h-8 rounded-xl flex items-center justify-center"><Pencil size={13}/></button>}
          <div className="flex items-center gap-2">
            {cantidad>0&&<><button onClick={onQuitar} className="bg-dark text-white w-10 h-10 rounded-xl flex items-center justify-center active:opacity-70"><Minus size={16}/></button><span className="text-white font-black text-xl w-6 text-center">{cantidad}</span></>}
            <button onClick={onAgregar} className="bg-primary text-dark w-10 h-10 rounded-xl flex items-center justify-center active:opacity-80"><Plus size={18}/></button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-dark3 rounded-2xl p-4 flex flex-col gap-3">
      <div><p className="text-white font-semibold text-sm leading-tight">{producto.nombre}</p><p className="text-primary font-black text-xl mt-1">${producto.precio}</p></div>
      {cantidad>0?(
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button onClick={onQuitar} className="bg-dark text-white w-10 h-10 rounded-xl flex items-center justify-center active:opacity-70"><Minus size={16}/></button>
            <span className="text-white font-black text-xl">{cantidad}</span>
            <button onClick={onAgregar} className="bg-primary text-dark w-10 h-10 rounded-xl flex items-center justify-center active:opacity-80"><Plus size={18}/></button>
          </div>
          <button onClick={onNota} className="w-full bg-dark border border-gray-700 text-gray-400 text-xs font-semibold py-1.5 rounded-xl flex items-center justify-center gap-1 active:bg-gray-800"><Pencil size={11}/> Nota</button>
        </div>
      ):(
        <button onClick={onAgregar} className="bg-primary text-dark font-bold py-2.5 rounded-xl min-h-[44px] text-sm active:opacity-80 flex items-center justify-center gap-1"><Plus size={16}/> Agregar</button>
      )}
    </div>
  )
}
