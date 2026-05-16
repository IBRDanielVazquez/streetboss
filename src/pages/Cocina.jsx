import { useState, useEffect, useRef } from 'react'
// FIX 4: No se necesita navigate — la cocina se queda en pantalla al marcar listo
import { useApp } from '../context/AppContext'
import { useSound } from '../hooks/useSound'
import ModalCancelar from '../components/ModalCancelar'
import BottomNav from '../components/BottomNav'

function Timer({ desde }) {
  const [seg, setSeg] = useState(0)
  useEffect(() => {
    const calc = () => setSeg(Math.floor((Date.now() - new Date(desde)) / 1000))
    calc(); const id = setInterval(calc, 1000); return () => clearInterval(id)
  }, [desde])
  const m = Math.floor(seg/60), s = seg%60
  const color = seg < 600 ? 'text-green-400' : seg < 1200 ? 'text-yellow-400 animate-pulse' : 'text-red-400 animate-pulse'
  return <span className={`font-mono font-black text-2xl ${color}`}>{m}:{String(s).padStart(2,'0')}</span>
}

export default function Cocina() {
  const { mesas, config, turnoActivo, marcarGrupoListo, cancelarPedido } = useApp()
  // FIX 4: NO useNavigate — al marcar listo el grupo desaparece reactivamente, cocina se queda aquí
  const { playNotification } = useSound()
  const [cancelarMesa, setCancelarMesa] = useState(null)
  const prevCount = useRef(0)

  // Lista plana de grupos activos (no entregados) de todas las mesas en cocina
  const grupos = mesas
    .filter(m => m.enCocina)
    .flatMap(m =>
      (m.grupos || [])
        .filter(g => !g.entregado)
        .map(g => ({ ...g, mesaNumero: m.numero }))
    )
    .sort((a, b) => new Date(a.horaEnvio) - new Date(b.horaEnvio))

  // Sonido al llegar nuevo grupo
  useEffect(() => {
    if (grupos.length > prevCount.current) playNotification()
    prevCount.current = grupos.length
  }, [grupos.length])

  const handleListo = (mesaNum, grupoId) => { marcarGrupoListo(mesaNum, grupoId) }
  const handleCancelar = (razon) => { cancelarPedido(cancelarMesa, razon); setCancelarMesa(null) }

  const turnoAbierto = turnoActivo && !turnoActivo.fin

  if (!turnoAbierto) return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-8 gap-4">
      <span className="text-6xl">🔒</span>
      <p className="text-white font-black text-xl text-center">Sin turno activo</p>
      <p className="text-gray-500 text-sm text-center">El administrador debe abrir el turno</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 bg-dark sticky top-0 z-20">
        <div>
          <h1 className="text-primary font-black text-2xl tracking-tight">COCINA</h1>
          <p className="text-gray-500 text-xs">{config.negocio} · {new Date().toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-black text-3xl">{grupos.length}</p>
          <p className="text-gray-500 text-xs">{grupos.length === 1 ? 'pedido' : 'pedidos'}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {grupos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <span className="text-7xl mb-4">👨🍳</span>
            <p className="text-xl font-bold">Todo al día</p>
            <p className="text-sm mt-1">No hay pedidos pendientes</p>
          </div>
        ) : grupos.map(grupo => (
          <div key={grupo.id} className="bg-dark2 rounded-3xl p-5 border border-white/5">
            {/* Mesa y timer */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col items-center gap-1">
                <div className="bg-primary text-dark font-black text-4xl w-20 h-20 rounded-2xl flex items-center justify-center">
                  {grupo.mesaNumero}
                </div>
                {grupo.meseroNombre && (
                  <span className="text-primary font-bold text-[10px] uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">
                    {grupo.meseroNombre}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs mb-1">Esperando</p>
                <Timer desde={grupo.horaEnvio}/>
              </div>
            </div>

            {/* Productos del grupo */}
            <div className="space-y-2 mb-5">
              {grupo.productos.map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary font-black text-lg w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                    {p.cantidad}
                  </span>
                  <div>
                    <p className="text-white font-bold text-base leading-tight">{p.nombre}</p>
                    {p.nota && <p className="text-primary text-sm font-semibold mt-0.5">→ {p.nota}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <button onClick={() => setCancelarMesa(grupo.mesaNumero)}
                className="bg-red-900/40 text-red-400 font-bold px-4 py-3 rounded-2xl text-sm min-h-[52px] active:bg-red-900/60">
                Cancelar
              </button>
              <button onClick={() => handleListo(grupo.mesaNumero, grupo.id)}
                className="flex-1 bg-green-600 text-white font-black py-3 rounded-2xl text-xl min-h-[60px] active:bg-green-700">
                ✓ LISTO
              </button>
            </div>
          </div>
        ))}
      </div>

      {cancelarMesa && (
        <ModalCancelar pinAdmin={config.pinAdmin} onConfirmar={handleCancelar} onCerrar={() => setCancelarMesa(null)}/>
      )}
      <BottomNav />
    </div>
  )
}
