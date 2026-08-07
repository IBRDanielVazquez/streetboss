import React, { useEffect, useState } from 'react'
import { DEMO_CONTACTS } from '../data/demoFixtures'
import { Facebook, Instagram } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import LandingReelContainer from '../components/landing/LandingReelContainer'
import LandingSocialProof from '../components/landing/LandingSocialProof'
import LandingCalculadora from '../components/landing/LandingCalculadora'
import LandingSolucion from '../components/landing/LandingSolucion'
import LandingPrecios from '../components/landing/LandingPrecios'
import LandingDemosCTA from '../components/landing/LandingDemosCTA'
import LandingFAQ from '../components/landing/LandingFAQ'

const FACEBOOK_URL = 'https://www.facebook.com/share/1Csqs8gKqt/?mibextid=wwXIfr'
const INSTAGRAM_URL = 'https://www.instagram.com/streetboss.mx/'

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  useScrollReveal()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-[#ff4b16]/30 selection:text-white">
      
      {/* ── Navbar ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/85 backdrop-blur-xl border-white/10 py-3 md:py-4 shadow-2xl' : 'bg-transparent border-transparent py-5 md:py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center shrink-0">
            <a href="/">
              <img 
                src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp" 
                alt="StreetBoss" 
                width="600" 
                height="337" 
                className="h-14 sm:h-18 md:h-22 w-auto object-contain mix-blend-screen" 
              />
            </a>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400">
            <a href="#solucion" className="hover:text-white transition-colors">La Solución</a>
            <a href="#demos" className="hover:text-white transition-colors">Ver Demos</a>
            <a href="#calculadora" className="hover:text-white transition-colors">Calculadora ROI</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href={`https://wa.me/${DEMO_CONTACTS.SALES_WHATSAPP}`} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-[#ff4b16] text-white font-black px-5 md:px-7 py-2.5 md:py-3.5 rounded-full text-xs md:text-sm hover:scale-105 transition-transform whitespace-nowrap shadow-[0_0_28px_rgba(255,75,22,0.4)]"
            >
              Hablar con Ventas
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero Section (Cinematográfico, Instantáneo, Sin Botones) ── */}
      <section className="relative pt-32 pb-14 md:pt-44 md:pb-20 overflow-hidden flex flex-col items-center justify-center text-center px-6">
        {/* Glow Cinematográfico sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#ff4b16]/20 blur-[140px] rounded-full pointer-events-none opacity-60 animate-pulse-glow" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-xs font-bold tracking-wide text-gray-300 m-0">Menú Digital para Restaurantes sin Comisiones</h2>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] animate-fade-in-up-delay-1">
            Tu Menú Digital. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
              Tus Ganancias.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal animate-fade-in-up-delay-2">
            StreetBoss transforma tu negocio con un catálogo interactivo que recibe pedidos <strong className="text-white font-semibold">directo a tu WhatsApp</strong>, calcula envíos por GPS y no te cobra comisiones por venta.
          </p>
        </div>
      </section>

      {/* ── Contenedor 9:16 para Futuro Reel Video ── */}
      <LandingReelContainer />

      {/* ── Secciones Directas (Carga Sincronizada Ultra Rápida) ── */}
      <LandingSocialProof />
      <LandingCalculadora />
      <LandingSolucion />
      <LandingPrecios />
      <LandingDemosCTA />
      <LandingFAQ />

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 bg-[#030304] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center">
              <a href="/">
                <img 
                  src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp" 
                  alt="StreetBoss" 
                  width="600" 
                  height="337" 
                  loading="lazy" 
                  className="h-16 md:h-20 w-auto object-contain mix-blend-screen" 
                />
              </a>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm font-bold">
              <a href="#solucion" className="text-gray-400 hover:text-white transition-colors">La Solución</a>
              <a href="#demos" className="text-gray-400 hover:text-white transition-colors">Ver Demos</a>
              <a href="#calculadora" className="text-gray-400 hover:text-white transition-colors">Calculadora ROI</a>
              <a href="#precios" className="text-gray-400 hover:text-white transition-colors">Precios</a>
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#ff4b16] transition-colors">
                <Facebook size={15} /> Facebook
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#ff4b16] transition-colors">
                <Instagram size={15} /> Instagram
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
