# 📣 07 — Marketing · Especificación Funcional

> Herramientas para que el restaurante **atraiga, convierta y retenga** desde su propio canal. Incluye promociones, contenido, redes, fidelización, referidos y gamificación.
> Visión general en [`../PRODUCT.md`](../PRODUCT.md).

---

## 1. Objetivo del módulo

Convertir a cada restaurante en su propio equipo de marketing: que atraiga clientes (redes/SEO), los convierta (promos/escaparate) y los retenga (fidelización/referidos) —sin depender de marketplaces.

## 2. Alcance por versión

| Versión | Incluye |
|---|---|
| **2.0** | Promociones/cupones, generador de contenido IA, botón compartir, fidelización, referidos, gamificación. |
| **3.0** | Automatizaciones de marketing, campañas por WhatsApp, calendario/parrilla asistida, marca blanca. |

## 3. Submódulos

### 3.1 Promociones y cupones
- Combos, 2x1, descuentos por horario/día, códigos.
- Visibles en el escaparate; con fecha de inicio/fin.

### 3.2 Contenido y redes
- Generador IA de posts, historias y reels (ver [06-IA.md](06-IA.md)).
- Botón "compartir escaparate" nativo (Instagram, TikTok, Facebook, WhatsApp).
- Link en bio que convierte.
- Calendario/parrilla asistida (3.0).

### 3.3 Fidelización
- Puntos, sellos digitales, cliente frecuente, recompensas, cumpleaños.
- Integrada al CRM (ver [08-CRM.md](08-CRM.md)) — **el cliente es del restaurante**.

### 3.4 Programa de referidos
- **B2B:** restaurante invita a restaurante (motor viral de adquisición).
- **B2C:** comensal comparte y gana recompensa del restaurante.
- Referidos rastreables desde el panel.

### 3.5 Gamificación
- **Dueño:** checklist de crecimiento, logros, niveles "Boss".
- **Comensal:** retos, sellos, recompensas.
- Siempre con propósito (no puntos vacíos).

## 4. Historias de usuario

- Como **dueño**, quiero lanzar un 2x1 de martes en un toque.
- Como **dueño**, quiero generar contenido de redes sin diseñador.
- Como **dueño**, quiero premiar a mis clientes frecuentes.
- Como **dueño**, quiero invitar a otro restaurante y que ambos ganemos.

## 5. Reglas de negocio

- Las promos respetan disponibilidad y horarios del escaparate.
- La fidelización y los datos de clientes son **del restaurante**, no de Street Boss.
- El contenido IA respeta la **voz de marca** (`branding/`).
- Referidos con reglas claras y antifraude.

## 6. Criterios de aceptación (2.0)

- [ ] Crear una promo visible en el escaparate en < 1 min.
- [ ] Generar un post de redes desde plantilla + IA.
- [ ] Activar un programa de sellos/puntos.
- [ ] Compartir escaparate directo a redes/WhatsApp.
- [ ] Generar un enlace de referido rastreable.

## 7. Métricas del módulo

Uso de promos, redención de cupones, contenido generado/publicado, clientes fidelizados, tasa de retención, referidos activados y convertidos, virentes (K-factor) del referido B2B.

## 8. Dependencias

- **[06-IA.md](06-IA.md)**, **[03-BIBLIOTECA.md](03-BIBLIOTECA.md)**, **[08-CRM.md](08-CRM.md)**, **[09-SEO.md](09-SEO.md)**, **[02-DASHBOARD.md](02-DASHBOARD.md)**.
- `rrss/`, `campañas/`, `calendario/` del Studio (ejecución de marketing).

## 9. Pendientes de aprobación (Daniel)

- [ ] Recompensa del referido B2B (¿mes gratis, descuento?).
- [ ] ¿Fidelización por puntos, sellos, o ambos, en 2.0?
- [ ] Alcance de las automatizaciones de WhatsApp (respetar políticas).
