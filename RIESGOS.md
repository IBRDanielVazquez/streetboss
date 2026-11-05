# REGISTRO DE RIESGOS — STREETBOSS

> Riesgos identificados que podrían afectar el proyecto.

## RSK-013: Autenticación HQ local limita el aislamiento del seguimiento comercial

- **Fecha:** 2026-08-25
- **Severidad:** Media.
- **Descripción:** HQ usa actualmente una sesión administrada en el cliente y no una identidad Supabase verificable; por ello la Data API no puede distinguir criptográficamente al administrador HQ para las filas de seguimiento.
- **Mitigación aplicada:** La tabla sólo contiene estado comercial asociado a IDs del catálogo, no contraseñas, pedidos ni datos de restaurantes; tiene RLS activo, validación de longitud y no permite borrado desde el frontend.
- **Pendiente estructural:** Migrar la autenticación HQ a una identidad central antes de almacenar información comercial sensible adicional.

## RSK-012: Tutoriales HEVC sin compatibilidad Android universal (resuelto)

- **Fecha:** 2026-08-25
- **Severidad:** Alta para Chrome/Android.
- **Descripción:** Los siete `.MOV` contienen video HEVC y audio AAC. Safari/iPhone admite este formato, mientras Chrome/Android depende del dispositivo y no garantiza reproducción.
- **Mitigación aplicada:** Con autorización del propietario, se generaron `.mp4` con video H.264/AVC y audio AAC a 592 × 1280, conservando orientación vertical y calidad móvil.
- **Estado:** Resuelto, validado y publicado; los originales `.MOV` permanecen intactos en Descargas como respaldo fuente.

## RSK-007: Autenticación HQ únicamente en el cliente

- **Fecha:** 2026-08-24
- **Severidad:** Media
- **Descripción:** La sesión de HQ existente se valida en el navegador y no mediante una identidad administrativa verificable en el servidor.
- **Impacto:** La app de Analítica está oculta tras el acceso HQ y los eventos están aislados por negocio, pero no existe todavía autorización administrativa criptográfica para una consulta global.
- **Mitigación:** Los eventos no contienen datos personales; RLS limita cada consulta a un solo negocio. Migrar HQ a Supabase Auth con rol administrativo antes de incorporar métricas sensibles o datos personales.
- **Estado:** Abierto; no afecta el funcionamiento ni la privacidad de esta primera versión anónima.

## RSK-006: Tablas operativas inexistentes en Supabase

- **Fecha:** 2026-08-21
- **Severidad:** Crítica
- **Descripción:** El proyecto conectado `streetboss-pos` solo tiene tres tablas vacías. No existen las tablas de negocios, menú, pedidos y clientes que consume el frontend.
- **Impacto:** Las altas y ediciones quedan aisladas por navegador y no son confiables entre dispositivos.
- **Estado:** Confirmado. Requiere autorización explícita para crear el esquema operativo, políticas RLS y migración verificable antes de vender.

---

## RSK-001: Múltiples copias del proyecto

- **Fecha:** 2026-07-21
- **Severidad:** Baja (RESUELTO)
- **Descripción:** Existían 6 instancias duplicadas de StreetBoss dispersas en el equipo.
- **Mitigación:** Todas las 6 carpetas secundarias fueron aisladas en la carpeta de cuarentena `/Users/danielvazquez/Proyectos/_CUARENTENA_STREETBOSS/2026-07-21_1127/`. La única fuente activa es `/Users/danielvazquez/Proyectos/StreetBoss`.
- **Estado:** Resuelto.

## RSK-002: `.env` Versionado en el Historial Git (`b1576c1`)

- **Fecha:** 2026-07-21
- **Severidad:** Media (En espera de decisión de saneamiento)
- **Descripción:** El archivo `.env` fue versionado en Git en el commit `b1576c1`. Excluirlo del workspace genera `deleted: .env` en `git status`.
- **Mitigación:** No restaurar el archivo desde Git. No hacer commit ni push. Mantenido en aislamiento con `.env.example`.
- **Estado:** Documentado y Bloqueado para Commits.

## RSK-003: Persistencia de catálogo local-first

- **Fecha:** 2026-08-21
- **Severidad:** Media
- **Descripción:** Las operaciones existentes `saveCategory`, `saveProduct`, `deleteCategory` y `deleteProduct` persisten primero en `localStorage`. La edición visual comparte esta misma fuente con el menú público del dispositivo, pero la sincronización multidispositivo del catálogo debe validarse antes de producción.
- **Mitigación:** No se modificaron Supabase, tablas, RLS ni migraciones por restricción del proyecto. Validar el flujo completo y autorizar por separado cualquier ajuste de persistencia remota.
- **Estado:** Abierto; no bloquea la revisión local de UX.

## RSK-004: Divergencia histórica de clientes entre dispositivos

- **Fecha:** 2026-08-21
- **Severidad:** Media (MITIGADO EN CÓDIGO)
- **Descripción:** El directorio B2C se leía únicamente desde `localStorage`, por lo que computadora y celular podían mostrar clientes distintos.
- **Mitigación:** El directorio se regenera desde pedidos y además sincroniza bidireccionalmente `sb_business_customers`, uniendo los registros históricos de cada navegador. No se modificaron tablas, RLS ni permisos.
- **Estado:** Corrección validada localmente; pendiente de despliegue y prueba final con el negocio real en computadora y celular.

## RSK-005: Caché externa de vistas previas sociales

- **Fecha:** 2026-08-21
- **Severidad:** Baja
- **Descripción:** WhatsApp, Facebook y otras redes pueden conservar durante un tiempo una vista previa ya descargada aunque el servidor haya cambiado.
- **Mitigación:** Cada imagen OG incluye una versión derivada de la actualización del negocio o del perfil del demo. Los enlaces nuevos quedan correctos; un enlace ya cacheado puede requerir volver a compartirlo tras la publicación.
- **Estado:** Mitigado en código; pendiente de confirmación con un enlace real después del despliegue.

---

> Actualizar este archivo cuando se identifiquen nuevos riesgos o cambien los existentes.

## RSK-006: Alta local sin publicación central

- **Fecha:** 2026-08-22
- **Severidad:** Crítica (mitigada en código)
- **Descripción:** El alta mostraba éxito mientras la carga a Supabase seguía en segundo plano y podía interrumpirse en móviles.
- **Mitigación:** Confirmación central obligatoria, tres reintentos y reversión local cuando la carga falla.
- **Estado:** Build aprobado; pendiente despliegue y prueba final en dos dispositivos.
- **Actualización:** Desplegado. Supabase registró lecturas correctas de `el-birrias` desde iPhone; `prueba-1` no existe en la fuente central y ahora se purga localmente.
- **Corrección final:** No se purgan altas históricas; se publican automáticamente con su catálogo. Verificación central completada con tres negocios recuperados.

## RSK-007: Cero sustituido por tarifa predeterminada

- **Fecha:** 2026-08-22
- **Severidad:** Alta (resuelta)
- **Descripción:** El uso de valores por defecto con `||` convertía una tarifa válida de cero en treinta y el cambio masivo no llegaba a Supabase.
- **Mitigación:** Valores nulos tratados con `??`, edición individual por zona y sincronización cloud aislada por `business_id`.
- **Estado:** Validado mediante build y desplegado.

## RSK-008: Contacto predeterminado compartido entre negocios

- **Fecha:** 2026-08-22
- **Severidad:** Crítica (resuelta en código)
- **Descripción:** Si un negocio no tenía teléfono, el menú sustituía el dato por el número de StreetBoss y podía dirigir llamadas o pedidos al destinatario incorrecto.
- **Mitigación:** Se eliminaron los números predeterminados de clientes; cada menú usa exclusivamente su contacto y oculta o bloquea la acción cuando falta.
- **Estado:** Resuelto, validado y desplegado en producción.

## RSK-009: Clientes eliminados restaurados por sincronización

- **Fecha:** 2026-08-22
- **Severidad:** Alta (resuelta en código)
- **Descripción:** No existía una acción de borrado y una eliminación solamente local habría sido revertida por la sincronización de otro dispositivo.
- **Mitigación:** Borrado central de datos personales con marcador multidispositivo sin información del cliente.
- **Estado:** Resuelto, validado y desplegado en producción.

## RSK-010: Baja B2B local e historiales vacíos por identidad incorrecta

- **Fecha:** 2026-08-22
- **Severidad:** Crítica (resuelta)
- **Descripción:** Central HQ retiraba negocios solo del navegador; los pedidos usaban el slug en vez del identificador canónico y las lecturas globales chocaban con el aislamiento RLS.
- **Mitigación:** Baja confirmada en Supabase, persistencia esperada con `business_id` canónico y consultas tenant por negocio.
- **Estado:** Resuelto, desplegado y verificado de extremo a extremo en producción. Los datos desechables de la prueba fueron retirados.

## RSK-011: Negocios eliminados restaurados por una caché móvil antigua

- **Fecha:** 2026-08-22
- **Severidad:** Crítica (resuelta)
- **Descripción:** Al no encontrar un negocio eliminado en el directorio activo, un dispositivo antiguo podía confundirlo con un alta pendiente y volver a sincronizarlo.
- **Mitigación:** Comprobación tenant del registro central y precedencia absoluta de `deleted_at`/estado eliminado antes de cualquier migración local.
- **Estado:** Resuelto, desplegado y probado en producción con caché obsoleta simulada y navegador limpio.
# 2026-08-21 — Activación pendiente de la persistencia corregida

- **Nivel:** crítico hasta validación.
- La migración y el frontend actualizado ya están activos. El riesgo crítico queda pendiente de cerrar hasta validar una alta real en computadora y celular.
- Las credenciales temporales actuales siguen dentro del registro del negocio; antes de una venta masiva debe implementarse autenticación real y retirar ese dato de la lectura del perfil.
