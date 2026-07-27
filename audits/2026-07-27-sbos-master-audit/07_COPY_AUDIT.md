# 07 — Auditoría de Copy (325 piezas)

Métricas de [data/content-analysis.json](data/content-analysis.json).

## Unicidad real (HECHO)

| Campo | Presentes | **Valores únicos** | Grupos duplicados |
|---|---:|---:|---:|
| hook | 325 | **5** | 5 (325 items) |
| copy | 325 | **45** | 45 (325 items) |
| cta | 325 | **3** | 3 (325 items) |
| title | 325 | 90 | 84 |
| hashtags | 325 | **1** | 1 (todos idénticos) |

- **45 copys únicos** distribuidos en 325 posts ⇒ cada copy se repite ~7 veces en promedio.
- **43 de esos 45 copys aparecen en más de una red** (copy idéntico entre Instagram, Facebook, LinkedIn, etc.).
- **5 hooks** y **3 CTAs** para todo el trimestre.
- **1 solo set de hashtags** para las 325 piezas, sin adaptación por red ni por tema.

## Similitud semántica (HECHO)

- **17.474 pares** de copys con Jaccard ≥ 0.5 (5-gram por palabra).
- **461** secuencias de 20 palabras reutilizadas literalmente entre copys distintos.

## Detección de anti-patrones

| Patrón buscado | Resultado |
|---|---|
| Duplicados exactos | ✅ masivos (45 únicos / 325) |
| Misma estructura / mismo cierre | ✅ (plantillas reutilizadas) |
| Copy idéntico entre redes | ✅ 43/45 |
| Más de 5 hashtags | ❌ 0 posts (set fijo dentro del límite) |
| Unicode roto | No detectado (Unicode "bold" válido en hooks) |
| Testimonios/resultados falsos | No detectados en muestra |
| Urgencia falsa / promesas absolutas | No detectadas de forma sistemática |
| Lenguaje genérico SaaS | ⚠️ presente ("el sistema operativo para restaurantes") |

## Calidad del copy (evaluación cualitativa de la muestra)

El copy base **está bien escrito**: claro, en español correcto, con Unicode de énfasis, mensaje de marca fiel (cero comisión, venta directa, WhatsApp). El problema **no es la calidad de cada copy, sino la falta de cantidad real**: 45 buenos copys reciclados no son 325 copys.

### Puntuación por dimensión (sobre el pool de 45 copys base)

| Dimensión | Score /100 |
|---|---:|
| Marca | 82 |
| Producto | 80 |
| Claridad | 85 |
| **Originalidad (a nivel de dataset)** | **15** |
| Conversión | 55 (CTA repetitivo, sin variación por embudo) |
| **Adaptación a red** | **10** (mismo copy multi-red) |
| **Publicabilidad tal cual (325)** | **~0** (publicar 43 copys idénticos en varias redes se percibe como spam y puede penalizarse) |

## Conteo de copys publicables

- **Copys de calidad base:** 45.
- **Copys publicables SIN edición en las 325 ranuras:** **~0**, porque requieren des-duplicación y adaptación por plataforma antes de publicar. Como pool editorial de partida, 45 es un buen punto de arranque; como inventario listo, 325 es falso.

**Veredicto:** buen material base, **inflado 7× por duplicación**. Requiere expansión y adaptación por red antes de cualquier publicación.
