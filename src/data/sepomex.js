// ─────────────────────────────────────────────────────────────────────────────
// SEPOMEX — Módulo de consulta de códigos postales de México (Chiapas primero)
// Carga el JSON de forma lazy (solo cuando se necesita) para no impactar el
// bundle inicial. Funciona 100% offline una vez cargado.
// ─────────────────────────────────────────────────────────────────────────────

let cache = null

async function cargarDatos() {
  if (cache) return cache
  try {
    const res = await fetch('/data/sepomex-chiapas.json')
    if (!res.ok) throw new Error('No se pudo cargar SEPOMEX')
    cache = await res.json()
    return cache
  } catch (err) {
    console.warn('[SEPOMEX] No se pudieron cargar los datos:', err)
    return null
  }
}

/**
 * Busca información de un código postal.
 * @param {string} cp - Código postal de 5 dígitos
 * @returns {Promise<{estado: string, municipio: string, colonias: string[]} | null>}
 */
export async function buscarPorCP(cp) {
  if (!cp || cp.length !== 5) return null
  const datos = await cargarDatos()
  if (!datos) return null

  const entrada = datos.codigos[cp]
  if (!entrada) return null

  return {
    estado: datos.estado,
    municipio: entrada.municipio,
    colonias: entrada.colonias || [],
  }
}

/**
 * Verifica si un CP + colonia está dentro de las zonas de entrega configuradas.
 * @param {string} cp
 * @param {string} colonia
 * @param {Array<{cp: string, colonias: string[], precioEnvio: number}>} zonas
 * @returns {{ cubierto: boolean, precioEnvio: number }}
 */
export function verificarCobertura(cp, colonia, zonas = []) {
  if (!zonas || zonas.length === 0) {
    // Sin zonas configuradas = sin restricción (modo legado)
    return { cubierto: true, precioEnvio: 0 }
  }

  const zona = zonas.find(z => z.cp === cp)
  if (!zona) return { cubierto: false, precioEnvio: 0 }

  // Si hay colonias definidas, verificar que la colonia esté incluida
  if (zona.colonias && zona.colonias.length > 0) {
    const coloniaIncluida = zona.colonias.some(
      c => c.toLowerCase().trim() === (colonia || '').toLowerCase().trim()
    )
    if (!coloniaIncluida) return { cubierto: false, precioEnvio: 0 }
  }

  return { cubierto: true, precioEnvio: Number(zona.precioEnvio) || 0 }
}
