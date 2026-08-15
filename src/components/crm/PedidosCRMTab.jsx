import { useState, useEffect, useMemo } from 'react'
import { getAllOrders } from '../../services/crmV3Service'
import {
  ShoppingBag,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Phone,
  Store,
  ExternalLink,
  Copy,
  Download,
  CheckCircle,
  Clock,
  MapPin,
  X
} from 'lucide-react'

export default function PedidosCRMTab() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [filterBusiness, setFilterBusiness] = useState('todos')
  const [filterDateRange, setFilterDateRange] = useState('todos') // 'todos', 'hoy', 'ayer', '7dias', 'mes'
  const [filterDeliveryType, setFilterDeliveryType] = useState('todos') // 'todos', 'domicilio', 'recoleccion'
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  const loadOrders = () => {
    const list = getAllOrders()
    setOrders(list)
  }

  useEffect(() => {
    loadOrders()
    const handleOrdersUpdated = () => {
      loadOrders()
    }
    window.addEventListener('sb_orders_updated', handleOrdersUpdated)
    return () => {
      window.removeEventListener('sb_orders_updated', handleOrdersUpdated)
    }
  }, [])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  // Lista de negocios únicos para el filtro
  const businessList = useMemo(() => {
    return Array.from(new Set(orders.map(o => o.business_name).filter(Boolean)))
  }, [orders])

  // Filtrado y Ordenamiento por más reciente primero
  const filteredOrders = useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const startOfYesterday = startOfToday - 86400000
    const startOf7Days = startOfToday - 6 * 86400000
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

    return orders.filter(o => {
      const oTime = new Date(o.created_at).getTime()

      // Búsqueda
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        o.order_number?.toLowerCase().includes(q) ||
        o.customer_name?.toLowerCase().includes(q) ||
        o.whatsapp?.includes(q) ||
        o.business_name?.toLowerCase().includes(q) ||
        o.colonia?.toLowerCase().includes(q)

      // Filtro Negocio
      const matchBiz = filterBusiness === 'todos' || o.business_name === filterBusiness

      // Filtro Fecha
      let matchDate = true
      if (filterDateRange === 'hoy') matchDate = oTime >= startOfToday
      if (filterDateRange === 'ayer') matchDate = oTime >= startOfYesterday && oTime < startOfToday
      if (filterDateRange === '7dias') matchDate = oTime >= startOf7Days
      if (filterDateRange === 'mes') matchDate = oTime >= startOfMonth

      // Filtro Tipo Entrega
      let matchType = true
      if (filterDeliveryType !== 'todos') matchType = o.delivery_type === filterDeliveryType

      return matchSearch && matchBiz && matchDate && matchType
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [orders, search, filterBusiness, filterDateRange, filterDeliveryType])

  // Métricas acumuladas
  const metrics = useMemo(() => {
    const totalVentas = filteredOrders.reduce((acc, o) => acc + (o.total || 0), 0)
    const totalPedidos = filteredOrders.length
    const avgOrder = totalPedidos > 0 ? (totalVentas / totalPedidos).toFixed(2) : 0
    const domicilioCount = filteredOrders.filter(o => o.delivery_type === 'domicilio').length

    return { totalVentas, totalPedidos, avgOrder, domicilioCount }
  }, [filteredOrders])

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return alert('No hay pedidos para exportar.')
    let csv = 'Folio,Fecha,Negocio,Cliente,Telefono,TipoEntrega,Colonia,Subtotal,Envio,Total\n'
    filteredOrders.forEach(o => {
      csv += `"${o.order_number}","${new Date(o.created_at).toLocaleString()}","${o.business_name}","${o.customer_name}","${o.whatsapp}","${o.delivery_type}","${o.colonia || ''}",${o.subtotal},${o.delivery_fee},${o.total}\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `pedidos_streetboss_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exportación CSV completada')
  }

  return (
    <div className="space-y-6 text-xs max-w-7xl mx-auto">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle size={16} /> {toastMsg}
        </div>
      )}

      {/* Header Central de Pedidos */}
      <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <ShoppingBag className="text-[#FF4B00]" size={20} /> Registro Central de Pedidos
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Monitoreo y auditoría interna de todos los pedidos generados desde los menús públicos de StreetBoss.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white px-4 py-2 rounded-xl font-bold shadow-lg"
          >
            <Download size={14} /> Exportar CSV
          </button>
        </div>

        {/* Tarjetas de Métricas en Tiempo Real */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0D0E12] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Total Pedidos</span>
            <p className="text-xl font-black text-white">{metrics.totalPedidos}</p>
          </div>

          <div className="bg-[#0D0E12] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Venta Total Acumulada</span>
            <p className="text-xl font-black text-emerald-400">${metrics.totalVentas}</p>
          </div>

          <div className="bg-[#0D0E12] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Promedio por Pedido</span>
            <p className="text-xl font-black text-white">${metrics.avgOrder}</p>
          </div>

          <div className="bg-[#0D0E12] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Envíos a Domicilio</span>
            <p className="text-xl font-black text-[#FF6A1A]">{metrics.domicilioCount}</p>
          </div>
        </div>

        {/* Filtros Avanzados */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar folio, cliente, WhatsApp..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={15} />
          </div>

          <div>
            <select
              value={filterBusiness}
              onChange={e => setFilterBusiness(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
            >
              <option value="todos">Todos los Restaurantes</option>
              {businessList.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterDateRange}
              onChange={e => setFilterDateRange(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
            >
              <option value="todos">Cualquier Fecha</option>
              <option value="hoy">Hoy</option>
              <option value="ayer">Ayer</option>
              <option value="7dias">Últimos 7 Días</option>
              <option value="mes">Este Mes</option>
            </select>
          </div>

          <div>
            <select
              value={filterDeliveryType}
              onChange={e => setFilterDeliveryType(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
            >
              <option value="todos">Todos los Tipos de Entrega</option>
              <option value="domicilio">🛵 A Domicilio</option>
              <option value="recoleccion">🏪 Pasar a Recoger</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos Concentrada */}
      <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
        <h3 className="font-black text-white text-sm">Historial de Pedidos ({filteredOrders.length})</h3>

        {filteredOrders.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-10">
            No se han registrado pedidos en el período o criterios seleccionados. Realiza una prueba desde cualquier menú público.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(o => (
              <div
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className="bg-[#0D0E12] p-4 rounded-xl border border-white/5 hover:border-[#FF4B00]/40 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-white font-mono">{o.order_number}</span>
                    <span className="bg-white/5 text-gray-300 font-bold px-2 py-0.5 rounded text-[10px]">
                      {o.business_name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      o.delivery_type === 'domicilio'
                        ? 'bg-[#FF4B00]/10 text-[#FF6A1A] border border-[#FF4B00]/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {o.delivery_type === 'domicilio' ? '🛵 A Domicilio' : '🏪 Recoger'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      o.status === 'enviado_wa' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      o.status === 'confirmado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      o.status === 'entregado' ? 'bg-green-500/10 text-green-300 border border-green-500/20' :
                      o.status === 'cancelado' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {o.status === 'enviado_wa' ? 'Enviado WA' :
                       o.status === 'confirmado' ? 'Confirmado' :
                       o.status === 'entregado' ? 'Entregado' :
                       o.status === 'cancelado' ? 'Cancelado' :
                       'Pendiente'}
                    </span>
                  </div>

                  <p className="text-gray-300 font-bold">
                    👤 {o.customer_name} · <span className="text-emerald-400 font-mono">{o.whatsapp}</span>
                  </p>

                  <p className="text-[11px] text-gray-400">
                    📍 {o.colonia || 'Sin colonia'} {o.postal_code ? `(CP ${o.postal_code})` : ''} · <span className="text-gray-300">{new Date(o.created_at).toLocaleString()}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-white/5 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-gray-400 block">Monto Total</span>
                    <span className="text-base font-black text-emerald-400 font-mono">${o.total}</span>
                  </div>

                  <button className="bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                    Ver Detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detalle de Pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14161F] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <h3 className="font-black text-white text-base font-mono">{selectedOrder.order_number}</h3>
                <p className="text-[11px] text-gray-400">Registrado el {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 bg-[#0D0E12] p-4 rounded-xl border border-white/5">
              <p className="text-white font-bold text-sm">{selectedOrder.business_name}</p>
              <p className="text-gray-300">Cliente: <span className="font-bold text-white">{selectedOrder.customer_name}</span></p>
              <p className="text-emerald-400 font-mono">WhatsApp: {selectedOrder.whatsapp}</p>
              <p className="text-gray-400">Dirección: {selectedOrder.address || 'No especificada'} (Colonia {selectedOrder.colonia || 'N/A'}, CP {selectedOrder.postal_code || 'N/A'})</p>
              {selectedOrder.comentarios_internos && (
                <p className="text-amber-300 pt-1">💬 Comentario Interno: {selectedOrder.comentarios_internos}</p>
              )}
              {selectedOrder.observaciones && (
                <p className="text-gray-300">📝 Observaciones: {selectedOrder.observaciones}</p>
              )}
              {selectedOrder.hora_confirmacion && (
                <p className="text-gray-400">⏰ Hora Confirmación: {selectedOrder.hora_confirmacion}</p>
              )}
              {selectedOrder.hora_entrega && (
                <p className="text-emerald-400">🚚 Hora Entrega: {selectedOrder.hora_entrega}</p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white">Productos Solicitados:</h4>
              <div className="bg-[#0D0E12] p-3 rounded-xl border border-white/5 space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-300">
                    <span>{item.qty || item.cant}x {item.name || item.nombre}</span>
                    <span className="font-bold text-white">${item.subtotal}</span>
                  </div>
                ))}
                <div className="border-t border-white/5 pt-2 flex justify-between font-bold text-white">
                  <span>Subtotal: ${selectedOrder.subtotal}</span>
                  <span>Envío: {selectedOrder.delivery_fee === 0 ? 'GRATIS' : `$${selectedOrder.delivery_fee}`}</span>
                </div>
                <div className="flex justify-between font-black text-emerald-400 text-sm pt-1 border-t border-white/10">
                  <span>Total Pedido:</span>
                  <span>${selectedOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 font-bold">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
