# STREETBOSS MASTER DATASET AUDIT REPORT

> Fecha de Auditoría: 2026-08-05 02:42:01
> Nivel de Calidad Estimado Global: **46.4%**

---

## 📌 Resumen General de Auditoría

- **Total de registros leídos inicialmente (todas las hojas/archivos)**: 15345
- **Total de prospectos gastronómicos válidos**: 5555
- **Total de restaurantes únicos auditados e independientes**: 1901
- **Fusiones correctas confirmadas**: 1580
- **Fusiones potencialmente riesgosas (alertadas por similitud de nombre únicamente)**: 0
- **Registros descartados totalmente**: 9790 (Catálogo CP Correos de México 9,593 filas, Lotes inmobiliarios, etc.)
- **Sucursales independientes preservadas**: Separadas correctamente por dirección/contacto distinto.

---

## 📞 Cobertura de Datos de Contacto y Presencia Digital

| Campo | Registros Con Datos | Cobertura (%) |
| :--- | :--- | :--- |
| **Teléfono Principal** | 1362 | 71.6% |
| **WhatsApp Validado** | 1362 | 71.6% |
| **Facebook Canónico** | 580 | 30.5% |
| **Ciudad Identificada** | 1901 | 100.0% |
| **Categoría Identificada** | 1901 | 100.0% |
| **Información Insuficiente (<40 pts)** | 531 | 27.9% |

---

## 📂 Archivos Entregables Generados

1. `MASTER_RESTAURANTS_AUDITED.xlsx` — Base Maestra Oficial Auditada.
2. `MASTER_RESTAURANTS_AUDITED.csv` — CSV en UTF-8 con BOM.
3. `MASTER_RESTAURANTS_AUDITED.json` — JSON canónico estructurado para Supabase.
4. `DEDUPLICATION_AUDIT.xlsx` — Matriz completa de trazabilidad de deduplicación.
5. `RESTAURANTS_REJECTED_AUDIT.xlsx` — Auditoría detallada de todos los descartes con motivo y confianza.
6. `QUALITY_CONTROL_SAMPLE.xlsx` — Muestra de control en 4 pestañas (Aleatorios, Más Fusionados, Menor Confianza, Descartados).
