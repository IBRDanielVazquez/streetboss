import { ArrowLeft, ArrowRight, CheckCircle2, Facebook, Instagram, MessageCircle } from 'lucide-react'
import { DEMO_SHOWCASE } from '../data/demoShowcase'

import { DEMO_CONTACTS } from '../data/demoFixtures'
const FACEBOOK_URL = 'https://www.facebook.com/share/1Csqs8gKqt/?mibextid=wwXIfr'
const INSTAGRAM_URL = 'https://www.instagram.com/streetboss.mx/'
const VENTAS_URL = `https://wa.me/${DEMO_CONTACTS.SALES_WHATSAPP}?text=Hola,%20quiero%20mi%20menu%20digital%20con%20la%20oferta%20de%2099%20pesos`

export default function Demos() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-black text-gray-300 transition-colors hover:text-white">
            <ArrowLeft size={18} /> Volver
          </a>
          <img
            src="/brand/StreetBoss_Logo_Horizontal_Oficial.webp"
            alt="StreetBoss"
            width="600"
            height="337"
            className="h-16 w-auto object-contain mix-blend-screen sm:h-20"
          />
          <a href={VENTAS_URL} target="_blank" rel="noreferrer" className="hidden rounded-full bg-[#ff4b16] px-5 py-3 text-sm font-black text-white shadow-[0_0_24px_rgba(255,75,22,0.35)] sm:inline-flex">
            Hablar con Ventas
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 pb-12 pt-16 text-center sm:px-6 md:pb-16 md:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#ff4b16]/25 blur-[140px]" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.36em] text-[#f5b87a]">StreetBoss demos oficiales</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl md:text-7xl">
            Elige el estilo de menú digital para tu negocio.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-xl">
            Cada demo muestra cómo se vería un escaparate de venta directa: fotos, productos, carrito y pedido enviado directo a WhatsApp.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#catalogo" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff4b16] px-8 py-4 font-black text-white shadow-[0_0_30px_rgba(255,75,22,0.35)] transition-transform hover:scale-105 sm:w-auto">
              Ver demos <ArrowRight size={18} />
            </a>
            <a href="#oferta" className="inline-flex w-full items-center justify-center rounded-full border border-white/15 px-8 py-4 font-black text-white transition-colors hover:bg-white/5 sm:w-auto">
              Ver oferta
            </a>
          </div>
        </div>
      </section>

      <section id="catalogo" className="border-y border-white/10 bg-[#050505] px-4 py-12 sm:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-[#f5b87a] md:text-5xl">Explora nuestros demos</h2>
              <p className="mt-3 max-w-xl text-sm text-gray-400 sm:text-lg">
                Diez categorías listas para vender más a domicilio sin pagar comisiones por pedido.
              </p>
            </div>
            <p className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-400">
              10 demos oficiales
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
            {DEMO_SHOWCASE.map((demo, index) => (
              <article key={demo.id} className="group relative flex min-h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#ff4b16]/50 sm:rounded-[1.8rem]">
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="relative h-32 overflow-hidden sm:h-44">
                  <img
                    src={demo.img}
                    alt={demo.name}
                    width="900"
                    height="600"
                    loading={index < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-[#f5b87a] px-2 py-1 text-[8px] font-black uppercase tracking-wider text-black sm:left-3 sm:top-3 sm:text-[10px]">
                    {demo.badge}
                  </span>
                </div>
                <div className="relative z-10 flex flex-1 flex-col p-3 sm:p-5">
                  <p className="text-xl sm:text-2xl">{demo.emoji}</p>
                  <h3 className="mt-1 text-sm font-black leading-tight text-white sm:text-xl">{demo.name}</h3>
                  <p className="mt-1 line-clamp-2 text-[11px] font-semibold text-gray-500 sm:text-sm">{demo.foodType}</p>
                  <div className="mt-4 grid gap-2">
                    <a href={demo.menuUrl} className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-center text-[11px] font-black text-white transition-colors hover:bg-white/10 sm:text-sm">
                      Ver demo
                    </a>
                    <a href={demo.whatsappUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[#ff4b16] px-2 py-2 text-center text-[11px] font-black text-white transition-transform hover:scale-[1.02] sm:text-sm">
                      Usar estilo
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="oferta" className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-[2rem] border border-[#f5b87a]/30 bg-gradient-to-br from-[#16100a] to-black p-6 shadow-[0_0_60px_rgba(255,75,22,0.14)] md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-[#f5b87a]">Oferta de lanzamiento</p>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">$99 MXN al mes durante tus primeros 3 meses.</h2>
            <p className="mt-5 max-w-2xl text-gray-400">
              Después $249 MXN al mes. Sin comisiones por venta. Sin intermediarios. El pedido llega directo al WhatsApp del negocio.
            </p>
            <div className="mt-7 grid gap-3 text-sm text-gray-300 sm:grid-cols-2">
              {[
                'Menú digital con fotos y categorías',
                'Carrito y pedido estructurado por WhatsApp',
                'Dashboard para editar productos y precios',
                'Cálculo de envío manual, fijo o por km',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#f5b87a]" size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-[1.5rem] border border-white/10 bg-black/50 p-5">
            <p className="text-sm font-bold text-amber-300">Disponible únicamente para los primeros 10 negocios.</p>
            <a href={VENTAS_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#ff4b16] px-6 py-4 text-base font-black text-white shadow-[0_0_30px_rgba(255,75,22,0.35)] transition-transform hover:scale-105">
              <MessageCircle size={19} /> Quiero mi menú digital
            </a>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-[#ff4b16]">
                <Facebook size={16} /> Facebook
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-[#ff4b16]">
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
