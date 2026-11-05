import { useEffect, useMemo, useState } from 'react'
import { getOrdersByBusiness } from '../../services/crmV3Service'
import { MapPin, Medal, ShoppingBag, Trophy, UtensilsCrossed } from 'lucide-react'

function normalizeItems(items) {
  if (Array.isArray(items)) return items
  if (typeof items !== 'string') return []

  return items.split(',').map(rawItem => {
    const cleanItem = rawItem.trim()
    const match = cleanItem.match(/^(\d+)\s*x\s*(.+)$/i)
    return match
      ? { name: match[2].trim(), qty: Number(match[1]) }
      : { name: cleanItem, qty: 1 }
  }).filter(item => item.name)
}

export default function RestaurantInsightsTab({ businessId, view }) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const loadOrders = () => setOrders(getOrdersByBusiness(businessId))
    loadOrders()
    window.addEventListener('sb_orders_updated', loadOrders)
    window.addEventListener('storage', loadOrders)
    return () => {
      window.removeEventListener('sb_orders_updated', loadOrders)
      window.removeEventListener('storage', loadOrders)
    }
  }, [businessId])

  const activeOrders = useMemo(
    () => orders.filter(order => order.status !== 'cancelado'),
    [orders]
  )

  const ranking = useMemo(() => {
    const totals = new Map()

    if (view === 'platillos') {
      activeOrders.forEach(order => {
        normalizeItems(order.items).forEach(item => {
          const name = item.name || item.nombre || 'Platillo'
          const quantity = Number(item.qty || item.cant || item.quantity || 1)
          totals.set(name, (totals.get(name) || 0) + quantity)
        })
      })
    } else {
      activeOrders.forEach(order => {
        const colonia = String(order.colonia || '').trim()
        if (colonia) totals.set(colonia, (totals.get(colonia) || 0) + 1)
      })
    }

    return [...totals.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [activeOrders, view])

  const isDishes = view === 'platillos'
  const maxCount = ranking[0]?.count || 1
  const Icon = isDishes ? UtensilsCrossed : MapPin

  return (
    <section className="mx-auto max-w-2xl space-y-5 animate-fade-in">
      <div className={`relative overflow-hidden rounded-[2rem] border border-white/10 p-6 ${isDishes ? 'bg-gradient-to-br from-orange-500/20 to-[#14161F]' : 'bg-gradient-to-br from-cyan-500/20 to-[#14161F]'}`}>
        <div className="relative flex items-center gap-4">
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] text-white shadow-lg ${isDishes ? 'bg-gradient-to-br from-orange-400 to-red-600' : 'bg-gradient-to-br from-cyan-400 to-blue-700'}`}>
            <Icon size={27} />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Lo que más eligen</p>
            <h2 className="mt-1 text-xl font-black text-white">{isDishes ? 'Platillos más pedidos' : 'Colonias que más piden'}</h2>
            <p className="mt-1 text-xs text-white/55">Se actualiza automáticamente con cada pedido recibido.</p>
          </div>
        </div>
      </div>

      {ranking.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-14 text-center">
          <ShoppingBag className="mx-auto text-white/25" size={36} />
          <h3 className="mt-4 text-base font-black text-white">Todavía no hay suficiente información</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-white/45">Cuando lleguen pedidos, aquí aparecerá el ranking automáticamente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ranking.map((item, index) => (
            <article key={item.name} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black ${index === 0 ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/70'}`}>
                  {index === 0 ? <Trophy size={19} /> : index < 3 ? <Medal size={18} /> : index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate text-sm font-black text-white">{item.name}</h3>
                    <span className="shrink-0 text-xs font-black text-white/70">{item.count} {isDishes ? 'pedidos' : item.count === 1 ? 'pedido' : 'pedidos'}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${isDishes ? 'bg-orange-500' : 'bg-cyan-500'}`} style={{ width: `${Math.max(8, (item.count / maxCount) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
