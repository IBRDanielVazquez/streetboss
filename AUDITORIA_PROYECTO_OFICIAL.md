# HECHOS

1. **Rutas Locales:**
   - **Proyecto Activo:** `/Users/danielvazquez/Proyectos/StreetBoss`. Última modificación hoy. Utiliza React + Vite. Rama actual: `main`. Último commit: `3660dbe - feat: implement local prospect pipeline and 7-day demo trial editor` (15/07/2026). Contiene múltiples archivos recientes sin guardar/commit, indicando desarrollo activo continuo.
   - **Proyecto en Cuarentena:** `/Users/danielvazquez/Proyectos/_CUARENTENA_STREETBOSS/2026-07-21_1127/streetboss-web`. Esta carpeta fue enviada a cuarentena el 21 de julio de 2026. Según `PLAN_ELIMINACION.md`, sus scripts útiles ya fueron rescatados en la carpeta oficial.

2. **GitHub:**
   - Repositorio oficial conectado: `IBRDanielVazquez/streetboss`.
   - La carpeta local `/Users/danielvazquez/Proyectos/StreetBoss` es la que está emparejada con este repositorio y se encuentra 3 commits por delante de la rama `origin/main`.

3. **Vercel:**
   - **`streetboss`:** (ID: `prj_NA0aNZKV8SjvepVHNG7qiDYL7fyz`). Conectado a la carpeta local `/Users/danielvazquez/Proyectos/StreetBoss` según su `.vercel/project.json`. Framework Vite.
   - **`streetboss-web`:** (ID: `prj_mIfRFx2lj50tBvdJAyzJwmfJKfM0`). Este es un proyecto antiguo vinculado a la carpeta que ahora está en cuarentena.

4. **Supabase:**
   - Según la documentación local en `ARQUITECTURA.md`, el proyecto activo esperado es `streetboss-pos` (ID: `uszhdesbewkjvphipudw`).
   - El proyecto consultado `srrsyxyxyyfnqyfxbdtz` está catalogado expresamente en `ARQUITECTURA.md` como: *Proyecto Supabase Deprecado (Pausado)*.
   - Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` de Vercel se extraen mediante el CLI y aunque están encriptadas, la arquitectura dicta el uso del proyecto `streetboss-pos`.

5. **Documentación:**
   - El archivo local `PLAN_ELIMINACION.md` ya había dictado una decisión previa: consolidar todo el desarrollo en `/Users/danielvazquez/Proyectos/StreetBoss` (el cual corresponde a Vercel `streetboss`) y descartar definitivamente el directorio de `streetboss-web`.

# CONTRADICCIONES

1. **Supabase Oficial vs Deprecado:** Existe una contradicción crítica entre el ID de Supabase esperado (`srrsyxyxyyfnqyfxbdtz`) y la documentación técnica real del proyecto (`ARQUITECTURA.md`), la cual establece que `srrsyxyxyyfnqyfxbdtz` está DEPRECADO y PAUSADO, mientras que el activo es `streetboss-pos` (`uszhdesbewkjvphipudw`). Conectar el dominio sin validar qué base de datos está operando realmente en Vercel podría apuntar el sistema a una base de datos vacía o pausada.
2. **Existencia Fantasma en Vercel:** Aunque `streetboss-web` ya fue segregado, desmembrado y enviado a cuarentena localmente (`_CUARENTENA_STREETBOSS`), el proyecto sigue vivo y desplegado en Vercel, lo que podría generar confusión futura si no se elimina o pausa también en la nube.

# PROYECTO OFICIAL RECOMENDADO

• **streetboss**

**Evidencia Técnica:**
1. Es el único proyecto que está anclado a la carpeta local de desarrollo activo (`/Users/danielvazquez/Proyectos/StreetBoss`).
2. Posee el archivo `project.json` de Vercel con ID de proyecto `prj_NA0aNZKV8SjvepVHNG7qiDYL7fyz` (`streetboss`).
3. Es el que contiene los últimos desarrollos locales (`feat: implement local prospect pipeline...`) y el historial consolidado de GitHub (`IBRDanielVazquez/streetboss`).
4. Existe una instrucción previa en `PLAN_ELIMINACION.md` (de fecha 21 de julio) validando que `streetboss-web` es material descartado y ya rescatado hacia la base de `StreetBoss`.

# PROYECTO QUE DEBE ARCHIVARSE

• **streetboss-web**

No debe recibir el dominio. Debe ser pausado o eliminado de Vercel para mantener paridad con el ecosistema local, ya que su código fuente fue enviado a cuarentena y descontinuado.

# MAPA DE CONEXIONES

Proyecto local: `/Users/danielvazquez/Proyectos/StreetBoss` → GitHub: `IBRDanielVazquez/streetboss` → Vercel: `streetboss` → Supabase: `streetboss-pos` (`uszhdesbewkjvphipudw`) [Nota: *Se debe confirmar si se forzará el uso del deprecado srrsyxyxyyfnqyfxbdtz*]

# RIESGOS

1. **Riesgo de Supabase Incorrecto:** Si el dominio se conecta al proyecto de Vercel y este está apuntando a las variables de entorno del proyecto deprecado (`srrsyxyxyyfnqyfxbdtz`), el sistema en producción no tendrá los datos correctos o no funcionará si la base de datos está pausada.
2. **Riesgo de Despliegue Huérfano:** Dejar el proyecto `streetboss-web` encendido en Vercel consume recursos, tiempo de build en caso de empujes accidentales, y podría ser indexado.
3. **Riesgo de Pérdida Local:** La rama `main` de `StreetBoss` está adelantada por 3 commits de GitHub y posee múltiples archivos modificados/sin rastrear. Si se fuerza un pull o se cambia de rama abruptamente, se perderá trabajo clave de los "demo trials".

# SIGUIENTE ACCIÓN SEGURA

1. Hacer commit y push de todos los archivos modificados y sin rastrear en `/Users/danielvazquez/Proyectos/StreetBoss` para salvaguardar el estado más actual del proyecto hacia GitHub.
2. Validar en Vercel Dashboard (interfaz gráfica) o vía un script específico si el entorno de Producción de Vercel `streetboss` tiene las variables de entorno apuntando al proyecto activo (`uszhdesbewkjvphipudw`) o al deprecado (`srrsyxyxyyfnqyfxbdtz`). Si están en el deprecado, actualizarlas al activo.
3. Desde el panel de Vercel, ir al proyecto `streetboss` -> Settings -> Domains -> Agregar `streetboss.com.mx` (y `www.streetboss.com.mx`).
4. Configurar en el proveedor del dominio (ej. Hostinger, GoDaddy) los registros DNS que arroja Vercel (generalmente CNAME o A records).
5. Archivar o eliminar `streetboss-web` directamente desde el panel de proyectos de Vercel para eliminar "despliegues huérfanos".

# VALIDACIÓN FINAL DE SUPABASE

1. **Qué proyecto Supabase está activo:**
   - **NINGUNO.** Tanto `srrsyxyxyyfnqyfxbdtz` como `uszhdesbewkjvphipudw` devuelven el error de red `Unknown host / Could not resolve host` al consultar su API REST. En la infraestructura de Supabase, cuando los registros DNS son eliminados de esta forma, significa que los proyectos han sido **PAUSADOS por inactividad** o eliminados.

2. **Qué proyecto está pausado o deprecado:**
   - **AMBOS ESTÁN PAUSADOS a nivel de infraestructura.**
   - A nivel de documentación local y decisiones previas (conversación del 21 de julio), `srrsyxyxyyfnqyfxbdtz` fue intencionalmente deprecado, y `uszhdesbewkjvphipudw` (`streetboss-pos`) fue elegido como el proyecto activo. Sin embargo, actualmente la base de datos `uszhdesbewkjvphipudw` se encuentra pausada en la nube.

3. **Tablas encontradas (`sb_clients`, `sb_operation_data`, etc):**
   - **Inaccesible.** Al estar ambos proyectos pausados, no es posible conectar a la base de datos para auditar las tablas.

4. **Cuál contiene datos reales:**
   - **Inaccesible por pausa.**

5. **Cuál tiene Auth configurado:**
   - **Inaccesible por pausa.**

6. **Cuál tiene Storage configurado:**
   - **Inaccesible por pausa.**

7. **Cuál tiene RLS aplicado:**
   - **Inaccesible por pausa.**

8. **A cuál apuntan las variables de entorno:**
   - `.env` (historial local de Git / borrado recientemente): Estaba apuntando incorrectamente a **Propiedades en Chiapas** (`lfmbhdtrxmtxjwyfzdcz`).
   - `.env.local` / `.env.production` (local): No existen en el directorio.
   - `Vercel Production`: Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están declaradas, pero al exportarlas mediante `vercel env pull` arrojan valores vacíos (`""`), lo que indica que están sin configurar, o bien que Vercel CLI bloquea su descarga por razones de seguridad en este entorno específico.
   - `Vercel Preview` y `Vercel Development`: Las variables no existen (ni declaradas ni vacías).
   - `src/supabase.js`: No existen referencias a claves hardcodeadas (usa `import.meta.env`).

9. **Referencias a Propiedades en Chiapas:**
   - 🚨 **RIESGO CRÍTICO CONFIRMADO:** El archivo `.env` que se encontraba en el directorio local de StreetBoss antes de ser borrado apuntaba a:
     - Variable: `VITE_SUPABASE_URL`
     - Entorno: Local
     - Project ID detectado: `lfmbhdtrxmtxjwyfzdcz` (Propiedades en Chiapas)
     - Últimos 4 caracteres de la clave: `BH1f`
     - Estado: **INCORRECTA** (Estaba inyectando la base de datos de PEC a StreetBoss).
