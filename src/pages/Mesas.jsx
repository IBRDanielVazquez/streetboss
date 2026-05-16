import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart2, Flame, Plus, ShoppingBag, DollarSign, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useRol } from '../hooks/useRol'
import BottomNav from '../components/BottomNav'

function Reloj() {
  const [hora, setHora] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setHora(new Date()), 1000); return () => clearInterval(id) }, [])
  return <span className="text-gray-400 text-sm font-semibold tabular-nums">
    {hora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
  </span>
}

function tiempoDesde(iso) {
  if (!iso) return null
  const min = Math.floor((Date.now() - new Date(iso)) / 60000)
  return min < 60 ? `${min} min` : `${Math.floor(min/60)}h ${min%60}m`
}

const ESTADO = {
  libre:     { bg:'bg-dark3',        border:'border-green-600',   texto:'Disponible', textColor:'text-green-400' },
  ocupada:   { bg:'bg-dark3',        border:'border-yellow-500',  texto:'Ocupada',    textColor:'text-yellow-400' },
  lista:     { bg:'bg-dark3',        border:'border-red-500 border-blink', texto:'Por cobrar', textColor:'text-red-400' },
  bloqueada: { bg:'bg-gray-900/50',  border:'border-gray-700',   texto:'Bloqueada',  textColor:'text-gray-600' },
}

export default function Mesas() {
  const { mesas, config, turnoActivo, abrirTurno, slug, loading, actualizarConfig } = useApp()
  const [mesaSel, setMesaSel] = useState(null)
  const navigate = useNavigate()
  const { rol, basePath } = useRol()
  
  const esAdmin  = rol === 'admin'
  const esMesero = rol === 'mesero'
  const esCaja   = rol === 'caja'
  const pedidosEnCocina = mesas.filter(m => m.enCocina).length
  const todasOcupadas = mesas.every(m => m.estado !== 'libre')

  const tocarMesa = (m) => {
    if (!turnoActivo || turnoActivo.fin) return   // sin turno = todo bloqueado
    if (m.estado === 'bloqueada') return
    if (esCaja) {
      if (m.estado === 'lista') navigate(`${basePath}/${m.numero}`)
      return
    }
    if (m.estado === 'ocupada' || m.estado === 'lista') {
      setMesaSel(m)
    } else {
      navigate(`${basePath}/pedido/${m.numero}`)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  )

  const mesasVisibles = esCaja ? mesas.filter(m => m.estado === 'lista') : mesas

  return (
    <div className="min-h-screen bg-dark pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 sticky top-0 bg-dark z-20">
        <div className="flex items-center gap-2">
          {config.logo
            ? <img src={config.logo} className="w-9 h-9 rounded-xl object-cover" alt="logo"/>
            : <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"><span className="text-dark font-black text-sm">SB</span></div>}
          <span className="text-white font-black text-base">{config.negocio}</span>
        </div>
        <Reloj />
        {esAdmin && (
          <button onClick={() => navigate(`/${slug}/admin/reporte`)} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 active:text-primary">
            <BarChart2 size={22} />
          </button>
        )}
      </div>

      <div className="px-4 pt-3 space-y-4">
        {/* Banner turno */}
        {(!turnoActivo || turnoActivo.fin)
          ? (esAdmin 
              ? <div className="bg-primary/10 border border-primary/30 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <p className="text-primary font-semibold text-sm">⚠️ Sin turno activo</p>
                  <button onClick={abrirTurno} className="bg-primary text-dark font-bold px-4 py-2 rounded-xl text-sm min-h-[40px]">Abrir turno</button>
                </div>
              : <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-2xl px-4 py-3">
                  <p className="text-yellow-400 text-sm">⚠️ Turno no iniciado — contacta al administrador</p>
                </div>
            )
          : <div className="bg-green-900/20 border border-green-700/30 rounded-2xl px-4 py-2">
              <p className="text-green-400 text-sm font-semibold">
                ✅ Turno abierto desde {new Date(turnoActivo.inicio).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}
              </p>
            </div>
        }

        {/* Grid de mesas */}
        <div className="relative">
          {(!turnoActivo || turnoActivo.fin) && !esAdmin && (
            <div className="absolute inset-0 bg-dark/85 rounded-2xl flex flex-col items-center justify-center gap-3 z-10 p-6 min-h-[200px]">
              <span className="text-5xl">🔒</span>
              <p className="text-white font-bold text-lg text-center">Turno cerrado</p>
              <p className="text-gray-400 text-sm text-center">Contacta al administrador para abrir el turno</p>
            </div>
          )}
        {esCaja && mesasVisibles.length === 0 ? (
          <div className="py-20 text-center text-gray-600">
            <p className="text-xl font-bold">Sin mesas por cobrar</p>
            <p className="text-sm">Las mesas aparecerán aquí cuando estén listas</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {mesasVisibles.map(m => {
              const cfg = ESTADO[m.estado] || ESTADO.libre
              const meseroEsperando = esMesero && config.cajeroHabilitado && m.estado === 'lista'
              return (
                <button key={m.numero} onClick={() => tocarMesa(m)}
                  className={`${cfg.bg} border-2 ${cfg.border} rounded-2xl p-4 min-h-[120px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform relative`}>
                  <span className="text-white font-black text-4xl">{m.numero}</span>
                  <span className={`${cfg.textColor} text-xs font-bold`}>
                    {m.enCocina ? '🍳 En cocina' : (meseroEsperando ? 'Esperando cajero' : cfg.texto)}
                  </span>
                  {m.totalParcial > 0 && (
                    <span className="text-primary font-black text-lg">${m.totalParcial.toLocaleString()}</span>
                  )}
                  {m.horaAbierta && m.estado !== 'libre' && (
                    <span className="text-gray-500 text-xs">{tiempoDesde(m.horaAbierta)}</span>
                  )}
                  {m.meseroNombre && m.estado !== 'libre' && (
                    <span className="text-gray-500 text-[10px]">{m.meseroNombre}</span>
                  )}
                  {m.enCocina && (
                    <span className="absolute top-2 right-2 bg-orange-500 rounded-full w-2.5 h-2.5" />
                  )}
                </button>
              )
            })}
            {(esAdmin || esMesero) && todasOcupadas && (
              <button onClick={() => actualizarConfig({ numMesas: config.numMesas + 1 })}
                className="bg-dark2 border-2 border-dashed border-gray-700 rounded-2xl p-4 min-h-[120px] flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform text-gray-500">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Plus size={24} />
                </div>
                <span className="font-bold text-sm">+ Mesa</span>
              </button>
            )}
          </div>
        )}
        </div>  {/* cierre del div relative wrapper */}
      </div>

      {/* FAB cocina */}
      {esAdmin && (
        <button onClick={() => navigate(`/${slug}/admin/cocina`)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-dark rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-20">
          <Flame size={24} />
          {pedidosEnCocina > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
              {pedidosEnCocina}
            </span>
          )}
        </button>
      )}

      <BottomNav />

      {/* Modal Opciones Mesa */}
      {mesaSel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMesaSel(null)} />
          <div className="relative w-full max-w-md bg-dark2 rounded-t-[32px] p-6 pb-10 animate-slide-up border-t border-white/10">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-white font-black text-2xl">Mesa {mesaSel.numero}</h3>
                <p className="text-gray-400 text-sm">{ESTADO[mesaSel.estado]?.texto}</p>
              </div>
              <button onClick={() => setMesaSel(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => { navigate(`${basePath}/pedido/${mesaSel.numero}`); setMesaSel(null) }}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors border border-white/5">
                <Plus size={22} className="text-primary" /> ➕ Agregar más
              </button>
              
              <button 
                disabled={esMesero && config.cajeroHabilitado}
                onClick={() => { navigate(`${basePath}/cobro/${mesaSel.numero}`); setMesaSel(null) }}
                className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors border
                  ${(esMesero && config.cajeroHabilitado) 
                    ? 'bg-gray-800 border-transparent text-gray-500 opacity-50' 
                    : 'bg-primary border-primary text-dark active:scale-[0.98]'}`}>
                <DollarSign size={22} /> 💰 Cobrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
