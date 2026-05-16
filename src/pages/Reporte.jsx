import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart2, Download, Lock, TrendingUp, ShoppingBag, Clock, DollarSign } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useRol } from '../hooks/useRol'
import ModalPin from '../components/ModalPin'
import BottomNav from '../components/BottomNav'

// Rango de fechas según período seleccionado
function rangoFechas(periodo, fechaInicio, fechaFin) {
  const hoy = new Date(); hoy.setHours(23,59,59,999)
  const inicio = new Date(); inicio.setHours(0,0,0,0)
  if (periodo === 'hoy') return { desde: inicio, hasta: hoy }
  if (periodo === 'semana') { const d = new Date(inicio); d.setDate(d.getDate()-6); return { desde: d, hasta: hoy } }
  if (periodo === 'mes') { const d = new Date(inicio); d.setDate(1); return { desde: d, hasta: hoy } }
  if (periodo === 'personalizado') {
    return {
      desde: fechaInicio ? new Date(fechaInicio + 'T00:00:00') : inicio,
      hasta: fechaFin   ? new Date(fechaFin   + 'T23:59:59') : hoy,
    }
  }
  return { desde: inicio, hasta: hoy }
}

// Mini barra de gráfico horizontal
function BarraHora({ hora, monto, maxMonto }) {
  const pct = maxMonto ? Math.round((monto / maxMonto) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs w-8 text-right">{hora}h</span>
      <div className="flex-1 bg-dark3 rounded-full h-4 overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-gray-400 text-xs w-14 text-right">${monto.toLocaleString()}</span>
    </div>
  )
}

// Vista pública del turno (sin PIN)
function VistaDia({ turnoActivo, historial, cerrarTurno }) {
  const [pinVis, setPinVis] = useState(false)
  const { config, mesas } = useApp()

  // Solo registros del turno actual
  const delTurno = turnoActivo
    ? historial.filter(r => r.estado === 'cobrado' && new Date(r.fecha) >= new Date(turnoActivo.inicio))
    : []

  const ventasTurno  = delTurno.reduce((s,r) => s + r.total, 0)
  const ticketProm   = delTurno.length ? Math.round(ventasTurno / delTurno.length) : 0
  
  // Estado de caja
  const porMetodo = delTurno.reduce((acc, r) => {
    acc[r.formaPago] = (acc[r.formaPago] || 0) + (r.total - (r.propina?.monto || 0))
    acc.propinas = (acc.propinas || 0) + (r.propina?.monto || 0)
    return acc
  }, { efectivo: 0, tarjeta: 0, transferencia: 0, propinas: 0 })

  // Estado en vivo
  const enCocina = mesas.filter(m => m.enCocina).length
  const ocupadas = mesas.filter(m => m.estado === 'ocupada' && !m.enCocina).length
  const porCobrar = mesas.filter(m => m.estado === 'lista').length
  const libres = mesas.filter(m => m.estado === 'libre').length

  // Meseros activos
  const meserosHoy = Array.from(new Set(delTurno.map(r => r.mesero).filter(Boolean)))

  return (
    <div className="space-y-6">
      {/* Total Vendido */}
      <div className="bg-dark2 rounded-[32px] p-6 text-center border border-white/5">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Vendido este turno</p>
        <p className="text-[#f5b87a] font-black text-5xl">${ventasTurno.toLocaleString()}</p>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs font-bold uppercase tracking-wider">
          <div className="text-white/60">📦 {delTurno.length} Cobrados</div>
          <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
          <div className="text-white/60">🎫 ${ticketProm} Promedio</div>
        </div>
      </div>

      {/* Estado en vivo */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'En cocina', val: enCocina, color: 'text-orange-400', bg: 'bg-orange-400/10' },
          { label: 'Ocupadas', val: ocupadas, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Por cobrar', val: porCobrar, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Libres', val: libres, color: 'text-gray-500', bg: 'bg-gray-500/10' },
        ].map(i => (
          <div key={i.label} className={`${i.bg} rounded-2xl p-4 border border-white/5`}>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">{i.label}</p>
            <p className={`${i.color} font-black text-2xl`}>{i.val}</p>
          </div>
        ))}
      </div>

      {/* Estado de caja */}
      <div className="bg-dark2 rounded-2xl p-5 border border-white/5 space-y-4">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Flujo de Caja</p>
        <div className="space-y-3">
          {[
            { label: 'Efectivo', val: porMetodo.efectivo, icon: '💵' },
            { label: 'Tarjeta', val: porMetodo.tarjeta, icon: '💳' },
            { label: 'Transferencia', val: porMetodo.transferencia, icon: '📲' },
            { label: 'Propinas (en mano)', val: porMetodo.propinas, icon: '💰', color: 'text-green-400' },
          ].map(i => (
            <div key={i.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{i.icon}</span>
                <span className="text-gray-400 text-sm font-semibold">{i.label}</span>
              </div>
              <span className={`font-bold ${i.color || 'text-white'}`}>${i.val.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meseros activos */}
      {meserosHoy.length > 0 && (
        <div className="bg-dark2 rounded-2xl p-5 border border-white/5">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3">Equipo en turno</p>
          <div className="flex flex-wrap gap-2">
            {meserosHoy.map(m => (
              <span key={m} className="bg-dark3 px-3 py-1.5 rounded-full text-[11px] font-black text-primary border border-white/5 uppercase">
                👤 {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Últimos 5 pedidos */}
      <div className="bg-dark2 rounded-2xl p-5 border border-white/5">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-4">Últimos cobros</p>
        <div className="space-y-4">
          {delTurno.slice(-5).reverse().map(r => (
            <div key={r.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/20 text-primary text-[10px] font-black px-1.5 py-0.5 rounded">M{r.mesa}</span>
                  <span className="text-white text-xs font-bold uppercase">{r.mesero || 'Admin'}</span>
                </div>
                <p className="text-gray-600 text-[10px] mt-1">{new Date(r.fecha).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})} · {r.formaPago}</p>
              </div>
              <span className="text-white font-black">${r.total.toLocaleString()}</span>
            </div>
          ))}
          {delTurno.length === 0 && <p className="text-gray-600 text-xs text-center">No hay cobros registrados</p>}
        </div>
      </div>

      {/* Botón cerrar turno */}
      {turnoActivo ? (
        <button onClick={() => setPinVis(true)}
          className="w-full bg-red-900/40 border border-red-700/40 text-red-400 font-bold py-4 rounded-2xl min-h-[56px] shadow-lg shadow-red-900/10">
          🔒 Cerrar turno con PIN
        </button>
      ) : (
        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-2xl px-4 py-3 text-center">
          <p className="text-yellow-400 text-sm font-bold">⚠️ Turno cerrado</p>
        </div>
      )}

      {pinVis && (
        <ModalPin
          titulo="Cerrar turno"
          subtitulo="Ingresa tu PIN de administrador"
          pinCorrecto={config.pinAdmin}
          onExito={async () => {
            const resultado = await cerrarTurno()
            if (resultado.ok) {
              setPinVis(false)
            } else {
              alert(`🚫 ${resultado.mensaje}`)
            }
          }}
          onCerrar={() => setPinVis(false)}
        />
      )}
    </div>
  )
}

// Vista admin con métricas completas (requiere PIN)
function VistaAdmin({ historial }) {
  const [periodo,     setPeriodo]     = useState('hoy')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin,    setFechaFin]    = useState('')
  const [meseroFiltro, setMeseroFiltro] = useState('todos')

  const { desde, hasta } = rangoFechas(periodo, fechaInicio, fechaFin)

  const registrosPorFecha = useMemo(() =>
    historial.filter(r => {
      const t = new Date(r.fecha)
      return t >= desde && t <= hasta
    }), [historial, desde.getTime(), hasta.getTime()])

  const meserosEnPeriodo = useMemo(() => {
    const m = new Set(registrosPorFecha.map(r => r.mesero).filter(Boolean))
    return ['todos', ...Array.from(m).sort()]
  }, [registrosPorFecha])

  const registros = useMemo(() => {
    if (meseroFiltro === 'todos') return registrosPorFecha
    return registrosPorFecha.filter(r => r.mesero === meseroFiltro)
  }, [registrosPorFecha, meseroFiltro])

  const cobrados   = registros.filter(r => r.estado === 'cobrado')
  const cancelados = registros.filter(r => r.estado === 'cancelado')

  const totalVentas  = cobrados.reduce((s,r) => s + r.total, 0)
  const totalPropina = cobrados.reduce((s,r) => s + (r.propina?.monto||0), 0)
  const ticketProm   = cobrados.length ? Math.round(totalVentas / cobrados.length) : 0

  // Tiempo promedio en cocina (mesas con horaLista y horaEnvioCocina)
  const tiemposProm = cobrados
    .filter(r => r.tiempoCocina != null)
    .map(r => r.tiempoCocina)
  const promCocina = tiemposProm.length
    ? Math.round(tiemposProm.reduce((s,v)=>s+v,0)/tiemposProm.length)
    : null

  // Ventas por hora
  const porHora = useMemo(() => {
    const mapa = {}
    cobrados.forEach(r => {
      const h = new Date(r.fecha).getHours()
      mapa[h] = (mapa[h]||0) + r.total
    })
    return Array.from({length:24},(_,i)=>({ hora:i, monto: mapa[i]||0 }))
      .filter(x => x.monto > 0)
  }, [cobrados])
  const maxMonto = Math.max(...porHora.map(x=>x.monto), 1)

  // Top 5 productos
  const conteoProds = useMemo(() => {
    const mapa = {}
    cobrados.forEach(r => {
      (r.productos||[]).forEach(p => {
        if (!mapa[p.nombre]) mapa[p.nombre] = { nombre:p.nombre, qty:0, total:0 }
        mapa[p.nombre].qty   += p.cantidad
        mapa[p.nombre].total += p.precio * p.cantidad
      })
    })
    return Object.values(mapa).sort((a,b) => b.qty - a.qty).slice(0,5)
  }, [cobrados])

  // Métodos de pago
  const porMetodo = useMemo(() => {
    const m = {}
    cobrados.forEach(r => { m[r.formaPago] = (m[r.formaPago]||0) + r.total })
    return Object.entries(m).map(([k,v]) => ({ metodo:k, total:v }))
  }, [cobrados])

  // Exportar JSON
  const exportar = () => {
    const blob = new Blob([JSON.stringify(registros, null, 2)], { type:'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url
    a.download = `streetboss-reporte-${new Date().toISOString().slice(0,10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Selector período */}
      <div className="bg-dark2 rounded-2xl p-4 space-y-3">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Período</p>
        <div className="grid grid-cols-4 gap-2">
          {['hoy','semana','mes','personalizado'].map(p => (
            <button key={p} onClick={() => setPeriodo(p)}
              className={`py-2 rounded-xl text-xs font-bold capitalize transition-colors
                ${periodo===p?'bg-primary text-dark':'bg-dark3 text-gray-400'}`}>
              {p==='personalizado'?'Custom':p.charAt(0).toUpperCase()+p.slice(1)}
            </button>
          ))}
        </div>
        {periodo==='personalizado' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-500 text-xs block mb-1">Desde</label>
              <input type="date" value={fechaInicio} onChange={e=>setFechaInicio(e.target.value)}
                className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[40px]"/>
            </div>
            <div>
              <label className="text-gray-500 text-xs block mb-1">Hasta</label>
              <input type="date" value={fechaFin} onChange={e=>setFechaFin(e.target.value)}
                className="w-full bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[40px]"/>
            </div>
          </div>
        )}

        {/* Filtro por Mesero */}
        <div className="pt-2">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Filtrar por mesero</p>
          <div className="flex flex-wrap gap-2">
            {meserosEnPeriodo.map(m => (
              <button key={m} onClick={() => setMeseroFiltro(m)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase transition-all border
                  ${meseroFiltro === m ? 'bg-primary border-primary text-dark' : 'bg-dark3 border-white/5 text-gray-500'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-dark2 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign size={14} className="text-primary"/><p className="text-gray-500 text-xs">Total ventas</p></div>
          <p className="text-primary font-black text-2xl">${totalVentas.toLocaleString()}</p>
        </div>
        <div className="bg-dark2 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2"><ShoppingBag size={14} className="text-primary"/><p className="text-gray-500 text-xs">Pedidos cobrados</p></div>
          <p className="text-white font-black text-2xl">{cobrados.length}</p>
          {cancelados.length > 0 && <p className="text-red-400 text-xs mt-1">{cancelados.length} cancelados</p>}
        </div>
        <div className="bg-dark2 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp size={14} className="text-primary"/><p className="text-gray-500 text-xs">Ticket promedio</p></div>
          <p className="text-white font-black text-2xl">${ticketProm.toLocaleString()}</p>
        </div>
        <div className="bg-dark2 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2"><Clock size={14} className="text-primary"/><p className="text-gray-500 text-xs">Tiempo cocina</p></div>
          <p className="text-white font-black text-2xl">{promCocina != null ? `${promCocina}m` : '—'}</p>
        </div>
      </div>

      {/* Propinas y métodos */}
      <div className="bg-dark2 rounded-2xl p-4 space-y-3">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Propinas y pagos</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Propinas totales</span>
          <span className="text-green-400 font-black text-lg">${totalPropina.toLocaleString()}</span>
        </div>
        {porMetodo.map(m => (
          <div key={m.metodo} className="flex items-center justify-between">
            <span className="text-gray-400 text-sm capitalize">{m.metodo==='efectivo'?'💵':m.metodo==='transferencia'?'📲':'💳'} {m.metodo}</span>
            <span className="text-white font-bold">${m.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Gráfica por hora */}
      {porHora.length > 0 && (
        <div className="bg-dark2 rounded-2xl p-4 space-y-2">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Ventas por hora</p>
          {porHora.map(x => (
            <BarraHora key={x.hora} hora={x.hora} monto={x.monto} maxMonto={maxMonto}/>
          ))}
        </div>
      )}

      {/* Top 5 productos */}
      {conteoProds.length > 0 && (
        <div className="bg-dark2 rounded-2xl p-4 space-y-3">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Top productos</p>
          {conteoProds.map((p,i) => (
            <div key={p.nombre} className="flex items-center gap-3">
              <span className="text-primary font-black text-lg w-6">{i+1}</span>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">{p.nombre}</p>
                <p className="text-gray-500 text-xs">{p.qty} vendidos</p>
              </div>
              <span className="text-primary font-bold">${p.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Historial completo */}
      <div className="bg-dark2 rounded-2xl p-4">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Historial ({registros.length})</p>
        {registros.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-4">Sin registros en este período</p>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500">
                  <th className="text-left pb-2 pr-2">Hora</th>
                  <th className="text-left pb-2 pr-2">Mesa</th>
                  <th className="text-left pb-2 pr-2">Mesero</th>
                  <th className="text-right pb-2 pr-2">Total</th>
                  <th className="text-left pb-2 pr-2">Pago</th>
                  <th className="text-left pb-2">Estado</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                {[...registros].reverse().map((r,i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2 pr-2 text-gray-400">{new Date(r.fecha).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}</td>
                    <td className="py-2 pr-2 text-white font-bold">{r.mesa}</td>
                    <td className="py-2 pr-2 text-gray-500">{r.mesero||'—'}</td>
                    <td className="py-2 pr-2 text-primary font-bold text-right">${r.total.toLocaleString()}</td>
                    <td className="py-2 pr-2 text-gray-400 capitalize">{r.formaPago||'—'}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                        ${r.estado==='cobrado'?'bg-green-900/40 text-green-400':'bg-red-900/40 text-red-400'}`}>
                        {r.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Exportar */}
      <button onClick={exportar}
        className="w-full bg-dark2 border border-gray-700 text-gray-300 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 min-h-[56px]">
        <Download size={18}/> Exportar JSON
      </button>
    </div>
  )
}

export default function Reporte() {
  const { historial, turnoActivo, cerrarTurno, config, slug } = useApp()
  const navigate  = useNavigate()
  const { basePath } = useRol()
  const [tab,       setTab]       = useState('dia')  // 'dia' | 'admin'
  const [pinVis,    setPinVis]    = useState(false)
  const [adminOK,   setAdminOK]   = useState(false)

  const irAdmin = () => {
    if (adminOK) { setTab('admin'); return }
    setPinVis(true)
  }

  return (
    <div className="min-h-screen bg-dark pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-dark sticky top-0 z-20">
        <button onClick={() => navigate(`${basePath}/mesas`)} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary">←</button>
        <div className="flex-1">
          <h2 className="text-white font-black text-lg flex items-center gap-2"><BarChart2 size={18} className="text-primary"/> Reporte</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 py-3 border-b border-white/5">
        <button onClick={() => setTab('dia')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors
            ${tab==='dia'?'bg-primary text-dark':'bg-dark2 text-gray-400'}`}>
          Turno actual
        </button>
        <button onClick={irAdmin}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5
            ${tab==='admin'?'bg-primary text-dark':'bg-dark2 text-gray-400'}`}>
          {!adminOK && <Lock size={13}/>} Admin
        </button>
      </div>

      <div className="p-4">
        {tab === 'dia'
          ? <VistaDia turnoActivo={turnoActivo} historial={historial} cerrarTurno={cerrarTurno}/>
          : <VistaAdmin historial={historial}/>
        }
      </div>

      {pinVis && (
        <ModalPin
          titulo="Reporte Admin"
          subtitulo="Ingresa tu PIN de administrador"
          pinCorrecto={config.pinAdmin}
          onExito={() => { setAdminOK(true); setTab('admin'); setPinVis(false) }}
          onCerrar={() => setPinVis(false)}
        />
      )}

      <BottomNav />
    </div>
  )
}
