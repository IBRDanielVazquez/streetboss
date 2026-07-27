"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/20 blur-[150px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-xs font-medium text-gray-300 m-0">Menú Digital para Restaurantes sin Comisiones</h2>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1] font-poppins">
          Tu Menú Digital. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Tus Ganancias.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          StreetBoss transforma tu negocio con un catálogo interactivo que recibe pedidos <strong className="text-white font-semibold">directo a tu WhatsApp</strong>, calcula envíos por GPS y no te cobra comisiones por venta.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#precios" className="w-full sm:w-auto bg-primary text-black font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,184,122,0.3)]">
            Ver Oferta de Lanzamiento <ArrowRight size={18} />
          </a>
          <a href="#demos" className="w-full sm:w-auto bg-transparent border border-white/20 text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
            Explorar Demos
          </a>
        </div>
      </motion.div>
    </section>
  )
}
