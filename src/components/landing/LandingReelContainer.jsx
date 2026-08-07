import React, { useRef, useState } from 'react'
import { Sparkles, Volume2, VolumeX } from 'lucide-react'

export default function LandingReelContainer() {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-black border-b border-white/5 reveal-on-scroll">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff4b16]/10 border border-[#ff4b16]/20 text-[#ff4b16] text-xs font-black tracking-wider uppercase mb-4">
            <Sparkles size={13} /> EXPERIENCIA VISUAL EN ACCIÓN
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            El flujo perfecto para que tu cliente ordene sin pensar.
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Diseñado para capturar la atención en segundos, abrir el apetito y enviar la orden directo a tu WhatsApp.
          </p>
        </div>

        {/* ── Contenedor 9:16 Formato Reel ── */}
        <div className="relative max-w-xs sm:max-w-sm mx-auto">
          {/* Ambient Glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[580px] bg-[#ff4b16]/20 blur-[100px] rounded-full pointer-events-none" />

          {/* Smartphone Frame (Aspect 9:16) */}
          <div className="relative aspect-[9/16] w-full rounded-[2.5rem] bg-[#0A0B0E] border-4 border-white/10 p-2 shadow-[0_25px_60px_-15px_rgba(255,75,22,0.3)] overflow-hidden group">
            
            {/* Reel Video Active */}
            <video
              ref={videoRef}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              poster="/brand/StreetBoss_Logo_Horizontal_Oficial.webp"
              className="w-full h-full object-cover rounded-[2rem]"
            >
              <source src="/brand/streetboss_reel.mp4" type="video/mp4" />
              <source src="/brand/streetboss_reel.mov" type="video/quicktime" />
            </video>

            {/* Audio Toggle Button */}
            <button
              onClick={toggleSound}
              type="button"
              aria-label={isMuted ? 'Activar sonido del video' : 'Silenciar sonido del video'}
              className="absolute bottom-5 right-5 z-20 flex items-center gap-2 bg-black/75 hover:bg-[#ff4b16] text-white px-3.5 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-2xl transition-all hover:scale-105 active:scale-95 text-xs font-bold"
            >
              {isMuted ? (
                <>
                  <VolumeX size={16} className="text-[#ff4b16] group-hover:text-white" />
                  <span>Activar sonido</span>
                </>
              ) : (
                <>
                  <Volume2 size={16} className="text-emerald-400 animate-pulse" />
                  <span>Sonido activo</span>
                </>
              )}
            </button>

          </div>
        </div>

      </div>
    </section>
  )
}
