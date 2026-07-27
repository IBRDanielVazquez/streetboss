# Auditoría Forense Maestra — StreetBoss Brand Operating System

**Fecha:** 2026-07-27
**Auditor:** Claude Code (Opus 4.8)
**Alcance:** `/Users/danielvazquez/Proyectos/StreetBoss/`
**Modo:** Solo lectura. No se modificó ningún producto, prompt, copy, calendario, deploy ni base de datos.

---

## Cómo leer esta auditoría

Toda conclusión está respaldada por evidencia reproducible (lectura directa de archivos, conteos por script, build real y captura de UI). Cada afirmación se clasifica como **HECHO**, **PROPUESTA**, **SUPUESTO**, **RIESGO**, **CONTRADICCIÓN**, **DATO FALTANTE**, **NO VERIFICADO** o **DECLARADO, NO CONFIRMADO**.

## Índice de documentos

| # | Documento | Contenido |
|---|-----------|-----------|
| — | [01_EXECUTIVE_SUMMARY.md](01_EXECUTIVE_SUMMARY.md) | Veredicto, puntuaciones, hallazgos P0-P3 |
| 02 | [02_REPOSITORY_INVENTORY.md](02_REPOSITORY_INVENTORY.md) | Estado del repo, git, carpetas, tamaños |
| 03 | [03_SOURCE_OF_TRUTH.md](03_SOURCE_OF_TRUTH.md) | Fuente real del dashboard y matriz documental |
| 04 | [04_BRAND_COMPLIANCE.md](04_BRAND_COMPLIANCE.md) | Cumplimiento de marca |
| 05 | [05_PRODUCT_COMPLIANCE.md](05_PRODUCT_COMPLIANCE.md) | Cumplimiento de definición de producto |
| 06 | [06_CALENDAR_AUDIT.md](06_CALENDAR_AUDIT.md) | Calendario de 90 días / 325 piezas |
| 07 | [07_COPY_AUDIT.md](07_COPY_AUDIT.md) | Auditoría de los 325 copys |
| 08 | [08_PROMPT_AUDIT.md](08_PROMPT_AUDIT.md) | Auditoría de prompts visuales y negativos |
| 09 | [09_VIDEO_AUDIT.md](09_VIDEO_AUDIT.md) | Video / prompts de movimiento |
| 10 | [10_SOCIAL_PROFILE_AUDIT.md](10_SOCIAL_PROFILE_AUDIT.md) | Configuración de redes |
| 11 | [11_UX_UI_AUDIT.md](11_UX_UI_AUDIT.md) | UX/UI móvil y escritorio |
| 12 | [12_TECHNICAL_AUDIT.md](12_TECHNICAL_AUDIT.md) | Stack, build, bundle |
| 13 | [13_SECURITY_AUDIT.md](13_SECURITY_AUDIT.md) | Secretos, exposición, .env |
| 14 | [14_VERCEL_AUDIT.md](14_VERCEL_AUDIT.md) | Deploy en Vercel |
| 15 | [15_ASSET_AUDIT.md](15_ASSET_AUDIT.md) | Biblioteca visual |
| 16 | [16_COMMERCIAL_AUDIT.md](16_COMMERCIAL_AUDIT.md) | Estrategia comercial / embudo |
| 17 | [17_CONTRADICTIONS.md](17_CONTRADICTIONS.md) | Contradicciones |
| 18 | [18_MISSING_INFORMATION.md](18_MISSING_INFORMATION.md) | Datos faltantes |
| 19 | [19_RISK_REGISTER.md](19_RISK_REGISTER.md) | Registro de riesgos |
| 20 | [20_REMEDIATION_ROADMAP.md](20_REMEDIATION_ROADMAP.md) | Hoja de ruta (sin ejecutar) |
| 21 | [21_ACCEPTANCE_CHECKLIST.md](21_ACCEPTANCE_CHECKLIST.md) | Checklist de criterios |

## Artefactos

- [data/content-analysis.json](data/content-analysis.json) — salida cruda del análisis de contenido
- [scripts/content-analysis.mjs](scripts/content-analysis.mjs) — script reproducible (no destructivo)

## Reproducir

```bash
cd /Users/danielvazquez/Proyectos/StreetBoss/audits/2026-07-27-sbos-master-audit/scripts
node content-analysis.mjs
```
