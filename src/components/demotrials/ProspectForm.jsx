// Formulario de alta/edición de PROSPECTOS + piezas UI compartidas del sistema
// de pruebas demo (modal, estilos de inputs y utilidad de copiado).
import { useState } from 'react'
import { X } from 'lucide-react'
import { useDemoTrials } from '../../context/DemoTrialsContext'
import { DEMOS_OFICIALES } from '../../data/demoTrials'

// ── Piezas compartidas ───────────────────────────────────────────────────────
export const inputCls = 'w-full bg-dark3 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary'
export const labelCls = 'block text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-1.5'

export function ModalDemo({ titulo, onCerrar, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onCerrar} />
      <div className="relative bg-dark2 border border-white/10 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-black text-lg">{titulo}</h3>
          <button onClick={onCerrar} className="text-gray-500 hover:text-white p-1" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Copia texto al portapapeles con fallback silencioso
export async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = texto
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch { return false }
  }
}

// ── Formulario de prospecto ──────────────────────────────────────────────────
// props: prospecto (null = alta) · onCerrar
export default function ProspectForm({ prospecto, onCerrar }) {
  const { crearProspecto, editarProspecto } = useDemoTrials()
  const [form, setForm] = useState({
    nombre: prospecto?.nombre || '',
    whatsapp: prospecto?.whatsapp || '',
    demoId: prospecto?.demoId || '',
    notas: prospecto?.notas || '',
  })
  const [error, setError] = useState('')

  const guardar = () => {
    if (!form.nombre.trim()) { setError('El nombre del interesado es obligatorio'); return }
    if (prospecto) {
      editarProspecto(prospecto.id, { nombre: form.nombre.trim(), whatsapp: form.whatsapp.trim(), demoId: form.demoId || null, notas: form.notas.trim() })
    } else {
      crearProspecto(form)
    }
    onCerrar()
  }

  return (
    <ModalDemo titulo={prospecto ? 'Editar interesado' : 'Registrar interesado'} onCerrar={onCerrar}>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Nombre *</label>
          <input className={inputCls} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del interesado" />
        </div>
        <div>
          <label className={labelCls}>WhatsApp</label>
          <input className={inputCls} value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="10 dígitos" inputMode="numeric" />
        </div>
        <div>
          <label className={labelCls}>Demo que le interesó</label>
          <select className={inputCls} value={form.demoId} onChange={e => setForm({ ...form, demoId: e.target.value })}>
            <option value="">— Sin definir —</option>
            {DEMOS_OFICIALES.map(d => <option key={d.id} value={d.id}>{d.emoji} {d.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Notas</label>
          <textarea className={`${inputCls} min-h-[70px]`} value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} placeholder="Ej. Pidió info por Instagram, tiene 2 sucursales…" />
        </div>
        {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
        <button onClick={guardar} className="w-full bg-primary text-dark font-black py-3 rounded-xl hover:opacity-90 transition-opacity">
          {prospecto ? 'Guardar cambios' : 'Registrar'}
        </button>
      </div>
    </ModalDemo>
  )
}
