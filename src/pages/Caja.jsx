import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useRol } from '../hooks/useRol'

function tiempoDesde(iso) {
  if (!iso) return null
  const min = Math.floor((Date.now() - new Date(iso)) / 60000)
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}m`
}

export default function Caja() {
  const { mesas, historial, config, turnoActivo } = useApp()
  const navigate = useNavigate()
  const { basePath } = useRol()

  const turnoAbierto = turnoActivo && !turnoActivo.fin

  const mesasPorCobrar = mesas.filter(m => m.estado === 'lista')

  const hoy = new Date().toDateString()
  const cobrosHoy = historial.filter(h =>
    new Date(h.fecha).toDateString() === hoy && h.estado === 'cobrado'
  )
  const cobradoHoy    = cobrosHoy.reduce((s, h) => s + h.total, 0)
  const totalPorCobrar = mesasPorCobrar.reduce((s, m) => s + m.totalParcial, 0)

  if (!turnoAbierto) return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-8 gap-4">
      <span className="text-6xl">🔒</span>
      <p className="text-white font-black text-xl text-center">Sin turno activo</p>
      <p className="text-gray-500 text-sm text-center">El administrador debe abrir el turno</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark pb-8">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/5 bg-dark sticky top-0 z-20">
        <h1 className="text-primary font-black text-2xl tracking-tight">💰 CAJA</h1>
        <p className="text-gray-500 text-xs">{config.negocio}</p>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Resumen de turno */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark2 rounded-2xl p-4">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Por cobrar</p>
            <p className="text-white font-black text-2xl">${totalPorCobrar.toLocaleString()}</p>
            <p className="text-gray-600 text-xs mt-1">
              {mesasPorCobrar.length} mesa{mesasPorCobrar.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="bg-dark2 rounded-2xl p-4">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Cobrado hoy</p>
            <p className="text-green-400 font-black text-2xl">${cobradoHoy.toLocaleString()}</p>
            <p className="text-gray-600 text-xs mt-1">{cobrosHoy.length} cobros</p>
          </div>
        </div>

        {/* Lista de mesas por cobrar */}
        {mesasPorCobrar.length === 0 ? (
          <div className="py-20 text-center">
            <span className="text-6xl">✅</span>
            <p className="text-white font-bold text-lg mt-4">Sin mesas por cobrar</p>
            <p className="text-gray-600 text-sm mt-1">Las mesas aparecerán aquí cuando el mesero las marque listas</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Mesas por cobrar</p>
            {mesasPorCobrar.map(m => (
              <button key={m.numero}
                onClick={() => navigate(`${basePath}/${m.numero}`)}
                className="w-full bg-dark2 border-2 border-primary/40 rounded-2xl p-4 text-left active:scale-[0.99] transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-dark font-black text-2xl w-12 h-12 rounded-xl flex items-center justify-center">
                      {m.numero}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Mesa {m.numero}</p>
                      {m.meseroNombre && <p className="text-gray-500 text-xs">{m.meseroNombre}</p>}
                      {m.horaAbierta && (
                        <p className="text-gray-600 text-xs">{tiempoDesde(m.horaAbierta)}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-black text-2xl">${m.totalParcial.toLocaleString()}</p>
                    <p className="text-primary text-xs font-bold">Cobrar →</p>
                  </div>
                </div>
                {/* Resumen productos */}
                <div className="border-t border-white/5 pt-2 space-y-1">
                  {m.pedidos.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">{p.cantidad}× {p.nombre}</span>
                      <span className="text-gray-500 text-xs">${(p.precio * p.cantidad).toLocaleString()}</span>
                    </div>
                  ))}
                  {m.pedidos.length > 3 && (
                    <p className="text-gray-600 text-xs">+{m.pedidos.length - 3} productos más</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
