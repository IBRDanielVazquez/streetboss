// ─────────────────────────────────────────────────────────────────────────────
// MenuHeroProfile — Hero tipo perfil de redes sociales
// Banner horizontal + foto de perfil superpuesta + info del negocio
// ─────────────────────────────────────────────────────────────────────────────
import { MapPin, Clock, Phone, Share2, Instagram, Facebook } from 'lucide-react'

// Ícono TikTok SVG inline (Lucide no tiene TikTok)
function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.77a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.2z"/>
    </svg>
  )
}

// Ícono WhatsApp SVG inline
function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function MenuHeroProfile({ config }) {
  const {
    negocio, logo, banner, direccion, horarios, urlMaps,
    whatsapp, telefono, redes = {}, colorMarca = '#ff4b16'
  } = config

  // Determinar si el negocio está "abierto" (simplificado: si tiene horarios configurados lo mostramos)
  const tieneHorarios = horarios && horarios.trim().length > 0

  const compartir = async () => {
    const url = window.location.href
    const texto = `Mira el menú de ${negocio}: ${url}`
    if (navigator.share) {
      try { await navigator.share({ title: negocio, text: texto, url }) } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); alert('¡Enlace copiado!') } catch {}
    }
  }

  const redesActivas = [
    redes.instagram && { icon: <Instagram size={18} />, url: redes.instagram, label: 'Instagram' },
    redes.facebook && { icon: <Facebook size={18} />, url: redes.facebook, label: 'Facebook' },
    redes.tiktok && { icon: <TikTokIcon size={18} />, url: redes.tiktok, label: 'TikTok' },
    whatsapp && { icon: <WhatsAppIcon size={18} />, url: `https://wa.me/52${whatsapp}`, label: 'WhatsApp' },
    telefono && { icon: <Phone size={18} />, url: `tel:+52${telefono}`, label: 'Llamar' },
  ].filter(Boolean)

  return (
    <div className="relative bg-white">
      {/* ── Banner/Portada ── */}
      <div className="relative h-40 sm:h-52 w-full overflow-hidden">
        {banner ? (
          <img
            src={banner}
            alt={`Portada de ${negocio}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${colorMarca}dd 0%, ${colorMarca}88 50%, ${colorMarca}44 100%)`
            }}
          />
        )}
        {/* Overlay gradiente inferior para legibilidad */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/80 to-transparent" />
      </div>

      {/* ── Perfil superpuesto ── */}
      <div className="relative px-4 -mt-12 pb-4">
        <div className="flex items-end gap-3">
          {/* Foto de perfil */}
          <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
            {logo ? (
              <img src={logo} alt={negocio} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-3xl font-black text-white"
                style={{ backgroundColor: colorMarca }}
              >
                {(negocio || 'S')[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Nombre + estado */}
          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 truncate leading-tight">
              {negocio}
            </h1>
            {tieneHorarios && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Abierto
              </span>
            )}
          </div>

          {/* Botón compartir */}
          <button
            onClick={compartir}
            className="shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 active:scale-95 transition-all"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* ── Info del negocio ── */}
        <div className="mt-3 space-y-1.5">
          {direccion && (
            <a
              href={urlMaps || '#'}
              target={urlMaps ? '_blank' : undefined}
              rel="noreferrer"
              className="flex items-start gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MapPin size={15} className="shrink-0 mt-0.5 text-gray-400" />
              <span className="leading-snug">{direccion}</span>
            </a>
          )}
          {tieneHorarios && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Clock size={15} className="shrink-0 mt-0.5 text-gray-400" />
              <span className="leading-snug">{horarios}</span>
            </div>
          )}
        </div>

        {/* ── Redes sociales ── */}
        {redesActivas.length > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {redesActivas.map((red, i) => (
              <a
                key={i}
                href={red.url}
                target="_blank"
                rel="noreferrer"
                title={red.label}
                className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-800 active:scale-95 transition-all"
              >
                {red.icon}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Línea separadora sutil */}
      <div className="h-px bg-gray-100" />
    </div>
  )
}
