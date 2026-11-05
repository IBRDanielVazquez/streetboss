# ARQUITECTURA — STREETBOSS

> Documentación técnica oficial de la arquitectura del proyecto.
> Última actualización: 2026-07-21

---

## Stack Tecnológico Confirmado

- **Framework:** React 18.3.1 + Vite 5.4.21
- **Lenguaje:** JavaScript (ES Modules, JSX)
- **Estilos:** Tailwind CSS v3.4.10 + PostCSS + Autoprefixer
- **Animaciones:** Framer Motion v12.40.0
- **Iconos:** Lucide React v0.441.0
- **Routing:** React Router DOM v6.26.0
- **Backend / BaaS:** Supabase (`@supabase/supabase-js` v2.105.4)
  - Proyecto Supabase Activo: `streetboss-pos` (`uszhdesbewkjvphipudw`)
  - Proyecto Supabase Deprecado: `srrsyxyxyyfnqyfxbdtz` (Pausado)
- **Hosting / Despliegue:** Vercel (Project ID: `prj_NA0aNZKV8SjvepVHNG7qiDYL7fyz`)

---

## Integración con Supabase

- **Módulo de Conexión:** `src/supabase.js`
- **Variables de Entorno Requeridas:**
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Plantilla de Entorno:** `.env.example` en la raíz del proyecto.
- **Tablas del Dominio:**
  - `sb_clients`
  - `sb_operation_data`
  - `sb_plans`
  - `sb_promotions`
  - `sb_global_config`
  - `sb_memberships`
  - `sb_menu_publico`
  - `sb_orders`
  - `sb_business_customers`

### Sincronización B2C multidispositivo

- `sb_orders` es la fuente central para pedidos y para reconstruir el directorio visible de clientes del restaurante.
- Al abrir el Dashboard B2B se descargan los pedidos de las identidades válidas del negocio y se reemplaza su copia local.
- Los eventos Realtime de `sb_orders` actualizan pedidos, clientes y rankings en la sesión abierta.
- Las lecturas B2B usan `getSupabaseClient(slug)` para incluir el contexto multi-tenant del restaurante.
- En móviles, el dashboard ejecuta una descarga de recuperación en `pageshow`, `focus`, `online` y `visibilitychange`, además de una comprobación periódica mientras permanece visible.

---

## Estructura del Código Fuente

```
~/Proyectos/StreetBoss/
├── .gitignore                   → Ignora .env, dist/, node_modules/
├── .env.example                 → Plantilla de variables sin secretos
├── src/
│   ├── main.jsx                 → Punto de entrada React
│   ├── App.jsx                  → Enrutador principal
│   ├── index.css                → Estilos globales
│   ├── supabase.js              → Cliente inicializado de Supabase
│   ├── components/              → Componentes reutilizables de UI
│   ├── context/                 → AppContext & DemoTrialsContext
│   ├── data/                    → Datos estáticos de menú y demos
│   ├── hooks/                   → useRol, useSound
│   └── pages/                   → Módulos principales (Landing, MenuDigital, Pedido, POS, KDS, etc.)
├── public/                      → Favicons, manifest PWA e imágenes de productos
├── supabase_streetboss.sql      → Esquema oficial SQL de Supabase
├── package.json                 → Dependencias npm
└── vite.config.js               → Configuración del empaquetador Vite
```

### Biblioteca global de tutoriales

- Metadatos y orden: `src/data/tutorials.js`.
- Interfaz compartida: `src/components/TutorialLibrary.jsx`.
- Vista pública individual: `src/pages/TutorialPublic.jsx` mediante `/tutoriales/:tutorialId`.
- Única copia de medios: `public/tutoriales/01.mp4` a `public/tutoriales/07.mp4` (H.264/AVC + AAC, 592 × 1280).

### Seguimiento comercial HQ

- Catálogo base de prospectos: `src/data/master_prospects.json`.
- Estado comercial central: `sb_hq_prospect_states`, identificado por `prospect_id` y almacenado como JSON versionado por `updated_at`.
- `localStorage` mantiene respuesta inmediata y respaldo; al entrar o retomar HQ se reconcilia con Supabase conservando el cambio más reciente.
- La biblioteca no recibe ni incorpora `business_id`, slug, usuario o tenant.

---

## Validaciones de Compilación

- **`npm run build` (`vite build`):** ✅ APROBADO (2,040 módulos procesados en 11.23s).
- **`npm run lint`:** ⚪ No configurado en `package.json`.
- **`npm run test`:** ⚪ No configurado en `package.json`.

### 2026-10-30 — Inicio guiado y PWA del restaurante

- `RestaurantSetupHome.jsx`: perfil, edición de datos básicos, checklist derivado del negocio guardado y accesos a las herramientas existentes.
- `RestaurantAppInstall.jsx`: manifest temporal en el documento autenticado, captura del diálogo de instalación, alternativa manual y limpieza al desmontar.
- `api/panel-manifest.js`: metadatos públicos por slug validado; `id`, `start_url` y `scope` apuntan a `/panel/:slug`, sin query de sesión.
- `public/panel-sw.js`: navegación de red sin caché; fallback sin datos cuando falla la conexión. Registro con alcance del panel. Cabecera `Service-Worker-Allowed: /panel/` en Vercel y preview local.
- El handler del manifest se comparte entre Vercel y middleware de preview en Vite. Iconos existentes de marca, con derivado de 192 px para instalación.
