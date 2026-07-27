# 15 — Auditoría de Assets

## Inventario (HECHO)

| Carpeta | Archivos |
|---|---:|
| `brand-assets/` | 443 |
| `brand-operating-system/public/` | 120 |
| `assets/` | 29 |
| `streetboss-web/public/` | 29 |
| `brand-core/` | 12 |
| **Total media (png/webp/jpg/svg/mp4/avif) en repo** | **680** |

Tipos: 267 PNG, 188 WebP, 26 JPG, 18 SVG (+ 127 MD, 8 HTML).

## Estructura de `brand-assets/` (bien organizada ✅)

`00-audit`, `01-profile-images`, `02-cover-images`, `03-open-graph`, `04-social-templates`, `05-calendar`, `06-posts`, `07-reels`, `08-stories`, `09-copy-library`, `10-prompt-library`, `11-production-guides`, `13-reports`, `human-stories-library`, `social`, `ui`, `legacy`, `descartados`, `archive`.

- **Biblioteca de historias humanas:** 12 arquetipos por tipo de negocio (`01-taqueria-callejera` … `12-comida-regional`) — corresponden a las "Historias H01–H12" declaradas (nomenclatura por negocio, no H01–H12). Incluye `approved/`, `rejected/`, `exports/` y `REVIEW_HUMAN_STORIES_PILOT.html`. Buen sistema de curación.
- `09-copy-library/COPY_LIBRARY.md` y `10-prompt-library/PROMPT_LIBRARY.md` — bibliotecas fuente (candidatas a fuente de verdad de contenido).

## Hallazgos

| # | Severidad | Hallazgo |
|---|---|---|
| A1 | P0-02 | **0 de las 325 imágenes de posts existen.** `assets.json` del dashboard solo contiene config de marca (4 claves), no imágenes de piezas. Toda pieza en `posts.json` es "IMAGEN PENDIENTE". |
| A2 | P3 | Carpetas `legacy/`, `descartados/`, `archive/`, `00-audit` mezclan versiones oficiales y no oficiales — riesgo de usar un asset descartado. |
| A3 | P2 | Existe un **5º generador** (`brand-assets/build_editorial_system.py`, 51 KB) además de los 4 `.cjs` — más fragmentación del pipeline. |
| A4 | — | No se calcularon dimensiones/hash de las 680 imágenes (muestreo de hash no encontró duplicados exactos en la muestra de 40). |

## Registro (muestra)

No se auditó pieza por pieza (680 archivos) por alcance de tiempo; el hallazgo dominante (A1) hace secundario el detalle: **la biblioteca de marca existe y está bien estructurada, pero la producción de las 325 piezas del calendario no ha comenzado.**

**Veredicto:** activos de **marca** presentes y ordenados (40/100 por la ausencia total de producción de calendario). Variantes no oficiales conviven con oficiales (riesgo de curación).
