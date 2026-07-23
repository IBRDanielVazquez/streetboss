// ─────────────────────────────────────────────────────────────────────────────
// PARTE 1 — Dashboard interno Street Boss (/demo/admin)
// Pipeline de interesados + creación de pruebas + demos oficiales con mensaje
// de WhatsApp preparado. 100% local (localStorage), sin AppProvider ni Supabase.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Rocket, Users, FlaskConical, CalendarDays, Pause, Ban } from 'lucide-react'
import { DemoTrialsProvider, useDemoTrials } from '../context/DemoTrialsContext'
import { ESTADOS_PROSPECTO, buscarDemo } from '../data/demoTrials'
import ProspectForm, { ModalDemo } from '../components/demotrials/ProspectForm'
import DemoSelector from '../components/demotrials/DemoSelector'
import TrialList from '../components/demotrials/TrialList'

// Colores del badge según estado del prospecto
const COLOR_ESTADO = {
  'Nuevo':          'bg-blue-500/15 text-blue-400',
  'Contactado':     'bg-purple-500/15 text-purple-400',
  'Prueba enviada': 'bg-yellow-500/15 text-yellow-400',
  'Ganado':         'bg-green-500/15 text-green-400',
  'Perdido':        'bg-red-500/15 text-red-400',
}

function SeccionTitulo({ Icono, titulo, extra }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icono size={18} className="text-primary" />
      <h2 className="text-white font-black text-lg flex-1">{titulo}</h2>
      {extra}
    </div>
  )
}

function AdminInterno() {
  const { prospectos, pruebas, cambiarEstadoProspecto, crearPrueba } = useDemoTrials()
  const [modalProspecto, setModalProspecto] = useState(null)  // null | 'nuevo' | prospecto
  const [modalPrueba, setModalPrueba] = useState(null)        // null | prospecto
  const [demoElegida, setDemoElegida] = useState(null)
  const [pruebaCreada, setPruebaCreada] = useState(null)

  const lanzarPrueba = () => {
    if (!modalPrueba || !demoElegida) return
    const meta = crearPrueba(modalPrueba.id, demoElegida)
    setModalPrueba(null)
    setDemoElegida(null)
    setPruebaCreada(meta)
  }

  const pruebasActivas = pruebas.filter(p => (p.status || 'activa') === 'activa').length
  const pruebasPausadas = pruebas.filter(p => p.status === 'pausada').length
  const pruebasSuspendidas = pruebas.filter(p => p.status === 'suspendida').length
  const seguimientosPendientes = prospectos.filter(p => p.proximoSeguimiento).length

  return (
    <div className="min-h-screen bg-dark">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-dark/90 backdrop-blur border-b border-white/5 px-4 md:px-8 py-4 flex items-center gap-3">
        <div>
          <h1 className="text-white font-black text-xl leading-none">StreetBoss <span className="text-primary">HQ</span></h1>
          <p className="text-gray-600 text-xs mt-0.5">Pipeline de demos y pruebas</p>
        </div>
        <span className="ml-auto text-[10px] font-bold uppercase tracking-widest bg-white/5 text-gray-500 px-3 py-1 rounded-full">
          Demo de menú digital · No conectado a operación real
        </span>
      </header>

      <main className="p-4 md:p-8 max-w-5xl mx-auto space-y-10">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-dark2 border border-white/5 rounded-2xl p-4">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Prospectos</p>
            <p className="text-white font-black text-2xl mt-1">{prospectos.length}</p>
          </div>
          <div className="bg-dark2 border border-green-500/10 rounded-2xl p-4">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Pruebas activas</p>
            <p className="text-green-400 font-black text-2xl mt-1">{pruebasActivas}</p>
          </div>
          <div className="bg-dark2 border border-amber-500/10 rounded-2xl p-4">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Pause size={12} /> Pausadas</p>
            <p className="text-amber-400 font-black text-2xl mt-1">{pruebasPausadas}</p>
          </div>
          <div className="bg-dark2 border border-red-500/10 rounded-2xl p-4">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Ban size={12} /> Suspendidas</p>
            <p className="text-red-400 font-black text-2xl mt-1">{pruebasSuspendidas}</p>
          </div>
        </section>

        {/* ── Interesados / Prospectos ── */}
        <section>
          <SeccionTitulo
            Icono={Users}
            titulo={`Interesados (${prospectos.length})`}
            extra={
              <button onClick={() => setModalProspecto('nuevo')} className="flex items-center gap-2 bg-primary text-dark font-black text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                <Plus size={16} /> Registrar interesado
              </button>
            }
          />
          {prospectos.length === 0 && (
            <p className="text-gray-600 text-center py-8 text-sm">Sin interesados aún. Cuando alguien mande "Hola, me interesa este demo: …", regístralo aquí.</p>
          )}
          <div className="space-y-3">
            {prospectos.map(p => {
              const demo = p.demoId ? buscarDemo(p.demoId) : null
              return (
                <div key={p.id} className="bg-dark2 border border-white/5 rounded-2xl p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[180px]">
                      <div className="flex items-baseline gap-2">
                        <p className="text-white font-bold text-base">{p.nombre}</p>
                        {p.nombreNegocio && <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-md">{p.nombreNegocio}</span>}
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        {p.whatsapp || 'Sin WhatsApp'} · {demo ? `${demo.emoji} Le interesó: ${demo.nombre}` : 'Demo sin definir'} · {p.creado}
                      </p>
                      <p className="text-gray-600 text-xs mt-1 flex flex-wrap gap-2">
                        <span>Canal: <strong className="text-gray-400">{p.canal || 'WhatsApp'}</strong></span>
                        <span>Prioridad: <strong className={p.prioridad === 'Alta' ? 'text-red-400' : p.prioridad === 'Baja' ? 'text-gray-500' : 'text-primary'}>{p.prioridad || 'Media'}</strong></span>
                        {p.proximoSeguimiento && (
                          <span className="flex items-center gap-1"><CalendarDays size={12} /> Seguimiento: <strong className="text-white">{p.proximoSeguimiento}</strong></span>
                        )}
                      </p>
                      {p.notas && <p className="text-gray-600 text-xs mt-1 italic">{p.notas}</p>}
                    </div>
                    <select
                      value={p.estado}
                      onChange={e => cambiarEstadoProspecto(p.id, e.target.value)}
                      className={`text-xs font-bold rounded-full px-3 py-1.5 outline-none border-0 cursor-pointer appearance-none text-center ${COLOR_ESTADO[p.estado] || 'bg-dark3 text-gray-400'}`}
                      aria-label={`Estado de ${p.nombre}`}
                    >
                      {ESTADOS_PROSPECTO.map(e => <option key={e} value={e} className="bg-dark2 text-white">{e}</option>)}
                    </select>
                    <button
                      onClick={() => { setDemoElegida(p.demoId || null); setModalPrueba(p) }}
                      className="flex items-center gap-1.5 bg-primary/15 text-primary text-xs font-bold px-3 py-2 rounded-xl hover:bg-primary/25 transition-colors"
                    >
                      <Rocket size={14} /> Crear prueba
                    </button>
                    <button onClick={() => setModalProspecto(p)} className="text-gray-500 hover:text-primary p-2" aria-label={`Editar ${p.nombre}`}>
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Pruebas creadas ── */}
        <section>
          <SeccionTitulo Icono={FlaskConical} titulo="Pruebas creadas" />
          <TrialList />
        </section>
      </main>

      {/* Modal registrar/editar interesado */}
      {modalProspecto && (
        <ProspectForm
          prospecto={modalProspecto === 'nuevo' ? null : modalProspecto}
          onCerrar={() => setModalProspecto(null)}
        />
      )}

      {/* Modal crear prueba: elegir demo oficial */}
      {modalPrueba && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setModalPrueba(null)} />
          <div className="relative bg-dark2 border border-white/10 rounded-3xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto no-scrollbar">
            <h3 className="text-white font-black text-lg mb-1">Crear prueba para {modalPrueba.nombre}</h3>
            <p className="text-gray-500 text-xs mb-4">Elige la demo base. Se duplicará como una prueba editable con URL propia.</p>
            <DemoSelector seleccionada={demoElegida} onSeleccionar={d => setDemoElegida(d.id)} />
            <button
              onClick={lanzarPrueba}
              disabled={!demoElegida}
              className="mt-5 w-full bg-primary text-dark font-black py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              🚀 Duplicar demo y generar acceso
            </button>
          </div>
        </div>
      )}

      {/* Confirmación de prueba creada con su URL */}
      {pruebaCreada && (
        <ModalDemo titulo="✅ Prueba creada" onCerrar={() => setPruebaCreada(null)}>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Prueba creada para <span className="text-white font-bold">{pruebaCreada.nombreNegocio || pruebaCreada.prospectoNombre}</span> ({pruebaCreada.demoNombre}).
            </p>
            
            <div>
              <p className="text-gray-500 text-xs mb-1 font-bold uppercase tracking-wider">1. Link Dashboard (Cliente):</p>
              <p className="bg-dark3 rounded-xl p-2.5 text-primary text-xs font-mono break-all">
                {window.location.origin}/dashboard/{pruebaCreada.trialId}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs mb-1 font-bold uppercase tracking-wider">2. Link Menú Público (Compradores):</p>
              <p className="bg-dark3 rounded-xl p-2.5 text-green-400 text-xs font-mono break-all">
                {window.location.origin}/menu/{pruebaCreada.trialId}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to={`/dashboard/${pruebaCreada.trialId}`}
                className="block text-center bg-primary text-dark font-black py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                Abrir Dashboard
              </Link>
              <Link
                to={`/menu/${pruebaCreada.trialId}`}
                className="block text-center bg-dark3 border border-white/10 text-white font-black py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                Ver Menú Público
              </Link>
            </div>
          </div>
        </ModalDemo>
      )}
    </div>
  )
}

export default function DemoAdmin() {
  return (
    <DemoTrialsProvider>
      <AdminInterno />
    </DemoTrialsProvider>
  )
}
