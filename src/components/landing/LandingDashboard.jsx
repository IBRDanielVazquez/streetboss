import React from 'react'
import { BarChart3, BookOpen, Building2, Clock3, ShoppingBag, Users } from 'lucide-react'

const TOOLS = [
  { icon: ShoppingBag, title: 'Menú y disponibilidad', text: 'Productos, categorías, precios, fotos y productos agotados.' },
  { icon: Building2, title: 'Datos del negocio', text: 'Información comercial, contacto, redes sociales y presencia pública.' },
  { icon: Clock3, title: 'Horarios y operación', text: 'Controla cuándo está abierto tu negocio y cómo recibe pedidos.' },
  { icon: Users, title: 'Pedidos y clientes', text: 'Consulta pedidos, conserva tu cartera y conoce su actividad.' },
  { icon: BarChart3, title: 'Métricas', text: 'Visualiza visitas, productos destacados y comportamiento del menú.' },
  { icon: BookOpen, title: 'Tutoriales', text: 'Aprende a configurar StreetBoss paso a paso desde tu Dashboard.' }
]

export default function LandingDashboard({ horizontal = false }) {
  return (
    <section id="dashboard" className="border-y border-white/5 bg-[#08090c] py-24 md:py-32 reveal-on-scroll">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-14">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff6b3d] mb-4">Tu restaurante en tu celular</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-5">Tu negocio bajo control desde el celular.</h2>
          <p className="text-base md:text-xl text-gray-400 leading-relaxed">
            Pon tu portada y tu logo, agrega tus platillos y configura cómo recibir pedidos. Todo por secciones, desde tu celular. Agrega el acceso a tu pantalla de inicio para volver a tu panel con un toque.
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${horizontal ? "landing-tool-rail" : ""}`} data-horizontal-rail={horizontal || undefined}>
          {TOOLS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-[#0d0e12] p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#ff4b16]/20 bg-[#ff4b16]/10">
                <Icon className="text-[#ff4b16]" size={21} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">{title}</h3>
              <p className="text-base leading-relaxed text-gray-300">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
