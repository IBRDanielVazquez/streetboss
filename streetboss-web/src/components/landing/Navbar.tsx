"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/70 backdrop-blur-xl border-white/10 py-4' : 'bg-transparent border-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <Image src="/brand/master/01_Master_Icon.svg" alt="StreetBoss Icon" width={32} height={32} />
          <span className="font-bold text-xl tracking-tight ml-1 font-poppins">StreetBoss<span className="text-primary">.</span></span>
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#solucion" className="hover:text-white transition-colors">La Solución</a>
          <a href="#demos" className="hover:text-white transition-colors">Ver Demos</a>
          <a href="#calculadora" className="hover:text-white transition-colors">Calculadora ROI</a>
          <a href="#precios" className="hover:text-white transition-colors">Precios</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://wa.me/529613725386" target="_blank" rel="noreferrer" className="bg-white text-black font-bold px-5 py-2 rounded-full text-sm hover:scale-105 transition-transform">
            Hablar con Ventas
          </a>
        </div>
      </div>
    </nav>
  )
}
