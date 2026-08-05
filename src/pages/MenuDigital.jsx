import { useState, useMemo, useCallback } from 'react'
import { Plus, Minus, X, CheckCircle, Store, Bike, Share } from 'lucide-react'
import ProductoMenuCard from '../components/ProductoMenuCard'
import CheckoutDrawer from '../components/CheckoutDrawer'
import MenuHeroProfile from '../components/menu/MenuHeroProfile'
import { AlertTriangle } from 'lucide-react'

// Genera folio único tipo SB-AXKF-7821
const generarFolio = () => {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const rand4 = Array.from({ length: 4 }, () => letras[Math.floor(Math.random() * letras.length)]).join('')
  const ts = Date.now().toString().slice(-4)
  return `SB-${rand4}-${ts}`
}

function haversine(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180,
    a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function MenuDigital({ modo: propModo, demoMenu, demoConfig, isDemo = true }) {
  const modo = propModo || (window.location.pathname.includes('/carta') ? 'carta' : 'pedir')
  const menu = demoMenu || []
  const config = demoConfig || {}

  const [catActiva, setCatActiva] = useState(menu[0]?.id || '')

  // Estado del carrito: { prodId: cantidad }
  const [carrito, setCarrito] = useState({})
  const [checkoutVis, setCheckoutVis] = useState(false)

  const productosPorId = useMemo(() => {
    const dict = {}
    menu.forEach(c => c.productos.forEach(p => dict[p.id] = p))
    return dict
  }, [menu])

  const catVisible = menu.filter(c => c.visible)
  const catsPlus = menu.filter(c => (c.esPlus || c.tipo === 'promo') && c.visible)

const { subtotal, cantidadTotal } = useMemo(() => {
    let t = 0, c = 0
    Object.entries(carrito).forEach(([id, cant]) => {
      const prod = productosPorId[id]
      if (prod) {
        t += prod.precio * cant
        c += cant
      }
    })
    return { subtotal: t, cantidadTotal: c }
  }, [carrito, productosPorId])


  const agregarProducto = useCallback((prod) => {
    if (prod.agotado) return
    setCarrito(prev => ({ ...prev, [prod.id]: (prev[prod.id] || 0) + 1 }))
  }, [])

  const quitarProducto = useCallback((prodId) => {
    setCarrito(prev => {
      const n = { ...prev }
      if (n[prodId] > 1) n[prodId]--
      else delete n[prodId]
      return n
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans relative">
      <MenuHeroProfile config={config} />

      {catsPlus.length > 0 && (
        <div className="p-4" style={{ background: `linear-gradient(135deg, ${config.colorMarca || '#f5b87a'}33 0%, transparent 100%)` }}>
          <h2 className="font-black text-lg mb-3 flex items-center gap-2">🔥 Promociones</h2>
          <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
            {catsPlus.flatMap(c => c.productos).filter(p => p.activo).map(prod => (
              <div key={prod.id} className="bg-white min-w-[200px] p-3 rounded-2xl shadow-sm border border-white flex flex-col gap-2">
                <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden relative">
                  {prod.foto ? <img src={prod.foto} className="w-full h-full object-cover" alt={prod.nombre} /> : <div className="w-full h-full flex items-center justify-center text-4xl">🌮</div>}
                </div>
                <h3 className="font-bold text-sm leading-tight">{prod.nombre}</h3>
                <span className="font-black" style={{ color: config.colorMarca || '#f5b87a' }}>${prod.precio}</span>
                {modo === 'pedir' && (
                  <button onClick={() => agregarProducto(prod)} className="bg-gray-100 text-sm font-bold py-1.5 rounded-lg active:scale-95 flex justify-center items-center gap-1"><Plus size={14}/> Agregar</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#FAFAFA] sticky top-[92px] z-10 px-4 py-3 shadow-sm flex overflow-x-auto gap-2 no-scrollbar">
        {catVisible.map(c => (
          <button key={c.id} onClick={() => { setCatActiva(c.id); document.getElementById(`cat-${c.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${catActiva === c.id ? 'bg-black text-white' : 'bg-white text-gray-600 shadow-sm'}`}
            style={catActiva === c.id ? { backgroundColor: config.colorMarca || '#000', color: '#fff' } : {}}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-8">
        {catVisible.map(c => (
          <div key={c.id} id={`cat-${c.id}`} className="scroll-mt-36">
            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              {c.nombre}
              {c.tipo === 'promo' && <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">🔥 Promo</span>}
              {c.tipo === 'especial' && <span className="text-xs font-black text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">⭐ Especial</span>}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {c.productos.filter(p => p.activo && !p.is_hidden && !p.oculto).map(prod => {
                const cant = carrito[prod.id] || 0
                return (
                  <ProductoMenuCard 
                    key={prod.id} 
                    prod={prod} 
                    cant={cant} 
                    onAgregar={agregarProducto} 
                    onQuitar={quitarProducto}
                    colorMarca={config.colorMarca}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {modo === 'pedir' && cantidadTotal > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-30">
          <button onClick={() => setCheckoutVis(true)} className="w-full bg-black text-white p-4 rounded-2xl shadow-xl flex items-center justify-between active:scale-95 transition-transform" style={{ backgroundColor: config.colorMarca || '#000' }}>
            <div className="flex items-center gap-3">
              <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{cantidadTotal}</span>
              <span className="font-bold">Ver pedido</span>
            </div>
            <span className="font-black text-lg">${subtotal}</span>
          </button>
        </div>
      )}

      {modo === 'carta' && (
        <div className="pb-12 text-center text-gray-500 text-sm">😊 Tu mesero te atenderá en un momento</div>
      )}

      <CheckoutDrawer
        isOpen={checkoutVis && modo === 'pedir'}
        onClose={() => setCheckoutVis(false)}
        carrito={carrito}
        productosPorId={productosPorId}
        config={config}
        onClearCarrito={() => setCarrito({})}
      />
    </div>
  )
}
