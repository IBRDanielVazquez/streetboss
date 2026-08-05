# StreetBoss Master Dataset Builder — Guía de Operación

## Descripción

El **Master Dataset Builder** (`scripts/master_dataset_builder.py`) es el motor automatizado e inteligente para construir y mantener la **Base Maestra Oficial de Restaurantes de StreetBoss**.

Escanea automáticamente la carpeta `~/Downloads` (y subcarpetas), procesa todos los archivos compatibles (`*.csv`, `*.xlsx`, `*.xls`), deduplica, normaliza URLs, clasifica categorías y calcula el **Score Comercial** de cada negocio.

---

## Archivos Generados

Todos los archivos generados se ubican en la carpeta `data/` del proyecto:

1. `data/MASTER_RESTAURANTS.xlsx` — Base de datos oficial en Excel con auto-filtro.
2. `data/MASTER_RESTAURANTS.csv` — Base de datos oficial en CSV UTF-8.
3. `data/MASTER_RESTAURANTS.json` — Estructura en JSON ideal para importación a Supabase o uso directo en APIs.
4. `data/MASTER_RESTAURANTS_REPORT.md` — Reporte ejecutivo con métricas de archivos procesados, duplicados, categorías y ciudades.

---

## Características Principales

### 1. Ingestión Inteligente
- Escaneo recursivo sin depender de nombres fijos de archivos.
- Detección de esquemas heterogéneos de Apify Google Places, scrapers sociales y listas de Meta Ads.

### 2. Filtro de Datos Basura y No-Alimentos
- Elimina automáticamente negocios no relacionados con alimentos (hoteles, escuelas, hospitales, terrenos, tiendas de ropa, talleres, etc.).

### 3. Normalización Avanzada
- **Facebook**: Extrae la URL canónica removiendo subrutas como `/about`, `/photos`, `/videos`, `/events`, `/groups` y parámetros de tracking (`?locale=`, `utm`).
- **Instagram**: Extrae la URL canónica limpiando publicaciones o reels.
- **WhatsApp / Teléfono**: Convierte los números al formato internacional **E.164** (`+52...`).

### 4. Deduplicación y Consolidación Incremental
- Fusiona registros duplicados detectados por Facebook canónico, Instagram, Teléfono o coincidencia aproximada de nombre (Fuzzy Matching).
- **Importaciones Futuras**: Al agregar nuevos archivos a `Downloads` y volver a ejecutar la herramienta, **no se duplican registros**, sino que se actualizan los campos faltantes preserving el historial de origen.

### 5. Scoring Comercial (0 a 100)
Calcula la madurez digital del lead:
- **WhatsApp / Teléfono validado**: +25 pts
- **Facebook validado**: +20 pts
- **Instagram validado**: +15 pts
- **Sitio Web / Menú**: +15 pts
- **Correo**: +10 pts
- **Dirección / Coordenadas**: +10 pts
- **Horarios / Categoría**: +5 pts

---

## Ejecución Futura

Para volver a ejecutar el proceso acumulativo:

```bash
/tmp/sb_venv/bin/python3 scripts/master_dataset_builder.py
```
