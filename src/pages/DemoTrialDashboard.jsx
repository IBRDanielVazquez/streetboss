// ─────────────────────────────────────────────────────────────────────────────
// PARTE 2 — Panel del PROSPECTO (/demo/prueba/:trialId)
// El interesado edita su propia prueba: negocio, menú y vista previa.
// 100% local: si este navegador no tiene la prueba, se auto-siembra una copia
// fresca de la demo base (el trialId codifica cuál). No sincroniza entre
// dispositivos — es una prueba local.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, Copy, KeyRound, Link as LinkIcon, Send, Smartphone, Store, UtensilsCrossed } from 'lucide-react'
import { useTrialData } from '../context/DemoTrialsContext'
import TrialBusinessEditor from '../components/demotrials/TrialBusinessEditor'
import TrialMenuEditor from '../components/demotrials/TrialMenuEditor'
import TrialPreview from '../components/demotrials/TrialPreview'
import { copiarTexto } from '../components/demotrials/ProspectForm'

const PESTANAS = [
  { id: 'negocio', nombre: 'Mi Negocio', Icono: Store },
  { id: 'menu',    nombre: 'Mi Menú',    Icono: UtensilsCrossed },
  { id: 'preview', nombre: 'Vista previa', Icono: Smartphone },
]

export default function DemoTrialDashboard() {
  const { trialId } = useParams()
  const trial = useTrialData(trialId)
  const [pestana, setPestana] = useState('menu')
  const [copiado, setCopiado] = useState(null)

  // trialId no corresponde a ninguna demo oficial
  if (!trial.valido) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-4 p-6 text-center">
        <span className="text-5xl">🔎</span>
        <h1 className="text-white font-black text-xl">Prueba no encontrada</h1>
        <p className="text-gray-500 text-sm max-w-sm">El enlace no es válido o la prueba ya no existe. Pide a Street Boss un enlace nuevo.</p>
      </div>
    )
  }

  const { demo, negocio, menu, creado, codigoAcceso, status } = trial

  // Calcular días restantes de la prueba de 7 días
  const diasTranscurridos = creado ? Math.floor((Date.now() - new Date(creado).getTime()) / (1000 * 60 * 60 * 24)) : 0
  const diasRestantes = Math.max(0, 7 - diasTranscurridos)
  const fechaExpiracion = creado ? new Date(new Date(creado).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : ''
  const expirado = diasRestantes <= 0
  const suspendido = status === 'suspendida'
  const pausado = status === 'pausada'
  const urlDashboard = `${window.location.origin}/dashboard/${trialId}`
  const urlMenu = `${window.location.origin}/menu/${trialId}`
  const mensajeAcceso = `¡Hola! El menú digital de ${negocio.nombre || demo?.nombre} en StreetBoss ya está listo para configurarse (periodo inicial de 7 días activo).\n\n1. Panel de administración para editar (productos, precios, dirección y WhatsApp):\n${urlDashboard}\n\nTu código de acceso: ${codigoAcceso || trialId}\n\n2. Menú de ventas público para tus clientes:\n${urlMenu}`

  const copiar = async (texto, key) => {
    if (await copiarTexto(texto)) {
      setCopiado(key)
      setTimeout(() => setCopiado(c => (c === key ? null : c)), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Encabezado */}
      <header className="sticky top-0 z-40 bg-dark/90 backdrop-blur border-b border-white/5 px-4 md:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
          {negocio.logo ? (
            <img src={negocio.logo} alt="Logo del negocio" className="w-10 h-10 rounded-2xl object-cover border border-white/10" />
          ) : (
            <span className="text-2xl">{demo?.emoji || '🍽️'}</span>
          )}
          <div className="flex-1 min-w-[160px]">
            <h1 className="text-white font-black text-lg leading-tight truncate">{negocio.nombre || demo?.nombre}</h1>
            <p className="text-gray-600 text-xs">Panel de administración · StreetBoss</p>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
            expirado || suspendido ? 'bg-red-500/10 text-red-500' : pausado ? 'bg-amber-500/10 text-amber-400' : 'bg-yellow-500/10 text-yellow-500'
          }`}>
            {suspendido ? '⛔ Suspendido' : pausado ? '⏸ Página pública pausada' : expirado ? '❌ Período finalizado' : `⏳ Quedan ${diasRestantes} días (Hasta ${fechaExpiracion})`}
          </span>
        </div>

        {/* Pestañas */}
        {!expirado && !suspendido && (
          <nav className="max-w-5xl mx-auto flex gap-2 mt-4">
            {PESTANAS.map(({ id, nombre, Icono }) => (
              <button
                key={id}
                onClick={() => setPestana(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  pestana === id ? 'bg-primary text-dark' : 'bg-dark2 text-gray-400 hover:text-white'
                }`}
              >
                <Icono size={14} /> {nombre}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        {expirado || suspendido ? (
          <div className="bg-dark2 border border-red-500/20 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 my-10 shadow-2xl">
            <span className="text-5xl">⏳</span>
            <h2 className="text-white font-black text-2xl">{suspendido ? 'Esta cuenta fue suspendida' : 'Tu período inicial ha finalizado'}</h2>
            <p className="text-gray-400 text-sm">
              {suspendido ? 'El acceso al panel fue suspendido temporalmente.' : 'Tu período inicial de 7 días ha finalizado.'} <strong className="text-white">{negocio.nombre || demo?.nombre}</strong>
            </p>
            <p className="text-gray-500 text-xs">
              Para continuar editando tu menú, configurar entregas a domicilio y comenzar a recibir pedidos por WhatsApp, activa tu cuenta oficial de Street Boss.
            </p>
            <a
              href="https://wa.me/529612466204?text=Hola,%20mi%20periodo%20de%207%20dias%20ha%20finalizado%20y%20quiero%20contratar%20Street%20Boss"
              target="_blank"
              rel="noreferrer"
              className="block bg-primary text-dark font-black py-3 rounded-xl hover:opacity-90 transition-opacity mt-4"
            >
              📞 Contactar a Ventas / Activar Cuenta
            </a>
          </div>
        ) : (
          <>
            <section className="mb-6 bg-dark2 border border-white/10 rounded-3xl p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <Send size={18} />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">Acceso para enviar al cliente</p>
                    <p className="text-gray-500 text-xs mt-1">Comparte el panel de administración, el menú de ventas público y el código de acceso.</p>
                  </div>
                </div>
                <div className="bg-dark3 border border-white/10 rounded-2xl px-4 py-3 min-w-[160px]">
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <KeyRound size={12} /> Código
                  </p>
                  <p className="text-primary font-black text-xl tracking-[0.2em]">{codigoAcceso || trialId}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <div className="bg-dark3/60 border border-white/5 rounded-2xl p-3">
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <LinkIcon size={12} /> Panel de administración (Dashboard)
                  </p>
                  <p className="text-gray-300 text-xs font-mono truncate select-all">{urlDashboard}</p>
                  <button
                    onClick={() => copiar(urlDashboard, 'dashboard')}
                    className="mt-3 w-full bg-dark text-gray-300 hover:text-white border border-white/10 rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    {copiado === 'dashboard' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copiado === 'dashboard' ? 'Copiado' : 'Copiar link dashboard'}
                  </button>
                </div>

                <div className="bg-dark3/60 border border-white/5 rounded-2xl p-3">
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <LinkIcon size={12} /> Menú público
                  </p>
                  <p className="text-gray-300 text-xs font-mono truncate select-all">{urlMenu}</p>
                  <button
                    onClick={() => copiar(urlMenu, 'menu')}
                    className="mt-3 w-full bg-dark text-gray-300 hover:text-white border border-white/10 rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    {copiado === 'menu' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copiado === 'menu' ? 'Copiado' : 'Copiar link menú'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => copiar(mensajeAcceso, 'mensaje')}
                className="mt-3 w-full bg-primary text-dark font-black rounded-xl py-3 text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                {copiado === 'mensaje' ? <Check size={16} /> : <Copy size={16} />}
                {copiado === 'mensaje' ? 'Mensaje copiado' : 'Copiar mensaje completo para enviar'}
              </button>
            </section>

            {pestana === 'negocio' && <TrialBusinessEditor negocio={negocio} editarNegocio={trial.editarNegocio} />}
            {pestana === 'menu' && (
              <TrialMenuEditor
                menu={menu}
                crearCategoria={trial.crearCategoria}
                editarCategoria={trial.editarCategoria}
                toggleCategoria={trial.toggleCategoria}
                moverCategoria={trial.moverCategoria}
                crearProducto={trial.crearProducto}
                editarProducto={trial.editarProducto}
              />
            )}
            {pestana === 'preview' && <TrialPreview negocio={negocio} menu={menu} />}
          </>
        )}
      </main>
    </div>
  )
}
