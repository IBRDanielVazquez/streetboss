const fs = require('fs');
const path = require('path');

const DIR_DATA = path.join(__dirname, 'src', 'data');
fs.mkdirSync(DIR_DATA, { recursive: true });

const NEGATIVE_PROMPT = `stock photography, commercial model, posed people, looking at camera, thumbs up, handshake, corporate office, luxury restaurant, fine dining, startup office, holograms, floating interface, invented app, fake WhatsApp, fake text, illegible signs, deformed hands, extra fingers, missing fingers, duplicated utensils, plastic skin, perfect teeth, fashion editorial, influencer pose, poverty exploitation, dirty unsafe kitchen, tourist stereotypes, sombreros, cactus decoration, paper banners, Mexican flag decoration, orange walls, orange lighting, yellow color cast, teal and orange grading, extreme saturation, dramatic smoke, excessive steam, cyberpunk, neon lights, 3D render, illustration, cartoon, fake food, oversized phone, floating phone, distorted screen, warped furniture, duplicate people, blurred face, asymmetrical eyes, text overlays, logos, watermarks, captions, frames.`;

const posts = [
  // ================= INSTAGRAM =================
  {
    id: "IG-FEED-001",
    network: "Instagram",
    format: "feed",
    status: "Listo para publicar",
    title: "El fin de las comisiones abusivas",
    hook: "El 30% de tus ventas se está quedando en manos de aplicaciones de terceros. Es momento de detener el sangrado.",
    copy: "Viernes por la noche. Tu cocina está a tope, sacas 50 pedidos y al revisar los números, una aplicación se llevó casi todo tu margen.\n\nEsa es la realidad de la mayoría de los negocios gastronómicos hoy en día. Pero los dueños inteligentes están migrando a la venta directa. Al implementar el escaparate digital de StreetBoss, tus clientes ven un menú premium optimizado para móviles y el pedido te llega directamente por WhatsApp.\n\nTú controlas la base de clientes. Tú cobras el 100%. Tú decides las reglas.\n\nDeja de trabajar para otros y empieza a construir el patrimonio de tu propia marca.",
    cta: "Solicita tu demostración en el enlace de nuestra biografía.\n\n🌐 streetboss.com.mx\n💬 52 961 372 5386",
    hashtags: ["#StreetBoss", "#VentaDirecta", "#CeroComisiones", "#Restaurantes", "#FoodTech"],
    visualDirection: { concept: "Dignidad del trabajo duro", story: "Dueño de pizzería de barrio observando el alivio de no pagar comisiones", protagonist: "Hombre 50s", scenario: "Cocina operativa" },
    imagePrompt: "OBJETIVO NARRATIVO: Fotografía documental que transmita el alivio profundo de un emprendedor que recupera el margen de sus ventas directas.\n\nPROTAGONISTA: Hombre maduro, 50 años, dueño de pizzería. Rostro curtido, manos gruesas con ligeros restos de harina. No mira a la cámara.\n\nNEGOCIO: Pizzería local. Hornos de piedra al fondo. Cajas apiladas. Realismo absoluto.\n\nACCIÓN PRINCIPAL: Sostiene el celular y mira la pantalla con una mezcla de cansancio y profunda satisfacción por la venta recibida sin recortes.\n\nCOMIDA: Pizza de peperoni recién cortada a su lado, colores cálidos pero no saturados. Vapor levísimo.\n\nDIRECCIÓN DE ARTE: Paleta sobria. Acero, blanco, masas, y el rojo natural de los ingredientes. CERO NARANJA o ámbar falso.\n\nCÁMARA: Lente de 35mm. F/2.8. Perspectiva ligeramente por debajo del nivel de los ojos para empoderar al sujeto.\n\nILUMINACIÓN: Luz blanca funcional del local rebotada en el mostrador. Sutil iluminación de la pantalla en su rostro.\n\nEMOCIÓN Y TONO: Paz financiera y control operativo. Dignidad profesional.\n\nRESTRICCIONES TÉCNICAS ABSOLUTAS: 1) Pantalla en stand-by oscuro. 2) Manos perfectas con 5 dedos. 3) Cero logos. 4) Sin caricaturización.\n\nFORMATO: 4:5",
    negativePrompt: NEGATIVE_PROMPT,
    aspectRatio: "4:5",
    resolution: "1080x1350",
    filename: "IG_FEED_1.webp",
    isApproved: false,
    date: "2026-07-28"
  },
  {
    id: "IG-CARRUSEL-001",
    network: "Instagram",
    format: "carrusel",
    status: "Listo para publicar",
    title: "Mito: Necesitas una App nativa",
    hook: "La mentira más grande del marketing gastronómico: 'Necesitas desarrollar tu propia App'.",
    copy: "Gastas miles de dólares desarrollando una aplicación. Pagas mantenimiento. ¿Y cuál es el resultado? Nadie la descarga. Tus clientes no quieren llenar su teléfono con aplicaciones de restaurantes locales que visitan una vez al mes.\n\nLo que realmente necesitan es una experiencia fluida. StreetBoss crea un escaparate digital que vive directamente en el navegador móvil y enruta la compra hacia WhatsApp, la app que ya todos tienen abierta.\n\nFricción cero. Alta conversión. Y sin costos de desarrollo ocultos.",
    cta: "Desliza para ver cómo se ve el menú del futuro, y agenda una demo gratis.\n\n🌐 streetboss.com.mx\n💬 52 961 372 5386",
    hashtags: ["#StreetBoss", "#DesarrolloWeb", "#Innovacion", "#Restaurantes", "#FoodTech"],
    visualDirection: { concept: "Revelación", story: "Dueña de cafetería descubriendo la tecnología fluida", protagonist: "Mujer 35s", scenario: "Barra de café" },
    imagePrompt: "OBJETIVO NARRATIVO: Mostrar la fricción eliminada. La tecnología operando a favor de un local de alto flujo.\n\nPROTAGONISTA: Mujer, 35 años, administradora de cafetería de especialidad. Vestimenta moderna, delantal de cuero. Actitud ágil.\n\nNEGOCIO: Barra de café texturizada, madera natural, máquina de espresso brillante sin reflejos especulares falsos.\n\nACCIÓN PRINCIPAL: Apoyando ambas manos en el mostrador para revisar un pedido que acaba de entrar en su dispositivo móvil.\n\nCOMIDA: Croissants y tazas de cerámica apiladas en el fondo desenfocado.\n\nDIRECCIÓN DE ARTE: Estilo fotoperiodismo moderno. Tonos madera, blanco y negro profundo. PROHIBIDO EL COLOR NARANJA o sepia de filtro.\n\nCÁMARA: Lente 50mm, perspectiva neutral. Encuadre dejando espacio negativo arriba.\n\nILUMINACIÓN: Luz de ventana (softbox natural) combinada con focos cálidos muy tenues al fondo.\n\nEMOCIÓN Y TONO: Alta concentración empoderada. Control operativo absoluto.\n\nRESTRICCIONES TÉCNICAS ABSOLUTAS: 1) Proporción correcta del dispositivo. 2) Sin elementos 3D. 3) Nada flotante.\n\nFORMATO: 4:5",
    negativePrompt: NEGATIVE_PROMPT,
    aspectRatio: "4:5",
    resolution: "1080x1350",
    filename: "IG_CARRUSEL_1.webp",
    isApproved: false,
    date: "2026-07-29",
    carouselTexts: [
      "La mentira más grande del marketing gastronómico: 'Necesitas tu propia App'.",
      "Gastas miles de dólares en desarrollo y mantenimiento...",
      "...pero tus clientes NO quieren descargar otra app en su teléfono.",
      "StreetBoss crea un escaparate digital fluido directo en el navegador.",
      "Las órdenes llegan por WhatsApp. Fricción cero. Empieza hoy."
    ]
  },
  {
    id: "IG-REEL-001",
    network: "Instagram",
    format: "reel",
    status: "Listo para publicar",
    title: "El caos del fin de semana (WhatsApp)",
    hook: "¿Tus clientes todavía te piden el menú por foto los viernes en la noche?",
    copy: "El teléfono no deja de sonar. Notas de audio larguísimas. Capturas de pantalla de platillos de hace 3 años preguntando si todavía los preparan. Gente preguntando precios uno por uno.\n\nEl caos te está haciendo perder dinero y paciencia. \n\nStreetBoss formatea los pedidos. El cliente arma su carrito en tu escaparate visual, calcula su total automáticamente, y tú solo recibes un mensaje limpio por WhatsApp con todos los detalles listos para cocinar.\n\nOrdena tu operación. Domina tu fin de semana.",
    cta: "Crea tu menú premium en 5 minutos y transforma tu WhatsApp.\n\n🌐 streetboss.com.mx\n💬 52 961 372 5386",
    hashtags: ["#StreetBoss", "#VentasWhatsApp", "#Operacion", "#Restaurantes", "#FoodTech"],
    visualDirection: { concept: "Control en el caos", story: "Cocinero en pleno servicio recibiendo órdenes estructuradas", protagonist: "Hombre latino", scenario: "Cocina industrial" },
    imagePrompt: "OBJETIVO NARRATIVO: Capturar el momento de calma tecnológica dentro del caos de la hora pico gastronómica.\n\nPROTAGONISTA: Chef/Dueño joven, tatuajes visibles, mandíbula tensa. Camiseta de trabajo manchada ligeramente por carbón.\n\nNEGOCIO: Cocina oscura (dark kitchen). Entorno industrial, repisas repletas de acero, piso brillante.\n\nACCIÓN PRINCIPAL: Deteniendo un segundo su labor para confirmar la recepción de un pedido estructurado en su smartphone.\n\nCOMIDA: Fuego real controlado en las parrillas del fondo, tonos azules del gas.\n\nDIRECCIÓN DE ARTE: Clean industrial. Destaca la higiene extrema de la preparación. Tonos metálicos fríos.\n\nCÁMARA: 24mm sin distorsión. El protagonista está en el tercio derecho. Profundidad que muestra todo el escenario activo.\n\nILUMINACIÓN: Fluorescente de cocina y luz LED. Sin filtros cálidos. Realismo puro.\n\nEMOCIÓN Y TONO: Adrenalina laboral combinada con la confianza de tener el sistema bajo control.\n\nRESTRICCIONES TÉCNICAS ABSOLUTAS: 1) Geometría perfecta. 2) Cero distorsión anatómica de dedos o rostro. 3) Fuego físico realista.\n\nFORMATO: 9:16",
    motionPrompt: "Movimiento sutil: Dolly in muy lento, acercando la cámara al protagonista que asiente levemente con la cabeza y guarda su smartphone para seguir cocinando. Vapor del fondo con movimiento dinámico hacia arriba. Sin saltos abruptos.",
    script: "[0-2s] HOOK VISUAL: Cocina activa, ruido de sartenes. Texto: \"¿Tus clientes te piden el menú por foto?\"\n[2-5s] VOZ EN OFF: \"El caos de WhatsApp está matando tus ventas del viernes.\"\n[5-8s] ACERCAMIENTO: Chef revisando su celular. Texto: \"Recibe órdenes estructuradas con StreetBoss.\"\n[8-10s] CIERRE: \"Venta directa. Orden total.\"",
    negativePrompt: NEGATIVE_PROMPT,
    aspectRatio: "9:16",
    resolution: "1080x1920",
    filename: "IG_REEL_1.webp",
    isApproved: false,
    date: "2026-07-30"
  },
  {
    id: "IG-STORY-001",
    network: "Instagram",
    format: "story",
    status: "Listo para publicar",
    title: "Prueba Social Directa",
    hook: "No somos otra app de delivery.",
    copy: "Somos la tecnología que independiza a los verdaderos restauranteros.\n\nCon StreetBoss tu menú se ve como el de una franquicia corporativa, pero tú cobras el 100% de cada pedido sin comisiones escondidas.\n\nSolicita una demostración y descubre por qué los emprendedores gastronómicos están abandonando las apps tradicionales.",
    cta: "Toca el enlace y haz la prueba gratis.\n\n🌐 streetboss.com.mx",
    hashtags: [],
    visualDirection: { concept: "Orgullo de propietario", story: "Dueña de foodtruck empoderada", protagonist: "Mujer latina", scenario: "Foodtruck nocturno" },
    imagePrompt: "OBJETIVO NARRATIVO: Transmitir el poder de la independencia tecnológica. Un dueño de negocio que ya no depende de intermediarios.\n\nPROTAGONISTA: Joven emprendedora, 28 años, dueña de food truck. Apariencia urbana natural, iluminada por los neones de la calle pero manteniendo tonos de piel reales.\n\nNEGOCIO: Food truck estacionado de noche. Paneles de aluminio texturizados. Letreros legibles pero desenfocados.\n\nACCIÓN PRINCIPAL: Sonríe discretamente mientras interactúa con la interfaz de ventas directas en su celular.\n\nCOMIDA: Empaques listos en la ventana de entrega.\n\nDIRECCIÓN DE ARTE: Fotografía nocturna de alto rango dinámico (HDR sutil). No estilo cyberpunk falso, simplemente calle mexicana o latina de noche.\n\nCÁMARA: Toma over-the-shoulder desenfocando ligeramente su perfil para enfocar el dispositivo y las manos.\n\nILUMINACIÓN: Contraste de calle: oscuridad general con luz dura de la ventana de servicio recortando su silueta.\n\nEMOCIÓN Y TONO: Seguridad inquebrantable frente a su negocio propio.\n\nRESTRICCIONES TÉCNICAS ABSOLUTAS: 1) Pantalla en gris oscuro, sin textos falsos. 2) Cero brillos plásticos en el metal. 3) Cero luces neón exageradas que arruinen la paleta.\n\nFORMATO: 9:16",
    motionPrompt: "Movimiento de respiración de cámara. Las luces del entorno parpadean sutilmente de forma natural. El cabello de la protagonista se mueve muy poco por la brisa nocturna. Movimiento de dedos realista haciendo scroll en pantalla.",
    negativePrompt: NEGATIVE_PROMPT,
    aspectRatio: "9:16",
    resolution: "1080x1920",
    filename: "IG_STORY_1.webp",
    isApproved: false,
    date: "2026-07-31",
    script: "[0-2s] Escena nocturna foodtruck. Texto: \"No somos otra app de delivery.\"\n[2-5s] Sonrisa de dueña revisando teléfono. Texto: \"Cobras el 100%.\"\n[5-7s] CTA en pantalla: \"streetboss.com.mx\""
  },

  // ================= FACEBOOK =================
  {
    id: "FB-FEED-001",
    network: "Facebook",
    format: "feed",
    status: "Listo para publicar",
    title: "La base de datos es tuya",
    hook: "Control de precios, control de clientes.",
    copy: "Cuando vendes a través de un marketplace o un agregador de restaurantes, los clientes no son tuyos, son de la plataforma. Si el día de mañana te cambian las reglas, desapareces de la vista de todos.\n\nEl activo más valioso de tu negocio es tu base de clientes. Con el sistema de StreetBoss, cada cliente que te hace un pedido directo guarda tu número y tú guardas el de él. Creas una relación directa y duradera.\n\nAdemás, si los costos de los insumos suben, ajustas tu precio en el sistema en 5 segundos y se actualiza para todos. Sin aprobaciones.\n\nToma el volante de tu propio negocio.",
    cta: "Inicia el camino hacia tu independencia hoy. Envíanos un mensaje.\n\n🌐 streetboss.com.mx\n💬 52 961 372 5386",
    hashtags: ["#StreetBoss", "#Emprendedores", "#Restaurantes", "#VentaDirecta"],
    visualDirection: { concept: "Bases de datos humanas", story: "Emprendedora revisando lista de contactos", protagonist: "Dueña de negocio", scenario: "Mesa de oficina improvisada" },
    imagePrompt: "OBJETIVO NARRATIVO: Representar la organización y recolección inteligente de datos (clientes) de forma humana.\n\nPROTAGONISTA: Mujer madura, 48 años. Gafas de lectura descansando sobre la nariz. Postura de análisis calmado.\n\nNEGOCIO: Trastienda o zona administrativa de un restaurante local. Papeles reales y archiveros mezclados con un smartphone moderno.\n\nACCIÓN PRINCIPAL: Sentada, cruzada de brazos mientras el teléfono reposa sobre la mesa mostrando actividad.\n\nCOMIDA: No hay comida en primer plano. El enfoque es administrativo.\n\nDIRECCIÓN DE ARTE: Paleta neutra (grises, tonos papel, madera). Aspecto analítico, sobrio, documental publicitario de alto estándar.\n\nCÁMARA: Lente 50mm. Toma media picada (ligeramente desde arriba hacia la mesa).\n\nILUMINACIÓN: Luz blanca de ventana lateral (claroscuro suave). Sombras marcadas pero con detalle.\n\nEMOCIÓN Y TONO: Control cerebral. Reflexión estratégica de quien entiende el negocio a largo plazo.\n\nRESTRICCIONES TÉCNICAS ABSOLUTAS: 1) Cero textos en los documentos de la mesa. 2) Cero miradas a la cámara. 3) Proporción correcta de la cabeza. 4) Sin presencia naranja predominante.\n\nFORMATO: 4:5",
    negativePrompt: NEGATIVE_PROMPT,
    aspectRatio: "4:5",
    resolution: "1080x1350",
    filename: "FB_FEED_1.webp",
    isApproved: false,
    date: "2026-08-01"
  },
  {
    id: "FB-REEL-001",
    network: "Facebook",
    format: "reel",
    status: "Listo para publicar",
    title: "No regales tu esfuerzo",
    hook: "Esa orden masiva que preparaste... ¿cuánto te dejó realmente?",
    copy: "Recibes una orden de $1,500 pesos por la aplicación. Trabajas a marchas forzadas para sacarla a tiempo. Los empaques, los insumos, la mano de obra. Todo sube.\n\nY al final del día, te das cuenta de que pagaste más de $400 pesos solo por 'estar en la plataforma'.\n\nStreetBoss elimina a los intermediarios. Al convertir tu menú en un escaparate digital Mobile-First, los clientes te compran directo por WhatsApp. El dinero fluye directo a tu cuenta bancaria. Ni un centavo de comisión.\n\nDefiende tus márgenes. Son el esfuerzo de toda tu familia.",
    cta: "Revisa nuestros planes de suscripción plana y cambia tu historia.\n\n🌐 streetboss.com.mx\n💬 52 961 372 5386",
    hashtags: ["#StreetBoss", "#CeroComisiones", "#NegociosRentables", "#FoodTech"],
    visualDirection: { concept: "Esfuerzo real", story: "Taquero sudando en el trompo y luego viendo su venta directa", protagonist: "Maestro parrillero", scenario: "Taquería urbana" },
    imagePrompt: "OBJETIVO NARRATIVO: Enaltecer el esfuerzo y el sudor de la preparación, mostrando por qué cada peso importa.\n\nPROTAGONISTA: Maestro parrillero latino, 55 años, mandíbula firme. Gotas de sudor real en la frente. Camisa de trabajo arremangada.\n\nNEGOCIO: Taquería de alto volumen. Vapor continuo, espátulas de acero brillante.\n\nACCIÓN PRINCIPAL: Cortando carne en cámara lenta fotográfica, pero con el smartphone posado seguro a un lado del mostrador, mostrando notificaciones de venta directa.\n\nCOMIDA: Carne al pastor dorada en los bordes, fuego orgánico inferior.\n\nDIRECCIÓN DE ARTE: Street food heroico. Colores crudos, texturas agresivas pero apetitosas. Prohibido el sepia hollywoodense.\n\nCÁMARA: Angular 24mm desde un costado. Encuadre inmersivo.\n\nILUMINACIÓN: Luz cálida natural del fuego balanceada con la temperatura fría de los focos de la calle.\n\nEMOCIÓN Y TONO: Respeto profundo por el oficio gastronómico. Seriedad laboral.\n\nRESTRICCIONES TÉCNICAS ABSOLUTAS: 1) Cinco dedos en las manos que agarran el cuchillo. 2) Cuchillo proporcionado, sin deformación. 3) Cero sombreros de charro o folclore artificial.\n\nFORMATO: 9:16",
    motionPrompt: "Movimiento de cámara épico (slow motion). Las partículas de vapor y el fuego se mueven sutilmente en bucle lento. El protagonista realiza el movimiento de corte, luego levanta la vista hacia su teléfono. Todo con fluidez cinematográfica de alto rango.",
    script: "[0-2s] HOOK VISUAL: Parrillero cortando carne. Texto: \"¿Para quién estás trabajando realmente?\"\n[2-5s] VOZ EN OFF: \"Si el 30% se va en comisiones, estás perdiendo tu dinero.\"\n[5-8s] PLANO DETALLE: El teléfono recibe orden en WhatsApp. Texto: \"100% de la venta directa a tu caja.\"\n[8-10s] CIERRE: \"StreetBoss. Cero comisiones.\"",
    negativePrompt: NEGATIVE_PROMPT,
    aspectRatio: "9:16",
    resolution: "1080x1920",
    filename: "FB_REEL_1.webp",
    isApproved: false,
    date: "2026-08-02"
  },

  // ================= TIKTOK =================
  {
    id: "TT-VIDEO-001",
    network: "TikTok",
    format: "video",
    status: "Listo para publicar",
    title: "El secreto que los marketplaces odian",
    hook: "El secreto que los dueños de restaurantes rentables no te dicen.",
    copy: "Las aplicaciones famosas te convencen de que necesitas su 'exposición'. Pero la realidad es que a tus mejores clientes, los recurrentes, tú mismo los estás mandando a la app para que te cobren comisión.\n\nEl truco: Pasa a todos tus clientes habituales a tu propio enlace de StreetBoss. Siguen viendo tu menú hermoso desde su celular, pero te envían su pedido por WhatsApp. Ellos compran más rápido y tú conservas todas tus ganancias.\n\nEl enlace está en mi perfil. Haz el cambio hoy y mira tus números crecer.",
    cta: "Dale click al link de mi perfil para hacer una prueba gratuita.",
    hashtags: ["#StreetBoss", "#VentaDirecta", "#TipsRestaurantes", "#NegocioPropio"],
    visualDirection: { concept: "Revelación directa", story: "Dueño de negocio enseñando un tip directo a cámara (sin mirar cámara directamente, enfocado en mostrar su celular)", protagonist: "Emprendedor moderno", scenario: "Mesa limpia" },
    imagePrompt: "OBJETIVO NARRATIVO: Compartir un truco vital (hack) de supervivencia financiera.\n\nPROTAGONISTA: Hombre de 30 años, emprendedor gastronómico moderno. Playera básica, actitud desenfadada pero experta.\n\nNEGOCIO: Fondo desenfocado de local de comida rápida saludable (bowls o ensaladas).\n\nACCIÓN PRINCIPAL: Sostiene el celular con una mano y señala sutilmente la pantalla con la otra, explicando un concepto a un colega (mirada fuera de cámara).\n\nCOMIDA: Bowl de comida saludable desenfocado en primer plano inferior.\n\nDIRECCIÓN DE ARTE: Brillante, limpio, colores pastel y madera de pino clara. Todo respira modernidad.\n\nCÁMARA: Lente 35mm. Foco clavado en el celular que sostiene.\n\nILUMINACIÓN: Luz de día fresca. Sin dominantes de color amarillo. Balance de blancos impecable.\n\nEMOCIÓN Y TONO: Energía, agilidad, mentoría entre pares.\n\nRESTRICCIONES TÉCNICAS ABSOLUTAS: 1) Pantalla en gris neutral para edición. 2) Cero manos extrañas. 3) Vestimenta hiperrealista, tela con textura. 4) Sin naranja corporativo forzado.\n\nFORMATO: 9:16",
    motionPrompt: "Ligerísimo movimiento de manos al explicar, cámara en mano estabilizada, sensación de grabación en set real. Movimiento vertical de pantalla del celular mientras hace scroll.",
    script: "[0-2s] HOOK VISUAL: Señala el celular. Texto: \"El secreto que las apps odian.\"\n[2-5s] VOZ EN OFF: \"Si sigues mandando a tus clientes recurrentes a pagar comisión, estás tirando dinero.\"\n[5-8s] PLANO DEL DASHBOARD: Texto: \"Múdalos a StreetBoss. WhatsApp directo.\"\n[8-10s] CIERRE: \"Pruébalo gratis en el enlace del perfil.\"",
    negativePrompt: NEGATIVE_PROMPT,
    aspectRatio: "9:16",
    resolution: "1080x1920",
    filename: "TT_VIDEO_1.webp",
    isApproved: false,
    date: "2026-08-03"
  }
];

const profiles = [
  {
    network: "Instagram",
    username: "@streetboss.mx",
    category: "Software Company",
    contactInfo: { url: "https://streetboss.com.mx/", whatsapp: "529613725386", waLink: "https://wa.me/529613725386" },
    buttons: ["Mensaje", "Contactar"],
    cta: "Solicita un Demo 👇",
    profilePic: {
      prompt: "Logotipo SB minimalista en fondo Boss Charcoal. Safe zone 60%.",
      safeZone: "Círculo centrado."
    },
    bios: [
      { id: "A", name: "Directa", text: "Vende directo por WhatsApp.\nCero comisiones por pedido.\nTu menú, tus reglas.\n👇 Solicita un Demo" },
      { id: "B", name: "Promocional", text: "El sistema operativo para restaurantes independientes.\nDigitaliza tu menú y recibe pedidos directos.\n👇" },
      { id: "C", name: "Orgullo", text: "Apoyando al emprendedor gastronómico.\nEscaparate visual sin intermediarios.\n👇 Inicia hoy" },
      { id: "D", name: "FAQ", text: "¿Menú digital premium? Sí.\n¿Pedidos por WhatsApp? Sí.\n¿Comisiones? 0%.\n👇 Haz la prueba" },
      { id: "E", name: "Minimalista", text: "FoodTech para negocios reales.\nVenta Directa.\n👇" }
    ]
  },
  {
    network: "Facebook",
    username: "@StreetBossMX",
    category: "Producto/Servicio",
    contactInfo: { url: "https://streetboss.com.mx/", whatsapp: "529613725386" },
    buttons: ["WhatsApp"],
    cta: "Envíanos un mensaje directo.",
    profilePic: {
      prompt: "Logotipo SB centrado. Fondo Boss Charcoal.",
      safeZone: "Círculo centrado."
    },
    coverPhoto: {
      prompt: "Fotografía documental de taquero trabajando orgullosamente, espacio negativo amplio izquierda. Iluminación nocturna urbana real sin filtro naranja.",
      mobileSafeZone: "640x360 px centrales.",
      desktopSafeZone: "820x312 px completos.",
      text: "TU NEGOCIO, TUS CLIENTES, TUS REGLAS.\nEscaparate digital sin comisiones."
    },
    bios: [
      { id: "A", name: "Institucional", text: "StreetBoss ayuda a negocios de comida a vender directamente a través de un escaparate digital optimizado para móviles, conectando directamente con WhatsApp." },
      { id: "B", name: "Breve", text: "Escaparate digital premium para tu negocio de comida. Vende directo sin comisiones." },
      { id: "C", name: "Comunidad", text: "Únete a la revolución de la venta directa y recupera el control de tus ingresos." },
      { id: "D", name: "Producto", text: "Digitalizamos tu menú para que recibas órdenes limpias, exactas y directas en tu WhatsApp." },
      { id: "E", name: "Problema/Solución", text: "¿Cansado de pagar hasta 30% a otras apps? Descubre StreetBoss y vende directamente." }
    ]
  },
  {
    network: "TikTok",
    username: "@streetboss.mx",
    category: "B2B / Tecnología",
    contactInfo: { url: "https://streetboss.com.mx/" },
    buttons: ["Enlace"],
    cta: "Crea tu menú premium 👇",
    profilePic: {
      prompt: "Isotipo SB vibrante centrado.",
      safeZone: "Círculo estricto."
    },
    bios: [
      { id: "A", name: "Educativa", text: "Hackeando el sistema de delivery 🛑\nVende por WA 📲\n👇 Checa cómo" },
      { id: "B", name: "Orgánica", text: "Para dueños de restaurantes reales.\nGuarda tus ganancias.\n👇 Link aquí" },
      { id: "C", name: "Marketing", text: "El menú digital más pro.\nDirecto a tu caja.\n👇 Solicita demo" },
      { id: "D", name: "Hype", text: "Cero comisiones. 100% tu negocio.\nTransformación FoodTech.\n👇" },
      { id: "E", name: "Simple", text: "Vende comida en internet, sin regalar tu dinero.\n👇" }
    ]
  },
  {
    network: "WhatsApp Business",
    username: "StreetBoss",
    category: "Software",
    contactInfo: { url: "https://streetboss.com.mx/", description: "Plataforma de venta directa para restaurantes." },
    buttons: ["Catálogo", "Sitio Web"],
    cta: "Ver Catálogo completo.",
    profilePic: {
      prompt: "Logo de StreetBoss centrado en formato cuadrado. Fondo Boss Charcoal. Padding 20% para recorte circular automático de WA.",
      safeZone: "Círculo perfecto interno del 70%."
    },
    bios: [
      { id: "A", name: "Mensaje de Bienvenida", text: "¡Hola! 👋 Gracias por comunicarte con StreetBoss. ¿Tienes un restaurante y quieres implementar tu escaparate digital para vender sin comisiones? Déjanos tus dudas aquí y un asesor humano te responderá enseguida." },
      { id: "B", name: "Mensaje de Ausencia", text: "¡Hola! 🌙 En este momento estamos fuera del horario de oficina, pero tu independencia digital no puede esperar. Déjanos tu nombre, el giro de tu negocio y te contactaremos a primera hora." },
      { id: "C", name: "Respuesta Rápida: Demo", text: "Aquí tienes el enlace directo para que conozcas cómo se vería tu menú en StreetBoss: https://streetboss.com.mx/demo. Míralo desde tu celular y cuéntame qué te parece." },
      { id: "D", name: "Respuesta Rápida: Precios", text: "Nosotros NO cobramos comisiones por pedido. Pagas una tarifa plana de suscripción, y el 100% de tus ventas va directo a tu caja. ¿Quieres que te muestre los planes?" },
      { id: "E", name: "Mensaje de Cierre", text: "¡Excelente decisión! Te comparto el enlace para crear tu cuenta en menos de 5 minutos y subir tu primer producto. Si te atoras, avísame." }
    ]
  }
];

const highlights = [
  { id: "HL-01", name: "¿Qué es SB?", prompt: "Fondo Boss Charcoal con icono minimalista de smartphone. Vectorial.", recommendedOrder: 1, coverPath: "HL_QueEs.webp", contentDesc: "Explicación de cero comisiones." },
  { id: "HL-02", name: "Demos", prompt: "Fondo Street Orange con icono blanco minimalista de un tap. Vectorial.", recommendedOrder: 2, coverPath: "HL_Demos.webp", contentDesc: "Grabaciones reales de UI." }
];

fs.writeFileSync(path.join(DIR_DATA, 'posts.json'), JSON.stringify(posts, null, 2));
fs.writeFileSync(path.join(DIR_DATA, 'profiles.json'), JSON.stringify(profiles, null, 2));
fs.writeFileSync(path.join(DIR_DATA, 'highlights.json'), JSON.stringify(highlights, null, 2));

console.log("Generación 100% única y artesanal finalizada.");
