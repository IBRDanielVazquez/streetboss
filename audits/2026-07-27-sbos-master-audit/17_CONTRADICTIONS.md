# 17 — Contradicciones

| # | Contradicción | Evidencia |
|---|---|---|
| C1 | **"325 únicos" vs. realidad.** El sistema presenta 325 copys/prompts/negative prompts/91 movimientos únicos; realmente son 45/62/1/1. | [data/content-analysis.json](data/content-analysis.json) |
| C2 | **"app activa" vs. "escaparate web".** El motionPrompt y varios imagePrompt muestran una app en el teléfono, mientras el producto es un escaparate web enlazable y el negative prompt prohíbe "invented app / fake interface". | motionPrompt + NEGATIVE_PROMPT |
| C3 | **Doble fuente de calendario.** `masterCalendar.ts` (2.66 MB) vs. `posts.json` (2.66 MB): coexisten dos "verdades" pero solo `posts.json` alimenta la app. | imports en `src` |
| C4 | **Dos negative prompts distintos** en el repo (uno EN de 60+ términos en `generateData.cjs`, uno ES de 131 chars en `generateCalendar.cjs`); solo uno llega a producción. "Único negative prompt" ≠ "hay un solo negative prompt en el sistema". | generadores |
| C5 | **Nombre del proyecto.** "Brand Operating System" (brief) = carpeta `brand-operating-system` = app `streetboss-brand-os` = deploy `streetboss-social-command-center`. Cuatro nombres. | `.vercel/project.json`, `package.json` |
| C6 | **"Brand Operating System" sin OS documental.** El nombre implica un sistema documentado (10 libros), pero ninguno de esos documentos existe. | `find` de `01_MASTER_BOOK.md`… |
| C7 | **5 generadores, un objetivo.** 4 `.cjs` + 1 `.py` generan contenido con lógicas distintas hacia destinos solapados; el "avanzado" produce prompts ricos que **no** se usan. | generadores + imports |
| C8 | **Rama "respaldo" como rama de trabajo.** Se trabaja sobre `respaldo/pre-edicion-sitio-...`, no sobre una rama principal; casi todo sin commitear. | `git status` |
| C9 | **UI cubre 5 redes, datos cubren 6.** LinkedIn y YouTube tienen posts pero no pantalla. | nav del dashboard |
| C10 | **Tecnicismo de cine en foto fija.** Prompts citan cámaras de video (ARRI/Alexa 65) y un cinematógrafo (Deakins) para imágenes estáticas. | imagePrompt |
