import React from 'react'
import { Play, Sparkles, Smartphone, CheckCircle2 } from 'lucide-react'

export default function LandingReelContainer() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-black border-b border-white/5 reveal-on-scroll">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff4b16]/10 border border-[#ff4b16]/20 text-[#ff4b16] text-xs font-black tracking-wider uppercase mb-4">
            <Sparkles size={13} /> EXPERIENCIA VISUAL 100% DIRECCIÓN DE VENTA
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            El flujo perfecto para que tu cliente ordene sin pensar.
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Diseñado para capturar la atención en segundos, abrir el apetito y enviar la orden directo a tu WhatsApp.
          </p>
        </div>

        {/* ── Contenedor 9:16 Formato Reel ── */}
        <div className="relative max-w-sm mx-auto">
          {/* Ambient Glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[580px] bg-[#ff4b16]/15 blur-[90px] rounded-full pointer-events-none" />

          {/* Smartphone Frame (Aspect 9:16) */}
          <div className="relative aspect-[9/16] w-full rounded-[2.5rem] bg-[#0A0B0E] border-4 border-white/10 p-3 shadow-[0_25px_60px_-15px_rgba(255,75,22,0.25)] overflow-hidden group">
            
            {/* Real video tag ready for future reel upload */}
            <video
              id="streetboss-reel-video"
              playsInline
              muted
              loop
              preload="none"
              poster="/brand/StreetBoss_Logo_Horizontal_Oficial.webp"
              className="hidden w-full h-full object-cover rounded-[2rem]"
            >
              <source src="/brand/streetboss_reel.mp4" type="video/mp4" />
            </video>

            {/* Fallback Mock Showcase visually integrated */}
            <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#14161F] via-[#0D0E12] to-black p-4 flex flex-col justify-between relative overflow-hidden">
              
              {/* Top Header Mock */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <img src="/demos/tacos-el-guero/products/taco-al-pastor.jpg" alt="Tacos El Güero" width="30" height="30" loading="lazy" className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-bold text-white">Tacos El Güero</span>
                </div>
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> ABIERTO
                </span>
              </div>

              {/* Center Food Hero Mock */}
              <div className="my-auto text-center space-y-3 relative z-10">
                <div className="relative inline-block mx-auto group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="/demos/tacos-el-guero/products/taco-al-pastor.jpg"
                    alt="Taco de Pastor"
                    width="400"
                    height="300"
                    loading="lazy"
                    className="w-48 h-48 rounded-2xl object-cover shadow-2xl mx-auto border border-white/10"
                  />
                  <span className="absolute bottom-2 right-2 bg-[#ff4b16] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-lg">
                    $20 MXN
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Taco de Pastor Especial</h3>
                  <p className="text-xs text-gray-400 px-4">Con piña fresca, cilantro, cebolla picada y salsa taquera de la casa</p>
                </div>
              </div>

              {/* Bottom WhatsApp Order Card Mock */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-300">
                  <span>1x Taco de Pastor</span>
                  <span className="text-white font-black">$20.00</span>
                </div>
                <div className="bg-[#ff4b16] text-white font-black py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1.5 shadow-lg">
                  <CheckCircle2 size={14} /> Pedido por WhatsApp
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
