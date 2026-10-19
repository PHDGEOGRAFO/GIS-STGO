/**
 * GIS STGO · Receptor de registros (Google Apps Script)
 * Implementar como proyecto autónomo en script.google.com, NO publicar secretos en GitHub.
 * Al desplegar: restringir acceso según la cuenta/organización permitida.
 * Los eventos son declaraciones del cliente; para permisos reales usar identidad verificada.
 */
const DESTINOS = {
 "geoindicadores":"171m8xhbFGEzFiicFd0f2c9xjzI3chGLpVjC0eA6N8dM",
 "stgo3d":"1ippEIXnbN0XcRk7SiuO6PIl9iBLml_Oo06OvoZIxvzc",
 "biblioteca":"1jqtQK1uBd6NDBPVD5q9O8etf601AJa92N4whNgXNxEo",
 "suelos":"1dHTC0kClbzEPIf2boD_uhgFTpYBzJMDTnZ70dk5TbRE"
};
function safeString(v, max=180) {
  const x=String(v==null?'':v).replace(/[\u0000-\u001f]/g,' ').slice(0,max);
  return /^[=+@\-\t\r]/.test(x)?("'"+x):x;
}
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error('Sin datos');
    const p=JSON.parse(e.postData.contents);
    const id=DESTINOS[p.visor];
    if (!id) throw new Error('Visor no autorizado');
    if (!['solicitud','descarga'].includes(p.tipo)) throw new Error('Tipo inválido');
    // Nota: los eventos anónimos no certifican identidad ni autorización.
    // Debe exigirse autenticación validada por servidor antes de activar el registro productivo.
    throw new Error('REQUIERE_AUTENTICACION_DE_SERVIDOR');
    // El registro real se habilitará después de validar identidad,
    // aprobaciones y control antiabuso en este servidor.
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err.message||err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
function pruebaConfiguracion() {
  Object.entries(DESTINOS).forEach(([visor,id])=>{
    const book=SpreadsheetApp.openById(id);
    ['SOLICITUDES','USUARIOS_AUTORIZADOS','REGISTRO_DESCARGAS','ESTADISTICAS'].forEach(n=>{
      if(!book.getSheetByName(n)) throw new Error(visor+': falta '+n);
    });
  });
  Logger.log('Todas las hojas configuradas');
}
