// Listado de PRUEBAS creadas con su URL local copiable.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { useDemoTrials } from '../../context/DemoTrialsContext'
import { buscarDemo } from '../../data/demoTrials'
import { copiarTexto } from './ProspectForm'

export default function TrialList() {
  const { pruebas } = useDemoTrials()
  const [copiado, setCopiado] = useState(null)

  const urlDePrueba = (trialId) => `${window.location.origin}/demo/prueba/${trialId}`

  const copiar = async (trialId) => {
    if (await copiarTexto(urlDePrueba(trialId))) {
      setCopiado(trialId)
      setTimeout(() => setCopiado(c => (c === trialId ? null : c)), 1500)
    }
  }

  if (pruebas.length === 0) {
    return <p className="text-gray-600 text-center py-8 text-sm">Aún no hay pruebas. Registra un interesado y créale una.</p>
  }

  return (
    <div className="space-y-3">
      {pruebas.map(t => {
        const demo = buscarDemo(t.demoId)
        return (
          <div key={t.trialId} className="bg-dark2 border border-white/5 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl">{demo?.emoji || '🍽️'}</span>
              <div className="flex-1 min-w-[180px]">
                <p className="text-white font-bold text-sm">{t.demoNombre}</p>
                <p className="text-gray-500 text-xs mt-0.5">Para: {t.prospectoNombre} · Creada {t.creado}</p>
                {/* URL visible por si el portapapeles no está disponible */}
                <p className="text-gray-600 text-xs mt-1 font-mono break-all">{urlDePrueba(t.trialId)}</p>
              </div>
              <button
                onClick={() => copiar(t.trialId)}
                className="flex items-center gap-1.5 bg-dark3 text-gray-400 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
              >
                {copiado === t.trialId ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copiado === t.trialId ? 'Copiada' : 'Copiar URL'}
              </button>
              <Link
                to={`/demo/prueba/${t.trialId}`}
                className="flex items-center gap-1.5 bg-primary/15 text-primary text-xs font-bold px-3 py-2 rounded-xl hover:bg-primary/25 transition-colors"
              >
                <ExternalLink size={14} /> Abrir
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
