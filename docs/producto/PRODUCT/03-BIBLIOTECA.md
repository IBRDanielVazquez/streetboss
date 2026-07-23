# 📚 03 — Biblioteca Street Boss · Especificación Funcional

> El **"Canva interno"** de Street Boss: recursos que hacen ver premium a cualquier restaurante sin diseñador.
> Visión general en [`../PRODUCT.md`](../PRODUCT.md).

---

## 1. Objetivo del módulo

Eliminar la barrera de "no soy diseñador": que el restaurante nunca parta de cero y siempre se vea profesional, con plantillas y recursos aprobados por la marca.

## 2. Alcance por versión

| Versión | Incluye |
|---|---|
| **1.0** | Plantillas de escaparate por tipo de comida, guías rápidas (fotografía con celular), placeholders de marca. |
| **2.0** | Plantillas de contenido para redes, textos base editables por IA, banco de íconos/fondos/estilos. |
| **3.0** | Marketplace interno de recursos y servicios (fotógrafos, diseñadores), packs premium, marca blanca. |

## 3. Contenido de la Biblioteca

1. **Plantillas de escaparate** por vertical: tacos, pizza, burgers, café, postres, saludable, mariscos, pollo, etc.
2. **Plantillas de contenido** (2.0): posts, historias, reels, portadas.
3. **Guías rápidas:** cómo fotografiar comida, cómo escribir una descripción que vende, cómo armar una promo.
4. **Recursos gráficos:** íconos, fondos, marcos, badges (alineados a `branding/06-VISUAL-SYSTEM.md`).
5. **Textos base:** descripciones, promos, respuestas —editables y mejorables por IA (ver [06-IA.md](06-IA.md)).
6. **Marketplace interno** (3.0): servicios y packs de terceros verificados.

## 4. Historias de usuario

- Como **dueño**, quiero elegir una plantilla de mi tipo de comida y que mi escaparate quede listo.
- Como **dueño**, quiero una guía para tomar buenas fotos con mi celular.
- Como **dueño** (2.0), quiero plantillas de posts para no depender de un diseñador.
- Como **agencia** (3.0), quiero packs premium para entregar más rápido a mis clientes.

## 5. Reglas de negocio

- Todo recurso debe respetar **`branding/`** (coherencia de marca).
- Las plantillas son **punto de partida editable**, no camisa de fuerza.
- La Biblioteca es **transversal**: alimenta escaparate, marketing y redes.
- Los recursos premium/marketplace (3.0) pueden ser **fuente de ingresos** (comisión sobre servicios/terceros, nunca sobre la comida del restaurante).

## 6. Criterios de aceptación

- [ ] (1.0) Existe al menos 1 plantilla por vertical principal de comida.
- [ ] (1.0) El onboarding usa una plantilla para dejar el escaparate listo.
- [ ] (1.0) Hay al menos una guía de fotografía accesible desde el panel.
- [ ] (2.0) El dueño genera un post desde una plantilla + IA.

## 7. Métricas del módulo

Plantillas más usadas, adopción de plantillas en onboarding, recursos descargados/aplicados, conversión a packs premium (3.0).

## 8. Dependencias

- **[01-ESCAPARATE.md](01-ESCAPARATE.md)**, **[05-ONBOARDING.md](05-ONBOARDING.md)**, **[06-IA.md](06-IA.md)**, **[07-MARKETING.md](07-MARKETING.md)**.
- `branding/` (todos los recursos parten de la identidad).

## 9. Pendientes de aprobación (Daniel)

- [ ] Lista definitiva de verticales de comida para las plantillas iniciales.
- [ ] ¿La Biblioteca es solo interna o también un valor visible de venta?
- [ ] Modelo del marketplace de servicios (3.0): comisión, verificación de terceros.
