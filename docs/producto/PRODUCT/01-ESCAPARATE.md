# 🛍️ 01 — Escaparate Digital · Especificación Funcional

> Módulo **corazón** de Street Boss. La vitrina visual pública donde el comensal ve la comida y arma su pedido.
> Visión general en [`../PRODUCT.md`](../PRODUCT.md) · Este documento es la **spec funcional**, no la visión.

---

## 1. Objetivo del módulo

Que cualquier negocio de comida tenga una **página visual premium** que muestre su comida "que da hambre" y convierta visitas en pedidos —sin depender de un marketplace y sin verse como un menú QR.

## 2. Alcance por versión

| Versión | Incluye |
|---|---|
| **1.0** | Catálogo visual, perfil, categorías, ficha de producto, carrito visual, envío por WhatsApp, link+QR, mobile-first. |
| **2.0** | Destacados/"lo más pedido", buscador, prueba social (reseñas), promos/cupones visibles, pago en línea opcional. |
| **3.0** | Variaciones por sucursal, multi-idioma, personalización avanzada dentro de la marca. |

## 3. Historias de usuario

- Como **comensal**, quiero ver fotos grandes y precios claros para antojarme y decidir rápido.
- Como **comensal**, quiero armar mi pedido y enviarlo sin descargar apps ni crear cuenta.
- Como **dueño**, quiero que mi escaparate se vea profesional sin contratar a un diseñador.
- Como **dueño**, quiero compartir un solo link/QR en bio, mesa y redes.

## 4. Estructura del escaparate (componentes)

1. **Encabezado / Perfil gastronómico:** logo/foto, nombre, descripción corta, horario, zona, estado (abierto/cerrado), redes.
2. **Portada / Hero:** imagen de marca + CTA principal ("Ver menú" / "Pedir").
3. **Navegación por categorías** (tacos, bebidas, postres…).
4. **Catálogo de productos:** tarjetas con foto, nombre, descripción breve, precio, botón "Agregar".
5. **Ficha de producto (detalle):** foto grande, descripción completa, opciones/variantes, extras, cantidad, notas.
6. **Carrito visual:** resumen editable (productos, cantidades, subtotal).
7. **Checkout ligero (1.0):** datos mínimos (nombre, tipo: recoger/domicilio, dirección si aplica) → botón "Enviar por WhatsApp".
8. **Pie:** ubicación/mapa, contacto, aviso legal, "hecho con Street Boss".

## 5. Flujo principal (1.0)

```
Comensal abre link/QR
   → ve escaparate (perfil + categorías + productos)
   → toca un producto → ficha → elige opciones/cantidad → "Agregar"
   → repite → abre carrito → revisa → "Enviar pedido"
   → completa datos mínimos
   → se genera mensaje pre-armado
   → se abre WhatsApp del restaurante con el pedido listo
```

## 6. Estados a contemplar

- Producto: **disponible / agotado / oculto**.
- Negocio: **abierto / cerrado / fuera de horario** (bloquea o avisa el pedido).
- Carrito: **vacío / con items / mínimo de pedido no alcanzado**.
- Categoría: **con productos / vacía (no mostrar)**.
- Escaparate: **publicado / en borrador / suspendido**.
- Imagen: **con foto / sin foto (placeholder de marca)**.

## 7. Reglas de negocio

- El escaparate es **100% mobile-first**; se diseña primero para celular.
- **Sin comisión:** el pedido va directo al WhatsApp del restaurante; Street Boss no intermedia el cobro.
- Un producto sin foto usa un **placeholder de marca**, nunca se ve "roto".
- El precio **siempre** visible y legible (nunca oculto).
- El mensaje de WhatsApp debe incluir: productos, cantidades, opciones, notas, subtotal, tipo de entrega y datos del cliente.
- Horario cerrado: permitir "ver menú" pero avisar que no se toman pedidos ahora (configurable).
- Rendimiento: carga rápida (imágenes optimizadas) por ser clave para conversión y SEO.

## 8. Personalización (dentro de las reglas de marca)

- Color de acento, portada y logo del restaurante.
- Orden de categorías y productos.
- Destacar productos ("recomendado", "nuevo", "más pedido" en 2.0).
- **Límite:** no romper la coherencia de marca Street Boss ni la usabilidad (guardarraíles definidos por `branding/`).

## 9. Criterios de aceptación (1.0)

- [ ] Un comensal puede armar y enviar un pedido por WhatsApp desde el celular en < 2 min.
- [ ] Todos los productos muestran nombre y precio; los sin foto usan placeholder.
- [ ] El mensaje de WhatsApp llega con el detalle completo y legible.
- [ ] El escaparate carga en < 3 s en 4G.
- [ ] Productos agotados no se pueden agregar.
- [ ] El link y el QR abren correctamente el escaparate público.

## 10. Métricas del módulo

Visitas, tasa de conversión (visita→pedido enviado), productos más vistos/agregados, abandono de carrito, ticket promedio, dispositivo (móvil/desktop).

## 11. Dependencias

- **[02-DASHBOARD.md](02-DASHBOARD.md)** (edición del catálogo).
- **[04-PEDIDOS.md](04-PEDIDOS.md)** (destino del pedido).
- **[03-BIBLIOTECA.md](03-BIBLIOTECA.md)** (plantillas y recursos visuales).
- **[09-SEO.md](09-SEO.md)** (indexación del escaparate).
- `branding/` (reglas visuales).

## 12. Pendientes de aprobación (Daniel)

- [ ] Nivel de personalización permitido en 1.0.
- [ ] ¿Checkout pide dirección siempre o solo en domicilio?
- [ ] ¿Mínimo de pedido configurable desde 1.0 o 2.0?
