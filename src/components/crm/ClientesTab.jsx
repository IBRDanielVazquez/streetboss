import { useState, useEffect } from 'react'
import { getClients, updateClientStatus, regenerateClientPassword, getAdministrativeAccessUrl, updateBusinessSettings, normalizeMexicanPhone } from '../../services/crmV3Service'
import { Users, ExternalLink, Key, RefreshCw, Lock, Shield, Layers, Package, MapPin, Copy, PauseCircle, PlayCircle, Archive, Edit3, Send, Check } from 'lucide-react'

export default function ClientesTab() {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [editingClient, setEditingClient] = useState(null)
  const [copiedMsg, setCopiedMsg] = useState('')
  const [regenPassResult, setRegenPassResult] = useState(null)
  const [sendAccessModal, setSendAccessModal] = useState(null)

  const reloadClients = () => {
    setClients(getClients())
  }

  useEffect(() => {
    reloadClients()
  }, [])

  const handleStatusChange = (clientBusinessId, newStatus) => {
    updateClientStatus(clientBusinessId, newStatus)
    reloadClients()
  }

  const handleRegeneratePassword = (client) => {
    const newPass = regenerateClientPassword(client.business_id)
    setRegenPassResult({
      name: client.name,
      username: client.owner_username || client.email || `${client.slug}@streetboss.com.mx`,
      newPass,
    })
    reloadClients()
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editingClient) return
    updateBusinessSettings(editingClient.business_id, editingClient)
    setEditingClient(null)
    reloadClients()
  }

  const copyText = (text, tag) => {
    navigator.clipboard.writeText(text)
    setCopiedMsg(tag)
    setTimeout(() => setCopiedMsg(''), 2500)
  }

  const generateAccessMessage = (client) => {
    const menuUrl = `https://streetboss.com.mx/menu/${client.slug}`
    const dashboardUrl = `https://streetboss.com.mx/panel/${client.slug}`
    const resetUrl = `https://streetboss.com.mx/panel/${client.slug}?action=reset_password`
    const user = client.owner_username || client.email || `${client.slug}@streetboss.com.mx`

    return `Hola, ${client.owner_name || client.name}.

Tu cuenta de *${client.name}* está lista.

📱 *Menú público:*
${menuUrl}

⚙️ *Panel de administración:*
${dashboardUrl}

👤 *Usuario:* ${user}

🔑 *Para crear o restablecer tu contraseña:*
${resetUrl}

Desde tu panel podrás administrar tu menú, horarios, zonas de entrega y métodos de pago.`
  }

  const handleSendAccessWhatsApp = (client) => {
    const message = generateAccessMessage(client)
    const phoneClean = normalizeMexicanPhone(client.whatsapp || client.phone || '9612466204')
    const waUrl = `https://wa.me/52${phoneClean}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
  }

  const filteredClients = clients.filter(c => {
    const matchesStatus = filterStatus === 'todos' || c.status?.toLowerCase() === filterStatus.toLowerCase()
    const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
                          c.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
                          c.phone?.includes(search)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6 text-xs">
      {/* Toast de copia */}
      {copiedMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2">
          <Check size={16} /> Enlace o texto copiado al portapapeles
        </div>
      )}

      {/* Header y Filtros */}
      <div className="bg-[#14161F] p-4 sm:p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Users className="text-[#FF4B00]" size={24} /> Directorio de Clientes Activos
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Gestión B2B de restaurantes reales, enlaces de acceso y credenciales seguras.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por cliente o teléfono..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF4B00]"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF4B00]"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="pausado">Pausados</option>
            <option value="suspendido">Suspendidos</option>
          </select>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="bg-[#14161F] p-12 text-center rounded-2xl border border-white/5 space-y-3">
            <span className="text-4xl block">🏪</span>
            <h3 className="text-white font-bold text-lg">No se encontraron clientes</h3>
            <p className="text-gray-400 text-xs">Crea tu primer negocio real desde la pestaña "Crear negocio".</p>
          </div>
        ) : (
          filteredClients.map(client => {
            const menuUrl = `https://streetboss.com.mx/menu/${client.slug}`
            const dashboardUrl = `https://streetboss.com.mx/panel/${client.slug}`
            const cleanPhone = normalizeMexicanPhone(client.whatsapp || client.phone || '')

            return (
              <div
                key={client.id}
                className="bg-[#14161F] border border-white/5 hover:border-white/15 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-black overflow-hidden shrink-0 border border-white/10">
                      <img src={client.logo_url || client.banner_url || '/brand/SB_FAVICON_512x512_V01.png'} alt={client.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white">{client.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          client.status === 'activo'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {client.status}
                        </span>
                        <span className="bg-white/5 text-gray-400 text-[10px] px-2 py-0.5 rounded font-bold">
                          {client.business_type || 'Restaurante'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Propietario: <span className="text-gray-200 font-bold">{client.owner_name || 'N/A'}</span> · Tel/WA: <span className="text-emerald-400 font-mono">{client.whatsapp || client.phone}</span> · Alta: <span className="text-gray-300">{new Date(client.created_at || Date.now()).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1 bg-[#0D0E12] px-3 py-1.5 rounded-xl border border-white/5">
                      <Layers size={13} className="text-[#FF4B00]" />
                      <span>{client.categories_count} Cat</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#0D0E12] px-3 py-1.5 rounded-xl border border-white/5">
                      <Package size={13} className="text-[#FF4B00]" />
                      <span>{client.products_count} Prod</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#0D0E12] px-3 py-1.5 rounded-xl border border-white/5">
                      <MapPin size={13} className="text-[#FF4B00]" />
                      <span>{client.colonias_count} Zonas</span>
                    </div>
                  </div>
                </div>

                {/* Tarjetas de Enlaces B2B con Acciones Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {/* LINK 1: MENÚ PÚBLICO */}
                  <div className="bg-[#0D0E12] p-3.5 rounded-xl border border-white/5 space-y-2">
                    <span className="text-gray-500 font-bold text-[10px] uppercase block">Menú Digital Público</span>
                    <span className="text-emerald-400 font-mono text-xs truncate block font-bold">{menuUrl}</span>

                    <div className="flex items-center gap-2 pt-1">
                      <a href={menuUrl} target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                        <ExternalLink size={12} /> Abrir
                      </a>
                      <button onClick={() => copyText(menuUrl, `menu_${client.id}`)} className="bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                        <Copy size={12} /> Copiar
                      </button>
                      {cleanPhone && (
                        <a href={`https://wa.me/52${cleanPhone}?text=${encodeURIComponent(`Aquí tienes el link de tu menú digital: ${menuUrl}`)}`} target="_blank" rel="noreferrer" className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                          <Send size={12} /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>

                  {/* LINK 2: DASHBOARD B2B */}
                  <div className="bg-[#0D0E12] p-3.5 rounded-xl border border-white/5 space-y-2">
                    <span className="text-gray-500 font-bold text-[10px] uppercase block">Panel de Administración B2B</span>
                    <span className="text-amber-400 font-mono text-xs truncate block font-bold">{dashboardUrl}</span>

                    <div className="flex items-center gap-2 pt-1">
                      <a href={dashboardUrl} target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                        <ExternalLink size={12} /> Abrir
                      </a>
                      <button onClick={() => copyText(dashboardUrl, `dash_${client.id}`)} className="bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                        <Copy size={12} /> Copiar
                      </button>
                      {cleanPhone && (
                        <a href={`https://wa.me/52${cleanPhone}?text=${encodeURIComponent(`Aquí tienes el link de tu Dashboard B2B: ${dashboardUrl}`)}`} target="_blank" rel="noreferrer" className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                          <Send size={12} /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>

                </div>

                {/* Botones de Acción B2B y Envío de Accesos */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleSendAccessWhatsApp(client)}
                      className="flex items-center gap-1.5 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-md transition-transform active:scale-95"
                    >
                      <Send size={13} /> ENVIAR ACCESOS AL CLIENTE
                    </button>

                    <button
                      onClick={() => setSendAccessModal(client)}
                      className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs px-3 py-2 rounded-xl border border-white/5"
                    >
                      <Copy size={13} /> Ver Mensaje de Acceso
                    </button>

                    <button
                      onClick={() => setEditingClient(client)}
                      className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs px-3 py-2 rounded-xl border border-white/5"
                    >
                      <Edit3 size={13} /> Editar datos
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {client.status === 'activo' ? (
                      <button
                        onClick={() => handleStatusChange(client.business_id, 'pausado')}
                        className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs px-3 py-2 rounded-xl border border-red-500/20"
                      >
                        <PauseCircle size={13} /> Suspender
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(client.business_id, 'activo')}
                        className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs px-3 py-2 rounded-xl border border-emerald-500/20"
                      >
                        <PlayCircle size={13} /> Activar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal Ver Mensaje de Accesos Seguros */}
      {sendAccessModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14161F] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="font-black text-white text-base">Mensaje de Acceso para {sendAccessModal.name}</h3>
              <button onClick={() => setSendAccessModal(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-gray-300 space-y-2 whitespace-pre-wrap">
              {generateAccessMessage(sendAccessModal)}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => copyText(generateAccessMessage(sendAccessModal), 'access_msg')}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs"
              >
                Copiar Texto
              </button>
              <button
                onClick={() => {
                  handleSendAccessWhatsApp(sendAccessModal)
                  setSendAccessModal(null)
                }}
                className="px-4 py-2 rounded-xl bg-[#FF4B00] text-white font-black text-xs flex items-center gap-1.5"
              >
                <Send size={13} /> Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Cliente */}
      {editingClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-[#14161F] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white">Editar Datos del Cliente</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  value={editingClient.name}
                  onChange={e => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Nombre Propietario</label>
                <input
                  type="text"
                  value={editingClient.owner_name}
                  onChange={e => setEditingClient({ ...editingClient, owner_name: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">WhatsApp Pedidos</label>
                <input
                  type="text"
                  value={editingClient.whatsapp}
                  onChange={e => setEditingClient({ ...editingClient, whatsapp: e.target.value })}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#FF4B00] hover:bg-[#FF6A1A] text-white text-xs font-black"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
