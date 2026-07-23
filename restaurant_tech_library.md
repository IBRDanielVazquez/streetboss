# 📚 Biblioteca Estratégica: Restaurant Tech & SaaS Menús Digitales

## 1. Análisis de Competidores y Posicionamiento

### OlaClick & Menú Digitales Gratuitos
- **Propuesta de Valor:** Creación gratuita de menú, sin comisiones por pedido, pedidos llegan directo a WhatsApp.
- **Dolor que atacan:** Restauranteros cansados de pagar 30%+ a UberEats/Rappi o de lidiar con mensajes de WhatsApp desordenados.
- **Brecha de Oportunidad (Para StreetBoss):** Sus plataformas suelen sentirse como "herramientas gratuitas" (básicas, genéricas). **StreetBoss** debe posicionarse como la **"Alternativa Premium"**. No es solo un menú gratis, es un "Punto de Venta completo que empieza en tu WhatsApp".

### Toast, Fudo, Loyverse (POS Tradicionales/Cloud)
- **Propuesta de Valor:** Gestión integral (Caja, inventario, reportes).
- **Brecha de Oportunidad:** Son complejos, lentos de configurar y no siempre conectan bien la experiencia del usuario final (el menú móvil) con el negocio. **StreetBoss** conecta el menú móvil ultra-rápido directamente con la logística (GPS de envíos).

## 2. Copywriting de Alta Conversión (B2B Gastronómico)
La Landing Page B2B para restaurantes debe ser agresiva contra los problemas operativos diarios:
- ❌ "Tenemos una plataforma web." -> ✅ "Recibe comandas estructuradas. Dile adiós a los audios incomprensibles de WhatsApp."
- ❌ "Cálculo de rutas." -> ✅ "Cobra exactamente lo justo por cada envío. Nuestro GPS calcula la distancia en tiempo real."
- ❌ "Punto de venta." -> ✅ "Imprime códigos QR para tus mesas, toma pedidos y cobra. Todo sin instalar aplicaciones."

## 3. Arquitectura UX/UI para la Landing Page (Estilo "Linear/Vercel")
La landing actual era genérica. Una "Super Mega Landing" requiere:
1. **Hero Asimétrico o Centrado de Alto Impacto:** Texto enorme, gradiente sutil. Un botón CTA brillante.
2. **"Social Proof" Inmediato:** Logos de tecnología que respaldan (WhatsApp, Google Maps, Supabase, React).
3. **Bento Box UI:** Mostrar las "Features" en cajas redondeadas (estilo Bento Box) con micro-ilustraciones o recortes de la interfaz real.
4. **Demostración Práctica (El "Aha!" moment):** Mostrar los 5 demos en un carrusel interactivo o grilla flotante.
5. **Comparativa Transparente:** Una tabla o sección de "Apps de Delivery vs StreetBoss" (Comisiones: 30% vs 0%).

## 4. Estructura Exacta para la Nueva `Landing.jsx`

1. **Top Nav:** Logo minimalista, Demos, Beneficios, CTA "Empezar Gratis".
2. **Hero:** 
   - Titular: "El Menú Digital Inteligente que Sí Convierte."
   - Sub: "Sin comisiones, pedidos directos a WhatsApp y cálculo automático de envíos por GPS. La tecnología de las grandes franquicias, ahora en tu restaurante."
3. **Hero Visual:** Mockup flotante animado.
4. **Trust Bar:** Integrado con WhatsApp Business, Google Maps, etc.
5. **Bento Grid de Funciones:** 
   - Feature 1: "Cero Comisiones. 100% tuyo."
   - Feature 2: "Envíos GPS Precisos."
   - Feature 3: "Mesas y Códigos QR."
   - Feature 4: "Catálogo en Tiempo Real."
6. **Showcase de Demos:** Las 5 plantillas en vivo.
7. **Pricing Section:** Claro y directo (Prueba de 14 días gratis).
8. **Footer.**

Esta biblioteca sirve de base arquitectónica. Procediendo a programar `Landing.jsx` con estos principios.
