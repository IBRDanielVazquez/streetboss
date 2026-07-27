# 18 — Información Faltante

## Documentación fuente ausente (P0-03)
`01_MASTER_BOOK.md`, `02_BRAND_BOOK.md`, `03_UI_SYSTEM.md`, `04_IMAGE_SYSTEM.md`, `05_LAUNCH_PLAN.md`, `06_BRAND_ASSET_SYSTEM.md`, `07_AI_PROMPT_LIBRARY.md`, `08_PRODUCT.md`, `09_ROADMAP.md`, `10_FAQ.md`, `CONTENT_SCHEMA.md`, `VISUAL_PROMPT_STANDARD.md`, `SOCIAL_NETWORK_RULES.md`, `ASSET_NAMING_SYSTEM.md`, `QUALITY_CONTROL.md`.

## Rutas declaradas inexistentes
`streetboss-gpt/`, `archive/`, `legacy/` (a nivel raíz).

## Campos de datos ausentes (0% en `posts.json`)
`campaign`, `objective`, `audience`, `funnel`, `imageText`, `alt`, `pinnedComment`, `visualConcept`, `safeZone`, `path`, `cover`, `productionStatus`.

## Producción ausente
- 0/325 imágenes; 0/91 videos.
- Guiones de video (escenas, duración, audio, portada).

## Verificaciones no realizadas (fuera de alcance / requieren acceso externo)
- Visibilidad pública/privada del repo GitHub.
- Configuración RLS de Supabase.
- Existencia/verificación real de cuentas @streetboss.mx, @StreetBossMX, TikTok, y línea WhatsApp Business.
- Resolución/propiedad del dominio `streetboss.com.mx`.
- Logs, alias y versiones en la cuenta Vercel.
- Lighthouse / axe / prueba en Safari iOS real / tablets.
- Auditoría pieza-por-pieza de las 680 imágenes (dimensiones/peso/hash completo).
- Auditoría a fondo de `streetboss-web/` (Next.js, el producto/landing) y de la app Vite legacy raíz.

## Datos necesarios para cerrar la auditoría
1. ¿El repo es público? (define severidad de seguridad).
2. ¿RLS activa en Supabase?
3. ¿Cuál es la fuente de verdad canónica querida: `posts.json` o los `.ts`?
4. ¿Cuál de los 5 generadores es el oficial?
