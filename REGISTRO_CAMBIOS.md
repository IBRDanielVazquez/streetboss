# REGISTRO DE CAMBIOS — STREETBOSS

> Historial de cambios relevantes en el proyecto.

---

## 2026-08-05 — Creación e Integración del Dashboard Móvil de Prospección Comercial

**Hora:** 07:37 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Implementación del Dashboard Móvil de Prospección Comercial conectado a los 1,901 restaurantes de `MASTER_RESTAURANTS.xlsx`.

### Cambios realizados

- **Script de Sincronización de Datos (`scripts/sync_master_prospects.py`):**
  - Parsea `data/MASTER_RESTAURANTS.xlsx` exportando `src/data/master_prospects.json` con los 1,901 restaurantes validados.
- **Componente Ficha del Negocio (`src/components/crm/ProspectDetailModal.jsx`):**
  - Vista en modal/drawer móvil con los 27 atributos, indicador de calidad, llamada telefónica directa, enlace directo a Facebook / Google Maps, asignación de demo oficial (10 demos), selector de Estado Comercial y generador dinámico de mensajes de WhatsApp.
- **Componente Dashboard Móvil (`src/components/crm/MobileProspectingDashboard.jsx`):**
  - Renderizado táctil responsivo, métricas en vivo (Total, Contactados, Demos Enviadas, Interesados, Cerrados), buscador instantáneo y filtros multidimensionales por Ciudad, Giro, Canales y Estado.
- **Integración CRM (`src/components/crm/ProspectosTab.jsx`):**
  - Establecido como modo predeterminado de prospección dentro de StreetBoss Central HQ.

---

## 2026-08-05 — Consolidación Final y Depuración de la Base Maestra Oficial

**Hora:** 02:56 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Consolidación final en `MASTER_RESTAURANTS.xlsx` único, depuración total de `/data` y eliminación de fuentes procesadas en `~/Downloads`.

### Cambios realizados

- **Base Maestra Definitiva:**
  - Consolidada en `/Users/danielvazquez/Proyectos/StreetBoss/data/MASTER_RESTAURANTS.xlsx` con **1,901 restaurantes/sucursales independientes** y 27 columnas.
- **Depuración Total de `/data`:**
  - Eliminados 10 archivos (CSV, JSON, auditorías, muestras y reportes). Dentro de `data/` únicamente resida `MASTER_RESTAURANTS.xlsx`.
- **Limpieza de Descargas (`~/Downloads`):**
  - Eliminados definitivamente los 22 archivos fuente confirmados.
- **Actualización del Sistema Futuro:**
  - Modificado `scripts/master_dataset_builder.py` para operabilidad incremental directa sobre `MASTER_RESTAURANTS.xlsx` y auto-eliminación de fuentes sin generar CSV, JSON ni basura residual.

---

## 2026-08-05 — Auditoría Exhaustiva de Calidad y Generación de Base Maestra Auditada

**Hora:** 02:42 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Auditoría integral, separación de sucursales independientes, matrices de trazabilidad y muestreo de control.

### Cambios realizados

- **Motor de Auditoría y Control de Calidad (`scripts/master_dataset_auditor.py`):**
  - Lectura exhaustiva de todas las pestañas de archivos `.xlsx` y `.xls` y encodings en CSVs (15,345 filas brutas).
  - Regla estricta de **Sucursales Independientes**: preservó 1,901 restaurantes/sucursales independientes basándose en diferencias de dirección, teléfono o redes sociales.
  - Auditoría de **Registros Descartados**: clasificados 9,790 descartes (incluyendo 9,593 filas del Catálogo de CP Correos de México y ventas inmobiliarias).
  - Matriz de deduplicación con 1,580 fusiones correctas confirmadas y 0 fusiones riesgosas por similitud de nombre únicamente.
- **Nuevos Archivos Generados (`data/`):**
  - `MASTER_RESTAURANTS_AUDITED.xlsx` (341 KB)
  - `MASTER_RESTAURANTS_AUDITED.csv` (1.55 MB)
  - `MASTER_RESTAURANTS_AUDITED.json` (2.59 MB)
  - `DEDUPLICATION_AUDIT.xlsx` (127 KB)
  - `RESTAURANTS_REJECTED_AUDIT.xlsx` (191 KB)
  - `QUALITY_CONTROL_SAMPLE.xlsx` (33 KB, 4 pestañas: Aleatorios, Mayor Fusiones, Menor Confianza, Descartados)
  - `MASTER_RESTAURANTS_AUDITED_REPORT.md`
- **Archivos Originales Preservados:**
  - `MASTER_RESTAURANTS.xlsx`, `MASTER_RESTAURANTS.csv` y `MASTER_RESTAURANTS.json` permanecen 100% intactos.

---

## 2026-08-05 — Construcción de la Base Maestra Oficial de Restaurantes StreetBoss

**Hora:** 02:27 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Creación y ejecución de `master_dataset_builder.py` para consolidad datasets de `~/Downloads`.

### Cambios realizados

- **Motor de Ingestión y Normalización (`scripts/master_dataset_builder.py`):**
  - Escaneo automático de 22 archivos Excel y CSV en `~/Downloads`.
  - Ingestión de 5,753 registros brutos.
  - Filtro estricto de no-alimentos (descartados 198 registros).
  - Normalización canónica de URLs de Facebook, Instagram y WhatsApp (1,157 URLs limpias).
  - Deduplicación inteligente y consolidación incremental obteniendo **1,190 restaurantes únicos**.
  - Clasificación en categorías/subcategorías y cálculo de **Score Comercial (0-100)**.
- **Archivos Maestros Generados (`data/`):**
  - `data/MASTER_RESTAURANTS.xlsx`
  - `data/MASTER_RESTAURANTS.csv`
  - `data/MASTER_RESTAURANTS.json`
  - `data/MASTER_RESTAURANTS_REPORT.md`
- **Documentación:**
  - `docs/README_DATASET_BUILDER.md`

---

## 2026-07-22 — Consolidación de Identidad y Activos de Marca

**Hora:** 09:25 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Copia, auditoría y validación de `brand-core` y `brand-assets`.

### Cambios realizados

- **Copia Segura:** Se copiaron las carpetas `brand-core` (9 archivos, 8.5 KB) y `brand-assets` (161 archivos, 42.8 MB) como carpetas hermanas en la raíz del proyecto oficial.
- **Validación de Integridad:** Se verificó el conteo y coincidencia del 100% de hashes SHA-256 de todos los archivos copiados.
- **Auditoría de Referencias:** Se revisaron las rutas relativas en archivos de marca y se comprobó que no hay referencias absolutas a la cuarentena.
- **Auditoría de Contenido (90 Días):** Se verificó la existencia y clasificación de 51 posts, 39 reels, plantillas de diseño y otros entregables.
- **Auditoría de Brand Core:** Se catalogaron logotipos maestros en SVG y guías de marca.

---

## 2026-07-21 — Rescate de Recursos Únicos y Retiro a Cuarentena


**Hora:** 11:28 CST  
**Agente:** Antigravity (Google DeepMind)  
**Acción:** Rescate de recursos únicos y aislamiento de duplicados en cuarentena.

### Cambios realizados

- **Rescate de Documentación & Prompts:** Se copiaron Master Book, Roadmap, Product docs y Prompts maestros desde `streetboss-studio` a `docs/producto/` y `prompts/compartidos/`.
- **Rescate de Módulos & Código:** Se copiaron los módulos Virtual Tour 360° y Digital Menu Futures desde `~/streetboss` a `src/modules/`.
- **Rescate de Scripts:** Se copiaron 11 scripts JS de utilidad desde `streetboss-web` a `scripts/`.
- **Rescate de Investigación:** Se copió el estudio de mercado Chiapas a `docs/research/mercado-chiapas/`.
- **Rescate de Assets:** Se copiaron 29 capturas PNG de interfaz a `assets/imagenes/desktop-screenshots/`.
- **Aislamiento en Cuarentena:** Se movieron las 6 carpetas secundarias a `/Users/danielvazquez/Proyectos/_CUARENTENA_STREETBOSS/2026-07-21_1127/`.
- **Documentación de Cuarentena:** Se crearon `INVENTARIO.md`, `MAPA_DUPLICADOS.md`, `ARCHIVOS_UNICOS.md` y `PLAN_ELIMINACION.md` en la carpeta de cuarentena.
- **Validación Final de Compilación:** Compilación `npm run build` ejecutada con éxito (8.81s).

### Lo que NO se hizo

- No se eliminó permanentemente ninguna carpeta ni archivo (`rm -rf` no utilizado).
- No se realizaron commits (`git commit`) ni empujes (`git push`).
- No se modificó Supabase, Vercel ni producción.

---
