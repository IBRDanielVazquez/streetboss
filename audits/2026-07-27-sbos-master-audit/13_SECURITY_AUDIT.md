# 13 — Auditoría de Seguridad

**No se imprimió ningún secreto en esta auditoría.** Solo nombres de variables y patrones.

## Hallazgos

| # | Severidad | Hallazgo | Evidencia |
|---|---|---|---|
| S1 | **P1** | **`.env` versionado en git.** `git ls-files` lista `.env`; en el working tree está borrado (`D .env`) pero permanece en el historial de HEAD. Contiene `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. | `git show HEAD:.env` (solo nombres) |
| S2 | P2 | **Estrategia y prompts públicos.** El bundle de Vercel embebe `posts.json` completo (prompts, calendario, mensajes) — accesible por cualquiera que abra el JS. | `grep imagePrompt dist/assets/*.js` |
| S3 | P2 | **Clave Supabase hardcodeada** en `src/supabase.js` (app legacy raíz), trackeada. `createClient` con url/key. | `grep createClient src/supabase.js` |
| S4 | P3 | **PII de negocio** (número WhatsApp real) en repo y bundle público. Uso legítimo, pero expuesto. | `profiles.json` |
| S5 | P3 | `.vercel/` con `orgId`/`projectId` presentes en el repo (identificadores, no secretos de alto riesgo). | `.vercel/project.json` |

## Matices de severidad

- La clave expuesta es `VITE_SUPABASE_ANON_KEY` (**anon**, diseñada para el cliente). Su exposición es **inherente** a una app frontend y **no es equivalente a filtrar `service_role`**. El riesgo real depende de que **Row Level Security (RLS)** esté correctamente configurado en Supabase. **NO VERIFICADO** aquí (no se accedió a Supabase). Si RLS está mal, la anon key permite lectura/escritura no autorizada.
- Aun así, **versionar `.env` es mala práctica** y obliga a: (1) rotar las claves, (2) purgar el historial (`git filter-repo`), (3) confirmar RLS.

## Repo público / privado — NO VERIFICADO

El remoto es `github.com/IBRDanielVazquez/streetboss`. **No se verificó** si es público. Si lo es, S1–S4 escalan a **P0** (secretos + estrategia expuestos globalmente). Acción recomendada: confirmar visibilidad del repo antes que nada.

## Acciones recomendadas (no ejecutadas)

1. Verificar visibilidad del repo en GitHub.
2. Rotar `VITE_SUPABASE_ANON_KEY` y confirmar RLS activa en todas las tablas.
3. Purgar `.env` del historial de git.
4. Servir `posts.json` fuera del bundle público si la estrategia editorial se considera sensible.
