# 🗺️ 10 — Roadmap del Producto · Especificación

> El **plan de construcción por versiones** de todos los módulos. Traduce la visión de [`../PRODUCT.md`](../PRODUCT.md) en secuencia funcional.
> No sustituye al [`../ROADMAP.md`](../ROADMAP.md) del ecosistema (ese es el tablero operativo); este es el roadmap **de producto**.

---

## 1. Filosofía de versiones

**Cada versión debe ser vendible por sí sola.** No construimos un gigante inservible durante años; 1.0 ya resuelve el dolor central (escaparate + pedido + sin comisión).

## 2. Mapa de módulos por versión

| Módulo | 1.0 | 2.0 | 3.0 | 4.0+ |
|---|:---:|:---:|:---:|:---:|
| [01 Escaparate](01-ESCAPARATE.md) | ✅ núcleo | ➕ destacados, buscador, promos | ➕ multi-sucursal, multi-idioma | |
| [02 Dashboard](02-DASHBOARD.md) | ✅ básico | ➕ pedidos, marketing, analytics | ➕ roles, multi-sucursal, POS | |
| [03 Biblioteca](03-BIBLIOTECA.md) | ✅ plantillas | ➕ contenido, textos IA | ➕ marketplace, marca blanca | |
| [04 Pedidos](04-PEDIDOS.md) | ✅ WhatsApp | ➕ gestionados, pago opcional | ➕ POS + delivery integrado | |
| [05 Onboarding](05-ONBOARDING.md) | ✅ guiado | ➕ recuperación, checklist | ➕ multi-idioma | |
| [06 IA](06-IA.md) | ✅ descripciones | ➕ contenido, precios | ➕ copiloto del negocio | 🚀 autónoma |
| [07 Marketing](07-MARKETING.md) | — | ✅ promos, fidelización, referidos | ➕ automatizaciones | |
| [08 CRM](08-CRM.md) | — | ✅ base de clientes | ➕ segmentación, campañas | 🚀 inteligencia de mercado |
| [09 SEO](09-SEO.md) | ✅ técnico | ➕ Google Business | ➕ multi-sucursal/idioma | |
| **POS** | — | — | ✅ 3.0 | |
| **API / Mobile App** | — | — | ✅ 3.0 | ➕ ecosistema |
| **Delivery integrado** | — | — | ✅ 3.0 | |

Leyenda: ✅ entra · ➕ se amplía · 🚀 visión aspiracional · — no aplica aún.

## 3. Versiones (resumen)

### 🟢 1.0 — "El Escaparate que vende" (Fundación)
**Meta:** escaparate premium + pedido por WhatsApp + sin comisiones, en minutos.
**Entra:** Escaparate, Dashboard básico, Pedidos (WhatsApp), Onboarding, IA (descripciones), SEO técnico, Biblioteca (plantillas), Link+QR.
**Éxito:** dueño no técnico publica solo y recibe su primer pedido el mismo día.

### 🟡 2.0 — "El Motor de Ventas" (Crecimiento)
**Meta:** vender más y retener.
**Entra:** Pedidos gestionados, CRM básico, Marketing (promos, fidelización, referidos, gamificación), Analytics, IA (contenido, precios), Google Business, pago opcional.
**Éxito:** las ventas suben y los clientes regresan.

### 🟠 3.0 — "El Sistema Operativo del Restaurante" (Dominio)
**Meta:** centro de operación comercial.
**Entra:** POS, multi-sucursal, multi-idioma, delivery integrado, automatizaciones, API, app móvil, IA copiloto, marketplace interno.
**Éxito:** el restaurante opera todo su negocio comercial sobre Street Boss.

### 🔵 4.0+ — "El Ecosistema" (10 años)
**Meta:** infraestructura de venta directa a gran escala.
**Explora:** marca blanca, ecosistema de terceros sobre la API, inteligencia de mercado agregada, capa financiera (a evaluar), IA autónoma.

## 4. Orden de construcción recomendado (dentro de 1.0)

1. Escaparate (catálogo + perfil + página de pedidos).
2. Pedido por WhatsApp.
3. Onboarding con plantillas.
4. Dashboard Cliente básico.
5. Link único + QR + compartir.
6. SEO técnico base + IA de descripciones.

## 5. Qué se descarta / se evita (guardarraíles)

- ❌ Comisión por pedido de comida (jamás).
- ❌ Convertirse en marketplace de restaurantes.
- ❌ Flotilla propia de repartidores como negocio central.
- ❌ App nativa obligatoria para el comensal en etapas tempranas.
- ❌ POS como punto de partida (nacemos desde lo online).
- ❌ "Street Boss V2" o subproyectos paralelos.
- ❌ Features "porque el competidor las tiene" sin encajar en el ADN.

## 6. Regla de oro del negocio

> Se cobra por la **herramienta (SaaS)**, **nunca** un porcentaje del pedido. Ver modelo de ingresos en [`../PRODUCT.md`](../PRODUCT.md) (secciones 38–39).

## 7. Alineación con el ecosistema

Este roadmap de producto debe mantenerse coherente con:
- [`../ROADMAP.md`](../ROADMAP.md) — tablero operativo (fases Escaparate → Dashboard → Pedidos → Marketing → Lanzamiento).
- [`../PRODUCT.md`](../PRODUCT.md) — visión general (sección 40).

## 8. Pendientes de aprobación (Daniel)

- [ ] Confirmar el alcance exacto de 1.0 (MVP) antes de que Codex construya.
- [ ] Priorizar qué de 2.0 podría adelantarse (ej. CRM básico).
- [ ] Validar la regla de oro (SaaS sin comisión) como principio inamovible.
- [ ] Próximo documento: `FEATURES-1.0.md` / `SPEC-ESCAPARATE.md` (spec detallada para ingeniería).
