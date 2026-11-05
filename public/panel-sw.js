// Network-only: never cache restaurant data, sessions or authenticated responses.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="es"><meta name="viewport" content="width=device-width,initial-scale=1"><title>StreetBoss</title><body style="background:#0d0e12;color:white;font:18px system-ui;padding:32px"><h1>Recupera tu conexión</h1><p>Necesitas internet para consultar y guardar los cambios de tu restaurante.</p><button onclick="location.reload()" style="padding:16px">Volver a intentar</button></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  )))
})
