# REGISTRO DE CAMBIOS — STREETBOSS

> Historial de cambios relevantes en el proyecto.

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
