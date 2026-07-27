# 01 — Resumen Ejecutivo

**Fecha:** 2026-07-27 · **Modo:** Auditoría de solo lectura · **Producto NO modificado.**

---

## Veredicto en una frase

**El "Command Center" es una envoltura visual sólida sobre un dataset masivamente duplicado: el sistema declara 325 piezas únicas, pero el contenido real se reduce a ~45 copys, ~62 prompts, 5 hooks, 3 CTAs, 1 negative prompt y 1 prompt de movimiento. El volumen es real; la unicidad NO.**

## Estado general

| Dimensión | Estado |
|---|---|
| Infraestructura / build | ✅ Funciona (tsc + vite build OK) |
| Dashboard UX (móvil) | ✅ Limpio, iOS-style, sin errores de consola |
| Volumen de piezas | ✅ 325 exactas, distribución por red correcta |
| **Unicidad de contenido** | ❌ **Colapsada** (ver P0-01) |
| **Documentación oficial** | ❌ **Inexistente** (01_MASTER_BOOK…10_FAQ no existen) |
| **Seguridad (git)** | ⚠️ `.env` versionado en el historial |
| Producción visual | ❌ 0/325 imágenes producidas (todas "IMAGEN PENDIENTE") |

## Puntuación global: **41 / 100** — *No apto para lanzamiento sin remediación.*

### Puntuaciones por dimensión (metodología al final)

| Dimensión | Score | Nota |
|---|---:|---|
| Producto (fidelidad a la definición) | 72 | El concepto es correcto; el contenido lo diluye |
| Marca | 68 | Paleta/tono/tagline coherentes; términos prohibidos respetados en UI |
| Contenido (volumen vs. valor) | 22 | Volumen inflado por duplicación procedural |
| Copy | 30 | 45 únicos, 43 reutilizados entre redes, sin adaptación por plataforma |
| Prompts visuales | 25 | 62 únicos; tecnicismo forzado (ARRI 283/325) |
| Visual / assets | 40 | Buenos brand-assets; 0 imágenes de las 325 producidas |
| UX móvil | 78 | Fuerte mobile-first |
| UX escritorio | 45 | No adapta layout; columna móvil fija |
| Accesibilidad | 50 | Sin ALT en 325 piezas; contraste OK, no auditado con axe |
| Tecnología | 62 | Stack simple y correcto; imports huérfanos |
| Rendimiento | 38 | Bundle 2.68 MB (posts.json embebido en cliente) |
| Seguridad | 45 | `.env` en git; estrategia/prompts públicos en bundle |
| Escalabilidad | 35 | 4 generadores en conflicto con `Math.random()` |
| Operación | 40 | Sin fuente de verdad única; regenerar destruye ediciones |
| Conversión | 48 | Embudo sin campos (funnel/objective 0%) |
| Preparación lanzamiento | 30 | Bloqueado por contenido y producción visual |

---

## Hallazgos por severidad

### 🔴 P0 — Críticos

- **P0-01 · Unicidad de contenido colapsada.** 325 posts contienen solo **45 copys únicos** (43 reutilizados en más de una red), **62 imagePrompts únicos** (324/325 en grupos duplicados exactos), **5 hooks**, **3 CTAs**, **1 negativePrompt** y **1 motionPrompt** para los 91 videos. *Evidencia:* [data/content-analysis.json](data/content-analysis.json), [07](07_COPY_AUDIT.md), [08](08_PROMPT_AUDIT.md).
- **P0-02 · Cero producción visual.** Los 325 posts tienen `status: "IMAGEN PENDIENTE"`. No existe ninguna de las 325 imágenes/videos. El sistema es un plan, no un inventario listo para publicar.
- **P0-03 · No existe documentación oficial.** Ninguno de los documentos fuente declarados (`01_MASTER_BOOK.md` … `10_FAQ.md`, `CONTENT_SCHEMA.md`, `VISUAL_PROMPT_STANDARD.md`, `SOCIAL_NETWORK_RULES.md`, `QUALITY_CONTROL.md`) existe en el repo. No hay fuente de verdad formal.

### 🟠 P1 — Altos

- **P1-01 · `.env` versionado en git** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Presente en el historial pese a estar en `.gitignore`. Remoto: GitHub `IBRDanielVazquez/streetboss`. Rotar claves y purgar historial. Ver [13](13_SECURITY_AUDIT.md).
- **P1-02 · Cuatro generadores en conflicto** (`generateData.cjs`, `generateDataUnique.cjs`, `generateCalendar.cjs`, `generateCalendarAdvanced.cjs`) escriben a los mismos destinos con `Math.random()`. No reproducibles; **cualquier regeneración sobrescribe `posts.json` y destruye ediciones manuales**.
- **P1-03 · Doble fuente desincronizada.** `masterCalendar.ts` (2.66 MB) NO es importado por la app; el dashboard consume `posts.json`. Dos "fuentes" paralelas que pueden divergir.
- **P1-04 · Bundle 2.68 MB.** Todo `posts.json` (prompts + estrategia) se embebe en el JS del cliente y queda **público** en Vercel.

### 🟡 P2 — Medios

- **P2-01 · Copy idéntico entre redes.** 43/45 copys se publican en más de una plataforma sin adaptación. Riesgo de duplicado penalizado y percepción de spam.
- **P2-02 · Tecnicismo cinematográfico forzado.** ARRI en 283/325 prompts, "Roger Deakins" (cinematógrafo) en 159, Zeiss 159, Kodak Portra 166 — sobre **fotografía fija**.
- **P2-03 · 12 campos del schema al 0%** (campaign, objective, audience, funnel, alt, imageText, safeZone, cover, productionStatus, path, pinnedComment, visualConcept).
- **P2-04 · LinkedIn y YouTube inalcanzables en la UI.** El nav inferior solo expone 5 de 6 redes; 39 posts (12%) no son navegables.
- **P2-05 · Naming inconsistente.** La carpeta `brand-operating-system/` despliega como proyecto Vercel `streetboss-social-command-center`.

### 🟢 P3 — Bajos

- **P3-01 · Tailwind `content` vacío** → warning de build, CSS potencialmente incompleto.
- **P3-02 · Escritorio no responsivo** (columna móvil fija en 1440px).
- **P3-03 · Archivos de auditoría/basura en raíz** (`audit_results.txt`, `test_error.cjs`, `capture_ui.cjs`, `scratch/`).
- **P3-04 · Repo monolítico** mezcla dashboard, landing (`streetboss-web`), brand-assets y experimentos en un solo git.

---

## Conteos reales (verificados)

| Métrica | Declarado | Real | Veredicto |
|---|---:|---:|---|
| Publicaciones | 325 | **325** | ✅ HECHO |
| Distribución IG/FB/TT/WA/LI/YT | 130/78/39/39/26/13 | **130/78/39/39/26/13** | ✅ HECHO |
| Copys únicos | 325 | **45** | ❌ FALSO |
| Copys publicables sin edición | 325 | **~0** (ninguno adaptado por red) | ❌ FALSO |
| Prompts visuales únicos | 325 | **62** | ❌ FALSO |
| Prompts utilizables (sin tecnicismo forzado) | 325 | **~42** (los sin ARRI) | ❌ FALSO |
| Negative prompts distintos | 325 | **1** | ❌ FALSO |
| Prompts de movimiento distintos | 91 | **1** | ❌ FALSO |
| Imágenes producidas | — | **0 / 325** | DATO |
| Duplicados exactos (imagePrompt) | — | **324/325** | HECHO |
| Duplicados semánticos (copy, Jaccard≥0.5) | — | **17.474 pares** | HECHO |

---

## Confirmación

No se modificó ningún archivo del producto (calendario, posts, prompts, dashboard, landing, Supabase, Vercel, DNS). Los únicos archivos creados están bajo `audits/2026-07-27-sbos-master-audit/` más dos `launch.json` de preview local (no afectan el producto). Ver [21](21_ACCEPTANCE_CHECKLIST.md).

## Metodología de puntuación

Cada dimensión se puntúa 0–100 combinando: (a) cumplimiento verificable por evidencia, (b) proporción de contenido único vs. duplicado, (c) completitud de campos, (d) severidad de riesgos abiertos. La puntuación global es el promedio ponderado con prioridad Producto > Marca > UX > Contenido según las prioridades declaradas del proyecto, penalizado por los P0 abiertos.
