// ─────────────────────────────────────────────────────────────────────────────
// PARTE 2 — Panel del PROSPECTO (/demo/prueba/:trialId)
// El interesado edita su propia prueba: negocio, menú y vista previa.
// 100% local: si este navegador no tiene la prueba, se auto-siembra una copia
// fresca de la demo base (el trialId codifica cuál). No sincroniza entre
// dispositivos — es una prueba local.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Store, UtensilsCrossed, Smartphone } from 'lucide-react'
import { useTrialData } from '../context/DemoTrialsContext'
import TrialBusinessEditor from '../components/demotrials/TrialBusinessEditor'
import TrialMenuEditor from '../components/demotrials/TrialMenuEditor'
import TrialPreview from '../components/demotrials/TrialPreview'

const PESTANAS = [
  { id: 'negocio', nombre: 'Mi Negocio', Icono: Store },
  { id: 'menu',    nombre: 'Mi Menú',    Icono: UtensilsCrossed },
  { id: 'preview', nombre: 'Vista previa', Icono: Smartphone },
]

export default function DemoTrialDashboard() {
  const { trialId } = useParams()
  const trial = useTrialData(trialId)
  const [pestana, setPestana] = useState('menu')

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

  const { demo, negocio, menu, creado } = trial

  // Calcular días restantes de la prueba de 7 días
  const diasTranscurridos = creado ? Math.floor((Date.now() - new Date(creado).getTime()) / (1000 * 60 * 60 * 24)) : 0
  const diasRestantes = Math.max(0, 7 - diasTranscurridos)
  const fechaExpiracion = creado ? new Date(new Date(creado).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : ''
  const expirado = diasRestantes <= 0

  return (
    <div className="min-h-screen bg-dark">
      {/* Encabezado */}
      <header className="sticky top-0 z-40 bg-dark/90 backdrop-blur border-b border-white/5 px-4 md:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
          <span className="text-2xl">{demo?.emoji || '🍽️'}</span>
          <div className="flex-1 min-w-[160px]">
            <h1 className="text-white font-black text-lg leading-tight truncate">{negocio.nombre || demo?.nombre}</h1>
            <p className="text-gray-600 text-xs">Tu prueba de menú digital · StreetBoss</p>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
            expirado ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
          }`}>
            {expirado ? '❌ Prueba Expirada' : `⏳ Quedan ${diasRestantes} días (Expira el ${fechaExpiracion})`}
          </span>
        </div>

        {/* Pestañas */}
        {!expirado && (
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
        {expirado ? (
          <div className="bg-dark2 border border-red-500/20 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 my-10 shadow-2xl">
            <span className="text-5xl">⏳</span>
            <h2 className="text-white font-black text-2xl">Esta prueba ha expirado</h2>
            <p className="text-gray-400 text-sm">
              Tu período de prueba de 7 días para <strong className="text-white">{negocio.nombre || demo?.nombre}</strong> ha finalizado.
            </p>
            <p className="text-gray-500 text-xs">
              Para continuar editando tu menú, configurar entregas a domicilio y comenzar a recibir pedidos por WhatsApp, activa tu cuenta oficial de Street Boss.
            </p>
            <a
              href="https://wa.me/529612466204?text=Hola,%20mi%20prueba%20ha%20expirado%20y%20quiero%20contratar%20Street%20Boss"
              target="_blank"
              rel="noreferrer"
              className="block bg-primary text-dark font-black py-3 rounded-xl hover:opacity-90 transition-opacity mt-4"
            >
              📞 Contactar a Ventas / Activar Cuenta
            </a>
          </div>
        ) : (
          <>
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
