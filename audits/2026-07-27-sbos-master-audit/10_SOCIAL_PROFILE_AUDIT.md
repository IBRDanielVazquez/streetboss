# 10 — Auditoría de Perfiles de Redes

Fuente: `brand-operating-system/src/data/profiles.json` + UI. **Ninguna cuenta fue verificada como real/activa** (no se accedió a las plataformas).

| Red | Handle declarado | Estado real |
|---|---|---|
| Instagram | `@streetboss.mx` | **DECLARADO, NO CONFIRMADO** — config completa (bios A–E, avatar prompt, CTA), pero no verificado que la cuenta exista/esté reclamada |
| Facebook | `@StreetBossMX` | DECLARADO, NO CONFIRMADO |
| TikTok | (en profiles) | DECLARADO, NO CONFIRMADO |
| WhatsApp Business | +52 961 372 5386 / `wa.me/529613725386` | DECLARADO, NO CONFIRMADO (no verificado como línea Business activa) |
| LinkedIn | — | **NO CONFIGURADO en la UI** (sin pestaña en el nav) |
| YouTube | — | **NO CONFIGURADO en la UI** (sin pestaña en el nav) |

## Hallazgos

- **P2-04:** el nav del dashboard expone solo **5 redes** (Assets, Instagram, Facebook, TikTok, WhatsApp). **LinkedIn (26 posts) y YouTube (13 posts) no tienen pantalla** — su contenido existe en `posts.json` pero es inalcanzable desde la UI.
- La configuración de Instagram es la más rica: 5 variantes de bio (Directa, Promocional, Orgullo, FAQ, Minimalista), prompt de avatar y safe zone. Buen trabajo de branding.
- **PII:** el número de WhatsApp real está versionado en el repo público. Es un contacto de negocio (uso legítimo), pero queda expuesto en el bundle público de Vercel.

**Veredicto:** buena **planificación** de perfiles (sobre todo IG), pero todo a nivel de **propuesta**: no hay evidencia de cuentas creadas/verificadas, y 2 de 6 redes ni siquiera tienen pantalla en el panel.
