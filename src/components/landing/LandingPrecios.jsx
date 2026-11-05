import { CheckCircle2, ArrowUpRight } from 'lucide-react'
import { DEMO_CONTACTS } from '../../data/demoFixtures'

export default function LandingPrecios() {
  const message = encodeURIComponent('Quiero StreetBoss por $499 MXN el primer año. Desde el segundo año: $99 MXN/mes o $990 MXN/año.')
  return (
    <section id="precios" className="relative overflow-hidden bg-black py-20 md:py-28 reveal-on-scroll">
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-widest text-[#ff6b3d]">Vende directo. Manda tú.</p>
            <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">Un año para que<br />te pidan directo.</h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-300">Comparte tu menú en tus redes, en tu local o por WhatsApp. Tus clientes eligen sus platillos y te envían el pedido. La relación se queda en tu negocio.</p>
            <div className="mt-8 space-y-4">
              {['Tu escaparate con fotos, categorías y precios.', 'Pedidos organizados directo a tu WhatsApp.', 'Actualiza tu menú desde tu celular.', 'Tú defines horarios, reparto y formas de pago.'].map(text => <p key={text} className="flex items-start gap-3 text-base text-gray-200"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#ff6b3d]" />{text}</p>)}
            </div>
          </div>
          <div className="rounded-[2rem] border border-[#ff4b16]/70 bg-[#121318] p-6 shadow-[0_0_70px_#ff4b1615] sm:p-10">
            <p className="font-bold text-[#ffae94]">Tu primer año con StreetBoss</p>
            <p className="mt-5 flex flex-wrap items-baseline gap-3"><span className="text-7xl font-black tracking-tighter">$499</span><span className="font-bold text-gray-300">MXN / primer año</span></p>
            <p className="mt-4 text-lg font-bold">Un solo pago. 12 meses completos.</p>
            <p className="mt-2 leading-relaxed text-gray-300">Sin mensualidades durante el primer año. Sin comisión por venta.</p>
            <a href={`https://wa.me/${DEMO_CONTACTS.SALES_WHATSAPP}?text=${message}`} target="_blank" rel="noreferrer" className="mt-8 flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#ff4b16] px-5 py-4 text-center font-black text-white transition hover:bg-[#e83e0a]">Quiero mi año por $499 <ArrowUpRight size={20} className="shrink-0" /></a>
            <div className="mt-7 border-t border-white/10 pt-6">
              <h3 className="font-bold">¿Y a partir del segundo año?</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <p className="rounded-2xl border border-white/10 p-4"><strong className="block text-2xl">$99</strong><span className="text-sm text-gray-300">MXN al mes</span></p>
                <p className="rounded-2xl border border-[#ff4b16]/30 bg-[#ff4b16]/5 p-4"><strong className="block text-2xl">$990</strong><span className="text-sm text-gray-300">MXN por año</span></p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">Al pagar el año completo, usas 12 meses y pagas el equivalente a 10 mensualidades. Ahorras $198 MXN frente a 12 pagos mensuales.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
