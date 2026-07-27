import React from 'react'
import { MessageCircle, MapPin, QrCode } from 'lucide-react'

export function SocialProofSection() {
  return (
    <section className="border-y border-white/5 bg-[#050505] py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">Integrado nativamente con</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
          <div className="flex items-center gap-2 font-bold text-xl"><MessageCircle size={24}/> WhatsApp Business</div>
          <div className="flex items-center gap-2 font-bold text-xl"><MapPin size={24}/> Google Maps API</div>
          <div className="flex items-center gap-2 font-bold text-xl"><QrCode size={24}/> Generador QR</div>
        </div>
      </div>
    </section>
  )
}
