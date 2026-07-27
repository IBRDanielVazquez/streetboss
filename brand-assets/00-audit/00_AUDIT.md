# 🔍 00 — Auditoría Inicial · Sistema de Lanzamiento StreetBoss

**Fecha:** 2026-07-21 · **Ejecutor:** Dirección General + Equipo Senior (Claude) · **Ruta:** `streetboss-studio/brand-assets/`

---

## 1. Fuente de verdad leída (brand-core/)

| Archivo | Estado | Dato clave extraído |
|---|---|---|
| `00_BRAND_IDENTITY_SYSTEM.md` | ✅ leído | Brand Core = única fuente de verdad visual. |
| `01_Master_Logo.svg` | ✅ leído | Wordmark **"StreetBoss."** + símbolo (menú apilado de 3 tarjetas + flama). viewBox 1500×500. |
| `01_Master_Icon.svg` | ✅ leído | Símbolo solo (3 tarjetas + flama + pills). viewBox 500×500. Para avatares/favicon. |
| `01_Master_Logo_Dark.svg` / `_Light.svg` | ✅ presentes | Variantes de fondo. |
| `02_Color_System.md` | ✅ leído | **#FF4B00** / **#0D0E12** / **#FF6A1A** / **#FFFFFF**. Sin degradados, brillos ni sombras. |
| `03_Typography.md` | ✅ leído | **Poppins** (títulos, Bold/ExtraBold) + **Inter** (cuerpo/UI). |
| `04_Logo_Clearspace.md` | ✅ leído | Símbolo = "Menú Apilado con Flama", 100% Flat. Cero 3D/bisel/textura. |
| `05_Brand_Rules.md` | ✅ leído | Prohibido regenerar/vectorizar/redibujar el logo. Exportaciones derivadas de los SVG maestros. |

## 2. Knowledge Pack leído (streetboss-gpt/)

`01_MASTER_BOOK` (Constitución) · `02_BRAND_BOOK` · `03_UI_SYSTEM` · `04_IMAGE_SYSTEM` · `05_LAUNCH_PLAN` · `06_BRAND_ASSET_SYSTEM` · `07_AI_PROMPT_LIBRARY` · `08_PRODUCT` · `09_ROADMAP` · `10_FAQ` — **todos leídos.**

## 3. Activos preexistentes (conservados, no borrados)

- `brand-assets/legacy/` → 29 archivos (conservados).
- `brand-assets/descartados/` → 3 archivos (conservados).
- `brand-assets/propuestas/` → conservada.
- `branding/` (docs previos: 01-ADN, 02-LOGO, 03-COLORS…) → **superados por brand-core** en color/tipografía; se conservan como historial.

## 4. Contradicciones detectadas (registradas, no detienen la ejecución)

> Ver detalle y resolución en [`../13-reports/pending_decisions.md`](../13-reports/pending_decisions.md) y [`../13-reports/brand_compliance_report.md`](../13-reports/brand_compliance_report.md).

1. **Naturaleza del logo:** `02_BRAND_BOOK` dice "wordmark puro, sin símbolo"; los SVG maestros y `04_Logo_Clearspace` incluyen el símbolo (menú+flama). → **Resolución:** manda el SVG maestro (jerarquía brand-core). Se usa el logo tal cual está en `01_Master_Logo.svg`.
2. **Isotipo:** `02_BRAND_BOOK` dice isotipo = monograma "SB"; `01_Master_Icon.svg` es el símbolo menú+flama. → **Resolución:** manda `01_Master_Icon.svg`.
3. **Color naranja:** `02_BRAND_BOOK` menciona `#FF5722`; oficial `02_Color_System` = `#FF4B00`. → **Resolución:** `#FF4B00`.
4. **Tipografía:** `branding/04-TYPOGRAPHY.md` previo proponía Anton/Montserrat; brand-core = Poppins/Inter. → **Resolución:** Poppins/Inter.
5. **Slogan:** `02_BRAND_BOOK` slogan principal = "Así se ve tu menú antes de que lleguen"; brief del DG + B2B = "Vende directo. Manda tú." → **Resolución:** ambos válidos por contexto (B2C aspiracional vs. B2B); se documentan como sistema de eslóganes.

## 5. Capacidades técnicas del entorno

- ✅ SVG (vector) — producible nativamente.
- ✅ Python 3 / Node — disponibles para generar el sistema editorial (patrón ya usado en el repo: `build_*.py`).
- ⚠️ Rasterizadores (rsvg-convert, ImageMagick, Inkscape, cairosvg) — **no instalados**. Los binarios PNG/WebP/JPG y la fotografía FoodPorn por IA quedan como **producción pendiente** con pipeline y specs listos. Registrado en `pending_decisions.md` con alternativa conservadora.

## 6. Veredicto

`brand-core/` **intacto**. Arquitectura `brand-assets/` creada completa. Se procede a construir el sistema editorial de 90 días sin alterar la fuente de verdad.
