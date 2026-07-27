# 04 — Cumplimiento de Marca

Matriz sobre la identidad verificada en `profiles.json`, la UI "Brand Assets" (captura real) y el contenido de `posts.json`.

| Criterio | Estado | Evidencia |
|---|---|---|
| Venta directa | ✅ CUMPLE | Tagline "Vende directo. Conserva el control."; bios y copys lo repiten |
| Cero comisión | ✅ CUMPLE PARCIALMENTE | Presente en 102/325 copys y en bios; consistente pero no universal |
| Mobile First | ✅ CUMPLE | Dashboard mobile-first; bios enfatizan WhatsApp |
| Control del negocio | ✅ CUMPLE | Mensaje central "tus reglas, tus precios" |
| WhatsApp | ✅ CUMPLE | En los 325 copys; número oficial +52 961 372 5386 |
| Marca gastronómica | ⚠️ CUMPLE PARCIALMENTE | Copys hablan de restaurantes; sin imágenes producidas para confirmarlo |
| No marketplace | ✅ CUMPLE | 0 menciones de "marketplace" en copys |
| No delivery | ✅ CUMPLE | 0 menciones de delivery/reparto en copys |
| No POS | ✅ CUMPLE | 0 menciones de POS en copys |
| No "simple menú QR" | ✅ CUMPLE | UI lista "Menú QR" como término PROHIBIDO (usar "Escaparate Digital") |
| No funciones inventadas | ⚠️ NO VERIFICABLE | Copys genéricos; sin claims de features específicas falsas detectadas |
| Paleta | ✅ CUMPLE | Boss Charcoal #0D0E12, Street Orange #FF4B00, Orange Light #FF6A1A, Paper White #F5F5F7 |
| Logo / Isotipo | ⚠️ NO VERIFICADO | Referenciado ("Logotipo SB"); ver [15](15_ASSET_AUDIT.md) |
| Tipografía | ⚠️ NO VERIFICADO | Sistema sans en UI; sin spec tipográfica documentada |
| Fotografía | ❌ NO CUMPLE (aún) | 0/325 imágenes producidas; prompts con tecnicismo forzado (ver [08](08_PROMPT_AUDIT.md)) |
| Tono | ✅ CUMPLE | Directo, sin jerga SaaS excesiva en bios |
| CTA | ⚠️ CUMPLE PARCIALMENTE | CTA global "Solicita un Demo"; solo 3 CTAs únicos en 325 posts |
| Dominio | ⚠️ DECLARADO, NO CONFIRMADO | `streetboss.com.mx` referenciado; no verificado que resuelva/sea propio |
| WhatsApp oficial | ⚠️ DECLARADO, NO CONFIRMADO | Número presente; no verificado que sea una línea Business activa |

## Riesgo de marca central

El **exceso de naranja** que el brief teme está *mitigado en la guía* (la UI dice "Street Orange… No abusar") pero **no verificable en producción** porque no hay imágenes. El negative prompt de hecho incluye "orange walls, orange lighting" como prohibición — bien. El riesgo real no es la paleta sino la **homogeneidad**: con 62 prompts para 325 piezas, la biblioteca visual resultante será repetitiva y "de stock", contradiciendo el negative prompt que prohíbe "stock photography".

**Veredicto:** la marca está **bien definida a nivel de reglas** (CUMPLE en lo estratégico) pero **no probada en ejecución** (fotografía pendiente, homogeneidad de prompts).
