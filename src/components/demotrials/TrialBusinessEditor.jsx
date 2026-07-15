// Editor de DATOS DEL NEGOCIO de una prueba (los 9 campos del alcance).
import { inputCls, labelCls } from './ProspectForm'

export default function TrialBusinessEditor({ negocio, editarNegocio }) {
  // Campo controlado genérico
  const campo = (label, key, props = {}) => (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        className={inputCls}
        value={negocio[key] ?? ''}
        onChange={e => editarNegocio({ [key]: props.numero ? e.target.value.replace(/[^0-9.]/g, '') : e.target.value })}
        placeholder={props.placeholder || ''}
        inputMode={props.numero ? 'decimal' : undefined}
      />
    </div>
  )

  return (
    <div className="space-y-4 max-w-xl">
      {campo('Nombre del restaurante', 'nombre', { placeholder: 'Ej. Taquería El Güero' })}
      <div className="grid sm:grid-cols-2 gap-4">
        {campo('Teléfono', 'telefono', { placeholder: '10 dígitos' })}
        {campo('WhatsApp', 'whatsapp', { placeholder: '10 dígitos' })}
      </div>
      {campo('Dirección', 'direccion', { placeholder: 'Calle, número, colonia' })}
      {campo('Link de Google Maps', 'urlMaps', { placeholder: 'https://maps.app.goo.gl/…' })}
      {campo('Horarios', 'horarios', { placeholder: 'Ej. Lun a Dom · 9:00 am – 9:00 pm' })}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Costo de envío ($)</label>
          <input
            className={inputCls}
            value={negocio.costoEnvio ?? ''}
            inputMode="decimal"
            onChange={e => editarNegocio({ costoEnvio: e.target.value.replace(/[^0-9.]/g, '') })}
            placeholder="Ej. 30"
          />
        </div>
        {campo('Tiempo estimado de entrega', 'tiempoEntrega', { placeholder: 'Ej. 30–40 min' })}
      </div>
      <div>
        <label className={labelCls}>Mensaje para clientes</label>
        <textarea
          className={`${inputCls} min-h-[80px]`}
          value={negocio.mensajeClientes ?? ''}
          onChange={e => editarNegocio({ mensajeClientes: e.target.value })}
          placeholder="Ej. ¡Gracias por tu preferencia! Pedidos con 30 min de anticipación."
        />
      </div>
      <p className="text-gray-600 text-xs">💾 Los cambios se guardan automáticamente en este navegador.</p>
    </div>
  )
}
