# 🧩 Sistema de Plantillas Maestras · StreetBoss

Plantillas **reutilizables** que respetan `brand-core/`. Ninguna pieza se diseña desde cero: toda publicación declara qué plantilla usa (ver campo `master_file` / `Plantilla` en el calendario y en cada archivo de post/reel).

## Reglas comunes a TODAS las plantillas

- **Colores:** solo `#FF4B00` (Street Orange), `#0D0E12` (Boss Charcoal), `#FF6A1A` (hover/acento), `#FFFFFF`. Sin degradados, brillos ni sombras.
- **Tipografía:** Poppins (títulos, ExtraBold/Bold) + Inter (cuerpo/UI).
- **Logo:** SOLO desde SVG maestro de `brand-core/`. Fondo oscuro → `01_Master_Logo_Dark.svg`; fondo claro → `01_Master_Logo.svg`/`_Light.svg`; avatar/reducido → `01_Master_Icon.svg`. Nunca regenerar ni alterar.
- **Regla 80/20 (UI_SYSTEM):** en piezas con comida, ≤20% del peso visual es interfaz/texto; 80% comida.
- **Mobile-first:** legibilidad extrema, alto contraste (WCAG ≥4.5:1).
- **Sin rostros protagonistas** (IMAGE_SYSTEM). Manos, platillos, empaques, cocinas, dispositivos: permitidos.

## Catálogo de plantillas (20)

| # | Plantilla | Carpeta | Uso | Formato base |
|---|---|---|---|---|
| T01 | **Pain / Dolor** | `pain/` | Reels y posts de dolor operativo | 1080×1920 / 1080×1350 |
| T02 | **Problema** | `pain/` | Variante de agitación del problema | 1080×1350 |
| T03 | **Comparativa** | `comparison/` | Menú QR vs. StreetBoss, App vs. Directo | 1080×1350 |
| T04 | **Manifiesto** | `brand/` | Frases de manifiesto/eslogan | 1080×1350 |
| T05 | **Producto / Demo** | `product/` | Demos de la interfaz y capacidades | 1080×1920 |
| T06 | **FoodPorn** | `foodporn/` | Fotografía gastronómica premium | 1080×1920 / 1080×1080 |
| T07 | **Carrusel Educativo** | `carousel/` | Educación multi-slide | 1080×1350 ×N |
| T08 | **Dato** | `data/` | Estadística/afirmación fuerte | 1080×1350 |
| T09 | **Educación** | `education/` | Tips y guías breves | 1080×1350 |
| T10 | **Cultura / Marca** | `brand/` | Valores, comunidad, pertenencia | 1080×1350 |
| T11 | **Objeción** | `commercial/` | Manejo de objeciones (FAQ) | 1080×1350 |
| T12 | **Caso ilustrativo** | `case-study/` | Escenario ilustrativo (no testimonio real) | 1080×1350 |
| T13 | **Precio Fundador** | `commercial/` | Oferta ancla $100 MXN/mes | 1080×1350 |
| T14 | **CTA** | `commercial/` | Cierre con llamada a la acción | 1080×1080 |
| T15 | **Testimonio (futuro)** | `testimonial/` | Reservado. Vacío hasta tener testimonios reales | 1080×1350 |
| T16 | **Reel Cover** | `reel-cover/` | Portada/frame 1 de Reels | 1080×1920 |
| T17 | **Story** | `stories/` | Stories diarias | 1080×1920 |
| T18 | **LinkedIn Document** | `carousel/` | Carrusel B2B en PDF/documento | 1080×1350 ×N |
| T19 | **YouTube Thumbnail** | `product/` | Miniatura de video | 1280×720 |
| T20 | **Open Graph** | `../03-open-graph/` | Preview al compartir link | 1200×630 |

## Anatomía estándar (grid)

```
┌───────────────────────────────┐  Zona superior: logo (SVG maestro) + kicker
│  [LOGO]            kicker      │
│                               │
│      TITULAR (Poppins         │  Zona media: titular de máx. impacto
│      ExtraBold, naranja/      │  (1 idea, alto contraste)
│      blanco sobre charcoal)   │
│                               │
│   apoyo / dato (Inter)        │  Zona de apoyo
│                               │
│  [ COMIDA / MOCKUP / VISUAL ] │  Protagonista visual (80%) en food
│                               │
│   CTA discreto  ·  @streetboss│  Zona inferior: CTA + handle
└───────────────────────────────┘
```

## Cómo usar

1. En el calendario, cada día trae su `Plantilla`.
2. Abre la plantilla concreta (`pain/T01-pain.md`, etc.) → toma el layout.
3. Genera el fondo/escena con el prompt del día (sin logo).
4. Integra el logo con el SVG maestro correcto.
5. Exporta según `../11-production-guides/EXPORT_PIPELINE.md`.
6. Marca el checklist de calidad del archivo del día.

> Los archivos concretos de plantilla viven en cada subcarpeta: `pain/`, `product/`, `foodporn/`, `carousel/`, `data/`, `brand/` (cultura), `commercial/`.
