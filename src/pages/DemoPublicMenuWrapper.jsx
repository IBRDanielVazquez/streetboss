import { useParams } from 'react-router-dom'
import { getBusinessBySlug } from '../services/crmV3Service'
import { DEMOS_OFICIALES } from '../data/demoShowcase'
import { DEMO_CONTACTS } from '../data/demoFixtures'
import MenuDigital from './MenuDigital'

export default function DemoPublicMenuWrapper() {
  const { trialId } = useParams()
  
  // 1. Intentar cargar desde el motor multi-tenant (V3)
  const businessData = getBusinessBySlug(trialId)
  
  if (businessData) {
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
      logo: businessData.logo_url || null,
      banner: businessData.banner_url || null,
      colorMarca: businessData.brand_color || '#FF4B00',
      whatsapp: businessData.whatsapp || businessData.phone || DEMO_CONTACTS.DEFAULT_WHATSAPP,
      telefono: businessData.phone || DEMO_CONTACTS.DEFAULT_PHONE,
      mensajeClientes: businessData.main_message || '¡Gracias por tu preferencia! Pedidos al instante por WhatsApp.',
      redes: {
        facebook: businessData.facebook_url,
        instagram: businessData.instagram_url,
        tiktok: businessData.tiktok_url,
      },
      direccion: businessData.address || `${businessData.colonia || 'Tuxtla Gutiérrez'}, Chiapas`,
      horarios: businessData.schedule_text || 'Lun a Dom · 9:00 am – 10:00 pm',
      urlMaps: businessData.maps_url || '',
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
  const demo = DEMOS_OFICIALES.find(
    d => d.id === trialId || trialId?.startsWith(d.id) || trialId?.includes(d.clave)
  ) || DEMOS_OFICIALES[0]

  const demoConfig = {
    trialId: demo.id,
    negocio: demo.nombre,
    logo: null,
    banner: demo.img,
    colorMarca: '#FF4B00',
    whatsapp: DEMO_CONTACTS.DEFAULT_WHATSAPP,
    telefono: DEMO_CONTACTS.DEFAULT_PHONE,
    mensajeClientes: '¡Gracias por tu preferencia! Pedidos al instante por WhatsApp.',
    redes: {},
    direccion: 'Tuxtla Gutiérrez, Chiapas',
    horarios: 'Lun a Dom · 9:00 am – 10:00 pm',
    urlMaps: '',
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
