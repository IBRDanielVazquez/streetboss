import { useState, useMemo, useCallback, useEffect } from 'react'
import { Plus, Minus, X, CheckCircle, Store, Bike, Share } from 'lucide-react'
import ProductoMenuCard from '../components/ProductoMenuCard'
import CheckoutDrawer from '../components/CheckoutDrawer'
import LaVitolaCheckoutDrawer from '../components/menu/LaVitolaCheckoutDrawer'
import LaVitolaAddonModal from '../components/menu/LaVitolaAddonModal'
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

  // El manifiesto y el ícono pertenecen al negocio, no a StreetBoss general.
  const appSlug = window.location.pathname.match(new RegExp('^/(?:menu|demo)/([a-z0-9-]+)'))?.[1] || ''
  useEffect(() => {
    if (!appSlug) return undefined
    const manifest = document.querySelector('link[rel="manifest"]')
    const appleIcon = document.querySelector('link[rel="apple-touch-icon"]')
    const favicon = document.querySelector('link[rel="icon"]')
    const appleName = document.querySelector('meta[name="apple-mobile-web-app-title"]')
    const suffix = encodeURIComponent(appSlug)
    manifest?.setAttribute('href', `/api/menu-app?slug=${suffix}`)
    appleIcon?.setAttribute('href', `/api/menu-app?slug=${suffix}&asset=icon&size=192`)
    favicon?.setAttribute('href', `/api/menu-app?slug=${suffix}&asset=icon&size=192`)
    appleName?.setAttribute('content', config.negocio || 'Menú digital')
    return () => {
      manifest?.setAttribute('href', '/manifest.json')
      appleIcon?.setAttribute('href', '/brand/SB_APPLE_TOUCH_ICON_180x180_V01.png')
      favicon?.setAttribute('href', '/brand/SB_FAVICON_512x512_V01.png')
      appleName?.setAttribute('content', 'StreetBoss')
    }
  }, [appSlug, config.negocio])

  const [catActiva, setCatActiva] = useState(menu[0]?.id || '')

  // Estado del carrito: { prodId: cantidad }
  const [carrito, setCarrito] = useState({})
  const [checkoutVis, setCheckoutVis] = useState(false)
  const [personalizando, setPersonalizando] = useState(null)
  const [variantes, setVariantes] = useState({})
  const admiteExtras = config.addonsEnabled === true

  const productosPorId = useMemo(() => {
    const dict = {}
    menu.forEach(c => c.productos.forEach(p => dict[p.id] = p))
    return { ...dict, ...variantes }
  }, [menu, variantes])

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
    if (admiteExtras && prod.categoria === 'hamburguesas') {
      setPersonalizando(prod)
      return
    }
    setCarrito(prev => ({ ...prev, [prod.id]: (prev[prod.id] || 0) + 1 }))
  }, [admiteExtras])

  const confirmarHamburguesa = useCallback((hamburguesa, elegidos) => {
    const extras = (config.addons || []).filter(e => elegidos.some(x => x.id === e.id))
    const variantId = hamburguesa.id + '::' + extras.map(e => e.id).sort().join(',')
    const variant = {
      ...hamburguesa,
      id: variantId,
      idOriginal: hamburguesa.id,
      adicionales: extras.map(e => ({ id: e.id, nombre: e.nombre, precio: Number(e.precio) })),
      precio: Number(hamburguesa.precio) + extras.reduce((sum, e) => sum + Number(e.precio), 0),
    }
    setVariantes(prev => ({ ...prev, [variantId]: variant }))
    setCarrito(prev => ({ ...prev, [variantId]: (prev[variantId] || 0) + 1 }))
    setPersonalizando(null)
  }, [config.addons])

  const quitarProducto = useCallback((prodId) => {
    setCarrito(prev => {
      const next = { ...prev }
      const key = next[prodId] ? prodId : Object.keys(next).reverse().find(k => k.startsWith(prodId + '::'))
      if (!key) return prev
      if (next[key] > 1) next[key] -= 1
      else delete next[key]
      return next
    })
  }, [])

  const ActiveCheckoutDrawer = config.checkoutMode === 'whatsapp_por_cotizar' ? LaVitolaCheckoutDrawer : CheckoutDrawer

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32 font-sans relative">
      {/* Botón flotante CTA para contratar demo (Demostraciones) */}
      {isDemo && (
        <div className="fixed bottom-24 right-4 z-40">
          <a
            href={`https://wa.me/529613725386?text=${encodeURIComponent(`¡Hola! Estoy viendo la demostración de "${config.negocio || 'este menú'}" en StreetBoss y quiero contratar este menú digital para mi negocio.`)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#1EBE5A] text-white px-4 py-2.5 rounded-full font-black text-xs shadow-2xl flex items-center gap-2 border-2 border-white animate-bounce active:scale-95 transition-transform"
          >
            <span>⚡ ¡Quiero este Menú!</span>
          </a>
        </div>
      )}

      <MenuHeroProfile config={{ ...config, isDemo }} />

      {catsPlus.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-b border-orange-100/50">
          <h2 className="font-black text-base text-gray-900 mb-3 flex items-center gap-2">
            🔥 Promociones & Especiales
          </h2>
          <div className="flex overflow-x-auto gap-3.5 pb-2 no-scrollbar">
            {catsPlus.flatMap(c => c.productos).filter(p => p.activo).map(prod => (
              <div key={prod.id} className="bg-white min-w-[210px] max-w-[230px] p-3 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2 relative">
                <div className="w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden relative">
                  {prod.foto ? <img src={prod.foto} className="w-full h-full object-cover" alt={prod.nombre} /> : <div className="w-full h-full flex items-center justify-center text-4xl">🌮</div>}
                  <span className="absolute top-2 left-2 bg-orange-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-xs">PROMO</span>
                </div>
                <h3 className="font-extrabold text-xs text-gray-900 leading-snug line-clamp-1">{prod.nombre}</h3>
                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="font-black text-sm text-gray-900 font-mono">${prod.precio}</span>
                  {modo === 'pedir' && (
                    <button onClick={() => agregarProducto(prod)} className="bg-[#FF4B00] text-white text-xs font-black px-3 py-1.5 rounded-full active:scale-95 flex items-center gap-1 shadow-xs">
                      <Plus size={14}/> Agregar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bar de Categorías Flotante estilo iOS */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-20 px-4 py-3 border-b border-gray-200/60 shadow-xs flex overflow-x-auto gap-2 no-scrollbar">
        {catVisible.map(c => {
          const cNameLower = c.nombre.toLowerCase()
          const emoji = cNameLower.includes('taco') ? '🌮' :
                        cNameLower.includes('burger') || cNameLower.includes('hamburguesa') ? '🍔' :
                        cNameLower.includes('pizza') ? '🍕' :
                        cNameLower.includes('alita') || cNameLower.includes('wing') ? '🍗' :
                        cNameLower.includes('bebida') || cNameLower.includes('refresco') ? '🥤' :
                        cNameLower.includes('postre') ? '🍰' : '🍽️'

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => { setCatActiva(c.id); document.getElementById(`cat-${c.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${
                catActiva === c.id ? 'bg-gray-900 text-white shadow-md scale-[1.02]' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              style={catActiva === c.id ? { backgroundColor: config.colorMarca || '#111827', color: '#fff' } : {}}
            >
              <span>{emoji}</span> {c.nombre}
            </button>
          )
        })}
      </div>

      <div className="p-4 space-y-8 max-w-5xl mx-auto">
        {catVisible.map(c => (
          <div key={c.id} id={`cat-${c.id}`} className="scroll-mt-36">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
              {c.nombre}
              {c.tipo === 'promo' && <span className="text-[10px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">🔥 Promo</span>}
              {c.tipo === 'especial' && <span className="text-[10px] font-black text-purple-700 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full">⭐ Especial</span>}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {c.productos.filter(p => p.activo && !p.is_hidden && !p.oculto).map(prod => {
                const cant = admiteExtras && prod.categoria === 'hamburguesas'
                  ? Object.entries(carrito).reduce((count, [id, qty]) => count + (id.startsWith(prod.id + '::') ? qty : 0), 0)
                  : (carrito[prod.id] || 0)
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

      {/* Bar del Carrito Flotante estilo iOS (Screenshot 3) */}
      {modo === 'pedir' && cantidadTotal > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-30 max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-xl p-2.5 pl-5 rounded-3xl shadow-2xl border border-gray-200/80 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total del Pedido</span>
              <span className="text-xl font-black text-gray-900 font-mono">MXN ${subtotal.toFixed(2)}</span>
            </div>
            <button
              type="button"
              disabled={config.is_open === false}
              onClick={() => setCheckoutVis(true)}
              className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all ${
                config.is_open !== false
                  ? 'bg-[#FF4B00] hover:bg-[#FF6A1A] text-white'
                  : 'bg-red-500 text-white opacity-60 cursor-not-allowed'
              }`}
              style={config.is_open !== false ? { backgroundColor: config.colorMarca || '#FF4B00' } : {}}
            >
              <span>{config.is_open !== false ? 'Carrito' : 'Cerrado'}</span>
              <span className="bg-white text-gray-900 w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-xs shadow-xs">
                {cantidadTotal}
              </span>
            </button>
          </div>
        </div>
      )}

      {modo === 'carta' && (
        <div className="pb-12 text-center text-gray-500 text-sm">😊 Tu mesero te atenderá en un momento</div>
      )}

      {admiteExtras && (
        <LaVitolaAddonModal burger={personalizando} options={config.addons || []} onClose={() => setPersonalizando(null)} onAdd={confirmarHamburguesa} />
      )}

      <ActiveCheckoutDrawer
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
