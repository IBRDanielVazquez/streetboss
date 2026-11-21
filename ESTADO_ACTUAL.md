# ESTADO ACTUAL — STREETBOSS

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

## La Vitola · 21 de noviembre de 2026

El JavaScript servido por el dominio de producción usa el proyecto oficial uszhdesbewkjvphipudw. Las reglas de proyecto de Vercel todavía resuelven la carta y el editor desde el sitio externo. El acceso vigente usa ChatGPT.

La migración 20261121202412 conserva en Supabase el catálogo publicado (21 productos, cuatro categorías) y su borrador. Los 16 productos de la ficha operativa anterior se conservaron por separado. La base externa del editor no tenía filas al inspeccionarla. La tabla de administradores de La Vitola está vacía. Auth tenía correo habilitado y teléfono deshabilitado.
