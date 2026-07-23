// Editor de DATOS DEL NEGOCIO de una prueba (los 9 campos del alcance).
import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { inputCls, labelCls } from './ProspectForm'
import { comprimirImagen } from '../../context/DemoTrialsContext'

export default function TrialBusinessEditor({ negocio, editarNegocio }) {
  const [subiendoLogo, setSubiendoLogo] = useState(false)

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

  const cambiarLogo = async (file) => {
    if (!file) return
    setSubiendoLogo(true)
    try {
      const logo = await comprimirImagen(file, 500)
      editarNegocio({ logo })
    } catch {
      alert('No se pudo cargar el logo. Intenta con otra imagen.')
    } finally {
      setSubiendoLogo(false)
    }
  }

  const editarRed = (red, valor) => {
    editarNegocio({ redes: { ...(negocio.redes || {}), [red]: valor } })
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <label className={labelCls}>Logo del negocio</label>
        <div className="flex items-center gap-4 bg-dark2 border border-white/10 rounded-2xl p-4">
          {negocio.logo ? (
            <img src={negocio.logo} alt="Logo del negocio" className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-dark3 border border-white/10 flex items-center justify-center text-gray-500">
              <ImagePlus size={26} />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="logo-negocio-demo"
              onChange={e => cambiarLogo(e.target.files?.[0])}
            />
            <label htmlFor="logo-negocio-demo" className="inline-flex cursor-pointer bg-primary text-dark font-black text-xs px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
              {subiendoLogo ? 'Cargando...' : negocio.logo ? 'Cambiar logo' : 'Subir logo'}
            </label>
            {negocio.logo && (
              <button
                type="button"
                onClick={() => editarNegocio({ logo: '' })}
                className="ml-2 text-xs font-bold text-gray-500 hover:text-white"
              >
                Quitar
              </button>
            )}
            <p className="text-gray-600 text-xs mt-2">Se mostrará en el dashboard, vista previa y menú público.</p>
          </div>
        </div>
      </div>

      {campo('Nombre del restaurante', 'nombre', { placeholder: 'Ej. Taquería El Güero' })}
      <div className="grid sm:grid-cols-2 gap-4">
        {campo('Teléfono', 'telefono', { placeholder: '10 dígitos' })}
        {campo('WhatsApp', 'whatsapp', { placeholder: '10 dígitos' })}
      </div>
      {campo('Dirección', 'direccion', { placeholder: 'Calle, número, colonia' })}
      {campo('Link de Google Maps', 'urlMaps', { placeholder: 'https://maps.app.goo.gl/…' })}
      {campo('Horarios', 'horarios', { placeholder: 'Ej. Lun a Dom · 9:00 am – 9:00 pm' })}

      <div className="bg-dark2 border border-white/10 rounded-2xl p-4 space-y-4">
        <div>
          <label className={labelCls}>Servicio a domicilio</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => editarNegocio({ servicioDomicilio: true })}
              className={`rounded-xl py-2.5 text-xs font-black border transition-colors ${negocio.servicioDomicilio !== false ? 'bg-primary text-dark border-primary' : 'bg-dark3 text-gray-400 border-white/10'}`}
            >
              Sí incluir
            </button>
            <button
              type="button"
              onClick={() => editarNegocio({ servicioDomicilio: false })}
              className={`rounded-xl py-2.5 text-xs font-black border transition-colors ${negocio.servicioDomicilio === false ? 'bg-primary text-dark border-primary' : 'bg-dark3 text-gray-400 border-white/10'}`}
            >
              No incluir
            </button>
          </div>
        </div>

        {negocio.servicioDomicilio !== false && (
          <>
            <div>
              <label className={labelCls}>Cómo cobrar el envío</label>
              <select
                className={inputCls}
                value={negocio.modoEnvio || 'pendiente'}
                onChange={e => editarNegocio({ modoEnvio: e.target.value })}
              >
                <option value="pendiente">Pendiente: el negocio confirma por WhatsApp</option>
                <option value="fijo">Costo fijo</option>
                <option value="km">Automático por kilómetro</option>
              </select>
            </div>

            {negocio.modoEnvio === 'fijo' && (
              <div>
                <label className={labelCls}>Costo fijo de envío ($)</label>
                <input
                  className={inputCls}
                  value={negocio.costoEnvio ?? ''}
                  inputMode="decimal"
                  onChange={e => editarNegocio({ costoEnvio: e.target.value.replace(/[^0-9.]/g, '') })}
                  placeholder="Ej. 30"
                />
              </div>
            )}

            {negocio.modoEnvio === 'km' && (
              <div>
                <label className={labelCls}>Costo por kilómetro ($)</label>
                <input
                  className={inputCls}
                  value={negocio.costoEnvioKm ?? ''}
                  inputMode="decimal"
                  onChange={e => editarNegocio({ costoEnvioKm: e.target.value.replace(/[^0-9.]/g, '') })}
                  placeholder="Ej. 12"
                />
                <p className="text-gray-600 text-xs mt-2">El comprador indicará sus km aproximados y el menú calculará el envío por km completo.</p>
              </div>
            )}

            {negocio.modoEnvio === 'pendiente' && (
              <p className="text-amber-400 text-xs bg-amber-500/10 border border-amber-500/10 rounded-xl p-3">
                El pedido se enviará por WhatsApp con el aviso: “Subtotal pendiente de envío”. El negocio confirma el costo después.
              </p>
            )}

            {campo('Tiempo estimado de entrega', 'tiempoEntrega', { placeholder: 'Ej. 30–40 min' })}
          </>
        )}
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
      <div>
        <label className={labelCls}>Redes sociales</label>
        <div className="grid gap-3">
          <input
            className={inputCls}
            value={negocio.redes?.instagram ?? ''}
            onChange={e => editarRed('instagram', e.target.value)}
            placeholder="Instagram: https://instagram.com/tu_negocio"
          />
          <input
            className={inputCls}
            value={negocio.redes?.facebook ?? ''}
            onChange={e => editarRed('facebook', e.target.value)}
            placeholder="Facebook: https://facebook.com/tu_negocio"
          />
          <input
            className={inputCls}
            value={negocio.redes?.tiktok ?? ''}
            onChange={e => editarRed('tiktok', e.target.value)}
            placeholder="TikTok: https://tiktok.com/@tu_negocio"
          />
        </div>
      </div>
      <p className="text-gray-600 text-xs">💾 Los cambios se guardan automáticamente en este navegador.</p>
    </div>
  )
}
