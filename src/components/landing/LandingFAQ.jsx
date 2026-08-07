import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: '¿Qué es un menú digital para restaurantes y cómo funciona con WhatsApp?',
    a: 'Un menú digital interactivo permite a tus clientes ver tus platillos con fotos reales desde su celular (escaneando un código QR o abriendo un link). Al seleccionar lo que desean, el sistema genera una comanda perfecta que se envía directamente a tu WhatsApp, sin pasar por intermediarios ni aplicaciones extra.'
  },
  {
    q: '¿Realmente no cobran comisiones por mis ventas?',
    a: 'Así es. A diferencia de Uber Eats o Rappi que te cobran hasta el 30% por cada venta, con StreetBoss el 100% de tus ganancias es tuyo. Pagas solo tu suscripción y operas bajo tus propias reglas.'
  },
  {
    q: '¿Cómo funciona el cálculo de envíos por GPS?',
    a: 'Tú configuras tus tarifas por distancia (ej. hasta 3km = $20, hasta 6km = $40). Cuando el cliente hace su pedido, el sistema lee su ubicación por GPS y suma automáticamente el costo de envío al total, sin que tú tengas que calcularlo manualmente.'
  },
  {
    q: '¿Hay letras chiquitas o costos de instalación ocultos?',
    a: 'Ninguno. Los precios son transparentes: sin comisiones ocultas, sin cuota de alta y puedes cancelar tu suscripción mensual cuando quieras desde tu panel.'
  }
]

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx)
  }

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#050507] border-t border-white/5 reveal-on-scroll">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="w-10 h-10 bg-[#ff4b16]/10 border border-[#ff4b16]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="text-[#ff4b16]" size={20} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Resolvemos todas tus dudas sobre nuestro Menú Digital.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="bg-[#0A0B0E] border border-white/10 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-extrabold text-white text-sm md:text-base hover:text-[#ff4b16] transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#ff4b16] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-gray-400 text-xs md:text-sm leading-relaxed border-t border-white/5 animate-fade-in-up">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
