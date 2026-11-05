import React from 'react'
import { MessageSquare, SlidersHorizontal, MapPin, Users } from 'lucide-react'

export default function LandingSocialProof() {
  const features = [
    { icon: MessageSquare, label: 'WhatsApp directo', desc: 'Pedidos estructurados sin intermediarios' },
    { icon: SlidersHorizontal, label: 'Menú administrable', desc: 'Actualiza precios, fotos y agotados' },
    { icon: MapPin, label: 'Reparto por colonias', desc: 'Define cobertura, tarifas y mínimos' },
    { icon: Users, label: 'Pedidos y clientes', desc: 'Consulta historial y métricas del negocio' }
  ]

  return (
    <section className="border-y border-white/5 bg-[#07080A] py-12 reveal-on-scroll">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-black text-[#ff6b3d] uppercase tracking-[0.2em] mb-8">
          TODO LISTO PARA VENDER DIRECTO
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon
            return (
              <div 
                key={item.label}
                className="bg-[#0D0E12] border border-white/5 hover:border-white/15 p-5 rounded-2xl flex items-center gap-4 text-left transition-all hover:bg-white/[0.02]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ff4b16]/10 border border-[#ff4b16]/20 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-[#ff4b16]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{item.label}</h3>
                  <p className="text-sm leading-relaxed text-gray-300 mt-1">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
