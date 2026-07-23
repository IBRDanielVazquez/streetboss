# 🔎 09 — SEO & Presencia Local · Especificación Funcional

> Que el escaparate del restaurante **aparezca en Google** y ordene su presencia local. Ventaja estructural sobre menús en PDF/imagen (que no indexan).
> Visión general en [`../PRODUCT.md`](../PRODUCT.md).

---

## 1. Objetivo del módulo

Que cada restaurante sea **descubrible** por su comida y su zona, con canal propio, integrando SEO técnico + Google Business como un solo hub de presencia local.

## 2. Alcance por versión

| Versión | Incluye |
|---|---|
| **1.0** | Escaparate indexable, rápido, con metadatos y URLs limpias, schema de restaurante. |
| **2.0** | Asistencia SEO desde el panel (keywords locales), conexión/optimización de Google Business, impulso de reseñas. |
| **3.0** | SEO multi-sucursal y multi-idioma, inteligencia de keywords por zona. |

## 3. SEO técnico (base 1.0)

- Escaparates **indexables** por Google (no bloqueados, no solo imagen/PDF).
- **Velocidad de carga** alta (imágenes optimizadas) — factor de ranking y conversión.
- **Metadatos** por escaparate y por producto (title, description).
- **Schema.org** de Restaurant/Menu/Offer.
- **URLs limpias** y legibles (por negocio, categoría, producto).
- Sitemap, canonical, Open Graph para compartir en redes.

## 4. Google Business (2.0)

- Guía/asistencia para optimizar el perfil de Google Business.
- Sincronizar horarios, fotos y enlace al escaparate.
- Impulsar reseñas (fidelización → reseña).
- Street Boss como **hub** que ordena la presencia local.

## 5. Historias de usuario

- Como **dueño**, quiero que quien busque "tacos en [mi zona]" me encuentre.
- Como **dueño**, quiero que mi escaparate se vea bien al compartirlo (preview).
- Como **dueño** (2.0), quiero mejorar mi Google Business sin ser experto.

## 6. Reglas de negocio

- Todo escaparate nace **SEO-friendly por defecto** (sin que el dueño sepa de SEO).
- La velocidad es prioridad (afecta ranking y conversión).
- Contenido y keywords alineados a la voz de marca (`branding/`).
- Coordinación con la carpeta `seo/` del Studio (core de keywords).

## 7. Criterios de aceptación

- [ ] (1.0) El escaparate es indexable y pasa métricas básicas de velocidad.
- [ ] (1.0) Al compartir el link, se ve un preview correcto (OG).
- [ ] (1.0) Cada producto/categoría tiene metadatos.
- [ ] (2.0) El panel guía la optimización de Google Business.

## 8. Métricas del módulo

Posiciones/impresiones en búsqueda, tráfico orgánico al escaparate, CTR, reseñas generadas, velocidad de carga (Core Web Vitals).

## 9. Dependencias

- **[01-ESCAPARATE.md](01-ESCAPARATE.md)** (lo que se indexa), **[07-MARKETING.md](07-MARKETING.md)** (reseñas/contenido), **[06-IA.md](06-IA.md)** (keywords/textos).
- Carpetas del Studio: `seo/`, `google-business/`.

## 10. Pendientes de aprobación (Daniel)

- [ ] Estructura de URLs (subdominio por restaurante vs. ruta).
- [ ] ¿Dominio propio del restaurante como opción premium?
- [ ] Prioridad de keywords iniciales (coordinar con `seo/`).
