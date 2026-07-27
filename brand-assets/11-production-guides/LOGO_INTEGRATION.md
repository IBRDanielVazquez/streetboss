# 🔒 Guía de Integración del Logo · StreetBoss

**Ley absoluta (`brand-core/05_Brand_Rules.md`):** prohibido regenerar, redibujar, vectorizar de nuevo o crear variantes del logo. Toda pieza **importa** los SVG maestros de `brand-core/`.

## Qué archivo usar

| Contexto | Archivo maestro |
|---|---|
| Composición horizontal, portadas, banners, OG, docs, presentaciones | `brand-core/01_Master_Logo.svg` |
| **Sobre fondo oscuro (Charcoal/negro)** | `brand-core/01_Master_Logo_Dark.svg` (Street en **blanco**) |
| Sobre fondo claro | `brand-core/01_Master_Logo.svg` o `01_Master_Logo_Light.svg` |
| Avatares, favicon, app icon, espacios reducidos | `brand-core/01_Master_Icon.svg` |

> ⚠️ **Aprendizaje de producción:** el `01_Master_Logo.svg` tiene "Street" en Charcoal `#0D0E12`. Sobre fondo oscuro **desaparece**. En Charcoal usar SIEMPRE la variante **`_Dark`**.

## Cómo referenciar en SVG de composición

```xml
<image xlink:href="../../brand-core/01_Master_Logo_Dark.svg" x="80" y="90" width="380" height="127"/>
```
(Ajustar la ruta relativa según la profundidad de la carpeta.)

## Área de protección y tamaño mínimo

- Respetar el clearspace de `brand-core/04_Logo_Clearspace.md` (nunca pegar texto/elementos al logo).
- Tamaño mínimo legible: logo horizontal ≥ 120 px de ancho; ícono ≥ 24 px.
- Proporción **bloqueada** (mantener aspect ratio 1500:500 del logo, 1:1 del icono).

## Prohibiciones (recordatorio)

Redibujar · generar por IA · vectorizar de nuevo · alterar proporciones/radios/separación/colores/tipografía · separar elementos · isotipos alternativos · 3D · degradados · sombras · sobrescribir los SVG maestros · mover archivos fuera de `brand-core/`.
