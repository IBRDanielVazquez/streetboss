# 🧾 04 — Pedidos · Especificación Funcional

> Cómo el pedido nace en el escaparate, llega al restaurante y se gestiona. **El pedido siempre es del restaurante**, no de Street Boss.
> Visión general en [`../PRODUCT.md`](../PRODUCT.md).

---

## 1. Objetivo del módulo

Que el comensal pida sin fricción y el restaurante reciba el pedido **ordenado, completo y directo** —sin comisión y sin intermediario que se quede al cliente.

## 2. Alcance por versión

| Versión | Incluye |
|---|---|
| **1.0** | Pedido armado en escaparate → mensaje pre-formateado enviado al **WhatsApp** del restaurante. |
| **2.0** | Pedidos gestionados en plataforma (estados), historial, notas, tiempos estimados, pago en línea opcional. |
| **3.0** | Conexión con POS, enrutamiento por sucursal, integración con delivery (ver [10-ROADMAP-PRODUCTO.md](10-ROADMAP-PRODUCTO.md)). |

## 3. Historias de usuario

- Como **comensal**, quiero enviar mi pedido por WhatsApp sin crear cuenta.
- Como **dueño**, quiero recibir el pedido con todo el detalle para no confundirme.
- Como **dueño** (2.0), quiero marcar el pedido como "en preparación / listo" y llevar historial.

## 4. Formato del pedido por WhatsApp (1.0)

El mensaje pre-armado debe incluir:
```
🧾 Nuevo pedido — [Nombre del restaurante]
Cliente: [nombre]
Entrega: [Recoger / Domicilio + dirección]
—
2x Tacos al pastor .......... $80
1x Agua horchata ............ $25
   • Nota: sin cebolla
—
Subtotal: $105
Tipo de pago: [efectivo / transferencia / a definir]
Hora: [timestamp]
Pedido vía Street Boss
```

## 5. Flujo (1.0)

```
Escaparate → carrito → checkout ligero (nombre, tipo entrega, dirección si aplica)
   → "Enviar pedido" → se abre WhatsApp del restaurante con el mensaje pre-armado
   → el comensal presiona enviar → el restaurante recibe y confirma por WhatsApp
```

## 6. Flujo gestionado (2.0)

```
Pedido recibido → [Recibido] → [En preparación] → [Listo] → [Entregado]
   con historial, notas internas, tiempo estimado y notificación al comensal
```

## 7. Estados del pedido

- **1.0:** enviado por WhatsApp (fuera de plataforma, lo confirma el restaurante manualmente).
- **2.0:** recibido / en preparación / listo / entregado / cancelado.

## 8. Reglas de negocio

- **Cero comisión por pedido** — regla inviolable de producto y negocio.
- El WhatsApp destino y la conversación son **del restaurante**.
- Respetar **horario** y **mínimo de pedido** (si están configurados).
- El mensaje debe ser **legible y completo** (evitar errores de cocina).
- Pago en línea (2.0) es **opcional**, nunca obligatorio; efectivo/transferencia siempre válidos.
- Si el negocio está cerrado: bloquear o advertir según configuración.

## 9. Criterios de aceptación (1.0)

- [ ] El pedido llega al WhatsApp del restaurante con detalle completo y formato legible.
- [ ] Funciona desde móvil sin crear cuenta.
- [ ] Respeta agotados, horario y mínimo de pedido.
- [ ] No hay ningún cobro de comisión en el flujo.

## 10. Métricas del módulo

Pedidos enviados, conversión carrito→pedido, ticket promedio, abandono, (2.0) tiempo de preparación, tasa de cancelación, pedidos recurrentes.

## 11. Dependencias

- **[01-ESCAPARATE.md](01-ESCAPARATE.md)** (origen), **[02-DASHBOARD.md](02-DASHBOARD.md)** (gestión), **[08-CRM.md](08-CRM.md)** (el pedido alimenta el CRM), **[06-IA.md](06-IA.md)** (respuestas automáticas 2.0).

## 12. Pendientes de aprobación (Daniel)

- [ ] ¿Integrar WhatsApp Business API en 2.0 o mantener enlace directo?
- [ ] Método de pago mostrado en 1.0 (efectivo/transferencia/ambos).
- [ ] ¿Pago en línea propio o solo link a pasarela en 2.0?
