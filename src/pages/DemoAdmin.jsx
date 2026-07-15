// ─────────────────────────────────────────────────────────────────────────────
// PARTE 1 — Dashboard interno Street Boss (/demo/admin)
// Pipeline de interesados + creación de pruebas + demos oficiales con mensaje
// de WhatsApp preparado. 100% local (localStorage), sin AppProvider ni Supabase.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Rocket, Users, FlaskConical, Store } from 'lucide-react'
import { DemoTrialsProvider, useDemoTrials } from '../context/DemoTrialsContext'
import { ESTADOS_PROSPECTO, DEMOS_OFICIALES, buscarDemo } from '../data/demoTrials'
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
  const { prospectos, cambiarEstadoProspecto, crearPrueba } = useDemoTrials()
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
                      <p className="text-white font-bold">{p.nombre}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {p.whatsapp || 'Sin WhatsApp'} · {demo ? `${demo.emoji} Le interesó: ${demo.nombre}` : 'Demo sin definir'} · {p.creado}
                      </p>
                      {p.notas && <p className="text-gray-600 text-xs mt-0.5 italic">{p.notas}</p>}
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

        {/* ── Demos oficiales + mensaje de interés ── */}
        <section>
          <SeccionTitulo Icono={Store} titulo="Demos oficiales (10)" />
          <p className="text-gray-600 text-xs mb-4">
            Mensaje preparado por demo: <span className="italic">"Hola, me interesa este demo: [NOMBRE]"</span> — cópialo o copia el link de WhatsApp para usarlo en botones/tarjetas cuando se conecte producción.
          </p>
          <DemoSelector />
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
          <div className="space-y-3">
            <p className="text-gray-400 text-sm">
              {pruebaCreada.demoNombre} para <span className="text-white font-bold">{pruebaCreada.prospectoNombre}</span>.
            </p>
            <p className="text-gray-600 text-xs">URL local de acceso (cópiala desde "Pruebas creadas"):</p>
            <p className="bg-dark3 rounded-xl p-3 text-primary text-xs font-mono break-all">
              {window.location.origin}/demo/prueba/{pruebaCreada.trialId}
            </p>
            <Link
              to={`/demo/prueba/${pruebaCreada.trialId}`}
              className="block text-center w-full bg-primary text-dark font-black py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Abrir la prueba
            </Link>
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
