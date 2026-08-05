// ─────────────────────────────────────────────────────────────────────────────
// SEPOMEX — Módulo exclusivo para Tuxtla Gutiérrez, Chiapas
// 53 Códigos Postales · 507 Colonias y Asentamientos Oficiales
// ─────────────────────────────────────────────────────────────────────────────

let cacheTuxtla = null

export async function cargarDatosTuxtla() {
  if (cacheTuxtla) return cacheTuxtla
  try {
    const res = await fetch('/data/sepomex-tuxtla.json')
    if (!res.ok) throw new Error('No se pudo cargar SEPOMEX Tuxtla')
    cacheTuxtla = await res.json()
    return cacheTuxtla
  } catch (err) {
    console.warn('[SEPOMEX Tuxtla] Error cargando JSON, usando fallback:', err)
    return null
  }
}

/**
 * Busca colonias y datos para un CP de Tuxtla Gutiérrez
 */
export async function buscarPorCP(cp) {
  if (!cp || String(cp).trim().length !== 5) return null
  const datos = await cargarDatosTuxtla()
  if (!datos || !datos.codigos) return null

  const colonias = datos.codigos[String(cp).trim()]
  if (!colonias) return null

  return {
    estado: datos.estado,
    municipio: datos.municipio,
    ciudad: datos.ciudad,
    colonias: colonias
  }
}

/**
 * Retorna todas las colonias de Tuxtla Gutiérrez agrupadas por CP
 */
export async function obtenerTodosLosCodigosYColonias() {
  const datos = await cargarDatosTuxtla()
  if (!datos || !datos.codigos) return []
  
  const lista = []
  Object.entries(datos.codigos).forEach(([cp, colonias]) => {
    colonias.forEach(colonia => {
      lista.push({
        cp,
        colonia,
        municipio: datos.municipio,
        estado: datos.estado
      })
    })
  })
  return lista
}

/**
 * Filtra colonias por nombre o CP
 */
export async function buscarColonias(query) {
  if (!query || !query.trim()) return []
  const q = query.toLowerCase().trim()
  const todos = await obtenerTodosLosCodigosYColonias()
  
  return todos.filter(item => 
    item.colonia.toLowerCase().includes(q) || 
    item.cp.includes(q)
  ).slice(0, 30) // límite de 30 resultados
}

export const buscarPorColonia = buscarColonias

/**
 * Verifica si un CP y Colonia están cubiertos en las zonas configuradas por un negocio
 */
export function verificarCobertura(cp, colonia, zonas = []) {
  if (!zonas || zonas.length === 0) {
    return { cubierto: true, precioEnvio: 30, razon: 'tarifa_base' }
  }

  const cpLimpio = String(cp || '').trim()
  const coloniaLimpia = String(colonia || '').toLowerCase().trim()

  const zonaEncontrada = zonas.find(z => {
    // V3 object format: postal_code, settlement_name, delivery_fee
    if (z.postal_code || z.settlement_name) {
      const matchCp = !z.postal_code || String(z.postal_code).trim() === cpLimpio
      const matchCol = !z.settlement_name || String(z.settlement_name).toLowerCase().trim() === coloniaLimpia
      return matchCp && matchCol
    }

    // Format: cp, colonias, precioEnvio
    if (String(z.cp || '').trim() !== cpLimpio) return false
    if (!z.colonias || z.colonias.length === 0) return true
    return z.colonias.some(c => String(c).toLowerCase().trim() === coloniaLimpia)
  })

  if (!zonaEncontrada) {
    return { cubierto: false, precioEnvio: 0, razon: 'fuera_de_cobertura' }
  }

  const fee = Number(zonaEncontrada.delivery_fee ?? zonaEncontrada.precioEnvio ?? 30)
  return {
    cubierto: true,
    precioEnvio: fee,
    tiempoEstimado: zonaEncontrada.estimated_minutes ? `${zonaEncontrada.estimated_minutes} min` : (zonaEncontrada.tiempoEstimado || '30-45 min'),
    pedidoMinimo: Number(zonaEncontrada.minimum_order ?? zonaEncontrada.pedidoMinimo ?? 0)
  }
}
