const fs = require('fs');
const path = require('path');

const PILARES = [
  "Venta directa", "Cero comisión por pedido", "Control del negocio",
  "Presentación profesional", "Mobile First", "Pedidos por WhatsApp",
  "Marca gastronómica", "Educación para restauranteros", "Historias humanas",
  "Producto", "Conversión", "Autoridad FoodTech", "Objeciones",
  "Preguntas frecuentes", "Demostración", "Lanzamiento", "Construcción de comunidad"
];

const BUSINESSES = [
  "Taquería callejera de alto flujo", "Hamburguesería artesanal dark kitchen", 
  "Cafetería de especialidad y panadería", "Restaurante familiar tradicional",
  "Food truck urbano iluminado con neón", "Cocina económica con servicio rápido",
  "Negocio de postres y pastelería fina", "Marisquería costera con terraza",
  "Local de alitas y cervezas artesanales", "Puesto de hot dogs estilo Sonora",
  "Restaurante de comida regional y asados", "Pizzería al horno de leña",
  "Local de desayunos y brunch de fin de semana", "Heladería y nevería de barrio",
  "Barra de sushi contemporáneo", "Antojitos mexicanos y cenaduría",
  "Restaurante de comida saludable y bowls"
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
  "𝗗𝗲𝗷𝗮 𝗱𝗲 𝗿𝗲𝗻𝘁𝗮𝗿 𝘁𝘂𝘀 𝗰𝗹𝗶𝗲𝗻𝘁𝗲𝘀. 𝗖𝗼𝗻𝘀𝘁𝗿𝘂𝘆𝗲 𝘁𝘂 𝗯𝗮𝘀𝗲 𝗱𝗲 𝗱𝗮𝘁𝗼𝘀.",
  "𝗨𝗻𝗮 𝗲𝘅𝗽𝗲𝗿𝗶𝗲𝗻𝗰𝗶𝗮 𝗱𝗲 𝗽𝗲𝗱𝗶𝗱𝗼 𝗾𝘂𝗲 𝗲𝗻𝗮𝗺𝗼𝗿𝗮 𝗮 𝘁𝘂 𝗰𝗹𝗶𝗲𝗻𝘁𝗲.",
  "𝗟𝗮𝘀 𝗮𝗽𝗽𝘀 𝗱𝗲 𝗱𝗲𝗹𝗶𝘃𝗲𝗿𝘆 𝘀𝗼𝗻 𝘂𝗻 𝗰𝗮𝗻𝗮𝗹, 𝗻𝗼 𝘁𝘂 𝗻𝗲𝗴𝗼𝗰𝗶𝗼.",
  "𝗧𝗿𝗮𝗻𝘀𝗳𝗼𝗿𝗺𝗮 𝘁𝘂 𝗺𝗲𝗻𝘂́ 𝗲𝗻 𝘂𝗻 𝗺𝗼𝘁𝗼𝗿 𝗱𝗲 𝘃𝗲𝗻𝘁𝗮𝘀 𝗱𝗶𝗿𝗲𝗰𝘁𝗮𝘀.",
  "𝗦𝘁𝗿𝗲𝗲𝘁𝗕𝗼𝘀𝘀 𝗻𝗼 𝗲𝘀 𝘂𝗻 𝗺𝗲𝗻𝘂́ 𝗤𝗥, 𝗲𝘀 𝘁𝘂 𝗻𝘂𝗲𝘃𝗼 𝘀𝗶𝘀𝘁𝗲𝗺𝗮 𝗱𝗲 𝘃𝗲𝗻𝘁𝗮𝘀."
];

const BODIES = [
  "StreetBoss convierte tu negocio en un escaparate digital optimizado para móviles. Tus clientes pueden explorar tus productos con fotografías increíbles, seleccionar complementos sin confusión y enviarte el pedido perfectamente estructurado directamente por WhatsApp.\n\nTodo esto sin que tengas que ceder un solo peso de tu margen de ganancia. Porque el esfuerzo de cocinar y servir es tuyo, y las ganancias también deberían serlo.",
  "Depender exclusivamente de aplicaciones de terceros significa regalar el control de tu marca. Con StreetBoss, centralizas tus pedidos en un enlace propio que puedes poner en tu biografía de Instagram o enviar por WhatsApp. \n\nNo eres una opción más en una lista interminable. Eres el único protagonista. Tu cliente ve tus colores, tus fotos y tus precios reales, sin comisiones ocultas.",
  "Imagina recibir pedidos de WhatsApp que no sean notas de voz indescifrables ni mensajes incompletos. Nuestro sistema estructura cada orden con nombre, dirección, platillos, variaciones y método de pago.\n\nSimplicidad extrema para ti en la cocina, y una experiencia de compra fluida y sin fricciones para tu cliente que compra desde su celular.",
  "El verdadero problema de los restaurantes hoy no es vender, es retener el margen de utilidad. Cuando pagas hasta el 30% por cada envío, estás trabajando para alguien más. \n\nStreetBoss te da la tecnología de una gran cadena, adaptada a la realidad de tu local. Empieza a dirigir el tráfico de tus redes sociales a tu propio canal de venta directa y recupera tu rentabilidad hoy mismo."
];

const CTAS = [
  "→ Solicita una demostración y descubre cómo funciona:\nhttps://wa.me/529613725386",
  "📲 Toma el control de tus pedidos hoy mismo. Escríbenos:\nhttps://wa.me/529613725386",
  "✓ Comienza a vender sin comisiones. Solicita tu demo:\nhttps://wa.me/529613725386",
  "Habla con nosotros y transforma tus ventas por WhatsApp:\nhttps://wa.me/529613725386",
  "🔗 Haz clic y pide una prueba de la plataforma:\nhttps://wa.me/529613725386"
];

const VISUAL_DIRECTIONS = [
  "Fotografía documental hiperrealista, estilo fotoperiodismo gastronómico. Captura el momento exacto de alta presión y pasión en la cocina. El humo de la parrilla envuelve sutilmente la escena, creando una atmósfera cinematográfica. Iluminación cálida de luces colgantes industriales que resaltan los colores vibrantes de los ingredientes frescos. Shot en 35mm, lente f/1.4 para un bokeh pronunciado en el fondo donde se distinguen siluetas de clientes. Emoción: Autenticidad, trabajo duro, calidad humana.",
  "Toma cenital (overhead) limpia y minimalista, con estética 'Mobile First'. Un teléfono inteligente de última generación en el centro, mostrando la interfaz fluida de StreetBoss. Alrededor, de manera simétrica y altamente estética, platos servidos con presentación de alta cocina, cubiertos de acero inoxidable mate y una taza de café humeante. Luz natural suave y difusa (softbox) proveniente de la izquierda, creando sombras largas y elegantes. Emoción: Modernidad, orden, tecnología al servicio de la gastronomía.",
  "Retrato en primer plano (close-up) de un dueño de negocio, mirando directamente a la cámara con una sonrisa de confianza y alivio. Está de pie en la barra de despacho de su local. Detrás de él, el desenfoque revela un local lleno, activo, pero bajo control. Viste un delantal de mezclilla de alta calidad. Iluminación tipo Rembrandt, acentuando la textura de su rostro y reflejando determinación. Colores saturados pero naturales, sin filtros de Instagram. Emoción: Empoderamiento, tranquilidad, éxito local.",
  "Escena de 'Behind the Scenes' (detrás de escena) al amanecer. La luz azul de la mañana entra por la persiana metálica a medio abrir. Un chef o preparador cortando ingredientes frescos sobre una tabla de madera robusta. En la esquina del cuadro, una tablet o teléfono con StreetBoss abierto recibiendo el primer pedido del día. Contraste alto, sombras profundas, estilo claroscuro cinematográfico. Lente macro de 85mm capturando las gotas de agua sobre los vegetales. Emoción: Preparación, frescura, el inicio del éxito."
];

const NEGATIVE_PROMPT = "manos deformes, dedos adicionales, rostros duplicados, personas clonadas, teléfonos deformes, pantallas ilegibles, interfaces inventadas, texto generado por IA, logos falsos, isotipos incorrectos, comida plástica, vapor exagerado, saturación extrema, iluminación artificial, estética de stock, mansiones, cocinas irreales, negocios excesivamente perfectos, hologramas, pantallas flotantes, interfaces futuristas, objetos duplicados, perspectiva rota, profundidad inconsistente, fondos genéricos, exceso de naranja, estereotipos culturales, pobreza explotada, uniformes corporativos falsos, sonrisas posadas, 3d render, cartoon, caricatura";

const MOTION_PROMPTS = [
  "Movimiento lento de cámara tipo slider de izquierda a derecha. Ligero slow motion (0.5x) para enfatizar el vapor saliendo de la comida y el brillo de los ingredientes. El enfoque se mantiene fijo en el producto central mientras el fondo exhibe movimiento suave de la actividad del restaurante.",
  "Dolly-in sutil hacia el rostro del protagonista. El fondo mantiene una actividad fluida y natural, personas pasando y fuego de la cocina en sutil movimiento. La iluminación fluctúa levemente imitando luz natural.",
  "Toma estática (locked-off tripod) donde solo ocurre la acción interna: el plato es depositado en la mesa, el teléfono recibe una notificación que ilumina la escena brevemente, y el vapor se disipa de forma realista y orgánica.",
  "Transición dinámica tipo whip-pan que comienza en las manos preparando el platillo y termina en el teléfono celular que muestra un pedido confirmado. Movimiento rápido y fluido con motion blur realista."
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generatePrompt(business, pilar) {
  const dir = getRandom(VISUAL_DIRECTIONS);
  return `Objetivo narrativo: Representar la ventaja de ${pilar}. Historia de la escena: Muestra la autenticidad y el control de un negocio real utilizando tecnología accesible. Protagonista: Dueño o personal clave operando su negocio con orgullo. Tipo de negocio: ${business}. Acción: Interactuando indirectamente con la tecnología (StreetBoss) mientras mantiene el enfoque en la calidad de la comida y el servicio al cliente. Dirección fotográfica: ${dir} Cámara: ARRI Alexa Mini, Lente Zeiss Master Prime. Encuadre: Composición basada en la regla de los tercios, permitiendo espacio negativo superior (Zona segura) para acomodar copy sin obstruir la acción. Colores: Ricos, verdaderos a la vida, paleta cálida latinoamericana pero sin filtro sepia ni naranja artificial. Texturas: Alta fidelidad en madera, acero, tela del delantal y comida jugosa. IMPORTANTE: El teléfono (si aparece) debe ser un smartphone moderno estándar sin interfaces holográficas ni logos falsos.`;
}

function generateCopy(pilar, network) {
  const hook = getRandom(UNICODE_HOOKS);
  const body = getRandom(BODIES);
  const cta = getRandom(CTAS);
  const tags = `#StreetBoss #VentaDirecta #FoodTech #Restaurantes`;
  
  if (network === 'Twitter' || network === 'WhatsApp') {
    return `${hook}\n\n${cta}`;
  }
  return `${hook}\n\n${body}\n\n${cta}\n\n${tags}`;
}

const calendar = [];
const startDate = new Date(); // Start today
let globalId = 1;

for (let week = 1; week <= 13; week++) {
  // Define per network daily schedule
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
      const pilar = getRandom(PILARES);
      const business = getRandom(BUSINESSES);
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
        hook: getRandom(UNICODE_HOOKS),
        copy: generateCopy(pilar, plan.network),
        cta: getRandom(CTAS),
        hashtags: ['#StreetBoss', '#FoodTech', '#VentaDirecta', '#Restaurantes'].map(t=>t),
        visualDirection: {
          concept: `Representar la realidad de ${business}`,
          business: business,
        },
        imagePrompt: generatePrompt(business, pilar),
        negativePrompt: NEGATIVE_PROMPT,
        filename: `${idStr}_MASTER.jpg`,
        resolution: "1080x1350"
      };

      if (['reel', 'video', 'short'].includes(plan.format)) {
        post.script = `0-2s: (HOOK) ${post.hook}\n2-10s: Explicación visual de ${pilar} en ${business}.\n10-15s: CTA en pantalla y audio: "Comienza a vender directo".`;
        post.motionPrompt = getRandom(MOTION_PROMPTS);
        post.resolution = "1080x1920";
        post.filename = `${idStr}_MASTER.mp4`;
      }
      
      if (plan.format === 'carrusel') {
        post.carouselTexts = [
          post.hook,
          "Problema: Las comisiones te quitan el margen.",
          "Solución: Venta directa por WhatsApp.",
          "El control total regresa a tus manos.",
          post.cta
        ];
      }

      if (plan.format === 'story' || plan.format === 'status') {
        post.resolution = "1080x1920";
        post.carouselTexts = ["Interacción directa con la audiencia.", "Encuesta o Demostración rápida.", post.cta];
      }

      calendar.push(post);
      globalId++;
    }
  }
}

// Split into separate files as requested
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

// We overwrite posts.json so the current App.tsx naturally loads them without huge structural changes
fs.writeFileSync(
  path.join(__dirname, `src/data/posts.json`),
  JSON.stringify(calendar, null, 2)
);

// Add standard TS structures
['prompts', 'campaigns', 'pillars', 'formats'].forEach(folder => {
  fs.writeFileSync(
    path.join(__dirname, `src/data/${folder}/index.ts`),
    `export const ${folder}Data = [];\n`
  );
});

console.log(`Generado calendario de ${calendar.length} posts a lo largo de 90 días (13 semanas).`);
