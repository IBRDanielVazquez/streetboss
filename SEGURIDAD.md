# SEGURIDAD — StreetBoss
## Auditoría 2026-11-26 — ABIERTA / NO APROBADA
Base de producción Vercel: 39e003c86686316415dc1c8f6ff535ba67e4a7ac. Proyecto Supabase exclusivo: uszhdesbewkjvphipudw.
P0: ClientDashboard confía en URL/sessionStorage; crmV3Service maneja temp_password en cliente; RLS de negocios, clientes, pedidos, categorías, productos y zonas confía en cabecera comercial no autenticada; analítica permite lectura por cabecera; HQ prospect states permite SELECT/INSERT/UPDATE anónimos; grants TRUNCATE a roles de API en varias tablas. No se consultaron registros personales ni se probó modificación de producción.
P1: has_write_access no distingue cocina/mesero de dueño/gerente; vista sb_menu_publico con privilegios del propietario; funciones privilegiadas expuestas, search_path mutable y protección de contraseñas filtradas desactivada. El RPC público de catálogo puede ser legítimo, revisar proyección antes de revocar. RLS sin políticas de invites/requests de La Vitola es compatible con acceso exclusivo backend.
Riesgo histórico: .env en commit b1576c1 según RIESGOS.md; no se leyeron secretos. PR #1 de La Vitola abierto; coordinar antes de modificar portal.
## Regla obligatoria
Ningún restaurante, funcionalidad, dashboard o aplicación podrá publicarse si existen vulnerabilidades críticas o altas sin resolver que afecten su seguridad. Aplicable a Antigravity, Codex, Claude y cualquier agente. No declarar aprobación sin evidencias.
## Arquitectura objetivo (pendiente de implementar)
- Supabase Auth como identidad; alias comercial resuelto exclusivamente en servidor hacia identidad administrada bajo dominio controlado, sin correos de terceros. Invitaciones opacas con hash, expiración y consumo atómico; recuperación autorizada; límites distribuidos y errores genéricos. No persistir contraseñas. MFA AAL2 para Central.
- Membresías por auth.uid(), restaurante y sucursal con matriz de permisos; no confiar en slug, headers ni metadata editable. RLS USING/WITH CHECK y grants mínimos; revocar TRUNCATE a roles cliente. Separar proyección pública del catálogo y escritura privada. Validar sesión vigente y membresía en cada operación sensible.
- Pedidos públicos mediante endpoint restringido, recálculo de precio, límites y consentimiento separado; solicitudes no son ventas. Storage privado por tenant, imágenes públicas exclusivamente publicadas y validadas. Auditoría append-only desde backend.
- PWA admin sin caché de datos privados; manifests separados; logout revoca sesiones y purga almacenamiento privado. No modificar La Vitola ni su catálogo hasta verificar compatibilidad.
## Puertas de liberación
Respaldo y restauración verificados; staging aislado con dos tenants sintéticos; pruebas de acceso legítimo, contraseña incorrecta, URL/almacenamiento/ID manipulados, lectura/escritura cruzada, roles, sesión expirada/revocada, reutilización de invitaciones, Storage, precios, PWA y build; advisors revisados; revisión PR y rollback. No publicar si falta evidencia.
## Estado
Diagnóstico estático y catálogos PostgreSQL consultados. Sin remediación desplegada. No se ejecutaron pruebas dinámicas de explotación ni se modificaron datos reales.