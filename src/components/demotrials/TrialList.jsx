// Listado de PRUEBAS creadas con su URL local copiable.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, ExternalLink, Calendar, Hourglass, User, Store, KeyRound, Send, Pause, Ban, Trash2, Play } from 'lucide-react'
import { useDemoTrials } from '../../context/DemoTrialsContext'
import { buscarDemo, codigoAccesoDeTrialId } from '../../data/demoTrials'
import { copiarTexto } from './ProspectForm'

const COLOR_ESTADO = {
  'Nuevo':          'bg-blue-500/15 text-blue-400 border border-blue-500/10',
  'Contactado':     'bg-purple-500/15 text-purple-400 border border-purple-500/10',
  'Prueba enviada': 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/10',
  'Ganado':         'bg-green-500/15 text-green-400 border border-green-500/10',
  'Perdido':        'bg-red-500/15 text-red-400 border border-red-500/10',
}

const COLOR_STATUS_PRUEBA = {
  activa: 'bg-green-500/15 text-green-400 border border-green-500/10',
  pausada: 'bg-amber-500/15 text-amber-400 border border-amber-500/10',
  suspendida: 'bg-red-500/15 text-red-400 border border-red-500/10',
}

export default function TrialList() {
  const { pruebas, prospectos, cambiarEstadoPrueba, eliminarPrueba } = useDemoTrials()
  const [copiado, setCopiado] = useState(null) // null | 'dash-id' | 'menu-id'

  const urlDashboard = (trialId) => `${window.location.origin}/dashboard/${trialId}`
  const urlMenu = (trialId) => `${window.location.origin}/menu/${trialId}`

  const copiar = async (url, key) => {
    if (await copiarTexto(url)) {
      setCopiado(key)
      setTimeout(() => setCopiado(c => (c === key ? null : c)), 1500)
    }
  }

  if (pruebas.length === 0) {
    return <p className="text-gray-600 text-center py-8 text-sm">Aún no hay pruebas. Registra un interesado y créale una.</p>
  }

  return (
    <div className="space-y-4">
      {pruebas.map(t => {
        const demo = buscarDemo(t.demoId)
        const prospecto = prospectos.find(p => p.id === t.prospectoId)
        const estado = prospecto ? prospecto.estado : 'Nuevo'
        const status = t.status || 'activa'
        
        // Cómputo de expiración (7 días)
        const diasTranscurridos = t.creado ? Math.floor((Date.now() - new Date(t.creado).getTime()) / (1000 * 60 * 60 * 24)) : 0
        const diasRestantes = Math.max(0, 7 - diasTranscurridos)
        const expirado = diasRestantes <= 0
        
        const fechaCreacion = t.creado ? new Date(t.creado).toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'short',
        }) : '—'
        const fechaExpiracion = t.creado ? new Date(new Date(t.creado).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'short',
        }) : '—'
        const codigoAcceso = t.codigoAcceso || codigoAccesoDeTrialId(t.trialId) || t.trialId
        const mensajeCliente = `¡Hola! El menú digital de ${t.nombreNegocio || t.demoNombre} en StreetBoss ya está listo para configurarse (periodo inicial de 7 días activo).\n\n1. Panel de administración para editar (productos, precios, dirección y WhatsApp):\n${urlDashboard(t.trialId)}\n\nTu código de acceso: ${codigoAcceso}\n\n2. Menú de ventas público para tus clientes:\n${urlMenu(t.trialId)}`

        return (
          <div key={t.trialId} className="bg-dark2 border border-white/5 rounded-3xl p-5 md:p-6 shadow-xl transition-all hover:border-white/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Info principal: Negocio, Contacto y Demo base */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-white font-black text-base md:text-lg flex items-center gap-2">
                    <Store size={18} className="text-primary" />
                    {t.nombreNegocio || t.demoNombre}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${COLOR_ESTADO[estado] || 'bg-dark3 text-gray-400'}`}>
                    {estado}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${COLOR_STATUS_PRUEBA[status] || COLOR_STATUS_PRUEBA.activa}`}>
                    Página {status}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/10 flex items-center gap-1">
                    <KeyRound size={11} /> Código {codigoAcceso}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-500" />
                    <span>Contacto: <strong className="text-white">{t.prospectoNombre}</strong> {prospecto?.whatsapp && `(${prospecto.whatsapp})`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{demo?.emoji || '🍽️'}</span>
                    <span>Demo base: <strong className="text-white">{t.demoNombre}</strong></span>
                  </div>
                </div>
              </div>

              {/* Tiempos de prueba */}
              <div className="flex flex-wrap items-center gap-3 bg-dark3/50 px-4 py-3 rounded-2xl border border-white/5 lg:w-72 justify-between">
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>Creado: <strong className="text-white">{fechaCreacion}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-red-500/80" />
                    <span>Expira: <strong className="text-white">{fechaExpiracion}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-xs text-gray-400">
                    <Hourglass size={12} className={expirado ? 'text-red-400' : 'text-primary'} />
                    <span>Días restantes</span>
                  </div>
                  <span className={`text-base font-black ${expirado ? 'text-red-400' : 'text-primary'}`}>
                    {expirado ? 'Expirado ❌' : `${diasRestantes} días ⏳`}
                  </span>
                </div>
              </div>

            </div>

            {/* Links del cliente y del menú público */}
            <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Dashboard del cliente */}
              <div className="bg-dark3/30 border border-white/5 rounded-2xl p-3.5 space-y-2 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-wider">1. Panel de administración (Dashboard)</span>
                  <span className="text-primary font-mono text-[10px]">/dashboard/{t.trialId}</span>
                </div>
                <p className="text-gray-400 text-xs font-mono truncate bg-dark3 px-3 py-1.5 rounded-lg select-all">{urlDashboard(t.trialId)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copiar(urlDashboard(t.trialId), `dash-${t.trialId}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-dark3 text-gray-300 hover:text-white text-xs font-bold py-2 rounded-xl transition-colors border border-white/5"
                  >
                    {copiado === `dash-${t.trialId}` ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    {copiado === `dash-${t.trialId}` ? 'Copiado' : 'Copiar link'}
                  </button>
                  <Link
                    to={`/dashboard/${t.trialId}`}
                    className="flex items-center justify-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    <ExternalLink size={13} /> Abrir
                  </Link>
                </div>
              </div>

              {/* Menú público */}
              <div className="bg-dark3/30 border border-white/5 rounded-2xl p-3.5 space-y-2 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-wider">2. Menú de Compras (Público)</span>
                  <span className="text-green-400 font-mono text-[10px]">/menu/{t.trialId}</span>
                </div>
                <p className="text-gray-400 text-xs font-mono truncate bg-dark3 px-3 py-1.5 rounded-lg select-all">{urlMenu(t.trialId)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copiar(urlMenu(t.trialId), `menu-${t.trialId}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-dark3 text-gray-300 hover:text-white text-xs font-bold py-2 rounded-xl transition-colors border border-white/5"
                  >
                    {copiado === `menu-${t.trialId}` ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    {copiado === `menu-${t.trialId}` ? 'Copiado' : 'Copiar link'}
                  </button>
                  <Link
                    to={`/menu/${t.trialId}`}
                    className="flex items-center justify-center gap-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    <ExternalLink size={13} /> Abrir
                  </Link>
                </div>
              </div>

            </div>

            <button
              onClick={() => copiar(mensajeCliente, `msg-${t.trialId}`)}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-primary text-dark hover:opacity-90 text-xs font-black py-3 rounded-xl transition-opacity"
            >
              {copiado === `msg-${t.trialId}` ? <Check size={14} /> : <Send size={14} />}
              {copiado === `msg-${t.trialId}` ? 'Mensaje copiado' : 'Copiar mensaje para enviar al cliente'}
            </button>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => cambiarEstadoPrueba(t.trialId, 'activa')}
                disabled={status === 'activa'}
                className="flex items-center justify-center gap-1.5 bg-green-500/10 text-green-400 disabled:opacity-40 text-xs font-bold py-2.5 rounded-xl border border-green-500/10"
              >
                <Play size={13} /> Reactivar
              </button>
              <button
                onClick={() => cambiarEstadoPrueba(t.trialId, 'pausada')}
                disabled={status === 'pausada'}
                className="flex items-center justify-center gap-1.5 bg-amber-500/10 text-amber-400 disabled:opacity-40 text-xs font-bold py-2.5 rounded-xl border border-amber-500/10"
              >
                <Pause size={13} /> Pausar página
              </button>
              <button
                onClick={() => cambiarEstadoPrueba(t.trialId, 'suspendida')}
                disabled={status === 'suspendida'}
                className="flex items-center justify-center gap-1.5 bg-red-500/10 text-red-400 disabled:opacity-40 text-xs font-bold py-2.5 rounded-xl border border-red-500/10"
              >
                <Ban size={13} /> Suspender
              </button>
              <button
                onClick={() => {
                  if (confirm(`¿Eliminar la prueba de ${t.nombreNegocio || t.demoNombre}? Esta acción quita sus links de este navegador.`)) {
                    eliminarPrueba(t.trialId)
                  }
                }}
                className="flex items-center justify-center gap-1.5 bg-dark3 text-gray-400 hover:text-red-400 text-xs font-bold py-2.5 rounded-xl border border-white/5"
              >
                <Trash2 size={13} /> Eliminar
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
