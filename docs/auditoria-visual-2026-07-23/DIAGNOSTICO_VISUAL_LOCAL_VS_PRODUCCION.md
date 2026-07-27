# HECHOS

- El respaldo `respaldo/pre-edicion-sitio-2026-07-23` con el commit `6fdbbdd` está correctamente resguardado. Ningún archivo destructivo o reseteo se ejecutó.
- La versión local expone su vista a través de Vite (`http://localhost:5175`).
- La versión de producción está activa en `https://streetboss.com.mx` servida como una aplicación React.
- La rama local está por delante de producción, incluyendo el pipeline de prospectos locales y el editor de pruebas demo de 7 días.

# ESTADO VISUAL ACTUAL

La Landing Page (tanto local como producción base) cuenta con un diseño oscuro (Boss Charcoal `#0D0E12`) acentuado por la paleta Street Orange (`#FF4B00`). Su estética es plana, priorizando la tipografía gruesa y un mensaje directo. La estructura es nativamente "Mobile First". No hay degradados pesados ni glassmorphism innecesario que rompa las directrices oficiales.

# SECCIONES EXISTENTES

1. **Navbar (Header):** Logo StreetBoss con punto naranja, enlaces (La Solución, Ver Demos, Calculadora ROI, Precios), CTA "Hablar con Ventas" hacia WhatsApp. Propósito: Navegación. Estado: Funcional, mobile responsive.
2. **Hero Section:** Titular "Tu Menú Digital. Tus Ganancias." y subtítulo sobre Cero Comisiones, envíos por GPS y pedidos por WhatsApp. CTA primario "Ver Oferta de Lanzamiento", CTA secundario "Explorar Demos". Estado: Terminado.
3. **Integraciones:** Social proof con logos (WhatsApp Business, Google Maps, Generador QR). Propósito: Refuerzo de autoridad. Estado: Terminado.
4. **Calculadora de ROI:** Herramienta interactiva para proyectar el ahorro mensual versus el delivery (30%). Propósito: Enganchar al usuario con los ahorros tangibles. Estado: Funcional y terminada.
5. **La Solución (Bento Box Features):** "Pedidos directo a tu WhatsApp" y "Envíos GPS Exactos". Propósito: Mostrar funcionamiento/beneficios. Estado: Terminado.
6. **Explorar Demos (Interactive Demos Section):** Grid interactivo que muestra las 10 plantillas base con hover y enlaces de WhatsApp. Propósito: Demostrar ejemplos reales de cada giro. Estado: Terminado.
7. **Precios (Oferta de Lanzamiento):** Paquete de $100 MXN mensuales y prueba de 7 días. Estado: Terminado.
8. **FAQ:** Acordeón con dudas comunes. Estado: Terminado.
9. **Footer:** Logotipo y enlaces rápidos. Estado: Terminado.

# DIFERENCIAS LOCAL VS PRODUCCIÓN

- **Diferencias de contenido y rutas:** Producción al estar desactualizada respecto al commit `6fdbbdd` carece de las integraciones profundas del pipeline de demos ("DemoAdmin", "DemoTrialDashboard").
- **Diferencias en navegación:** Local permite explorar las demostraciones de manera más orgánica e inicia los "trials" mediante la URL codificada gracias a los últimos cambios en `src/data/demoTrials.js`. Producción mantiene un flujo más estático.

# PROBLEMAS DE UX

- **Ausencia de Mockups:** El usuario lee mucho texto en el primer viewport (Hero) sin visualizar inmediatamente *qué* está comprando. No hay una demostración clara de un celular corriendo StreetBoss.
- **Jerarquía y Fricción:** La "Calculadora de ROI" aparece antes que las demostraciones visuales, lo que significa que el usuario es expuesto a métricas antes de conocer visualmente el producto.
- **CTAs Genéricos:** Los botones del Hero llevan a anclas de la misma página (#precios, #demos) en lugar de accionar inmediatamente un flujo de conversión o la creación de un menú de prueba.

# PROBLEMAS DE DISEÑO

- **Competencia con la comida:** Faltan imágenes fotográficas gastronómicas. La comida no es la protagonista en la portada; el texto lo es, dando una percepción equivocada de estar en un "SaaS genérico" o una agencia, y no en una plataforma para restaurantes.
- **Asimetría:** El Bento Box (La Solución) tiene 2 elementos ubicados en un layout de grilla asimétrico (`md:col-span-2` y `col-span-1`), lo cual puede parecer incompleto visualmente.

# PROBLEMAS DE CONTENIDO

- **Percepción Equivocada:** El enfoque actual del Hero suena sumamente corporativo. Se requiere un abordaje más directo para que el dueño del restaurante entienda inmediatamente que es un sistema para *vender*.

# PRIORIDADES DE EDICIÓN

1. Integrar un Mockup Visual de un celular real corriendo StreetBoss (con comida de protagonista) directamente en el Hero.
2. Reordenar las secciones: El producto visual (Mockup/Demos) debe ir por encima de las calculadoras y beneficios técnicos.
3. Ajustar el CTA principal del Hero para que inicie la acción de venta (WhatsApp) o visualización real, disminuyendo la fricción.

# PRIMER CAMBIO RECOMENDADO

- **Archivo Exacto:** `src/pages/Landing.jsx`
- **Componente Exacto:** `Hero Section` (el bloque `<section className="relative pt-40 pb-20...">`)
- **Problema que resuelve:** El exceso de texto "SaaS genérico" y la ausencia absoluta de una interfaz visual de StreetBoss en los primeros 5 segundos.
- **Impacto esperado:** Mejorar drásticamente la retención y conversión al mostrar inmediatamente al restaurantero un celular con un menú digital (protagonizando la comida), confirmando visualmente lo que el sistema hace.
- **Elementos intactos:** Permanecerán intactas la Calculadora de ROI, la grilla de Demos, las Integraciones y la Oferta de Lanzamiento.
