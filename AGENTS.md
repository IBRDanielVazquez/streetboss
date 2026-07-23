# REGLAS PARA AGENTES — STREETBOSS

Esta carpeta es la fuente de verdad oficial de StreetBoss.

---

## ANTES DE ACTUAR

1. Leer `README.md`.
2. Leer `CONTEXTO_PROYECTO.md`.
3. Leer `ESTADO_ACTUAL.md`.
4. Leer `REGLAS_NEGOCIO.md`.
5. Leer `ARQUITECTURA.md`.
6. Leer `TAREAS.md`.
7. Revisar `package.json` si existe.
8. Revisar configuración y archivos relevantes.
9. Revisar Git y cambios pendientes.
10. Analizar antes de modificar.

## RESTRICCIONES

1. No modificar `.env`.
2. No mostrar secretos, tokens o claves API.
3. No modificar autenticación sin autorización.
4. No modificar permisos o roles sin autorización.
5. No modificar Supabase, tablas, RLS o migraciones sin autorización.
6. No modificar pagos.
7. No desplegar a producción sin autorización.
8. No instalar dependencias sin justificarlo.
9. No reestructurar todo el proyecto.
10. No borrar archivos.
11. No inventar reglas de negocio.
12. No crear copias separadas para cada IA.

## CAMBIOS

1. Realizar cambios mínimos.
2. Validar antes de terminar.
3. Registrar archivos modificados.
4. Registrar comandos ejecutados.
5. Actualizar `ESTADO_ACTUAL.md`.
6. Actualizar `REGISTRO_CAMBIOS.md`.
7. Registrar decisiones relevantes.
8. Registrar riesgos nuevos.

## COORDINACIÓN

Codex, Antigravity y Claude deben trabajar sobre esta misma carpeta.
No permitir que dos agentes modifiquen simultáneamente los mismos archivos.
Cada agente debe dejar evidencia clara del estado final.

---

> Estas reglas son obligatorias. Complementan las reglas globales de `~/Proyectos/AGENTS.md`.
