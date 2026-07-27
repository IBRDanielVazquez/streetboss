# 14 — Auditoría de Vercel

## Estado del deploy (VERIFICADO por fetch)

- URL: `https://streetboss-social-command-center.vercel.app`
- **LIVE** — responde 200 y sirve la SPA. `<title>` = "StreetBoss Social Command Center".
- Contenido renderizado por JS (React SPA): el fetch estático solo ve el shell HTML; el cuerpo se hidrata en cliente. Coherente con `vercel.json` (rewrite `/(.*) → /index.html`).

## Configuración

- `brand-operating-system/vercel.json`: SPA rewrite a `index.html`. Correcto para react-router.
- `brand-operating-system/.vercel/project.json`: `projectName = "streetboss-social-command-center"`, framework Vite, nodeVersion 24.x.
- Proyecto raíz `.vercel/project.json`: `projectName = "streetboss"` (la landing/app antigua).

## Hallazgos

| # | Severidad | Hallazgo |
|---|---|---|
| V1 | P2-05 | **Naming inconsistente:** la carpeta se llama `brand-operating-system`, el proyecto Vercel `streetboss-social-command-center`, la app internamente `streetboss-brand-os`, y el brief lo llama "Brand Operating System". Cuatro nombres para lo mismo — confunde deploys y documentación. |
| V2 | P2 | El deploy publica el bundle de 2.68 MB con toda la estrategia embebida (ver [13](13_SECURITY_AUDIT.md)). |
| V3 | P3 | Sin headers de seguridad personalizados (CSP, X-Frame-Options) en `vercel.json`. |
| V4 | — | Coincidencia local↔deploy: **no verificable byte a byte** (el deploy sirve JS hidratado); el `<title>` y estructura coinciden con el build local. |

## No verificado

- Alias/dominios personalizados, historial de versiones, logs de build en Vercel (requiere acceso autenticado a la cuenta Vercel — fuera de alcance de solo lectura del repo).

**Veredicto:** deploy **operativo y correcto** técnicamente; el problema es de **naming** y de **exponer la estrategia** en el cliente.
