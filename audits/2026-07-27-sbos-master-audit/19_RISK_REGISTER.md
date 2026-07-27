# 19 — Registro de Riesgos

Formato: ID · Severidad · Categoría · Evidencia · Impacto · Probabilidad · Recomendación · Esfuerzo · Dependencias · Responsable.

| ID | Sev | Categoría | Hallazgo (evidencia) | Impacto | Prob. | Recomendación | Esfuerzo | Resp. |
|---|---|---|---|---|---|---|---|---|
| R-01 | P0 | Contenido | Solo 45 copys / 62 prompts / 1 negative / 1 movimiento reales (content-analysis.json) | Publicar contenido repetido daña marca y alcance | Alta | Expandir pool y des-duplicar antes de publicar | Alto | Contenido |
| R-02 | P0 | Producción | 0/325 imágenes producidas (status IMAGEN PENDIENTE) | No hay nada publicable hoy | Cierta | Plan de producción visual por lotes | Alto | Diseño |
| R-03 | P0 | Gobierno | No existe documentación oficial (find 01…10) | Sin fuente de verdad, decisiones inconsistentes | Alta | Crear CONTENT_SCHEMA + BRAND_BOOK mínimos | Medio | Owner |
| R-04 | P1 | Seguridad | `.env` en historial git; remoto GitHub | Fuga de claves si el repo es público | Media | Verificar visibilidad, rotar, purgar historial, confirmar RLS | Medio | Dev/Sec |
| R-05 | P1 | Datos | 5 generadores con Math.random() sobrescriben posts.json | Regenerar destruye ediciones manuales | Alta | Un solo generador determinista + preservar IDs/estado | Alto | Dev |
| R-06 | P1 | Datos | masterCalendar.ts (2.66MB) huérfano vs posts.json | Divergencia de "verdad" | Media | Elegir una fuente y derivar la otra | Medio | Dev |
| R-07 | P1 | Rendimiento/Seg | Bundle 2.68MB con estrategia embebida y pública | Fuga de estrategia + carga innecesaria | Media | Servir datos por fetch/backend | Medio | Dev |
| R-08 | P2 | Contenido | 43/45 copys idénticos entre redes | Percepción de spam, penalización algorítmica | Alta | Adaptar copy por plataforma | Medio | Contenido |
| R-09 | P2 | Visual | Tecnicismo de cine forzado (ARRI 283/325) | Biblioteca homogénea y "de stock" | Alta | Limpiar prompts; variar dirección de arte | Medio | Diseño |
| R-10 | P2 | Producto | Prompts muestran "app" (contradice escaparate web) | Comunica el producto equivocado | Media | Corregir referencia a "app" | Bajo | Producto |
| R-11 | P2 | UX | LinkedIn/YouTube sin pantalla (39 posts) | Contenido inaccesible/no gestionable | Media | Añadir rutas o retirar esas redes | Bajo | Dev |
| R-12 | P2 | Datos | 12 campos de schema al 0% (funnel/objective/alt…) | Sin embudo/medición/accesibilidad | Alta | Ampliar schema y poblar | Medio | Contenido |
| R-13 | P2 | Ops | 4 nombres para el mismo proyecto | Confusión de deploy/docs | Baja | Unificar naming | Bajo | Owner |
| R-14 | P3 | VCS | Trabajo en rama "respaldo", casi todo sin commitear | Pérdida por checkout accidental | Media | Commit + rama de trabajo clara | Bajo | Dev |
| R-15 | P3 | Build | Tailwind content vacío | CSS incompleto | Baja | Configurar content | Bajo | Dev |
| R-16 | P3 | Assets | Oficiales conviven con legacy/descartados | Uso de asset descartado | Media | Aislar aprobados | Bajo | Diseño |
| R-17 | P3 | A11y | 0 ALT en 325 piezas | Inaccesible; SEO social pobre | Alta | Generar ALT por pieza | Medio | Contenido |
