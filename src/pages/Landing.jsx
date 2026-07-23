import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Store, Smartphone, MapPin, Zap, ChefHat, CheckCircle2, ArrowRight, MessageCircle, QrCode, Calculator, ChevronDown } from 'lucide-react'

const DEMOS = [
  {
    slug: 'taqueria-el-guero',
    name: 'Taquería El Güero',
    foodType: 'Tacos · Quesadillas · Bebidas',
    img: 'https://streetboss-web.vercel.app/demos/img/card-01.jpg',
    badge: 'Más visitado',
    color: 'from-yellow-500/20 to-orange-500/5',
    border: 'hover:border-yellow-500/50',
    href: 'https://streetboss-web.vercel.app/demos/01-taqueria-el-guero.html'
  },
  {
    slug: 'gorditas-la-dona',
    name: 'Gorditas La Doña',
    foodType: 'Antojitos · Gorditas · Comida mexicana',
    img: 'https://streetboss-web.vercel.app/demos/img/card-02.jpg',
    badge: 'Antojitos',
    color: 'from-orange-500/20 to-amber-500/5',
    border: 'hover:border-orange-500/50',
    href: 'https://streetboss-web.vercel.app/demos/02-gorditas-la-dona.html'
  },
  {
    slug: 'birria-los-toritos',
    name: 'Birria Los Toritos',
    foodType: 'Birria · Consomé · Tacos',
    img: 'https://streetboss-web.vercel.app/demos/img/card-03.jpg',
    badge: 'Birria',
    color: 'from-red-500/20 to-rose-500/5',
    border: 'hover:border-red-500/50',
    href: 'https://streetboss-web.vercel.app/demos/03-birria-los-toritos.html'
  },
  {
    slug: 'mariscos-la-perla',
    name: 'Mariscos La Perla',
    foodType: 'Mariscos · Cócteles · Tostadas',
    img: 'https://streetboss-web.vercel.app/demos/img/card-04.jpg',
    badge: 'Mariscos',
    color: 'from-blue-500/20 to-cyan-500/5',
    border: 'hover:border-blue-500/50',
    href: 'https://streetboss-web.vercel.app/demos/04-mariscos-la-perla.html'
  },
  {
    slug: 'tamales-dona-chucha',
    name: 'Tamales Doña Chucha',
    foodType: 'Tamales · Atole · Desayunos',
    img: 'https://streetboss-web.vercel.app/demos/img/card-05.jpg',
    badge: 'Tamales',
    color: 'from-yellow-600/20 to-amber-600/5',
    border: 'hover:border-yellow-600/50',
    href: 'https://streetboss-web.vercel.app/demos/05-tamales-dona-chucha.html'
  },
  {
    slug: 'pizza-callejera-don-nacho',
    name: 'Pizza Callejera Don Nacho',
    foodType: 'Pizza · Callejera · Promos',
    img: 'https://streetboss-web.vercel.app/demos/img/card-06.jpg',
    badge: 'Pizza',
    color: 'from-red-600/20 to-orange-600/5',
    border: 'hover:border-red-600/50',
    href: 'https://streetboss-web.vercel.app/demos/06-pizza-callejera-don-nacho.html'
  },
  {
    slug: 'cafe-el-molino',
    name: 'Café El Molino',
    foodType: 'Café · Panadería · Postres',
    img: 'https://streetboss-web.vercel.app/demos/img/card-07.jpg',
    badge: 'Café',
    color: 'from-amber-600/20 to-yellow-600/5',
    border: 'hover:border-amber-600/50',
    href: 'https://streetboss-web.vercel.app/demos/07-cafe-el-molino.html'
  },
  {
    slug: 'elotes-la-chela',
    name: 'Elotes La Chela',
    foodType: 'Elotes · Esquites · Snacks',
    img: 'https://streetboss-web.vercel.app/demos/img/card-08.jpg',
    badge: 'Elotes',
    color: 'from-yellow-500/20 to-green-500/5',
    border: 'hover:border-yellow-500/50',
    href: 'https://streetboss-web.vercel.app/demos/08-elotes-la-chela.html'
  },
  {
    slug: 'hamburguesas-el-brutal',
    name: 'Hamburguesas El Brutal',
    foodType: 'Burgers · Papas · Combos',
    img: 'https://streetboss-web.vercel.app/demos/img/card-09.jpg',
    badge: 'Burgers',
    color: 'from-red-700/20 to-orange-700/5',
    border: 'hover:border-red-700/50',
    href: 'https://streetboss-web.vercel.app/demos/09-hamburguesas-el-brutal.html'
  },
  {
    slug: 'pozoleria-la-guerrera',
    name: 'Pozolería La Guerrera',
    foodType: 'Pozole · Antojitos · Comida mexicana',
    img: 'https://streetboss-web.vercel.app/demos/img/card-10.jpg',
    badge: 'Pozole',
    color: 'from-green-600/20 to-red-600/5',
    border: 'hover:border-green-600/50',
    href: 'https://streetboss-web.vercel.app/demos/10-pozoleria-la-guerrera.html'
  }
]

const FAQS = [
  { q: '¿Qué es un menú digital para restaurantes y cómo funciona con WhatsApp?', a: 'Un menú digital interactivo permite a tus clientes ver tus platillos con fotos desde su celular (escaneando un código QR o abriendo un link). Al seleccionar lo que desean, el sistema genera una comanda perfecta que se envía directamente a tu WhatsApp, sin pasar por intermediarios ni aplicaciones extra.' },
  { q: '¿Realmente no cobran comisiones por mis ventas?', a: 'Así es. A diferencia de Uber Eats o Rappi que te cobran hasta el 30% por cada venta, con StreetBoss el 100% de tus ganancias es tuyo. Pagas solo tu suscripción y operas bajo tus propias reglas.' },
  { q: '¿Cómo funciona el cálculo de envíos por GPS?', a: 'Tú configuras tus tarifas por distancia (ej. hasta 3km = $20, hasta 6km = $40). Cuando el cliente hace su pedido, el sistema lee su ubicación por GPS y suma automáticamente el costo de envío al total, sin que tú tengas que calcularlo manualmente.' },
  { q: '¿Hay letras chiquitas o costos de instalación ocultos?', a: 'Ninguno. Los precios son transparentes: sin comisiones ocultas, sin cuota de alta y puedes cancelar tu suscripción mensual cuando quieras desde tu panel.' },
]

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [ventasMensuales, setVentasMensuales] = useState(30000)
  const comisionPromedio = 0.30 // 30% en apps de delivery
  const [isAnnual, setIsAnnual] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30 selection:text-white">
      
      {/* ── Navbar ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/70 backdrop-blur-xl border-white/10 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,184,122,0.4)] group-hover:shadow-[0_0_25px_rgba(245,184,122,0.6)] transition-all">
              <Store className="text-black" size={18} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight ml-1">StreetBoss<span className="text-primary">.</span></span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#solucion" className="hover:text-white transition-colors">La Solución</a>
            <a href="#demos" className="hover:text-white transition-colors">Ver Demos</a>
            <a href="#calculadora" className="hover:text-white transition-colors">Calculadora ROI</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="https://wa.me/529612466204" target="_blank" rel="noreferrer" className="bg-white text-black font-bold px-5 py-2 rounded-full text-sm hover:scale-105 transition-transform">
              Hablar con Ventas
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero Section (SEO Optimized) ── */}
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
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
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

      {/* ── Social Proof / Integrations ── */}
      <section className="border-y border-white/5 bg-[#050505] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">Integrado nativamente con</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
            <div className="flex items-center gap-2 font-bold text-xl"><MessageCircle size={24}/> WhatsApp Business</div>
            <div className="flex items-center gap-2 font-bold text-xl"><MapPin size={24}/> Google Maps API</div>
            <div className="flex items-center gap-2 font-bold text-xl"><QrCode size={24}/> Generador QR</div>
          </div>
        </div>
      </section>

      {/* ── Calculadora de ROI (SEO & Growth) ── */}
      <section id="calculadora" className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] relative border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="text-green-400" size={24} />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Calcula tu ahorro mensual</h2>
            <p className="text-gray-400">Descubre cuánto dinero le estás regalando a las apps de delivery.</p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <label className="block text-lg font-bold mb-6 text-center">
                Si vendes <span className="text-primary text-2xl">${ventasMensuales.toLocaleString()} MXN</span> al mes en Delivery...
              </label>
              
              <input 
                type="range" 
                min="5000" 
                max="100000" 
                step="5000" 
                value={ventasMensuales} 
                onChange={(e) => setVentasMensuales(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary mb-12"
              />

              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                  <p className="text-sm text-red-300 font-medium mb-2">Comisiones Apps (30%)</p>
                  <p className="text-3xl font-bold text-red-400">-${(ventasMensuales * comisionPromedio).toLocaleString()} MXN</p>
                  <p className="text-xs text-red-500/70 mt-2">Dinero perdido cada mes</p>
                </div>
                
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(34,197,94,0.1)] transform md:-translate-y-2">
                  <p className="text-sm text-green-300 font-medium mb-2">Con StreetBoss</p>
                  <p className="text-4xl font-extrabold text-green-400">+${(ventasMensuales * comisionPromedio).toLocaleString()} MXN</p>
                  <p className="text-xs text-green-500/70 mt-2">Ahorro directo a tu bolsillo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bento Box Features (La Solución) ── */}
      <section id="solucion" className="py-24 md:py-32 relative bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
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
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Pedidos directo a tu WhatsApp.</h3>
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
                <h3 className="text-xl font-bold mb-3">Envíos GPS Exactos.</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Configura tus zonas de envío. El sistema lee la ubicación del cliente y calcula la tarifa justa automáticamente.
                </p>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* ── Interactive Demos Section ── */}
      <section id="demos" className="py-24 bg-[#0a0a0a] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-[#f5b87a]">Explora nuestros demos</h2>
              <p className="text-xl text-gray-400 max-w-xl">
                Elige el estilo que más se parece a tu negocio y mira cómo se vería tu escaparate digital.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {DEMOS.map((demo) => {
              const waUrl = `https://wa.me/529612466204?text=${encodeURIComponent(`Hola, me interesa este demo: ${demo.name}`)}`
              
              return (
                <div 
                  key={demo.slug}
                  className={`group relative overflow-hidden rounded-[2.5rem] bg-[#050505] border border-white/10 hover:border-white/20 transition-all duration-500 shadow-xl flex flex-col`}
                >
                  {/* Hover Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                  
                  {/* Image Container */}
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={demo.img} 
                      alt={demo.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/600x400/0a0a0a/f5b87a?text=${encodeURIComponent(demo.name)}`;
                      }}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                    />
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-primary text-black font-extrabold px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-lg">
                      {demo.badge}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{demo.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{demo.foodType}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-auto">
                      <a 
                        href={demo.href} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3.5 px-4 rounded-2xl text-center text-sm transition-colors min-h-[48px] flex items-center justify-center"
                      >
                        Ver demo
                      </a>
                      
                      <a 
                        href={waUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 bg-primary hover:bg-[#f5b87a]/90 text-black font-black py-3.5 px-4 rounded-2xl text-center text-sm hover:scale-[1.03] transition-all min-h-[48px] flex items-center justify-center shadow-[0_4px_20px_rgba(245,184,122,0.15)] hover:shadow-[0_4px_25px_rgba(245,184,122,0.3)]"
                      >
                        Usar este estilo
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing Section: Oferta de Lanzamiento ── */}
      <section id="precios" className="py-32 relative bg-black overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-wider uppercase mb-6">
            OFERTA DE LANZAMIENTO HASTA AGOSTO
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Sin comisiones. Sin sorpresas.</h2>
          <p className="text-xl text-gray-400 mb-16 max-w-xl mx-auto">
            Elige el plan que mejor se adapte a tu restaurante. Todo el poder de StreetBoss para disparar tus ventas online.
          </p>
          
          <div className="max-w-2xl mx-auto text-left">
            <div className="bg-gradient-to-b from-[#111] to-black border border-primary/30 rounded-[2.5rem] p-8 md:p-12 relative shadow-[0_0_50px_rgba(245,184,122,0.15)] flex flex-col text-center">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(245,184,122,0.5)] whitespace-nowrap">
                OFERTA DE LANZAMIENTO 🚀
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 mt-2">Super paquete de inicio: $100 MXN al mes</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                Montamos tu menú digital optimizado para vender más a domicilio y aumentar tu ticket promedio.
              </p>
              
              <div className="mb-8 pb-8 border-b border-white/10 flex flex-col items-center">
                <span className="bg-green-500/10 text-green-400 text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider mb-3">
                  🔥 7 días de prueba gratis
                </span>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold text-white">$100</span>
                  <span className="text-gray-400 font-medium ml-2">MXN / mes</span>
                </div>
                <p className="text-xs text-amber-400 font-bold mt-3">
                  ⚠️ Disponible únicamente para los primeros 10 negocios
                </p>
                <p className="text-xs text-gray-500 mt-2 max-w-sm leading-relaxed">
                  Prueba el sistema completo gratis por 7 días. Después de los 7 días, aplica el plan de $100 MXN al mes para los primeros 10 negocios. Sin plazos forzosos.
                </p>
              </div>
              
              <div className="text-left max-w-md mx-auto space-y-4 mb-10">
                <p className="text-white font-bold text-xs uppercase tracking-wider mb-2 text-center text-primary">¿Qué incluye el paquete?</p>
                {[
                  'Menú Digital Interactivo e Ilimitado',
                  'Pedidos ilimitados directo a tu WhatsApp',
                  'Cálculo de envíos por GPS (manual, costo fijo o por km)',
                  'Panel de administración (/dashboard) para actualizar precios y fotos',
                  'Código QR personalizado para imprimir en tus mesas'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              <a 
                href="https://wa.me/529612466204?text=Hola,%20quiero%20probar%20los%207%20dias%20gratis%20y%20apartar%20el%20paquete%20de%20100%20pesos" 
                target="_blank" 
                rel="noreferrer" 
                className="block text-center w-full bg-primary text-black font-black py-4 rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(245,184,122,0.4)] text-base"
              >
                📱 Iniciar prueba de 7 días gratis por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section (SEO Optimized) ── */}
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

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 bg-black pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center gap-2">
              <Store className="text-primary" size={20} />
              <span className="font-bold text-lg tracking-tight">StreetBoss<span className="text-primary">.</span></span>
            </div>
            
            <div className="flex gap-8 text-sm font-medium">
              <a href="#solucion" className="text-gray-500 hover:text-white transition-colors">Características</a>
              <Link to="/superadmin" className="text-gray-500 hover:text-white transition-colors">Login Admin</Link>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} StreetBoss. Creado para dominar tu mercado local.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
