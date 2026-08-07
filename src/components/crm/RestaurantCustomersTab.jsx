import { useState, useEffect } from 'react'
import { getBusinessCustomers, updateCustomerPromoConsent } from '../../services/crmV3Service'
import {
  Users,
  Search,
  MessageSquare,
  Filter,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Phone,
  Send,
  UserCheck,
  ShieldCheck,
  Copy,
  ChevronDown,
  X
} from 'lucide-react'

export default function RestaurantCustomersTab({ businessId, businessName }) {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [filterSegment, setFilterSegment] = useState('todos') // 'todos', 'nuevos', 'recurrentes', 'hoy', 'mes'
  const [filterColonia, setFilterColonia] = useState('todas')
  const [promoModalCustomer, setPromoModalCustomer] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState('promo_dia')
  const [customMessage, setCustomMessage] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  const loadCustomers = () => {
    const list = getBusinessCustomers(businessId)
    setCustomers(list)
  }

  useEffect(() => {
    loadCustomers()
  }, [businessId])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  // BOTÓN CONTACTAR DIRECTO VÍA WHATSAPP (REGLA 7)
  const handleDirectWhatsAppContact = (customer) => {
    const cleanPhone = (customer.phone_normalized || customer.whatsapp || customer.phone || '').replace(/\D/g, '')
    const msg = `Hola ${customer.name || ''}, te contactamos de ${businessName || 'nuestro restaurante'}.`
    const waUrl = `https://wa.me/52${cleanPhone}?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank')
    showToast('WhatsApp abierto con mensaje listo')
  }

  // Plantillas de promociones preescritas
  const templates = {
    promo_dia: `¡Hola, {nombre}! 🌮 Hoy en ${businessName} tenemos una promoción especial para ti. Pedidos directo por nuestro menú digital: `,
    nuevo_prod: `¡Hola, {nombre}! ⭐ En ${businessName} estrenamos un nuevo platillo en nuestro menú. Míralo aquí: `,
    descuento: `¡Hola, {nombre}! 🎁 Tienes un descuento exclusivo en tu próximo pedido en ${businessName}: `,
    horario: `¡Hola, {nombre}! ⏰ Te recordamos nuestros horarios especiales de atención en ${businessName}: `,
    disponible: `¡Hola, {nombre}! 🔥 Tu producto favorito está nuevamente disponible en ${businessName}: `
  }

  const handleOpenPromoModal = (customer) => {
    setPromoModalCustomer(customer)
    setSelectedTemplate('promo_dia')
    setCustomMessage(templates.promo_dia.replace('{nombre}', customer.name))
  }

  const handleSelectTemplate = (tplKey) => {
    setSelectedTemplate(tplKey)
    if (promoModalCustomer) {
      setCustomMessage(templates[tplKey].replace('{nombre}', promoModalCustomer.name))
    }
  }

  const handleSendWhatsAppPromo = () => {
    if (!promoModalCustomer) return
    const urlMenu = `https://streetboss.com.mx/menu/${businessId}`
    const fullText = `${customMessage}\n${urlMenu}`
    const cleanPhone = (promoModalCustomer.phone_normalized || promoModalCustomer.whatsapp || '').replace(/\D/g, '')
    window.open(`https://wa.me/52${cleanPhone}?text=${encodeURIComponent(fullText)}`, '_blank')
    setPromoModalCustomer(null)
    showToast('WhatsApp abierto para envío de mensaje')
  }

  const handleToggleConsent = (customerId, currentConsent) => {
    updateCustomerPromoConsent(customerId, !currentConsent)
    loadCustomers()
    showToast(!currentConsent ? 'Consentimiento de promociones activado' : 'Consentimiento desactivado')
  }

  // Colonias únicas
  const coloniasUnicas = Array.from(new Set(customers.map(c => c.colonia).filter(Boolean)))

  // FILTRADO DE CLIENTES B2C (REGLA 8)
  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase().trim()
    const matchSearch =
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.whatsapp?.includes(q)

    let matchSegment = true
    const ordersCount = Number(c.orders_count || 1)
    const lastOrderDate = new Date(c.last_order_at || c.created_at || Date.now())
    const now = new Date()
    const todayStr = now.toISOString().slice(0, 10)
    const orderDateStr = lastOrderDate.toISOString().slice(0, 10)

    if (filterSegment === 'nuevos') matchSegment = ordersCount <= 1
    else if (filterSegment === 'recurrentes') matchSegment = ordersCount > 1
    else if (filterSegment === 'hoy') matchSegment = orderDateStr === todayStr
    else if (filterSegment === 'mes') matchSegment = lastOrderDate.getMonth() === now.getMonth() && lastOrderDate.getFullYear() === now.getFullYear()

    let matchCol = true
    if (filterColonia !== 'todas') matchCol = c.colonia === filterColonia

    return matchSearch && matchSegment && matchCol
  })

  return (
    <div className="space-y-6 text-xs">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle size={16} /> {toastMsg}
        </div>
      )}

      {/* Header y Métricas de Clientes del Restaurante */}
      <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Users className="text-[#FF4B00]" size={20} /> Lista de Clientes B2C
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Consumidores registrados automáticamente desde los pedidos realizados en tu menú para {businessName}.
            </p>
          </div>

          <span className="bg-[#FF4B00]/10 text-[#FF6A1A] border border-[#FF4B00]/20 px-3 py-1 rounded-full font-bold text-xs">
            {customers.length} Clientes Totales
          </span>
        </div>

        {/* Buscador y Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={15} />
          </div>

          <div>
            <select
              value={filterSegment}
              onChange={e => setFilterSegment(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
            >
              <option value="todos">Filtro: Todos los Clientes</option>
              <option value="nuevos">Clientes Nuevos (1 pedido)</option>
              <option value="recurrentes">Clientes Recurrentes (+1 pedido)</option>
              <option value="hoy">Compraron Hoy</option>
              <option value="mes">Compraron Este Mes</option>
            </select>
          </div>

          <div>
            <select
              value={filterColonia}
              onChange={e => setFilterColonia(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
            >
              <option value="todas">Todas las Colonias</option>
              {coloniasUnicas.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
        <h3 className="font-black text-white text-sm">Contactos B2C ({filteredCustomers.length})</h3>

        {filteredCustomers.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            No se encontraron clientes con los criterios de búsqueda. Cuando los consumidores hagan pedidos desde tu menú, aparecerán aquí automáticamente.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCustomers.map(c => (
              <div key={c.id} className="bg-[#0D0E12] p-4 rounded-xl border border-white/5 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-white">{c.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      (c.orders_count || 1) > 1
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {(c.orders_count || 1) > 1 ? 'Recurrente' : 'Nuevo'}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
                    <Phone size={12} /> {c.whatsapp || c.phone}
                  </p>

                  <div className="text-[11px] text-gray-400 space-y-1 pt-1">
                    <p>🕒 Último pedido: <span className="text-gray-200 font-bold">{new Date(c.last_order_at || c.created_at).toLocaleString('es-MX')}</span></p>
                    <p>🛍 Número de pedidos: <span className="font-bold text-white">{c.orders_count || 1}</span></p>
                    <p>💵 Total comprado: <span className="font-bold text-emerald-400">${c.total_spent || 0}</span></p>
                    {c.last_payment_method && <p>💳 Último método de pago: <span className="text-amber-300 font-bold capitalize">{c.last_payment_method}</span></p>}
                    {c.colonia && <p>📍 Colonia: <span className="text-gray-300">{c.colonia}</span></p>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
                  <button
                    onClick={() => handleDirectWhatsAppContact(c)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Send size={13} /> WHATSAPP
                  </button>

                  <button
                    onClick={() => handleOpenPromoModal(c)}
                    className="bg-white/5 hover:bg-white/10 text-gray-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 border border-white/5"
                  >
                    <MessageSquare size={13} /> Plantillas
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Enviar Promoción por WhatsApp */}
      {promoModalCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14161F] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-black text-white text-base">Enviar Promoción por WhatsApp</h3>
              <button onClick={() => setPromoModalCustomer(null)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-gray-300">
              Cliente: <span className="font-bold text-white">{promoModalCustomer.name}</span> ({promoModalCustomer.whatsapp})
            </p>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Seleccionar Plantilla</label>
              <select
                value={selectedTemplate}
                onChange={e => handleSelectTemplate(e.target.value)}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
              >
                <option value="promo_dia">Promoción del Día</option>
                <option value="nuevo_prod">Nuevo Producto en Menú</option>
                <option value="descuento">Descuento Exclusivo</option>
                <option value="horario">Horario Especial de Atención</option>
                <option value="disponible">Producto Nuevamente Disponible</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Mensaje Precargado (Editable)</label>
              <textarea
                rows={4}
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-xl p-3 text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <button onClick={() => setPromoModalCustomer(null)} className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 font-bold">Cancelar</button>
              <button onClick={handleSendWhatsAppPromo} className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-black flex items-center gap-2">
                <Send size={14} /> Abrir Chat de WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
