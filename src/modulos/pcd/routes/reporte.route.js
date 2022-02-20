
module.exports = (app) => {
 // app.api.post('/centralizador/:id_municipio/reporte/:id_gestion', app.controller.reporte.generarReporte);

  /**
   * @api {post} /api/v1/centralizador/reporte/:id Reporte mensual
   * @apiName Reporte mensual
   * @apiGroup REPORTES
   * @apiVersion  1.0.0
   * @apiDescription Obtiene reporte mensual
   *
   * @apiParam (Param) {Numerico} id Identificador registro
   *
   * @apiSuccess {Buffer} buffer Buffer de archivo pdf
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   * FHYyvhhyfhjJHFJKHGGKJHJjjgjgj/hgfghhhjj...
   */
  app.api.post('/centralizador/reporte/:id_reporte_mensual', app.controller.reporte.obtenerReporte);

  /**
   * @api {post} /api/v1/centralizador/reporte/:id Reporte anual
   * @apiName Reporte anual
   * @apiGroup REPORTES
   * @apiVersion  1.0.0
   * @apiDescription Obtiene reporte anual
   *
   * @apiParam (Param) {Numerico} id Identificador registro
   *
   * @apiSuccess {Buffer} buffer Buffer de archivo pdf
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   * FHYyvhhyfhjJHFJKHGGKJHJjjgjgj/hgfghhhjj...
   */
  app.api.post('/centralizador/reporte_anual/:id_reporte_anual', app.controller.reporte.obtenerReporteAnual);
  app.api.post('/centralizador/reporte_regularizado/:id_reporte_mensual', app.controller.reporte.obtenerReporteRegularizado);

  /**
   * @api {post} /api/v1/centralizador/reporte/:id Reporte acumulado
   * @apiName Reporte acumulado
   * @apiGroup REPORTES
   * @apiVersion  1.0.0
   * @apiDescription Obtiene reporte acumulado
   *
   * @apiParam (Param) {Numerico} id Identificador registro
   *
   * @apiSuccess {Buffer} buffer Buffer de archivo pdf
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   * FHYyvhhyfhjJHFJKHGGKJHJjjgjgj/hgfghhhjj...
   */
  app.api.post('/centralizador/reporte_acumulado/:id', app.controller.reporte.obtenerReporteAcumulado);
};
