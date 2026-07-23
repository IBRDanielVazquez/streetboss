# STREET BOSS - MASTER KNOWLEDGE BASE (00-START-HERE.md)

Este es el documento maestro permanente y memoria oficial del proyecto **Street Boss**. Todo agente de IA (sin importar el modelo) debe leer este archivo obligatoriamente antes de comenzar cualquier sesión de trabajo, ya que contiene el contexto absoluto y actualizado del ecosistema. A partir de aquí, puedes continuar el desarrollo y las operaciones estratégicas sin importar si el chat o la sesión es nueva.

---

## 1. Qué es Street Boss
Street Boss es un ecosistema tecnológico integral diseñado específicamente para revolucionar la operación, administración y ventas en la industria gastronómica (restaurantes, food trucks, dark kitchens, pizzerías, etc.). Es un SaaS (Software as a Service) que combina un sistema de Punto de Venta (POS) ultrarrápido, menús digitales interactivos, gestión de inventarios y herramientas avanzadas de marketing, todo respaldado por una marca moderna, audaz y sumamente atractiva visualmente.

## 2. Objetivo del Producto
El objetivo primordial de Street Boss es empoderar a los dueños de negocios gastronómicos brindándoles tecnología de grado Enterprise a un costo accesible, con una interfaz que requiera cero curva de aprendizaje. Buscamos dominar el mercado hispanohablante eliminando la fricción tecnológica y proporcionando un ecosistema que no solo administre el negocio operativamente, sino que incremente activamente las ventas mediante módulos de fidelización, métricas en tiempo real y marketing orgánico.

## 3. Estado Actual del Proyecto
El proyecto se encuentra en una etapa de definición de arquitectura sólida y formalización del ecosistema corporativo. El núcleo de software ya cuenta con un desarrollo activo (React, Vite, Supabase), mientras que el Centro Creativo (Studio) acaba de ser oficializado estructuralmente para convertirse en el repositorio permanente de branding, contenido digital, procesos y estrategia comercial a escala.

## 4. Arquitectura del Ecosistema
El ecosistema Street Boss está estrictamente dividido en dos pilares paralelos, independientes pero sinérgicos. No existe conflicto entre ellos; cada uno cumple un propósito distinto sin mezclar responsabilidades:
- **Núcleo Tecnológico (Software):** Desarrollo de la plataforma SaaS, backend, frontend y bases de datos.
- **Centro Creativo (Studio):** Identidad de marca, marketing, multimedia corporativa, RRSS y estrategia de crecimiento.

## 5. Ruta Oficial del Software
`/Users/danielvazquez/.gemini/antigravity/scratch/Mis_Proyectos/super-agente-ibr/streetboss`
Este proyecto contiene **exclusivamente**: React, Vite, Supabase, Landing Pages interactivas, Demos, Código fuente, control de versiones Git, configuraciones de Vercel/Deploy, SQL, scripts de build y los assets utilizados dinámicamente por la aplicación web.

## 6. Ruta Oficial del Studio
`/Users/danielvazquez/.gemini/antigravity/scratch/Mis_Proyectos/super-agente-ibr/streetboss-studio`
Este proyecto contiene **exclusivamente**: Branding corporativo, manuales de marca, logos, paletas de colores, tipografías, recursos gráficos generales, redes sociales, calendarios editoriales, SEO, Google Business, presentaciones B2B, biblioteca multimedia (videos/imágenes), estrategias de campañas y prompts optimizados para IA. (Cero código).

## 7. Cómo Trabajan Juntos
Ambos proyectos funcionan como un engranaje perfecto de producto y distribución:
- El **Studio** investiga el mercado, diseña la identidad (guías UI/UX base), atrae tráfico masivo mediante campañas SEO/RRSS y genera documentación comercial y validación social.
- El **Software** recibe ese tráfico calificado a través de la Landing Page, lo convierte sin fricción, y proporciona la infraestructura funcional y operativa del SaaS, garantizando retención.
*Regla de Oro:* El Studio NO programa aplicaciones, y el Software NO ensucia su repositorio con borradores de diseño o marketing. Se retroalimentan.

## 8. Estructura de Carpetas (streetboss-studio)
El Studio está organizado de manera modular para escalar como agencia interna:
* `biblioteca/`: Recursos creativos genéricos, archivos fuente.
* `branding/`: Custodia de logotipos, colores (HEX) y lineamientos visuales.
* `calendario/`: Cronogramas, fechas de publicación y entregables.
* `campañas/`: Briefs, Ads, ROAS, presupuestos de marketing de pago.
* `facebook/`, `instagram/`, `tiktok/`, `youtube/`, `pinterest/`: Bunkers tácticos específicos por red social.
* `google-business/`: Optimización SEO local y validación social.
* `imagenes/`, `videos/`: Banco multimedia curado, fotografía oficial y B-Roll.
* `presentaciones/`: Pitch decks corporativos, slides para ventas B2B.
* `prompts/`: Librería de System Prompts para estandarizar respuestas de IA.
* `rrss/`: Estrategia global, tono de voz multiplataforma.
* `seo/`: Keywords maestras, auditorías y guías de redacción orgánica.
* `manuales/`: SOPs (Standard Operating Procedures), reglas operativas.

## 9. Reglas del Proyecto
1. **Aislamiento Total:** Nunca, bajo ninguna circunstancia, se deben combinar archivos de `streetboss` y `streetboss-studio`.
2. **Registro Obligatorio:** Cada decisión estratégica, de producto o marketing debe documentarse en su README o documento pertinente antes de ejecutarse.
3. **Fidelidad de Marca:** Ningún diseño o copy publicitario se aprueba si transgrede las reglas estipuladas en la carpeta `/branding`.
4. **Independencia Operativa:** Las iteraciones de marketing no deben bloquear los commits de código, y los bugs de código no deben paralizar el calendario de redes sociales.

## 10. Qué Nunca Debe Hacer una IA
- **NUNCA** alterar, mover o eliminar código en la ruta del software (`streetboss`) mientras su rol asignado en la sesión sea el de creatividad/marketing en el Studio.
- **NUNCA** inicializar un repositorio Git, instalar dependencias de NPM, crear un `package.json` ni inicializar bases de datos dentro de `streetboss-studio`.
- **NUNCA** fusionar carpetas o intentar migrar assets de marketing al repositorio de software a menos que se soliciten explícitamente para el Frontend de producción.
- **NUNCA** asumir o inventar reglas de negocio o colores corporativos que no estén expresamente documentados; siempre debe consultar los archivos base.
- **NUNCA** resumir este documento ni crear versiones acortadas del contexto; la IA debe operar siempre con la visión completa.
- **NUNCA** proponer crear un "StreetBoss V2" o subproyectos innecesarios.

## 11. Metodología de Trabajo
El equipo opera mediante un flujo asíncrono e iterativo impulsado por IA. La autoridad, roles, coordinación, entregables y flujo obligatorio viven en `TEAM.md`.

Cada IA debe leer únicamente su propio archivo específico, salvo que una tarea solicite expresamente consultar otro:
- **Claude/Fable 5 →** `CLAUDE.md`
- **Codex →** `CODEX.md`
- **Antigravity →** `ANTIGRAVITY.md`
- **ChatGPT →** `CHATGPT.md`
- **NotebookLM →** `NOTEBOOKLM.md`

## 12. Convenciones de Nombres
- **Carpetas del Studio:** Minúsculas y separadas por guiones (kebab-case). Ej: `google-business`.
- **Archivos de Documentación Macro:** Siempre en mayúsculas. Ej: `INDEX.md`, `CLAUDE.md`, `README.md`.
- **Archivos Multimedia/Recursos:** Formato descriptivo en snake_case con información técnica si aplica. Ej: `logo_streetboss_oscuro_1080.png`.
- **Software:** Apegarse estrictamente a los estándares de React (PascalCase para componentes, camelCase para hooks y utilidades).

## 13. Roadmap General
1. **Fase 1 (Completada):** Separación oficial de repositorios y estructuración documental en el sistema de archivos local.
2. **Fase 2 (Actual):** Definición profunda de la identidad visual fundacional, manual de marca corporativo y directrices de diseño en `/branding`.
3. **Fase 3:** Parametrización inicial de SEO, creación de la biblioteca de prompts estandarizados, e inicio del flujo orgánico de RRSS.
4. **Fase 4:** Escalamiento de las funciones Enterprise del software y validaciones de UX para la Beta Privada.
5. **Fase 5:** Product-Market Fit validado. Despliegue de campañas publicitarias estructuradas y Go-To-Market masivo.

## 14. Estado de Branding
**[FASE 1: INICIALIZADO]** La infraestructura y reglamentación de la carpeta `/branding` están creadas. Tarea pendiente e inmediata: Generar la paleta de colores HEX definitiva, la selección tipográfica oficial y almacenar los vectores base del logotipo.

## 15. Estado del Software
**[FASE 3: EN DESARROLLO ACTIVO]** El repositorio principal (`streetboss/`) contiene código funcional de frontend y backend, conexión estable a Supabase y control de versiones activo en Git. Continúa la iteración de features como POS, menús digitales y paneles de control.

## 16. Estado del Marketing
**[FASE 1: INICIALIZADO]** El entorno estructural para absorber métricas y campañas está listo (`/campañas`, `/presentaciones`). No se ha iniciado pauta paga ni diseño de artes finales. 

## 17. Estado de RRSS
**[FASE 1: INICIALIZADO]** Existen silos tácticos para todas las plataformas sociales. Se debe proceder a diseñar las primeras parrillas de contenido base (Grid de Instagram, conceptos para TikToks) apoyándose en la carpeta `/calendario`.

## 18. Estado de SEO
**[FASE 1: INICIALIZADO]** La carpeta organizativa existe. Próximo paso: Correr un análisis de Keywords de volumen alto/competencia media ("software para restaurantes", "POS para food trucks") y documentarlo en `/seo/README.md` o documentos anexos.

## 19. Próximas Prioridades Clave
1. Desarrollar y fijar la **Identidad Visual Corporativa** completa en `/branding`.
2. Crear un **System Prompt unificado de Voz y Tono** en `/prompts` para unificar el output narrativo de todas las IAs operando en Street Boss.
3. Consolidar el **Core de Keywords** para alimentar los textos del ecosistema completo.
4. Diseñar las **Plantillas Base (Templates)** para historias y posts que aseguren consistencia de marca.

## 20. Cómo debe comenzar CUALQUIER nueva sesión de trabajo
Para garantizar que nunca se pierda contexto, el inicio estándar de cualquier AI es:
1. **Leer este documento (`00-START-HERE.md`)** de principio a fin, sin resúmenes.
2. **Leer `TEAM.md`** para confirmar autoridad, rol, flujo operativo y entregables.
3. **Leer el archivo específico de la IA asignada**, según corresponda:
   - Claude/Fable 5 → `CLAUDE.md`
   - Codex → `CODEX.md`
   - Antigravity → `ANTIGRAVITY.md`
   - ChatGPT → `CHATGPT.md`
   - NotebookLM → `NOTEBOOKLM.md`
4. **Leer `INDEX.md`** para confirmar estructura y reglas generales del ecosistema.
5. **Verificar el `pwd`** (directorio de trabajo actual) para entender si la sesión opera en `streetboss/` o en `streetboss-studio/`.
6. Revisar el `README.md` de la carpeta táctica donde se realizará la tarea, si existe.
7. Auditar el estado actual antes de modificar archivos.
8. Ejecutar únicamente la tarea autorizada.
9. Validar el resultado.
10. Reportar archivos, pruebas o validaciones, riesgos y siguiente acción.
