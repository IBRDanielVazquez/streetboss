import { useState, useEffect, useMemo } from 'react'
import { getOrdersByBusiness, updateOrderStatus } from '../../services/crmV3Service'
import {
  ShoppingBag,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  DollarSign,
  Phone,
  Edit2,
  Save,
  Send,
  Calendar,
  AlertTriangle,
  X
} from 'lucide-react'

export default function RestaurantOrdersTab({ businessId, businessName }) {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [editingOrder, setEditingOrder] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  const loadOrders = () => {
    const list = getOrdersByBusiness(businessId)
    setOrders(list)
  }

  useEffect(() => {
    loadOrders()
  }, [businessId])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  // Filtrado y Ordenamiento por más reciente
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        o.order_number?.toLowerCase().includes(q) ||
        o.customer_name?.toLowerCase().includes(q) ||
        o.whatsapp?.includes(q) ||
        o.colonia?.toLowerCase().includes(q)

      const matchStatus = filterStatus === 'todos' || o.status === filterStatus
      return matchSearch && matchStatus
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [orders, search, filterStatus])

  const handleSaveOrderEdit = (e) => {
    e.preventDefault()
    if (!editingOrder) return

    updateOrderStatus(editingOrder.id, editingOrder.status, {
      comentarios_internos: editingOrder.comentarios_internos,
      observaciones: editingOrder.observaciones,
      hora_confirmacion: editingOrder.hora_confirmacion,
      hora_entrega: editingOrder.hora_entrega,
    })

    loadOrders()
    setEditingOrder(null)
    showToast('Pedido actualizado correctamente')
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pendiente_envio':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-md font-bold text-[10px]">Pendiente de envío ⏳</span>
      case 'enviado_wa':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-md font-bold text-[10px]">Enviado por WhatsApp 📱</span>
      case 'en_proceso':
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-md font-bold text-[10px]">En preparación 🍳</span>
      case 'confirmado':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-md font-bold text-[10px]">Confirmado ✅</span>
      case 'entregado':
        return <span className="bg-green-500/10 text-green-300 border border-green-500/20 px-2.5 py-0.5 rounded-md font-bold text-[10px]">Entregado 🎉</span>
      case 'cancelado':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-md font-bold text-[10px]">Cancelado ❌</span>
      default:
        return <span className="bg-gray-800 text-gray-300 px-2.5 py-0.5 rounded-md font-bold text-[10px]">Registrado</span>
    }
  }

  return (
    <div className="space-y-6 text-xs">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle size={16} /> {toastMsg}
        </div>
      )}

      {/* Header Gestor de Pedidos del Restaurante */}
      <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <ShoppingBag className="text-[#FF4B00]" size={20} /> Gestión Interna de Pedidos
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Administración de estados, comentarios internos y horarios de entrega para {businessName}.
            </p>
          </div>

          <span className="bg-[#FF4B00]/10 text-[#FF6A1A] border border-[#FF4B00]/20 px-3 py-1 rounded-full font-bold text-xs">
            {orders.length} Pedidos Totales
          </span>
        </div>

        {/* Buscador y Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar folio, cliente, WhatsApp o colonia..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={15} />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
            >
              <option value="todos">Todos los Estados</option>
              <option value="pendiente_envio">Pendiente de Envío ⏳</option>
              <option value="enviado_wa">Enviado por WhatsApp 📱</option>
              <option value="en_proceso">En Preparación 🍳</option>
              <option value="confirmado">Confirmado ✅</option>
              <option value="entregado">Entregado 🎉</option>
              <option value="cancelado">Cancelado ❌</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
        <h3 className="font-black text-white text-sm">Historial de Pedidos ({filteredOrders.length})</h3>

        {filteredOrders.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            No hay pedidos registrados con los filtros aplicados.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(o => (
              <div
                key={o.id}
                className="bg-[#0D0E12] p-4 rounded-xl border border-white/5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-white font-mono text-sm">{o.order_number}</span>
                    {getStatusBadge(o.status)}
                    <span className="text-gray-400 text-[11px]">{new Date(o.created_at).toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => setEditingOrder({ ...o })}
                    className="flex items-center gap-1 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white px-3 py-1 rounded-lg text-xs font-bold transition-all"
                  >
                    <Edit2 size={12} /> Administrar Pedido
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-300 font-bold">👤 {o.customer_name}</p>
                    <p className="text-emerald-400 font-mono">📱 {o.whatsapp || o.phone}</p>
                    <p className="text-gray-400 mt-1">
                      🛵 {o.delivery_type === 'domicilio' ? 'A Domicilio' : 'Pasar a Recoger'} · Colonia: <span className="text-gray-200">{o.colonia || 'N/A'}</span>
                    </p>
                    {o.address && <p className="text-gray-400">Dirección: {o.address}</p>}
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg space-y-1">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal: ${o.subtotal}</span>
                      <span>Envío: ${o.delivery_fee}</span>
                    </div>
                    <div className="flex justify-between font-black text-emerald-400 text-sm border-t border-white/10 pt-1">
                      <span>Total:</span>
                      <span>${o.total}</span>
                    </div>
                    {o.comentarios_internos && (
                      <p className="text-amber-300 text-[11px] pt-1">💬 Nota interna: {o.comentarios_internos}</p>
                    )}
                    {o.hora_confirmacion && (
                      <p className="text-gray-400 text-[10px]">⏰ Confirmado: {o.hora_confirmacion}</p>
                    )}
                    {o.hora_entrega && (
                      <p className="text-emerald-400 text-[10px]">🚚 Entregado: {o.hora_entrega}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Administración de Pedido (Uso Interno Propietario) */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveOrderEdit} className="bg-[#14161F] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <h3 className="font-black text-white text-base">Administrar Pedido {editingOrder.order_number}</h3>
                <p className="text-gray-400 text-[11px]">Campos administrativos exclusivos para el restaurante.</p>
              </div>
              <button type="button" onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Estado del Pedido</label>
              <select
                value={editingOrder.status}
                onChange={e => setEditingOrder({ ...editingOrder, status: e.target.value })}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
              >
                <option value="pendiente_envio">Pendiente de Envío ⏳</option>
                <option value="enviado_wa">Enviado por WhatsApp 📱</option>
                <option value="en_proceso">En Preparación 🍳</option>
                <option value="confirmado">Confirmado ✅</option>
                <option value="entregado">Entregado 🎉</option>
                <option value="cancelado">Cancelado ❌</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Hora de Confirmación</label>
                <input
                  type="time"
                  value={editingOrder.hora_confirmacion || ''}
                  onChange={e => setEditingOrder({ ...editingOrder, hora_confirmacion: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Hora de Entrega</label>
                <input
                  type="time"
                  value={editingOrder.hora_entrega || ''}
                  onChange={e => setEditingOrder({ ...editingOrder, hora_entrega: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Comentarios Internos (Privado del Negocio)</label>
              <textarea
                rows={2}
                value={editingOrder.comentarios_internos || ''}
                onChange={e => setEditingOrder({ ...editingOrder, comentarios_internos: e.target.value })}
                placeholder="Ej. El cliente pidió salsa verde extra por WhatsApp."
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Observaciones</label>
              <textarea
                rows={2}
                value={editingOrder.observaciones || ''}
                onChange={e => setEditingOrder({ ...editingOrder, observaciones: e.target.value })}
                placeholder="Notas del pedido o cliente"
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-3 text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <button type="button" onClick={() => setEditingOrder(null)} className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 font-bold">Cancelar</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#FF4B00] text-white font-black flex items-center gap-2">
                <Save size={14} /> Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
