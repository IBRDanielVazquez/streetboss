import fs from 'fs'
import path from 'path'

const DEMO_META_MAP = {
  'tacos-el-guero': { folder: 'tacos-el-guero', name: 'Tacos El Güero', foodType: 'Taquería · Tacos al Pastor y Especiales', logo: '/demos/tacos-el-guero/profile.png' },
  'burger-house': { folder: 'burger-house', name: 'Burger House', foodType: 'Burgers · Papas · Malteadas', logo: '/demos/burger-house/profile.png' },
  'pizza-house': { folder: 'pizza-house', name: 'Pizza House', foodType: 'Pizzas · Promos · Alitas', logo: '/demos/pizza-house/profile.png' },
  'cafe-central': { folder: 'cafe-central', name: 'Café Central', foodType: 'Café · Panadería · Brunch', logo: '/demos/cafe-central/profile.png' },
  'pollos-el-rey': { folder: 'pollos-el-rey', name: 'Pollos El Rey', foodType: 'Pollo rostizado · Carbón · Paquetes', logo: '/demos/pollos-el-rey/profile.png' },
  'parrilla-el-carbon': { folder: 'parrilla-el-carbon', name: 'Parrilla El Carbón', foodType: 'Cortes · Brasas · Carne asada', logo: '/demos/parrilla-el-carbon/profile.png' },
  'tortas-el-barrio': { folder: 'tortas-el-barrio', name: 'Tortas El Barrio', foodType: 'Tortas mexicanas · Combos', logo: '/demos/tortas-el-barrio/profile.png' },
  'birrieria-jalisco': { folder: 'birrieria-jalisco', name: 'Birriería Jalisco', foodType: 'Birria · Consomé · Quesabirrias', logo: '/demos/birrieria-jalisco/profile.png' },
  'mariscos-el-puerto': { folder: 'mariscos-el-puerto', name: 'Mariscos El Puerto', foodType: 'Camarones · Ceviches · Aguachiles', logo: '/demos/mariscos-el-puerto/profile.png' },
  'china-express': { folder: 'china-express', name: 'China Express', foodType: 'Arroz frito · Noodles · Pollo agridulce', logo: '/demos/china-express/profile.png' },
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

function resolveDemo(trialId) {
  const s = (trialId || '').toLowerCase()
  let key = 'tacos-el-guero'
  if (s.includes('burger')) key = 'burger-house'
  else if (s.includes('pizza')) key = 'pizza-house'
  else if (s.includes('cafe') || s.includes('central')) key = 'cafe-central'
  else if (s.includes('pollo') || s.includes('rey')) key = 'pollos-el-rey'
  else if (s.includes('parrilla') || s.includes('carbon')) key = 'parrilla-el-carbon'
  else if (s.includes('torta') || s.includes('barrio')) key = 'tortas-el-barrio'
  else if (s.includes('birria') || s.includes('jalisco')) key = 'birrieria-jalisco'
  else if (s.includes('marisco') || s.includes('puerto')) key = 'mariscos-el-puerto'
  else if (s.includes('china') || s.includes('express')) key = 'china-express'
  else if (s.includes('guero') || s.includes('ejmpleo-2')) key = 'tacos-el-guero'

  return DEMO_META_MAP[key]
}

export default function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'streetboss.com.mx'
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const baseUrl = `${protocol}://${host}`

  const urlPath = req.url || ''
  const parts = urlPath.split('?')[0].split('/')
  const trialId = parts[2] || 'tacos-el-guero'

  const demo = resolveDemo(trialId)
  let title = `${demo.name} — Menú Digital`
  let description = `${demo.foodType}. 📍 Tuxtla Gutiérrez, Chiapas. Haz tu pedido al instante por WhatsApp sin comisiones.`
  let logoPath = demo.logo

  // Intento de cargar info dinámica de la base maestra de prospectos
  try {
    const masterPath = path.join(process.cwd(), 'src', 'data', 'master_prospects.json')
    if (fs.existsSync(masterPath)) {
      const masterProspects = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
      const norm = String(trialId || '').toLowerCase().trim()
      const found = masterProspects.find(p => {
        if (p.id === norm || `biz_${p.id}` === norm || `demo_custom_${p.id}` === norm) return true
        const pSlug = slugify(p.business_name)
        if (pSlug && (pSlug === norm || norm.includes(pSlug) || pSlug.includes(norm))) return true
        return false
      })
      if (found) {
        title = `${found.business_name} — Menú Digital`
        description = `Menú digital oficial de ${found.business_name}. Pedidos al instante por WhatsApp sin comisiones.`
        if (found.logo_url && !found.logo_url.includes('SB_FAVICON')) {
          logoPath = found.logo_url
        }
      }
    }
  } catch (err) {}

  const imageUrl = logoPath.startsWith('http') 
    ? logoPath 
    : `${baseUrl}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`

  let html = ''
  try {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html')
    html = fs.readFileSync(indexPath, 'utf8')
  } catch (err) {
    try {
      const indexPath = path.join(process.cwd(), 'index.html')
      html = fs.readFileSync(indexPath, 'utf8')
    } catch (e) {
      html = `<!DOCTYPE html><html lang="es"><head><title>${title}</title><meta property="og:title" content="${title}" /><meta property="og:description" content="${description}" /><meta property="og:image" content="${imageUrl}" /></head><body><div id="root"></div></body></html>`
    }
  }

  html = html.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`)
  html = html.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${title}" />`)
  html = html.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${description}" />`)
  html = html.replace(/<meta property="og:image" content=".*?" \/>/gi, `<meta property="og:image" content="${imageUrl}" />`)
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/gi, `<meta name="twitter:title" content="${title}" />`)
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/gi, `<meta name="twitter:description" content="${description}" />`)
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/gi, `<meta name="twitter:image" content="${imageUrl}" />`)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  return res.status(200).send(html)
}

