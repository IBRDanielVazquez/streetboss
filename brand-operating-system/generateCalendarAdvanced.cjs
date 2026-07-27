const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURACIÓN DE PARÁMETROS MAESTROS PARA PROMPTS DE HASTA 1,200 PALABRAS
// ============================================================================

const NARRATIVES = [
  "OBJETIVO NARRATIVO Y NARRATIVA DE LA ESCENA: La narrativa principal de esta fotografía es transmitir el control absoluto y la profesionalización del pequeño negocio gastronómico a través de la adopción tecnológica sin perder su esencia humana y auténtica. La historia de la escena nos sitúa en el preciso momento del clímax operativo de un día de ventas, donde la presión habitual de la hora pico es dominada por la fluidez de un sistema digital que centraliza todo en el celular. Se trata de mostrar la dignidad del trabajo duro, la evolución del emprendedor gastronómico latinoamericano y el contraste entre el trabajo manual tradicional de la preparación de alimentos y la modernidad de la recepción de pedidos sin fricción. No es una imagen corporativa fría, sino un documental visual cálido que respira esfuerzo, superación y el orgullo de quien cocina con las manos pero administra con tecnología punta.",
  "OBJETIVO NARRATIVO Y NARRATIVA DE LA ESCENA: El propósito central es comunicar la transición hacia la venta directa, libre de comisiones y ataduras a terceros, resaltando la independencia económica del emprendedor local. La escena documenta la tranquilidad y seguridad de un dueño de negocio que, a pesar de estar rodeado por el ambiente caótico, sonoro y caluroso de su cocina, mantiene una calma perfecta gracias al control de sus ventas. Se narra visualmente la victoria del emprendimiento de barrio, capturando el momento exacto en el que entra un pedido directo y rentable. Es una historia de empoderamiento puro; la tecnología se vuelve invisible para destacar el triunfo humano. La composición debe contar la historia de un negocio familiar que ha encontrado la forma de competir y ganar en el mercado digital moderno sin sacrificar su autenticidad."
];

const PROTAGONISTS = [
  "PROTAGONISTA Y ACCIÓN CENTRAL: El sujeto principal es el dueño del establecimiento, una persona de rasgos latinos auténticos, con marcas de experiencia y trabajo arduo en sus expresiones. Tiene una edad entre los 35 y 50 años, mostrando madurez, enfoque y determinación. Viste ropa de trabajo realista: un delantal de lona gruesa o mezclilla oscura con ligeras manchas de harina o aceite que atestiguan su involucramiento en la cocina, sobre una camiseta de algodón lisa de tono neutro. La acción principal consiste en el protagonista apoyado sutilmente en la barra de despacho de su negocio de comida, interactuando de forma relajada y segura con su smartphone. No está posando ni mirando directamente a la cámara; su mirada está concentrada en la pantalla del dispositivo, procesando un pedido entrante. Sus manos, fuertes y curtidas por el trabajo manual en la cocina, sostienen el celular con firmeza, evidenciando que el control operativo y digital de su restaurante está literalmente en la palma de su mano.",
  "PROTAGONISTA Y ACCIÓN CENTRAL: El foco es una jefa de cocina o dueña emprendedora, de aproximadamente 40 años, que refleja autoridad, experiencia y calidez. Su cabello está recogido ordenadamente, vistiendo un mandil de chef color oscuro sobre una camisa limpia pero utilitaria, sugiriendo que dirige el negocio desde las trincheras. Su expresión no es de estrés, sino de una profunda satisfacción y control administrativo. La acción se detiene en un microsegundo: ella se encuentra frente al área de entrega (pick-up), con un plato perfectamente presentado a punto de ser despachado. En una mano sostiene un smartphone estándar de gama media-alta, comprobando una notificación de nuevo pedido directo sin comisiones. La interacción con el dispositivo es secundaria a su presencia dominante en la cocina; el teléfono es simplemente la herramienta de su éxito. La postura transmite confianza absoluta, anclando toda la narrativa fotográfica en su liderazgo."
];

const ENVIRONMENTS = [
  "TIPO DE NEGOCIO Y DIRECCIÓN DE ARTE: La locación es una taquería callejera de alto flujo o cocina económica de tradición, rediseñada visualmente para transmitir higiene, profesionalismo y éxito, sin perder su arraigo popular. El entorno está vivo y en movimiento: al fondo, ligeramente desenfocado, se percibe el movimiento de empleados preparando comida, vapor levantándose de ollas calientes de aluminio y el resplandor de la plancha. La dirección de arte debe ser meticulosamente realista; no se permiten decoraciones plásticas ni luces de neón exageradas que parezcan cyberpunk. El mobiliario incluye barras de acero inoxidable, azulejos de cerámica brillante en las paredes, y detalles en madera rústica desgastada. Todo el lugar respira actividad gastronómica real, con utensilios de cocina colgados en su sitio, botellas de salsa, y papel estraza. Es un ambiente de barrio, pero elevado por un estándar de calidad incuestionable que demuestra que los negocios pequeños operan como verdaderas empresas.",
  "TIPO DE NEGOCIO Y DIRECCIÓN DE ARTE: El espacio es una dark kitchen (cocina oculta) o una pizzería/hamburguesería contemporánea, con una estética urbana e industrial. El ambiente es íntimo, iluminado de manera direccional. Se observan estanterías metálicas, cajas de embalaje kraft listas para envío y equipos de cocina industrial de alto rendimiento al fondo. La dirección de arte es minimalista pero cargada de detalles funcionales: tickets de pedidos colgados, pinzas de cocina de precisión, y superficies de acero cepillado. No hay elementos estereotipados ni parafernalia innecesaria; cada objeto en cuadro tiene una función operativa clara. El set debe sentirse ligeramente húmedo y caluroso, propio de una cocina comercial en pleno servicio de viernes por la noche. Se deben evitar por completo los elementos de diseño genéricos de bancos de imágenes; la autenticidad se logra mostrando marcas de uso en las mesas de trabajo y paredes con textura real de pintura lavable o azulejo metro (subway tile) blanco."
];

const GASTRONOMY = [
  "PRODUCTO GASTRONÓMICO Y TEXTURAS: La comida debe lucir absolutamente jugosa, vibrante y apetitosa (food styling hiperrealista). Aunque no es el enfoque principal, el producto que aparece en el plano medio debe sentirse recién hecho. Se ven ingredientes frescos: cilantro verde brillante, cebolla recién cortada con textura traslúcida, carnes con el brillo exacto de sus jugos naturales, y salsas con viscosidad realista. Las texturas orgánicas de la comida contrastan drásticamente con la textura metálica e industrial del área de trabajo y el acabado de cristal mate del smartphone. El pan, la carne o la tortilla deben tener imperfecciones naturales, marcas de la plancha y un ligero desprendimiento de humo o vapor difuso que interactúe de forma armónica con la iluminación del local. Nada de comida que parezca hecha de plástico o renderizada por computadora en 3D; el grado de fotorrealismo debe ser impecable.",
  "PRODUCTO GASTRONÓMICO Y TEXTURAS: El enfoque secundario de la imagen recae en platillos de alta demanda (hamburguesas, pizzas artesanales, o platillos de street food elevada) que descansan sobre bandejas de servicio. La textura de la comida es primordial: se debe percibir la textura crujiente de las frituras, el queso derretido con estiramientos microscópicos y el pan con miga aireada y tostado perfecto. Las gotas de condensación en una bebida fría cercana o el aceite chisporroteando en la plancha al fondo añaden una capa de experiencia sensorial profunda. Los materiales inorgánicos circundantes, como el papel pergamino, tablas de madera de olivo grueso y el metal frío de la bandeja, enfatizan la calidad táctil de los alimentos. El producto grita frescura, trabajo manual y amor por el detalle."
];

const CINEMATOGRAPHY = [
  "CÁMARA, LENTE, ILUMINACIÓN Y COLOR: Fotografía capturada con una cámara de formato medio Fujifilm GFX 100S o ARRI Alexa 65, utilizando un objetivo prime rápido, específicamente un Lente Carl Zeiss Otus de 55mm a f/1.4 o f/1.8 para asegurar una separación sujeto-fondo exquisita. La profundidad de campo debe ser superficial, aislando al protagonista y al dispositivo móvil en nitidez absoluta, mientras la cocina de fondo se desvanece en un bokeh cremoso y cinematográfico. La iluminación es técnica de bajo perfil (low-key lighting) al estilo claroscuro de Roger Deakins; luces prácticas provenientes de las lámparas del local proporcionan una iluminación cálida, amarilla-dorada (alrededor de 3200K) que baña el perfil del protagonista, contrastando fuertemente con las luces frías, ligeramente cianes, que entran desde la calle o las neveras industriales al fondo. Este contraste de temperatura de color proporciona profundidad tridimensional. La gradación de color debe ser natural, profunda, evitando por completo el exagerado y artificial filtro 'teal and orange'.",
  "CÁMARA, LENTE, ILUMINACIÓN Y COLOR: Fotografía de formato completo (Full Frame) tomada con una Sony A7R V y lente Sony G Master de 35mm a f/2.0. El encuadre es ligeramente más amplio para mostrar más contexto del negocio, utilizando una perspectiva a la altura del pecho del sujeto para enaltecerlo. La iluminación imita una mezcla de luz natural diurna difusa cruzada con luces interiores de tungsteno. Se debe utilizar un sistema de iluminación suave, simulando un softbox gigante desde la izquierda que abraza el rostro del sujeto, creando sombras suaves pero definidas en el lado derecho. La paleta de colores debe ser análoga, rica en tonos terrosos, aceros, grises cálidos y toques de verde natural, asegurando un contraste local muy alto (micro-contraste) que resalte cada arruga del delantal y cada detalle del rostro humano. El etalonaje es de película analógica Kodak Portra 400, con un grano cinematográfico microscópico para añadir realismo crudo."
];

const COMPOSITION_RESTRICTIONS = [
  "ENCUADRE, ZONA SEGURA Y RESTRICCIONES (NEGATIVE PROMPT INTEGRADO): La composición sigue estrictamente la proporción dorada y la regla de los tercios. El sujeto y el teléfono se ubican en el tercio inferior derecho, dejando intencionalmente todo el tercio superior y el tercio izquierdo despejado, formando un espacio negativo oscuro o desenfocado (Zona Segura) vital para la superposición de textos, titulares y elementos gráficos de marketing corporativo. El smartphone debe ser un rectángulo negro o gris genérico, limpio, sin logos visibles, sin interfaces holográficas, y sin íconos proyectados en el aire. ES ESTRICTAMENTE PROHIBIDO (NEGATIVE PROMPT ABSOLUTO): generar manos deformes, más de cinco dedos, extremidades fundidas con objetos, rostros en el fondo deformados, mutaciones de inteligencia artificial, personas clonadas repetitivas, celulares derritiéndose, pantallas con texto gibberish o letras alienígenas, hologramas de luz flotando sobre el celular, interfaces de estilo sci-fi, luz de neón saturada, estética plástica de render 3D, iluminación plana de stock, sonrisas falsas tipo anuncio de dentista, comida de plástico o exageradamente perfecta. La imagen debe ser indistinguible de una fotografía ganadora del World Press Photo en la categoría de vida cotidiana y trabajo.",
  "ENCUADRE, ZONA SEGURA Y RESTRICCIONES (NEGATIVE PROMPT INTEGRADO): Composición asimétrica balanceada pensada para diseño editorial y publicidad digital (Mobile First). El centro de atención se ancla en el tercio medio, pero existe un gradiente de luminosidad que oscurece deliberadamente la parte superior del cuadro (Top Safe Zone) para garantizar un contraste perfecto para fuentes blancas gruesas, y una viñeta pesada en los bordes inferiores. La postura del protagonista lidera la vista del espectador desde sus ojos, hacia sus manos y finalmente hacia el teléfono inteligente oscuro. El dispositivo no emite rayos láser ni brilla antinaturalmente; solo refleja la luz del entorno. APLICAR RESTRICCIONES ESTRICTAS (NEGATIVE PROMPT MAESTRO): Cero deformación anatómica en manos y falanges, cero rostros de cera, cero ojos asimétricos o estrábicos, prohibición absoluta de logotipos irreales en delantales, gorras o paredes, prohibición de texto ilegible generado por red neuronal en letreros del fondo, prohibición de iluminación de ring-light (aro de luz), cero aspecto de estudio fotográfico. El ambiente debe ser 100% orgánico, con fallas naturales, suciedad controlada y humanidad. Nada de renderizado Unreal Engine ni estética de videojuego."
];

// Combine to form a monstrous 800-1200 word prompt
function generateMassiveVisualPrompt() {
  const n = NARRATIVES[Math.floor(Math.random() * NARRATIVES.length)];
  const p = PROTAGONISTS[Math.floor(Math.random() * PROTAGONISTS.length)];
  const e = ENVIRONMENTS[Math.floor(Math.random() * ENVIRONMENTS.length)];
  const g = GASTRONOMY[Math.floor(Math.random() * GASTRONOMY.length)];
  const c = CINEMATOGRAPHY[Math.floor(Math.random() * CINEMATOGRAPHY.length)];
  const r = COMPOSITION_RESTRICTIONS[Math.floor(Math.random() * COMPOSITION_RESTRICTIONS.length)];
  
  return `${n}\n\n${p}\n\n${e}\n\n${g}\n\n${c}\n\n${r}`;
}

const PILARES = [
  "Venta directa sin intermediarios",
  "Cero comisión por pedido en cada venta",
  "Control absoluto del negocio y base de datos",
  "Presentación profesional e hiper-optimizada",
  "Filosofía Mobile First para conversiones",
  "Pedidos estructurados directo por WhatsApp",
  "Consolidación de la marca gastronómica local"
];

const UNICODE_HOOKS = [
  "𝗧𝘂 𝗻𝗲𝗴𝗼𝗰𝗶𝗼 𝗻𝗼 𝗻𝗲𝗰𝗲𝘀𝗶𝘁𝗮 𝘃𝗲𝗻𝗱𝗲𝗿 𝗺𝗲𝗻𝗼𝘀 𝗽𝗮𝗿𝗮 𝗰𝗿𝗲𝗰𝗲𝗿.",
  "𝗘𝗹 𝗰𝗼𝗻𝘁𝗿𝗼𝗹 𝗱𝗲 𝘁𝘂 𝗿𝗲𝘀𝘁𝗮𝘂𝗿𝗮𝗻𝘁𝗲 𝘃𝘂𝗲𝗹𝘃𝗲 𝗮 𝘁𝘂𝘀 𝗺𝗮𝗻𝗼𝘀.",
  "¿𝗖𝗮𝗻𝘀𝗮𝗱𝗼 𝗱𝗲 𝗽𝗲𝗿𝗱𝗲𝗿 𝗲𝗹 𝟯𝟬% 𝗲𝗻 𝗰𝗼𝗺𝗶𝘀𝗶𝗼𝗻𝗲𝘀 𝗮𝗯𝘂𝘀𝗶𝘃𝗮𝘀?",
  "𝗟𝗮 𝘃𝗲𝗻𝘁𝗮 𝗱𝗶𝗿𝗲𝗰𝘁𝗮 𝗲𝘀 𝗲𝗹 𝘂́𝗻𝗶𝗰𝗼 𝗳𝘂𝘁𝘂𝗿𝗼 𝗱𝗲 𝗹𝗮 𝗴𝗮𝘀𝘁𝗿𝗼𝗻𝗼𝗺𝗶́𝗮.",
  "𝗦𝗶𝗻 𝗰𝗼𝗺𝗶𝘀𝗶𝗼𝗻𝗲𝘀. 𝗦𝗶𝗻 𝗶𝗻𝘁𝗲𝗿𝗺𝗲𝗱𝗶𝗮𝗿𝗶𝗼𝘀. 𝗦𝗼𝗹𝗼 𝘁𝘂𝘀 𝘃𝗲𝗻𝘁𝗮𝘀."
];

const BODIES = [
  "StreetBoss convierte tu negocio en un escaparate digital optimizado para teléfonos móviles. Tus clientes pueden explorar tus productos con fotografías increíbles, seleccionar complementos sin ninguna confusión y enviarte el pedido perfectamente estructurado directamente por WhatsApp.\n\nTodo esto sin que tengas que ceder un solo peso de tu margen de ganancia. Porque el enorme esfuerzo de cocinar, administrar y servir es única y exclusivamente tuyo, y las ganancias de ese esfuerzo también deberían serlo.",
  "Depender exclusivamente de aplicaciones de terceros significa regalar el control de tu marca y de tu clientela. Con StreetBoss, centralizas todos tus pedidos en un enlace propio de alta velocidad que puedes anclar en tu biografía de Instagram o enviar de forma automática por WhatsApp.\n\nNo eres una opción más en una lista interminable ni compites por precio con otras marcas. Eres el único protagonista. Tu cliente ve tus colores, tus fotos, tu historia y tus precios reales, sin comisiones ocultas ni sorpresas desagradables en el carrito final.",
  "Imagina recibir cientos de pedidos de WhatsApp que no sean notas de voz indescifrables, textos cortados ni mensajes incompletos a mitad del servicio. Nuestro sistema tecnológico estructura matemáticamente cada orden con nombre del cliente, dirección exacta, platillos específicos, variaciones complejas y el método de pago elegido.\n\nEs una simplicidad extrema y elegancia para ti operando bajo presión en la cocina, y una experiencia de compra asombrosamente fluida, limpia y sin fricciones para tu cliente que está comprando desde la comodidad de su teléfono celular."
];

const CTAS = [
  "→ Solicita una demostración y descubre cómo funciona:\nhttps://wa.me/529613725386",
  "📲 Toma el control absoluto de tus pedidos hoy mismo. Escríbenos:\nhttps://wa.me/529613725386",
  "✓ Comienza a vender sin perder tus ganancias. Solicita tu demo gratis:\nhttps://wa.me/529613725386"
];

function generateCopy() {
  const hook = UNICODE_HOOKS[Math.floor(Math.random() * UNICODE_HOOKS.length)];
  const body = BODIES[Math.floor(Math.random() * BODIES.length)];
  const cta = CTAS[Math.floor(Math.random() * CTAS.length)];
  return `${hook}\n\n${body}\n\n${cta}\n\n#StreetBoss #FoodTech #VentaDirecta #SinComisiones #RestaurantesExitosos`;
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
      const pilar = PILARES[Math.floor(Math.random() * PILARES.length)];
      const postDate = new Date(startDate);
      postDate.setDate(postDate.getDate() + ((week - 1) * 7) + (i % 7));
      const idStr = `${plan.network.toUpperCase().substring(0,2)}-${plan.format.toUpperCase()}-${String(globalId).padStart(3, '0')}`;
      
      const post = {
        id: idStr,
        network: plan.network,
        format: plan.format,
        pilar: pilar,
        date: postDate.toISOString().split('T')[0],
        time: "18:00",
        week: week,
        status: "IMAGEN PENDIENTE",
        title: `Campaña W${week} - ${pilar}`,
        hook: UNICODE_HOOKS[Math.floor(Math.random() * UNICODE_HOOKS.length)],
        copy: generateCopy(),
        cta: CTAS[Math.floor(Math.random() * CTAS.length)],
        hashtags: ['#StreetBoss', '#FoodTech', '#VentaDirecta', '#Restaurantes'],
        imagePrompt: generateMassiveVisualPrompt(),
        negativePrompt: "manos deformes, rostros de cera, comida de plástico, texto de IA, logotipos falsos, hologramas, neón cyberpunk exagerado, render 3d",
        filename: `${idStr}_MASTER.jpg`,
        resolution: "1080x1350"
      };

      if (['reel', 'video', 'short'].includes(plan.format)) {
        post.script = `0-2s: (HOOK VISUAL)\n2-10s: Explicación de ${pilar}.\n10-15s: CTA en pantalla.`;
        post.motionPrompt = "Panorámica suave de izquierda a derecha. Efecto cinemático a 24fps. Profundidad de campo superficial revelando la acción gastronómica al fondo y anclando el foco en el teléfono central con la app activa.";
        post.resolution = "1080x1920";
        post.filename = `${idStr}_MASTER.mp4`;
      }
      
      if (plan.format === 'carrusel') {
        post.carouselTexts = [
          "Problema de comisiones altas.",
          "Impacto en tu margen de ganancia diaria.",
          "Cómo funciona la venta directa con StreetBoss.",
          "Ejemplo real de incremento de utilidades.",
          "Llamado a la acción para agendar demo gratuita."
        ];
      }

      if (plan.format === 'story' || plan.format === 'status') {
        post.resolution = "1080x1920";
        post.carouselTexts = ["Sabías que las apps retienen el 30%?", "Con StreetBoss ganas el 100%.", "Escríbenos para tu menú digital hoy."];
      }

      calendar.push(post);
      globalId++;
    }
  }
}

const networks = ['Instagram', 'Facebook', 'TikTok', 'WhatsApp', 'LinkedIn', 'YouTube'];
networks.forEach(net => {
  const netData = calendar.filter(p => p.network === net);
  fs.writeFileSync(
    path.join(__dirname, `src/data/calendar/${net.toLowerCase()}.ts`),
    `export const ${net.toLowerCase()}Data = ${JSON.stringify(netData, null, 2)};\n`
  );
});

fs.writeFileSync(
  path.join(__dirname, `src/data/calendar/masterCalendar.ts`),
  `export const masterCalendarData = ${JSON.stringify(calendar, null, 2)};\n`
);

fs.writeFileSync(
  path.join(__dirname, `src/data/posts.json`),
  JSON.stringify(calendar, null, 2)
);

console.log(`✅ Generador Masivo Avanzado Finalizado. ${calendar.length} posts creados con Prompts hiperdetallados de ~1000 palabras.`);
