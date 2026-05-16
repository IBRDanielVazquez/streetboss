import { useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function useRol() {
  const { slug } = useApp()
  const { pathname } = useLocation()
  const segmentos = pathname.split('/').filter(Boolean)
  
  // URL: /:slug/:rol/...
  const rolSegmento = segmentos[1] || 'mesero'
  const subSegmento = segmentos[2]
  
  const SUBRUTAS_CONOCIDAS = ['pedido', 'cobro', 'mesas', 'reporte', 'config']
  
  let rol = rolSegmento
  let meseroSlug = null
  
  // Si estamos en /mesero/... y el siguiente segmento no es una subruta conocida, es un meseroSlug
  if (rolSegmento === 'mesero' && subSegmento && !SUBRUTAS_CONOCIDAS.includes(subSegmento)) {
    meseroSlug = subSegmento
  }

  const mapa = {
    admin:  { rol: 'admin',  basePath: `/${slug}/admin`,  meseroSlug },
    caja:   { rol: 'caja',   basePath: `/${slug}/caja`,   meseroSlug },
    cocina: { rol: 'cocina', basePath: `/${slug}/cocina`, meseroSlug },
    mesero: { rol: 'mesero', basePath: meseroSlug ? `/${slug}/mesero/${meseroSlug}` : `/${slug}/mesero`, meseroSlug },
  }

  return mapa[rolSegmento] || mapa.mesero
}
