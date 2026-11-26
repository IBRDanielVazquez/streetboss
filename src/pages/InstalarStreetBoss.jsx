import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Smartphone } from 'lucide-react'
import InstallAppButton from '../components/InstallAppButton'

export default function InstalarStreetBoss() {
  return (
    <main className="min-h-screen bg-[#0D0E12] px-5 pb-16 pt-7 text-white">
      <div className="mx-auto max-w-lg">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-gray-300"><ArrowLeft size={18} /> StreetBoss</Link>
        <div className="mt-10 flex flex-col items-center text-center">
          <img
            src="/brand/SB_FAVICON_512x512_V01.png"
            alt="Ícono de StreetBoss"
            width="112"
            height="112"
            className="h-28 w-28 rounded-3xl object-contain"
          />
          <h1 className="mt-6 text-4xl font-black tracking-tight">Instala StreetBoss</h1>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-gray-300">
            Abre StreetBoss desde la pantalla de inicio de tu celular, como una aplicación.
          </p>
          <div className="mt-8 flex w-full justify-center">
            <InstallAppButton appName="StreetBoss" dark />
          </div>
          <div className="mt-9 w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
            <h2 className="flex items-center gap-2 text-lg font-black"><Smartphone size={20} className="text-[#FF4B00]" /> En iPhone</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">Abre esta página en Safari, toca <strong>Compartir</strong>, después <strong>Agregar a pantalla de inicio</strong> y confirma en <strong>Agregar</strong>.</p>
            <h2 className="mt-6 flex items-center gap-2 text-lg font-black"><CheckCircle2 size={20} className="text-[#FF4B00]" /> En Android</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">Toca <strong>Instalar app</strong>. Si tu navegador no muestra la instalación automática, entra al menú ⋮ y selecciona <strong>Instalar app</strong> o <strong>Agregar a pantalla principal</strong>.</p>
          </div>
          <p className="mt-6 text-xs text-gray-400">Los menús de cada restaurante tienen su propio botón de instalación e identidad independiente.</p>
        </div>
      </div>
    </main>
  )
}
