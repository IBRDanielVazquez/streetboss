import React from 'react'
import { MessageSquare, Smartphone, MapPin, QrCode } from 'lucide-react'

export default function LandingSocialProof() {
  const features = [
    { icon: MessageSquare, label: 'WhatsApp Directo', desc: 'Comandas estructuradas al instante' },
    { icon: Smartphone, label: 'Menú Web Mobile-First', desc: 'Navegación ultra rápida sin apps' },
    { icon: MapPin, label: 'Ubicación GPS', desc: 'Tarifa de envío calculada al momento' },
    { icon: QrCode, label: 'Acceso QR Dinámico', desc: 'Para tus mesas, volantes o Instagram' }
  ]

  return (
    <section className="border-y border-white/5 bg-[#07080A] py-12 reveal-on-scroll">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs font-black text-[#ff4b16] uppercase tracking-[0.25em] mb-8">
          TODO LISTO PARA VENDER DIRECTO
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon
            return (
              <div 
                key={idx} 
                className="bg-[#0D0E12] border border-white/5 hover:border-white/15 p-5 rounded-2xl flex items-center gap-4 text-left transition-all hover:bg-white/[0.02]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ff4b16]/10 border border-[#ff4b16]/20 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-[#ff4b16]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.label}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
