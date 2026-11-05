import React from 'react'
import { Link } from 'react-router-dom'
import { DEMO_CONTACTS } from '../data/demoFixtures'
import { Facebook, Instagram, Home, Play, Layers, Smartphone, Calculator, BadgeDollarSign, UtensilsCrossed, CircleHelp, ArrowLeft, ArrowRight } from 'lucide-react'
import { useHorizontalLanding } from '../hooks/useHorizontalLanding'
import './LandingHorizontal.css'
import LandingReelContainer from '../components/landing/LandingReelContainer'
import LandingSocialProof from '../components/landing/LandingSocialProof'
import LandingCalculadora from '../components/landing/LandingCalculadora'
import LandingSolucion from '../components/landing/LandingSolucion'
import LandingDashboard from '../components/landing/LandingDashboard'
import LandingPrecios from '../components/landing/LandingPrecios'
import LandingDemosCTA from '../components/landing/LandingDemosCTA'
import LandingFAQ from '../components/landing/LandingFAQ'

const SECTIONS = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'experiencia', label: 'Cómo funciona', icon: Play },
  { id: 'solucion', label: 'Venta directa', icon: Layers },
  { id: 'dashboard', label: 'Tu negocio', icon: Smartphone },
  { id: 'calculadora', label: 'Calcula tu ahorro', icon: Calculator },
  { id: 'precios', label: 'Precios', icon: BadgeDollarSign },
  { id: 'demos', label: 'Demos', icon: UtensilsCrossed },
  { id: 'faq', label: 'Preguntas frecuentes', icon: CircleHelp },
]
const SECTION_IDS = SECTIONS.map(section => section.id)
const SALES_MESSAGE = encodeURIComponent('Hola, quiero StreetBoss por $499 MXN el primer año. Entiendo que desde el segundo año cuesta $99 MXN al mes o $990 MXN al año.')

export default function Landing() {
  const { trackRef, active, goTo } = useHorizontalLanding(SECTION_IDS)
  const scenes = [
    <React.Fragment key="intro">
      <section className="landing-hero relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
        {/* Glow Cinematográfico sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#ff4b16]/20 blur-[140px] rounded-full pointer-events-none opacity-60 animate-pulse-glow" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-sm font-bold tracking-wide text-gray-200 m-0">$499 MXN · Todo tu primer año · Sin comisión por venta</h2>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] animate-fade-in-up-delay-1">
            Que se les antoje. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
              Que te pidan directo.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal animate-fade-in-up-delay-2">
            Tu comida pone el antojo. StreetBoss pone el escaparate: fotos, precios y pedidos <strong className="text-white font-semibold">directo a tu WhatsApp.</strong> Tú actualizas tu menú desde el celular. Tú llevas el control.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 animate-fade-in-up-delay-2">
            <a
              href={`https://wa.me/${DEMO_CONTACTS.SALES_WHATSAPP}?text=${SALES_MESSAGE}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto rounded-full bg-[#ff4b16] px-7 py-4 text-base font-black text-white shadow-[0_0_30px_rgba(255,75,22,0.4)] transition-transform hover:scale-105"
            >
              Quiero mi primer año por $499
            </a>
            <a
              href="#demos"
              onClick={event => { event.preventDefault(); goTo(6) }}
              className="w-full sm:w-auto rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-black text-white transition-colors hover:bg-white/10"
            >
              Ver ejemplos reales
            </a>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">Un pago de $499 MXN cubre tus primeros 12 meses. Desde el segundo año: $99 MXN/mes o $990 MXN/año.</p>
        </div>
      </section>

    </React.Fragment>,
    <div key="experience" className="landing-experience"><LandingReelContainer active={active === 1} /><LandingSocialProof /></div>,
    <LandingSolucion key="solution" />,
    <LandingDashboard key="dashboard" />,
    <LandingCalculadora key="calculator" />,
    <LandingPrecios key="pricing" />,
    <LandingDemosCTA key="demos" />,
    <div key="faq" className="landing-faq"><LandingFAQ />
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} StreetBoss. Vende directo. Manda tú.</p>
        <div className="flex gap-3">
          <a href="https://www.facebook.com/share/1Csqs8gKqt/?mibextid=wwXIfr" aria-label="Facebook de StreetBoss" title="Facebook" target="_blank" rel="noreferrer"><Facebook size={18} /></a>
          <a href="https://www.instagram.com/streetboss.mx/" aria-label="Instagram de StreetBoss" title="Instagram" target="_blank" rel="noreferrer"><Instagram size={18} /></a>
        </div>
      </footer>
    </div>,
  ]
  return (
    <div className="landing-horizontal bg-[#050507] text-white font-sans selection:bg-[#ff4b16]/30 selection:text-white">
      <header className="landing-header">
        <Link to="/#inicio" onClick={event => { event.preventDefault(); goTo(0) }} className="landing-logo" aria-label="StreetBoss · Inicio">
          <picture><source media="(max-width: 767px)" srcSet="/brand/SB_FAVICON_512x512_V01.png" /><img src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp" alt="StreetBoss" width="600" height="337" /></picture>
        </Link>
        <nav className="landing-section-nav" aria-label="Secciones de StreetBoss">
          {SECTIONS.map(({ id, label, icon: Icon }, index) => (
            <a key={id} href={`#${id}`} aria-label={label} title={label} aria-current={active === index ? 'location' : undefined} onClick={event => { event.preventDefault(); goTo(index) }} className={`landing-section-link ${active === index ? 'is-active' : ''}`}>
              <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </a>
          ))}
        </nav>
      </header>
      <main ref={trackRef} className="landing-track" aria-label="Recorrido por StreetBoss">
        {SECTIONS.map(({ id, label }, index) => (
          <div key={id} className="landing-scene" data-scene={id} role="region" aria-label={label}>
            <div className="landing-scene-scroll" data-scene-scroll tabIndex={0} aria-label={`Contenido: ${label}`}>
              {scenes[index]}
            </div>
          </div>
        ))}
      </main>
      <div className="landing-position" aria-hidden="true"><span style={{ width: `${(active + 1) / SECTIONS.length * 100}%` }} /></div>
      <div className="landing-direction" aria-label="Cambiar de sección">
        <button type="button" onClick={() => goTo(active - 1)} aria-label="Sección anterior" title="Sección anterior"><ArrowLeft size={18} /></button>
        <button type="button" onClick={() => goTo(active + 1)} aria-label="Sección siguiente" title="Sección siguiente"><ArrowRight size={18} /></button>
      </div>
    </div>
  )
}
