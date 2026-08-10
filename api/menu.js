import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null

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

  // 1. Intentar cargar info dinámica de Supabase
  if (supabase && trialId) {
    try {
      const { data, error } = await supabase
        .from('sb_businesses')
        .select('*')
        .eq('slug', trialId)
        .is('deleted_at', null)
        .single()
      
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

  // 2. Fallback a la base maestra de prospectos si no se encuentra en Supabase
  if (!foundBusiness && trialId) {
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

  const imageUrl = getAbsoluteUrl(logoPath)
  const ogUrl = `${baseUrl}/menu/${trialId}`

  let html = ''
  try {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html')
    html = fs.readFileSync(indexPath, 'utf8')
  } catch (err) {
    try {
      const indexPath = path.join(process.cwd(), 'index.html')
      html = fs.readFileSync(indexPath, 'utf8')
    } catch (e) {
      html = `<!DOCTYPE html><html lang="es"><head><title>${title}</title><meta property="og:title" content="${title}" /><meta property="og:description" content="${description}" /><meta property="og:image" content="${imageUrl}" /><meta property="og:url" content="${ogUrl}" /></head><body><div id="root"></div></body></html>`
    }
  }

  // Inject meta tags via replacement
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`)
  
  // SEO tags
  if (html.includes('name="description"')) {
    html = html.replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${description}" />`)
  } else {
    html = html.replace('</head>', `<meta name="description" content="${description}" />\n</head>`)
  }

  // OG tags
  html = html.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${title}" />`)
  html = html.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${description}" />`)
  html = html.replace(/<meta property="og:image" content=".*?" \/>/gi, `<meta property="og:image" content="${imageUrl}" />`)
  
  // Inject / update og:url
  if (html.includes('property="og:url"')) {
    html = html.replace(/<meta property="og:url" content=".*?" \/>/gi, `<meta property="og:url" content="${ogUrl}" />`)
  } else {
    html = html.replace('</head>', `<meta property="og:url" content="${ogUrl}" />\n</head>`)
  }

  // Twitter tags
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/gi, `<meta name="twitter:title" content="${title}" />`)
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/gi, `<meta name="twitter:description" content="${description}" />`)
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/gi, `<meta name="twitter:image" content="${imageUrl}" />`)

  // Inject canonical link
  if (html.includes('rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href=".*?" \/>/gi, `<link rel="canonical" href="${ogUrl}" />`)
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${ogUrl}" />\n</head>`)
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  return res.status(200).send(html)
}


