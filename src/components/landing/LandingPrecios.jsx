import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { DEMO_CONTACTS } from '../../data/demoFixtures'

export default function LandingPrecios() {
  return (
    <section id="precios" className="py-32 relative bg-black overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-wider uppercase mb-6">
          OFERTA DE LANZAMIENTO
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Sin comisiones. Sin sorpresas.</h2>
        <p className="text-xl text-gray-400 mb-16 max-w-xl mx-auto">
          Elige el plan que mejor se adapte a tu restaurante. Todo el poder de StreetBoss para disparar tus ventas online.
        </p>
        
        <div className="max-w-2xl mx-auto text-left">
          <div className="bg-[#111115] border-2 border-[#ff4b16] rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(255,75,22,0.15)] relative overflow-hidden">
            <div className="absolute top-6 right-6 bg-[#ff4b16] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Oferta Especial
            </div>

            <div className="text-center md:text-left space-y-4 mb-8">
              <h3 className="text-2xl font-bold text-white">Plan Restaurante Pro</h3>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl md:text-6xl font-black text-white">$99</span>
                <span className="text-gray-400 font-bold">MXN / primer mes</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Posteriormente $299 MXN/mes. Cancela cuando quieras.</p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                'Menú web ilimitado Mobile-First',
                'Checkout directo a tu WhatsApp con plantilla estructurada',
                'Dominio o enlace listo para compartir (ej: streetboss.mx/tu-restaurante)',
                'Panel de administración para actualizar precios y fotos',
                'Código QR personalizado para imprimir en tus mesas'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle2 size={18} className="text-[#f5b87a] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <a 
              href={`https://wa.me/${DEMO_CONTACTS.SALES_WHATSAPP}?text=Hola,%20quiero%20mi%20menu%20digital`} 
              target="_blank" 
              rel="noreferrer" 
              className="block text-center w-full bg-[#ff4b16] text-white font-black py-4 rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,75,22,0.4)] text-base"
            >
              📱 Quiero mi menú digital
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
