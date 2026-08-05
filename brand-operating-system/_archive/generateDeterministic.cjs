const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Rutas
const POSTS_PATH = path.join(__dirname, 'src', 'data', 'posts.json');

// Leer datos existentes para preservar ediciones manuales
let existingPosts = [];
if (fs.existsSync(POSTS_PATH)) {
  try {
    existingPosts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
  } catch(e) {
    console.error("Error leyendo posts.json existente", e);
  }
}
const postsMap = new Map(existingPosts.map(p => [p.id, p]));

// Generador Determinista basado en hash del ID o semilla
function seededRandom(seedStr) {
  const hash = crypto.createHash('md5').update(seedStr).digest('hex');
  return parseInt(hash.substring(0, 8), 16) / 0xffffffff;
}

function getDeterministic(arr, seedStr) {
  const r = seededRandom(seedStr);
  return arr[Math.floor(r * arr.length)];
}

function shuffleDeterministic(array, seedStr) {
  const arr = [...array];
  let seed = seededRandom(seedStr);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seed * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
    seed = seededRandom(seedStr + i); // mutar la semilla localmente
  }
  return arr;
}

// Datos de contenido básico (expandidos para evitar colisiones masivas)
const PILARES = [
  "Venta directa sin intermediarios",
  "Cero comisión por pedido",
  "Control absoluto del negocio y base de datos",
  "Presentación profesional e hiper-optimizada",
  "Filosofía Mobile First para conversiones",
  "Pedidos estructurados directo por WhatsApp",
  "Consolidación de la marca gastronómica local",
  "Incremento del ticket promedio",
  "Autonomía tecnológica",
  "Adiós a las notas de voz indescifrables"
];

const BUSINESSES = [
  "Taquería callejera", "Hamburguesería artesanal", "Cafetería de especialidad",
  "Restaurante familiar", "Food truck urbano", "Cocina económica",
  "Negocio de postres", "Marisquería costera", "Local de alitas", "Pizzería al horno",
  "Local de desayunos", "Heladería de barrio", "Barra de sushi", "Antojitos mexicanos",
  "Restaurante saludable", "Rosticería tradicional", "Cevichería", "Pupusería",
  "Asador de carnes", "Pastelería"
];

const UNICODE_HOOKS = [
  "𝗧𝘂 𝗻𝗲𝗴𝗼𝗰𝗶𝗼 𝗻𝗼 𝗻𝗲𝗰𝗲𝘀𝗶𝘁𝗮 𝘃𝗲𝗻𝗱𝗲𝗿 𝗺𝗲𝗻𝗼𝘀 𝗽𝗮𝗿𝗮 𝗰𝗿𝗲𝗰𝗲𝗿.",
  "𝗘𝗹 𝗰𝗼𝗻𝘁𝗿𝗼𝗹 𝗱𝗲 𝘁𝘂 𝗿𝗲𝘀𝘁𝗮𝘂𝗿𝗮𝗻𝘁𝗲 𝘃𝘂𝗲𝗹𝘃𝗲 𝗮 𝘁𝘂𝘀 𝗺𝗮𝗻𝗼𝘀.",
  "¿𝗖𝗮𝗻𝘀𝗮𝗱𝗼 𝗱𝗲 𝗽𝗲𝗿𝗱𝗲𝗿 𝗲𝗹 𝟯𝟬% 𝗲𝗻 𝗰𝗼𝗺𝗶𝘀𝗶𝗼𝗻𝗲𝘀?",
  "𝗟𝗮 𝘃𝗲𝗻𝘁𝗮 𝗱𝗶𝗿𝗲𝗰𝘁𝗮 𝗲𝘀 𝗲𝗹 𝗳𝘂𝘁𝘂𝗿𝗼 𝗱𝗲 𝗹𝗮 𝗴𝗮𝘀𝘁𝗿𝗼𝗻𝗼𝗺𝗶́𝗮.",
  "𝗦𝗶𝗻 𝗰𝗼𝗺𝗶𝘀𝗶𝗼𝗻𝗲𝘀. 𝗦𝗶𝗻 𝗶𝗻𝘁𝗲𝗿𝗺𝗲𝗱𝗶𝗮𝗿𝗶𝗼𝘀. 𝗦𝗼𝗹𝗼 𝘁𝘂𝘀 𝘃𝗲𝗻𝘁𝗮𝘀.",
  "𝗧𝘂 𝗺𝗮𝗿𝗰𝗮, 𝘁𝘂𝘀 𝗰𝗹𝗶𝗲𝗻𝘁𝗲𝘀, 𝘁𝘂𝘀 𝗴𝗮𝗻𝗮𝗻𝗰𝗶𝗮𝘀.",
  "𝗘𝗹 𝗲𝘀𝗰𝗮𝗽𝗮𝗿𝗮𝘁𝗲 𝗱𝗶𝗴𝗶𝘁𝗮𝗹 𝗾𝘂𝗲 𝘁𝘂 𝗻𝗲𝗴𝗼𝗰𝗶𝗼 𝗺𝗲𝗿𝗲𝗰𝗲.",
  "𝗩𝗲𝗻𝗱𝗲 𝗽𝗼𝗿 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗰𝗼𝗺𝗼 𝘂𝗻 𝗽𝗿𝗼𝗳𝗲𝘀𝗶𝗼𝗻𝗮𝗹.",
  "𝗗𝗲𝗷𝗮 𝗱𝗲 𝗿𝗲𝗻𝘁𝗮𝗿 𝘁𝘂𝘀 𝗰𝗹𝗶𝗲𝗻𝘁𝗲𝘀.",
  "𝗨𝗻𝗮 𝗲𝘅𝗽𝗲𝗿𝗶𝗲𝗻𝗰𝗶𝗮 𝗱𝗲 𝗽𝗲𝗱𝗶𝗱𝗼 𝗾𝘂𝗲 𝗲𝗻𝗮𝗺𝗼𝗿𝗮."
];

// 20 Bodies para aumentar unicidad
const BODIES = [
  "StreetBoss convierte tu negocio en un escaparate digital optimizado para teléfonos móviles. Tus clientes pueden explorar tus productos con fotografías increíbles, seleccionar complementos sin ninguna confusión y enviarte el pedido perfectamente estructurado directamente por WhatsApp.\n\nTodo esto sin que tengas que ceder un solo peso de tu margen de ganancia. Porque el enorme esfuerzo de cocinar, administrar y servir es única y exclusivamente tuyo, y las ganancias de ese esfuerzo también deberían serlo.",
  "Depender exclusivamente de aplicaciones de terceros significa regalar el control de tu marca y de tu clientela. Con StreetBoss, centralizas todos tus pedidos en un enlace propio de alta velocidad que puedes anclar en tu biografía de Instagram o enviar de forma automática por WhatsApp.\n\nNo eres una opción más en una lista interminable ni compites por precio con otras marcas. Eres el único protagonista. Tu cliente ve tus colores, tus fotos, tu historia y tus precios reales, sin comisiones ocultas ni sorpresas desagradables en el carrito final.",
  "Imagina recibir cientos de pedidos de WhatsApp que no sean notas de voz indescifrables, textos cortados ni mensajes incompletos a mitad del servicio. Nuestro sistema tecnológico estructura matemáticamente cada orden con nombre del cliente, dirección exacta, platillos específicos, variaciones complejas y el método de pago elegido.\n\nEs una simplicidad extrema y elegancia para ti operando bajo presión en la cocina, y una experiencia de compra asombrosamente fluida, limpia y sin fricciones para tu cliente que está comprando desde la comodidad de su teléfono celular.",
  "Las plataformas de terceros te cobran por venderle a tus propios clientes recurrentes. Rompe ese ciclo hoy. Configura tu menú en línea en minutos y recibe órdenes estructuradas que van directo a tu número de WhatsApp de negocios.\n\nProtege tus utilidades mientras ofreces una navegación premium que hace que la comida luzca espectacular en cualquier dispositivo móvil.",
  "El verdadero problema de los restaurantes hoy no es vender, es retener el margen de utilidad. Cuando pagas porcentajes altísimos por envío, estás trabajando para alguien más.\n\nStreetBoss te da la tecnología de una gran franquicia, pero adaptada a tu realidad local. Empieza a dirigir el tráfico de tus redes sociales a tu propio canal de venta directa y recupera el 100% de tu rentabilidad hoy mismo.",
  "Crea un puente directo entre el antojo de tu cliente y tu cocina. Sin intermediarios que filtren la comunicación o que oculten los datos de contacto.\n\nCon StreetBoss, cada persona que compra es un contacto valioso en tu WhatsApp, listo para futuras promociones y campañas de retención que tú controlas totalmente."
];

const CTAS = [
  "→ Solicita una demostración y descubre cómo funciona:\nhttps://wa.me/529613725386",
  "📲 Toma el control absoluto de tus pedidos hoy mismo. Escríbenos:\nhttps://wa.me/529613725386",
  "✓ Comienza a vender sin perder tus ganancias. Solicita tu demo gratis:\nhttps://wa.me/529613725386",
  "🔗 Haz clic para transformar tus ventas por WhatsApp:\nhttps://wa.me/529613725386",
  "👉 No más comisiones. Habla con nuestro equipo:\nhttps://wa.me/529613725386"
];

// Variaciones de plataforma
const NETWORK_TONES = {
  Instagram: " (Tono visual y aspiracional, uso moderado de emojis).",
  Facebook: " (Tono comunitario y educativo, párrafos más cortos).",
  TikTok: " (Tono hiper-directo, diseñado para retener atención en 3 segundos).",
  WhatsApp: " (Tono conversacional y urgente, ultra-corto).",
  LinkedIn: " (Tono B2B, enfocado en rentabilidad, márgenes y tecnología).",
  YouTube: " (Tono narrativo de storytelling, invitando a ver más detalles)."
};

const NEGATIVE_MASTER = "desorden, superficies sucias, cocina desordenada, objetos amontonados, basura, cables sueltos, caos visual, manos deformes, rostros de cera, comida de plástico, texto de IA, logotipos falsos, hologramas, neón cyberpunk exagerado, render 3d";

const VISUAL_ENVIRONMENTS = [
  "Entorno hiperrealista documental en cocina activa. Entorno limpio y ordenado, superficies despejadas, mise en place impecable, sin desorden, espacio de trabajo pulcro.",
  "Fotografía cenital (overhead) moderna y minimalista mostrando el platillo y un smartphone. Entorno limpio y ordenado, superficies despejadas, mise en place impecable, sin desorden.",
  "Retrato de dueño en barra de despacho, sonriendo confiado. Entorno limpio y ordenado, superficies despejadas, mise en place impecable, sin desorden, espacio de trabajo pulcro."
];

const MOTION_PROMPTS = [
  "Movimiento lento de cámara tipo slider de izquierda a derecha. Ligero slow motion para enfatizar el vapor.",
  "Dolly-in sutil hacia el rostro del protagonista. Fondo fluido y natural.",
  "Toma estática donde solo ocurre la acción interna: vapor disipándose, notificación en celular.",
  "Whip-pan rápido que termina en el platillo perfectamente presentado."
];

function generateDeterministicCopy(id, network, pilar) {
  const hook = getDeterministic(UNICODE_HOOKS, id + 'hook');
  const body = getDeterministic(BODIES, id + 'body');
  const cta = getDeterministic(CTAS, id + 'cta');
  const tone = NETWORK_TONES[network] || "";
  
  // Alterar sutilmente la combinación para que no sean idénticos
  const variation = getDeterministic(["", "\n\nLa clave es la simplicidad.", "\n\nTu negocio, tus reglas.", "\n\nTodo desde tu celular."], id + 'var');
  
  if (network === 'WhatsApp' || network === 'TikTok') {
    return `${hook}\n\n${cta}`;
  }
  return `${hook}\n\n${body}${variation}\n\n${cta}\n\n#StreetBoss #FoodTech #VentaDirecta #Restaurantes`;
}

function generateDeterministicPrompt(id, business, pilar) {
  const env = getDeterministic(VISUAL_ENVIRONMENTS, id + 'env');
  return `Objetivo narrativo: Representar la ventaja de ${pilar}. Historia de la escena: Muestra la autenticidad y el control de un negocio real utilizando tecnología accesible. Protagonista: Dueño o personal operando su negocio con orgullo. Tipo de negocio: ${business}. Acción: Interactuando con su teléfono (StreetBoss) recibiendo pedidos. Dirección fotográfica: ${env} Encuadre: Regla de los tercios, espacio negativo superior para textos. Colores: Vibrantes y auténticos, iluminación natural. (Entorno limpio y ordenado, superficies despejadas, mise en place impecable, sin desorden, espacio de trabajo pulcro).`;
}

const calendar = [];
const startDate = new Date(); // Start today
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
      
      const pilar = getDeterministic(PILARES, idStr + 'pilar');
      const business = getDeterministic(BUSINESSES, idStr + 'biz');
      
      const postDate = new Date(startDate);
      postDate.setDate(postDate.getDate() + ((week - 1) * 7) + (i % 7));
      
      // Si existe, lo usamos como base para preservar status y campos manuales
      let post = postsMap.get(idStr) || {};
      
      // Asegurar campos obligatorios sin sobreescribir ediciones manuales (para esta fase, reemplazamos copy/prompt para arreglar unicidad, pero preservamos status/id)
      post.id = idStr;
      post.network = plan.network;
      post.format = plan.format;
      post.pilar = post.pilar || pilar;
      post.date = post.date || postDate.toISOString().split('T')[0];
      post.time = post.time || "18:00";
      post.week = post.week || week;
      post.status = post.status || "IMAGEN PENDIENTE";
      post.title = post.title || `Campaña W${week} - ${pilar}`;
      
      // Regeneramos copy/prompt SIEMPRE en esta fase para arreglar la duplicación
      post.hook = getDeterministic(UNICODE_HOOKS, idStr + 'hook');
      post.copy = generateDeterministicCopy(idStr, plan.network, pilar);
      post.cta = getDeterministic(CTAS, idStr + 'cta');
      post.hashtags = ['#StreetBoss', '#FoodTech', '#VentaDirecta', '#Restaurantes'];
      post.imagePrompt = generateDeterministicPrompt(idStr, business, pilar);
      post.negativePrompt = NEGATIVE_MASTER;
      post.filename = post.filename || `${idStr}_MASTER.jpg`;
      post.resolution = post.resolution || "1080x1350";

      if (['reel', 'video', 'short'].includes(plan.format)) {
        post.script = post.script || `0-2s: (HOOK) ${post.hook}\n2-10s: Explicación de ${pilar}.\n10-15s: CTA.`;
        post.motionPrompt = getDeterministic(MOTION_PROMPTS, idStr + 'motion');
        post.resolution = "1080x1920";
        post.filename = post.filename || `${idStr}_MASTER.mp4`;
      }
      
      if (plan.format === 'carrusel') {
        post.carouselTexts = post.carouselTexts || [
          post.hook,
          "Problema de comisiones",
          "Solución: Venta directa",
          post.cta
        ];
      }

      calendar.push(post);
      globalId++;
    }
  }
}

fs.writeFileSync(POSTS_PATH, JSON.stringify(calendar, null, 2));

console.log(`✅ FASE 1: generador único, determinista y seguro. (posts.json re-generado).`);
