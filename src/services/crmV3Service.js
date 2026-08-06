import { supabase } from '../supabase'
import { DEMO_FIXTURES, DEMO_CONTACTS } from '../data/demoFixtures'
import { DEMOS_OFICIALES, DEMO_SHOWCASE } from '../data/demoShowcase'

// Key constants for local reactive persistence fallback
const STORAGE_KEYS = {
  BUSINESSES: 'sb_v3_businesses',
  CATEGORIES: 'sb_v3_categories',
  PRODUCTS: 'sb_v3_products',
  DELIVERY_ZONES: 'sb_v3_delivery_zones',
  PROSPECTS: 'sb_v3_prospects',
  AUDIT: 'sb_v3_audit',
  CUSTOMERS: 'sb_v3_business_customers',
  ORDERS: 'sb_v3_orders',
}

// Helper: Normalizador de teléfono de México (10 dígitos limpios)
export function normalizeMexicanPhone(phone) {
  let digits = String(phone || '').replace(/\D/g, '')
  if (digits.startsWith('52') && digits.length === 12) {
    digits = digits.slice(2)
  } else if (digits.startsWith('1') && digits.length === 11) {
    digits = digits.slice(1)
  }
  return digits.slice(-10)
}

// Helper: Generador de contraseña segura
export function generateSecurePassword() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower = 'abcdefghijkmnpqrstuvwxyz'
  const nums = '23456789'
  const spec = '!@#$%&*'
  
  const getRandomChar = str => str[Math.floor(Math.random() * str.length)]
  
  let pass = [
    getRandomChar(upper),
    getRandomChar(lower),
    getRandomChar(nums),
    getRandomChar(spec)
  ]
  const all = upper + lower + nums + spec
  for (let i = 0; i < 6; i++) {
    pass.push(getRandomChar(all))
  }
  return pass.sort(() => Math.random() - 0.5).join('')
}

// Helper: Slugify
export function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 45)
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION / SEEDING
// ─────────────────────────────────────────────────────────────────────────────
// Central BroadcastChannel for instant cross-session sync
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window ? new BroadcastChannel('sb_central_bus') : null;

function notifyCentralSync(event, payload = {}) {
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: event, payload, timestamp: Date.now() });
    } catch (e) {}
  }
}

export function subscribeCentralSync(callback) {
  if (!syncChannel) return () => {};
  const handler = (e) => callback(e.data);
  syncChannel.addEventListener('message', handler);
  return () => syncChannel.removeEventListener('message', handler);
}

function initLocalStore() {
  let localBusinesses = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || 'null')
  if (!localBusinesses || localBusinesses.length === 0) {
    const seededBusinesses = DEMO_SHOWCASE.map(demo => ({
      id: demo.id,
      business_id: demo.id,
      name: demo.nombre || demo.name,
      slug: demo.id,
      business_type: demo.giro || demo.badge || 'Restaurante',
      is_demo: true,
      demo_status: 'Activo',
      status: 'activo',
      template_version: '3.0',
      owner_name: 'Demostración Oficial',
      phone: DEMO_CONTACTS.DEFAULT_PHONE,
      whatsapp: DEMO_CONTACTS.DEFAULT_WHATSAPP,
      email: `demo.${demo.clave || demo.id}@streetboss.com.mx`,
      address: 'Tuxtla Gutiérrez, Chiapas',
      city: 'Tuxtla Gutiérrez',
      state: 'Chiapas',
      banner_url: demo.banner_url || `/demos/${demo.id}/cover.jpg`,
      logo_url: demo.logo_url || `/demos/${demo.id}/profile.png`,
      brand_color: '#FF4B00',
      description: `Demostración oficial de ${demo.nombre || demo.name} en StreetBoss.`,
      schedule_text: 'Lun a Dom · 9:00 am – 10:00 pm',
      is_open: true,
      has_delivery: true,
      delivery_mode: 'fijo',
      base_delivery_fee: 30,
      temp_password: '', // REQUERIMIENTO 10: No se generan contraseñas automáticamente
      payment_methods: {
        efectivo: { activo: true, preguntar_cambio: true, limite_cambio_activo: false, max_cambio_monto: 500 },
        transferencia: {
          activo: true,
          titular: `${demo.nombre || demo.name || 'Negocio Demo'} S.A. de C.V.`,
          banco: 'BBVA Bancomer / Banorte',
          clabe: '012180000123456789',
          numero_cuenta: '4152 3130 0000 1234',
          instrucciones: 'Por favor realiza tu transferencia SPEI incluyendo tu nombre o número de pedido en el concepto.',
          texto_solicitar_comprobante: 'Realiza tu transferencia y adjunta la captura del comprobante cuando envíes tu pedido por WhatsApp.'
        },
        tarjeta: {
          activo: true,
          instrucciones: 'Se aceptan tarjetas de crédito y débito Visa, MasterCard y Amex. El pago se realiza al momento de la entrega.',
          compra_minima: 0
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const seededCategories = []
    const seededProducts = []

    DEMOS_OFICIALES.forEach(demo => {
      demo.menu.forEach((cat, cIdx) => {
        const catId = `cat_${demo.id}_${cIdx}`
        seededCategories.push({
          id: catId,
          business_id: demo.id,
          name: cat.nombre,
          category_type: cat.tipo || 'normal',
          is_plus: cat.esPlus || false,
          is_visible: true,
          position: cIdx,
          created_at: new Date().toISOString(),
        })

        cat.productos.forEach((prod, pIdx) => {
          seededProducts.push({
            id: `prod_${demo.id}_${cIdx}_${pIdx}`,
            business_id: demo.id,
            category_id: catId,
            name: prod.nombre,
            price: prod.precio,
            description: prod.descripcion || '',
            image_url: prod.foto || '',
            is_out_of_stock: prod.agotado || false,
            is_active: prod.activo !== false,
            is_featured: pIdx === 0,
            is_promo: false,
            position: pIdx,
            created_at: new Date().toISOString(),
          })
        })
      })
    })

    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(seededBusinesses))
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(seededCategories))
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(seededProducts))
    localStorage.setItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.PROSPECTS, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify([]))
  } else {
    // Sincronizar automáticamente imágenes, datos bancarios y nombres oficiales de los 10 demos si existía caché antiguo
    let updated = false
    const refreshedBusinesses = localBusinesses.map(b => {
      if (b.is_demo) {
        const official = DEMO_SHOWCASE.find(d => d.id === b.id || d.id === b.business_id || d.id === b.slug)
        const bName = official?.nombre || official?.name || b.name || 'Negocio Demo'
        const existingTrans = b.payment_methods?.transferencia || {}
        
        updated = true
        return {
          ...b,
          name: bName,
          phone: DEMO_CONTACTS.DEFAULT_PHONE,
          whatsapp: DEMO_CONTACTS.DEFAULT_WHATSAPP,
          business_type: official?.giro || official?.badge || b.business_type,
          banner_url: official?.banner_url || `/demos/${official?.id || b.id}/cover.jpg`,
          logo_url: official?.logo_url || `/demos/${official?.id || b.id}/profile.png`,
          payment_methods: {
            efectivo: { activo: true, preguntar_cambio: true, limite_cambio_activo: false, max_cambio_monto: 500, ...(b.payment_methods?.efectivo || {}) },
            transferencia: {
              activo: true,
              titular: existingTrans.titular || `${bName} S.A. de C.V.`,
              banco: existingTrans.banco || 'BBVA Bancomer / Banorte',
              clabe: existingTrans.clabe || '012180000123456789',
              numero_cuenta: existingTrans.numero_cuenta || '4152 3130 0000 1234',
              instrucciones: existingTrans.instrucciones || 'Por favor realiza tu transferencia SPEI incluyendo tu nombre o número de pedido en el concepto.',
              texto_solicitar_comprobante: existingTrans.texto_solicitar_comprobante || 'Realiza tu transferencia y adjunta la captura del comprobante cuando envíes tu pedido por WhatsApp.'
            },
            tarjeta: { activo: true, instrucciones: 'Se aceptan tarjetas de crédito y débito Visa, MasterCard y Amex. El pago se realiza al momento de la entrega.', compra_minima: 0, ...(b.payment_methods?.tarjeta || {}) }
          }
        }
      }
      return b
    })
    if (updated) {
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(refreshedBusinesses))
    }
  }
}

// FASE 4 & REQUERIMIENTO 10: Migrar datos sin asignar contraseñas automáticas
const MIGRATION_VERSION_KEY = 'sb_v3_migration_version'
const CURRENT_MIGRATION_VERSION = 3

function migrateExistingData() {
  const currentVersion = Number(localStorage.getItem(MIGRATION_VERSION_KEY) || '0')
  if (currentVersion >= CURRENT_MIGRATION_VERSION) return

  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  let changed = false

  bList.forEach(b => {
    // Migrar banner_url de path viejo a nuevo
    if (b.banner_url && b.banner_url.includes('/demos/img/')) {
      b.banner_url = `/demos/${b.slug || b.id}/cover.jpg`
      changed = true
    }
    if (!b.banner_url) {
      b.banner_url = `/demos/${b.slug || b.id}/cover.jpg`
      changed = true
    }

    // Migrar logo_url
    if (!b.logo_url || b.logo_url.includes('/brand/SB_FAVICON')) {
      b.logo_url = `/demos/${b.slug || b.id}/profile.png`
      changed = true
    }

    // Inyectar payment_methods por defecto si no existen
    if (!b.payment_methods) {
      b.payment_methods = {
        efectivo: { activo: true, preguntar_cambio: true, limite_cambio_activo: false, max_cambio_monto: 500 },
        transferencia: { activo: false, titular: '', banco: '', clabe: '', numero_cuenta: '' },
        tarjeta: { activo: false, instrucciones: '', compra_minima: 0 }
      }
      changed = true
    }
  })

  if (changed) {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(bList))
  }
  localStorage.setItem(MIGRATION_VERSION_KEY, String(CURRENT_MIGRATION_VERSION))
}

initLocalStore()
migrateExistingData()

// ─────────────────────────────────────────────────────────────────────────────
// DEMOS ENGINE
// ─────────────────────────────────────────────────────────────────────────────
export function getDemos() {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const cList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]')
  const pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]')

  const demos = bList.filter(b => b.is_demo && !b.deleted_at)
  return demos.map(demo => {
    const categories = cList.filter(c => c.business_id === demo.business_id)
    const products = pList.filter(p => p.business_id === demo.business_id)
    return {
      ...demo,
      categories_count: categories.length,
      products_count: products.length,
      categories,
      products,
    }
  })
}

export function updateDemoStatus(demoId, newStatus) {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const idx = bList.findIndex(b => b.business_id === demoId || b.id === demoId)
  if (idx !== -1) {
    bList[idx].demo_status = newStatus
    bList[idx].updated_at = new Date().toISOString()
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(bList))
    logAuditAction('cambiar_permisos', demoId, { demoStatus: newStatus })
  }
}

export function deleteDemo(demoId) {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  // Check if demo is used by active clients
  const activeClientsUsingDemo = bList.filter(b => !b.is_demo && b.base_demo_id === demoId && !b.deleted_at)
  
  const idx = bList.findIndex(b => b.business_id === demoId || b.id === demoId)
  if (idx !== -1) {
    bList[idx].deleted_at = new Date().toISOString()
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(bList))
    logAuditAction('eliminar_demo', demoId, { clientsAffectedCount: activeClientsUsingDemo.length })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CREAR NEGOCIO DESDE DEMO
// ─────────────────────────────────────────────────────────────────────────────
export function createBusinessFromDemo({ demoId, formData }) {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const cList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]')
  const pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]')

  const demo = bList.find(b => (b.business_id === demoId || b.id === demoId) && b.is_demo)
  if (!demo) throw new Error('Demo plantilla no encontrado.')

  const finalName = formData.name || demo.name
  const finalSlug = slugify(formData.slug || finalName)

  // Verify slug unique
  const slugExists = bList.some(b => b.slug === finalSlug && !b.deleted_at)
  if (slugExists) {
    throw new Error(`El slug /menu/${finalSlug} ya está en uso por otro restaurante.`)
  }

  const newBusinessId = `biz_${finalSlug}_${Date.now().toString(36)}`
  const password = generateSecurePassword()
  const username = formData.email || `${finalSlug}@streetboss.com.mx`

  const newBusiness = {
    id: newBusinessId,
    business_id: newBusinessId,
    name: finalName,
    slug: finalSlug,
    business_type: formData.business_type || demo.business_type || 'Restaurante',
    is_demo: false,
    demo_status: 'Inactivo',
    status: 'activo',
    template_version: '3.0',
    base_demo_id: demo.business_id,
    owner_name: formData.owner_name || '',
    phone: formData.phone || '',
    whatsapp: formData.whatsapp || DEMO_CONTACTS.DEFAULT_WHATSAPP,
    email: formData.email || '',
    address: formData.address || '',
    ext_number: formData.ext_number || '',
    int_number: formData.int_number || '',
    colonia: formData.colonia || '',
    postal_code: formData.postal_code || '',
    city: formData.city || 'Tuxtla Gutiérrez',
    municipality: formData.municipality || 'Tuxtla Gutiérrez',
    state: formData.state || 'Chiapas',
    maps_url: formData.maps_url || '',
    facebook_url: formData.facebook_url || '',
    instagram_url: formData.instagram_url || '',
    tiktok_url: formData.tiktok_url || '',
    website_url: formData.website_url || '',
    logo_url: formData.logo_url || demo.logo_url,
    banner_url: formData.banner_url || demo.banner_url,
    brand_color: formData.brand_color || '#FF4B00',
    main_message: formData.main_message || '¡Gracias por tu preferencia! Pedidos al instante por WhatsApp.',
    description: formData.description || demo.description,
    schedule_text: formData.schedule_text || 'Lun a Dom · 9:00 am – 10:00 pm',
    is_open: true,
    has_delivery: true,
    delivery_mode: 'fijo',
    base_delivery_fee: 30,
    owner_username: username,
    temp_password: password,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Clone categories and products from demo
  const demoCategories = cList.filter(c => c.business_id === demo.business_id)
  const demoProducts = pList.filter(p => p.business_id === demo.business_id)

  const newCategories = []
  const newProducts = []

  demoCategories.forEach(cat => {
    const newCatId = `cat_${newBusinessId}_${Math.random().toString(36).slice(2, 7)}`
    newCategories.push({
      ...cat,
      id: newCatId,
      business_id: newBusinessId,
      created_at: new Date().toISOString(),
    })

    const matchingProds = demoProducts.filter(p => p.category_id === cat.id)
    matchingProds.forEach(prod => {
      newProducts.push({
        ...prod,
        id: `prod_${newBusinessId}_${Math.random().toString(36).slice(2, 7)}`,
        business_id: newBusinessId,
        category_id: newCatId,
        created_at: new Date().toISOString(),
      })
    })
  })

  // Save to local storage
  bList.unshift(newBusiness)
  cList.push(...newCategories)
  pList.push(...newProducts)

  localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(bList))
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cList))
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(pList))

  logAuditAction('crear_cliente', newBusinessId, { name: finalName, owner: formData.owner_name })

  const menuUrl = `https://streetboss.com.mx/menu/${finalSlug}`
  const dashboardUrl = `https://streetboss.com.mx/panel/${finalSlug}`

  const whatsappMessage = `Hola, ${formData.owner_name || finalName}.

Ya está listo el menú digital de *${finalName}*.

📱 *Menú:*
${menuUrl}

⚙️ *Dashboard para editarlo:*
${dashboardUrl}

👤 *Usuario:* ${username}
🔑 *Contraseña temporal:* ${password}

Desde tu Dashboard podrás actualizar productos, precios, fotografías, horarios, promociones, redes sociales y zonas de entrega.

StreetBoss
_Vende directo. Manda tú._`

  return {
    business: newBusiness,
    menuUrl,
    dashboardUrl,
    username,
    password,
    whatsappMessage,
  }
}

export function generatePersonalizedDemoForProspect(prospect) {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const cList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]')
  const pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]')

  const baseSlugName = slugify(prospect.business_name || 'restaurante-demo')
  
  // Check if demo already exists FOR THIS SPECIFIC PROSPECT (by ID, phone, or exact address)
  let existingBusiness = bList.find(
    b => !b.deleted_at && (
      (prospect.id && b.prospect_id === prospect.id) ||
      (prospect.phone && prospect.phone !== '' && b.phone === prospect.phone) ||
      (b.name === prospect.business_name && b.city === prospect.city && b.address === prospect.address)
    )
  )

  if (existingBusiness) {
    const demoUrl = `https://streetboss.mx/demo/${existingBusiness.slug}`
    return { business: existingBusiness, demoUrl, slug: existingBusiness.slug }
  }

  // Ensure UNIQUE slug among all businesses so no 2 businesses overwrite each other
  let uniqueSlug = baseSlugName
  let counter = 1

  if (bList.some(b => b.slug === uniqueSlug && !b.deleted_at)) {
    const citySlug = slugify(prospect.city || '')
    if (citySlug) {
      uniqueSlug = `${baseSlugName}-${citySlug}`
    }
  }

  while (bList.some(b => b.slug === uniqueSlug && !b.deleted_at)) {
    counter++
    uniqueSlug = `${baseSlugName}-${counter}`
  }

  // Find suggested demo base
  let templateDemoId = prospect.assigned_demo || 'demo_taqueria'
  let demoTemplate = bList.find(b => (b.business_id === templateDemoId || b.id === templateDemoId) && b.is_demo)
  if (!demoTemplate) {
    demoTemplate = bList.find(b => b.is_demo) || DEMOS_OFICIALES[0]
  }

  const newBusinessId = `demo_custom_${uniqueSlug}`
  const newBusiness = {
    id: newBusinessId,
    business_id: newBusinessId,
    prospect_id: prospect.id,
    name: prospect.business_name,
    slug: uniqueSlug,
    business_type: prospect.category || 'Restaurante',
    is_demo: true,
    demo_status: 'Activo',
    status: 'activo',
    template_version: '3.0',
    base_demo_id: demoTemplate.business_id || demoTemplate.id,
    owner_name: prospect.contact_name || '',
    phone: prospect.phone || '',
    whatsapp: prospect.whatsapp || prospect.phone || DEMO_CONTACTS.DEFAULT_WHATSAPP,
    email: prospect.email || '',
    address: prospect.address || '',
    colonia: prospect.colonia || '',
    city: prospect.city || 'Tuxtla Gutiérrez',
    state: prospect.state || 'Chiapas',
    maps_url: prospect.maps_url || '',
    facebook_url: prospect.facebook || '',
    instagram_url: prospect.instagram || '',
    website_url: prospect.website || '',
    logo_url: '/brand/SB_FAVICON_512x512_V01.png',
    banner_url: demoTemplate.banner_url || '/brand/StreetBoss_Logo_Horizontal_Oficial.webp',
    brand_color: '#FF4B00',
    main_message: `¡Bienvenido a ${prospect.business_name}! Pedidos al instante por WhatsApp.`,
    description: `Demostración oficial personalizada para ${prospect.business_name} en StreetBoss.`,
    schedule_text: 'Lun a Dom · 9:00 am – 10:00 pm',
    is_open: true,
    has_delivery: true,
    delivery_mode: 'fijo',
    base_delivery_fee: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Clone categories and products from selected demo template
  const demoCategories = cList.filter(c => c.business_id === (demoTemplate.business_id || demoTemplate.id))
  const demoProducts = pList.filter(p => p.business_id === (demoTemplate.business_id || demoTemplate.id))

  const newCategories = []
  const newProducts = []

  demoCategories.forEach(cat => {
    const newCatId = `cat_${newBusinessId}_${Math.random().toString(36).slice(2, 7)}`
    newCategories.push({
      ...cat,
      id: newCatId,
      business_id: newBusinessId,
      created_at: new Date().toISOString(),
    })

    const matchingProds = demoProducts.filter(p => p.category_id === cat.id)
    matchingProds.forEach(prod => {
      newProducts.push({
        ...prod,
        id: `prod_${newBusinessId}_${Math.random().toString(36).slice(2, 7)}`,
        business_id: newBusinessId,
        category_id: newCatId,
        created_at: new Date().toISOString(),
      })
    })
  })

  bList.unshift(newBusiness)
  cList.push(...newCategories)
  pList.push(...newProducts)

  localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(bList))
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cList))
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(pList))

  const demoUrl = `https://streetboss.mx/demo/${uniqueSlug}`
  return { business: newBusiness, demoUrl, slug: uniqueSlug }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROSPECT COMMERCIAL DATA ISOLATION (FASE 4 & FASE 5)
// ─────────────────────────────────────────────────────────────────────────────
export function getProspectCommercialData(prospectId) {
  if (!prospectId) return null
  const store = JSON.parse(localStorage.getItem('sb_v3_commercial_prospect_states') || '{}')
  return store[prospectId] || {
    status: 'Nuevo',
    priority: 'Media',
    contact_date: null,
    last_contact: null,
    next_followup: null,
    assigned_demo: '',
    demo_sent: false,
    assigned_rep: '',
    notes: ''
  }
}

export function saveProspectCommercialData(prospectId, commercialData) {
  if (!prospectId) return null
  const store = JSON.parse(localStorage.getItem('sb_v3_commercial_prospect_states') || '{}')
  const updated = {
    ...store[prospectId],
    ...commercialData,
    updated_at: new Date().toISOString()
  }
  store[prospectId] = updated
  localStorage.setItem('sb_v3_commercial_prospect_states', JSON.stringify(store))
  notifyCentralSync('PROSPECT_COMMERCIAL_UPDATED', { prospectId, commercialData: updated })
  return updated
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTES ENGINE
// ─────────────────────────────────────────────────────────────────────────────
export function getClients() {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const cList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]')
  const pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]')
  const zList = JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERY_ZONES) || '[]')

  const clients = bList.filter(b => !b.is_demo && !b.deleted_at)
  return clients.map(client => {
    const categories = cList.filter(c => c.business_id === client.business_id)
    const products = pList.filter(p => p.business_id === client.business_id)
    const zones = zList.filter(z => z.business_id === client.business_id && z.is_active)
    return {
      ...client,
      categories_count: categories.length,
      products_count: products.length,
      colonias_count: zones.length,
      categories,
      products,
    }
  })
}

export function getBusinessBySlug(slugOrId) {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const cList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]')
  const pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]')
  const zList = JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERY_ZONES) || '[]')

  const business = bList.find(
    b => (b.slug === slugOrId || b.business_id === slugOrId || b.id === slugOrId) && !b.deleted_at
  )
  if (!business) return null

  const categories = cList.filter(c => c.business_id === business.business_id)
  const products = pList.filter(p => p.business_id === business.business_id)
  const zones = zList.filter(z => z.business_id === business.business_id && z.is_active)

  const defaultPaymentMethods = {
    efectivo: { activo: true, preguntar_cambio: true, limite_cambio_activo: false, max_cambio_monto: 500 },
    transferencia: {
      activo: true,
      titular: `${business.name || 'Negocio Demo'} S.A. de C.V.`,
      banco: 'BBVA Bancomer / Banorte',
      clabe: '012180000123456789',
      numero_cuenta: '4152 3130 0000 1234',
      instrucciones: 'Por favor realiza tu transferencia SPEI incluyendo tu nombre o número de pedido en el concepto.',
      texto_solicitar_comprobante: 'Realiza tu transferencia y adjunta la captura del comprobante cuando envíes tu pedido por WhatsApp.'
    },
    tarjeta: {
      activo: true,
      instrucciones: 'Se aceptan tarjetas de crédito y débito Visa, MasterCard y Amex. El pago se realiza al momento de la entrega.',
      compra_minima: 0
    }
  }

  const payment_methods = {
    ...defaultPaymentMethods,
    ...(business.payment_methods || {}),
    efectivo: { ...defaultPaymentMethods.efectivo, ...(business.payment_methods?.efectivo || {}) },
    transferencia: { ...defaultPaymentMethods.transferencia, ...(business.payment_methods?.transferencia || {}) },
    tarjeta: { ...defaultPaymentMethods.tarjeta, ...(business.payment_methods?.tarjeta || {}) },
  }

  return {
    ...business,
    payment_methods,
    categories,
    products,
    delivery_zones: zones,
  }
}

export function updateClientStatus(clientBusinessId, newStatus) {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const idx = bList.findIndex(b => b.business_id === clientBusinessId || b.id === clientBusinessId)
  if (idx !== -1) {
    bList[idx].status = newStatus
    bList[idx].updated_at = new Date().toISOString()
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(bList))
    logAuditAction('suspender_cliente', clientBusinessId, { status: newStatus })
  }
}

export function regenerateClientPassword(clientBusinessId) {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const idx = bList.findIndex(b => b.business_id === clientBusinessId || b.id === clientBusinessId)
  if (idx !== -1) {
    const newPass = generateSecurePassword()
    bList[idx].temp_password = newPass
    bList[idx].updated_at = new Date().toISOString()
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(bList))
    logAuditAction('regenerar_password', clientBusinessId, {})
    return newPass
  }
  return null
}

export function setBusinessPassword(businessId, newPassword) {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'La contraseña debe tener al menos 8 caracteres.' }
  }
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const idx = bList.findIndex(b => b.business_id === businessId || b.id === businessId)
  if (idx === -1) return { success: false, error: 'Negocio no encontrado.' }
  bList[idx].temp_password = newPassword
  bList[idx].updated_at = new Date().toISOString()
  localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(bList))
  logAuditAction('establecer_password', businessId, {})
  return { success: true }
}

// Access dashboard administratively
export function getAdministrativeAccessUrl(clientSlug) {
  logAuditAction('acceso_dashboard', clientSlug, { mode: 'suplantacion_auditada' })
  return `/panel/${clientSlug}?mode=admin_suplantacion`
}

export function authenticateBusiness(slug, password) {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const business = bList.find(b => b.slug === slug && !b.deleted_at)
  if (!business) {
    return { success: false, error: 'Restaurante no encontrado.' }
  }

  // Demos oficiales pueden acceder directamente sin contraseña obligatoria
  if (business.is_demo) {
    logAuditAction('login_b2b_exitoso', business.business_id, { slug, isDemo: true })
    return { success: true, business }
  }

  const validPassword = business.temp_password || business.password
  if (!validPassword) {
    return { success: false, error: 'Este restaurante no tiene contraseña configurada. Contacta a StreetBoss.' }
  }
  if (password === validPassword) {
    logAuditAction('login_b2b_exitoso', business.business_id, { slug })
    return { success: true, business }
  }

  logAuditAction('login_b2b_fallido', business.business_id, { slug })
  return { success: false, error: 'Contraseña incorrecta. Revisa el acceso proporcionado por StreetBoss.' }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROSPECTOS ENGINE & DUPLICATES
// ─────────────────────────────────────────────────────────────────────────────
export function getProspects() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROSPECTS) || '[]')
}

export function createProspect(data) {
  const pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROSPECTS) || '[]')
  const duplicates = checkProspectDuplicates(data)

  const newProspect = {
    id: `prospect_${Date.now().toString(36)}`,
    business_name: data.business_name || 'Nuevo Prospecto',
    category: data.category || 'Restaurante',
    contact_name: data.contact_name || '',
    phone: data.phone || '',
    whatsapp: data.whatsapp || data.phone || '',
    email: data.email || '',
    address: data.address || '',
    colonia: data.colonia || '',
    city: data.city || 'Tuxtla Gutiérrez',
    state: data.state || 'Chiapas',
    facebook: data.facebook || '',
    instagram: data.instagram || '',
    tiktok: data.tiktok || '',
    website: data.website || '',
    source: data.source || 'Manual',
    notes: data.notes || '',
    status: data.status || 'Nuevo',
    contact_date: data.contact_date || new Date().toISOString().slice(0, 10),
    next_followup: data.next_followup || null,
    created_at: new Date().toISOString(),
  }

  pList.unshift(newProspect)
  localStorage.setItem(STORAGE_KEYS.PROSPECTS, JSON.stringify(pList))

  return { prospect: newProspect, duplicates }
}

export function checkProspectDuplicates(data) {
  const pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROSPECTS) || '[]')
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')

  const matches = []

  const cleanVal = v => String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '')

  const nameC = cleanVal(data.business_name)
  const phoneC = cleanVal(data.phone || data.whatsapp)
  const emailC = cleanVal(data.email)

  pList.forEach(p => {
    if (emailC && cleanVal(p.email) === emailC) matches.push({ type: 'Email duplicado en prospectos', match: p.business_name })
    if (phoneC && (cleanVal(p.phone) === phoneC || cleanVal(p.whatsapp) === phoneC)) matches.push({ type: 'Teléfono duplicado en prospectos', match: p.business_name })
    if (nameC && cleanVal(p.business_name) === nameC) matches.push({ type: 'Nombre coincidente en prospectos', match: p.business_name })
  })

  bList.forEach(b => {
    if (phoneC && cleanVal(b.phone) === phoneC) matches.push({ type: 'Teléfono existente en cliente', match: b.name })
    if (emailC && cleanVal(b.email) === emailC) matches.push({ type: 'Email existente en cliente', match: b.name })
  })

  return matches
}

export function importProspects(prospectArray) {
  const pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROSPECTS) || '[]')
  let count = 0

  prospectArray.forEach(item => {
    if (item.business_name) {
      const prospect = {
        id: `prospect_imp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        business_name: item.business_name,
        category: item.category || 'Restaurante',
        contact_name: item.contact_name || '',
        phone: item.phone || '',
        whatsapp: item.whatsapp || item.phone || '',
        email: item.email || '',
        address: item.address || '',
        colonia: item.colonia || '',
        city: item.city || 'Tuxtla Gutiérrez',
        state: item.state || 'Chiapas',
        facebook: item.facebook || '',
        instagram: item.instagram || '',
        tiktok: item.tiktok || '',
        website: item.website || '',
        source: 'Importación',
        notes: item.notes || '',
        status: 'Nuevo',
        contact_date: new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString(),
      }
      pList.unshift(prospect)
      count++
    }
  })

  localStorage.setItem(STORAGE_KEYS.PROSPECTS, JSON.stringify(pList))
  return count
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD DEL CLIENTE ENGINE (CRUD MENÚ & ZONAS)
// ─────────────────────────────────────────────────────────────────────────────
export function updateBusinessSettings(businessId, updates) {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const idx = bList.findIndex(b => b.business_id === businessId || b.id === businessId || b.slug === businessId)
  if (idx !== -1) {
    bList[idx] = {
      ...bList[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(bList))
    notifyCentralSync('BUSINESS_UPDATED', { businessId, updates })
    return bList[idx]
  }
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTENTICACIÓN HQ ADMIN (CRM PRINCIPAL / CENTRAL-HQ)
// ─────────────────────────────────────────────────────────────────────────────
const HQ_ADMIN_SESSION_KEY = 'sb_hq_admin_session'
const HQ_ADMIN_PASS_KEY = 'sb_hq_admin_password'

export function getHqAdminSession() {
  if (typeof window === 'undefined') return null
  return JSON.parse(sessionStorage.getItem(HQ_ADMIN_SESSION_KEY) || 'null')
}

export function authenticateHqAdmin(username, password) {
  const cleanUser = String(username || '').trim().toLowerCase()
  const validUsernames = ['superadmin_hq', 'admin@streetboss.com.mx', 'admin', 'hq']
  
  if (!validUsernames.includes(cleanUser)) {
    logAuditAction('login_hq_fallido', 'central-hq', { username, reason: 'usuario_invalido' })
    return { success: false, error: 'Usuario administrador no reconocido.' }
  }

  const storedPass = localStorage.getItem(HQ_ADMIN_PASS_KEY) || 'StreetBossAdmin2026!'
  if (password === storedPass) {
    const session = {
      user: cleanUser,
      role: 'superadmin',
      token: `hq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      loggedAt: new Date().toISOString()
    }
    sessionStorage.setItem(HQ_ADMIN_SESSION_KEY, JSON.stringify(session))
    logAuditAction('login_hq_exitoso', 'central-hq', { user: cleanUser })
    notifyCentralSync('HQ_LOGIN_SUCCESS', { user: cleanUser })
    return { success: true, session }
  }

  logAuditAction('login_hq_fallido', 'central-hq', { username, reason: 'password_incorrecta' })
  return { success: false, error: 'Contraseña administrativa incorrecta.' }
}

export function setHqAdminPassword(newPassword) {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'La contraseña administrativa debe tener al menos 8 caracteres.' }
  }
  localStorage.setItem(HQ_ADMIN_PASS_KEY, newPassword)
  logAuditAction('cambio_password_hq', 'central-hq', {})
  notifyCentralSync('HQ_PASS_CHANGED', {})
  return { success: true }
}

export function logoutHqAdmin() {
  sessionStorage.removeItem(HQ_ADMIN_SESSION_KEY)
  logAuditAction('logout_hq', 'central-hq', {})
  notifyCentralSync('HQ_LOGOUT', {})
}

export function saveCategory(businessId, categoryData) {
  const cList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]')
  if (categoryData.id) {
    const idx = cList.findIndex(c => c.id === categoryData.id)
    if (idx !== -1) {
      cList[idx] = { ...cList[idx], ...categoryData }
    }
  } else {
    const newCat = {
      id: `cat_${businessId}_${Date.now().toString(36)}`,
      business_id: businessId,
      name: categoryData.name,
      category_type: categoryData.category_type || 'normal',
      is_plus: categoryData.is_plus || false,
      is_visible: categoryData.is_visible !== false,
      position: cList.filter(c => c.business_id === businessId).length,
      created_at: new Date().toISOString(),
    }
    cList.push(newCat)
  }
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cList))
}

export function deleteCategory(categoryId) {
  let cList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]')
  let pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]')
  cList = cList.filter(c => c.id !== categoryId)
  pList = pList.filter(p => p.category_id !== categoryId)
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cList))
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(pList))
}

export function saveProduct(businessId, productData) {
  const pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]')
  if (productData.id) {
    const idx = pList.findIndex(p => p.id === productData.id)
    if (idx !== -1) {
      pList[idx] = { ...pList[idx], ...productData }
    }
  } else {
    const newProd = {
      id: `prod_${businessId}_${Date.now().toString(36)}`,
      business_id: businessId,
      category_id: productData.category_id,
      name: productData.name,
      price: Number(productData.price || 0),
      description: productData.description || '',
      image_url: productData.image_url || '',
      is_out_of_stock: productData.is_out_of_stock || false,
      is_hidden: productData.is_hidden || false,
      is_active: productData.is_active !== false,
      is_featured: productData.is_featured || false,
      is_promo: productData.is_promo || false,
      position: pList.filter(p => p.category_id === productData.category_id).length,
      created_at: new Date().toISOString(),
    }
    pList.push(newProd)
  }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(pList))
}

export function toggleProductAvailability(productId) {
  const pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]')
  const idx = pList.findIndex(p => p.id === productId)
  if (idx !== -1) {
    pList[idx].is_out_of_stock = !pList[idx].is_out_of_stock
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(pList))
    return pList[idx]
  }
  return null
}

export function toggleProductVisibility(productId) {
  const pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]')
  const idx = pList.findIndex(p => p.id === productId)
  if (idx !== -1) {
    pList[idx].is_hidden = !pList[idx].is_hidden
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(pList))
    return pList[idx]
  }
  return null
}

export function deleteProduct(productId) {
  let pList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]')
  pList = pList.filter(p => p.id !== productId)
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(pList))
}

// ─────────────────────────────────────────────────────────────────────────────
// REPARTO & SEPOMEX ZONES
// ─────────────────────────────────────────────────────────────────────────────
export function getBusinessDeliveryZones(businessId) {
  const zList = JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERY_ZONES) || '[]')
  return zList.filter(z => z.business_id === businessId)
}

export function saveDeliveryZones(businessId, zonesArray) {
  let zList = JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERY_ZONES) || '[]')
  // remove old zones for business
  zList = zList.filter(z => z.business_id !== businessId)

  // enforce unique settlement per business
  const seen = new Set()
  const cleanZones = []

  zonesArray.forEach(z => {
    const key = `${z.postal_code}_${z.settlement_name}`
    if (!seen.has(key)) {
      seen.add(key)
      cleanZones.push({
        id: z.id || `zone_${businessId}_${Math.random().toString(36).slice(2, 7)}`,
        business_id: businessId,
        postal_code: z.postal_code,
        settlement_name: z.settlement_name,
        settlement_type: z.settlement_type || 'Colonia',
        municipality: z.municipality || 'Tuxtla Gutiérrez',
        state: z.state || 'Chiapas',
        delivery_fee: Number(z.delivery_fee || 30),
        minimum_order: Number(z.minimum_order || 0),
        estimated_minutes: Number(z.estimated_minutes || 35),
        is_active: z.is_active !== false,
        created_at: new Date().toISOString(),
      })
    }
  })

  zList.push(...cleanZones)
  localStorage.setItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify(zList))
  return cleanZones
}

export function bulkUpdateZoneFees(businessId, selectedSettlementKeys, newFee) {
  const zList = JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERY_ZONES) || '[]')
  const feeNum = Number(newFee || 0)
  
  zList.forEach(z => {
    if (z.business_id === businessId) {
      const key = `${z.postal_code}_${z.settlement_name}`
      if (selectedSettlementKeys.includes(key)) {
        z.delivery_fee = feeNum
        z.updated_at = new Date().toISOString()
      }
    }
  })

  localStorage.setItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify(zList))
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOG
// ─────────────────────────────────────────────────────────────────────────────
export function logAuditAction(action, targetId, details = {}) {
  const audit = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT) || '[]')
  const entry = {
    id: `log_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    action,
    user_id: 'equipo_streetboss',
    target_id: targetId,
    details,
    created_at: new Date().toISOString(),
  }
  audit.unshift(entry)
  localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(audit.slice(0, 200)))
}

export function getAuditLogs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT) || '[]')
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRO DE PEDIDOS Y CLIENTES DEL RESTAURANTE (MULTI-TENANT DEDUPLICADO)
// ─────────────────────────────────────────────────────────────────────────────
export function recordPublicOrder(orderPayload) {
  const {
    business_id,
    business_name,
    customer_name,
    phone,
    whatsapp,
    email,
    colonia,
    postal_code,
    address,
    items = [],
    subtotal = 0,
    delivery_fee = 0,
    total = 0,
    delivery_type = 'domicilio',
    promo_consent = false,
    whatsapp_message = '',
  } = orderPayload

  const nowISO = new Date().toISOString()
  const phoneClean = normalizeMexicanPhone(phone || whatsapp)

  // 1. Deduplicar o registrar cliente privado del restaurante
  let customerList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]')
  let existingCustomer = customerList.find(
    c => c.business_id === business_id && (
      (phoneClean && c.phone_normalized === phoneClean) ||
      (email && c.email && c.email.toLowerCase().trim() === email.toLowerCase().trim())
    )
  )

  let customerId = existingCustomer ? existingCustomer.id : `cust_${business_id}_${Math.random().toString(36).slice(2, 7)}`

  if (existingCustomer) {
    existingCustomer.name = customer_name || existingCustomer.name
    existingCustomer.phone = phone || existingCustomer.phone
    existingCustomer.whatsapp = whatsapp || existingCustomer.whatsapp
    existingCustomer.email = email || existingCustomer.email
    existingCustomer.colonia = colonia || existingCustomer.colonia
    existingCustomer.postal_code = postal_code || existingCustomer.postal_code
    existingCustomer.address = address || existingCustomer.address
    existingCustomer.last_order_at = nowISO
    existingCustomer.orders_count = (existingCustomer.orders_count || 1) + 1
    existingCustomer.total_spent = Number((existingCustomer.total_spent || 0) + total)
    if (promo_consent) {
      existingCustomer.promo_consent = true
      existingCustomer.promo_consent_at = nowISO
      existingCustomer.consent_details = {
        accepted_text: 'Quiero recibir promociones y novedades de este negocio por WhatsApp.',
        channel: 'whatsapp',
        version: 'v1.0'
      }
    }
  } else {
    const newCustomer = {
      id: customerId,
      business_id,
      name: customer_name || 'Cliente de WhatsApp',
      phone: phone || '',
      whatsapp: whatsapp || phone || '',
      phone_normalized: phoneClean,
      email: email || '',
      colonia: colonia || '',
      postal_code: postal_code || '',
      address: address || '',
      first_order_at: nowISO,
      last_order_at: nowISO,
      orders_count: 1,
      total_spent: Number(total),
      promo_consent: !!promo_consent,
      promo_consent_at: promo_consent ? nowISO : null,
      consent_details: promo_consent ? {
        accepted_text: 'Quiero recibir promociones y novedades de este negocio por WhatsApp.',
        channel: 'whatsapp',
        version: 'v1.0'
      } : null,
      created_at: nowISO,
    }
    customerList.unshift(newCustomer)
  }
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customerList))

  // 2. Registrar Pedido en la Base Central
  let ordersList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
  const orderNumber = `#SB-${Math.floor(10000 + Math.random() * 90000)}`

  const newOrder = {
    id: `ord_${Date.now().toString(36)}`,
    order_number: orderNumber,
    business_id,
    business_name: business_name || 'Restaurante',
    customer_id: customerId,
    customer_name: customer_name || 'Cliente',
    phone: phone || '',
    whatsapp: whatsapp || phone || '',
    email: email || '',
    delivery_type, // 'domicilio' | 'recoleccion'
    colonia: colonia || '',
    postal_code: postal_code || '',
    address: address || '',
    items,
    subtotal: Number(subtotal),
    delivery_fee: Number(delivery_fee),
    total: Number(total),
    whatsapp_message,
    whatsapp_status: orderPayload.whatsapp_status || 'pendiente_envio',
    status: orderPayload.status || 'pendiente_envio',
    payment_method: orderPayload.payment_method || 'efectivo',
    payment_status: orderPayload.payment_status || (orderPayload.payment_method === 'transferencia' ? 'comprobante_pendiente' : 'pendiente'),
    cash_needs_change: !!(orderPayload.cash_needs_change || orderPayload.needs_change),
    needs_change: !!(orderPayload.cash_needs_change || orderPayload.needs_change),
    cash_pay_with: orderPayload.cash_pay_with || orderPayload.pay_with_amount || '',
    pay_with_amount: orderPayload.cash_pay_with || orderPayload.pay_with_amount || '',
    has_terminal: !!orderPayload.has_terminal,
    pending_receipt: orderPayload.payment_method === 'transferencia' || !!orderPayload.pending_receipt,
    comentarios_internos: orderPayload.comentarios_internos || '',
    observaciones: orderPayload.observaciones || orderPayload.notes || '',
    hora_confirmacion: orderPayload.hora_confirmacion || null,
    hora_entrega: orderPayload.hora_entrega || null,
    created_at: nowISO,
  }

  ordersList.unshift(newOrder)
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersList))

  return { order: newOrder, customerId }
}

export function getBusinessCustomers(businessId) {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const biz = bList.find(b => b.business_id === businessId || b.id === businessId || b.slug === businessId)
  const validIds = new Set([
    businessId,
    biz?.id,
    biz?.business_id,
    biz?.slug
  ].filter(Boolean))

  const customerList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]')
  return customerList.filter(c => validIds.has(c.business_id))
}

export function updateCustomerPromoConsent(customerId, hasConsent) {
  let customerList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]')
  const idx = customerList.findIndex(c => c.id === customerId)
  if (idx !== -1) {
    customerList[idx].promo_consent = hasConsent
    customerList[idx].promo_consent_at = hasConsent ? new Date().toISOString() : null
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customerList))
  }
}

export function getAllOrders() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
}

export function getOrdersByBusiness(businessId) {
  const bList = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const biz = bList.find(b => b.business_id === businessId || b.id === businessId || b.slug === businessId)
  const validIds = new Set([
    businessId,
    biz?.id,
    biz?.business_id,
    biz?.slug
  ].filter(Boolean))

  const orders = getAllOrders()
  return orders.filter(o => validIds.has(o.business_id))
}

export function updateOrderStatus(orderId, newStatus, extraData = {}) {
  let ordersList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
  const idx = ordersList.findIndex(o => o.id === orderId || o.order_number === orderId)
  if (idx !== -1) {
    ordersList[idx] = {
      ...ordersList[idx],
      status: newStatus,
      ...extraData,
      updated_at: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersList))
    return ordersList[idx]
  }
  return null
}

export function updateOrderPaymentStatus(orderId, newPaymentStatus, extraData = {}) {
  let ordersList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
  const idx = ordersList.findIndex(o => o.id === orderId || o.order_number === orderId)
  if (idx !== -1) {
    ordersList[idx] = {
      ...ordersList[idx],
      payment_status: newPaymentStatus,
      ...extraData,
      updated_at: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersList))
    return ordersList[idx]
  }
  return null
}

