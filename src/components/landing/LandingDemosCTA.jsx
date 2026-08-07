import React from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { DEMOS_OFICIALES } from '../../data/demoShowcase'

export default function LandingDemosCTA() {
  return (
    <section id="demos" className="bg-[#050507] border-y border-white/10 py-20 md:py-28 relative overflow-hidden reveal-on-scroll">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff4b16]/10 blur-[140px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#ff4b16] mb-3">
            ESCAPARATES EN VIVO
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            Mira los 10 demos y elige tu estilo.
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Cada plantilla está personalizada con fotografía gastronómica premium y flujo optimizado para conversión instantánea.
          </p>
        </div>

        {/* Grid de 10 Demos Oficiales */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-12">
          {DEMOS_OFICIALES.map((demo) => {
            const firstProduct = demo.menu?.[0]?.productos?.[0]?.foto || `/demos/${demo.id}/cover.jpg`
            return (
              <a
                key={demo.id}
                href={`/menu/${demo.id}`}
                target="_blank"
                rel="noreferrer"
                className="group bg-[#0A0B0E] border border-white/10 hover:border-[#ff4b16]/50 rounded-2xl p-3 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,75,22,0.15)]"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-black/40 relative">
                  <img
                    src={firstProduct}
                    alt={demo.nombre}
                    width="240"
                    height="180"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 text-base bg-black/60 backdrop-blur-md p-1 rounded-lg">
                    {demo.emoji}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-extrabold text-white text-xs md:text-sm truncate group-hover:text-[#ff4b16] transition-colors">
                      {demo.nombre}
                    </h3>
                    <ExternalLink size={12} className="text-gray-500 group-hover:text-[#ff4b16] shrink-0" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{demo.giro}</p>
                </div>
              </a>
            )
          })}
        </div>

        <div className="text-center">
          <a
            href="/demos"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff4b16] px-8 py-4 text-sm md:text-base font-black text-white shadow-[0_0_30px_rgba(255,75,22,0.35)] transition-transform hover:scale-105"
          >
            Explorar catálogo completo de demos <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}
