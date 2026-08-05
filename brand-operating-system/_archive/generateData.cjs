const fs = require('fs');
const path = require('path');

const DIR_DATA = path.join(__dirname, 'src', 'data');
fs.mkdirSync(DIR_DATA, { recursive: true });

const NEGATIVE_PROMPT = `stock photography, commercial model, posed people, looking at camera, thumbs up, handshake, corporate office, luxury restaurant, fine dining, startup office, holograms, floating interface, invented app, fake WhatsApp, fake text, illegible signs, deformed hands, extra fingers, missing fingers, duplicated utensils, plastic skin, perfect teeth, fashion editorial, influencer pose, poverty exploitation, dirty unsafe kitchen, tourist stereotypes, sombreros, cactus decoration, paper banners, Mexican flag decoration, orange walls, orange lighting, yellow color cast, teal and orange grading, extreme saturation, dramatic smoke, excessive steam, cyberpunk, neon lights, 3D render, illustration, cartoon, fake food, oversized phone, floating phone, distorted screen, warped furniture, duplicate people, blurred face, asymmetrical eyes, text overlays, logos, watermarks, captions, frames.`;

function createPrompt(narrative, protagonist, business, action, details, ratio="4:5") {
  return `OBJETIVO NARRATIVO: Fotografía documental publicitaria que transmita ${narrative}. Enfoque hiperrealista sobre un verdadero dueño de negocio gastronómico empoderado.

PROTAGONISTA: ${protagonist}. Apariencia latina auténtica, sin filtros ni retoques de estudio. Ropa de trabajo. Expresión sutil de control y orgullo, no sonrisas plásticas. NUNCA mirar a la cámara.

ACCIÓN PRINCIPAL: ${action}. Sostiene un smartphone de forma realista mientras sigue en control de su entorno.

NEGOCIO: ${business}. Realista, texturas naturales, uso evidente pero limpio. Nada de cocinas falsas o escenarios montados.

COMIDA: ${details.food}. Colores vibrantes naturales, sin saturación artificial. Texturas reales, apetitoso pero creíble.

DIRECCIÓN DE ARTE: ${details.art}. Sin colores artificiales, prohibida la iluminación naranja predominante. El color natural del acero, madera, fuego y piel dictan la escena.

CÁMARA Y COMPOSICIÓN: Formato ${ratio}. Lente de 35mm. Altura del pecho. Profundidad de campo que aísla ligeramente pero mantiene contexto.

ILUMINACIÓN Y COLOR: Luz funcional del negocio combinada con luz urbana/ambiente natural. Sin color cast amarillo o naranja falso.

EMOCIÓN: Dignidad profesional, tranquilidad de un trabajo bien hecho, y el "momento guau" contenido.

RESTRICCIONES TÉCNICAS: Smartphone proporcionado. Manos anatómicamente correctas. Cero elementos de folclore turístico forzado. Pantalla neutra.`;
}

// ------------------------------------------------------------
// 1. PROFILES
// ------------------------------------------------------------
const profiles = [
  {
    network: "Instagram",
    username: "@streetboss.mx",
    category: "Software Company",
    contactInfo: {
      url: "https://streetboss.com.mx/",
      whatsapp: "529613725386",
      waLink: "https://wa.me/529613725386"
    },
    buttons: ["Seguir", "Mensaje", "Contactar", "Ver Menú"],
    cta: "Solicita un Demo en el enlace de abajo 👇",
    profilePic: {
      prompt: "Logotipo de StreetBoss (SB) minimalista, centrado perfectamente con márgenes suficientes (zona de seguridad circular del 20%) sobre fondo Boss Charcoal sólido, libre de texturas o gradientes.",
      safeZone: "Círculo centrado, mantener elementos críticos en el 60% interior.",
      recommendedFile: "brand-assets/profiles/SB_Profile_Avatar_Dark.png"
    },
    bios: [
      { id: "A", name: "Directa y Clara", text: "Transformamos tu restaurante con un escaparate digital móvil.\nVende directo por WhatsApp.\nCero comisiones por pedido.\n👇 Solicita un Demo" },
      { id: "B", name: "Orientada a Beneficio", text: "¿Cansado de pagar comisiones? 💸\nDigitalizamos tu negocio gastronómico.\nRecibe pedidos por WhatsApp directamente.\n👇 Empieza hoy" },
      { id: "C", name: "Minimalista", text: "FoodTech para negocios reales.\nEscaparate digital + Pedidos directos.\nRecupera el control de tu marca.\n👇 Conoce cómo" },
      { id: "D", name: "Emocional", text: "La tecnología que hace crecer tu negocio gastronómico. 🌮🍔\nVende más, mantén tu independencia y gana el 100%.\n👇 Haz la prueba" },
      { id: "E", name: "Profesional Corporativa", text: "Plataforma de ventas directas para restaurantes.\nOptimización Mobile-First y control total de marca.\nSin intermediarios.\n👇 Solicita Demo" }
    ]
  },
  {
    network: "Facebook",
    username: "@StreetBossMX",
    category: "Producto/Servicio",
    contactInfo: {
      url: "https://streetboss.com.mx/",
      whatsapp: "529613725386",
      waLink: "https://wa.me/529613725386"
    },
    buttons: ["WhatsApp", "Más información"],
    cta: "Envíanos un mensaje directo o visita nuestra web.",
    profilePic: {
      prompt: "Logotipo de StreetBoss centrado, márgenes 20% para zona circular. Fondo Boss Charcoal.",
      safeZone: "Círculo centrado.",
      recommendedFile: "brand-assets/profiles/SB_Profile_Avatar_Dark.png"
    },
    coverPhoto: {
      prompt: "Fotografía documental horizontal 16:9 de un taquero trabajando orgullosamente, espacio negativo amplio a la izquierda para insertar el titular corporativo. Iluminación nocturna urbana, tonos cálidos naturales (sin filtro naranja). Pantalla de smartphone visible sutilmente.",
      mobileSafeZone: "640x360 px centrales.",
      desktopSafeZone: "820x312 px completos.",
      text: "TU NEGOCIO, TUS CLIENTES, TUS REGLAS.\nEscaparate digital sin comisiones por venta.",
      recommendedFile: "brand-assets/profiles/FB_Cover_Hero_01.webp"
    },
    bios: [
      { id: "A", name: "Oficial", text: "StreetBoss ayuda a restaurantes y negocios de comida a vender directamente a través de un escaparate digital optimizado para móviles, recibiendo pedidos directamente por WhatsApp. Cero comisiones por pedido." },
      { id: "B", name: "Comunidad", text: "Únete a la revolución de la venta directa. Empoderamos negocios gastronómicos para que recuperen su margen y tomen control de sus ventas con menús digitales premium." },
      { id: "C", name: "Breve", text: "Escaparate digital premium para tu negocio de comida. Vende directo por WhatsApp. 100% tuyo." },
      { id: "D", name: "Beneficios", text: "Vende sin comisiones. Recibe pedidos por WhatsApp. Luce profesional en móviles. Conoce StreetBoss." },
      { id: "E", name: "FAQ Approach", text: "¿Qué es StreetBoss? La plataforma que convierte tu menú en una experiencia de compra móvil fluida conectada directo a tu WhatsApp." }
    ]
  },
  {
    network: "TikTok",
    username: "@streetboss.mx",
    category: "B2B / Tecnología",
    contactInfo: {
      url: "https://streetboss.com.mx/",
      waLink: "https://wa.me/529613725386"
    },
    buttons: ["Enlace"],
    cta: "Crea tu menú premium gratis 👇",
    profilePic: {
      prompt: "Isotipo SB vibrante centrado en círculo, contraste alto. Fondo oscuro.",
      safeZone: "Círculo estricto.",
      recommendedFile: "brand-assets/profiles/SB_Profile_TikTok.png"
    },
    bios: [
      { id: "A", name: "Gancho", text: "Deja de regalar 30% a las apps 🛑\nVende directo por WhatsApp 📲\n👇 Checa cómo" },
      { id: "B", name: "Valor", text: "Digitalizamos tu taquería o restaurante.\n100% de la venta es para ti.\n👇 Pruébalo aquí" },
      { id: "C", name: "Práctica", text: "Tips y herramientas para negocios de comida 🍔\nTu propio escaparate digital 👇" },
      { id: "D", name: "Storytelling", text: "Ayudamos a dueños de restaurantes a ser independientes. 🚀\n👇 Menú digital en 5 min" },
      { id: "E", name: "Directa", text: "FoodTech 🇲🇽\nVende sin comisiones.\n👇 Solicita tu demo" }
    ]
  },
  {
    network: "WhatsApp Business",
    username: "StreetBoss",
    category: "Software",
    contactInfo: {
      url: "https://streetboss.com.mx/",
      description: "StreetBoss ayuda a los negocios gastronómicos a vender directamente mediante un escaparate digital optimizado para móviles y pedidos directos por WhatsApp."
    },
    buttons: ["Catálogo", "Website"],
    cta: "Ver Catálogo",
    profilePic: {
      prompt: "Logo simplificado SB, fondo oscuro, lectura clara a 40x40px.",
      safeZone: "Círculo perfecto.",
      recommendedFile: "brand-assets/profiles/WA_Profile_Avatar.png"
    },
    bios: [
      { id: "A", name: "Mensaje Bienvenida", text: "¡Hola! 👋 Gracias por contactar a StreetBoss. ¿Tienes un negocio de comida y te gustaría conocer cómo funciona nuestro escaparate digital de ventas por WhatsApp?" },
      { id: "B", name: "Ausencia", text: "¡Hola! En este momento estamos fuera de horario, pero déjanos el nombre de tu negocio y tu duda, y te responderemos a primera hora. 🚀" },
      { id: "C", name: "Cierre de Venta", text: "Perfecto. Aquí tienes el enlace directo para tu demostración: https://streetboss.com.mx/demo. Quedo atento a tus dudas." },
      { id: "D", name: "Info General", text: "StreetBoss no cobra comisiones por pedido. Es una suscripción fija que te da el control total de tus ventas." },
      { id: "E", name: "Soporte", text: "¿Tienes problemas con tu menú? Compártenos el enlace y una captura de pantalla, te ayudamos a resolverlo de inmediato." }
    ]
  },
  {
    network: "LinkedIn",
    username: "StreetBoss",
    category: "Tecnología de la Información y Servicios",
    contactInfo: {
      url: "https://streetboss.com.mx/"
    },
    buttons: ["Visitar sitio web"],
    cta: "Conectar",
    profilePic: {
      prompt: "Logo corporativo SB con padding 15%.",
      safeZone: "Cuadrado con esquinas redondeadas.",
      recommendedFile: "brand-assets/profiles/LI_Profile_Avatar.png"
    },
    coverPhoto: {
      prompt: "Fotografía documental horizontal 4:1 panorámica. Restaurante moderno u oficina de emprendedor, vista de escritorio con métricas abstractas y un smartphone con la UI de SB. Tono premium, corporativo.",
      mobileSafeZone: "Central 60%.",
      desktopSafeZone: "Full width, bottom 70%.",
      text: "Empoderando la venta directa gastronómica en Latinoamérica.",
      recommendedFile: "brand-assets/profiles/LI_Cover_01.webp"
    },
    bios: [
      { id: "A", name: "Corporativa", text: "StreetBoss es la plataforma FoodTech que empodera a negocios gastronómicos para implementar un canal de venta directa y escaparate móvil, eliminando comisiones de terceros y devolviendo el control al restaurante." },
      { id: "B", name: "Visión", text: "Creemos en la independencia del sector gastronómico. Desarrollamos tecnología para que restaurantes, taquerías y food trucks operen sus propios canales digitales con la misma calidad visual que las grandes cadenas." },
      { id: "C", name: "Talento", text: "Construyendo el sistema operativo visual para la venta gastronómica directa. Únete a la revolución sin comisiones." },
      { id: "D", name: "Producto", text: "StreetBoss: Escaparate digital, optimización mobile-first y enrutamiento inteligente de pedidos hacia WhatsApp para negocios de comida." },
      { id: "E", name: "Fundadores", text: "Desde 2024, conectando directamente a los restauranteros con sus clientes. FoodTech, Venta Directa, Independencia Digital." }
    ]
  },
  {
    network: "YouTube",
    username: "@StreetBossMX",
    category: "Ciencia y Tecnología / Educación",
    contactInfo: {
      url: "https://streetboss.com.mx/",
      waLink: "https://wa.me/529613725386"
    },
    buttons: ["Suscribirse", "Página Web"],
    cta: "Mira nuestros tutoriales",
    profilePic: {
      prompt: "Logo SB claro sobre fondo oscuro.",
      safeZone: "Círculo centrado.",
      recommendedFile: "brand-assets/profiles/YT_Profile_Avatar.png"
    },
    coverPhoto: {
      prompt: "Banner 2560x1440. Collage sutil documental de cocinas reales trabajando y smartphones con la UI de SB en el centro. Sin saturación artificial.",
      mobileSafeZone: "1546x423 píxeles centrales.",
      desktopSafeZone: "2560x423 completo.",
      text: "Tutoriales, Casos de Éxito y Consejos para vender más sin comisiones.",
      recommendedFile: "brand-assets/profiles/YT_Cover_Art.webp"
    },
    bios: [
      { id: "A", name: "General", text: "Bienvenido al canal oficial de StreetBoss. Aquí aprenderás a configurar tu escaparate digital, mejorar las fotos de tu menú y optimizar tus ventas directas por WhatsApp." },
      { id: "B", name: "Educativa", text: "Canal dedicado a dueños de negocios de comida que buscan independencia. Tips de marketing gastronómico y tutoriales de uso de StreetBoss." },
      { id: "C", name: "Comercial", text: "¿Qué es StreetBoss y cómo funciona? Descubre en estos videos cómo puedes dejar de pagar el 30% de comisión en apps y recibir pedidos directos." },
      { id: "D", name: "Casos Éxito", text: "Historias reales de negocios reales creciendo con la tecnología de StreetBoss. Inspiración y tutoriales." },
      { id: "E", name: "Técnica", text: "Guías paso a paso de la plataforma StreetBoss. Configuración de WhatsApp, carga de menús y optimización móvil." }
    ]
  }
];
fs.writeFileSync(path.join(DIR_DATA, 'profiles.json'), JSON.stringify(profiles, null, 2));


// ------------------------------------------------------------
// 2. HIGHLIGHTS (INSTAGRAM)
// ------------------------------------------------------------
const highlights = [
  {
    id: "HL-01",
    name: "¿Qué es SB?",
    prompt: "Fondo Boss Charcoal (#0D0E12) con icono minimalista blanco de un smartphone emitiendo una señal. Vectorial puro, sin degradados.",
    recommendedOrder: 1,
    coverPath: "brand-assets/highlights/HL_QueEs.webp",
    contentDesc: "Stories de explicación del problema de comisiones y la solución del escaparate digital."
  },
  {
    id: "HL-02",
    name: "Beneficios",
    prompt: "Fondo Boss Charcoal (#0D0E12) con icono minimalista de una gráfica ascendente o un escudo de protección. Vectorial puro.",
    recommendedOrder: 2,
    coverPath: "brand-assets/highlights/HL_Beneficios.webp",
    contentDesc: "Stories con bullet points claros: 1. Cero Comisiones, 2. Pedidos en WA, 3. Control total."
  },
  {
    id: "HL-03",
    name: "Demos",
    prompt: "Fondo Street Orange (#FF4B00) para destacar. Icono blanco minimalista de un puntero tocando una pantalla.",
    recommendedOrder: 3,
    coverPath: "brand-assets/highlights/HL_Demos.webp",
    contentDesc: "Grabaciones de pantalla reales usando la UI de StreetBoss, haciendo scroll por menús."
  },
  {
    id: "HL-04",
    name: "Negocios",
    prompt: "Fondo Boss Charcoal (#0D0E12) con icono minimalista de un local o tenedor y cuchillo cruzados.",
    recommendedOrder: 4,
    coverPath: "brand-assets/highlights/HL_Negocios.webp",
    contentDesc: "Testimonios, fotos documentales y capturas de menús reales configurados en StreetBoss."
  },
  {
    id: "HL-05",
    name: "FAQ",
    prompt: "Fondo Boss Charcoal (#0D0E12) con icono minimalista de signo de interrogación. Vectorial puro.",
    recommendedOrder: 5,
    coverPath: "brand-assets/highlights/HL_FAQ.webp",
    contentDesc: "Preguntas frecuentes: ¿Me quitan comisión? No. ¿Necesito app? No. ¿Es un POS? No."
  }
];
fs.writeFileSync(path.join(DIR_DATA, 'highlights.json'), JSON.stringify(highlights, null, 2));


// ------------------------------------------------------------
// 3. ASSETS & BRANDING
// ------------------------------------------------------------
const assets = {
  brand: {
    name: "StreetBoss",
    tagline: "Vende directo. Conserva el control.",
    description: "Plataforma FoodTech de venta directa para restaurantes.",
    website: "https://streetboss.com.mx/",
    officialWhatsApp: "+52 961 372 5386",
    waLink: "https://wa.me/529613725386"
  },
  colors: {
    primary: { name: "Boss Charcoal", hex: "#0D0E12", usage: "Fondos principales, texto dominante." },
    accent: { name: "Street Orange", hex: "#FF4B00", usage: "CTAs, alertas, badges, detalles clave. No abusar." },
    secondary: { name: "Orange Light", hex: "#FF6A1A", usage: "Hover states, gradientes sutiles funcionales." },
    neutral: { name: "Paper White", hex: "#F5F5F7", usage: "Superficies secundarias, tarjetas (modo claro)." }
  },
  typography: {
    primary: "Inter / Roboto (Clean sans-serif)",
    hierarchy: "Headers gruesos (700/800), cuerpo legible (400), tracking ajustado (-0.5px en headers)."
  },
  forbiddenTerms: [
    "Menú QR (usar Escaparate Digital)",
    "Aplicación móvil de delivery (somos plataforma web directa)",
    "Punto de venta / POS",
    "Comisiones bajas (es Cero Comisiones por venta)",
    "Marketplace"
  ]
};
fs.writeFileSync(path.join(DIR_DATA, 'assets.json'), JSON.stringify(assets, null, 2));


// ------------------------------------------------------------
// 4. POSTS (CONTENT LIBRARY)
// ------------------------------------------------------------
const templates = [
  { 
    p: 'venta-directa', 
    hook: '¿Por qué regalar tus ganancias a aplicaciones de terceros?', 
    copy: 'Mientras otros siguen enviando fotografías del menú o pagando el 30% a aplicaciones de terceros, los verdaderos dueños están tomando el control.\n\nStreetBoss convierte tu negocio en un escaparate digital optimizado para móviles donde tus clientes pueden explorar tus productos de forma profesional y enviarte su pedido directamente por WhatsApp.\n\nMás orden.\nMás control.\nMás ventas directas sin perder margen.\n\nConoce StreetBoss.', 
    cta: 'Solicita una demostración en nuestro sitio web.' 
  },
  { 
    p: 'cero-comisiones', 
    hook: 'Cada peso que vendes debería ser para tu negocio.', 
    copy: 'Esa orden grande de hamburguesas que preparaste con tanto esfuerzo... ¿cuánto te dejó realmente después de las comisiones?\n\nEso se acabó. Con tu escaparate en StreetBoss, tus clientes compran directo y tú no pagas absolutamente nada de comisión por venta.\n\nTu cocina.\nTus ingredientes.\nTu 100%.\n\nProtege tus márgenes.', 
    cta: 'Digitaliza tu menú hoy. Enlace en el perfil.' 
  },
  { 
    p: 'marca-gastronomica', 
    hook: 'Tu comida es increíble. Que tu presencia digital también lo sea.', 
    copy: 'No eres solo un negocio más. Eres una marca.\n\nSin embargo, un menú en PDF confuso o una galería de fotos sueltas destruyen el apetito de tus clientes antes de que compren.\n\nStreetBoss te da un menú visual premium, elegante y profesional. Tus platillos lucen como los de las grandes cadenas, pero el dinero entra directamente a tu caja.', 
    cta: 'Crea tu menú premium gratis y compruébalo.' 
  },
  { 
    p: 'historias-humanas', 
    hook: 'Sabemos lo que cuesta levantar la cortina todos los días.', 
    copy: 'El negocio de la comida es uno de los más duros. Estás ahí desde temprano, preparas todo y cierras tarde.\n\nPor eso creamos una herramienta que trabaja contigo, no contra ti. Simplifica tu operación, recibe los pedidos de WhatsApp ya estructurados (con precios y detalles exactos) y concéntrate en cocinar increíble.\n\nNosotros ordenamos la venta, tú la preparas.', 
    cta: 'Habla con nosotros por WhatsApp.' 
  }
];

let globalId = 1;
const posts = [];

function createPost(network, format, count, basePillarIndex) {
  for (let i=0; i<count; i++) {
    const tpl = templates[(basePillarIndex + i) % templates.length];
    
    let isVideo = format.includes('reel') || format.includes('video') || format.includes('story') || format.includes('shorts');
    let hasCarousel = format.includes('carrusel');
    let isStory = format.includes('story') || format.includes('status');
    let isFeed = format.includes('feed') || format.includes('publicacion');
    
    let imgRatio = isStory || isVideo ? "9:16" : (isFeed ? "4:5" : "16:9");
    
    let imgPrompt = createPrompt(
      "la profesionalización del emprendimiento gastronómico", 
      "Dueño de taquería o cafetería (35-50 años), aspecto latinoamericano auténtico", 
      "Negocio de comida funcional y auténtico", 
      "Revisando un smartphone de forma natural, sin interrumpir su trabajo", 
      {food: "Comida real lista para entrega, vapor sutil", art: "Documental, sin filtros amarillos, cero presencia naranja invasiva"},
      imgRatio
    );

    const post = {
      id: `${network.toUpperCase()}-${format.toUpperCase()}-${globalId.toString().padStart(3, '0')}`,
      network,
      format,
      pillar: tpl.p,
      status: "Listo para generar",
      title: `${tpl.hook.substring(0,40)}...`,
      hook: tpl.hook,
      copy: tpl.copy,
      cta: tpl.cta + "\n\n🌐 streetboss.com.mx\n💬 52 961 372 5386",
      hashtags: ["#StreetBoss", "#VentaDirecta", "#CeroComisiones", "#Restaurantes", "#FoodTech"],
      visualDirection: {
        concept: "Momento guau de independencia",
        story: "El dueño se da cuenta de que su negocio se ve enorme en su propio celular.",
        protagonist: "Dueño/a",
        scenario: "Lugar de trabajo real"
      },
      imagePrompt: imgPrompt,
      negativePrompt: NEGATIVE_PROMPT,
      aspectRatio: imgRatio,
      resolution: isStory || isVideo ? "1080x1920" : (isFeed ? "1080x1350" : "1920x1080"),
      filename: `${network}_${format}_${globalId}.webp`,
      isApproved: false,
      date: new Date(Date.now() + (i * 86400000)).toISOString().split('T')[0]
    };

    if (isVideo) {
      post.motionPrompt = `Movimiento sutil y realista de cámara. Paneo levísimo tipo documental. La persona revisa el teléfono y levanta ligeramente la mirada sin mirar al lente. El vapor de la comida sube fluidamente de fondo. Todo hiperrealista y contenido.`;
      post.script = `[SCENE 1: 0-2s] Hook visual: Protagonista en el negocio trabajando. \nTexto en pantalla: "${tpl.hook}"\n[SCENE 2: 2-5s] Muestra el teléfono con la UI de SB.\n[SCENE 3: 5-8s] Sonrisa de satisfacción y comida apetecible.\nTexto: "Venta directa sin comisiones."`;
    }
    
    if (hasCarousel) {
      post.carouselTexts = [
        tpl.hook,
        "¿Sabías que cedes hasta el 30% de tus ventas a apps de terceros?",
        "Con StreetBoss, recuperas el control absoluto de tu menú.",
        "Tu propio escaparate digital premium.",
        "Recibe pedidos organizados en WhatsApp. Empieza hoy."
      ];
    }

    posts.push(post);
    globalId++;
  }
}

// Generación Masiva (Ejemplos por red basados en los pilares)
createPost('Instagram', 'feed', 12, 0);
createPost('Instagram', 'carrusel', 6, 1);
createPost('Instagram', 'reel', 8, 2);
createPost('Instagram', 'story', 12, 3);
createPost('Facebook', 'feed', 12, 0);
createPost('Facebook', 'reel', 6, 1);
createPost('TikTok', 'video', 12, 2);
createPost('LinkedIn', 'post', 8, 3);
createPost('WhatsApp', 'status', 12, 0);
createPost('YouTube', 'shorts', 8, 1);

fs.writeFileSync(path.join(DIR_DATA, 'posts.json'), JSON.stringify(posts, null, 2));

console.log(`Generados ${profiles.length} perfiles, ${highlights.length} destacados, assets y ${posts.length} posts.`);
