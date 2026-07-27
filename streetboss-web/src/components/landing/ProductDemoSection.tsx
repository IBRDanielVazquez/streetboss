import React from 'react'
import Image from 'next/image'

// Demos list from Landing.jsx
const DEMOS = [
  {
    slug: 'taqueria-el-guero',
    name: 'Taquería El Güero',
    foodType: 'Tacos · Quesadillas · Bebidas',
    img: '/brand/demos/card-01.jpg',
    badge: 'Más visitado',
    color: 'from-yellow-500/20 to-orange-500/5',
    border: 'hover:border-yellow-500/50',
    href: 'https://streetboss-web.vercel.app/demos/01-taqueria-el-guero.html'
  },
  {
    slug: 'gorditas-la-dona',
    name: 'Gorditas La Doña',
    foodType: 'Antojitos · Gorditas · Comida mexicana',
    img: '/brand/demos/card-02.jpg',
    badge: 'Antojitos',
    color: 'from-orange-500/20 to-amber-500/5',
    border: 'hover:border-orange-500/50',
    href: 'https://streetboss-web.vercel.app/demos/02-gorditas-la-dona.html'
  },
  {
    slug: 'birria-los-toritos',
    name: 'Birria Los Toritos',
    foodType: 'Birria · Consomé · Tacos',
    img: '/brand/demos/card-03.jpg',
    badge: 'Birria',
    color: 'from-red-500/20 to-rose-500/5',
    border: 'hover:border-red-500/50',
    href: 'https://streetboss-web.vercel.app/demos/03-birria-los-toritos.html'
  },
  {
    slug: 'mariscos-la-perla',
    name: 'Mariscos La Perla',
    foodType: 'Mariscos · Cócteles · Tostadas',
    img: '/brand/demos/card-04.jpg',
    badge: 'Mariscos',
    color: 'from-blue-500/20 to-cyan-500/5',
    border: 'hover:border-blue-500/50',
    href: 'https://streetboss-web.vercel.app/demos/04-mariscos-la-perla.html'
  },
  {
    slug: 'tamales-dona-chucha',
    name: 'Tamales Doña Chucha',
    foodType: 'Tamales · Atole · Desayunos',
    img: '/brand/demos/card-05.jpg',
    badge: 'Tamales',
    color: 'from-yellow-600/20 to-amber-600/5',
    border: 'hover:border-yellow-600/50',
    href: 'https://streetboss-web.vercel.app/demos/05-tamales-dona-chucha.html'
  },
  {
    slug: 'pizza-callejera-don-nacho',
    name: 'Pizza Callejera Don Nacho',
    foodType: 'Pizza · Callejera · Promos',
    img: '/brand/demos/card-06.jpg',
    badge: 'Pizza',
    color: 'from-red-600/20 to-orange-600/5',
    border: 'hover:border-red-600/50',
    href: 'https://streetboss-web.vercel.app/demos/06-pizza-callejera-don-nacho.html'
  },
  {
    slug: 'cafe-el-molino',
    name: 'Café El Molino',
    foodType: 'Café · Panadería · Postres',
    img: '/brand/demos/card-07.jpg',
    badge: 'Café',
    color: 'from-amber-600/20 to-yellow-600/5',
    border: 'hover:border-amber-600/50',
    href: 'https://streetboss-web.vercel.app/demos/07-cafe-el-molino.html'
  },
  {
    slug: 'elotes-la-chela',
    name: 'Elotes La Chela',
    foodType: 'Elotes · Esquites · Snacks',
    img: '/brand/demos/card-08.jpg',
    badge: 'Elotes',
    color: 'from-yellow-500/20 to-green-500/5',
    border: 'hover:border-yellow-500/50',
    href: 'https://streetboss-web.vercel.app/demos/08-elotes-la-chela.html'
  },
  {
    slug: 'hamburguesas-el-brutal',
    name: 'Hamburguesas El Brutal',
    foodType: 'Burgers · Papas · Combos',
    img: '/brand/demos/card-09.jpg',
    badge: 'Burgers',
    color: 'from-red-700/20 to-orange-700/5',
    border: 'hover:border-red-700/50',
    href: 'https://streetboss-web.vercel.app/demos/09-hamburguesas-el-brutal.html'
  },
  {
    slug: 'pozoleria-la-guerrera',
    name: 'Pozolería La Guerrera',
    foodType: 'Pozole · Antojitos · Comida mexicana',
    img: '/brand/demos/card-10.jpg',
    badge: 'Pozole',
    color: 'from-green-600/20 to-red-600/5',
    border: 'hover:border-green-600/50',
    href: 'https://streetboss-web.vercel.app/demos/10-pozoleria-la-guerrera.html'
  }
]

export function ProductDemoSection() {
  return (
    <section id="demos" className="py-24 bg-[#0a0a0a] border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-primary font-poppins">Explora nuestros demos</h2>
            <p className="text-xl text-gray-400 max-w-xl">
              Elige el estilo que más se parece a tu negocio y mira cómo se vería tu escaparate digital.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEMOS.map((demo) => {
            const waUrl = `https://wa.me/529613725386`
            
            return (
              <div 
                key={demo.slug}
                className={`group relative overflow-hidden rounded-[2.5rem] bg-[#050505] border border-white/10 hover:border-white/20 transition-all duration-500 shadow-xl flex flex-col`}
              >
                {/* Hover Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                
                {/* Image Container */}
                <div className="h-56 overflow-hidden relative">
                  {/* Fallback pattern background behind image */}
                  <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
                    <span className="text-primary font-bold opacity-50">{demo.name}</span>
                  </div>
                  <Image 
                    src={demo.img} 
                    alt={demo.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100 relative z-10" 
                  />
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-primary text-black font-extrabold px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-lg z-20">
                    {demo.badge}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between relative z-20">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors font-poppins">{demo.name}</h3>
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
                      className="flex-1 bg-primary hover:bg-[#FF6A1A] text-black font-black py-3.5 px-4 rounded-2xl text-center text-sm hover:scale-[1.03] transition-all min-h-[48px] flex items-center justify-center shadow-[0_4px_20px_rgba(255,75,0,0.15)] hover:shadow-[0_4px_25px_rgba(255,75,0,0.3)]"
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
  )
}
