# 11 — Auditoría UX / UI

**Método:** dev server real (`vite --port 5000`) + navegador Chromium embebido. Clasificación: **EMULADO** (Chromium con viewport móvil). **NO** se probó en Safari iOS real ni dispositivo físico. No se corrió Lighthouse/axe (fuera de alcance de tiempo).

## Evidencia capturada (HECHO)

- **Móvil 375×812:** render correcto. Pantalla "Identidad Digital (Brand Assets)" con Información Oficial (tagline, WhatsApp, website), botón "Copiar WA", paleta de colores en tarjetas, sección "Términos Prohibidos" (incluye "Menú QR → usar Escaparate Digital"), y **bottom navigation** iOS-style de 5 íconos.
- **Instagram (`/Instagram`):** tabs "Perfil & Bios / Destacados / Feed (39) / Carrusel (13)", tarjetas de configuración de perfil, avatar prompt con "Copiar Prompt", bios A/B. Limpio y funcional.
- **Consola:** **0 errores** (`read_console_messages onlyErrors` → sin logs).
- **Rutas:** SPA con `react-router` — `/`, `/Instagram`, `/Facebook`, `/TikTok`, `/WhatsApp`.

## Evaluación

| Aspecto | Estado |
|---|---|
| Mobile First | ✅ Excelente; diseño tipo iOS, jerarquía clara |
| Bottom navigation | ✅ Presente y usable | 
| Safe areas / overflow móvil | ✅ Sin overflow horizontal observado |
| Tarjetas / tipografía / contraste | ✅ Contraste alto (charcoal sobre paper white); legible |
| Botones "Copiar" | ✅ Presentes (WA, prompts) |
| **Cobertura de redes en nav** | ❌ Solo 5/6 (falta LinkedIn, YouTube) — P2-04 |
| **Escritorio (1440)** | ❌ No adapta: mantiene columna móvil ~375px; desaprovecha el espacio — P3-02 |
| Buscador / filtros | ⚠️ No observados; navegación por pestañas y scroll |
| Accesibilidad (ALT) | ❌ 0 ALT en las 325 piezas; sin auditoría axe |

## Clasificación de pruebas

- **PROBADO EN DISPOSITIVO REAL:** ninguna.
- **EMULADO (Chromium):** móvil 375×812, escritorio nativo. ✅
- **NO PROBADO:** Safari iOS, tablets (768/1024), 320/390/393/430, Lighthouse, axe.

**Veredicto:** UX móvil **fuerte** (78/100) y sin errores de consola; UX escritorio **pobre** (45/100) por falta de layout responsivo; accesibilidad **incompleta** por ausencia de ALT. La afirmación de "probado en iOS" **no puede sostenerse** con esta evidencia.
