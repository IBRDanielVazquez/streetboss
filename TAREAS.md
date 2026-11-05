# TAREAS — STREETBOSS

> Lista centralizada de tareas. Actualizar después de cada sesión de trabajo.

## Prioridad Alta

- [x] Unificar la promoción en portada, demos y prospección: $99/mes durante 3 meses y después $150/mes (2026-08-25; validado localmente, pendiente de despliegue).
- [x] Permitir marcar prospectos sin WhatsApp y excluirlos de las acciones y el filtro de WhatsApp (2026-08-25; desplegado y verificado).
- [x] Persistir centralmente el seguimiento de prospectos para que `Contactado` y los demás estados sobrevivan recargas y dispositivos (2026-08-25; desplegado y verificado).
- [x] Incorporar clasificación rápida en la ficha: Contactado, No contesta, Interesado, Demo creado, Cliente y No le interesó (2026-08-25; desplegado y verificado).
- [x] Permitir señalar que el perfil social es personal sin perder el teléfono empresarial ni el estado comercial (2026-08-25; desplegado y verificado).
- [x] Incorporar el gancho `desde $99 al mes, sin comisiones por venta` en el primer mensaje comercial (2026-08-25; desplegado y verificado).
- [x] Publicar y verificar en dos sesiones la persistencia de formas de pago.
- [/] Validar una alta de restaurante en computadora y comprobar ese mismo menú en celular.

- [ ] Auditar `~/streetboss` para confirmar estado del proyecto.
- [ ] Decidir migración del código a esta carpeta oficial.
- [ ] Consolidar documentación dispersa.
- [ ] Definir repositorio Git oficial.
- [ ] Desplegar la sincronización bidireccional y verificar que `Mis clientes` muestre la misma lista en computadora y celular.

## Prioridad Media

- [ ] Documentar arquitectura real tras auditoría.
- [ ] Mover imágenes de branding a `assets/branding/`.
- [ ] Organizar prompts existentes en `prompts/`.
- [ ] Consolidar contenido de `streetboss-studio`.

## Prioridad Baja

- [ ] Crear skills específicos del proyecto.
- [ ] Configurar CI/CD.
- [ ] Definir estrategia de backups.

## Completadas

- [x] Actualizar y publicar la landing con el alcance real de StreetBoss, mantener el video y corregir promesas comerciales inexactas (2026-08-27; producción verificada).

- [x] Implementar y publicar tutoriales globales y enlaces públicos 01–07 con una sola copia compartida en MP4 H.264/AAC (2026-08-25; desplegado y verificado).

- [x] Corregir creación de negocios cuando otro dispositivo o una cuenta eliminada ya reservó el mismo slug (2026-08-24; escritorio y móvil verificados en producción).

- [x] Crear Analítica HQ por menú con visitas, visitantes, interacciones, pedidos, conversión y fuentes (2026-08-24; Supabase y producción verificados).

- [x] Habilitar el borrado central y protegido de pedidos desde HQ y permitir incluir pedidos al eliminar una cuenta B2B (2026-08-24; desplegado y verificado sin borrar datos reales).

- [x] Habilitar y hacer visible el borrado protegido de clientes desde la Central HQ (2026-08-24; desplegado y verificado sin eliminar datos reales).

- [x] Corregir doble signo de pesos en WhatsApp y aplicar compra mínima con tarjeta en todos los checkouts (2026-08-24; desplegado y verificado).

- [x] Restaurar acceso global a paneles B2B tras detectar hook condicional en sugerencias de colonias (2026-08-24; desplegado y verificado).

- [x] Auditar y corregir globalmente agotados, métodos de pago, zonas sugeridas y Colonias top a partir de la prueba Cafecito (2026-08-24; desplegado en producción).

- [x] Preparar menú y dashboard local de Pizza Nostra con contacto de prueba, cobertura aproximada de 2 km y límite de $500 para cambio (2026-08-24; sin despliegue).

- [x] Permitir editar directamente la frase de pedidos desde la vista real de `Configurar menú` y sincronizarla entre dispositivos (2026-08-22, desplegado y verificado).

- [x] Hacer que las altas de menú se confirmen en Supabase y aparezcan en la Central desde cualquier dispositivo (2026-08-22; pendiente publicación final).

- [x] Preparar esquema operacional corregido y conectar sincronización cloud de negocio, menú y zonas (2026-08-21; pendiente activación en Supabase y despliegue).

- [x] Generar un OG distinto por demo y por negocio nuevo usando la foto de perfil del menú (2026-08-21, desplegado en producción).
- [x] Crear Springboard iOS en Dashboard y editor visual compartido del menú (2026-08-21, pendiente de revisión visual humana).
- [x] Unificar Dashboard Central HQ con el sistema visual iOS de StreetBoss, sin panel lateral ni pie técnico visibles (2026-08-21).
- [x] Separar las apps operativas del Dashboard B2B y corregir la previsualización social (2026-08-21).
- [x] Agregar rankings naturales de platillos y colonias, y retirar pies técnicos de los dashboards (2026-08-21).
- [x] Centralizar la lista de clientes B2C a partir de pedidos sincronizados con Supabase (2026-08-21, pendiente de prueba multidispositivo en producción).
- [x] Crear estructura documental oficial (2026-07-21).
- [x] Búsqueda y análisis de instancias existentes (2026-07-21).

---

> Usar `[x]` para marcar tareas completadas. Usar `[/]` para tareas en progreso.
# 2026-08-24

- [x] Corregir y auditar la creación/edición de títulos de categorías con confirmación cloud.
- [x] Corregir el guardado de productos marcados como agotados desde el editor visual.
- [x] Corregir conflicto secundario de slug en `sb_business_directory` al crear negocios.
- [x] Limpiar los dos registros temporales de las pruebas Cafecito.
- [x] Compilar y publicar la corrección en producción.

## 2026-10-30 — Oferta y configuración móvil

- [x] Actualizar oferta a $499 primer año; después $99/mes o $990/año en landings activas y prototipo.
- [x] Implementar inicio del restaurante con perfil visual y configuración por secciones.
- [x] Preparar instalación del panel para negocios activos y mantener menú público sin instalación.
- [x] Validar build, tipos, manifest, separación de superficies y UI móvil/escritorio con datos ficticios locales.
- [x] Autorizar y publicar estos cambios en producción (2026-10-30, `dpl_BhyEWcPfZadrkaPmLyp9NdTZwE5r`).
- [ ] Verificar instalación y reapertura en iPhone y Android físicos.

- [ ] Recibir ZIP de documentación y contenido de recetas generado por GPT antes de implementar la nueva sección pública.

- [x] Implementar, validar y publicar landing horizontal con navegación superior por iconos y scroll vertical convertido en avance lateral (2026-10-30, `dpl_2RjucwysR6u4KwNyTCrYCUBDeQfU`).
- [ ] Comprobar físicamente los gestos táctiles de la landing horizontal en iPhone y Android.

- [x] Publicar corrección: contenido vertical espacioso dentro de cada sección, video dimensionado para móvil y navegación lateral sólo mediante intención horizontal/iconos (2026-10-30, `dpl_3aQ1GReeebU8e8jRJ43UE6Jej3C2`).

- [x] Publicar continuidad de scroll en bordes y navegación circular entre última/primera sección, incluidas flechas e icono activo (2026-10-30, `dpl_D2zvsKewoiDvyEWFwBuTnnAkXuHj`).
