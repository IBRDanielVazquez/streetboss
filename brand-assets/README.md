# 🚀 StreetBoss · Sistema de Lanzamiento Digital (brand-assets/)

Producción y activos derivados de la marca. **Fuente de verdad inmutable: [`../brand-core/`](../brand-core/).** Aquí NO se altera el logo, los colores ni la tipografía; se **usan** y se produce sobre ellos.

> Eslóganes: **"Vende directo. Manda tú."** · **"Así se ve tu menú antes de que lleguen."**
> Categoría: **plataforma visual de venta directa para restaurantes** (no menú QR, no marketplace, no delivery, no POS).

## Mapa del sistema

| Carpeta | Contenido |
|---|---|
| `00-audit/` | Auditoría inicial + lectura de fuente de verdad. |
| `01-profile-images/` | Fotos de perfil (SVG maestros + manifiesto) para 8 redes. |
| `02-cover-images/` | Portadas (SVG + briefs) FB · LinkedIn · YouTube · X · WhatsApp. |
| `03-open-graph/` | Imagen Open Graph (preview al compartir link). |
| `04-social-templates/` | Sistema de 20 plantillas maestras reutilizables. |
| `05-calendar/` | **Calendario editorial 90 días** (MD · CSV · JSON · HTML). |
| `06-posts/` | 51 archivos individuales de posts/carruseles/gráficas. |
| `07-reels/` | 39 archivos individuales de Reels (guion de 7 tomas c/u). |
| `08-stories/` | Stories diarias por mes (90 días). |
| `09-copy-library/` | Copys listos para publicar. |
| `10-prompt-library/` | Prompts paramétricos (FoodPorn, mockups, fondos, covers…). |
| `11-production-guides/` | Export pipeline · integración de logo · nomenclatura/SOP. |
| `12-exports/` | Binarios exportados (png/webp/jpg/video) — pendientes de rasterizado. |
| `13-reports/` | Calidad · cobertura · cumplimiento · pendientes · manifiesto. |
| `build_editorial_system.py` | Generador reutilizable de todo el sistema editorial. |

## Cómo empezar

1. Lee [`00-audit/00_AUDIT.md`](00-audit/00_AUDIT.md) y [`13-reports/final_quality_report.md`](13-reports/final_quality_report.md).
2. Abre el calendario: [`05-calendar/streetboss_calendar_90_days.html`](05-calendar/streetboss_calendar_90_days.html) (vista) o el `.csv` (para tu gestor).
3. Para producir un día: abre su archivo en `06-posts/` o `07-reels/` → genera visual con el prompt → integra logo (SVG maestro) → exporta.
4. Regenerar todo: `python3 build_editorial_system.py`.

## Reglas de oro

- Logo solo desde `brand-core/` (fondo oscuro → `01_Master_Logo_Dark.svg`). Nunca regenerar.
- Colores: `#FF4B00` · `#0D0E12` · `#FF6A1A` · `#FFFFFF`.
- Tipografía: Poppins (títulos) + Inter (cuerpo).
- Sin jerga SaaS, sin funciones inventadas, sin dark patterns.
- Estado inicial de todo: **PENDIENTE / NO APROBADO** (solo Daniel aprueba).

## Pendiente de Daniel

Ver [`13-reports/pending_decisions.md`](13-reports/pending_decisions.md): fecha de inicio, número de WhatsApp/URL, handles, autorización de binarios y de fotografía IA, eslogan oficial.
