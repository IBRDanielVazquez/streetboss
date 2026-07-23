# 📖 PRODUCT.md — La Biblia del Producto · Street Boss

> **Este es el documento más importante de Street Boss.**
> No es documentación técnica. No es documentación comercial. Es el documento que define **qué es Street Boss y qué queremos que sea durante los próximos años.**
>
> Fuente de verdad de producto. Se apoya en `00-START-HERE.md` (contexto maestro), `TEAM.md` (autoridad y roles), `ROADMAP.md` (tablero) y `branding/01-ADN-STREETBOSS.md` (ADN de marca).

> [!IMPORTANT]
> Este documento describe **la visión del producto que queremos construir**, no solo el estado actual. Todo lo aquí escrito es propuesta de producto sujeta a la aprobación final de **Daniel Vázquez (Product Owner)**. No define logo, colores ni tipografías, y no toca el software.

---

## 🧭 Índice

- **Parte I — Fundamentos** (secciones 1–5)
- **Parte II — La Visión en el tiempo** (secciones 6–9)
- **Parte III — A quién servimos** (secciones 10–14)
- **Parte IV — Los módulos del producto** (secciones 15–37)
- **Parte V — El negocio** (secciones 38–40)
- **Parte VI — Análisis competitivo**
- **Parte VII — Entrega ejecutiva** (resumen, ideas, disrupción, riesgos, recomendaciones)

---

## 🧩 Arquitectura modular de la documentación

Este `PRODUCT.md` es la **visión general** (el "qué y por qué"). Las **especificaciones funcionales** de cada módulo (el "cómo" a nivel de flujos, estados, reglas y criterios de aceptación) viven en la carpeta [`PRODUCT/`](PRODUCT/), para escalar sin un documento gigante. **No se duplica contenido:** aquí la visión, allá la spec.

| # | Módulo | Especificación funcional |
|---|---|---|
| 01 | Escaparate Digital | [`PRODUCT/01-ESCAPARATE.md`](PRODUCT/01-ESCAPARATE.md) |
| 02 | Dashboard Cliente | [`PRODUCT/02-DASHBOARD.md`](PRODUCT/02-DASHBOARD.md) |
| 03 | Biblioteca Street Boss | [`PRODUCT/03-BIBLIOTECA.md`](PRODUCT/03-BIBLIOTECA.md) |
| 04 | Pedidos | [`PRODUCT/04-PEDIDOS.md`](PRODUCT/04-PEDIDOS.md) |
| 05 | Onboarding | [`PRODUCT/05-ONBOARDING.md`](PRODUCT/05-ONBOARDING.md) |
| 06 | IA | [`PRODUCT/06-IA.md`](PRODUCT/06-IA.md) |
| 07 | Marketing (promos, fidelización, referidos, redes) | [`PRODUCT/07-MARKETING.md`](PRODUCT/07-MARKETING.md) |
| 08 | CRM | [`PRODUCT/08-CRM.md`](PRODUCT/08-CRM.md) |
| 09 | SEO & Presencia Local | [`PRODUCT/09-SEO.md`](PRODUCT/09-SEO.md) |
| 10 | Roadmap del Producto | [`PRODUCT/10-ROADMAP-PRODUCTO.md`](PRODUCT/10-ROADMAP-PRODUCTO.md) |

> Los módulos POS, Delivery, Analytics, Gamificación, Multi-sucursal, API, Mobile App e Integraciones se documentan dentro de las specs relacionadas (ver el mapa en [`PRODUCT/10-ROADMAP-PRODUCTO.md`](PRODUCT/10-ROADMAP-PRODUCTO.md)); se les dará archivo propio cuando su alcance lo justifique.

---

# PARTE I — FUNDAMENTOS

## 1. ¿Qué es Street Boss?

Street Boss es **la plataforma visual para que cualquier negocio de comida venda por internet sin depender de marketplaces.**

Convierte el menú de un restaurante en un **escaparate digital premium** —catálogo interactivo, perfil gastronómico y página visual de pedidos— donde el cliente pide **directo por WhatsApp**, **sin comisiones por pedido** y con el negocio en **control total** de sus precios, su marca, sus datos y su cliente.

En su visión completa, Street Boss es un **sistema operativo comercial para restaurantes**: empieza siendo el escaparate que vende, y crece hasta administrar pedidos, clientes (CRM), marketing, fidelización, sucursales y punto de venta. Pero su **corazón y su promesa** siempre serán los mismos:

> **El que cocina, manda.**

**En una frase de producto:** Street Boss es a un restaurante lo que Shopify es a una tienda —su propio canal de venta directa— pero pensado para comida, con estética que da hambre y con la simplicidad de quien no sabe de tecnología.

---

## 2. ¿Qué problema resuelve?

El negocio de comida que quiere vender online hoy está atrapado entre tres malas opciones:

1. **Los marketplaces** (Uber Eats, DoorDash, Rappi…): cobran **comisiones de 15–30% por pedido**, se quedan con la relación con el cliente, imponen sus reglas y ponen al restaurante a competir por precio. El restaurante cocina; la app cobra y manda.
2. **El menú QR / PDF:** solo **muestra**, no **vende**. Sin imagen premium, sin flujo de pedido, sin marca. Se ve improvisado y no convierte.
3. **Vender suelto por redes/WhatsApp:** hay seguidores pero **no un lugar propio** para cerrar la venta; el pedido se pierde entre DMs y capturas.

**Consecuencia:** el negocio pierde margen, pierde control de su cliente y proyecta una imagen por debajo de la calidad de su comida.

**Street Boss elimina el dilema:** escaparate visual premium (imagen) + venta directa por WhatsApp (canal propio) + cero comisiones (margen intacto) + control total (independencia).

---

## 3. ¿Qué NO es Street Boss?

Definir lo que **no** somos protege el enfoque del producto:

- **NO es "un generador de menús QR".** El QR es apenas una puerta de acceso; el producto es el escaparate y la venta.
- **NO es un marketplace.** No agregamos restaurantes en una app para que compitan entre sí; le damos a **cada uno su propio canal**.
- **NO es un intermediario que cobra comisión por pedido.** El pedido y el dinero son del restaurante.
- **NO es un software técnico y complejo.** Cero curva de aprendizaje; pensado para el dueño, no para un ingeniero.
- **NO es solo un POS.** El POS será una capacidad, no el centro. Nacemos desde la **venta online**, no desde la caja registradora.
- **NO es una agencia de delivery con repartidores propios** (al menos no en el núcleo): habilitamos el pedido directo y, más adelante, integraciones de reparto —sin volvernos dueños del cliente.
- **NO es una red social.** Aprovechamos las redes para atraer, pero el escaparate es **territorio propio del restaurante**, no de un feed ajeno.

---

## 4. ¿Qué experiencia queremos entregar?

**Para el dueño del restaurante:**
> "En una tarde tuve mi escaparate montado, se ve increíble, y por fin los pedidos llegan a mi WhatsApp sin que nadie me cobre comisión. Yo mando."

- **Rápido:** montar el escaparate y el primer platillo en **minutos**.
- **Sin miedo:** cero tecnicismos; si se atora, la plataforma (y la IA) lo guían.
- **Orgullo:** su comida se ve **premium**, digna de presumir.
- **Control:** cambia precios, platillos y promos al instante, cuando quiera.
- **Resultados visibles:** ve cuánta gente entró, qué se pidió y cuánto vendió.

**Para el comensal:**
> "Entré al link, se me antojó todo, armé mi pedido en segundos y lo mandé por WhatsApp. Fácil y bonito."

- Visual, rápido, claro, sin descargar apps ni crear cuentas.
- Experiencia móvil impecable (la mayoría pide desde el celular).

**Principio rector de experiencia:** **la comida es la protagonista, la tecnología es invisible.** Todo lo que estorbe entre el antojo y el pedido, se elimina.

---

## 5. Visión a 5 años

**En 5 años, Street Boss es el estándar de la venta directa de comida por internet en el mundo hispanohablante.**

- Miles de restaurantes usan su escaparate Street Boss como **su canal principal propio**, no como un extra.
- La frase "arma tu Street Boss" se vuelve verbo, como "hazte un Shopify".
- El producto pasó de escaparate a **sistema operativo comercial del restaurante**: escaparate + pedidos + CRM + marketing + fidelización + multi-sucursal.
- Una **capa de IA** ayuda a cada restaurante a vender más: escribe sus descripciones, optimiza sus precios, contesta a sus clientes y genera su contenido de redes.
- Street Boss es sinónimo de **independencia**: el lugar donde el restaurante es dueño de su negocio digital.

**Métrica norte a 5 años (propuesta):** *volumen de venta directa procesada por restaurantes vía Street Boss* (GMV directo, sin comisión) — porque nuestro éxito se mide en cuánto dinero **le dejamos** al restaurante, no en cuánto le quitamos.

---

# PARTE II — LA VISIÓN EN EL TIEMPO

> Filosofía de versiones: **cada versión debe ser vendible por sí sola.** No construimos un gigante inservible durante 3 años; entregamos valor real en cada etapa. 1.0 ya resuelve el dolor central.

## 6. Street Boss 1.0 — "El Escaparate que vende" (Fundación)

**Objetivo:** que un restaurante tenga en minutos un escaparate premium que venda por WhatsApp, sin comisiones.

- **Escaparate Digital** con catálogo interactivo (foto, nombre, descripción, precio, categorías).
- **Perfil gastronómico** (marca, historia, horarios, ubicación, redes).
- **Página visual de pedidos:** el cliente arma su carrito y lo envía.
- **Pedido directo por WhatsApp** (mensaje pre-armado con el detalle).
- **Link de venta único** + QR generado (para bio, tarjetas, mesa, redes).
- **Dashboard Cliente básico:** editar menú, precios, disponibilidad; ver visitas.
- **Onboarding express** (plantillas por tipo de comida).
- **Mobile-first** total.

**Criterio de éxito 1.0:** un dueño no técnico monta su escaparate solo, sin ayuda, y recibe su primer pedido por WhatsApp el mismo día.

## 7. Street Boss 2.0 — "El Motor de Ventas" (Crecimiento)

**Objetivo:** no solo mostrar, sino **hacer vender más** y retener clientes.

- **Pedidos gestionados dentro de la plataforma** (estado del pedido, historial), además de WhatsApp.
- **CRM básico:** base de clientes, frecuencia, ticket promedio, cumpleaños.
- **Fidelización:** puntos, sellos digitales, recompensas.
- **Programa de referidos.**
- **Promociones y cupones** (combos, 2x1, descuentos por horario).
- **Analytics de negocio:** qué se vende, a qué hora, qué producto sube el ticket.
- **Pagos en línea opcionales** (link de pago / pasarela) sin volverlo obligatorio.
- **Capa de IA v1:** genera descripciones de platillos, sugiere precios, redacta posts.
- **SEO y Google Business asistidos** desde el propio panel.

**Criterio de éxito 2.0:** el restaurante ve que sus **ventas suben** y sus clientes **regresan** gracias a Street Boss.

## 8. Street Boss 3.0 — "El Sistema Operativo del Restaurante" (Dominio)

**Objetivo:** convertirse en el centro de operación comercial del negocio.

- **POS integrado** (caja, mesas, turnos) conectado con el mismo catálogo.
- **Multi-sucursal** y roles de equipo.
- **Multi-idioma** (expansión internacional).
- **CRM avanzado + automatizaciones de marketing** (recuperación de clientes, campañas WhatsApp).
- **Integraciones de delivery** (repartidores propios del negocio o terceros).
- **Marketplace interno de recursos** (plantillas, fotógrafos, activos, servicios).
- **API pública** e integraciones con contabilidad, inventario, ERPs.
- **App móvil** para dueño (gestión) y opcional para el comensal.
- **IA v2 "Copiloto del negocio":** analiza datos y recomienda acciones ("sube el precio de X", "reactiva a estos 40 clientes dormidos").

**Criterio de éxito 3.0:** un restaurante puede operar **todo su negocio comercial** sobre Street Boss.

## 9. Street Boss a 10 años — "La red de negocios que mandan"

Visión aspiracional (Norte, no plan detallado):

- Street Boss es la **infraestructura de venta directa** de cientos de miles de negocios de comida en varios idiomas.
- Una **capa de IA autónoma** opera como "socio digital": crea el escaparate, escribe el contenido, atiende clientes, ajusta precios y sugiere expansión —el dueño solo aprueba.
- **Datos agregados y anónimos** dan a cada restaurante inteligencia de mercado ("en tu zona sube la demanda de X") sin comprometer su independencia.
- Un **ecosistema de terceros** (desarrolladores, agencias, proveedores) construye sobre la API de Street Boss.
- Posible **capa financiera** (adelantos, terminal de pago, herramientas de flujo) siempre bajo el principio: **potenciar al negocio, jamás quitarle el control.**
- Street Boss se recuerda como la marca que **le devolvió a los restaurantes el control de su negocio digital.**

---

# PARTE III — A QUIÉN SERVIMOS

## 10. Público objetivo

**Primario:** dueños y encargados de negocios de comida en el mundo hispanohablante que venden o quieren vender por internet:
- Restaurantes independientes y de barrio.
- Food trucks y puestos con marca.
- Dark kitchens / cocinas fantasma.
- Pizzerías, taquerías, hamburgueserías, marisquerías, pollerías, cafés, reposterías, comida saludable.
- Negocios que ya venden desordenadamente por WhatsApp/redes y quieren profesionalizarse.

**Secundario:**
- Consultores y agencias que montan presencia digital a restaurantes.
- Cadenas pequeñas (2–10 sucursales) que quieren un canal directo propio.

**Usuario final indirecto:** el **comensal** que pide desde su celular.

## 11. Buyer Personas

**🧑‍🍳 Persona 1 — "Doña Mari", la dueña de fonda/taquería (45)**
- No técnica, orgullosa de su sazón, vende por WhatsApp con fotos borrosas.
- **Dolor:** "se ve improvisado y pierdo pedidos por el desorden".
- **Gana con Street Boss:** un escaparate bonito, pedidos ordenados, cero comisión.
- **Mensaje que la mueve:** "Tu comida por fin se va a ver como merece."

**👨‍🍳 Persona 2 — "Carlos", el emprendedor de food truck/burgers (29)**
- Digital, activo en Instagram/TikTok, odia las comisiones de las apps.
- **Dolor:** "las apps me quitan 30% y no sé quiénes son mis clientes".
- **Gana:** canal propio, marca, datos de sus clientes, fidelización.
- **Mensaje:** "Deja de alquilar tus clientes. Hazlos tuyos."

**👩‍💼 Persona 3 — "Andrea", dueña de 3 cafés (38)**
- Semi-profesional, ya tiene marca, busca crecer y ordenar la operación.
- **Dolor:** "no tengo control unificado de mis sucursales ni de mis clientes".
- **Gana (2.0/3.0):** multi-sucursal, CRM, analytics, promociones.
- **Mensaje:** "Un solo panel para mandar en todo tu negocio."

**🧑‍💻 Persona 4 — "Luis", consultor/agencia (33)**
- Monta presencia digital a varios restaurantes.
- **Dolor:** "necesito una herramienta rápida y bonita para mis clientes".
- **Gana:** montar escaparates en minutos, marca blanca a futuro, recurrencia.
- **Mensaje:** "Entrégales a tus clientes un canal que sí vende."

## 12. Casos de uso

- **Menú digital en mesa** (QR físico) que además vende para llevar.
- **Link en bio de Instagram/TikTok** que convierte seguidores en pedidos.
- **Pedidos para llevar/domicilio** directo por WhatsApp, sin app.
- **Lanzamiento de platillo nuevo** con historia + foto + promoción.
- **Catering / pedidos grandes** con perfil que da confianza.
- **Reactivación de clientes** (2.0): "hace 30 días no pides, aquí un 15%".
- **Operación multi-sucursal** (3.0) con un catálogo central.
- **Evento / pop-up** con escaparate temporal y QR.

## 13. Customer Journey (del restaurante)

1. **Descubrimiento:** ve un anuncio/reel o un colega ya lo usa → "sin comisiones y se ve premium".
2. **Consideración:** entra a la landing, ve ejemplos de escaparates, entiende el "sin comisión".
3. **Registro:** crea su cuenta en minutos.
4. **Onboarding:** elige plantilla por tipo de comida, sube 3–5 platillos guiado.
5. **Primer valor ("aha"):** ve su escaparate listo y bonito → lo comparte.
6. **Primer pedido:** recibe un pedido por WhatsApp → **momento mágico.**
7. **Hábito:** actualiza menú, publica promos, revisa analytics.
8. **Expansión:** activa fidelización, referidos, pagos, más sucursales (2.0/3.0).
9. **Lealtad/Advocacy:** recomienda Street Boss a otros dueños (referidos).

## 14. Onboarding ideal

**Principio: "Tiempo al primer escaparate" < 10 minutos. "Tiempo al primer pedido" < 24 horas.**

- **Paso 0 — Plantilla inteligente:** "¿Qué vendes?" (tacos, pizza, burgers, café…). Precarga estructura, categorías y ejemplos.
- **Paso 1 — Identidad exprés:** nombre, logo/foto, WhatsApp, zona. (Sin pedir lo que no es esencial.)
- **Paso 2 — Primeros platillos:** subir 3–5 con foto, nombre, precio. **La IA sugiere la descripción.**
- **Paso 3 — Vista previa:** el dueño ve su escaparate real → efecto orgullo.
- **Paso 4 — Publicar y compartir:** genera link + QR, botón directo a "compartir en WhatsApp/Instagram".
- **Paso 5 — Checklist de crecimiento:** tareas guiadas ("completa 10 platillos", "activa promo", "sube foto de portada").
- **Acompañamiento:** tips contextuales + IA que responde dudas en lenguaje simple. Nunca dejar al usuario solo frente a una pantalla vacía.

---

# PARTE IV — LOS MÓDULOS DEL PRODUCTO

## 15. Biblioteca Street Boss

Repositorio central de **recursos que hacen ver premium a cualquier restaurante sin diseñador**:
- Plantillas de escaparate por tipo de comida.
- Plantillas de contenido para redes (posts, historias, reels).
- Guías rápidas ("cómo fotografiar tu comida con el celular").
- Banco de íconos, fondos y estilos aprobados por la marca.
- Textos base (descripciones, promos) editables por IA.
- **Visión:** que sea el "Canva interno" de Street Boss —el restaurante nunca parte de cero.

## 16. Escaparate Digital (el corazón)

- Vitrina visual, mobile-first, que **da hambre**.
- Catálogo con foto grande, categorías, buscador, destacados ("lo más pedido").
- Perfil gastronómico + prueba social (reseñas/estrellas).
- CTA de pedido siempre visible → WhatsApp/carrito.
- Personalizable dentro de las reglas de marca (sin romper coherencia).
- Rápido, indexable (SEO), compartible (link + QR).

## 17. Dashboard Cliente (panel del restaurante)

El centro de mando del dueño:
- Editar menú, precios, disponibilidad (agotados en 1 toque).
- Gestionar pedidos y su estado (2.0).
- Ver métricas clave (visitas, pedidos, top productos).
- Configurar promociones, fidelización, referidos (2.0).
- Multi-sucursal y roles (3.0).
- **Regla de diseño:** simple sobre completo. Un dueño ocupado lo usa desde el celular entre pedidos.

## 18. Dashboard Administrativo (Street Boss interno)

Panel del equipo Street Boss (no del cliente):
- Gestión de cuentas, planes y facturación.
- Métricas de la plataforma (activación, retención, GMV directo, churn).
- Soporte y salud de cuentas.
- Gestión de contenido de la Biblioteca y plantillas.
- Control de abuso, moderación, seguridad.

## 19. Pedidos

- **1.0:** pedido armado visualmente → mensaje pre-formateado a WhatsApp.
- **2.0:** pedidos gestionados en plataforma (recibido → en preparación → listo), historial, notas, horarios de atención, tiempos estimados.
- **3.0:** pedidos conectados a POS y a delivery; enrutamiento por sucursal.
- Siempre: **el pedido es del restaurante**, no de Street Boss.

## 20. Delivery

Postura de producto clara: **no nos volvemos un marketplace de repartidores que se queda al cliente.**
- **1.0/2.0:** el restaurante coordina su propio reparto (sus repartidores, por WhatsApp).
- **3.0:** **integraciones** con flotillas propias o terceros (zonas, tarifas, seguimiento), como **opción del negocio**, no como intermediario que cobra comisión por pedido.
- Principio: habilitamos el delivery, no lo secuestramos.

## 21. CRM

- **2.0:** base de clientes automática (quién pide, cuánto, cada cuánto), etiquetas, cumpleaños, ticket promedio.
- **3.0:** segmentación avanzada, clientes dormidos, valor de vida (LTV), campañas dirigidas por WhatsApp.
- **Diferenciador clave:** en los marketplaces el cliente es de la app; **en Street Boss el cliente es del restaurante.** El CRM materializa esa promesa.

## 22. IA (capa transversal)

La IA es un **diferenciador estratégico**, no un adorno:
- **Contenido:** genera descripciones de platillos, posts, historias, respuestas.
- **Precios:** sugiere precios y combos según datos.
- **Atención:** borradores de respuesta a clientes por WhatsApp.
- **Copiloto (3.0):** analiza el negocio y recomienda acciones concretas.
- **Onboarding:** guía conversacional para el dueño no técnico.
- Principio: **la IA trabaja para el dueño y el dueño decide.** Nunca actúa sin control.

## 23. Automatizaciones

- Confirmaciones de pedido por WhatsApp.
- Recuperación de clientes ("hace X que no pides").
- Recordatorios de promociones y horarios.
- Publicación programada de contenido a redes (2.0/3.0).
- Alertas al dueño (pico de pedidos, producto agotándose).
- Integración con n8n / webhooks para usuarios avanzados (3.0/API).

## 24. SEO

- Escaparates **indexables** y rápidos (ventaja sobre menús en PDF/imagen).
- Estructura optimizada por platillo y categoría.
- Metadatos, schema de restaurante, URLs limpias.
- Guía y asistencia SEO desde el panel (palabras clave locales).
- **Objetivo:** que el restaurante aparezca en Google por su comida y su zona, con canal propio.

## 25. Google Business

- Conexión/asistencia para optimizar el perfil de Google Business.
- Sincronizar horarios, fotos, enlace al escaparate.
- Impulsar reseñas (fidelización → reseña).
- **Visión:** Street Boss como el "hub" que ordena la presencia local del restaurante.

## 26. Redes Sociales

- Botón "compartir escaparate" nativo (Instagram, TikTok, Facebook, WhatsApp).
- Generador de contenido con IA (posts, reels, historias) desde la Biblioteca.
- Link en bio que convierte.
- Calendario/parrilla asistida (2.0/3.0).
- Principio: las redes **atraen**, el escaparate **convierte y retiene**.

## 27. Analytics

- **Cliente:** visitas, pedidos, conversión, top productos, horas pico, ticket promedio, retención.
- **Plataforma (interno):** activación, retención, churn, GMV directo, NPS.
- Insights accionables, no solo gráficas ("tu producto X sube el ticket, promociónalo").
- Reportes simples para el dueño no técnico.

## 28. Gamificación

- Para el **dueño:** checklist de crecimiento, logros ("100 pedidos", "menú completo"), niveles de "Boss".
- Para el **comensal:** sellos, retos ("pide 5 veces y gana"), recompensas.
- Objetivo: enganche y hábito, siempre con propósito (no puntos vacíos).

## 29. Fidelización

- Puntos, sellos digitales, recompensas, cliente frecuente.
- Cumpleaños y beneficios automáticos.
- Integrado al CRM (el cliente es del restaurante).
- **Diferenciador:** la lealtad la construye el restaurante con **sus** clientes, no la app.

## 30. Programa de referidos

- **De restaurante a restaurante:** "invita a otro dueño y ambos ganan" (motor de crecimiento viral B2B).
- **De comensal a comensal:** el cliente comparte y gana recompensa del restaurante.
- Referidos rastreables desde el panel.

## 31. Marketplace interno

Un mercado **de recursos y servicios** (no de comida entre restaurantes):
- Plantillas premium, packs de contenido, estilos.
- Servicios: fotógrafos de comida, diseñadores, community managers verificados.
- Integraciones y add-ons de terceros (a futuro, sobre la API).
- Fuente de ingresos adicional y de valor para el restaurante.

## 32. Integraciones futuras

- Pasarelas de pago (Stripe, Mercado Pago, etc.).
- WhatsApp Business API.
- Contabilidad / facturación.
- Inventario / proveedores.
- Delivery de terceros.
- Herramientas de marketing y analytics (GA4, Meta).
- Automatización (n8n, Zapier, webhooks).

## 33. API

- **API pública (3.0):** que agencias y desarrolladores construyan sobre Street Boss.
- Webhooks de pedidos, clientes, catálogo.
- Base para marca blanca y para el ecosistema de terceros.
- Principio: API abre el ecosistema **sin** ceder el control del restaurante sobre sus datos.

## 34. Mobile App

- **App del dueño (gestión):** administrar pedidos, menú y métricas desde el celular; notificaciones push de pedidos.
- **App del comensal (opcional/futuro):** solo si aporta más que la web; no forzamos descargas.
- Prioridad: web mobile-first impecable **antes** que apps nativas.

## 35. POS (Punto de Venta)

- **3.0:** POS integrado que comparte el mismo catálogo del escaparate.
- Caja, mesas, turnos, cortes, impresión de comandas.
- Une el mundo físico (mostrador) y digital (online) en un solo sistema.
- **Postura:** el POS es una **capacidad de expansión**, no el origen del producto. Nacemos vendiendo online.

## 36. Multi sucursal

- **3.0:** catálogo central + variaciones por sucursal (precios, disponibilidad, zona).
- Roles y permisos por sucursal.
- Analytics consolidado y por local.
- Para cadenas pequeñas y negocios en crecimiento.

## 37. Multi idioma

- **3.0:** interfaz y escaparates en varios idiomas (empezando por español, luego inglés/portugués).
- Escaparate del restaurante en el idioma de sus clientes.
- Base para la expansión internacional de la visión a 10 años.

---

# PARTE V — EL NEGOCIO

## 38. Modelo SaaS

- **Suscripción** (mensual/anual) por restaurante o por sucursal.
- Estructura por planes según valor entregado (no por "castigar" el crecimiento con comisión).
- **Principio de marca ↔ negocio:** cobramos por la **herramienta**, no un **porcentaje del pedido**. Eso ES el diferenciador; el modelo debe protegerlo.
- Escalable: freemium/trial para adquisición, planes superiores para negocios que crecen.

## 39. Modelo de ingresos

Fuentes propuestas (a validar por Daniel):
1. **Suscripción SaaS** (núcleo): planes por funciones y sucursales.
2. **Add-ons premium:** IA avanzada, automatizaciones, multi-sucursal, API.
3. **Marketplace interno:** comisión sobre servicios/plantillas de terceros (no sobre la comida del restaurante).
4. **Procesamiento de pagos** (opcional): margen fino sobre pagos en línea, transparente.
5. **Marca blanca / partners:** agencias que revenden Street Boss.

> ⚠️ **Regla de oro del negocio:** nunca cobrar **comisión por pedido de comida**. Es la promesa central; romperla mataría la marca.

## 40. Roadmap del producto

| Fase | Versión | Foco | Entregables núcleo |
|---|---|---|---|
| **F1** | 1.0 | Escaparate que vende | Escaparate, catálogo, perfil, pedidos por WhatsApp, link+QR, dashboard básico, onboarding |
| **F2** | 2.0 | Motor de ventas | Pedidos gestionados, CRM básico, fidelización, referidos, promos, analytics, IA v1, pagos opcionales |
| **F3** | 3.0 | Sistema operativo | POS, multi-sucursal, multi-idioma, delivery integrado, automatizaciones, API, app, IA copiloto, marketplace |
| **F4** | 4.0+ | Ecosistema | Marca blanca, ecosistema de terceros, inteligencia de mercado, capa financiera (a evaluar) |

Alineado con el `ROADMAP.md` del ecosistema (Escaparate → Dashboard → Pedidos → Marketing → Lanzamiento).

---

# PARTE VI — ANÁLISIS COMPETITIVO

> No copiamos. Extraemos el mejor principio de cada uno y diseñamos visión propia.

| Referente | Qué hace excelente | Qué le tomamos (el principio) |
|---|---|---|
| **Shopify** | Le dio a cualquiera su **tienda propia** sin depender de un marketplace. | El alma de Street Boss: canal de venta **directa y propia** para restaurantes. "Arma tu Street Boss" = "hazte un Shopify". |
| **Canva** | Diseño premium sin ser diseñador, con plantillas. | La **Biblioteca**: que cualquier restaurante se vea premium sin diseñador. |
| **Notion** | Simple por fuera, potente por dentro; crece con el usuario. | Producto que **empieza fácil y escala** de escaparate a sistema operativo. |
| **Instagram** | Lo **visual** vende comida; el antojo entra por los ojos. | Escaparate mobile-first centrado en la **imagen que da hambre**. |
| **GloriaFood** | Pedidos online **sin comisión** para restaurantes. | Valida el "sin comisión"; nosotros lo elevamos con **estética premium + marca + IA**. |
| **Flipdish** | Canal propio de pedidos con marca del restaurante. | Marca y canal propios; lo hacemos **más simple y visual** para el no técnico. |
| **Toast** | POS todo-en-uno para restaurantes (EE.UU.). | Visión 3.0 de **sistema operativo**; pero nacemos desde lo online, no desde la caja. |
| **Uber Eats Merchant** | Alcance y logística masiva. | Aprendemos su **fricción y comisión** como el dolor a resolver. Somos su **alternativa de independencia**. |
| **DoorDash** | Demanda y datos a gran escala. | El **dato del cliente** es oro —por eso se lo **devolvemos** al restaurante (CRM propio). |
| **Google Business** | Descubrimiento local y reseñas. | Integrarlo para **SEO local**; Street Boss como hub que ordena la presencia local. |

**Síntesis de posicionamiento competitivo:**
> Street Boss = **la independencia de Shopify** + **la estética fácil de Canva** + **el antojo visual de Instagram** + **el "sin comisión" de GloriaFood**, diseñado para comida y para dueños no técnicos, con IA como copiloto. Nuestro enemigo de categoría es la **dependencia y la comisión** de los marketplaces.

---

# PARTE VII — ENTREGA EJECUTIVA

## Resumen ejecutivo

Street Boss es **la plataforma visual de venta directa de comida por internet, sin depender de marketplaces**. Nace resolviendo un dolor claro —comisiones altas, pérdida del cliente y mala imagen online— con un **escaparate premium + pedidos por WhatsApp + cero comisiones + control total**. Su visión escala en tres versiones vendibles: **1.0 Escaparate que vende**, **2.0 Motor de ventas** (CRM, fidelización, IA, analytics) y **3.0 Sistema operativo del restaurante** (POS, multi-sucursal, API, delivery, marketplace). El norte a 10 años es ser la **infraestructura de venta directa** de cientos de miles de negocios de comida, con IA como copiloto. La regla inviolable del negocio: **cobrar por la herramienta (SaaS), nunca comisión por pedido** —eso es lo que nos hace Street Boss.

## Las 20 ideas más importantes

1. El corazón es el **escaparate visual que vende**, no el "menú QR".
2. **Cero comisión por pedido** es la promesa sagrada e inviolable.
3. **El cliente es del restaurante**, no de la app (el CRM lo materializa).
4. Cada versión debe ser **vendible por sí sola** (valor desde 1.0).
5. **"Tiempo al primer escaparate" < 10 min; al primer pedido < 24 h.**
6. La **comida es la protagonista; la tecnología, invisible.**
7. **IA como copiloto** del dueño no técnico (contenido, precios, atención).
8. **Biblioteca estilo Canva** para verse premium sin diseñador.
9. **"Arma tu Street Boss"** debe volverse verbo (efecto Shopify).
10. Modelo **SaaS por suscripción**, jamás porcentaje del pedido.
11. **Mobile-first** por encima de apps nativas al inicio.
12. **Referidos B2B** (restaurante invita a restaurante) como motor viral.
13. **Delivery habilitado, no secuestrado** (integración, no intermediación).
14. **SEO + Google Business** integrados = descubrimiento local propio.
15. **Analytics accionable**, no solo gráficas.
16. **Multi-sucursal y POS** son expansión (3.0), no el origen.
17. **API y marca blanca** abren ecosistema sin ceder control del dato.
18. **Onboarding con plantillas por tipo de comida** (no partir de cero).
19. **Fidelización + gamificación** con propósito, para crear hábito.
20. Enemigo de categoría claro: **la dependencia y la comisión** de marketplaces.

## Las 10 funciones más disruptivas

1. **Escaparate premium en <10 min** con plantillas por tipo de comida.
2. **IA que escribe el menú y el contenido** por el dueño no técnico.
3. **CRM que le devuelve el cliente al restaurante** (lo opuesto al marketplace).
4. **Cero comisión** como arquitectura de negocio, no como promoción.
5. **Copiloto IA del negocio (3.0):** recomienda acciones sobre datos reales.
6. **Biblioteca "Canva interno"** de recursos que hacen ver premium.
7. **Referidos B2B** que convierten a cada dueño en canal de adquisición.
8. **Pedido por WhatsApp sin fricción** (sin apps, sin cuentas).
9. **Hub de presencia local** (escaparate + SEO + Google Business unificados).
10. **Del online al mostrador:** mismo catálogo alimenta escaparate y POS (3.0).

## Riesgos detectados

1. **Alcance excesivo (scope creep):** querer construir POS, CRM, IA y delivery a la vez → parálisis. **Mitigar:** disciplina de versiones; 1.0 estrecho y sólido.
2. **Percepción de "otro menú QR":** commoditización y guerra de precio. **Mitigar:** narrativa de escaparate/venta directa + estética premium.
3. **Romper la promesa "sin comisión"** por presión de ingresos. **Mitigar:** blindar el modelo SaaS; documentarlo como regla de oro.
4. **Dependencia de WhatsApp** (cambios de política/API). **Mitigar:** pedidos gestionados propios en 2.0 como respaldo.
5. **Complejidad que asuste al no técnico.** **Mitigar:** onboarding guiado + IA; "simple sobre completo".
6. **Calidad visual desigual** (fotos malas del restaurante). **Mitigar:** Biblioteca, guías y servicios del marketplace.
7. **Competencia establecida** (GloriaFood, Flipdish) y marketplaces con capital. **Mitigar:** enfoque hispano + IA + marca fuerte + comunidad.
8. **Monetización lenta** si el freemium no convierte. **Mitigar:** valor claro en planes superiores desde 2.0.
9. **Confundir "sin comisión" con "gratis".** **Mitigar:** comunicación transparente del modelo.
10. **Dispersión de la marca** al volverse "hace de todo". **Mitigar:** un solo héroe de comunicación (venta visual directa).

## Recomendaciones

1. **Enfocar 1.0 al máximo:** escaparate + pedido WhatsApp + onboarding. Nada más hasta que eso brille.
2. **Blindar por escrito la regla "cero comisión por pedido"** como principio de producto y negocio.
3. **Definir el modelo de ingresos concreto** (precios de planes, freemium vs. trial) antes de escalar features.
4. **Invertir temprano en la Biblioteca y la IA de contenido:** es el diferenciador que resuelve el "no soy diseñador".
5. **Medir el norte correcto:** activación (escaparate publicado) y primer pedido, no vanity metrics.
6. **Construir el referido B2B pronto:** crecimiento viral barato entre dueños.
7. **No lanzar POS/delivery hasta 3.0:** son trampas de complejidad tempranas.
8. **Mantener la coherencia con el ADN y el ROADMAP** en cada decisión de producto.

## Qué debería construirse primero (F1 / 1.0)

1. **Escaparate Digital** (catálogo + perfil + página de pedidos).
2. **Pedido directo por WhatsApp** (mensaje pre-armado).
3. **Onboarding con plantillas** por tipo de comida.
4. **Dashboard Cliente básico** (editar menú/precios/disponibilidad, ver visitas).
5. **Link único + QR** y botón de compartir.
6. **Mobile-first** impecable.

## Qué puede esperar

- CRM avanzado, fidelización, referidos, IA de contenido → **2.0**.
- POS, multi-sucursal, multi-idioma, delivery integrado, API, app, marketplace, copiloto IA → **3.0**.
- Marca blanca, ecosistema de terceros, capa financiera, inteligencia de mercado → **4.0+ / 10 años**.

## Qué debe descartarse (o evitar)

- **Comisión por pedido de comida** — jamás (mataría la marca).
- **Convertirnos en marketplace** de restaurantes que compiten entre sí.
- **Flotilla propia de repartidores** como negocio central.
- **App nativa obligatoria** para el comensal en etapas tempranas.
- **POS como punto de partida** (nacemos desde lo online).
- **"Street Boss V2" o subproyectos paralelos** — una sola visión, versionada.
- **Features "porque el competidor las tiene"** sin encajar en el ADN.

## Próximo documento recomendado

**`FEATURES-1.0.md`** (o `SPEC-ESCAPARATE.md`): la **especificación funcional detallada de Street Boss 1.0** —flujos de usuario, pantallas, estados, reglas y criterios de aceptación del Escaparate + Pedido por WhatsApp + Onboarding— para que Codex tenga una guía clara y sin ambigüedad antes de tocar código.

*Alternativa complementaria:* `METRICS.md` (definición del norte, activación, retención y modelo de ingresos con números).

---

> [!NOTE]
> **Estado:** documento de visión de producto en versión 1. Sujeto a validación de Daniel Vázquez. No modifica software, Git, ni identidad visual. No se generaron imágenes, logo ni colores.
