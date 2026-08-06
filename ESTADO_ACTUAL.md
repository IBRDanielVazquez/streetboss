# ESTADO ACTUAL — STREETBOSS

> Última actualización: 2026-08-06
> Actualizado por: Antigravity (Google DeepMind)

## Estado General

**Estado: 🟡 CORRECCIONES DE SEGURIDAD Y DATOS MIGRADO Y VERIFICADO EN MODO LOCAL (ESPERANDO AUTORIZACIÓN MANUAL PARA DEPLOY)**

Se han completado en código fuente local las 8 Fases del Plan de Remediación de Producción:

1. **Eliminación de Backdoor `Sb987654!`**:
   - Se eliminó la contraseña maestra global de `authenticateBusiness()`.
   - Se requiere una contraseña por restaurante configurada individualmente.
   - Función `setBusinessPassword()` valida longitud (mín. 8 caracteres) y registra auditoría.

2. **Modal de Contraseña de Una Sola Visualización**:
   - `ClientesTab.jsx` incluye un modal interactivo para generar o establecer contraseñas.
   - La contraseña generada es visible **UNA SOLA VEZ** al crearla/restablecerla.
   - Al cerrar el modal, la contraseña desaparece permanentemente de la UI.

3. **Mensaje Estricto de "Compartir Acceso"**:
   - Formato exacto reducido (Hola, Menú, Dashboard, Contraseña) sin emojis irrelevantes, planes ni datos de soporte.
   - Generación de mensaje enlazada directamente a la visualización única del modal de contraseña.

4. **Migración Automática de localStorage (`migrateExistingData`)**:
   - `migrateExistingData()` re-siembra e inyecta la nueva estructura (`banner_url`, `logo_url`, `payment_methods`, `temp_password`) en navegadores con datos preexistentes sin sobrescribir personalizaciones.

5. **Clarificación de Pestañas**:
   - Pestaña del panel B2B renombrada a `"Mis Clientes"` para eliminar ambigüedad con la pestaña `"CLIENTES"` (b2b clientes) del CRM HQ.

6. **Assets de Portada y Perfil**:
   - Fallback en `DemosTab.jsx` corregido a `/demos/${demo.slug}/cover.jpg`.

7. **Limpieza de Rutas Legacy**:
   - Eliminada la ruta `/demo/:trialId` en `App.jsx` dejando `/menu/:trialId` como la única ruta oficial del menú público.

8. **Modo Local Estricto**:
   - Todos los cambios permanecen en git local. **Sin despliegue a Vercel hasta recibir autorización manual explicita.**

---

## 1. Resumen de Cuarentena y Retiro Seguro

- **Ruta de Cuarentena:** `/Users/danielvazquez/Proyectos/_CUARENTENA_STREETBOSS/2026-07-21_1127/`
- **Carpetas en Cuarentena:**
  1. `streetboss_origen_ibr/` (Origen principal consolidado)
  2. `streetboss-studio/` (Documentación & Brand System)
  3. `streetboss_experimental_tour360/` (Tour virtual 360 & investigación mercado)
  4. `streetboss-web/` (Scripts de utilidad)
  5. `streetboss_ARCHIVED_DO_NOT_USE/` (Instancia deprecada)
  6. `Imagenes_Street_Boss/` (Capturas PNG de UI)

> 🛑 **Ningún archivo fue eliminado permanentemente.** Todos los duplicados se encuentran resguardados en cuarentena para revisión humana final.

---

## 2. Estado de la Carpeta Oficial y Build de Producción

- **Git Status:** Rama `remediacion-sbos-master-audit` activa, commit `fb7ff6643183e6ee4c90b0e52058353a8b9c3b40`.
- **Build Local (`npm run build`):** ✅ Compilación exitosa en 6.07s procesando 1,644 módulos.
- **Despliegue Vercel:** ✅ Producción activa aliased a `https://streetboss.com.mx`.
