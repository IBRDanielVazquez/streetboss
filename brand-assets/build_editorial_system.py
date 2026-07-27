#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
StreetBoss · Generador del Sistema Editorial de 90 días
=======================================================
Construye, de forma determinista y consistente con brand-core/, todo el sistema
editorial de lanzamiento: calendario (MD/CSV/JSON/HTML) + archivos individuales de
cada post, cada reel y las stories diarias, con contenido real y aterrizado.

- NO toca el software ni brand-core/. Solo escribe dentro de brand-assets/.
- NO genera el logo por IA. Los prompts producen escenas SIN logo; el logo se integra
  después con los SVG maestros de brand-core/.
- Fuente de verdad: brand-core/ + streetboss-gpt/ (Knowledge Pack).

Uso:  python3 build_editorial_system.py
"""

import os, csv, json, datetime, textwrap

BASE = os.path.dirname(os.path.abspath(__file__))

# ── COLORES OFICIALES (brand-core/02_Color_System.md) ───────────────────────────
STREET_ORANGE = "#FF4B00"
BOSS_CHARCOAL = "#0D0E12"
ORANGE_LIGHT  = "#FF6A1A"
WHITE         = "#FFFFFF"

# ── PARÁMETROS ──────────────────────────────────────────────────────────────────
# Fecha de inicio: NO documentada por Daniel -> se elige el próximo lunes (conservador).
# Registrado en 13-reports/pending_decisions.md. Cambiar aquí si se autoriza otra.
START_DATE = datetime.date(2026, 7, 27)   # lunes
TOTAL_DAYS = 90
FOUNDER_PRICE = "$100 MXN mensuales"
FOUNDER_COPY = ("Se buscan restaurantes y negocios de comida que quieran probar su "
                "escaparate digital con precio fundador de lanzamiento: $100 MXN mensuales.")

# ── DIMENSIONES OFICIALES (Fase 10) ─────────────────────────────────────────────
DIM = {
    "reel":      "1080x1920",
    "short":     "1080x1920",
    "story":     "1080x1920",
    "post":      "1080x1350",
    "square":    "1080x1080",
    "carousel":  "1080x1350",
    "li_doc":    "1080x1350",
    "li_feed":   "1200x1500",
    "yt_thumb":  "1280x720",
    "og":        "1200x630",
}

# ── CTAs OFICIALES ──────────────────────────────────────────────────────────────
CTA = {
    "wa":       "Escríbenos por WhatsApp y arma tu escaparate.",
    "demo":     "Pídenos una demo por WhatsApp. Sin compromiso.",
    "founder":  "Cupo fundador abierto. Escríbenos por WhatsApp.",
    "save":     "Guarda esto y compártelo con ese restaurante que lo necesita.",
    "comment":  "Comenta “DIRECTO” y te mandamos cómo se ve tu menú.",
    "follow":   "Síguenos para vender directo y mandar tú.",
    "link":     "El link de tu escaparate va en tu bio. Nosotros te lo armamos.",
}

# ── HASHTAGS (máximo 5 por pieza) ───────────────────────────────────────────────
HT = {
    "core":   ["#StreetBoss", "#VendeDirecto", "#Restaurantes"],
    "food":   ["#StreetBoss", "#FoodPorn", "#ComidaMexicana", "#Antojo", "#Restaurantes"],
    "b2b":    ["#StreetBoss", "#Restaurantes", "#Emprendimiento", "#NegociosDeComida"],
    "edu":    ["#StreetBoss", "#MarketingGastronomico", "#Restaurantes", "#VentaDirecta"],
    "commercial": ["#StreetBoss", "#PrecioFundador", "#Restaurantes", "#VendeDirecto"],
}

# ── PLANTILLAS (Fase 9) que usa cada tipo de contenido ──────────────────────────
TEMPLATE = {
    "pain":      "T01-pain",
    "product":   "T05-product",
    "foodporn":  "T06-foodporn",
    "carousel":  "T07-carousel-edu",
    "data":      "T08-data",
    "culture":   "T10-culture",
    "commercial":"T13-founder-price",
}

# ════════════════════════════════════════════════════════════════════════════════
#  BANCOS DE CONTENIDO — 90 temas reales, diferenciados y aterrizados.
#  Orden = progresión de fase (awareness → demo/autoridad → conversión).
#  Campos: (topic, hook, on_screen_text, angle, extra)
#    - extra en foodporn = (platillo, textura_fondo)
#    - extra en commercial = objeción/enfoque
# ════════════════════════════════════════════════════════════════════════════════

PAIN_REELS = [  # Lunes — dolor/problema (13)
 ("El caos del WhatsApp desordenado","POV: son las 2 pm y tu WhatsApp es un caos de pedidos",
  "¿Así tomas tus pedidos?","Mostrar el dolor real: capturas, audios, “¿ya sumaste?”, errores en cocina.","cocina saturada, teléfono sonando"),
 ("El menú en PDF que espanta","Tu cliente abrió tu menú… y se salió en 3 segundos",
  "El PDF no vende","El PDF obliga a hacer zoom, sumar a mano y escribir todo. Fricción = pedido perdido.","pdf borroso en pantalla"),
 ("El 30% que regalas","Cada pedido en la app… y el 30% se va a otro bolsillo",
  "¿Y tu margen?","La comisión de intermediarios se come tu ganancia en tus clientes que YA te conocen.","ticket con comisión marcada"),
 ("Errores en cocina por mala comunicación","“Dijo sin cebolla”… salió con cebolla",
  "El pedido mal entendido cuesta","Pedidos por audio/nota = errores, reposiciones, clientes molestos.","plato devuelto"),
 ("No sabes quién es tu cliente","Vendes 1,000 pedidos al mes y no tienes ni un solo contacto",
  "¿De quién son tus clientes?","En las apps, tu cliente es de la app. Sin datos no hay recompra dirigida.","pantalla de app ajena"),
 ("Depender del algoritmo","Hoy te muestran, mañana no. Tú no decides.",
  "No mandas en tu negocio","Depender de un agregador = depender de su algoritmo y sus reglas.","gráfica cayendo"),
 ("El cliente que no encontró cómo pedir","Le encantó tu foto… pero no supo cómo pedir",
  "Si no es fácil, no compra","Sin un flujo claro de pedido, el antojo no se convierte en venta.","dedo dudando sobre pantalla"),
 ("La guerra de precios del marketplace","En la app compites por precio contra tu vecino",
  "Ahí solo gana la app","El marketplace te vuelve un commodity. Tu marca desaparece.","lista de precios apilada"),
 ("Tu marca escondida","En la app, tu logo es del tamaño de una uña",
  "¿Dónde quedó tu marca?","El intermediario tapa tu identidad. Eres un renglón más.","logos diminutos en grid"),
 ("El menú desactualizado","Se acabó el platillo… pero sigue “disponible”",
  "Menú viejo = pedido perdido","No poder actualizar al instante genera pedidos que no puedes cumplir.","pizarrón tachado"),
 ("Perder al cliente recurrente","Tu mejor cliente pide por la app y te cuesta el 30%",
  "Al recurrente NO le regales margen","A quien ya te conoce, dale tu link directo. El nuevo, ok. El fiel, directo.","cliente frecuente en mostrador"),
 ("El domingo de pedidos perdidos","Saturado un domingo: 3 pedidos se te fueron sin querer",
  "El desorden te cuesta ventas","Sin sistema, la hora pico se traduce en ventas que nunca cobraste.","reloj marcando hora pico"),
 ("La ilusión de “ya tengo redes”","Tienes 10k seguidores… y ni un botón para pedir",
  "Seguidores ≠ pedidos","Sin escaparate, tus redes generan likes, no ventas.","perfil con muchos likes"),
]

PRODUCT_REELS = [  # Miércoles — producto/demo (13)
 ("Del link al pedido en 20 segundos","Mira cómo se arma un pedido perfecto en 20 segundos",
  "Fricción cero","Demo real: abrir link → tocar platillo → agregar → enviar a WhatsApp.","demo de la interfaz"),
 ("El pedido perfecto en tu WhatsApp","Así cae el pedido en tu WhatsApp: ordenado y sumado",
  "Ticket impecable","Mostrar el mensaje estructurado que llega listo para cocina.","chat de WhatsApp con ticket"),
 ("Tu menú, hipervisual","Tu menú ya no es texto: es una vitrina que da hambre",
  "80% comida, 20% interfaz","Regla 80/20: la foto manda, la interfaz solo acompaña.","escaparate con fotos grandes"),
 ("Publica tu menú en 15 minutos","Publicaste tu escaparate en menos de 15 minutos",
  "Time-to-value < 15 min","Onboarding real: cargar categoría, foto, precio, listo.","panel de administración"),
 ("Agotar un platillo en 1 toque","Se acabó el pastor: 1 toque y desaparece del menú",
  "Control en tiempo real","Actualizas disponibilidad al instante. Sin pedidos imposibles.","toggle de disponibilidad"),
 ("Carrito flotante siempre visible","El cliente ve su total todo el tiempo. Cero sorpresas.",
  "Transparencia total","El carrito flotante muestra el subtotal en cada paso.","carrito con subtotal"),
 ("Sin apps que descargar","Tu cliente pide sin bajar ninguna app",
  "Abre y pide","El escaparate abre desde un link o QR. Instantáneo.","QR a escaparate"),
 ("El QR en tu mesa","Un QR en la mesa = pedido para llevar mientras comen aquí",
  "Vende en cada mesa","El mismo escaparate sirve en mesa, bio y estados.","QR sobre mesa de restaurante"),
 ("Checkout minimalista","Dirección, mesa o para llevar: 3 datos y listo",
  "Menos pasos, más pedidos","Checkout sin fricción: solo lo esencial para cocinar y entregar.","formulario minimalista"),
 ("Fotos optimizadas que cargan volando","Tus fotos pesan menos y cargan al instante",
  "Rápido = más ventas","La lentitud espanta. StreetBoss optimiza cada imagen.","medidor de velocidad"),
 ("Tu escaparate en la bio","Un solo link en tu bio y todos pueden pedir",
  "Tu bio ahora vende","El link de venta directa vive en tu perfil de Instagram/TikTok.","bio con link"),
 ("Categorías que se navegan solas","Tacos, bebidas, postres: el cliente encuentra todo",
  "Navegación clara","Categorías ancladas arriba, scroll suave. Cero confusión.","menú por categorías"),
 ("Antes y después de tu menú","Antes: PDF. Después: escaparate que vende.",
  "El cambio se nota","Comparación visual directa entre el PDF y el escaparate StreetBoss.","split screen antes/después"),
]

FOODPORN_REELS = [  # Viernes — foodporn (13). extra = (platillo, textura_fondo)
 ("Tacos al pastor en cámara lenta","El trompo girando y la grasa brillando en 4K",
  "Se ve. Se antoja. Se pide.","Puro antojo: textura, brillo, vapor. Cierre con el link para pedir.",("tacos al pastor con piña","madera carbonizada")),
 ("El queso que se estira","Ese momento en que el queso se estira y no puedes ver otra cosa",
  "El hambre entra por los ojos","Macro del cheese pull. Deseo físico. CTA suave a pedir.",("pizza con queso derretido","pizarra oscura")),
 ("Hamburguesa jugosa a 45°","La mordida perfecta, la salsa cayendo",
  "Así se ve el antojo","Plano 45°, jugo cayendo, pan brillante.",("hamburguesa con queso y salsa","metal oxidado oscuro")),
 ("Mariscos frescos brillando","Limón exprimido sobre el marisco fresco",
  "Directo del mar a tu pantalla","Frescura, color, brillo de cítrico.",("tostada de camarón","hielo y pizarra")),
 ("Café y pan recién horneado","El vapor del café y el pan saliendo del horno",
  "Tu mañana empieza aquí","Ambiente cálido, vapor, textura de pan.",("café y concha","madera clara oscurecida")),
 ("Alitas bañadas en salsa","Las alitas girando bañadas en salsa buffalo",
  "Picante que se ve","Brillo de salsa, textura crujiente.",("alitas buffalo","canasta y papel kraft")),
 ("Postre con chocolate cayendo","El chocolate cayendo lento sobre el postre",
  "El final feliz","Cámara lenta, chocolate líquido, textura.",("pastel de chocolate","plato oscuro mate")),
 ("Sushi rolls en fila","Los rolls perfectamente alineados y brillando",
  "Precisión que se antoja","Top-down parcial, colores saturados.",("sushi variado","pizarra negra")),
 ("Birria con consomé humeante","El taco de birria entrando al consomé humeante",
  "El dip que enamora","Vapor, rojo intenso, dip en cámara lenta.",("tacos de birria","comal de hierro")),
 ("Pizza saliendo del horno","La pala sacando la pizza del horno de leña",
  "Directo del horno","Fuego de fondo, burbujas del queso.",("pizza artesanal","horno de leña")),
 ("Elote y esquites callejeros","El queso y el chile cayendo sobre el esquite",
  "Sabor de la calle","Cercano, vapor, colores cálidos.",("esquites con queso","carrito nocturno")),
 ("Parrillada al carbón","El corte sellándose sobre el carbón encendido",
  "El humo que sabe a fin de semana","Fuego, humo, sear marks.",("arrachera a la parrilla","brasas encendidas")),
 ("Combo familiar completo","Todo el combo servido: para compartir",
  "Para toda la mesa","Cenital de combo grande, abundancia.",("combo de hamburguesas y papas","mesa de madera oscura")),
]

EDU_CAROUSELS = [  # Martes — carrusel educativo (13). 6-7 slides
 ("Por qué el PDF te cuesta dinero","3 razones por las que tu menú en PDF pierde pedidos",
  "El PDF no vende","Educar sobre fricción del PDF vs. escaparate transaccional.","edu"),
 ("Marketplace vs. venta directa","¿Cliente nuevo o cliente tuyo? La diferencia de 30%",
  "Directo manda","Cuándo sí conviene la app y cuándo dar tu link directo.","edu"),
 ("Anatomía de un pedido perfecto","Cómo se ve un pedido que la cocina entiende a la primera",
  "Orden = crecimiento","Descomponer el ticket estructurado y por qué reduce errores.","edu"),
 ("5 fotos que venden más comida","La guía rápida para fotografiar tu comida con el celular",
  "El hambre entra por los ojos","Tips de luz, ángulo 45°, fondo oscuro, cercanía.","edu"),
 ("Qué es un escaparate digital","No es un menú QR: es una vitrina que transacciona",
  "Escaparate ≠ menú QR","Definir la categoría y por qué vende más.","edu"),
 ("El costo real de las comisiones","Cuánto pierdes al año regalando 30% por pedido",
  "Haz las cuentas","Ejercicio ilustrativo de margen perdido (CASO ILUSTRATIVO).","edu"),
 ("Mobile first: por qué importa","El 80% de tus clientes pide desde el celular",
  "Piensa en móvil","Por qué el menú debe diseñarse para el pulgar.","edu"),
 ("Cómo describir un platillo que vende","Las palabras que despiertan el antojo",
  "Vende con palabras","Fórmula de descripción: sensación + ingrediente estrella + porción.","edu"),
 ("Tu marca vs. ser un renglón","Cómo recuperar tu identidad frente a los agregadores",
  "Tu marca importa","Branding gastronómico: por qué tu logo y tu historia venden.","edu"),
 ("El embudo de la venta directa","De un Reel a un pedido en tu WhatsApp, paso a paso",
  "De la vista al pedido","Explicar el journey: contenido → escaparate → WhatsApp.","edu"),
 ("Recompra: el secreto del margen","Por qué el cliente que regresa es tu verdadero negocio",
  "El fiel vale oro","Retención > adquisición. Cómo la venta directa la habilita.","edu"),
 ("Errores que espantan pedidos","7 cosas en tu menú digital que te cuestan ventas hoy",
  "Revisa tu menú","Checklist de fricción: lentitud, precios ocultos, sin fotos…","edu"),
 ("Cómo lanzar tu escaparate esta semana","Tu plan de 5 pasos para vender directo ya",
  "Empieza hoy","Guía accionable de arranque + precio fundador al cierre.","edu"),
]

DATA_GRAPHICS = [  # Jueves — comparativa / dato (13)
 ("0% de comisión","0% de comisión por pedido. Punto.",
  "Cero comisiones","Afirmación fuerte y verificable: StreetBoss no cobra % por venta.","data"),
 ("Menú QR vs. StreetBoss","Menú QR muestra. StreetBoss vende.",
  "Muestra vs. Vende","Comparativa clara de capacidades (transacción vs. solo ver).","data"),
 ("< 15 minutos para publicar","Tu menú publicado en menos de 15 minutos",
  "Time-to-value","Dato de producto: onboarding rápido.","data"),
 ("El 30% que te quedas","Con tu link directo, el 100% de la ganancia es tuya",
  "Tu margen, tuyo","Contraste 30% intermediario vs. 0% StreetBoss.","data"),
 ("App vs. Link directo","App: cliente de la app. Link: cliente tuyo.",
  "¿De quién es tu cliente?","Comparativa de soberanía del cliente.","data"),
 ("PDF vs. Escaparate","PDF: escribe a mano. Escaparate: arma el pedido solo.",
  "Adiós al PDF","Comparativa de experiencia de pedido.","data"),
 ("WhatsApp: donde ya estás","Tus clientes ya usan WhatsApp. El pedido cae ahí.",
  "Sin apps nuevas","Dato de penetración de WhatsApp (contexto LatAm).","data"),
 ("1 link, todos tus canales","Bio, QR, estados: un solo link para vender",
  "Un link para todo","Versatilidad del link de venta directa.","data"),
 ("Rápido = más ventas","Una web lenta espanta pedidos. La velocidad convierte.",
  "La velocidad vende","Dato UX: performance como factor de conversión.","data"),
 ("Tu escaparate nunca cierra","Tu menú vende aunque tú estés dormido",
  "Abierto 24/7","El escaparate recibe pedidos fuera de horario (según config).","data"),
 ("Comparativa: soberanía de datos","Tú dueño de tus clientes vs. datos ajenos",
  "Soberanía","Comparativa de propiedad de la relación con el cliente.","data"),
 ("El costo de un cliente perdido","Perder un recurrente cuesta más que ganar uno nuevo",
  "Cuida al que vuelve","Dato ilustrativo de valor de recompra (CASO ILUSTRATIVO).","data"),
 ("StreetBoss en números","Directo · Cero comisión · < 15 min · 100% tu marca",
  "Los números claros","Tarjeta resumen de propuesta de valor.","data"),
]

CULTURE_GRAPHICS = [  # Sábado — cultura / marca (13)
 ("El que cocina, manda","El que cocina, manda.",
  "Manifiesto","Pieza de manifiesto: soberanía del restaurantero.","culture"),
 ("Vende directo. Manda tú.","Vende directo. Manda tú.",
  "Eslogan B2B","Reforzar el eslogan principal con estética premium.","culture"),
 ("Tu restaurante, tus reglas","Tu restaurante merece vender bajo sus propias reglas",
  "Tus reglas","Mensaje nuclear #1 en pieza de marca.","culture"),
 ("Recupera el control","Recupera el control de tus clientes y de tus márgenes",
  "Recupera el control","Mensaje nuclear #3.","culture"),
 ("El orden crece","El orden en tus pedidos es el primer paso hacia el crecimiento",
  "Orden = crecimiento","Mensaje nuclear #2.","culture"),
 ("Hecho para la calle","De la cocina de barrio a la vitrina digital",
  "Con orgullo de barrio","Cultura StreetBoss: raíces callejeras, ambición global.","culture"),
 ("La comida es la protagonista","Aquí la estrella es tu comida, no la tecnología",
  "Tú al centro","Filosofía: la tech opera en segundo plano.","culture"),
 ("Soberanía gastronómica","Tus datos, tus clientes y tu marca son tuyos",
  "Soberanía","Valor corporativo #1 en pieza de marca.","culture"),
 ("Independencia","No le pidas permiso a un algoritmo para vender lo tuyo",
  "Independízate","Arquetipo rebelde: emancipación del agregador.","culture"),
 ("Simplicidad extrema","Cero curvas de aprendizaje. Tú solo cocina y vende.",
  "Simple manda","Valor: simplicidad. La tecnología no estorba.","culture"),
 ("Transparencia","Sin comisiones ocultas. Sin letras chiquitas.",
  "Claro y directo","Valor: transparencia.","culture"),
 ("Comunidad StreetBoss","Restaurantes que decidieron mandar en su negocio",
  "Somos comunidad","Pieza de pertenencia (sin inventar testimonios).","culture"),
 ("Tu marca merece brillar","Tu logo grande. Tu historia. Tu vitrina.",
  "Brilla tú","Cierre de fase de marca: dignificar al restaurante.","culture"),
]

COMMERCIAL = [  # Domingo — comercial / precio fundador / objeción (13). extra = enfoque
 ("Precio fundador de lanzamiento","Precio fundador: $100 MXN mensuales",
  "Cupo fundador abierto","Presentación limpia de la oferta ancla, sin dark patterns.","founder"),
 ("¿Ustedes reparten? No.","No repartimos tu comida. Tú controlas la entrega.",
  "Tú controlas la entrega","Objeción FAQ: no somos delivery, somos tu tecnología.","objection_delivery"),
 ("¿App para descargar? No hace falta","Tu cliente pide sin bajar ninguna app",
  "Abre y pide","Objeción FAQ: sin apps, abre desde link/QR.","objection_app"),
 ("¿Comisión por venta? Cero","0% de comisión. Solo tu renta fija mensual.",
  "0% comisión","Objeción FAQ: modelo de renta fija, no comisión.","objection_commission"),
 ("Ya uso Rappi/UberEats","Perfecto para clientes nuevos. Al recurrente, dale tu link.",
  "Combina, no regales margen","Objeción: coexistir con apps y recuperar al recurrente.","objection_apps"),
 ("Ya tengo menú en PDF","El PDF hace que el cliente trabaje. StreetBoss arma el pedido.",
  "Deja el PDF","Objeción: PDF vs. escaparate transaccional.","objection_pdf"),
 ("Lo que incluye tu escaparate","Escaparate + carrito + pedido a WhatsApp + panel",
  "Todo lo que necesitas para vender","Enumerar el alcance real (sin prometer roadmap).","scope"),
 ("Cómo empezar hoy","Escríbenos, armamos tu menú y vendes esta semana",
  "Arranca esta semana","Pasos concretos para activar el precio fundador.","howto"),
 ("Para quién es StreetBoss","Fondas, food trucks, dark kitchens, cafés, pizzerías…",
  "¿Es para ti? Sí.","Casos de uso: a quién sirve.","usecases"),
 ("El primer pedido cambia todo","Tu primer pedido directo por tu escaparate te lo demuestra",
  "El primer pedido","Enfoque en activación/retención, no en promesas.","activation"),
 ("Sin letras chiquitas","Sin trucos ni sorpresas. Renta clara: $100 MXN al mes.",
  "Claro y honesto","Transparencia comercial: precio claro, sin dark patterns.","transparency"),
 ("Tu competencia ya lo está viendo","Mientras lo piensas, otro ya está vendiendo directo",
  "No te quedes atrás","Urgencia honesta, sin falsas escaseces ni plazas inventadas.","urgency"),
 ("Únete al cupo fundador","Sé de los primeros restaurantes en mandar en su venta",
  "Cupo fundador","Cierre de campaña con la oferta ancla oficial.","founder"),
]

# ── ROTACIÓN SEMANAL: weekday -> (ctype, formato, plataforma_primaria, adaptaciones, pilar) ─
# 0=Lunes ... 6=Domingo
WEEK = {
 0: ("pain",      "reel",     "Instagram", ["TikTok","Facebook","YouTube Short"], "Control del negocio"),
 1: ("carousel",  "carousel", "Instagram", ["LinkedIn Document","Facebook"],      "Educación gastronómica"),
 2: ("product",   "reel",     "Instagram", ["TikTok","YouTube Short"],            "Producto"),
 3: ("data",      "post",     "Instagram", ["Facebook"],                          "Comparativas"),
 4: ("foodporn",  "reel",     "Instagram", ["TikTok","YouTube Short"],            "Fotografía gastronómica"),
 5: ("culture",   "post",     "Instagram", ["Facebook"],                          "Cultura StreetBoss"),
 6: ("commercial","post",     "Instagram", ["Facebook","LinkedIn"],              "Precio fundador"),
}

BANKS = {
 "pain": PAIN_REELS, "product": PRODUCT_REELS, "foodporn": FOODPORN_REELS,
 "carousel": EDU_CAROUSELS, "data": DATA_GRAPHICS, "culture": CULTURE_GRAPHICS,
 "commercial": COMMERCIAL,
}

def phase_of(day):
    if day <= 30:  return (1, "Posicionamiento · Problema · Educación")
    if day <= 60:  return (2, "Demostración · Autoridad · Producto · Diferenciación")
    return (3, "Conversión · Precio fundador · Objeciones · Comunidad")

def funnel_of(ctype, day):
    p,_ = phase_of(day)
    if ctype in ("pain","foodporn","culture"): return "TOFU (Atención)"
    if ctype in ("carousel","product","data"): return "MOFU (Interés/Demostración)"
    return "BOFU (Conversión)"

def objective_of(ctype):
    return {
     "pain":"Agitar el dolor y generar identificación.",
     "product":"Demostrar fricción cero y capacidades reales del escaparate.",
     "foodporn":"Deseo/branding aspiracional (FoodPorn). Alcance y recordación.",
     "carousel":"Educar y posicionar la categoría. Guardados y autoridad.",
     "data":"Diferenciar con datos y comparativas claras.",
     "culture":"Construir marca, comunidad y pertenencia.",
     "commercial":"Convertir: activar cupo fundador y resolver objeciones.",
    }[ctype]

print("Config y bancos cargados:",
      sum(len(v) for v in BANKS.values()), "temas disponibles.")


# ════════════════════════════════════════════════════════════════════════════════
#  CONSTRUCTORES DE CONTENIDO
# ════════════════════════════════════════════════════════════════════════════════

def hashtags_for(ctype):
    return " ".join(HT["food"] if ctype=="foodporn"
                     else HT["edu"] if ctype in ("carousel",)
                     else HT["b2b"] if ctype in ("data","culture")
                     else HT["commercial"] if ctype=="commercial"
                     else HT["core"])

def cta_for(ctype):
    return {"pain":CTA["comment"], "product":CTA["demo"], "foodporn":CTA["link"],
            "carousel":CTA["save"], "data":CTA["wa"], "culture":CTA["follow"],
            "commercial":CTA["founder"]}[ctype]

def pubtime_for(ctype):
    return {"pain":"13:30","product":"14:00","foodporn":"14:00","carousel":"12:00",
            "data":"18:30","culture":"11:00","commercial":"19:00"}[ctype]

def duration_for(fmt):
    return "22-32s" if fmt in ("reel","short") else "N/A"

def build_caption(ctype, topic, hook, angle, extra, day):
    """Copy listo para publicar. MX neutral, sin asteriscos, sin jerga SaaS."""
    cta = cta_for(ctype); ht = hashtags_for(ctype)
    if ctype == "pain":
        body = (f"{hook}\n\n{angle}\n\nCon StreetBoss tu menú se vuelve un escaparate: "
                f"el cliente arma su pedido y te cae ordenado al WhatsApp. Vende directo. Manda tú.")
    elif ctype == "product":
        body = (f"{hook}\n\n{angle}\n\nAsí de simple: tu comida bien mostrada y el pedido perfecto en tu WhatsApp. "
                f"Sin comisiones, sin apps que descargar.")
    elif ctype == "foodporn":
        platillo, _ = extra
        body = (f"{hook}\n\nAsí se ve tu menú antes de que lleguen. Tu {platillo} merece una vitrina, no una lista.\n\n"
                f"Escaparate digital + pedido directo a tu WhatsApp.")
    elif ctype == "carousel":
        body = (f"{hook}\n\nGuárdalo para tu negocio de comida.\n\n{angle}\n\n"
                f"En StreetBoss convertimos tu menú en un escaparate que vende directo, sin comisiones.")
    elif ctype == "data":
        body = (f"{hook}\n\n{angle}\n\nStreetBoss: la plataforma visual de venta directa para restaurantes.")
    elif ctype == "culture":
        body = (f"{hook}\n\n{angle}\n\nStreetBoss existe para que tu restaurante venda bajo sus propias reglas.")
    else:  # commercial
        body = (f"{hook}\n\n{FOUNDER_COPY}\n\nSin comisiones por pedido. Sin apps. Tu escaparate, tu WhatsApp, tu marca.")
    return f"{body}\n\n{cta}\n\n{ht}"

def build_visual_prompt(ctype, topic, ost, extra):
    """Prompt de generación visual. Escenas SIN logo (se integra después con SVG maestro)."""
    common = ("Dirección de arte StreetBoss: flat premium, alto contraste, fondo oscuro Boss Charcoal "
              "(#0D0E12), acentos naranja #FF4B00, iluminación moody y luz dura, sin logo, sin texto generado, "
              "espacio negativo para integrar tipografía y logo después. Ratio 9:16 vertical salvo indicación.")
    if ctype == "foodporn":
        platillo, textura = extra
        return (f"Fotografía hiperrealista de producto gastronómico de alta gama: {platillo}. Estilo Food Porn premium. "
                f"Luz dura moody que resalte texturas, brillo de la grasa y volumen. Fondo oscuro con textura de {textura}. "
                f"Colores saturados del espectro del apetito. Macro/close-up, lente 85mm, calidad cinematográfica. "
                f"Sin logo, sin texto. Manos permitidas, sin rostros. {common}")
    if ctype == "product":
        return (f"Mockup 3D hiperrealista de un celular mostrando un escaparate digital de restaurante (interfaz oscura, "
                f"tarjetas de producto con foto grande y botón naranja), sostenido por una mano sobre una mesa de restaurante "
                f"con ingredientes desenfocados al fondo (bokeh). Iluminación de estudio dramática, fondo oscuro. "
                f"Concepto: {topic}. Sin logo (se integra después). Proporciones de UI precisas y legibles. {common}")
    if ctype == "pain":
        return (f"Escena editorial que ilustra el dolor operativo de un restaurante: {topic}. Ambiente de cocina/mostrador real, "
                f"luz tensa, tonos oscuros, sensación de saturación y desorden. Enfoque en manos y objetos (teléfono, tickets, comandas), "
                f"sin rostros. Espacio negativo para texto. Sin logo. {common}")
    # carousel / data / culture -> composición de fondo para pieza gráfica
    return (f"Fondo/composición premium para pieza gráfica de marca sobre {topic}. Fondo Boss Charcoal texturizado "
            f"(pizarra/metal oscuro), acento naranja #FF4B00, mucho espacio negativo para titular en Poppins ExtraBold. "
            f"Estética FoodTech internacional, minimalista, alto contraste. Sin texto generado por IA, sin logo. {common}")

def build_motion_prompt(ctype, extra):
    if ctype == "foodporn":
        return ("Cámara lenta cinematográfica (slow motion). Movimiento de push-in macro hacia la textura; vapor/goteo natural; "
                "ligero parallax. 24-30fps, transiciones por match-cut de textura.")
    if ctype == "product":
        return ("Screen-capture real de la interfaz + planos B-roll de la mano tocando la pantalla. Movimiento de seguimiento suave "
                "del dedo (tap → agregar → enviar). Zoom sutil al ticket de WhatsApp. Cortes rápidos al beat.")
    if ctype == "pain":
        return ("Cámara nerviosa handheld, cortes rápidos que transmiten saturación; whip-pan entre teléfono y cocina; "
                "resolución de tensión al aparecer el escaparate ordenado.")
    return ("N/A (pieza estática). Si se anima: kinetic typography del titular con entrada del acento naranja.")

def build_reel_script(ctype, topic, hook, ost, angle, extra):
    """Guion de 7 tomas (hook→problema→tensión→solución→demo→beneficio→CTA)."""
    if ctype == "foodporn":
        platillo, textura = extra
        shots = [
         ("Hook", f"Macro del {platillo} en cámara lenta, brillo y textura.", "Close-up macro", "Push-in", "El platillo protagonista", "0-3s", "Corte a negro rápido"),
         ("Problema", "Foto plana/PDF del mismo platillo, apagada.", "Plano medio", "Estático", "Contraste feo vs. antojo", "3-6s", "Match-cut"),
         ("Tensión", "Cliente dudando, no encuentra cómo pedir.", "Detalle de manos", "Handheld", "La fricción mata el antojo", "6-9s", "Whip-pan"),
         ("Solución", "Aparece el escaparate StreetBoss con la foto premium.", "Pantalla en mano", "Seguimiento", "Así se ve tu menú", "9-13s", "Cut"),
         ("Demostración", "Tap → agregar → enviar a WhatsApp.", "Over-the-shoulder", "Push-in", "Pedido en 20s", "13-18s", "Cut rápido"),
         ("Beneficio", f"El {platillo} servido + ticket ordenado en WhatsApp.", "Plano 45°", "Slow push", "Pedido perfecto, cero comisión", "18-24s", "Cut"),
         ("CTA", "Logo (SVG oficial integrado) + link.", "Cierre gráfico", "Estático", "Vende directo. Manda tú.", "24-30s", "Fade"),
        ]
    elif ctype == "product":
        shots = [
         ("Hook", f"{hook}", "Pantalla en mano", "Push-in", ost, "0-3s", "Cut"),
         ("Problema", "Menú PDF / WhatsApp desordenado.", "Detalle pantalla", "Estático", "El desorden cuesta", "3-6s", "Match-cut"),
         ("Tensión", "Pedido mal entendido en cocina.", "Cocina", "Handheld", "Errores = pérdidas", "6-9s", "Whip-pan"),
         ("Solución", "Escaparate StreetBoss abriendo desde un link.", "Pantalla", "Seguimiento", "Abre y pide", "9-12s", "Cut"),
         ("Demostración", "Recorrido real: categoría → producto → agregar → checkout.", "Screen capture", "Scroll", "Fricción cero", "12-20s", "Cortes al beat"),
         ("Beneficio", "Ticket estructurado cae al WhatsApp del negocio.", "Chat WhatsApp", "Zoom", "Pedido perfecto", "20-26s", "Cut"),
         ("CTA", "Logo oficial + WhatsApp.", "Cierre", "Estático", "Pídenos una demo", "26-30s", "Fade"),
        ]
    else:  # pain
        shots = [
         ("Hook", f"{hook}", "POV / handheld", "Nervioso", ost, "0-3s", "Cut seco"),
         ("Problema", f"{angle}", "Cocina/mostrador", "Handheld", "El dolor real", "3-7s", "Whip-pan"),
         ("Tensión", "Acumulación: audios, capturas, “¿ya sumaste?”.", "Detalle teléfono", "Rápido", "Caos", "7-11s", "Cortes rápidos"),
         ("Solución", "Aparece el escaparate ordenado.", "Pantalla en mano", "Seguimiento", "Hay otra forma", "11-15s", "Cut a calma"),
         ("Demostración", "El pedido cae ordenado al WhatsApp.", "Chat", "Zoom", "Ticket impecable", "15-21s", "Cut"),
         ("Beneficio", "Cocina tranquila, pedido claro.", "Plano 45°", "Slow", "Orden = crecimiento", "21-27s", "Cut"),
         ("CTA", "Logo oficial + comentar DIRECTO.", "Cierre", "Estático", "Manda tú", "27-30s", "Fade"),
        ]
    return shots

def build_carousel_slides(topic, hook, angle):
    return [
     ("Slide 1 · Portada", hook, "Titular Poppins ExtraBold, fondo Charcoal, acento naranja.", "Gancho", "Fondo oscuro premium"),
     ("Slide 2 · El problema", "Esto te está costando pedidos hoy.", "Texto + icono lineal.", "Contexto", "Composición limpia"),
     ("Slide 3 · Por qué pasa", angle, "Explicación breve, 1 idea.", "Educación", "Diagrama simple"),
     ("Slide 4 · El costo", "Y así se traduce en dinero que dejas ir.", "Dato/comparativa (CASO ILUSTRATIVO).", "Tensión", "Gráfico minimal"),
     ("Slide 5 · La solución", "Un escaparate que vende directo.", "Mockup del escaparate.", "Solución", "Mockup en mano"),
     ("Slide 6 · Cómo se ve", "Foto premium + pedido a tu WhatsApp.", "Ejemplo visual.", "Demostración", "FoodPorn + UI"),
     ("Slide Final · CTA", "Vende directo. Manda tú.", "Logo oficial + WhatsApp + precio fundador.", "Conversión", "Cierre de marca"),
    ]

def build_stories(ctype, topic, hook, ost, day):
    """1-3 stories del día, con tipo, interacción y CTA."""
    base = [
     ("Encuesta", f"¿Tu menú vende o solo se ve?  [Vende / Solo se ve]", "Sticker de encuesta", "Charcoal + naranja", "Conocer al público"),
    ]
    if ctype == "foodporn":
        base.append(("FoodPorn", f"{ost}", "Sin sticker", "Foto del platillo", "Antojo + link al escaparate"))
    elif ctype == "product":
        base.append(("Demo", "Mira cómo se arma un pedido 👇", "Sticker de link", "Screen capture", "Llevar al escaparate"))
    elif ctype == "commercial":
        base.append(("Precio fundador", f"Escaparate por {FOUNDER_PRICE}", "Sticker de link a WhatsApp", "Charcoal", "Conversión"))
    else:
        base.append(("Tip", f"{hook}", "Sticker de pregunta", "Charcoal + naranja", "Interacción"))
    base.append(("CTA", "Arma tu escaparate. Escríbenos 👇", "Sticker link WhatsApp", "Naranja", "WhatsApp"))
    return base[:3]

print("Constructores cargados.")


# ════════════════════════════════════════════════════════════════════════════════
#  CONSTRUCCIÓN DE LOS 90 DÍAS
# ════════════════════════════════════════════════════════════════════════════════

COLUMNS = ["day","date","week","phase","platform_primary","platform_adaptations","format",
 "content_pillar","objective","funnel_stage","topic","narrative_angle","hook","on_screen_text",
 "visual_concept","caption","cta","hashtags","dimensions","duration","assets_required",
 "visual_prompt","motion_prompt","master_file","export_file","destination_folder","status",
 "approval","publication_time","notes"]

def slug(s):
    keep = "abcdefghijklmnopqrstuvwxyz0123456789"
    s = s.lower().replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u").replace("ñ","n")
    return "".join(c if c in keep else "-" for c in s).strip("-").replace("--","-")[:40]

def build_days():
    days = []
    idx = {k:0 for k in BANKS}          # índice consumido por cada banco
    for d in range(1, TOTAL_DAYS+1):
        date = START_DATE + datetime.timedelta(days=d-1)
        wd = date.weekday()
        ctype, fmt, primary, adapts, pillar = WEEK[wd]
        bank = BANKS[ctype]
        seed = bank[idx[ctype] % len(bank)]; idx[ctype]+=1
        topic, hook, ost, angle, extra = seed
        pnum, pname = phase_of(d)
        week = (d-1)//7 + 1
        month = (d-1)//30 + 1
        is_video = fmt in ("reel","short")
        dims = DIM["reel"] if is_video else (DIM["carousel"] if fmt=="carousel" else DIM["post"])
        caption = build_caption(ctype, topic, hook, angle, extra, d)
        vprompt = build_visual_prompt(ctype, topic, ost, extra)
        mprompt = build_motion_prompt(ctype, extra) if is_video else "N/A"
        kind = "reel" if is_video else ("post")
        name = f"day-{d:02d}_{slug(topic)}_{ctype}"
        if is_video:
            dest = f"07-reels/month-{month:02d}/"
        else:
            dest = f"06-posts/month-{month:02d}/"
        tfolder = {"pain":"pain","product":"product","foodporn":"foodporn","carousel":"carousel",
                   "data":"data","culture":"brand","commercial":"commercial"}[ctype]
        master = f"04-social-templates/{tfolder}/{TEMPLATE[ctype]}.md"
        export = f"{name}.png"
        assets = ("Fondo/escena IA (prompt visual) · Logo SVG maestro (brand-core) · "
                  + ("Screen capture real del escaparate · " if ctype=="product" else "")
                  + "Tipografía Poppins/Inter")
        row = {
         "day": d, "date": date.isoformat(), "week": week, "phase": f"Fase {pnum}: {pname}",
         "platform_primary": primary, "platform_adaptations": ", ".join(adapts),
         "format": ("Reel/Short" if is_video else ("Carrusel" if fmt=="carousel" else "Post gráfico")),
         "content_pillar": pillar, "objective": objective_of(ctype), "funnel_stage": funnel_of(ctype,d),
         "topic": topic, "narrative_angle": angle, "hook": hook, "on_screen_text": ost,
         "visual_concept": f"[{TEMPLATE[ctype]}] {ost}", "caption": caption, "cta": cta_for(ctype),
         "hashtags": hashtags_for(ctype), "dimensions": dims,
         "duration": duration_for(fmt), "assets_required": assets,
         "visual_prompt": vprompt, "motion_prompt": mprompt,
         "master_file": master, "export_file": export, "destination_folder": dest,
         "status": "PENDIENTE", "approval": "NO APROBADO",
         "publication_time": pubtime_for(ctype), "notes": f"Adaptar hook/duración por plataforma: {', '.join(adapts)}.",
         # auxiliares internos (no van al CSV):
         "_ctype": ctype, "_fmt": fmt, "_extra": extra, "_month": month, "_name": name, "_is_video": is_video,
        }
        days.append(row)
    return days

# ════════════════════════════════════════════════════════════════════════════════
#  EMISORES
# ════════════════════════════════════════════════════════════════════════════════

def w(path, content):
    full = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f: f.write(content)

def emit_csv(days):
    full = os.path.join(BASE, "05-calendar/streetboss_calendar_90_days.csv")
    with open(full, "w", encoding="utf-8", newline="") as f:
        wr = csv.DictWriter(f, fieldnames=COLUMNS, extrasaction="ignore")
        wr.writeheader()
        for r in days: wr.writerow(r)

def emit_json(days):
    clean = [{k:v for k,v in r.items() if not k.startswith("_")} for r in days]
    w("05-calendar/streetboss_calendar_90_days.json", json.dumps(clean, ensure_ascii=False, indent=2))

def emit_md(days):
    out = ["# 🗓️ Calendario Editorial · StreetBoss · 90 días\n",
     f"**Inicio:** {START_DATE.isoformat()} · **Fin:** {(START_DATE+datetime.timedelta(days=89)).isoformat()} · "
     f"**Total:** {TOTAL_DAYS} días · **Estado global:** PENDIENTE / NO APROBADO\n",
     "> Fuente de verdad visual: `brand-core/`. Colores #FF4B00 / #0D0E12. Logo solo desde SVG maestro.\n",
     "> Cada día está aterrizado con los 30 campos obligatorios. Detalle individual en `06-posts/`, `07-reels/`, `08-stories/`.\n"]
    cur = None
    for r in days:
        if r["week"] != cur:
            cur = r["week"]
            out.append(f"\n---\n\n## Semana {cur} · {r['phase']}\n")
        out.append(
         f"### Día {r['day']:02d} · {r['date']} · {r['format']} · {r['_ctype'].upper()}\n"
         f"- **Plataforma:** {r['platform_primary']} → {r['platform_adaptations']}\n"
         f"- **Pilar / Embudo:** {r['content_pillar']} · {r['funnel_stage']}\n"
         f"- **Tema:** {r['topic']}\n- **Ángulo:** {r['narrative_angle']}\n"
         f"- **Gancho:** {r['hook']}\n- **Texto en pantalla:** {r['on_screen_text']}\n"
         f"- **Objetivo:** {r['objective']}\n- **CTA:** {r['cta']}\n"
         f"- **Dimensiones:** {r['dimensions']}  · **Duración:** {r['duration']}  · **Hora:** {r['publication_time']}\n"
         f"- **Archivo:** `{r['destination_folder']}{r['export_file']}` · **Plantilla:** `{r['master_file']}`\n"
         f"- **Estado:** {r['status']} · {r['approval']}\n\n"
         f"<details><summary>Copy listo para publicar</summary>\n\n```\n{r['caption']}\n```\n</details>\n\n"
         f"<details><summary>Prompt visual</summary>\n\n{r['visual_prompt']}\n\n**Movimiento:** {r['motion_prompt']}\n</details>\n")
    w("05-calendar/streetboss_calendar_90_days.md", "\n".join(out))

def emit_html(days):
    rows = ""
    for r in days:
        rows += ("<tr>" + "".join(
         f"<td>{str(r.get(c,'')).replace('<','&lt;')[:160]}</td>" for c in
         ["day","date","week","phase","platform_primary","format","content_pillar","topic","hook","cta","status","approval","publication_time"]
        ) + "</tr>\n")
    html = f"""<!doctype html><html lang=es><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>StreetBoss · Calendario 90 días</title>
<style>
:root{{--o:{STREET_ORANGE};--c:{BOSS_CHARCOAL};}}
body{{margin:0;background:var(--c);color:#EDEDED;font-family:Inter,Arial,sans-serif}}
header{{padding:24px;border-bottom:3px solid var(--o)}}
h1{{margin:0;font-family:Poppins,Arial;font-weight:800}} h1 b{{color:var(--o)}}
.wrap{{overflow-x:auto;padding:16px}}
table{{border-collapse:collapse;width:100%;font-size:13px;min-width:1100px}}
th,td{{border:1px solid #2a2c33;padding:6px 8px;text-align:left;vertical-align:top}}
th{{background:#17181d;color:var(--o);position:sticky;top:0}}
tr:nth-child(even){{background:#131419}}
.badge{{display:inline-block;padding:2px 8px;border:1px solid var(--o);border-radius:20px;color:var(--o);font-size:12px}}
</style></head><body>
<header><h1>Street<b>Boss.</b> · Calendario Editorial 90 días</h1>
<p>Inicio {START_DATE.isoformat()} · {TOTAL_DAYS} días · <span class=badge>PENDIENTE / NO APROBADO</span></p></header>
<div class=wrap><table><thead><tr>
<th>Día</th><th>Fecha</th><th>Sem</th><th>Fase</th><th>Plataforma</th><th>Formato</th><th>Pilar</th><th>Tema</th><th>Gancho</th><th>CTA</th><th>Estado</th><th>Aprob.</th><th>Hora</th>
</tr></thead><tbody>
{rows}</tbody></table></div></body></html>"""
    w("05-calendar/streetboss_calendar_90_days.html", html)

def emit_post_file(r):
    if r["_is_video"]: return
    if r["_ctype"]=="carousel":
        slides = build_carousel_slides(r["topic"], r["hook"], r["narrative_angle"])
        slidetxt = "\n".join(
         f"**{s[0]}**\n- Texto: {s[1]}\n- Composición: {s[2]}\n- Jerarquía: {s[3]}\n- Imagen: {s[4]}\n" for s in slides)
        slide_section = f"\n## Diapositivas\n\n{slidetxt}\n"
    else:
        slide_section = ""
    body = f"""# {r['topic']}  ·  Día {r['day']:02d}

**Título interno:** {r['_name']}
**Objetivo:** {r['objective']}
**Público:** Dueños/encargados de negocios de comida (LatAm/MX).
**Etapa del embudo:** {r['funnel_stage']}
**Formato:** {r['format']}  ·  **Dimensiones:** {r['dimensions']}
**Plataforma principal:** {r['platform_primary']}  ·  **Adaptaciones:** {r['platform_adaptations']}
**Plantilla:** `{r['master_file']}`
**Estado:** {r['status']}  ·  {r['approval']}

## Concepto
{r['visual_concept']}

**Ángulo narrativo:** {r['narrative_angle']}
**Gancho:** {r['hook']}
**Texto dentro de la imagen:** {r['on_screen_text']}

## Jerarquía visual
1. Comida / visual protagonista
2. Titular (Poppins ExtraBold)
3. Apoyo / dato
4. Logo oficial (SVG maestro)
5. CTA discreto
{slide_section}
## Copy listo para publicar
```
{r['caption']}
```
**CTA:** {r['cta']}
**Hashtags:** {r['hashtags']}

## Prompt de generación visual
{r['visual_prompt']}

## Recursos oficiales
{r['assets_required']}

## Instrucciones de integración del logo
- Fondo oscuro (Charcoal) → usar `brand-core/01_Master_Logo_Dark.svg` (Street en blanco).
- Fondo claro → usar `brand-core/01_Master_Logo.svg` o `_Light.svg`.
- Avatares/espacios reducidos → `brand-core/01_Master_Icon.svg`.
- Prohibido regenerar, redibujar o alterar el logo.

## Adaptaciones por plataforma
- Instagram (principal): {r['dimensions']}, copy completo.
- {r['platform_adaptations']}: ajustar recorte, primer frame y longitud de copy.

## Exportación
- Master editable: `{r['destination_folder']}{r['_name']}.svg` (por producir)
- Export: `{r['destination_folder']}{r['export_file']}` (+ WebP en `12-exports/webp/`)

## Checklist de calidad
- [ ] Colores oficiales (#FF4B00 / #0D0E12)
- [ ] Logo desde SVG maestro (no regenerado)
- [ ] Sin jerga SaaS · sin funciones inventadas
- [ ] CTA presente · ≤5 hashtags
- [ ] Copy sin asteriscos · sin promesas absolutas
- [ ] Legible en móvil (alto contraste)
"""
    w(f"{r['destination_folder']}{r['_name']}.md", body)

def emit_reel_file(r):
    if not r["_is_video"]: return
    shots = build_reel_script(r["_ctype"], r["topic"], r["hook"], r["on_screen_text"], r["narrative_angle"], r["_extra"])
    shot_md = ""
    for i,s in enumerate(shots,1):
        shot_md += (f"### Toma {i} — {s[0]}\n"
         f"- **Acción:** {s[1]}\n- **Plano/Encuadre:** {s[2]}\n- **Movimiento de cámara:** {s[3]}\n"
         f"- **Texto en pantalla:** {s[4]}\n- **Duración:** {s[5]}\n- **Transición:** {s[6]}\n"
         f"- **Prompt visual:** {build_visual_prompt(r['_ctype'], r['topic'], s[4], r['_extra'])[:240]}…\n"
         f"- **Prompt de movimiento:** {r['motion_prompt']}\n\n")
    ilustrativo = "\n> CASO ILUSTRATIVO: cualquier dato o resultado mostrado es ilustrativo, no un testimonio real.\n" if r["_ctype"] in ("pain","data") else ""
    body = f"""# REEL · {r['topic']}  ·  Día {r['day']:02d}

**Título:** {r['_name']}
**Objetivo:** {r['objective']}
**Plataforma principal:** {r['platform_primary']}  ·  **Adaptaciones:** {r['platform_adaptations']}
**Duración:** {r['duration']}  ·  **Formato:** {r['format']} ({r['dimensions']})
**Plantilla:** `{r['master_file']}`  ·  **Estado:** {r['status']} · {r['approval']}
{ilustrativo}
## Hook (0-3s)
{r['hook']}
**Texto en pantalla:** {r['on_screen_text']}

## Guion de voz (locución)
1. {r['hook']}
2. {r['narrative_angle']}
3. Con StreetBoss tu menú se vuelve un escaparate que vende directo.
4. El pedido cae ordenado a tu WhatsApp. Cero comisiones.
5. {r['cta']}

## Escaleta por tomas
{shot_md}
## Música / diseño sonoro
Trap/hip-hop instrumental con energía, beat marcado para los cortes. Sound design: sizzle, notificación de WhatsApp, whoosh en transiciones.

## CTA
- **Hablado:** {r['cta']}
- **Visual:** Logo oficial (SVG maestro) + “Vende directo. Manda tú.”

## Copy listo para publicar
```
{r['caption']}
```
**Hashtags:** {r['hashtags']}

## Portada del Reel
- Plantilla `04-social-templates/reel-cover/` · frame del platillo/mockup + titular Poppins.
- Archivo: `{r['destination_folder']}{r['_name']}_cover.png`

## Recursos
{r['assets_required']}

## Instrucciones de integración del logo
- Solo SVG maestro de `brand-core/`. Fondo oscuro → variante Dark. Nunca regenerar el logo.

## Checklist
- [ ] Hook fuerte en <3s
- [ ] Subtítulos siempre (se ve sin sonido)
- [ ] Colores oficiales · logo desde SVG
- [ ] Sin datos falsos · sin funciones inventadas (solo escaparate + carrito + WhatsApp + panel)
- [ ] CTA hablado y visual · ≤5 hashtags
- [ ] Export vertical 1080x1920
"""
    w(f"{r['destination_folder']}{r['_name']}.md", body)

def emit_stories(days):
    for month in (1,2,3):
        md = [f"# 📲 Stories · Mes {month:02d} · StreetBoss\n",
              "> 1–3 stories por día. Estado: PENDIENTE / NO APROBADO. Dimensiones 1080x1920.\n"]
        for r in [d for d in days if d["_month"]==month]:
            st = build_stories(r["_ctype"], r["topic"], r["hook"], r["on_screen_text"], r["day"])
            md.append(f"\n## Día {r['day']:02d} · {r['date']} — apoyo a: {r['topic']}\n")
            for i,s in enumerate(st,1):
                md.append(f"**Story {i} · {s[0]}**\n- Texto: {s[1]}\n- Interacción/Sticker: {s[2]}\n- Fondo/Imagen: {s[3]}\n- Objetivo: {s[4]}\n- CTA: link a WhatsApp / escaparate\n- Archivo: `08-stories/month-{month:02d}/day-{r['day']:02d}_story{i}.png`\n")
        w(f"08-stories/month-{month:02d}/stories_month-{month:02d}.md", "\n".join(md))

def emit_manifest(days):
    full = os.path.join(BASE, "13-reports/file_manifest.csv")
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full,"w",encoding="utf-8",newline="") as f:
        wr = csv.writer(f); wr.writerow(["day","date","type","destination","file","status","approval"])
        for r in days:
            wr.writerow([r["day"], r["date"], "reel" if r["_is_video"] else "post",
                         r["destination_folder"], f"{r['_name']}.md", r["status"], r["approval"]])
            wr.writerow([r["day"], r["date"], "export", r["destination_folder"], r["export_file"], "PENDIENTE","NO APROBADO"])

# ── RUN ─────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    days = build_days()
    emit_md(days); emit_csv(days); emit_json(days); emit_html(days)
    for r in days:
        emit_post_file(r); emit_reel_file(r)
    emit_stories(days); emit_manifest(days)
    nre = sum(1 for r in days if r["_is_video"]); npo = sum(1 for r in days if not r["_is_video"])
    print(f"✅ {len(days)} días generados · {nre} reels · {npo} posts/carruseles/gráficas")
    print("✅ Calendario: MD + CSV + JSON + HTML")
    print("✅ Archivos individuales de posts y reels + stories por mes + file_manifest.csv")
