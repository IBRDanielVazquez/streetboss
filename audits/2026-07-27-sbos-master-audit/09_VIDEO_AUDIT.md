# 09 — Auditoría de Video / Movimiento

## Volumen

- **91 posts** con `motionPrompt` (Reels/TikToks/Shorts/Stories). Coincide con lo declarado (91).

## Prompts de movimiento — CONFIRMADO ❌

| Métrica | Declarado | Real |
|---|---:|---:|
| Prompts de movimiento distintos | 91 | **1** |

El valor único es:

> "Panorámica suave de izquierda a derecha. Efecto cinemático a 24fps. Profundidad de campo superficial revelando la acción gastronómica al fondo y anclando el foco en el teléfono central con la app activa."

**Hallazgo (P0-01):** los 91 videos comparten **exactamente el mismo movimiento**. No hay 91 direcciones de movimiento; hay una, clonada.

## Problemas detectados

| Chequeo | Resultado |
|---|---|
| Movimiento clonado | ✅ 91/91 idénticos |
| "app activa" en el prompt | ⚠️ contradice el escaparate web y el negative prompt (ver [08](08_PROMPT_AUDIT.md)) |
| Guion / narrativa por pieza | ❌ ausente (no hay escenas, duración, hook de video, caption específico, portada) |
| Portada (`cover`) | ❌ 0% (campo inexistente) |
| Audio | ❌ no especificado |
| Duración / número de escenas | ❌ no especificado |
| Factibilidad | ⚠️ una sola panorámica es factible pero monótona a escala de 91 videos |

## Campos de video ausentes

El brief espera por video: hook, duración, escenas, narración, texto, CTA, caption, prompt base, movimiento, portada, audio, continuidad. **Solo existe "movimiento" (y es único).** Los 91 videos carecen de guion, portada, duración y audio.

**Veredicto:** el "video" del sistema es, hoy, **un único movimiento de cámara aplicado a imágenes que aún no existen**. No hay guiones ni narrativa. Es un placeholder, no una biblioteca de video.
