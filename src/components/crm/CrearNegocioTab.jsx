import { useState, useEffect } from 'react'
import { getDemos, createBusinessFromDemo, slugify } from '../../services/crmV3Service'
import { Store, Sparkles, CheckCircle, Copy, Send, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react'

export default function CrearNegocioTab({ selectedDemoId, onBusinessCreated }) {
  const [demos, setDemos] = useState([])
  const [demoSelectedId, setDemoSelectedId] = useState(selectedDemoId || '')
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    business_type: 'Restaurante',
    description: '',
    owner_name: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    ext_number: '',
    int_number: '',
    colonia: '',
    postal_code: '29000',
    city: 'Tuxtla Gutiérrez',
    municipality: 'Tuxtla Gutiérrez',
    state: 'Chiapas',
    maps_url: '',
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    website_url: '',
    schedule_text: 'Lun a Dom · 9:00 am – 10:00 pm',
    logo_url: '',
    banner_url: '',
    brand_color: '#FF4B00',
    main_message: '¡Gracias por tu preferencia! Pedidos al instante por WhatsApp.',
  })

  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copiedField, setCopiedField] = useState('')

  useEffect(() => {
    const list = getDemos()
    setDemos(list)
    if (selectedDemoId) {
      setDemoSelectedId(selectedDemoId)
    } else if (list.length > 0 && !demoSelectedId) {
      setDemoSelectedId(list[0].id)
    }
  }, [selectedDemoId])

  const selectedDemo = demos.find(d => d.id === demoSelectedId || d.business_id === demoSelectedId)

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: slugify(name),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    try {
      if (!demoSelectedId) throw new Error('Por favor selecciona una plantilla Demo base.')
      if (!formData.name.trim()) throw new Error('El nombre comercial del negocio es obligatorio.')

      const created = createBusinessFromDemo({
        demoId: demoSelectedId,
        formData,
      })

      setResult(created)
      if (onBusinessCreated) onBusinessCreated(created.business)
    } catch (err) {
      setError(err.message || 'Error al crear el negocio.')
    }
  }

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(''), 2500)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="text-[#FF4B00]" size={26} /> Generador de Negocio Real
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Clona una plantilla Demo sin modificar el original y genera sus credenciales listas para entregar.
          </p>
        </div>
      </div>

      {result ? (
        /* Éxito - Presentación de Credenciales y Enlaces */
        <div className="bg-[#14161F] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-3 text-emerald-400 border-b border-white/5 pb-4">
            <CheckCircle size={32} />
            <div>
              <h3 className="text-xl font-black text-white">¡Negocio Creado Exitosamente!</h3>
              <p className="text-xs text-gray-400">Instancia real independiente creada (is_demo = false).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/5 space-y-2">
              <span className="text-xs font-bold text-gray-400 block uppercase">Menú Digital Público</span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-emerald-400 truncate">{result.menuUrl}</span>
                <button
                  onClick={() => copyToClipboard(result.menuUrl, 'menuUrl')}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-lg text-white"
                >
                  {copiedField === 'menuUrl' ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/5 space-y-2">
              <span className="text-xs font-bold text-gray-400 block uppercase">Dashboard del Cliente</span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[#FF6A1A] truncate">{result.dashboardUrl}</span>
                <button
                  onClick={() => copyToClipboard(result.dashboardUrl, 'dashUrl')}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-lg text-white"
                >
                  {copiedField === 'dashUrl' ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/5 space-y-2">
              <span className="text-xs font-bold text-gray-400 block uppercase">Usuario Propietario</span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-white truncate">{result.username}</span>
                <button
                  onClick={() => copyToClipboard(result.username, 'user')}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-lg text-white"
                >
                  {copiedField === 'user' ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="bg-[#0D0E12] p-4 rounded-xl border border-white/5 space-y-2">
              <span className="text-xs font-bold text-gray-400 block uppercase">Contraseña Temporal Segura</span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-amber-400 font-bold truncate">{result.password}</span>
                <button
                  onClick={() => copyToClipboard(result.password, 'pass')}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-xs font-bold rounded-lg text-amber-300"
                >
                  {copiedField === 'pass' ? '¡Copiada!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>

          {/* Mensaje para enviar por WhatsApp */}
          <div className="bg-[#0D0E12] p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                Mensaje de Bienvenida WhatsApp (Listo para enviar)
              </span>
              <button
                onClick={() => copyToClipboard(result.whatsappMessage, 'msg')}
                className="flex items-center gap-1.5 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow"
              >
                <Copy size={14} /> {copiedField === 'msg' ? '¡Mensaje Copiado!' : 'Copiar mensaje'}
              </button>
            </div>
            <pre className="text-xs text-gray-300 bg-black/40 p-4 rounded-xl font-mono whitespace-pre-wrap leading-relaxed border border-white/5">
              {result.whatsappMessage}
            </pre>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
            <button
              onClick={() => setResult(null)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl"
            >
              Crear otro negocio
            </button>

            <a
              href={`https://wa.me/${formData.whatsapp}?text=${encodeURIComponent(result.whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-lg"
            >
              <Send size={16} /> Enviar al dueño por WhatsApp
            </a>
          </div>
        </div>
      ) : (
        /* Formulario de Creación */
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-bold">
              ⚠️ {error}
            </div>
          )}

          {/* Selección de Demo Base */}
          <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Store className="text-[#FF4B00]" size={18} /> 1. Selecciona la Plantilla Demo Base
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {demos.map(demo => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => setDemoSelectedId(demo.id)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    demoSelectedId === demo.id
                      ? 'border-[#FF4B00] bg-[#FF4B00]/10 text-white shadow-lg'
                      : 'border-white/5 bg-[#0D0E12] text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black">
                    <img src={demo.banner_url || demo.img} alt={demo.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-xs text-white truncate">{demo.name}</p>
                    <p className="text-[10px] text-gray-400">{demo.business_type}</p>
                  </div>
                </button>
              ))}
            </div>

            {selectedDemo && (
              <div className="p-3 bg-[#0D0E12] rounded-xl border border-white/5 flex items-center justify-between text-xs text-gray-300">
                <span>Plantilla seleccionada: <strong className="text-white">{selectedDemo.name}</strong> ({selectedDemo.categories_count} categorías, {selectedDemo.products_count} productos)</span>
                <span className="text-emerald-400 font-bold">Base Intacta ✔</span>
              </div>
            )}
          </div>

          {/* Datos del Negocio */}
          <div className="bg-[#14161F] p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-base font-black text-white">2. Datos Comerciales del Restaurante</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Nombre Comercial *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Taquería El Pastorcito"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF4B00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Slug URL (/menu/slug)</label>
                <input
                  type="text"
                  required
                  placeholder="taqueria-el-pastorcito"
                  value={formData.slug}
                  onChange={e => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 font-mono text-emerald-400 focus:border-[#FF4B00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Propietario / Nombre Contacto</label>
                <input
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.owner_name}
                  onChange={e => setFormData(prev => ({ ...prev, owner_name: e.target.value }))}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF4B00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">WhatsApp Pedidos (10 dígitos) *</label>
                <input
                  type="text"
                  required
                  placeholder="9610000000"
                  value={formData.whatsapp}
                  onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF4B00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Correo Electrónico Propietario</label>
                <input
                  type="email"
                  placeholder="contacto@elpastorcito.com"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF4B00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Giro / Tipo de Alimentos</label>
                <input
                  type="text"
                  placeholder="Taquería · Antojitos"
                  value={formData.business_type}
                  onChange={e => setFormData(prev => ({ ...prev, business_type: e.target.value }))}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF4B00] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-300 mb-1">Dirección Completa</label>
                <input
                  type="text"
                  placeholder="Av. Central Poniente 123, Col. Centro"
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF4B00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Colonia</label>
                <input
                  type="text"
                  placeholder="Centro"
                  value={formData.colonia}
                  onChange={e => setFormData(prev => ({ ...prev, colonia: e.target.value }))}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF4B00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Código Postal</label>
                <input
                  type="text"
                  placeholder="29000"
                  value={formData.postal_code}
                  onChange={e => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FF4B00] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#FF4B00] hover:bg-[#FF6A1A] text-white font-black text-sm px-8 py-3.5 rounded-full shadow-[0_0_25px_rgba(255,75,0,0.4)] transition-all transform hover:scale-105"
            >
              <Sparkles size={18} /> Crear Negocio y Generar Menú
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
