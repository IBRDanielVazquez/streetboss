import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getBusinessBySlug, subscribeCentralSync } from '../services/crmV3Service'
import { DEMOS_OFICIALES, DEMO_SHOWCASE } from '../data/demoShowcase'
import { DEMO_CONTACTS } from '../data/demoFixtures'
import MenuDigital from './MenuDigital'

const DEMO_META_MAP = {
  'tacos-el-guero': { folder: 'tacos-el-guero', schedule: 'Lun a Dom · 6:00 pm – 2:00 am', foodType: 'Taquería · Tacos al Pastor y Especiales' },
  'burger-house': { folder: 'burger-house', schedule: 'Lun a Dom · 1:00 pm – 11:00 pm', foodType: 'Burgers · Papas · Malteadas' },
  'pizza-house': { folder: 'pizza-house', schedule: 'Lun a Dom · 12:00 pm – 10:30 pm', foodType: 'Pizzas · Promos · Alitas' },
  'cafe-central': { folder: 'cafe-central', schedule: 'Lun a Dom · 7:00 am – 9:00 pm', foodType: 'Café · Panadería · Brunch' },
  'pollos-el-rey': { folder: 'pollos-el-rey', schedule: 'Lun a Dom · 10:00 am – 6:00 pm', foodType: 'Pollo rostizado · Carbón · Paquetes' },
  'parrilla-el-carbon': { folder: 'parrilla-el-carbon', schedule: 'Lun a Dom · 1:00 pm – 11:00 pm', foodType: 'Cortes · Brasas · Carne asada' },
  'tortas-el-barrio': { folder: 'tortas-el-barrio', schedule: 'Lun a Dom · 8:00 am – 8:00 pm', foodType: 'Tortas mexicanas · Combos' },
  'birrieria-jalisco': { folder: 'birrieria-jalisco', schedule: 'Lun a Dom · 8:00 am – 5:00 pm', foodType: 'Birria · Consomé · Quesabirrias' },
  'mariscos-el-puerto': { folder: 'mariscos-el-puerto', schedule: 'Lun a Dom · 10:00 am – 7:00 pm', foodType: 'Camarones · Ceviches · Aguachiles' },
  'china-express': { folder: 'china-express', schedule: 'Lun a Dom · 11:00 am – 9:00 pm', foodType: 'Arroz frito · Noodles · Pollo agridulce' },
}

function resolveDemoDetails(trialId, name) {
  const s = `${trialId || ''} ${name || ''}`.toLowerCase()
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

  const meta = DEMO_META_MAP[key]
  return {
    logo: `/demos/${meta.folder}/profile.png`,
    banner: `/demos/${meta.folder}/cover.jpg`,
    schedule: meta.schedule,
    foodType: meta.foodType
  }
}

export default function DemoPublicMenuWrapper() {
  const { trialId } = useParams()
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    const unsubscribe = subscribeCentralSync(() => {
      setRefreshTick(prev => prev + 1)
    })
    return () => unsubscribe()
  }, [trialId])
  
  // 1. Intentar cargar desde el motor multi-tenant (V3)
  const businessData = getBusinessBySlug(trialId)
  
  if (businessData) {
    const details = resolveDemoDetails(businessData.slug || businessData.business_id, businessData.name)

    // Formatear categorías y productos para MenuDigital
    const formattedMenu = (businessData.categories || []).map(cat => ({
      id: cat.id,
      nombre: cat.name,
      tipo: cat.category_type || 'normal',
      esPlus: cat.is_plus || false,
      visible: cat.is_visible !== false,
      productos: (businessData.products || [])
        .filter(p => p.category_id === cat.id && p.is_active !== false)
        .map(p => ({
          id: p.id,
          nombre: p.name,
          precio: Number(p.price || 0),
          descripcion: p.description || '',
          foto: p.image_url || '',
          agotado: p.is_out_of_stock || false,
          activo: p.is_active !== false,
        }))
    }))

    const businessConfig = {
      trialId: businessData.slug || businessData.business_id,
      negocio: businessData.name,
      logo: (businessData.logo_url && !businessData.logo_url.includes('SB_FAVICON')) ? businessData.logo_url : details.logo,
      banner: (businessData.banner_url && !businessData.banner_url.includes('/demos/img/')) ? businessData.banner_url : details.banner,
      colorMarca: businessData.brand_color || '#FF4B00',
      whatsapp: businessData.whatsapp || businessData.phone || DEMO_CONTACTS.DEFAULT_WHATSAPP,
      telefono: businessData.phone || DEMO_CONTACTS.DEFAULT_PHONE,
      mensajeClientes: businessData.main_message || '¡Gracias por tu preferencia! Pedidos al instante por WhatsApp.',
      foodType: details.foodType,
      redes: {
        facebook: businessData.facebook_url || 'https://facebook.com',
        instagram: businessData.instagram_url || 'https://instagram.com',
        tiktok: 'https://tiktok.com',
      },
      direccion: businessData.address || `${businessData.colonia || 'Tuxtla Gutiérrez'}, Chiapas`,
      horarios: businessData.schedule_text || details.schedule,
      urlMaps: 'https://maps.google.com',
      envio: { 
        activo: businessData.has_delivery !== false, 
        zonas: businessData.delivery_zones || [], 
        pedidoMinimo: 0,
        modoEnvio: businessData.delivery_mode || 'fijo',
        costoEnvio: Number(businessData.base_delivery_fee || 30),
        tiempoEntrega: businessData.estimated_delivery_time || '30–40 min'
      },
      payment_methods: businessData.payment_methods || {
        efectivo: { activo: true, preguntar_cambio: true },
        transferencia: { activo: false, titular: '', banco: '', clabe: '', numero_cuenta: '' },
        tarjeta: { activo: false, instrucciones: '' }
      },
      formasPago: {
        efectivo: businessData.payment_methods?.efectivo?.activo !== false,
        transferencia: !!businessData.payment_methods?.transferencia?.activo,
        tarjeta: !!businessData.payment_methods?.tarjeta?.activo
      },
    }

    return (
      <MenuDigital 
        isDemo={businessData.is_demo} 
        demoMenu={formattedMenu} 
        demoConfig={businessConfig} 
        modo="pedir"
      />
    )
  }

  // 2. Fallback a demos oficiales estáticos
  const demo = DEMO_SHOWCASE.find(
    d => d.id === trialId || trialId?.startsWith(d.id) || trialId?.includes(d.clave)
  ) || DEMO_SHOWCASE[0]

  const details = resolveDemoDetails(demo.id, demo.nombre || demo.name)

  const demoConfig = {
    trialId: demo.id,
    negocio: demo.nombre || demo.name,
    logo: (demo.logo_url && !demo.logo_url.includes('SB_FAVICON')) ? demo.logo_url : details.logo,
    banner: (demo.banner_url && !demo.banner_url.includes('/demos/img/')) ? demo.banner_url : details.banner,
    colorMarca: '#FF4B00',
    whatsapp: DEMO_CONTACTS.DEFAULT_WHATSAPP,
    telefono: DEMO_CONTACTS.DEFAULT_PHONE,
    mensajeClientes: '¡Gracias por tu preferencia! Pedidos al instante por WhatsApp.',
    foodType: details.foodType,
    redes: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      tiktok: 'https://tiktok.com',
    },
    direccion: 'Tuxtla Gutiérrez, Chiapas',
    horarios: details.schedule,
    urlMaps: 'https://maps.google.com',
    envio: { 
      activo: true, 
      zonas: [], 
      pedidoMinimo: 0,
      modoEnvio: 'fijo',
      costoEnvio: 30,
      tiempoEntrega: '30–40 min'
    },
    payment_methods: {
      efectivo: { activo: true, preguntar_cambio: true },
      transferencia: { activo: true, titular: 'Taquería El Güero S.A.', banco: 'BBVA Bancomer', clabe: '012180000123456789', numero_cuenta: '1234567890', texto_solicitar_comprobante: 'Realiza tu transferencia y adjunta el comprobante cuando envíes tu pedido por WhatsApp.' },
      tarjeta: { activo: true, instrucciones: 'Se aceptan tarjetas de crédito y débito Visa, MasterCard y Amex. El repartidor lleva terminal inalámbrica.' }
    },
    formasPago: { efectivo: true, transferencia: true, tarjeta: true },
  }

  return (
    <MenuDigital 
      isDemo={true} 
      demoMenu={demo.menu} 
      demoConfig={demoConfig} 
      modo="pedir"
    />
  )
}
