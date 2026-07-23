# 👥 08 — CRM · Especificación Funcional

> El módulo que **materializa la promesa central**: en los marketplaces el cliente es de la app; en Street Boss, **el cliente es del restaurante**.
> Visión general en [`../PRODUCT.md`](../PRODUCT.md).

---

## 1. Objetivo del módulo

Darle al restaurante una **base propia de clientes** con inteligencia útil (quién compra, cuánto, cada cuánto) para retener y vender más, sin ceder ese dato a nadie.

## 2. Alcance por versión

| Versión | Incluye |
|---|---|
| **2.0** | Base de clientes automática, etiquetas, frecuencia, ticket promedio, cumpleaños. |
| **3.0** | Segmentación avanzada, clientes dormidos, LTV, campañas dirigidas por WhatsApp, automatizaciones. |

## 3. Datos del cliente (perfil)

- Nombre, WhatsApp/contacto.
- Historial de pedidos y productos favoritos.
- Frecuencia, última compra, ticket promedio, total gastado.
- Etiquetas (frecuente, nuevo, dormido, VIP).
- Cumpleaños / fechas clave (si el cliente las da).

## 4. Cómo se alimenta

- Automáticamente desde los **pedidos** (ver [04-PEDIDOS.md](04-PEDIDOS.md)).
- El cliente entra a la base al primer pedido; se enriquece con cada compra.

## 5. Historias de usuario

- Como **dueño**, quiero saber quiénes son mis clientes frecuentes.
- Como **dueño**, quiero reactivar a los que no piden hace tiempo.
- Como **dueño** (3.0), quiero mandar una promo solo a mis clientes VIP.

## 6. Segmentos clave (3.0)

- **Nuevos:** primer pedido reciente.
- **Frecuentes:** compran seguido.
- **Dormidos:** no compran hace X días → campaña de reactivación.
- **VIP:** mayor gasto/frecuencia → beneficios.

## 7. Reglas de negocio

- **El dato es del restaurante.** Street Boss lo custodia, no lo explota ni lo vende.
- Cumplimiento de privacidad (consentimiento, datos personales protegidos).
- Las campañas por WhatsApp respetan políticas de la plataforma y opt-out.
- Integración directa con **fidelización** (ver [07-MARKETING.md](07-MARKETING.md)).
- **Datos agregados y anónimos** podrían dar inteligencia de mercado (visión 10 años) **sin** comprometer al restaurante.

## 8. Criterios de aceptación (2.0)

- [ ] Cada pedido crea/actualiza un cliente en la base automáticamente.
- [ ] El dueño ve frecuencia, ticket promedio y última compra por cliente.
- [ ] Se pueden etiquetar y filtrar clientes.
- [ ] (3.0) Se puede lanzar una campaña a un segmento.

## 9. Métricas del módulo

Clientes registrados, % recurrentes, LTV, tasa de reactivación de dormidos, retención, efectividad de campañas.

## 10. Dependencias

- **[04-PEDIDOS.md](04-PEDIDOS.md)** (fuente de datos), **[07-MARKETING.md](07-MARKETING.md)** (activación), **[06-IA.md](06-IA.md)** (segmentación y mensajes), **[02-DASHBOARD.md](02-DASHBOARD.md)**.

## 11. Pendientes de aprobación (Daniel)

- [ ] Política de privacidad y consentimiento de datos del comensal.
- [ ] ¿Campañas por WhatsApp con API oficial (costos) o manual asistido?
- [ ] Postura sobre inteligencia de mercado agregada (visión 10 años).
