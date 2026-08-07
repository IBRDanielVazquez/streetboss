import { useState, useEffect } from 'react'
import { Plus, Edit, Trash, MessageCircle, Copy, Send, Check } from 'lucide-react'

export default function PagosTab({ prospects }) {
  const [activeSubtab, setActiveSubtab] = useState('enviar') // enviar, metodos, plantillas, historial

  // MÉTODOS DE PAGO
  const [paymentMethods, setPaymentMethods] = useState(() => {
    const saved = localStorage.getItem('sb_v3_payment_methods')
    return saved ? JSON.parse(saved) : [
      { id: 'mp1', tipo: 'mercado_pago', nombre: 'Mercado Pago', link: 'https://link.mercadopago.com.mx/ejemplo', activo: true },
      { id: 'bbva1', tipo: 'transferencia', nombre: 'Transferencia BBVA', banco: 'BBVA', titular: 'StreetBoss S.A. de C.V.', cuenta: '0123456789', clabe: '012123456789012345', tarjeta: '4152 3134 0000 0000', activo: true },
      { id: 'bnmx1', tipo: 'transferencia', nombre: 'Transferencia Banamex', banco: 'Banamex', titular: 'StreetBoss S.A. de C.V.', cuenta: '9876543210', clabe: '002123456789012345', tarjeta: '', activo: true },
    ]
  })

  // PLANTILLAS
  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem('sb_v3_payment_templates')
    return saved ? JSON.parse(saved) : [
      { id: 't1', nombre: 'Solicitud de Pago (Activación)', mensaje: 'Hola [NOMBRE],\n\nTu StreetBoss está listo para activarse.\n\nPor favor realiza el pago de [MONTO] utilizando el siguiente método:\n\n[LINK_PAGO]\n[BANCO]\nTitular: [TITULAR]\nCuenta: [CUENTA]\nCLABE: [CLABE]\n\nQuedamos atentos a tu comprobante.\n\nSaludos.' },
      { id: 't2', nombre: 'Recordatorio de Renovación', mensaje: 'Hola [NOMBRE],\n\nTe recordamos que tu mensualidad de StreetBoss está próxima a vencer. \n\nMonto a pagar: [MONTO]\n\nMétodo de pago:\n[LINK_PAGO]\n[BANCO]\nTitular: [TITULAR]\nCuenta: [CUENTA]\nCLABE: [CLABE]\n\nGracias por seguir con nosotros.' }
    ]
  })

  // HISTORIAL
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('sb_v3_payment_history')
    return saved ? JSON.parse(saved) : []
  })

  // ENVÍO
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('t1')
  const [selectedMethod, setSelectedMethod] = useState('mp1')
  const [amount, setAmount] = useState('499.00')
  const [generatedMessage, setGeneratedMessage] = useState('')
  const [copied, setCopied] = useState(false)

  // Filtramos solo los que son clientes
  const clients = prospects.filter(p => p.currentStatus === 'CLIENTE')

  useEffect(() => {
    localStorage.setItem('sb_v3_payment_methods', JSON.stringify(paymentMethods))
  }, [paymentMethods])

  useEffect(() => {
    localStorage.setItem('sb_v3_payment_templates', JSON.stringify(templates))
  }, [templates])

  useEffect(() => {
    localStorage.setItem('sb_v3_payment_history', JSON.stringify(history))
  }, [history])

  // Generador de Mensaje
  useEffect(() => {
    if (!selectedClient || !selectedTemplate || !selectedMethod) {
      setGeneratedMessage('')
      return
    }

    const client = clients.find(c => c.id === selectedClient)
    const tpl = templates.find(t => t.id === selectedTemplate)
    const method = paymentMethods.find(m => m.id === selectedMethod)

    if (!client || !tpl || !method) return

    let msg = tpl.mensaje
    msg = msg.replace(/\[NOMBRE\]/g, client.nombre || client.business_name || 'Cliente')
    msg = msg.replace(/\[NEGOCIO\]/g, client.nombre || client.business_name || 'Negocio')
    msg = msg.replace(/\[MONTO\]/g, `$${amount} MXN`)
    
    msg = msg.replace(/\[LINK_PAGO\]/g, method.link ? `Link de pago: ${method.link}` : '')
    msg = msg.replace(/\[BANCO\]/g, method.banco ? `Banco: ${method.banco}` : '')
    msg = msg.replace(/\[TITULAR\]/g, method.titular ? `Titular: ${method.titular}` : '')
    msg = msg.replace(/\[CUENTA\]/g, method.cuenta ? `Cuenta: ${method.cuenta}` : '')
    msg = msg.replace(/\[CLABE\]/g, method.clabe ? `CLABE: ${method.clabe}` : '')
    
    // Limpiar lineas vacias múltiples dejadas por reemplazos vacíos
    msg = msg.replace(/\n\s*\n\s*\n/g, '\n\n')

    setGeneratedMessage(msg.trim())
  }, [selectedClient, selectedTemplate, selectedMethod, amount, clients, templates, paymentMethods])

  const handleSendPaymentMessage = () => {
    const client = clients.find(c => c.id === selectedClient)
    if (!client) return

    const now = new Date().toISOString()
    
    const newRecord = {
      id: `pay_${Date.now()}`,
      clientId: client.id,
      clientName: client.nombre || client.business_name,
      templateName: templates.find(t => t.id === selectedTemplate)?.nombre || '',
      methodName: paymentMethods.find(m => m.id === selectedMethod)?.nombre || '',
      amount: amount,
      status: 'PENDIENTE',
      date: now,
      note: ''
    }

    setHistory([newRecord, ...history])

    const waRaw = (client.whatsapp || client.telefono || client.phone || '').replace(/\D/g, '')
    const waClean = waRaw.length === 10 ? `52${waRaw}` : waRaw
    
    if (waClean) {
      window.open(`https://wa.me/${waClean}?text=${encodeURIComponent(generatedMessage)}`, '_blank')
    } else {
      navigator.clipboard.writeText(generatedMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // SUBTAB: MÉTODOS DE PAGO
  const [editingMethod, setEditingMethod] = useState(null)
  const [editingTemplate, setEditingTemplate] = useState(null)

  const handleToggleMethodActive = (id) => {
    setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, activo: !m.activo } : m))
  }

  const handleSaveMethod = (e) => {
    e.preventDefault()
    if (!editingMethod.nombre) return
    if (paymentMethods.some(m => m.id === editingMethod.id)) {
      setPaymentMethods(prev => prev.map(m => m.id === editingMethod.id ? editingMethod : m))
    } else {
      setPaymentMethods(prev => [...prev, { ...editingMethod, id: `pm_${Date.now()}` }])
    }
    setEditingMethod(null)
  }

  const handleSaveTemplate = (e) => {
    e.preventDefault()
    if (!editingTemplate.nombre || !editingTemplate.mensaje) return
    if (templates.some(t => t.id === editingTemplate.id)) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t))
    } else {
      setTemplates(prev => [...prev, { ...editingTemplate, id: `tpl_${Date.now()}` }])
    }
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (id) => {
    setTemplates(prev => prev.filter(t => t.id !== id))
  }

  const handleChangeHistoryStatus = (id, newStatus) => {
    setHistory(prev => prev.map(h => h.id === id ? { ...h, status: newStatus } : h))
  }

  return (
    <div className="bg-[#14161F] p-4 sm:p-6 rounded-2xl border border-white/5 shadow-xl space-y-6">
      
      {/* HEADER PAGOS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Módulo de Pagos y Cobranza</h2>
          <p className="text-xs text-gray-400">Gestión de suscripciones, cobros y métodos de pago</p>
        </div>

        <div className="flex bg-[#0D0E12] rounded-xl border border-white/10 p-1 text-[11px] font-bold">
          <button onClick={() => setActiveSubtab('enviar')} className={`px-4 py-2 rounded-lg transition-all ${activeSubtab === 'enviar' ? 'bg-[#FF4B00] text-white shadow' : 'text-gray-400 hover:text-white'}`}>
            Enviar Cobro
          </button>
          <button onClick={() => setActiveSubtab('historial')} className={`px-4 py-2 rounded-lg transition-all ${activeSubtab === 'historial' ? 'bg-[#FF4B00] text-white shadow' : 'text-gray-400 hover:text-white'}`}>
            Historial ({history.length})
          </button>
          <button onClick={() => setActiveSubtab('metodos')} className={`px-4 py-2 rounded-lg transition-all ${activeSubtab === 'metodos' ? 'bg-[#FF4B00] text-white shadow' : 'text-gray-400 hover:text-white'}`}>
            Métodos
          </button>
          <button onClick={() => setActiveSubtab('plantillas')} className={`px-4 py-2 rounded-lg transition-all ${activeSubtab === 'plantillas' ? 'bg-[#FF4B00] text-white shadow' : 'text-gray-400 hover:text-white'}`}>
            Plantillas
          </button>
        </div>
      </div>

      {/* SUBTAB: ENVIAR COBRO */}
      {activeSubtab === 'enviar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Cliente</label>
              <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs">
                <option value="">-- Seleccionar Cliente --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nombre || c.business_name} ({c.whatsapp || c.telefono || 'Sin WA'})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Plantilla de Mensaje</label>
              <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs">
                {templates.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Método de Pago</label>
              <select value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)} className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs">
                {paymentMethods.filter(m => m.activo).map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Monto a Cobrar (MXN)</label>
              <input type="text" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs" />
            </div>
          </div>

          <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/10 space-y-3 flex flex-col">
            <h4 className="text-xs font-bold text-gray-400">Vista Previa del Mensaje</h4>
            <textarea
              readOnly
              value={generatedMessage}
              rows={10}
              className="w-full flex-1 bg-[#14161F] border border-white/5 rounded-xl p-3 text-gray-300 font-mono text-[10px] focus:outline-none resize-none"
            />
            
            <button
              onClick={handleSendPaymentMessage}
              disabled={!selectedClient || !generatedMessage}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:bg-gray-800 text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              {copied ? <Check size={16} /> : <Send size={16} />}
              {copied ? '¡Copiado!' : 'Generar y Enviar Cobro por WhatsApp'}
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB: HISTORIAL */}
      {activeSubtab === 'historial' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase text-gray-400 tracking-wider">
                <th className="p-3">Fecha</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Monto</th>
                <th className="p-3">Método</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {history.length === 0 && (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No hay cobros registrados</td></tr>
              )}
              {history.map(h => (
                <tr key={h.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 text-gray-300">{new Date(h.date).toLocaleDateString()}</td>
                  <td className="p-3 font-bold text-white">{h.clientName}</td>
                  <td className="p-3 text-[#FF6A1A] font-black">${h.amount}</td>
                  <td className="p-3 text-gray-400">{h.methodName}</td>
                  <td className="p-3">
                    <select
                      value={h.status}
                      onChange={e => handleChangeHistoryStatus(h.id, e.target.value)}
                      className={`px-2 py-1 rounded text-[10px] font-bold bg-[#0D0E12] border border-white/10 ${
                        h.status === 'PAGADO' ? 'text-emerald-400' :
                        h.status === 'VENCIDO' ? 'text-red-400' :
                        h.status === 'CANCELADO' ? 'text-gray-400' : 'text-amber-400'
                      }`}
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="PAGADO">PAGADO</option>
                      <option value="VENCIDO">VENCIDO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBTAB: MÉTODOS DE PAGO */}
      {activeSubtab === 'metodos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-gray-300 uppercase">Catálogo de Métodos de Pago</h4>
            <button
              onClick={() => setEditingMethod({ id: '', tipo: 'mercado_pago', nombre: '', link: '', banco: '', titular: '', cuenta: '', clabe: '', tarjeta: '', activo: true })}
              className="px-3 py-1.5 bg-[#FF4B00] text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Plus size={14} /> Agregar Método
            </button>
          </div>

          {editingMethod && (
            <form onSubmit={handleSaveMethod} className="bg-[#0D0E12] p-4 rounded-xl border border-white/10 space-y-3">
              <h5 className="text-xs font-bold text-white">Editar / Crear Método</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" value={editingMethod.nombre} onChange={e=>setEditingMethod({...editingMethod, nombre: e.target.value})} placeholder="Nombre del método (ej. Mercado Pago, BBVA)" className="bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" required />
                <select value={editingMethod.tipo} onChange={e=>setEditingMethod({...editingMethod, tipo: e.target.value})} className="bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs">
                  <option value="mercado_pago">Mercado Pago</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                </select>
              </div>

              {editingMethod.tipo === 'mercado_pago' ? (
                <input type="text" value={editingMethod.link || ''} onChange={e=>setEditingMethod({...editingMethod, link: e.target.value})} placeholder="Link de pago (ej. https://mpago.la/...)" className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={editingMethod.banco || ''} onChange={e=>setEditingMethod({...editingMethod, banco: e.target.value})} placeholder="Banco (ej. BBVA, Banamex)" className="bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
                  <input type="text" value={editingMethod.titular || ''} onChange={e=>setEditingMethod({...editingMethod, titular: e.target.value})} placeholder="Titular de la cuenta" className="bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
                  <input type="text" value={editingMethod.cuenta || ''} onChange={e=>setEditingMethod({...editingMethod, cuenta: e.target.value})} placeholder="Número de cuenta" className="bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
                  <input type="text" value={editingMethod.clabe || ''} onChange={e=>setEditingMethod({...editingMethod, clabe: e.target.value})} placeholder="CLABE interbancaria" className="bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingMethod(null)} className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-xl text-xs font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-[#FF4B00] text-white rounded-xl text-xs font-bold">Guardar Método</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map(m => (
              <div key={m.id} className="bg-[#0D0E12] p-4 rounded-xl border border-white/10 relative">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-white">{m.nombre}</h4>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleMethodActive(m.id)} className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.activo ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {m.activo ? 'Activo' : 'Inactivo'}
                    </button>
                    <button onClick={() => setEditingMethod(m)} className="p-1 text-gray-400 hover:text-white"><Edit size={14}/></button>
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 space-y-1">
                  {m.tipo === 'mercado_pago' && <p>Link: <span className="text-blue-400">{m.link || 'Sin link configurado'}</span></p>}
                  {m.tipo === 'transferencia' && (
                    <>
                      <p>Banco: {m.banco || 'Pendiente'}</p>
                      <p>Titular: {m.titular || 'Pendiente'}</p>
                      <p>Cuenta: {m.cuenta || 'Pendiente'}</p>
                      <p>CLABE: {m.clabe || 'Pendiente'}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: PLANTILLAS */}
      {activeSubtab === 'plantillas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-gray-300 uppercase">Plantillas de Mensajes de Cobro</h4>
            <button
              onClick={() => setEditingTemplate({ id: '', nombre: '', mensaje: '' })}
              className="px-3 py-1.5 bg-[#FF4B00] text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Plus size={14} /> Nueva Plantilla
            </button>
          </div>

          {editingTemplate && (
            <form onSubmit={handleSaveTemplate} className="bg-[#0D0E12] p-4 rounded-xl border border-white/10 space-y-3">
              <h5 className="text-xs font-bold text-white">Editar / Crear Plantilla</h5>
              <input type="text" value={editingTemplate.nombre} onChange={e=>setEditingTemplate({...editingTemplate, nombre: e.target.value})} placeholder="Nombre de la plantilla" className="w-full bg-[#14161F] border border-white/10 rounded-xl px-3 py-2 text-white text-xs" required />
              <textarea rows={6} value={editingTemplate.mensaje} onChange={e=>setEditingTemplate({...editingTemplate, mensaje: e.target.value})} placeholder="Cuerpo del mensaje. Usa variables: [NOMBRE], [NEGOCIO], [MONTO], [LINK_PAGO], [BANCO], [TITULAR], [CUENTA], [CLABE]" className="w-full bg-[#14161F] border border-white/10 rounded-xl p-3 text-white font-mono text-xs" required />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditingTemplate(null)} className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-xl text-xs font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-[#FF4B00] text-white rounded-xl text-xs font-bold">Guardar Plantilla</button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {templates.map(t => (
              <div key={t.id} className="bg-[#0D0E12] p-4 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-black text-white">{t.nombre}</h4>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingTemplate(t)} className="p-1 text-gray-400 hover:text-white"><Edit size={14}/></button>
                    <button onClick={() => handleDeleteTemplate(t.id)} className="p-1 text-gray-400 hover:text-red-400"><Trash size={14}/></button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 font-mono whitespace-pre-wrap">{t.mensaje}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
