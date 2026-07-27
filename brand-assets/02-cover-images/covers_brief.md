# 🖼️ Portadas Oficiales · StreetBoss

**Concepto rector:** `Vende directo. Manda tú.`
**Jerarquía visual obligatoria:** 1) Comida · 2) Mensaje principal · 3) Escaparate en dispositivo · 4) Logotipo oficial · 5) CTA discreto.
**Regla de logo:** el fondo/escena puede generarse por IA (sin logo); el logo se integra después usando `brand-core/01_Master_Logo.svg`. Nunca generar el logo con IA.

Cada portada comunica: comida premium · escaparate digital · venta directa · independencia · control del restaurante · identidad StreetBoss. **No mostrar funciones inexistentes** (solo escaparate + carrito + pedido WhatsApp, según `08_PRODUCT`).

---

## 1. Facebook Cover

- **Medidas:** lienzo 1640×924 px. **Área segura central:** ~1090×470 px (evita recortes en móvil/desktop). Texto y logo dentro del área segura.
- **Layout:** food premium a sangre a la derecha (45°, moody, fondo oscuro); bloque de texto a la izquierda sobre Charcoal; mockup de escaparate en celular sostenido por una mano en primer plano inferior; logo arriba-izquierda; CTA abajo-izquierda.
- **Texto exacto:**
  - Titular: **Vende directo. Manda tú.**
  - Apoyo: Tu escaparate digital. Pedidos directos a tu WhatsApp. Cero comisiones.
  - CTA discreto: Escríbenos por WhatsApp →
- **Prompt de fondo (IA, sin logo):** ver `../10-prompt-library/prompts_backgrounds.md` → `COVER_FOOD_DARK`.
- **Editable:** `facebook/cover_facebook_master.svg` · **Export:** PNG + WebP en `facebook/` y `../12-exports/`.

## 2. LinkedIn Cover (Company)

- **Medidas:** 1128×191 px (banda estrecha). **Área segura:** logo de la company page (abajo-izquierda) tapa ~300×300; mantener texto centrado-derecha.
- **Layout:** franja Charcoal, food sutil a la derecha con oscurecimiento; tono más B2B/autoridad; menos "antojo", más "control y rentabilidad".
- **Texto exacto:**
  - Titular: **La plataforma visual de venta directa para restaurantes.**
  - Apoyo: Recupera el control de tus clientes y de tus márgenes.
- **Prompt de fondo:** `COVER_FOOD_DARK` variante sobria (menos saturación).
- **Editable:** `linkedin/cover_linkedin_master.svg`.

## 3. YouTube Channel Art

- **Medidas:** lienzo 2560×1440 px. **Área segura TV-safe:** central **1546×423 px** (lo único garantizado en todos los dispositivos). Logo + titular DENTRO de esa zona.
- **Layout:** food épico a los lados (se recorta en móvil sin perder mensaje), centro con logo + claim; parte inferior mockup de escaparate.
- **Texto exacto:**
  - Centro: logo **StreetBoss.** + **Vende directo. Manda tú.**
- **Prompt de fondo:** `COVER_FOOD_DARK` panorámico.
- **Editable:** `youtube/cover_youtube_master.svg`.

## 4. X (Twitter) Header

- **Medidas:** 1500×500 px. **Área segura:** avatar inferior-izquierdo tapa ~200×200; texto a la derecha.
- **Layout:** franja horizontal Charcoal + food a la derecha; claim a la izquierda-centro.
- **Texto exacto:**
  - Titular: **Tu restaurante. Tus reglas. Tu venta directa.**
- **Prompt de fondo:** `COVER_FOOD_DARK` recorte horizontal.
- **Editable:** `x/cover_x_master.svg`.

## 5. WhatsApp Business (cuando aplique)

- **Nota técnica:** WhatsApp Business **no tiene portada**; usa foto de perfil (ver `../01-profile-images/`) + **imagen de catálogo/estado**. Se produce una **pieza de estado 1080×1920** y una **portada de catálogo 1080×1080** como equivalentes.
- **Texto exacto (estado):** **Haz tu pedido aquí 👇** + link del escaparate.
- **Editable:** `whatsapp-business/status_whatsapp_master.svg`.

---

## Checklist de entrega por portada

- [ ] Brief · [ ] Layout · [ ] Texto exacto · [ ] Prompt de fondo · [ ] Medidas · [ ] Áreas seguras · [ ] Archivo editable (SVG) · [ ] PNG · [ ] WebP · [ ] Vista previa.

> Binarios PNG/WebP: pendientes de rasterizado (ver `../11-production-guides/EXPORT_PIPELINE.md`). Fondos food por IA: pendientes de generación (ver `../10-prompt-library/`). Registrado en `../13-reports/pending_decisions.md`.
