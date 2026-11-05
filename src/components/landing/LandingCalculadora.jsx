import React, { useState } from 'react'
import { Calculator } from 'lucide-react'

export default function LandingCalculadora() {
  const [ventasMensuales, setVentasMensuales] = useState(30000)
  const [comision, setComision] = useState(30)
  const comisionPromedio = comision / 100
  const ahorroNeto = Math.max(0, ventasMensuales * comisionPromedio - 499 / 12)

  return (
    <section id="calculadora" className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] relative border-b border-white/5 reveal-on-scroll">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calculator className="text-green-400" size={24} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Calcula tu ahorro mensual</h2>
          <p className="text-gray-400">Estima cuánto podrías conservar al recibir ventas directas.</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <label htmlFor="sales-volume" className="block text-lg font-bold mb-6 text-center">
              Si vendes <span className="text-[#ff4b16] text-2xl">${ventasMensuales.toLocaleString()} MXN</span> al mes en Delivery...
            </label>
            
            <input 
              type="range" id="sales-volume"
              min="5000" 
              max="100000" 
              step="5000" 
              value={ventasMensuales} 
              onChange={(e) => setVentasMensuales(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary mb-12"
            />

            <label className="block text-sm text-gray-300">Comisión de tu ejemplo: {comision}%
              <input aria-label="Comisión del ejemplo" type="range" min="0" max="40" step="1" value={comision} onChange={event => setComision(Number(event.target.value))} className="mt-4 min-h-8 w-full accent-[#ff4b16]" />
            </label>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center animate-fade-in-up">
                <p className="text-base text-red-200 font-medium mb-2">Comisión que elegiste ({comision}%)</p>
                <p className="text-3xl font-bold text-red-400">-${(ventasMensuales * comisionPromedio).toLocaleString()} MXN</p>
                <p className="text-sm text-red-300 mt-2">Costo potencial cada mes</p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(34,197,94,0.1)] transform md:-translate-y-2 animate-fade-in-up-delay">
                <p className="text-base text-green-200 font-medium mb-2">Con StreetBoss</p>
                <p className="text-4xl font-extrabold text-green-400">+${ahorroNeto.toLocaleString('es-MX', { maximumFractionDigits: 2 })} MXN</p>
                <p className="text-sm text-green-300 mt-2">Ahorro mensual ilustrativo del primer año</p>
              </div>
            </div>
            <p className="mt-6 text-center text-sm leading-relaxed text-gray-400">Ejemplo con el mismo volumen de ventas directas. Descuenta $499 / 12 como costo mensual equivalente del primer año; el servicio se paga por año completo. No incluye reparto, cobros ni otros costos de operación. Las ventas no están garantizadas.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
