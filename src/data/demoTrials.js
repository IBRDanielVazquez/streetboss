// ─────────────────────────────────────────────────────────────────────────────
// SISTEMA DE PRUEBAS DEMO — datos locales
// Las 10 demos oficiales de Street Boss + menús semilla + mensajes de WhatsApp.
// 100% local: NO Supabase, NO backend, NO .env. Todo vive en localStorage.
//
// Claves de almacenamiento:
//  - sb_demo_trials_v1            → registro admin (prospectos + lista de pruebas)
//  - sb_demo_trial_data_<trialId> → datos editables de cada prueba
//
// NOTA: localStorage es POR NAVEGADOR. Una prueba abierta en otro dispositivo
// se auto-siembra fresca desde la demo base (el trialId codifica cuál es).
// ─────────────────────────────────────────────────────────────────────────────

export const TRIALS_STORAGE_KEY = 'sb_demo_trials_v1'
export const trialDataKey = (trialId) => `sb_demo_trial_data_${trialId}`
export const trialDeletedKey = (trialId) => `sb_demo_trial_deleted_${trialId}`

// Número de ventas Street Boss (el mismo que ya usa la landing pública)
export const WHATSAPP_VENTAS = '529612466204'

// Estados del prospecto en el pipeline
export const ESTADOS_PROSPECTO = ['Nuevo', 'Contactado', 'Prueba enviada', 'Ganado', 'Perdido']
export const ESTADOS_PRUEBA = {
  activa: 'Activa',
  pausada: 'Pausada',
  suspendida: 'Suspendida',
}

// Id corto único
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
export const slugify = (texto) => {
  const limpio = String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
  const palabrasExcluidas = new Set(['prueba', 'demo', 'test'])
  const palabras = limpio.split(/\s+/).filter(w => w && !palabrasExcluidas.has(w))
  return palabras.join('-').slice(0, 42)
}

// Código de 4 caracteres para el trialId (sin caracteres confusos)
const codigo4 = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// ── Helpers para construir menús semilla de forma compacta ──────────────────
const prod = (id, nombre, precio, descripcion = '') =>
  ({ id, nombre, precio, descripcion, agotado: false, activo: true, foto: null })
const cat = (id, nombre, productos) => ({ id, nombre, visible: true, productos })

// ── Las 10 DEMOS OFICIALES (nombres exactos de la landing) ──────────────────
// `clave` se usa como prefijo del trialId para auto-sembrar en otros navegadores.
export const DEMOS_OFICIALES = [
  {
    id: 'taqueria-el-guero', clave: 'guero', nombre: 'Taquería El Güero', emoji: '🌮', giro: 'Taquería',
    menu: [
      cat('guero-c1', '🌮 Tacos', [
        prod('guero-p1', 'Taco de pastor', 20, 'Con piña, cilantro y cebolla'),
        prod('guero-p2', 'Taco de suadero', 20, 'Suadero suave con salsa verde'),
        prod('guero-p3', 'Taco de bistec', 22, 'Bistec a la plancha'),
        prod('guero-p4', 'Taco campechano', 24, 'Bistec con longaniza'),
      ]),
      cat('guero-c2', '🫓 Especiales', [
        prod('guero-p5', 'Gringa de pastor', 45, 'Tortilla de harina con queso fundido'),
        prod('guero-p6', 'Volcán', 38, 'Tostada con queso gratinado y carne'),
        prod('guero-p7', 'Quesadilla con carne', 40, 'Hecha a mano, con la carne que elijas'),
      ]),
      cat('guero-c3', '🥤 Bebidas', [
        prod('guero-p8', 'Agua de horchata', 25),
        prod('guero-p9', 'Agua de jamaica', 25),
        prod('guero-p10', 'Refresco', 22),
      ]),
    ],
  },
  {
    id: 'gorditas-la-dona', clave: 'dona', nombre: 'Gorditas La Doña', emoji: '🫓', giro: 'Gorditas y antojitos',
    menu: [
      cat('dona-c1', '🫓 Gorditas', [
        prod('dona-p1', 'Gordita de chicharrón', 35, 'Chicharrón prensado en salsa'),
        prod('dona-p2', 'Gordita de tinga', 35, 'Tinga de pollo casera'),
        prod('dona-p3', 'Gordita de picadillo', 35, 'Picadillo con verdura'),
        prod('dona-p4', 'Gordita de rajas con queso', 33, 'Rajas poblanas con crema'),
      ]),
      cat('dona-c2', '🍽️ Antojitos', [
        prod('dona-p5', 'Sope preparado', 30, 'Frijol, lechuga, crema y queso'),
        prod('dona-p6', 'Quesadilla frita', 32, 'Con queso de hebra'),
      ]),
      cat('dona-c3', '☕ Bebidas', [
        prod('dona-p7', 'Café de olla', 20, 'Con piloncillo y canela'),
        prod('dona-p8', 'Agua del día', 22),
        prod('dona-p9', 'Refresco', 22),
      ]),
    ],
  },
  {
    id: 'birria-los-toritos', clave: 'toritos', nombre: 'Birria Los Toritos', emoji: '🐂', giro: 'Birriería',
    menu: [
      cat('toritos-c1', '🐂 Birria', [
        prod('toritos-p1', 'Taco de birria', 30, 'Tortilla doradita con consomé'),
        prod('toritos-p2', 'Quesabirria', 40, 'Con queso fundido y consomé'),
        prod('toritos-p3', 'Plato de birria', 130, 'Con tortillas, cebolla y limón'),
        prod('toritos-p4', 'Consomé grande', 45, 'Puro sabor del caldo'),
      ]),
      cat('toritos-c2', '➕ Extras', [
        prod('toritos-p5', 'Orden de tortillas', 15),
        prod('toritos-p6', 'Queso extra', 20),
      ]),
      cat('toritos-c3', '🥤 Bebidas', [
        prod('toritos-p7', 'Agua fresca', 25),
        prod('toritos-p8', 'Refresco', 22),
        prod('toritos-p9', 'Cerveza', 40),
      ]),
    ],
  },
  {
    id: 'mariscos-la-perla', clave: 'perla', nombre: 'Mariscos La Perla', emoji: '🦐', giro: 'Marisquería',
    menu: [
      cat('perla-c1', '🍹 Cocteles', [
        prod('perla-p1', 'Coctel de camarón chico', 95, 'Con aguacate y salsa de la casa'),
        prod('perla-p2', 'Coctel de camarón grande', 140, 'Bien servido'),
        prod('perla-p3', 'Campechana', 150, 'Camarón, pulpo y callo'),
      ]),
      cat('perla-c2', '🥙 Tostadas', [
        prod('perla-p4', 'Tostada de ceviche', 45, 'Ceviche de pescado fresco'),
        prod('perla-p5', 'Tostada de pulpo', 60, 'Pulpo con aguacate'),
      ]),
      cat('perla-c3', '🐟 Platillos', [
        prod('perla-p6', 'Mojarra frita', 130, 'Con arroz, ensalada y tortillas'),
        prod('perla-p7', 'Camarones a la diabla', 150, 'Picosos, con arroz'),
        prod('perla-p8', 'Filete empanizado', 120, 'Con papas y ensalada'),
      ]),
    ],
  },
  {
    id: 'tamales-dona-chucha', clave: 'chucha', nombre: 'Tamales Doña Chucha', emoji: '🫔', giro: 'Tamalería',
    menu: [
      cat('chucha-c1', '🫔 Tamales', [
        prod('chucha-p1', 'Tamal verde', 20, 'Pollo en salsa verde'),
        prod('chucha-p2', 'Tamal de mole', 22, 'Mole casero con pollo'),
        prod('chucha-p3', 'Tamal de rajas', 20, 'Rajas con queso'),
        prod('chucha-p4', 'Tamal de dulce', 18, 'Con pasas'),
      ]),
      cat('chucha-c2', '📦 Paquetes', [
        prod('chucha-p5', 'Media docena', 110, 'Surtidos a elegir'),
        prod('chucha-p6', 'Docena', 210, 'Surtidos a elegir'),
      ]),
      cat('chucha-c3', '☕ Bebidas', [
        prod('chucha-p7', 'Atole de arroz', 22),
        prod('chucha-p8', 'Champurrado', 25),
        prod('chucha-p9', 'Café de olla', 20),
      ]),
    ],
  },
  {
    id: 'pizza-callejera-don-nacho', clave: 'nacho', nombre: 'Pizza Callejera Don Nacho', emoji: '🍕', giro: 'Pizzería',
    menu: [
      cat('nacho-c1', '🍕 Pizzas', [
        prod('nacho-p1', 'Pepperoni', 99, 'Mozzarella y pepperoni'),
        prod('nacho-p2', 'Mexicana', 109, 'Chorizo, jalapeño y cebolla'),
        prod('nacho-p3', 'Hawaiana', 99, 'Jamón y piña'),
        prod('nacho-p4', 'Cuatro quesos', 119, 'Mezcla de la casa'),
      ]),
      cat('nacho-c2', '🍟 Complementos', [
        prod('nacho-p5', 'Alitas BBQ', 79, '6 piezas'),
        prod('nacho-p6', 'Papas gajo', 49, 'Con aderezo'),
      ]),
      cat('nacho-c3', '🥤 Bebidas', [
        prod('nacho-p7', 'Refresco 600ml', 25),
        prod('nacho-p8', 'Refresco 2L', 45),
      ]),
    ],
  },
  {
    id: 'cafe-el-molino', clave: 'molino', nombre: 'Café El Molino', emoji: '☕', giro: 'Cafetería',
    menu: [
      cat('molino-c1', '☕ Café', [
        prod('molino-p1', 'Americano', 35, 'Grano de la región'),
        prod('molino-p2', 'Capuchino', 45, 'Con espuma cremosa'),
        prod('molino-p3', 'Latte', 48, 'Suave y balanceado'),
        prod('molino-p4', 'Moka', 52, 'Con chocolate'),
      ]),
      cat('molino-c2', '🥐 Panadería', [
        prod('molino-p5', 'Concha', 18, 'Recién horneada'),
        prod('molino-p6', 'Croissant', 32, 'De mantequilla'),
        prod('molino-p7', 'Rebanada de pastel', 55, 'Pregunta el sabor del día'),
      ]),
      cat('molino-c3', '🍳 Desayunos', [
        prod('molino-p8', 'Chilaquiles', 75, 'Verdes o rojos, con pollo'),
        prod('molino-p9', 'Molletes', 60, 'Con pico de gallo'),
      ]),
    ],
  },
  {
    id: 'elotes-la-chela', clave: 'chela', nombre: 'Elotes La Chela', emoji: '🌽', giro: 'Elotes y esquites',
    menu: [
      cat('chela-c1', '🌽 Elotes y esquites', [
        prod('chela-p1', 'Elote preparado', 25, 'Mayonesa, queso y chile'),
        prod('chela-p2', 'Esquite chico', 25, 'Con todo'),
        prod('chela-p3', 'Esquite grande', 40, 'Con todo'),
      ]),
      cat('chela-c2', '🔥 Especiales', [
        prod('chela-p4', 'Elote loco', 45, 'Con toppings extra'),
        prod('chela-p5', 'Tostiesquite', 45, 'Sobre tostitos'),
        prod('chela-p6', 'Maruchan preparada', 50, 'Con esquite y toppings'),
      ]),
      cat('chela-c3', '🥤 Bebidas', [
        prod('chela-p7', 'Agua fresca', 22),
        prod('chela-p8', 'Refresco', 22),
      ]),
    ],
  },
  {
    id: 'hamburguesas-el-brutal', clave: 'brutal', nombre: 'Hamburguesas El Brutal', emoji: '🍔', giro: 'Hamburguesas',
    menu: [
      cat('brutal-c1', '🍔 Hamburguesas', [
        prod('brutal-p1', 'Clásica', 75, 'Carne, queso, lechuga y jitomate'),
        prod('brutal-p2', 'Doble carne', 105, 'Doble carne y doble queso'),
        prod('brutal-p3', 'Hawaiana', 85, 'Con piña y jamón'),
        prod('brutal-p4', 'La Brutal', 130, 'Triple carne, tocino y salsa secreta'),
      ]),
      cat('brutal-c2', '🍟 Complementos', [
        prod('brutal-p5', 'Papas a la francesa', 40, 'Porción grande'),
        prod('brutal-p6', 'Aros de cebolla', 45),
        prod('brutal-p7', 'Boneless 300g', 95, 'BBQ o búfalo'),
      ]),
      cat('brutal-c3', '🥤 Bebidas', [
        prod('brutal-p8', 'Refresco', 25),
        prod('brutal-p9', 'Malteada', 55, 'Chocolate, fresa o vainilla'),
      ]),
    ],
  },
  {
    id: 'pozoleria-la-guerrera', clave: 'guerrera', nombre: 'Pozolería La Guerrera', emoji: '🍲', giro: 'Pozolería',
    menu: [
      cat('guerrera-c1', '🍲 Pozole', [
        prod('guerrera-p1', 'Pozole chico', 70, 'Rojo o blanco, con maciza'),
        prod('guerrera-p2', 'Pozole grande', 95, 'Rojo o blanco, bien servido'),
        prod('guerrera-p3', 'Pozole especial', 115, 'Con surtida y aguacate'),
      ]),
      cat('guerrera-c2', '🥙 Antojitos', [
        prod('guerrera-p4', 'Tostada de pata', 35),
        prod('guerrera-p5', 'Tostada de tinga', 35),
        prod('guerrera-p6', 'Tacos dorados (3)', 45, 'De pollo, con crema y queso'),
      ]),
      cat('guerrera-c3', '🥤 Bebidas', [
        prod('guerrera-p7', 'Agua fresca', 25),
        prod('guerrera-p8', 'Refresco', 22),
        prod('guerrera-p9', 'Cerveza', 40),
      ]),
    ],
  },
]

// ── Mensaje de interés por demo (PARTE 3 — preparado, sin tocar producción) ──
// Formato exacto pedido: “Hola, me interesa este demo: [NOMBRE_DEMO]”
export const mensajeInteres = (nombreDemo) => `Hola, me interesa este demo: ${nombreDemo}`
export const urlWhatsAppInteres = (nombreDemo) =>
  `https://wa.me/${WHATSAPP_VENTAS}?text=${encodeURIComponent(mensajeInteres(nombreDemo))}`

export const buscarDemo = (demoId) => DEMOS_OFICIALES.find(d => d.id === demoId) || null
export const buscarDemoPorClave = (clave) => DEMOS_OFICIALES.find(d => d.clave === clave) || null

// ── Trial: id y datos semilla ────────────────────────────────────────────────
// El trialId nuevo incluye negocio + demo + código:
// "<nombre-negocio>-<clave-demo>-<COD4>" (ej. antojitos-la-prueba-guero-K7P2).
// Links viejos "<clave>-<COD4>" siguen funcionando.
// Así, otro navegador puede auto-sembrar la prueba sin registro previo.
export const generarTrialId = (demo, nombreNegocio = '') => {
  const negocioSlug = slugify(nombreNegocio) || 'prueba'
  return `${negocioSlug}-${demo.clave}-${codigo4()}`
}
export const claveDeTrialId = (trialId) => {
  const partes = String(trialId || '').split('-').filter(Boolean)
  if (partes.length >= 3) return partes[partes.length - 2]
  return partes[0] || ''
}
export const codigoAccesoDeTrialId = (trialId) => {
  const partes = String(trialId || '').split('-').filter(Boolean)
  return partes[partes.length - 1] || ''
}

// Datos editables iniciales de una prueba (copia profunda del menú semilla)
export const crearDatosPrueba = (demo, nombreNegocio, codigoAcceso = '') => ({
  demoId: demo.id,
  codigoAcceso: codigoAcceso || '',
  status: 'activa',
  creado: new Date().toISOString(),
  negocio: {
    nombre: (nombreNegocio || '').trim() || demo.nombre,
    logo: '',
    telefono: '',
    whatsapp: '',
    direccion: '',
    urlMaps: '',
    horarios: 'Lun a Dom · 9:00 am – 9:00 pm',
    servicioDomicilio: true,
    modoEnvio: 'pendiente',
    costoEnvio: 30,
    costoEnvioKm: 12,
    tiempoEntrega: '30–40 min',
    mensajeClientes: '¡Gracias por tu preferencia! Haz tu pedido y te lo preparamos al momento. 🔥',
    redes: {
      instagram: '',
      facebook: '',
      tiktok: '',
    },
  },
  menu: JSON.parse(JSON.stringify(demo.menu)),
})
