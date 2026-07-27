# 06 — Auditoría del Calendario

Fuente: `brand-operating-system/src/data/posts.json` (325 objetos).

## Volumen y distribución — CONFIRMADO ✅

| Métrica | Declarado | Real |
|---|---:|---:|
| Publicaciones | 325 | **325** |
| Instagram | 130 | **130** |
| Facebook | 78 | **78** |
| TikTok | 39 | **39** |
| WhatsApp | 39 | **39** |
| LinkedIn | 26 | **26** |
| YouTube | 13 | **13** |
| Con `motionPrompt` (video) | 91 | **91** |
| Semanas | 13 | 13 (campo `week` 1–13) |

Las cifras de cabecera del proyecto son **exactas**. Aquí termina la buena noticia.

## Validación de campos por publicación

El schema real de cada post es: `id, network, format, pilar, date, time, week, status, title, hook, copy, cta, hashtags, imagePrompt, negativePrompt, filename, resolution` (+`motionPrompt` en videos).

### Completitud vs. schema declarado en el brief

| Campo declarado | Presencia | Nota |
|---|---:|---|
| id, date, time, week, network, format, pilar, status, hook, title, copy, cta, hashtags, imagePrompt, negativePrompt, filename, resolution | 100% | Presentes |
| motionPrompt | 28% (91/325) | Solo videos — correcto |
| **campaign** | 0% | Ausente |
| **objective** | 0% | Ausente |
| **audience** | 0% | Ausente |
| **funnel** (embudo) | 0% | Ausente |
| **imageText** (texto de imagen) | 0% | Ausente |
| **alt** (accesibilidad) | 0% | Ausente |
| **pinnedComment** | 0% | Ausente |
| **visualConcept** | 0% | Ausente |
| **safeZone** | 0% | Ausente (aunque se menciona dentro de prompts) |
| **path / ruta** | 0% | Ausente (solo `filename`) |
| **cover** (portada) | 0% | Ausente |
| **productionStatus** | 0% | Ausente (todo es `status: "IMAGEN PENDIENTE"`) |

**Hallazgo (P2-03):** 13 de los ~30 campos que el brief espera **no existen**. El calendario es más delgado de lo declarado: no hay embudo, objetivo, audiencia, ALT ni concepto visual por pieza.

## Estado de producción — CONFIRMADO ❌

- **325/325** posts en `status: "IMAGEN PENDIENTE"`. Ningún post está aprobado, en revisión o publicado. **0% de avance de producción.**

## Campos "llenos sin valor"

- `hook` = `copy` truncado en muchos casos (el hook es la primera línea Unicode del copy, no un gancho independiente).
- `hashtags`: **un único set idéntico** para las 325 piezas (ver [07](07_COPY_AUDIT.md)).
- `filename`: presente pero apunta a archivos **inexistentes** (0 imágenes producidas).

**Veredicto:** el calendario es correcto en **estructura temporal y volumen**, pero **hueco en estrategia por pieza** (sin embudo/objetivo/audiencia) y **sin producción** (0 imágenes).
