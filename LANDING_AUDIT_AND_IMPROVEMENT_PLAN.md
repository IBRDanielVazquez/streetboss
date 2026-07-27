# DIAGNÓSTICO Y PLAN DE MEJORA DE LANDING EXISTENTE
**Proyecto:** StreetBoss SEO Master (streetboss-web)

## 1. Inventario de landings existentes
Tras la auditoría del proyecto Vite actual en `src/pages`, se identificó:
- `Landing.jsx`: La página principal de marketing.
- *Nota:* Existen otras páginas bajo `/demo/*` (`DemoAdmin.jsx`, `DemoPublicMenu.jsx`, `DemoTrialDashboard.jsx`), pero forman parte del simulador de producto, no son páginas de captación SEO.
- No se encontraron otras landings archivadas en HTML o ramas muertas en el root.

## 2. Identificación de la landing oficial
La fuente oficial y base visual para el nuevo sitio será **`src/pages/Landing.jsx`**. Esta versión contiene el estado del arte más avanzado en cuanto a copy comercial, estructura de conversión y propuesta de valor.

## 3. Mapa completo de secciones actuales
La `Landing.jsx` actual se compone de 9 secciones bien definidas:
1. **Navbar:** Navegación anclada transparente/difuminada con CTA primario a WhatsApp.
2. **Hero:** Título principal ("Tu Menú Digital. Tus Ganancias."), subtítulo explicativo, botones duales ("Ver Oferta" / "Explorar Demos") y fondo con "glow".
3. **Social Proof (Integraciones):** Cinta de logotipos/íconos (WhatsApp, Google Maps, QR).
4. **Calculadora ROI:** Componente interactivo con input slider para visualizar ahorro en comisiones.
5. **Bento Box Features:** Grid de tarjetas destacando "Pedidos a WhatsApp" y "Envíos GPS".
6. **Demos Interactivos:** Galería de 10 tarjetas de restaurantes con imágenes de muestra, categorías y CTAs.
7. **Pricing (Oferta):** Tarjeta central destacada con precio promocional de $100 MXN y 7 días gratis.
8. **FAQ:** Acordeón de preguntas frecuentes.
9. **Footer:** Enlaces básicos y copyright.

## 4. Componentes reutilizables
En lugar de reconstruir, se portarán los siguientes componentes a Next.js (con refactorización menor a RSC/Client Components):
- `Navbar` (Requiere estado de scroll -> Client Component).
- `Hero` (Animaciones Framer Motion -> Client Component).
- `Calculadora` (Lógica de estado `ventasMensuales` -> Client Component).
- `FeatureCard` (Se puede abstraer de la Bento Box).
- `DemoCard` (Se puede abstraer de la sección Demos).
- `FAQ` (Acordeón, Server Component).

## 5. Contenido reutilizable
**Casi el 100% del copy actual es de altísimo valor y se conservará:**
- Eslogan: "Tu Menú Digital. Tus Ganancias."
- Argumentos: Cero intermediarios, envíos GPS exactos, órdenes directas a WhatsApp.
- Textos de la calculadora y FAQs.
- Nomenclatura y descripciones de los 10 demos de restaurantes.

## 6. Activos oficiales utilizados
- Tipografía estricta (Inter, Poppins).
- Iconografía de `lucide-react`.
- La paleta estricta de fondos oscuros, blancos absolutos y `Street Orange` para botones.
- *Problema actual:* Las imágenes de los demos cargan desde URLs hardcodeadas de otro proyecto Vercel (`https://streetboss-web.vercel.app/demos/img/...`). Esto se debe reemplazar.

## 7. Problemas de SEO
- **Crítico:** Renderizado del lado del cliente (Vite SPA). El HTML inicial está vacío, lo que retrasa y dificulta la indexación por parte de Google.
- Falta de etiquetas `<meta>` dinámicas, Open Graph, Canonical Tags, etc.
- Falta de JSON-LD estructurado para las FAQs y para SoftwareApplication.
- Inexistencia de estructura de URL profunda (todo vive en la Home con anclas `#`).

## 8. Problemas de UX/UI
- Las imágenes de los demos dependen de un servidor externo y no están optimizadas (uso de `<img src...>` crudo).
- Framer Motion en toda la página retrasa el "Time to Interactive" para usuarios con móviles de gama baja.
- Enlaces de los demos abren HTMLs externos estáticos y fragmentados.

## 9. Problemas de rendimiento
- Al ser una SPA, el usuario de marketing descarga el bundle entero de la aplicación (que incluye modales de cocina, caja, admin) solo para ver la Landing.

## 10. Problemas de accesibilidad
- Los inputs (como el slider de la calculadora) carecen de etiquetas `aria` robustas.
- Falta semántica estricta en el uso de `<section>`, `<article>`, y roles para screen-readers.

## 11. Problemas de conversión
- Todo el embudo cae en un único número de WhatsApp sin un parámetro UTMS/origen estructurado en Next.js.
- Se requiere que el usuario haga mucho scroll para ver el formulario/contacto si se añaden más Topic Clusters.

---

## 12. MEJORAS RECOMENDADAS POR PRIORIDAD

1. **Migración a Next.js App Router:** Portar la `Landing.jsx` al nuevo `page.tsx` usando Server Components para el esqueleto (Hero, Footer, FAQs) y Client Components aislados (`<Calculator />`, `<InteractiveDemos />`).
2. **Optimización de Activos:** Migrar las URLs hardcodeadas de imágenes de Vercel a archivos locales en `public/` y servirlas con `next/image` en formato WebP/AVIF.
3. **SEO Técnico Base:** Inyección de metadata en `layout.tsx` y JSON-LD Schema (FAQ y Organization).
4. **Desacoplamiento de Estilos:** Pasar las clases de Tailwind a CSS nativo/CSS Modules como fue ordenado en el plan técnico base.

## 13. ESTRATEGIA DE MIGRACIÓN A NEXT.JS
- Extraer el JSX estático de `Landing.jsx` y pegarlo en `streetboss-web/app/page.tsx`.
- Reemplazar Tailwind por CSS Modules o conservar Tailwind SOLO SI el usuario cambia la directiva, pero según las reglas previas, usaremos **Tailwind**? 
  *Nota sobre Tailwind:* La Landing original ESTÁ escrita en Tailwind. Migrar cientos de clases (gradientes, flex, grids) a CSS Modules a mano tomará muchísimo tiempo y es propenso a errores. **Se recomienda mantener Tailwind en el proyecto Next.js exclusivamente para mapear la UI existente de forma ágil, usando las variables de brand-core en el config.** *(Riesgo levantado para revisión).*
- Aislamiento: Los componentes interactivos (Navbar, Calculator) se separarán en `streetboss-web/components/`.

## 14. COMPARACIÓN DE ESTADOS
**ESTADO ACTUAL:** SPA monolítica (React), carga lenta inicial, nulo SEO, imágenes externas, bundle pesado.
**ESTADO OBJETIVO:** SSG (Static Site Generation) en Next.js, carga ultrarrápida, SEO perfecto (metadatos/JSON-LD), imágenes optimizadas, arquitectura lista para escalar hacia Topic Clusters.

## 15. ARCHIVOS: CONSERVAR, ADAPTAR, REEMPLAZAR
- `src/pages/Landing.jsx`: **SE CONSERVA INTACTO** en el proyecto Vite (como backup visual y para no romper nada).
- `streetboss-web/app/page.tsx`: **NUEVO** (Será la réplica adaptada de la Landing).
- `streetboss-web/components/Calculator.tsx`: **NUEVO** (Adaptado desde el código fuente de la landing).
- `streetboss-web/components/DemoGallery.tsx`: **NUEVO** (Adaptado desde el código fuente de la landing).
- Imágenes de los demos: **NUEVAS** (Se deberán descargar y almacenar en `public/brand/demos/` para eliminar la dependencia del Vercel externo).

---

## CLASIFICACIÓN DE CAMBIOS (Resumen de Impacto)

### HECHOS
- La landing actual (`Landing.jsx`) contiene el layout comercial aprobado y validado.
- La identidad visual ya utiliza correctamente las fuentes (Inter/Poppins) y los colores maestros.

### MEJORAS PROPUESTAS
- Aislar los componentes con estado (`"use client"`) para renderizar el resto del sitio en el servidor.
- Descargar y optimizar las imágenes de los demos que hoy apuntan a URLs externas.
- Inyectar JSON-LD estructurado en la sección de FAQs.

### ELEMENTOS QUE SE CONSERVAN
- Todo el Copywriting, jerarquía comercial y títulos.
- El diseño general: Navbar, Hero "Glow", Calculadora, Demos, Oferta y FAQs.
- Interacciones clave de la calculadora y llamadas a la acción (WhatsApp).

### ELEMENTOS QUE SE REFACTORIZAN
- Las clases CSS: Si se mantiene la orden de "CSS Modules", se debe traducir todo el Tailwind de `Landing.jsx` a CSS puro. *(Levantado como riesgo)*.
- Las etiquetas `<img>` pasarán a ser `<Image>` de Next.js.
- `react-router-dom` (`<Link>`) pasará a `next/link`.

### ELEMENTOS QUE SE ELIMINAN
- El enrutador `react-router-dom` del lado del marketing.
- El bundle masivo de la app para el usuario que solo visita la Landing.

### RIESGOS
- **Riesgo Técnico Crítico (Tailwind vs CSS Modules):** Traducir todo el `Landing.jsx` (que usa Tailwind intensivo con clases como `from-yellow-500/20 to-orange-500/5 bg-clip-text text-transparent absolute top-0 inset-x-0 w-[60vw] h-[60vw] blur-[150px]`) a CSS Modules es extremadamente ineficiente y no aporta valor comercial, además de arriesgar la fidelidad visual. **Recomendación Fuerte:** Instalar Tailwind en `streetboss-web` única y exclusivamente para respetar el código de `Landing.jsx` al 100% y mapear el `tailwind.config.ts` a las variables de `brand-core`.
