import React from 'react'
import { Plus, Minus } from 'lucide-react'

const ProductoMenuCard = React.memo(function ProductoMenuCard({ prod, cant, onAgregar, onQuitar, colorMarca = '#FF4B00' }) {
  const isAgotado = prod.agotado || prod.is_out_of_stock
  const isFeatured = prod.is_featured || prod.is_promo

  return (
    <div className={`bg-white rounded-3xl shadow-sm hover:shadow-md border border-gray-100/80 overflow-hidden flex flex-col transition-all relative ${isAgotado ? 'opacity-55' : ''}`}>
      {/* Badge Top Left */}
      {isFeatured && (
        <div className="absolute top-2.5 left-2.5 z-10 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm tracking-tight flex items-center gap-1">
          <span>🔥 Top Favorito</span>
        </div>
      )}

      {/* Imagen del Producto */}
      <div className="w-full aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {prod.foto || prod.image_url ? (
          <img 
            src={prod.foto || prod.image_url} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            alt={prod.nombre} 
            loading="lazy" 
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-amber-50 to-orange-50">🌮</div>
        )}
        
        {isAgotado && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white font-black px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase shadow-md">
              Agotado
            </span>
          </div>
        )}

        {/* Floating Circular Plus Button on Image */}
        {!isAgotado && cant === 0 && (
          <button
            onClick={() => onAgregar(prod)}
            className="absolute bottom-2.5 right-2.5 w-9 h-9 bg-black/90 hover:bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all border border-white/20"
            title="Agregar producto"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Info & Controles */}
      <div className="p-3.5 flex flex-col flex-1 gap-1.5">
        <h3 className="font-extrabold text-gray-900 leading-snug text-xs sm:text-sm line-clamp-2">
          {prod.nombre}
        </h3>
        
        {prod.descripcion && (
          <p className="text-gray-500 text-[11px] line-clamp-2 leading-tight">
            {prod.descripcion}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-1 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Precio</span>
            <span className="font-black text-sm sm:text-base text-gray-900 font-mono">
              MXN ${Number(prod.precio).toFixed(2)}
            </span>
          </div>

          {!isAgotado && (
            cant > 0 && (
              <div className="flex items-center gap-1.5 bg-gray-100 rounded-full p-1 border border-gray-200">
                <button
                  onClick={() => onQuitar(prod.id)}
                  className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-xs text-gray-800 active:scale-90 border border-gray-200"
                >
                  <Minus size={14} />
                </button>
                <span className="font-black text-gray-900 w-3 text-center text-xs">{cant}</span>
                <button
                  onClick={() => onAgregar(prod)}
                  className="w-7 h-7 text-white rounded-full flex items-center justify-center shadow-xs active:scale-90"
                  style={{ backgroundColor: colorMarca }}
                >
                  <Plus size={14} />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
})

export default ProductoMenuCard
