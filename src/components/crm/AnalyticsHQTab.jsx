import { useEffect, useMemo, useState } from 'react'
import { Activity, BarChart3, Eye, MousePointerClick, RefreshCw, ShoppingBag, Users } from 'lucide-react'
import { getClients } from '../../services/crmV3Service'
import { getMenuAnalytics } from '../../services/menuAnalyticsService'

const PERIODS = [
  { value: 7, label: '7 días' },
  { value: 30, label: '30 días' },
  { value: 90, label: '90 días' },
]

export default function AnalyticsHQTab() {
  const [days, setDays] = useState(30)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const businesses = useMemo(() => getClients().filter(item => !item.deleted_at && !item.is_demo), [])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setEvents(await getMenuAnalytics(businesses, days))
    } catch (loadError) {
      console.error('No se pudieron cargar las métricas:', loadError)
      setError('No se pudieron consultar las métricas en este momento.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [days])

  const rows = useMemo(() => businesses.map(business => {
    const list = events.filter(event => event.business_id === business.business_id)
    const views = list.filter(event => event.event_type === 'page_view')
    const orders = list.filter(event => event.event_type === 'order_created')
    const clicks = list.filter(event => ['cart_open', 'whatsapp_click', 'phone_click', 'maps_click', 'share_click'].includes(event.event_type))
    const sources = views.reduce((result, event) => {
      result[event.source || 'direct'] = (result[event.source || 'direct'] || 0) + 1
      return result
    }, {})
    const topSource = Object.entries(sources).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
    return {
      ...business,
      views: views.length,
      visitors: new Set(views.map(event => event.visitor_key)).size,
      clicks: clicks.length,
      orders: orders.length,
      conversion: views.length ? ((orders.length / views.length) * 100).toFixed(1) : '0.0',
      topSource,
    }
  }).sort((a, b) => b.views - a.views), [businesses, events])

  const totals = useMemo(() => ({
    views: rows.reduce((sum, row) => sum + row.views, 0),
    visitors: rows.reduce((sum, row) => sum + row.visitors, 0),
    clicks: rows.reduce((sum, row) => sum + row.clicks, 0),
    orders: rows.reduce((sum, row) => sum + row.orders, 0),
  }), [rows])

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-xs">
      <div className="bg-[#14161F] border border-white/5 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#FF6A1A]">Uso de menús públicos</p>
            <h2 className="text-xl font-black text-white flex items-center gap-2 mt-1"><BarChart3 size={22} /> Analítica HQ</h2>
            <p className="text-gray-400 mt-1">Métricas anónimas. No se guardan nombres, teléfonos ni ubicaciones exactas.</p>
          </div>
          <div className="flex gap-2">
            <select value={days} onChange={event => setDays(Number(event.target.value))} className="bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white font-bold">
              {PERIODS.map(period => <option key={period.value} value={period.value}>Últimos {period.label}</option>)}
            </select>
            <button onClick={load} disabled={loading} className="w-10 h-10 rounded-xl bg-white/5 text-white flex items-center justify-center disabled:opacity-40" aria-label="Actualizar métricas"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Visitas', value: totals.views, icon: Eye, color: 'text-blue-400' },
            { label: 'Visitantes', value: totals.visitors, icon: Users, color: 'text-violet-400' },
            { label: 'Interacciones', value: totals.clicks, icon: MousePointerClick, color: 'text-amber-400' },
            { label: 'Pedidos', value: totals.orders, icon: ShoppingBag, color: 'text-emerald-400' },
          ].map(metric => (
            <div key={metric.label} className="bg-[#0D0E12] border border-white/5 rounded-2xl p-4">
              <metric.icon size={18} className={metric.color} />
              <p className="text-2xl font-black text-white mt-2">{metric.value}</p>
              <p className="text-[10px] uppercase font-bold text-gray-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#14161F] border border-white/5 rounded-3xl p-4 sm:p-6 shadow-xl overflow-x-auto">
        {error && <p className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 font-bold mb-4">{error}</p>}
        <table className="w-full min-w-[760px] text-left">
          <thead><tr className="text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/10">
            <th className="py-3">Página / negocio</th><th>Visitas</th><th>Visitantes</th><th>Interacciones</th><th>Pedidos</th><th>Conversión</th><th>Origen principal</th>
          </tr></thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.business_id} className="border-b border-white/5 text-gray-300">
                <td className="py-4"><p className="font-black text-white">{row.name}</p><p className="text-[10px] text-gray-500">/menu/{row.slug}</p></td>
                <td className="font-black text-blue-400">{row.views}</td><td>{row.visitors}</td><td>{row.clicks}</td><td className="font-black text-emerald-400">{row.orders}</td><td>{row.conversion}%</td><td className="capitalize">{row.topSource}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && <p className="py-10 text-center text-gray-500">Todavía no hay páginas activas para medir.</p>}
        {loading && <p className="py-10 text-center text-gray-400 flex items-center justify-center gap-2"><Activity size={16} className="animate-pulse" /> Consultando métricas…</p>}
      </div>
    </div>
  )
}
