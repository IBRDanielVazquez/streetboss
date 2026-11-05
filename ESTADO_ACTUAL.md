# ESTADO ACTUAL — STREETBOSS

> Última actualización: 2026-10-30
> Actualizado por: Codex

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

## 2026-10-30 — Contenido vertical dentro de la navegación lateral

- Corrección solicitada por el propietario publicada en https://streetboss.com.mx ; despliegue `dpl_3aQ1GReeebU8e8jRJ43UE6Jej3C2`.
- El desplazamiento lateral queda exclusivamente para navegar entre secciones: gesto horizontal de trackpad, Shift + rueda, flechas izquierda/derecha e iconos. El scroll vertical lee el contenido y no cambia de slide, incluso al alcanzar sus límites. Swipe táctil se mantiene nativo sin interceptar movimientos verticales ni zoom.
- Se retiraron de la landing las galerías internas y los estilos que compactaban el contenido. Beneficios, herramientas, comparaciones, precios, demos y preguntas siguen una sola columna vertical con espacio natural; secciones largas conservan su altura completa dentro de su panel desplazable.
- El video vuelve a mostrarse bajo el encabezado, centrado y separado de los beneficios. Marco limitado a 78dvh y al ancho disponible: 342 × 608 px en la prueba de 390 × 844; video interior 318 × 584 px.
- Validaciones: build local y remoto aprobados, `git diff --check`, lectura vertical real con rueda sin cambio de slide, lectura hasta el final y rueda adicional sin navegación involuntaria, navegación horizontal en ambos sentidos y conservación de posición al volver. Columnas únicas y ausencia de overflow horizontal interno comprobadas en móvil y escritorio.
- Producción comprobada en navegador: flujo en columna, sin galerías horizontales internas, marco de video menor al viewport y lectura vertical en la misma sección. Evidencia: `docs/evidence/2026-10-30/vertical-video-production.png`.
- Archivos: `src/pages/Landing.jsx`, `src/pages/LandingHorizontal.css`, `src/hooks/useHorizontalLanding.js`, `src/components/landing/LandingReelContainer.jsx`.
- No se cambiaron precios, contenido comercial, datos de clientes, autenticación ni base de datos. La prueba física de swipe en teléfonos sigue pendiente; no se declara como realizada.

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

## 2026-10-09 — Menú real de La Vitola preparado

- Se duplicó la plantilla existente de Burger House como `la-vitola` sin crear una aplicación independiente.
- El catálogo local contiene 4 hamburguesas, 2 hot dogs y 10 bebidas con los precios legibles del menú físico.
- Se generaron e integraron fotografías nuevas y realistas para los platillos y bebidas.
- La dirección quedó configurada como Calle Central Norte #46, Col. Terán, Tuxtla Gutiérrez, Chiapas, C.P. 29050 y el WhatsApp como 961 320 9433.
- El logo oficial entregado fue limpiado y optimizado para perfil móvil; el menú quedó marcado como cliente real y sin la llamada comercial `Quiero este menú`.
- La entrega conserva tarifas escalables por código postal y colonia mediante zonas independientes.
- La Vitola inicia en $20 MXN dentro de su zona base; cada kilómetro completo o fracción agrega $10 MXN mediante `base + ceil(km) × 10`.
- El sistema existente de checkout, carrito, WhatsApp y cobertura por código postal permanece reutilizado.
- Producción activa en `https://streetboss.com.mx/menu/la-vitola`; respuesta `200`, título social y recursos visuales verificados.
- Pendiente operativo: agregar códigos postales de cobertura con su distancia real, además del horario y el precio no visible del Hot Dog Relleno.

## 2026-08-25 — Precio promocional unificado

- La portada, la página de demos y el primer mensaje comercial comunican $99 MXN al mes durante los primeros 3 meses y $150 MXN al mes a partir del cuarto mes.
- Se eliminaron de esas superficies las condiciones contradictorias de un solo mes promocional y mensualidades posteriores de $249 o $299.
- Cambio implementado localmente; pendiente de autorización para desplegarlo en producción.

## 2026-08-25 — Prospectos sin WhatsApp

- El mensaje comercial inicial presenta antes del primer enlace el gancho `desde $99 al mes, sin comisiones por venta` y refuerza el control directo de ventas y clientes.
- La parte superior de la ficha muestra clasificación rápida: `Contactado`, `No contesta`, `Interesado`, `Demo creado`, `Es cliente` y `No le interesó`.
- Cada selección se guarda inmediatamente en el seguimiento central; `No tiene WhatsApp` permanece como marca adicional compatible con cualquier clasificación.
- La ficha permite marcar `Perfil personal` sin cambiar la clasificación ni el teléfono empresarial; la lista muestra la etiqueta `PERFIL PERSONAL` para advertir que el perfil social puede estar desactualizado.
- HQ incorpora filtros independientes para `No contestan` y `Demo creado`; los registros históricos `PRODUCCION` se agrupan en `Demo creado` sin perderse.
- La ficha comercial de cada prospecto incorpora la casilla `No tiene WhatsApp`.
- Al marcarla, se ocultan las acciones de WhatsApp sin borrar el teléfono ni impedir llamadas; la lista identifica el registro como `SIN WA`.
- El filtro `WhatsApp` excluye los prospectos marcados y la selección persiste en el mismo almacenamiento comercial existente.
- Los estados comerciales dejaron de depender únicamente del navegador: se sincronizan con `sb_hq_prospect_states`, recuperan la versión más reciente al abrir o retomar HQ y migran a nube los cambios locales anteriores.
- Build, escritura/lectura central y bundle de producción verificados. Despliegue activo: `dpl_9GMo9moZ1YmoP5NvhJQZgJvb1wST`.

## 2026-08-25 — Tutoriales globales publicados

- El Dashboard incorpora una app global `Tutoriales` dentro de `Mi StreetBoss`, común a todos los restaurantes actuales y futuros.
- Existe una sola definición central con siete tutoriales y una sola copia física de cada video en `public/tutoriales/`.
- Se añadieron páginas públicas estables `/tutoriales/01` a `/tutoriales/07`, sin dependencia de restaurante, tenant o slug.
- Los reproductores son bajo demanda, sin autoplay, con `preload="metadata"`, controles nativos y sin acción explícita de descarga o administración.
- Los originales QuickTime HEVC se convirtieron con autorización a MP4 H.264/AVC + AAC de 592 × 1280, compatibles con Safari/iPhone, Chrome Android y escritorio. Los `.MOV` dejaron de formar parte de la biblioteca publicada.
- Build aprobado y producción publicada en Vercel (`dpl_AapTHRpR8EPeM4LzXcLwhxACxwEj`) con alias `https://streetboss.com.mx`. Las siete páginas respondieron `200` y los siete videos aceptaron carga parcial `206 video/mp4`.

## 2026-08-24 — Alta de negocios corregida entre móvil y escritorio

- La causa era un conflicto `409`: el slug ya existía en Supabase porque había sido creado o eliminado desde otro dispositivo, aunque no aparecía en la copia local del escritorio.
- Antes de crear, StreetBoss consulta ahora la nube y asigna automáticamente el siguiente slug libre (`nombre-2`, `nombre-3`, etc.).
- Si la dirección cambia, el resultado informa claramente cuál slug estaba reservado y cuál fue asignado.
- Validación real aprobada: escritorio creó temporalmente `cafecito-2` y viewport móvil creó `cafecito-3`, ambos con 3 categorías y 10 productos.
- Los dos negocios temporales y sus catálogos fueron eliminados al terminar; La Chiapaneca y el Cafecito histórico no se modificaron.
- Despliegue activo: `dpl_2kLT2RNRxrmPWxT8nj7QphYeXeey`.

## 2026-08-24 — Analítica privada de menús activa en HQ

- La Central HQ incorpora la app `Analítica` con periodos de 7, 30 y 90 días.
- Muestra visitas, visitantes aproximados, interacciones, pedidos, conversión y origen principal por negocio.
- Los menús registran en segundo plano visitas y acciones clave; un fallo analítico no bloquea catálogo, carrito, WhatsApp ni pedidos.
- No se guardan nombres, teléfonos, direcciones, IP ni ubicación exacta.
- Supabase contiene `sb_menu_analytics_events` con RLS, dos políticas y cuatro índices verificados.
- Prueba real aprobada con La Chiapaneca: la visita apareció en Supabase y el evento de validación fue retirado después.
- Despliegue activo: `dpl_Vtje5pUVn54EMs3ae7r7WtKv5BqF`.

## 2026-08-24 — Borrado de pedidos de prueba habilitado en HQ

- En `HQ → Pedidos`, el detalle de cada pedido incorpora `Eliminar pedido` con confirmación escrita `ELIMINAR`.
- El pedido se retira del historial, métricas y rankings únicamente después de que Supabase confirma el borrado.
- Al borrar una cuenta de cliente B2B aparece una casilla independiente para eliminar también todos los pedidos de ese negocio.
- Los eventos de borrado en tiempo real retiran el pedido de otras sesiones abiertas.
- No se eliminó ningún pedido real durante la verificación.
- Despliegue activo: `dpl_HEpjqjVogz7j9cH2U7WgsGkPuvgK`.

## 2026-08-24 — Borrado de clientes habilitado en HQ

- La app `Clientes` de la Central HQ muestra la acción roja `Borrar cuenta` en la parte superior de cada ficha y conserva un segundo acceso al final de la ficha.
- El borrado exige escribir `ELIMINAR` y permite decidir por separado si también deben eliminarse los consumidores asociados al negocio.
- La operación espera confirmación central antes de retirar al cliente de la lista, evitando que reaparezca tras recargar.
- La verificación no eliminó ningún cliente real.
- Despliegue activo: `dpl_2Hb2esQ9mW6frKKY6VABhv1td9Dn`.

## 2026-08-24 — Envío WhatsApp y mínimo de tarjeta corregidos

- El resumen de WhatsApp muestra el costo de envío con un solo signo `$`.
- La compra mínima con tarjeta se muestra en el checkout, indica el faltante y deshabilita tarjeta cuando el total no alcanza el mínimo.
- La confirmación vuelve a validar la regla para impedir evasiones del bloqueo visual.
- El guardado de formas de pago espera una única confirmación central antes de recargar datos.
- Verificación real en Cafecito: mínimo $500, pedido $40, faltante $460 y tarjeta deshabilitada.
- Despliegue activo: `dpl_HmHa3HEPzfApfp6u3zAQa6iy8BsP`.

## 2026-08-24 — Acceso a paneles restaurado

- Se corrigió una violación de las reglas de hooks de React introducida por el cálculo de sugerencias de colonias después de la pantalla de autenticación.
- El cálculo conserva la misma funcionalidad sin agregar hooks condicionales.
- Verificación completa en producción: inicio de sesión demo, carga del dashboard, menú de aplicaciones y consola sin errores.
- Despliegue activo: `dpl_6XtNuwptNa7HFvuHVFgWzhrerQF1`.

## 2026-08-24 — Persistencia global de menú, pagos y reparto corregida

- Los cambios de producto agotado/visible y de zonas esperan confirmación de Supabase; si fallan, la interfaz revierte el cambio y muestra error.
- La descarga del negocio conserva `payment_methods`, `free_delivery` y `use_general_fee`; ya no reconstruye pagos activos al recargar.
- Formas de pago y colonias de reparto aparecen como aplicaciones separadas en el dashboard.
- Las colonias sugeridas se obtienen del código postal o colonia/dirección registrada del negocio.
- El checkout bloquea pedidos cuando el restaurante no tiene ningún método de pago activo.
- Cafecito quedó limpio en producción: cero pedidos, cero clientes, cero zonas y todos los métodos de pago desactivados.
- Producción desplegada en Vercel: `dpl_6ukJ2mdRgMDnoR8gjv5H7HGGysJ8`.
- Corrección posterior: el formulario de producto ya no envía a Supabase los alias visuales del editor (`nombre`, `precio`, `foto`, `agotado`, etc.), que provocaban respuestas `400`. El guardado de producto y el cambio rápido de agotado exigen ahora confirmación de la fila remota; la descarga conserva también `is_hidden`. Despliegue `dpl_9PDirApT67uj8NzioncUQYXNsug5`.
- Auditoría complementaria: crear o renombrar categorías usa un payload estricto, espera la fila confirmada en Supabase y revierte la copia local ante error. La confirmación de visible/oculto de productos recibió la misma protección. Despliegue `dpl_7CmhMEaSqm9RqqFAFXQ2r4aPs142`.

## 2026-08-24 — Demo de pizzería preparada para pruebas

- La plantilla `pizza-house` se presenta como `Pizza Nostra` con menú de pizzas, entradas y bebidas.
- Usa el teléfono y WhatsApp de prueba `961 372 5386`, dirección ficticia explícitamente identificada y cuatro colonias de cobertura aproximada de hasta 2 km.
- El pago de prueba queda limitado a efectivo y el checkout impide solicitar más de $500 de cambio al repartidor.
- La configuración se refleja en el menú público y en el dashboard, incluso si el navegador conservaba una copia anterior de la demo.
- Cambio únicamente local; no se modificó Supabase ni se realizó despliegue.

## Alerta crítica de persistencia — 2026-08-21

- El proyecto Supabase conectado `streetboss-pos` fue encontrado pausado y se restauró correctamente a estado `ACTIVE_HEALTHY`.
- La inspección directa confirmó que solo existen `sb_clients`, `sb_memberships` y `sb_operation_data`, todas con cero filas.
- Las tablas que el frontend consume (`sb_businesses`, `sb_menu_categories`, `sb_menu_products`, `sb_orders` y `sb_business_customers`) no existen en este proyecto.
- En consecuencia, las altas, menús, pedidos y clientes han dependido de `localStorage`; StreetBoss no debe considerarse listo para altas comerciales multidispositivo hasta crear y validar la persistencia central.
- Se ejecutó la migración correctiva `20260821_operational_persistence.sql` en `streetboss-pos`. Verificación directa confirmó las seis tablas operacionales y RLS activo. El frontend actualizado fue desplegado en Vercel (`dpl_BG4NCtH9BHkNtNUq1rPKcWR7pepJ`) y quedó `READY` con el alias `https://streetboss.com.mx`. Pendiente únicamente validar una alta real en computadora y abrir ese mismo menú en celular.

## Estado General

**Estado: 🟢 OPERATIVO EN CALIENTE CON DESPLIEGUE DIRECTO VERCEL & SINCRONIZACIÓN REALTIME DE COMANDAS**

### Formas de pago — guardado central verificado en producción

- La edición de efectivo, transferencia y tarjeta ahora espera la confirmación de Supabase antes de mostrar éxito.
- La pantalla ya no recarga datos anteriores mientras el guardado central sigue en curso.
- Si la sincronización falla, se muestra el error y no una confirmación falsa.
- Los valores numéricos en cero se conservan correctamente.
- Compilación y despliegue de producción aprobados (`dpl_CsnGRecwFQcEmPoycLjwhWLcR78u`).
- Prueba completa aprobada: guardar, recargar el panel, abrir el menú público en otra sesión y comprobar efectivo, transferencia y tarjeta en el checkout.
- La verificación no modificó métodos ni datos bancarios y no generó pedidos.

### Evolución local pendiente de revisión — Dashboard iOS y editor visual

- La pantalla inicial del Dashboard B2B ahora presenta las funciones como aplicaciones táctiles tipo iOS.
- `Configurar menú` es la primera acción y tiene máxima prioridad visual.
- El editor reutiliza `MenuDigital`, `MenuHeroProfile` y `ProductoMenuCard`: no existe una copia independiente del menú público.
- Portada, logo, categorías y productos pueden editarse desde su posición visual mediante los mecanismos de guardado existentes.
- Los controles administrativos están condicionados a `editMode` y no aparecen en el menú público.
- Compilación local aprobada y despliegue de producción completado el 2026-08-21; Vercel confirmó el alias `https://streetboss.com.mx`.
- El Dashboard Central HQ también abre ahora en un Springboard iOS con apps grandes, fondo inmersivo y dock móvil; la acción destructiva de borrado fue retirada de la pantalla principal.
- Dashboard B2B reorganizado en pantallas independientes para Entregas, Pagos, Pedidos, Mis clientes, Redes y Compartir; `Más` dejó de ser una app principal.
- La tarjeta de Compartir y los metadatos Open Graph usan la foto de perfil como imagen y la descripción del negocio como texto.
- El Hub Central HQ conserva sus seis apps principales y reemplaza el panel lateral, la bienvenida sobredimensionada y el pie técnico por una barra superior compacta y un dock tipo iOS.
- Las acciones sensibles de cuenta permanecen en la barra superior; la acción destructiva de borrado ya no forma parte de la navegación visible.
- El Dashboard B2B incorpora dos apps de lectura sencilla después de Clientes: `Platillos más pedidos` y `Colonias que más piden`; ambas calculan rankings desde pedidos reales y se actualizan con los nuevos pedidos. Esta revisión quedó desplegada en producción el 2026-08-21.
- Los pies visibles con versión, build, cliente, usuario y código de despliegue fueron retirados de los dashboards B2B y HQ; el cambio está activo en `https://streetboss.com.mx`.
- La lista `Mis clientes` dejó de depender de registros aislados por navegador: ahora se reconstruye desde los pedidos descargados de Supabase, elimina datos locales obsoletos del restaurante y se actualiza con eventos en tiempo real.
- La corrección de clientes multidispositivo fue desplegada en producción el 2026-08-21; Vercel confirmó `Ready` y el alias `https://streetboss.com.mx`. Queda pendiente confirmar el resultado con la misma cuenta en computadora y celular.
- Diagnóstico móvil posterior encontró fallas reales de lectura Supabase en un navegador limpio. Se corrigió el contexto del restaurante en consultas de negocio, menú, pedidos y clientes; también se eliminó una condición sobre la columna inexistente `id` y se agregó resincronización al volver desde segundo plano, recuperar internet o reabrir Safari móvil.
- La segunda corrección móvil fue desplegada el 2026-08-21; Vercel confirmó `Ready` y el alias de producción.
- La comprobación posterior detectó múltiples clientes Supabase simultáneos para el mismo restaurante. Se añadió reutilización de una única conexión contextual por slug; la estabilización fue desplegada el 2026-08-21 y Vercel confirmó `Ready` y el alias `https://streetboss.com.mx`.
- La respuesta HTML del menú ahora resuelve el perfil individual de los diez demos oficiales y consulta los negocios nuevos con contexto multi-tenant. Cada enlace compartido usa como OG la foto de perfil y la descripción de ese menú, con una versión de imagen que evita reutilizar el recurso genérico anterior.
- Al resolver un negocio existente, la nube tiene prioridad sobre la copia local del navegador; `localStorage` queda únicamente como respaldo sin conexión. Esto evita que una copia antigua impida descargar cambios hechos en otro dispositivo.
- Validación local aprobada: compilación de 1,647 módulos, `git diff --check` sin errores y prueba del HTML OG con Tacos, Pizza y Mariscos produciendo tres perfiles diferentes.
- La corrección de OG individual y lectura cloud-first fue desplegada en producción el 2026-08-21; Vercel confirmó `Ready` en 24 segundos y el alias `https://streetboss.com.mx`.
- La investigación de la divergencia de clientes comprobó que el dashboard escribía `sb_business_customers` pero nunca descargaba esa tabla; depender únicamente de reconstruir desde pedidos dejaba registros exclusivos en cada navegador.
- Se implementó sincronización bidireccional de clientes: descarga por todas las identidades válidas del negocio, unión por teléfono/email/ID, preservación del registro más reciente, carga de la lista unificada y actualización inmediata de la pantalla.
- Los clientes Supabase contextuales dejaron de persistir sesiones de autenticación independientes, eliminando la advertencia de múltiples sesiones observada en producción.
- Compilación local aprobada con 1,647 módulos y `git diff --check` sin errores; esta corrección requiere el siguiente despliegue de producción.
- La sincronización bidireccional fue desplegada en producción el 2026-08-21; Vercel confirmó `Ready` en 25 segundos y el alias oficial.
- La comprobación externa posterior mostró que Supabase todavía reutilizaba el nombre interno de almacenamiento de autenticación entre conexiones contextuales. Se asignó una clave única por restaurante para eliminar esa última colisión; requiere un despliegue adicional.
- La estabilización final fue desplegada el 2026-08-21; Vercel confirmó `Ready` en 32 segundos. Una comprobación externa posterior mostró la consola de producción sin errores ni advertencias de sesiones Supabase duplicadas.

Se ha finalizado y desplegado en producción la sincronización en caliente y la accesibilidad responsiva tipo iOS:

1. **Sincronización de Pedidos en Tiempo Real (Supabase)**:
   - Pedidos de clientes B2C se escriben asíncronamente en la tabla centralizada `sb_orders` en la nube de Supabase.
   - Dashboard B2B del restaurante y la pestaña central HQ de Pedidos se suscriben reactivamente a los inserts/updates de Supabase.
   - Notificación sonora nativa (timbre de audio doble en D5 y A5 usando la API Web Audio de JS) y Toasts verdes automáticos al recibir un pedido.

2. **Resolución Asíncrona de Negocios Clonados (Base en la Nube)**:
   - Implementadas `resolveBusinessBySlug` y `downloadMenuFromSupabase` para evitar que los restaurantes creados desde la Central HQ den "Negocio no encontrado" en otros dispositivos.
   - Al cargar el panel o el menú, el frontend descarga la información del restaurante, su catálogo de platos y categorías directamente de Supabase y lo persiste en local.

3. **Accesibilidad Tipográfica Interactiva (Modo iOS Dynamic Type)**:
   - Removido el forzado estático global de fuentes grandes para evitar layouts amontonados. Por defecto la UI es compacta e idéntica a una App Móvil nativa.
   - Inyectado un botón selector interactivo `[A+] / [A++]` en el Header del panel y en el Sidebar de la Central HQ.
   - El modo de texto grande escala moderadamente de forma reactiva del 10% al 15% las tipografías principales respetando márgenes y celdas.

4. **Despliegues Directos Vercel (CD Manual)**:
   - Dado que los hooks de compilación automática en GitHub no están activos en este proyecto de Vercel, se estableció el flujo de despliegue directo por terminal: `npx vercel --prod --yes`.
   - Producción actualizada en caliente y propagada en https://streetboss.com.mx de forma inmediata tras cada commit aprobado.

---

## 1. Resumen de Cuarentena y Retiro Seguro

- **Ruta de Cuarentena:** `/Users/danielvazquez/Proyectos/_CUARENTENA_STREETBOSS/2026-07-21_1127/`
- **Carpetas en Cuarentena:**
  1. `streetboss_origen_ibr/` (Origen principal consolidado)
  2. `streetboss-studio/` (Documentación & Brand System)
  3. `streetboss_experimental_tour360/` (Tour virtual 360 & investigación mercado)
  4. `streetboss-web/` (Scripts de utilidad)
  5. `streetboss_ARCHIVED_DO_NOT_USE/` (Instancia deprecada)
  6. `Imagenes_Street_Boss/` (Capturas PNG de UI)

> 🛑 **Ningún archivo fue eliminado permanentemente.** Todos los duplicados se encuentran resguardados en cuarentena para revisión humana final.

---

## 2. Estado de la Carpeta Oficial y Build de Producción

- **Git Status:** Rama `remediacion-sbos-master-audit` activa, commit `fb7ff6643183e6ee4c90b0e52058353a8b9c3b40`.
- **Build Local (`npm run build`):** ✅ Compilación exitosa en 6.07s procesando 1,644 módulos.
- **Despliegue Vercel:** ✅ Producción activa aliased a `https://streetboss.com.mx`.

## 2026-08-22 — Alta multidispositivo corregida

- La Central descubre negocios activos mediante `sb_business_directory` y descarga cada menú desde Supabase; ya no depende del navegador donde se creó.
- Crear negocio espera la confirmación de negocio, categorías y productos antes de mostrar éxito. Reintenta tres veces y revierte la copia local si la nube falla.
- Verificación: el directorio contiene `El Birrias`; build y revisión de diferencias aprobados. Pendiente publicar este último frontend.
- Publicación final activa el 2026-08-22: las altas locales ausentes en Supabase se retiran automáticamente; `prueba-1` queda descartado y `el-birrias` permanece como negocio real compartido.
- Corrección posterior: las altas históricas locales ya no se retiran; se migran automáticamente al abrir Central HQ. Verificado en Supabase con `torta-de-prueba`, `hamburguesas` y `el-birrias`, cada uno con 3 categorías y 10 productos.
- Corrección adicional del 2026-08-24: el generador valida el slug tanto en `sb_businesses` como en `sb_business_directory`. Esto evita que un registro histórico del directorio provoque el error genérico de guardado después de haber encontrado un slug libre en la tabla principal. Producción publicada en `dpl_CWARANwy4rWXefxksYbJQhQRC8hR`.

## 2026-08-22 — Tarifas individuales de reparto

- El valor `$0` ya no se reemplaza por `$30` al guardar o calcular el pedido.
- Cada colonia dispone de edición individual y persiste únicamente dentro del negocio correspondiente en Supabase.
- La actualización masiva también sincroniza con la nube. Build aprobado y producción publicada.

## 2026-08-22 — Contacto propio por negocio

- Los botones `WhatsApp` y `Llamar` del menú público usan exclusivamente el teléfono guardado para ese negocio.
- Si el negocio no tiene teléfono configurado, los botones no se muestran y los pedidos no se redirigen al número de StreetBoss.
- Compilación aprobada y corrección publicada en `https://streetboss.com.mx`; Vercel confirmó `Ready` y el alias oficial.

## 2026-08-22 — Eliminación de clientes multidispositivo

- La lista `Mis clientes` incorpora eliminación táctil disponible en móvil y escritorio.
- El borrado retira los datos personales y se sincroniza mediante una marca central sin información para impedir que otra copia local restaure al cliente.
- Build aprobado y cambio desplegado en producción; Vercel confirmó `Ready` y el alias oficial.

## 2026-08-22 — Borrado B2B e historiales operativos verificados

- `Eliminar Cliente` en Central HQ ahora da de baja el negocio en Supabase antes de retirarlo de la lista; un fallo remoto se muestra y no simula éxito.
- Los pedidos públicos guardan el `business_id` canónico y esperan la confirmación de Supabase antes de abrir WhatsApp.
- Pedidos, clientes y rankings se leen con el contexto de cada negocio, tanto en su panel como en Central HQ.
- Verificación real en producción: un pedido de Tacos de prueba creó pedido y cliente en Supabase; el panel mostró `Historial de Pedidos (1)`, el cliente y `Clásica` en platillos más pedidos.
- Verificación real de borrado: un negocio desechable desapareció de Central HQ y quedó con estado `eliminado` y fecha de baja en Supabase.
- Todos los registros creados exclusivamente para estas pruebas fueron eliminados al terminar.
- Corrección posterior multidispositivo: una caché móvil antigua ya no puede volver a publicar un negocio dado de baja. La baja central prevalece y la copia local se marca como eliminada al sincronizar.
- Verificación en producción con caché vieja y navegador limpio: Tacos de prueba, Torta de Prueba, Hamburguesas y El Birrias permanecen ocultos; únicamente La Chiapaneca figura activa.

## 2026-08-26 — Landing comercial actualizada

- La portada comunica la oferta de $99 MXN al mes durante 3 meses, la mensualidad posterior de $150 MXN y la ausencia de comisiones por venta.
- Se mantuvo el video principal y se amplió la presentación con menú administrable, reparto por colonias, formas de pago, pedidos, clientes, métricas y tutoriales.
- Se retiraron afirmaciones incorrectas de cálculo automático por GPS y cancelación desde el panel.
- Build aprobado y publicación completada en producción el 2026-08-27 (`dpl_95tMycRMDSKzqD57ePcLTyVoCgHn`). El alias oficial `https://streetboss.com.mx` quedó activo y verificado.
- Ajuste de legibilidad móvil publicado el 2026-08-27: cuerpo y textos funcionales se elevaron principalmente a 16 px, auxiliares a 14 px y se mejoró el contraste sin agrandar los encabezados (`dpl_7EBbPJS9T2pAnx5jDD7GqsiV5LUh`).

## 2026-08-22 — Frase de pedidos editable en el menú

- La etiqueta `Pedidos directos a tu WhatsApp` se puede tocar y editar directamente dentro de `Configurar menú`, igual que los elementos del catálogo.
- El texto se guarda como configuración independiente: no modifica la descripción ni el mensaje destacado superior.
- Verificación en producción aprobada: editor visible, guardado central confirmado y texto actualizado en el menú público. El valor temporal de la prueba fue retirado.

## 2026-10-09 — Contacto de La Vitola

- La ruta pública de La Vitola usa `9613209433` para llamadas y `529613209433` para WhatsApp, incluso si el navegador conserva un registro anterior.
- Producción publicada y verificada en `https://streetboss.com.mx/menu/la-vitola` (`dpl_6tT3KciEjvVPyPKqW7TgnoMa9wq2`).
- El cierre del pedido abre WhatsApp inmediatamente en Safari móvil; el registro central continúa en segundo plano y una falla de nube ya no cancela el pedido. Producción: `dpl_UHSYocae6xDBguh8AXtpJM4D4Ur1`.
- La Vitola aparece como cliente B2B administrable al cargar `Clientes`, con 4 categorías, 16 productos, una zona y acceso previsto en `/panel/la-vitola`. Producción: `dpl_7PmK579zurzqRNXd4qjD28bwyPuN`.
