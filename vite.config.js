import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import panelManifest from './api/panel-manifest.js'

// Mirror the Vercel manifest endpoint in the local preview.
const panelManifestPreview = {
  name: 'panel-manifest-preview',
  configureServer(server) {
    server.middlewares.use('/api/panel-manifest', (req, res) => {
      req.query = Object.fromEntries(new URL(req.url, 'http://localhost').searchParams)
      res.status = code => { res.statusCode = code; return res }
      res.json = value => res.end(JSON.stringify(value))
      panelManifest(req, res)
    })
    server.middlewares.use('/panel-sw.js', (_req, res, next) => {
      res.setHeader('Service-Worker-Allowed', '/panel/')
      res.setHeader('Cache-Control', 'no-store')
      next()
    })
  }
}
export default defineConfig({ plugins: [react(), panelManifestPreview] })
