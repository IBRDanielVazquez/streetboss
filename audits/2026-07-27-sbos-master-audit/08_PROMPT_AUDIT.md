# 08 — Auditoría de Prompts Visuales y Negativos

## Prompts visuales (`imagePrompt`)

| Métrica | Valor |
|---|---:|
| Prompts presentes | 325 |
| **Prompts únicos** | **62** |
| Posts en grupos de duplicado exacto | **324 / 325** |
| Pares con Jaccard ≥ 0.5 | **13.289** |
| Secuencias de 20 palabras reutilizadas | **1.933** |

**Hallazgo (P0-01):** los "325 prompts únicos" son **62**. El 99.7% de los posts comparte su prompt textual exacto con al menos otro post.

## Tecnicismo cinematográfico forzado (P2-02)

Sobre **fotografía fija**, los prompts imponen equipo de cine de forma repetitiva:

| Término | Apariciones / 325 |
|---|---:|
| ARRI | **283** |
| Kodak Portra / 35mm | 166 |
| Alexa 65 / Alexa | 159 |
| Zeiss | 159 |
| **Roger Deakins** (cinematógrafo) | 159 |

Problemas:
- **ARRI / Alexa 65** son cámaras de **cine en movimiento**, citadas como si fueran cámara de foto fija en la mayoría de piezas estáticas.
- **"Roger Deakins"** fuerza el estilo de un director de fotografía concreto en 159 piezas → homogeneidad y posible imitación de estilo.
- **Kodak Portra** (película de retrato) aplicada indiscriminadamente.

Esto es exactamente el patrón que el brief marca como defecto: tecnicismo de relleno que **no aporta** y uniformiza la biblioteca.

## Coherencia y contradicciones

- Los prompts describen "teléfono con la app activa" mientras el negative prompt prohíbe "invented app / fake interface / distorted screen". **CONTRADICCIÓN interna** (mostrar interfaz vs. prohibirla).
- El generador `generateCalendarAdvanced.cjs` sí construye prompts ricos por combinación (NARRATIVES × PROTAGONISTS × ENVIRONMENTS × GASTRONOMY × CINEMATOGRAPHY), pero **ese output va a los `.ts` huérfanos, no a `posts.json`**. El `posts.json` en producción usa el pool pobre de 62.

## Negative prompts (Fase 7)

| Métrica | Valor |
|---|---:|
| Presentes | 325 |
| **Únicos** | **1** |
| Longitud del único valor | 131 caracteres |

**Hallazgo (P0-01):** NO existen 325 negative prompts distintos. Hay **uno solo**, idéntico en las 325 piezas.

**Evaluación:** un negative prompt maestro único es de hecho **la práctica correcta** — pero entonces el sistema **no debe declarar "325 negative prompts únicos"**. Además hay **dos** negative prompts distintos en el repo según el generador (uno en inglés de 60+ términos en `generateData.cjs`, uno en español de 131 chars en `generateCalendar.cjs`); el que quedó en `posts.json` es el corto. Conviene consolidar en **un negative prompt maestro documentado + restricciones específicas por pieza** (propuesta, no implementada).

## Requisito de producción: "Áreas limpias / nada desordenado" (indicación del dueño)

**Estándar obligatorio para todo prompt de imagen que se genere a futuro:** cada prompt debe declarar explícitamente que la escena es un **área limpia y ordenada**, sin nada desordenado. Redacción a incorporar:

- **En el prompt positivo (cada pieza):** «Entorno limpio y ordenado, superficies despejadas, *mise en place* impecable, espacio de trabajo pulcro, sin desorden.»
- **En el negative prompt maestro (reforzar):** «desorden, superficies sucias, cocina desordenada, objetos amontonados, basura, cables sueltos, caos visual, mesas atiborradas.»

**Dependencia:** este estándar debe aplicarse desde el **generador único consolidado** (ver [P1-02](19_RISK_REGISTER.md)); si se sigue regenerando con 5 generadores y `Math.random()`, el estándar se perderá de forma inconsistente. Ver [20 · Fase E](20_REMEDIATION_ROADMAP.md).

## Conteo de prompts utilizables

- **Prompts únicos:** 62.
- **Prompts "limpios" (sin tecnicismo de cine forzado):** ~42 (los que no incluyen ARRI/Alexa).
- **Prompts utilizables tal cual para las 325 ranuras:** insuficientes; requieren expansión y limpieza de jerga.

**Veredicto:** el andamiaje de generación es bueno (el *advanced* combina bien), pero **el output en producción es pobre y uniformizado por tecnicismo**. Ver [09](09_VIDEO_AUDIT.md) para movimiento.
