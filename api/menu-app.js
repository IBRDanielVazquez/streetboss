import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'

// Manifest and square icon are isolated by restaurant slug.
// No service worker or caching of private orders is used.
const SITE = 'https://streetboss.com.mx'
const DEMOS = {
  'tacos-el-guero': 'Tacos El Güero',
  'burger-house': 'Burger House',
  'pizza-house': 'Pizza House',
  'cafe-central': 'Café Central',
  'pollos-el-rey': 'Pollos El Rey',
  'parrilla-el-carbon': 'Parrilla El Carbón',
  'tortas-el-barrio': 'Tortas El Barrio',
  'birrieria-jalisco': 'Birriería Jalisco',
  'mariscos-el-puerto': 'Mariscos El Puerto',
  'china-express': 'China Express',
}
const url = process.env.VITE_SUPABASE_URL || ''
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const db = url && anonKey ? createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
}) : null

function safePath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return ''
  const path = value.split('?')[0]
  if (path.includes('..') || path.includes('\\') || /[<>\u0000-\u001f]/.test(path)) return ''
  return path
}

async function details(slug) {
  if (slug === 'streetboss') return { name: 'StreetBoss', logo: '/brand/SB_FAVICON_512x512_V01.png' }
  if (slug === 'la-vitola') return {
    name: 'La Vitola', logo: '/la-vitola/icon-512.png',
  }
  if (db) {
    try {
      const { data } = await db.from('sb_businesses')
        .select('name,logo_url').eq('slug', slug).is('deleted_at', null).maybeSingle()
      if (data?.name) return { name: String(data.name).slice(0, 70), logo: data.logo_url || '' }
    } catch (error) {
      console.error('menu app metadata', error?.message)
    }
  }
  if (DEMOS[slug]) return { name: DEMOS[slug], logo: `/demos/${slug}/profile.png` }
  return null
}

function imageLocation(value) {
  const local = safePath(value)
  if (local) return SITE + local
  try {
    const target = new URL(value)
    const allowed = url ? new URL(url).hostname : ''
    // Trust only our own public Supabase Storage, never arbitrary URL requests.
    if (target.protocol === 'https:' && target.hostname === allowed
        && target.pathname.startsWith('/storage/v1/object/public/')) return target.href
  } catch {}
  return SITE + '/brand/SB_FAVICON_512x512_V01.png'
}

async function pngIcon(logo, size) {
  const destination = imageLocation(logo)
  try {
    const timeout = AbortSignal.timeout(6500)
    const response = await fetch(destination, { signal: timeout })
    if (!response.ok) throw new Error('Logo unavailable')
    const contentLength = Number(response.headers.get('content-length') || 0)
    if (contentLength > 4_000_000) throw new Error('Logo too large')
    const source = Buffer.from(await response.arrayBuffer())
    if (source.length > 4_000_000) throw new Error('Logo too large')
    return await sharp(source, { limitInputPixels: 10_000_000 })
      .resize(size, size, { fit: 'contain', background: '#0D0E12' })
      .png().toBuffer()
  } catch {
    // Always provide an image of the correct dimensions even if a logo is unavailable.
    const fallback = await fetch(SITE + '/brand/SB_FAVICON_512x512_V01.png')
    if (!fallback.ok) throw new Error('Fallback icon unavailable')
    return sharp(Buffer.from(await fallback.arrayBuffer()))
      .resize(size, size, { fit: 'contain', background: '#0D0E12' })
      .png().toBuffer()
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const slug = typeof req.query.slug === 'string' ? req.query.slug : ''
  if (!/^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$/.test(slug)) {
    return res.status(400).json({ error: 'Menú no válido' })
  }
  // StreetBoss uses this endpoint exclusively for its 192px brand icon.
  if (slug === 'streetboss' && req.query.asset !== 'icon') {
    return res.status(404).json({ error: 'Menú no encontrado' })
  }
  const business = await details(slug)
  if (!business) return res.status(404).json({ error: 'Menú no encontrado' })

  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300')
  if (req.query.asset === 'icon') {
    const size = Number(req.query.size)
    if (size !== 192 && size !== 512) return res.status(400).end()
    try {
      const file = await pngIcon(business.logo, size)
      res.setHeader('Content-Type', 'image/png')
      return res.status(200).send(file)
    } catch {
      return res.status(503).end()
    }
  }

  const start = `/menu/${slug}`
  const icons = [192, 512].map(size => ({
    src: `/api/menu-app?slug=${slug}&asset=icon&size=${size}`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'any',
  }))
  const manifest = {
    id: start,
    name: business.name,
    short_name: business.name.slice(0, 24),
    description: `Menú digital de ${business.name}, pedidos directos por WhatsApp.`,
    start_url: start,
    scope: start,
    display: 'standalone',
    background_color: '#0D0E12',
    theme_color: '#FF4B00',
    orientation: 'portrait',
    lang: 'es-MX',
    icons,
  }
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8')
  return res.status(200).json(manifest)
}
