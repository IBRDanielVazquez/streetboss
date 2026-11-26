import { useEffect, useState } from 'react'
import { Download, X, Share2, Smartphone } from 'lucide-react'

function isInstalled() {
  return window.matchMedia?.('(display-mode: standalone)').matches
    || window.navigator.standalone === true
}

export default function InstallAppButton({ appName = 'StreetBoss', compact = false, dark = false }) {
  const [installEvent, setInstallEvent] = useState(null)
  const [showGuide, setShowGuide] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    setInstalled(isInstalled())
    const offer = event => {
      event.preventDefault()
      setInstallEvent(event)
    }
    const done = () => {
      setInstalled(true)
      setShowGuide(false)
      setInstallEvent(null)
    }
    window.addEventListener('beforeinstallprompt', offer)
    window.addEventListener('appinstalled', done)
    return () => {
      window.removeEventListener('beforeinstallprompt', offer)
      window.removeEventListener('appinstalled', done)
    }
  }, [])

  const install = async () => {
    if (installEvent) {
      const pending = installEvent
      setInstallEvent(null)
      try {
        await pending.prompt()
        const choice = await pending.userChoice
        if (choice?.outcome === 'accepted') setInstalled(true)
      } catch {
        setShowGuide(true)
      }
    } else {
      setShowGuide(true)
    }
  }

  if (installed) return null

  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  return (
    <>
      <button
        type="button"
        onClick={install}
        className={compact
          ? 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#FF4B00]/30 bg-orange-50 px-4 py-2.5 text-xs font-black text-[#A63A08] shadow-sm active:scale-95'
          : `inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black shadow-lg active:scale-95 ${dark ? 'bg-[#FF4B00] text-white' : 'bg-white text-[#121318]'}`
        }
        aria-label={`Instalar ${appName} en este dispositivo`}
      >
        <Download size={compact ? 16 : 19} /> Instalar app
      </button>
      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-3 sm:items-center" role="presentation" onClick={() => setShowGuide(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`Instalar ${appName}`}
            onClick={event => event.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 text-left text-gray-900 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black">Instalar {appName}</h2>
              <button type="button" className="rounded-full bg-gray-100 p-2" onClick={() => setShowGuide(false)} aria-label="Cerrar instrucciones"><X size={20} /></button>
            </div>
            <p className="mt-2 text-sm text-gray-600">Agrega esta página a tu pantalla de inicio. Se abrirá como una aplicación con su propio acceso.</p>
            {isiOS ? (
              <ol className="mt-5 space-y-3 text-sm font-medium">
                <li className="flex items-center gap-3"><Share2 className="shrink-0 text-[#FF4B00]" size={21} /> 1. Abre esta página en Safari y toca Compartir.</li>
                <li className="flex items-center gap-3"><Smartphone className="shrink-0 text-[#FF4B00]" size={21} /> 2. Elige «Agregar a pantalla de inicio».</li>
                <li className="pl-8">3. Toca «Agregar» para instalarla.</li>
              </ol>
            ) : (
              <ol className="mt-5 space-y-3 text-sm font-medium">
                <li>1. Abre esta página en Chrome o en tu navegador habitual.</li>
                <li>2. Abre el menú ⋮ del navegador.</li>
                <li>3. Selecciona «Instalar app» o «Agregar a pantalla principal».</li>
              </ol>
            )}
            <button type="button" onClick={() => setShowGuide(false)} className="mt-6 min-h-12 w-full rounded-xl bg-[#FF4B00] px-4 py-3 font-black text-white">Entendido</button>
          </section>
        </div>
      )}
    </>
  )
}
