import { useEffect, useState } from 'react'
import { Download, Smartphone } from 'lucide-react'

export default function RestaurantAppInstall({ slug }) {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true)
  const [instructions, setInstructions] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const capture = event => { event.preventDefault(); setInstallPrompt(event) }
    const complete = () => { setInstalled(true); setInstallPrompt(null) }
    window.addEventListener('beforeinstallprompt', capture)
    window.addEventListener('appinstalled', complete)
    const manifest = document.createElement('link')
    manifest.rel = 'manifest'
    manifest.href = `/api/panel-manifest?slug=${encodeURIComponent(slug)}`
    document.head.appendChild(manifest)
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/panel-sw.js', { scope: `/panel/${slug}` }).catch(() => {})
    return () => {
      manifest.remove()
      window.removeEventListener('beforeinstallprompt', capture)
      window.removeEventListener('appinstalled', complete)
    }
  }, [slug])
  const install = async () => {
    setError('')
    if (!installPrompt) { setInstructions(true); return }
    try {
      await installPrompt.prompt()
      const choice = await installPrompt.userChoice
      if (choice.outcome === 'accepted') setInstructions(false)
      setInstallPrompt(null)
    } catch {
      setInstallPrompt(null)
      setInstructions(true)
      setError('No se pudo abrir la instalación. Puedes agregar el acceso desde el menú de tu navegador.')
    }
  }
  if (installed) return null
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return (
    <section className="rounded-3xl border border-[#FF4B00]/30 bg-[#FF4B00]/5 p-5 sm:p-6">
      <div className="flex items-start gap-4"><Smartphone className="mt-1 shrink-0 text-[#ff7940]" size={28} /><div className="min-w-0 flex-1"><h2 className="text-lg font-black">Tu restaurante, a un toque.</h2><p className="mt-1 text-sm leading-relaxed text-gray-300">Agrega StreetBoss a tu celular y abre tu espacio de trabajo desde su icono.</p></div></div>
      <button type="button" onClick={install} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF4B00] px-4 py-3 font-bold"><Download size={18} />{installPrompt ? 'Instalar mi app' : 'Agregar a mi celular'}</button>
      {instructions && <div className="mt-4 rounded-2xl bg-black/20 p-4 text-sm leading-relaxed text-gray-200" role="status"><p className="font-bold">{ios ? 'En tu iPhone o iPad' : 'Desde tu navegador'}</p><p className="mt-2">{ios ? 'Abre este panel en Safari. Toca Compartir, elige “Agregar a pantalla de inicio” y confirma con “Agregar”.' : 'Abre el menú del navegador y busca “Instalar aplicación” o “Agregar a pantalla principal”. Si no aparece, abre este panel en Chrome o Edge.'}</p><p className="mt-2 text-gray-400">El icono abre tu panel privado. Necesitas conexión a internet y tu contraseña cuando se solicite.</p></div>}
      {error && <p role="alert" className="mt-3 text-sm text-amber-200">{error}</p>}
    </section>
  )
}
