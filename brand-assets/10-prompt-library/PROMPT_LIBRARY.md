# 🎨 Biblioteca de Prompts · StreetBoss

Prompts paramétricos reutilizables. Modificar SOLO las variables entre `[ ]` (regla de `07_AI_PROMPT_LIBRARY`). **Nunca generar el logo por IA**: las escenas se generan SIN logo y el logo se integra después con el SVG maestro de `brand-core/`.

## Reglas transversales

- Sin logo, sin texto generado dentro de la imagen (salvo que sea imprescindible y legible).
- Dejar **espacio negativo** para integrar titular (Poppins) y logo.
- Indicar siempre: **ratio**, posición del dispositivo/texto, dirección de luz, lente, estilo.
- Paleta: fondos oscuros Charcoal `#0D0E12`, acento `#FF4B00`. Estética FoodTech internacional, flat premium, alto contraste, moody.
- Sin rostros protagonistas. Manos, platillos, empaques, cocinas, dispositivos: permitidos.
- Producto real: usar capturas/componentes reales; no inventar interfaces ilegibles.

---

## A. FoodPorn (base)

> Fotografía hiperrealista de producto gastronómico de alta gama: **[PLATILLO]**. Estilo Food Porn premium. Iluminación moody y luz dura (hard light) que resalte texturas, brillo de la grasa y volumen. Fondo oscuro con textura de **[TEXTURA_FONDO]**. Colores saturados del espectro del apetito (rojos, naranjas, amarillos). Disparo macro/close-up con lente 85mm, calidad cinematográfica. Sin logo, sin texto. Ratio **[9:16 / 1:1 / 4:5]**. Espacio negativo arriba para titular.

**Variables por vertical:**
- Restaurantes: `[PLATILLO]=corte de res a la parrilla`, `[TEXTURA_FONDO]=madera carbonizada`.
- Taquerías: `[PLATILLO]=tacos al pastor con piña`, `[TEXTURA_FONDO]=comal de hierro`.
- Cafeterías: `[PLATILLO]=latte art y pan artesanal`, `[TEXTURA_FONDO]=madera clara oscurecida`.
- Pizzerías: `[PLATILLO]=pizza con queso derretido`, `[TEXTURA_FONDO]=horno de leña`.
- Food Trucks: `[PLATILLO]=hamburguesa con salsa cayendo`, `[TEXTURA_FONDO]=metal oxidado nocturno`.
- Dark Kitchens: `[PLATILLO]=bowl gourmet en empaque premium`, `[TEXTURA_FONDO]=concreto oscuro`.
- Marisquerías: `[PLATILLO]=tostada de camarón con limón`, `[TEXTURA_FONDO]=hielo y pizarra`.
- Panaderías: `[PLATILLO]=pan recién horneado con vapor`, `[TEXTURA_FONDO]=charola de acero`.

## B. Mockups móviles / Escaparate digital

> Mockup 3D hiperrealista de **[DISPOSITIVO=celular]** mostrando un escaparate digital de restaurante (interfaz oscura, tarjetas de producto con foto grande y botón naranja `#FF4B00`, carrito flotante), sostenido por **[una mano / sobre una mesa de restaurante]** con ingredientes desenfocados al fondo (bokeh). Iluminación de estudio dramática, fondo oscuro minimalista, sombras suaves realistas. Proporciones de UI precisas y legibles. Sin logo (se integra después). Ratio **[9:16 / 1:1]**.

## C. Pedidos / Empaques / Cocinas

> Escena editorial hiperrealista de **[EMPAQUE kraft / bolsa de comida / cocina de restaurante / mesa servida]** en ambiente gastronómico premium, luz cálida direccional, fondo oscuro, imperfecciones realistas (arrugas, reflejos). Enfoque en manos y objetos, sin rostros. Espacio negativo para texto. Sin logo. Ratio **[9:16 / 4:5]**.

## D. Fondos / Texturas (piezas gráficas)

> Fondo premium Boss Charcoal `#0D0E12` con textura de **[pizarra / metal oscuro / concreto / madera carbonizada]**, viñeta sutil, acento naranja `#FF4B00` mínimo, mucho espacio negativo para titular Poppins ExtraBold. Estética FoodTech internacional, flat, alto contraste. Sin texto, sin logo. Ratio **[1:1 / 4:5 / 16:9]**.

## E. Reels / Movimiento (por toma)

> Clip vertical 9:16 de **[ESCENA]**. Movimiento: **[push-in macro / seguimiento del dedo / whip-pan / slow motion]**. Iluminación moody, colores saturados, calidad cinematográfica. Sin logo, sin texto (se agrega en edición). Duración **[3-5s]**.

## F. Portadas (Covers)

> `COVER_FOOD_DARK`: Panorámica gastronómica premium sobre fondo Charcoal, comida a un lado con luz dura moody, gran espacio negativo al lado opuesto para logo y titular. Sin logo, sin texto. Ratio **[16:9 / 1640:924 / 2560:1440]**.

## G. Anuncios (Meta Ads)

> Composición publicitaria de alto impacto: **[PLATILLO o mockup]** protagonista sobre Charcoal, espacio superior para gancho y espacio inferior para CTA. Luz dura, saturación de apetito, sin logo (se integra), legible en móvil. Ratio **[4:5 / 1:1 / 9:16]**.

## H. Copywriting (asistente, texto)

> Actúa como el Director Comercial de StreetBoss. Escribe un copy publicitario. Objetivo: **[OBJETIVO]**. Dolor a atacar: **[DOLOR]**. Tono: directo, autoritario pero empático, cero jerga de software (sin SaaS/backend). Estructura: gancho agresivo, problema, StreetBoss como escaparate visual de venta directa, CTA claro. Máx. 3 emojis, sin asteriscos, ≤5 hashtags.

---

## Archivos de esta biblioteca

- [`PROMPT_LIBRARY.md`](PROMPT_LIBRARY.md) — este índice maestro.
- `prompts_backgrounds.md` — fondos y covers (`COVER_FOOD_DARK` y variantes).
- Los prompts específicos por día ya están incrustados en cada archivo de `06-posts/` y `07-reels/`.
