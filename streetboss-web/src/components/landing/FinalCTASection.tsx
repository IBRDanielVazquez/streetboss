import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function FinalCTASection() {
  return (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <Image src="/brand/master/01_Master_Icon.svg" alt="StreetBoss Icon" width={24} height={24} />
            <span className="font-bold text-lg tracking-tight ml-1 font-poppins">StreetBoss<span className="text-primary">.</span></span>
          </Link>
          
          <div className="flex gap-8 text-sm font-medium">
            <a href="#solucion" className="text-gray-500 hover:text-white transition-colors">Características</a>
            <a href="https://wa.me/529613725386" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">Contacto Ventas</a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} StreetBoss. Creado para dominar tu mercado local.</p>
          <div className="flex gap-4">
            <span>🌐 streetboss.com.mx</span>
            <span>💬 WhatsApp: +52 961 372 5386</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
