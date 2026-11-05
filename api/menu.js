import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const scopedClients = new Map()

const DEMO_SOCIAL_PROFILES = {
  'tacos-el-guero': { clave: 'guero', name: 'Tacos El Güero', description: 'Tacos · Quesadillas · Bebidas' },
  'burger-house': { clave: 'burger', name: 'Burger House', description: 'Burgers · Papas · Malteadas' },
  'la-vitola': { clave: 'vitola', name: 'La Vitola', description: 'Hamburguesas artesanales · Hot dogs · Bebidas' },
  'pizza-house': { clave: 'pizza', name: 'Pizza House', description: 'Pizza · Promos · Alitas' },
  'cafe-central': { clave: 'cafe', name: 'Café Central', description: 'Café · Panadería · Brunch' },
  'pollos-el-rey': { clave: 'rey', name: 'Pollos El Rey', description: 'Pollo rostizado · Carbón · Paquetes' },
  'parrilla-el-carbon': { clave: 'carbon', name: 'Parrilla El Carbón', description: 'Cortes · Brasas · Carne asada' },
  'tortas-el-barrio': { clave: 'tortas', name: 'Tortas El Barrio', description: 'Tortas mexicanas · Combos' },
  'birrieria-jalisco': { clave: 'birria', name: 'Birriería Jalisco', description: 'Birria · Consomé · Quesabirrias' },
  'mariscos-el-puerto': { clave: 'puerto', name: 'Mariscos El Puerto', description: 'Camarones · Ceviches · Aguachiles' },
  'china-express': { clave: 'china', name: 'China Express', description: 'Arroz frito · Noodles · Pollo agridulce' },
}

function getScopedSupabase(scope) {
  if (!supabaseUrl || !supabaseAnonKey) return null
  const normalizedScope = String(scope || '').trim().toLowerCase()
  if (scopedClients.has(normalizedScope)) return scopedClients.get(normalizedScope)

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { 'x-client-slug': normalizedScope } },
  })
  scopedClients.set(normalizedScope, client)
  return client
}

function findDemoProfile(trialId) {
  const normalized = String(trialId || '').trim().toLowerCase()
  const match = Object.entries(DEMO_SOCIAL_PROFILES).find(([id, demo]) =>
    normalized === id ||
    normalized === `${id}-${demo.clave}-2026` ||
    normalized.startsWith(`${id}-`)
  )
  if (!match) return null
  const [id, demo] = match
  return { ...demo, id, logo_url: `/demos/${id}/profile.png` }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 45)
}

export default async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'streetboss.com.mx'
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const baseUrl = `${protocol}://${host}`

  const urlPath = req.url || ''
  const parts = urlPath.split('?')[0].split('/')
  const trialId = parts[2] || ''

  let title = 'StreetBoss — Tu menú digital, tus ganancias'
  let description = 'Recibe pedidos directo a WhatsApp, calcula envíos y vende sin comisiones por venta.'
  let logoPath = '/brand/SB_FAVICON_512x512_V01.png'
  let bannerPath = '/brand/StreetBoss_Logo_Horizontal_Oficial.webp'

  let foundBusiness = null
  const demoProfile = findDemoProfile(trialId)

  // 1. Intentar cargar info dinámica de Supabase
  const supabase = getScopedSupabase(trialId)
  if (supabase && trialId) {
    try {
      const { data, error } = await supabase
        .from('sb_businesses')
        .select('*')
        .or(`slug.eq.${trialId},business_id.eq.${trialId}`)
        .is('deleted_at', null)
        .maybeSingle()
      
      if (data && !error) {
        foundBusiness = data
        title = `${data.name} — Menú Digital`
        description = data.description || data.main_message || `Menú digital oficial de ${data.name}. Haz tu pedido al instante por WhatsApp sin comisiones.`
        if (data.logo_url) logoPath = data.logo_url
        if (data.banner_url) bannerPath = data.banner_url
      }
    } catch (err) {
      console.error('[API Menu Supabase Error]', err)
    }
  }

  // 2. Cada demo oficial usa su propia foto de perfil en la vista al compartir.
  if (!foundBusiness && demoProfile) {
    title = `${demoProfile.name} — Menú Digital`
    description = demoProfile.description
    logoPath = demoProfile.logo_url
  }

  // 3. Fallback a la base maestra de prospectos si no se encuentra en Supabase
  if (!foundBusiness && !demoProfile && trialId) {
    try {
      const masterPath = path.join(process.cwd(), 'src', 'data', 'master_prospects.json')
      if (fs.existsSync(masterPath)) {
        const masterProspects = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
        const norm = String(trialId).toLowerCase().trim()
        const found = masterProspects.find(p => {
          if (p.id === norm || `biz_${p.id}` === norm || `demo_custom_${p.id}` === norm) return true
          const pSlug = slugify(p.business_name)
          if (pSlug && (pSlug === norm || norm.includes(pSlug) || pSlug.includes(norm))) return true
          return false
        })
        if (found) {
          title = `${found.business_name} — Menú Digital`
          description = `Menú digital oficial de ${found.business_name}. Haz tu pedido al instante por WhatsApp sin comisiones.`
          if (found.logo_url && !found.logo_url.includes('SB_FAVICON')) {
            logoPath = found.logo_url
          }
        }
      }
    } catch (err) {}
  }

  // Ensure absolute URLs for social sharing crawlers
  const getAbsoluteUrl = (p) => {
    if (!p) return ''
    if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) return p
    return `${baseUrl}${p.startsWith('/') ? '' : '/'}${p}`
  }

  const rawImageUrl = getAbsoluteUrl(logoPath)
  const imageVersion = foundBusiness?.updated_at || (demoProfile ? `${demoProfile.id}-profile-v2` : 'streetboss-v2')
  const imageUrl = rawImageUrl.startsWith('data:')
    ? rawImageUrl
    : `${rawImageUrl}${rawImageUrl.includes('?') ? '&' : '?'}v=${encodeURIComponent(imageVersion)}`
  const ogUrl = `${baseUrl}/menu/${trialId}`
  const safeTitle = escapeHtml(title)
  const safeDescription = escapeHtml(description)
  const safeImageUrl = escapeHtml(imageUrl)
  const safeOgUrl = escapeHtml(ogUrl)

  let html = ''
  try {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html')
    html = fs.readFileSync(indexPath, 'utf8')
  } catch (err) {
    try {
      const indexPath = path.join(process.cwd(), 'index.html')
      html = fs.readFileSync(indexPath, 'utf8')
    } catch (e) {
      html = `<!DOCTYPE html><html lang="es"><head><title>${safeTitle}</title><meta property="og:title" content="${safeTitle}" /><meta property="og:description" content="${safeDescription}" /><meta property="og:image" content="${safeImageUrl}" /><meta property="og:url" content="${safeOgUrl}" /></head><body><div id="root"></div></body></html>`
    }
  }

  // Inject meta tags via replacement
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${safeTitle}</title>`)
  
  // SEO tags
  if (html.includes('name="description"')) {
    html = html.replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${safeDescription}" />`)
  } else {
    html = html.replace('</head>', `<meta name="description" content="${safeDescription}" />\n</head>`)
  }

  // OG tags
  html = html.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${safeTitle}" />`)
  html = html.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${safeDescription}" />`)
  html = html.replace(/<meta property="og:image" content=".*?" \/>/gi, `<meta property="og:image" content="${safeImageUrl}" />`)
  
  // Inject / update og:url
  if (html.includes('property="og:url"')) {
    html = html.replace(/<meta property="og:url" content=".*?" \/>/gi, `<meta property="og:url" content="${safeOgUrl}" />`)
  } else {
    html = html.replace('</head>', `<meta property="og:url" content="${safeOgUrl}" />\n</head>`)
  }

  // Twitter tags
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/gi, `<meta name="twitter:title" content="${safeTitle}" />`)
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/gi, `<meta name="twitter:description" content="${safeDescription}" />`)
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/gi, `<meta name="twitter:image" content="${safeImageUrl}" />`)

  // Inject canonical link
  if (html.includes('rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href=".*?" \/>/gi, `<link rel="canonical" href="${safeOgUrl}" />`)
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${safeOgUrl}" />\n</head>`)
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  return res.status(200).send(html)
}
