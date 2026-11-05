import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQS = [
  { q: '¿Puedo instalar StreetBoss en mi celular?', a: 'Si tienes un restaurante activo en StreetBoss, encontrarás la opción de agregar la app dentro de tu panel privado. El icono abre la administración de tu negocio. Tus comensales siguen abriendo el menú por enlace, sin instalar nada.' },
  {
    q: '¿Qué es un menú digital para restaurantes y cómo funciona con WhatsApp?',
    a: 'Un menú digital interactivo permite a tus clientes ver tus platillos con fotos reales desde su celular (escaneando un código QR o abriendo un link). Al seleccionar lo que desean, el sistema genera una comanda perfecta que se envía directamente a tu WhatsApp, sin pasar por intermediarios ni aplicaciones extra.'
  },
  {
    q: '¿Realmente no cobran comisiones por mis ventas?',
    a: 'StreetBoss no cobra comisión por venta. Pagas el servicio y recibes los pedidos directamente en tu WhatsApp. Los costos de cobro o reparto que contrates por tu cuenta son independientes.'
  },
  {
    q: '¿Cómo funcionan las zonas de reparto?',
    a: 'Desde tu Dashboard eliges las colonias que atiende tu negocio y defines el costo de envío y el pedido mínimo de cada una. El cliente selecciona su colonia al realizar el pedido.'
  },
  {
    q: '¿Puedo actualizar productos y marcar un platillo como agotado?',
    a: 'Sí. Puedes editar categorías, productos, fotografías y precios desde el Dashboard, además de marcar un producto como agotado u ocultarlo temporalmente.'
  },
  {
    q: '¿Puedo manejar mi menú desde el celular?',
    a: 'Sí. Tu espacio privado te guía para completar el perfil del restaurante, agregar platillos y configurar horarios, reparto y formas de pago. También puedes consultar pedidos, clientes y tutoriales.'
  },
  {
    q: '¿Mis clientes necesitan instalar una aplicación?',
    a: 'No. Tu menú se abre mediante un enlace desde Safari, Chrome u otro navegador en teléfono o computadora. Al finalizar, el pedido se envía por WhatsApp.'
  },
  {
    q: '¿Cuánto cuesta StreetBoss?',
    a: 'El primer año cuesta $499 MXN en un solo pago por 12 meses. A partir del segundo año puedes pagar $99 MXN al mes o $990 MXN por 12 meses, equivalente a pagar 10 mensualidades. StreetBoss no cobra comisión por venta.'
  }
]

export default function LandingFAQ({ horizontal = false }) {
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
          <p className="text-gray-300 text-base md:text-lg">
            Resolvemos todas tus dudas sobre nuestro Menú Digital.
          </p>
        </div>

        <div className={horizontal ? "landing-faq-grid" : "space-y-3"} data-horizontal-rail={horizontal || undefined}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={faq.q}
                className="bg-[#0A0B0E] border border-white/10 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-extrabold text-white text-base md:text-lg leading-snug hover:text-[#ff4b16] transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#ff4b16] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div id={`faq-answer-${idx}`} className="px-5 pb-5 pt-3 text-gray-300 text-base leading-relaxed border-t border-white/5 animate-fade-in-up">
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
