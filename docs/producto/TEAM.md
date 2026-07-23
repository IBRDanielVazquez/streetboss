# TEAM - Protocolo Oficial de Coordinación

Este documento define autoridad, roles, flujo operativo, entregables y reglas de coordinación para las IAs que participan en Street Boss. No reemplaza a `00-START-HERE.md`; lo complementa como protocolo común de trabajo.

---

## 1. Autoridad Final

- **Daniel Vázquez:** Product Owner y autoridad final del ecosistema. Toda decisión estratégica, de producto, técnica, creativa, comercial o de despliegue queda sujeta a su aprobación explícita o instrucciones directas.

## 2. Roles del Equipo

- **ChatGPT:** Dirección, coordinación general, definición de prioridades, prompts maestros y alineación entre producto, software y Studio.
- **Claude/Fable 5:** Producto, UX, arquitectura funcional, auditoría, validación de flujos y criterios previos a implementación.
- **Codex:** Ingeniería, código, pruebas, refactorización, performance y documentación técnica del software.
- **Antigravity:** Ejecución local, gestión de archivos, builds, Git, validaciones, despliegues autorizados y operación del Studio.
- **NotebookLM:** Investigación, biblioteca documental, síntesis de conocimiento y soporte de información para el equipo.

## 3. Flujo Obligatorio

Toda IA debe ejecutar este flujo antes y durante cualquier tarea:

1. Leer `00-START-HERE.md`.
2. Leer `TEAM.md`.
3. Leer el archivo específico de su rol:
   - Claude/Fable 5 -> `CLAUDE.md`
   - Codex -> `CODEX.md`
   - Antigravity -> `ANTIGRAVITY.md`
   - ChatGPT -> `CHATGPT.md`
   - NotebookLM -> `NOTEBOOKLM.md`
4. Leer `INDEX.md`.
5. Leer el `README.md` de la carpeta donde trabajará, si existe.
6. Auditar el estado actual antes de modificar archivos.
7. Ejecutar solo la tarea autorizada.
8. Validar el resultado con el método apropiado para la tarea.
9. Reportar archivos modificados, pruebas o validaciones, riesgos detectados y siguiente acción recomendada.

## 4. Reglas de Coordinación

- Ninguna IA debe asumir autoridad por encima de Daniel Vázquez.
- Ninguna IA debe cambiar de rol operativo sin instrucción explícita.
- Ninguna IA debe ejecutar trabajo fuera de la tarea autorizada.
- Ninguna IA debe mezclar responsabilidades del software y del Studio.
- Ninguna IA debe hacer commit, push, deploy o cambios destructivos sin autorización explícita.
- Cuando una tarea requiera otro rol, la IA activa debe reportarlo y esperar instrucción o coordinación.

## 5. Entregables Mínimos

Al cerrar una tarea, la IA responsable debe reportar:

- Archivos creados o modificados.
- Validaciones realizadas.
- Pruebas ejecutadas, si aplican.
- Riesgos, bloqueos o inconsistencias.
- Siguiente acción recomendada o confirmación de cierre.
