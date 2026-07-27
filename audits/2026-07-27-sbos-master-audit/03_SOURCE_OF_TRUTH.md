# 03 — Fuente de Verdad

## Flujo de datos real del dashboard (VERIFICADO por imports)

```
posts.json  ──import──►  App.tsx / Posts.tsx / VisualLibrary.tsx  ──►  UI
profiles.json ─import─►  App.tsx (config de redes)
highlights.json ─────►  App.tsx
assets.json ─────────►  App.tsx
```

Grep de imports (`brand-operating-system/src`):
- `App.tsx:4` → `import postsData from './data/posts.json'`
- `Posts.tsx:1` y `VisualLibrary.tsx:2` → `posts.json`
- **Ningún archivo importa** `masterCalendar.ts` ni los `calendar/*.ts`.

**HECHO:** la fuente única que alimenta el Command Center es **`brand-operating-system/src/data/posts.json`**. Los `.ts` de calendario (~5 MB) son artefactos huérfanos generados por `generateCalendarAdvanced.cjs` que no se consumen.

## Matriz documental (fuentes existentes)

| Documento | Propósito | Autoridad | Estado | Contradicciones |
|---|---|---|---|---|
| `README.md` (raíz) | Descripción breve | Baja | Existe | — |
| `AGENTS.md` | Instrucciones a agentes | Media | Existe | — |
| `REGLAS_NEGOCIO.md` | Reglas de negocio | Media | Existe | Fuente candidata de verdad de producto |
| `AUDITORIA_PROYECTO_OFICIAL.md` | Auditoría previa (Antigravity) | — | Existe | El brief pide NO confiar en ella |
| `ESTADO_ACTUAL.md` / `DECISIONES.md` / `RIESGOS.md` / `TAREAS.md` | Bitácora | Media | Existen | Dispersos, sin jerarquía |
| `posts.json` | Datos de las 325 piezas | **De facto máxima** | Existe | Contenido duplicado (P0-01) |
| `profiles.json` | Config de redes | Alta (para UI) | Existe | Handles no verificados |

## Documentos declarados que NO existen (DATO FALTANTE — P0-03)

`01_MASTER_BOOK.md`, `02_BRAND_BOOK.md`, `03_UI_SYSTEM.md`, `04_IMAGE_SYSTEM.md`, `05_LAUNCH_PLAN.md`, `06_BRAND_ASSET_SYSTEM.md`, `07_AI_PROMPT_LIBRARY.md`, `08_PRODUCT.md`, `09_ROADMAP.md`, `10_FAQ.md`, `CONTENT_SCHEMA.md`, `VISUAL_PROMPT_STANDARD.md`, `SOCIAL_NETWORK_RULES.md`, `ASSET_NAMING_SYSTEM.md`, `QUALITY_CONTROL.md`.

**Conclusión:** el "Brand Operating System" **no tiene documentación de sistema**. Existe la *app* que se llama así, pero no el corpus documental que el nombre implica. La "verdad" del proyecto vive fragmentada entre `posts.json`, `profiles.json` y bitácoras ad-hoc.

## Jerarquía de verdad PROPUESTA (tras revisar contenido)

1. **Definición de producto y reglas de marca** → hoy en `REGLAS_NEGOCIO.md` + UI "Términos Prohibidos". Debería formalizarse como `01_PRODUCT.md` + `02_BRAND_BOOK.md`.
2. **Schema de contenido** → hoy implícito en la forma de `posts.json`. Debería existir `CONTENT_SCHEMA.md`.
3. **Datos** → `posts.json` como única fuente; eliminar `masterCalendar.ts` y `calendar/*.ts` o convertirlos en la fuente y derivar `posts.json` de ellos (una sola dirección).

*(Propuesta, no ejecutada.)*
