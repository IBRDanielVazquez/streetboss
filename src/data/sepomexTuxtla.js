// ─────────────────────────────────────────────────────────────────────────────
// SEPOMEX — Módulo oficial exclusivo para Tuxtla Gutiérrez, Chiapas
// 53 Códigos Postales · 507 Colonias y Asentamientos Oficiales
// ─────────────────────────────────────────────────────────────────────────────
import sepomexRawData from '../../public/data/sepomex-tuxtla.json'

let dataTuxtla = sepomexRawData

// Helper: Normalizador de texto (Quita acentos, convierte a minúsculas)
export function normalizeText(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Retorna la lista plana de las 507 colonias de Tuxtla Gutiérrez
 */
export function getFlatTuxtlaSettlements() {
  if (!dataTuxtla || !dataTuxtla.codigos) return []
  const list = []
  Object.entries(dataTuxtla.codigos).forEach(([cp, colonias]) => {
    colonias.forEach((colonia, idx) => {
      list.push({
        id: `tuxtla_${cp}_${idx}`,
        cp: String(cp).trim(),
        colonia: colonia.trim(),
        tipo: 'Colonia',
        municipio: dataTuxtla.municipio || 'Tuxtla Gutiérrez',
        ciudad: dataTuxtla.ciudad || 'Tuxtla Gutiérrez',
        estado: dataTuxtla.estado || 'Chiapas',
        colonia_norm: normalizeText(colonia)
      })
    })
  })
  return list
}

const ALL_SETTLEMENTS = getFlatTuxtlaSettlements()

/**
 * Búsqueda síncrona instantánea por CP o Colonia
 */
export function buscarColoniasSync(query) {
  if (!query || !String(query).trim()) return []
  const qNorm = normalizeText(query)
  const qClean = String(query).trim()

  return ALL_SETTLEMENTS.filter(item => {
    const matchCP = item.cp.includes(qClean)
    const matchColonia = item.colonia_norm.includes(qNorm)
    return matchCP || matchColonia
  }).slice(0, 50)
}

/**
 * Búsqueda síncrona instantánea por CP
 */
export function buscarPorCPSync(cp) {
  if (!cp || !String(cp).trim()) return []
  const qClean = String(cp).trim()
  return ALL_SETTLEMENTS.filter(item => item.cp.includes(qClean))
}

// Exportaciones Async para mantener compatibilidad
export async function cargarDatosTuxtla() {
  return dataTuxtla
}

export async function buscarPorCP(cp) {
  return buscarPorCPSync(cp)
}

export async function buscarColonias(query) {
  return buscarColoniasSync(query)
}

export const buscarPorColonia = buscarColonias
export const buscarPorColoniaSync = buscarColoniasSync

/**
 * Verifica si un CP y Colonia están cubiertos en las zonas configuradas por un negocio
 */
export function verificarCobertura(cp, colonia, zonas = []) {
  if (!zonas || zonas.length === 0) {
    return { cubierto: true, precioEnvio: 30, razon: 'tarifa_base' }
  }

  const cpLimpio = String(cp || '').trim()
  const coloniaNorm = normalizeText(colonia)

  const zonaEncontrada = zonas.find(z => {
    if (z.postal_code || z.settlement_name) {
      const matchCp = !z.postal_code || String(z.postal_code).trim() === cpLimpio
      const matchCol = !z.settlement_name || normalizeText(z.settlement_name) === coloniaNorm
      return matchCp && matchCol
    }

    if (String(z.cp || '').trim() !== cpLimpio) return false
    if (!z.colonias || z.colonias.length === 0) return true
    return z.colonias.some(c => normalizeText(c) === coloniaNorm)
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
