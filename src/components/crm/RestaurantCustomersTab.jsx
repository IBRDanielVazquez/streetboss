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
  const [filterConsent, setFilterConsent] = useState('todos') // 'todos', 'autorizados', 'no_autorizados', 'recurrentes'
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

  // Plantillas de promociones preescritas
  const templates = {
    promo_dia: `¡Hola, {nombre}! 🌮 Hoy en ${businessName} tenemos una promoción especial para ti. Pedidos directo por nuestro menú digital: `,
    nuevo_prod: `¡Hola, {nombre}! ⭐ En ${businessName} estrenamos un nuevo platillo en nuestro menú. Míralo aquí: `,
    descuento: `¡Hola, {nombre}! 🎁 Tienes un descuento exclusivo en tu próximo pedido en ${businessName}: `,
    horario: `¡Hola, {nombre}! ⏰ Te recordamos nuestros horarios especiales de atención en ${businessName}: `,
    disponible: `¡Hola, {nombre}! 🔥 Tu producto favorito está nuevamente disponible en ${businessName}: `
  }

  const handleOpenPromoModal = (customer) => {
    if (!customer.promo_consent) {
      alert('Este contacto no ha aceptado recibir promociones por WhatsApp.')
      return
    }
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
    const cleanPhone = promoModalCustomer.phone_normalized || promoModalCustomer.whatsapp
    window.open(`https://wa.me/52${cleanPhone}?text=${encodeURIComponent(fullText)}`, '_blank')
    setPromoModalCustomer(null)
    showToast('WhatsApp abierto para envío de promoción')
  }

  const handleToggleConsent = (customerId, currentConsent) => {
    updateCustomerPromoConsent(customerId, !currentConsent)
    loadCustomers()
    showToast(!currentConsent ? 'Consentimiento de promociones activado' : 'Consentimiento desactivado')
  }

  // Colonias únicas
  const coloniasUnicas = Array.from(new Set(customers.map(c => c.colonia).filter(Boolean)))

  // Filtrado
  const filteredCustomers = customers.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.whatsapp.includes(search)

    let matchConsent = true
    if (filterConsent === 'autorizados') matchConsent = c.promo_consent === true
    if (filterConsent === 'no_autorizados') matchConsent = c.promo_consent !== true
    if (filterConsent === 'recurrentes') matchConsent = (c.orders_count || 1) > 1

    let matchCol = true
    if (filterColonia !== 'todas') matchCol = c.colonia === filterColonia

    return matchSearch && matchConsent && matchCol
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
              <Users className="text-[#FF4B00]" size={20} /> Directorio Privado de Clientes
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Contactos registrados automáticamente desde los pedidos realizados en tu menú público. Información privada y aislada exclusivamente para {businessName}.
            </p>
          </div>

          <span className="bg-[#FF4B00]/10 text-[#FF6A1A] border border-[#FF4B00]/20 px-3 py-1 rounded-full font-bold text-xs">
            {customers.length} Clientes Registrados
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
              value={filterConsent}
              onChange={e => setFilterConsent(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
            >
              <option value="todos">Todos los Clientes</option>
              <option value="autorizados">Con Consentimiento Promocional (Aceptan WhatsApp)</option>
              <option value="no_autorizados">Sin Consentimiento Promocional</option>
              <option value="recurrentes">Recurrentes (+1 Pedido)</option>
            </select>
          </div>

          <div>
            <select
              value={filterColonia}
              onChange={e => setFilterColonia(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
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
        <h3 className="font-black text-white text-sm">Contactos ({filteredCustomers.length})</h3>

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
                      c.promo_consent
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {c.promo_consent ? 'Acepta Promociones' : 'Sin Autorización'}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                    <Phone size={12} /> {c.whatsapp || c.phone}
                  </p>

                  <div className="text-[11px] text-gray-400 space-y-0.5 pt-1">
                    <p>📍 Colonia: <span className="text-gray-200">{c.colonia || 'No especificada'}</span></p>
                    <p>🛍 Pedidos realizados: <span className="font-bold text-white">{c.orders_count || 1}</span> · Total consumido: <span className="font-bold text-emerald-400">${c.total_spent || 0}</span></p>
                    <p>🕒 Último pedido: <span className="text-gray-300">{new Date(c.last_order_at || c.created_at).toLocaleString()}</span></p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleToggleConsent(c.id, c.promo_consent)}
                    className="text-[10px] text-gray-400 hover:underline"
                  >
                    {c.promo_consent ? 'Cancelar autorización' : 'Marcar consentimiento'}
                  </button>

                  <button
                    disabled={!c.promo_consent}
                    onClick={() => handleOpenPromoModal(c)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      c.promo_consent
                        ? 'bg-[#FF4B00] hover:bg-[#FF6A1A] text-white shadow-md'
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Send size={12} /> Enviar Promoción
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
