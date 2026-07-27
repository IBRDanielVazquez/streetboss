# PLAN EJECUTIVO DE ARQUITECTURA SEO Y MIGRACIÓN TÉCNICA
**Proyecto:** StreetBoss SEO Master 2026

---

## 1. ESTADO ACTUAL DEL PROYECTO
El proyecto actual de StreetBoss está desarrollado como una **Single Page Application (SPA) monolítica** usando React y Vite. Todo el enrutamiento (tanto del MVP operativo transaccional como de la Landing Page pública y el sistema de demostraciones) ocurre del lado del cliente (`react-router-dom`). Esta arquitectura es óptima para un producto SaaS (donde prima la interactividad y persistencia de estado) pero **es completamente incompatible con una estrategia SEO ambiciosa**, ya que carece de renderizado del lado del servidor (SSR), inyección dinámica de metadatos, y control granular de Core Web Vitals en la primera carga.

## 2. MAPA TÉCNICO DEL REPOSITORIO
**Arquitectura:** React SPA + Vite.
**Rutas principales (src/App.jsx):**
- `/` -> `Landing.jsx` (Marketing, fuertemente acoplado al cliente).
- `/demo/*`, `/dashboard/*`, `/menu/*` -> Sistema de pruebas locales (localStorage).
- `/:slug/*` -> Producto transaccional operativo (`Mesas`, `Pedido`, `Cocina`, `Caja`, `MenuDigital`).
- `/superadmin` -> Panel de administración.
**Componentes y Dependencias:**
- `src/components/`: Mezcla de componentes del producto (BottomNav, ProductoCard, TicketResumen) con modales operativos.
- Dependencias clave: `react`, `react-router-dom`, `@supabase/supabase-js`, `tailwindcss`.
- Conexión DB: A través de `src/supabase.js`.

## 3. RIESGOS DE MIGRACIÓN
- **Interrupción Operativa:** Romper el flujo transaccional (`/:slug/*`) si se mezclan configuraciones de enrutador en un intento de hibridar Vite con SSR.
- **Ruptura de la Base de Datos:** Modificar `supabase.js` o las políticas RLS intentando adaptar la base de datos al sitio público. (El ecosistema SEO **no** debe interactuar con la lógica crítica de base de datos del restaurante).
- **Caída del Sistema de Demos:** Las demos actuales están acopladas a la Landing y usan localStorage. Mover la Landing puede romper estas rutas de prueba.

## 4. ARQUITECTURA OBJETIVO
Desacoplamiento total del producto y el ecosistema de marketing. La meta es crear un entorno seguro para crecer el SEO sin tocar el código transaccional de los restaurantes.
- **StreetBoss Web (Ecosistema SEO):** Aplicación en Next.js (App Router, Server Components). Optimizada para indexación, EEAT y AI Overviews.
- **StreetBoss App (Producto MVP):** Aplicación actual en Vite. Aislada, segura, 100% enfocada en operación (Panel de admin, toma de pedidos).

## 5. ESTRATEGIA WEB PÚBLICA + APLICACIÓN
Se utilizará la estrategia de dominios separados:
- **`streetboss.com`**: Apuntará al nuevo proyecto en Next.js. Manejará todo el tráfico entrante, descubribilidad, adquisición, herramientas gratuitas y blog.
- **`app.streetboss.com`**: Apuntará al actual proyecto Vite en Vercel. Manejará el uso del producto, el escaneo de QRs en mesas, y la operación diaria de los restaurantes.
*(El uso de `/app` en un proxy reverso es factible, pero incrementa la complejidad del despliegue y mezcla dependencias. Separar por subdominio garantiza cero impacto en el MVP transaccional).*

## 6. ÁRBOL DE URLs CORREGIDO (Arquitectura Aprobada)
```text
/ (Home: Venta directa para restaurantes)
├── soluciones/
│   ├── menu-digital-para-restaurantes
│   ├── pedidos-por-whatsapp
│   └── venta-directa-para-restaurantes
├── giros/
│   ├── restaurantes
│   ├── cafeterias
│   ├── dark-kitchens
│   └── food-trucks
├── recursos/ (Descargables, plantillas)
├── herramientas/
│   ├── calculadora-comisiones
│   ├── calculadora-margen
│   ├── link-whatsapp
│   └── evaluador-menu
├── blog/ (Topic Clusters)
├── casos-de-exito/
├── precios/
├── faq/
├── sobre-streetboss/
├── demo/
└── contacto/
```

## 7. TOPIC CLUSTERS APROBADOS
- **CLÚSTER 1 — VENTA DIRECTA:** Venta directa para restaurantes, Cómo vender sin intermediarios, recuperar margen, canal propio.
- **CLÚSTER 2 — MENÚ DIGITAL QUE VENDE:** Menú digital, diseño, fotografía gastronómica, descripciones de platillos, experiencia mobile-first.
- **CLÚSTER 3 — PEDIDOS POR WHATSAPP:** Recibir pedidos por WhatsApp, reducir errores, estructurar mensajes, canal directo.
- **CLÚSTER 4 — RENTABILIDAD:** Comisiones, márgenes, costeo de platillos, ticket promedio.
- **CLÚSTER 5 — CRECIMIENTO GASTRONÓMICO:** Marketing, branding, Google Business Profile, fidelización.

## 8. MAPA DE INTENCIÓN DE BÚSQUEDA
- **Intención Transaccional (Fondo del embudo):** `/soluciones/*`, `/giros/*`, `/precios`. El usuario busca contratar o crear un menú. Acción: CTA a WhatsApp o a /demo.
- **Intención Comercial/Investigación (Medio del embudo):** `/herramientas/*`, `/casos-de-exito`. El usuario compara o necesita calcular su dolor (comisiones). Acción: Generación de Lead / Pasar a transacción.
- **Intención Informativa (Tope del embudo):** `/blog/*`, `/recursos/*`. Búsquedas abstractas (ej. "Cómo mejorar ventas restaurante"). Acción: Consumo de contenido estructurado (EEAT) y redirección hacia el Hub.

## 9. PLAN DE ENLAZADO INTERNO
- Implementación de modelo "Silo Estricto".
- Cada post del blog (ej. un post del Cluster 4) debe enlazar obligatoriamente con la Herramienta (Calculadora) y con la Pillar Page principal (Venta directa para restaurantes).
- Menú principal plano y breadcrumbs (`JSON-LD` `BreadcrumbList`) en todas las páginas internas.

## 10. ESTRATEGIA TÉCNICA SEO (Next.js)
- **App Router:** `layout.tsx` global con metadata estandarizada.
- **Metadata API:** Generación dinámica de títulos, descripciones, Canonical, Open Graph por ruta.
- **JSON-LD Schema:** Implementación sistemática de schemas: `Organization`, `SoftwareApplication`, `FAQPage` (en `/faq` y soluciones), y `Article` (en blog).
- **Core Web Vitals:** Fuentes locales (`next/font`), optimización agresiva de imágenes (`next/image` WebP/AVIF), y Componentes de Servidor (RSC) para entregar HTML ultra-ligero sin exceso de JavaScript.

## 11. MODELO DE DATOS PARA CONTENIDO
Para evitar contaminar Supabase con contenido editorial, y por agilidad, el contenido del ecosistema (Blog, Recursos) se gestionará inicialmente mediante **MDX estático en Next.js** (archivos `.mdx`). Esto permite versionar el contenido en git, compilar el sitio a máxima velocidad, e incrustar componentes React (como calculadoras en los posts) sin costo de base de datos.

## 12. ESTRATEGIA DE DESPLIEGUE
1. El proyecto actual en Vercel (`streetboss`) se mantiene apuntando al repositorio principal e ignora los archivos de Next.js (o se configura un subdominio `app.streetboss.com`).
2. Se crea un nuevo proyecto en Vercel (ej. `streetboss-web`) que lee una carpeta separada `web/` o un repo paralelo, y se le asigna el dominio raíz `streetboss.com`.

## 13. FASES DE IMPLEMENTACIÓN
- **Fase 1:** Generación del proyecto Next.js aislado. Maquetación del layout base (Mobile First, Navbar, Footer) y migración pixel-perfect del Hero y la Landing aprobada.
- **Fase 2:** Implementación de las páginas Pilar (`/soluciones/`, `/giros/`).
- **Fase 3:** Desarrollo técnico de las primeras herramientas gratuitas.
- **Fase 4:** Configuración de dominios y redirecciones DNS en Vercel. Despliegue en producción.
- **Fase 5:** Creación paulatina de contenido para los Topic Clusters usando MDX.

## 14. CRITERIOS DE VALIDACIÓN
- El proyecto Next.js compila al 100% de manera estática/ISR.
- Auditoría Lighthouse arroja >90 en Performance y 100 en SEO y Accessibility.
- El MVP en la SPA (`/Users/danielvazquez/Proyectos/StreetBoss/src/*`) no ha sufrido ni un solo cambio que rompa la aplicación de caja, cocina o mesero.
- Los metadatos y schemas se imprimen correctamente en el `<head>` del HTML.

## 15. ARCHIVOS QUE SE CREARÍAN, MOVERÍAN O MODIFICARÍAN
**Restricción absoluta:** NINGÚN archivo dentro de `src/` será modificado o movido durante esta transición. El MVP queda congelado (solo mantenimiento de producto).

**Creación recomendada (Arquitectura aislada):**
Para mantener la limpieza, se recomienda la creación de una carpeta completamente separada dentro de la raíz:
- `apps/web/` (El nuevo proyecto Next.js si se pasa a estructura turborepo/monorepo).
- O simplemente crear el directorio `streetboss-seo/` (Directorio Next.js independiente en la raíz actual) con su propio `package.json` para no entrar en conflicto con el entorno Vite.
