import { supabase } from '../supabase'
import { DEMOS_OFICIALES } from '../data/demoShowcase'

// Key constants for local reactive persistence fallback
const STORAGE_KEYS = {
  BUSINESSES: 'sb_v3_businesses',
  CATEGORIES: 'sb_v3_categories',
  PRODUCTS: 'sb_v3_products',
  DELIVERY_ZONES: 'sb_v3_delivery_zones',
  PROSPECTS: 'sb_v3_prospects',
  AUDIT: 'sb_v3_audit',
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
function initLocalStore() {
  let localBusinesses = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || 'null')
  if (!localBusinesses || localBusinesses.length === 0) {
    const seededBusinesses = DEMOS_OFICIALES.map(demo => ({
      id: demo.id,
      business_id: demo.id,
      name: demo.nombre,
      slug: demo.id,
      business_type: demo.giro || 'Restaurante',
      is_demo: true,
      demo_status: 'Activo',
      status: 'activo',
      template_version: '3.0',
      owner_name: 'Demostración Oficial',
      phone: '9612466204',
      whatsapp: '529612466204',
      email: `demo.${demo.clave}@streetboss.com.mx`,
      address: 'Tuxtla Gutiérrez, Chiapas',
      city: 'Tuxtla Gutiérrez',
      state: 'Chiapas',
      banner_url: demo.img || `/demos/img/${demo.id}.jpg`,
      logo_url: `/brand/SB_FAVICON_512x512_V01.png`,
      brand_color: '#FF4B00',
      description: `Demostración oficial de ${demo.nombre} en StreetBoss.`,
      schedule_text: 'Lun a Dom · 9:00 am – 10:00 pm',
      is_open: true,
      has_delivery: true,
      delivery_mode: 'fijo',
      base_delivery_fee: 30,
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
            is_out_of_stock: false,
            is_active: true,
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
  }
}

initLocalStore()

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
    whatsapp: formData.whatsapp || '529612466204',
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

  return {
    ...business,
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

// Access dashboard administratively
export function getAdministrativeAccessUrl(clientSlug) {
  logAuditAction('acceso_dashboard', clientSlug, { mode: 'suplantacion_auditada' })
  return `/panel/${clientSlug}`
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
  const idx = bList.findIndex(b => b.business_id === businessId || b.id === businessId)
  if (idx !== -1) {
    bList[idx] = {
      ...bList[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(bList))
    return bList[idx]
  }
  return null
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
