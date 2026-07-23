# 🚀 05 — Onboarding · Especificación Funcional

> El primer contacto real con el producto. Define si el dueño **se queda o se va**.
> Visión general en [`../PRODUCT.md`](../PRODUCT.md).

---

## 1. Objetivo del módulo

Llevar a un dueño no técnico desde el registro hasta **su escaparate publicado en < 10 minutos** y su **primer pedido en < 24 horas**, sin miedo ni fricción.

## 2. Metas medibles

- **TTFE (Tiempo al primer escaparate):** < 10 min.
- **TTFO (Tiempo al primer pedido):** < 24 h.
- **Tasa de activación:** % de registros que publican escaparate.

## 3. Flujo del onboarding (1.0)

```
Paso 0 — "¿Qué vendes?" (tacos/pizza/burgers/café…) → carga plantilla + estructura + ejemplos
Paso 1 — Identidad exprés: nombre, logo/foto, WhatsApp, zona
Paso 2 — Primeros platillos: subir 3–5 (foto, nombre, precio) → IA sugiere la descripción
Paso 3 — Vista previa: el dueño ve su escaparate real (efecto orgullo → "aha")
Paso 4 — Publicar y compartir: genera link + QR → compartir en WhatsApp/Instagram
Paso 5 — Checklist de crecimiento: tareas guiadas para completar el menú y activar promos
```

## 4. Principios de diseño

- **Plantilla primero:** nunca una pantalla vacía; siempre un punto de partida.
- **Pedir solo lo esencial:** no bloquear con datos que no se necesitan aún.
- **Momento "aha" temprano:** mostrar el escaparate real lo antes posible.
- **IA de apoyo:** genera descripciones y responde dudas en lenguaje simple.
- **Progreso visible:** barra/porcentaje y checklist que motiva a completar.
- **Cero jerga:** lenguaje del dueño de restaurante.

## 5. Checklist de crecimiento (post-onboarding)

- [ ] Completar 10 productos.
- [ ] Subir foto de portada.
- [ ] Agregar horarios y zona.
- [ ] Compartir el escaparate en redes.
- [ ] Crear tu primera promo (2.0).
- [ ] Activar fidelización (2.0).

Cada tarea completada = avance de nivel "Boss" (ver gamificación en [07-MARKETING.md](07-MARKETING.md)).

## 6. Estados del onboarding

- No iniciado / en progreso (paso X) / escaparate publicado / activado (primer pedido) / abandonado.
- **Recuperación:** si abandona, recordatorio por WhatsApp/email para retomar donde quedó.

## 7. Reglas de negocio

- El onboarding **usa la Biblioteca** (plantillas por vertical, ver [03-BIBLIOTECA.md](03-BIBLIOTECA.md)).
- Nunca dejar al usuario solo frente a una pantalla vacía.
- La IA acompaña pero **el dueño decide** (no publica nada sin su OK).
- Mobile-first: todo el onboarding se puede completar desde el celular.

## 8. Criterios de aceptación (1.0)

- [ ] Un dueño no técnico publica su escaparate solo, sin ayuda humana.
- [ ] El onboarding completo se hace desde el celular.
- [ ] Al terminar, el dueño tiene link + QR listos para compartir.
- [ ] La IA sugiere al menos la descripción de los primeros productos.

## 9. Métricas del módulo

TTFE, TTFO, tasa de activación, % de abandono por paso, uso de plantillas IA, recuperación de abandonos.

## 10. Dependencias

- **[03-BIBLIOTECA.md](03-BIBLIOTECA.md)**, **[06-IA.md](06-IA.md)**, **[01-ESCAPARATE.md](01-ESCAPARATE.md)**, **[02-DASHBOARD.md](02-DASHBOARD.md)**.

## 11. Pendientes de aprobación (Daniel)

- [ ] ¿Registro con email, teléfono o ambos?
- [ ] ¿Onboarding pide plan/pago al final (trial) o después?
- [ ] Verticales iniciales del Paso 0.
