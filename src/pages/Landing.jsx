import React, { useEffect, useState, Suspense, lazy } from 'react'
import { ArrowRight, Facebook, Instagram } from 'lucide-react'

// Lazy load components that are below the fold
const LandingSocialProof = lazy(() => import('../components/landing/LandingSocialProof'))
const LandingCalculadora = lazy(() => import('../components/landing/LandingCalculadora'))
const LandingSolucion = lazy(() => import('../components/landing/LandingSolucion'))
const LandingPrecios = lazy(() => import('../components/landing/LandingPrecios'))
const LandingDemosCTA = lazy(() => import('../components/landing/LandingDemosCTA'))
const LandingFAQ = lazy(() => import('../components/landing/LandingFAQ'))

const FACEBOOK_URL = 'https://www.facebook.com/share/1Csqs8gKqt/?mibextid=wwXIfr'
const INSTAGRAM_URL = 'https://www.instagram.com/streetboss.mx/'

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30 selection:text-white">
      
      {/* ── Navbar ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/80 backdrop-blur-xl border-white/10 py-3 md:py-4' : 'bg-transparent border-transparent py-5 md:py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center shrink-0">
            <img src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp" alt="StreetBoss" width="600" height="337" className="h-20 sm:h-24 md:h-28 w-auto object-contain mix-blend-screen" />
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#solucion" className="hover:text-white transition-colors">La Solución</a>
            <a href="/demos" className="hover:text-white transition-colors">Ver Demos</a>
            <a href="#calculadora" className="hover:text-white transition-colors">Calculadora ROI</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="https://wa.me/529612466204" target="_blank" rel="noreferrer" className="bg-[#ff4b16] text-white font-black px-4 md:px-6 py-3 rounded-full text-sm md:text-base hover:scale-105 transition-transform whitespace-nowrap shadow-[0_0_24px_rgba(255,75,22,0.35)]">
              Hablar con Ventas
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero Section (Instante, Sin JS Pesado) ── */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-6">
        {/* Glow de CSS Puro (FCP instantáneo) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/20 blur-[150px] rounded-full pointer-events-none opacity-50" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Contenido animado con CSS puro en vez de framer-motion */}
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-xs font-medium text-gray-300 m-0">Menú Digital para Restaurantes sin Comisiones</h2>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
            Tu Menú Digital. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Tus Ganancias.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            StreetBoss transforma tu negocio con un catálogo interactivo que recibe pedidos <strong className="text-white font-semibold">directo a tu WhatsApp</strong>, calcula envíos por GPS y no te cobra comisiones por venta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#precios" className="w-full sm:w-auto bg-[#ff4b16] text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_0_24px_rgba(255,75,22,0.35)]">
              Ver Oferta de Lanzamiento <ArrowRight size={18} />
            </a>
            <a href="/demos" className="w-full sm:w-auto bg-transparent border border-white/20 text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              Explorar Demos
            </a>
          </div>
        </div>
      </section>

      {/* ── Carga Asíncrona de las secciones debajo del Hero ── */}
      <Suspense fallback={<div className="h-[200px]" />}>
        <LandingSocialProof />
        <LandingCalculadora />
        <LandingSolucion />
        <LandingPrecios />
        <LandingDemosCTA />
        <LandingFAQ />
      </Suspense>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 bg-black pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center">
              <img src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp" alt="StreetBoss" width="600" height="337" loading="lazy" className="h-20 md:h-24 w-auto object-contain mix-blend-screen" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-5 text-sm font-bold">
              <a href="#solucion" className="text-gray-500 hover:text-white transition-colors">Características</a>
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff4b16] transition-colors">
                <Facebook size={16} /> Facebook
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff4b16] transition-colors">
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} StreetBoss. Creado para dominar tu mercado local.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
