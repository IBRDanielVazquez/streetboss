import { useEffect } from 'react'
import { ArrowLeft, Utensils } from 'lucide-react'

export default function NotFound() {
  useEffect(() => {
    // SEO & Meta tags para 404 oficial
    document.title = 'Página no encontrada | StreetBoss'

    let metaRobots = document.querySelector('meta[name="robots"]')
    if (!metaRobots) {
      metaRobots = document.createElement('meta')
      metaRobots.name = 'robots'
      document.head.appendChild(metaRobots)
    }
    metaRobots.content = 'noindex, nofollow'

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = 'La página que buscas no está disponible. Regresa al sitio oficial de StreetBoss.'

    let linkCanonical = document.querySelector('link[rel="canonical"]')
    if (!linkCanonical) {
      linkCanonical = document.createElement('link')
      linkCanonical.rel = 'canonical'
      document.head.appendChild(linkCanonical)
    }
    linkCanonical.href = 'https://streetboss.com.mx/'

    return () => {
      document.title = 'StreetBoss 🍔'
      if (metaRobots) metaRobots.content = 'index, follow'
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-[#0D0E12] text-white font-sans flex flex-col justify-between overflow-x-hidden selection:bg-[#FF4B00] selection:text-white">
      {/* Capa gastronómica moody de fondo */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
        <img
          src="/productos/bbq_chicken_wings.webp"
          alt="Gastronomía StreetBoss"
          className="h-full w-full object-cover object-center filter blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-[#0D0E12]/80 to-[#0D0E12]/90" />
      </div>

      {/* Resplandor cálido de marca */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-[380px] w-[380px] sm:h-[500px] sm:w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF4B00]/20 blur-[130px]" />

      {/* Header con Logo Oficial */}
      <header className="relative z-10 w-full px-6 py-6 sm:py-8 flex justify-center">
        <a href="/" className="inline-block transition-transform hover:scale-105">
          <img
            src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp"
            alt="StreetBoss"
            width="600"
            height="337"
            className="h-12 sm:h-16 w-auto object-contain mix-blend-screen"
          />
        </a>
      </header>

      {/* Contenido Principal 404 */}
      <main className="relative z-10 my-auto px-4 py-8 text-center max-w-xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#FF4B00]/30 bg-[#FF4B00]/10 text-[#FF6A1A] text-xs font-black uppercase tracking-[0.25em] mb-4">
          <Utensils size={14} className="animate-pulse" /> Error 404
        </div>

        {/* 404 Gigante */}
        <h1 className="text-8xl sm:text-9xl font-black tracking-tighter leading-none bg-gradient-to-b from-[#FF6A1A] via-[#FF4B00] to-[#E03E00] text-transparent bg-clip-text drop-shadow-[0_10px_30px_rgba(255,75,0,0.35)] select-none">
          404
        </h1>

        {/* Subtítulo y Copy Oficial */}
        <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-white">
          Esta ruta no está en el menú.
        </h2>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-300 max-w-md">
          La página que buscas ya no existe o cambió de dirección.
        </p>

        {/* Botón CTA Naranja */}
        <div className="mt-8 w-full sm:w-auto">
          <a
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[#FF4B00] hover:bg-[#FF6A1A] px-9 py-4 text-base font-black text-white shadow-[0_0_35px_rgba(255,75,0,0.45)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={18} /> VOLVER AL INICIO
          </a>
        </div>

        {/* Mensaje Secundario Oficial */}
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
          Vende directo. Manda tú.
        </p>
      </main>

      {/* Footer Mínimo */}
      <footer className="relative z-10 w-full px-6 py-6 text-center text-xs text-gray-600 border-t border-white/5 bg-[#0D0E12]/80 backdrop-blur">
        <p>© 2026 StreetBoss. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
