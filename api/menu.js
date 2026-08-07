import fs from 'fs'
import path from 'path'

const DEMO_META_MAP = {
  'tacos-el-guero': { folder: 'tacos-el-guero', name: 'Tacos El Güero', foodType: 'Taquería · Tacos al Pastor y Especiales' },
  'burger-house': { folder: 'burger-house', name: 'Burger House', foodType: 'Burgers · Papas · Malteadas' },
  'pizza-house': { folder: 'pizza-house', name: 'Pizza House', foodType: 'Pizzas · Promos · Alitas' },
  'cafe-central': { folder: 'cafe-central', name: 'Café Central', foodType: 'Café · Panadería · Brunch' },
  'pollos-el-rey': { folder: 'pollos-el-rey', name: 'Pollos El Rey', foodType: 'Pollo rostizado · Carbón · Paquetes' },
  'parrilla-el-carbon': { folder: 'parrilla-el-carbon', name: 'Parrilla El Carbón', foodType: 'Cortes · Brasas · Carne asada' },
  'tortas-el-barrio': { folder: 'tortas-el-barrio', name: 'Tortas El Barrio', foodType: 'Tortas mexicanas · Combos' },
  'birrieria-jalisco': { folder: 'birrieria-jalisco', name: 'Birriería Jalisco', foodType: 'Birria · Consomé · Quesabirrias' },
  'mariscos-el-puerto': { folder: 'mariscos-el-puerto', name: 'Mariscos El Puerto', foodType: 'Camarones · Ceviches · Aguachiles' },
  'china-express': { folder: 'china-express', name: 'China Express', foodType: 'Arroz frito · Noodles · Pollo agridulce' },
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
  const title = `${demo.name} — Menú Digital`
  const description = `${demo.foodType}. 📍 Tuxtla Gutiérrez, Chiapas. Haz tu pedido al instante por WhatsApp sin comisiones.`
  const imageUrl = `${baseUrl}/demos/${demo.folder}/profile.png`

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
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  return res.status(200).send(html)
}
