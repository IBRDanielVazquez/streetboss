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

---

## Validaciones de Compilación

- **`npm run build` (`vite build`):** ✅ APROBADO (2,040 módulos procesados en 11.23s).
- **`npm run lint`:** ⚪ No configurado en `package.json`.
- **`npm run test`:** ⚪ No configurado en `package.json`.
