import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function LandingDemosCTA() {
  return (
    <section className="bg-[#050505] border-y border-white/10 py-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#f5b87a] mb-4">Siguiente paso</p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-5">Mira los 10 demos y elige tu estilo.</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Tenemos escaparates listos para tacos, hamburguesas, pizza, café, pollo, parrilla, tortas, birria, mariscos y comida china.
        </p>
        <a
          href="/demos"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff4b16] px-8 py-4 text-base font-black text-white shadow-[0_0_30px_rgba(255,75,22,0.35)] transition-transform hover:scale-105"
        >
          Ver todos los demos <ArrowRight size={18} />
        </a>
      </div>
    </section>
  )
}
