# 🧿 Profile Asset Manifest · StreetBoss

Imágenes de perfil oficiales para todas las redes. **Todas derivan de `brand-core/01_Master_Icon.svg`** (símbolo: menú apilado + flama). No se redibuja, no se añade texto, slogan, comida, marcos ni efectos.

## Archivos maestros (editables, vectoriales)

| Archivo | Fondo | HEX | Uso |
|---|---|---|---|
| [`profile_master_dark.svg`](profile_master_dark.svg) | Boss Charcoal | `#0D0E12` | **Variante principal.** Avatar por defecto en todas las redes. |
| [`profile_master_light.svg`](profile_master_light.svg) | Absolute White | `#FFFFFF` | Variante clara. Fondos claros, watermark, docs. |
| [`profile_master_black.svg`](profile_master_black.svg) | Negro puro | `#000000` | Variante oscura profunda para superficies que lo exijan. |

> Regla de composición: ícono centrado dentro del **área segura circular** (~62% del diámetro). Sin recorte del símbolo. Centrado fino se ajusta al rasterizar (ver nota de exportación).

## Especificación por plataforma

| Plataforma | Carpeta | Dimensión export | Área segura | Variante recomendada | Uso |
|---|---|---|---|---|---|
| Instagram | `instagram/` | 320×320 (subir 1080×1080) | círculo | dark | Foto de perfil circular. |
| Facebook | `facebook/` | 170×170 (subir 1080×1080) | círculo | dark | Página de negocio. |
| TikTok | `tiktok/` | 200×200 (subir 1080×1080) | círculo | dark | Avatar. |
| LinkedIn | `linkedin/` | 400×400 (subir 1080×1080) | círculo | dark | Company page. |
| YouTube | `youtube/` | 800×800 | círculo | dark | Foto del canal. |
| X | `x/` | 400×400 | círculo | dark | Avatar. |
| Pinterest | `pinterest/` | 165×165 (subir 1080×1080) | círculo | dark | Avatar. |
| WhatsApp Business | `whatsapp-business/` | 640×640 (subir 1080×1080) | círculo | dark | Foto de perfil comercial. |

## Exportaciones requeridas (por plataforma)

- Formato: **PNG** (transparencia no aplica, fondo sólido) + **WebP** (optimizado).
- Origen: rasterizar el SVG maestro correspondiente al tamaño de cada plataforma.
- Nomenclatura: `profile_[plataforma]_[variante]_[lado]px.png` — ej. `profile_instagram_dark_1080px.png`.
- Destino de binarios: la carpeta de cada plataforma + copia en `../12-exports/png/` y `../12-exports/webp/`.

## Nota de exportación (producción de binarios)

> El entorno actual no tiene rasterizador instalado (rsvg/inkscape/imagemagick). Los SVG maestros están listos; la conversión a PNG/WebP se ejecuta con el pipeline documentado en [`../11-production-guides/EXPORT_PIPELINE.md`](../11-production-guides/EXPORT_PIPELINE.md). Registrado en `../13-reports/pending_decisions.md`.
> Ajuste de centrado: el contenido del ícono ocupa ~x:100–345, y:100–418 dentro de su viewBox 500×500; al rasterizar, centrar ópticamente el símbolo en el lienzo cuadrado.

## Cumplimiento de marca

- ✅ Deriva de `01_Master_Icon.svg` (no redibujado).
- ✅ Sin texto, slogan, comida, marcos ni efectos.
- ✅ Fondos oficiales (Charcoal / White / Black).
- ✅ Símbolo sin distorsión ni recorte.
