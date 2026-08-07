import { useState, useEffect } from 'react'
import { DEMO_CONTACTS } from '../../data/demoFixtures'
import { getClients, updateClientStatus, getAdministrativeAccessUrl, updateBusinessSettings, normalizeMexicanPhone, logAuditAction, regenerateClientPassword, setBusinessPassword, deleteClient } from '../../services/crmV3Service'
import { Users, ExternalLink, Key, RefreshCw, Lock, Shield, Layers, Package, MapPin, Copy, PauseCircle, PlayCircle, Edit3, Send, Check, DollarSign, Calendar, CreditCard, ShieldCheck, Eye, EyeOff, X, Trash2 } from 'lucide-react'

export default function ClientesTab() {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [editingClient, setEditingClient] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null) // { client, confirmInput }
  const [copiedMsg, setCopiedMsg] = useState('')
  const [previewModal, setPreviewModal] = useState(null)

  // FASE 2: Modal de contraseña — contraseña solo visible una vez
  const [passwordModal, setPasswordModal] = useState(null) // { client, generatedPassword, mode: 'generate' | 'set' }
  const [newPasswordInput, setNewPasswordInput] = useState('')
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPasswordField, setShowPasswordField] = useState(false)

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

  const copyText = (text, tag) => {
    navigator.clipboard.writeText(text)
    setCopiedMsg(tag)
    setTimeout(() => setCopiedMsg(''), 2500)
  }

  // FASE 2: Generar contraseña automática y mostrar modal
  const handleGeneratePassword = (client) => {
    const newPass = regenerateClientPassword(client.business_id)
    if (newPass) {
      setPasswordModal({ client, generatedPassword: newPass, mode: 'generate' })
      reloadClients()
    }
  }

  // FASE 2: Establecer contraseña manual
  const handleSetPassword = (client) => {
    setPasswordModal({ client, generatedPassword: null, mode: 'set' })
    setNewPasswordInput('')
    setConfirmPasswordInput('')
    setPasswordError('')
    setShowPasswordField(false)
  }

  const handleConfirmSetPassword = () => {
    if (!newPasswordInput || newPasswordInput.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordError('Las contraseñas no coinciden.')
      return
    }
    const result = setBusinessPassword(passwordModal.client.business_id, newPasswordInput)
    if (result.success) {
      setPasswordModal({ ...passwordModal, generatedPassword: newPasswordInput, mode: 'generate' })
      setPasswordError('')
      reloadClients()
    } else {
      setPasswordError(result.error)
    }
  }

  // FASE 3: Mensaje exacto de compartir acceso — solo funciona con contraseña recién generada
  const handleShareAccessFromModal = () => {
    if (!passwordModal?.generatedPassword) return
    const client = passwordModal.client
    const menuUrl = `https://streetboss.com.mx/menu/${client.slug}`
    const dashboardUrl = `https://streetboss.com.mx/panel/${client.slug}`
    const clientName = client.owner_name || client.name || 'Cliente'

    const message = `Hola, ${clientName}.

Menú:
${menuUrl}

Dashboard:
${dashboardUrl}

Contraseña:
${passwordModal.generatedPassword}`

    logAuditAction('compartir_acceso_b2b', client.business_id, { name: client.name })
    const phoneClean = normalizeMexicanPhone(client.whatsapp || client.phone || DEMO_CONTACTS.DEFAULT_PHONE)
    const waUrl = `https://wa.me/52${phoneClean}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
  }

  const closePasswordModal = () => {
    setPasswordModal(null)
    setNewPasswordInput('')
    setConfirmPasswordInput('')
    setPasswordError('')
    setShowPasswordField(false)
  }

  // Mensaje para RESUMEN DE CUENTA (sin contraseña)
  const generateAccountSummaryMessage = (client) => {
    const menuUrl = `https://streetboss.com.mx/menu/${client.slug}`
    const dashboardUrl = `https://streetboss.com.mx/panel/${client.slug}`

    return `📊 *RESUMEN DE CUENTA — STREETBOSS*

🏢 *Negocio:* ${client.name}
👤 *Propietario:* ${client.owner_name || 'N/A'}
📦 *Plan:* ${client.plan_name || 'Restaurante Pro ($99/mes)'}
🟢 *Estado:* ${client.status === 'activo' ? 'Activa ✅' : 'Pausada ⏳'}

📱 *Menú público:*
${menuUrl}

⚙️ *Panel B2B:*
${dashboardUrl}

💬 *Soporte:*
https://wa.me/${DEMO_CONTACTS.SUPPORT_WHATSAPP}`
  }

  const handleSendResetWhatsApp = (client) => {
    const message = generateResetMessage(client)
    logAuditAction('solicitar_restablecimiento_password', client.business_id, { name: client.name })
    const phoneClean = normalizeMexicanPhone(client.whatsapp || client.phone || DEMO_CONTACTS.DEFAULT_PHONE)
    const waUrl = `https://wa.me/52${phoneClean}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
  }

  const handleSendSummaryWhatsApp = (client) => {
    const message = generateAccountSummaryMessage(client)
    logAuditAction('enviar_resumen_cuenta', client.business_id, { name: client.name })
    const phoneClean = normalizeMexicanPhone(client.whatsapp || client.phone || DEMO_CONTACTS.DEFAULT_PHONE)
    const waUrl = `https://wa.me/52${phoneClean}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editingClient) return
    updateBusinessSettings(editingClient.business_id, editingClient)
    setEditingClient(null)
    reloadClients()
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
          <Check size={16} /> Enlace copiado al portapapeles
        </div>
      )}

      {/* Header y Filtros */}
      <div className="bg-[#14161F] p-4 sm:p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Users className="text-[#FF4B00]" size={24} /> CLIENTES
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Directorio consolidado de clientes B2B, enlaces oficiales, planes y credenciales seguras.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por negocio, dueño o teléfono..."
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

      {/* Lista Única de Clientes */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="bg-[#14161F] p-12 text-center rounded-2xl border border-white/5 space-y-3">
            <span className="text-4xl block">🏪</span>
            <h3 className="text-white font-bold text-lg">No se encontraron clientes</h3>
            <p className="text-gray-400 text-xs">Crea tu primer negocio real desde la pestaña "+ Crear Negocio".</p>
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
                {/* Fila 1: Info del negocio, plan y contadores */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-black overflow-hidden shrink-0 border border-white/10">
                      <img src={client.logo_url || client.banner_url || '/brand/SB_FAVICON_512x512_V01.png'} alt={client.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-white">{client.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          client.status === 'activo'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {client.status}
                        </span>
                        <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                          {client.plan_name || 'Restaurante Pro ($99/m)'}
                        </span>
                        <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                          Pago: {client.payment_status || 'Al día'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Propietario: <span className="text-gray-200 font-bold">{client.owner_name || 'N/A'}</span> · Tel/WA: <span className="text-emerald-400 font-mono">{client.whatsapp || client.phone}</span> · Alta: <span className="text-gray-300">{new Date(client.created_at || Date.now()).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1 bg-[#0D0E12] px-3 py-1.5 rounded-xl border border-white/5">
                      <Layers size={13} className="text-[#FF4B00]" />
                      <span>{client.categories_count || 0} Cat</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#0D0E12] px-3 py-1.5 rounded-xl border border-white/5">
                      <Package size={13} className="text-[#FF4B00]" />
                      <span>{client.products_count || 0} Prod</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#0D0E12] px-3 py-1.5 rounded-xl border border-white/5">
                      <MapPin size={13} className="text-[#FF4B00]" />
                      <span>{client.colonias_count || 0} Zonas</span>
                    </div>
                  </div>
                </div>

                {/* Fila 2: Tarjetas de Enlaces B2B con Acciones Rápidas */}
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
                        <a href={`https://wa.me/52${cleanPhone}?text=${encodeURIComponent(`Menú Digital Oficial de ${client.name}: ${menuUrl}`)}`} target="_blank" rel="noreferrer" className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                          <Send size={12} /> Compartir por WhatsApp
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
                        <a href={`https://wa.me/52${cleanPhone}?text=${encodeURIComponent(`Acceso a tu Panel B2B de ${client.name}: ${dashboardUrl}`)}`} target="_blank" rel="noreferrer" className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                          <Send size={12} /> Compartir por WhatsApp
                        </a>
                      )}
                    </div>
                  </div>

                </div>

                {/* Fila 3: Acciones Administrativas */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleGeneratePassword(client)}
                      className="flex items-center gap-1.5 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-md transition-transform active:scale-95"
                    >
                      <Key size={13} /> GENERAR CONTRASEÑA Y COMPARTIR
                    </button>

                    <button
                      onClick={() => handleSetPassword(client)}
                      className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs px-3.5 py-2 rounded-xl border border-amber-500/20 transition-transform active:scale-95"
                    >
                      <Lock size={13} /> Establecer Contraseña
                    </button>

                    <button
                      onClick={() => handleSendSummaryWhatsApp(client)}
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs px-3.5 py-2 rounded-xl border border-white/10 transition-transform active:scale-95"
                    >
                      <Send size={13} /> Resumen de Cuenta
                    </button>

                    <button
                      onClick={() => setPreviewModal({ type: 'resumen', client, message: generateAccountSummaryMessage(client) })}
                      className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs px-3 py-2 rounded-xl border border-white/5"
                    >
                      <Copy size={13} /> Vista previa
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setEditingClient(client)}
                      className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs px-3 py-2 rounded-xl border border-white/5"
                    >
                      <Edit3 size={13} /> Editar datos
                    </button>

                    {client.status === 'activo' ? (
                      <button
                        onClick={() => handleStatusChange(client.business_id, 'pausado')}
                        className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs px-3 py-2 rounded-xl border border-amber-500/20"
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

                    <button
                      onClick={() => setDeleteModal({ client, confirmInput: '' })}
                      className="flex items-center gap-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-xs px-3 py-2 rounded-xl border border-red-500/30"
                    >
                      <Trash2 size={13} /> Eliminar Cliente
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal Vista Previa de Mensaje */}
      {previewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14161F] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="font-black text-white text-base">Vista previa para {previewModal.client.name}</h3>
              <button onClick={() => setPreviewModal(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-gray-300 space-y-2 whitespace-pre-wrap">
              {previewModal.message}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => copyText(previewModal.message, 'prev_msg')}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs"
              >
                Copiar Texto
              </button>
              <button
                onClick={() => {
                  handleSendSummaryWhatsApp(previewModal.client)
                  setPreviewModal(null)
                }}
                className="px-4 py-2 rounded-xl bg-[#FF4B00] text-white font-black text-xs flex items-center gap-1.5"
              >
                <Send size={13} /> Abrir en WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Cliente */}
      {editingClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-[#14161F] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white">Editar Datos del Cliente B2B</h3>

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
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Plan Contratado</label>
                  <input
                    type="text"
                    value={editingClient.plan_name || 'Restaurante Pro ($99/m)'}
                    onChange={e => setEditingClient({ ...editingClient, plan_name: e.target.value })}
                    className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Estado de Pago</label>
                  <select
                    value={editingClient.payment_status || 'Al día'}
                    onChange={e => setEditingClient({ ...editingClient, payment_status: e.target.value })}
                    className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Al día">Al día ✅</option>
                    <option value="Pendiente">Pendiente ⏳</option>
                    <option value="Atrasado">Atrasado ⚠️</option>
                  </select>
                </div>
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

      {/* FASE 2: Modal de Contraseña — Se muestra UNA sola vez */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closePasswordModal}>
          <div className="bg-[#14161F] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Key size={18} className="text-[#FF4B00]" />
                {passwordModal.mode === 'set' ? 'Establecer Contraseña' : 'Contraseña Generada'}
              </h3>
              <button onClick={closePasswordModal} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              <span className="font-bold text-white">{passwordModal.client.name}</span> — {passwordModal.client.slug}
            </p>

            {/* Modo: Establecer contraseña manual */}
            {passwordModal.mode === 'set' && !passwordModal.generatedPassword && (
              <div className="space-y-3 text-xs">
                {passwordError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl font-bold">
                    {passwordError}
                  </div>
                )}
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Nueva contraseña (mín. 8 caracteres)</label>
                  <div className="relative">
                    <input
                      type={showPasswordField ? 'text' : 'password'}
                      value={newPasswordInput}
                      onChange={e => setNewPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono focus:border-[#FF4B00] focus:outline-none"
                    />
                    <button type="button" onClick={() => setShowPasswordField(!showPasswordField)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      {showPasswordField ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Confirmar contraseña</label>
                  <input
                    type={showPasswordField ? 'text' : 'password'}
                    value={confirmPasswordInput}
                    onChange={e => setConfirmPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono focus:border-[#FF4B00] focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleConfirmSetPassword}
                  className="w-full bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black py-2.5 rounded-xl text-xs"
                >
                  Guardar Contraseña
                </button>
              </div>
            )}

            {/* Modo: Contraseña generada/establecida — visible UNA vez */}
            {passwordModal.generatedPassword && (
              <div className="space-y-4">
                <div className="bg-[#0D0E12] p-4 rounded-xl border border-emerald-500/20 space-y-2">
                  <p className="text-[10px] text-emerald-400 font-black uppercase">Contraseña (visible solo ahora)</p>
                  <p className="text-lg font-mono font-bold text-white tracking-wider select-all">
                    {passwordModal.generatedPassword}
                  </p>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-300 text-[11px] font-bold">
                  ⚠️ Al cerrar este modal, la contraseña no volverá a mostrarse.
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => copyText(passwordModal.generatedPassword, 'password_copied')}
                    className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl text-xs border border-white/10"
                  >
                    {copiedMsg === 'password_copied' ? <Check size={14} /> : <Copy size={14} />}
                    {copiedMsg === 'password_copied' ? '¡Copiada!' : 'Copiar Contraseña'}
                  </button>

                  <button
                    onClick={handleShareAccessFromModal}
                    className="w-full flex items-center justify-center gap-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black py-3 rounded-xl text-xs shadow-lg"
                  >
                    <Send size={14} /> Compartir Acceso por WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14161F] border border-red-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-red-400 flex items-center gap-2">
                <Trash2 size={20} /> Eliminar Cliente
              </h3>
              <button onClick={() => setDeleteModal(null)} className="p-1 text-gray-400 hover:text-white"><X size={18}/></button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              ¿Estás seguro de que deseas eliminar permanentemente a <strong className="text-white font-bold">{deleteModal.client.name}</strong>?
            </p>
            <p className="text-[11px] text-gray-400">
              Esta acción no se puede deshacer. Escribe <strong className="text-red-400 font-mono">ELIMINAR</strong> para confirmar.
            </p>

            <input
              type="text"
              value={deleteModal.confirmInput}
              onChange={e => setDeleteModal({ ...deleteModal, confirmInput: e.target.value })}
              placeholder="Escribe ELIMINAR"
              className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 bg-white/5 text-gray-300 font-bold text-xs rounded-xl hover:bg-white/10 transition-all">
                Cancelar
              </button>
              <button
                disabled={deleteModal.confirmInput !== 'ELIMINAR'}
                onClick={() => {
                  deleteClient(deleteModal.client.business_id)
                  setDeleteModal(null)
                  reloadClients()
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black text-xs rounded-xl shadow transition-all"
              >
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
