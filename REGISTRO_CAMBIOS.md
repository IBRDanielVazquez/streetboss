# REGISTRO DE CAMBIOS — STREETBOSS

## 2026-08-25 — Identificación de prospectos sin WhatsApp

- Se reforzó el primer mensaje de prospección con `desde $99 al mes, sin comisiones por venta` antes del enlace principal.
- Se añadió una matriz de clasificación visible al inicio de la ficha con seis estados operativos: Contactado, No contesta, Interesado, Demo creado, Es cliente y No le interesó.
- Se incorporó la marca independiente `Perfil personal`; conserva el teléfono de la empresa, muestra una advertencia explicativa y etiqueta la tarjeta como `PERFIL PERSONAL`.
- Se agregaron pestañas y contadores para `No contestan` y `Demo creado`; el estado histórico `PRODUCCION` conserva compatibilidad y aparece en esa última agrupación.
- Se agregó la casilla persistente `No tiene WhatsApp` en la matriz de contacto de la ficha comercial.
- La marca deshabilita enlaces de WhatsApp, conserva la llamada telefónica, muestra `SIN WA` en la tarjeta y ajusta el filtro de WhatsApp.
- Se creó `sb_hq_prospect_states` para conservar centralmente los estados comerciales y se añadió reconciliación por `updated_at` entre nube y navegador.
- Los seguimientos locales anteriores se suben automáticamente cuando son más recientes; HQ vuelve a sincronizar al abrir, recuperar foco o regresar desde segundo plano.
- Validaciones: `npm run build` (1,652 módulos), `git diff --check`, prueba Data API `201/200`, limpieza del registro temporal y revisión del bundle servido.
- Producción: `dpl_9GMo9moZ1YmoP5NvhJQZgJvb1wST`, alias `https://streetboss.com.mx`.

## 2026-08-24 — Resolución cloud-first de slugs al crear negocios

- Reemplazada la validación exclusivamente local por una consulta previa a `sb_businesses` para cada slug candidato.
- Los slugs activos o pertenecientes a cuentas eliminadas quedan reservados y el generador elige automáticamente un sufijo disponible.
- Añadido aviso visible cuando la dirección solicitada cambia durante el alta.
- Causa confirmada en logs: nueve respuestas `POST 409` por `sb_businesses_slug_key` desde Safari de escritorio.
- Archivo funcional modificado: `src/services/crmV3Service.js` y `src/components/crm/CrearNegocioTab.jsx`.
- Validaciones: `git diff --check`, build de 1,649 módulos, alta real en escritorio, alta real con viewport móvil y limpieza central de ambos registros temporales.
- Producción: `dpl_2kLT2RNRxrmPWxT8nj7QphYeXeey`.

## 2026-08-24 — Módulo de Analítica HQ

- Creada la tabla `sb_menu_analytics_events` para eventos anónimos por negocio.
- Añadido registro no bloqueante de visitas, apertura de carrito, clics en WhatsApp/teléfono/mapa/compartir y pedidos creados.
- Añadida la app `Analítica` a la pantalla principal y navegación lateral de HQ.
- Añadido tablero comparativo por restaurante para 7, 30 y 90 días.
- Archivos principales: `src/services/menuAnalyticsService.js`, `src/components/crm/AnalyticsHQTab.jsx`, `src/pages/MenuDigital.jsx`, `src/components/menu/MenuHeroProfile.jsx`, `src/components/CheckoutDrawer.jsx`, `src/pages/StreetBossCentral.jsx` y `supabase/migrations/20260824214116_hq_menu_analytics.sql`.
- Validaciones: `git diff --check`, build de 1,649 módulos, tabla con RLS/índices/políticas, asesores Supabase, evento real y limpieza posterior.
- Producción: `dpl_Vtje5pUVn54EMs3ae7r7WtKv5BqF`.

## 2026-08-24 — Eliminación central de pedidos desde HQ

- Añadida la acción `Eliminar pedido` dentro del detalle de pedidos de la Central HQ.
- La acción exige escribir `ELIMINAR`, espera confirmación de Supabase y después actualiza historial, métricas, rankings y sesiones abiertas.
- El borrado de cuentas B2B ahora ofrece por separado eliminar consumidores y eliminar pedidos asociados.
- Archivos funcionales modificados: `src/components/crm/PedidosCRMTab.jsx`, `src/components/crm/ClientesTab.jsx` y `src/services/crmV3Service.js`.
- Validaciones: `git diff --check`, build de 1,647 módulos, despliegue Vercel `READY` y comprobación de los textos funcionales servidos en producción.
- Producción: `dpl_HEpjqjVogz7j9cH2U7WgsGkPuvgK`.

## 2026-08-24 — Borrado visible de clientes desde HQ

- Se añadió un botón rojo `Borrar cuenta` en la cabecera de cada ficha de cliente de la Central HQ y un aviso que explica la protección de la acción.
- Se reutilizó el flujo central existente: confirmación escrita `ELIMINAR`, opción independiente para eliminar consumidores y espera de confirmación del almacenamiento central.
- No se modificaron autenticación, roles, permisos, pagos ni estructura de Supabase.
- Archivo funcional modificado: `src/components/crm/ClientesTab.jsx`.
- Validaciones: `git diff --check`, `npm run build`, despliegue Vercel `READY` y comprobación del contenido servido desde `https://streetboss.com.mx`.
- Producción: `dpl_2Hb2esQ9mW6frKKY6VABhv1td9Dn`.

## 2026-08-24 — Corrección de formato de envío y restricción de tarjeta

- Eliminada la concatenación duplicada de `$` en el mensaje de confirmación por WhatsApp.
- Implementada visualización y validación de `payment_methods.tarjeta.compra_minima` contra el total del pedido.
- La opción tarjeta queda deshabilitada bajo el mínimo y muestra el importe faltante.
- Añadido guardado transaccional de configuración comercial mediante `saveBusinessSettings` para evitar lecturas anteriores durante la sincronización.
- Validación en producción con Cafecito: regla de $500 aplicada correctamente a un carrito de $40, sin generar pedido.
- Producción: `dpl_HmHa3HEPzfApfp6u3zAQa6iy8BsP`.

## 2026-08-24 — Reparación urgente de acceso B2B

- Causa: `useMemo` estaba declarado después de retornos condicionales de carga y autenticación; al iniciar sesión cambiaba el orden de hooks y React detenía el panel.
- Solución: cálculo determinista de sugerencias sin hook condicional.
- Alcance: todos los paneles de clientes y demos.
- Validación: build de 1,647 módulos, despliegue Vercel READY, acceso completo a `/panel/pizza-house` y consola del navegador sin errores.
- Producción: `dpl_6XtNuwptNa7HFvuHVFgWzhrerQF1`, alias `https://streetboss.com.mx`.

## 2026-08-24 — Auditoría transversal de Cafecito y corrección en producción

- Corregida la pérdida de métodos de pago al reconstruir un negocio desde Supabase.
- Los guardados de disponibilidad, visibilidad y zonas ahora esperan respuesta central y revierten el estado local si existe error.
- Separadas las rutas visuales `Formas de pago` y `Colonias de reparto`.
- Añadidas sugerencias SEPOMEX según código postal, colonia o dirección del establecimiento.
- El checkout informa y bloquea la confirmación si no hay forma de pago habilitada.
- Se retiró de Cafecito un pedido y un cliente de prueba que alimentaban incorrectamente `Colonias top`; verificación posterior: cero registros.
- Se fijaron en Cafecito efectivo, transferencia y tarjeta como inactivos conforme a la prueba solicitada.
- Archivos modificados en esta corrección: `src/services/crmV3Service.js`, `src/pages/ClientDashboard.jsx`, `src/components/CheckoutDrawer.jsx`, `ESTADO_ACTUAL.md`, `REGISTRO_CAMBIOS.md`, `TAREAS.md`.
- Validaciones: `git diff --check`, `npm run build`, consultas REST tenant y recorrido del menú/checkout en producción.

## 2026-08-24 — Menú y dashboard demo Pizza Nostra

- Se adaptó la demo `pizza-house` como pizzería ficticia para pruebas.
- Se configuró el contacto `961 372 5386`, dirección ficticia en Moctezuma, cobertura aproximada de 2 km y tarifas por colonia.
- Se activó el límite máximo de $500 para cambio en efectivo y se desactivaron transferencia y tarjeta en esta demo.
- Se sincronizan estos datos con la copia local de demos para que también aparezcan en el dashboard.
- Archivos modificados: `src/data/demoFixtures.js`, `src/data/demoShowcase.js`, `src/pages/DemoPublicMenuWrapper.jsx`, `src/services/crmV3Service.js`, `ESTADO_ACTUAL.md`, `REGISTRO_CAMBIOS.md`, `TAREAS.md`.
- Validaciones: `git diff --check` y `npm run build`.

## 2026-08-22 — Persistencia de formas de pago

**Agente:** Codex

- Corregido el guardado de `payment_methods` para esperar la sincronización central antes de recargar el negocio.
- Añadidos estados visibles de guardado, sincronización y error.
- Corregido el manejo de valores numéricos `0` en límites y compras mínimas.
- Build y `git diff --check` aprobados localmente.
- Publicado en Vercel como `dpl_CsnGRecwFQcEmPoycLjwhWLcR78u`, estado `READY` y alias `https://streetboss.com.mx`.
- Prueba de producción aprobada con La Chiapaneca: confirmación de sincronización, persistencia tras recarga y métodos visibles desde una segunda sesión en el checkout público.
- No se alteraron métodos ni datos bancarios y no se confirmó ningún pedido de prueba.

---

## 2026-08-22 — Edición directa de la frase de pedidos

**Agente:** Codex

- La etiqueta del perfil del menú incorpora edición contextual con lápiz, campo de texto, guardar y cancelar.
- El valor se conserva dentro de la configuración existente del negocio y se sincroniza con Supabase antes de confirmar éxito.
- El menú público lee el mismo valor central; el mensaje superior y la descripción permanecen independientes.
- Build aprobado con 1,647 módulos, `git diff --check` aprobado y despliegue Vercel `dpl_4mDrCYxyNU2cnCB4ZwrmSngC87b3` en estado `Ready`.
- Prueba de producción aprobada con valor temporal visible públicamente y restauración posterior de los datos originales.

---

## 2026-08-22 — Borrado de negocios e historiales de pedidos

**Agente:** Codex

### Causa confirmada

- El botón de Central HQ solo eliminaba la copia del navegador y nunca actualizaba `sb_businesses`.
- El menú público enviaba el slug como identidad del pedido en lugar del `business_id` canónico.
- El guardado no se esperaba y WhatsApp podía abrir aunque Supabase rechazara la operación.
- Central HQ intentaba leer todos los pedidos sin el contexto tenant exigido por RLS.

### Corrección y validación

- Baja remota obligatoria del negocio con manejo visible de errores y actualización local posterior.
- Persistencia esperada de pedido y cliente usando la identidad canónica del negocio.
- Lectura y Realtime por cada negocio en Central HQ; actualización inmediata de las pantallas del restaurante.
- `npm run build`: aprobado, 1,647 módulos. `git diff --check`: aprobado.
- Despliegue activo en `https://streetboss.com.mx` y prueba completa en producción aprobada para pedido, cliente, platillo más pedido y baja B2B.
- Registros desechables de verificación retirados de Supabase.
- Se cerró una ruta de resurrección de datos: antes de migrar una alta histórica local, Central HQ consulta su registro tenant en `sb_businesses`; si existe una baja, marca la copia local como eliminada y nunca la vuelve a publicar.
- Pruebas de producción aprobadas con una caché deliberadamente obsoleta y con almacenamiento limpio. En ambos casos sólo apareció el negocio activo del directorio central.

---

## 2026-08-21 — Clientes bidireccionales entre escritorio y móvil

**Agente:** Codex

### Causa confirmada

- La aplicación escribía clientes en `sb_business_customers`, pero nunca descargaba esa tabla.
- El listado dependía solo de pedidos locales o descargados, por lo que cada navegador podía conservar clientes exclusivos.
- Producción registró múltiples clientes de autenticación Supabase dentro del mismo navegador.

### Corrección

- Descarga, unión, deduplicación y carga bidireccional de clientes por negocio.
- Conflictos resueltos por `customer_id`, conservando fechas y datos más recientes.
- La sincronización de clientes se ejecuta incluso si falla la descarga de pedidos y deja un error estructurado para diagnóstico.
- Las conexiones contextuales usan sesión no persistente para evitar interferencia entre clientes Supabase.
- Tras comprobar producción, se añadió una clave de almacenamiento única por restaurante porque Supabase aún advertía una colisión interna aunque la sesión no fuera persistente.
- Vercel confirmó el despliegue final en 32 segundos; la verificación externa posterior devolvió una consola limpia, sin errores ni advertencias Supabase.

### Validación

- `npm run build`: aprobado, 1,647 módulos.
- `git diff --check`: aprobado.

---

## 2026-08-21 — OG individual por menú y lectura cloud-first

**Agente:** Codex
**Acción:** Corrección de enlaces compartidos y recuperación multidispositivo sin modificar esquema, RLS ni autenticación.

### Cambios realizados

- `api/menu.js` reconoce los diez demos oficiales y usa la foto de perfil y descripción propias de cada menú.
- Los negocios nuevos se consultan en `sb_businesses` con contexto del cliente y por `slug` o `business_id`.
- Se añadió una versión a la URL de la imagen OG para evitar que el perfil genérico anterior siga reutilizándose.
- `resolveBusinessBySlug` consulta primero Supabase y conserva la copia local solo como respaldo.
- Se escaparon de forma segura los textos inyectados en las etiquetas sociales.

### Validación

- `npm run build`: aprobado, 1,647 módulos.
- `git diff --check`: aprobado.
- Prueba de HTML OG: Tacos El Güero, Pizza House y Mariscos El Puerto devolvieron títulos e imágenes de perfil diferentes.
- Despliegue de producción confirmado por Vercel: `Ready` en 24 segundos y alias `https://streetboss.com.mx`.

---

> Historial de cambios relevantes en el proyecto.

---

## 2026-08-21 — Dashboard Springboard iOS y Configuración Visual del Menú

**Agente:** Codex
**Acción:** Primera evolución del Dashboard B2B para editar el menú real desde una experiencia visual mobile-first.

### Cambios realizados

- Pantalla inicial tipo iOS con `Configurar menú` como primera app y acción dominante.
- Dashboard Central HQ renovado con apertura directa en Inicio, Springboard iOS, fondo inmersivo, accesos táctiles y dock inferior en móvil y escritorio.
- Panel lateral histórico, bienvenida sobredimensionada y pie técnico retirados de la interfaz visible del HQ.
- Acción destructiva `Empezar de cero` retirada de toda la navegación visible del HQ.
- Reutilización del componente público `MenuDigital` mediante un modo de edición explícito.
- Controles contextuales para cambiar portada y logo, editar o eliminar categorías y editar, eliminar o agregar productos dentro de su categoría.
- Navegación móvil y escritorio dirigida al nuevo editor visual.
- Controles de edición excluidos de la vista pública mediante `editMode`.
- Entregas, Pagos, Pedidos y Mis clientes separados en pantallas independientes; el directorio completo permanece dentro de Mis clientes.
- `Más` retirado de los accesos principales y reemplazado por apps directas para Mis clientes y Redes.
- Previsualización social y Open Graph corregidos para utilizar foto de perfil y descripción del negocio.
- Textos visibles con la palabra `prueba` retirados de las interfaces.
- Apps `Platillos más pedidos` y `Colonias que más piden` agregadas después de Clientes, con rankings automáticos basados en pedidos no cancelados.
- Pies técnicos de versión, build, cliente, usuario y despliegue eliminados de las interfaces visibles de los dashboards.
- `Mis clientes` reconstruido desde el historial central de pedidos para que computadora y celular compartan la misma fuente de verdad.
- La descarga inicial reemplaza pedidos locales del restaurante por los registros de Supabase, incluso cuando la nube devuelve una lista vacía, evitando datos fantasma por dispositivo.
- Los cambios Realtime de pedidos regeneran la lista de clientes y notifican a la pantalla abierta sin exigir recargar manualmente.

### Archivos modificados

- `src/pages/ClientDashboard.jsx`
- `src/pages/StreetBossCentral.jsx`
- `src/pages/MenuDigital.jsx`
- `src/components/ProductoMenuCard.jsx`
- `src/components/menu/MenuHeroProfile.jsx`
- `src/components/crm/RestaurantInsightsTab.jsx`
- `src/components/crm/RestaurantCustomersTab.jsx`
- `src/services/crmV3Service.js`
- `ESTADO_ACTUAL.md`, `TAREAS.md`, `DECISIONES.md`, `RIESGOS.md`, `REGISTRO_CAMBIOS.md`

### Validación y comandos ejecutados

- `npm run build` — aprobado con 1,647 módulos transformados en la primera revisión y 1,647 módulos en la validación final del nuevo shell HQ.
- `git diff --check` — aprobado sin errores de espacios.
- `git status --short`, `git diff --stat` y revisión dirigida del diff.
- Verificación local de carga del Dashboard B2B y ausencia de errores de interfaz; el entorno local no contiene las variables de Supabase por la política de secretos del proyecto.
- El intento desde Codex se detuvo por `fetch failed`; el propietario completó después el despliegue desde su Terminal. Vercel confirmó `Ready` en 25 segundos y el alias `https://streetboss.com.mx`.
- Diagnóstico directo con viewport móvil en producción: consola confirmó errores `Supabase Resolve Business Exception` y `Supabase Sync Orders Exception`.
- Consultas B2B cambiadas al cliente Supabase contextualizado por slug del restaurante para respetar el aislamiento por negocio ya previsto en `getSupabaseClient`.
- Eliminada la referencia inválida `id.eq` de la resolución de `sb_businesses`; la búsqueda utiliza únicamente `slug` y `business_id`.
- Añadida resincronización al recibir `pageshow`, `focus`, `online`, regreso a visibilidad y cada 45 segundos mientras el panel permanece visible.
- `npm run build` aprobado con 1,647 módulos y `git diff --check` sin errores después de la corrección móvil.
- Intento de despliegue de esta segunda corrección desde Codex detenido por `fetch failed`; pendiente ejecutar el despliegue desde la Terminal local.
- El propietario desplegó la segunda corrección desde su Terminal; Vercel confirmó `Ready` en 28 segundos y `https://streetboss.com.mx`.
- La verificación móvil posterior mostró la advertencia `Multiple GoTrueClient instances detected`; `getSupabaseClient` ahora conserva y reutiliza una sola conexión por slug.
- Compilación aprobada nuevamente con 1,647 módulos después de estabilizar las conexiones Supabase.
- El propietario desplegó la estabilización final desde su Terminal; Vercel confirmó `Ready` en 26 segundos y el alias `https://streetboss.com.mx`.
- `npx vercel --prod --yes` — producción creada y aliased a `https://streetboss.com.mx`.
- Verificación posterior: landing y acceso HQ cargan sin errores de consola; el dominio sirve el nuevo bundle de producción.
- Segundo despliegue con rankings y limpieza de pies: el intento desde Codex se detuvo por `fetch failed`; posteriormente el propietario lo completó desde su Terminal local. Vercel confirmó `Ready` y el alias `https://streetboss.com.mx` el 2026-08-21.

### Alcance protegido

- No se modificaron autenticación, permisos, variables `.env`, pagos, Supabase, tablas, RLS ni migraciones.
- Se ejecutó despliegue a producción con autorización explícita del propietario. No se creó commit.

## 2026-08-17 — Sincronización Realtime, Corrección de Pruebas Clonadas y Accesibilidad iOS Dynamic Type

**Hora:** 12:00 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Implementación de suscripciones en tiempo real para pedidos, cargador asíncrono multi-dispositivo para nuevos restaurantes y selector interactivo de tipografía Dynamic Type.

### Cambios realizados

- **Suscripciones de Pedidos en Tiempo Real (`src/services/crmV3Service.js`):**
  - Conexión vía sockets al canal en vivo de Supabase para la tabla `sb_orders` en caliente.
  - Alerta sonora doble (timbre nativo en D5 y A5 usando la API Web Audio) y Toasts reactivos al recibir una comanda nueva.
- **Resolución Asíncrona de Negocios en Nube (`resolveBusinessBySlug` & `downloadMenuFromSupabase`):**
  - El frontend ahora busca restaurantes y menús en Supabase si no existen en el `localStorage` del cliente o comensal.
  - Sincroniza y guarda localmente la información general, categorías y productos clonados para permitir accesos B2B/B2C al instante de su creación.
- **Modulador de Accesibilidad iOS Dynamic Type:**
  - Selector interactivo `[A+] / [A++]` integrado en el Header del panel y Sidebar del Hub Central.
  - Se eliminó el escalado intrusivo y se refinaron los tamaños para equiparar a WhatsApp, Rappi y Uber Eats (botones e iconos nativos a 10px-11px, inputs a 16px exactos para evitar el zoom molesto en iOS Safari).
- **Flujo de Integración Continua Manual (`npx vercel --prod --yes`):**
  - Desplegada y aliaseada la última build estable del software en vivo en el dominio oficial `streetboss.com.mx`.

---

## 2026-08-06 — Implementación de Generador de Demos, Rediseño del Drawer y Despliegue en Vercel

**Hora:** 10:45 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Incorporación del motor `generatePersonalizedDemoForProspect`, rediseño del Drawer Comercial para teléfonos móviles y despliegue en Vercel.

### Cambios realizados

- **Generador de Demos Personalizadas (`src/services/crmV3Service.js`):**
  - Creada la función `generatePersonalizedDemoForProspect` que clona la plantilla según giro ajustando nombre del restaurante, logo, ciudad, dirección y teléfono para generar la demo `/demo/{slug}`.
- **Ruta Pública `/demo/:trialId` (`src/App.jsx`):**
  - Mapeada en React Router DOM apuntando a `DemoPublicMenuWrapper.jsx` para acceso directo desde los mensajes de WhatsApp.
- **Rediseño del Drawer Comercial (`src/components/crm/ProspectDetailModal.jsx`):**
  - Encabezado formateado con nombre en mayúsculas, estrellas ⭐⭐⭐⭐⭐, calificación Google, Giro y Ciudad.
  - Matriz táctil de botones gigantes: `📞 Llamar`, `💬 WhatsApp`, `📘 Facebook`, `📸 Instagram`, `🌎 Sitio Web`, `📍 Maps`, `💬 Messenger`.
  - Botón táctil destacado **`🎁 GENERAR DEMO`** en color `#FF4B00`.
  - Generador de mensaje IA automatizado con enlace directo `/demo/{slug}` y botón de copia rápida `📋 Copiar mensaje`.
- **Despliegue de Producción:**
  - Compilación e implementación en Vercel activa para pruebas reales en campo con prospectos.

---

## 2026-08-05 — Creación e Integración del Dashboard Móvil de Prospección Comercial

**Hora:** 07:37 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Implementación del Dashboard Móvil de Prospección Comercial conectado a los 1,901 restaurantes de `MASTER_RESTAURANTS.xlsx`.

### Cambios realizados

- **Script de Sincronización de Datos (`scripts/sync_master_prospects.py`):**
  - Parsea `data/MASTER_RESTAURANTS.xlsx` exportando `src/data/master_prospects.json` con los 1,901 restaurantes validados.
- **Componente Ficha del Negocio (`src/components/crm/ProspectDetailModal.jsx`):**
  - Vista en modal/drawer móvil con los 27 atributos, indicador de calidad, llamada telefónica directa, enlace directo a Facebook / Google Maps, asignación de demo oficial (10 demos), selector de Estado Comercial y generador dinámico de mensajes de WhatsApp.
- **Componente Dashboard Móvil (`src/components/crm/MobileProspectingDashboard.jsx`):**
  - Renderizado táctil responsivo, métricas en vivo (Total, Contactados, Demos Enviadas, Interesados, Cerrados), buscador instantáneo y filtros multidimensionales por Ciudad, Giro, Canales y Estado.
- **Integración CRM (`src/components/crm/ProspectosTab.jsx`):**
  - Establecido como modo predeterminado de prospección dentro de StreetBoss Central HQ.

---

## 2026-08-05 — Consolidación Final y Depuración de la Base Maestra Oficial

**Hora:** 02:56 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Consolidación final en `MASTER_RESTAURANTS.xlsx` único, depuración total de `/data` y eliminación de fuentes procesadas en `~/Downloads`.

### Cambios realizados

- **Base Maestra Definitiva:**
  - Consolidada en `/Users/danielvazquez/Proyectos/StreetBoss/data/MASTER_RESTAURANTS.xlsx` con **1,901 restaurantes/sucursales independientes** y 27 columnas.
- **Depuración Total de `/data`:**
  - Eliminados 10 archivos (CSV, JSON, auditorías, muestras y reportes). Dentro de `data/` únicamente resida `MASTER_RESTAURANTS.xlsx`.
- **Limpieza de Descargas (`~/Downloads`):**
  - Eliminados definitivamente los 22 archivos fuente confirmados.
- **Actualización del Sistema Futuro:**
  - Modificado `scripts/master_dataset_builder.py` para operabilidad incremental directa sobre `MASTER_RESTAURANTS.xlsx` y auto-eliminación de fuentes sin generar CSV, JSON ni basura residual.

---

## 2026-08-05 — Auditoría Exhaustiva de Calidad y Generación de Base Maestra Auditada

**Hora:** 02:42 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Auditoría integral, separación de sucursales independientes, matrices de trazabilidad y muestreo de control.

### Cambios realizados

- **Motor de Auditoría y Control de Calidad (`scripts/master_dataset_auditor.py`):**
  - Lectura exhaustiva de todas las pestañas de archivos `.xlsx` y `.xls` y encodings en CSVs (15,345 filas brutas).
  - Regla estricta de **Sucursales Independientes**: preservó 1,901 restaurantes/sucursales independientes basándose en diferencias de dirección, teléfono o redes sociales.
  - Auditoría de **Registros Descartados**: clasificados 9,790 descartes (incluyendo 9,593 filas del Catálogo de CP Correos de México y ventas inmobiliarias).
  - Matriz de deduplicación con 1,580 fusiones correctas confirmadas y 0 fusiones riesgosas por similitud de nombre únicamente.
- **Nuevos Archivos Generados (`data/`):**
  - `MASTER_RESTAURANTS_AUDITED.xlsx` (341 KB)
  - `MASTER_RESTAURANTS_AUDITED.csv` (1.55 MB)
  - `MASTER_RESTAURANTS_AUDITED.json` (2.59 MB)
  - `DEDUPLICATION_AUDIT.xlsx` (127 KB)
  - `RESTAURANTS_REJECTED_AUDIT.xlsx` (191 KB)
  - `QUALITY_CONTROL_SAMPLE.xlsx` (33 KB, 4 pestañas: Aleatorios, Mayor Fusiones, Menor Confianza, Descartados)
  - `MASTER_RESTAURANTS_AUDITED_REPORT.md`
- **Archivos Originales Preservados:**
  - `MASTER_RESTAURANTS.xlsx`, `MASTER_RESTAURANTS.csv` y `MASTER_RESTAURANTS.json` permanecen 100% intactos.

---

## 2026-08-05 — Construcción de la Base Maestra Oficial de Restaurantes StreetBoss

**Hora:** 02:27 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Creación y ejecución de `master_dataset_builder.py` para consolidad datasets de `~/Downloads`.

### Cambios realizados

- **Motor de Ingestión y Normalización (`scripts/master_dataset_builder.py`):**
  - Escaneo automático de 22 archivos Excel y CSV en `~/Downloads`.
  - Ingestión de 5,753 registros brutos.
  - Filtro estricto de no-alimentos (descartados 198 registros).
  - Normalización canónica de URLs de Facebook, Instagram y WhatsApp (1,157 URLs limpias).
  - Deduplicación inteligente y consolidación incremental obteniendo **1,190 restaurantes únicos**.
  - Clasificación en categorías/subcategorías y cálculo de **Score Comercial (0-100)**.
- **Archivos Maestros Generados (`data/`):**
  - `data/MASTER_RESTAURANTS.xlsx`
  - `data/MASTER_RESTAURANTS.csv`
  - `data/MASTER_RESTAURANTS.json`
  - `data/MASTER_RESTAURANTS_REPORT.md`
- **Documentación:**
  - `docs/README_DATASET_BUILDER.md`

---

## 2026-07-22 — Consolidación de Identidad y Activos de Marca

**Hora:** 09:25 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Copia, auditoría y validación de `brand-core` y `brand-assets`.

### Cambios realizados

- **Copia Segura:** Se copiaron las carpetas `brand-core` (9 archivos, 8.5 KB) y `brand-assets` (161 archivos, 42.8 MB) como carpetas hermanas en la raíz del proyecto oficial.
- **Validación de Integridad:** Se verificó el conteo y coincidencia del 100% de hashes SHA-256 de todos los archivos copiados.
- **Auditoría de Referencias:** Se revisaron las rutas relativas en archivos de marca y se comprobó que no hay referencias absolutas a la cuarentena.
- **Auditoría de Contenido (90 Días):** Se verificó la existencia y clasificación de 51 posts, 39 reels, plantillas de diseño y otros entregables.
- **Auditoría de Brand Core:** Se catalogaron logotipos maestros en SVG y guías de marca.

---

## 2026-07-21 — Rescate de Recursos Únicos y Retiro a Cuarentena


**Hora:** 11:28 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Rescate de recursos únicos y aislamiento de duplicados en cuarentena.

### Cambios realizados

- **Rescate de Documentación & Prompts:** Se copiaron Master Book, Roadmap, Product docs y Prompts maestros desde `streetboss-studio` a `docs/producto/` y `prompts/compartidos/`.
- **Rescate de Módulos & Código:** Se copiaron los módulos Virtual Tour 360° y Digital Menu Futures desde `~/streetboss` a `src/modules/`.
- **Rescate de Scripts:** Se copiaron 11 scripts JS de utilidad desde `streetboss-web` a `scripts/`.
- **Rescate de Investigación:** Se copió el estudio de mercado Chiapas a `docs/research/mercado-chiapas/`.
- **Rescate de Assets:** Se copiaron 29 capturas PNG de interfaz a `assets/imagenes/desktop-screenshots/`.
- **Aislamiento en Cuarentena:** Se movieron las 6 carpetas secundarias a `/Users/danielvazquez/Proyectos/_CUARENTENA_STREETBOSS/2026-07-21_1127/`.
- **Documentación de Cuarentena:** Se crearon `INVENTARIO.md`, `MAPA_DUPLICADOS.md`, `ARCHIVOS_UNICOS.md` y `PLAN_ELIMINACION.md` en la carpeta de cuarentena.
- **Validación Final de Compilación:** Compilación `npm run build` ejecutada con éxito (8.81s).

### Lo que NO se hizo

- No se eliminó permanentemente ninguna carpeta ni archivo (`rm -rf` no utilizado).
- No se realizaron commits (`git commit`) ni empujes (`git push`).
- No se modificó Supabase, Vercel ni producción.

---
# 2026-08-21 — Persistencia operacional multidispositivo

## 2026-08-25 — Biblioteca global de tutoriales

- Se incorporaron `01.MOV` a `07.MOV` una sola vez en `public/tutoriales/` y se verificaron sus huellas contra los archivos fuente.
- Se creó configuración central, biblioteca privada responsive y siete vistas públicas compartibles.
- No existen controles de subir, editar, eliminar, reemplazar o descargar desde la interfaz.
- Validación local móvil/escritorio y build aprobados; no hubo despliegue.
- Conversión posterior autorizada: los siete medios globales quedaron en MP4 H.264/AVC + AAC, resolución 592 × 1280; se retiraron las copias `.MOV` del proyecto y se mantuvieron los originales entregados en Descargas.
- Despliegue de producción autorizado y completado en Vercel (`dpl_AapTHRpR8EPeM4LzXcLwhxACxwEj`) con alias `https://streetboss.com.mx`.
- Verificación externa aprobada: `/tutoriales/01` a `/tutoriales/07` respondieron `200`; los siete MP4 respondieron `206 video/mp4` a solicitudes por rango.

## 2026-08-24 — Guardado de producto agotado

- Se corrigió el error `400` causado por campos auxiliares del editor visual enviados a `sb_menu_products`.
- El payload del producto contiene únicamente columnas reales y el frontend requiere confirmación del registro actualizado.
- La descarga cloud conserva los estados agotado y oculto.
- Build aprobado y producción publicada en `dpl_9PDirApT67uj8NzioncUQYXNsug5`.

## 2026-08-24 — Edición segura de categorías

- Crear y renombrar categorías envía únicamente columnas reales a Supabase.
- La interfaz ya no muestra éxito antes de recibir confirmación central y restaura el estado anterior si falla.
- Se auditó la misma confirmación en producto agotado y producto visible/oculto.
- Build y `git diff --check` aprobados; producción publicada en `dpl_7CmhMEaSqm9RqqFAFXQ2r4aPs142`.

## 2026-08-24 — Segundo conflicto de slug al crear negocios

- La disponibilidad de la URL se comprueba ahora contra la tabla principal y el directorio central.
- Se retiraron del directorio únicamente los residuos `cafecito-2` y `cafecito-3` generados por las pruebas técnicas previas.
- `npm run build` aprobado y producción publicada con alias `https://streetboss.com.mx`.

## 2026-08-22 — Contactos públicos aislados por negocio

- Se retiró el número predeterminado de StreetBoss de los menús de clientes.
- WhatsApp, llamada y destino del pedido toman únicamente el contacto del negocio correspondiente.
- Cuando falta el contacto, el menú evita abrir un número ajeno y avisa que el negocio debe configurarlo.
- `npm run build` y `git diff --check` aprobados; producción publicada y alias oficial confirmado.

## 2026-08-22 — Borrado central de clientes B2C

- Se añadió el botón de eliminar a cada tarjeta de cliente para móvil y escritorio.
- La eliminación limpia los datos personales en Supabase y evita que la sincronización los reconstruya desde otro navegador.
- Compilación y revisión de diferencias aprobadas; publicación de producción confirmada.

## 2026-08-22 — Corrección definitiva de altas entre dispositivos

- Se creó y activó `sb_business_directory` con RLS de lectura pública limitada a datos no sensibles de negocios activos.
- La lista de clientes HQ consulta ese directorio y recupera cada negocio y menú desde la nube.
- El formulario espera la persistencia completa, reintenta y no entrega credenciales de una creación incompleta.
- `npm run build` y `git diff --check`: aprobados.
- Se eliminó la aceptación de negocios fantasma guardados sólo en un navegador y se publicó la corrección en `streetboss.com.mx`.
- Se sustituyó la depuración por recuperación automática de altas históricas locales. Tres negocios del escritorio fueron migrados y comprobados directamente en Supabase.
- Se corrigieron las tarifas de entrega: soporte real de cero, edición individual por colonia, aislamiento por negocio y persistencia cloud de cambios masivos. Desplegado en producción.

- Se agregó `supabase/migrations/20260821_operational_persistence.sql` para negocios, categorías, productos, zonas, pedidos y clientes B2C.
- Los IDs de categorías, productos y zonas se alinearon con los IDs de texto usados por el frontend.
- Las operaciones de menú y zonas ahora replican sus cambios a Supabase; la creación de un cliente sube también el menú clonado.
- La descarga cloud incluye las zonas de entrega.
- Validación: `npm run build` y `git diff --check` aprobados.
- Migración ejecutada y verificada directamente: existen las seis tablas nuevas con RLS activo y cero filas iniciales.
- Frontend desplegado en producción; Vercel confirmó `READY` y alias oficial. Pendiente comprobar una alta real en dos dispositivos.
# 2026-08-25 — Precio promocional unificado

- Se actualizó la portada para mostrar $99 MXN al mes durante los primeros 3 meses y $150 MXN al mes posteriormente.
- Se alinearon la página pública de demos y el mensaje inicial de prospección con la misma condición comercial.
- Se retiraron las mensualidades posteriores contradictorias de $249 y $299 en las superficies actualizadas.

# 2026-08-26 — Landing alineada con el producto actual

- Se reforzó el hero con precio, ausencia de comisiones, CTA comercial y acceso a demos.
- Se conservó el reel de StreetBoss sin cambiar sus archivos ni su reproducción.
- Se añadió una sección dedicada al Dashboard y se actualizaron funciones, precios, calculadora y preguntas frecuentes con capacidades verificadas.
- Se mejoraron título, descripción social y URL canónica para buscadores.
- `npm run build`: aprobado. `npm run lint`: no disponible en el proyecto.
- El primer intento fue rechazado por una sesión no autorizada; al restaurarse la sesión se publicó correctamente el 2026-08-27 en `dpl_95tMycRMDSKzqD57ePcLTyVoCgHn`.
- Verificación externa: portada `200`, título SEO actualizado, textos comerciales presentes en el bundle y video principal `200 video/mp4` con soporte de rangos.
- El 2026-08-27 se aumentó la legibilidad de textos secundarios, tarjetas, precios, demos, FAQ, botones y pie de página para usuarios móviles, manteniendo intactos video, estructura y títulos principales. Build y producción aprobados en `dpl_7EBbPJS9T2pAnx5jDD7GqsiV5LUh`.
# 2026-10-09 — Menú La Vitola preparado para producción

- Se añadió La Vitola como cliente real basado en Burger House, fuera del catálogo público de demos.
- Se cargaron productos y precios legibles de las fotografías entregadas.
- Se añadieron 10 fotografías gastronómicas generadas específicamente para el catálogo.
- Se configuraron nombre, dirección, WhatsApp, logo optimizado y entrega escalable por código postal.
- Se activó para La Vitola la fórmula de reparto `$20 + $10 por cada kilómetro completo o fracción`, comenzando en Terán C.P. 29050.
- Se retiró el botón comercial `Quiero este menú` de la experiencia de La Vitola.
- Se reforzó la exclusión del botón por ruta para impedir que cachés locales antiguas vuelvan a marcar `/menu/la-vitola` como demo. Producción: `dpl_CfiF4wsANF8vT3S4638EWzrZu1F7`.
- Validación: `npm run build`, verificación de activos, respuesta HTTP `200` en la ruta local y `git diff --check`.
- Publicado en producción con alias oficial `https://streetboss.com.mx/menu/la-vitola` y verificado con respuesta `200`.
- Se fijó el contacto oficial de La Vitola en la ruta pública para impedir que registros locales antiguos sustituyan el número: llamadas `9613209433` y WhatsApp `529613209433`. Producción: `dpl_6tT3KciEjvVPyPKqW7TgnoMa9wq2`.
- Se corrigió el cierre de pedidos en Safari móvil: WhatsApp se abre durante la acción del usuario y una falla del registro central ya no bloquea la venta. Producción: `dpl_UHSYocae6xDBguh8AXtpJM4D4Ur1`.
- La Vitola se incorporó al directorio administrable de `Clientes`, conservando su menú, datos de contacto y zona para habilitar generación de contraseña, edición y acceso por `/panel/la-vitola`. Producción: `dpl_7PmK579zurzqRNXd4qjD28bwyPuN`.

## 2026-10-30 — Oferta anual y configuración móvil del restaurante

- Oferta confirmada por el propietario: $499 MXN por los primeros 12 meses. Desde el segundo año: $99 MXN/mes o $990 MXN por 12 meses. El anual equivale a 10 mensualidades; ahorro de $198 frente a 12 pagos. No se supone renovación automática.
- Portada, demos, preguntas frecuentes, metadatos y mensaje inicial de prospección actualizados. `public/landing.html` conserva su URL y redirige a la portada vigente. El prototipo `streetboss-web` también comunica las mismas condiciones.
- Inicio del panel sustituido por perfil visual con portada/logo, guía de tres secciones, progreso basado en datos guardados, edición de perfil en línea y accesos a la operación cotidiana. Navegación inferior disponible en móvil y escritorio.
- El perfil espera confirmación central para mostrar éxito; conserva el formulario si falla, revierte la copia local fallida y evita sobrescribir lo escrito durante la sincronización de fondo.
- Instalación PWA ofrecida sólo dentro del panel autenticado de un negocio no demo, activo y no eliminado. Manifest por slug, apertura directa al panel e instrucciones para Safari y navegadores sin diálogo nativo.
- Service worker limitado al panel y sin caché de datos ni sesiones; pantalla de recuperación cuando no hay internet. Los menús del comensal y demos no incorporan manifest ni aviso de instalación.
- No se cambiaron autenticación, reglas de permisos, cobros, tablas, migraciones, secretos ni producción.
- Validación: build Vite aprobado; TypeScript del prototipo Next aprobado; manifest válido reconocido por el navegador sin errores; tres slugs válidos y cinco entradas inválidas comprobadas; iconos 192/512; cabecera del worker correcta. Navegador: 390 px y 1280 px sin desbordamiento, navegación funcional, formulario conservado y error correcto al simular desconexión, sin falso éxito. Demos y menú público sin instalación.
- Pruebas UI con restaurante ficticio local y tráfico a Supabase bloqueado; datos ficticios y registro del worker de prueba retirados al terminar. No se escribieron datos reales.
- Evidencia: `docs/evidence/2026-10-30/`. Pendiente: autorización de publicación y prueba física de instalación/reapertura en iPhone y Android. El estado activo existente determina la oferta de instalación; no se añadió validación de pagos ni una barrera nueva de autenticación.

Archivos principales: `src/pages/Landing.jsx`, `src/pages/Demos.jsx`, `src/pages/ClientDashboard.jsx`, `src/components/RestaurantSetupHome.jsx`, `src/components/RestaurantAppInstall.jsx`, `src/components/landing/LandingPrecios.jsx`, `LandingFAQ.jsx`, `LandingDashboard.jsx`, `LandingCalculadora.jsx`, `src/components/crm/ProspectDetailModal.jsx`, `index.html`, `public/landing.html`, `public/panel-sw.js`, `public/brand/SB_APP_192.png`, `api/panel-manifest.js`, `vite.config.js`, `vercel.json`; copia de la oferta y calculadora en cinco componentes/metadatos de `streetboss-web`; documentación de estado, reglas, decisiones, tareas y arquitectura.

Comprobaciones ejecutadas: `npm run build`; `npx tsc --noEmit` en `streetboss-web`; `git diff --check`; pruebas del handler con `node --input-type=module`; consultas HTTP locales de portada, manifest y worker; revisión de dimensiones de iconos con sharp; pruebas UI por CUA/CDP con datos ficticios locales y sin escritura central.

## 2026-10-30 — Oferta y dashboard publicados con autorización

- Producción activa: https://streetboss.com.mx ; despliegue `dpl_BhyEWcPfZadrkaPmLyp9NdTZwE5r`, estado READY. Proyecto `streetboss`, equipo `team_PBfbKSb1dmLzgGk9udBa3gVG`.
- Se publicó la copia local revisada (base Git `17c4609` más los cambios locales, sin crear commit), con el precio $499 MXN el primer año y renovación de $99/mes o $990/año, el inicio guiado del panel y la instalación PWA del restaurante.
- Compilación local y remota aprobadas; producción verificada mediante HTTP y navegador: nueva oferta visible, bundle nuevo del panel, manifest por restaurante, worker correcto, no-store en panel y worker, noindex en panel, rechazo de slug inválido y menú de La Vitola 200. Consola de la landing sin errores de ejecución.
- Se corrigió `vercel.json` para aplicar cabeceras como rutas con `continue: true`; la mezcla anterior de `headers` y `routes` no aplicaba las cabeceras esperadas. Se preservó el enrutamiento de menús y los bloqueos históricos.
- `.vercelignore` limita la subida a la aplicación Vite, activos públicos y funciones; excluye documentación, prototipo Next, archivos de entorno y directorios que no necesita este despliegue.
- Escaneo de logs: una advertencia de obsolescencia `DEP0169 url.parse()` del entorno Node/Vercel en una llamada 200 al manifest; sin fallo funcional detectado en estas comprobaciones.
- No se modificaron base de datos, migraciones, autenticación, cobros ni credenciales de la aplicación. Instalación/reapertura en teléfonos físicos aún pendiente.
- La sección pública de recetas se pospone hasta recibir el ZIP de documentación y contenido que generará GPT. No se publicó una sección vacía.
- Se conserva el enfoque actual en Chiapas. Para futuras altas fuera del estado, el criterio acordado es cargar sólo las colonias de reparto necesarias para cada restaurante.
- Evidencia: `docs/evidence/2026-10-30/production-offer.png` y `production-checks.json`.

Comandos: `vercel project inspect --non-interactive`, `vercel env ls production` (sólo nombres, sin valores), `npm run build`, `vercel deploy --prod --skip-domain --yes --scope ...`, `vercel curl` de la versión preparada, promoción mediante el conector Vercel y verificaciones HTTP/CUA del dominio público. Archivos añadidos/modificados en esta publicación: `.vercelignore`, `vercel.json`, `ESTADO_ACTUAL.md`, `REGISTRO_CAMBIOS.md`, `TAREAS.md` y evidencia. Los cambios de producto fueron los preparados y documentados previamente.

## 2026-10-30 — Landing horizontal publicada

- Publicada por instrucción explícita del propietario y confirmada en https://streetboss.com.mx ; despliegue `dpl_2RjucwysR6u4KwNyTCrYCUBDeQfU`.
- Ocho escenas horizontales: inicio, experiencia, solución, panel, calculadora, precios, demos y preguntas frecuentes.
- Iconos discretos arriba a la derecha, nombres accesibles, señal de sección activa, enlaces por hash y accesos directos a precios/demos. Rueda abajo avanza a la derecha; rueda arriba regresa a la izquierda. Teclas izquierda/derecha, PageUp/PageDown, Home/End disponibles sin interceptar campos ni sliders.
- El cuerpo no se desplaza verticalmente. En viewport de 390 × 844 las ocho escenas caben sin overflow vertical; en pantallas más cortas o respuestas ampliadas se mantiene scroll interno para permitir leer todo. Beneficios, herramientas, demos y FAQ disponen de galerías laterales en móvil.
- Se conserva el contenido comercial y la oferta. El video se pausa al salir de su escena. Estilos y captura de navegación limitados a la landing; al abrir `/demos` se restaura el scroll normal de la página.
- Validado: build local y remoto; UI en 1280 × 720 y 390 × 844; rueda en ambas direcciones con `scrollY=0`; iconos precios/demos; edición de rango sin cambiar de escena; movimiento reducido; hash directo y salida a catálogo. Producción comprobada: ocho iconos y ocho paneles, precios/demos correctos, consola sin errores de ejecución observados.
- Límite: el navegador de pruebas no admite envío de eventos táctiles; se verificó el diseño móvil y se revisaron los controladores de gestos, sin declarar una prueba física de swipe en iOS/Android.
- Archivos: `src/pages/Landing.jsx`, `src/pages/LandingHorizontal.css`, `src/hooks/useHorizontalLanding.js`, `src/components/landing/LandingDemosCTA.jsx`, `LandingFAQ.jsx`, `LandingSolucion.jsx`, `LandingDashboard.jsx`, `LandingReelContainer.jsx`.
- Evidencia: `docs/evidence/2026-10-30/horizontal-mobile.png` y `horizontal-production.png`.

Comprobaciones y publicación: `npm run build`, `git diff --check`, `vercel project inspect --non-interactive`, `vercel deploy --prod --skip-domain --yes --scope ...`, verificación con `vercel curl`, promoción mediante Vercel MCP y prueba del dominio público con CUA. No se modificaron datos de clientes ni configuración de autenticación, pagos o base de datos.

## 2026-10-30 — Contenido vertical dentro de la navegación lateral

- Corrección solicitada por el propietario publicada en https://streetboss.com.mx ; despliegue `dpl_3aQ1GReeebU8e8jRJ43UE6Jej3C2`.
- El desplazamiento lateral queda exclusivamente para navegar entre secciones: gesto horizontal de trackpad, Shift + rueda, flechas izquierda/derecha e iconos. El scroll vertical lee el contenido y no cambia de slide, incluso al alcanzar sus límites. Swipe táctil se mantiene nativo sin interceptar movimientos verticales ni zoom.
- Se retiraron de la landing las galerías internas y los estilos que compactaban el contenido. Beneficios, herramientas, comparaciones, precios, demos y preguntas siguen una sola columna vertical con espacio natural; secciones largas conservan su altura completa dentro de su panel desplazable.
- El video vuelve a mostrarse bajo el encabezado, centrado y separado de los beneficios. Marco limitado a 78dvh y al ancho disponible: 342 × 608 px en la prueba de 390 × 844; video interior 318 × 584 px.
- Validaciones: build local y remoto aprobados, `git diff --check`, lectura vertical real con rueda sin cambio de slide, lectura hasta el final y rueda adicional sin navegación involuntaria, navegación horizontal en ambos sentidos y conservación de posición al volver. Columnas únicas y ausencia de overflow horizontal interno comprobadas en móvil y escritorio.
- Producción comprobada en navegador: flujo en columna, sin galerías horizontales internas, marco de video menor al viewport y lectura vertical en la misma sección. Evidencia: `docs/evidence/2026-10-30/vertical-video-production.png`.
- Archivos: `src/pages/Landing.jsx`, `src/pages/LandingHorizontal.css`, `src/hooks/useHorizontalLanding.js`, `src/components/landing/LandingReelContainer.jsx`.
- No se cambiaron precios, contenido comercial, datos de clientes, autenticación ni base de datos. La prueba física de swipe en teléfonos sigue pendiente; no se declara como realizada.

Comandos: `npm run build`, `git diff --check`, `vercel project inspect --non-interactive`, `vercel deploy --prod --skip-domain --yes --scope ...`, `vercel curl` de la versión preparada, promoción mediante Vercel MCP y comprobación visual/gestos de rueda por CUA.

## 2026-10-30 — Continuidad vertical y navegación circular publicadas

- Producción: https://streetboss.com.mx ; despliegue `dpl_D2zvsKewoiDvyEWFwBuTnnAkXuHj`, compilación remota aprobada.
- Dentro de cada sección, el scroll vertical sigue leyendo el contenido completo. Al llegar al final y continuar bajando, avanza al siguiente slide. Al llegar arriba y continuar subiendo, regresa al anterior y entra por el final de su contenido.
- El último slide vuelve al inicio y el primero permite regresar al último. Flechas inferiores y teclas laterales también recorren el círculo, sin botones deshabilitados en los extremos.
- El cierre del círculo usa una transición breve de opacidad y un salto directo al destino, evitando recorrer visualmente todas las secciones en sentido contrario. Se respeta movimiento reducido.
- Protección de inercia: una misma secuencia de rueda no debe encadenar varios saltos. Los controles editables, zoom y lectura dentro de los paneles conservan su interacción.
- Se conservan los gestos táctiles nativos entre slides, con control adicional de continuidad vertical en bordes y cierre circular táctil en los extremos; la prueba física en teléfono sigue pendiente.
- Validado: `npm run build`, `git diff --check`, lectura vertical intermedia sin navegar, scroll adicional al final de Experiencia → Solución (entrada arriba), final de FAQ → Inicio (posición 0), inicio → FAQ (entrada al final), flecha siguiente en el último slide y flechas habilitadas. Producción: HTTP 200 con bundle `index-DrY9xWf1.js`, y ciclo real FAQ → Inicio mediante scroll, icono Inicio activo y consola sin errores de ejecución observados.
- Archivos de producto: `src/hooks/useHorizontalLanding.js`, `src/pages/Landing.jsx`. Evidencia: `docs/evidence/2026-10-30/circular-production.png`.
- No se modificaron precios, diseño vertical de las secciones, datos, autenticación, pagos ni base de datos.

Publicación: inspección del proyecto Vercel, `vercel deploy --prod --skip-domain --yes --scope ...`, comprobación de la versión preparada con `vercel curl`, promoción mediante Vercel MCP y verificación del dominio público con CUA/HTTP.
