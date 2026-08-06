# ESTADO ACTUAL — STREETBOSS

> Última actualización: 2026-08-06
> Actualizado por: Antigravity (Google DeepMind)

## Estado General

**Estado: 🟢 CRM HQ, DASHBOARD B2B Y MÉTODOS DE PAGO TOTALMENTE OPERATIVOS Y DESPLEGADOS EN PRODUCCIÓN**

Se han completado y desplegado a producción en **https://streetboss.com.mx** las mejoras prioritarias del CRM interno, Dashboard B2B, Checkout B2C y Seguridad:

1. **Métodos de Pago B2B y B2C**:
   - Persistencia aislada por restaurante en `payment_methods` (Efectivo, Transferencia, Tarjeta).
   - **Efectivo**: Restricción de límite de cambio máximo en reparto a domicilio (`pagaraCon - total > max_cambio_monto`) con alerta de seguridad personalizada.
   - **Transferencia**: Muestra Banco, Titular, CLABE, Número de Cuenta con botones **"Copiar CLABE"** y **"Copiar cuenta"** con toast de confirmación visual.
   - **Tarjeta**: Adaptada para delivery ("Pago con tarjeta al recibir. El restaurante llevará la terminal.") y pickup ("Pago con tarjeta al recoger en el establecimiento."). Cero datos sensibles solicitados o almacenados.

2. **Acceso Protegido por Contraseña al Dashboard B2B (`/panel/:slug`)**:
   - Pantalla de inicio de sesión B2B mobile-first con conmutador de visibilidad de contraseña.
   - Restricción de acceso sin sesión previa y botón **"Salir"** (Cerrar Sesión) en el header superior.
   - Suplantación administrativa auditada habilitada desde `/central-hq`.

3. **Formato Estricto "COMPARTIR ACCESO"**:
   - Mensaje de WhatsApp generado con el formato exacto de Menú, Dashboard y Contraseña Temporal en `ClientesTab.jsx`.

4. **Assets de Portada y Perfil para las 10 Demos Oficiales**:
   - Generación de imágenes gastronómicas de alta calidad en 16:9 y avatares de perfil en `/public/demos/[demo-id]/`.
   - Referencias actualizadas en `demoShowcase.js` y `crmV3Service.js`.

5. **Eliminación Absoluta del Número `9612466204`**:
   - 0 ocurrencias activas en código o vistas. Reemplazado por `DEMO_CONTACTS` (`529610000000`).

6. **Despliegue a Producción Vercel**:
   - Live en **https://streetboss.com.mx** (Deployment ID: `dpl_BrJwtCHfcVSSqy4azvZvpWagTHUC`, Commit Git: `fb7ff6643183e6ee4c90b0e52058353a8b9c3b40`).

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
