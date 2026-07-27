# 20 — Hoja de Ruta de Remediación (PROPUESTA — no ejecutada)

> No se ejecutó ninguna corrección. Esto es un plan por fases.

## FASE A — Bloqueos críticos (P0)
- A1. Verificar visibilidad del repo GitHub; si es público, rotar `VITE_SUPABASE_ANON_KEY`, confirmar RLS y purgar `.env` del historial.
- A2. Congelar la regeneración: dejar de correr los generadores hasta unificarlos (evitar sobrescribir `posts.json`).
- A3. Commit del estado actual en una rama de trabajo nombrada (salir de la rama "respaldo").

## FASE B — Fuente de verdad
- B1. Decidir fuente canónica: `posts.json` como única fuente **o** los `.ts` como fuente y `posts.json` derivado (una sola dirección).
- B2. Eliminar/archivar los artefactos huérfanos (`masterCalendar.ts`, `calendar/*.ts`) si no son la fuente.
- B3. Crear `CONTENT_SCHEMA.md` con todos los campos (incluyendo funnel/objective/audience/alt/cover).
- B4. Consolidar los 5 generadores en **uno** determinista (semilla fija, preserva IDs/estado/aprobaciones).

## FASE C — Producto y marca
- C1. Formalizar `BRAND_BOOK.md` y `PRODUCT.md` a partir de `REGLAS_NEGOCIO.md` + UI.
- C2. Corregir la narrativa "app" → "escaparate web" en prompts/movimiento.
- C3. Unificar naming del proyecto.

## FASE D — Copy
- D1. Expandir de 45 a un pool suficiente para 90 días sin repetición perceptible.
- D2. Adaptar copy por plataforma (tono/longitud/hashtags por red).
- D3. Variar CTAs por etapa de embudo.

## FASE E — Prompts
- E1. Limpiar tecnicismo forzado (ARRI/Alexa/Deakins) en foto fija.
- E2. Definir **un** negative prompt maestro documentado + restricciones específicas por pieza.
- E3. Enlazar el generador "advanced" (prompts ricos) a la fuente real.
- E4. **Estándar "áreas limpias" obligatorio (indicación del dueño):** todo prompt de imagen debe declarar entorno limpio y ordenado, y el negative debe prohibir el desorden.
  - Positivo: «Entorno limpio y ordenado, superficies despejadas, *mise en place* impecable, sin desorden, espacio de trabajo pulcro.»
  - Negativo: «desorden, superficies sucias, cocina desordenada, objetos amontonados, basura, cables sueltos, caos visual.»

## FASE F — UX
- F1. Añadir pantallas LinkedIn/YouTube (o retirar esas redes del dataset).
- F2. Layout responsivo para escritorio.
- F3. Poblar ALT por pieza; auditar con axe.

## FASE G — Rendimiento
- G1. Sacar `posts.json` del bundle (fetch/paginado/backend).
- G2. Code-splitting por ruta.

## FASE H — Seguridad
- H1. Cerrar R-04 (claves, RLS, historial).
- H2. Evaluar si la estrategia editorial debe dejar de servirse públicamente.

## FASE I — Producción visual
- I1. Producir imágenes por lotes usando la biblioteca de historias humanas (12 arquetipos) y guías.
- I2. Curar contra `approved/` y bloquear `descartados/legacy`.

## FASE J — Lanzamiento
- J1. Verificar cuentas de redes reales y dominio.
- J2. QC final (checklist 21) antes de publicar.
