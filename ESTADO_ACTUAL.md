# ESTADO ACTUAL — STREETBOSS

> Última actualización: 2026-08-05
> Actualizado por: Antigravity (Google DeepMind)

## Estado General

**Estado: 🟢 DASHBOARD MÓVIL DE PROSPECCIÓN Y BASE MAESTRA DEFINITIVA CONSOLIDADA (1,901 RESTAURANTES)**

Se ha construido e integrado el **Dashboard Móvil de Prospección Comercial de StreetBoss**, alimentado en tiempo real desde la Base Maestra Oficial (`data/MASTER_RESTAURANTS.xlsx`) mediante sincronización automatizada (`scripts/sync_master_prospects.py`). Incluye búsqueda instantánea, filtros multidimensionales (Giro, Ciudad/Municipio, Canales y Estado), Ficha del Negocio con 27 atributos, llamada rápida, enlace directo a Facebook, asignador de demos oficiales y generador dinámico de mensajes para WhatsApp.

---

## 1. Resumen de Cuarentena y Retiro Seguro

- **Ruta de Cuarentena:** `/Users/danielvazquez/Proyectos/_CUARENTENA_STREETBOSS/2026-07-21_1127/`
- **Carpetas en Cuarentena:**
  1. `streetboss_origen_ibr/` (Origen principal consolidado)
  2. `streetboss-studio/` (Documentación & Brand System)
  3. `streetboss_experimental_tour360/` (Tour virtual 360 & investigación mercado)
  4. `streetboss-web/` (Scripts de utilidad)
  5. `streetboss_ARCHIVED_DO_NOT_USE/` (Instancia deprecada)
  6. `Imagenes_Street_Boss/` (Capturas PNG de UI)

> 🛑 **Ningún archivo fue eliminado permanentemente.** Todos los duplicados se encuentran resguardados en cuarentena para revisión humana final.

---

## 2. Rescate de Recursos Únicos hacia la Carpeta Oficial

Antes de mover las carpetas a cuarentena, se identificaron y copiaron todos sus activos únicos hacia `/Users/danielvazquez/Proyectos/StreetBoss/`:

- **Documentación & Master Book (`docs/producto/`):**  
  `STREETBOSS_MASTER_BOOK_v1.md`, `ROADMAP.md`, `PRODUCT.md`, `PROMPTS_MAESTROS.md`, `00-START-HERE.md`, `ANTIGRAVITY.md`, `CHATGPT.md`, `CLAUDE.md`, `CODEX.md`, `INDEX.md`, `NOTEBOOKLM.md`, carpeta `PRODUCT/`.
- **Prompts Maestros (`prompts/compartidos/`):**  
  `PROMPT_AUDITORIAS.md`, `PROMPT_AUDITORIAS_CODEX.md`, `PROMPT_CONTEXTO_GENERAL.md`, `PROMPT_NUEVO_PROYECTO.md`.
- **Módulos de Código (`src/modules/`):**  
  Módulo Virtual Tour 360° (`src/modules/virtual-tour/`) y módulo Digital Menu Futures (`src/modules/digital-menu-futures/`).
- **Scripts de Utilidad (`scripts/`):**  
  11 scripts JS de procesamiento (`add-geolocalizacion.js`, `enhance-demo-menus.js`, `update_demos.js`, etc.).
- **Investigación de Mercado (`docs/research/`):**  
  Estudio de mercado Chiapas y reportes Meta Ads (`docs/research/mercado-chiapas/`).
- **Assets Gráficos (`assets/imagenes/`):**  
  29 capturas PNG de interfaz (`assets/imagenes/desktop-screenshots/`).

---

## 3. Estado de la Carpeta Oficial y Build de Producción

- **Git Status:** Rama `main` activa, con historial y remotos oficiales intactos (`github.com/IBRDanielVazquez/streetboss.git`).
- **Build Local (`npm run build`):** ✅ Compilación exitosa en 8.81s procesando 2,040 módulos (`vite build` exitoso).
- **Protección `.gitignore`:** Preservadas las 5 reglas originales + `.env.*` y `!.env.example`.

---

## 4. Consolidación de Identidad y Activos de Marca

Se han copiado y validado las carpetas maestras de la identidad visual de StreetBoss:
- **`brand-core/`:** Contiene los logotipos maestros en SVG y las especificaciones básicas de color, tipografía y reglas de la marca (9 archivos, 8.5 KB).
- **`brand-assets/`:** Contiene el calendario de 90 días (51 posts, 39 reels), plantillas de diseño, librerías de copys, biblioteca de prompts y guías de producción (161 archivos, 42.8 MB).
- **Integridad:** Validada mediante SHA-256 (100% de coincidencia exacta). Las carpetas residen como hermanas en la raíz del proyecto.

---

> ⚠️ **Próximo Paso Requerido:** El usuario puede revisar la carpeta de cuarentena y autorizar la eliminación permanente cuando lo considere conveniente.

