# 🗂️ Convención de Nombres y Operación Diaria · StreetBoss

## Nomenclatura de archivos

| Tipo | Patrón | Ejemplo |
|---|---|---|
| Post / Carrusel | `day-NN_<slug-tema>_<tipo>.md` | `day-04_0-de-comision_data.md` |
| Reel / Short | `day-NN_<slug-tema>_<tipo>.md` | `day-05_tacos-al-pastor-en-camara-lenta_foodporn.md` |
| Export imagen | `day-NN_<slug-tema>_<tipo>.png` / `.webp` | `day-06_el-que-cocina-manda_culture.webp` |
| Portada Reel | `day-NN_<slug-tema>_<tipo>_cover.png` | `day-03_..._product_cover.png` |
| Story | `day-NN_storyM.png` | `day-01_story1.png` |
| Perfil | `profile_<red>_<variante>_<lado>px.png` | `profile_instagram_dark_1080px.png` |
| Portada | `cover_<red>_master.svg` → `cover_<red>.png` | `cover_facebook.png` |

`<tipo>` ∈ {pain, product, foodporn, carousel, data, culture, commercial}.

## Flujo de producción diaria (SOP)

1. Abre el día en `05-calendar/streetboss_calendar_90_days.md` (o el CSV en tu gestor).
2. Abre el archivo individual en `06-posts/` o `07-reels/`.
3. Genera el visual con el **prompt del día** (escena sin logo).
4. Integra el logo con el SVG maestro correcto (ver `LOGO_INTEGRATION.md`).
5. Exporta (ver `EXPORT_PIPELINE.md`) a `12-exports/` + carpeta de la red.
6. Programa según `publication_time` y adapta por plataforma.
7. Marca el **checklist de calidad** del archivo → cambia `status` a LISTO (nunca "publicado" desde aquí).
8. Aprobación: solo Daniel cambia `approval` a APROBADO.

## Importar el calendario a tu gestor

- **Google Sheets / Excel:** abrir `streetboss_calendar_90_days.csv`.
- **Airtable / Notion / ClickUp:** importar el mismo CSV (30 columnas mapeables).
- **Trello:** vía automatización (Zapier/Make) usando el CSV/JSON.
- **Vista rápida:** abrir `streetboss_calendar_90_days.html` en el navegador.

## Estados

`PENDIENTE → EN PRODUCCIÓN → LISTO → (APROBADO por Daniel) → PROGRAMADO`.
Nada se marca como publicado automáticamente.
