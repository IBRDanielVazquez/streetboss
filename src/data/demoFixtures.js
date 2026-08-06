/**
 * FUENTE ÚNICA DE VERDAD PARA DATOS DEMO FICTICIOS EN STREETBOSS
 * Todos los datos almacenados aquí son estrictamente ficticios y de demostración.
 * Ningún teléfono personal real (ej. 9612466204) debe figurar en el proyecto.
 */

export const DEMO_CONTACTS = {
  DEFAULT_PHONE: '9610000000',
  DEFAULT_WHATSAPP: '529610000000',
  SALES_WHATSAPP: '529610000000',
  SUPPORT_WHATSAPP: '529610000000',
  FORMATTED_PHONE: '961 000 0000',
}

export const DEMO_FIXTURES = {
  'tacos-el-guero': {
    name: 'Tacos El Güero',
    category: 'Taquería Mexicana',
    owner_name: 'Roberto Gómez',
    email: 'contacto@tacoselguero.demo.mx',
    phone: '9611112233',
    whatsapp: '529611112233',
    address: 'Av. Central Poniente #450, Col. Centro',
    colonia: 'Centro',
    city: 'Tuxtla Gutiérrez',
    state: 'Chiapas',
    hours: 'Lun a Dom · 6:00 pm – 1:00 am',
    bank_data: {
      titular: 'Tacos El Güero S.A. de C.V. (Demo)',
      banco: 'BBVA Bancomer',
      clabe: '012180000000000001',
      account: '4152313000000001',
      text: 'Realiza tu pago por transferencia y envía tu comprobante por WhatsApp.'
    },
    sample_orders: [
      { order_number: '#SB-9011', customer_name: 'Carlos Ruiz', items: '3x Tacos al Pastor, 1x Consomé', total: 145, status: 'entregado', payment_method: 'efectivo' },
      { order_number: '#SB-9012', customer_name: 'Ana Laura Solís', items: '2x Gringas de Arrachera', total: 170, status: 'en_proceso', payment_method: 'transferencia' }
    ]
  },
  'pizza-house': {
    name: 'Pizza House',
    category: 'Pizzería Artesanal',
    owner_name: 'Mario Rossi',
    email: 'contacto@pizzahouse.demo.mx',
    phone: '9612223344',
    whatsapp: '529612223344',
    address: 'Calle 5a Norte Poniente #120, Col. Moctezuma',
    colonia: 'Moctezuma',
    city: 'Tuxtla Gutiérrez',
    state: 'Chiapas',
    hours: 'Mar a Dom · 1:00 pm – 11:00 pm',
    bank_data: {
      titular: 'Pizza House Tuxtla (Demo)',
      banco: 'Banorte',
      clabe: '072180000000000002',
      account: '4152313000000002',
      text: 'Transfiere al número CLABE y adjunta tu foto o PDF del pago.'
    },
    sample_orders: [
      { order_number: '#SB-9021', customer_name: 'Daniela Morales', items: '1x Pizza Pepperoni Familiar, 1x Refresco 2L', total: 280, status: 'confirmado', payment_method: 'tarjeta' }
    ]
  },
  'mariscos-el-puerto': {
    name: 'Mariscos El Puerto',
    category: 'Marisquería & Coctelería',
    owner_name: 'Ramón Aguilar',
    email: 'contacto@mariscoselpuerto.demo.mx',
    phone: '9613334455',
    whatsapp: '529613334455',
    address: 'Blvd. Belisario Domínguez #2100, Col. Arboledas',
    colonia: 'Arboledas',
    city: 'Tuxtla Gutiérrez',
    state: 'Chiapas',
    hours: 'Mie a Lunes · 11:00 am – 7:00 pm',
    bank_data: {
      titular: 'Mariscos El Puerto (Demo)',
      banco: 'Citibanamex',
      clabe: '002180000000000003',
      account: '4152313000000003',
      text: 'Adjunta comprobante bancario después de hacer la transferencia.'
    },
    sample_orders: [
      { order_number: '#SB-9031', customer_name: 'Fernando Castro', items: '1x Aguachile Verde Grande, 1x Tostada de Ceviche', total: 310, status: 'entregado', payment_method: 'efectivo' }
    ]
  }
}
