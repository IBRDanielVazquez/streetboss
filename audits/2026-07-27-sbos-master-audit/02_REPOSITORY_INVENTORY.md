# 02 — Inventario del Repositorio

## Fase 0 — Estado inicial (HECHOS)

| Dato | Valor |
|---|---|
| pwd | `/Users/danielvazquez/Proyectos/StreetBoss` |
| OS | Darwin 22.6.0 (macOS, x86_64) |
| Node | v24.15.0 |
| npm | 11.12.1 |
| Git | 2.39.2 |
| Rama activa | `respaldo/pre-edicion-sitio-2026-07-23` |
| Remoto | `https://github.com/IBRDanielVazquez/streetboss.git` |
| Último commit | `6fdbbdd` — 2026-07-23 04:14 — "chore: respaldo del estado previo a edición del sitio" |
| Submódulos | Ninguno |
| Worktrees | 1 (el principal) |

**Observación (RIESGO):** se está trabajando sobre una rama llamada *respaldo* (`respaldo/pre-edicion-sitio-...`), no sobre `main`/`master`. El trabajo activo vive en una rama de respaldo — confuso para control de versiones.

### git status (resumen)
- Borrado en working tree pero **trackeado**: `.env` (ver [13](13_SECURITY_AUDIT.md)).
- Modificados: `package.json`, `package-lock.json`.
- Sin trackear (nuevo, no commiteado): `brand-assets/`, `brand-core/`, `brand-operating-system/`, `streetboss-web/`, `landing-page/`, `docs/auditoria-visual-2026-07-23/`, `scripts/`, `scratch/`, `assets/`, y múltiples `.md`/`.cjs` de auditoría.

**Observación (RIESGO P3):** casi todo el trabajo reciente (incluido el Command Center completo) está **sin commitear**. Un `git checkout` accidental podría perder semanas de trabajo.

## Fase 1 — Inventario de carpetas

| Ruta | Existe | Propósito |
|---|---|---|
| `brand-operating-system/` | ✅ | **Dashboard "Command Center"** (Vite+React). Fuente real. |
| `brand-assets/` | ✅ | Assets de marca (PNG/WebP/SVG) |
| `brand-core/` | ✅ | Núcleo de marca (docs/config) |
| `streetboss-web/` | ✅ | Landing/web (Next.js) |
| `docs/` | ✅ | Documentación dispersa |
| `backups/` | ✅ | Vacía |
| `streetboss-gpt/` | ❌ | **No existe** (declarada en el brief) |
| `archive/` | ❌ | **No existe** |
| `legacy/` | ❌ | **No existe** |
| `src/` (raíz) | ✅ | App Vite antigua (landing) — `src/supabase.js` |
| `landing-page/`, `assets/`, `prompts/`, `skills/`, `scratch/` | ✅ | Material mixto |

### Archivos más pesados (fuera de node_modules)
| Archivo | Tamaño | Nota |
|---|---:|---|
| `brand-operating-system/src/data/calendar/masterCalendar.ts` | 2.66 MB | **Huérfano** (no importado) |
| `brand-operating-system/src/data/posts.json` | 2.66 MB | **Fuente real** del dashboard |
| `.../calendar/instagram.ts` | 1.06 MB | Huérfano |
| `.../calendar/facebook.ts` | 632 KB | Huérfano |
| `.../calendar/tiktok.ts` | 327 KB | Huérfano |

**Hallazgo (P1-03):** existe una jerarquía TS de calendarios por red (`masterCalendar.ts` + `instagram.ts`…`youtube.ts`, ~5 MB en total) que **no alimenta el dashboard**. La app importa exclusivamente `posts.json`. Ver [03](03_SOURCE_OF_TRUTH.md).

### Sub-repos y builds
- `brand-operating-system/dist/` — build Vite (2.68 MB JS).
- `streetboss-web/.next/` — build Next.js.
- `dist/` (raíz) — build de la app Vite antigua.
- `node_modules/` presentes en raíz, `brand-operating-system/` y `streetboss-web/`.

**Observación:** el repo es **monolítico** y mezcla 3+ proyectos con toolchains distintos (Vite, Next.js) y builds committeables. Recomendado separar (ver [20](20_REMEDIATION_ROADMAP.md)).
