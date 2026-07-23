# 🎛️ 02 — Dashboard Cliente · Especificación Funcional

> El **centro de mando del dueño del restaurante**. Donde administra su escaparate, menú, pedidos y crecimiento.
> Visión general en [`../PRODUCT.md`](../PRODUCT.md).

---

## 1. Objetivo del módulo

Darle al dueño (no técnico) un panel **simple sobre completo** para gestionar todo su negocio digital desde el celular, entre pedidos, sin curva de aprendizaje.

## 2. Alcance por versión

| Versión | Incluye |
|---|---|
| **1.0** | Editar menú/productos, precios, disponibilidad, perfil, ver visitas, obtener link+QR. |
| **2.0** | Gestión de pedidos, promociones, fidelización, referidos, analytics, generador de contenido IA. |
| **3.0** | Multi-sucursal, roles y permisos, POS, automatizaciones, integraciones. |

## 3. Historias de usuario

- Como **dueño**, quiero marcar un producto como "agotado" en un toque.
- Como **dueño**, quiero cambiar un precio al instante desde el celular.
- Como **dueño**, quiero ver cuánta gente entró y qué se pidió hoy.
- Como **dueño de cadena** (3.0), quiero administrar varias sucursales desde un panel.

## 4. Estructura del panel (secciones)

1. **Inicio / Resumen:** métricas del día (visitas, pedidos, ventas), accesos rápidos, checklist de crecimiento.
2. **Menú / Catálogo:** crear/editar categorías y productos (foto, nombre, descripción, precio, variantes, extras, disponibilidad).
3. **Escaparate:** editar perfil, portada, colores de acento, horarios; botón "Ver mi escaparate" y "Compartir".
4. **Pedidos** (2.0): lista y estados (ver [04-PEDIDOS.md](04-PEDIDOS.md)).
5. **Marketing** (2.0): promos, cupones, contenido IA (ver [07-MARKETING.md](07-MARKETING.md)).
6. **Clientes / CRM** (2.0): base de clientes (ver [08-CRM.md](08-CRM.md)).
7. **Analytics** (2.0): reportes accionables.
8. **Configuración:** datos del negocio, WhatsApp, zonas de entrega, plan/facturación, equipo (3.0).

## 5. Flujo: editar un producto (1.0)

```
Panel → Menú → seleccionar producto (o "Agregar")
   → editar foto/nombre/descripción/precio/variantes
   → cambiar disponibilidad (disponible/agotado/oculto)
   → Guardar → cambios reflejados en el escaparate en tiempo real
```

## 6. Estados

- Producto: disponible / agotado / oculto / borrador.
- Escaparate: publicado / en borrador / suspendido.
- Cuenta: activa / trial / suspendida / cancelada.
- Cambios: guardados / sin guardar (avisar antes de salir).

## 7. Reglas de negocio

- **Cambios en tiempo real:** editar en el panel actualiza el escaparate al instante.
- **Simple sobre completo:** las acciones frecuentes (agotar, cambiar precio) en 1 o 2 toques.
- **Mobile-first:** el panel se usa mayormente desde el celular.
- **Onboarding integrado:** el checklist guía al dueño nuevo (ver [05-ONBOARDING.md](05-ONBOARDING.md)).
- **Roles (3.0):** dueño / gerente / staff con permisos distintos.
- Nunca exponer términos técnicos; lenguaje del dueño de restaurante.

## 8. Criterios de aceptación (1.0)

- [ ] El dueño puede crear un producto completo en < 1 min.
- [ ] Marcar "agotado" toma 1 toque y se refleja de inmediato en el escaparate.
- [ ] El panel es 100% usable desde un celular.
- [ ] El resumen de inicio muestra visitas y (2.0) pedidos del día.
- [ ] "Compartir" entrega link + QR y opción directa a WhatsApp/redes.

## 9. Métricas del módulo

Frecuencia de uso del panel, tiempo para publicar el primer menú, productos gestionados, adopción de funciones (promos, fidelización), retención del dueño.

## 10. Dependencias

- **[01-ESCAPARATE.md](01-ESCAPARATE.md)** (lo que edita se refleja ahí).
- **[04-PEDIDOS.md](04-PEDIDOS.md)**, **[07-MARKETING.md](07-MARKETING.md)**, **[08-CRM.md](08-CRM.md)**, **[06-IA.md](06-IA.md)**.

## 11. Pendientes de aprobación (Daniel)

- [ ] ¿Qué métricas exactas en el resumen de inicio de 1.0?
- [ ] ¿Roles de equipo en 3.0 o adelantar a 2.0 para cadenas?
- [ ] Estructura de planes visible en el panel (facturación).
