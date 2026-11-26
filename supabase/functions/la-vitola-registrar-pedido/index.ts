import { createClient } from 'npm:@supabase/supabase-js@2.105.4'

const ORIGIN = 'https://streetboss.com.mx'
const URL = Deno.env.get('SUPABASE_URL')
const SECRET = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const api = URL && SECRET ? createClient(URL, SECRET, { auth: { persistSession: false, autoRefreshToken: false } }) : null
const cors = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Vary': 'Origin',
  'Cache-Control': 'no-store',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  })
}
function err(message: string, status = 400) { return json({ ok: false, error: message }, status) }
function amount(value: number) { return Math.round((value + Number.EPSILON) * 100) / 100 }

Deno.serve(async request => {
  const origin = request.headers.get('origin')
  if (origin !== ORIGIN) return err('Origen no autorizado', 403)
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (request.method !== 'POST') return err('Método no permitido', 405)
  if (!api) return err('Servicio no disponible', 503)
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json'))
    return err('Formato inválido', 415)
  if (Number(request.headers.get('content-length') || 0) > 14000) return err('Solicitud demasiado grande', 413)

  try {
    const raw = await request.text()
    if (raw.length > 14000) return err('Solicitud demasiado grande', 413)
    const body = JSON.parse(raw)
    const externalId = String(body.externalId || '')
    const name = String(body.name || '').trim().replace(/\s+/g, ' ').slice(0, 120)
    const phone = String(body.phone || '').replace(/\D/g, '')
    const delivery = body.delivery === true
    const deliveryZoneName = delivery ? String(body.colonia || '').trim().slice(0,100) : ''
    const items = body.items
    const marketing = body.marketingConsent === true

    if (!/^[a-f0-9-]{36}$/i.test(externalId) ||
        !/^[-a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9 .']{2,120}$/.test(name) ||
        !/^\d{10}$/.test(phone) ||
        !Array.isArray(items) || items.length < 1 || items.length > 30) {
      return err('Revisa el nombre, teléfono o productos.', 400)
    }

    const { data: existing } = await api.from('sb_vitola_requests').select('id,subtotal').eq('external_id', externalId).maybeSingle()
    if (existing) return json({ ok: true, id: existing.id, subtotal: existing.subtotal, status: 'solicitud' })

    const { data: recent } = await api.from('sb_vitola_requests')
      .select('id').eq('customer_phone', phone)
      .gte('requested_at', new Date(Date.now() - 20000).toISOString()).limit(1)
    if (recent?.length) return err('Ya registramos una solicitud reciente. Espera un momento antes de repetirla.', 429)

    const { data: catalog, error: catalogError } = await api.from('sb_vitola_catalog').select('published')
      .eq('slug', 'la-vitola').single()
    if (catalogError || !catalog) return err('No se pudo validar el catálogo.', 503)
    const products = new Map((catalog.published.productos || []).map((p: any) => [p.id, p]))
    const deliveryConfig = catalog.published.entregas || {}
    const availableZones = (Array.isArray(deliveryConfig.zonas) ? deliveryConfig.zonas : [])
      .map((z: any) => typeof z === 'string' ? { nombre: z, costo: null } : z)
      .filter((z: any) => z && typeof z.nombre === 'string')
    let shippingFee: number | null = null
    if (delivery) {
      if (!deliveryConfig.activo) return err('El servicio a domicilio no está disponible.', 409)
      if (availableZones.length) {
        const selected: any = availableZones.find((z: any) => z.nombre === deliveryZoneName)
        if (!selected) return err('La colonia seleccionada no tiene cobertura. Actualiza el menú.', 409)
        if (selected.costo !== null && selected.costo !== undefined && selected.costo !== '') {
          const parsed = Number(selected.costo)
          if (!Number.isFinite(parsed) || parsed < 0 || parsed > 10000)
            return err('Tarifa de envío no válida.', 503)
          shippingFee = amount(parsed)
        }
      }
    }
    const safeItems: any[] = []
    let subtotal = 0
    let count = 0

    for (const line of items) {
      if (!line || typeof line !== 'object') return err('Artículo no válido.')
      const product: any = products.get(String(line.id || ''))
      const qty = line.qty
      if (!product || product.categoria === 'extras' || product.activo === false ||
          product.agotado === true || product.oculto === true ||
          !Number.isInteger(qty) || qty < 1 || qty > 20) return err('Uno de tus artículos está agotado o no es válido.', 409)
      count += qty
      if (count > 50) return err('Se superó el límite de artículos.', 400)
      const addonsRequested = line.addons ?? []
      if (!Array.isArray(addonsRequested) || addonsRequested.length > 12 ||
          addonsRequested.length !== new Set(addonsRequested).size ||
          (addonsRequested.length && product.categoria !== 'hamburguesas')) return err('Los extras seleccionados no son válidos.', 400)

      let unitPrice = Number(product.precio)
      if (!Number.isFinite(unitPrice) || unitPrice < 0) return err('Precio no disponible.', 503)
      const addons: any[] = []
      for (const key of addonsRequested) {
        const addon: any = products.get(String(key))
        if (!addon || addon.categoria !== 'extras' || addon.activo === false || addon.agotado === true ||
            addon.oculto === true || !Number.isFinite(Number(addon.precio))) return err('Extra no disponible.', 409)
        const extraPrice = Number(addon.precio)
        unitPrice += extraPrice
        addons.push({ id: addon.id, nombre: String(addon.nombre).slice(0, 100), precio: amount(extraPrice) })
      }
      const lineTotal = amount(amount(unitPrice) * qty)
      subtotal += lineTotal
      safeItems.push({ id: product.id, nombre: String(product.nombre).slice(0, 120),
        qty, unitPrice: amount(unitPrice), addons, total: lineTotal })
    }

    subtotal = amount(subtotal)
    if (subtotal > 100000) return err('El importe supera el límite permitido.', 400)
    const { data, error } = await api.from('sb_vitola_requests').insert({
      external_id: externalId,
      customer_name: name,
      customer_phone: phone,
      delivery_type: delivery ? 'domicilio' : 'recoger',
      delivery_zone: deliveryZoneName || null,
      delivery_fee: shippingFee,
      items: safeItems,
      subtotal,
      status: 'solicitud',
      marketing_opt_in: marketing,
      marketing_opt_in_at: marketing ? new Date().toISOString() : null,
    }).select('id,requested_at,subtotal').single()
    if (error) {
      console.error('vitola-register', error.code)
      return err('No se pudo guardar la solicitud.', 503)
    }
    return json({ ok: true, id: data.id, requestedAt: data.requested_at, subtotal: data.subtotal, deliveryFee: shippingFee, totalEstimate: shippingFee === null ? null : amount(subtotal + shippingFee), status: 'solicitud' })
  } catch (error) {
    console.error('vitola-register', error instanceof Error ? error.message : 'failed')
    return err('No se pudo procesar la solicitud.', 400)
  }
})
