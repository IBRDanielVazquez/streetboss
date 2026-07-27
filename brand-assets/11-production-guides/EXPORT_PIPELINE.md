# 🏭 Pipeline de Exportación · StreetBoss

Cómo convertir los SVG maestros/compuestos a **PNG / WebP / JPG** para redes. **Todo binario deriva de los SVG** (regla `brand-core/05_Brand_Rules.md`).

## Estado actual del entorno

⚠️ El entorno **no tiene rasterizador instalado** (rsvg-convert, Inkscape, ImageMagick, cairosvg). Los SVG (perfiles, portadas, OG, plantillas) **están listos**; la conversión a binarios se ejecuta cuando haya un rasterizador. Registrado en `../13-reports/pending_decisions.md`.

## Opción A — rsvg-convert (recomendada, respeta refs externas y fuentes)

```bash
brew install librsvg webp        # una vez
# Perfil (ejemplo Instagram 1080)
rsvg-convert -w 1080 -h 1080 01-profile-images/profile_master_dark.svg -o 12-exports/png/profile_instagram_dark_1080px.png
cwebp -q 90 12-exports/png/profile_instagram_dark_1080px.png -o 12-exports/webp/profile_instagram_dark_1080px.webp
```

## Opción B — Inkscape

```bash
inkscape 02-cover-images/facebook/cover_facebook_master.svg \
  --export-type=png --export-filename=12-exports/png/cover_facebook.png -w 1640 -h 924
```

## Opción C — Node (resvg / sharp)

```bash
npm i @resvg/resvg-js sharp
node export.js   # script que recorre los SVG y emite PNG+WebP a 12-exports/
```

## Fuentes requeridas para rasterizar el logo

Los SVG de logo usan Helvetica Neue/Arial (texto). Para render idéntico, tener instaladas **Helvetica/Arial**; para piezas de marketing usar **Poppins** (títulos) e **Inter** (cuerpo) — descargables de Google Fonts.

## Tamaños de exportación (resumen)

| Activo | Tamaños |
|---|---|
| Perfiles | 1080×1080 (subir); recortes 400/320/200/170/165 según red |
| FB Cover | 1640×924 |
| LinkedIn Cover | 1128×191 |
| YouTube Art | 2560×1440 (safe 1546×423) |
| X Header | 1500×500 |
| Open Graph | 1200×630 |
| Posts | 1080×1350 / 1080×1080 |
| Reels/Stories/Shorts | 1080×1920 |
| YouTube Thumb | 1280×720 |

## Reglas

- Nunca rasterizar y luego re-editar el logo: siempre partir del SVG maestro.
- WebP para web/redes (peso), PNG para respaldo, JPG solo si la red lo exige.
- Depositar binarios en `12-exports/{png,webp,jpg,video}/` + la carpeta de la red.
