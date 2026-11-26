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
