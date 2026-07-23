# HECHOS

*   **Proyecto:** StreetBoss (Plataforma de venta directa para restaurantes, no es un marketplace ni app de delivery, cero comisiones).
*   **Directorio Local:** `/Users/danielvazquez/Proyectos/StreetBoss`
*   **Repositorio:** `IBRDanielVazquez/streetboss`
*   **Vercel Project ID:** `prj_NA0aNZKV8SjvepVHNG7qiDYL7fyz`
*   **Dominio Oficial:** `https://streetboss.com.mx`
*   **Identidad Visual:** Boss Charcoal (`#0D0E12`), Street Orange (`#FF4B00`), Street Orange Light (`#FF6A1A`). Estilo flat, mobile first.

# CONFIGURACIÓN ACTUAL

*   **Framework y Estructura:** React 18, Vite, React Router DOM, Tailwind CSS, Framer Motion y Lucide React.
*   **Estado de Git:** Rama `main`. Está por delante de `origin/main` por 3 commits.
*   **Último Commit:** `3660dbef` (feat: implement local prospect pipeline and 7-day demo trial editor).
*   **Archivos Modificados sin Commit:**
    *   Eliminado: `.env`
    *   Modificados: `.gitignore`, `src/App.jsx`, archivos en `src/components/demotrials/`, `src/context/DemoTrialsContext.jsx`, `src/data/demoTrials.js`, `src/pages/DemoAdmin.jsx`, `src/pages/DemoTrialDashboard.jsx`, `src/pages/Landing.jsx`.
    *   Untracked: Múltiples archivos Markdown (incluyendo manuales y agentes), scripts `.sh` y la base de datos SQL (`supabase_streetboss.sql`).

# FUNCIONES EXISTENTES

*   **Páginas y Rutas Disponibles:** Mesero, Cocina, Caja, Admin (Configuración, Mesas, Reporte), Menú Digital y Carta, SuperAdmin, Landing, DemoAdmin, DemoTrialDashboard, DemoPublicMenu.
*   **Componentes Principales:** `BottomNav`, `Header`, `ModalCancelar`, `ModalPin`, `ProductoCard`, `TicketResumen`.
*   **Sistema Demo Local:** Implementación reciente (LocalStorage) de un pipeline de prospectos y 10 demos oficiales de StreetBoss sin depender de backend.

# FUNCIONES INCOMPLETAS

*   **Integración Real con Supabase (En Pausa):** Actualmente, el sistema parece estar volcándose al sistema de pruebas demo local, y la configuración de Supabase está desactivada por la pérdida del `.env`.
*   **Flujos de SuperAdmin/Suscripción:** Existen rutas, pero probablemente falten ajustes finales de conexión a base de datos.

# ELEMENTOS PERDIDOS O DESCONFIGURADOS

*   **Archivo `.env` Eliminado:** El entorno local carece de sus variables de entorno originales para conectarse a Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
*   **Cambios sin Guardar (Git):** Hay varios componentes y lógicas del Demo Trial editados localmente que no están en GitHub ni en Vercel.

# CONTRADICCIONES

*   **Diferencias Local vs GitHub/Vercel:** El entorno local tiene 3 commits adelantados y muchos cambios sin registrar (`git add`). Si se despliega Vercel desde GitHub, la versión de producción no reflejará los demos locales actuales ni las ediciones de la landing.
*   El `.env` está ausente localmente, lo que rompe cualquier funcionalidad que requiera base de datos (Supabase) fuera de la zona de demos locales.

# RIESGOS

*   **Pérdida de Cambios No Stageados:** Si se hace un `git reset` o un cambio brusco de rama, se pueden perder los avances en el sistema de prospectos (DemoTrials).
*   **Despliegue Roto:** Si se suben los cambios sin reconfigurar las variables de entorno, la plataforma principal (fuera de demos) fallará en producción.
*   **Confusión con streetboss-web:** Existe riesgo si en algún punto se toman componentes de la versión antigua en vez de iterar sobre el diseño actual.

# PRIORIDADES

1.  **Asegurar los cambios locales:** Hacer commit de las modificaciones del "local prospect pipeline" y la Landing para no perder trabajo.
2.  **Restaurar `.env` local:** Recuperar o reconfigurar las variables de Supabase (posiblemente extrayéndolas desde Vercel o de los archivos `.env.vercel` y `.env.dev.test`) para reactivar el sistema central.
3.  **Auditar Landing Page vs Diseño Oficial:** Verificar que `Landing.jsx` cumpla estrictamente con la guía de estilo (`#0D0E12`, `#FF4B00`, Flat, etc.) y no se haya desviado.
4.  **Sincronizar:** Igualar el estado local con GitHub y eventualmente desplegar en Vercel con autorización.

# PLAN DE RECUPERACIÓN

1.  **Respaldo:** Generar un commit local con mensaje descriptivo de las integraciones de demos recientes (`git add . && git commit -m "feat: complete demo trial updates"`).
2.  **Restaurar Configuración:** Reconstruir el `.env` a partir de `.env.example` y recuperar las claves de Supabase.
3.  **Validar Funcionalidad:** Levantar el servidor de desarrollo (`npm run dev`) y verificar tanto el lado de demos (LocalStorage) como el lado de producción (Supabase).
4.  **Limpieza Visual:** Revisar Tailwind Classes en la Landing para garantizar la estética "Boss Charcoal" y "Street Orange". Eliminar código innecesario.
5.  **Despliegue Controlado:** Una vez validado, hacer push a GitHub y monitorear el deploy en Vercel hacia `streetboss.com.mx`.

# SIGUIENTE ACCIÓN RECOMENDADA

1. Hacer un commit de los archivos modificados para proteger los avances de las demos y la landing.
2. Restaurar el archivo `.env` con las credenciales de Supabase.
