import React, { useRef, useState, useEffect } from 'react'
import { Sparkles, Volume2, VolumeX } from 'lucide-react'

export default function LandingReelContainer({ active = true }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)
  const [inView, setInView] = useState(false)
  const shouldLoad = active || inView

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let cancelled = false
    const start = () => {
      if (cancelled || !active || document.hidden) {
        video.pause()
        return
      }
      video.play().catch(() => {
        // Loading can interrupt play; canplay and visibility changes retry it.
      })
    }
    if (active) {
      video.muted = true
      setIsMuted(true)
    }
    video.addEventListener('canplay', start)
    document.addEventListener('visibilitychange', start)
    start()
    return () => {
      cancelled = true
      video.removeEventListener('canplay', start)
      document.removeEventListener('visibilitychange', start)
      video.pause()
    }
  }, [active, shouldLoad])

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section ref={containerRef} className="py-16 md:py-24 relative overflow-hidden bg-black border-b border-white/5 reveal-on-scroll">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff4b16]/10 border border-[#ff4b16]/20 text-[#ff6b3d] text-sm font-black tracking-wider uppercase mb-4">
            <Sparkles size={13} /> EXPERIENCIA VISUAL EN ACCIÓN
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            Así de fácil es pedir con StreetBoss.
          </h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Tu cliente descubre el menú, elige sus productos y envía una orden clara directamente a tu WhatsApp.
          </p>
        </div>

        {/* ── Contenedor 9:16 Formato Reel ── */}
        <div className="landing-reel-frame relative max-w-xs sm:max-w-sm mx-auto">
          {/* Ambient Glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[580px] bg-[#ff4b16]/20 blur-[100px] rounded-full pointer-events-none" />

          {/* Smartphone Frame (Aspect 9:16) */}
          <div className="relative aspect-[9/16] w-full rounded-[2.5rem] bg-[#0A0B0E] border-4 border-white/10 p-2 shadow-[0_25px_60px_-15px_rgba(255,75,22,0.3)] overflow-hidden group">
            
            {/* Mostrar el poster mientras no esté en view para ahorrar datos móviles */}
            {!shouldLoad && (
              <img 
                src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp" 
                alt="StreetBoss Reel Loading" 
                className="w-full h-full object-contain p-8 rounded-[2rem] bg-[#111] animate-pulse" 
              />
            )}

            {/* Reel Video Active (Lazy Loaded) */}
            {shouldLoad && (
              <>
                <video
                  ref={videoRef}
                  autoPlay={active}
                  muted={isMuted}
                  loop
                  playsInline
                  preload={active ? 'auto' : 'metadata'}
                  poster="/brand/StreetBoss_Logo_Horizontal_Oficial.webp"
                  className="w-full h-full object-cover rounded-[2rem] transition-opacity duration-1000"
                >
                  <source src="/brand/streetboss_reel_web.mp4" type="video/mp4" />
                </video>

                {/* Audio Toggle Button */}
                <button
                  onClick={toggleSound}
                  type="button"
                  aria-label={isMuted ? 'Activar sonido del video' : 'Silenciar sonido del video'}
                  className="absolute bottom-5 right-5 z-20 flex items-center gap-2 bg-black/75 hover:bg-[#ff4b16] text-white px-3.5 py-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-2xl transition-all hover:scale-105 active:scale-95 text-sm font-bold"
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
              </>
            )}

          </div>
        </div>

      </div>
    </section>
  )
}
