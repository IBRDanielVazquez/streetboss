import React from 'react'
import { Plus, Minus } from 'lucide-react'

const ProductoMenuCard = React.memo(function ProductoMenuCard({ prod, cant, onAgregar, onQuitar, colorMarca }) {
  const isAgotado = prod.agotado || prod.is_out_of_stock
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${isAgotado ? 'opacity-60' : ''}`}>
      <div className="w-full aspect-[4/3] sm:aspect-[16/9] bg-gray-100 relative">
        {prod.foto || prod.image_url ? (
          <img 
            src={prod.foto || prod.image_url} 
            className="w-full h-full object-cover" 
            alt={prod.nombre} 
            loading="lazy" 
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🌮</div>
        )}
        {isAgotado && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-red-500 text-white font-black px-4 py-1.5 rounded-full text-xs tracking-widest uppercase shadow-sm">Agotado</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-900 leading-tight text-sm md:text-base">{prod.nombre}</h3>
          {prod.descripcion && <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{prod.descripcion}</p>}
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <span className="font-black text-lg md:text-xl flex-shrink-0" style={{ color: colorMarca || '#ff4b16' }}>${prod.precio}</span>
          {!isAgotado && (
            cant > 0 ? (
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-full p-1 border border-gray-100">
                <button onClick={() => onQuitar(prod.id)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-700 active:scale-90 border border-gray-200"><Minus size={16} /></button>
                <span className="font-black text-gray-900 w-4 text-center text-sm">{cant}</span>
                <button onClick={() => onAgregar(prod)} className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-white active:scale-90" style={{ backgroundColor: colorMarca || '#ff4b16' }}><Plus size={16} /></button>
              </div>
            ) : (
              <button onClick={() => onAgregar(prod)} className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-4 py-2 rounded-full text-xs md:text-sm flex items-center gap-1.5 active:scale-95 transition-colors">
                <Plus size={16}/> Agregar
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
})

export default ProductoMenuCard
