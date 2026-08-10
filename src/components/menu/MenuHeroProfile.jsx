import { useEffect } from 'react'
import { MapPin, Clock, Phone, Share2, Instagram, Facebook, Youtube, Globe } from 'lucide-react'
import { normalizeMexicanPhone } from '../../services/crmV3Service'

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
    whatsapp, telefono, redes = {}, colorMarca = '#FF4B00',
    foodType, isDemo = true, is_open = true, mensajeClientes
  } = config

  const tieneHorarios = horarios && horarios.trim().length > 0

  // Actualizar Open Graph metadata dinámicamente para previsualizaciones al compartir
  useEffect(() => {
    if (negocio) {
      document.title = `${negocio} | Menú Digital StreetBoss`

      const setMeta = (property, content) => {
        let el = document.querySelector(`meta[property="${property}"]`)
        if (!el) {
          el = document.createElement('meta')
          el.setAttribute('property', property)
          document.head.appendChild(el)
        }
        el.setAttribute('content', content)
      }

      setMeta('og:title', `${negocio} - Menú Digital`)
      setMeta('og:description', `${foodType || 'Pedidos al instante por WhatsApp.'} 📍 Tuxtla Gutiérrez, Chiapas.`)
      if (logo) {
        const fullLogoUrl = logo.startsWith('http') ? logo : `${window.location.origin}${logo}`
        setMeta('og:image', fullLogoUrl)
      }
    }
  }, [negocio, logo, foodType])

  const compartir = async () => {
    const url = window.location.href
    const texto = `Mira el menú digital de ${negocio}: ${url}`
    if (navigator.share) {
      try { await navigator.share({ title: negocio, text: texto, url }) } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); alert('¡Enlace copiado al portapapeles!') } catch {}
    }
  }

  // Links de Redes Sociales dinámicas filtrando strings vacíos
  const fbUrl = redes.facebook && redes.facebook.trim() !== '' ? redes.facebook : null
  const igUrl = redes.instagram && redes.instagram.trim() !== '' ? redes.instagram : null
  const ttUrl = redes.tiktok && redes.tiktok.trim() !== '' ? redes.tiktok : null
  const ytUrl = redes.youtube && redes.youtube.trim() !== '' ? redes.youtube : null
  const wsUrl = redes.website && redes.website.trim() !== '' ? redes.website : null

  const cleanWaPhone = normalizeMexicanPhone(whatsapp || telefono || '9613725386')
  const cleanTelPhone = normalizeMexicanPhone(telefono || whatsapp || '9613725386')

  const redesActivas = [
    igUrl && { icon: <Instagram size={18} />, url: igUrl, label: 'Instagram' },
    fbUrl && { icon: <Facebook size={18} />, url: fbUrl, label: 'Facebook' },
    ttUrl && { icon: <TikTokIcon size={18} />, url: ttUrl, label: 'TikTok' },
    ytUrl && { icon: <Youtube size={18} />, url: ytUrl, label: 'YouTube' },
    wsUrl && { icon: <Globe size={18} />, url: wsUrl, label: 'Sitio Web' },
    cleanWaPhone && { icon: <WhatsAppIcon size={18} />, url: `https://wa.me/52${cleanWaPhone}`, label: 'WhatsApp' },
    cleanTelPhone && { icon: <Phone size={18} />, url: `tel:+52${cleanTelPhone}`, label: 'Llamar' },
  ].filter(Boolean)

  return (
    <div className="relative bg-white font-sans text-gray-900">
      {/* Banner de Mensaje Destacado Dinámico Superior */}
      {mensajeClientes && mensajeClientes.trim().length > 0 && (
        <div className="bg-[#FF4B00] text-white text-center py-2 px-4 text-xs font-black tracking-wide shadow-sm flex items-center justify-center gap-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
          <span className="relative z-10">{mensajeClientes}</span>
        </div>
      )}

      {/* ── Banner / Portada ── */}
      <div className="relative h-44 sm:h-60 w-full overflow-hidden bg-gray-900">
        {banner ? (
          <img
            src={banner}
            alt={`Portada de ${negocio}`}
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${colorMarca} 0%, #14161F 100%)`
            }}
          />
        )}
        {/* Shadow overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Action icons top right */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button
            onClick={compartir}
            className="w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all border border-white/20"
            title="Compartir Menú"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* ── Perfil Superpuesto tipo iOS App Header ── */}
      <div className="relative px-4 -mt-14 pb-4 max-w-4xl mx-auto">
        <div className="flex items-end justify-between gap-3">
          {/* Avatar Perfil Restaurante */}
          <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white aspect-square flex items-center justify-center">
            {logo ? (
              <img src={logo} alt={negocio} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl font-black text-white"
                style={{ backgroundColor: colorMarca }}
              >
                {(negocio || 'S')[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Info del Restaurante & Badges */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 leading-tight">
              {negocio}
            </h1>
          </div>

          {/* Badges de Estado Operativo */}
          <div className="flex gap-2 flex-wrap items-center">
            <div className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-lg border ${
              is_open !== false
                ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                : 'text-red-800 bg-red-50 border-red-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${is_open !== false ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              {is_open !== false ? 'ABIERTO AHORA' : 'CERRADO POR EL MOMENTO'}
            </div>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-800 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
              🚀 Pedidos directos a tu WhatsApp
            </div>
          </div>

          {/* Dirección, Horarios y Ubicación */}
          <div className="space-y-1.5 pt-1 text-xs text-gray-600">
            {direccion && (
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  <span className="truncate">{direccion}</span>
                </div>
                {urlMaps && urlMaps.trim() !== '' && (
                  <a
                    href={urlMaps}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-extrabold px-3.5 py-1.5 rounded-full text-[11px] flex items-center gap-1.5 border border-gray-200 shrink-0 active:scale-95 transition-all shadow-2xs"
                  >
                    <MapPin size={13} className="text-[#FF4B00]" />
                    <span>Ver ubicación</span>
                  </a>
                )}
              </div>
            )}
            {tieneHorarios && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-gray-400 shrink-0" />
                <span>{horarios}</span>
              </div>
            )}
          </div>
        </div>

        {/* Redes Sociales Activas */}
        {redesActivas.length > 0 && (
          <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-bold text-gray-400 mr-1 shrink-0">Síguenos:</span>
            {redesActivas.map((red, i) => (
              <a
                key={i}
                href={red.url}
                target="_blank"
                rel="noreferrer"
                title={red.label}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
              >
                {red.icon} {red.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-gray-200/80" />
    </div>
  )
}

