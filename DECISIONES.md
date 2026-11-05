# REGISTRO DE DECISIONES — STREETBOSS

> Decisiones técnicas y de negocio relevantes del proyecto.

---

## DEC-001: Ruta oficial del proyecto

- **Fecha:** 2026-07-21
- **Decisión:** La ruta oficial y fuente de verdad de StreetBoss es `/Users/danielvazquez/Proyectos/StreetBoss`.
- **Estado:** Aprobada.

## DEC-002: Consolidación desde `super-agente-ibr/streetboss`

- **Fecha:** 2026-07-21
- **Decisión:** Consolidar el proyecto oficial a partir de `/Users/danielvazquez/.gemini/antigravity/scratch/Mis_Proyectos/super-agente-ibr/streetboss`.
- **Estado:** Aprobada y Ejecutada.

## DEC-003: Rescate Completo de Recursos Únicos antes de Cuarentena

- **Fecha:** 2026-07-21
- **Decisión:** Copiar todo archivo único (Master Book, Roadmap, Prompts Maestros, Scripts JS, Módulo 360°, Investigación Chiapas y Capturas PNG) a la carpeta oficial antes de mover las carpetas a cuarentena.
- **Estado:** Aprobada y Ejecutada.

## DEC-004: Retiro a Cuarentena sin Eliminación Permanente

- **Fecha:** 2026-07-21
- **Decisión:** Mover las 6 carpetas secundarias/duplicadas a `/Users/danielvazquez/Proyectos/_CUARENTENA_STREETBOSS/2026-07-21_1127/` sin ejecutar `rm -rf` ni borrar permanentemente ningún elemento hasta contar con la segunda autorización explícita del usuario.
- **Estado:** Aprobada y Ejecutada.

## DEC-005: Menú público compartido con modo de edición visual

- **Fecha:** 2026-08-21
- **Decisión:** Reutilizar los componentes del menú público dentro del Dashboard mediante un `editMode`, manteniendo los datos del restaurante como única fuente de verdad y ocultando los controles administrativos en la experiencia del consumidor.
- **Motivo:** Evitar dos menús independientes y permitir que el restaurante edite viendo el resultado real en una interfaz mobile-first tipo iOS.
- **Estado:** Implementada localmente; pendiente de revisión visual y autorización de despliegue.

## DEC-006: Hub Central basado en aplicaciones, sin panel lateral visible

- **Fecha:** 2026-08-21
- **Decisión:** Mantener las seis apps del Hub Central como elemento principal y utilizar una barra superior compacta más un dock tipo iOS para la navegación.
- **Motivo:** Reducir ruido visual, evitar la apariencia de dashboard tradicional y priorizar acciones directas y reconocibles.
- **Estado:** Implementada localmente; pendiente de despliegue de esta revisión.

## DEC-007: Rankings operativos como apps independientes

- **Fecha:** 2026-08-21
- **Decisión:** Presentar platillos más pedidos y colonias con mayor demanda en dos pantallas independientes, accesibles después de Clientes y calculadas con pedidos reales no cancelados.
- **Motivo:** Mantener una experiencia sencilla, familiar y sin sobrecargar la pantalla principal.
- **Estado:** Implementada y desplegada en producción.

## DEC-008: Pedidos centrales como fuente de verdad de clientes

- **Fecha:** 2026-08-21
- **Decisión:** Reconstruir el directorio B2C del restaurante desde los pedidos sincronizados con Supabase y reemplazar los registros locales correspondientes al abrir el dashboard.
- **Motivo:** Evitar que cada navegador mantenga una lista de clientes distinta y garantizar el mismo resultado en computadora y celular sin modificar esquema, RLS ni autenticación.
- **Estado:** Implementada y desplegada; pendiente de verificación multidispositivo con datos reales.

## DEC-009: Recuperación explícita del dashboard en móviles

- **Fecha:** 2026-08-21
- **Decisión:** Todas las lecturas B2B de Supabase deben usar el cliente contextualizado por slug, y el dashboard debe volver a descargar datos al regresar de segundo plano, recuperar conexión o reabrirse desde la caché de navegación móvil.
- **Motivo:** Safari y navegadores móviles suspenden conexiones en tiempo real; además, las políticas multi-tenant requieren identificar el restaurante en cada consulta.
- **Estado:** Implementada y desplegada, incluida la estabilización de conexión única.

## DEC-010: Perfil individual en OG y nube prioritaria

- **Fecha:** 2026-08-21
- **Decisión:** La vista social de cada menú debe generarse en el servidor con su foto de perfil y descripción; al abrir un negocio, Supabase tiene prioridad y la copia del navegador funciona solo como respaldo.
- **Motivo:** Los robots de WhatsApp y redes sociales no esperan los cambios de React, y una copia local antigua no debe ocultar actualizaciones hechas desde otro dispositivo.
- **Estado:** Implementada, validada localmente y desplegada en producción.

## DEC-011: Sincronización bidireccional del directorio de clientes

- **Fecha:** 2026-08-21
- **Decisión:** `sb_business_customers` se descarga y se combina con los registros locales antes de volver a subir una lista unificada, usando `customer_id` como conflicto.
- **Motivo:** Preservar clientes históricos que solo existían en un dispositivo y hacer converger escritorio y móvil sin borrar información.
- **Estado:** Sincronización y estabilización desplegadas; consola de producción limpia. Pendiente únicamente comparar la lista del mismo negocio en los dos dispositivos.

---

> Registrar aquí toda decisión técnica o de negocio que impacte el proyecto.

## DEC-012: Una sola fuente para las altas de menú

- **Fecha:** 2026-08-22
- **Decisión:** Supabase confirma el negocio y su catálogo antes de declarar exitosa un alta; el almacenamiento local queda sólo como copia de trabajo.
- **Motivo:** Evitar negocios visibles únicamente en el dispositivo que inició el alta.
- **Estado:** Implementada y validada localmente; pendiente despliegue del frontend.
# 2026-08-21 — Mantener Supabase para la corrección urgente

- Se conserva `streetboss-pos` como fuente central para resolver la sincronización dentro de la ventana de una hora.
- Una posible migración a Hostinger se evaluará después de estabilizar y respaldar el producto; no se mezclará con esta reparación urgente.

## DEC-013: Analítica propia anónima y no bloqueante

- **Fecha:** 2026-08-24
- **Decisión:** Registrar en Supabase eventos mínimos por menú y calcular la analítica operativa dentro de HQ, sin datos personales ni scripts publicitarios.
- **Motivo:** Comparar visitas, interacción y pedidos por restaurante sin afectar la velocidad ni depender de GA4 para métricas internas.
- **Estado:** Implementada, verificada y desplegada.

## DEC-014: Tutoriales como biblioteca global inmutable

- **Fecha:** 2026-08-25
- **Decisión:** Los tutoriales se definen una sola vez y se sirven desde recursos públicos globales; ningún archivo o registro depende de restaurante, usuario, tenant o slug.
- **Motivo:** Garantizar una única fuente de verdad, enlaces estables y crecimiento por simple adición de archivo y metadato.
- **Estado:** Implementada, validada y desplegada en producción.

## DEC-015: Precio promocional y mensualidad regular

- **Fecha:** 2026-08-25
- **Decisión:** Ofrecer StreetBoss por $99 MXN al mes durante los primeros 3 meses y cobrar $150 MXN al mes a partir del cuarto mes.
- **Motivo:** Unificar la oferta comercial y eliminar precios posteriores contradictorios en la portada y la página de demos.
- **Estado:** Implementada localmente; pendiente de despliegue.

## 2026-10-30 — Nueva oferta y app del restaurante

- El primer año cuesta $499 MXN en un pago por 12 meses. Desde el segundo: $99 MXN/mes o $990 MXN/año, por instrucción explícita del propietario. Sustituye la promoción de tres meses.
- La app instalable es el panel web del restaurante en modo standalone, con identidad por slug y sin incluir credenciales en su URL. Se ofrece a negocios activos no demo después del acceso existente; no se añade verificación de cobros ni se cambia la autenticación.
- El consumidor sigue usando el menú web por enlace. La instalación no añade acceso a datos: conserva el acceso y las limitaciones del sistema existente. No se anuncia como app de tienda ni como operación sin internet.
