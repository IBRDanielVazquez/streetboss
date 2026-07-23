// ─────────────────────────────────────────────────────────────────────────────
// Contexto del sistema de pruebas demo.
// Dos piezas independientes:
//  1) DemoTrialsProvider/useDemoTrials → registro ADMIN (prospectos + pruebas)
//  2) useTrialData(trialId)            → datos editables de UNA prueba
// Todo en localStorage. Sin Supabase, sin backend, sin .env.
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect } from 'react'
import {
  TRIALS_STORAGE_KEY, trialDataKey, trialDeletedKey, uid,
  buscarDemo, buscarDemoPorClave, claveDeTrialId,
  generarTrialId, codigoAccesoDeTrialId, crearDatosPrueba,
} from '../data/demoTrials'

// ══════════════════════════════════════════════════════════════════════════
// 1) Registro ADMIN: prospectos + lista de pruebas creadas
// ══════════════════════════════════════════════════════════════════════════
const DemoTrialsContext = createContext(null)

function cargarRegistro() {
  try {
    const raw = localStorage.getItem(TRIALS_STORAGE_KEY)
    if (raw) {
      const datos = JSON.parse(raw)
      return {
        prospectos: Array.isArray(datos.prospectos) ? datos.prospectos : [],
        pruebas: Array.isArray(datos.pruebas) ? datos.pruebas.map(p => ({ status: 'activa', ...p })) : [],
      }
    }
  } catch { /* datos corruptos → empezar limpio */ }
  return { prospectos: [], pruebas: [] }
}

function normalizarDatosPrueba(datos, trialId) {
  if (!datos) return datos
  const codigoAcceso = datos.codigoAcceso || codigoAccesoDeTrialId(trialId)
  return {
    ...datos,
    codigoAcceso,
    status: datos.status || 'activa',
    negocio: {
      logo: '',
      servicioDomicilio: true,
      modoEnvio: 'pendiente',
      costoEnvio: 30,
      costoEnvioKm: 12,
      ...(datos.negocio || {}),
      redes: {
        instagram: '',
        facebook: '',
        tiktok: '',
        ...((datos.negocio && datos.negocio.redes) || {}),
      },
    },
  }
}

export function DemoTrialsProvider({ children }) {
  const [registro, setRegistro] = useState(cargarRegistro)

  // Persistir cada cambio
  useEffect(() => {
    try { localStorage.setItem(TRIALS_STORAGE_KEY, JSON.stringify(registro)) } catch {}
  }, [registro])

  // ── Prospectos ──────────────────────────────────────────────────────────
  // prospecto: { id, nombre, whatsapp, nombreNegocio, demoId, notas, estado, creado }
  const crearProspecto = (datos) => {
    const nuevo = {
      id: uid(),
      nombre: datos.nombre.trim(),
      whatsapp: (datos.whatsapp || '').trim(),
      nombreNegocio: (datos.nombreNegocio || '').trim(),
      demoId: datos.demoId || null,
      canal: datos.canal || 'WhatsApp',
      prioridad: datos.prioridad || 'Media',
      proximoSeguimiento: datos.proximoSeguimiento || '',
      notas: (datos.notas || '').trim(),
      estado: 'Nuevo',
      creado: new Date().toISOString().slice(0, 10),
    }
    setRegistro(r => ({ ...r, prospectos: [nuevo, ...r.prospectos] }))
    return nuevo
  }

  const editarProspecto = (id, cambios) =>
    setRegistro(r => ({ ...r, prospectos: r.prospectos.map(p => p.id === id ? { ...p, ...cambios } : p) }))

  const cambiarEstadoProspecto = (id, estado) => editarProspecto(id, { estado })

  // ── Pruebas ─────────────────────────────────────────────────────────────
  // prueba (metadata): { trialId, demoId, demoNombre, prospectoId, prospectoNombre, nombreNegocio, creado }
  // Los datos EDITABLES viven aparte en sb_demo_trial_data_<trialId>.
  const crearPrueba = (prospectoId, demoId) => {
    const demo = buscarDemo(demoId)
    if (!demo) return null
    const prospecto = registro.prospectos.find(p => p.id === prospectoId) || null
    const nombreNegocio = prospecto?.nombreNegocio || demo.nombre
    const trialId = generarTrialId(demo, nombreNegocio)
    const codigoAcceso = codigoAccesoDeTrialId(trialId)

    // Sembrar los datos editables de la prueba
    try { localStorage.setItem(trialDataKey(trialId), JSON.stringify(crearDatosPrueba(demo, nombreNegocio, codigoAcceso))) } catch {}

    const meta = {
      trialId,
      codigoAcceso,
      demoId: demo.id,
      demoNombre: demo.nombre,
      prospectoId: prospecto?.id || null,
      prospectoNombre: prospecto?.nombre || 'Sin asignar',
      nombreNegocio: nombreNegocio,
      status: 'activa',
      creado: new Date().toISOString().slice(0, 10),
    }
    setRegistro(r => ({
      ...r,
      pruebas: [meta, ...r.pruebas],
      // Al crear la prueba, el prospecto pasa automáticamente a "Prueba enviada"
      prospectos: r.prospectos.map(p => p.id === prospectoId ? { ...p, estado: 'Prueba enviada' } : p),
    }))
    return meta
  }

  const cambiarEstadoPrueba = (trialId, status) => {
    setRegistro(r => ({
      ...r,
      pruebas: r.pruebas.map(p => p.trialId === trialId ? { ...p, status } : p),
    }))
    try {
      const key = trialDataKey(trialId)
      const raw = localStorage.getItem(key)
      if (raw) {
        const datos = JSON.parse(raw)
        localStorage.setItem(key, JSON.stringify({ ...datos, status }))
      }
    } catch {}
  }

  const eliminarPrueba = (trialId) => {
    setRegistro(r => ({ ...r, pruebas: r.pruebas.filter(p => p.trialId !== trialId) }))
    try {
      localStorage.removeItem(trialDataKey(trialId))
      localStorage.setItem(trialDeletedKey(trialId), '1')
    } catch {}
  }

  const valor = {
    ...registro,
    crearProspecto,
    editarProspecto,
    cambiarEstadoProspecto,
    crearPrueba,
    cambiarEstadoPrueba,
    eliminarPrueba,
  }
  return <DemoTrialsContext.Provider value={valor}>{children}</DemoTrialsContext.Provider>
}

export const useDemoTrials = () => {
  const ctx = useContext(DemoTrialsContext)
  if (!ctx) throw new Error('useDemoTrials debe usarse dentro de <DemoTrialsProvider>')
  return ctx
}

// ══════════════════════════════════════════════════════════════════════════
// 2) Datos editables de UNA prueba (lado prospecto)
//    Si el navegador no tiene la prueba (ej. otro dispositivo), se auto-siembra
//    una copia fresca de la demo base codificada en el trialId.
// ══════════════════════════════════════════════════════════════════════════
export function useTrialData(trialId) {
  const [datos, setDatos] = useState(() => {
    try {
      if (localStorage.getItem(trialDeletedKey(trialId))) return null
      const raw = localStorage.getItem(trialDataKey(trialId))
      if (raw) return normalizarDatosPrueba(JSON.parse(raw), trialId)
    } catch {}
    // Auto-siembra: prueba local no sincronizada entre dispositivos
    const demo = buscarDemoPorClave(claveDeTrialId(trialId))
    return demo ? crearDatosPrueba(demo, '', codigoAccesoDeTrialId(trialId)) : null
  })

  // Persistir cada edición
  useEffect(() => {
    if (datos) {
      try { localStorage.setItem(trialDataKey(trialId), JSON.stringify(datos)) } catch {}
    }
  }, [trialId, datos])

  if (!datos) return { valido: false }

  // ── Negocio ─────────────────────────────────────────────────────────────
  const editarNegocio = (cambios) => setDatos(d => ({ ...d, negocio: { ...d.negocio, ...cambios } }))

  // ── Categorías ──────────────────────────────────────────────────────────
  const crearCategoria = (nombre) =>
    setDatos(d => ({ ...d, menu: [...d.menu, { id: uid(), nombre: nombre.trim(), visible: true, productos: [] }] }))

  const editarCategoria = (catId, cambios) =>
    setDatos(d => ({ ...d, menu: d.menu.map(c => c.id === catId ? { ...c, ...cambios } : c) }))

  const toggleCategoria = (catId) =>
    setDatos(d => ({ ...d, menu: d.menu.map(c => c.id === catId ? { ...c, visible: !c.visible } : c) }))

  const moverCategoria = (catId, dir) =>
    setDatos(d => {
      const i = d.menu.findIndex(c => c.id === catId)
      const j = i + dir
      if (i < 0 || j < 0 || j >= d.menu.length) return d
      const menu = [...d.menu]
      ;[menu[i], menu[j]] = [menu[j], menu[i]]
      return { ...d, menu }
    })

  // ── Productos ───────────────────────────────────────────────────────────
  const crearProducto = (catId, p) =>
    setDatos(d => ({
      ...d,
      menu: d.menu.map(c => c.id === catId
        ? { ...c, productos: [...c.productos, { id: uid(), nombre: p.nombre.trim(), precio: Number(p.precio) || 0, descripcion: (p.descripcion || '').trim(), agotado: false, activo: true, foto: p.foto || null }] }
        : c),
    }))

  const editarProducto = (catId, prodId, cambios) =>
    setDatos(d => ({
      ...d,
      menu: d.menu.map(c => c.id === catId
        ? { ...c, productos: c.productos.map(p => p.id === prodId ? { ...p, ...cambios } : p) }
        : c),
    }))

  return {
    valido: true,
    demo: buscarDemo(datos.demoId),
    trialId,
    codigoAcceso: datos.codigoAcceso || codigoAccesoDeTrialId(trialId),
    status: datos.status || 'activa',
    negocio: datos.negocio,
    menu: datos.menu,
    creado: datos.creado,
    editarNegocio,
    crearCategoria, editarCategoria, toggleCategoria, moverCategoria,
    crearProducto, editarProducto,
  }
}

// ── Utilidad: reducir imagen a máx 800px y convertir a base64 (JPEG 80%) ────
// Mismo enfoque que el admin real (FileReader → dataURL) pero comprimido para
// no saturar el límite (~5 MB) de localStorage.
export function comprimirImagen(file, maxLado = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.onload = (ev) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Archivo de imagen no válido'))
      img.onload = () => {
        const escala = Math.min(1, maxLado / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * escala)
        canvas.height = Math.round(img.height * escala)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}
