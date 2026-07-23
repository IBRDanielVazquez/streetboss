// Vista previa del menú digital dentro de un marco tipo celular.
// Réplica visual del estilo del menú público real (fondo claro), SIN tocar
// MenuDigital.jsx: es solo presentación, sin carrito ni checkout.
import { MapPin, Clock, Bike, Phone, Instagram, Facebook } from 'lucide-react'

export default function TrialPreview({ negocio, menu }) {
  const catsVisibles = menu.filter(c => c.visible)
  const textoEnvio = negocio.servicioDomicilio === false
    ? 'Sin servicio a domicilio'
    : negocio.modoEnvio === 'fijo'
      ? `Envío $${negocio.costoEnvio || 0}`
      : negocio.modoEnvio === 'km'
        ? `Envío $${negocio.costoEnvioKm || 0}/km`
        : 'Subtotal pendiente de envío'

  return (
    <div className="flex justify-center">
      {/* Marco del teléfono */}
      <div className="w-[340px] bg-dark3 rounded-[40px] p-3 border border-white/10 shadow-2xl">
        <div className="w-24 h-1.5 bg-white/10 rounded-full mx-auto mb-2" />
        {/* Pantalla */}
        <div className="bg-gray-100 rounded-[28px] overflow-hidden h-[560px] overflow-y-auto no-scrollbar text-left">

          {/* Encabezado del negocio */}
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {negocio.logo ? (
                <img src={negocio.logo} alt="Logo del negocio" className="w-14 h-14 rounded-2xl object-cover border border-gray-100" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">🍽️</div>
              )}
              <h2 className="text-gray-900 font-black text-xl leading-tight">{negocio.nombre || 'Mi Restaurante'}</h2>
            </div>
            <div className="mt-2 space-y-1">
              {negocio.horarios && (
                <p className="text-gray-500 text-xs flex items-center gap-1.5"><Clock size={12} /> {negocio.horarios}</p>
              )}
              {negocio.direccion && (
                <p className="text-gray-500 text-xs flex items-center gap-1.5"><MapPin size={12} /> {negocio.direccion}</p>
              )}
              {(negocio.telefono || negocio.whatsapp) && (
                <p className="text-gray-500 text-xs flex items-center gap-1.5"><Phone size={12} /> {negocio.whatsapp || negocio.telefono}</p>
              )}
              <p className="text-gray-500 text-xs flex items-center gap-1.5">
                <Bike size={12} /> {textoEnvio} · {negocio.tiempoEntrega || 'por confirmar'}
              </p>
            </div>
            {(negocio.redes?.instagram || negocio.redes?.facebook || negocio.redes?.tiktok) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {negocio.redes?.instagram && <span className="text-[10px] bg-pink-50 text-pink-700 font-bold px-2 py-1 rounded-full flex items-center gap-1"><Instagram size={11} /> Instagram</span>}
                {negocio.redes?.facebook && <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded-full flex items-center gap-1"><Facebook size={11} /> Facebook</span>}
                {negocio.redes?.tiktok && <span className="text-[10px] bg-gray-100 text-gray-800 font-bold px-2 py-1 rounded-full">TikTok</span>}
              </div>
            )}
          </div>

          {/* Mensaje para clientes */}
          {negocio.mensajeClientes && (
            <div className="bg-[#f5b87a]/20 px-4 py-2.5">
              <p className="text-[#8a5a1f] text-xs font-semibold">{negocio.mensajeClientes}</p>
            </div>
          )}

          {/* Categorías y productos */}
          <div className="p-3 space-y-4 pb-8">
            {catsVisibles.length === 0 && (
              <p className="text-gray-400 text-center text-sm py-10">No hay categorías visibles</p>
            )}
            {catsVisibles.map(cat => {
              const prods = cat.productos.filter(p => p.activo)
              if (prods.length === 0) return null
              return (
                <div key={cat.id}>
                  <h3 className="text-gray-900 font-black text-sm mb-2 px-1">{cat.nombre}</h3>
                  <div className="space-y-2">
                    {prods.map(p => (
                      <div key={p.id} className={`bg-white rounded-2xl p-3 flex gap-3 items-center shadow-sm ${p.agotado ? 'opacity-60' : ''}`}>
                        {p.foto
                          ? <img src={p.foto} alt={p.nombre} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                          : <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">🍽️</div>}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-bold text-sm truncate">{p.nombre}</p>
                          {p.descripcion && <p className="text-gray-400 text-xs line-clamp-2">{p.descripcion}</p>}
                          {p.agotado && <span className="inline-block mt-1 text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Agotado</span>}
                        </div>
                        <span className="text-gray-900 font-black text-sm shrink-0">${p.precio}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
