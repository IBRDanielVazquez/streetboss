import React from 'react'

const FAQS = [
  { q: '¿Qué es un menú digital para restaurantes y cómo funciona con WhatsApp?', a: 'Un menú digital interactivo permite a tus clientes ver tus platillos con fotos desde su celular (escaneando un código QR o abriendo un link). Al seleccionar lo que desean, el sistema genera una comanda perfecta que se envía directamente a tu WhatsApp, sin pasar por intermediarios ni aplicaciones extra.' },
  { q: '¿Realmente no cobran comisiones por mis ventas?', a: 'Así es. A diferencia de Uber Eats o Rappi que te cobran hasta el 30% por cada venta, con StreetBoss el 100% de tus ganancias es tuyo. Pagas solo tu suscripción y operas bajo tus propias reglas.' },
  { q: '¿Cómo funciona el cálculo de envíos por GPS?', a: 'Tú configuras tus tarifas por distancia (ej. hasta 3km = $20, hasta 6km = $40). Cuando el cliente hace su pedido, el sistema lee su ubicación por GPS y suma automáticamente el costo de envío al total, sin que tú tengas que calcularlo manualmente.' },
  { q: '¿Hay letras chiquitas o costos de instalación ocultos?', a: 'Ninguno. Los precios son transparentes: sin comisiones ocultas, sin cuota de alta y puedes cancelar tu suscripción mensual cuando quieras desde tu panel.' },
]

export default function LandingFAQ() {
  return (
    <section className="py-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Preguntas Frecuentes</h2>
          <p className="text-gray-400">Resolvemos todas tus dudas sobre nuestro Menú Digital.</p>
        </div>
        
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                <span className="text-primary">•</span> {faq.q}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base ml-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
