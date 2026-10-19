# Integración de estadísticas, permisos y descargas · GIS STGO

Se crearon cuatro hojas Google Sheets independientes con pestañas SOLICITUDES, USUARIOS_AUTORIZADOS, REGISTRO_DESCARGAS y ESTADISTICAS; el Visor Territorial conserva su planilla y automatización.

## Estado real

- Google Sheets: creadas y vinculadas desde Control administrador.
- Registro automático desde los cuatro visores: **NO ACTIVADO**.
- Código base: `receptor-estadisticas.gs`; contiene identificadores de hojas, validación de visores y verificación de estructura, pero rechaza solicitudes hasta existir autenticación real.
- No deben agregarse claves de administrador ni tokens de autorización al repositorio público, al JSON, ni al navegador.
- La clave visual del panel de GIS STGO no controla los permisos de Google Sheets.

## Para activarlo

1. Crear un proyecto Apps Script bajo la cuenta municipal autorizada y configurar su ejecución segura (o utilizar el servicio servidor ya empleado por Visor Territorial, si fuera posible).
2. Confirmar identidad de usuarios y permisos de descarga **en el servidor**, y definir controles contra solicitudes automáticas.
3. Implementar escrituras en las hojas SOLICITUDES, USUARIOS_AUTORIZADOS y REGISTRO_DESCARGAS, incluyendo fecha, cobertura, formato y estado.
4. Configurar la URL real del servicio en cada visor y añadir llamadas al confirmar solicitudes y descargas efectivas (no solo al hacer clic).
5. Probar con una solicitud autorizada y una denegada por visor, validando los registros y el conteo de ESTADISTICAS.

El receptor es una plantilla de integración, no un endpoint funcional: nunca debe representarse como conexión activa.
