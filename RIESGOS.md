# REGISTRO DE RIESGOS — STREETBOSS

> Riesgos identificados que podrían afectar el proyecto.

---

## RSK-001: Múltiples copias del proyecto

- **Fecha:** 2026-07-21
- **Severidad:** Baja (RESUELTO)
- **Descripción:** Existían 6 instancias duplicadas de StreetBoss dispersas en el equipo.
- **Mitigación:** Todas las 6 carpetas secundarias fueron aisladas en la carpeta de cuarentena `/Users/danielvazquez/Proyectos/_CUARENTENA_STREETBOSS/2026-07-21_1127/`. La única fuente activa es `/Users/danielvazquez/Proyectos/StreetBoss`.
- **Estado:** Resuelto.

## RSK-002: `.env` Versionado en el Historial Git (`b1576c1`)

- **Fecha:** 2026-07-21
- **Severidad:** Media (En espera de decisión de saneamiento)
- **Descripción:** El archivo `.env` fue versionado en Git en el commit `b1576c1`. Excluirlo del workspace genera `deleted: .env` en `git status`.
- **Mitigación:** No restaurar el archivo desde Git. No hacer commit ni push. Mantenido en aislamiento con `.env.example`.
- **Estado:** Documentado y Bloqueado para Commits.

---

> Actualizar este archivo cuando se identifiquen nuevos riesgos o cambien los existentes.
