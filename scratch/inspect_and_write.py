import os
import glob

output_file = "/Users/danielvazquez/Proyectos/StreetBoss/brand-assets/05-calendar/week-01/WEEK_01_DEMONSTRATION_REDESIGN.md"

# Scan screenshots
screenshots_dir = "/Users/danielvazquez/Proyectos/StreetBoss/assets/imagenes/desktop-screenshots"
png_files = glob.glob(os.path.join(screenshots_dir, "*.PNG")) + glob.glob(os.path.join(screenshots_dir, "*.png"))

inventory_lines = []
for p in sorted(png_files):
    name = os.path.basename(p)
    size_kb = os.path.getsize(p) // 1024
    inventory_lines.append(
        f"| `assets/imagenes/desktop-screenshots/{name}` | Pantalla Cruda | ~{size_kb} KB | 🔴 Requiere limpieza y recorte (nombres UUID) | Sí | No | V1 |"
    )

inventory_table = "\n".join(inventory_lines)

content = f"""# 🎬 WEEK 01 · Rediseño Demostrativo de Contenido · StreetBoss

**Estado del Piloto:** `SEMANA 1 REQUIERE REDISEÑO DEMOSTRATIVO`  
**Objetivo:** Cambiar el enfoque de branding genérico por demostración directa del producto real (escaparate móvil, carrito y pedido a WhatsApp).

---

## 🔍 Fase 1 — Inventario del Producto Real (Screenshots)

Se localizaron **{len(png_files)} archivos** de captura de pantalla de interfaz. Debido a que tienen nombres UUID y corresponden a capturas crudas de desarrollo, **están bloqueados para redes hasta su limpieza, recorte y anotación**.

| Ruta del Archivo | Pantalla Tentativa | Tamaño Aprox | Estado Visual | ¿Corresponde al Producto? | ¿Info Sensible? | Versión |
|---|---|---|---|---|---|---|
{inventory_table}

*Nota: Todas las capturas reales están bloqueadas bajo el marcador `[CAPTURAS_PRODUCTO_PENDIENTES]` y `[GRABACION_FLUJO_PENDIENTE]` hasta que se entreguen versiones limpias y anotadas.*

---

## 📐 Fase 2 — Nueva Arquitectura Demostrativa (P01 - P07)

### 📌 P01 — ESTO ES STREETBOSS
* **Problema:** El restaurante no sabe qué es StreetBoss (lo confunde con un menú QR estático o una app de delivery).
* **Qué demuestra:** El escaparate móvil real en funcionamiento.
* **Capturas Requeridas:** Vista móvil del menú con navegación por categorías y acción de agregar producto.
* **Secuencia Visual:**
  1. 0-2s: Comida real (antojo).
  2. 2-5s: Transición a un celular mostrando la navegación por categorías del escaparate.
  3. 5-10s: Clic en "Agregar al carrito", aumento del contador y animación del carrito flotante.
  4. 10-15s: Transición a mensaje estructurado de WhatsApp.
* **Formato / Duración:** Reel / 15 segundos.
* **Texto Principal:** "Tu menú deja de ser una lista. Se convierte en tu escaparate de venta directa."
* **Texto Secundario:** "Sin comisiones. Directo a tu WhatsApp."
* **CTA:** "Pide tu demo de 15 minutos."
* **Recurso Gastronómico:** Tacos al pastor (Source V03).
* **Recurso de Producto:** Escaparate móvil en celular (mockup).
* **Estado:** `REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO` | `BLOQUEADA_POR_DATO`

### 📌 P02 — DEL ANTOJO AL PEDIDO
* **Problema:** Incertidumbre sobre la fricción para el comensal.
* **Qué demuestra:** El flujo paso a paso del cliente.
* **Capturas Requeridas:** 6 capturas secuenciales de la interfaz (escaparate -> categorías -> agregar -> carrito -> checkout -> WhatsApp).
* **Formato:** Carrusel de 7 slides (1080×1350).
* **Texto Principal:** "Así de fácil te pide tu cliente."
* **CTA:** "Escríbenos por WhatsApp."
* **Estado:** `REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO`

### 📌 P03 — LA COMIDA VENDE PRIMERO
* **Problema:** Los menús QR tradicionales (PDFs) no incitan a la compra.
* **Qué demuestra:** Comparación de valor visual (PDF vs Escaparate visual).
* **Capturas Requeridas:** Captura de un PDF de texto simple frente a una tarjeta visual de producto de StreetBoss con foto premium.
* **Formato:** Post (1080×1350).
* **Texto Principal:** "No basta con decir qué vendes. Hay que hacer que se antoje."
* **Estado:** `REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO`

### 📌 P04 — ASÍ LLEGA EL PEDIDO
* **Problema:** El caos de interpretar mensajes de texto plano en cocina.
* **Qué demuestra:** El pedido estructurado y limpio que llega al WhatsApp del restaurante.
* **Capturas Requeridas:** Captura del carrito de compras y del texto estructurado final en WhatsApp.
* **Formato:** Carrusel / Post (1080×1350).
* **Texto Principal:** "Tu cliente elige. StreetBoss ordena. Tú recibes el pedido listo para atender."
* **Estado:** `REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO`

### 📌 P05 — ANTES Y DESPUÉS DEL PEDIDO
* **Problema:** Pérdida de tiempo descifrando audios y textos incompletos.
* **Qué demuestra:** Comparación de flujos de pedido.
* **Capturas Requeridas:** Texto de WhatsApp caótico tradicional vs ticket estructurado de StreetBoss.
* **Formato:** Reel Cover / Video.
* **Texto Principal:** "Ordena tu WhatsApp. Simplifica tu cocina."
* **Estado:** `REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO`

### 📌 P06 — NO ES OTRO MENÚ QR
* **Problema:** Confusión de categoría.
* **Qué demuestra:** Tabla comparativa de características (PDF estático vs Escaparate interactivo).
* **Formato:** LinkedIn Document (1080×1350).
* **Texto Principal:** "Un QR tradicional muestra. StreetBoss vende."
* **Estado:** `REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO`

### 📌 P07 — VENDE DIRECTO. MANDA TÚ.
* **Problema:** Falta de convicción comercial para dar el paso.
* **Qué demuestra:** Recopilación de las 3 fases clave (Escaparate, Carrito, Pedido a WhatsApp).
* **Formato:** Post / Reel (1080×1350).
* **Texto Principal:** "Tu menú. Tus clientes. Tus precios. Tus pedidos."
* **Estado:** `REQUIERE_REPLANTEAMIENTO_DE_CONTENIDO`

---

## 🎬 Fase 6 — Storyboards Cuadro por Cuadro

### Storyboard P01 — "Esto es StreetBoss" (Reel, 12 segundos)
* **0-2s:**
  - *Imagen/Acción:* Tacos al pastor jugosos (Source V03) en primer plano macro con humo saliendo.
  - *Captura Requerida:* Ninguna (comida base).
  - *Texto en pantalla:* "¿Sigues vendiendo por PDF?"
  - *Transición:* Zoom in rápido al centro.
* **2-6s:**
  - *Imagen/Acción:* Mockup de celular en 3D/Flat que muestra la navegación por el escaparate real. El dedo del usuario hace scroll hacia abajo pasando por categorías.
  - *Captura Requerida:* `[CAPTURAS_PRODUCTO_PENDIENTES]` (Escaparate móvil).
  - *Texto en pantalla:* "Pásate a tu Escaparate de Venta Directa."
  - *Transición:* Desplazamiento lateral rápido.
* **6-9s:**
  - *Imagen/Acción:* Zoom al botón "Agregar" de una hamburguesa. Al pulsarlo, el botón cambia de estado y el carrito inferior se activa con "1 producto ($120)".
  - *Captura Requerida:* `[CAPTURAS_PRODUCTO_PENDIENTES]` (Acción de compra).
  - *Texto en pantalla:* "Tu cliente elige y suma solo."
  - *Transición:* Fade out.
* **9-12s:**
  - *Imagen/Acción:* Captura del mensaje estructurado de WhatsApp. Logo oficial de StreetBoss.
  - *Captura Requerida:* `[PEDIDO_ESTRUCTURADO_REAL_PENDIENTE]`.
  - *Texto en pantalla:* "Vende directo. Manda tú."
  - *Transición:* Cierre a negro.

### Storyboard P04 — "Así llega el pedido" (Reel, 9 segundos)
* **0-3s:**
  - *Imagen/Acción:* Mano sosteniendo un teléfono. Se muestra el carrito de compras del escaparate lleno con 3 productos. El dedo pulsa "Enviar pedido a WhatsApp".
  - *Captura Requerida:* `[CAPTURAS_PRODUCTO_PENDIENTES]` (Carrito de compra).
  - *Texto en pantalla:* "Tus clientes arman su pedido."
  - *Transición:* Slide a la derecha.
* **3-6s:**
  - *Imagen/Acción:* Pantalla de chat de WhatsApp con el pedido estructurado llegando con salto de líneas perfecto: productos, extras, subtotal y método de entrega.
  - *Captura Requerida:* `[PEDIDO_ESTRUCTURADO_REAL_PENDIENTE]`.
  - *Texto en pantalla:* "Tú lo recibes ordenado y sumado."
  - *Transición:* Zoom out a la marca.
* **6-9s:**
  - *Imagen/Acción:* Logo horizontal de StreetBoss sobre fondo Charcoal.
  - *Captura Requerida:* Ninguna.
  - *Texto en pantalla:* "Menos errores, más velocidad. StreetBoss."
  - *Transición:* Fade.

### Storyboard P05 — "Antes y Después" (Reel, 10 segundos)
* **0-4s:**
  - *Imagen/Acción:* Pantalla dividida o secuencia de chat caótico tradicional de WhatsApp (captura ficticia pero neutral): mensajes desordenados, audios largos, preguntas de "¿Cuánto es?".
  - *Captura Requerida:* Ninguna (representación tipográfica).
  - *Texto en pantalla:* "ANTES: El caos de las 2:00 PM."
  - *Transición:* Corte directo en seco con sonido de campana/alerta.
* **4-8s:**
  - *Imagen/Acción:* Captura limpia del pedido estructurado de StreetBoss llegando a WhatsApp con formato perfecto de ticket.
  - *Captura Requerida:* `[PEDIDO_ESTRUCTURADO_REAL_PENDIENTE]`.
  - *Texto en pantalla:* "AHORA: Pedido listo para cocina."
  - *Transición:* Fade.
* **8-10s:**
  - *Imagen/Acción:* Reclamo de marca StreetBoss.
  - *Captura Requerida:* Ninguna.
  - *Texto en pantalla:* "Devuélvele el orden a tu restaurante."
  - *Transición:* Cierre.

### Storyboard P07 — "Vende Directo. Manda tú." (Reel, 12 segundos)
* **0-3s:**
  - *Imagen/Acción:* Toma rápida macro de comida (0.5s), seguida de toma del celular navegando por el escaparate.
  - *Captura Requerida:* `[CAPTURAS_PRODUCTO_PENDIENTES]`.
  - *Texto en pantalla:* "Tu comida. Tu escaparate."
  - *Transición:* Corte rápido.
* **3-6s:**
  - *Imagen/Acción:* El carrito de compras del cliente calculando el total sin comisión de delivery.
  - *Captura Requerida:* `[CAPTURAS_PRODUCTO_PENDIENTES]`.
  - *Texto en pantalla:* "Tus comisiones en 0%."
  - *Transición:* Corte rápido.
* **6-9s:**
  - *Imagen/Acción:* Captura del mensaje estructurado final enviado al WhatsApp del restaurante.
  - *Captura Requerida:* `[PEDIDO_ESTRUCTURADO_REAL_PENDIENTE]`.
  - *Texto en pantalla:* "Tus pedidos directo a tu celular."
  - *Transición:* Fade out.
* **9-12s:**
  - *Imagen/Acción:* Logo oficial horizontal de StreetBoss con el tagline y el símbolo ® visibles.
  - *Captura Requerida:* Ninguna.
  - *Texto en pantalla:* "El que cocina, manda. Pide tu demo hoy."
  - *Transición:* Cierre.
"""

with open(output_file, "w") as f:
    f.write(content)

print("Redesign file created successfully!")
