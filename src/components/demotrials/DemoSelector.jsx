// Grid de las 10 DEMOS OFICIALES con el mensaje de interés preparado.
// El mensaje/link de WhatsApp queda listo para usarse en botones o tarjetas
// futuras — aquí solo se copia, NO se toca la landing ni producción.
import { useState } from 'react'
import { MessageCircle, Link2, Check } from 'lucide-react'
import { DEMOS_OFICIALES, mensajeInteres, urlWhatsAppInteres } from '../../data/demoTrials'
import { copiarTexto } from './ProspectForm'

export default function DemoSelector({ onSeleccionar, seleccionada }) {
  const [copiado, setCopiado] = useState(null) // `${demoId}-msj` | `${demoId}-url`

  const copiar = async (id, texto) => {
    if (await copiarTexto(texto)) {
      setCopiado(id)
      setTimeout(() => setCopiado(c => (c === id ? null : c)), 1500)
    }
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {DEMOS_OFICIALES.map(demo => (
        <div
          key={demo.id}
          className={`bg-dark2 border rounded-2xl p-4 transition-colors ${
            seleccionada === demo.id ? 'border-primary' : 'border-white/5'
          } ${onSeleccionar ? 'cursor-pointer hover:border-primary/50' : ''}`}
          onClick={onSeleccionar ? () => onSeleccionar(demo) : undefined}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{demo.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{demo.nombre}</p>
              <p className="text-gray-600 text-xs">{demo.giro}</p>
            </div>
            {seleccionada === demo.id && <Check size={18} className="text-primary shrink-0" />}
          </div>

          {/* Mensaje de interés preparado (Parte 3) */}
          <p className="text-gray-500 text-xs mt-3 italic line-clamp-2">"{mensajeInteres(demo.nombre)}"</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={e => { e.stopPropagation(); copiar(`${demo.id}-msj`, mensajeInteres(demo.nombre)) }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-dark3 text-gray-400 hover:text-white text-[11px] font-bold px-2 py-1.5 rounded-lg transition-colors"
            >
              {copiado === `${demo.id}-msj` ? <Check size={12} className="text-green-400" /> : <MessageCircle size={12} />}
              {copiado === `${demo.id}-msj` ? 'Copiado' : 'Mensaje'}
            </button>
            <button
              onClick={e => { e.stopPropagation(); copiar(`${demo.id}-url`, urlWhatsAppInteres(demo.nombre)) }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-dark3 text-gray-400 hover:text-white text-[11px] font-bold px-2 py-1.5 rounded-lg transition-colors"
            >
              {copiado === `${demo.id}-url` ? <Check size={12} className="text-green-400" /> : <Link2 size={12} />}
              {copiado === `${demo.id}-url` ? 'Copiado' : 'Link WA'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
