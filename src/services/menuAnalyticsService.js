import { getSupabaseClient, isSupabaseConfigured } from '../supabase'

const EVENT_TYPES = new Set([
  'page_view',
  'cart_open',
  'whatsapp_click',
  'phone_click',
  'maps_click',
  'share_click',
  'order_created',
])

function randomKey(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}_${crypto.randomUUID()}`
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`
}

function getStoredKey(storage, key, prefix) {
  try {
    const existing = storage.getItem(key)
    if (existing) return existing
    const created = randomKey(prefix)
    storage.setItem(key, created)
    return created
  } catch {
    return randomKey(prefix)
  }
}

function resolveSource() {
  const params = new URLSearchParams(window.location.search)
  const campaignSource = params.get('utm_source')
  if (campaignSource) return campaignSource.slice(0, 60).toLowerCase()
  if (!document.referrer) return 'direct'
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, '')
    if (host.includes('google.')) return 'google'
    if (host.includes('facebook.') || host.includes('fb.')) return 'facebook'
    if (host.includes('instagram.')) return 'instagram'
    if (host.includes('whatsapp.')) return 'whatsapp'
    return host.slice(0, 60)
  } catch {
    return 'direct'
  }
}

function resolveIdentity(config = {}) {
  const slug = String(config.trialId || config.slug || '').trim().toLowerCase()
  const businessId = String(config.business_id || config.id || slug).trim()
  return { slug, businessId }
}

export async function trackMenuEvent(config, eventType, details = {}) {
  if (!isSupabaseConfigured || !EVENT_TYPES.has(eventType) || typeof window === 'undefined') return false
  const { slug, businessId } = resolveIdentity(config)
  if (!slug || !businessId) return false

  const visitorKey = getStoredKey(localStorage, 'sb_analytics_visitor', 'visitor')
  const sessionKey = getStoredKey(sessionStorage, `sb_analytics_session_${slug}`, 'session')
  const payload = {
    business_id: businessId,
    event_type: eventType,
    visitor_key: visitorKey.slice(0, 80),
    session_key: sessionKey.slice(0, 80),
    source: resolveSource(),
    path: window.location.pathname.slice(0, 180),
    product_id: details.productId ? String(details.productId).slice(0, 120) : null,
  }

  try {
    const { error } = await getSupabaseClient(slug).from('sb_menu_analytics_events').insert(payload)
    if (error) throw error
    return true
  } catch (error) {
    console.warn('[StreetBoss Analytics] Evento omitido:', error?.message || error)
    return false
  }
}

export async function getMenuAnalytics(businesses, days = 30) {
  if (!isSupabaseConfigured) return []
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const batches = await Promise.all((businesses || []).map(async business => {
    const slug = business.slug
    if (!slug || !business.business_id) return []
    const { data, error } = await getSupabaseClient(slug)
      .from('sb_menu_analytics_events')
      .select('business_id,event_type,visitor_key,session_key,source,created_at')
      .eq('business_id', business.business_id)
      .gte('created_at', since)
    if (error) throw error
    return data || []
  }))
  return batches.flat()
}
