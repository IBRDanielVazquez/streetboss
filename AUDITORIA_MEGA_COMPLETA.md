# Auditoría Mega Completa StreetBoss

**Fecha:** 2026-07-04 03:14:21 CST  
**Objetivo:** validar readiness para comercializar.  
**Resultado ejecutivo:** NO listo para comercializar demos visuales todavía.

## Veredicto

**Estado:** BLOQUEADO PARA VENTA VISUAL.

StreetBoss sí compila, el SuperAdmin funciona, el carrito calcula bien y el checkout básico se habilita correctamente. Pero la estructura esperada por la auditoría no existe, faltan los 5 `demo.json`, no existen logos por demo, no existe `public/demos/img`, los slugs comerciales no coinciden con el checklist, la mayoría de productos no tiene imagen real, las imágenes existentes son pesadas y el bundle queda arriba del objetivo.

## Bloqueadores críticos

1. **No existen los 5 `src/data/demos/*.json`.**  
   Dato confirmado: solo existe `src/data/menu.js`.

2. **No existe la estructura `public/demos/img/logos` ni `public/demos/img/productos/{01..05}`.**  
   Dato confirmado: solo existe `public/productos`.

3. **No hay logos de los 5 demos.**  
   Dato confirmado: no existe ningún `logo-01.png` a `logo-05.png`.

4. **Los slugs esperados no coinciden con los slugs reales en 3 demos.**  
   Dato confirmado:
   - Esperado: `/la-vitola`; real funcional: `/lavitola/menu`.
   - Esperado: `/mariscos-el-puerto`; real funcional: `/mariscos-elpuerto/menu`.
   - Esperado: `/cafe-la-esquina`; real funcional: `/cafe-laesquina/menu`.

5. **Las URLs directas del checklist no muestran el menú digital.**  
   Dato confirmado en navegador:
   - `/la-vitola`, `/tacos-don-beto`, `/pizza-rapida`, `/mariscos-el-puerto`, `/cafe-la-esquina` redirigen a `/:slug/mesero` y no mostraron contenido visible durante la prueba.
   - Las URLs que sí muestran menú son las que terminan en `/menu`.

6. **Las demos no son visualmente vendibles todavía.**  
   Dato confirmado: cada demo tiene 16-19 productos, pero solo 1 imagen real por demo en el menú renderizado. El resto muestra placeholder de emoji.

7. **Imágenes demasiado pesadas.**  
   Dato confirmado: 22/22 archivos en `public/productos` pesan más de 300 KB. Hay archivos de 512 KB a 2.2 MB.

8. **Performance fuera de umbral.**  
   Dato confirmado:
   - `dist/`: 16 MB, objetivo auditado: < 5 MB.
   - JS principal: 681.88 kB minificado, objetivo auditado: < 500 KB.
   - Vite emitió warning por chunk mayor a 500 KB.

9. **No existe script de lint.**  
   Dato confirmado: `npm run lint` falla con `Missing script: "lint"`.

10. **Falta modal/detalle de producto.**  
    Dato confirmado por código y navegador: al producto se le agrega desde la card; no hay modal de detalle al hacer click en producto.

## Sección 1: estructura y demos

### 1.1 `src/data/demos/*.json`

**Resultado:** FALLA.

Comando equivalente:

```bash
find src/data public/demos -maxdepth 5 -type f -print 2>/dev/null | sort
```

Salida relevante:

```text
src/data/menu.js
```

No existen:

- `01-la-vitola.json`
- `02-tacos-don-beto.json`
- `03-pizza-rapida.json`
- `04-mariscos-el-puerto.json`
- `05-cafe-la-esquina.json`

### 1.2 Datos reales disponibles

Dato confirmado en `src/data/menu.js`:

| Slug real | Categorías | Productos | Con foto | Sin foto |
|---|---:|---:|---:|---:|
| `lavitola` | 4 | 17 | 1 | 16 |
| `tacos-don-beto` | 4 | 16 | 1 | 15 |
| `pizza-rapida` | 5 | 17 | 1 | 16 |
| `mariscos-elpuerto` | 5 | 17 | 1 | 16 |
| `cafe-laesquina` | 5 | 19 | 1 | 18 |

## Sección 2: imágenes

### 2.1 Logos

**Resultado:** BLOQUEADOR CRÍTICO.

Dato confirmado: no existe `public/demos/img/logos/`.

### 2.2 Imágenes de producto

**Resultado:** FALLA contra la estructura esperada.

Dato confirmado:

```text
public/productos
```

Conteo:

```text
22 archivos
22 PNG/WebP
```

La auditoría esperaba 40+ imágenes en carpetas por demo. El repositorio tiene 22 imágenes totales y el menú renderizado solo usa 5 de ellas como imagen demo principal.

### 2.3 Optimización

**Resultado:** FALLA.

Dato confirmado:

```text
public/productos: 14M
22/22 imágenes > 300 KB
```

Archivos > 500 KB más relevantes:

```text
2.2M public/productos/d2-relleno.png
892K public/productos/demo_coctel.png
881K public/productos/demo_taco.png
811K public/productos/demo_pizza.png
717K public/productos/demo_cafe.png
713K public/productos/demo_burger.png
619K public/productos/h3-mermelada-tocino.png
615K public/productos/d3-pizza-dog.png
610K public/productos/h2-hawaiian.png
549K public/productos/h1-clasica.png
```

## Sección 3: funcionalidad core

### 3.1 SuperAdmin

**Resultado:** PASA.

Dato confirmado en navegador:

- `/superadmin` pide PIN.
- PIN `SBPRO-1512` abre dashboard.
- Se ve lista de 5 clientes.
- Muestra links:
  - `http://localhost:5175/lavitola`
  - `http://localhost:5175/tacos-don-beto`
  - `http://localhost:5175/pizza-rapida`
  - `http://localhost:5175/mariscos-elpuerto`
  - `http://localhost:5175/cafe-laesquina`

### 3.2 Cada demo en URL

**Resultado:** FALLA contra las URLs del checklist.

Dato confirmado en navegador:

| Ruta probada | Menú digital | Productos | Resultado |
|---|---:|---:|---|
| `/la-vitola` | No | No | Redirige a `/la-vitola/mesero`, sin contenido visible |
| `/la-vitola/menu` | Sí | No | Slug sin datos |
| `/lavitola/menu` | Sí | Sí | Funciona |
| `/tacos-don-beto` | No | No | Redirige a `/tacos-don-beto/mesero`, sin contenido visible |
| `/tacos-don-beto/menu` | Sí | Sí | Funciona |
| `/pizza-rapida` | No | No | Redirige a `/pizza-rapida/mesero`, sin contenido visible |
| `/pizza-rapida/menu` | Sí | Sí | Funciona |
| `/mariscos-el-puerto/menu` | Sí | No | Slug sin datos |
| `/mariscos-elpuerto/menu` | Sí | Sí | Funciona |
| `/cafe-la-esquina/menu` | Sí | No | Slug sin datos |
| `/cafe-laesquina/menu` | Sí | Sí | Funciona |

### 3.3 Menú digital visual

**Resultado:** PARCIAL.

Dato confirmado:

- Se ve grid de productos.
- Las cards muestran nombre, descripción, precio y botón agregar.
- Solo 1 producto de La Vitola tiene imagen real; el resto muestra emoji.
- No hay modal/detalle de producto.
- Se puede agregar al carrito desde card.

### 3.4 Carrito

**Resultado:** PASA.

Prueba en navegador sobre `/lavitola/menu`:

- Se agregaron 3 productos distintos.
- Contador mostró `3`.
- Total mostrado: `$305`.
- Cálculo confirmado: `$95 + $100 + $110 = $305`.
- En checkout se listaron los 3 productos.
- Se pueden aumentar/disminuir cantidades desde el checkout.

### 3.5 Checkout

**Resultado:** PASA básico.

Dato confirmado:

- El checkout se abre como bottom sheet con botón `Ver pedido`.
- Pide `Tu nombre`.
- Pide `Tu WhatsApp`.
- Muestra método de pago.
- En configuración demo solo aparece efectivo.
- Botón `Confirmar pedido` está deshabilitado sin datos.
- Al llenar nombre y WhatsApp, el botón queda habilitado.

### 3.6 WhatsApp

**Resultado:** PARCIAL, validado por código sin enviar pedido real.

Dato confirmado en `src/pages/MenuDigital.jsx`:

- Usa `window.open("https://wa.me/52...")`.
- Mensaje incluye cliente, WhatsApp, tipo, listado de productos, subtotal, envío, pago, total y folio.
- Folio se genera con formato `SB-XXXX-1234`.

No se hizo click final para no abrir un pedido real en WhatsApp con datos de prueba.

## Sección 4: UI/UX comercial

### 4.1 Colores

**Resultado:** PASA en sistema base, parcial en menú digital.

Dato confirmado:

- `tailwind.config.js` define:
  - `primary: #f5b87a`
  - `dark: #111111`
  - `dark2: #1a1a1a`
  - `dark3: #222222`
- `body` usa `background: #111`.
- El menú digital usa fondo claro `#FAFAFA`, no dark commercial theme.

### 4.2 Mobile

**Resultado:** PARCIAL.

Prueba: viewport iPhone 12 aproximado `390x844` sobre `/lavitola/menu`.

Dato confirmado:

- No hay scroll horizontal global: `scrollWidth = 390`, `clientWidth = 390`.
- La imagen principal se ve completa y carga correctamente.
- El layout es usable.
- Los botones de categoría y `Agregar` tienen 36 px de alto, por debajo del objetivo de 48 px.
- La barra de categorías tiene overflow horizontal interno, esperado por diseño.

### 4.3 Tipografía

**Resultado:** PASA básico.

Dato confirmado:

- Fuente: `Inter`, `system-ui`, `sans-serif`.
- Títulos visibles.
- Body text de descripciones usa clases pequeñas (`text-xs`) en varias cards, puede sentirse bajo para venta móvil.

## Sección 5: PWA

### 5.1 Manifest

**Resultado:** PASA.

Dato confirmado en `public/manifest.json`:

```json
{
  "name": "StreetBoss",
  "start_url": "./",
  "display": "standalone",
  "theme_color": "#f5b87a"
}
```

### 5.2 Instalable

**Resultado:** NO VALIDADO COMPLETAMENTE.

Dato confirmado:

- Existe manifest.
- No se encontró service worker (`sw.js` o equivalente).

Análisis inferido: puede mostrarse como instalable en algunos navegadores por manifest/localhost, pero para una experiencia PWA robusta conviene agregar service worker y validar con Lighthouse/Chrome Application panel.

## Sección 6: build y performance

### 6.1 Build

**Resultado:** PASA con warning.

Comando:

```bash
npm run build
```

Salida relevante:

```text
✓ 2029 modules transformed.
dist/index.html                   1.06 kB │ gzip:   0.50 kB
dist/assets/index-a0SmQXPo.css   41.78 kB │ gzip:   7.58 kB
dist/assets/index-DxapIZS8.js   681.88 kB │ gzip: 191.69 kB

(!) Some chunks are larger than 500 kB after minification.
✓ built in 40.61s
```

### 6.2 Tamaño

**Resultado:** FALLA contra umbrales.

Dato confirmado:

```text
dist/: 16M
JS principal: 681.88 kB
CSS: 41.78 kB
```

Objetivos auditados:

- `dist/ < 5MB`: falla.
- Main bundle `< 500KB`: falla.

### 6.3 Console errors

**Resultado:** PASA sin errores rojos, con warnings.

Dato confirmado en navegador:

- No se detectaron errores de consola durante pruebas de menú y SuperAdmin.
- Warnings repetidos de React Router future flags:
  - `v7_startTransition`
  - `v7_relativeSplatPath`

## Sección 7: bugs críticos

### Lint

**Resultado:** FALLA por falta de script.

Comando:

```bash
npm run lint
```

Resultado:

```text
npm error Missing script: "lint"
```

## Readiness comercial

| Área | Estado | Tipo de evidencia |
|---|---|---|
| SuperAdmin | Pasa | Dato confirmado |
| Build | Pasa con warning | Dato confirmado |
| Carrito | Pasa | Dato confirmado |
| Checkout básico | Pasa | Dato confirmado |
| WhatsApp | Parcial | Dato confirmado por código |
| Demos JSON | Falla | Dato confirmado |
| Logos demo | Falla | Dato confirmado |
| Slugs comerciales | Falla | Dato confirmado |
| Imágenes por producto | Falla | Dato confirmado |
| Performance assets | Falla | Dato confirmado |
| Mobile touch targets | Parcial/falla | Dato confirmado |
| PWA install prompt | No validado | No visible públicamente en esta prueba |

## Recomendación estratégica

Prioridad 1:

- Decidir si la arquitectura oficial será `src/data/demos/*.json` + `public/demos/img/...` o el esquema actual `src/data/menu.js` + `public/productos`.
- Normalizar slugs para que las URLs comerciales coincidan con lo que se vende.
- Hacer que cada demo venda desde `/:slug/menu` o cambiar el router para que `/:slug` abra el menú digital.

Prioridad 2:

- Crear logos demo.
- Asignar imagen real a mínimo 8 productos por demo.
- Convertir imágenes a WebP y bajarlas idealmente a < 200-300 KB.
- Eliminar assets no usados o conectar los assets existentes a productos reales.

Prioridad 3:

- Subir alto de botones móviles a mínimo 48 px.
- Implementar modal/detalle de producto si sigue siendo requisito comercial.
- Agregar `npm run lint`.
- Code-splitting para bajar el chunk principal.
- Agregar service worker o validar installability con Lighthouse.

## Conclusión

StreetBoss tiene una base funcional, pero no está listo para enseñar como paquete comercial visual de 5 demos. La mayor brecha no es el carrito ni el checkout: es la presentación vendible de los demos, la consistencia de URLs, los logos, las imágenes reales por producto y el peso de assets.

