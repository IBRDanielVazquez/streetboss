import React from 'react'
import { MessageCircle, MapPin, CreditCard, UtensilsCrossed } from 'lucide-react'

export default function LandingSolucion({ horizontal = false }) {
  return (
    <section id="solucion" className="py-24 md:py-32 relative bg-[#050505] reveal-on-scroll">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Todo lo que necesitas, <br className="hidden md:block"/> sin lo que te estorba.
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl">
            Un sistema de pedidos online ligero y diseñado específicamente para la operación real de un restaurante moderno.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${horizontal ? "landing-benefit-rail" : ""}`} data-horizontal-rail={horizontal || undefined}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden group animate-fade-in-up">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-500/10 blur-[100px] rounded-full group-hover:bg-green-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="text-green-400" size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Pedidos directo a tu WhatsApp.</h3>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Tus clientes arman su orden en una interfaz fluida. Al confirmar, recibes un mensaje estructurado con el detalle exacto. <strong>Cero intermediarios.</strong>
              </p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden group animate-fade-in-up-delay">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Reparto bajo tus reglas.</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Elige las colonias que atiendes y define para cada una su costo de envío y pedido mínimo.
              </p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
              <UtensilsCrossed className="text-orange-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Tu menú siempre actualizado.</h3>
            <p className="text-gray-300 text-base leading-relaxed">
              Edita categorías, productos, fotografías y precios. Marca productos agotados u ocúltalos cuando lo necesites.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
              <CreditCard className="text-violet-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Tú eliges cómo cobrar.</h3>
            <p className="text-gray-300 text-base leading-relaxed">
              Activa únicamente las formas de pago que acepta tu negocio y muestra instrucciones claras al cliente.
            </p>
          </div>
          
        </div>
      </div>
    </section>
  )
}
