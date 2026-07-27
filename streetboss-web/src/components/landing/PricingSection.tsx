import React from 'react'
import { CheckCircle2 } from 'lucide-react'

export function PricingSection() {
  return (
    <section id="precios" className="py-32 relative bg-black overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-wider uppercase mb-6">
          OFERTA DE LANZAMIENTO HASTA AGOSTO
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 font-poppins">Sin comisiones. Sin sorpresas.</h2>
        <p className="text-xl text-gray-400 mb-16 max-w-xl mx-auto">
          Elige el plan que mejor se adapte a tu restaurante. Todo el poder de StreetBoss para disparar tus ventas online.
        </p>
        
        <div className="max-w-2xl mx-auto text-left">
          <div className="bg-gradient-to-b from-[#111] to-black border border-primary/30 rounded-[2.5rem] p-8 md:p-12 relative shadow-[0_0_50px_rgba(255,75,0,0.15)] flex flex-col text-center">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(255,75,0,0.5)] whitespace-nowrap">
              OFERTA DE LANZAMIENTO 🚀
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2 mt-2 font-poppins">Super paquete de inicio: $100 MXN al mes</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Montamos tu menú digital optimizado para vender más a domicilio y aumentar tu ticket promedio.
            </p>
            
            <div className="mb-8 pb-8 border-b border-white/10 flex flex-col items-center">
              <span className="bg-green-500/10 text-green-400 text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider mb-3">
                🔥 7 días de prueba gratis
              </span>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-extrabold text-white font-poppins">$100</span>
                <span className="text-gray-400 font-medium ml-2">MXN / mes</span>
              </div>
              <p className="text-xs text-amber-400 font-bold mt-3">
                ⚠️ Disponible únicamente para los primeros 10 negocios
              </p>
              <p className="text-xs text-gray-500 mt-2 max-w-sm leading-relaxed">
                Prueba el sistema completo gratis por 7 días. Después de los 7 días, aplica el plan de $100 MXN al mes para los primeros 10 negocios. Sin plazos forzosos.
              </p>
            </div>
            
            <div className="text-left max-w-md mx-auto space-y-4 mb-10">
              <p className="text-white font-bold text-xs uppercase tracking-wider mb-2 text-center text-primary">¿Qué incluye el paquete?</p>
              {[
                'Menú Digital Interactivo e Ilimitado',
                'Pedidos ilimitados directo a tu WhatsApp',
                'Cálculo de envíos por GPS (manual, costo fijo o por km)',
                'Panel de administración (/dashboard) para actualizar precios y fotos',
                'Código QR personalizado para imprimir en tus mesas'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <a 
              href="https://wa.me/529613725386" 
              target="_blank" 
              rel="noreferrer" 
              className="block text-center w-full bg-primary text-black font-black py-4 rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,75,0,0.4)] text-base"
            >
              📱 Iniciar prueba de 7 días gratis por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
