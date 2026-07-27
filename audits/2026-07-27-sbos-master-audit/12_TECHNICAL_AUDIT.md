# 12 — Auditoría Técnica

## Stack (`brand-operating-system`)

- Vite 5 + React 18 + react-router-dom 6 + lucide-react + TypeScript 5. `type: module`.
- Scripts: `dev` (vite :5000), `build` (`tsc && vite build`), `preview`.

## Build — ✅ VERDE

```
tsc && vite build → ✓ 1401 modules transformed. built in 5.96s
dist/index.html                 0.42 kB
dist/assets/index-*.css         5.85 kB
dist/assets/index-*.js      2,685.19 kB │ gzip: 182.64 kB
```

- **Compila sin errores de TypeScript.**

## Problemas técnicos

| # | Severidad | Hallazgo |
|---|---|---|
| T1 | P1-04 | **Bundle 2.68 MB** (gzip 182 KB). Causa: `posts.json` (2.66 MB) se importa estáticamente y queda embebido en el JS. Todo el contenido y prompts viajan al cliente en cada carga. |
| T2 | P3-01 | Warning Tailwind: `content` vacío ⇒ CSS puede salir incompleto. `tailwind.config` no apunta a `src`. |
| T3 | P1-03 | ~5 MB de `calendar/*.ts` + `masterCalendar.ts` **no importados** — peso muerto en el repo, riesgo de divergencia. |
| T4 | P2 | Sin ESLint configurado en el dashboard; sin tests. |
| T5 | P3 | No hay code-splitting; una sola bundle monolítica. |

## Impacto de cargar cientos de prompts en el cliente

Medido: la data cruda (2.66 MB) domina el bundle. En gzip son ~180 KB, tolerable en banda ancha pero **innecesario y con fuga de estrategia** (ver [13](13_SECURITY_AUDIT.md)). Alternativa correcta: servir `posts.json` como fetch bajo demanda / paginado, o mover a backend. *(No optimizado — solo medido.)*

## Otros proyectos

- `streetboss-web/` (Next.js 15, TS, Tailwind) — el producto/landing. Build `.next/` presente. No auditado a fondo (alcance centrado en Command Center).
- App Vite raíz (`src/`, `index.html`, `vite.config.js`) — legacy; `src/supabase.js` con cliente Supabase.

**Veredicto:** técnicamente **funciona y compila**; los problemas son de **arquitectura de datos** (data gigante en cliente, generadores duplicados, TS huérfano) más que de bugs.
