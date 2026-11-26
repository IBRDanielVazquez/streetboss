import { useEffect, useMemo, useState } from 'react'
import MenuDigital from './MenuDigital'

const CATALOG_URL = '/menu/la-vitola/menu.js'
const MENU_FOTO = '/menu/la-vitola/assets/fotos/carta-la-vitola.jpeg'

// Esta vista utiliza los mismos componentes que los diez demos oficiales.
// La carta publicada de La Vitola sigue siendo la fuente de verdad.
function parseCatalog(body) {
  const match = body.match(/^\s*window\.STREETBOSS_MENU\s*=\s*(\{[\s\S]*\})\s*;?\s*$/)
  if (!match) throw new Error('Formato de catálogo incorrecto')
  const data = JSON.parse(match[1])
  if (!Array.isArray(data.categorias) || !Array.isArray(data.productos)) {
    throw new Error('El menú no contiene categorías o productos')
  }
  return data
}

const icons = {
  tacos: '🌮',
  hamburguesas: '🍔',
  extras: '🍟',
  bebidas: '🥤',
}

function toDemoMenu(catalog) {
  return catalog.categorias.map(cat => ({
    id: cat.id,
    nombre: cat.nombre,
    visible: cat.visible !== false,
    tipo: 'normal',
    productos: catalog.productos
      .filter(product => product.categoria === cat.id)
      .map(product => ({
        id: product.id,
        nombre: product.nombre,
        precio: Number(product.precio),
        descripcion: product.descripcion || '',
        foto: product.foto || product.imagen || '',
        emoji: icons[cat.id] || '🍽️',
        activo: product.activo !== false,
        agotado: product.agotado === true,
        oculto: product.oculto === true,
      })),
  }))
}

function toDemoConfig(catalog) {
  const r = catalog.restaurante || {}
  const delivery = (catalog.modalidades || []).includes('domicilio')
  return {
    trialId: 'la-vitola',
    negocio: r.nombre || 'La Vitola',
    logo: MENU_FOTO,
    banner: '',
    colorMarca: '#FF4B00',
    whatsapp: r.whatsapp || '',
    telefono: r.whatsapp || '',
    foodType: r.descripcion || 'Tacos con papa y hamburguesas',
    direccion: r.direccion || '',
    horarios: r.horario || '',
    redes: {},
    // No afirmamos que esté abierto ahora sin consultar un horario operativo.
    hideAvailabilityBadge: true,
    // El precio de reparto no está definido: nunca presentarlo como gratis.
    envio: { activo: delivery, modoEnvio: 'por_cotizar', costoEnvio: null, zonas: [] },
    checkoutMode: 'whatsapp_por_cotizar',
  }
}

export default function LaVitolaPublicMenu() {
  const [catalog, setCatalog] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetch(CATALOG_URL, { cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error('No se pudo descargar el menú')
        return response.text()
      })
      .then(body => {
        const data = parseCatalog(body)
        if (active) setCatalog(data)
      })
      .catch(() => {
        if (active) setError('No fue posible cargar la carta. Actualiza la página para intentarlo otra vez.')
      })
    return () => { active = false }
  }, [])

  const menu = useMemo(() => catalog ? toDemoMenu(catalog) : [], [catalog])
  const config = useMemo(() => catalog ? toDemoConfig(catalog) : {}, [catalog])

  if (!catalog) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-black text-gray-900 mb-3">La Vitola</h1>
          <p className="text-sm text-gray-600">{error || 'Cargando menú…'}</p>
          {error && <button className="mt-4 bg-[#FF4B00] text-white font-black rounded-xl px-6 py-3" onClick={() => window.location.reload()}>Reintentar</button>}
        </div>
      </main>
    )
  }

  return <MenuDigital isDemo={false} demoMenu={menu} demoConfig={config} modo="pedir" />
}
