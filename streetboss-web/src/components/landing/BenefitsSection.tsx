"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, MapPin } from 'lucide-react'

export function BenefitsSection() {
  return (
    <section id="solucion" className="py-24 md:py-32 relative bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-poppins">
            Todo lo que necesitas, <br className="hidden md:block"/> sin lo que te estorba.
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl">
            Un sistema de pedidos online ligero y diseñado específicamente para la operación real de un restaurante moderno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-500/10 blur-[100px] rounded-full group-hover:bg-green-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="text-green-400" size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 font-poppins">Pedidos directo a tu WhatsApp.</h3>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Tus clientes arman su orden en una interfaz fluida. Al confirmar, recibes un mensaje estructurado con el detalle exacto. <strong>Cero intermediarios.</strong>
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-poppins">Envíos GPS Exactos.</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Configura tus zonas de envío. El sistema lee la ubicación del cliente y calcula la tarifa justa automáticamente.
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
