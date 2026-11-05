// Public installation metadata only. Access to the panel retains its existing login.
export default function handler(req, res) {
  const slug = typeof req.query.slug === 'string' ? req.query.slug : ''
  if (!/^[a-z0-9][a-z0-9-]{0,99}$/.test(slug)) return res.status(400).json({ error: 'Restaurante inválido' })
  const panel = `/panel/${slug}`
  res.setHeader('Content-Type', 'application/manifest+json')
  res.setHeader('Cache-Control', 'no-cache')
  return res.status(200).json({
    id: panel, name: 'Mi restaurante · StreetBoss', short_name: 'StreetBoss',
    description: 'Administra el menú de tu restaurante desde tu celular.',
    lang: 'es-MX', start_url: panel, scope: panel, display: 'standalone',
    background_color: '#0D0E12', theme_color: '#0D0E12',
    icons: [
      { src: '/brand/SB_APP_192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/SB_FAVICON_512x512_V01.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
    ]
  })
}
