const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const POSTS_PATH = path.join(__dirname, 'src', 'data', 'posts.json');

let existingPosts = [];
if (fs.existsSync(POSTS_PATH)) {
  try { existingPosts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8')); }
  catch(e) { console.error(e); }
}
const postsMap = new Map(existingPosts.map(p => [p.id, p]));

// Selección determinista (misma semilla => mismo resultado, reproducible).
function seededRandom(seedStr) {
  const hash = crypto.createHash('md5').update(seedStr).digest('hex');
  return parseInt(hash.substring(0, 8), 16) / 0xffffffff;
}
function getDeterministic(arr, seedStr) {
  return arr[Math.floor(seededRandom(seedStr) * arr.length)];
}

const PILARES = ["Venta directa", "Cero comisión", "Control del negocio", "Mobile First"];
const FUNNELS = ["TOFU (Awareness)", "MOFU (Consideration)", "BOFU (Conversion)"];
const AUDIENCES = ["Dueños de restaurantes", "Emprendedores gastronómicos", "Operadores de franquicias"];
const OBJECTIVES = ["Brand Awareness", "Lead Generation", "Direct Demo Booking"];

// Perfiles de negocio (basados en la human-stories-library). Mantienen coherencia
// entre protagonista, escenario y platillo dentro del mismo prompt.
const BUSINESS_PROFILES = [
  { biz: "Taquería callejera",   prot: "el taquero dueño de un puesto de tacos",              set: "un puesto de tacos de barrio con plancha reluciente",         food: "tacos al pastor recién servidos con piña y cilantro" },
  { biz: "Hamburguesería",       prot: "la pareja dueña de una hamburguesería artesanal",     set: "una hamburguesería artesanal de local pequeño y cuidado",     food: "una hamburguesa artesanal jugosa con papas doradas" },
  { biz: "Repostería desde casa",prot: "la repostera que vende postres desde su cocina",       set: "una cocina casera ordenada convertida en repostería",         food: "un pastel decorado a mano y galletas artesanales" },
  { biz: "Food truck",           prot: "el joven emprendedor dueño de un food truck",          set: "un food truck estacionado en una calle concurrida al atardecer", food: "comida callejera gourmet servida en empaques kraft" },
  { biz: "Restaurante familiar", prot: "la dueña de una fonda familiar",                       set: "una fonda familiar de barrio, cálida y acogedora",            food: "un platillo casero abundante recién montado" },
  { biz: "Cafetería",            prot: "el barista dueño de una cafetería de esquina",         set: "una cafetería de especialidad luminosa y minimalista",        food: "un café de especialidad con arte latte y pan artesanal" },
  { biz: "Cocina económica",     prot: "la cocinera de una cocina económica",                  set: "una cocina económica sencilla y muy limpia",                  food: "una comida corrida balanceada y colorida" },
  { biz: "Alitas",               prot: "el dueño de un local de alitas",                       set: "un local de alitas moderno de ambiente casual",               food: "alitas glaseadas brillantes con salsas variadas" },
  { biz: "Hot dogs",             prot: "el vendedor de hot dogs gourmet",                      set: "un carrito de hot dogs gourmet muy pulcro",                   food: "hot dogs gourmet con toppings frescos" },
  { biz: "Marisquería",          prot: "el dueño de una marisquería costera",                  set: "una marisquería costera fresca y ventilada",                  food: "mariscos frescos, ceviche y tostadas coloridas" },
  { biz: "Panadería",            prot: "la panadera dueña de una panadería tradicional",       set: "una panadería tradicional con vitrinas ordenadas",            food: "pan recién horneado y conchas doradas" },
  { biz: "Comida regional",      prot: "la cocinera de un restaurante de comida regional",     set: "un restaurante de comida regional auténtico",                 food: "un platillo típico regional presentado con orgullo" },
];

const PROTAGONIST_ACTIONS = [
  "atendiendo con calma un pedido que acaba de entrar a su teléfono",
  "mostrando su menú digital en la pantalla del celular a un cliente",
  "terminando de montar un platillo mientras suena la notificación de un nuevo pedido",
  "revisando en su smartphone la orden que un vecino acaba de enviar",
  "empacando con cuidado un pedido listo para entregar, teléfono en mano",
  "confirmando tranquilo una venta directa desde su teléfono",
];
const EMOTIONS = [
  "control y orgullo tranquilo, jamás estrés",
  "la satisfacción serena de quien maneja su propio negocio",
  "concentración amable y confianza",
  "la alegría contenida de una venta bien hecha",
];
const ANGLES = [
  "Toma a la altura del sujeto, ligeramente en picada",
  "Primer plano (close-up) documental del sujeto y su teléfono",
  "Plano general (wide shot) que sitúa al protagonista en su negocio",
  "Ángulo a nivel de los ojos, íntimo y directo",
  "Ángulo picado suave sobre el mostrador",
  "Ángulo contrapicado sutil que dignifica al protagonista",
];
const LIGHTING = [
  "Iluminación natural direccional y cálida tipo hora dorada entrando por una ventana lateral",
  "Luz suave y difusa de día nublado que envuelve la escena",
  "Clave baja (low-key) con sombras profundas y un haz cálido sobre el sujeto",
  "Luz de mediodía natural, limpia y neutra",
  "Luz cálida de lámparas colgantes del propio local",
  "Contraluz suave de atardecer con reborde luminoso en el sujeto",
];
const LENSES = [
  "lente estándar 50mm",
  "teleobjetivo corto 85mm",
  "gran angular 35mm de reportaje",
  "lente 28mm que integra al sujeto con su entorno",
];
const DOF = [
  "profundidad de campo media que mantiene nítidos al protagonista y su teléfono y suaviza el fondo",
  "profundidad de campo superficial con el fondo del local suavemente desenfocado (bokeh natural)",
  "gran profundidad de campo que conserva legible todo el negocio",
];
const ACCENT_DETAIL = [
  "un detalle del delantal o el uniforme",
  "el empaque de la comida",
  "un reflejo cálido sobre la superficie",
  "un pequeño letrero o rótulo del local",
  "el vaso, servilleta o bolsa de la marca",
];
const MOODS = [
  "sobrio, premium y documental",
  "cálido, humano y auténtico",
  "limpio, moderno y confiable",
];

// Zona segura: dónde queda el espacio despejado para superponer texto/logo.
const SAFE_ZONES = [
  "El tercio superior y el lateral izquierdo quedan despejados y ligeramente oscurecidos (zona segura) para el titular y el logo.",
  "El tercio inferior lleva una viñeta oscura (zona segura) reservada para el titular y el botón de CTA.",
  "Los márgenes laterales quedan libres (zonas seguras) para la UI vertical de Reels/TikTok y el logo arriba.",
  "El centro-superior queda despejado (zona segura) para el logo y un titular corto.",
  "La mitad superior se mantiene limpia y desenfocada (zona segura) para titular, subtítulo y logo.",
];

const NEGATIVE_MASTER = "desorden, superficies sucias, cocina caótica, objetos amontonados, basura, cables sueltos, manos deformes, dedos de más, rostros de cera, comida de plástico, sonrisas de stock, texto generado por IA, logotipos o letreros ilegibles, hologramas, interfaces flotantes, app inventada en la pantalla, neón cyberpunk, render 3D, ilustración, caricatura, vapor excesivo, saturación extrema, exceso de naranja, estética de stock";
const SAFE_CLEAN = "Entorno limpio y ordenado, superficies despejadas, mise en place impecable, sin desorden.";

// ─────────────────────────────────────────────────────────────
// PROMPT DE IMAGEN: un solo bloque, 5 párrafos ricos + negativo integrado.
// Identidad corporativa StreetBoss anclada en cada pieza.
// ─────────────────────────────────────────────────────────────
function generateImagePrompt(id) {
  const p = getDeterministic(BUSINESS_PROFILES, id + 'biz');
  const action = getDeterministic(PROTAGONIST_ACTIONS, id + 'act');
  const emotion = getDeterministic(EMOTIONS, id + 'emo');
  const angle = getDeterministic(ANGLES, id + 'ang');
  const light = getDeterministic(LIGHTING, id + 'lit');
  const lens = getDeterministic(LENSES, id + 'len');
  const dof = getDeterministic(DOF, id + 'dof');
  const accent = getDeterministic(ACCENT_DETAIL, id + 'acc');
  const mood = getDeterministic(MOODS, id + 'mood');
  const zone = getDeterministic(SAFE_ZONES, id + 'safe');

  const protDe = p.prot.replace(/^el /, 'del ').replace(/^la /, 'de la ');
  const p1 = `1 · ESCENA Y PROTAGONISTA. Fotografía documental ${protDe}, ${action}. Su expresión transmite ${emotion}. Sostiene un smartphone oscuro y sencillo mientras trabaja; el momento capta dignidad, esfuerzo honesto y la satisfacción de vender directo a su comunidad.`;

  const p2 = `2 · NEGOCIO Y GASTRONOMÍA. El lugar es ${p.set}: superficies impecablemente limpias y ordenadas, mise en place pulcro, sin nada de caos. En primer plano, ${p.food}, con fidelidad gastronómica y aspecto real y apetitoso, jamás plástico ni exagerado. Ambiente cálido, humano y creíble, lejos del restaurante de lujo o la cocina de estudio.`;

  const p3 = `3 · DIRECCIÓN FOTOGRÁFICA. ${angle}, con ${lens} y ${dof}. ${light}, con sombras suaves y realistas. Fotorrealismo extremo, estética de reportaje de vida cotidiana, grano fino natural, sin filtros digitales artificiales ni HDR agresivo.`;

  const p4 = `4 · COLOR E IDENTIDAD CORPORATIVA. Paleta anclada en StreetBoss: base de carbón profundo (Boss Charcoal #0D0E12) en sombras y fondo, superficies neutras tipo Paper White (#F5F5F7), y un único acento de Street Orange (#FF4B00) usado con moderación en ${accent}, nunca saturando la imagen. Cero cast naranja global, cero teal-and-orange. El resultado se siente ${mood}, coherente con una marca FoodTech seria.`;

  const p5 = `5 · COMPOSICIÓN, ZONA SEGURA Y RESTRICCIONES. Composición según la regla de los tercios, con el protagonista y el teléfono anclados en el tercio inferior derecho. ${zone} El teléfono debe ser un rectángulo oscuro genérico, SIN interfaz visible, sin app inventada, sin logos falsos ni pantallas brillantes. ${SAFE_CLEAN} Evitar (negativo): ${NEGATIVE_MASTER}.`;

  return [p1, p2, p3, p4, p5].join('\n\n');
}

// ─────────────────────────────────────────────────────────────
// POST-PRODUCCIÓN: frases y logo que se AGREGAN encima de la imagen ya generada.
// Van en secciones aparte, NO dentro del prompt.
// ─────────────────────────────────────────────────────────────
const OVERLAY_TITULARES = [
  "Deja de rentar tus clientes", "Cero comisiones. Siempre.", "Tu marca, tus reglas",
  "Vende directo por WhatsApp", "Recupera tu 30%", "El control vuelve a tus manos",
  "Tu propio escaparate digital", "Adiós intermediarios", "Tu menú, sin apps",
  "Pedidos directos, sin fricción", "Digitaliza tu negocio hoy", "Vende como los grandes",
];
const OVERLAY_SUBTITULOS = [
  "Tu propia página web de ventas por WhatsApp. Cero comisiones.",
  "El escaparate digital que tu negocio merece, sin intermediarios.",
  "Tus clientes ven tu menú con fotos reales y te piden directo.",
  "Sin descargar apps. Sin porcentajes abusivos. Solo tus ventas.",
  "Recibe pedidos ordenados en tu WhatsApp y quédate con todo.",
  "Un enlace propio, mobile first, listo para vender.",
];
const LOGO_VERSIONS = [
  "Isotipo oficial StreetBoss (SB) en Paper White",
  "Lockup horizontal StreetBoss en Paper White",
  "Isotipo oficial StreetBoss (SB) monocromo Boss Charcoal",
];
const LOGO_POSITIONS = [
  "Esquina superior izquierda", "Esquina superior derecha", "Centro superior",
];

function generateOverlay(id) {
  return {
    titular: getDeterministic(OVERLAY_TITULARES, id + 'ovt'),
    subtitulo: getDeterministic(OVERLAY_SUBTITULOS, id + 'ovs'),
    ctaVisual: "Pide tu demo 👉 wa.me/529613725386",
  };
}
function generateLogo(id) {
  return {
    version: getDeterministic(LOGO_VERSIONS, id + 'lgv'),
    ubicacion: getDeterministic(LOGO_POSITIONS, id + 'lgp'),
    margen: "8% de margen de seguridad en todos los bordes",
  };
}

// ─── Hooks (150 combinaciones) ───
const HOOKS_BASE = [
  "𝗧𝘂 𝗻𝗲𝗴𝗼𝗰𝗶𝗼 𝗻𝗼 𝗻𝗲𝗰𝗲𝘀𝗶𝘁𝗮 𝘃𝗲𝗻𝗱𝗲𝗿 𝗺𝗲𝗻𝗼𝘀 𝗽𝗮𝗿𝗮 𝗰𝗿𝗲𝗰𝗲𝗿.",
  "𝗘𝗹 𝗰𝗼𝗻𝘁𝗿𝗼𝗹 𝗱𝗲 𝘁𝘂 𝗿𝗲𝘀𝘁𝗮𝘂𝗿𝗮𝗻𝘁𝗲 𝘃𝘂𝗲𝗹𝘃𝗲 𝗮 𝘁𝘂𝘀 𝗺𝗮𝗻𝗼𝘀.",
  "¿𝗖𝗮𝗻𝘀𝗮𝗱𝗼 𝗱𝗲 𝗽𝗲𝗿𝗱𝗲𝗿 𝗲𝗹 𝟯𝟬% 𝗲𝗻 𝗰𝗼𝗺𝗶𝘀𝗶𝗼𝗻𝗲𝘀?",
  "𝗟𝗮 𝘃𝗲𝗻𝘁𝗮 𝗱𝗶𝗿𝗲𝗰𝘁𝗮 𝗲𝘀 𝗲𝗹 𝗳𝘂𝘁𝘂𝗿𝗼 𝗱𝗲 𝗹𝗮 𝗴𝗮𝘀𝘁𝗿𝗼𝗻𝗼𝗺𝗶́𝗮.",
  "𝗦𝗶𝗻 𝗰𝗼𝗺𝗶𝘀𝗶𝗼𝗻𝗲𝘀. 𝗦𝗶𝗻 𝗶𝗻𝘁𝗲𝗿𝗺𝗲𝗱𝗶𝗮𝗿𝗶𝗼𝘀.",
  "𝗧𝘂 𝗺𝗮𝗿𝗰𝗮, 𝘁𝘂𝘀 𝗰𝗹𝗶𝗲𝗻𝘁𝗲𝘀, 𝘁𝘂𝘀 𝗴𝗮𝗻𝗮𝗻𝗰𝗶𝗮𝘀.",
  "𝗘𝗹 𝗲𝘀𝗰𝗮𝗽𝗮𝗿𝗮𝘁𝗲 𝗱𝗶𝗴𝗶𝘁𝗮𝗹 𝗾𝘂𝗲 𝗺𝗲𝗿𝗲𝗰𝗲𝘀.",
  "𝗩𝗲𝗻𝗱𝗲 𝗽𝗼𝗿 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗰𝗼𝗺𝗼 𝘂𝗻 𝗽𝗿𝗼𝗳𝗲𝘀𝗶𝗼𝗻𝗮𝗹.",
  "𝗗𝗲𝗷𝗮 𝗱𝗲 𝗿𝗲𝗻𝘁𝗮𝗿 𝘁𝘂𝘀 𝗰𝗹𝗶𝗲𝗻𝘁𝗲𝘀.",
  "𝗨𝗻𝗮 𝗲𝘅𝗽𝗲𝗿𝗶𝗲𝗻𝗰𝗶𝗮 𝗱𝗲 𝗽𝗲𝗱𝗶𝗱𝗼 𝗾𝘂𝗲 𝗲𝗻𝗮𝗺𝗼𝗿𝗮."
];
const HOOK_MODIFIERS = [
  "Descubre cómo.", "Hoy es el día.", "Piénsalo un segundo.", "Te explico por qué.",
  "Mira los números.", "Es más fácil de lo que crees.", "La tecnología está de tu lado.",
  "No regales tu trabajo.", "El secreto de los mejores.", "Da el salto digital.",
  "Imagina esto en tu local.", "Cientos ya lo hacen.", "El cambio es ahora.",
  "Optimiza tu margen.", "Recupera tu rentabilidad.", "Aumenta tus ventas.", "Cero intermediarios.", "Escala tu negocio.", "Fácil y rápido."
];
function generateHook(id) {
  return `${getDeterministic(HOOKS_BASE, id + 'h1')} ${getDeterministic(HOOK_MODIFIERS, id + 'h2')}`;
}

const CTAS_FUNNEL = {
  "TOFU (Awareness)": [
    "Mira cómo funciona nuestro escaparate: https://wa.me/529613725386",
    "Conoce más sobre la venta sin comisiones: https://wa.me/529613725386",
    "Descubre StreetBoss para tu negocio: https://wa.me/529613725386"
  ],
  "MOFU (Consideration)": [
    "Compara tus ganancias y pide un demo: https://wa.me/529613725386",
    "Habla con un asesor sobre tu restaurante: https://wa.me/529613725386",
    "Calcula cuánto ahorrarías con nosotros: https://wa.me/529613725386"
  ],
  "BOFU (Conversion)": [
    "Activa tu venta directa hoy mismo: https://wa.me/529613725386",
    "Solicita tu instalación inmediata por WhatsApp: https://wa.me/529613725386",
    "Comienza a vender 100% libre de comisiones ya: https://wa.me/529613725386"
  ]
};

const MOTION_MOVEMENTS = ["Slider de izq a der", "Dolly-in muy sutil", "Whip-pan rápido", "Toma estática", "Tilt down suave"];
const MOTION_SUBJECTS = ["hacia el platillo humeante", "siguiendo las manos del chef", "enfocando la notificación del celular", "revelando la barra de despacho", "mostrando el empaque listo"];
const MOTION_SPEEDS = ["Slow motion cinemático (0.5x)", "Tiempo real dinámico", "Aceleración rítmica"];
function generateMotionPrompt(id) {
  return `${getDeterministic(MOTION_MOVEMENTS, id + 'm1')} ${getDeterministic(MOTION_SUBJECTS, id + 'm2')}. ${getDeterministic(MOTION_SPEEDS, id + 'm3')}.`;
}

function getBody(id, network, pilar) {
  const bodies = {
    Instagram: [
      `La estética visual de tus platillos es solo el principio. Si estás hablando de ${pilar}, la realidad es que necesitas un sistema que luzca tan bien como tu comida. Con StreetBoss, tu menú digital se vuelve una experiencia premium en el celular de tu cliente.\n\nTodo conectado directamente a tu WhatsApp, sin comisiones que castiguen tu esfuerzo en la cocina.`,
      `Detrás de cada platillo hay horas de preparación. ¿Por qué ceder el 30% a plataformas de terceros? El enfoque en ${pilar} significa tomar el mando. Tu identidad visual se respeta al 100% en tu propio enlace web, y los pedidos entran ordenados a tu WhatsApp.\n\nProtege tus márgenes y enamora a tu comunidad al mismo tiempo.`
    ],
    Facebook: [
      `Sabemos lo duro que es mantener un restaurante a flote hoy en día. Entre los costos de insumos y los gastos operativos, hablar de ${pilar} no es un lujo, es una necesidad de supervivencia.\n\nMuchos negocios locales en nuestra comunidad están cambiando la forma en que reciben órdenes. StreetBoss no es una simple aplicación, es tu propia página web enfocada en ventas por WhatsApp. Los vecinos de tu comunidad pueden ver tu menú con fotos reales, elegir sus variaciones y mandarte su orden sin descargar nada y sin que te cobren porcentajes abusivos.\n\nComparte este mensaje con ese amigo restaurantero que necesita recuperar el control de su negocio.`,
      `El boca a boca siempre ha sido la mejor publicidad, pero ¿cómo lo digitalizas? Si tu prioridad es ${pilar}, tienes que ofrecer un canal de compra fácil para los vecinos.\n\nCon un enlace de StreetBoss, cualquier persona en Facebook puede ir directo a tu menú web, ver promociones y pedirte por WhatsApp en tres toques. Mantenlo simple, mantén el control y quédate con todo el dinero de tus ventas. Etiqueta a tu equipo de trabajo.`
    ],
    TikTok: [
      `POV: Dejaste de regalar el 30% de tus ventas y ahora aplicas ${pilar}. 🚀\nLiteralmente puedes recibir pedidos súper estructurados por WhatsApp sin comisiones.\nTus clientes abren tu link, escogen, y bum: orden confirmada. 🔥`,
      `¿Aún usas notas de voz o menús en PDF borrosos? 🚩🚩🚩\nAplica ${pilar} ya mismo. Con StreetBoss tienes un link súper pro. El cliente ve fotos increíbles, escoge, y te llega el pedido limpio a WhatsApp. Sin apps. Sin comisiones. Punto. 😎`
    ],
    WhatsApp: [
      `🚨 *Evita pagar comisiones por tus pedidos*\n\nCon StreetBoss, logras ${pilar} al instante:\n✅ Link propio para tu menú web.\n✅ Pedidos directos a este chat.\n✅ Cero comisiones de por medio.\n\nRevisa nuestro menú aquí mismo y prueba la experiencia.`,
      `¿Sabías que nuestro enfoque en ${pilar} te beneficia?\n\nAl no usar intermediarios, podemos ofrecerte la mejor calidad al precio justo. Haz tu pedido a través de nuestro enlace web directo.\n\n👇 Rápido, fácil y sin apps pesadas.`
    ],
    LinkedIn: [
      `En la industria FoodTech, la retención de márgenes es el KPI más crítico. Hoy discutimos sobre ${pilar} y su impacto en la rentabilidad de las franquicias y operadores locales.\n\nEl modelo de agregadores tradicionales es insostenible a largo plazo para las dark kitchens y restaurantes independientes. StreetBoss propone una infraestructura descentralizada: un escaparate web 'Mobile First' que canaliza las ventas directamente a la línea de WhatsApp del negocio. \n\nCero fricción para el usuario final, retención del 100% de la data y eliminación de la comisión por transacción. Un modelo de negocio más limpio y escalable.`,
      `Escalar las operaciones de un restaurante requiere optimización tecnológica. Abordar ${pilar} es fundamental para proteger el EBITDA.\n\nImplementar un menú web como StreetBoss no solo elimina el CAC artificial de las plataformas de terceros, sino que estructura la ingesta de pedidos vía WhatsApp Business, permitiendo que la cocina opere con eficiencia industrial sin sacrificar la relación directa B2C.`
    ],
    YouTube: [
      `En este Short te mostramos por qué ${pilar} es el cambio que tu restaurante necesita.\n\nOlvídate de las aplicaciones de delivery que te quitan tus ganancias. Con nuestro sistema web, el cliente ve tu comida en alta resolución desde su teléfono y la orden llega directamente a tu WhatsApp, perfectamente detallada y lista para cocinar.\n\n👇 Suscríbete y mira el enlace en la descripción para más detalles.`,
      `Mira cómo funciona un restaurante que domina ${pilar}. \n\nNo necesitas ser un ingeniero para tener un escaparate web brutal. StreetBoss convierte a tus espectadores en clientes mandando el pedido a tu WhatsApp sin instalar absolutamente nada.\n\nNo olvides darle like y dejarnos en los comentarios qué platillo venderías primero.`
    ]
  };

  const options = bodies[network] || bodies['Instagram'];
  return getDeterministic(options, id + 'nb');
}

function generateNetworkCopy(id, network, pilar, hook, cta) {
  const body = getBody(id, network, pilar);
  if (network === 'TikTok' || network === 'WhatsApp') {
    return `${hook}\n\n${body}\n\n${cta}`;
  }
  return `${hook}\n\n${body}\n\n${cta}\n\n#StreetBoss #FoodTech #VentaDirecta #Restaurantes`;
}

// ─────────────────────────────────────────────────────────────
// INSTAGRAM — campos operativos: SIN links en el contenido publicable,
// prompt unificado (visual + texto + negative) y prompt de texto de diseño.
// ─────────────────────────────────────────────────────────────
const INSTAGRAM_CTA = {
  "TOFU (Awareness)": ["Descubre cómo vender directo.", "Conoce cómo funciona StreetBoss.", "Revisa el enlace de nuestro perfil.", "Escríbenos para recibir información."],
  "MOFU (Consideration)": ["Escríbenos por mensaje directo.", "Mándanos un mensaje y conoce StreetBoss.", "Solicita información por mensaje.", "Escríbenos para recibir información."],
  "BOFU (Conversion)": ["Pide tu demo por mensaje.", "Envía “DEMO” por mensaje directo.", "Solicita tu demostración.", "Escríbenos y agenda tu demostración."],
};
const INSTAGRAM_CTA_VISUAL = ["Pide tu demo", "Escríbenos por mensaje", "Manda “DEMO”", "Conoce StreetBoss", "Vende directo", "Solicita información", "Descubre cómo funciona", "Revisa el enlace del perfil"];
const INSTAGRAM_HASHTAGS = ["#StreetBoss", "#VentaDirecta", "#Restaurantes", "#FoodTech", "#PedidosPorWhatsApp"];
const TEXT_POSITIONS = [
  { titular: "zona superior izquierda", alin: "izquierda", logo: "esquina superior derecha" },
  { titular: "zona superior centrada", alin: "centro", logo: "esquina inferior derecha" },
  { titular: "franja inferior sobre la viñeta", alin: "izquierda", logo: "esquina superior izquierda" },
];

// Prompt visual (5 párrafos) SIN el negative, para el bloque unificado de Instagram.
function generateVisualOnly(id) {
  return generateImagePrompt(id).replace(/\s*Evitar \(negativo\):[\s\S]*$/, '').trim();
}

// CORRECCIÓN 1: un solo campo con visual + texto que se agregará + negative.
function generateInstagramPromptCompleto(id, overlay) {
  const sep = "━━━━━━━━━━━━━━━━━━━━━━━━━━";
  const visual = generateVisualOnly(id);
  const textoResumen = `Reservar zona segura para el texto que se añadirá en diseño (la imagen base se genera SIN texto y SIN logo):\n• Titular: “${overlay.titular}”\n• Subtítulo: “${overlay.subtitulo}”\n• CTA visual: “${overlay.ctaVisual}”\n• Logotipo oficial: se coloca manualmente al final, NO se genera dentro de la imagen.`;
  return [visual, sep, "TEXTO QUE SE AGREGARÁ DESPUÉS", sep, textoResumen, sep, "NEGATIVE PROMPT", sep, NEGATIVE_MASTER].join('\n\n');
}

// CORRECCIÓN 4: convierte el "texto de imagen" en un prompt de diseño operativo.
function generateInstagramTextoFinal(id, overlay) {
  const pos = getDeterministic(TEXT_POSITIONS, id + 'pos');
  return [
    "La imagen base se genera limpia, SIN texto y SIN logo. Aplicar el texto en diseño, después de generar la foto:",
    "",
    `TITULAR — ${pos.titular}, alineación ${pos.alin}, jerarquía 1, tamaño grande, MAYÚSCULAS, peso Bold, alto contraste, legibilidad móvil:`,
    `“${overlay.titular}”`,
    "",
    "SUBTÍTULO — debajo del titular, jerarquía 2, tamaño medio, peso Medium:",
    `“${overlay.subtitulo}”`,
    "",
    "CTA VISUAL — jerarquía 3, corto (2-6 palabras), como invitación visual, NUNCA como botón ni enlace clicable:",
    `“${overlay.ctaVisual}”`,
    "",
    "REGLAS DE MARCA: tipografía oficial StreetBoss (o la autorizada más cercana); texto en Paper White (#F5F5F7) sobre la zona oscurecida; un único acento Street Orange (#FF4B00). Degradado oscuro sutil bajo el texto si falta contraste.",
    "ESPACIO SEGURO: márgenes de Instagram 4:5; no cubrir rostros, manos, teléfonos ni alimentos principales.",
    `LOGO: reservar espacio en ${pos.logo} para colocar el logotipo oficial manualmente al final. NO generar el logo dentro de la imagen.`,
    "RESTRICCIONES: sin URL, sin dominio, sin número telefónico, sin código QR, sin enlaces, sin “da clic”. El CTA es una invitación visual, no un botón.",
  ].join('\n');
}

// Negative apto para texto rotulado (ya NO prohíbe el texto de marca; sí el mal texto y logos falsos).
const NEGATIVE_TEXT = "desorden, superficies sucias, cocina caótica, objetos amontonados, basura, cables sueltos, manos deformes, dedos de más, rostros de cera, comida de plástico, sonrisas de stock, letreros ilegibles en el fondo, texto con faltas de ortografía, logotipos falsos, marcas de agua, isotipos inventados, hologramas, interfaces flotantes, app inventada en la pantalla, neón cyberpunk, render 3D, ilustración, caricatura, vapor excesivo, saturación extrema, exceso de naranja, estética de stock";
const delDe = (s) => s.replace(/^el /, 'del ').replace(/^la /, 'de la ');

// AJUSTE FINAL: prompt de imagen COMPLETO, listo para generar, con el texto EXACTO
// incrustado (titular/subtítulo/CTA), posiciones, jerarquía, colores, logo manual y
// negative integrado, todo en un solo bloque.
function generateFullPrompt(id, overlay) {
  const p = getDeterministic(BUSINESS_PROFILES, id + 'biz');
  const action = getDeterministic(PROTAGONIST_ACTIONS, id + 'act');
  const emotion = getDeterministic(EMOTIONS, id + 'emo');
  const angle = getDeterministic(ANGLES, id + 'ang');
  const light = getDeterministic(LIGHTING, id + 'lit');
  const lens = getDeterministic(LENSES, id + 'len');
  const dof = getDeterministic(DOF, id + 'dof');
  const accent = getDeterministic(ACCENT_DETAIL, id + 'acc');
  const mood = getDeterministic(MOODS, id + 'mood');
  const pos = getDeterministic(TEXT_POSITIONS, id + 'pos');
  const sep = "━━━━━━━━━━━━━━━━━━━━━━━━━━";
  const titular = (overlay.titular || '').toUpperCase();
  const hasSub = !!overlay.subtitulo;
  return [
    `1. ESCENA Y OBJETIVO. Fotografía documental de ${delDe(p.prot)}, ${action}. Transmite ${emotion}. Objetivo comercial: comunicar venta directa por WhatsApp y control del negocio.`,
    `2. DIRECCIÓN FOTOGRÁFICA. ${angle}, con ${lens} y ${dof}. Fotorrealismo extremo, estética de reportaje de vida cotidiana, grano fino natural, sin filtros digitales artificiales ni HDR agresivo.`,
    `3. COMPOSICIÓN. Regla de los tercios; el protagonista y su teléfono anclados en el tercio inferior derecho; la ${pos.titular} queda despejada para alojar el texto.`,
    `4. GASTRONOMÍA. El lugar es ${p.set}: superficies impecablemente limpias y ordenadas, mise en place pulcro. En primer plano, ${p.food}, real y apetitoso, jamás plástico ni exagerado.`,
    `5. ILUMINACIÓN. ${light}, con sombras suaves y realistas.`,
    `6. ESPACIO NEGATIVO. La mitad superior y la ${pos.titular} se mantienen limpias y oscurecidas para alojar el texto con alto contraste. ${SAFE_CLEAN}`,
    sep,
    "TEXTO QUE DEBE APARECER RENDERIZADO EN LA IMAGEN (rotulado nítido, ortografía perfecta):",
    `7. TITULAR (texto exacto): “${titular}”`,
    hasSub ? `8. SUBTÍTULO (texto exacto): “${overlay.subtitulo}”` : "8. SUBTÍTULO: no aplica en esta pieza.",
    `9. CTA VISUAL (texto exacto, como invitación visual, NUNCA como botón ni enlace): “${overlay.ctaVisual}”`,
    `10. UBICACIÓN DEL TITULAR: ${pos.titular}, alineación ${pos.alin}.`,
    hasSub ? "11. UBICACIÓN DEL SUBTÍTULO: justo debajo del titular, con la misma alineación." : "11. UBICACIÓN DEL SUBTÍTULO: no aplica.",
    "12. UBICACIÓN DEL CTA: debajo del subtítulo (o del titular si no hay subtítulo), en el mismo bloque de texto.",
    "13. JERARQUÍA TIPOGRÁFICA: Titular en Bold y MAYÚSCULAS (mayor tamaño) › Subtítulo en Medium (tamaño medio) › CTA en Semibold (menor tamaño). Tipografía sans serif limpia, muy legible en móvil.",
    "14. MÁRGENES SEGUROS: respetar 8% de margen en todos los bordes; formato 4:5; el texto no cubre rostros, manos, teléfonos ni los alimentos principales.",
    `15. COLORES OFICIALES: texto en Paper White (#F5F5F7) sobre fondo Boss Charcoal (#0D0E12) oscurecido; un único acento Street Orange (#FF4B00) en ${accent}. Resultado ${mood}.`,
    "16. LOGOTIPO: NO generar el logotipo. NO generar isotipos ni marcas de agua. El logotipo oficial será agregado manualmente después.",
    sep,
    `NEGATIVE PROMPT: ${NEGATIVE_TEXT}`,
  ].join('\n\n');
}

// Fechas oficiales de inicio por red (sin drift, con Date.UTC para evitar zona horaria).
const NETWORK_START = { Instagram: [2026, 7, 27], Facebook: [2026, 7, 28] };
function dateFromStart(ymd, offsetDays) {
  const [y, m, d] = ymd;
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + offsetDays);
  return dt.toISOString().split('T')[0];
}

const calendar = [];
const startDate = new Date();
let globalId = 1;

for (let week = 1; week <= 13; week++) {
  const weeklyPlan = [
    { network: 'Instagram', format: 'feed', count: 3 },
    { network: 'Instagram', format: 'carrusel', count: 1 },
    { network: 'Instagram', format: 'reel', count: 2 },
    { network: 'Instagram', format: 'story', count: 4 },
    { network: 'Facebook', format: 'feed', count: 3 },
    { network: 'Facebook', format: 'reel', count: 1 },
    { network: 'Facebook', format: 'educativo', count: 1 },
    { network: 'Facebook', format: 'comercial', count: 1 },
    { network: 'TikTok', format: 'video', count: 3 },
    { network: 'WhatsApp', format: 'status', count: 3 },
    { network: 'LinkedIn', format: 'post', count: 2 },
    { network: 'YouTube', format: 'short', count: 1 },
  ];

  for (const plan of weeklyPlan) {
    for (let i = 0; i < plan.count; i++) {
      const idStr = `${plan.network.toUpperCase().substring(0,2)}-${plan.format.toUpperCase()}-${String(globalId).padStart(3, '0')}`;
      const offsetDays = ((week - 1) * 7) + (i % 7);
      const postDate = new Date(startDate);
      postDate.setDate(postDate.getDate() + offsetDays);

      const pilar = getDeterministic(PILARES, idStr + 'pilar');
      const profile = getDeterministic(BUSINESS_PROFILES, idStr + 'biz');
      const business = profile.biz;
      const funnel = getDeterministic(FUNNELS, idStr + 'funnel');

      let post = postsMap.get(idStr) || {};

      post.id = idStr;
      post.network = plan.network;
      post.format = plan.format;
      if (NETWORK_START[plan.network]) {
        post.date = dateFromStart(NETWORK_START[plan.network], offsetDays); // fecha oficial: IG 27-jul, FB 28-jul 2026
      } else {
        post.date = post.date || postDate.toISOString().split('T')[0];
      }
      post.time = post.time || "18:00";
      post.week = post.week || week;
      post.status = post.status || "IMAGEN PENDIENTE";

      post.title = `Campaña W${week} - ${pilar}`;

      post.funnel = post.funnel || funnel;
      post.objective = post.objective || getDeterministic(OBJECTIVES, idStr + 'obj');
      post.audience = post.audience || getDeterministic(AUDIENCES, idStr + 'aud');
      post.campaign = post.campaign || "Q3 Launch";
      post.pinnedComment = post.pinnedComment || "¡Déjanos tus dudas en los comentarios!";
      post.productionStatus = post.productionStatus || "PENDING";
      post.path = post.path || `/assets/${idStr}.jpg`;
      post.visualConcept = post.visualConcept || "Emprendimiento gastronómico moderno";

      const hook = generateHook(idStr);
      const ctasArr = CTAS_FUNNEL[post.funnel];
      const cta = getDeterministic(ctasArr, idStr + 'cta');

      post.hook = hook;
      post.cta = cta;
      post.copy = generateNetworkCopy(idStr, plan.network, pilar, hook, cta);

      // PROMPT (un solo bloque, 5 párrafos, negativo integrado).
      post.imagePrompt = generateImagePrompt(idStr);
      post.negativePrompt = NEGATIVE_MASTER; // se conserva como referencia; ya va integrado en imagePrompt.

      // POST-PRODUCCIÓN (secciones aparte): textos superpuestos + logo.
      const overlay = generateOverlay(idStr);
      post.overlayText = overlay;
      post.logo = generateLogo(idStr);
      post.imageText = overlay.titular;         // campo existente del dashboard = titular principal
      post.alt = `Fotografía de ${business.toLowerCase()} usando StreetBoss para vender por WhatsApp`;
      post.safeZone = getDeterministic(SAFE_ZONES, idStr + 'safe');

      // ── CORRECCIONES INSTAGRAM (solo Instagram; el resto de redes queda intacto) ──
      // ── AJUSTE FINAL Instagram + Facebook: CTA visual sin link + prompt COMPLETO con texto exacto ──
      if (plan.network === 'Instagram' || plan.network === 'Facebook') {
        overlay.ctaVisual = getDeterministic(INSTAGRAM_CTA_VISUAL, idStr + 'igvis'); // CTA visual en la imagen, SIN link
        post.overlayText = overlay;
        post.promptCompleto = generateFullPrompt(idStr, overlay); // prompt listo con titular/subtítulo/CTA exactos + negative integrado
        delete post.promptTextoFinal; // el texto ya va dentro del prompt; no se agrega después

        if (plan.network === 'Instagram') {
          // Instagram: el copy publicable no lleva links
          const igCta = getDeterministic(INSTAGRAM_CTA[post.funnel], idStr + 'igcta');
          post.cta = igCta;
          post.hashtags = INSTAGRAM_HASHTAGS;
          const igBody = getBody(idStr, 'Instagram', pilar);
          post.copy = `${hook}\n\n${igBody}\n\n${igCta}\n\n${INSTAGRAM_HASHTAGS.join(' ')}`;
        }
      }

      if (['reel', 'video', 'short'].includes(plan.format)) {
        post.script = `0-2s: ${hook}\n2-10s: Visual de ${business}.\n10-15s: CTA.`;
        post.motionPrompt = generateMotionPrompt(idStr);
        post.cover = post.cover || `/assets/${idStr}_COVER.jpg`;
      }

      if (['carrusel', 'story', 'status'].includes(plan.format)) {
        post.carouselTexts = [ overlay.titular, `¿Por qué regalar ganancias en tu ${business}?`, overlay.ctaVisual ];
      }

      calendar.push(post);
      globalId++;
    }
  }
}

fs.writeFileSync(POSTS_PATH, JSON.stringify(calendar, null, 2));
console.log(`✅ Generadas ${calendar.length} publicaciones. Prompts de imagen: 5 párrafos + negativo integrado. Post-producción (textos + logo) en secciones aparte.`);
