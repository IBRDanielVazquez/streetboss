# ESTADO ACTUAL — STREETBOSS

## La Vitola — cuenta aislada (2026-11-25)

- Acceso privado: `/menu/la-vitola/acceso`. La ruta antigua de ChatGPT fue sustituida por una función Supabase `la-vitola-portal`.
- El administrador utiliza su teléfono como identificador y establece personalmente la contraseña mediante una invitación de un solo uso, almacenada únicamente como hash SHA-256 y con caducidad.
- El permiso se limita a `public.sb_vitola_admins`; no se registra ningún rol en `sb_memberships` ni se concede acceso a StreetBoss Central.
- Editor de catálogo dedicado: `public.sb_vitola_catalog` con guardado de borrador y publicación. El catálogo público `/menu/la-vitola/menu.js` se sirve desde la versión publicada en Supabase.
- La carta conserva 21 productos y 4 categorías. La landing pública, imágenes y carrito existentes no fueron reemplazados.
- El propietario debe abrir el enlace privado y crear su contraseña para activar la primera cuenta. No se almacenan contraseñas en documentación ni se exige correo al propietario.
- La recuperación automática de contraseña no está habilitada; requiere una nueva invitación administrada. Validar posteriormente el ciclo completo con el propietario.


## Campaña Menú Navideño 2027

- Ruta pública: `/menu-navideno-2027/`. La portada ofrece la creación del menú digital navideño por $199 MXN en la superpromoción de noviembre.
- Los demos de cenas por encargo, repostería y posadas permiten armar un pedido simulado y ver el ejemplo de mensaje. La consulta comercial por WhatsApp incluye el demo elegido y los datos básicos del vendedor.
- Para dar de alta un negocio confirmado, se usa **Crear negocio** en la Central StreetBoss. Se ajustan su carta y WhatsApp en el panel del negocio y se entrega su enlace público.
- Para mostrarlo también en la campaña se agrega su ficha en `public/menu-navideno-2027/catalogo.js`. La cartelera aparece cuando hay negocios y conserva el buscador y los filtros.

> Última actualización: 2026-08-17
> Actualizado por: Antigravity (Google DeepMind)

## Estado General

**Estado: 🟢 OPERATIVO EN CALIENTE CON DESPLIEGUE DIRECTO VERCEL & SINCRONIZACIÓN REALTIME DE COMANDAS**

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

## La Vitola — menú unificado con los demos (25 noviembre 2026)

- El menú público `/menu/la-vitola` se sirve con el mismo componente React `MenuDigital`, portada/perfil, barra de categorías, tarjetas en dos columnas y carrito flotante usados por los demos oficiales.
- La página usa `LaVitolaPublicMenu.jsx` como adaptador del catálogo publicado `sb_vitola_catalog` a la UI oficial. No se duplican productos ni precios.
- El checkout de La Vitola envía directamente por WhatsApp y cotiza el envío con el negocio; no se muestran costos de reparto inventados.
- La ruta de acceso `/menu/la-vitola/acceso` y la función de autenticación privada no se modificaron.
- Menú comprobado con 21 productos y 4 categorías. Las fotografías individuales de comida siguen pendientes de activos auténticos del restaurante; actualmente se muestran los iconos de respaldo del componente oficial.

## La Vitola — hamburguesas configurables y editor de fotografías (2026-11-25)

- Las ocho opciones de la categoría `extras` ahora se ofrecen **solo** al seleccionar una hamburguesa; esa categoría ya no se renderiza en el menú de compras.
- Las combinaciones de extras generan variantes específicas de cada hamburguesa, con precio adicional incluido en carrito, subtotal y pedido por WhatsApp. Tacos y bebidas permanecen como productos independientes.
- El acceso privado conserva la cuenta asociada al teléfono del restaurante. Función `la-vitola-portal` versión 5 con editor mobile-first de nombre, precio, descripción, disponibilidad y fotografías por producto, logo y portada, con borrador y publicación.
- Se agregó el bucket público `la-vitola-media` con tipos JPG/PNG/WebP y límite por archivo de 5 MB. Las subidas pasan exclusivamente por la función autenticada que comprueba pertenencia a `sb_vitola_admins` y token CSRF; no se habilitaron subidas públicas.
- Las imágenes generadas durante el trabajo todavía **no** forman parte del catálogo publicado: requieren identificación exacta de cada platillo para evitar fotografías incorrectas. El editor ya acepta imágenes del propietario.

## La Vitola — editor visual y pago tras confirmación (2026-11-25)

- Dashboard móvil privado `/menu/la-vitola/acceso` con portada, avatar, tarjetas con fotos y precio, vista previa de productos y navegación inferior iOS: Inicio, Menú, Agregar, Envíos, Pagos y Redes.
- Edición por ventanas de portada, perfil, platillos y extras con previsualización local al seleccionar imagen. Admite crear productos en las cuatro categorías, actualizar descripciones, precios, disponibilidad y foto, además de omitir una sección sin guardar.
- Gestión de WhatsApp, enlaces de Instagram, Facebook, TikTok, YouTube, página web y Google Maps; ajustes de envío con colonias opcionales.
- Configuración optativa de datos para transferencia y enlace externo de pago con tarjeta, sin almacenar PAN/CVV ni pasarela propia. En el carrito, el comprador solicita confirmación de disponibilidad, costo de envío y total por WhatsApp **antes de pagar**. Los métodos configurados solo se muestran al marcar que el restaurante ya confirmó el importe.
- Catálogo público inicial: 13 platillos/bebidas con imágenes ilustrativas diferenciadas y un perfil/portada provisionales. Los 8 extras se agregan únicamente dentro de la hamburguesa. Los materiales provisionales están etiquetados y el propietario puede reemplazarlos.
- Supabase Edge Function `la-vitola-portal` v8, `sb_vitola_catalog`, Storage `la-vitola-media` (JPG/PNG/WebP 5 MB). El dashboard verifica sesión y permiso de `sb_vitola_admins` en cada escritura y mantiene CSRF.
- Se verificó con pruebas aisladas la salida HTML para 21 editores, seis secciones, fotos, redes, envíos y pagos, además de simulaciones de crear producto, edición, links, cotización y validación de CLABE. Prueba autenticada final con usuario titular aún pendiente.

## La Vitola — estado Agotado en el dashboard (2026-11-25)

- El propietario puede activar **Marcar como agotado** por platillo desde el editor visual, y volver a desmarcarlo cuando esté disponible.
- En el menú público el producto permanece visible con la etiqueta **Agotado**, pero no puede agregarse al carrito. Los extras agotados tampoco se ofrecen al personalizar hamburguesas.
- El pedido por WhatsApp no solicita confirmar disponibilidad: solo se cotiza envío cuando aplica, se confirma el total y se acuerda la forma de pago.

## La Vitola — legibilidad de WhatsApp y dashboard móvil (2026-11-25)

- El mensaje de pedido enviado a WhatsApp ahora respeta saltos de línea reales entre productos, extras, subtotal, modalidad de entrega y datos del cliente. La plantilla se centralizó en `src/utils/formatLaVitolaOrder.js` y elimina la antigua llamada a `.filter(Boolean)` que borraba los renglones vacíos.
- En domicilio solicita **solo el costo del envío a la dirección indicada**, sin texto de «pendiente por confirmar». Para recoger no solicita envío. Los extras se detallan sin sumarse dos veces al precio total.
- Dashboard de La Vitola: corregida la omisión de los estilos `adminStyle` y `visualDashboardCss` en la respuesta HTML, principal causa de la visualización defectuosa. Añadidos estilos para iPhone, barra inferior con safe areas, tarjetas compactas de producto, categorías desplegables, ventanas de edición a tamaño táctil y campos de 16 px para evitar zoom automático.
- No se modificaron la autenticación, las tablas, los roles, el contenido del catálogo ni el control de productos agotados.

## La Vitola — categorías y registro de cliente (2026-11-25)

- Desde el dashboard privado, en **Menú → Nueva categoría**, el propietario puede crear nuevas categorías con nombre propio. Se validan nombres vacíos/duplicados y un límite de 50 categorías; se generan IDs seguros y se preservan los 21 productos. Al publicar, la categoría estará disponible para añadir platillos; en el menú público aparece al tener productos visibles.
- La cuenta sigue aislada en `sb_vitola_admins` y no obtiene rol de acceso a StreetBoss Central. El acceso para compartir es `https://streetboss.com.mx/menu/la-vitola/acceso`, con usuario telefónico y contraseña que ya creó el titular.
- El restaurante se registró en `sb_clients` con `slug=la-vitola`. La ficha preexistente en `sb_businesses` fue normalizada sin crear duplicado: contacto del propietario, WhatsApp de pedidos desde el catálogo, logo, portada y tarifa de reparto por cotizar; se eliminaron los datos demostrativos obsoletos de esa ficha.
- En **StreetBoss Central → Clientes** se presenta la sección **Menús digitales activos**, actualmente con La Vitola y botones específicos de menú, dashboard y copiar acceso. No se ofrece el flujo genérico de regeneración de contraseña para esta cuenta dedicada.

## La Vitola — pestaña Clientes y pedidos (2026-11-25)

- Se agregó a `/menu/la-vitola/acceso` la pestaña privada **Clientes**, independiente del menú, entregas, pagos y redes sociales. Presenta contactos agrupados por teléfono, historial cronológico, productos solicitados, modalidad, subtotal, estado, importe final confirmado y métricas.
- Los pedidos iniciados desde el checkout ahora intentan registrarse **antes de abrir WhatsApp** mediante la Edge Function `la-vitola-registrar-pedido`. El servidor recalcula importes desde el menú publicado, valida productos/extras, impone límites y guarda `solicitud`, no una venta ni un mensaje entregado. Si falla el registro, el pedido directo por WhatsApp no se bloquea.
- El propietario puede marcar una solicitud como **Confirmada** (con total final, incluido reparto) o **Cancelada**. Solo los importes confirmados contribuyen al total mostrado.
- Hay consentimiento **opcional, desmarcado por defecto**, para futuras promociones por WhatsApp. No se implementó envío masivo, automatización ni importación de conversaciones de WhatsApp. La gestión futura de exclusión y consentimiento debe verificarse antes de enviar campañas.
- Los datos se almacenan en `public.sb_vitola_requests` con RLS forzada y ningún acceso directo de `anon` o `authenticated`: solamente las funciones backend pueden registrar, y el portal verifica la cuenta autorizada antes de leer o actualizar. No se modifican las tablas de prospectos ni la autenticación de StreetBoss Central.
- El historial previo de La Vitola no existe en `sb_orders`; no se reconstruyeron ventas pasadas a partir de capturas ni se crearon registros de prueba en producción.


## La Vitola — app instalable y tarifas por colonia (2026-11-25)

- El propietario proporcionó el logotipo original de La Vitola; quedó instalado sin rediseño como archivos binarios propios `public/la-vitola/icon-192.png` y `icon-512.png`. La ruta PWA privada usa `public/la-vitola/manifest.webmanifest`, nombre `La Vitola`, `start_url=/menu/la-vitola/acceso`, modo standalone, favicon y Apple touch icon exclusivos. No se sustituye el branding general de StreetBoss.
- En el dashboard privado: **Envíos → + Agregar colonia**, editable por filas **Colonia / Costo de envío**, con botón eliminar y vista previa automática. Se permiten costos definidos (incluido $0) o dejar el campo vacío para cotizar por WhatsApp. Validación de valores y duplicados al guardar/publicar, sin necesidad de escribir tarifas en notas.
- Se recuperó la información ya capturada «Terán - $25» y se publicó como tarifa estructurada `{nombre:'Terán',costo:25}`, preservando el catálogo del negocio.
- Checkout: al elegir envío aparece selector de colonia; muestra su tarifa y total con envío en tiempo real, y los envía desglosados a WhatsApp. Si una colonia no tiene tarifa configurada se solicita solo el costo de envío.
- La Edge Function `la-vitola-registrar-pedido` valida la colonia y tarifa contra el catálogo publicado (no confía en importes del cliente). La tabla `sb_vitola_requests` contiene opcionalmente `delivery_zone` y `delivery_fee` para el historial privado.
- La PWA privada se puede añadir a pantalla de inicio en iOS desde Safari y en dispositivos compatibles sin distribuirla por tiendas. Las sesiones y permisos existentes del propietario se mantienen.


## PWA — instalación de StreetBoss y menús independientes (2026-11-25)

- StreetBoss general se instala desde `https://streetboss.com.mx/instalar`, con manifiesto `/manifest.json` actualizado a `display: standalone`, identificador y ruta inicial `/`.
- Componente reutilizable `src/components/InstallAppButton.jsx`: botón «Instalar app». En navegadores que ofrecen instalación utiliza `beforeinstallprompt`; en iPhone muestra instrucciones para Compartir → Agregar a pantalla de inicio.
- Se agregó el botón a la cabecera de todos los menús renderizados con `MenuHeroProfile`, incluidos los demos y La Vitola.
- Cada menú `/menu/{slug}` recibe su propio manifiesto `/api/menu-app?slug={slug}`: `id`, `start_url` y `scope` exclusivos, nombre del restaurante e íconos PNG cuadrados de 192 y 512 píxeles generados a partir del logo disponible. En La Vitola se usa su logo oficial; en demos, los logos disponibles; en negocios reales, su logo público de Supabase. Cuando el logo es inaccesible se utiliza temporalmente el ícono de StreetBoss.
- `api/menu.js` inyecta estos metadatos en el HTML inicial y `MenuDigital.jsx` los mantiene al navegar por React, sin reemplazar la identidad de StreetBoss general.
- No se implementaron compras dentro de app, notificaciones, acceso a datos de otros negocios, service workers que cacheen datos privados ni distribución por tiendas.
