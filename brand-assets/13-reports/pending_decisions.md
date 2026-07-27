# ⏳ Decisiones Pendientes · StreetBoss (Sistema de Lanzamiento)

Aplicando la regla del brief: ante una decisión no documentada, se toma la **alternativa más conservadora**, no se declara oficial, y se registra aquí para aprobación de Daniel.

| # | Tema | Decisión conservadora aplicada | Necesita aprobación de Daniel |
|---|---|---|---|
| 1 | **Fecha de inicio del calendario** | Se fijó el próximo lunes: **2026-07-27**. Configurable en `build_editorial_system.py` (`START_DATE`). | Confirmar fecha real de arranque. |
| 2 | **Producción de binarios (PNG/WebP/JPG)** | No hay rasterizador en el entorno. Se entregan **SVG maestros/compuestos + pipeline** listos (`11-production-guides/EXPORT_PIPELINE.md`). No se fabricaron binarios. | Autorizar instalar rasterizador (librsvg) y correr el pipeline. |
| 3 | **Fotografía FoodPorn por IA** | No se generaron imágenes. Se entregan **prompts** por día/pieza (sin logo). | Autorizar generación con herramienta de imagen (y presupuesto). |
| 4 | **Contradicción logo: wordmark vs. símbolo** | Manda el SVG maestro (`01_Master_Logo.svg` con símbolo menú+flama). Brand Book desactualizado. | Confirmar y, si procede, actualizar `02_BRAND_BOOK.md`. |
| 5 | **Contradicción isotipo: "SB" vs. ícono** | Manda `01_Master_Icon.svg` (menú+flama). | Confirmar. |
| 6 | **Color naranja `#FF5722` (Brand Book) vs `#FF4B00` (Color System)** | Se usó el oficial **`#FF4B00`**. | Confirmar y actualizar Brand Book. |
| 7 | **Eslogan principal** | Se priorizó "Vende directo. Manda tú." (B2B, brief DG) + "Así se ve tu menú antes de que lleguen." (aspiracional). | Definir jerarquía oficial de eslóganes. |
| 8 | **Plataforma primaria = Instagram** | Todas las piezas nacen en IG y se adaptan (FB/TikTok/LinkedIn/YT). LinkedIn B2B semanal vía adaptación (domingo comercial + martes documento). | ¿Quieres piezas nativas primarias de LinkedIn/TikTok en vez de adaptaciones? |
| 9 | **Docs previos en `branding/`** (paleta Brasa, Anton) | Quedan **superados** por `brand-core/`. Se conservan como historial, no se borran. | ¿Archivar/retirar `branding/` para evitar confusión? |
| 10 | **Handle/usuario de redes** | Se usó `@streetboss` como placeholder en plantillas. | Confirmar handles reales por red. |
| 11 | **Número de WhatsApp oficial / link del escaparate** | Los CTAs dicen "Escríbenos por WhatsApp" sin número. | Proveer número y URL reales para insertar. |
| 12 | **Testimonios / casos reales** | No se inventaron. Plantilla `testimonial/` queda **reservada y vacía**; datos marcados como CASO ILUSTRATIVO. | Aportar testimonios reales cuando existan. |

> Nada de lo anterior bloquea el sistema editorial: el calendario, copys, guiones, prompts y estructura están completos y listos para producción diaria.
